(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactDOM"), require("ReactMotion"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM", "ReactMotion"], factory);
	else if(typeof exports === 'object')
		exports["Slider"] = factory(require("React"), require("ReactDOM"), require("ReactMotion"));
	else
		root["Slider"] = factory(root["React"], root["ReactDOM"], root["ReactMotion"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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

	var _Slider = __webpack_require__(1);

	var _Slider2 = _interopRequireDefault(_Slider);

	exports['default'] = _Slider2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactMotion = __webpack_require__(4);

	var _Slide = __webpack_require__(5);

	var _Slide2 = _interopRequireDefault(_Slide);

	var _getIndexFromKey = __webpack_require__(6);

	var _getIndexFromKey2 = _interopRequireDefault(_getIndexFromKey);

	var _modulo = __webpack_require__(7);

	var _modulo2 = _interopRequireDefault(_modulo);

	var TRANSFORM = __webpack_require__(8)('transform');
	var ALIGN_TYPES = {
	  left: 0,
	  center: 0.5,
	  right: 1
	};

	var Slider = (function (_Component) {
	  _inherits(Slider, _Component);

	  function Slider() {
	    var _this = this;

	    _classCallCheck(this, Slider);

	    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).apply(this, arguments);

	    this._node = null;
	    this._sliderWidth = 0;
	    this._slideCount = _react.Children.count(this.props.children);
	    this._frameWidth = 100 / this._slideCount;
	    this._slideWidth = this._frameWidth / this.props.slidesToShow;
	    this._trackWidth = this._slideCount / this.props.slidesToShow * 100;
	    this._deltaX = false;
	    this._deltaY = false;
	    this._startX = false;
	    this._startY = false;
	    this._isSwiping = false;
	    this._isFlick = false;
	    this.state = {
	      currentIndex: 0,
	      swipeOffset: 0,
	      instant: false,
	      wrapping: false,
	      height: 0
	    };

	    this._beforeSlide = function (currentIndex, nextIndex) {
	      _this.props.beforeSlide(currentIndex, nextIndex);
	      _this._isSliding = true;
	      _this.forceUpdate();
	    };

	    this._afterSlide = function () {
	      _this.props.afterSlide(_this.state.currentIndex);
	      _this._isSliding = false;
	      _this.forceUpdate();
	    };

	    this._onSwipeStart = function (e) {
	      var swipe = e.touches && e.touches[0] || e;

	      // we're now swiping
	      _this._isSwiping = true;

	      // reset deltas
	      _this._deltaX = _this._deltaY = 0;

	      // store the initial starting coordinates
	      _this._startX = swipe.pageX;
	      _this._startY = swipe.pageY;

	      // determine if a flick or not
	      _this._isFlick = true;

	      setTimeout(function () {
	        _this._isFlick = false;
	      }, _this.props.flickTimeout);
	    };

	    this._onSwipeMove = function (e) {
	      // bail if we aren't swiping
	      if (!_this._isSwiping) return;

	      var _props = _this.props;
	      var vertical = _props.vertical;
	      var swipeThreshold = _props.swipeThreshold;
	      var slidesToMove = _props.slidesToMove;

	      var swipe = e.touches && e.touches[0] || e;

	      // determine how much we have moved
	      _this._deltaX = _this._startX - swipe.pageX;
	      _this._deltaY = _this._startY - swipe.pageY;

	      if (_this._isSwipe(swipeThreshold)) {
	        e.preventDefault();
	        e.stopPropagation();

	        var axis = vertical ? _this._deltaY : _this._deltaX;
	        var dimension = vertical ? _this.sliderHeight : _this._sliderWidth;

	        _this.setState({
	          swipeOffset: axis / dimension * slidesToMove
	        });
	      }
	    };

	    this._onSwipeEnd = function () {
	      var swipeThreshold = _this.props.swipeThreshold;

	      var threshold = _this._isFlick ? swipeThreshold : _this._sliderWidth * swipeThreshold;

	      _this.setState({ swipeOffset: 0 }, function () {
	        if (_this._isSwipe(threshold)) {
	          _this._deltaX < 0 ? _this.prev() : _this.next();
	        }
	      });

	      _this._isSwiping = false;
	    };

	    this._onSwipePast = function () {
	      // perform a swipe end if we swiped past the component
	      if (_this._isSwiping) {
	        _this._onSwipeEnd();
	      }
	    };

	    this._handleSlideHeight = function (height) {
	      _this.setState({ height: height });
	    };

	    this._onSlideEnd = function () {
	      _this.setState({
	        instant: false,
	        wrapping: false
	      });
	      _this._isSliding = false;
	    };
	  }

	  _createClass(Slider, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._node = _reactDom2['default'].findDOMNode(this);
	      this._getSliderDimensions();
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _this2 = this;

	      var currentIndex = this.state.currentIndex;

	      var nextIndex = this._getNextIndex(nextProps);

	      this._slideCount = _react.Children.count(nextProps.children);
	      this._frameWidth = 100 / this._slideCount;
	      this._slideWidth = this._frameWidth / nextProps.slidesToShow;
	      this._trackWidth = this._slideCount * 100 / nextProps.slidesToShow;

	      // don't update state if index hasn't changed and we're not in the middle of a slide
	      if (currentIndex !== nextIndex && nextIndex !== null) {
	        (function () {
	          var clampedIndex = Math.max(0, Math.min(nextIndex, _this2._slideCount - 1));
	          _this2.setState({ currentIndex: clampedIndex }, function () {
	            _this2._beforeSlide(currentIndex, clampedIndex);
	          });
	        })();
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      var _state = this.state;
	      var instant = _state.instant;
	      var wrapping = _state.wrapping;

	      if (instant || wrapping) {
	        this._onSlideEnd();
	      }
	    }
	  }, {
	    key: 'prev',
	    value: function prev() {
	      this.slide(-1);
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      this.slide(1);
	    }
	  }, {
	    key: 'slide',
	    value: function slide(direction) {
	      var currentIndex = this.state.currentIndex;

	      var newState = {};
	      var nextIndex = currentIndex;

	      // when align type is left we make sure to only move the amount of slides that are available
	      if (this.props.align === 'left') {
	        nextIndex += this._getSlidesToMove(currentIndex, direction);
	      } else {
	        nextIndex += direction;
	      }

	      // determine if we need to wrap the index or bail out and keep it in bounds
	      if (this.props.infinite) {
	        nextIndex = (0, _modulo2['default'])(nextIndex, this._slideCount);

	        if (currentIndex === this._slideCount - 1 && nextIndex === 0 || currentIndex === 0 && nextIndex === this._slideCount - 1) {
	          newState.wrapping = true;
	          newState.instant = true;
	        } else {
	          newState.wrapping = false;
	        }
	      } else if (!_react.Children.toArray(this.props.children)[nextIndex]) {
	        return;
	      }

	      newState.currentIndex = nextIndex;

	      this._beforeSlide(currentIndex, nextIndex);
	      this.setState(newState);
	    }
	  }, {
	    key: '_getSliderDimensions',
	    value: function _getSliderDimensions() {
	      this._sliderWidth = this._node.offsetWidth;
	      this._sliderHeight = this._node.offsetHeight;
	    }
	  }, {
	    key: '_getNextIndex',
	    value: function _getNextIndex(_ref2) {
	      var currentIndex = _ref2.currentIndex;
	      var currentKey = _ref2.currentKey;
	      var children = _ref2.children;

	      var currentChildren = _react2['default'].Children.toArray(this.props.children);
	      var currentChild = currentChildren[this.state.currentIndex];

	      if (this.props.currentIndex !== currentIndex) {
	        return currentIndex;
	      } else if (currentChild.key !== currentKey) {
	        return (0, _getIndexFromKey2['default'])(currentKey, children);
	      } else {
	        return this.state.currentIndex;
	      }
	    }
	  }, {
	    key: '_getSlidesToMove',
	    value: function _getSlidesToMove(index, direction) {
	      var _props2 = this.props;
	      var slidesToShow = _props2.slidesToShow;
	      var slidesToMove = _props2.slidesToMove;

	      var slidesRemaining = direction === 1 ? this._slideCount - (index + slidesToShow) : index;

	      return Math.min(slidesRemaining, slidesToMove) * direction;
	    }
	  }, {
	    key: '_isSwipe',
	    value: function _isSwipe(threshold) {
	      var x = this._deltaX;
	      var y = this._deltaY;

	      if (this.props.vertical) {
	        var _ref3 = [x, y];
	        y = _ref3[0];
	        x = _ref3[1];
	      }

	      return Math.abs(x) > Math.max(threshold, Math.abs(y));
	    }
	  }, {
	    key: '_getSwipeEvents',
	    value: function _getSwipeEvents() {
	      var swipe = this.props.swipe;

	      var swipeEvents = {};

	      if (swipe === true || swipe === 'mouse') {
	        swipeEvents = {
	          onMouseDown: this._onSwipeStart,
	          onMouseMove: this._onSwipeMove,
	          onMouseUp: this._onSwipeEnd,
	          onMouseLeave: this._onSwipePast
	        };
	      }

	      if (swipe === true || swipe === 'touch') {
	        swipeEvents = _extends({}, swipeEvents, {
	          onTouchStart: this._onSwipeStart,
	          onTouchMove: this._onSwipeMove,
	          onTouchEnd: this._onSwipeEnd
	        });
	      }

	      return swipeEvents;
	    }
	  }, {
	    key: '_getDestValue',
	    value: function _getDestValue() {
	      var _state2 = this.state;
	      var currentIndex = _state2.currentIndex;
	      var wrapping = _state2.wrapping;
	      var swipeOffset = _state2.swipeOffset;

	      var alignType = ALIGN_TYPES[this.props.align];
	      var offsetFactor = (this._frameWidth - this._slideWidth) * alignType;
	      var alignOffset = this._frameWidth / this._slideWidth * offsetFactor;
	      var destValue = this._frameWidth * (currentIndex + swipeOffset) - alignOffset;

	      if (wrapping) {
	        if (currentIndex === 0) {
	          destValue -= this._frameWidth;
	        }
	        if (currentIndex === this._slideCount - 1) {
	          destValue += this._frameWidth;
	        }
	      }

	      return destValue * -1;
	    }
	  }, {
	    key: '_getSliderClassNames',
	    value: function _getSliderClassNames() {
	      var swipe = this.props.swipe;

	      var modifiers = [];
	      var sliderClassName = 'slider';

	      if (this._isSliding) {
	        modifiers.push('is-sliding');
	      }

	      if (swipe) {
	        modifiers.push('is-swipeable');
	      }

	      if (this._isSwiping) {
	        modifiers.push('is-swiping');
	      }

	      sliderClassName += modifiers.map(function (modifier) {
	        return ' ' + sliderClassName + '--' + modifier;
	      }).join('');

	      return sliderClassName;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;

	      var _props3 = this.props;
	      var children = _props3.children;
	      var springConfig = _props3.springConfig;
	      var autoHeight = _props3.autoHeight;
	      var infinite = _props3.infinite;
	      var _state3 = this.state;
	      var currentIndex = _state3.currentIndex;
	      var lastIndex = _state3.lastIndex;
	      var instant = _state3.instant;
	      var height = _state3.height;

	      var destValue = this._getDestValue();

	      return _react2['default'].createElement(
	        _reactMotion.Motion,
	        {
	          style: {
	            translate: instant ? destValue : (0, _reactMotion.spring)(destValue, springConfig),
	            wrapperHeight: instant ? height : (0, _reactMotion.spring)(height, springConfig)
	          },
	          onRest: this._afterSlide
	        },
	        function (_ref4) {
	          var translate = _ref4.translate;
	          var wrapperHeight = _ref4.wrapperHeight;

	          _this3._currentTween = translate;
	          return _react2['default'].createElement(
	            'div',
	            { className: _this3._getSliderClassNames() },
	            _react2['default'].createElement(
	              'div',
	              _extends({
	                className: 'slider__track',
	                style: _defineProperty({
	                  width: _this3._trackWidth + '%',
	                  height: autoHeight && wrapperHeight
	                }, TRANSFORM, 'translate3d(' + translate + '%, 0, 0)')
	              }, _this3._getSwipeEvents()),
	              _react.Children.map(children, function (child, index) {
	                var style = {
	                  width: _this3._slideWidth + '%'
	                };

	                if (infinite) {
	                  if (currentIndex === 0 && index === _this3._slideCount - 1) {
	                    style = _extends({}, style, {
	                      position: 'relative',
	                      left: '-100%'
	                    });
	                  }

	                  if (currentIndex === _this3._slideCount - 1 && index === 0) {
	                    style = _extends({}, style, {
	                      position: 'relative',
	                      right: '-100%'
	                    });
	                  }
	                }

	                return (0, _react.createElement)(_Slide2['default'], {
	                  style: style,
	                  isCurrent: currentIndex === index,
	                  onSlideHeight: _this3._handleSlideHeight
	                }, child);
	              })
	            )
	          );
	        }
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      infinite: _react.PropTypes.bool,
	      vertical: _react.PropTypes.bool,
	      currentKey: _react.PropTypes.any,
	      currentIndex: _react.PropTypes.number,
	      slidesToShow: _react.PropTypes.number,
	      slidesToMove: _react.PropTypes.number,
	      autoHeight: _react.PropTypes.bool,
	      align: _react.PropTypes.oneOf(['left', 'center', 'right']),
	      swipe: _react.PropTypes.oneOf([true, false, 'mouse', 'touch']),
	      swipeThreshold: _react.PropTypes.number,
	      flickTimeout: _react.PropTypes.number,
	      springConfig: _react2['default'].PropTypes.objectOf(_react2['default'].PropTypes.number),
	      beforeSlide: _react.PropTypes.func,
	      afterSlide: _react.PropTypes.func
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      infinite: false,
	      vertical: false,
	      slidesToShow: 1,
	      slidesToMove: 1,
	      autoHeight: false,
	      align: 'left',
	      swipe: true,
	      swipeThreshold: 0.5,
	      flickTimeout: 300,
	      springConfig: _reactMotion.presets.noWobble,
	      beforeSlide: function beforeSlide() {
	        return null;
	      },
	      afterSlide: function afterSlide() {
	        return null;
	      }
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

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var Slide = (function (_Component) {
	  _inherits(Slide, _Component);

	  function Slide() {
	    _classCallCheck(this, Slide);

	    _get(Object.getPrototypeOf(Slide.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(Slide, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._node = _reactDom2['default'].findDOMNode(this);
	      this._getDimensions();

	      if (this.props.isCurrent) {
	        this._onHeightChange();
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(lastProps) {
	      var isCurrent = this.props.isCurrent;

	      if (lastProps.isCurrent !== isCurrent && isCurrent === true) {
	        this._onHeightChange();
	      }
	    }
	  }, {
	    key: '_getDimensions',
	    value: function _getDimensions() {
	      this._width = this._node.offsetWidth;
	      this._height = this._node.offsetHeight;
	    }
	  }, {
	    key: '_onHeightChange',
	    value: function _onHeightChange() {
	      this.props.onSlideHeight(this._height);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props = this.props;
	      var children = _props.children;
	      var style = _props.style;

	      return (0, _react.cloneElement)(_react.Children.only(children), { style: style });
	    }
	  }]);

	  return Slide;
	})(_react.Component);

	exports['default'] = Slide;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = getIndexFromKey;

	var _react = __webpack_require__(2);

	function getIndexFromKey(key, children) {
	  var index = null;

	  _react.Children.forEach(children, function (child, _index) {
	    if (child.key === key) {
	      index = _index;
	      return;
	    }
	  });

	  return index;
	}

	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = modulo;

	function modulo(val, max) {
	  return val < 0 ? (val % max + max) % max : val % max;
	}

	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = getPrefix;

	function getPrefix(prop) {
	  if (typeof document === 'undefined') return prop;

	  var styles = document.createElement('p').style;
	  var vendors = ['ms', 'O', 'Moz', 'Webkit'];

	  if (styles[prop] === '') return prop;

	  prop = prop.charAt(0).toUpperCase() + prop.slice(1);

	  for (var i = vendors.length; i--;) {
	    if (styles[vendors[i] + prop] === '') {
	      return vendors[i] + prop;
	    }
	  }
	}

	module.exports = exports['default'];

/***/ }
/******/ ])
});
;