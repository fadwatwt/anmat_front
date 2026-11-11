export function isSocialMediaMenuItem(item) {
    if (item.path === '/social-media' || item.path?.startsWith('/social-media/')) return true;
    return [item.permission, ...(item.permission_any_of || [])].some(permission =>
        typeof permission === 'string' && (permission.startsWith('twitter_') || permission.startsWith('social_media_')),
    );
}

export function hasSocialMediaGrant(userType, grants) {
    return userType === 'Admin' || (
        ['Subscriber', 'Employee'].includes(userType) && Array.isArray(grants) && grants.includes('twitter')
    );
}
