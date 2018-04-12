import caLINEdar from "../src/caLINEdar";

caLINEdar.init(window);

let calendar = caLINEdar._createCalendar();
let yrPicker = caLINEdar._createYearPicker(
  4, [2014, 2015, 2016, 2017, 2018, 2019, ] // 2020, 2021, 2022
);
calendar.appendChild(yrPicker);
document.body.appendChild(calendar);

calendar = caLINEdar._createCalendar();
let monthPicker = caLINEdar._createMonthPicker(
  3, [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Otc", "Nov", "Dec" ]
);
calendar.appendChild(monthPicker);
document.body.appendChild(calendar);

