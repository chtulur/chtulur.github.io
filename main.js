import keyPress from "./key_inputs.js";
import inputList from "./input_list.js";
//VARS
let coinsDisplayed = false;
let currentSum = 0;
let slotNumDisplayed = false;
let isDispensed = false;
let isCurrentSumEjected = false;

//CREATE SLOTS
let filledSlots = "11,15,22,23,24,31,34,35,42,51,53,55".split(",");
let nums = "12345".split("");
let slotNums = [];
for (let i = 0; i < nums.length; i++) {
  for (let j = 0; j < nums.length; j++) {
    slotNums.push(nums[i] + nums[j]);
  }
}
let emptySlots = slotNums.filter((num) => !filledSlots.includes(num));

//INSERTED COINS
let insertedCoins = [];

//PRODUCT SLOTS
const mars = "23,31,42,55".split(",");
const snickers = "11,15,35,53".split(",");
const bomb = "22,24,34,51".split(",");

//CLICKABLES
const numPad = document.querySelectorAll(".num-pad__box__img");
const userCoins = document.querySelectorAll(".user-coins__coin");
const ejectBtn = document.querySelector(".eject-coins__box__img");

//DISPLAY
const display = document.querySelector(".display__box__dial span");

//CHANGE AREA
const changeCoinsArea = document.querySelector(".machine-coins");

const timeoutWhileDispensing = () => {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve(false);
    }, 4000);
  });
};

//DISPLAY RELATED
const clearDisplay = () => {
  display.textContent = "";
};

const clearCoinDisplay = () => {
  clearDisplay();
  coinsDisplayed = coinsDisplayed ? false : true;
};

const displayError = (issue) => {
  display.textContent = issue;
  setTimeout(() => {
    display.textContent = currentSum;
  }, 1000);
  coinsDisplayed = true;
};

const displayAfterEject = () => {
  setTimeout(() => {
    display.textContent = currentSum;
  }, 1000);
  coinsDisplayed = true;
};

//HANDLING CHANGE
const dispenseChange = (change) => {
  changeCoinsArea.innerHTML = "";
  change.forEach((coin) => {
    let changeCoins = document.createElement("img");
    changeCoins.setAttribute("alt", `${coin}-coin`);
    changeCoins.setAttribute("src", `./assets/coin-${coin}.png`);
    changeCoins.classList.add("coin", "change");
    changeCoinsArea.appendChild(changeCoins);
  });
  insertedCoins = [];
};

const calculateChange = (target) => {
  let coins = [200, 100, 50, 20, 10, 5];
  let change = [];
  for (let i = 0; i < coins.length; i++) {
    while (
      currentSum - coins[i] >= target &&
      !(currentSum - coins[i] < target)
    ) {
      currentSum = currentSum - coins[i];
      change.push(coins[i]);
    }
  }
  dispenseChange(change);
  currentSum = 0;
};

const giveChange = (prod) => {
  let target;
  if (currentSum > 190 && mars.includes(prod)) {
    target = 190;
    calculateChange(target);
    dropAnimation(prod);
  } else if (currentSum > 220 && snickers.includes(prod)) {
    target = 220;
    calculateChange(target);
    dropAnimation(prod);
  } else if (currentSum > 315 && bomb.includes(prod)) {
    target = 315;
    calculateChange(target);
    dropAnimation(prod);
  } else {
    displayError("LOW");
  }
};

//DISPENSION RELATED
const dropAnimation = async (prod) => {
  display.textContent = "Enjoy";
  let selectedProduct = document.querySelector(`.slot-${prod} img:last-child`);
  selectedProduct.classList.add("eject_bar");
  isDispensed = true;
  isDispensed = await timeoutWhileDispensing();
  changeCoinsArea.innerHTML = "";
  selectedProduct.remove();
};

const ejectItem = (prod) => {
  if (document.querySelector(`.slot-${prod}`).children.length !== 0) {
    giveChange(prod);
  } else {
    displayError("EMP");
  }
};

