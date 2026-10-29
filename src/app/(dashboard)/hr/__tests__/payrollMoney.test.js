import { toMinorUnits } from "../payrollMoney";

describe("payroll amount conversion", () => {
  it("converts currencies with zero, two, and three minor digits exactly", () => {
    expect(toMinorUnits("125", 0)).toBe(125);
    expect(toMinorUnits("125.04", 2)).toBe(12504);
    expect(toMinorUnits("125.004", 3)).toBe(125004);
  });

  it("rejects excess precision, zero, and unsafe values", () => {
    expect(toMinorUnits("1.001", 2)).toBeNull();
    expect(toMinorUnits("0", 2)).toBeNull();
    expect(toMinorUnits("9007199254740992", 0)).toBeNull();
  });
});
