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
    // If they have no agenda, show the empty message
    document.getElementById("emptyStateMessage").style.display = "block";
    document.getElementById("agendaContainer").style.display = "none";
  } else {
    // If they have an agenda, filter and sort it using getUpcomingAgendaItems function
    const today = new Date().toISOString().split("T")[0];
    const upcomingItems = getUpcomingAgendaItems(userAgenda, today);

    // display the agenda
    displayAgenda(upcomingItems);

    // show the agenda container and hide the empty message
    document.getElementById("agendaContainer").style.display = "block";
    document.getElementById("emptyStateMessage").style.display = "none";
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
