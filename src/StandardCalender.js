/**
 * This standard calendar is based on the JS Date system.
 * The min start year is 100.
 */

const MONTH_MAP = new Map([
  [
    0, {
      value: 0,
      text: "Jan"
    }
  ],
  [
    1, {
      value: 1,
      text: "Feb"
    }
  ],
  [
    2, {
      value: 2,
      text: "Mar"
    }
  ],
  [
    3, {
      value: 3,
      text: "Apr"
    }
  ],
  [
    4, {
      value: 4,
      text: "May"
    }
  ],
  [
    5, {
      value: 5,
      text: "Jun"
    }
  ],
  [
    6, {
      value: 6,
      text: "Jul"
    }
  ],
  [ 
    7, {
      value: 7,
      text: "Aug"
    }
  ],
  [ 
    8, {
      value: 8,
      text: "Sep"
    }
  ],
  [ 
    9, {
      value: 9,
      text: "Oct"
    }
  ],
  [ 
    10, {
      value: 10,
      text: "Nov"
    }
  ],
  [ 
    11, {
      value: 11,
      text: "Dec"
    }
  ],
]);

const DAYS_MAP = new Map([
  [
    0, {
      value: 0,
      text: "Su"
    }
  ],
  [
    1, {
      value: 1,
      text: "Mo"
    }
  ],
  [
    2, {
      value: 2,
      text: "Tu"
    }
  ],
  [
    3, {
      value: 3,
      text: "We"
    }
  ],
  [
    4, {
      value: 4,
      text: "Th"
    }
  ],
  [
    5, {
      value: 5,
      text: "Fr"
    }
  ],
  [
    6, {
      value: 6,
      text: "Sa"
    }
  ],
]);

function createStandardCalender(caLINEdar) {
  
  class StandardCalendar extends caLINEdar.CaLINEdarCalender {
    constructor() {
      super();
      this._MS_ONE_DAY = 24 * 60 * 60 * 1000;
    }

    isDateInCalendar(year, month, date) {
      if (!this._isValidYear(year)) {
        return false;
      }

      if (caLINEdar.isInt(month)) {
        let m = MONTH_MAP.get(month);
        if (!m) {
          return false;
        }

        if (caLINEdar.isInt(date)) {
          try {
            let d = new Date(year, month, date);
            return d.getFullYear() === year &&
                   d.getMonth() === month &&
                   d.getDate() === date;

          } catch (e) {
            return false;
          }
        }
      }

      return true;
    }

    getDateStringPlaceholder() {
      return "YYYY/MM/DD";
    }

    getDateStringFormat(year, month, date) {
      let y = this._isValidYear(year) ? "" + year : null;
      
      let m = MONTH_MAP.get(month);
      if (m) {
        m = m.text;
      }

      let d = date;
      if (caLINEdar.isInt(d)) {
        d = d < 10 ? "0" + d : "" + d;
      }

      let format = null;
      if (y && m && d) {
        format = {
          year: {
            pos: 0,
            text: y
          },
          month: {
            pos: 1,
            text: m
          },
          date: {
            pos: 2,
            text: d
          }
        };
      } else if (y && m) {
        format = {
          year: {
            pos: 0,
            text: y
          },
          month: {
            pos: 1,
            text: m
          },
        };
      } else if (m && d) {
        format = {
          month: {
            pos: 0,
            text: m
          },
          date: {
            pos: 1,
            text: d
          }
        };
      }
      if (format) {
        format.delimiter = "/";
      }
      return format;
    }

    toLocaleDateString(jsDate) {
      let y = jsDate.getFullYear();
      let m = jsDate.getMonth() + 1;
      let d = jsDate.getDate();
      let strs = [ y ];
      strs.push(m > 10 ? m : "0" + m);
      strs.push(d > 10 ? d : "0" + d);
      return strs.join("/");
    }

    _isValidYear(y) {
      // In JS Date, `00` ~ `99` means 1900 ~ 1999.
      // To avoid confusion, we demand at least 100.
      // This should be ok for the most cases.
      // And if someone needed a year under 100,
      // then we can build another calendar for that.
      return caLINEdar.isInt(y) && y >= 100;
    }

    getNow() {
      let now = caLINEdar.getNowInLocalTimezone();
      return {
        year: now.getFullYear(),
        month: now.getMonth(),
        date: now.getDate()
      }
    }

    getMonths() {
      let months = [];
      MONTH_MAP.forEach(m => {
        months.push({
          text: m.text,
          value: m.value
        });
      });
      return months;
    }

    getDays() {
      let weekDays = [];
      DAYS_MAP.forEach(d => {
        weekDays.push({
          text: d.text,
          value: d.value
        });
      });
      return weekDays;
    }

    getDates(year, month) {
      if (!this.isDateInCalendar(year, month)) {
        return null;
      }

      let dates = [];
      let d = new Date(year, month, 1);
      while (month === d.getMonth()) {
        let date = {
          year,
          month,
          date: d.getDate(),
          day: d.getDay()
        };
        date.holiday = date.day === 0;
        dates.push(date);
        // Advance one day
        d = new Date(d.getTime() + this._MS_ONE_DAY);
      }
      return dates;
    }

    convertLocalDate2JSDate(year, month, date) {
      if (!this.isDateInCalendar(year, month, date)) {
        return null;
      }
      return { year, month, date };
    }

    convertJSDate2LocalDate(year, month, date) {
      return this.convertLocalDate2JSDate(year, month, date);
    }
  }

  return new StandardCalendar();
}

module.exports = createStandardCalender;
