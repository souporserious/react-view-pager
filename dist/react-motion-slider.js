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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = undefined;

	var _Slider = __webpack_require__(1);

	var _Slider2 = _interopRequireDefault(_Slider);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _Slider2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactMotion = __webpack_require__(4);

	var _Slide = __webpack_require__(5);

	var _Slide2 = _interopRequireDefault(_Slide);

	var _getIndexFromKey = __webpack_require__(6);

	var _getIndexFromKey2 = _interopRequireDefault(_getIndexFromKey);

	var _getKeyFromIndex = __webpack_require__(7);

	var _getKeyFromIndex2 = _interopRequireDefault(_getKeyFromIndex);

	var _getSlideRange = __webpack_require__(8);

	var _getSlideRange2 = _interopRequireDefault(_getSlideRange);

	var _modulo = __webpack_require__(9);

	var _modulo2 = _interopRequireDefault(_modulo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TRANSFORM = __webpack_require__(10)('transform');
	var ALIGN_TYPES = {
	  left: 0,
	  center: 0.5,
	  right: 1
	};

	var Slider = function (_Component) {
	  _inherits(Slider, _Component);

	  function Slider() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    _classCallCheck(this, Slider);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Slider)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this._node = null, _this._sliderWidth = 0, _this._slideCount = _react.Children.count(_this.props.children), _this._frameWidth = 100 / _this._slideCount, _this._slideWidth = _this._frameWidth / _this.props.slidesToShow, _this._trackWidth = _this._slideCount / _this.props.slidesToShow * 100, _this._deltaX = false, _this._deltaY = false, _this._startX = false, _this._startY = false, _this._isSwiping = false, _this._isFlick = false, _this.state = {
	      currentIndex: _this.props.currentIndex,
	      currentKey: _this.props.currentKey,
	      swipeOffset: 0,
	      instant: false,
	      wrapping: false,
	      height: 0
	    }, _this._beforeSlide = function (currentIndex, nextIndex) {
	      var _this$props = _this.props;
	      var beforeSlide = _this$props.beforeSlide;
	      var slidesToShow = _this$props.slidesToShow;


	      beforeSlide((0, _getSlideRange2.default)(currentIndex, currentIndex + slidesToShow), (0, _getSlideRange2.default)(nextIndex, nextIndex + slidesToShow));

	      _this._isSliding = true;
	      _this.forceUpdate();
	    }, _this._afterSlide = function () {
	      var _this$props2 = _this.props;
	      var afterSlide = _this$props2.afterSlide;
	      var slidesToShow = _this$props2.slidesToShow;
	      var currentIndex = _this.state.currentIndex;


	      afterSlide((0, _getSlideRange2.default)(currentIndex, currentIndex + slidesToShow));

	      _this._isSliding = false;
	      _this.forceUpdate();
	    }, _this._onSwipeStart = function (e) {
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
	    }, _this._onSwipeMove = function (e) {
	      // bail if we aren't swiping
	      if (!_this._isSwiping) return;

	      var _this$props3 = _this.props;
	      var vertical = _this$props3.vertical;
	      var swipeThreshold = _this$props3.swipeThreshold;
	      var slidesToMove = _this$props3.slidesToMove;

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
	          swipeOffset: axis / dimension * slidesToMove,
	          instant: true
	        });
	      }
	    }, _this._onSwipeEnd = function () {
	      var swipeThreshold = _this.props.swipeThreshold;

	      var threshold = _this._isFlick ? swipeThreshold : _this._sliderWidth * swipeThreshold;

	      _this.setState({
	        swipeOffset: 0,
	        instant: false
	      }, function () {
	        if (_this._isSwipe(threshold)) {
	          _this._deltaX < 0 ? _this.prev() : _this.next();
	        }
	      });

	      _this._isSwiping = false;
	    }, _this._onSwipePast = function () {
	      // perform a swipe end if we swiped past the component
	      if (_this._isSwiping) {
	        _this._onSwipeEnd();
	      }
	    }, _this._setSlideHeight = function (height) {
	      _this.setState({ height: height });
	    }, _this._onSlideEnd = function () {
	      _this.setState({
	        instant: false,
	        wrapping: false
	      });
	      _this._isSliding = false;
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }

	  _createClass(Slider, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var _props = this.props;
	      var currentKey = _props.currentKey;
	      var currentIndex = _props.currentIndex;
	      var children = _props.children;

	      var nextIndex = null;

	      if (currentKey) {
	        nextIndex = (0, _getIndexFromKey2.default)(currentKey, children);
	      } else if (currentIndex) {
	        nextIndex = currentIndex;
	      }

	      if (nextIndex) {
	        var clampedIndex = Math.max(0, Math.min(nextIndex, this._slideCount - 1));

	        this.setState({
	          currentIndex: clampedIndex,
	          currentKey: (0, _getKeyFromIndex2.default)(clampedIndex, children),
	          instant: true
	        });
	      }
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._node = _reactDom2.default.findDOMNode(this);
	      this._getSliderDimensions();
	      this._onChange(this.state.currentIndex, this.props.slidesToShow);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(_ref) {
	      var _this2 = this;

	      var currentKey = _ref.currentKey;
	      var currentIndex = _ref.currentIndex;
	      var slidesToShow = _ref.slidesToShow;
	      var align = _ref.align;
	      var children = _ref.children;

	      this._slideCount = _react.Children.count(children);
	      this._frameWidth = 100 / this._slideCount;
	      this._slideWidth = this._frameWidth / slidesToShow;
	      this._trackWidth = this._slideCount * 100 / slidesToShow;

	      var newKey = this.props.currentKey !== currentKey && this.state.currentKey !== currentKey;
	      var newIndex = this.props.currentIndex !== currentIndex && this.state.currentIndex !== currentIndex;

	      if (newKey || newIndex) {
	        (function () {
	          var nextIndex = null;

	          if (newKey) {
	            nextIndex = (0, _getIndexFromKey2.default)(currentKey, children);
	          } else if (newIndex) {
	            nextIndex = currentIndex;
	          }

	          // "contain" the slides if left aligned
	          if (align === 'left' && nextIndex !== _this2.state.currentIndex) {
	            // const direction = nextIndex > this.state.currentIndex ? 1 : -1
	            // nextIndex += this._getSlidesToMove(nextIndex, direction)
	            // if not containing, make sure index stays within bounds
	          } else {
	              nextIndex = Math.max(0, Math.min(nextIndex, _this2._slideCount - 1));
	            }

	          _this2._beforeSlide(_this2.state.currentIndex, nextIndex);

	          _this2.setState({
	            currentIndex: nextIndex,
	            currentKey: (0, _getKeyFromIndex2.default)(nextIndex, children)
	          }, function () {
	            _this2._onChange(nextIndex, slidesToShow);
	          });
	          // if slidesToShow has changed we need to fire an onChange with the updated indexes
	        })();
	      } else if (this.props.slidesToShow !== slidesToShow) {
	          this._onChange(this.state.currentIndex, slidesToShow);
	        }

	      // if we are receiving new slides we need to animate to the new position instantly
	      if (_react.Children.count(this.props.children) !== _react.Children.count(children)) {
	        this.setState({ instant: true });
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      var _state = this.state;
	      var swipeOffset = _state.swipeOffset;
	      var instant = _state.instant;
	      var wrapping = _state.wrapping;

	      if (swipeOffset === 0 && (instant || wrapping)) {
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
	      var _this3 = this;

	      var currentIndex = this.state.currentIndex;

	      var childrenArray = _react.Children.toArray(this.props.children);
	      var newState = {};
	      var nextIndex = currentIndex;

	      // when align type is left we make sure to only move the amount of slides that are available
	      if (this.props.align === 'left') {
	        nextIndex += this._getSlidesToMove(currentIndex, direction);
	      } else {
	        nextIndex += direction;
	      }

	      // determine if we need to wrap the index
	      if (this.props.infinite) {
	        nextIndex = (0, _modulo2.default)(nextIndex, this._slideCount);

	        if (currentIndex === this._slideCount - 1 && nextIndex === 0 || currentIndex === 0 && nextIndex === this._slideCount - 1) {
	          newState.wrapping = true;
	          newState.instant = true;
	        } else {
	          newState.wrapping = false;
	        }
	        // bail out if index does not exist
	      } else if (!childrenArray[nextIndex]) {
	          return;
	        }

	      newState.currentIndex = nextIndex;
	      newState.currentKey = (0, _getKeyFromIndex2.default)(nextIndex, this.props.children);

	      this._beforeSlide(currentIndex, nextIndex);

	      this.setState(newState, function () {
	        _this3._onChange(nextIndex, _this3.props.slidesToShow);
	      });
	    }
	  }, {
	    key: '_getSliderDimensions',
	    value: function _getSliderDimensions() {
	      this._sliderWidth = this._node.offsetWidth;
	      this._sliderHeight = this._node.offsetHeight;
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
	    key: '_onChange',
	    value: function _onChange(index, slidesToShow) {
	      var currentIndexes = (0, _getSlideRange2.default)(index, index + slidesToShow);
	      this.props.onChange(currentIndexes, this.state.currentKey);
	    }
	  }, {
	    key: '_isSwipe',
	    value: function _isSwipe(threshold) {
	      var x = this._deltaX;
	      var y = this._deltaY;

	      if (this.props.vertical) {
	        var _ref2 = [x, y];
	        y = _ref2[0];
	        x = _ref2[1];
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
	      var _this4 = this;

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

	      return _react2.default.createElement(
	        _reactMotion.Motion,
	        {
	          style: {
	            translate: instant ? destValue : (0, _reactMotion.spring)(destValue, springConfig),
	            wrapperHeight: instant ? height : (0, _reactMotion.spring)(height, springConfig)
	          },
	          onRest: this._afterSlide
	        },
	        function (_ref3) {
	          var translate = _ref3.translate;
	          var wrapperHeight = _ref3.wrapperHeight;

	          _this4._currentTween = translate;
	          return _react2.default.createElement(
	            'div',
	            { className: _this4._getSliderClassNames() },
	            _react2.default.createElement(
	              'div',
	              _extends({
	                className: 'slider__track',
	                style: _defineProperty({
	                  width: _this4._trackWidth + '%',
	                  height: autoHeight && wrapperHeight
	                }, TRANSFORM, 'translate3d(' + translate + '%, 0, 0)')
	              }, _this4._getSwipeEvents()),
	              _react.Children.map(children, function (child, index) {
	                var style = {
	                  width: _this4._slideWidth + '%'
	                };

	                if (infinite) {
	                  if (currentIndex === 0 && index === _this4._slideCount - 1) {
	                    style = _extends({}, style, {
	                      position: 'relative',
	                      left: '-100%'
	                    });
	                  }

	                  if (currentIndex === _this4._slideCount - 1 && index === 0) {
	                    style = _extends({}, style, {
	                      position: 'relative',
	                      right: '-100%'
	                    });
	                  }
	                }

	                return (0, _react.createElement)(_Slide2.default, {
	                  style: style,
	                  isCurrent: currentIndex === index,
	                  onSlideHeight: _this4._setSlideHeight
	                }, child);
	              })
	            )
	          );
	        }
	      );
	    }
	  }]);

	  return Slider;
	}(_react.Component);

	Slider.propTypes = {
	  currentKey: _react.PropTypes.any,
	  currentIndex: _react.PropTypes.number,
	  slidesToShow: _react.PropTypes.number,
	  slidesToMove: _react.PropTypes.number,
	  infinite: _react.PropTypes.bool,
	  vertical: _react.PropTypes.bool,
	  autoHeight: _react.PropTypes.bool,
	  align: _react.PropTypes.oneOf(['left', 'center', 'right']),
	  swipe: _react.PropTypes.oneOf([true, false, 'mouse', 'touch']),
	  swipeThreshold: _react.PropTypes.number,
	  flickTimeout: _react.PropTypes.number,
	  springConfig: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.number),
	  beforeSlide: _react.PropTypes.func,
	  afterSlide: _react.PropTypes.func
	};
	Slider.defaultProps = {
	  currentKey: null,
	  currentIndex: 0,
	  slidesToShow: 1,
	  slidesToMove: 1,
	  infinite: false,
	  vertical: false,
	  autoHeight: false,
	  align: 'left',
	  swipe: true,
	  swipeThreshold: 0.5,
	  flickTimeout: 300,
	  springConfig: _reactMotion.presets.noWobble,
	  onChange: function onChange() {
	    return null;
	  },
	  beforeSlide: function beforeSlide() {
	    return null;
	  },
	  afterSlide: function afterSlide() {
	    return null;
	  }
	};
	exports.default = Slider;

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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Slide = function (_Component) {
	  _inherits(Slide, _Component);

	  function Slide() {
	    _classCallCheck(this, Slide);

	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Slide).apply(this, arguments));
	  }

	  _createClass(Slide, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._node = _reactDom2.default.findDOMNode(this);
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
	}(_react.Component);

	exports.default = Slide;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getIndexFromKey;

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getKeyfromIndex;

	var _react = __webpack_require__(2);

	function getKeyfromIndex(index, children) {
	  var key = null;

	  _react.Children.forEach(children, function (child, _index) {
	    if (index === _index) {
	      key = child.key;
	      return;
	    }
	  });

	  return key;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = slideRange;
	function slideRange(a, b) {
	  var range = [];

	  if (a === b) {
	    return [a];
	  }

	  for (var i = a; i < b; i++) {
	    range.push(i);
	  }

	  return range;
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = modulo;
	function modulo(val, max) {
	  return val < 0 ? (val % max + max) % max : val % max;
	}

/***/ },
/* 10 */
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