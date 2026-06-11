// import functions from the other modules
import { getUserIds } from "./common.mjs";
import { calculateRevisionDate } from "./common.mjs";
import { getUpcomingAgendaItems } from "./common.mjs";
import { getData, addData } from "./storage.mjs";

// run this function when the page first loads
window.onload = function () {
  // call function to populate the dropdown with users
  populateUserDropdown();

  // add an event listener so when a user selects someone from the dropdown, something happens
  document
    .getElementById("userSelect")
    .addEventListener("change", handleUserSelection);

  // set today's date in the date input so it defaults to today
  setDefaultDate();
};

// create function to populate the dropdown with all 5 users
function populateUserDropdown() {
  // get all the user IDs
  const userIds = getUserIds();

  // find the dropdown element
  const userSelect = document.getElementById("userSelect");

  // loop through each user ID and create an option for them
  userIds.forEach((userId) => {
    // create a new option element
    const option = document.createElement("option");

    // set the value to the user ID (so I know which user was selected)
    option.value = userId;

    // set the text that users see in the dropdown
    option.textContent = `User ${userId}`;

    // add this option to the dropdown
    userSelect.appendChild(option);
  });
}

// create a function that runs when a user selects someone from the dropdown
function handleUserSelection(event) {
  // get the selected user ID from the dropdown
  const selectedUserId = event.target.value;

  // If no user is selected (empty value), hide everything
  if (!selectedUserId) {
    document.getElementById("agendaContainer").style.display = "none";
    document.getElementById("emptyStateMessage").style.display = "none";
    return;
  }

  // get all the stored data for this user
  const userAgenda = getData(selectedUserId);

  // check if the user has any agenda items
  if (!userAgenda || userAgenda.length === 0) {
    // If they have no agenda, display the empty state message
    displayEmptyState();
  } else {
    // If they have an agenda, filter and sort it using getUpcomingAgendaItems function
    const today = new Date().toISOString().split("T")[0];
    const upcomingItems = getUpcomingAgendaItems(userAgenda, today);

    // display the agenda
    displayAgenda(upcomingItems);

    // hide the empty message and show the agenda
    displayAgendaView();
  }
}

// create a function to display the agenda on the page
function displayAgenda(agendaItems) {
  // find the list where I'll add items
  const agendaList = document.getElementById("agendaList");

  // clear any previous items
  agendaList.innerHTML = "";

  // loop through each item and add it to the list
  agendaItems.forEach((item) => {
    // create a new list item element
    const listItem = document.createElement("li");

    // format the date to be more readable (e.g., "26th July 2026")
    const formattedDate = formatDate(item.revisionDate);

    // set the text to show the topic name and revision date
    listItem.textContent = `${item.topic} - ${formattedDate}`;

    // add the item to the list
    agendaList.appendChild(listItem);
  });
}

// create a helper function to format dates into a readable format
function formatDate(dateString) {
  // create a new Date object from the string
  const date = new Date(dateString);

  // use the browser's built-in date formatter to create a readable date
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// create function to handle displaying the empty state message
function displayEmptyState() {
  // hide the agenda container since there's no agenda to show
  document.getElementById("agendaContainer").style.display = "none";

  // show the empty state message to let the user know they need to add topics
  document.getElementById("emptyStateMessage").style.display = "block";
}

// create a function to display the agenda view
function displayAgendaView() {
  // hide the empty state message
  document.getElementById("emptyStateMessage").style.display = "none";

  // show the agenda container so users can see their revision schedule
  document.getElementById("agendaContainer").style.display = "block";
}

// create a function to handle when the user submits the form to add a new topic
function handleFormSubmission(event) {
  // prevent the form from refreshing the page
  event.preventDefault();

  // get the topic name the user typed in
  const topicName = document.getElementById("topicInput").value;

  // get the date the user selected
  const selectedDate = document.getElementById("dateInput").value;

  // validate that both fields have been filled in
  if (!topicName || !selectedDate) {
    // If either field is empty, show an alert and stop
    alert("Please fill in both the topic name and date");
    return;
  }

  // get the currently selected user ID from the dropdown
  const selectedUserId = document.getElementById("userSelect").value;

  // check that a user is selected
  if (!selectedUserId) {
    alert("Please select a user first");
    return;
  }

  // call calculateRevisionDate function to get all 5 revision dates
  const revisionDates = calculateRevisionDate(selectedDate);

  // create an array to store all the agenda items
  const agendaItemsToAdd = [];

  // loop through each revision date
  revisionDates.forEach((revisionDate) => {
    // convert the date to a string format YYYY-MM-DD
    const dateString = revisionDate.toISOString().split("T")[0];

    // create an agenda item with the topic name and this revision date
    const agendaItem = {
      topic: topicName,
      revisionDate: dateString,
    };

    // add the item to the array
    agendaItemsToAdd.push(agendaItem);
  });

  // store all the new agenda items for this user using the storage function
  addData(selectedUserId, agendaItemsToAdd);

  // call the function to refresh the display with the new data
  refreshUserAgenda(selectedUserId);

  // call the function to reset the form for adding more topics
  resetForm();
}

// create a function to refresh the agenda display after adding a new topic
function refreshUserAgenda(userId) {
  // get all the stored data for this user
  const userAgenda = getData(userId);

  // get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // check if the user has any agenda items
  if (!userAgenda || userAgenda.length === 0) {
    // If they have no agenda, display the empty state
    displayEmptyState();
  } else {
    // If they have agenda items, filter and sort them
    const upcomingItems = getUpcomingAgendaItems(userAgenda, today);

    // display the filtered and sorted agenda
    displayAgenda(upcomingItems);

    // show the agenda view (hide the empty message)
    displayAgendaView();
  }
}

// create a function to reset the form after the user submits it
// form stays visible on the page so users can add more topics
function resetForm() {
  // clear the topic name input field
  document.getElementById("topicInput").value = "";

  // set the date input back to today's date
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dateInput").value = today;
}

// add an event listener to the form so it calls my function when submitted
window.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("addTopicForm")
    .addEventListener("submit", handleFormSubmission);
});
