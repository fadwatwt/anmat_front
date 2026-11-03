import { render, screen } from '@testing-library/react';
import PlanCard from '../PlanCard';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

describe('PlanCard price shown before checkout', () => {
    it('shows the final price and the original price when a discount applies', () => {
        render(<PlanCard name="Advanced" pricing={[{ price: 25, discount: 10, interval: 'month', is_active: true }]} />);
        expect(screen.getByText('$22.50')).toBeTruthy();
        expect(screen.getByText('$25.00')).toBeTruthy();
    });
});
