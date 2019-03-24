"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var TChart = function () {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
      cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
  var colorsMap = {
    day: {
      background: '#FFF',
      XYAxisLabels: '#A1ACB3',
      gridBottomBorder: '#cacccd',
      gridLine: '#d4d6d7',
      zoomOverlay: 'rgba(239,243,245,0.5)',
      zoomCarriageTool: 'rgba(218,231,240,0.5)',
      verticalInfoLine: '#CBCFD2',
      pointsInfoBackground: '#FFF',
      pointsInfoTitle: '#000',
      legendItemBorder: '#EFF3F5',
      legendItemName: '#000'
    },
    night: {
      background: '#242F3E',
      XYAxisLabels: '#546778',
      gridBottomBorder: '#495564',
      gridLine: '#303D4C',
      zoomOverlay: 'rgba(27,36,48,0.5)',
      zoomCarriageTool: 'rgba(81,101,120,0.5)',
      verticalInfoLine: '#4e5a69',
      pointsInfoBackground: '#253241',
      pointsInfoTitle: '#FFF',
      legendItemBorder: '#495564',
      legendItemName: '#FFF'
    }
  };
  /**
   * @const {string}
   */

  var X_COLUMN_TYPE = 'x',
      LINE_COLUMN_TYPE = 'line',
      MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var config = {
    nightMode: false,
    containerId: 'charts-container'
  };
  var rerender, fullrerender;
  window.addEventListener('resize', function () {
    fullrerender();
  });

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  function addEventListeners(el, events, listener, opts) {
    var eventsList = events.split(' ');

    for (var i = 0; i < eventsList.length; i++) {
      el.addEventListener(eventsList[i], listener, opts);
    }
  }

  function style(obj) {
    return Object.entries(obj).reduce(function (styleString, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          propName = _ref2[0],
          propValue = _ref2[1];

      propName = propName.replace(/([A-Z])/g, function (matches) {
        return "-".concat(matches[0].toLowerCase());
      });
      return "".concat(styleString).concat(propName, ":").concat(propValue, ";");
    }, '');
  }

  var HTMLComponent =
  /*#__PURE__*/
  function () {
    function HTMLComponent() {
      _classCallCheck(this, HTMLComponent);

      _defineProperty(this, "NAME", null);

      _defineProperty(this, "EVENTS", {
        CREATED: 'created'
      });

      this._id = null;
      this._events = [];
      this.el = null;
      this.rerender = null;
      this.parent = null;
    }

    _createClass(HTMLComponent, [{
      key: "render",
      value: function render(data) {
        throw new Error();
      }
    }, {
      key: "rerender",
      value: function rerender(newData) {
        throw new Error();
      }
    }, {
      key: "on",
      value: function on(event, handler, once) {
        once = once || false;

        if (!Object.values(this.EVENTS).includes(event)) {
          throw new Error("The event \"".concat(event, "\" is not supported"));
        }

        this._events.push({
          event: event,
          handler: handler,
          once: once
        });
      }
    }, {
      key: "whenCreated",
      value: function whenCreated(el, data) {}
    }, {
      key: "whenCreate",
      value: function whenCreate() {}
    }, {
      key: "whenRendered",
      value: function whenRendered(el, data) {}
    }, {
      key: "create",
      value: function create(parent, data, where) {
        this.whenCreate();

        var html = this._wrap(this.render(data));

        if (parent instanceof HTMLComponent) {
          this.parent = parent;
          parent.on(this.EVENTS.CREATED, this._postCreate.bind(this, data));
          return html;
        } else {
          where = where || 'beforeEnd';
          parent.insertAdjacentHTML(where, html);

          this._postCreate(data);
        }

        return this.el;
      }
    }, {
      key: "remove",
      value: function remove() {
        if (this.el) {
          this.el.remove();
          this.el = null;
        }
      }
    }, {
      key: "_postCreate",
      value: function _postCreate(data) {
        var _this = this;

        this.el = document.getElementById(this._id);

        this.rerender = function (newData) {
          data = newData || data;

          var html = _this.render(data);

          _this.el.innerHTML = html;

          _this._raiseEvent(_this.EVENTS.CREATED, data);

          _this.whenRendered(_this.el, data);

          return html;
        };

        this._raiseEvent(this.EVENTS.CREATED, data);

        this.whenCreated(this.el, data);
        this.whenRendered(this.el, data);
      }
    }, {
      key: "_raiseEvent",
      value: function _raiseEvent(eventName, data) {
        this._events.forEach(function (_ref3) {
          var event = _ref3.event,
              handler = _ref3.handler;

          if (event === eventName) {
            handler(data);
          }
        });

        this._events = [];
      }
    }, {
      key: "_wrap",
      value: function _wrap(template) {
        this._id = generateId();
        return "<".concat(this.NAME, " id=\"").concat(this._id, "\">").concat(template, "</").concat(this.NAME, ">");
      }
    }]);

    return HTMLComponent;
  }();

  var CanvasHTMLComponent =
  /*#__PURE__*/
  function (_HTMLComponent) {
    _inherits(CanvasHTMLComponent, _HTMLComponent);

    function CanvasHTMLComponent() {
      var _this2;

      _classCallCheck(this, CanvasHTMLComponent);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CanvasHTMLComponent).call(this));

      _defineProperty(_assertThisInitialized(_this2), "NAME", 'canvas');

      _this2.ctx2d = null;
      return _this2;
    }

    _createClass(CanvasHTMLComponent, [{
      key: "clear",
      value: function clear() {
        this.ctx2d.clearRect(0, 0, this.el.width, this.el.height);
      }
    }, {
      key: "whenCreated",
      value: function whenCreated(el) {
        el.width = el.clientWidth;
        el.height = el.clientHeight;
        var dpr = window.devicePixelRatio || 1,
            canvasRect = el.getBoundingClientRect();
        el.width = canvasRect.width * dpr;
        el.height = canvasRect.height * dpr;
        this.ctx2d = el.getContext('2d');
        this.ctx2d.scale(dpr, dpr);
      }
    }, {
      key: "render",
      value: function render() {
        return '';
      }
    }]);

    return CanvasHTMLComponent;
  }(HTMLComponent);

  var XAxisLayer =
  /*#__PURE__*/
  function (_CanvasHTMLComponent) {
    _inherits(XAxisLayer, _CanvasHTMLComponent);

    function XAxisLayer() {
      _classCallCheck(this, XAxisLayer);

      return _possibleConstructorReturn(this, _getPrototypeOf(XAxisLayer).apply(this, arguments));
    }

    _createClass(XAxisLayer, [{
      key: "whenCreated",
      value: function whenCreated(el) {
        _get(_getPrototypeOf(XAxisLayer.prototype), "whenCreated", this).call(this, el);

        el.className = 'x-axis';
      }
    }, {
      key: "whenRendered",
      value: function whenRendered(el, _ref4) {
        var chartData = _ref4.chartData,
            opts = _ref4.opts;
        this.clear();

        this._renderXAxisDates(chartData, opts);
      }
    }, {
      key: "_renderXAxisDates",
      value: function _renderXAxisDates(chartData, opts) {
        var _this3 = this;

        this.ctx2d.font = '.7em' + ' ' + 'Arial';
        this.ctx2d.fillStyle = getColor('XYAxisLabels');
        this.ctx2d.textBaseline = 'bottom';
        var labelOccupiedWidth = 0;
        bypassXPoints(this.el, opts.drawingFrame, chartData.xData, chartData.minValX, chartData.maxValX, function (v, x) {
          var date = new Date(v),
              label = MONTH_NAMES[date.getMonth()] + ' ' + date.getDate(),
              labelWidth = _this3.ctx2d.measureText(label).width,
              labelMidWidth = labelWidth / 2,
              labelX = x - labelMidWidth,
              labelXEnd = x + labelMidWidth;

          if (labelOccupiedWidth <= labelX && x >= labelMidWidth && labelXEnd <= _this3.el.clientWidth) {
            labelOccupiedWidth = labelXEnd + 15; // + 15 minimal distance between labels

            _this3.ctx2d.fillText(label, labelX, _this3.el.clientHeight);
          }
        });
      }
    }]);

    return XAxisLayer;
  }(CanvasHTMLComponent);

  var YAxisLayer =
  /*#__PURE__*/
  function (_CanvasHTMLComponent2) {
    _inherits(YAxisLayer, _CanvasHTMLComponent2);

    function YAxisLayer() {
      var _this4;

      _classCallCheck(this, YAxisLayer);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(YAxisLayer).call(this));
      _this4._prevMaxY = null;
      _this4._anim = new Animation(_this4._frameAnimHandler);
      return _this4;
    }

    _createClass(YAxisLayer, [{
      key: "whenCreated",
      value: function whenCreated(el) {
        _get(_getPrototypeOf(YAxisLayer.prototype), "whenCreated", this).call(this, el);

        el.className = 'y-axis';
      }
    }, {
      key: "whenRendered",
      value: function whenRendered(el, _ref5) {
        var _this5 = this;

        var chartData = _ref5.chartData,
            opts = _ref5.opts;
        var increase = this._prevMaxY === void 0 || chartData.maxY > this._prevMaxY ? true : chartData.maxY === this._prevMaxY ? undefined : false; // TODO: 0

        if (0 && increase === undefined) {
          return;
        }

        this._anim.start({
          layer: this,
          anim: this._anim,
          ctx: this.ctx2d,
          xData: chartData.xData,
          minY: chartData.minY,
          stepValY: (chartData.maxY - chartData.minY) / opts.yAxis.grid.horizontalLines,
          stepHrzLine: (this.el.clientHeight - opts.drawingFrame.y + opts.drawingFrame.height) / opts.yAxis.grid.horizontalLines,
          maxShift: 40,
          chartData: chartData,
          opts: opts,
          increase: increase
        }, 1000).onFinished(function () {
          _this5._prevMaxY = chartData.maxY;
        });
      }
    }, {
      key: "_renderXYAxisLabels",
      value: function _renderXYAxisLabels() {
        for (var i = 0, initY, animY; i < this.opts.yAxis.grid.horizontalLines; i++) {
          initY = (i + 1) * this.stepHrzLine - 1;

          if (this.increase) {
            animY = initY + this.maxShift - this.anim.easeOutExpo(this.progress, 0, this.maxShift, this.duration);
            animY = animY < initY ? initY : animY;
          } else {
            animY = this.anim.easeOutExpo(this.progress, initY - this.maxShift, this.maxShift, this.duration);
            animY = animY > initY ? initY : animY;
          }

          this.ctx.beginPath();
          this.ctx.lineWidth = this.opts.yAxis.grid.lineWidth;
          this.ctx.strokeStyle = i === this.opts.yAxis.grid.horizontalLines - 1 ? getColor('gridBottomBorder') : getColor('gridLine');
          this.ctx.moveTo(0, animY + this.opts.drawingFrame.y + 1);
          this.ctx.lineTo(this.layer.el.clientWidth, animY + this.opts.drawingFrame.y + 1);
          this.ctx.stroke();
          this.ctx.textBaseline = 'top';
          this.ctx.font = '.7em' + ' ' + 'Arial';
          this.ctx.fillStyle = getColor('XYAxisLabels');
          this.ctx.fillText(toHumanValue(this.minY + this.stepValY * (this.opts.yAxis.grid.horizontalLines - 1 - i)), 0, animY - 15 + this.opts.drawingFrame.y);
        }
      }
    }, {
      key: "_frameAnimHandler",
      value: function _frameAnimHandler() {
        this.layer.clear();

        this.layer._renderXYAxisLabels.call(this);
      }
    }]);

    return YAxisLayer;
  }(CanvasHTMLComponent);

  var PointsInfoHTMLComponent =
  /*#__PURE__*/
  function (_HTMLComponent2) {
    _inherits(PointsInfoHTMLComponent, _HTMLComponent2);

    function PointsInfoHTMLComponent() {
      var _this6;

      _classCallCheck(this, PointsInfoHTMLComponent);

      _this6 = _possibleConstructorReturn(this, _getPrototypeOf(PointsInfoHTMLComponent).call(this));

      _defineProperty(_assertThisInitialized(_this6), "NAME", 'points-info');

      _defineProperty(_assertThisInitialized(_this6), "DAY_NAMES", ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

      _this6._values = [];
      return _this6;
    }

    _createClass(PointsInfoHTMLComponent, [{
      key: "whenCreate",
      value: function whenCreate() {
        this._values = [];
      }
    }, {
      key: "render",
      value: function render(_ref6) {
        var x = _ref6.x;
        var date = new Date(x);
        var weekDay = this.DAY_NAMES[date.getDay()];
        var month = MONTH_NAMES[date.getMonth()];
        var day = date.getDate();
        return "\n                <div class=\"title\" style=\"color: ".concat(getColor('pointsInfoTitle'), "\">\n                   ").concat(weekDay, ", ").concat(month, " ").concat(day, "\n                </div>\n                <div class=\"values\">\n                    ").concat(this._values.map(function (_ref7) {
          var yVal = _ref7.yVal,
              lineName = _ref7.lineName,
              color = _ref7.color;
          return "\n                        <div class=\"value\" style=\"color: ".concat(color, "\">\n                            <div>").concat(toHumanValue(yVal), "</div>\n                            <div>").concat(lineName, "</div>\n                        </div>\n                    ");
        }).join(''), "\n                </div>\n            ");
      }
    }, {
      key: "onMouseOut",
      value: function onMouseOut() {}
    }, {
      key: "whenCreated",
      value: function whenCreated(el) {
        el.style.backgroundColor = getColor('pointsInfoBackground');
        this.el.addEventListener('mouseout', this.onMouseOut);
      }
    }, {
      key: "addVal",
      value: function addVal(_ref8) {
        var yVal = _ref8.yVal,
            lineName = _ref8.lineName,
            color = _ref8.color;

        this._values.push({
          yVal: yVal,
          lineName: lineName,
          color: color
        });

        this.rerender();
      }
    }, {
      key: "setPosition",
      value: function setPosition(_ref9) {
        var left = _ref9.left,
            right = _ref9.right,
            top = _ref9.top;
        this.el.style.left = left;
        this.el.style.right = right;
        this.el.style.top = top;
      }
    }]);

    return PointsInfoHTMLComponent;
  }(HTMLComponent);

  var InfoLayer =
  /*#__PURE__*/
  function (_CanvasHTMLComponent3) {
    _inherits(InfoLayer, _CanvasHTMLComponent3);

    function InfoLayer() {
      var _this7;

      _classCallCheck(this, InfoLayer);

      _this7 = _possibleConstructorReturn(this, _getPrototypeOf(InfoLayer).call(this));
      _this7._chartData = null;
      _this7._pointsInfo = new PointsInfoHTMLComponent();
      return _this7;
    }

    _createClass(InfoLayer, [{
      key: "whenCreated",
      value: function whenCreated(el, _ref10) {
        var _this8 = this;

        var chartData = _ref10.chartData,
            opts = _ref10.opts;

        _get(_getPrototypeOf(InfoLayer.prototype), "whenCreated", this).call(this, el);

        el.className = 'info';
        this._chartData = chartData;
        el.addEventListener('mousemove', this._mouseMoveHandler.bind(this, opts));
        el.addEventListener('mouseout', this._mouseOutHandler.bind(this));

        this._pointsInfo.onMouseOut = function (e) {
          e.stopPropagation();

          if (e.relatedTarget && !parentElementsHierarchy(e.relatedTarget).includes(_this8._pointsInfo.el)) {
            _this8.clear();

            _this8._pointsInfo.remove();
          }
        };
      }
    }, {
      key: "whenRendered",
      value: function whenRendered(el, _ref11) {
        var chartData = _ref11.chartData;
        this._chartData = chartData;
      }
    }, {
      key: "_showInfo",
      value: function _showInfo(chartData, opts, currXPos, points, lineIndex) {
        for (var i = 0, leftPointMidDist, rightPointMidDist; i < points.length; i++) {
          if (i > 0) {
            leftPointMidDist = (points[i][0] - points[i - 1][0]) * .5;
          }

          if (i < points.length - 1) {
            rightPointMidDist = (points[i + 1][0] - points[i][0]) * .5;
          }

          if (currXPos >= points[i][0] - leftPointMidDist && currXPos <= points[i][0] + rightPointMidDist) {
            if (this._firstPoint) {
              this._firstPoint = false;
              this.ctx2d.beginPath();
              this.ctx2d.lineWidth = 1;
              this.ctx2d.strokeStyle = getColor('verticalInfoLine');
              this.ctx2d.moveTo(points[i][0], 0);
              this.ctx2d.lineTo(points[i][0], this.el.clientHeight + opts.drawingFrame.height);
              this.ctx2d.stroke();

              if (this._pointsInfo.el) {
                // TODO: clear _values inside the component
                this._pointsInfo._values = [];

                this._pointsInfo.rerender({
                  x: chartData.xData[i]
                });
              } else {
                this._pointsInfo.create(this.el.parentElement, {
                  x: chartData.xData[i]
                });
              }
            }

            this._pointsInfo.addVal({
              yVal: chartData.yDatas[lineIndex][i],
              lineName: chartData.names[lineIndex],
              color: chartData.colors[lineIndex]
            });

            this._pointsInfo.setPosition({
              left: points[i][0] + 10 - this._pointsInfo.el.clientWidth * .5 + 'px',
              top: '10px'
            });

            this.ctx2d.beginPath();
            this.ctx2d.lineWidth = 2;
            this.ctx2d.strokeStyle = chartData.colors[lineIndex];
            this.ctx2d.fillStyle = getColor('background');
            this.ctx2d.arc(points[i][0], points[i][1], 4, 0, 2 * Math.PI);
            this.ctx2d.fill();
            this.ctx2d.stroke();
          }
        }
      }
    }, {
      key: "_mouseMoveHandler",
      value: function _mouseMoveHandler(opts, e) {
        e.stopPropagation();
        this.clear();
        this._firstPoint = true;
        drawPlot({
          x: opts.drawingFrame.x,
          y: opts.drawingFrame.y,
          width: this.el.clientWidth - opts.drawingFrame.x + opts.drawingFrame.width,
          height: this.el.clientHeight - opts.drawingFrame.y + opts.drawingFrame.height - 2
        }, this._chartData, this._showInfo.bind(this, this._chartData, opts, e.layerX));
      }
    }, {
      key: "_mouseOutHandler",
      value: function _mouseOutHandler(e) {
        e.stopPropagation();

        if (e.relatedTarget && !parentElementsHierarchy(e.relatedTarget).includes(this._pointsInfo.el)) {
          this.clear();

          this._pointsInfo.remove();
        }
      }
    }]);

    return InfoLayer;
  }(CanvasHTMLComponent);

  var PlotLayer =
  /*#__PURE__*/
  function (_CanvasHTMLComponent4) {
    _inherits(PlotLayer, _CanvasHTMLComponent4);

    function PlotLayer() {
      var _this9;

      _classCallCheck(this, PlotLayer);

      _this9 = _possibleConstructorReturn(this, _getPrototypeOf(PlotLayer).call(this));
      _this9.renderedChartData = [];
      _this9._anim = new Animation(_this9._frameAnimHandler);
      return _this9;
    }

    _createClass(PlotLayer, [{
      key: "whenCreated",
      value: function whenCreated(el) {
        _get(_getPrototypeOf(PlotLayer.prototype), "whenCreated", this).call(this, el);

        el.className = 'plot';
      }
    }, {
      key: "whenRendered",
      value: function whenRendered(el, _ref12) {
        var chartData = _ref12.chartData,
            opts = _ref12.opts,
            animate = _ref12.animate;

        this._anim.start({
          renderedChartData: this.renderedChartData,
          anim: this._anim,
          ctx: this.ctx2d,
          layer: this,
          chartData: chartData,
          opts: opts,
          animate: animate
        }, 800);
      }
    }, {
      key: "_frameAnimHandler",
      value: function _frameAnimHandler() {
        this.layer.clear();
        var lineWidth = 2;
        drawPlot({
          x: this.opts.drawingFrame.x,
          y: this.opts.drawingFrame.y,
          width: this.layer.el.clientWidth - this.opts.drawingFrame.x + this.opts.drawingFrame.width,
          height: this.layer.el.clientHeight - this.opts.drawingFrame.y + this.opts.drawingFrame.height - lineWidth
        }, this.chartData, drawingPlotFunc.bind(this));

        function drawingPlotFunc(points, lineIndex) {
          this.ctx.beginPath();
          this.ctx.lineWidth = lineWidth;
          this.ctx.strokeStyle = this.chartData.colors[lineIndex];

          for (var i = 0, x, y; i < points.length; i++) {
            x = points[i][0];
            y = points[i][1];
            var yr = void 0;

            if (this.animate) {
              var prevY = 0;

              if (this.renderedChartData[lineIndex] !== undefined) {
                if (this.renderedChartData[lineIndex][i] !== undefined) {
                  prevY = this.renderedChartData[lineIndex][i];
                }
              }

              if (y < prevY) {
                yr = prevY - this.anim.easeOutExpo(this.progress, 0, prevY - y, this.duration);
              } else {
                yr = this.anim.easeOutExpo(this.progress, prevY, y - prevY, this.duration);
              }
            } else {
              yr = y;
            }

            if (this.renderedChartData[lineIndex] === undefined) {
              this.renderedChartData[lineIndex] = [yr];
            } else {
              this.renderedChartData[lineIndex][i] = yr;
            }

            this.ctx.lineTo(x, yr);
          }

          this.ctx.stroke();
        }
      }
    }]);

    return PlotLayer;
  }(CanvasHTMLComponent);

  var ZoomCarriage =
  /*#__PURE__*/
  function (_HTMLComponent3) {
    _inherits(ZoomCarriage, _HTMLComponent3);

    function ZoomCarriage() {
      var _this10;

      _classCallCheck(this, ZoomCarriage);

      _this10 = _possibleConstructorReturn(this, _getPrototypeOf(ZoomCarriage).call(this));

      _defineProperty(_assertThisInitialized(_this10), "NAME", 'zoom-carriage');

      _this10._currVisibilityFrame = null;
      _this10._moveIsActive = false;
      _this10._startStretchXPos = null;
      _this10._initProps = {};
      _this10._leftStretch = null;
      _this10._rightStretch = null;
      _this10._leftStretchIsActive = false;
      _this10._rightStretchIsActive = false;
      return _this10;
    }

    _createClass(ZoomCarriage, [{
      key: "render",
      value: function render() {
        return "\n                <div class=\"left-stretch\"></div>\n                <div class=\"right-stretch\"></div>\n            ";
      }
    }, {
      key: "whenVisibilityChanged",
      value: function whenVisibilityChanged(visibilityFrame) {}
    }, {
      key: "whenCreated",
      value: function whenCreated(el, _ref13) {
        var opts = _ref13.opts;
        var color = getColor('zoomCarriageTool');
        el.style.borderTopColor = color;
        el.style.borderBottomColor = color;
        this._leftStretch = el.getElementsByClassName('left-stretch')[0];
        this._leftStretch.style.backgroundColor = color;
        this._rightStretch = el.getElementsByClassName('right-stretch')[0];
        this._rightStretch.style.backgroundColor = color;
        addEventListeners(window, 'mousemove touchmove', this._windowMouseMoveHandler.bind(this));
        addEventListeners(window, 'mouseup touchend', this._windowMouseUpHandler.bind(this));
        addEventListeners(el, 'mousedown touchstart', this._mouseDownHandler.bind(this));
        addEventListeners(this._leftStretch, 'mousedown touchstart', this._stretchMouseDownHandler.bind(this));
        addEventListeners(this._rightStretch, 'mousedown touchstart', this._stretchMouseDownHandler.bind(this));
        this.whenVisibilityChanged(this._currVisibilityFrame || this.visibilityFrame);
      }
    }, {
      key: "getRightShift",
      value: function getRightShift() {
        return parseFloat(this.el.style.right) || 0;
      }
    }, {
      key: "_windowMouseMoveHandler",
      value: function _windowMouseMoveHandler(e) {
        var x = e.screenX;

        if (e instanceof TouchEvent) {
          x = e.changedTouches[0].screenX;
        }

        var dist = this._startStretchXPos - x;

        if (this._moveIsActive) {
          this._move(dist);

          return;
        }

        if (this._leftStretchIsActive) {
          this._moveLeftStretch(dist);

          return;
        }

        if (this._rightStretchIsActive) {
          this._moveRightStretch(dist);
        }
      }
    }, {
      key: "_windowMouseUpHandler",
      value: function _windowMouseUpHandler() {
        this._moveIsActive = false;
        this._leftStretchIsActive = false;
        this._rightStretchIsActive = false;
      }
    }, {
      key: "_mouseDownHandler",
      value: function _mouseDownHandler(e) {
        e.stopPropagation();
        var x = e.screenX;

        if (e instanceof TouchEvent) {
          x = e.touches[0].screenX;
        }

        this._moveIsActive = true;
        this._startStretchXPos = x;
        this._initProps.right = this.getRightShift();
        this._initProps.width = this.el.clientWidth;
      }
    }, {
      key: "_stretchMouseDownHandler",
      value: function _stretchMouseDownHandler(e) {
        e.stopPropagation();
        var x = e.screenX;

        if (e instanceof TouchEvent) {
          x = e.touches[0].screenX;
        }

        if (e.target === this._leftStretch) {
          this._leftStretchIsActive = true;
        } else if (e.target === this._rightStretch) {
          this._rightStretchIsActive = true;
        }

        this._startStretchXPos = x;
        this._initProps.right = this.getRightShift();
        this._initProps.width = this.el.clientWidth;
        this._initProps.left = this.el.offsetLeft;
      }
    }, {
      key: "_setProps",
      value: function _setProps(_ref14) {
        var width = _ref14.width,
            right = _ref14.right;

        if (width) {
          this.el.style.width = width;
        }

        if (right) {
          this.el.style.right = right;
        }

        this._currVisibilityFrame = this.visibilityFrame;
        this.whenVisibilityChanged(this.visibilityFrame);
      }
    }, {
      key: "_move",
      value: function _move(dist) {
        var newRight = (this._initProps.right || 0) + dist;

        if (newRight >= 0 && newRight <= this.parent.el.clientWidth - (this._initProps.width || this.el.clientWidth)) {
          this._setProps({
            right: newRight + 'px'
          });
        }
      }
    }, {
      key: "_moveLeftStretch",
      value: function _moveLeftStretch(dist) {
        var newWidth = (this._initProps.width || this.el.clientWidth) + dist;

        if (newWidth >= 135 && newWidth <= this.parent.el.clientWidth - (this._initProps.right || this.getRightShift())) {
          this._setProps({
            width: newWidth + 'px'
          });
        }
      }
    }, {
      key: "_moveRightStretch",
      value: function _moveRightStretch(dist) {
        var newRight = (this._initProps.right || this.getRightShift()) + dist;

        if (newRight >= 0 && this.parent.el.clientWidth - (this._initProps.left || this.el.offsetLeft) - 135 >= newRight) {
          var newWidth = (this._initProps.width || this.el.clientWidth) - dist;

          this._setProps({
            right: newRight + 'px',
            width: newWidth + 'px'
          });
        }
      }
    }, {
      key: "visibilityFrame",
      get: function get() {
        var from = this.el.offsetLeft / this.parent.el.clientWidth,
            to = from + this.el.clientWidth / this.parent.el.clientWidth;
        return [from, to];
      }
    }]);

    return ZoomCarriage;
  }(HTMLComponent);

  var ZoomPlot =
  /*#__PURE__*/
  function (_CanvasHTMLComponent5) {
    _inherits(ZoomPlot, _CanvasHTMLComponent5);

    function ZoomPlot() {
      _classCallCheck(this, ZoomPlot);

      return _possibleConstructorReturn(this, _getPrototypeOf(ZoomPlot).apply(this, arguments));
    }

    _createClass(ZoomPlot, [{
      key: "whenRendered",
      value: function whenRendered(el, _ref15) {
        var _this11 = this;

        var chartData = _ref15.chartData,
            opts = _ref15.opts;
        var lineWidth = 1;
        this.clear();
        drawPlot({
          x: 0,
          y: lineWidth,
          width: this.el.clientWidth,
          height: this.el.clientHeight - lineWidth
        }, chartData, function (points, lineIndex) {
          _this11.ctx2d.beginPath();

          _this11.ctx2d.lineWidth = lineWidth;
          _this11.ctx2d.strokeStyle = chartData.colors[lineIndex];

          for (var i = 0; i < points.length; i++) {
            _this11.ctx2d.lineTo(points[i][0], points[i][1]);
          }

          _this11.ctx2d.stroke();
        });
      }
    }]);

    return ZoomPlot;
  }(CanvasHTMLComponent);

  var Zoom =
  /*#__PURE__*/
  function (_HTMLComponent4) {
    _inherits(Zoom, _HTMLComponent4);

    function Zoom() {
      var _this12;

      _classCallCheck(this, Zoom);

      _this12 = _possibleConstructorReturn(this, _getPrototypeOf(Zoom).call(this));

      _defineProperty(_assertThisInitialized(_this12), "NAME", 'zoom');

      _this12._plot = new ZoomPlot();
      _this12._overlay = new CanvasHTMLComponent();
      _this12._zoomCarriage = new ZoomCarriage();
      return _this12;
    }

    _createClass(Zoom, [{
      key: "render",
      value: function render(_ref16) {
        var chartData = _ref16.chartData,
            opts = _ref16.opts;
        this._zoomCarriage.whenVisibilityChanged = this._whenVisibilityChanged.bind(this);
        return "\n                ".concat(this._plot.create(this, {
          chartData: chartData,
          opts: opts
        }), "\n                ").concat(this._overlay.create(this, {
          chartData: chartData,
          opts: opts
        }), "\n                ").concat(this._zoomCarriage.create(this, {
          chartData: chartData,
          opts: opts
        }), "\n            ");
      }
    }, {
      key: "whenVisibilityChanged",
      value: function whenVisibilityChanged(visibilityFrame) {}
    }, {
      key: "_whenVisibilityChanged",
      value: function _whenVisibilityChanged(visibilityFrame) {
        this._renderOverlay();

        this.whenVisibilityChanged(visibilityFrame);
      }
    }, {
      key: "_renderOverlay",
      value: function _renderOverlay() {
        this._overlay.clear();

        this._overlay.ctx2d.fillStyle = getColor('zoomOverlay');

        this._overlay.ctx2d.fillRect(0, 0, this._zoomCarriage.el.offsetLeft, this._overlay.el.clientHeight);

        var zoomCarriageRightShift = this._zoomCarriage.getRightShift();

        this._overlay.ctx2d.fillRect(this._overlay.el.clientWidth - zoomCarriageRightShift, 0, zoomCarriageRightShift, this._overlay.el.clientHeight);
      }
    }, {
      key: "visibilityFrame",
      get: function get() {
        return this._zoomCarriage.visibilityFrame;
      }
    }]);

    return Zoom;
  }(HTMLComponent);

  var LegendItem =
  /*#__PURE__*/
  function (_HTMLComponent5) {
    _inherits(LegendItem, _HTMLComponent5);

    function LegendItem() {
      var _this13;

      _classCallCheck(this, LegendItem);

      _this13 = _possibleConstructorReturn(this, _getPrototypeOf(LegendItem).call(this));

      _defineProperty(_assertThisInitialized(_this13), "NAME", 'li');

      _this13._lineIndex = null;
      _this13._visible = true;
      return _this13;
    }

    _createClass(LegendItem, [{
      key: "render",
      value: function render(_ref17) {
        var name = _ref17.name,
            color = _ref17.color,
            lineIndex = _ref17.lineIndex;
        this._lineIndex = lineIndex;
        var styleObj = {
          backgroundColor: color,
          borderColor: color
        };

        if (!this._visible) {
          styleObj.maskImage = 'unset';
          styleObj.webkitMaskImage = 'unset';
          styleObj.backgroundColor = 'none';
        }

        return "\n                <div class=\"state\" style=\"".concat(style(styleObj), "\"></div>\n                <div class=\"name\" style=\"color: ").concat(getColor('legendItemName'), "\">").concat(name, "</div>\n            ");
      }
    }, {
      key: "whenStateChanged",
      value: function whenStateChanged(lineIndex, visible) {}
    }, {
      key: "whenCreated",
      value: function whenCreated(el) {
        var _this14 = this;

        el.style.borderColor = getColor('legendItemBorder');
        el.addEventListener('click', function () {
          _this14._visible = !_this14._visible;

          _this14.rerender();

          _this14.whenStateChanged(_this14._lineIndex, _this14._visible);
        });
      }
    }]);

    return LegendItem;
  }(HTMLComponent);

  var Legend =
  /*#__PURE__*/
  function (_HTMLComponent6) {
    _inherits(Legend, _HTMLComponent6);

    function Legend() {
      var _this15;

      _classCallCheck(this, Legend);

      _this15 = _possibleConstructorReturn(this, _getPrototypeOf(Legend).call(this));

      _defineProperty(_assertThisInitialized(_this15), "NAME", 'ul');

      _this15._lines = [];
      return _this15;
    }

    _createClass(Legend, [{
      key: "render",
      value: function render(_ref18) {
        var _this16 = this;

        var chartData = _ref18.chartData,
            opts = _ref18.opts;
        return "\n               ".concat(this._lines.map(function (_ref19, lineIndex) {
          var name = _ref19.name,
              color = _ref19.color;
          var legendItem = new LegendItem();
          legendItem.whenStateChanged = _this16.whenLegendItemStateChanged;
          return legendItem.create(_this16, {
            name: name,
            color: color,
            lineIndex: lineIndex
          });
        }).join(''), " \n            ");
      }
    }, {
      key: "whenLegendItemStateChanged",
      value: function whenLegendItemStateChanged(lineIndex, visible) {}
    }, {
      key: "whenCreated",
      value: function whenCreated(el, _ref20) {
        var chartData = _ref20.chartData;
        el.className = 'legend';
      }
    }, {
      key: "addLine",
      value: function addLine(_ref21) {
        var name = _ref21.name,
            color = _ref21.color;

        this._lines.push({
          name: name,
          color: color
        });

        this.rerender();
      }
    }]);

    return Legend;
  }(HTMLComponent);

  var Chart =
  /*#__PURE__*/
  function (_HTMLComponent7) {
    _inherits(Chart, _HTMLComponent7);

    function Chart() {
      var _this17;

      _classCallCheck(this, Chart);

      _this17 = _possibleConstructorReturn(this, _getPrototypeOf(Chart).call(this));

      _defineProperty(_assertThisInitialized(_this17), "NAME", 'chart');

      _this17._yAxisLayer = new YAxisLayer();
      _this17._xAxisLayer = new XAxisLayer();
      _this17._plotLayer = new PlotLayer();
      _this17._infoLayer = new InfoLayer();
      _this17._zoom = new Zoom();
      _this17._legend = new Legend();
      return _this17;
    }

    _createClass(Chart, [{
      key: "render",
      value: function render(_ref22) {
        var _this18 = this;

        var chartData = _ref22.chartData,
            opts = _ref22.opts;
        var currVisibilityFrame,
            visibilityChangedTimer,
            lastVisibleChartData = {
          minY: null,
          maxY: null
        };

        this._zoom.whenVisibilityChanged = function (visibilityFrame) {
          currVisibilityFrame = visibilityFrame;

          _this18._render(chartData, opts, lastVisibleChartData, visibilityFrame, false);

          if (visibilityChangedTimer) {
            clearTimeout(visibilityChangedTimer);
          }

          visibilityChangedTimer = setTimeout(function () {
            _this18._render(chartData, opts, lastVisibleChartData, visibilityFrame, true, true);
          }, 100);
        };

        this._legend.whenLegendItemStateChanged = function (lineIndex, visible) {
          chartData.yDatas[lineIndex].visible = visible;

          _this18._zoom._plot.rerender({
            chartData: chartData,
            opts: opts.zoom
          });

          _this18._render(chartData, opts, lastVisibleChartData, currVisibilityFrame, true, true);
        };

        return "\n                ".concat(this._plotLayer.create(this, {
          chartData: chartData,
          opts: opts
        }), "\n                ").concat(this._yAxisLayer.create(this, {
          chartData: chartData,
          opts: opts
        }), "\n                ").concat(this._xAxisLayer.create(this, {
          chartData: chartData,
          opts: opts
        }), "\n                ").concat(this._infoLayer.create(this, {
          chartData: chartData,
          opts: opts
        }), "\n                ").concat(this._zoom.create(this, {
          chartData: chartData,
          opts: opts.zoom
        }), "\n                ").concat(this._legend.create(this, {
          chartData: chartData,
          opts: opts
        }), "\n            ");
      }
    }, {
      key: "whenCreated",
      value: function whenCreated(el, _ref23) {
        var _this19 = this;

        var chartData = _ref23.chartData;
        chartData.names.forEach(function (name, i) {
          _this19._legend.addLine({
            name: name,
            color: chartData.colors[i]
          });
        });
      }
    }, {
      key: "_render",
      value: function _render(chartData, opts, lastVisibleChartData, visibilityFrame) {
        var recalculateMinMaxY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
        var animate = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        var xl = chartData.xData.length,
            visibleXData = chartData.xData.slice(xl * visibilityFrame[0], xl * visibilityFrame[1]),
            minMaxValX = minMax(visibleXData);
        var visibleChartData = {
          xData: visibleXData,
          yDatas: [],
          minValX: minMaxValX[0],
          maxValX: minMaxValX[1],
          minY: null,
          maxY: null,
          colors: [],
          names: chartData.names
        };

        for (var lineIndex = 0, visibleData, pointsYLen; lineIndex < chartData.yDatas.length; lineIndex++) {
          if (chartData.yDatas[lineIndex].visible === false) {
            continue;
          }

          visibleChartData.colors.push(chartData.colors[lineIndex]);
          pointsYLen = chartData.yDatas[lineIndex].length;
          visibleData = chartData.yDatas[lineIndex].slice(pointsYLen * visibilityFrame[0], pointsYLen * visibilityFrame[1]);
          visibleChartData.yDatas.push(visibleData);

          if (recalculateMinMaxY) {
            var mm = minMax(visibleData);
            visibleChartData.minY = visibleChartData.minY === null ? mm[0] : Math.min(visibleChartData.minY, mm[0]);
            visibleChartData.maxY = visibleChartData.maxY === null ? mm[1] : Math.max(visibleChartData.maxY, mm[1]);
          }
        }

        if (visibleChartData.minY == null) {
          visibleChartData.minY = visibleChartData.minY || lastVisibleChartData.minY || chartData.minY;
        }

        if (visibleChartData.maxY == null) {
          visibleChartData.maxY = visibleChartData.maxY || lastVisibleChartData.maxY || chartData.maxY;
        }

        lastVisibleChartData.minY = visibleChartData.minY;
        lastVisibleChartData.maxY = visibleChartData.maxY;

        this._yAxisLayer.rerender({
          chartData: visibleChartData,
          opts: opts
        });

        this._xAxisLayer.rerender({
          chartData: visibleChartData,
          opts: opts
        });

        this._plotLayer.rerender({
          chartData: visibleChartData,
          opts: opts,
          animate: animate
        });

        this._infoLayer.rerender({
          chartData: visibleChartData,
          opts: opts
        });
      }
    }]);

    return Chart;
  }(HTMLComponent);

  return {
    configure: configure,
    setData: setData,
    switchMode: switchMode,
    isNightMode: isNightMode
  };

  function configure(val) {
    config = Object.assign(config, val);
  }

  function setData(data) {
    if (!Array.isArray(data)) {
      throw new TypeError('Data for the TChart can be Array type only');
    } // to re-render the scene without the passing data always


    rerender = render.bind(null, data);
    fullrerender = rerender.bind(null, {
      drawingFrame: {
        x: 0,
        y: 10,
        width: 0,
        height: -20
      },
      yAxis: {
        text: {
          fontSize: '.7em',
          fontFamily: 'Arial'
        },
        grid: {
          horizontalLines: 5,
          lineWidth: .3
        }
      }
    });
    fullrerender();
  }

  function switchMode() {
    config.nightMode = !config.nightMode;
    fullrerender();
  }

  function isNightMode() {
    return config.nightMode;
  }

  function getColor(name) {
    return config.nightMode ? colorsMap.night[name] : colorsMap.day[name];
  }

  function prepareChartData(chartData) {
    var xData,
        yDatas = [],
        minMaxXData,
        minY,
        maxY,
        colors = [],
        names = [];

    for (var columnIndex = 0; columnIndex < chartData.columns.length; columnIndex++) {
      var columnData = chartData.columns[columnIndex];

      if (!Array.isArray(columnData)) {
        throw new TypeError('Column data can be only Array type');
      }

      if (!columnData.length) {
        throw new Error('Column data cannot be empty');
      }

      var columnName = columnData[0],
          columnType = chartData.types[columnName];

      if (!columnType) {
        throw new TypeError('Column type for a column by ref"' + columnName + '" was not defined');
      }

      if (![LINE_COLUMN_TYPE, X_COLUMN_TYPE].includes(columnType)) {
        throw new Error('Column type "' + columnType + '" does not supported');
      }

      if (columnType === X_COLUMN_TYPE) {
        if (xData) {
          throw new Error('Column type "X" can be only one');
        }

        xData = columnData.slice(1); // remove column type from data

        minMaxXData = minMax(xData);
      } else {
        var yData = columnData.slice(1); // remove column type from data

        var minMaxYData = minMax(yData);
        minY = minY === undefined ? minMaxYData[0] : Math.min(minY, minMaxYData[0]);
        maxY = maxY === undefined ? minMaxYData[1] : Math.max(maxY, minMaxYData[1]);
        yDatas.push(yData); // meta

        colors.push(chartData.colors[columnName]);
        names.push(chartData.names[columnName]);
      }
    }

    return {
      xData: xData,
      yDatas: yDatas,
      names: names,
      colors: colors,
      minValX: minMaxXData[0],
      maxValX: minMaxXData[1],
      minY: minY,
      maxY: maxY
    };
  }

  function render(data, opts) {
    var chartsContainer = document.getElementById(config.containerId);

    if (!chartsContainer) {
      throw new Error('Charts container by ID "' + config.containerId + '" was not found');
    }

    document.body.className = config.nightMode ? 'night-mode' : '';
    chartsContainer.innerHTML = '';

    for (var i = 0; i < data.length; i++) {
      new Chart().create(chartsContainer, {
        chartData: prepareChartData(data[i]),
        opts: opts
      });
    }
  }
  /**
   * @param {Object} canvas - Canvas HTML element
   * @param {Object} drawingFrame
   * @param {Array} data
   * @param {Number} minValX
   * @param {Number} maxValX
   * @param {function} callback
   */


  function bypassXPoints(canvas, drawingFrame, data, minValX, maxValX, callback) {
    var width = canvas.clientWidth - drawingFrame.x + drawingFrame.width,
        compressionRatioX = width / (maxValX - minValX);

    for (var i = 0; i < data.length; i++) {
      var x = drawingFrame.x + (data[i] - minValX) * compressionRatioX;
      callback(data[i], x);
    }
  }
  /**
   * Draw the plot in the specific area somewhere you want
   * @param {{x: number, y: number, width: number, height: number}} areaMetric -
   * @param {Object} chartData
   * @param {function} drawingFunc
   */


  function drawPlot(areaMetric, chartData, drawingFunc) {
    var compressionRatioX = areaMetric.width / (chartData.maxValX - chartData.minValX),
        compressionRatioY = areaMetric.height / (chartData.maxY - chartData.minY);

    for (var lineIndex = 0, points; lineIndex < chartData.yDatas.length; lineIndex++) {
      if (chartData.yDatas[lineIndex].visible === false) {
        continue;
      }

      points = [];

      for (var yIndex = 0; yIndex < chartData.yDatas[lineIndex].length; yIndex++) {
        points.push([areaMetric.x + (chartData.xData[yIndex] - chartData.minValX) * compressionRatioX, // areaMetric.height - inversion by Y
        areaMetric.y + areaMetric.height - (chartData.yDatas[lineIndex][yIndex] - chartData.minY) * compressionRatioY]);
      }

      drawingFunc(points, lineIndex);
    }
  }

  function Animation(frameHandler) {
    var reqAnimId,
        onFinishedCallback = function onFinishedCallback() {};

    return {
      start: start,
      easeOutExpo: easeOutExpo,
      onFinished: onFinished
    };

    function onFinished(callback) {
      onFinishedCallback = callback;
    }

    function start(context, duration) {
      context = context || {};
      var startAnimTime;

      if (reqAnimId) {
        cancelAnimationFrame(reqAnimId);
      }

      reqAnimId = requestAnimationFrame(frame);
      return this;

      function frame(timestamp) {
        if (!startAnimTime) {
          startAnimTime = timestamp;
        }

        context.progress = timestamp - startAnimTime;
        context.duration = duration;
        frameHandler.call(context);

        if (context.progress < duration) {
          reqAnimId = requestAnimationFrame(frame);
        } else {
          reqAnimId = null;
          onFinishedCallback();
        }
      }
    }

    function easeOutExpo(t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    }
  }

  function minMax(data) {
    var min, max;

    for (var i = 0; i < data.length; i++) {
      if (min === undefined || min > data[i]) {
        min = data[i];
      }

      if (max === undefined || max < data[i]) {
        max = data[i];
      }
    }

    return [min, max];
  }

  function toHumanValue(v) {
    if (v >= 1000000000) {
      return (v / 1000000000).toFixed(2) + 'G';
    } else if (v >= 1000000) {
      return (v / 1000000).toFixed(2) + 'M';
    } else if (v >= 1000) {
      return (v / 1000).toFixed(2) + 'K';
    }

    return v > 0 ? v.toFixed(2) : v;
  }

  function parentElementsHierarchy(e) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    parents.push(e);

    if (e.parentElement) {
      parentElementsHierarchy(e.parentElement, parents);
    }

    return parents;
  }
}();
//# sourceMappingURL=tchart.js.map