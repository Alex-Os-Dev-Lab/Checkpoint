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
  // convert the current date string to a Date object for proper comparison
  const today = new Date(currentDate);

  // Filter out past dates by comparing Date objects
  const futureItems = agendaItems.filter((item) => {
    // convert the revision date string to a Date object
    const itemDate = new Date(item.revisionDate);

    // keep the item only if it's on or after today
    return itemDate >= today;
  });

  // Sort chronologically by converting to Date objects for proper comparison
  const sortedItems = futureItems.sort((a, b) => {
    const dateA = new Date(a.revisionDate);
    const dateB = new Date(b.revisionDate);

    // subtract the dates to get the correct sort order (earliest first)
    return dateA - dateB;
  });

  // Return the filtered and sorted items
  return sortedItems;
}
