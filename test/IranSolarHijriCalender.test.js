import testUtil from "./testUtil";
import caLINEdar from "../src/caLINEdar";
import createIranSolarHijriCalender from "../src/IranSolarHijriCalender";

describe("IranSolarHijriCalender", () => {

  const iranCalendar = createIranSolarHijriCalender(caLINEdar);

  const dates = [
    {
      js: [1975, 2, 21],
      iran: [1354, 0, 1]
    },
    {
      js: [1975, 2, 28],
      iran: [1354, 0, 8]
    },
    {
      js: [2030, 2, 1],
      iran: [1408, 11, 11]
    },
    {
      js: [2030, 2, 20],
      iran: [1408, 11, 30]
    },
    {
      js: [2030, 2, 21],
      iran: [1409, 0, 1]
    },
  ];

  it("should convert a JS date to a iranian date", () => {
    dates.forEach(({ js, iran }) => {
      let iranian = iranCalendar.convertJSDate2LocalDate(...js);
      expect(`${iranian.year}-${iranian.month}-${iranian.date}`).toBe(iran.join("-"));
    });
  });

  it("should convert a iranian date to a JS date", () => {
    dates.forEach(({ js, iran }) => {
      let jsDate = iranCalendar.convertLocalDate2JSDate(...iran);
      expect(`${jsDate.year}-${jsDate.month}-${jsDate.date}`).toBe(js.join("-"));
    });
  });

  const MIN_VALID_IRAN_YEAR = 1354;
  const MAX_VALID_IRAN_YEAR = 1419;
  const MIN_VALID_IRAN_MONTH = 0;
  const MAX_VALID_IRAN_MONTH = 11;

  it("should tell valid iranian years", () => {
    expect(iranCalendar.isDateInCalendar(MIN_VALID_IRAN_YEAR)).toBe(true);
    expect(iranCalendar.isDateInCalendar(MAX_VALID_IRAN_YEAR)).toBe(true);
  });

  it("should tell invalid iranian years", () => {
    expect(iranCalendar.isDateInCalendar(MIN_VALID_IRAN_YEAR - 1)).toBe(false);
    expect(iranCalendar.isDateInCalendar(MAX_VALID_IRAN_YEAR + 1)).toBe(false);
  });

  it("should tell valid iranian months", () => {
    expect(iranCalendar.isDateInCalendar(MIN_VALID_IRAN_YEAR, MIN_VALID_IRAN_MONTH)).toBe(true);
    expect(iranCalendar.isDateInCalendar(MAX_VALID_IRAN_YEAR, MAX_VALID_IRAN_MONTH)).toBe(true);
  });

  it("should tell invalid iranian months", () => {
    expect(iranCalendar.isDateInCalendar(MIN_VALID_IRAN_YEAR, MIN_VALID_IRAN_MONTH - 1)).toBe(false);
    expect(iranCalendar.isDateInCalendar(MAX_VALID_IRAN_YEAR, MAX_VALID_IRAN_MONTH + 1)).toBe(false);
  });

  it("should tell valid iranian dates", () => {
    expect(iranCalendar.isDateInCalendar(MIN_VALID_IRAN_YEAR, MIN_VALID_IRAN_MONTH, 31)).toBe(true);
    expect(iranCalendar.isDateInCalendar(MAX_VALID_IRAN_YEAR, MAX_VALID_IRAN_MONTH, 29)).toBe(true);
  });

  it("should tell invalid iranian dates", () => {
    expect(iranCalendar.isDateInCalendar(MIN_VALID_IRAN_YEAR, MIN_VALID_IRAN_MONTH, 32)).toBe(false);
    expect(iranCalendar.isDateInCalendar(MAX_VALID_IRAN_YEAR, MAX_VALID_IRAN_MONTH, 30)).toBe(false);
  });

  it("should format date strings", () => {

    const dateFormats = [
      {
        date: [1354, 0, 1],
        expected: { 
          year: { pos: 2, text: '1354' },
          month: { pos: 1, text: 'Farvardin' },
          date: { pos: 0, text: '01' },
          delimiter: '/' 
        },
      },
      {
        date: [1354, 0, null],
        expected: { 
          year: { pos: 1, text: '1354' },
          month: { pos: 0, text: 'Farvardin' },
          delimiter: '/' 
        },
      },
      {
        date: [null, 0, 1],
        expected: {
          month: { pos: 1, text: 'Farvardin' },
          date: { pos: 0, text: '01' },
          delimiter: '/' 
        },
      },
    ];
    dateFormats.forEach(d => {
      let format = iranCalendar.formatDateString(...d.date);
      expect(JSON.stringify(format)).toBe(JSON.stringify(d.expected));
    });
  });

  it("should provide date strings placeholder", () => {
    expect(iranCalendar.getDateStringPlaceholder()).toBe("DD/MM/YYYY");
  });

  it("should format a js Date to a locale date string", () => {
    let d = new Date(1975, 2, 21);
    let str = iranCalendar.toLocaleDateString(d);
    expect(str).toBe("01/Farvardin/1354");
  });

  it("should return months supported", () => {
    let expected = [
      {"text": "Farvardin","value":0},
      {"text": "Ordibehesht","value":1},
      {"text": "Khordad","value":2},
      {"text": "Tir","value":3},
      {"text": "Mordad","value":4},
      {"text": "Shahrivar","value":5},
      {"text": "Mehr","value":6},
      {"text": "Aban","value":7},
      {"text": "Azar","value":8},
      {"text": "Dey","value":9},
      {"text": "Bahman","value":10},
      {"text": "Esfand","value":11}
    ];
    let months = iranCalendar.getMonths();
    expect(JSON.stringify(months)).toBe(JSON.stringify(expected));
  });

  it("should return days supported", () => {
    let expected = [ 
      { text: 'Su', value: 0 },
      { text: 'Mo', value: 1 },
      { text: 'Tu', value: 2 },
      { text: 'We', value: 3 },
      { text: 'Th', value: 4 },
      { text: 'Fr', value: 5 },
      { text: 'Sa', value: 6 }
    ];
    let days = iranCalendar.getDays();
    expect(JSON.stringify(days)).toBe(JSON.stringify(expected));
  });

  it("should return dates", () => {
    let expected = [
      { year: 1397, month: 0, date: 1, day: 3, holiday: false },
      { year: 1397, month: 0, date: 2, day: 4, holiday: false },
      { year: 1397, month: 0, date: 3, day: 5, holiday: false },
      { year: 1397, month: 0, date: 4, day: 6, holiday: false },
      { year: 1397, month: 0, date: 5, day: 0, holiday: true },
      { year: 1397, month: 0, date: 6, day: 1, holiday: false },
      { year: 1397, month: 0, date: 7, day: 2, holiday: false },
      { year: 1397, month: 0, date: 8, day: 3, holiday: false },
      { year: 1397, month: 0, date: 9, day: 4, holiday: false },
      { year: 1397, month: 0, date: 10, day: 5, holiday: false },
      { year: 1397, month: 0, date: 11, day: 6, holiday: false },
      { year: 1397, month: 0, date: 12, day: 0, holiday: true },
      { year: 1397, month: 0, date: 13, day: 1, holiday: false },
      { year: 1397, month: 0, date: 14, day: 2, holiday: false },
      { year: 1397, month: 0, date: 15, day: 3, holiday: false },
      { year: 1397, month: 0, date: 16, day: 4, holiday: false },
      { year: 1397, month: 0, date: 17, day: 5, holiday: false },
      { year: 1397, month: 0, date: 18, day: 6, holiday: false },
      { year: 1397, month: 0, date: 19, day: 0, holiday: true },
      { year: 1397, month: 0, date: 20, day: 1, holiday: false },
      { year: 1397, month: 0, date: 21, day: 2, holiday: false },
      { year: 1397, month: 0, date: 22, day: 3, holiday: false },
      { year: 1397, month: 0, date: 23, day: 4, holiday: false },
      { year: 1397, month: 0, date: 24, day: 5, holiday: false },
      { year: 1397, month: 0, date: 25, day: 6, holiday: false },
      { year: 1397, month: 0, date: 26, day: 0, holiday: true },
      { year: 1397, month: 0, date: 27, day: 1, holiday: false },
      { year: 1397, month: 0, date: 28, day: 2, holiday: false },
      { year: 1397, month: 0, date: 29, day: 3, holiday: false },
      { year: 1397, month: 0, date: 30, day: 4, holiday: false },
      { year: 1397, month: 0, date: 31, day: 5, holiday: false }
    ];
    let dates = iranCalendar.getDates(1397, 0);
    expect(JSON.stringify(dates)).toBe(JSON.stringify(expected));
  });

  it("should fallback to the 1st date for getting now", () => {
    testUtil.overrideCaLINEdar(
      caLINEdar, "getNowInLocalTimezone", testUtil.fakeGetNowInLocalTimezone);

    let expected = { year: 1354, month: 0, date: 1 };
    let now = iranCalendar.getNow({ fallback: "1st-date" });
    expect(JSON.stringify(now)).toBe(JSON.stringify(expected));

    testUtil.restoreCaLINEdar(caLINEdar, "getNowInLocalTimezone");
  });

  it("should fallback to the last date for getting now", () => {
    testUtil.overrideCaLINEdar(
      caLINEdar, "getNowInLocalTimezone", testUtil.fakeGetNowInLocalTimezone);
    
    let expected = { year: 1419, month: 11, date: 29 };
    let now = iranCalendar.getNow({ fallback: "last-date" });
    expect(JSON.stringify(now)).toBe(JSON.stringify(expected));

    testUtil.restoreCaLINEdar(caLINEdar, "getNowInLocalTimezone");
  });
});
