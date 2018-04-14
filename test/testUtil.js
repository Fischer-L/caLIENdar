/**
 * A test utility helper
 */
const testUtil = {
  
  _origMethods: {},

  fakeGetNowInLocalTimezone(origMethod, thisArg, args) {
    return {
      getFullYear() {
        return null;
      },
      getMonth() {
        return null;
      },
      getDate() {
        return null;
      }
    };
  },

  overrideCaLINEdar(caLINEdar, name, override) {
    if (this._origMethods[name]) {
      throw new Error(`Can't override ${name} in caLINEdar twice`);
    }
    this._origMethods[name] = {
      name,
      method: caLINEdar[name]
    };
    caLINEdar[name] = new Proxy(caLINEdar[name], override);
  },

  restoreCaLINEdar(caLINEdar, name) {
    if (!this._origMethods[name]) {
      throw new Error(`${name} in caLINEdar is not overridden`);
    }
    caLINEdar[name] = this._origMethods[name].method;
    delete this._origMethods[name];
  },

};

module.exports = testUtil;
