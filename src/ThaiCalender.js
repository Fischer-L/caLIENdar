/**
 * This ThaiCalender is based on Buddihst year, which is Christian year + 543.
 * The min start year is 643.
 */

const MONTH_MAP = new Map([
  [
    0, {
      value: 0,
      text: "ม.ค."
    }
  ],
  [
    1, {
      value: 1,
      text: "ก.พ."
    }
  ],
  [
    2, {
      value: 2,
      text: "มี.ค."
    }
  ],
  [
    3, {
      value: 3,
      text: "เม.ย."
    }
  ],
  [
    4, {
      value: 4,
      text: "พ.ค."
    }
  ],
  [
    5, {
      value: 5,
      text: "มิ.ย."
    }
  ],
  [
    6, {
      value: 6,
      text: "ก.ค."
    }
  ],
  [ 
    7, {
      value: 7,
      text: "ส.ค."
    }
  ],
  [ 
    8, {
      value: 8,
      text: "ก.ย."
    }
  ],
  [ 
    9, {
      value: 9,
      text: "ต.ค."
    }
  ],
  [ 
    10, {
      value: 10,
      text: "พ.ย."
    }
  ],
  [ 
    11, {
      value: 11,
      text: "ธ.ค."
    }
  ],
]);

const DAYS_MAP = new Map([
  [
    0, {
      value: 0,
      text: "อา."
    }
  ],
  [
    1, {
      value: 1,
      text: "จ."
    }
  ],
  [
    2, {
      value: 2,
      text: "อ."
    }
  ],
  [
    3, {
      value: 3,
      text: "พ."
    }
  ],
  [
    4, {
      value: 4,
      text: "พฤ."
    }
  ],
  [
    5, {
      value: 5,
      text: "ศ."
    }
  ],
  [
    6, {
      value: 6,
      text: "ส."
    }
  ],
]);

const BUDDIHST_YEAR_OFFSET = 543;

function createThaiCalender(caLINEdar) {
  // Let's borrow from StandardCalendar
  class ThaiCalender extends caLINEdar.StandardCalendar {
    constructor() {
      super();
    }

    isDateInCalendar(year, month, date) {
      return super.isDateInCalendar(this._toStandardYear(year), month, date);
    }

    getDateStringPlaceholder() {
      return super.getDateStringPlaceholder();
    }

    getDateStringFormat(year, month, date) {
      let format = super.getDateStringFormat(this._toStandardYear(year), month, date);
      if (format.year) {
        format.year.text = "" + this._toBuddihstYear(format.year.text);
      }
      if (format.month) {
        format.month.text = MONTH_MAP.get(month).text;
      }
      return format;
    }

    toLocaleDateString(jsDate) {
      let str = super.toLocaleDateString(jsDate);
      str = str.split("/");
      str[0] = this._toBuddihstYear(str[0]);
      return str.join("/");
    }

    getNow() {
      let now = super.getNow();
      now.year = this._toBuddihstYear(now.year);
      return now;
    }
    
    getMonths() {
      let months = super.getMonths();
      MONTH_MAP.forEach((m, i) => {
        months[i].text = m.text;
      });
      return months;
    }

    getDays() {
      let days = super.getDays();
      DAYS_MAP.forEach((d, i) => {
        days[i].text = d.text;
      });
      return days;
    }

    getDates(year, month) {
      let dates = super.getDates(this._toStandardYear(year), month);
      if (dates) {
        dates.forEach(d => d.year = this._toBuddihstYear(d.year));
      }
      return dates;
    }

    convertLocalDate2JSDate(year, month, date) {
      year = this._toStandardYear(year);
      if (!super.isDateInCalendar(year, month, date)) {
        return null;
      }
      return { year, month, date };
    }

    convertJSDate2LocalDate(year, month, date) {
      if (!super.isDateInCalendar(year, month, date)) {
        return null;
      }
      year = this._toBuddihstYear(year);
      return { year, month, date };
    }

    _toBuddihstYear(y) {
      return parseInt(y) + BUDDIHST_YEAR_OFFSET;
    }

    _toStandardYear(y) {
      return parseInt(y) - BUDDIHST_YEAR_OFFSET;
    }
  }

  return new ThaiCalender();
}

module.exports = createThaiCalender;