const startDispention = (desiredProduct) => {
  if (filledSlots.includes(desiredProduct)) {
    ejectItem(desiredProduct);
    displayAfterEject();
  } else if (emptySlots.includes(desiredProduct)) {
    displayError("EMP");
  } else {
    displayError("ERR");
  }
};

//KEYPRESS RELATED
const isEnterPressed = (instruction, desiredProduct) => {
  if (
    instruction === "NumpadEnter" ||
    instruction === "button-ok" ||
    instruction === "Enter"
  ) {
    startDispention(desiredProduct);
  }
};

const isCPressed = (instruction) => {
  if (instruction === "KeyC" || instruction === "button-c") {
    display.textContent = currentSum;
    coinsDisplayed = true;
  }
};

const resolveKeyPress = (instruction) => {
  let charsInDisplay = display.textContent.split("").length;
  let desiredProduct = display.textContent;

  if (charsInDisplay < 2) {
    keyPress(display, instruction);
    isCPressed(instruction);
  } else if (charsInDisplay === 2) {
    clearDisplay();
    isCPressed(instruction);
    isEnterPressed(instruction, desiredProduct);
    keyPress(display, instruction);
  }
};

const switchToSLotDisplay = () => {
  if (slotNumDisplayed !== false) return;
  slotNumDisplayed = true;
};

const keypress = (ev) => {
  if (isDispensed) return;
  let instruction = ev.code !== undefined ? ev.code : ev.target.alt;
  if (inputList.includes(instruction)) {
    if (coinsDisplayed) {
      clearCoinDisplay();
    }
    resolveKeyPress(instruction);
    switchToSLotDisplay();
  }
};

//COIN INSTER RELATED
const timeoutWhenCPressed = () => {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve(false);
    }, 1000);
  });
};

const giveSumBack = async () => {
  isCurrentSumEjected = true;
  isCurrentSumEjected = await timeoutWhenCPressed();
  if (!isCurrentSumEjected) {
    changeCoinsArea.innerHTML = "";
  }
};

const addCoins = (ev) => {
  if (ev.target.alt == "50-coin") {
    currentSum += 50;
    insertedCoins.push(50);
  } else if (ev.target.alt == "100-coin") {
    currentSum += 100;
    insertedCoins.push(100);
  } else if (ev.target.alt == "200-coin") {
    currentSum += 200;
    insertedCoins.push(200);
  }
};

const insertCoin = (ev) => {
  if (isDispensed || isCurrentSumEjected) return;
  if (ev.target.alt === "eject") {
    currentSum = 0;
    coinsDisplayed = true;
    if (insertedCoins.length > 0) {
      dispenseChange(insertedCoins);
      giveSumBack();
    }
  }
  if (slotNumDisplayed) {
    clearDisplay();
    slotNumDisplayed = false;
  }
  if (currentSum > 1000) {
    dispenseChange(insertedCoins);
    giveSumBack();
  }
  addCoins(ev);
  display.textContent = currentSum < 1001 ? currentSum : (currentSum = 0);
  if (coinsDisplayed === true) return;
  coinsDisplayed = true;
};

//Numpad img switches when pressed
const machineNumkeysPressed = (ev) => {
  ev.target.src = "./assets/pinpad-button-pressed.png";
};

const machineNumkeysreleased = (ev) => {
  ev.target.src = "./assets/pinpad-button-normal.png";
};

//EVENT LISTENERS
document.addEventListener("keydown", keypress);
numPad.forEach((num) => {
  num.addEventListener("click", keypress);
  num.addEventListener("mousedown", machineNumkeysPressed);
  num.addEventListener("mouseup", machineNumkeysreleased);
});
userCoins.forEach((coin) => coin.addEventListener("click", insertCoin));
ejectBtn.addEventListener("click", insertCoin);
