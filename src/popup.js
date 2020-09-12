let blurLevel = 8;

let menuDesc = document.querySelector("#menu-desc");

let enableEvent = document.querySelector("#cursor-blur");
let disableEvent = document.querySelector("#exit-blur");
let removeAllBlur = document.querySelector("#remove-blur");

enableEvent.addEventListener("mouseenter", updateDesc);
enableEvent.addEventListener("mouseleave", updateDesc);
enableEvent.addEventListener("click", (e) => {
  const param = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(param, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "blur",
      blurLevel: blurLevel,
    });
  });
  saveChanges();
});

disableEvent.addEventListener("mouseenter", updateDesc);
disableEvent.addEventListener("mouseleave", updateDesc);
disableEvent.addEventListener("click", (e) => {
  const param = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(param, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "exit",
      blurLevel: blurLevel,
    });
  });
});

removeAllBlur.addEventListener("mouseenter", updateDesc);
removeAllBlur.addEventListener("mouseleave", updateDesc);
removeAllBlur.addEventListener("click", (e) => {
  const param = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(param, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "remove",
      blurLevel: blurLevel,
    });
  });
});

let imgTest = document.getElementById("imageTest");
let bgTxt = document.getElementById("bg-text");
imgTest.style.setProperty(`--blur`, blurLevel + "px");
bgTxt.style.setProperty(`--blur`, blurLevel + "px");

let rangeSlider = document.getElementById("rs-range-line");
let rangeBullet = document.getElementById("rs-bullet");
rangeSlider.value = blurLevel;

function updateDesc(e) {
  menuDesc.innerHTML = e.target.dataset.name;
  // Add some animation here
}

function saveChanges() {
  let blurLevelSelected = blurLevel;
  chrome.storage.sync.set({ blurLevel: blurLevelSelected }, function () {});
}

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value / 10;
  let bulletPosition = rangeSlider.value / rangeSlider.max;
  rangeBullet.style.left = bulletPosition * 257 + "px";
  blurLevel = rangeSlider.value;
  imgTest.style.setProperty(`--blur`, rangeSlider.value / 10 + "px");
  bgTxt.style.setProperty(`--blur`, rangeSlider.value / 10 + "px");
}

rangeSlider.addEventListener("input", showSliderValue, false);

let menuIcon = document.querySelector("#menu-container");
let menuList = menuIcon.querySelectorAll("button");
menuList.forEach((ele) => {
  ele.dataset.clicked = "false";
});

menuIcon.addEventListener("click", (e) => {
  if (e.target.id === "menu-container") return;
  if (e.target.dataset.clicked === "true") return;

  // Otherwise, Disable others
  menuList.forEach((ele) => {
    if (ele.dataset.clicked === "true") {
      ele.classList.remove("clicked-menu-bg");
      ele.dataset.clicked = "false";
    }
  });

  // Enable
  if (e.target.nodeName === "path") {
    e.target.parentNode.parentNode.classList.add("clicked-menu-bg");
    e.target.parentNode.parentNode.dataset.clicked = "true";
  } else if (e.target.nodeName === "svg") {
    e.target.parentNode.classList.add("clicked-menu-bg");
    e.target.parentNode.dataset.clicked = "true";
  } else {
    e.target.classList.add("clicked-menu-bg");
    e.target.dataset.clicked = "true";
  }
});

chrome.storage.sync.get("blurLevel", function (data) {
  if (data.blurLevel) {
    blurLevel = data.blurLevel;
    rangeSlider.value = data.blurLevel;
    showSliderValue();
  } else {
    showSliderValue();
  }
});
