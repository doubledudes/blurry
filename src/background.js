let blurLevel;

function addBorder(e) {
  e.stopPropagation();
  let currentNode = e.target;
  currentNode.classList.add("border-element");

  if (
    currentNode.hasAttribute("src") ||
    currentNode.hasAttribute("href") ||
    currentNode.hasAttribute("onclick") ||
    currentNode.nodeName == "BUTTON"
  ) {
    currentNode.style.border = "1px dashed red";
  }
}

function removeBorder(e) {
  e.stopPropagation();

  let currentNode = e.target;
  currentNode.classList.remove("border-element");

  if (
    currentNode.hasAttribute("src") ||
    currentNode.hasAttribute("href") ||
    currentNode.hasAttribute("onclick") ||
    currentNode.nodeName == "BUTTON"
  ) {
    currentNode.style.border = "";
  }
}

function toggleBlur(e) {
  e.stopPropagation();

  let currentNode = e.target;
  if (
    currentNode.hasAttribute("src") ||
    currentNode.hasAttribute("href") ||
    currentNode.hasAttribute("onclick") ||
    currentNode.nodeName == "BUTTON"
  ) {
    currentNode.border = "1px dashed red";
    e.preventDefault();
  }
  if (currentNode.dataset.blur === "false") {
    currentNode.dataset.blur = "true";
    currentNode.classList.add("blur-element");
    currentNode.style.setProperty(`--blur`, blurLevel + "px");
  } else {
    currentNode.dataset.blur = "false";
    currentNode.classList.remove("blur-element");
  }
}

let addEvent = () => {
  let elements = document.body.querySelectorAll("*");
  elements.forEach((ele) => {
    if (ele.dataset.ig === "true") {
      return;
    }

    // Find the better way, this way will change webpage's structure
    let tooptipEle = document.createElement("SPAN");
    let txtNode = document.createTextNode(
      "This element contains a link, click on it will disable the link"
    );
    tooptipEle.appendChild(txtNode);
    tooptipEle.classList.add("blur-tooltip-text");
    if (
      ele.hasAttribute("src") ||
      ele.hasAttribute("href") ||
      ele.hasAttribute("onclick") ||
      ele.nodeName == "BUTTON"
    ) {
      ele.classList.add("blur-tooltip");
      ele.appendChild(tooptipEle);
    }

    ele.dataset.blur = "false";
    ele.addEventListener("mouseover", addBorder, true);
    ele.addEventListener("mouseout", removeBorder, true);
    ele.addEventListener("click", toggleBlur, true);
  });
};

let removeEvent = () => {
  let elements = document.body.querySelectorAll("*");
  elements.forEach((ele, idx) => {
    // console.log("removing listener...", ele);
    ele.removeEventListener("mouseover", addBorder, true);
    ele.removeEventListener("mouseout", removeBorder, true);
    ele.removeEventListener("click", toggleBlur, true);
    // ele.removeAttribute("data-blur");

    if (ele.classList.contains("blur-tooltip")) {
      ele.classList.remove("blur-tooltip");
    }

    // need to find the better way
    // this way will not remove the latest span tag
    if (ele.classList.contains("blur-tooltip-text")) {
      ele.classList.remove("blur-tooltip-text");
      ele.style.display = "none";
    }
  });
};

let removeAllBlurEle = () => {
  let elements = document.body.querySelectorAll("*");
  elements.forEach((ele) => {
    if (ele.dataset.blur === "true" || ele.classList.contains("blur-element")) {
      ele.classList.remove("blur-element");
      ele.dataset.blur = "false";
      // reset bur style?
    }
  });
  removeEvent();
};

// console.log("Activated content script");

chrome.runtime.onMessage.addListener((data) => {
  // console.log(data);
  if (data.action === "blur") {
    // console.log("Executing addEvent");
    blurLevel = data.blurLevel / 10;
    addEvent();
  } else if (data.action === "remove") {
    removeAllBlurEle();
  } else if (data.action === "exit") {
    removeEvent();
  }
});
