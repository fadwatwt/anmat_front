import { previewPositionImport } from "../positionImport";

test("marks existing and repeated positions while preserving valid rows", () => {
  const rows = previewPositionImport(
    [{ title: "Designer", level: 2 }, { title: " designer ", level: 2 }, { title: "Manager", level: 1 }, { title: "", level: 1 }, { title: "Analyst", level: 31 }],
    [{ title: "MANAGER" }],
  );
  expect(rows.map((row) => row.status)).toEqual(["ready", "duplicate", "duplicate", "invalid", "invalid"]);
});
