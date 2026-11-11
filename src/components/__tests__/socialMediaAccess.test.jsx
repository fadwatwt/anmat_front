import '@testing-library/jest-dom';
import { render, renderHook, screen } from '@testing-library/react';
import useSocialMediaAccess from '@/Hooks/useSocialMediaAccess';
import SocialMediaLayout from '@/app/(dashboard)/social-media/layout';
import { hasSocialMediaGrant, isSocialMediaMenuItem } from '@/functions/socialMediaAccess';

const mockDispatch = jest.fn();
let mockAuth;
let mockQuery;
const mockGetAccess = jest.fn(() => mockQuery);
jest.mock('react-redux', () => ({ useSelector: selector => selector({ auth: mockAuth }), useDispatch: () => mockDispatch }));
jest.mock('@/redux/socialMedia/socialMediaAccessApi', () => ({ useGetMySocialMediaAccessQuery: (...args) => mockGetAccess(...args) }));
jest.mock('@/components/PermissionGuard', () => ({ AccessDenied: () => <div>Access denied</div> }));

beforeEach(() => {
    jest.clearAllMocks();
    mockAuth = { user: { _id: 'subscriber-1', type: 'Subscriber' }, token: 'test-token', permissions: ['*'] };
    mockQuery = { data: { social_media_grants: [] }, isLoading: false, isError: false, isUninitialized: false };
});

it('blocks direct page access even when the subscriber has wildcard permissions', () => {
    const child = jest.fn(() => <div>Account form</div>);
    const Child = child;
    render(<SocialMediaLayout><Child /></SocialMediaLayout>);
    expect(screen.getByText('Access denied')).toBeInTheDocument();
    expect(child).not.toHaveBeenCalled();
});
it('does not mount account forms before access verification finishes', () => {
    mockQuery = { isLoading: true, isUninitialized: false };
    render(<SocialMediaLayout><div>Account form</div></SocialMediaLayout>);
    expect(screen.queryByText('Account form')).not.toBeInTheDocument();
});
it.each(['Subscriber', 'Employee'])('allows %s only while the owner grant is enabled', type => {
    mockAuth.user.type = type;
    mockQuery.data.social_media_grants = ['twitter'];
    const { result, rerender } = renderHook(() => useSocialMediaAccess());
    expect(result.current.allowed).toBe(true);
    mockQuery = { ...mockQuery, data: { social_media_grants: [] } };
    rerender();
    expect(result.current.allowed).toBe(false);
    expect(mockDispatch).toHaveBeenLastCalledWith(expect.objectContaining({ payload: [] }));
});
it('fails closed on verification errors even if old query data contains a grant', () => {
    mockQuery = { ...mockQuery, data: { social_media_grants: ['twitter'] }, isError: true };
    const { result } = renderHook(() => useSocialMediaAccess());
    expect(result.current.allowed).toBe(false);
});
it('keeps system administrators outside the subscriber feature restriction', () => {
    mockAuth.user.type = 'Admin';
    const { result } = renderHook(() => useSocialMediaAccess());
    expect(result.current.allowed).toBe(true);
    expect(mockGetAccess).toHaveBeenCalledWith('subscriber-1', expect.objectContaining({ skip: true }));
});
it.each([
    { path: '/social-media' },
    { path: '/social-media/categories' },
    { permission_any_of: ['twitter_accounts.list'] },
    { permission: 'social_media_accounts.create' },
])('applies the platform restriction to current and legacy social menu items: %j', item => {
    expect(isSocialMediaMenuItem(item)).toBe(true);
    expect(hasSocialMediaGrant('Subscriber', [])).toBe(false);
    expect(hasSocialMediaGrant('Subscriber', ['twitter'])).toBe(true);
});
it('does not classify ordinary work pages as social media', () => {
    expect(isSocialMediaMenuItem({ path: '/projects', permission: 'projects.list' })).toBe(false);
});
