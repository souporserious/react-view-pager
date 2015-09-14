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

	var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactMotion = __webpack_require__(3);

	var getPrefix = function getPrefix(prop) {
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

	var Slider = (function (_Component) {
	  function Slider(props) {
	    _classCallCheck(this, Slider);

	    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).call(this, props);

	    this.isSliding = false;
	    this.transform = getPrefix('transform');
	    this.supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

	    // swipe props
	    this.deltaX = this.deltaY = this.startX = this.startY = this.isDragging = this.isSwiping = this.isFlick = false;
	    this.swipeThreshold = 10;

	    this.state = {
	      currIndex: 0,
	      direction: null
	    };
	  }

	  _inherits(Slider, _Component);

	  _createClass(Slider, [{
	    key: 'prev',
	    value: function prev() {
	      var hold = arguments[0] === undefined ? this.state.currIndex <= 0 : arguments[0];

	      var currIndex = hold ? this.state.currIndex : this.state.currIndex - 1;
	      this.setState({ currIndex: currIndex, direction: null });
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      var hold = arguments[0] === undefined ? this.state.currIndex >= this.props.children.length - 1 : arguments[0];

	      var currIndex = hold ? this.state.currIndex : this.state.currIndex + 1;
	      this.setState({ currIndex: currIndex, direction: null });
	    }
	  }, {
	    key: '_isSwipe',
	    value: function _isSwipe(threshold) {
	      return Math.abs(this.deltaX) > Math.max(threshold, Math.abs(this.deltaY));
	    }
	  }, {
	    key: '_dragStart',
	    value: function _dragStart(e) {
	      var _this = this;

	      // get proper event
	      var touch = this.supportsTouch ? e.touches[0] : e;

	      // we're now dragging
	      this.isDragging = true;

	      // reset deltas
	      this.deltaX = this.deltaY = 0;

	      // store the initial starting coordinates
	      this.startX = touch.pageX;
	      this.startY = touch.pageY;

	      // determine if a flick or not
	      this.isFlick = true;

	      setTimeout(function () {
	        _this.isFlick = false;
	      }, 300);
	    }
	  }, {
	    key: '_dragMove',
	    value: function _dragMove(e) {
	      // if we aren't dragging bail
	      if (!this.isDragging) return;

	      // get proper event
	      var currIndex = this.state.currIndex;

	      var touch = this.supportsTouch ? e.touches[0] : e;
	      var sliderCount = this.props.children.length;
	      var sliderWidth = sliderCount * 100;
	      var threshold = sliderWidth / 2;

	      // determine how much we have moved
	      this.deltaX = this.startX - touch.pageX;
	      this.deltaY = this.startY - touch.pageY;

	      // if on the first or last side check for a threshold
	      if (this._isSwipe(threshold) && (currIndex === 0 || currIndex === sliderCount - 1)) {
	        return;
	      }

	      if (this._isSwipe(this.swipeThreshold)) {
	        e.preventDefault();
	        e.stopPropagation();
	        this.isSwiping = true;
	      }

	      if (this.isSwiping) {
	        this.setState({ direction: this.deltaX / sliderWidth });
	      }
	    }
	  }, {
	    key: '_dragEnd',
	    value: function _dragEnd(e) {
	      var currIndex = this.state.currIndex;

	      var slideCount = this.props.children.length;
	      var sliderWidth = slideCount * 100;
	      var threshold = this.isFlick ? this.swipeThreshold : sliderWidth / 2;

	      // handle swipe
	      if (this._isSwipe(threshold)) {
	        this.deltaX < 0 ? this.prev() : this.next();
	      } else {
	        this.setState({ direction: 0 });
	      }

	      // we are no longer swiping or dragging
	      this.isSwiping = this.isDragging = false;
	    }
	  }, {
	    key: '_getX',
	    value: function _getX() {
	      return -((this.state.direction + this.state.currIndex) * 100) / this.props.children.length;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var children = this.props.children;
	      var _state = this.state;
	      var currIndex = _state.currIndex;
	      var currX = _state.currX;

	      var count = children.length;
	      var destX = this._getX();

	      return _react2['default'].createElement(
	        _reactMotion.Spring,
	        {
	          endValue: { val: { x: destX }, config: [211, 21] }
	        },
	        function (_ref2) {
	          var x = _ref2.val.x;

	          _this2.isSliding = x !== destX;

	          var sliderClassName = 'slider';
	          var modifiers = [];

	          if (_this2.isSliding) {
	            modifiers.push('is-sliding');
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
	                onMouseDown: _this2._dragStart.bind(_this2),
	                onMouseMove: _this2._dragMove.bind(_this2),
	                onMouseUp: _this2._dragEnd.bind(_this2),
	                style: _defineProperty({
	                  width: 100 * count + '%'
	                }, _this2.transform, 'translate3d(' + x + '%, 0, 0)')
	              },
	              children
	            )
	          );
	        }
	      );
	    }
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

/***/ }
/******/ ])
});
;