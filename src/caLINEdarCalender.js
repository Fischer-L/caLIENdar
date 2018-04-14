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
   * @param year {integer} the year value per this calendar
   * @param month {integer} the month value per this calendar
   * @param date {integer} the date value per this calendar
   *
   * @return {Array} If done, for example, `[ "2018", "Apr", "10", "/" ]`, which means
   *                 this calendar prefers a date string format as "2018/Apr/10".
   *                 If unable to format, `null`
   */
  formatDateString(year, month, date) {
    throw new Error("formatDateString not implemented");
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

  getMonths(year) {
    throw new Error("getMonths not implemented");
  }

  getDays() {
    throw new Error("getDays not implemented");
  }

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
