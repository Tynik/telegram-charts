let TChart = (
() => {
    let requestAnimationFrame = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        },
        cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    let colorsMap = {
        day: {
            background: '#FFF1',
            XYAxisLabels: '#A1ACB3',
            gridBottomBorder: '#cacccd',
            gridLine: '#d4d6d7',
            zoomOverlay: 'rgba(239,243,245,0.5)',
            zoomCarriageTool: 'rgba(218,231,240,0.5)',
            verticalInfoLine: '#CBCFD2',
            pointsInfoBackground: '#FFF',
            pointsInfoTitle: '#000',
            legendItemBorder: '#EFF3F5',
            legendItemName: '#000',
            downloadChart: '#A1ACB3',
            downloadChartOnHover: '#939EA5'
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
            legendItemName: '#FFF',
            downloadChart: '#4E5A69',
            downloadChartOnHover: '#626E7D'
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

            this.rerender = (newData) => {
                data = newData || data;

                let html = this.render(data);
                this.el.innerHTML = html;
                this._raiseEvent(this.EVENTS.CREATED, data);
                this.whenRendered(this.el, data);
                return html;
            };

            this._raiseEvent(this.EVENTS.CREATED, data);

            let created = this.whenCreated(this.el, data);
            if (created instanceof Promise) {
                created.then(() => {
                    this.whenRendered(this.el, data);
                });
            } else {
                this.whenRendered(this.el, data);
            }
        };

        _raiseEvent (eventName, data) {
            this._events.forEach(({event, handler}) => {
                if (event === eventName) {
                    handler(data);
                }
            });
            this._events = [];
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
            return new Promise((resolve) => {
                setTimeout(() => {
                    el.width = el.clientWidth;
                    el.height = el.clientHeight;

                    let dpr = window.devicePixelRatio || 1,
                        canvasRect = el.getBoundingClientRect();

                    el.width = canvasRect.width * dpr;
                    el.height = canvasRect.height * dpr;

                    this.ctx2d = el.getContext('2d');
                    this.ctx2d.scale(dpr, dpr);

                    resolve();
                }, 0);
            });
        }

        render() {
            return ''
        }
    }

    class XAxisLayerCanvasHTMLComponent  extends CanvasHTMLComponent {
        whenCreated(el) {
            return super.whenCreated(el).then(() => {
                el.className = 'x-axis';
            })
        }

        whenRendered(el, {chartData, opts}) {
            this.clear();
            this._renderXAxisDates(chartData, opts);
        }

        _renderXAxisDates (chartData, opts) {
            this.ctx2d.font = '.7em' + ' ' + 'Arial';
            this.ctx2d.fillStyle = getColor('XYAxisLabels');
            this.ctx2d.textBaseline = 'bottom';

            let labelOccupiedWidth = 0;
            bypassXPoints(
                this.el,
                opts.drawingFrame,
                chartData.xData,
                chartData.minX,
                chartData.maxX,
                (v, x) => {
                    let date = new Date(v),
                        label = MONTH_NAMES[date.getMonth()] + ' ' + date.getDate(),
                        labelWidth = this.ctx2d.measureText(label).width,
                        labelMidWidth = labelWidth / 2,
                        labelX = x - labelMidWidth,
                        labelXEnd = x + labelMidWidth;

                    if (labelOccupiedWidth <= labelX && labelX >= 0 && labelXEnd <= this.el.clientWidth) {
                        labelOccupiedWidth = labelXEnd + 15; // + 15 minimal distance between labels

                        this.ctx2d.fillText(label, labelX, this.el.clientHeight);
                    }
                }
            );
        }
    }

    class YAxisLayerCanvasHTMLComponent extends CanvasHTMLComponent {
        constructor() {
            super();

            this._prevMaxY = null;
            this._anim = new Animation(this._frameAnimHandler);
        }

        whenCreated(el) {
            return super.whenCreated(el).then(() => {
                el.className = 'y-axis';
            });
        }

        whenRendered(el, {chartData, opts}) {
            let increase = this._prevMaxY === void 0 || chartData.maxY > this._prevMaxY
                ? true
                : (chartData.maxY === this._prevMaxY ? undefined : false);

            // TODO: 0
            if (0 && increase === undefined) {
                return;
            }

            this._anim.start(
                {
                    layer: this,
                    anim: this._anim,
                    ctx: this.ctx2d,
                    xData: chartData.xData,
                    minY: chartData.minY,
                    stepValY: (chartData.maxY - chartData.minY) / opts.yAxis.grid.horizontalLines,
                    stepHrzLine: (this.el.clientHeight - opts.drawingFrame.y + opts.drawingFrame.height) / opts.yAxis.grid.horizontalLines,
                    maxShift: 40,
                    chartData,
                    opts,
                    increase,
                }, 1000

            ).onFinished(() => {
                this._prevMaxY = chartData.maxY;
            });
        }

        _renderXYAxisLabels () {
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
                this.ctx.fillStyle = getColor('XYAxisLabels');
                this.ctx.fillText(
                    toHumanValue(this.minY + this.stepValY * (this.opts.yAxis.grid.horizontalLines - 1 - i)),
                    0,
                    animY - 15 + this.opts.drawingFrame.y
                );
            }
        }

        _frameAnimHandler () {
            this.layer.clear();
            this.layer._renderXYAxisLabels.call(this);
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

    class InfoLayerCanvasHTMLComponent extends CanvasHTMLComponent {
        constructor() {
            super();

            this._chartData = null;
            this._pointsInfo = new PointsInfoHTMLComponent();
        }

        whenCreated(el, {chartData, opts}) {
            return super.whenCreated(el).then(() => {
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
            });
        }

        whenRendered(el, {chartData}) {
            this._chartData = chartData;
        }

        clear() {
            super.clear();
            this._pointsInfo.remove();
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
            }
        }
    }

    class PlotLayerCanvasHTMLComponent extends CanvasHTMLComponent {
        constructor() {
            super();

            this.renderedChartData = [];
            this._anim = new Animation(this._frameAnimHandler);
        }

        whenCreated(el) {
            return super.whenCreated(el).then(() => {
                el.className = 'plot';
            })
        }

        whenRendered(el, {chartData, opts, animate}) {
            this._anim.start(
                {
                    renderedChartData: this.renderedChartData,
                    anim: this._anim,
                    ctx: this.ctx2d,
                    layer: this,
                    chartData,
                    opts,
                    animate
                },
                800
            );
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

                    let yr;
                    if (this.animate) {
                        let prevY = 0;
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
                        yr = y
                    }
                    if (this.renderedChartData[lineIndex] === undefined) {
                        this.renderedChartData[lineIndex] = [yr];
                    } else {
                        this.renderedChartData[lineIndex][i] = yr;
                    }
                    this.ctx.lineTo(x, yr)
                }
                this.ctx.stroke();
            }
        }
    }

    class ZoomCarriageHTMLComponent extends HTMLComponent {
        NAME = 'zoom-carriage';

        constructor() {
            super();

            this._currVisibilityFrame = null;
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

            setTimeout(() => {
                this.whenVisibilityChanged(this._currVisibilityFrame || this.visibilityFrame)
            }, 0)
        }

        getRightShift() {
            return (parseFloat(this.el.style.right) || 0);
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
            this._initProps.left = this.el.offsetLeft;
            this._initProps.width = this.el.clientWidth;
        }

        _setProps({width, right}) {
            if (width) {
                this.el.style.width = width;
            }
            if (right) {
                this.el.style.right = right;
            }
            this._currVisibilityFrame = this.visibilityFrame;

            this.whenVisibilityChanged(this.visibilityFrame);
        }

        _move(dist) {
            let newRight = this._initProps.right + dist;

            if (newRight >= 0
                && newRight <= this.parent.el.clientWidth - this._initProps.width
            ) {
                this._setProps({right: newRight + 'px'});
            }
        }

        _moveLeftStretch(dist) {
            let newWidth = this._initProps.width + dist;

            if (newWidth >= 135
                && newWidth <= this.parent.el.clientWidth - this._initProps.right
            ) {
                this._setProps({width: newWidth + 'px'});
            }
        }

        _moveRightStretch(dist) {
            let newRight = this._initProps.right + dist;

            if (newRight >= 0
                && this.parent.el.clientWidth - this._initProps.left - 135 >= newRight
            ) {
                let newWidth = this._initProps.width - dist;

                this._setProps({
                    right: newRight + 'px',
                    width: newWidth + 'px'
                });
            }
        }
    }

    class ZoomPlotCanvasHTMLComponent extends CanvasHTMLComponent{
        whenRendered(el, {chartData, opts}) {
            let lineWidth = 1;

            this.clear();

            drawPlot(
                {
                    x: 0,
                    y: lineWidth,
                    width: this.el.clientWidth,
                    height: this.el.clientHeight - lineWidth
                },
                chartData,
                (points, lineIndex) => {
                    this.ctx2d.beginPath();
                    this.ctx2d.lineWidth = lineWidth;
                    this.ctx2d.strokeStyle = chartData.colors[lineIndex];

                    for (let i = 0; i < points.length; i++) {
                        this.ctx2d.lineTo(points[i][0], points[i][1])
                    }
                    this.ctx2d.stroke();
                }
            );
        }
    }

    class ZoomHTMLComponent extends HTMLComponent {
        NAME = 'zoom';

        constructor() {
            super();

            this._plot = new ZoomPlotCanvasHTMLComponent();
            this._overlay = new CanvasHTMLComponent();
            this._zoomCarriage = new ZoomCarriageHTMLComponent();
        }

        render({chartData, opts}) {
            this._zoomCarriage.whenVisibilityChanged = this._whenVisibilityChanged.bind(this);

            return `
                ${this._plot.create(this, {chartData, opts})}
                ${this._overlay.create(this, {chartData, opts})}
                ${this._zoomCarriage.create(this, {opts})}
            `
        }

        get visibilityFrame() {
            return this._zoomCarriage.visibilityFrame
        }

        whenVisibilityChanged(visibilityFrame) {}

        _whenVisibilityChanged(visibilityFrame) {
            this._renderOverlay();

            this.whenVisibilityChanged(visibilityFrame);
        }

        _renderOverlay() {
            this._overlay.clear();

            this._overlay.ctx2d.fillStyle = getColor('zoomOverlay');
            this._overlay.ctx2d.fillRect(0, 0, this._zoomCarriage.el.offsetLeft, this._overlay.el.clientHeight);

            let zoomCarriageRightShift = this._zoomCarriage.getRightShift();
            //console.log(this._overlay.el.clientWidth)

            this._overlay.ctx2d.fillRect(
                this._overlay.el.clientWidth - zoomCarriageRightShift,
                0,
                zoomCarriageRightShift,
                this._overlay.el.clientHeight);
        }
    }

    class LegendItemHTMLComponent extends HTMLComponent {
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

    class LegendHTMLComponent extends HTMLComponent {
        NAME = 'ul';

        constructor() {
            super();

            this._lines = [];
        }

        render({chartData, opts}) {
            return `
               ${this._lines.map(({name, color}, lineIndex) => {
                   let legendItem =  new LegendItemHTMLComponent();
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

    class DownloadChartHTMLComponent extends HTMLComponent {
        NAME = 'a';

        render(data) {
            return ``
        }

        whenCreated(el, {plotLayer, xAxisLayer, yAxisLayer}) {
            super.whenCreated(el);

            el.className = 'download-chart';
            el.title = 'Download this chart as image';
            el.style.backgroundColor = getColor('downloadChart');

            el.addEventListener('click', this.download.bind(this, {plotLayer, xAxisLayer, yAxisLayer}));
            el.addEventListener('mouseover', () => {
                el.style.backgroundColor = getColor('downloadChartOnHover');
            });
            el.addEventListener('mouseout', () => {
                el.style.backgroundColor = getColor('downloadChart');
            });
        }

        download ({plotLayer, xAxisLayer, yAxisLayer}, e) {
            yAxisLayer.ctx2d.drawImage(
                xAxisLayer.el,
                0, 0, xAxisLayer.el.clientWidth, xAxisLayer.el.clientHeight
            );
            yAxisLayer.ctx2d.drawImage(
                plotLayer.el,
                0, 0, plotLayer.el.clientWidth, plotLayer.el.clientHeight
            );
            e.target.href = yAxisLayer.el.toDataURL('image/png');
            e.target.download = `chart-${this._id}.png`;
        }
    }

    class ChartHTMLComponent extends HTMLComponent {
        NAME = 'chart';

        constructor() {
            super();

            this._yAxisLayer = new YAxisLayerCanvasHTMLComponent();
            this._xAxisLayer = new XAxisLayerCanvasHTMLComponent();
            this._plotLayer = new PlotLayerCanvasHTMLComponent();
            this._infoLayer = new InfoLayerCanvasHTMLComponent();

            this._zoom = new ZoomHTMLComponent();
            this._legend = new LegendHTMLComponent();
            this._download = new DownloadChartHTMLComponent();
        }

        render({name, chartData, opts}) {
            let currVisibilityFrame,
                visibilityChangedTimer,
                lastVisibleChartData = {minY: null, maxY: null};

            this._zoom.whenVisibilityChanged = (visibilityFrame) => {
                currVisibilityFrame = visibilityFrame;
                this._infoLayer.clear();

                this._render(chartData, opts, lastVisibleChartData, visibilityFrame, false);

                if (visibilityChangedTimer) {
                    clearTimeout(visibilityChangedTimer);
                }
                visibilityChangedTimer = setTimeout(() => {
                    this._render(chartData, opts, lastVisibleChartData, visibilityFrame, true, true)
                }, 100);
            };

            this._legend.whenLegendItemStateChanged = (lineIndex, visible) => {
                chartData.yDatas[lineIndex].visible = visible;

                this._render(chartData, opts, lastVisibleChartData, currVisibilityFrame, true, true)
            };

            return `
                <div class="name">${name}</div>
                <div class="layers">
                    ${this._plotLayer.create(this, {chartData, opts})}
                    ${this._yAxisLayer.create(this, {chartData, opts})}
                    ${this._xAxisLayer.create(this, {chartData, opts})}
                    ${this._infoLayer.create(this, {chartData, opts})}
                </div>
                ${this._zoom.create(this, {chartData, opts: opts.zoom})}
                ${this._legend.create(this, {chartData, opts})}
                ${this._download.create(this, {
                    plotLayer: this._plotLayer,
                    xAxisLayer: this._xAxisLayer,
                    yAxisLayer: this._yAxisLayer
                })}
            `
        }

        whenCreated(el, {chartData}) {
            el.getElementsByClassName('name')[0].style.color = getColor('legendItemName');

            chartData.names.forEach((name, i) => {
                this._legend.addLine({name, color: chartData.colors[i]})
            });
        }

        _render (chartData, opts, lastVisibleChartData, visibilityFrame, recalculateMinMaxY=true, animate=false) {
            let xl = chartData.xData.length,
                visibleXData = chartData.xData.slice(
                    xl * visibilityFrame[0],
                    xl * visibilityFrame[1]
                ),
                minMaxX = minMax(visibleXData);

            let visibleChartData = {
                xData: visibleXData,
                yDatas: [],
                minX: minMaxX[0],
                maxX: minMaxX[1],
                minY: null,
                maxY: null,
                colors: [],
                names: chartData.names
            };
            chartData.minY = null;
            chartData.maxY = null;

            for (let lineIndex = 0, visibleData, pointsYLen; lineIndex < chartData.yDatas.length; lineIndex++) {
                if (chartData.yDatas[lineIndex].visible === false) {
                    continue
                }
                let mm = minMax(chartData.yDatas[lineIndex]);
                chartData.minY = chartData.minY === null
                    ? mm[0]
                    : Math.min(chartData.minY, mm[0]);

                chartData.maxY = chartData.maxY === null
                    ? mm[1]
                    : Math.max(chartData.maxY, mm[1]);


                visibleChartData.colors.push(chartData.colors[lineIndex]);

                pointsYLen = chartData.yDatas[lineIndex].length;
                visibleData = chartData.yDatas[lineIndex].slice(
                    pointsYLen * visibilityFrame[0],
                    pointsYLen * visibilityFrame[1]
                );
                visibleChartData.yDatas.push(visibleData);

                if (recalculateMinMaxY) {
                    let mm = minMax(visibleData);
                    visibleChartData.minY = visibleChartData.minY === null
                        ? mm[0]
                        : Math.min(visibleChartData.minY, mm[0]);

                    visibleChartData.maxY = visibleChartData.maxY === null
                        ? mm[1]
                        : Math.max(visibleChartData.maxY, mm[1]);
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

            this._yAxisLayer.rerender({chartData: visibleChartData, opts});
            this._xAxisLayer.rerender({chartData: visibleChartData, opts});
            this._plotLayer.rerender({chartData: visibleChartData, opts, animate});
            this._infoLayer.rerender({chartData: visibleChartData, opts});
            this._zoom._plot.rerender({chartData, opts: opts.zoom});
        }
    }

    return {
        configure: configure,
        setData: setData,
        switchMode: switchMode,
        isNightMode: isNightMode,
    };

    function configure(val) {
        config = Object.assign(config, val);
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

    function prepareChartData(chartData) {
        let xData, yDatas = [], minMaxXData, minY, maxY, colors = [], names = [];

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
                minY = minY === undefined ? minMaxYData[0]: Math.min(minY, minMaxYData[0]);
                maxY = maxY === undefined ? minMaxYData[1]: Math.max(maxY, minMaxYData[1]);

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
            minX: minMaxXData[0],
            maxX: minMaxXData[1],
            minY: minY,
            maxY: maxY
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
            (new ChartHTMLComponent()).create(
                chartsContainer,
                {name: 'Chart #' + (i + 1), chartData: prepareChartData(data[i]), opts});
        }
    }

    /**
     * @param {Object} canvas - Canvas HTML element
     * @param {Object} drawingFrame
     * @param {Array} data
     * @param {Number} minX
     * @param {Number} maxX
     * @param {function} callback
     */
    function bypassXPoints(canvas, drawingFrame, data, minX, maxX, callback) {
        let width = canvas.clientWidth - drawingFrame.x + drawingFrame.width,
            compressionRatioX = width / (maxX - minX);

        for (let i = 0; i < data.length; i++) {
            let x = drawingFrame.x + (data[i] - minX) * compressionRatioX;
            callback(data[i], x)
        }
    }

    /**
     * Draw the plot in the specific area somewhere you want
     * @param {{x: number, y: number, width: number, height: number}} areaMetric -
     * @param {Object} chartData
     * @param {function} drawingFunc
     */
    function drawPlot(areaMetric, chartData, drawingFunc) {
        let compressionRatioX = areaMetric.width / (chartData.maxX - chartData.minX),
            compressionRatioY = areaMetric.height / (chartData.maxY - chartData.minY);

        for (let lineIndex = 0, points; lineIndex < chartData.yDatas.length; lineIndex++) {
            if (chartData.yDatas[lineIndex].visible === false) {
                continue
            }
            points = [];
            for (let yIndex = 0; yIndex < chartData.yDatas[lineIndex].length; yIndex++) {
                points.push([
                    areaMetric.x + (chartData.xData[yIndex] - chartData.minX) * compressionRatioX,
                    // areaMetric.height - inversion by Y
                    areaMetric.y + areaMetric.height - (
                        chartData.yDatas[lineIndex][yIndex] - chartData.minY
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
                    reqAnimId = requestAnimationFrame(frame)
                } else {
                    reqAnimId = null;
                    onFinishedCallback();
                }
            }
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

    function parentElementsHierarchy(e, parents = []) {
        parents.push(e);

        if (e.parentElement) {
            parentElementsHierarchy(e.parentElement, parents)
        }
        return parents
    }
})();

window.TChart = TChart;
