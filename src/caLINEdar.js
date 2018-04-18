import CaLINEdarCalender from "./caLINEdarCalender";
import CaLINEdarDateInput from "./caLINEdarDateInput";
import { getStandardCalenderClass, createStandardCalender } from "./StandardCalender";

/**
 * This is our main API object for the caLINEdar date picker lib.
 * It helps to create the date input field and provide some helper methods.
 *
 * The whole API artchitecture goes as below
 *
 *          ----------
 *         |  Users   |
 *          ----------
 * Control    |    ^  Notify
 * with APIs  |    |  with events
 *            |    |
 *            V    |        Get dates from 
 *    --------------------  with APIs     --------------------
 *   | CaLINEdarDateInput | -----------> |  CaLINEdarCalender |
 *    --------------------                --------------------
 * Control    |    ^  Notify                    | Borrow helper methods
 * with APIs  |    |  with events               | from 
 *            |    |                            |
 *            V    |                            |
 *         -----------                          |
 *        | caLINEdar | <------------------------
 *         -----------    
 */
const caLINEdar = {
  /** Public APIs **/

  /**
   * See `CaLINEdarCalender`
   */
  CaLINEdarCalender,

  /**
   * See `CaLINEdarDateInput`
   */
  CaLINEdarDateInput,

  /**
   * Must call `init` before any operations
   * 
   * @param win {Window} The Window object
   */
  init(win) {
    this._win = win;
    this._doc = win.document;
    this._createCalendar();
    win.addEventListener("click", e => this._onClick(e));
    win.addEventListener("touchend", e => this._onClick(e));
  },

  /**
   * @param params {Object} the parameters to create a `CaLINEdarDateInput`, including
   *    - mountElem {HTMLElement} The element where the input element sits. 
   *                              One input element will be created for you so don't pass another one.
   *
   *    - calendar {*} If not given, will use the standard calendar. See `CaLINEdarDateInput` for more.
   *    - rtl {*} See `CaLINEdarDateInput`.
   *    - date {*} See `CaLINEdarDateInput`.
   *    - event types {*} See `CaLINEdarDateInput`.
   *
   * @return {CaLINEdarDateInput} An instance of `CaLINEdarDateInput`. `null` if failed.
   */
  createDateInput(params) {
    let {
      mountElem
    } = params;

    if (!mountElem || !mountElem.appendChild) {
      console.error(new Error("Must provide a mounting element to mount the date input"));
      return null;
    }

    let inputModule = this._createInputModule();
    let input = inputModule.querySelector(".caLINEdar-input");
    let dateInputParams = Object.assign({}, params, { 
      input, 
      caLINEdar: this,
      window: this._win
    });
    if (!dateInputParams.calendar) {
      if (!this._defaultCalendar) {
        this._defaultCalendar = createStandardCalender(this);
      }
      dateInputParams.calendar = this._defaultCalendar;
    }
    delete dateInputParams.mountElem; // Delete unnecessary params
    let dateInput = new this.CaLINEdarDateInput(dateInputParams);
    mountElem.appendChild(inputModule);
    return dateInput;
  },

  /**
   * This set one current associated dateInput.
   * 
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

  /**
   * @return {bool} `true` if the calendar is open.
   */
  isCalendarOpen() {
    return this._calendar && this._calendar.hasAttribute("data-caLINEdar-opened");
  },

  /**
   * Open the calendar. Always open the date picker first.
   *
   * @param anchorInput {HTMLInputElement} the input at which the calendar is anchor
   * @param params {*} See `showDatePicker`
   *
   * @return {Promise} A promise
   */
  async openCalendar(anchorInput, params) {
    if (!this._calendar) {
      console.warn("Please call `init` first then manipuate the calendar");
      return;
    }

    this._calendar.style.display = "";
    // Set `hidden` first then remove it after positioning.
    // This is to avoid a *flash* during positioning.
    this._calendar.style.visibility = "hidden";
    this._calendar.setAttribute("data-caLINEdar-opened", true);
    await this.showDatePicker(params);
    // Let's always position the calendar after our picker is populated
    // so as to make sure the correct dimension is layouted when positioning. 
    await this._positionCalendar(anchorInput);
    this._calendar.style.visibility = "";
  },

  /**
   * Close the calendar
   */
  closeCalendar() {
    if (!this._calendar) {
      console.warn("Please call `init` first then manipuate the calendar");
      return;
    }
    this._calendar.style.display = "none";
    this._mobileBackground.style.display = "none";
    this._calendar.removeAttribute("data-caLINEdar-opened");
  },

  /**
   * Must always call `openCalendar` first to have the calendar opened.
   *
   * @param params {Object} The parameters are:
   *    - value {String} The data attribute value identifing year and month
   *
   *    - rtl {bool} Optional. `true` for the RTL mode. Default is `false`
   *
   *    - pickerBtns {Array} represent the buttons on the top of the picker.
   *                         Each button should contains
   *                         - text {String} the button title
   *                         - value {String} the data attribute value for this button,
   *                           which will be used to identify this button when clicking.
   *
   *    - weekHeaders {Array} The titles of days in a week (count is 7).
   *                          The 1st one is displayed as the 1st one.
   *
   *    - dates {Array} 
   *        An array (count is `MAX_COUNT_DATES_IN_DATE_PICKER`) of dates to display.
   *        Each date is an object with:
   *        - text {String} The title of this date
   *        - value {Integer} The data attribute value identifying this date
   *        - picked {bool} whether this date is picked
   *        - special {bool} whether this date should be highlighted as special
   *        - grayOut {bool} whether this date should be gray out (Win over `special`)
   *
   *    - noMoreLeft {bool} Optional. `true` means can't flip the year picker
   *                        leftward any more so hide the left button. Default is `false`
   *
   *    - noMoreRight {bool} Optional. `true` means can't flip the year picker
   *                         rightward any more so hide the right button. Default is `false`
   */
  showDatePicker(params) {
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
    this._datePicker.setAttribute("data-caLINEdar-value", params.value);
    return this._updateDatePicker(params);
  },

  /**
   * Close the data picker
   */
  closeDatePicker() {
    if (this._datePicker) {
      this._datePicker.style.display = "none";
      this._datePicker.removeAttribute("data-caLINEdar-value");
    }
  },

  /**
   * @param params {Object} The parameters are:
   *    - value {String} The data attribute value identifing year
   *
   *    - rtl {bool} Optional. `true` for the RTL mode. Default is `false`
   *
   *    - pickerBtns {Array} represent the buttons on the top of the picker.
   *                         Each button should contains
   *                         - text {String} the button title
   *                         - value {String} the data attribute value for this button,
   *                           which will be used to identify this button when clicking.
   *
   *    - months {Array} 
   *        An array (count is `MAX_COUNT_MONTHS_IN_MONTH_PICKER`) of months to display.
   *        Each month is an object with:
   *        - text {String} The title of this month
   *        - value {Integer} The data attribute value identifying this month
   *        - picked {bool} whether this month is picked
   *
   *    - noMoreLeft {bool} Optional. `true` means can't flip the year picker
   *                        leftward any more so hide the left button. Default is `false`
   *
   *    - noMoreRight {bool} Optional. `true` means can't flip the year picker
   *                         rightward any more so hide the right button. Default is `false`
   */
  showMonthPicker(params) {
    if (!this.isCalendarOpen()) {
      console.warn("Should open the calendar once first then show the month picker");
      return;
    }
    if (!this._monthPicker) {
      this._monthPicker = this._createEmptyPicker({
        id: this.ID_MONTH_PICKER,
        pickerBtnCount: 2,
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
    this._monthPicker.setAttribute("data-caLINEdar-value", params.value);
    return this._updateMonthPicker(params);
  },

  /**
   * Close the month picker
   */
  closeMonthPicker() {
    if (this._monthPicker) {
      this._monthPicker.style.display = "none";
      this._monthPicker.removeAttribute("data-caLINEdar-value");
    }
  },

  /**
   * @param params {Object} The parameters are:
   *    - value {String} The data attribute value identifing year
   *
   *    - rtl {bool} Optional. `true` for the RTL mode. Default is `false`
   *
   *    - months {Array} 
   *        An array (count is `MAX_COUNT_YEAR_IN_YEAR_PICKER`) of years to display.
   *        Each year is an object with:
   *        - text {String} The title of this year
   *        - value {Integer} The data attribute value identifying this year
   *        - picked {bool} whether this year is picked
   *
   *    - noMoreLeft {bool} Optional. `true` means can't flip the year picker
   *                        leftward any more so hide the left button. Default is `false`
   *
   *    - noMoreRight {bool} Optional. `true` means can't flip the year picker
   *                         rightward any more so hide the right button. Default is `false`
   */
  showYearPicker(params) {
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
    this._yearPicker.setAttribute("data-caLINEdar-value", params.value);
    return this._updateYearPicker(params);
  },

  /**
   * Close the year picker
   */
  closeYearPicker() {
    if (this._yearPicker) {
      this._yearPicker.style.display = "none";
      this._yearPicker.removeAttribute("data-caLINEdar-value");
    }
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
    if (isNaN(v)) {
      return false;
    }
    let x = parseFloat(v);
    return (x | 0) === x;
  },

  /**
   * @return {bool} `true` if the current is a small window's screen.
   */
  isSmallScreen() {
    // Why not using @media in CSS?
    // 1. We must stop `_positionCalendarOnBigScreen` in js
    // 2. Our other js part need it as well
    // 3. To reduce the duplicate media query rules in JS and CSS,
    // let's test media condition in JS.
    let media = "(max-width: 768px)"; // 768px is iPad
    return this._win.matchMedia(media).matches;
  },

  /** Public APIs End **/

  ID_DATE_PICKER: "caLINEdar-date-picker",
  ID_MONTH_PICKER: "caLINEdar-month-picker",
  ID_YEAR_PICKER: "caLINEdar-year-picker",

  EVENT_PICKER_CLICK: "caLINEdar-on-picker-click",
  EVENT_CLICK_CLEAR_BUTTON: "caLINEdar-on-clear-click",
  EVENT_CLICK_OUTSIDE_PICKER: "caLINEdar-on-click-outside",

  MAX_COUNT_YEAR_IN_YEAR_PICKER: 9,
  MAX_COUNT_MONTHS_IN_MONTH_PICKER: 12,
  MAX_COUNT_DATES_IN_DATE_PICKER: 6 * 7,

  // Events

  _onClick(e) { 
    let { target } = e;

    if (target.classList.contains("caLINEdar-input-clear-btn")) {
      // This should go with any input, why? For example,
      // there is an input which user never opens the calendar on it.
      // But that input has a default date.
      // When a user clicks a clear button, s/he demands *clear*.
      // So no matter the calendar was opened or any associated input.
      // We should let that input know *A user wants to clear value*
      let inputHolder = target.parentNode;
      let input = inputHolder.querySelector(".caLINEdar-input");
      this._notifyInput(this.EVENT_CLICK_CLEAR_BUTTON, input);
      return;
    }

    if (!this._dateInput || !this.isCalendarOpen()) {
      // If the calendar was closed or no date input,
      // nowhere has to do with us.
      return;
    }

    if (target === this._dateInput.input) {
      // User is clicking on the input.
      // Has nothing to do with here too.
      return;
    }

    let picker = null;
    let node = target;
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
      this._notifyDateInput(this.EVENT_PICKER_CLICK, { picker, target });
      return;
    }
    this._notifyDateInput(this.EVENT_CLICK_OUTSIDE_PICKER);
  },

  _notifyDateInput(eventType, detail) {
    if (this._dateInput) {
      // Why a `_notifyDateInput` and another `_notifyInput`?
      // `_notifyDateInput` notifies the current inpuf of `_dateInput`.
      // `_notifyInput` servers a general purpose, which notify
      // an input element. To distinguish the difference of the purpose,
      // we make these 2 methods. Might be a bit bothersome but clear for codes.
      this._notifyInput(eventType, this._dateInput.input, detail);
    }
  },

  _notifyInput(eventType, input, detail) {
    if (input) {
      // Why a custom event here?
      // Because we want to keep event communications
      // between caLINEdar and date input in private.
      // With the custom event, date input can listen to events 
      // without exposing any public APIs.
      let evt = new CustomEvent(eventType, { detail });
      input.dispatchEvent(evt);
    }
  },

  // Events end

  async _updateDatePicker(params) {
    return new Promise(resolve => {
      this._win.requestAnimationFrame(() => {
        let { pickerBtns, weekHeaders, dates, rtl } = params;
        let picker = this._datePicker;

        let table = picker.querySelector(".caLINEdar-table");
        let headers = table.querySelector(".caLINEdar-table-headers")
                           .querySelectorAll(".caLINEdar-table-cell");
        if (rtl) {
          weekHeaders = weekHeaders.slice().reverse();
        }
        for (let i = 0; i < headers.length; ++i) {
          headers[i].textContent = weekHeaders[i];
        }

        this._updateTableCells(table, dates, rtl);
        this._updatePanelButtons(picker, params);
        resolve();
      });
    });
  },

  _updateMonthPicker(params) {
    return new Promise(resolve => {
      this._win.requestAnimationFrame(() => {
        let { months, rtl } = params;
        let picker = this._monthPicker;
        let table = picker.querySelector(".caLINEdar-table");
        this._updateTableCells(table, months, rtl);
        this._updatePanelButtons(picker, params);
        resolve();
      });
    });
  },

  _updateYearPicker(params) {
    return new Promise(resolve => {
      this._win.requestAnimationFrame(() => {
        let { years, rtl } = params;
        let picker = this._yearPicker;

        let btn = picker.querySelector(".caLINEdar-panel__btn.picker-btn");
        let y = [ years[0].text, years[years.length-1].text ];
        if (rtl) {
          y.reverse();
        }
        btn.textContent = `${y[0]} ~ ${y[1]}`;

        let table = picker.querySelector(".caLINEdar-table");
        this._updateTableCells(table, years, rtl);
        this._updatePanelButtons(picker, params);
        resolve();
      });
    });
  },

  _updatePanelButtons(picker, params) {
    let { pickerBtns, noMoreLeft, noMoreRight } = params;
    let btns = picker.querySelectorAll(".caLINEdar-panel__btn.picker-btn");
    for (let i = 0; pickerBtns && i < pickerBtns.length; ++i) {
      btns[i].textContent = pickerBtns[i].text;
      btns[i].setAttribute("data-caLINEdar-value", pickerBtns[i].value);
    }

    picker.querySelector(".caLINEdar-panel__btn.left-btn")
      .style.display = !!noMoreLeft ? "none" : "";
    picker.querySelector(".caLINEdar-panel__btn.right-btn")
      .style.display = !!noMoreRight ? "none" : "";
  },

  /**
   * An input module looks like below:
   * <div class="caLINEdar-input-holder">
   *   <input class="caLINEdar-input" type="text">
   *   <button class="caLINEdar-input-clear-btn"></button>
   * </div>
   */
  _createInputModule() {
    if (!this._inputModuleTemplate) {
      this._inputModuleTemplate = this._doc.createElement("div");
      this._inputModuleTemplate.classList.add("caLINEdar-input-holder");
      this._inputModuleTemplate.innerHTML = `
        <input class="caLINEdar-input" type="text">
        <button class="caLINEdar-input-clear-btn"></button>
      `;
    }
    return this._inputModuleTemplate.cloneNode(true);
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

  _updateTableCells(table, values, rtl) {
    let rows = table.querySelectorAll(".caLINEdar-table-values");
    let cellCount = rows[0].querySelectorAll(".caLINEdar-table-cell").length;

    let valuesByRows = [];
    for (let i = 0; i < values.length;) {
      let data = [];
      for (let j = 0; j < cellCount; ++j, ++i) {
        data.push(values[i] || null);
      }
      if (rtl) {
        data.reverse();
      }
      valuesByRows.push(data);
    }

    for (let i = 0; i < rows.length; ++i) {
      let row = rows[i];
      let data = valuesByRows[i] || null;
      let cells = row.querySelectorAll(".caLINEdar-table-cell");
      for (let j = 0; j < cellCount; ++j) {
        let cell = cells[j];
        cell.removeAttribute("data-caLINEdar-value");
        cell.textContent = "";
        cell.classList.remove("picked");
        cell.classList.remove("active");
        cell.classList.remove("special");
        cell.classList.remove("gray-out-date");
        if (data && data[j]) {
          cell.setAttribute("data-caLINEdar-value", data[j].value);
          cell.textContent = data[j].text; 
          cell.classList.add("active");
          if (data[j].picked) {
            cell.classList.add("picked");
          }
          if (data[j].special) {
            cell.classList.add("special");
          }
          if (data[j].grayOut) {
            cell.classList.add("gray-out-date");
          }
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

  _createCalendar() {
    if (!this._calendar) {
      let frag = this._doc.createDocumentFragment();
      this._mobileBackground = this._doc.createElement("div");
      this._mobileBackground.className = "caLINEdar-mobile-background";
      this._mobileBackground.style.display = "none";
      frag.appendChild(this._mobileBackground);

      this._calendar = this._doc.createElement("div");
      this._calendar.className = "caLINEdar";
      this._calendar.style.display = "none";
      frag.appendChild(this._calendar);

      this._doc.body.appendChild(frag);
    }
  },

  _positionCalendarOnSmallScreen() {
    this._calendar.style.top = "";
    this._calendar.style.left = "";
    this._mobileBackground.style.display = "";
    this._calendar.classList.add("small-screen");
  },

  _positionCalendarOnBigScreen(anchorInput) {
    let winW = this._win.innerWidth;
    let winH = this._win.innerHeight;

    let calendarW = parseInt(this._calendar.getAttribute("data-caLINEdar-width"));
    let calendarH = parseInt(this._calendar.getAttribute("data-caLINEdar-height"));
    if (!calendarW) {
      // `getBoundingClientRect` is expensive so cache it. 
      let rect = this._calendar.getBoundingClientRect();
      calendarW = rect.width;
      calendarH = rect.height;
      this._calendar.setAttribute("data-caLINEdar-width", calendarW);
      this._calendar.setAttribute("data-caLINEdar-height", calendarH);
    }

    // Unfortunately, we can't do cache with `anchorInput`
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

    // Finally, we are not on a small screen
    this._mobileBackground.style.display = "none";
    this._calendar.classList.remove("small-screen");
  },
  
  async _positionCalendar(anchorInput) {
    if (!this._calendar) {
      return;
    }
    return new Promise(resolve => {
      this._win.requestAnimationFrame(() => {
        if (this.isSmallScreen()) {
          this._positionCalendarOnSmallScreen();
        } else {
          this._positionCalendarOnBigScreen(anchorInput);
        }
        resolve();
      });
    });
  },

};
caLINEdar.StandardCalendar = getStandardCalenderClass(caLINEdar);

module.exports = caLINEdar;
