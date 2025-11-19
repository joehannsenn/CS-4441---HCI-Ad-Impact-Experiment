//  Ad image set 
const adImages = [
  "ads/ad1.png","ads/ad2.png","ads/ad3.png","ads/ad4.png",
  "ads/ad5.png","ads/ad6.png","ads/ad7.png","ads/ad8.png",
  "ads/ad9.png","ads/ad10.png","ads/ad11.png","ads/ad12.png",
  "ads/ad13.png","ads/ad14.png","ads/ad15.png","ads/ad16.png",
  "ads/ad17.png","ads/ad18.png","ads/ad19.png","ads/ad20.png",
  "ads/ad21.png","ads/ad22.png","ads/ad23.png","ads/ad24.png",
  "ads/ad25.png","ads/ad26.png","ads/ad27.png","ads/ad28.png",
  "ads/ad29.png","ads/ad30.png","ads/ad31.png","ads/ad32.png"
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// DOM references
const conditionSelect = document.getElementById("condition");
const startBtn = document.getElementById("startBtn");

const leftAds = document.getElementById("left-ads");
const rightAds = document.getElementById("right-ads");
const popupAd = document.getElementById("popup-ad");
const popupImageContainer = document.getElementById("popup-image-container");
const closePopup = document.getElementById("closePopup");
const flashAd = document.getElementById("flash-ad");
const topBanner = document.getElementById("top-banner");
const midBanner = document.getElementById("mid-banner");
const bottomBanner = document.getElementById("bottom-banner");

let articleList = document.querySelectorAll(".article");

// status bar
const statusCondition = document.getElementById("status-condition");
const statusTimer = document.getElementById("status-timer");
const statusClicks = document.getElementById("status-clicks");
const statusAdClicks = document.getElementById("status-adclicks");

// start screen
const startScreen = document.getElementById("start-screen");
const beginExperimentBtn = document.getElementById("beginExperiment");
const experimentControls = document.getElementById("experiment-controls");

// survey modal / CSV
const surveyModal = document.getElementById("survey-modal");
const finishBtn = document.getElementById("finishBtn");
const distractionInput = document.getElementById("distraction");
const csvBlock = document.getElementById("csv-block");
const csvHeaderBox = document.getElementById("csv-header");
const csvRowBox = document.getElementById("csv-row");
const closeSurveyModalBtn = document.getElementById("closeSurveyModal");

let timerInterval = null;
let popupIntervalId = null;

let experimentData = {
  condition: "heavy",
  startTime: null,
  endTime: null,
  taskTimeMs: null,
  correctClicked: false,
  totalClicks: 0,
  wrongClicks: 0,
  adClicks: 0
};

function registerAdClick() {
  experimentData.adClicks++;
  experimentData.totalClicks++;
  updateStatusBar();
}

function createImageAd(src) {
  const ad = document.createElement("div");
  ad.className = "ad-box";
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Sponsored ad";
  img.className = "ad-image";
  ad.appendChild(img);
  ad.addEventListener("click", registerAdClick);
  return ad;
}

function createRandomSideAd() {
  return createImageAd(pickRandom(adImages));
}

function shuffleArticles() {
  const list = document.getElementById("article-list");
  if (!list) return;
  const items = Array.from(list.children);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = items[i];
    items[i] = items[j];
    items[j] = temp;
  }
  items.forEach((item) => list.appendChild(item));
}

function updateStatusBar() {
  statusClicks.textContent = "Clicks: " + experimentData.totalClicks;
  statusAdClicks.textContent = "Ad Clicks: " + experimentData.adClicks;
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function () {
    if (!experimentData.startTime) return;
    const now = performance.now();
    const elapsed = (now - experimentData.startTime) / 1000;
    statusTimer.textContent = "Time: " + elapsed.toFixed(2) + "s";
  }, 100);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Popup ads 

function stopAdTimers() {
  if (popupIntervalId) {
    clearInterval(popupIntervalId);
    popupIntervalId = null;
  }
  if (popupAd) popupAd.classList.add("hidden");
}

function showPopupAd() {
  if (!popupAd || experimentData.condition !== "heavy") return;
  if (!popupAd.classList.contains("hidden")) return;

  popupAd.classList.remove("hidden");
  if (popupImageContainer) {
    popupImageContainer.innerHTML = "";
    const img = document.createElement("img");
    img.src = pickRandom(adImages);
    img.alt = "Popup ad";
    img.className = "popup-ad-image";
    popupImageContainer.appendChild(img);
    img.addEventListener("click", registerAdClick);
  }
}

function startAdTimers() {
  if (experimentData.condition !== "heavy") return;
  stopAdTimers();
  setTimeout(showPopupAd, 3000);
  popupIntervalId = setInterval(showPopupAd, 15000);
}

// Condition handling 

function clearInlineAds() {
  document.querySelectorAll(".inline-ad").forEach(el => el.remove());
}

