export function getUserIds() {
  return ["1", "2", "3", "4", "5"];
}

// Step 1: Create date calculation function (Rubric requires this to be in a separate function)
// Input: a date
// Output: an array of 5 dates

export function calculateRevisionDate(inputDate) {
  const oneWeekLater = new Date(inputDate);
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  const oneMonthLater = new Date(inputDate);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const threeMonthsLater = new Date(inputDate);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const sixMonthsLater = new Date(inputDate);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  const oneYearLater = new Date(inputDate);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  // Returns: [week, month, 3months, 6months, 1year]
  return [
    oneWeekLater,
    oneMonthLater,
    threeMonthsLater,
    sixMonthsLater,
    oneYearLater,
  ];
}

// Step 2:  Agenda filtering function. This will:

// Take all stored agenda items for a user
// Filter out past dates (only show future dates)
// Sort them chronologically
export function getUpcomingAgendaItems(agendaItems, currentDate) {
  // Filter out past dates
  const futureItems = agendaItems.filter((item) => {
    return item.revisionDate > currentDate;
  });
  // Sort chronologically
  const sortedItems = futureItems.sort(
    (a, b) => a.revisionDate - b.revisionDate,
  );
  // Return the result
  return sortedItems;
}
