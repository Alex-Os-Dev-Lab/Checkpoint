import { calculateRevisionDate } from "./common.mjs";
import { getUserIds } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

test("Revision dates are correct", () => {
  assert.equal(
    calculateRevisionDate("2026-07-19")[0].toISOString().split("T")[0],
    "2026-07-26",
  );
  assert.equal(
    calculateRevisionDate("2026-07-19")[1].toISOString().split("T")[0],
    "2026-08-19",
  );
  assert.equal(
    calculateRevisionDate("2026-07-19")[2].toISOString().split("T")[0],
    "2026-10-19",
  );
  assert.equal(
    calculateRevisionDate("2026-07-19")[3].toISOString().split("T")[0],
    "2027-01-19",
  );
  assert.equal(
    calculateRevisionDate("2026-07-19")[4].toISOString().split("T")[0],
    "2027-07-19",
  );
});
