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
      let format = calender.formatDateString(...d.date);
      expect(JSON.stringify(format)).toBe(JSON.stringify(d.expected));
    });
  });

});
