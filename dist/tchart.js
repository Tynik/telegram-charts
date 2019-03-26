"use strict";function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _get(a,b,c){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(a,b,c){var d=_superPropBase(a,b);if(d){var e=Object.getOwnPropertyDescriptor(d,b);return e.get?e.get.call(c):e.value}},_get(a,b,c||a)}function _superPropBase(a,b){for(;!Object.prototype.hasOwnProperty.call(a,b)&&(a=_getPrototypeOf(a),null!==a););return a}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}function _arrayWithHoles(a){if(Array.isArray(a))return a}var TChart=function(){var r=Math.max,s=Math.min;function a(){return Math.random().toString(36).substr(2,9)}function b(a,b,c,d){for(var e=b.split(" "),f=0;f<e.length;f++)a.addEventListener(e[f],c,d)}function c(a){return Object.entries(a).reduce(function(a,b){var c=_slicedToArray(b,2),d=c[0],e=c[1];return d=d.replace(/([A-Z])/g,function(a){return"-".concat(a[0].toLowerCase())}),"".concat(a).concat(d,":").concat(e,";")},"")}function d(a){z=Object.assign(z,a)}function e(a){if(!Array.isArray(a))throw new TypeError("Data for the TChart can be Array type only");// to re-render the scene without the passing data always
t=k.bind(null,a),u=t.bind(null,{drawingFrame:{x:0,y:10,width:0,height:-20},yAxis:{text:{fontSize:".7em",fontFamily:"Arial"},grid:{horizontalLines:5,lineWidth:.3}}}),u()}function f(){z.nightMode=!z.nightMode,u()}function g(){return z.nightMode}function h(a){return z.nightMode?x.night[a]:x.day[a]}function j(a){for(var b,c,d,e,f,g=[],h=[],i=[],j=0;j<a.columns.length;j++){if(f=a.columns[j],!Array.isArray(f))throw new TypeError("Column data can be only Array type");if(!f.length)throw new Error("Column data cannot be empty");var m=f[0],n=a.types[m];if(!n)throw new TypeError("Column type for a column by ref\""+m+"\" was not defined");if(!["line","x"].includes(n))throw new Error("Column type \""+n+"\" does not supported");if("x"===n){if(b)throw new Error("Column type \"X\" can be only one");b=f.slice(1),c=o(b)}else{var k=f.slice(1),l=o(k);// remove column type from data
d=void 0===d?l[0]:s(d,l[0]),e=void 0===e?l[1]:r(e,l[1]),g.push(k),h.push(a.colors[m]),i.push(a.names[m])}}return{xData:b,yDatas:g,names:i,colors:h,minX:c[0],maxX:c[1],minY:d,maxY:e}}function k(a,b){var c=document.getElementById(z.containerId);if(!c)throw new Error("Charts container by ID \""+z.containerId+"\" was not found");document.body.className=z.nightMode?"night-mode":"",c.innerHTML="";for(var d=0;d<a.length;d++)new N().create(c,{chartData:j(a[d]),opts:b})}/**
     * @param {Object} canvas - Canvas HTML element
     * @param {Object} drawingFrame
     * @param {Array} data
     * @param {Number} minX
     * @param {Number} maxX
     * @param {function} callback
     */function l(a,b,c,d,e,f){for(var g,h=a.clientWidth-b.x+b.width,j=0;j<c.length;j++)g=b.x+(c[j]-d)*(h/(e-d)),f(c[j],g)}/**
     * Draw the plot in the specific area somewhere you want
     * @param {{x: number, y: number, width: number, height: number}} areaMetric -
     * @param {Object} chartData
     * @param {function} drawingFunc
     */function m(a,b,c){for(var d,e=a.width/(b.maxX-b.minX),f=a.height/(b.maxY-b.minY),g=0;g<b.yDatas.length;g++)if(!1!==b.yDatas[g].visible){d=[];for(var h=0;h<b.yDatas[g].length;h++)d.push([a.x+(b.xData[h]-b.minX)*e,// areaMetric.height - inversion by Y
a.y+a.height-(b.yDatas[g][h]-b.minY)*f]);c(d,g)}}function n(a){function b(b,e){function f(h){g||(g=h),b.progress=h-g,b.duration=e,a.call(b),b.progress<e?c=v(f):(c=null,d())}b=b||{};var g;return c&&w(c),c=v(f),this}var c,d=function(){};return{start:b,easeOutExpo:function(a,e,b,c){return 1024*(b*(-Math.pow(2,-10*a/c)+1))/1023+e},onFinished:function(a){d=a}}}function o(a){for(var b,c,d=0;d<a.length;d++)(void 0===b||b>a[d])&&(b=a[d]),(void 0===c||c<a[d])&&(c=a[d]);return[b,c]}function p(a){if(1e9<=a)return(a/1e9).toFixed(2)+"G";return 1e6<=a?(a/1e6).toFixed(2)+"M":1e3<=a?(a/1e3).toFixed(2)+"K":0<a?a.toFixed(2):a}function q(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];return b.push(a),a.parentElement&&q(a.parentElement,b),b}var t,u,v=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,w=window.cancelAnimationFrame||window.mozCancelAnimationFrame,x={day:{background:"#FFF",XYAxisLabels:"#A1ACB3",gridBottomBorder:"#cacccd",gridLine:"#d4d6d7",zoomOverlay:"rgba(239,243,245,0.5)",zoomCarriageTool:"rgba(218,231,240,0.5)",verticalInfoLine:"#CBCFD2",pointsInfoBackground:"#FFF",pointsInfoTitle:"#000",legendItemBorder:"#EFF3F5",legendItemName:"#000"},night:{background:"#242F3E",XYAxisLabels:"#546778",gridBottomBorder:"#495564",gridLine:"#303D4C",zoomOverlay:"rgba(27,36,48,0.5)",zoomCarriageTool:"rgba(81,101,120,0.5)",verticalInfoLine:"#4e5a69",pointsInfoBackground:"#253241",pointsInfoTitle:"#FFF",legendItemBorder:"#495564",legendItemName:"#FFF"}},y=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],z={nightMode:!1,containerId:"charts-container"};window.addEventListener("resize",function(){u()});var A=/*#__PURE__*/function(){function b(){_classCallCheck(this,b),_defineProperty(this,"NAME",null),_defineProperty(this,"EVENTS",{CREATED:"created"}),this._id=null,this._events=[],this.el=null,this.rerender=null,this.parent=null}return _createClass(b,[{key:"render",value:function(){throw new Error}},{key:"rerender",value:function(){throw new Error}},{key:"on",value:function on(a,b,c){if(c=c||!1,!Object.values(this.EVENTS).includes(a))throw new Error("The event \"".concat(a,"\" is not supported"));this._events.push({event:a,handler:b,once:c})}},{key:"whenCreated",value:function whenCreated(){}},{key:"whenCreate",value:function whenCreate(){}},{key:"whenRendered",value:function whenRendered(){}},{key:"create",value:function create(a,c,d){this.whenCreate();var e=this._wrap(this.render(c));return a instanceof b?(this.parent=a,a.on(this.EVENTS.CREATED,this._postCreate.bind(this,c)),e):(d=d||"beforeEnd",a.insertAdjacentHTML(d,e),this._postCreate(c),this.el)}},{key:"remove",value:function remove(){this.el&&(this.el.remove(),this.el=null)}},{key:"_postCreate",value:function _postCreate(a){var b=this;this.el=document.getElementById(this._id),this.rerender=function(c){a=c||a;var d=b.render(a);return b.el.innerHTML=d,b._raiseEvent(b.EVENTS.CREATED,a),b.whenRendered(b.el,a),d},this._raiseEvent(this.EVENTS.CREATED,a);var c=this.whenCreated(this.el,a);c instanceof Promise?c.then(function(){b.whenRendered(b.el,a)}):this.whenRendered(this.el,a)}},{key:"_raiseEvent",value:function _raiseEvent(a,b){this._events.forEach(function(c){var d=c.event,e=c.handler;d===a&&e(b)}),this._events=[]}},{key:"_wrap",value:function _wrap(b){return this._id=a(),"<".concat(this.NAME," id=\"").concat(this._id,"\">").concat(b,"</").concat(this.NAME,">")}}]),b}(),B=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),_defineProperty(_assertThisInitialized(a),"NAME","canvas"),a.ctx2d=null,a}return _inherits(b,a),_createClass(b,[{key:"clear",value:function clear(){this.ctx2d.clearRect(0,0,this.el.width,this.el.height)}},{key:"whenCreated",value:function whenCreated(a){var b=this;return new Promise(function(c){setTimeout(function(){a.width=a.clientWidth,a.height=a.clientHeight;var d=window.devicePixelRatio||1,e=a.getBoundingClientRect();a.width=e.width*d,a.height=e.height*d,b.ctx2d=a.getContext("2d"),b.ctx2d.scale(d,d),c()},0)})}},{key:"render",value:function(){return""}}]),b}(A),C=/*#__PURE__*/function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),_createClass(b,[{key:"whenCreated",value:function whenCreated(a){return _get(_getPrototypeOf(b.prototype),"whenCreated",this).call(this,a).then(function(){a.className="x-axis"})}},{key:"whenRendered",value:function whenRendered(a,b){var c=b.chartData,d=b.opts;this.clear(),this._renderXAxisDates(c,d)}},{key:"_renderXAxisDates",value:function _renderXAxisDates(a,b){var c=this;this.ctx2d.font=".7em Arial",this.ctx2d.fillStyle=h("XYAxisLabels"),this.ctx2d.textBaseline="bottom";var d=0;l(this.el,b.drawingFrame,a.xData,a.minX,a.maxX,function(a,b){var e=new Date(a),f=y[e.getMonth()]+" "+e.getDate(),g=c.ctx2d.measureText(f).width,h=g/2,i=b-h,j=b+h;d<=i&&0<=i&&j<=c.el.clientWidth&&(d=j+15,c.ctx2d.fillText(f,i,c.el.clientHeight))})}}]),b}(B),D=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),a._prevMaxY=null,a._anim=new n(a._frameAnimHandler),a}return _inherits(b,a),_createClass(b,[{key:"whenCreated",value:function whenCreated(a){return _get(_getPrototypeOf(b.prototype),"whenCreated",this).call(this,a).then(function(){a.className="y-axis"})}},{key:"whenRendered",value:function whenRendered(a,b){var c=this,d=b.chartData,e=b.opts,f=!!(void 0===this._prevMaxY||d.maxY>this._prevMaxY)||d.maxY===this._prevMaxY&&void 0;this._anim.start({layer:this,anim:this._anim,ctx:this.ctx2d,xData:d.xData,minY:d.minY,stepValY:(d.maxY-d.minY)/e.yAxis.grid.horizontalLines,stepHrzLine:(this.el.clientHeight-e.drawingFrame.y+e.drawingFrame.height)/e.yAxis.grid.horizontalLines,maxShift:40,chartData:d,opts:e,increase:f},1e3).onFinished(function(){c._prevMaxY=d.maxY})}},{key:"_renderXYAxisLabels",value:function _renderXYAxisLabels(){for(var a,b,c=0;c<this.opts.yAxis.grid.horizontalLines;c++)a=(c+1)*this.stepHrzLine-1,this.increase?(b=a+this.maxShift-this.anim.easeOutExpo(this.progress,0,this.maxShift,this.duration),b=b<a?a:b):(b=this.anim.easeOutExpo(this.progress,a-this.maxShift,this.maxShift,this.duration),b=b>a?a:b),this.ctx.beginPath(),this.ctx.lineWidth=this.opts.yAxis.grid.lineWidth,this.ctx.strokeStyle=c==this.opts.yAxis.grid.horizontalLines-1?h("gridBottomBorder"):h("gridLine"),this.ctx.moveTo(0,b+this.opts.drawingFrame.y+1),this.ctx.lineTo(this.layer.el.clientWidth,b+this.opts.drawingFrame.y+1),this.ctx.stroke(),this.ctx.textBaseline="top",this.ctx.font=".7em Arial",this.ctx.fillStyle=h("XYAxisLabels"),this.ctx.fillText(p(this.minY+this.stepValY*(this.opts.yAxis.grid.horizontalLines-1-c)),0,b-15+this.opts.drawingFrame.y)}},{key:"_frameAnimHandler",value:function _frameAnimHandler(){this.layer.clear(),this.layer._renderXYAxisLabels.call(this)}}]),b}(B),E=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),_defineProperty(_assertThisInitialized(a),"NAME","points-info"),_defineProperty(_assertThisInitialized(a),"DAY_NAMES",["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]),a._values=[],a}return _inherits(b,a),_createClass(b,[{key:"whenCreate",value:function whenCreate(){this._values=[]}},{key:"render",value:function(a){var b=a.x,c=new Date(b),d=this.DAY_NAMES[c.getDay()],e=y[c.getMonth()],f=c.getDate();return"\n                <div class=\"title\" style=\"color: ".concat(h("pointsInfoTitle"),"\">\n                   ").concat(d,", ").concat(e," ").concat(f,"\n                </div>\n                <div class=\"values\">\n                    ").concat(this._values.map(function(a){var b=a.yVal,c=a.lineName,d=a.color;return"\n                        <div class=\"value\" style=\"color: ".concat(d,"\">\n                            <div>").concat(p(b),"</div>\n                            <div>").concat(c,"</div>\n                        </div>\n                    ")}).join(""),"\n                </div>\n            ")}},{key:"onMouseOut",value:function onMouseOut(){}},{key:"whenCreated",value:function whenCreated(a){a.style.backgroundColor=h("pointsInfoBackground"),this.el.addEventListener("mouseout",this.onMouseOut)}},{key:"addVal",value:function addVal(a){var b=a.yVal,c=a.lineName,d=a.color;this._values.push({yVal:b,lineName:c,color:d}),this.rerender()}},{key:"setPosition",value:function setPosition(a){var b=a.left,c=a.right,d=a.top;this.el.style.left=b,this.el.style.right=c,this.el.style.top=d}}]),b}(A),F=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),a._chartData=null,a._pointsInfo=new E,a}return _inherits(b,a),_createClass(b,[{key:"whenCreated",value:function whenCreated(a,c){var d=this,e=c.chartData,f=c.opts;return _get(_getPrototypeOf(b.prototype),"whenCreated",this).call(this,a).then(function(){a.className="info",d._chartData=e,a.addEventListener("mousemove",d._mouseMoveHandler.bind(d,f)),a.addEventListener("mouseout",d._mouseOutHandler.bind(d)),d._pointsInfo.onMouseOut=function(a){a.stopPropagation(),a.relatedTarget&&!q(a.relatedTarget).includes(d._pointsInfo.el)&&(d.clear(),d._pointsInfo.remove())}})}},{key:"whenRendered",value:function whenRendered(a,b){var c=b.chartData;this._chartData=c}},{key:"clear",value:function clear(){_get(_getPrototypeOf(b.prototype),"clear",this).call(this),this._pointsInfo.remove()}},{key:"_showInfo",value:function _showInfo(a,b,c,d,e){for(var f=Math.PI,g,j,k=0;k<d.length;k++)0<k&&(g=.5*(d[k][0]-d[k-1][0])),k<d.length-1&&(j=.5*(d[k+1][0]-d[k][0])),c>=d[k][0]-g&&c<=d[k][0]+j&&(this._firstPoint&&(this._firstPoint=!1,this.ctx2d.beginPath(),this.ctx2d.lineWidth=1,this.ctx2d.strokeStyle=h("verticalInfoLine"),this.ctx2d.moveTo(d[k][0],0),this.ctx2d.lineTo(d[k][0],this.el.clientHeight+b.drawingFrame.height),this.ctx2d.stroke(),this._pointsInfo.el?(this._pointsInfo._values=[],this._pointsInfo.rerender({x:a.xData[k]})):this._pointsInfo.create(this.el.parentElement,{x:a.xData[k]})),this._pointsInfo.addVal({yVal:a.yDatas[e][k],lineName:a.names[e],color:a.colors[e]}),this._pointsInfo.setPosition({left:d[k][0]+10-.5*this._pointsInfo.el.clientWidth+"px",top:"10px"}),this.ctx2d.beginPath(),this.ctx2d.lineWidth=2,this.ctx2d.strokeStyle=a.colors[e],this.ctx2d.fillStyle=h("background"),this.ctx2d.arc(d[k][0],d[k][1],4,0,2*f),this.ctx2d.fill(),this.ctx2d.stroke())}},{key:"_mouseMoveHandler",value:function _mouseMoveHandler(a,b){b.stopPropagation(),this.clear(),this._firstPoint=!0,m({x:a.drawingFrame.x,y:a.drawingFrame.y,width:this.el.clientWidth-a.drawingFrame.x+a.drawingFrame.width,height:this.el.clientHeight-a.drawingFrame.y+a.drawingFrame.height-2},this._chartData,this._showInfo.bind(this,this._chartData,a,b.layerX))}},{key:"_mouseOutHandler",value:function _mouseOutHandler(a){a.stopPropagation(),a.relatedTarget&&!q(a.relatedTarget).includes(this._pointsInfo.el)&&this.clear()}}]),b}(B),G=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),a.renderedChartData=[],a._anim=new n(a._frameAnimHandler),a}return _inherits(b,a),_createClass(b,[{key:"whenCreated",value:function whenCreated(a){return _get(_getPrototypeOf(b.prototype),"whenCreated",this).call(this,a).then(function(){a.className="plot"})}},{key:"whenRendered",value:function whenRendered(a,b){var c=b.chartData,d=b.opts,e=b.animate;this._anim.start({renderedChartData:this.renderedChartData,anim:this._anim,ctx:this.ctx2d,layer:this,chartData:c,opts:d,animate:e},800)}},{key:"_frameAnimHandler",value:function _frameAnimHandler(){this.layer.clear();m({x:this.opts.drawingFrame.x,y:this.opts.drawingFrame.y,width:this.layer.el.clientWidth-this.opts.drawingFrame.x+this.opts.drawingFrame.width,height:this.layer.el.clientHeight-this.opts.drawingFrame.y+this.opts.drawingFrame.height-2},this.chartData,function(a,b){this.ctx.beginPath(),this.ctx.lineWidth=2,this.ctx.strokeStyle=this.chartData.colors[b];for(var c,d,e=0;e<a.length;e++){c=a[e][0],d=a[e][1];var f=void 0;if(this.animate){var g=0;void 0!==this.renderedChartData[b]&&void 0!==this.renderedChartData[b][e]&&(g=this.renderedChartData[b][e]),f=d<g?g-this.anim.easeOutExpo(this.progress,0,g-d,this.duration):this.anim.easeOutExpo(this.progress,g,d-g,this.duration)}else f=d;void 0===this.renderedChartData[b]?this.renderedChartData[b]=[f]:this.renderedChartData[b][e]=f,this.ctx.lineTo(c,f)}this.ctx.stroke()}.bind(this))}}]),b}(B),H=/*#__PURE__*/function(a){function c(){var a;return _classCallCheck(this,c),a=_possibleConstructorReturn(this,_getPrototypeOf(c).call(this)),_defineProperty(_assertThisInitialized(a),"NAME","zoom-carriage"),a._currVisibilityFrame=null,a._moveIsActive=!1,a._startStretchXPos=null,a._initProps={},a._leftStretch=null,a._rightStretch=null,a._leftStretchIsActive=!1,a._rightStretchIsActive=!1,a}return _inherits(c,a),_createClass(c,[{key:"render",value:function(){return"\n                <div class=\"left-stretch\"></div>\n                <div class=\"right-stretch\"></div>\n            "}},{key:"whenVisibilityChanged",value:function whenVisibilityChanged(){}},{key:"whenCreated",value:function whenCreated(a,c){var d=this,e=c.opts,f=h("zoomCarriageTool");a.style.borderTopColor=f,a.style.borderBottomColor=f,this._leftStretch=a.getElementsByClassName("left-stretch")[0],this._leftStretch.style.backgroundColor=f,this._rightStretch=a.getElementsByClassName("right-stretch")[0],this._rightStretch.style.backgroundColor=f,b(window,"mousemove touchmove",this._windowMouseMoveHandler.bind(this)),b(window,"mouseup touchend",this._windowMouseUpHandler.bind(this)),b(a,"mousedown touchstart",this._mouseDownHandler.bind(this)),b(this._leftStretch,"mousedown touchstart",this._stretchMouseDownHandler.bind(this)),b(this._rightStretch,"mousedown touchstart",this._stretchMouseDownHandler.bind(this)),setTimeout(function(){d.whenVisibilityChanged(d._currVisibilityFrame||d.visibilityFrame)},0)}},{key:"getRightShift",value:function getRightShift(){return parseFloat(this.el.style.right)||0}},{key:"_windowMouseMoveHandler",value:function _windowMouseMoveHandler(a){var b=a.screenX;a instanceof TouchEvent&&(b=a.changedTouches[0].screenX);var c=this._startStretchXPos-b;return this._moveIsActive?void this._move(c):this._leftStretchIsActive?void this._moveLeftStretch(c):void(this._rightStretchIsActive&&this._moveRightStretch(c))}},{key:"_windowMouseUpHandler",value:function _windowMouseUpHandler(){this._moveIsActive=!1,this._leftStretchIsActive=!1,this._rightStretchIsActive=!1}},{key:"_mouseDownHandler",value:function _mouseDownHandler(a){a.stopPropagation();var b=a.screenX;a instanceof TouchEvent&&(b=a.touches[0].screenX),this._moveIsActive=!0,this._startStretchXPos=b,this._initProps.right=this.getRightShift(),this._initProps.width=this.el.clientWidth}},{key:"_stretchMouseDownHandler",value:function _stretchMouseDownHandler(a){a.stopPropagation();var b=a.screenX;a instanceof TouchEvent&&(b=a.touches[0].screenX),a.target===this._leftStretch?this._leftStretchIsActive=!0:a.target===this._rightStretch&&(this._rightStretchIsActive=!0),this._startStretchXPos=b,this._initProps.right=this.getRightShift(),this._initProps.left=this.el.offsetLeft,this._initProps.width=this.el.clientWidth}},{key:"_setProps",value:function _setProps(a){var b=a.width,c=a.right;b&&(this.el.style.width=b),c&&(this.el.style.right=c),this._currVisibilityFrame=this.visibilityFrame,this.whenVisibilityChanged(this.visibilityFrame)}},{key:"_move",value:function _move(a){var b=this._initProps.right+a;0<=b&&b<=this.parent.el.clientWidth-this._initProps.width&&this._setProps({right:b+"px"})}},{key:"_moveLeftStretch",value:function _moveLeftStretch(a){var b=this._initProps.width+a;135<=b&&b<=this.parent.el.clientWidth-this._initProps.right&&this._setProps({width:b+"px"})}},{key:"_moveRightStretch",value:function _moveRightStretch(a){var b=this._initProps.right+a;if(0<=b&&this.parent.el.clientWidth-this._initProps.left-135>=b){var c=this._initProps.width-a;this._setProps({right:b+"px",width:c+"px"})}}},{key:"visibilityFrame",get:function get(){var a=this.el.offsetLeft/this.parent.el.clientWidth,b=a+this.el.clientWidth/this.parent.el.clientWidth;return[a,b]}}]),c}(A),I=/*#__PURE__*/function(a){function b(){return _classCallCheck(this,b),_possibleConstructorReturn(this,_getPrototypeOf(b).apply(this,arguments))}return _inherits(b,a),_createClass(b,[{key:"whenRendered",value:function whenRendered(a,b){var c=this,d=b.chartData,e=b.opts,f=1;this.clear(),m({x:0,y:f,width:this.el.clientWidth,height:this.el.clientHeight-f},d,function(a,b){c.ctx2d.beginPath(),c.ctx2d.lineWidth=f,c.ctx2d.strokeStyle=d.colors[b];for(var e=0;e<a.length;e++)c.ctx2d.lineTo(a[e][0],a[e][1]);c.ctx2d.stroke()})}}]),b}(B),J=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),_defineProperty(_assertThisInitialized(a),"NAME","zoom"),a._plot=new I,a._overlay=new B,a._zoomCarriage=new H,a}return _inherits(b,a),_createClass(b,[{key:"render",value:function(a){var b=a.chartData,c=a.opts;return this._zoomCarriage.whenVisibilityChanged=this._whenVisibilityChanged.bind(this),"\n                ".concat(this._plot.create(this,{chartData:b,opts:c}),"\n                ").concat(this._overlay.create(this,{chartData:b,opts:c}),"\n                ").concat(this._zoomCarriage.create(this,{opts:c}),"\n            ")}},{key:"whenVisibilityChanged",value:function whenVisibilityChanged(){}},{key:"_whenVisibilityChanged",value:function _whenVisibilityChanged(a){this._renderOverlay(),this.whenVisibilityChanged(a)}},{key:"_renderOverlay",value:function _renderOverlay(){this._overlay.clear(),this._overlay.ctx2d.fillStyle=h("zoomOverlay"),this._overlay.ctx2d.fillRect(0,0,this._zoomCarriage.el.offsetLeft,this._overlay.el.clientHeight);var a=this._zoomCarriage.getRightShift();//console.log(this._overlay.el.clientWidth)
this._overlay.ctx2d.fillRect(this._overlay.el.clientWidth-a,0,a,this._overlay.el.clientHeight)}},{key:"visibilityFrame",get:function get(){return this._zoomCarriage.visibilityFrame}}]),b}(A),K=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),_defineProperty(_assertThisInitialized(a),"NAME","li"),a._lineIndex=null,a._visible=!0,a}return _inherits(b,a),_createClass(b,[{key:"render",value:function(a){var b=a.name,d=a.color,e=a.lineIndex;this._lineIndex=e;var f={backgroundColor:d,borderColor:d};return this._visible||(f.maskImage="unset",f.webkitMaskImage="unset",f.backgroundColor="none"),"\n                <div class=\"state\" style=\"".concat(c(f),"\"></div>\n                <div class=\"name\" style=\"color: ").concat(h("legendItemName"),"\">").concat(b,"</div>\n            ")}},{key:"whenStateChanged",value:function whenStateChanged(){}},{key:"whenCreated",value:function whenCreated(a){var b=this;a.style.borderColor=h("legendItemBorder"),a.addEventListener("click",function(){b._visible=!b._visible,b.rerender(),b.whenStateChanged(b._lineIndex,b._visible)})}}]),b}(A),L=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),_defineProperty(_assertThisInitialized(a),"NAME","ul"),a._lines=[],a}return _inherits(b,a),_createClass(b,[{key:"render",value:function(a){var b=this,c=a.chartData,d=a.opts;return"\n               ".concat(this._lines.map(function(a,c){var d=a.name,e=a.color,f=new K;return f.whenStateChanged=b.whenLegendItemStateChanged,f.create(b,{name:d,color:e,lineIndex:c})}).join("")," \n            ")}},{key:"whenLegendItemStateChanged",value:function whenLegendItemStateChanged(){}},{key:"whenCreated",value:function whenCreated(a,b){b.chartData;a.className="legend"}},{key:"addLine",value:function addLine(a){var b=a.name,c=a.color;this._lines.push({name:b,color:c}),this.rerender()}}]),b}(A),M=/*#__PURE__*/function(a){function b(){var a,c;_classCallCheck(this,b);for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];return c=_possibleConstructorReturn(this,(a=_getPrototypeOf(b)).call.apply(a,[this].concat(e))),_defineProperty(_assertThisInitialized(c),"NAME","a"),c}return _inherits(b,a),_createClass(b,[{key:"render",value:function(){return""}},{key:"whenCreated",value:function whenCreated(a,c){var d=c.plotLayer,e=c.xAxisLayer,f=c.yAxisLayer;_get(_getPrototypeOf(b.prototype),"whenCreated",this).call(this,a),a.className="download-chart",a.innerText="Download As Image",a.style.color=h("XYAxisLabels"),a.addEventListener("click",this.download.bind(this,{plotLayer:d,xAxisLayer:e,yAxisLayer:f}))}},{key:"download",value:function download(a,b){var c=a.plotLayer,d=a.xAxisLayer,e=a.yAxisLayer;e.ctx2d.drawImage(d.el,0,0,d.el.clientWidth,d.el.clientHeight),e.ctx2d.drawImage(c.el,0,0,c.el.clientWidth,c.el.clientHeight),b.target.href=e.el.toDataURL("image/png"),b.target.download="bottle-design.png"}}]),b}(A),N=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=_possibleConstructorReturn(this,_getPrototypeOf(b).call(this)),_defineProperty(_assertThisInitialized(a),"NAME","chart"),a._yAxisLayer=new D,a._xAxisLayer=new C,a._plotLayer=new G,a._infoLayer=new F,a._zoom=new J,a._legend=new L,a._download=new M,a}return _inherits(b,a),_createClass(b,[{key:"render",value:function(a){var b,c,d=this,e=a.chartData,f=a.opts,g={minY:null,maxY:null};return this._zoom.whenVisibilityChanged=function(a){b=a,d._infoLayer.clear(),d._render(e,f,g,a,!1),c&&clearTimeout(c),c=setTimeout(function(){d._render(e,f,g,a,!0,!0)},100)},this._legend.whenLegendItemStateChanged=function(a,c){e.yDatas[a].visible=c,d._render(e,f,g,b,!0,!0)},"\n                ".concat(this._plotLayer.create(this,{chartData:e,opts:f}),"\n                ").concat(this._yAxisLayer.create(this,{chartData:e,opts:f}),"\n                ").concat(this._xAxisLayer.create(this,{chartData:e,opts:f}),"\n                ").concat(this._infoLayer.create(this,{chartData:e,opts:f}),"\n                ").concat(this._zoom.create(this,{chartData:e,opts:f.zoom}),"\n                ").concat(this._legend.create(this,{chartData:e,opts:f}),"\n                ").concat(this._download.create(this,{plotLayer:this._plotLayer,xAxisLayer:this._xAxisLayer,yAxisLayer:this._yAxisLayer}),"\n            ")}},{key:"whenCreated",value:function whenCreated(a,b){var c=this,d=b.chartData;d.names.forEach(function(a,b){c._legend.addLine({name:a,color:d.colors[b]})})}},{key:"_render",value:function _render(a,b,c,d){var e=!(4<arguments.length&&void 0!==arguments[4])||arguments[4],f=!!(5<arguments.length&&void 0!==arguments[5])&&arguments[5],g=a.xData.length,h=a.xData.slice(g*d[0],g*d[1]),i=o(h),j={xData:h,yDatas:[],minX:i[0],maxX:i[1],minY:null,maxY:null,colors:[],names:a.names};a.minY=null,a.maxY=null;for(var l,m,n=0;n<a.yDatas.length;n++)if(!1!==a.yDatas[n].visible){var k=o(a.yDatas[n]);if(a.minY=null===a.minY?k[0]:s(a.minY,k[0]),a.maxY=null===a.maxY?k[1]:r(a.maxY,k[1]),j.colors.push(a.colors[n]),m=a.yDatas[n].length,l=a.yDatas[n].slice(m*d[0],m*d[1]),j.yDatas.push(l),e){var p=o(l);j.minY=null===j.minY?p[0]:s(j.minY,p[0]),j.maxY=null===j.maxY?p[1]:r(j.maxY,p[1])}}null==j.minY&&(j.minY=j.minY||c.minY||a.minY),null==j.maxY&&(j.maxY=j.maxY||c.maxY||a.maxY),c.minY=j.minY,c.maxY=j.maxY,this._yAxisLayer.rerender({chartData:j,opts:b}),this._xAxisLayer.rerender({chartData:j,opts:b}),this._plotLayer.rerender({chartData:j,opts:b,animate:f}),this._infoLayer.rerender({chartData:j,opts:b}),this._zoom._plot.rerender({chartData:a,opts:b.zoom})}}]),b}(A);return{configure:d,setData:e,switchMode:f,isNightMode:g}}();
//# sourceMappingURL=tchart.js.map