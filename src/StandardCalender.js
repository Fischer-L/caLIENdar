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

    formatDateString(year, month, date) {
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

    _isValidYear(y) {
      // In JS Date, `00` ~ `99` means 1900 ~ 1999.
      // To avoid confusion, we demand at least 100.
      // This should be ok for the most cases.
      // And if someone needed a year under 100,
      // then we can build another calendar for that.
      return caLINEdar.isInt(y) && y >= 100;
    }
  }

  return new StandardCalendar();
}

module.exports = createStandardCalender;