function applyCondition(cond) {
  experimentData.condition = cond;
  statusCondition.textContent = "Condition: " + cond;

  stopAdTimers();

  [leftAds, rightAds].forEach(col => {
    if (col) {
      col.style.display = "none";
      col.innerHTML = "";
    }
  });
  [topBanner, midBanner, bottomBanner].forEach(el => {
    if (el) {
      el.classList.add("hidden");
      el.innerHTML = "";
    }
  });
  if (flashAd) flashAd.classList.add("hidden");
  if (popupImageContainer) popupImageContainer.innerHTML = "";
  clearInlineAds();

  if (cond === "none") return;

  if (cond === "heavy") {
    if (leftAds && rightAds) {
      leftAds.style.display = "flex";
      rightAds.style.display = "flex";
      for (let i = 0; i < 6; i++) {
        leftAds.appendChild(createRandomSideAd());
        rightAds.appendChild(createRandomSideAd());
      }
    }

    if (topBanner) {
      topBanner.classList.remove("hidden");
      const banner = document.createElement("img");
      banner.src = pickRandom(adImages);
      banner.alt = "Top banner ad";
      banner.className = "top-banner-image";
      topBanner.appendChild(banner);
      topBanner.onclick = registerAdClick;
    }

    if (midBanner) {
      midBanner.classList.remove("hidden");
      const label = document.createElement("div");
      label.className = "banner-label";
      label.textContent = "ADVERTISEMENT";
      const img = document.createElement("img");
      img.src = pickRandom(adImages);
      img.alt = "Mid-page banner ad";
      img.className = "banner-image";
      img.addEventListener("click", registerAdClick);
      midBanner.appendChild(label);
      midBanner.appendChild(img);
    }

    if (bottomBanner) {
      bottomBanner.classList.remove("hidden");
      const img = document.createElement("img");
      img.src = pickRandom(adImages);
      img.alt = "Bottom banner ad";
      const text = document.createElement("div");
      text.className = "bottom-banner-text";
      text.textContent = "Don’t miss this exclusive offer — click to learn more.";
      bottomBanner.appendChild(img);
      bottomBanner.appendChild(text);
      bottomBanner.addEventListener("click", registerAdClick);
    }

    const list = document.getElementById("article-list");
    if (list) {
      const items = Array.from(list.querySelectorAll(".article"));
      [4, 10, 18].forEach(pos => {
        if (pos < items.length) {
          const li = document.createElement("li");
          li.className = "article inline-ad";
          li.innerHTML = "<strong>Sponsored:</strong> This one simple trick could save you hundreds every month.<br/>";
          const img = document.createElement("img");
          img.src = pickRandom(adImages);
          img.alt = "Inline sponsored ad";
          img.addEventListener("click", registerAdClick);
          li.appendChild(img);
          list.insertBefore(li, items[pos]);
        }
      });
    }

    setTimeout(() => {
      if (experimentData.condition === "heavy" && flashAd) {
        flashAd.classList.remove("hidden");
        flashAd.onclick = registerAdClick;
      }
    }, 4000);
  }
}

// Init events

beginExperimentBtn.addEventListener("click", () => {
  startScreen.classList.remove("visible");
  experimentControls.classList.remove("disabled");
});

conditionSelect.addEventListener("change", e => {
  applyCondition(e.target.value);
});

startBtn.addEventListener("click", () => {
  experimentData.startTime = performance.now();
  experimentData.endTime = null;
  experimentData.taskTimeMs = null;
  experimentData.correctClicked = false;
  experimentData.totalClicks = 0;
  experimentData.wrongClicks = 0;
  experimentData.adClicks = 0;

  if (surveyModal) surveyModal.classList.remove("visible");
  if (csvBlock) csvBlock.classList.add("hidden");
  if (closeSurveyModalBtn) closeSurveyModalBtn.classList.add("hidden");

  updateStatusBar();
  statusTimer.textContent = "Time: 0.00s";
  startTimer();

  if (experimentData.condition === "heavy") startAdTimers();
  else stopAdTimers();
});

// shuffle then re-bind article clicks
shuffleArticles();
articleList = document.querySelectorAll(".article");

articleList.forEach(item => {
  item.addEventListener("click", () => {
    experimentData.totalClicks++;
    updateStatusBar();
    if (!experimentData.startTime) return;

    const isCorrect = item.dataset.correct === "true";
    if (isCorrect) {
      experimentData.correctClicked = true;
      experimentData.endTime = performance.now();
      experimentData.taskTimeMs = experimentData.endTime - experimentData.startTime;

      stopTimer();
      stopAdTimers();

      const timeSec = (experimentData.taskTimeMs || 0) / 1000;
      statusTimer.textContent = "Time: " + timeSec.toFixed(2) + "s";

      if (surveyModal) {
        csvBlock.classList.add("hidden");
        closeSurveyModalBtn.classList.add("hidden");
        surveyModal.classList.add("visible");
      }
    } else {
      experimentData.wrongClicks++;
    }
  });
});

closePopup.addEventListener("click", () => {
  if (popupAd) popupAd.classList.add("hidden");
});

// Finish survey -> clean CSV (timeSec,totalClicks,adClicks)
finishBtn.addEventListener("click", () => {
  const timeSec = (experimentData.taskTimeMs || 0) / 1000;
  const header = "timeSec,totalClicks,adClicks";
  const row = timeSec.toFixed(2) + "," + experimentData.totalClicks + "," + experimentData.adClicks;

  if (csvHeaderBox && csvRowBox && csvBlock) {
    csvHeaderBox.value = header;
    csvRowBox.value = row;
    csvBlock.classList.remove("hidden");
  }
  if (closeSurveyModalBtn) closeSurveyModalBtn.classList.remove("hidden");
});

closeSurveyModalBtn.addEventListener("click", () => {
  if (surveyModal) surveyModal.classList.remove("visible");
});

// Initial state
applyCondition(conditionSelect.value);
updateStatusBar();
statusTimer.textContent = "Time: 0.00s";
