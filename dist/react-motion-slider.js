(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactMotion"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactMotion"], factory);
	else if(typeof exports === 'object')
		exports["Slider"] = factory(require("React"), require("ReactMotion"));
	else
		root["Slider"] = factory(root["React"], root["ReactMotion"]);
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

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactMotion = __webpack_require__(3);

	var _reactMeasure = __webpack_require__(4);

	var _reactMeasure2 = _interopRequireDefault(_reactMeasure);

	var _getPrefixJs = __webpack_require__(8);

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
	      currIndex: this._getCurrentChildIndex(this.props),
	      direction: null,
	      dimensions: {},
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

	    this._storeDimensions = function (key, childDimensions) {
	      var dimensions = _this.state.dimensions;

	      dimensions[key] = childDimensions;
	      _this.setState({ dimensions: dimensions });
	    };
	  }

	  _inherits(Slider, _Component);

	  _createClass(Slider, [{
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      this.setState({ currIndex: this._getCurrentChildIndex(nextProps) });
	    }
	  }, {
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
	    key: '_getCurrentChildIndex',
	    value: function _getCurrentChildIndex(props) {
	      var children = props.children;
	      var currentKey = props.currentKey;

	      var index = 0;

	      _react.Children.forEach(children, function (child, i) {
	        if (child.key === currentKey) {
	          index = i;
	          return;
	        }
	      });
	      return index;
	    }
	  }, {
	    key: '_getChildByIndex',
	    value: function _getChildByIndex(i) {
	      var children = this.props.children;

	      var child = null;

	      _react.Children.forEach(children, function (_child, _i) {
	        if (i === _i) {
	          child = _child;
	          return;
	        }
	      });
	      return child;
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
	      var currChild = this._getChildByIndex(currIndex);
	      var dimensions = this.state.dimensions[currChild.key];
	      var height = dimensions && dimensions.height || 0;

	      return _react2['default'].createElement(
	        _reactMotion.Spring,
	        {
	          endValue: { val: { height: height, x: destX }, config: springConfig }
	        },
	        function (_ref2) {
	          var _ref2$val = _ref2.val;
	          var height = _ref2$val.height;
	          var x = _ref2$val.x;

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
	                  height: height,
	                  width: sliderWidth + '%'
	                }, _this2.transform, 'translate3d(' + x + '%, 0, 0)')
	              },
	              _react.Children.map(children, function (child) {
	                return _react2['default'].createElement(
	                  _reactMeasure2['default'],
	                  {
	                    whitelist: ['height'],
	                    onChange: _this2._storeDimensions.bind(null, child.key)
	                  },
	                  child
	                );
	              })
	            )
	          );
	        }
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      draggable: _react.PropTypes.bool,
	      currentKey: _react.PropTypes.any,
	      //currentIndex: PropTypes.number,
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
	      currentKey: 0,
	      //currentIndex: 0, soon
	      springConfig: _reactMotion.presets.noWobble,
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	var _Measure = __webpack_require__(5);

	var _Measure2 = _interopRequireDefault(_Measure);

	exports['default'] = _Measure2['default'];
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();

	var _get = function get(_x, _x2, _x3) {
	  var _again = true;_function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;desc = parent = getter = undefined;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
	      }
	    } else if ('value' in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;if (getter === undefined) {
	        return undefined;
	      }return getter.call(receiver);
	    }
	  }
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _MeasureChild = __webpack_require__(6);

	var _MeasureChild2 = _interopRequireDefault(_MeasureChild);

	var _getNodeDimensions = __webpack_require__(7);

	var _getNodeDimensions2 = _interopRequireDefault(_getNodeDimensions);

	var Measure = (function (_Component) {
	  _inherits(Measure, _Component);

	  function Measure() {
	    var _this = this;

	    _classCallCheck(this, Measure);

	    _get(Object.getPrototypeOf(Measure.prototype), 'constructor', this).apply(this, arguments);

	    this._whitelist = this.props.whitelist || ['width', 'height', 'top', 'right', 'bottom', 'left'];
	    this._properties = this._whitelist.filter(function (prop) {
	      return _this.props.blacklist.indexOf(prop) < 0;
	    });
	    this._portal = null;
	    this._lastDimensions = {};

	    this._cloneMounted = function (dimensions) {
	      _this._update(dimensions);

	      // remove component and portal since we no longer need it
	      _react2['default'].unmountComponentAtNode(_this._portal);
	      _this._closePortal();
	    };
	  }

	  _createClass(Measure, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._node = _react2['default'].findDOMNode(this);

	      if (this.props.clone) {
	        this._cloneComponent();
	      } else {
	        this._update((0, _getNodeDimensions2['default'])(this._node));
	      }
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      // we check for parent node because we we're getting some weird issues
	      // with React Motion specifically and it causing an error on unmount
	      // because parent would return null, might be a bigger problem to look into
	      if (this.props.clone && this._node.parentNode) {
	        this._cloneComponent();
	      } else {
	        this._update((0, _getNodeDimensions2['default'])(this._node));
	      }
	    }
	  }, {
	    key: '_openPortal',
	    value: function _openPortal() {
	      var portal = document.createElement('div');

	      // set styles to hide portal from view
	      portal.style.cssText = '\n      height: 0;\n      position: relative;\n      overflow: hidden;\n    ';

	      this._portal = portal;

	      // append portal next to this component
	      this._node.parentNode.insertBefore(portal, this._node.nextSibling);
	    }
	  }, {
	    key: '_closePortal',
	    value: function _closePortal() {
	      this._portal.parentNode.removeChild(this._portal);
	    }
	  }, {
	    key: '_cloneComponent',
	    value: function _cloneComponent() {
	      var onMount = this._cloneMounted;
	      var clone = (0, _react.cloneElement)(this.props.children);
	      var child = _react2['default'].createElement(_MeasureChild2['default'], { onMount: onMount }, clone);

	      // create a portal to append clone to
	      this._openPortal();

	      // render clone to the portal
	      _react2['default'].render(child, this._portal);
	    }
	  }, {
	    key: '_update',
	    value: function _update(dimensions) {
	      var _this2 = this;

	      // determine if we need to update our callback with new dimensions or not
	      this._properties.forEach(function (prop) {
	        if (dimensions[prop] !== _this2._lastDimensions[prop]) {
	          _this2.props.onChange(dimensions);

	          // store last dimensions to compare changes
	          _this2._lastDimensions = dimensions;

	          // we don't need to look any further, bail out
	          return;
	        }
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react.Children.only(this.props.children);
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      clone: _react.PropTypes.bool,
	      whitelist: _react.PropTypes.array,
	      blacklist: _react.PropTypes.array,
	      onChange: _react.PropTypes.func
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      clone: false,
	      blacklist: [],
	      onChange: function onChange() {
	        return null;
	      }
	    },
	    enumerable: true
	  }]);

	  return Measure;
	})(_react.Component);

	exports['default'] = Measure;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();

	var _get = function get(_x, _x2, _x3) {
	  var _again = true;_function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;desc = parent = getter = undefined;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
	      }
	    } else if ('value' in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;if (getter === undefined) {
	        return undefined;
	      }return getter.call(receiver);
	    }
	  }
	};

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError('Cannot call a class as a function');
	  }
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== 'function' && superClass !== null) {
	    throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
	  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _getNodeDimensions = __webpack_require__(7);

	var _getNodeDimensions2 = _interopRequireDefault(_getNodeDimensions);

	var MeasureChild = (function (_Component) {
	  _inherits(MeasureChild, _Component);

	  function MeasureChild() {
	    _classCallCheck(this, MeasureChild);

	    _get(Object.getPrototypeOf(MeasureChild.prototype), 'constructor', this).apply(this, arguments);
	  }

	  _createClass(MeasureChild, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var node = _react2['default'].findDOMNode(this);

	      // fire a callback to let Measure know our dimensions
	      this.props.onMount((0, _getNodeDimensions2['default'])(node, true));
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return this.props.children;
	    }
	  }]);

	  return MeasureChild;
	})(_react.Component);

	exports['default'] = MeasureChild;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = getNodeDimensions;

	function getNodeDimensions(node) {
	  var clone = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	  if (clone) {
	    // set width/height to auto to get a true calculation
	    node.style.width = 'auto';
	    node.style.height = 'auto';

	    // move node exactly on top of it's clone to calculate proper position
	    // this also overrides any transform already set, so something like scale
	    // won't affect the calculation, could be bad to do this,
	    // but we'll see what happens
	    node.style.transform = 'translateY(-100%)';
	    node.style.WebkitTransform = 'translateY(-100%)';
	  }

	  var rect = node.getBoundingClientRect();

	  return {
	    width: rect.width,
	    height: rect.height,
	    top: rect.top,
	    right: rect.right,
	    bottom: rect.bottom,
	    left: rect.left
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 8 */
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