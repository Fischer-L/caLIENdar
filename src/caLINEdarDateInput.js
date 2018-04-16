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
    input.addEventListener(caLINEdar.EVENT_PICKER_CLICK, this._onPickerClick);
    input.addEventListener(caLINEdar.EVENT_CLICK_OUTSIDE_PICKER, this._onClickOutside);
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

    this._jsDate = newDate;
    this._localDate = local;
    this.input.value = calendar.toLocaleDateString(this._jsDate);
    return true;
  }

  clearDate() {
    this._jsDate =
    this._localDate = null;
    this.input.value = this._calendar.getDateStringPlaceholder();
  }

  /**
   * Open the calendar to let user pick a date
   */
  openCalendar() {
    let datePicked = this._localDate;
    let dateLocal = datePicked || this._calendar.getNow({ fallback: "last-date" });
    let params = this._getDatePickerParams(dateLocal.year, dateLocal.month, datePicked);
    this.caLINEdar.openCalendar(this.input, params);
  }

  // Public APIs end

  // DOM events

  onFocus = e => {
    if (this.caLINEdar.getCurrentDateInput() !== this) {
      this.caLINEdar.setCurrentDateInput(this);
      // Open in the next tick. Don't block the event.
      this._win.requestAnimationFrame(() => this.openCalendar());
    } else {
      if (!this.caLINEdar.isCalendarOpen()) {
        this._win.requestAnimationFrame(() => this.openCalendar());
      }
    }
  }

  // DOM events end

  // caLINEdar events

  _onClickOutside = e => {
    this.caLINEdar.closeCalendar();
  }
  
  _onPickerClick = async e => {
    e.preventDefault();
    e.stopPropagation();

    // When clicking outside the input, it will lose focus,
    // which will cause the calendar closed.
    await this._ensureFocus();

    let { picker, target } = e.detail;

    let cls = target.classList;
    if (cls.contains("caLINEdar-panel__btn")) {
      this._onPanelButtonClick(picker, target);
    } else if (
      cls.contains("caLINEdar-table-cell") &&
      target.tagName.toLowerCase() === "td"
    ) {
      this._onPick(picker, target);
    }
  }

  _onPanelButtonClick(picker, target) {
    let value = this._unserializeValue(
      picker.getAttribute("data-caLINEdar-value"));
    switch (picker.id) {
      case this.caLINEdar.ID_DATE_PICKER:
        if (target.classList.contains("left-btn")) {
          this._flipDatePicker(value.year, value.month, "left");
          return;
        }
        if (target.classList.contains("right-btn")) {
          this._flipDatePicker(value.year, value.month, "right");
          return;
        }

        let btnValue = target.getAttribute("data-caLINEdar-value");
        if (btnValue === "year-picker-btn") {
          this._showYearPicker(value.year, value.year);
          return;
        }
        if (btnValue === "month-picker-btn") {
          this._showMonthPicker(value.year, value.month);
          return;
        }
        break;

      case this.caLINEdar.ID_YEAR_PICKER:
        if (target.classList.contains("left-btn")) {
          this._flipYearPicker(value.anchorYear, value.years, "left");
          return;
        }
        if (target.classList.contains("right-btn")) {
          this._flipYearPicker(value.anchorYear, value.years, "right");
          return;
        }
        break;
    }
  }

  _onPick(pickerId, target) {
    // TODO
  }

  // caLINEdar events end

  _showMonthPicker(year, monthPicked) {
    this.caLINEdar.showMonthPicker(this._getMonthPickerParams(year, monthPicked));
  }

  _showYearPicker(anchorYear, yearPicked) {
    this.caLINEdar.showYearPicker(this._getYearPickerParams(anchorYear, yearPicked));
  }

  _flipDatePicker(year, month, dir) {
    // TODO: utilize `dir` to do RTL
    let months = this._calendar.getMonths(year);
    let next = dir === "right";
    let target = next ? 
      this._calcNextLocalMonth(year, month, months) :
      this._calcPrevLocalMonth(year, month, months);
    let params = this._getDatePickerParams(target.year, target.month, this._localDate);
    this.caLINEdar.showDatePicker(params);
  }

  _flipYearPicker(currentYearPicked, years, dir) {
    // TODO: utilize `dir` to do RTL
    dir = dir === "right" ? 1 : -1;
    let target = currentYearPicked + dir * years.length;
    this.caLINEdar.showYearPicker(this._getYearPickerParams(target));
  }

  _getDatePickerParams(year, month, datePicked) {
    let calendar = this._calendar;
    let format = calendar.formatDateString(year, month);
    let pickerBtns = [];
    pickerBtns.push({
      text: format.year.text,
      value: "year-picker-btn",
    });
    pickerBtns.push({
      text: format.month.text,
      value: "month-picker-btn",
    });
    if (format.year.pos > format.month.pos) {
      pickerBtns.reverse();
    }

    let days = calendar.getDays();
    let weekHeaders = days.map(d => d.text);

    let dates = this._getLocalDatesToDisplay(year, month, datePicked);
    
    let value = this._serializeValue({ year, month });
    return {
      dates,
      value,
      pickerBtns,
      weekHeaders,
    };
  }

  _getMonthPickerParams(year, monthPicked) {
    let months = this._calendar.getMonths(year);
    months = months.map(m => {
      m.picked = m.value === monthPicked;
      return m;
    });
    let value = this._serializeValue({ month: monthPicked });
    return {
      value,
      months
    };
  }

  _getYearPickerParams(anchorYear, yearPicked) {
    const COUNT = this.caLINEdar.MAX_COUNT_YEAR_IN_YEAR_PICKER;
    // Collect years to pick (try to put the piced year in the center)
    let years = [];
    let half = Math.floor(COUNT / 2);
    for (let i = half; i > 0; --i) {
      years.push(anchorYear - i);
    }
    years.push(anchorYear);
    let rest = COUNT - years.length;
    for (let i = 1; i <= rest; ++i) {
      years.push(anchorYear + i);
    }

    let noMoreLeft = !this._calendar.isDateInCalendar(years[0] - 1);
    let noMoreRight = !this._calendar.isDateInCalendar(years[COUNT - 1] + 1);

    // Remove years not in the calendar
    years = years.reduce((ys, y) => {
      if (this._calendar.isDateInCalendar(y)) {
        ys.push(y);
      }
      return ys;
    }, []);

    // Build the pramas
    let value = this._serializeValue({ 
      anchorYear,
      years: years.slice()
    });
    years = years.map(y => {
      return {
        text: y,
        value: y,
        picked: y === yearPicked
      };
    });
    return {
      value,
      years,
      noMoreLeft,
      noMoreRight,
    };
  }

  async _ensureFocus() {
    let refocus = () => {
      this._win.requestAnimationFrame(() => this.input.focus());
    };

    if (this._win.document.activeElement === this.input) {
      // The case that we are about to lose focus so stop it.
      let stopBlur = () => {
        this.input.removeEventListener("blur", stopBlur);
        refocus();
      };
      this.input.addEventListener("blur", stopBlur);
    } else {
      // The case that we lose focus but we shouldn't.
      if (!this.caLINEdar.isCalendarOpen()) {
        // The calendar shouldn't be closed 
        // so restore the calendar asap.
        await this.openCalendar();
      }
      refocus();
    }
  }

  _datesEqual(a, b) {
    return a && b && 
           a.year === b.year && 
           a.month === b.month && 
           a.date === b.date;
  }

  _serializeValue(date) {
    return JSON.stringify(date);
  }

  _unserializeValue(dateStr) {
    return JSON.parse(dateStr);
  }

  _calcPrevLocalMonth(year, month, months) {
    let currMonthIdx = months.findIndex(m => m.value === month);
    let prevYear = year;
    let prevMonth = -1;
    if (currMonthIdx === 0) {
      // OK the previous month is the last month in the last year
      prevYear -= 1;
      prevMonth = months[months.length - 1].value;
    } else {
      prevMonth = months[currMonthIdx - 1].value;
    }
    return {
      year: prevYear,
      month: prevMonth
    };
  }

  _calcNextLocalMonth(year, month, months) {
    let currMonthIdx = months.findIndex(m => m.value === month);
    let nextYear = year;
    let nextMonth = -1;
    if (currMonthIdx === months.length - 1) {
      // OK the next month is the 1st month in the next year
      nextYear += 1;
      nextMonth = months[0].value;
    } else {
      nextMonth = months[currMonthIdx + 1].value;
    }
    return {
      year: nextYear,
      month: nextMonth
    };
  }

  _getLocalDatesToDisplay(year, month, datePicked) {
    let calendar = this._calendar;
    let days = calendar.getDays();
    let months = calendar.getMonths(year);
    let dates = calendar.getDates(year, month);
  
    // For example maybe the 1st date is on Wed.
    // Then we are having 3 empty dates in the start
    let firstDayIdx = days.findIndex(d => d.value === dates[0].day);
    let emptyCountInStart = firstDayIdx;
    let prevDates = null;
    if (emptyCountInStart > 0) {
      let prev = this._calcPrevLocalMonth(year, month, months);
      prevDates = calendar.getDates(prev.year, prev.month);
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
      let next = this._calcNextLocalMonth(year, month, months);
      nextDates = calendar.getDates(next.year, next.month);
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
      d.value = this._serializeValue(d);
    });
    return dates;
  }
}

module.exports = CaLINEdarDateInput;
