class CaLINEdarDateInput {
  // Public APIs

  constructor(params) {
    let {
      date,
      input,
      calendar,
      caLINEdar,
    } = params;

    this.input = input;
    this.caLINEdar = caLINEdar;

    this._calendar = calendar;

    this.setDate(date);

    input.addEventListener("focus", this.onFocus);
  }

  /**
   * @param date {Date|Integer} The date to set.
   *                            Important: this date should based on the unix time.
   * @return {bool} `true` if set or `false`
   */
  setDate(date) {
    let newDate = null;
    if (date instanceof Date) {
      newDate = date;
    } else if (Number.isInteger(date)) {
      newDate = new Date(date);
    }
    
    if (newDate === null) {
      return false;
    }

    let calendar = this._calendar;
    let local = calendar.convertJSDate2LocalDate(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );

    if (!local) {
      // Don't throw because not a big idea that unable to set a date.
      // However to throw may cause apps go broken down,
      // we don't want our user unable to use the rest of app.
      // But still warn about this case.
      let msg = `CaLINEdarDateInput setDate failed `;
      msg += `because the date: ${date} is unable to be converted into the calendar date`;
      console.warn(msg);
      return false;
    }

    this._date = newDate;
    this._dateLocal = local;

    let dateString = calendar.formatDateString(local.year, local.month, local.date);
    let token = dateString.pop();
    this.input.value = dateString.join(token);

    return true;
  }

  // Public APIs end

  // Events

  onFocus = e => {
    this.caLINEdar.setCurrentDateInput(this);
  }

  // Events end
}

module.exports = CaLINEdarDateInput;
