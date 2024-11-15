document.addEventListener("DOMContentLoaded", getItems);
const iconA = localStorage.getItem("favExt.iconA") || "❤️";
const iconB = localStorage.getItem("favExt.iconB") || "💔";

localStorage.setItem("favExt.iconA", iconA);
localStorage.setItem("favExt.iconB", iconB);
let Doubloons = 0;
let largest_price = 0;

function getItems() {
  console.log("getItems");
  const items = document.querySelectorAll('div[id^="item_"]');
  if (items.length === 0) {
    setTimeout(getItems, 1000);
    return;
  }
  items.forEach((item) => {
    const favouriteButton = document.createElement("button");
    favouriteButton.innerText = iconA;
    favouriteButton.className =
      "favourite-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition duration-150 active:scale-90 bg-[#9AD9EE] text-black h-10 px-4 py-2 bg-blend-color-burn";
    favouriteButton.id = item.id.replace("item_", "favourite_");
    favouriteButton.style.marginLeft = "10px";
    favouriteButton.addEventListener("click", (e) => {
      const itemId = e.currentTarget.id.replace("favourite_", "");
      toggleFavourite(itemId);
    });
    item
      .querySelector("div.flex.items-center.p-6.pt-4")
      .appendChild(favouriteButton);
  });
  addStyles();
  addProgressBar();
  setProgress(30);
    loadFavourites();
    addTimer();
  getDoublons();
}

function getDoublons() {
  document
    .querySelectorAll("div.right-px > div.flex.items-center.gap-1 > span.mr-2")
    .forEach((item) => {
      console.log(item.innerHTML);
      let val = item.innerHTML.replace(
        /<span class="sm:inline hidden"> Doubloons<\/span>/,
        ""
      );
      val = Number(val.replace(/[^\d.-]/g, "")) || 0;
      console.log(val);
      Doubloons = val;
      return val;
    });
}

function toggleFavourite(itemId) {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  console.log(itemId);

  const existingFavourite = favourites.find((fav) => fav.id === itemId);

  if (existingFavourite) {
    favourites = favourites.filter((fav) => fav.id !== itemId);
    document.getElementById("favourite_" + itemId).innerText = iconA;
    removePOI(itemId);
    if (largest_price == existingFavourite.number) {
      largest_price = 0;
      favourites.forEach((item) => {
        let price = item.number;
        if (price > largest_price) {
          largest_price = price;
        }
      });
      console.log("largest price", largest_price);
      Array.from(document.getElementsByClassName("poi")).forEach((poi) => {
        poi.remove();
      });
      favourites.forEach((item) => {
        let price = item.number;
        let percent = (price / largest_price) * 100;
        console.log("percent:", percent);
        addPOI(percent + "%", item.url, item.id, price);
      });
      setProgress((Doubloons * 100) / largest_price);
    }
  } else {
    const itemUrl = document
      .getElementById("item_" + itemId)
      .querySelector("img.w-full").src;
    const itemNumber = Number(
      document
        .getElementById("item_" + itemId)
        .querySelector(".text-green-500.font-semibold.flex.items-center")
        .innerText
    );
    document.getElementById("favourite_" + itemId).innerText = iconB;
    favourites.push({ id: itemId, url: itemUrl, number: itemNumber });
    if (itemNumber > largest_price) {
      largest_price = itemNumber;
      Array.from(document.getElementsByClassName("poi")).forEach((poi) => {
        poi.remove();
      });
      getDoublons();
      favourites.forEach((item) => {
        let price = item.number;
        let percent = (price / largest_price) * 100;
        console.log("percent:", percent);
        addPOI(percent + "%", item.url, item.id, price);
      });
      setProgress((Doubloons * 100) / largest_price);
    } else {
      let price = itemNumber;
      let percent = (price / largest_price) * 100;
      console.log("percent:", percent);
      addPOI(percent + "%", itemUrl, itemId, price);
      setProgress((Doubloons * 100) / largest_price);
    }
  }

    localStorage.setItem("favourites", JSON.stringify(favourites));
    setLeftValue();
}

function loadFavourites() {
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  let fav_items = [];
  favourites.forEach((item) => {
    fav_items.push(item);

    const btn = document.getElementById("favourite_" + item.id);
    if (btn) {
      btn.innerText = iconB;
    }
  });
  getDoublons();
  console.log(fav_items);
  fav_items.forEach((item) => {
    let price = item.number;
    if (price > largest_price) {
      largest_price = price;
    }
  });
  console.log("largest price", largest_price);

  fav_items.forEach((item) => {
    let price = item.number;
    let percent = (price / largest_price) * 100;
    console.log("percent:", percent);
    addPOI(percent + "%", item.url, item.id, price);
  });
  setProgress((Doubloons * 100) / largest_price);
}

console.log("content.js");
setTimeout(getItems, 1000);

