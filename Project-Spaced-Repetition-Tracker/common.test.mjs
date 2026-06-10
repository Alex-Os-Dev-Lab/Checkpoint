import { calculateRevisionDate } from "./common.mjs";
import { getUpcomingAgendaItems } from "./common.mjs";
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

test("Upcoming agenda filters and sorts correctly", () => {
  const mockAgenda = [
    { topic: "Functions in JS", revisionDate: "2026-07-20" },
    { topic: "Variables", revisionDate: "2026-06-01" },
    { topic: "Loops", revisionDate: "2026-08-15" },
  ];
  const today = "2026-07-10";

  const result = getUpcomingAgendaItems(mockAgenda, today);

  // 1. Check that result has 2 items
  assert.equal(result.length, 2);
  // 2. Check that first item is "Functions in JS"
  assert.equal(result[0].topic, "Functions in JS");
  // 3. Check that second item is "Loops"
  assert.equal(result[1].topic, "Loops");
});
