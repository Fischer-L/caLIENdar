class CaLINEdarCalender {

  /**
   * Check a date in the calendar or not.
   * Notice: since it checks against the calendar,
   * the given year, month, date should based on the calendar's *local* time.
   *
   * @param year {Integer} the year value per this calendar
   * @param month {Integer} Optional. the month value per this calendar
   * @param date {Integer} Optional. the date value per this calendar
   *                       Only useful when `month` is given too.
   * 
   * @return {bool} `true` date in the calendar or `false`
   */
  isDateInCalendar(year, month, date) {
    throw new Error("isDateInCalendar not implemented");
  }

  /**
   * @param year {integer} Optional. the year value per this calendar
   * @param month {Integer} Optional. the month value per this calendar
   * @param date {Integer} Optional. the date value per this calendar
   *                       Only useful when `month` is given too.
   * @param params {Object} Optional. Should provide the below options:
   *    - fallbackToPlaceholder {bool} Optional. If failed at formatting,
   *      should return the placeholder for "YYYY", "MM", "DD",
   *      such as `["YYYY", "MM", "DD", "/"]`, so at least users can have a fallback to follow.
   *
   * @return {Array} 
   *    For example There is a JS Date-based calendar and a date as `new Date(2018, 3, 10)`.
   *    Calling `formatDateString(2018, 3, 10)` would return `[ "2018", "Apr", "10", "/" ]`,
   *    which means this calendar prefers a date string format as "2018/Apr/10".
   *    The main purpose of this method is to let users know the prefered format and order
   *    of the date string of this calendar. If unable to format, `null`
   */
  formatDateString(year, month, date, params) {
    throw new Error("formatDateString not implemented");
  }

  /**
   * @param jsDate {Date} a JS Date object
   *
   * @return {String}
   *    The date string formated into this calendar's locale.
   *    `""` if unable to format one.
   */
  toLocaleDateString(jsDate) {
    throw new Error("toLocaleDateString not implemented");
  }

  /**
   * Get today's date values per this calendar
   *
   * @params options {Object} Options are:
   *    - fallback {String} "1st-date" | "last-date"
   *
   * @return {Object} 
   *    An object with
   *    - year {integer} the today's year value per this calendar
   *    - month {integer} the today's month value per this calendar
   *    - date {integer} the today's date value per this calendar
   *    But if unable to get one (Maybe some custom calendar has really a limited date range),
   *    `null` returned if no `fallback` option
   *    The 1st/last date in this calendar if `fallback` option given
   */
  getNow(options) {
    throw new Error("getNow not implemented");
  }

  /**
   * @params {Array}
   *    One array of objects representing months.
   *    The 1st one is the 1st month. Each month object is as below:
   *    - text {String} The title of this month
   *    - value {Integer} The unique value representing this month
   */
  getMonths(year) {
    throw new Error("getMonths not implemented");
  }

  /**
   * @params {Array}
   *    One array of objects representing a day in a week.
   *    The 1st one is the 1st day. Each day object is as below:
   *    - text {String} The title of this day
   *    - value {Integer} The unique value representing this day
   */
  getDays() {
    throw new Error("getDays not implemented");
  }

  /**
   * @param year {Integer} the year value per this calendar
   * @param month {Integer} the month value per this calendar
   *
   * @return dates {Array}
   *    An array of dates per this calendar in the given year and month.
   *    Each date is an object with:
   *    - year {Integer} The unique year value
   *    - month {Integer} The unique month value
   *    - date {Integer} The unique date value
   *    - day {Integer} The unique day value
   *    - holiday {bool} whether this date is a holiday or not
   *    Or `null` if unable to get for the given year and month
   */
  getDates(year, month) {
    throw new Error("getDates not implemented");
  }

  convertLocalDate2JSDate(year, month, date) {
    throw new Error("convertLocalDate2JSDate not implemented");
  }

  /**
   * @param year {Integer} the year value per JS Date
   * @param month {Integer} the month value per JS Date
   * @param date {Integer} the date value per JS Date
   *
   * @return {Object} An object with
   *                  - year {integer} the year value per this calendar
   *                  - month {integer} the month value per this calendar
   *                  - date {integer} the date value per this calendar
   *                  Or `null` if unable to convert
   */
  convertJSDate2LocalDate(year, month, date) {
    throw new Error("convertJSDate2LocalDate not implemented");
  }
}

module.exports = CaLINEdarCalender;