const progressBarStyle = `
#progress-container {
    position: relative;
    width: 100%;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: visible;
}

#progress-bar {
    width: 0;
    height: 100%;
    background-color: #3b82f6;
    border-radius: 5px; /* Ensures the bar stays rounded */
    transition: width 0.3s;
}

.poi {
    position: absolute;
    top: -12px; /* Adjusted to accommodate larger size */
    width: 32px; /* Increased size */
    height: 32px; /* Increased size */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #ffffffef;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    transform: translateX(-50%);
}

.poi::after {
    content: attr(data-price);
    position: absolute;
    top: 36px; /* Adjusted to be below the icon */
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    padding: 2px 6px;
    border-radius: 3px;
    white-space: nowrap;
    font-size: 12px;
    pointer-events: none;
}

/* Specific adjustment for POIs at the 100% position */
.poi:last-child {
    transform: translateX(-80%); /* Adjust as needed for the desired placement */
}
.timer-container {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.timer-value {
    font-size: 2rem;
    font-weight: bold;
    color: #ffffff;
    padding: 0.5rem 1rem;
    background-color: #000000;
    border-radius: 0.5rem;
    position: relative;
}
.timer-value::after {
    content: "time remaining";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.5rem;
    color: #ffffff;
    margin-top: 0.25rem;
}
    
.timer-left {
    font-size: 1rem;
    font-weight: bold;
    color: #ffffff;
    padding: 0.5rem 1rem;
    background-color: #000000;
    border-radius: 0.5rem;
    position: relative;
    display: flex;
    align-items: center;
}
.timer-left::after {
    content: "till top goal";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.45rem;
    color: #ffffff;
    margin-top: 0.25rem;
}
.timer-left img {
    margin-left: 0.5rem;
}
.timer-right {
    font-size: 1rem;
    font-weight: bold;
    color: #ffffff;
    padding: 0.5rem 1rem;
    background-color: #000000;
    border-radius: 0.5rem;
    position: relative;
}
.timer-right::after {
    content: "of time";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.45rem;
    color: #ffffff;
    margin-top: 0.25rem;
}
`;

function addStyles() {
  const style = document.createElement("style");
  style.textContent = progressBarStyle;

  document.head
    ? document.head.appendChild(style)
    : document.body.appendChild(style);
}

function addProgressBar() {
  const progressContainer = document.createElement("div");
  progressContainer.id = "progress-container";

  const progressBar = document.createElement("div");
  progressBar.id = "progress-bar";

  progressContainer.appendChild(progressBar);
  const br = document.createElement("br");
  const appendTo = document.querySelector(
    "div.container.mx-auto.px-4.py-8.text-white > div.text-center.text-white"
  );
  appendTo.appendChild(br);
  appendTo.appendChild(progressContainer);
}
function addTimer() {
  // Timer for end of hackathon

  const timerContainer = document.createElement("div");
  timerContainer.className = "timer-container";

  const timerValue = document.createElement("div");
  timerValue.className = "timer-value";
  timerValue.innerText = "90:00:00";

    const timerLeft = document.createElement("div");
    timerLeft.className = "timer-left";
    timerLeft.innerText = "Time Left";

    const timerRight = document.createElement("div");
    timerRight.className = "timer-right";
    timerRight.innerText = "50%";

    timerContainer.appendChild(timerLeft);
    timerContainer.appendChild(timerValue);
    timerContainer.appendChild(timerRight);
  const appendTo = document.querySelector(
    "div.container.mx-auto.px-4.py-8.text-white > div.text-center.text-white"
  );
    
    appendTo.appendChild(timerContainer);
    setInterval(setTimerValue, 1000);
    setRightValue()
    setInterval(setRightValue, 1000 * 60 * 60);
    setLeftValue();
}

function addPOI(position, imageUrl, title = "POI", price = 0) {
  const poi = document.createElement("div");
  poi.className = "poi";
  poi.style.left = position;
  poi.style.backgroundImage = `url('${imageUrl}')`;
  poi.title = title;
  poi.id = "poi_" + title;
  let price_str = price > 950 ? (price / 1000).toFixed(1) + "k" : price;
  poi.setAttribute("data-price", price_str);

  const progressContainer = document.getElementById("progress-container");
  if (progressContainer) {
    progressContainer.appendChild(poi);
  }
}
function setTimerValue() {
  const timerValue = document.querySelector(".timer-value");
    if (timerValue) {
        const time = new Date();
        const endTime = new Date("2025-01-31T23:59:59-08:00");
        const timeLeft = endTime - time;
        let value;
        if (timeLeft > 86400000) { // More than one day
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            value = `${days}d ${hours}h`;
        } else { // Less than one day
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            value = `${hours}h ${minutes}m ${seconds}s`;
        }
    timerValue.innerText = value;
  }
}
function setRightValue() {
    const timerRight = document.querySelector(".timer-right");
    if (timerRight) {
        const time = new Date();
        const endTime = new Date("2025-01-31T23:59:59-08:00");
        const timeLeft = endTime - time;
        const totalTime = 7776000000;
        const value = `${Math.floor(100-(timeLeft / totalTime) * 100)}%`;
        timerRight.innerText = value;
    }
}
function setLeftValue() {
    const timerLeft = document.querySelector(".timer-left");
    if (timerLeft) {
        getDoublons();
        const value = largest_price - Doubloons;
        timerLeft.innerHTML = `${(value > 950 ? (value/1000).toFixed(1) +"k" : value)} <img src="doubloon.svg" alt="doubloons" class="w-4 sm:w-5 h-4 sm:h-5" style="disply: inline">`;
    }
}

function removePOI(id) {
  const progressContainer = document.getElementById("progress-container");
  if (progressContainer) {
    const poi = progressContainer.querySelector(".poi[id^='poi_" + id + "']");
    poi.remove();
  }
}

function setProgress(percent) {
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    progressBar.style.width = percent + "%";
  }
}

window.addEventListener("popstate", function (event) {
  setTimeout(getItems, 1000);
});
