let TChart = (
function() {
    function generateId() {
      return Math.random().toString(36).substr(2, 9);
    }

    function addEventListeners (el, events, listener, opts) {
        let eventsList = events.split(' ');
        for (let i = 0; i < eventsList.length; i++) {
            el.addEventListener(eventsList[i], listener, opts)
        }
    }

    function style (obj) {
        return Object.entries(obj).reduce((styleString, [propName, propValue]) => {
            propName = propName.replace(/([A-Z])/g, matches => `-${matches[0].toLowerCase()}`);
            return `${styleString}${propName}:${propValue};`;
        }, '')
    }

    class HTMLComponent {
        NAME = null;
        EVENTS = {
            CREATED: 'created'
        };

        constructor() {
            this._id = null;
            this._events = [];
            this.el = null;
            this.rerender = null;
            this.parent = null;
        }

        render(data) {
            throw new Error()
        }

        rerender(newData) {
            throw new Error()
        }

        on (event, handler, once) {
            once = once || false;

            if (!Object.values(this.EVENTS).includes(event)) {
                throw new Error(`The event "${event}" is not supported`)
            }
            this._events.push({event, handler, once})
        }

        whenCreated(el, data) {}

        whenCreate() {}

        whenRendered(el, data) {}

        create (parent, data, where) {
            this.whenCreate();

            let html = this._wrap(this.render(data));
            if (parent instanceof HTMLComponent) {
                this.parent = parent;
                parent.on(this.EVENTS.CREATED, this._postCreate.bind(this, data));
                return html

            } else {
                where = where || 'beforeEnd';
                parent.insertAdjacentHTML(where, html);
                this._postCreate(data)
            }
            return this.el
        }

        remove() {
            if (this.el) {
                this.el.remove();
                this.el = null;
            }
        }

        _postCreate (data) {
            this.el = document.getElementById(this._id);
            // TODO: null dom element
            if (!this.el) {
                return
            }

            this.rerender = (newData) => {
                data = newData || data;

                let html = this.render(data);
                this.el.innerHTML = html;
                this._raiseEvent(this.EVENTS.CREATED, data);
                this.whenRendered(this.el, data);
                return html;
            };
            this._raiseEvent(this.EVENTS.CREATED, data);
            this.whenCreated(this.el, data);
            this.whenRendered(this.el, data);
        };

        _raiseEvent (eventName, data) {
            this._events.forEach(({event, handler, once}, index, object) => {
                if (event === eventName) {
                    handler(data);
                    if (once) {
                        object.splice(index, 1);
                    }
                }
            })
        }

        _wrap (template) {
            this._id = generateId();
            return `<${this.NAME} id="${this._id}">${template}</${this.NAME}>`
        }
    }

    class CanvasHTMLComponent extends HTMLComponent {
        NAME = 'canvas';

        constructor() {
            super();

            this.ctx2d = null;
        }

        clear() {
            this.ctx2d.clearRect(0, 0, this.el.width, this.el.height)
        }

        whenCreated (el) {
            el.width = el.clientWidth;
            el.height = el.clientHeight;

            let dpr = window.devicePixelRatio || 1,
                canvasRect = el.getBoundingClientRect();

            el.width = canvasRect.width * dpr;
            el.height = canvasRect.height * dpr;

            this.ctx2d = el.getContext('2d');
            this.ctx2d.scale(dpr, dpr);
        }

        render() {
            return ''
        }
    }

    class GridLayer extends CanvasHTMLComponent {
        constructor() {
            super();

            this._prevMaxValY = null;
            this._anim = new Animation(this._frameAnimHandler);
        }

        whenCreated(el, {chartData, opts}) {
            super.whenCreated(el, {chartData, opts});

            el.className = 'grid';
        }

        whenRendered(el, {chartData, opts}) {
            let increase = this._prevMaxValY === void 0 || chartData.maxValY > this._prevMaxValY
                ? true
                : (chartData.maxValY === this._prevMaxValY ? undefined : false);

            // TODO: 0
            if (0 && increase === undefined) {
                return;
            }

            this._anim.start(
                {
                    layer: this,
                    anim: this._anim,
                    ctx: this.ctx2d,
                    chartData: chartData,
                    xData: chartData.xData,
                    opts: opts,
                    increase: increase,
                    minValY: chartData.minValY,
                    stepValY: (chartData.maxValY - chartData.minValY) / opts.yAxis.grid.horizontalLines,
                    stepHrzLine: (this.el.clientHeight - opts.drawingFrame.y + opts.drawingFrame.height) / opts.yAxis.grid.horizontalLines,
                    duration: 1000,
                    maxShift: 40
                }, 1000

            ).onFinished(() => {
                this._prevMaxValY = chartData.maxValY;
            });
        }

        _frameAnimHandler() {
            this.layer.clear();

            for (let i = 0, initY, animY; i < this.opts.yAxis.grid.horizontalLines; i++) {
                initY = (i + 1) * this.stepHrzLine - 1;

                if (this.increase) {
                    animY = initY + this.maxShift - this.anim.easeOutExpo(this.progress, 0, this.maxShift, this.duration);
                    animY = (animY < initY) ? initY : animY;
                } else {
                    animY = this.anim.easeOutExpo(this.progress, initY - this.maxShift, this.maxShift, this.duration);
                    animY = (animY > initY) ? initY : animY;
                }

                this.ctx.beginPath();
                this.ctx.lineWidth = this.opts.yAxis.grid.lineWidth;
                this.ctx.strokeStyle = i === this.opts.yAxis.grid.horizontalLines - 1
                    ? getColor('gridBottomBorder')
                    : getColor('gridLine');

                this.ctx.moveTo(0, animY + this.opts.drawingFrame.y + 1);
                this.ctx.lineTo(this.layer.el.clientWidth, animY + this.opts.drawingFrame.y + 1);
                this.ctx.stroke();

                this.ctx.textBaseline = 'top';
                this.ctx.font = '.7em' + ' ' + 'Arial';
                this.ctx.fillStyle = getColor('yAxisNumbers');
                this.ctx.fillText(
                    toHumanValue(this.minValY + this.stepValY * (this.opts.yAxis.grid.horizontalLines - 1 - i)),
                    0,
                    animY - 15 + this.opts.drawingFrame.y
                );
            }

            this.ctx.textBaseline = 'bottom';

            let labelOccupiedWidth = 0;
            cc(
                this.layer.el,
                this.opts.drawingFrame,
                this.chartData.xData,
                this.chartData.minValX,
                this.chartData.maxValX,
                function (val, x) {
                    let date = new Date(val),
                        label = MONTH_NAMES[date.getMonth()] + ' ' + date.getDate(),
                        labelWidth = this.ctx.measureText(label).width,
                        labelMidWidth = labelWidth / 2,
                        labelX = x - labelMidWidth;

                    if (labelOccupiedWidth <= labelX && x >= labelMidWidth && x + labelMidWidth <= this.layer.el.clientWidth) {
                        labelOccupiedWidth = labelX + labelWidth + 15; // + 15 minimal distance between labels

                        this.ctx.fillText(label, labelX, this.layer.el.clientHeight);
                    }
                }.bind(this)
            );
        }
    }

    class PointsInfoHTMLComponent extends HTMLComponent {
        NAME = 'points-info';
        DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        constructor() {
            super();

            this._values = []
        }

        whenCreate() {
            this._values = [];
        }

        render ({x}) {
            let date = new Date(x);
            let weekDay = this.DAY_NAMES[date.getDay()];
            let month = MONTH_NAMES[date.getMonth()];
            let day = date.getDate();

            return `
                <div class="title" style="color: ${getColor('pointsInfoTitle')}">
                   ${weekDay}, ${month} ${day}
                </div>
                <div class="values">
                    ${this._values.map(({yVal, lineName, color}) => `
                        <div class="value" style="color: ${color}">
                            <div>${toHumanValue(yVal)}</div>
                            <div>${lineName}</div>
                        </div>
                    `).join('')}
                </div>
            `
        }

        onMouseOut () { }

        whenCreated (el) {
            el.style.backgroundColor = getColor('pointsInfoBackground');

            this.el.addEventListener('mouseout', this.onMouseOut)
        }

        addVal ({yVal, lineName, color}) {
            this._values.push({yVal, lineName, color});
            this.rerender()
        }

        setPosition({left, right, top}) {
            this.el.style.left = left;
            this.el.style.right = right;
            this.el.style.top = top;
        }
    }

    class InfoLayer extends CanvasHTMLComponent {
        constructor() {
            super();

            this._chartData = null;
            this._pointsInfo = new PointsInfoHTMLComponent();
        }

        whenCreated(el, {chartData, opts}) {
            super.whenCreated(el);

            el.className = 'info';
            this._chartData = chartData;

            el.addEventListener('mousemove', this._mouseMoveHandler.bind(this, opts));
            el.addEventListener('mouseout', this._mouseOutHandler.bind(this));

            this._pointsInfo.onMouseOut = (e) => {
                e.stopPropagation();

                if (e.relatedTarget && !parentElementsHierarchy(e.relatedTarget).includes(this._pointsInfo.el)) {
                    this.clear();
                    this._pointsInfo.remove();
                }
            }
        }

        whenRendered(el, {chartData}) {
            this._chartData = chartData;
        }

        _showInfo(chartData, opts, currXPos, points, lineIndex) {
            for (let i = 0, leftPointMidDist, rightPointMidDist; i < points.length; i++) {
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
                            this._pointsInfo.rerender({x: chartData.xData[i]})

                        } else {
                            this._pointsInfo.create(this.el.parentElement, {x: chartData.xData[i]});
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

        _mouseMoveHandler(opts, e) {
            e.stopPropagation();

            this.clear();

            this._firstPoint = true;

            drawPlot(
                {
                    x: opts.drawingFrame.x,
                    y: opts.drawingFrame.y,
                    width: this.el.clientWidth - opts.drawingFrame.x + opts.drawingFrame.width,
                    height: this.el.clientHeight - opts.drawingFrame.y + opts.drawingFrame.height - 2
                },
                this._chartData,
                this._showInfo.bind(this, this._chartData, opts, e.layerX)
            );
        }

        _mouseOutHandler(e) {
            e.stopPropagation();

            if (e.relatedTarget && !parentElementsHierarchy(e.relatedTarget).includes(this._pointsInfo.el)) {
                this.clear();
                this._pointsInfo.remove();
            }
        }
    }

    class PlotLayer extends CanvasHTMLComponent {
        constructor() {
            super();

            this._anim = new Animation(this._frameAnimHandler);
        }

        whenCreated(el) {
            super.whenCreated(el);

            el.className = 'plot';
        }

        whenRendered(el, {chartData, opts}) {
            this._anim.start(
                {
                    ctx: this.ctx2d,
                    layer: this,
                    chartData,
                    opts
                },
                1000
            ).onFinished(function() {
                // renderedChartData = [];
                // prevChartData = chartData;
            });
        }

        _frameAnimHandler() {
            this.layer.clear();

            let lineWidth = 2;

            drawPlot(
                {
                    x: this.opts.drawingFrame.x,
                    y: this.opts.drawingFrame.y,
                    width: this.layer.el.clientWidth - this.opts.drawingFrame.x + this.opts.drawingFrame.width,
                    height: this.layer.el.clientHeight - this.opts.drawingFrame.y + this.opts.drawingFrame.height - lineWidth
                },
                this.chartData,
                drawingPlotFunc.bind(this)
            );

            function drawingPlotFunc(points, lineIndex) {
                this.ctx.beginPath();
                this.ctx.lineWidth = lineWidth;
                this.ctx.strokeStyle = this.chartData.colors[lineIndex];

                for (let i = 0, x, y; i < points.length; i++) {
                    x = points[i][0];
                    y = points[i][1];

                    // let prevYVal = 0;
                    // if (renderedChartData[lineIndex]) {
                    //     if (renderedChartData[lineIndex][i]) {
                    //         // prevYVal = renderedChartData[lineIndex][i][1];
                    //     }
                    // }
                    // let yr;
                    // if (y < prevYVal) {
                    //     yr = prevYVal - anim.easeOutExpo(self.progress, 0, prevYVal - y, self.duration);
                    // } else {
                    //     yr = anim.easeOutExpo(self.progress, prevYVal, y - prevYVal, self.duration);
                    // }
                    this.ctx.lineTo(x, y)
                }
                this.ctx.stroke();

                // renderedChartData[lineIndex] = points;
            }
        }
    }

    class ZoomCarriage extends HTMLComponent {
        NAME = 'zoom-carriage';

        constructor() {
            super();

            this._moveIsActive = false;
            this._startStretchXPos = null;
            this._initProps = {};
            this._leftStretch = null;
            this._rightStretch = null;
            this._leftStretchIsActive = false;
            this._rightStretchIsActive = false;
        }

        render() {
            return `
                <div class="left-stretch"></div>
                <div class="right-stretch"></div>
            `
        }

        get visibilityFrame() {
            let from = this.el.offsetLeft / this.parent.el.clientWidth,
                to = from + this.el.clientWidth / this.parent.el.clientWidth;
            return [from, to];
        }

        whenVisibilityChanged(visibilityFrame) {}

        whenCreated(el, {opts}) {
            let color = getColor('zoomCarriageTool');

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

            this.whenVisibilityChanged(this.visibilityFrame)
        }

        _windowMouseMoveHandler(e) {
            let x = e.screenX;
            if (e instanceof TouchEvent) {
                x = e.changedTouches[0].screenX
            }

            let dist = this._startStretchXPos - x;

            if (this._moveIsActive) {
                this._move(dist);
                return
            }
            if (this._leftStretchIsActive) {
                this._moveLeftStretch(dist);
                return;
            }
            if (this._rightStretchIsActive) {
                this._moveRightStretch(dist)
            }
        }

        _windowMouseUpHandler() {
            this._moveIsActive = false;
            this._leftStretchIsActive = false;
            this._rightStretchIsActive = false;
        }

        _mouseDownHandler(e) {
            e.stopPropagation();

            let x = e.screenX;
            if (e instanceof TouchEvent) {
                x = e.touches[0].screenX
            }
            this._moveIsActive = true;
            this._startStretchXPos = x;
            this._initProps.right = this.getRightShift();
            this._initProps.width = this.el.clientWidth;
        }

        _stretchMouseDownHandler(e) {
            e.stopPropagation();

            let x = e.screenX;
            if (e instanceof TouchEvent) {
                x = e.touches[0].screenX
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

        getRightShift() {
            return parseFloat(this.el.style.right) || 0;
        }

        _setProps({width, right}) {
            if (width) {
                this.el.style.width = width;
            }
            if (right) {
                this.el.style.right = right;
            }
            this.whenVisibilityChanged(this.visibilityFrame);
        }

        _move(dist) {
            let newRight = this._initProps.right + dist;

            if (newRight >= 0 && newRight <= this.parent.el.clientWidth - this._initProps.width) {
                this._setProps({right: newRight + 'px'});
            }
        }

        _moveLeftStretch(dist) {
            let newWidth = this._initProps.width + dist;

            if (newWidth >= 135 && newWidth <= this.parent.el.clientWidth - this._initProps.right) {
                this._setProps({width: newWidth + 'px'});
            }
        }

        _moveRightStretch(dist) {
            let newRight = this._initProps.right + dist;

            if (newRight >= 0 && this.parent.el.clientWidth - this._initProps.left - 135 >= newRight) {
                let newWidth = this._initProps.width - dist;

                this._setProps({
                    right: newRight + 'px',
                    width: newWidth + 'px'
                });
            }
        }
    }

    class Zoom extends HTMLComponent {
        NAME = 'zoom';

        constructor() {
            super();

            this._plot = new CanvasHTMLComponent();
            this._overlay = new CanvasHTMLComponent();
            this._zoomCarriage = new ZoomCarriage();
        }

        render({chartData, opts}) {
            this._zoomCarriage.whenVisibilityChanged = this._whenVisibilityChanged.bind(this, opts);

            return `
                ${this._plot.create(this, {chartData, opts})}
                ${this._overlay.create(this, {chartData, opts})}
                ${this._zoomCarriage.create(this, {chartData, opts})}
            `
        }

        get visibilityFrame() {
            return this._zoomCarriage.visibilityFrame
        }

        whenVisibilityChanged(visibilityFrame) {}

        _whenVisibilityChanged(opts, visibilityFrame) {
            this._renderOverlay(opts);

            this.whenVisibilityChanged(visibilityFrame);
        }

        whenRendered(el, {chartData, opts}) {
            let lineWidth = 1;

            drawPlot(
                {
                    x: 0,
                    y: lineWidth,
                    width: this._plot.el.clientWidth,
                    height: this._plot.el.clientHeight - lineWidth
                },
                chartData,
                function (points, lineIndex) {
                    this._plot.ctx2d.beginPath();
                    this._plot.ctx2d.lineWidth = lineWidth;
                    this._plot.ctx2d.strokeStyle = chartData.colors[lineIndex];

                    for (let i = 0; i < points.length; i++) {
                        this._plot.ctx2d.lineTo(points[i][0], points[i][1])
                    }
                    this._plot.ctx2d.stroke();
                }.bind(this)
            );
        }

        _renderOverlay(opts) {
            this._overlay.clear();

            this._overlay.ctx2d.fillStyle = getColor('zoomOverlay');
            this._overlay.ctx2d.fillRect(0, 0, this._zoomCarriage.el.offsetLeft, this._overlay.el.clientHeight);

            let zoomCarriageRightShift = this._zoomCarriage.getRightShift();
            this._overlay.ctx2d.fillRect(
                this._overlay.el.clientWidth - zoomCarriageRightShift,
                0,
                zoomCarriageRightShift,
                this._overlay.el.clientHeight);
        }
    }

    class LegendItem extends HTMLComponent {
        NAME = 'li';

        constructor () {
            super();

            this._lineIndex = null;
            this._visible = true;
        }

        render ({name, color, lineIndex}) {
            this._lineIndex = lineIndex;

            let styleObj = {
                backgroundColor: color,
                borderColor: color
            };
            if (!this._visible) {
                styleObj.maskImage = 'unset';
                styleObj.webkitMaskImage = 'unset';
                styleObj.backgroundColor = 'none';
            }
            return `
                <div class="state" style="${style(styleObj)}"></div>
                <div class="name" style="color: ${getColor('legendItemName')}">${name}</div>
            `
        }

        whenStateChanged (lineIndex, visible) { }

        whenCreated (el) {
            el.style.borderColor = getColor('legendItemBorder');

            el.addEventListener('click', () => {
                this._visible = !this._visible;
                this.rerender();
                this.whenStateChanged(this._lineIndex, this._visible)
            })
        }
    }

    class Legend extends HTMLComponent {
        NAME = 'ul';

        constructor() {
            super();

            this._lines = [];
        }

        render({chartData, opts}) {
            return `
               ${this._lines.map(({name, color}, lineIndex) => {
                   let legendItem =  new LegendItem();
                   legendItem.whenStateChanged = this.whenLegendItemStateChanged;
                   return legendItem.create(this, {name, color, lineIndex})
                }).join('')} 
            `
        }

        whenLegendItemStateChanged (lineIndex, visible) { }

        whenCreated(el, {chartData}) {
            el.className = 'legend';
        }

        addLine({name, color}) {
            this._lines.push({name, color});
            this.rerender()
        }
    }

    class Chart extends HTMLComponent {
        NAME = 'chart';

        constructor() {
            super();

            this._gridLayer = new GridLayer();
            this._plotLayer = new PlotLayer();
            this._infoLayer = new InfoLayer();

            this._zoom = new Zoom();
            this._legend = new Legend();
        }

        render({chartData, opts}) {
            this._zoom.whenVisibilityChanged = this.whenVisibilityChanged.bind(this, chartData, opts);

            return `
                ${this._plotLayer.create(this, {chartData, opts})}
                ${this._gridLayer.create(this, {chartData, opts})}
                ${this._infoLayer.create(this, {chartData, opts})}
                ${this._zoom.create(this, {chartData, opts: opts.zoom})}
                ${this._legend.create(this, {chartData, opts})}
            `
        }

        whenCreated(el, {chartData}) {
            chartData.names.forEach((name, i) => {
                this._legend.addLine({name, color: chartData.colors[i]})
            });
        }

        whenVisibilityChanged(chartData, opts, visibilityFrame) {
            this._legend.whenLegendItemStateChanged = (lineIndex, visible) => {
                chartData.yDatas[lineIndex].visible = visible;
                this._zoom.rerender({chartData, opts: opts.zoom});
                render.apply(this);
            };
            render.apply(this);

            function render () {
                let xl = chartData.xData.length,
                visibleXData = chartData.xData.slice(xl * visibilityFrame[0], xl * visibilityFrame[1]),
                minMaxValX = minMax(visibleXData);

                let visibleChartData = {
                    xData: visibleXData,
                    yDatas: [],
                    minValX: minMaxValX[0],
                    maxValX: minMaxValX[1],
                    minValY: null,
                    maxValY: null,
                    colors: [],
                    names: chartData.names
                };

                for (let lineIndex = 0, visibleData, pointsYLen; lineIndex < chartData.yDatas.length; lineIndex++) {
                    if (chartData.yDatas[lineIndex].visible === false) {
                        continue
                    }
                    visibleChartData.colors.push(chartData.colors[lineIndex]);

                    pointsYLen = chartData.yDatas[lineIndex].length;
                    visibleData = chartData.yDatas[lineIndex].slice(pointsYLen * visibilityFrame[0], pointsYLen * visibilityFrame[1]);
                    visibleChartData.yDatas.push(visibleData);

                    let mm = minMax(visibleData);
                    visibleChartData.minValY = visibleChartData.minValY === null
                        ? mm[0]
                        : Math.min(visibleChartData.minValY, mm[0]);

                    visibleChartData.maxValY = visibleChartData.maxValY === null
                        ? mm[1]
                        : Math.max(visibleChartData.maxValY, mm[1]);
                }

                this._gridLayer.rerender({chartData: visibleChartData, opts});
                this._plotLayer.rerender({chartData: visibleChartData, opts});
                this._infoLayer.rerender({chartData: visibleChartData, opts});
            }
        }
    }

    let requestAnimationFrame = window.requestAnimationFrame
        || window.mozRequestAnimationFrame
        ||  window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame,

        cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    let colorsMap = {
        day: {
            background: '#FFF',
            yAxisNumbers: '#A1ACB3',
            gridBottomBorder: '#cacccd',
            gridLine: '#d4d6d7',
            zoomOverlay: 'rgba(239,243,245,0.5)',
            zoomCarriageTool: 'rgba(218,231,240,0.5)',
            verticalInfoLine: '#CBCFD2',
            pointsInfoBackground: '#FFF',
            pointsInfoTitle: '#000',
            legendItemBorder: '#EFF3F5',
            legendItemName: '#000',
        },
        night: {
            background: '#242F3E',
            yAxisNumbers: '#546778',
            gridBottomBorder: '#495564',
            gridLine: '#303D4C',
            zoomOverlay: 'rgba(27,36,48,0.5)',
            zoomCarriageTool: 'rgba(81,101,120,0.5)',
            verticalInfoLine: '#4e5a69',
            pointsInfoBackground: '#253241',
            pointsInfoTitle: '#FFF',
            legendItemBorder: '#495564',
            legendItemName: '#FFF',
        }
    };

    /**
     * @const {string}
     */
    let X_COLUMN_TYPE = 'x',
        LINE_COLUMN_TYPE = 'line',
        MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let config = {
        nightMode: false,
        containerId: 'charts-container'
    };

    let rerender, fullrerender;

    window.addEventListener('resize', function() {
        fullrerender();
    });

    return {
        configure: configure,
        setData: setData,
        switchMode: switchMode,
        isNightMode: isNightMode,
    };

    function configure(val) {
        config = Object.assign(config, val);
    }

    function ChartDataType() {
        this.xData = null;
        this.yDatas = null;
        this.names = null;
        this.colors = null;
        this.minValX = null;
        this.maxValX = null;
        this.minValY = null;
        this.maxValY = null;
    }

    function setData(data) {
        if (!Array.isArray(data)) {
            throw new TypeError('Data for the TChart can be Array type only')
        }
        // to re-render the scene without the passing data always
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
        return config.nightMode ? colorsMap.night[name] : colorsMap.day[name]
    }

    /**
     * @returns {ChartDataType}
     */
    function prepareChartData(chartData) {
        let xData, yDatas = [], minMaxXData, minValY, maxValY, colors = [], names = [];

        for (let columnIndex = 0; columnIndex < chartData.columns.length; columnIndex++) {
            let columnData = chartData.columns[columnIndex];

            if (!Array.isArray(columnData)) {
                throw new TypeError('Column data can be only Array type')
            }
            if (!columnData.length) {
                throw new Error('Column data cannot be empty')
            }
            let columnName = columnData[0],
                columnType = chartData.types[columnName];

            if (!columnType) {
                throw new TypeError('Column type for a column by ref"' + columnName + '" was not defined')
            }
            if (![LINE_COLUMN_TYPE, X_COLUMN_TYPE].includes(columnType)) {
                throw new Error('Column type "' + columnType + '" does not supported')
            }
            if (columnType === X_COLUMN_TYPE) {
                if (xData) {
                    throw new Error('Column type "X" can be only one')
                }
                xData = columnData.slice(1); // remove column type from data
                minMaxXData = minMax(xData);

            } else {
                let yData = columnData.slice(1); // remove column type from data
                let minMaxYData = minMax(yData);
                minValY = minValY === undefined ? minMaxYData[0]: Math.min(minValY, minMaxYData[0]);
                maxValY = maxValY === undefined ? minMaxYData[1]: Math.max(maxValY, minMaxYData[1]);

                yDatas.push(yData);
                // meta
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
            minValY: minValY,
            maxValY: maxValY
        }
    }

    function render(data, opts) {
        let chartsContainer = document.getElementById(config.containerId);
        if (!chartsContainer) {
            throw new Error('Charts container by ID "' + config.containerId + '" was not found');
        }
        document.body.className = config.nightMode ? 'night-mode' : '';
        chartsContainer.innerHTML = '';

        for (let i = 0; i < data.length; i++) {
            (new Chart()).create(
                chartsContainer,
                {chartData: prepareChartData(data[i]), opts});
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
    function cc(canvas, drawingFrame, data, minValX, maxValX, callback) {
        let width = canvas.clientWidth - drawingFrame.x + drawingFrame.width,
            compressionRatioX = width / (maxValX - minValX);

        for (let i = 0; i < data.length; i++) {
            let x = drawingFrame.x + (data[i] - minValX) * compressionRatioX;
            callback(data[i], x)
        }
    }

    /**
     * Draw the plot in the specific area somewhere you want
     * @param {{x: number, y: number, width: number, height: number}} areaMetric -
     * @param {ChartDataType} chartData
     * @param {function} drawingFunc
     */
    function drawPlot(areaMetric, chartData, drawingFunc) {
        let compressionRatioX = areaMetric.width / (chartData.maxValX - chartData.minValX),
            compressionRatioY = areaMetric.height / (chartData.maxValY - chartData.minValY);

        for (let lineIndex = 0, points; lineIndex < chartData.yDatas.length; lineIndex++) {
            if (chartData.yDatas[lineIndex].visible === false) {
                continue
            }
            points = [];
            for (let yIndex = 0; yIndex < chartData.yDatas[lineIndex].length; yIndex++) {
                points.push([
                    areaMetric.x + (chartData.xData[yIndex] - chartData.minValX) * compressionRatioX,
                    // areaMetric.height - inversion by Y
                    areaMetric.y + areaMetric.height - (
                        chartData.yDatas[lineIndex][yIndex] - chartData.minValY
                    ) * compressionRatioY
                ])
            }
            drawingFunc(points, lineIndex);
        }
    }

    function Animation(frameHandler) {
        let reqAnimId, onFinishedCallback = function() { };

        return {
            start: start,
            easeOutExpo: easeOutExpo,
            onFinished: onFinished
        };

        function onFinished(callback) {
            onFinishedCallback = callback
        }

        function start(context, duration) {
            context = context || {};

            let startAnimTime;

            if (reqAnimId) {
                // onFinishedCallback();
                cancelAnimationFrame(reqAnimId);
            }
            reqAnimId = requestAnimationFrame(frame);

            function frame(timestamp) {
                let isStarted = false;

                if (!startAnimTime) {
                    isStarted = true;
                    startAnimTime = timestamp;
                }
                context.progress = timestamp - startAnimTime;
                context.duration = duration;

                frameHandler.bind(context)(isStarted);

                if (context.progress < duration) {
                    reqAnimId = requestAnimationFrame(frame)
                } else {
                    reqAnimId = null;
                    onFinishedCallback();
                }
            }
            return this;
        }

        function easeOutExpo (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
        }
    }

    function minMax(data) {
        let min, max;

        for (let i = 0; i < data.length; i++) {
            if (min === undefined || min > data[i]) {
                min = data[i]
            }
            if (max === undefined || max < data[i]) {
                max = data[i]
            }
        }
        return [min, max];
    }

    function toHumanValue(val) {
        if (val >= 1000000000) {
            return Math.round(val / 1000000000) + 'G';

        } else if (val >= 1000000) {
            return Math.round(val / 1000000) + 'M';

        } else if (val >= 1000) {
            return Math.round(val / 1000) + 'K';
        }
        return val > 0 ? Math.round(val) : val;
    }

    function parentElementsHierarchy(e, parents = []) {
        parents.push(e);

        if (e.parentElement) {
            parentElementsHierarchy(e.parentElement, parents)
        }
        return parents
    }
})
();
