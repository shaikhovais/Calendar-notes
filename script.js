let selectedMonth = document.getElementById("month");
let selectedYear = document.getElementById("year");
let errorMsg = document.querySelector(".displayErrorMsg");
let timeContainer = document.querySelector(".time-container");
let eventsContainer = document.querySelector(".events-container");
let dates;

let currentEventDate;
const modal = document.querySelector("#modal");
const closeModal = document.querySelector(".close-btn");
let addEventBtn = document.querySelector(".add-event-btn");
let description = document.querySelector("#event-input");

// --------- Adding 'days' tag in calendar
let calendar = document.querySelector(".calendar");
const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
function addDays() {
  days.forEach((day) => {
    calendar.innerHTML += `<div class="day">${day}</div>`;
  });
}
addDays();

// --------- Adding 'option' tag in MONTH 'select' tag
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let monthSelection = document.querySelector("#month");
monthNames.forEach((monthName, index) => {
  monthSelection.innerHTML += `<option value=${
    index + 1
  }>${monthName}</option>`;
});

// ------------------------ Checking of leap year and days in feb month
const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};
const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

// ------------------------ Rendering the calendar
const renderCalendar = async (month, year) => {
  let daysOfMonth = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  calendar.innerHTML = "";
  addDays();

  let currDate = new Date();
  if (month == null) month = currDate.getMonth();
  if (year == null) year = currDate.getFullYear();

  let firstDay = new Date(year, month - 1, 1);

  for (let i = 0; i <= daysOfMonth[month - 1] + firstDay.getDay() - 1; i++) {
    let currentDay = i - firstDay.getDay() + 1;
    let div = document.createElement("div");
    div.classList.add("date");
    if (i >= firstDay.getDay()) {
      div.innerHTML += i - firstDay.getDay() + 1;
    }
    if (checkIfCurrentDay(currentDay, month, year)) {
      div.classList.add("today");
    }
    calendar.appendChild(div);
  }
  // ------------ Filling the empty extra columns in the grid
  let childrenLength = calendar.children.length;
  if (childrenLength % 7 !== 0) {
    if (childrenLength < 42) {
      for (let i = 0; i < 42 - childrenLength; i++) {
        let day = document.createElement("div");
        calendar.appendChild(day);
      }
    } else {
      for (let i = 0; i < 49 - childrenLength; i++) {
        let day = document.createElement("div");
        calendar.appendChild(day);
      }
    }
  }
  dates = [...document.querySelectorAll(".date")];
  dates = dates
    .filter((date) => date.innerHTML !== "")
    .map((date) => {
      date.addEventListener("click", newEvent);
      date.style.cursor = "pointer";
    });
};

let currDate = new Date();
let currMonth = currDate.getMonth() + 1;
let currYear = currDate.getFullYear();

// IIFE to render current month when page is loaded for the first time
(() => {
  selectedMonth.value = currMonth;
  selectedYear.value = currYear;
  renderCalendar(currMonth, currYear);
})();

// --------- Rendering calendar on changing month
selectedMonth.addEventListener("change", monthChangeHandler);
function monthChangeHandler() {
  currMonth = parseInt(selectedMonth.value);
  renderCalendar(selectedMonth.value, currYear);
}

// --------- Rendering calendar on changing year
selectedYear.addEventListener("input", yearChangeHandler);
function yearChangeHandler(e) {
  if (e === undefined) return;
  let year = e.target.value;
  if (year < 100 || year > 99999) {
    calendar.innerHTML = "";
    errorMsg.style.display = "flex";
  } else {
    errorMsg.style.display = "none";
    currYear = parseInt(year);
    renderCalendar(selectedMonth.value, currYear);
  }
}

function checkIfCurrentDay(day, month, year) {
  let today = new Date().toLocaleDateString();
  today = today.split("/");
  if (today[0] == day && today[1] == month && today[2] == year) {
    return true;
  }
  return false;
}

