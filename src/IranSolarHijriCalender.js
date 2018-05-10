/**
 * This Iranian Solar Hijri calendar is based on https://en.wikipedia.org/wiki/Solar_Hijri_calendar. 
 * According to the wiki, the Iranian Solar Hijri calendar is astronomical observations-based.
 */

const IRAN_YEAR_MAP = {
  "1354": {"value":1354,"leapYear":true,"jsDate":{"start":{"date":21,"month":2,"year":1975},"end":{"date":20,"month":2,"year":1976}}},
  "1355": {"value":1355,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1976},"end":{"date":20,"month":2,"year":1977}}},
  "1356": {"value":1356,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1977},"end":{"date":20,"month":2,"year":1978}}},
  "1357": {"value":1357,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1978},"end":{"date":20,"month":2,"year":1979}}},
  "1358": {"value":1358,"leapYear":true,"jsDate":{"start":{"date":21,"month":2,"year":1979},"end":{"date":20,"month":2,"year":1980}}},
  "1359": {"value":1359,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1980},"end":{"date":20,"month":2,"year":1981}}},
  "1360": {"value":1360,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1981},"end":{"date":20,"month":2,"year":1982}}},
  "1361": {"value":1361,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1982},"end":{"date":20,"month":2,"year":1983}}},
  "1362": {"value":1362,"leapYear":true,"jsDate":{"start":{"date":21,"month":2,"year":1983},"end":{"date":20,"month":2,"year":1984}}},
  "1363": {"value":1363,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1984},"end":{"date":20,"month":2,"year":1985}}},
  "1364": {"value":1364,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1985},"end":{"date":20,"month":2,"year":1986}}},
  "1365": {"value":1365,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1986},"end":{"date":20,"month":2,"year":1987}}},
  "1366": {"value":1366,"leapYear":true,"jsDate":{"start":{"date":21,"month":2,"year":1987},"end":{"date":20,"month":2,"year":1988}}},
  "1367": {"value":1367,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1988},"end":{"date":20,"month":2,"year":1989}}},
  "1368": {"value":1368,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1989},"end":{"date":20,"month":2,"year":1990}}},
  "1369": {"value":1369,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1990},"end":{"date":20,"month":2,"year":1991}}},
  "1370": {"value":1370,"leapYear":true,"jsDate":{"start":{"date":21,"month":2,"year":1991},"end":{"date":20,"month":2,"year":1992}}},
  "1371": {"value":1371,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1992},"end":{"date":20,"month":2,"year":1993}}},
  "1372": {"value":1372,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1993},"end":{"date":20,"month":2,"year":1994}}},
  "1373": {"value":1373,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1994},"end":{"date":20,"month":2,"year":1995}}},
  "1374": {"value":1374,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1995},"end":{"date":19,"month":2,"year":1996}}},
  "1375": {"value":1375,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":1996},"end":{"date":20,"month":2,"year":1997}}},
  "1376": {"value":1376,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1997},"end":{"date":20,"month":2,"year":1998}}},
  "1377": {"value":1377,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1998},"end":{"date":20,"month":2,"year":1999}}},
  "1378": {"value":1378,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":1999},"end":{"date":19,"month":2,"year":2000}}},
  "1379": {"value":1379,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2000},"end":{"date":20,"month":2,"year":2001}}},
  "1380": {"value":1380,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2001},"end":{"date":20,"month":2,"year":2002}}},
  "1381": {"value":1381,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2002},"end":{"date":20,"month":2,"year":2003}}},
  "1382": {"value":1382,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2003},"end":{"date":19,"month":2,"year":2004}}},
  "1383": {"value":1383,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2004},"end":{"date":20,"month":2,"year":2005}}},
  "1384": {"value":1384,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2005},"end":{"date":20,"month":2,"year":2006}}},
  "1385": {"value":1385,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2006},"end":{"date":20,"month":2,"year":2007}}},
  "1386": {"value":1386,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2007},"end":{"date":19,"month":2,"year":2008}}},
  "1387": {"value":1387,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2008},"end":{"date":20,"month":2,"year":2009}}},
  "1388": {"value":1388,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2009},"end":{"date":20,"month":2,"year":2010}}},
  "1389": {"value":1389,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2010},"end":{"date":20,"month":2,"year":2011}}},
  "1390": {"value":1390,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2011},"end":{"date":19,"month":2,"year":2012}}},
  "1391": {"value":1391,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2012},"end":{"date":20,"month":2,"year":2013}}},
  "1392": {"value":1392,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2013},"end":{"date":20,"month":2,"year":2014}}},
  "1393": {"value":1393,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2014},"end":{"date":20,"month":2,"year":2015}}},
  "1394": {"value":1394,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2015},"end":{"date":19,"month":2,"year":2016}}},
  "1395": {"value":1395,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2016},"end":{"date":20,"month":2,"year":2017}}},
  "1396": {"value":1396,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2017},"end":{"date":20,"month":2,"year":2018}}},
  "1397": {"value":1397,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2018},"end":{"date":20,"month":2,"year":2019}}},
  "1398": {"value":1398,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2019},"end":{"date":19,"month":2,"year":2020}}},
  "1399": {"value":1399,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2020},"end":{"date":20,"month":2,"year":2021}}},
  "1400": {"value":1400,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2021},"end":{"date":20,"month":2,"year":2022}}},
  "1401": {"value":1401,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2022},"end":{"date":20,"month":2,"year":2023}}},
  "1402": {"value":1402,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2023},"end":{"date":19,"month":2,"year":2024}}},
  "1403": {"value":1403,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2024},"end":{"date":20,"month":2,"year":2025}}},
  "1404": {"value":1404,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2025},"end":{"date":20,"month":2,"year":2026}}},
  "1405": {"value":1405,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2026},"end":{"date":20,"month":2,"year":2027}}},
  "1406": {"value":1406,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2027},"end":{"date":19,"month":2,"year":2028}}},
  "1407": {"value":1407,"leapYear":false,"jsDate":{"start":{"date":20,"month":2,"year":2028},"end":{"date":19,"month":2,"year":2029}}},
  "1408": {"value":1408,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2029},"end":{"date":20,"month":2,"year":2030}}},
  "1409": {"value":1409,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2030},"end":{"date":20,"month":2,"year":2031}}},
  "1410": {"value":1410,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2031},"end":{"date":19,"month":2,"year":2032}}},
  "1411": {"value":1411,"leapYear":false,"jsDate":{"start":{"date":20,"month":2,"year":2032},"end":{"date":19,"month":2,"year":2033}}},
  "1412": {"value":1412,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2033},"end":{"date":20,"month":2,"year":2034}}},
  "1413": {"value":1413,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2034},"end":{"date":20,"month":2,"year":2035}}},
  "1414": {"value":1414,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2035},"end":{"date":19,"month":2,"year":2036}}},
  "1415": {"value":1415,"leapYear":false,"jsDate":{"start":{"date":20,"month":2,"year":2036},"end":{"date":19,"month":2,"year":2037}}},
  "1416": {"value":1416,"leapYear":true,"jsDate":{"start":{"date":20,"month":2,"year":2037},"end":{"date":20,"month":2,"year":2038}}},
  "1417": {"value":1417,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2038},"end":{"date":20,"month":2,"year":2039}}},
  "1418": {"value":1418,"leapYear":false,"jsDate":{"start":{"date":21,"month":2,"year":2039},"end":{"date":19,"month":2,"year":2040}}},
  "1419": {"value":1419,"leapYear":false,"jsDate":{"start":{"date":20,"month":2,"year":2040},"end":{"date":19,"month":2,"year":2041}}},
};

