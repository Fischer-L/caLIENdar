class CaLINEdarDateInput {
  // Public APIs

  /**
   * @param params {Object}
   *    The params provided by users
   *    - date {*} Optional. See `setDate`
   *    - calendar {CaLINEdarCalender} The calendar so we can get dates to pick
   *
   *    The params provided by our caLINEdar lib.
   *    Usually a user doesn't have to provide these for the daily usage.
   *    Having these is for the case if we want to do testing in the future.
   *    - caLINEdar {Object} the caLINEdar object
   *    - input {HTMLInputElement} one input element
   *    - window {Window} the global Window instance
   */
  constructor(params) {
    let {
      date,
      input,
      calendar,
      caLINEdar,
    } = params;

    this.input = input;
    this.caLINEdar = caLINEdar;

    this._win = params.window;
    this._calendar = calendar;

    if (!this.setDate(date)) {
      this.clearDate();
    }

    input.addEventListener("focus", this.onFocus);
    input.addEventListener("blur", this.onBlur);
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
    } else if (this.caLINEdar.isInt(date)) {
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
    this.input.value = calendar.toLocaleDateString(this._date);
    return true;
  }

  clearDate() {
    this._date =
    this._dateLocal = null;
    let dateString = iranCalendar.formatDateString(
      null, null, null, {
      fallbackToPlaceholder : true
    });
    let token = dateString.pop();
    this.input.value = dateString.join(token);
  }

  /**
   * Open the calendar to let user pick a date
   */
  openCalendar() {
    let calendar = this._calendar;
    let datePicked = this._dateLocal;;
    let dateLocal = datePicked || calendar.getNow({ fallback: "last-date" });

    let dateString = calendar.formatDateString(dateLocal.year, dateLocal.month);
    let pickerBtns = [
      {
        text: dateString[0],
        value: "date-picker-btn-0",
      },
      {
        text: dateString[1],
        value: "date-picker-btn-1",
      }
    ];
    
    let days = calendar.getDays();
    let weekHeaders = days.map(d => d.text);
    let dates = this._getLocalDatesToDisplay(dateLocal.year, dateLocal.month, datePicked);
    this.caLINEdar.openCalendar(this.input, pickerBtns, weekHeaders, dates);
  }

  // Public APIs end

  // DOM events

  onFocus = e => {
    this.caLINEdar.setCurrentDateInput(this);
    // Open in the next tick. Don't block the event.
    this._win.requestAnimationFrame(() => this.openCalendar());
  }

  onBlur = e => {
    this.caLINEdar.closeCalendar();
  }

  // DOM events end

  _datesEqual(a, b) {
    return a && b && 
           a.year === b.year && 
           a.month === b.month && 
           a.date === b.date;
  }

  _serializeLocalDate(date) {
    return `${date.year}-${date.month}-${date.date}`;
  }

  _unserializeLocalDate(dateStr) {
    dateStr = dateStr.split("-");
    return {
      year: dateStr[0],
      month: dateStr[1],
      date: dateStr[2]
    }
  }

  _getLocalDatesToDisplay(year, month, datePicked) {
    let calendar = this._calendar;
    let days = calendar.getDays();
    let months = calendar.getMonths(year);
    let dates = calendar.getDates(year, month);

    let currMonthIdx = months.findIndex(m => m.value === month);
    let firstDayIdx = days.findIndex(d => d.value === dates[0].day);

    // For example maybe the 1st date is on Wed.
    // Then we are having 3 empty dates in the start
    let emptyCountInStart = firstDayIdx;
    let prevDates = null;
    if (emptyCountInStart > 0) {
      let prevYear = year;
      let prevMonth = -1;
      if (currMonthIdx === 0) {
        // OK the previous month is the last month in the last year
        prevYear -= 1;
        prevMonth = months[months.length - 1].value;
      } else {
        prevMonth = months[currMonthIdx - 1].value;
      }
      prevDates = calendar.getDates(prevYear, prevMonth);
    }
    if (prevDates) {
      for (let i = prevDates.length - 1; emptyCountInStart > 0;) {
        prevDates[i].grayOut = true;
        dates.unshift(prevDates[i]);
        --i;
        --emptyCountInStart;
      }
    }

    // Let's see how many empty dates in the tail
    let emptyCountInTail = this.caLINEdar.MAX_COUNT_DATES_IN_DATE_PICKER - dates.length;
    let nextDates = null;
    if (emptyCountInTail > 0) {
      let nextYear = year;
      let nextMonth = -1;
      if (currMonthIdx === months.length - 1) {
        // OK the next month is the 1st month in the next year
        nextYear += 1;
        nextMonth = months[0].value;
      } else {
        nextMonth = months[currMonthIdx + 1].value;
      }
      nextDates = calendar.getDates(nextYear, nextMonth);
    }
    if (nextDates) {
      for (let i = 0; emptyCountInTail > 0;) {
        nextDates[i].grayOut = true;
        dates.push(nextDates[i]);
        ++i;
        --emptyCountInTail;
      } 
    }

    dates.forEach(d => {
      d.special = d.holiday && !d.grayOut;
      d.picked = this._datesEqual(d, datePicked);
      d.text = "" + d.date;
      d.value = this._serializeLocalDate(d);
    });
    return dates;
  }
}

module.exports = CaLINEdarDateInput;
