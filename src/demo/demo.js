import caLINEdar from "../index";
import createThaiCalender from "../ThaiCalender";
import createIranSolarHijriCalender from "../IranSolarHijriCalender";

caLINEdar.init(window);
window.caLINEdar = caLINEdar;

function getChangeHandler(elem) {
  return function (dateInput) {
    let picked = elem.querySelector(".current-picked");
    picked.textContent = dateInput.getDate() || "-------";
  }
}

let twDatePicker = document.querySelector("#tw-date-picker");
window.twDateInput = caLINEdar.createDateInput({
  mountElem: twDatePicker,
  onChange: getChangeHandler(twDatePicker)
});

let thaiCalendar = createThaiCalender(caLINEdar);
let thaiDatePicker = document.querySelector("#thai-date-picker");
window.thaiDateInput = caLINEdar.createDateInput({
  date: Math.floor((new Date(2016, 9, 17)).getTime() / 1000),
  calendar: thaiCalendar,
  mountElem: thaiDatePicker,
  onChange: getChangeHandler(thaiDatePicker)
});

let iranCalendar = createIranSolarHijriCalender(caLINEdar);
let iranDatePicker = document.querySelector("#iranian-date-picker");
window.iranDateInput = caLINEdar.createDateInput({
  rtl: true,
  date: new Date(),
  calendar: iranCalendar,
  mountElem: iranDatePicker,
  onChange: getChangeHandler(iranDatePicker)
});

