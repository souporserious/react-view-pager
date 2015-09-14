(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactMotion"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactMotion"], factory);
	else if(typeof exports === 'object')
		exports["ReactMotionSlider"] = factory(require("React"), require("ReactMotion"));
	else
		root["ReactMotionSlider"] = factory(root["React"], root["ReactMotion"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _slider = __webpack_require__(1);

	var _slider2 = _interopRequireDefault(_slider);

	exports.Slider = _slider2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactMotion = __webpack_require__(3);

	var _getPrefixJs = __webpack_require__(4);

	var _getPrefixJs2 = _interopRequireDefault(_getPrefixJs);

	var Slider = (function (_Component) {
	  function Slider() {
	    var _this = this;

	    _classCallCheck(this, Slider);

	    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).apply(this, arguments);

	    this.slideCount = this.props.children.length;
	    this.isSliding = false;
	    this.transform = (0, _getPrefixJs2['default'])('transform');
	    this.supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
	    this.deltaX = false;
	    this.deltaY = false;
	    this.startX = false;
	    this.startY = false;
	    this.isDragging = false;
	    this.isSwiping = false;
	    this.isFlick = false;
	    this.state = {
	      currIndex: this.props.defaultSlide,
	      direction: null,
	      sliderWidth: this.slideCount * 100 / this.props.slidesToShow
	    };

	    this._dragStart = function (e) {
	      // get proper event
	      var touch = e.touches && e.touches[0] || e;

	      // we're now dragging
	      _this.isDragging = true;

	      // reset deltas
	      _this.deltaX = _this.deltaY = 0;

	      // store the initial starting coordinates
	      _this.startX = touch.pageX;
	      _this.startY = touch.pageY;

	      // determine if a flick or not
	      _this.isFlick = true;

	      setTimeout(function () {
	        _this.isFlick = false;
	      }, _this.props.flickTimeout);
	    };

	    this._dragMove = function (e) {
	      // if we aren't dragging bail
	      if (!_this.isDragging) return;

	      var touch = e.touches && e.touches[0] || e;
	      var _state = _this.state;
	      var currIndex = _state.currIndex;
	      var sliderWidth = _state.sliderWidth;

	      var threshold = sliderWidth / 2;

	      // determine how much we have moved
	      _this.deltaX = _this.startX - touch.pageX;
	      _this.deltaY = _this.startY - touch.pageY;

	      if (_this._isSwipe(_this.props.swipeThreshold)) {
	        e.preventDefault();
	        e.stopPropagation();
	        _this.isSwiping = true;
	      }

	      if (_this.isSwiping) {
	        _this.setState({ direction: _this.deltaX / sliderWidth });
	      }
	    };

	    this._dragEnd = function () {
	      var _state2 = _this.state;
	      var currIndex = _state2.currIndex;
	      var sliderWidth = _state2.sliderWidth;

	      var threshold = _this.isFlick ? _this.props.swipeThreshold : sliderWidth / 2;

	      // handle swipe
	      if (_this._isSwipe(threshold)) {
	        // id if an end slide, we still need to set the direction
	        if (_this._isEndSlide()) {
	          _this.setState({ direction: 0 });
	        }
	        _this.deltaX < 0 ? _this.prev() : _this.next();
	      } else {
	        _this.setState({ direction: 0 });
	      }

	      // we are no longer swiping or dragging
	      _this.isSwiping = _this.isDragging = false;
	    };

	    this._dragPast = function () {
	      // perform a dragend if we dragged past component
	      if (_this.isDragging) {
	        _this._dragEnd();
	      }
	    };
	  }

	  _inherits(Slider, _Component);

	  _createClass(Slider, [{
	    key: 'prev',
	    value: function prev() {
	      if (this.state.currIndex <= 0) return;
	      this.setState({ currIndex: this.state.currIndex - 1, direction: null });
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      if (this.state.currIndex >= this.slideCount - 1) return;
	      this.setState({ currIndex: this.state.currIndex + 1, direction: null });
	    }
	  }, {
	    key: '_isEndSlide',
	    value: function _isEndSlide() {
	      var currIndex = this.state.currIndex;

	      return currIndex === 0 || currIndex === this.slideCount - 1;
	    }
	  }, {
	    key: '_isSwipe',
	    value: function _isSwipe(threshold) {
	      return Math.abs(this.deltaX) > Math.max(threshold, Math.abs(this.deltaY));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var _props = this.props;
	      var children = _props.children;
	      var springConfig = _props.springConfig;
	      var draggable = _props.draggable;
	      var _state3 = this.state;
	      var currIndex = _state3.currIndex;
	      var direction = _state3.direction;
	      var sliderWidth = _state3.sliderWidth;

	      // normalize index when on end slides
	      var slidesToMove = this._isEndSlide() ? 1 : this.props.slidesToMove;
	      var destX = -((direction + currIndex * slidesToMove) * 100) / this.slideCount;

	      return _react2['default'].createElement(
	        _reactMotion.Spring,
	        {
	          endValue: { val: { x: destX }, config: springConfig }
	        },
	        function (_ref2) {
	          var x = _ref2.val.x;

	          _this2.isSliding = x !== destX;

	          var sliderClassName = 'slider';
	          var modifiers = [];

	          if (_this2.isSliding) {
	            modifiers.push('is-sliding');
	          }

	          if (draggable) {
	            modifiers.push('is-draggable');
	          }

	          if (_this2.isDragging) {
	            modifiers.push('is-dragging');
	          }

	          sliderClassName += modifiers.map(function (modifier) {
	            return ' ' + sliderClassName + '--' + modifier;
	          }).join('');

	          return _react2['default'].createElement(
	            'div',
	            { className: sliderClassName },
	            _react2['default'].createElement(
	              'ul',
	              {
	                className: 'slider__track',
	                onMouseDown: draggable && _this2._dragStart,
	                onMouseMove: draggable && _this2._dragMove,
	                onMouseUp: draggable && _this2._dragEnd,
	                onMouseLeave: draggable && _this2._dragPast,
	                onTouchStart: draggable && _this2._dragStart,
	                onTouchMove: draggable && _this2._dragMove,
	                onTouchEnd: draggable && _this2._dragEnd,
	                style: _defineProperty({
	                  width: sliderWidth + '%'
	                }, _this2.transform, 'translate3d(' + x + '%, 0, 0)')
	              },
	              children
	            )
	          );
	        }
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      draggable: _react.PropTypes.bool,
	      defaultSlide: _react.PropTypes.number,
	      springConfig: _react.PropTypes.array,
	      swipeThreshold: _react.PropTypes.number,
	      flickTimeout: _react.PropTypes.number,
	      slidesToShow: _react.PropTypes.number,
	      slidesToMove: _react.PropTypes.number
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      draggable: true,
	      defaultSlide: 0,
	      springConfig: [262, 24],
	      swipeThreshold: 10,
	      flickTimeout: 300,
	      slidesToShow: 1,
	      slidesToMove: 1
	    },
	    enumerable: true
	  }]);

	  return Slider;
	})(_react.Component);

	exports['default'] = Slider;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	exports['default'] = function (prop) {
	  var styles = document.createElement('p').style;
	  var vendors = ['ms', 'O', 'Moz', 'Webkit'];

	  if (styles[prop] === '') return prop;

	  prop = prop.charAt(0).toUpperCase() + prop.slice(1);

	  for (var i = vendors.length; i--;) {
	    if (styles[vendors[i] + prop] === '') {
	      return vendors[i] + prop;
	    }
	  }
	};

	;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;