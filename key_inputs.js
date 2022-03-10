const keyPress = (display, instruction) => {
  switch (instruction) {
    case "Numpad1":
    case "button-1":
    case "Digit1":
      display.textContent += 1;
      break;
    case "Numpad2":
    case "button-2":
    case "Digit2":
      display.textContent += 2;
      break;
    case "Numpad3":
    case "button-3":
    case "Digit3":
      display.textContent += 3;
      break;
    case "Numpad4":
    case "button-4":
    case "Digit4":
      display.textContent += 4;
      break;
    case "Numpad5":
    case "button-5":
    case "Digit5":
      display.textContent += 5;
      break;
    case "Numpad6":
    case "button-6":
    case "Digit6":
      display.textContent += 6;
      break;
    case "Numpad7":
    case "button-7":
    case "Digit7":
      display.textContent += 7;
      break;
    case "Numpad8":
    case "button-8":
    case "Digit8":
      display.textContent += 8;
      break;
    case "Numpad9":
    case "button-9":
    case "Digit9":
      display.textContent += 9;
      break;
    case "Numpad0":
    case "button-0":
    case "Digit0":
      display.textContent += 0;
      break;
  }
};

export default keyPress;
