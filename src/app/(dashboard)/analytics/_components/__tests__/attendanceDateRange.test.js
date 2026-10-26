import { attendanceDateRange } from '../attendanceDateRange';

describe('attendance calendar ranges', () => {
    it('includes exactly six calendar months and no future days', () => {
        expect(attendanceDateRange('6m', new Date(2026, 9, 25))).toEqual({startDate:'2026-05-01',endDate:'2026-10-25'});
    });
    it('crosses a year boundary', () => {
        expect(attendanceDateRange('3m', new Date(2026, 0, 2))).toEqual({startDate:'2025-11-01',endDate:'2026-01-02'});
    });
    it('limits one month to the current month', () => {
        expect(attendanceDateRange('1m', new Date(2026, 9, 25))).toEqual({startDate:'2026-10-01',endDate:'2026-10-25'});
    });
});