const renderPrevMonth = () => {
  currMonth = currMonth - 1;
  if (currMonth === 0) {
    currMonth = 12;
    currYear--;
  }
  selectedMonth.value = currMonth;
  selectedYear.value = currYear;
  renderCalendar(currMonth, currYear);
};
const renderNextMonth = () => {
  currMonth = currMonth + 1;
  if (currMonth === 13) {
    currMonth = 1;
    currYear++;
  }
  selectedMonth.value = currMonth;
  selectedYear.value = currYear;
  renderCalendar(currMonth, currYear);
};

async function fetchData() {
  let url = "https://ipinfo.io/json?token=215c373904f505";
  let response = await fetch(url);
  let data = await response.json();
  document.querySelector("#city").innerHTML = data.city;
  await fetchWeather(data.city);
}
fetchData();

async function fetchWeather(city) {
  let url = `https://api.weatherapi.com/v1/current.json?key=740c82600d574c7ba2a125309222912&q=${city}&aqi=yes`;
  let response = await fetch(url);
  let data = await response.json();
  document.querySelector(
    ".normal-temperature"
  ).innerHTML = `${data.current.temp_c}&deg`;
  document.querySelector(
    ".feels-like-temperature"
  ).innerHTML = `Feels ${data.current.feelslike_c}&deg`;
  let weatherArr = data.current.condition.icon.split("/").splice(-2);
  document.querySelector(
    "#weather"
  ).src = `./Images/weather/${weatherArr[0]}/${weatherArr[1]}`;
}

setInterval(() => {
  let currentDate = new Date();
  let hours =
    currentDate.getHours() < 10
      ? `0${currentDate.getHours()}`
      : currentDate.getHours();
  let minutes =
    currentDate.getMinutes() < 10
      ? `0${currentDate.getMinutes()}`
      : currentDate.getMinutes();
  let seconds =
    currentDate.getSeconds() < 10
      ? `0${currentDate.getSeconds()}`
      : currentDate.getSeconds();
  let time = `<div class="time">${hours}</div> : <div class="time">${minutes}</div> : <div class="time">${seconds}</div>`;
  timeContainer.innerHTML = time;
}, 1000);

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

function newEvent(e) {
  currentEventDate = e.target.innerHTML;
  modal.style.display = "grid";
  description.focus();
}

function addEvent() {
  if (description.value === "") return;
  let month = `${currentEventDate} ${monthNames[currMonth - 1].substring(
    0,
    3
  )}`;
  createSingleEvent(month, currYear, description.value);

  let events = localStorage.getItem("events");
  if (!events) {
    events = [];
  } else {
    events = JSON.parse(events);
  }

  let currEvent = {
    date: `${currentEventDate}/${currMonth}/${currYear}`,
    description: `${description.value}`,
  };
  events = [...events, currEvent];
  events = JSON.stringify(events);
  localStorage.setItem("events", events);
  description.value = "";
  modal.style.display = "none";
}

function createSingleEvent(month, year, description) {
  let newEvent = document.createElement("div");
  newEvent.classList.add("event");
  newEvent.innerHTML = `
  <div class="event-date">
    <div class="event-month">${month}</div>
    <div class="event-year">${year}</div>
  </div>
  <div class="event-description">${description}</div>
  `;
  let deleteEvent = document.createElement("div");
  deleteEvent.classList.add("delete-event");
  deleteEvent.innerHTML = '<img src="./Images/delete.png" alt="Delete event">';
  deleteEvent.addEventListener("click", () => {
    newEvent.style.display = "none";
    let events = localStorage.getItem("events");
    events = JSON.parse(events);
    console.log(description);
    events = events.filter((event) => {
      console.log(event.description, description);
      if(event.description === description) {
        return false;
      }
      return true;
    })
    console.log(events);
    events = JSON.stringify(events);
    localStorage.setItem("events", events);
  });
  newEvent.appendChild(deleteEvent);
  eventsContainer.appendChild(newEvent);
}

(() => {
  let events = localStorage.getItem("events");
  events = JSON.parse(events);
  events.map((event) => {
    let dates = event.date.split("/");
    let month = `${dates[0]} ${monthNames[currMonth - 1].substring(0, 3)}`;
    createSingleEvent(month, dates[2], event.description);
  });
})();
