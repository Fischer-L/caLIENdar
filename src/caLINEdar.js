import CaLINEdarCalender from "./caLINEdarCalender";
import CaLINEdarDateInput from "./caLINEdarDateInput";

const caLINEdar = {
  /** Public APIs **/

  CaLINEdarCalender,
  CaLINEdarDateInput,

  init(win) {
    this._win = win;
    this._doc = win.document;
    this._createCalendarHolder();

    win.addEventListener("click", e => this._onClick(e));
    win.addEventListener("touchend", e => this._onClick(e));
  },

  /**
   * @param params {Object} the parameters to create a `CaLINEdarDateInput`, including
   *    - mountElem {HTMLElement} The element where the input element sits. 
   *                              One input element will be created for you so don't pass another one.
   *    - The parameters for constructing `CaLINEdarDateInput` so please refer to that.
   *
   * @return {CaLINEdarDateInput} An instance of `CaLINEdarDateInput`
   */
  createDateInput(params) {
    let {
      mountElem
    } = params;

    if (!mountElem || !mountElem.appendChild) {
      throw new Error(`Must provide a mounting element to mount the date input`);
    }

    let input = this._createInput();
    let dateInputParams = Object.assign({}, params, { 
      input, 
      caLINEdar: this,
      window: this._win
    });
    delete dateInputParams.mountElem; // Delete unnecessary params
    let dateInput = new this.CaLINEdarDateInput(dateInputParams);
    mountElem.appendChild(input);
    return dateInput;
  },

  /**
   * @param dateInput {CaLINEdarDateInput} the `dateInput` to set as the current one
   */
  setCurrentDateInput(dateInput) {
    if (!dateInput || this._dateInput === dateInput) {
      return;
    }
    this._dateInput = dateInput;
  },

  /**
   * @return {CaLINEdarDateInput} The current date input associated. `null` if none.
   */
  getCurrentDateInput() {
    return this._dateInput || null;
  },

  isLeapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  },

  /**
   * @return {Date} A JS Date object meaning right now in the local time
   */
  getNowInLocalTimezone() {
    // First make sure the time is always zero UTC offset. 
    let now = (new Date()).toISOString();
    let YYYY = parseInt(now.substr(0, 4));
    let MM = parseInt(now.substr(5, 2)) - 1;
    let DD = parseInt(now.substr(8, 2));
    let hh = parseInt(now.substr(11, 2));
    let mm = parseInt(now.substr(14, 2));
    let ss = parseInt(now.substr(17, 2));
    now = new Date(YYYY, MM, DD, hh, mm, ss);

    // Recalculate `now` based on the timezone
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  },

  /**
   * @param v {*} The value to test
   * @return {bool} `true` if the given `v` beloings to Integer or `false`
   */
  isInt(v) {
    if (Number.isInteger) {
      return Number.isInteger(v);
    }
    // OK We are seeing IE!?
    if (isNaN(v)) {
      return false;
    }
    let x = parseFloat(v);
    return (x | 0) === x;
  },
  async positionCalendar(window, anchorInput) {
    if (!this._calendar) {
      return;
    }
    return new Promise(resolve => {
      window.requestAnimationFrame(() => {
        let winW = window.innerWidth;
        let winH = window.innerHeight;

        let calendarW = parseInt(this._calendar.getAttribute("data-caLINEdar-width"));
        let calendarH = parseInt(this._calendar.getAttribute("data-caLINEdar-height"));
        if (!calendarW) {
          // `getBoundingClientRect` is expensive so cache it. 
          let rect = this._calendar.getBoundingClientRect();
          calendarW = rect.width;
          calendarH = rect.height;
          this._calendar.setAttribute("data-caLINEdar-width", calendarW);
          this._calendar.setAttribute("data-caLINEdar-height", calendarH)
        }

        // Unfortunately, we can't cache `anchorInput`
        // because its dimesion may change, not in our control.
        let inputRect = anchorInput.getBoundingClientRect();

        // First decdie our calendar on top of or below `anchorInput`
        if (winH - inputRect.bottom > calendarH + 10) {
          // OK there is enough room below `anchorInput`
          this._calendar.classList.remove("on-top");
          this._calendar.style.top = (inputRect.bottom + 8) + "px";
        } else {
          this._calendar.classList.add("on-top");
          this._calendar.style.top = (inputRect.top - calendarH - 8) + "px";
        }

        // Second decdie our calendar's horizontal postion
        if (winW - inputRect.left > calendarW + 10) {
          // OK there is enough room on the right side of `anchorInput`
          this._calendar.classList.remove("arrow-on-right");
          this._calendar.style.left = inputRect.left + "px";
        } else {
          this._calendar.classList.add("arrow-on-right");
          this._calendar.style.left = (inputRect.right - calendarW) + "px";
        }

        resolve();
      });
    });
  },

  isCalendarOpen() {
    return this._calendar && this._calendar.hasAttribute("data-caLINEdar-opened");
  },

  /**
   * Open the calendar. Always open the date picker first.
   *
   * @param anchorInput {HTMLInputElement} the input at which the calendar is anchor
   * @param pickerBtns, weekHeaders, dates {*} See `showDatePicker`
   *
   * @return {Promise} A promise
   */
  async openCalendar(anchorInput, pickerBtns, weekHeaders, dates) {
    if (!this._calendar) {
      console.warn("Please call `init` first then manipuate the calendar");
      return;
    }

    this._calendar.style.display = "";
    // Set `hidden` first then remove it after positioning.
    // This is to avoid a *flash* during positioning.
    this._calendar.style.visibility = "hidden";
    this._calendar.setAttribute("data-caLINEdar-opened", true);
    await this.showDatePicker(pickerBtns, weekHeaders, dates);
    // Let's always position the calendar after our picker is populated
    // so as to make sure the correct dimension is layouted when positioning. 
    await this.positionCalendar(this._win, anchorInput);
    this._calendar.style.visibility = "";
  },

  closeCalendar() {
    if (!this._calendar) {
      console.warn("Please call `init` first then manipuate the calendar");
      return;
    }
    this._calendar.style.display = "none";
    this._calendar.removeAttribute("data-caLINEdar-opened");
  },

  /**
   * Must always call `openCalendar` first to have the calendar opened.
   *
   * @param pickerBtns {Array} represent the buttons on the top of the picker.
   *                            Each button should contains
   *                            - text {String} the button title
   *                            - value {String} the data attribute value for this button,
   *                              which will be used to identify this button when clicking.
   *
   * @param weekHeaders {Array} The titles of days in a week (count is 7).
   *                             The 1st one is displayed in the left-most.
   *
   * @param dates {Array} 
   *    An array (count is `MAX_COUNT_DATES_IN_DATE_PICKER`) of dates to display. Each date is an object with
   *    - text {String} The title of this date
   *    - value {Integer} The data attribute value identifying this date
   *    - picked {bool} whether this date is picked
   *    - special {bool} whether this date should be highlighted as special
   *    - grayOut {bool} whether this date should be gray out (Win over `special`)
   */
  showDatePicker(pickerBtns, weekHeaders, dates) {
    if (!this.isCalendarOpen()) {
      console.warn("Should open the calendar once first then show the date picker");
      return;
    }
    if (!this._datePicker) {
      // Yes we do the lazy creation for all the date, month, year pickers.
      this._datePicker = this._createEmptyPicker({
        id: this.ID_DATE_PICKER,
        pickerBtnCount: 2,
        headerCount: 7,
        cellCount: 7,
        rowCount: 6,
      });
      this._datePicker.classList.add("caLINEdar-date-picker");
      this._calendar.appendChild(this._datePicker);
    }
    this.closeYearPicker();
    this.closeMonthPicker();
    this._datePicker.style.display = "";
    return this._updateDatePicker(pickerBtns, weekHeaders, dates);
  },

  /**
   * Close the data picker
   */
  closeDatePicker() {
    if (this._datePicker) {
      this._datePicker.style.display = "none";
    }
  },

  showMonthPicker(months) {
    if (!this.isCalendarOpen()) {
      console.warn("Should open the calendar once first then show the month picker");
      return;
    }
    if (!this._monthPicker) {
      this._monthPicker = this._createEmptyPicker({
        id: this.ID_MONTH_PICKER,
        pickerBtnCount: 1,
        headerCount: 0,
        cellCount: 4,
        rowCount: 3,
      });
      this._monthPicker.classList.add("caLINEdar-month-picker");
      this._calendar.appendChild(this._monthPicker);
    }
    this.closeDatePicker();
    this.closeYearPicker();
    this._monthPicker.style.display = "";
    return this._updateMonthPicker(months);
  },

  closeMonthPicker() {
    if (this._monthPicker) {
      this._monthPicker.style.display = "none";
    }
  },

  showYearPicker(years) {
    if (!this.isCalendarOpen()) {
      console.warn("Should open the calendar once first then show the year picker");
      return;
    }
    if (!this._yearPicker) {
      this._yearPicker = this._createEmptyPicker({
        id: this.ID_YEAR_PICKER,
        pickerBtnCount: 1,
        headerCount: 0,
        cellCount: 3,
        rowCount: 3,
      });
      this._yearPicker.classList.add("caLINEdar-year-picker");
      this._calendar.appendChild(this._yearPicker);
    }
    this.closeDatePicker();
    this.closeMonthPicker();
    this._yearPicker.style.display = "";
    return this._updateYearPicker(years);
  },

  closeYearPicker() {
    if (this._yearPicker) {
      this._yearPicker.style.display = "none";
    }
  },

  /** Public APIs end **/

  ID_DATE_PICKER: "caLINEdar-date-picker",
  ID_MONTH_PICKER: "caLINEdar-month-picker",
  ID_YEAR_PICKER: "caLINEdar-year-picker",

  EVENT_PICKER_CLICK: "caLINEdar-on-picker-click",
  EVENT_CLICK_OUTSIDE_PICKER: "caLINEdar-on-click-outside",

  MAX_COUNT_DATES_IN_DATE_PICKER: 6 * 7,

  // Events

  _onClick(e) {
    if (!this._dateInput || !this.isCalendarOpen() ) {
      // If the calendar was closed or no date input,
      // nowhere has to do with us.
      return;
    }

    if (e.target === this._dateInput.input) {
      // User is clicking on the input.
      // Has nothing to do with here too.
      return;
    }

    let picker = null;
    let node = e.target;
    while (node && !picker) {
      if (node.classList && node.classList.contains("caLINEdar-picker")) {
        picker = node;
      } else {
        node = node.parentNode;
      }
    }

    if (picker) {
      e.preventDefault();
      e.stopPropagation();
      this._notifyDateInput(this.EVENT_PICKER_CLICK, {
        target: e.target,
        pickerId: picker.id,
      });
    } else {
      this._notifyDateInput(this.EVENT_CLICK_OUTSIDE_PICKER);
    }
  },

  _notifyDateInput(eventType, detail) {
    if (this._dateInput) {
      // Why a custom event here?
      // Because we want to keep event communications
      // between caLINEdar and date input in private.
      // With the custom event, date input can listen to events 
      // without exposing any public APIs.
      let evt = new CustomEvent(eventType, { detail });
      this._dateInput.input.dispatchEvent(evt);
    }
  },

  // Events end

  async _updateDatePicker(pickerBtns, weekHeaders, dates) {
    return new Promise(resolve => {
      this._win.requestAnimationFrame(() => {
        let picker = this._datePicker;

        let btns = picker.querySelectorAll(".caLINEdar-panel__btn.picker-btn");
        for (let i = 0; i < pickerBtns.length; ++i) {
          btns[i].textContent = pickerBtns[i].text;
          btns[i].setAttribute("data-caLINEdar-value", pickerBtns[i].value);
        }

        let table = picker.querySelector(".caLINEdar-table");
        let headers = table.querySelector(".caLINEdar-table-headers")
                           .querySelectorAll(".caLINEdar-table-cell");
        for (let i = 0; i < headers.length; ++i) {
          headers[i].textContent = weekHeaders[i];
        }

        this._updateTableCells(table, dates);
        resolve();
      });
    });
  },

  _updateMonthPicker(months) {
    return new Promise(resolve => {
      this._win.requestAnimationFrame(() => {
        let picker = this._monthPicker;

        let btn = picker.querySelector(".caLINEdar-panel__btn.picker-btn");
        btn.textContent = months.find(m => m.picked).text;

        let table = picker.querySelector(".caLINEdar-table");
        this._updateTableCells(table, months);
        resolve();
      });
    });
  },

  _updateYearPicker(years) {
    return new Promise(resolve => {
      this._win.requestAnimationFrame(() => {
        let picker = this._yearPicker;

        let btn = picker.querySelector(".caLINEdar-panel__btn.picker-btn");
        btn.textContent = years.find(y => y.picked).text;

        let table = picker.querySelector(".caLINEdar-table");
        this._updateTableCells(table, years);
      });
    });
  },

  _createInput() {
    if (!this._inputTemplate) {
      this._inputTemplate = this._doc.createElement("input");
      this._inputTemplate.classList.add("caLINEdar-input");
      this._inputTemplate.type = "text";
    }
    return this._inputTemplate.cloneNode(false);
  },

  /**
   * A panel looks like below:
   * <div class="caLINEdar-panel">
   *   <div class="caLINEdar-panel__btn left-btn"></div>
   *   <div class="caLINEdar-subpanel">
   *     <div class="caLINEdar-panel__btn picker-btn"></div>
   *     <div class="caLINEdar-panel__btn picker-btn"></div>
   *   </div>
   *   <div class="caLINEdar-panel__btn right-btn"></div>
   * </div>
   */
  _createPanel() {
    if (!this._panelTemplate) {
      // Lazy creation
      this._panelTemplate = this._doc.createElement("div");
      this._panelTemplate.classList.add("caLINEdar-panel");
      // This is safe innerHTML because generated by us.
      this._panelTemplate.innerHTML = `
        <div class="caLINEdar-panel__btn left-btn"></div>
        <div class="caLINEdar-subpanel">
          <div class="caLINEdar-panel__btn picker-btn"></div>
          <div class="caLINEdar-panel__btn picker-btn"></div>
        </div>
        <div class="caLINEdar-panel__btn right-btn"></div>
      `;
    }
    // To clone a node is basically faster than creating one
    // so we only create once above.
    return this._panelTemplate.cloneNode(true);
  },

  /**
   * A table looks like below:
   * <table class="caLINEdar-table">
   *   <tr class="caLINEdar-table-headers">
   *     <th class="caLINEdar-table-cell">Su</th>
   *     <th class="caLINEdar-table-cell">Mo</th>
   *     <th class="caLINEdar-table-cell">Tu</th>
   *     <th class="caLINEdar-table-cell">We</th>
   *     <th class="caLINEdar-table-cell">Th</th>
   *     <th class="caLINEdar-table-cell">Fr</th>
   *     <th class="caLINEdar-table-cell">Sa</th>
   *   </tr>
   *   <tr class="caLINEdar-table-values">
   *     <td class="caLINEdar-table-cell picked">1</td>
   *     <td class="caLINEdar-table-cell">2</td>
   *     <td class="caLINEdar-table-cell">3</td>
   *     <td class="caLINEdar-table-cell">4</td>
   *     <td class="caLINEdar-table-cell">5</td>
   *     <td class="caLINEdar-table-cell">6</td>
   *     <td class="caLINEdar-table-cell">7</td>
   *   </tr>
   * </table>
   *
   */
  _createTable(options = {}) {
    if (!this._tableTemplate) {
      this._tableTemplate = this._doc.createElement("table");
      this._tableTemplate.classList.add("caLINEdar-table");
    }
    let table = this._tableTemplate.cloneNode(false);

    if (options.headerCount > 0) {
      if (!this._tableThTemplate) {
        this._tableThTemplate = this._doc.createElement("th");
        this._tableThTemplate.classList.add("caLINEdar-table-cell");
      }
      let header = this._createTableRow({ cellCount: 0 });
      header.classList.add("caLINEdar-table-headers");
      for (let i = 0; i < options.headerCount; ++i) {
        header.appendChild(this._tableThTemplate.cloneNode(false));
      }
      table.appendChild(header);
    }
    return table;
  },

  _createTableRow(options = {}) {
    if (!this._tableTrTemplate) {
      this._tableTrTemplate = this._doc.createElement("tr");
    }
    let tr = this._tableTrTemplate.cloneNode(false);

    if (options.cellCount > 0) {
      if (!this._tableTdTemplate) {
        this._tableTdTemplate = this._doc.createElement("td");
        this._tableTdTemplate.classList.add("caLINEdar-table-cell");
      }
      for (let i = 0; i < options.cellCount; ++i) {
        tr.appendChild(this._tableTdTemplate.cloneNode(false));
      }
    }

    return tr;
  },

  _updateTableCells(table, values) {
    let rows = table.querySelectorAll(".caLINEdar-table-values");
    let cellCount = rows[0].querySelectorAll(".caLINEdar-table-cell").length;

    let valuesByRows = [];
    for (let i = 0; i < values.length;) {
      let data = [];
      for (let j = 0; j < cellCount; ++j, ++i) {
        data.push(values[i] || null);
      }
      valuesByRows.push(data);
    }

    for (let i = 0; i < rows.length; ++i) {
      let row = rows[i];
      let data = valuesByRows[i] || null;
      let cells = row.querySelectorAll(".caLINEdar-table-cell");
      for (let j = 0; j < cellCount; ++j) {
        if (data && data[j]) {
          cells[j].textContent = data[j].text; 
          cells[j].setAttribute("data-caLINEdar-value", data[j].value);
          cells[j].classList.add("active");
          if (data[j].picked) {
            cells[j].classList.add("picked");
          }
          if (data[j].special) {
            cells[j].classList.add("special");
          }
          if (data[j].grayOut) {
            cells[j].classList.add("gray-out-date");
          }
        } else {
          cells[j].classList.remove("picked");
          cells[j].classList.remove("active");
          cells[j].classList.remove("special");
          cells[j].classList.remove("gray-out-date");
        }
      }
    }
  },

  /**
   * A picker looks like below:
   * <div class="caLINEdar-picker">
   *    <div class="caLINEdar-panel">
   *    <table class="caLINEdar-table">
   * </div>
   */
  _createEmptyPicker(params = {}) {
    let id = params.id;
    let rowCount = params.rowCount || 0;
    let cellCount = params.cellCount || 0;
    let headerCount = params.headerCount || 0;
    let pickerBtnCount = params.pickerBtnCount || 0;
    if (!id || cellCount <= 0 || rowCount <= 0 || 
        headerCount < 0 || pickerBtnCount < 0) {
      return null;
    }

    let picker = this._doc.createElement("div");
    picker.classList.add("caLINEdar-picker");
    picker.id = id;

    let panel = this._createPanel();
    let btns = panel.querySelectorAll(".caLINEdar-panel__btn.picker-btn");
    for (let i = btns.length - 1; i >= pickerBtnCount; --i) {
      btns[i].style.display = "none"; 
    }
    picker.appendChild(panel);

    let table = this._createTable({ headerCount });
    for (let i = 0; i < rowCount; ++i) {
      let row = this._createTableRow({ cellCount });
      row.classList.add("caLINEdar-table-values");
      table.appendChild(row);
    }
    picker.appendChild(table);

    return picker;
  },

  _createCalendarHolder() {
    if (!this._calendar) {
      this._calendar = this._doc.createElement("div");
      this._calendar.classList.add("caLINEdar");
      this._calendar.style.display = "none";
      this._doc.body.appendChild(this._calendar);
    }
  },

};

module.exports = caLINEdar;
