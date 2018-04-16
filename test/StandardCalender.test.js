import testUtil from "./testUtil";
import caLINEdar from "../src/caLINEdar";
import createStandardCalender from "../src/StandardCalender";

describe("StandardCalender", () => {

  const calender = createStandardCalender(caLINEdar);

  it("should tell valid dates", () => {
    const dates = [
      [2018],
      [2018, 6],
      [2018, 6, 6]
    ];
    dates.forEach(d => {
      expect(calender.isDateInCalendar(...d)).toBe(true);
    });
  });

  it("should tell invalid dates", () => {
    const dates = [
      [99],
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

  it("should format date strings", () => {
    const dateFormats = [
      {
        date: [2018, 6, 6],
        expected: { 
          year: { pos: 0, text: '2018' },
          month: { pos: 1, text: 'Jul' },
          date: { pos: 2, text: '06' },
          delimiter: '/'
        }
      },
      {
        date: [2018, 6],
        expected: { 
          year: { pos: 0, text: '2018' },
          month: { pos: 1, text: 'Jul' },
          delimiter: '/'
        }
      },
      {
        date: [null, 6, 6],
        expected: { 
          month: { pos: 0, text: 'Jul' },
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
    // If valid, we can always expect the consistent values
    expect(now.year).toBe(expected.getFullYear());
    expect(now.month).toBe(expected.getMonth());
    expect(now.date).toBe(expected.getDate());
  });

  it("should return months supported", () => {
    let expected = [ 
      { text: 'Jan', value: 0 },
      { text: 'Feb', value: 1 },
      { text: 'Mar', value: 2 },
      { text: 'Apr', value: 3 },
      { text: 'May', value: 4 },
      { text: 'Jun', value: 5 },
      { text: 'Jul', value: 6 },
      { text: 'Aug', value: 7 },
      { text: 'Sep', value: 8 },
      { text: 'Oct', value: 9 },
      { text: 'Nov', value: 10 },
      { text: 'Dec', value: 11 }
    ];
    let months = calender.getMonths();
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
    let days = calender.getDays();
    expect(JSON.stringify(days)).toBe(JSON.stringify(expected));
  });


  it("should return dates", () => {
    let expected = [ 
      { year: 2018, month: 3, date: 1, day: 0, holiday: true },
      { year: 2018, month: 3, date: 2, day: 1, holiday: false },
      { year: 2018, month: 3, date: 3, day: 2, holiday: false },
      { year: 2018, month: 3, date: 4, day: 3, holiday: false },
      { year: 2018, month: 3, date: 5, day: 4, holiday: false },
      { year: 2018, month: 3, date: 6, day: 5, holiday: false },
      { year: 2018, month: 3, date: 7, day: 6, holiday: false },
      { year: 2018, month: 3, date: 8, day: 0, holiday: true },
      { year: 2018, month: 3, date: 9, day: 1, holiday: false },
      { year: 2018, month: 3, date: 10, day: 2, holiday: false },
      { year: 2018, month: 3, date: 11, day: 3, holiday: false },
      { year: 2018, month: 3, date: 12, day: 4, holiday: false },
      { year: 2018, month: 3, date: 13, day: 5, holiday: false },
      { year: 2018, month: 3, date: 14, day: 6, holiday: false },
      { year: 2018, month: 3, date: 15, day: 0, holiday: true },
      { year: 2018, month: 3, date: 16, day: 1, holiday: false },
      { year: 2018, month: 3, date: 17, day: 2, holiday: false },
      { year: 2018, month: 3, date: 18, day: 3, holiday: false },
      { year: 2018, month: 3, date: 19, day: 4, holiday: false },
      { year: 2018, month: 3, date: 20, day: 5, holiday: false },
      { year: 2018, month: 3, date: 21, day: 6, holiday: false },
      { year: 2018, month: 3, date: 22, day: 0, holiday: true },
      { year: 2018, month: 3, date: 23, day: 1, holiday: false },
      { year: 2018, month: 3, date: 24, day: 2, holiday: false },
      { year: 2018, month: 3, date: 25, day: 3, holiday: false },
      { year: 2018, month: 3, date: 26, day: 4, holiday: false },
      { year: 2018, month: 3, date: 27, day: 5, holiday: false },
      { year: 2018, month: 3, date: 28, day: 6, holiday: false },
      { year: 2018, month: 3, date: 29, day: 0, holiday: true },
      { year: 2018, month: 3, date: 30, day: 1, holiday: false }
    ];
    let dates = calender.getDates(2018, 3);
    expect(JSON.stringify(dates)).toBe(JSON.stringify(expected));
  });

  it("should always treat a local date the same as a js date", () => {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let date = now.getDate();

    let jsDate = calender.convertJSDate2LocalDate(year, month, date);
    expect(year).toBe(jsDate.year);
    expect(month).toBe(jsDate.month);
    expect(date).toBe(jsDate.date);

    let localDate = calender.convertLocalDate2JSDate(year, month, date);
    expect(year).toBe(localDate.year);
    expect(month).toBe(localDate.month);
    expect(date).toBe(localDate.date);
  });
});
