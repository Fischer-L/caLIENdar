import caLINEdar from "../src/index";
import createThaiCalender from "../src/ThaiCalender";
import createIranSolarHijriCalender from "../src/IranSolarHijriCalender";

caLINEdar.init(window);
window.caLINEdar = caLINEdar;

let twDatePicker = document.querySelector("#tw-date-picker");
window.twDateInput = caLINEdar.createDateInput({
  mountElem: twDatePicker,
  onChange: inp => console.log("iranDateInput onChange", inp.getDate())
});

let thaiCalendar = createThaiCalender(caLINEdar);
let thaiDatePicker = document.querySelector("#thai-date-picker");
window.thaiDateInput = caLINEdar.createDateInput({
  date: Math.floor((new Date(2016, 9, 17)).getTime() / 1000),
  calendar: thaiCalendar,
  mountElem: thaiDatePicker,
  onChange: inp => console.log("thaiDatePicker onChange", inp.getDate())
});

let iranCalendar = createIranSolarHijriCalender(caLINEdar);
let iranDatePicker = document.querySelector("#iranian-date-picker");
window.iranDateInput = caLINEdar.createDateInput({
  rtl: true,
  date: new Date(),
  calendar: iranCalendar,
  mountElem: iranDatePicker,
  onChange: inp => console.log("iranDateInput onChange", inp.getDate())
});

