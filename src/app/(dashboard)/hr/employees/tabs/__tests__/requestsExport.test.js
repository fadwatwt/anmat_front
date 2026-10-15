import { countRequestsByType, buildRequestsCsv } from "../requestsExport";

describe("requestsExport", () => {
    const sample = [
        { type: "DAY_OFF", employee: { name: "Sara", email: "sara@x.com" }, status: "open", reason: "Trip", created_at: "2026-01-01" },
        { type: "DAY_OFF", employee: { name: "Omar", email: "omar@x.com" }, status: "accepted", reason: "Rest", created_at: "2026-01-02" },
        { type: "SHORT_LEAVE", employee: { name: "Sara", email: "sara@x.com" }, status: "open", reason: 'Doctor "urgent", visit', created_at: "2026-01-03" },
    ];

    it("counts requests per tab type including short leave", () => {
        expect(countRequestsByType(sample)).toEqual({
            DAY_OFF: 2,
            WORK_DELAY: 0,
            SALARY_ADVANCE: 0,
            SHORT_LEAVE: 1,
        });
    });

    it("returns zeros for empty input", () => {
        expect(countRequestsByType()).toEqual({
            DAY_OFF: 0,
            WORK_DELAY: 0,
            SALARY_ADVANCE: 0,
            SHORT_LEAVE: 0,
        });
    });

    it("builds a CSV with header plus one row per request", () => {
        const csv = buildRequestsCsv(sample);
        const lines = csv.split("\n");
        expect(lines).toHaveLength(4);
        expect(lines[0]).toBe("Type,Employee,Email,Status,Reason,Created At");
        expect(lines[1]).toContain("DAY_OFF,Sara,sara@x.com,open,Trip");
    });

    it("escapes commas and quotes inside cells", () => {
        const csv = buildRequestsCsv(sample);
        expect(csv).toContain('"Doctor ""urgent"", visit"');
    });
});
