/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/options/options.js ***!
  \********************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var OptionsManager = /*#__PURE__*/function () {
  function OptionsManager() {
    _classCallCheck(this, OptionsManager);
    this.settings = {
      enableDetection: true,
      showNotifications: true,
      autoBlock: true,
      sensitivity: 'medium',
      scanForms: true,
      checkUrls: true,
      analyzeContent: true,
      useMachineLearning: true,
      anonymousReporting: true,
      collectStats: true,
      dataRetention: '30'
    };
    this.init();
  }
  return _createClass(OptionsManager, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return this.loadSettings();
            case 1:
              _context.n = 2;
              return this.loadLists();
            case 2:
              this.setupEventListeners();
              this.updateUI();
            case 3:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "loadSettings",
    value: function () {
      var _loadSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var data;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return chrome.storage.local.get(['settings']);
            case 1:
              data = _context2.v;
              if (data.settings) {
                this.settings = _objectSpread(_objectSpread({}, this.settings), data.settings);
              }
              this.populateForm();
            case 2:
              return _context2.a(2);
          }
        }, _callee2, this);
      }));
      function loadSettings() {
        return _loadSettings.apply(this, arguments);
      }
      return loadSettings;
    }()
  }, {
    key: "loadLists",
    value: function () {
      var _loadLists = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        var data, stats;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return chrome.storage.local.get(['blacklist', 'whitelist']);
            case 1:
              data = _context3.v;
              this.updateListDisplay('whitelistItems', data.whitelist || []);
              this.updateListDisplay('blacklistItems', data.blacklist || []);

              // Load stats
              _context3.n = 2;
              return chrome.storage.local.get(['stats']);
            case 2:
              stats = _context3.v;
              if (stats.stats) {
                document.getElementById('totalSitesScanned').textContent = stats.stats.sitesScanned || 0;
                document.getElementById('totalThreatsDetected').textContent = stats.stats.threatsBlocked || 0;
              }

              // Update database time
              document.getElementById('dbUpdateTime').textContent = new Date().toLocaleString();
            case 3:
              return _context3.a(2);
          }
        }, _callee3, this);
      }));
      function loadLists() {
        return _loadLists.apply(this, arguments);
      }
      return loadLists;
    }()
  }, {
    key: "populateForm",
    value: function populateForm() {
      var _this = this;
      // Set checkbox values
      Object.keys(this.settings).forEach(function (key) {
        var element = document.getElementById(key);
        if (element) {
          if (element.type === 'checkbox') {
            element.checked = _this.settings[key];
          } else if (element.tagName === 'SELECT') {
            element.value = _this.settings[key];
          }
        }
      });
    }
  }, {
    key: "updateListDisplay",
    value: function updateListDisplay(listId, items) {
      var _this2 = this;
      var listElement = document.getElementById(listId);
      listElement.innerHTML = '';
      items.forEach(function (item) {
        var li = document.createElement('li');
        li.innerHTML = "\n        <span>".concat(item, "</span>\n        <button class=\"remove-btn\" data-domain=\"").concat(item, "\">Remove</button>\n      ");
        listElement.appendChild(li);
      });

      // Add remove event listeners
      listElement.querySelectorAll('.remove-btn').forEach(function (button) {
        button.addEventListener('click', /*#__PURE__*/function () {
          var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(e) {
            var domain;
            return _regenerator().w(function (_context4) {
              while (1) switch (_context4.n) {
                case 0:
                  domain = e.target.dataset.domain;
                  _context4.n = 1;
                  return _this2.removeFromList(listId, domain);
                case 1:
                  return _context4.a(2);
              }
            }, _callee4);
          }));
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      });
    }
  }, {
    key: "saveSettings",
    value: function () {
      var _saveSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        var _this3 = this;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              // Get values from form
              Object.keys(this.settings).forEach(function (key) {
                var element = document.getElementById(key);
                if (element) {
                  if (element.type === 'checkbox') {
                    _this3.settings[key] = element.checked;
                  } else if (element.tagName === 'SELECT') {
                    _this3.settings[key] = element.value;
                  }
                }
              });
              _context5.n = 1;
              return chrome.storage.local.set({
                settings: this.settings
              });
            case 1:
              this.showNotification('Settings saved successfully!');
            case 2:
              return _context5.a(2);
          }
        }, _callee5, this);
      }));
      function saveSettings() {
        return _saveSettings.apply(this, arguments);
      }
      return saveSettings;
    }()
  }, {
    key: "removeFromList",
    value: function () {
      var _removeFromList = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(listType, domain) {
        var data, list, index;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return chrome.storage.local.get([listType]);
            case 1:
              data = _context6.v;
              list = data[listType] || [];
              index = list.indexOf(domain);
              if (!(index > -1)) {
                _context6.n = 3;
                break;
              }
              list.splice(index, 1);
              _context6.n = 2;
              return chrome.storage.local.set(_defineProperty({}, listType, list));
            case 2:
              this.updateListDisplay(listType + 'Items', list);
              this.showNotification("Removed ".concat(domain, " from ").concat(listType));
            case 3:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function removeFromList(_x2, _x3) {
        return _removeFromList.apply(this, arguments);
      }
      return removeFromList;
    }()
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this4 = this;
      // Save settings on change
      var inputs = document.querySelectorAll('input, select');
      inputs.forEach(function (input) {
        input.addEventListener('change', function () {
          return _this4.saveSettings();
        });
      });

      // Add to whitelist
      document.getElementById('addWhitelist').addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        var input, domain, data, whitelist;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              input = document.getElementById('whitelistInput');
              domain = input.value.trim().toLowerCase();
              if (!(domain && _this4.isValidDomain(domain))) {
                _context7.n = 5;
                break;
              }
              _context7.n = 1;
              return chrome.storage.local.get(['whitelist']);
            case 1:
              data = _context7.v;
              whitelist = data.whitelist || [];
              if (whitelist.includes(domain)) {
                _context7.n = 3;
                break;
              }
              whitelist.push(domain);
              _context7.n = 2;
              return chrome.storage.local.set({
                whitelist: whitelist
              });
            case 2:
              _this4.updateListDisplay('whitelistItems', whitelist);
              input.value = '';
              _this4.showNotification('Domain added to whitelist');
              _context7.n = 4;
              break;
            case 3:
              _this4.showNotification('Domain already in whitelist', 'warning');
            case 4:
              _context7.n = 6;
              break;
            case 5:
              _this4.showNotification('Please enter a valid domain', 'error');
            case 6:
              return _context7.a(2);
          }
        }, _callee7);
      })));

      // Update database
      document.getElementById('updateDatabase').addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _this4.showNotification('Updating database...', 'info');
              _context8.n = 1;
              return chrome.runtime.sendMessage({
                type: 'UPDATE_DATABASE'
              });
            case 1:
              setTimeout(function () {
                _this4.showNotification('Database updated successfully!');
                document.getElementById('dbUpdateTime').textContent = new Date().toLocaleString();
              }, 2000);
            case 2:
              return _context8.a(2);
          }
        }, _callee8);
      })));

      // Export data
      document.getElementById('exportData').addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var data, blob, url, a;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              _context9.n = 1;
              return chrome.storage.local.get(null);
            case 1:
              data = _context9.v;
              blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
              });
              url = URL.createObjectURL(blob);
              a = document.createElement('a');
              a.href = url;
              a.download = "phishing-detector-backup-".concat(Date.now(), ".json");
              a.click();
              URL.revokeObjectURL(url);
              _this4.showNotification('Data exported successfully!');
            case 2:
              return _context9.a(2);
          }
        }, _callee9);
      })));

      // Reset settings
      document.getElementById('resetSettings').addEventListener('click', function () {
        if (confirm('Are you sure you want to reset all settings to default?')) {
          chrome.storage.local.clear(function () {
            window.location.reload();
          });
        }
      });

      // Enter key in whitelist input
      document.getElementById('whitelistInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          document.getElementById('addWhitelist').click();
        }
      });
    }
  }, {
    key: "isValidDomain",
    value: function isValidDomain(domain) {
      var regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      return regex.test(domain);
    }
  }, {
    key: "showNotification",
    value: function showNotification(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
      var colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#FF9800',
        info: '#2196F3'
      };
      var notification = document.createElement('div');
      notification.style.cssText = "\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      background: ".concat(colors[type], ";\n      color: white;\n      padding: 15px 25px;\n      border-radius: 5px;\n      z-index: 10000;\n      animation: slideIn 0.3s ease;\n      box-shadow: 0 4px 12px rgba(0,0,0,0.2);\n    ");
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(function () {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function () {
          return notification.remove();
        }, 300);
      }, 3000);
    }
  }, {
    key: "updateUI",
    value: function updateUI() {
      // Add animation for list updates
      var lists = document.querySelectorAll('.domain-list');
      lists.forEach(function (list) {
        list.style.transition = 'all 0.3s ease';
      });
    }
  }]);
}(); // Add CSS animations
var style = document.createElement('style');
style.textContent = "\n  @keyframes slideIn {\n    from {\n      transform: translateX(100%);\n      opacity: 0;\n    }\n    to {\n      transform: translateX(0);\n      opacity: 1;\n    }\n  }\n  \n  @keyframes slideOut {\n    from {\n      transform: translateX(0);\n      opacity: 1;\n    }\n    to {\n      transform: translateX(100%);\n      opacity: 0;\n    }\n  }\n";
document.head.appendChild(style);

// Initialize options page
document.addEventListener('DOMContentLoaded', function () {
  var optionsManager = new OptionsManager();
});
/******/ })()
;
//# sourceMappingURL=options.js.map