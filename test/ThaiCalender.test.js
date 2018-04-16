import testUtil from "./testUtil";
import caLINEdar from "../src/caLINEdar";
import createThaiCalender from "../src/ThaiCalender";

describe("ThaiCalender", () => {

  const BUDDIHST_YEAR_OFFSET = 543;

  const calender = createThaiCalender(caLINEdar);

  it("should tell valid dates", () => {
    const dates = [
      [2561],
      [2561, 6],
      [2561, 6, 6]
    ];
    dates.forEach(d => {
      expect(calender.isDateInCalendar(...d)).toBe(true);
    });
  });

  it("should tell invalid dates", () => {
    const dates = [
      [642],
      [2018, 12],
      [2018, 1, 29]
    ];
    dates.forEach(d => {
      expect(calender.isDateInCalendar(...d)).toBe(false);
    });
  });

  it("should provide date strings placeholder", () => {
    expect(calender.getDateStringPlaceholder()).toBe("YYYY/MM/DD");
  });

  it("should return date string format", () => {
    const dateFormats = [
      {
        date: [2561, 6, 6],
        expected: { 
          year: { pos: 0, text: '2561' },
          month: { pos: 1, text: 'ก.ค.' },
          date: { pos: 2, text: '06' },
          delimiter: '/'
        }
      },
      {
        date: [2561, 6],
        expected: { 
          year: { pos: 0, text: '2561' },
          month: { pos: 1, text: 'ก.ค.' },
          delimiter: '/'
        }
      },
      {
        date: [null, 6, 6],
        expected: { 
          month: { pos: 0, text: 'ก.ค.' },
          date: { pos: 1, text: '06' },
          delimiter: '/'
        }
      },
    ];
    dateFormats.forEach(d => {
      let format = calender.getDateStringFormat(...d.date);
      expect(JSON.stringify(format)).toBe(JSON.stringify(d.expected));
    });
  });

  it("should always return a valid now date", () => {
    let now = calender.getNow();
    let expected = new Date(now.year, now.month, now.date);
    // Just like the StandardCalendar.
    // If valid, we can always expect the consistent values
    expect(now.year).toBe(expected.getFullYear());
    expect(now.month).toBe(expected.getMonth());
    expect(now.date).toBe(expected.getDate());
    // Make sure we are in the Buddhist year
    let buddhstYear = (new Date()).getFullYear() + BUDDIHST_YEAR_OFFSET;
    expect(now.year).toBe(buddhstYear);
  });

  it("should return months supported", () => {
    let expected = [ 
      { text: 'ม.ค.', value: 0 },
      { text: 'ก.พ.', value: 1 },
      { text: 'มี.ค.', value: 2 },
      { text: 'เม.ย.', value: 3 },
      { text: 'พ.ค.', value: 4 },
      { text: 'มิ.ย.', value: 5 },
      { text: 'ก.ค.', value: 6 },
      { text: 'ส.ค.', value: 7 },
      { text: 'ก.ย.', value: 8 },
      { text: 'ต.ค.', value: 9 },
      { text: 'พ.ย.', value: 10 },
      { text: 'ธ.ค.', value: 11 }
    ];
    let months = calender.getMonths();
    expect(JSON.stringify(months)).toBe(JSON.stringify(expected));
  });

  it("should return days supported", () => {
    let expected = [
      { text: 'อา.', value: 0 },
      { text: 'จ.', value: 1 },
      { text: 'อ.', value: 2 },
      { text: 'พ.', value: 3 },
      { text: 'พฤ.', value: 4 },
      { text: 'ศ.', value: 5 },
      { text: 'ส.', value: 6 }
    ];
    let days = calender.getDays();
    expect(JSON.stringify(days)).toBe(JSON.stringify(expected));
  });

  it("should return dates", () => {
    let expected = [ 
      { year: 2561, month: 3, date: 1, day: 0, holiday: true },
      { year: 2561, month: 3, date: 2, day: 1, holiday: false },
      { year: 2561, month: 3, date: 3, day: 2, holiday: false },
      { year: 2561, month: 3, date: 4, day: 3, holiday: false },
      { year: 2561, month: 3, date: 5, day: 4, holiday: false },
      { year: 2561, month: 3, date: 6, day: 5, holiday: false },
      { year: 2561, month: 3, date: 7, day: 6, holiday: false },
      { year: 2561, month: 3, date: 8, day: 0, holiday: true },
      { year: 2561, month: 3, date: 9, day: 1, holiday: false },
      { year: 2561, month: 3, date: 10, day: 2, holiday: false },
      { year: 2561, month: 3, date: 11, day: 3, holiday: false },
      { year: 2561, month: 3, date: 12, day: 4, holiday: false },
      { year: 2561, month: 3, date: 13, day: 5, holiday: false },
      { year: 2561, month: 3, date: 14, day: 6, holiday: false },
      { year: 2561, month: 3, date: 15, day: 0, holiday: true },
      { year: 2561, month: 3, date: 16, day: 1, holiday: false },
      { year: 2561, month: 3, date: 17, day: 2, holiday: false },
      { year: 2561, month: 3, date: 18, day: 3, holiday: false },
      { year: 2561, month: 3, date: 19, day: 4, holiday: false },
      { year: 2561, month: 3, date: 20, day: 5, holiday: false },
      { year: 2561, month: 3, date: 21, day: 6, holiday: false },
      { year: 2561, month: 3, date: 22, day: 0, holiday: true },
      { year: 2561, month: 3, date: 23, day: 1, holiday: false },
      { year: 2561, month: 3, date: 24, day: 2, holiday: false },
      { year: 2561, month: 3, date: 25, day: 3, holiday: false },
      { year: 2561, month: 3, date: 26, day: 4, holiday: false },
      { year: 2561, month: 3, date: 27, day: 5, holiday: false },
      { year: 2561, month: 3, date: 28, day: 6, holiday: false },
      { year: 2561, month: 3, date: 29, day: 0, holiday: true },
      { year: 2561, month: 3, date: 30, day: 1, holiday: false }
    ];
    let dates = calender.getDates(2561, 3);
    expect(JSON.stringify(dates)).toBe(JSON.stringify(expected));
  });

  it("should convert a local date to a js date", () => {
    let local = [
      2016 + BUDDIHST_YEAR_OFFSET,
      9,
      17
    ];
    let expected = {
      year: 2016,
      month: 9,
      date: 17
    };
    let jsDate = calender.convertLocalDate2JSDate(...local);
    expect(JSON.stringify(jsDate)).toBe(JSON.stringify(expected));
  });

  it("should convert a js date to a local date", () => {
    let jsDate = [
      2016,
      9,
      17
    ];
    let expected = {
      year: 2016 + BUDDIHST_YEAR_OFFSET,
      month: 9,
      date: 17
    };
    let local = calender.convertJSDate2LocalDate(...jsDate);
    expect(JSON.stringify(local)).toBe(JSON.stringify(expected));
  });
});
