import caLINEdar from "../src/index";
import createIranSolarHijriCalender from "../src/IranSolarHijriCalender";

function getFakeYearArgs() {
  let yrs = 
    [2014, 2015, 2016, 2017, 2018, 2019,  2020, 2021, 2022 ].map(y => ({
      value: y,
      text: y,
      picked: y === 2018
    }));
  return yrs;
}

function getFakeMonthArgs() {
  let months = 
    [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Otc", "Nov", "Dec" ]
      .map((text, value) => ({ 
        text,
        value,
        picked: text === "Apr"
      }));
  return months;
}

function getFakeDatePickerArgs() {
  let pickerBtns = [
    {
      text: "Apr",
      value: 3,
    }, {
      text: "2018",
      value: 2018
    }
  ];
  let weekHeaders = [
    "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"
  ];
  let dates = [];
  for (let i = 0; i < 42; ++i) {
    let d = {
      text: i,
      value: i,
    };
    if (i < 3 || i > 31) {
      d.grayOutDate = true;
    }
    d.special = i % 7 === 0;
    d.picked = i === 15;
    dates.push(d);
  }
  return {
    dates,
    pickerBtns,
    weekHeaders,
  };
}

caLINEdar.init(window);

let { pickerBtns, weekHeaders, dates } = getFakeDatePickerArgs();
let container = document.querySelector(".date-input-container");
let anchorInput = caLINEdar._createInput();
container.appendChild(anchorInput);
caLINEdar.openCalendar(anchorInput, pickerBtns, weekHeaders, dates);

let months = getFakeMonthArgs();
caLINEdar.openMonthPicker(months);

let yrs = getFakeYearArgs();
caLINEdar.opneYearPicker(yrs);

window.iranCalendar = createIranSolarHijriCalender(caLINEdar);
