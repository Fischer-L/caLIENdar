import caLINEdar from "../src/index";
import createIranSolarHijriCalender from "../src/IranSolarHijriCalender";

caLINEdar.init(window);
window.caLINEdar = caLINEdar;

let twDatePicker = document.querySelector("#tw-date-picker");
window.twDateInput = caLINEdar.createDateInput({
  mountElem: twDatePicker,
  onChange: inp => console.log("iranDateInput onChange", inp.getDate())
});

let iranCalendar = createIranSolarHijriCalender(caLINEdar);
let iranDatePicker = document.querySelector("#iranian-date-picker");
window.iranDateInput = caLINEdar.createDateInput({
  date: new Date(),
  calendar: iranCalendar,
  mountElem: iranDatePicker,
  onChange: inp => console.log("iranDateInput onChange", inp.getDate())
});

