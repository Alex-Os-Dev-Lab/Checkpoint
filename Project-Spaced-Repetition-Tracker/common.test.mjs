import { calculateRevisionDate } from "./common.mjs";
import { getUpcomingAgendaItems } from "./common.mjs";
import { getUserIds } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

// I test that calculateRevisionDate returns all 5 dates correctly for the rubric example
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

// test calculateRevisionDate handles dates across month boundaries correctly
test("Revision dates handle month boundaries correctly", () => {
  // test with a date near the end of the month (October 31st)
  const dates = calculateRevisionDate("2026-10-31");

  // verify the 1-month date handles the transition correctly
  assert.equal(
    dates[1].toISOString().split("T")[0],
    "2026-11-30", // November has 30 days, so it should be the last day
  );
});

// test that upcoming agenda filters out past dates correctly
test("Upcoming agenda filters and sorts correctly", () => {
  const mockAgenda = [
    { topic: "Functions in JS", revisionDate: "2026-07-20" },
    { topic: "Variables", revisionDate: "2026-06-01" },
    { topic: "Loops", revisionDate: "2026-08-15" },
  ];
  const today = "2026-07-10";

  const result = getUpcomingAgendaItems(mockAgenda, today);

  // verify that only 2 future items are returned (the past one is filtered out)
  assert.equal(result.length, 2);

  // verify the first item is the earliest date
  assert.equal(result[0].topic, "Functions in JS");
  assert.equal(result[0].revisionDate, "2026-07-20");

  // verify the second item is the later date
  assert.equal(result[1].topic, "Loops");
  assert.equal(result[1].revisionDate, "2026-08-15");
});

// test that upcoming agenda handles empty data correctly
test("Upcoming agenda returns empty array when all dates are in the past", () => {
  // create mock agenda items that are all in the past
  const mockAgenda = [
    { topic: "Functions in JS", revisionDate: "2026-06-01" },
    { topic: "Variables", revisionDate: "2026-05-15" },
  ];

  const today = "2026-07-10";

  const result = getUpcomingAgendaItems(mockAgenda, today);

  // verify that no items are returned since all are in the past
  assert.equal(result.length, 0);
});

// test that upcoming agenda returns all items when all are in the future
test("Upcoming agenda returns all items when all dates are in the future", () => {
  // create mock agenda items that are all in the future
  const mockAgenda = [
    { topic: "Functions in JS", revisionDate: "2026-08-20" },
    { topic: "Variables", revisionDate: "2026-09-15" },
    { topic: "Loops", revisionDate: "2026-07-25" },
  ];

  const today = "2026-07-10";

  const result = getUpcomingAgendaItems(mockAgenda, today);

  // verify that all 3 items are returned
  assert.equal(result.length, 3);

  // verify they are sorted chronologically (earliest first)
  assert.equal(result[0].revisionDate, "2026-07-25");
  assert.equal(result[1].revisionDate, "2026-08-20");
  assert.equal(result[2].revisionDate, "2026-09-15");
});
