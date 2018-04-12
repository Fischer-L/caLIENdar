import caLINEdar from "../src/caLINEdar";

caLINEdar.init(window);

let calendar = caLINEdar._createCalendar();
let yrPicker = caLINEdar._createYearPicker(
  [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022], 4
);
calendar.appendChild(yrPicker);
document.body.appendChild(calendar);
