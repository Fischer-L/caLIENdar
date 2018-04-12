import "./caLINEdar.scss";

const caLINEdar = {
  init(window) {
    this._win = window;
    this._doc = window.document;
  },

  // UI methods

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
   *   <tr class="caLINEdar-table-header">
   *     <th class="caLINEdar-table-cell">Su</th>
   *     <th class="caLINEdar-table-cell">Mo</th>
   *     <th class="caLINEdar-table-cell">Tu</th>
   *     <th class="caLINEdar-table-cell">We</th>
   *     <th class="caLINEdar-table-cell">Th</th>
   *     <th class="caLINEdar-table-cell">Fr</th>
   *     <th class="caLINEdar-table-cell">Sa</th>
   *   </tr>
   *   <tr>
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
      header.classList.add("caLINEdar-table-header");
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

  _createYearPicker(yrs, currentYrsIdx) {
    if (yrs.length === 0 || !yrs[currentYrsIdx]) {
      return null;
    }

    let picker = this._doc.createElement("div");
    picker.classList.add("caLINEdar-year-picker");

    let panel = this._createPanel();
    let btns = panel.querySelectorAll(".caLINEdar-panel__btn.picker-btn");
    btns[0].textContent = yrs[currentYrsIdx];
    btns[1].remove();
    picker.appendChild(panel);

    let table = this._createTable({ headerCount: 0 });
    for (let i = 0; i < yrs.length;) {
      let cellCount = 3;
      let row = this._createTableRow({ cellCount });
      let cells = row.querySelectorAll(".caLINEdar-table-cell");
      for (let j = 0; j < cellCount; ++j, ++i) {
        if (yrs[i]) {
          cells[j].textContent = yrs[i];
          if (i === currentYrsIdx) {
            cells[j].classList.add("picked");
          }
        } else {
          cells[j].remove();
        }
      }
      table.appendChild(row);
    }
    picker.appendChild(table);
    return picker;
  },

  _createCalendar() {
    let calendar = this._doc.createElement("div");
    calendar.classList.add("caLINEdar");
    return calendar;
  },

  // UI methods end
};

module.exports = caLINEdar;