const IRAN_MONTH_MAP = new Map([
  [
    0, {
      value: 0,
      text: "Farvardin"
    }
  ],
  [
    1, {
      value: 1,
      text: "Ordibehesht"
    }
  ],
  [
    2, {
      value: 2,
      text: "Khordad"
    }
  ],
  [
    3, {
      value: 3,
      text: "Tir"
    }
  ],
  [
    4, {
      value: 4,
      text: "Mordad"
    }
  ],
  [
    5, {
      value: 5,
      text: "Shahrivar"
    }
  ],
  [
    6, {
      value: 6,
      text: "Mehr"
    }
  ],
  [ 
    7, {
      value: 7,
      text: "Aban"
    }
  ],
  [ 
    8, {
      value: 8,
      text: "Azar"
    }
  ],
  [ 
    9, {
      value: 9,
      text: "Dey"
    }
  ],
  [ 
    10, {
      value: 10,
      text: "Bahman"
    }
  ],
  [ 
    11, {
      value: 11,
      text: "Esfand"
    }
  ],
]);

const IRAN_DAYS_MAP = new Map([
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

let _IranSolarHijriCalender = null;

function getIranSolarHijriCalenderClass(caLINEdar) {
  if (_IranSolarHijriCalender) return _IranSolarHijriCalender;

  class IranSolarHijriCalender extends caLINEdar.CaLINEdarCalender {

    constructor() {
      super();
      this._DAY_IN_MS = 24 * 60 * 60 * 1000;
    }

    isDateInCalendar(year, month, date) {
      let y = IRAN_YEAR_MAP[year];
      if (!y) {
        return false;
      }

      if (caLINEdar.isInt(month)) {
        let m = IRAN_MONTH_MAP.get(month);
        if (!m) {
          return false;
        }

        if (caLINEdar.isInt(date)) {
          if (date <= 0 || date > this._calcDayNumbersByLocal(m.value, y.leapYear)) {
            return false;
          }
        }
      }

      return true;
    }

    getDateStringPlaceholder() {
      return "DD/MM/YYYY"; 
    }

    getDateStringFormat(year, month, date) {
      let y = IRAN_YEAR_MAP[year];
      if (y) {
        y = "" + y.value;
      }

      let m = IRAN_MONTH_MAP.get(month);
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
            pos: 2,
            text: y
          },
          month: {
            pos: 1,
            text: m
          },
          date: {
            pos: 0,
            text: d
          }
        };
      } else if (y && m) {
        format = {
          year: {
            pos: 1,
            text: y
          },
          month: {
            pos: 0,
            text: m
          },
        };
      } else if (m && d) {
        format = {
          month: {
            pos: 1,
            text: m
          },
          date: {
            pos: 0,
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
      let str = null;
      let d = this.convertJSDate2LocalDate(
        jsDate.getFullYear(),
        jsDate.getMonth(),
        jsDate.getDate()
      );
      if (d) {
        let format = this.getDateStringFormat(
          d.year,
          d.month,
          d.date
        );
        str = [0,0,0];
        let { year, month, date } = format;
        str[year.pos] = year.text;
        str[month.pos] = month.text;
        str[date.pos] = date.text;
        str = str.join(format.delimiter);
      }
      return str || "";
    }

    getNow(options = {}) {
      let now = caLINEdar.getNowInLocalTimezone();
      let local = this.convertJSDate2LocalDate(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      if (!local) {
        let fallback = null;
        switch (options.fallback) {
          case "1st-date":
            fallback = IRAN_YEAR_MAP["1354"].jsDate.start;
            break;

          case "last-date":
            fallback = IRAN_YEAR_MAP["1419"].jsDate.end;
            break;
        }
        if (fallback) {
          local = this.convertJSDate2LocalDate(
            fallback.year,
            fallback.month,
            fallback.date
          );
        }
      }
      return local;
    }

    getMonths() {
      let months = [];
      IRAN_MONTH_MAP.forEach(m => {
        months.push({
          text: m.text,
          value: m.value
        });
      });
      return months;
    }

    getDays() {
      let weekDays = [];
      IRAN_DAYS_MAP.forEach(d => {
        weekDays.push({
          text: d.text,
          value: d.value
        });
      });
      return weekDays;
    }

    getDates(year, month) {
      let y = IRAN_YEAR_MAP[year];
      let m = IRAN_MONTH_MAP.get(month);
      if (!y || !m) {
        console.warn(`Unable to get dates. The year: ${year}, month: ${month} is unknown.`);
        return null;
      }

      let jsDate = this.convertLocalDate2JSDate(y.value, m.value, 1);
      jsDate = new Date(jsDate.year, jsDate.month, jsDate.date);

      let dates = [];
      let currentDay = jsDate.getDay();
      let maxDate = this._calcDayNumbersByLocal(m.value, y.leapYear);
      for (let i = 1; i <= maxDate; ++i) {
        let d = {
          year: y.value,
          month: m.value,
          date: i,
          day: currentDay % 7
        };
        d.holiday = d.day === 0;
        dates.push(d);
        currentDay = d.day + 1;
      }
      return dates;
    }

    convertLocalDate2JSDate(year, month, date) {
      if (!this.isDateInCalendar(year, month, date)) {
        console.warn(`Unable to convert a local date. The year: ${year}, month: ${month}, date: ${date} is out of the valid range.`);
        return null;
      }

      let y = IRAN_YEAR_MAP[year];
      let m = IRAN_MONTH_MAP.get(month);
      let sum = date - 1;
      for (let i = 0; i < m.value; ++i) {
        sum += this._calcDayNumbersByLocal(i, y.leapYear);
      }
      // The ms passed from 1/1 of this year to the given date
      let msPassed = sum * this._DAY_IN_MS;

      let jsDate = y.jsDate.start;
      // 1. Get the start date for the given year based on the js date
      jsDate = new Date(jsDate.year, jsDate.month, jsDate.date);
      // 2. Create a new data plus the ms passed so get the coresponding js date
      jsDate = new Date(jsDate.getTime() + msPassed);

      return {
        year: jsDate.getFullYear(),
        month: jsDate.getMonth(),
        date: jsDate.getDate(),
      };
    }

    convertJSDate2LocalDate(year, month, date) {
      if (!caLINEdar.isInt(year) ||
          !caLINEdar.isInt(month) ||
          !caLINEdar.isInt(date)) {
        return null;
      }

      let jsDate = null;
      try {
        // Always good to make sure the date correct
        jsDate = new Date(year, month, date);
        year = jsDate.getFullYear();
        month = jsDate.getMonth();
        date = jsDate.getDate();
      } catch (e) {
        console.warn(`Unable to convert a JS date because ${e.toString()}`);
        return null;
      }

      // 1. Find which Iran year the given js date is in
      let iranYear = null;
      for (let i in IRAN_YEAR_MAP) {
        let y = IRAN_YEAR_MAP[i];
        let { start, end } = y.jsDate;

        let afterStart = year > start.year;
        if (year === start.year &&
            (month > start.month ||
             (month === start.month && date >= start.date))
        ) {
          afterStart = true;
        }

        let beforeEnd = year < end.year;
        if (year === end.year &&
            (month < end.month ||
             (month === end.month && date <= end.date))
        ) {
          beforeEnd = true;
        }

        if (afterStart && beforeEnd) {
          iranYear = y;
          break;
        }
      }
      if (!iranYear) {
        console.warn(`Unable to convert a local date. The year: ${year}, month: ${month}, date: ${date} is out of the valid range.`);
        return null;
      }

      // 2. Calculate how many days have been passed since
      let start = iranYear.jsDate.start;
      start = new Date(start.year, start.month, start.date);
      let msPassed = jsDate.getTime() - start.getTime();
      let daysPassed = Math.floor(msPassed / this._DAY_IN_MS);

      // 3. Add the days passed back from the start of the Iran year
      let localYear = iranYear.value;
      let localMonth = 0;
      let localDate = 1;
      while (daysPassed > 0) {
        let passed = this._calcDayNumbersByLocal(localMonth, iranYear.leapYear);
        if (daysPassed >= passed) {
          localMonth++;
        } else if (daysPassed < passed) {
          localDate += daysPassed;
        }
        daysPassed -= passed;
      }

      return {
        year: localYear,
        month: localMonth,
        date: localDate
      };
    }

    _calcDayNumbersByLocal(month, leapYear) {
      let n = 31;
      if (month >= 6) {
        n = 30;
        if (month === 11 && !leapYear) {
          n = 29;
        }
      }
      return n;
    }
  }

  _IranSolarHijriCalender = IranSolarHijriCalender;
  return _IranSolarHijriCalender;
}

function createIranSolarHijriCalender(caLINEdar) {
  let Calendar = getIranSolarHijriCalenderClass(caLINEdar);
  return new Calendar();
}

module.exports = createIranSolarHijriCalender;
