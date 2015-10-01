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

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactMotion = __webpack_require__(3);

	var _Slide = __webpack_require__(4);

	var _Slide2 = _interopRequireDefault(_Slide);

	var Slider = (function (_Component) {
	  _inherits(Slider, _Component);

	  function Slider() {
	    var _this = this;

	    _classCallCheck(this, Slider);

	    _get(Object.getPrototypeOf(Slider.prototype), 'constructor', this).apply(this, arguments);

	    this.state = {
	      currIndex: this._getIndexFromKey(this.props),
	      nextIndex: null,
	      direction: null,
	      isSliding: false,
	      currHeight: null
	    };
	    this._slideCount = this.props.children.length;

	    this.setHeight = function (height) {
	      _this.setState({
	        currHeight: isNaN(height) ? _this._node.scrollHeight : height
	      });
	    };

	    this._handleSlideEnd = function (newIndex) {
	      var _state = _this.state;
	      var currIndex = _state.currIndex;
	      var nextIndex = _state.nextIndex;

	      _this.setState({
	        currIndex: newIndex,
	        nextIndex: null,
	        direction: null,
	        isSliding: false
	      }, function () {
	        // fire callback if values changed
	        if (currIndex !== newIndex) {
	          var key = _this._getKeyFromIndex(newIndex);
	          _this.props.onChange(key, newIndex);
	        }
	      });
	    };
	  }

	  _createClass(Slider, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._node = _react2['default'].findDOMNode(this);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var _state2 = this.state;
	      var currIndex = _state2.currIndex;
	      var isSliding = _state2.isSliding;

	      var nextIndex = this._getIndexFromKey(nextProps);

	      // keep an up to date count
	      this._slideCount = nextProps.children.length;

	      // don't update state if index hasn't changed and we're not in the middle of a slide
	      if (currIndex !== nextIndex && !isSliding) {
	        this.setState({
	          nextIndex: nextIndex,
	          direction: this._getDirection(nextIndex),
	          isSliding: true
	        });
	      }
	    }

	    // don't update unless height has changed or we have stopped sliding
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(nextProps, nextState) {
	      var _state3 = this.state;
	      var currIndex = _state3.currIndex;
	      var currHeight = _state3.currHeight;
	      var isSliding = _state3.isSliding;

	      var newIndex = this._getIndexFromKey(nextProps);

	      return currHeight !== nextState.currHeight || !isSliding;
	    }
	  }, {
	    key: 'prev',
	    value: function prev() {
	      this._slide('prev');
	    }
	  }, {
	    key: 'next',
	    value: function next() {
	      this._slide('next');
	    }

	    // does not animate to new height, but primes the slider whenever it moves to
	    // a new slide so you don't get a jump from having an old height, useful if
	    // children are affecting the wrapper height after moving to a new slide
	  }, {
	    key: '_getDirection',
	    value: function _getDirection(nextIndex) {
	      return this.state.currIndex > nextIndex ? 'prev' : 'next';
	    }
	  }, {
	    key: '_slide',
	    value: function _slide(direction) {
	      var _state4 = this.state;
	      var currIndex = _state4.currIndex;
	      var isSliding = _state4.isSliding;

	      var nextIndex = this._getNewIndex(direction);

	      if (isSliding || currIndex === nextIndex) return;

	      this.setState({
	        nextIndex: nextIndex,
	        direction: direction,
	        isSliding: true
	      });
	    }
	  }, {
	    key: '_getKeyFromIndex',
	    value: function _getKeyFromIndex(index) {
	      var children = this.props.children;

	      var key = null;

	      _react.Children.forEach(children, function (child, _index) {
	        if (index === _index) {
	          key = child.key;
	          return;
	        }
	      });
	      return key;
	    }
	  }, {
	    key: '_getIndexFromKey',
	    value: function _getIndexFromKey(props) {
	      var children = props.children;
	      var currentKey = props.currentKey;

	      var index = 0;

	      _react.Children.forEach(children, function (child, _index) {
	        if (child.key === currentKey) {
	          index = _index;
	          return;
	        }
	      });
	      return index;
	    }
	  }, {
	    key: '_getNewIndex',
	    value: function _getNewIndex(direction) {
	      var currIndex = this.state.currIndex;

	      var delta = direction === 'prev' ? -1 : 1;
	      var willWrap = direction === 'prev' && currIndex === 0 || direction === 'next' && currIndex === this._slideCount - 1;

	      return willWrap ? currIndex : (currIndex + delta) % this._slideCount;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var _props = this.props;
	      var component = _props.component;
	      var children = _props.children;
	      var className = _props.className;
	      var autoHeight = _props.autoHeight;
	      var sliderConfig = _props.sliderConfig;
	      var slideConfig = _props.slideConfig;
	      var _state5 = this.state;
	      var currIndex = _state5.currIndex;
	      var nextIndex = _state5.nextIndex;
	      var direction = _state5.direction;
	      var isSliding = _state5.isSliding;
	      var currHeight = _state5.currHeight;

	      var childrenToRender = _react.Children.map(children, function (child, index) {
	        return (0, _react.createElement)(_Slide2['default'], {
	          index: index,
	          currIndex: currIndex,
	          nextIndex: nextIndex,
	          direction: direction,
	          isSliding: isSliding,
	          slideConfig: slideConfig,
	          onSlideEnd: _this2._handleSlideEnd,
	          onGetHeight: _this2.setHeight
	        }, child);
	      });

	      return !autoHeight ? (0, _react.createElement)(component, { className: className }, childrenToRender) : (0, _react.createElement)(_reactMotion.Motion, {
	        style: {
	          height: (0, _reactMotion.spring)(currHeight || 0, sliderConfig)
	        }
	      }, function (_ref) {
	        var height = _ref.height;

	        return (0, _react.createElement)(component, {
	          className: className,
	          style: {
	            height: isSliding ? height : null
	          }
	        }, childrenToRender);
	      });
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      component: _react.PropTypes.string,
	      currentKey: _react.PropTypes.any,
	      autoHeight: _react.PropTypes.bool,
	      sliderConfig: _react.PropTypes.array,
	      slideConfig: _react.PropTypes.array,
	      onChange: _react.PropTypes.func
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      component: 'div',
	      currentKey: 0,
	      autoHeight: false,
	      sliderConfig: _reactMotion.presets.noWobble,
	      slideConfig: _reactMotion.presets.noWobble,
	      onChange: function onChange() {
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactMotion = __webpack_require__(3);

	var TRANSFORM = __webpack_require__(5)('transform');

	var Slide = (function (_Component) {
	  _inherits(Slide, _Component);

	  function Slide() {
	    var _this = this;

	    _classCallCheck(this, Slide);

	    _get(Object.getPrototypeOf(Slide.prototype), 'constructor', this).apply(this, arguments);

	    this._firstPass = true;
	    this._lastHeight = null;

	    this._getEndValues = function (prevValue) {
	      var _props = _this.props;
	      var nextIndex = _props.nextIndex;
	      var isSliding = _props.isSliding;
	      var slideConfig = _props.slideConfig;

	      var config = isSliding ? slideConfig : [];
	      var x = isSliding ? 100 : 0;

	      if (prevValue && prevValue[0].x === x && isSliding) {
	        // reset x value so we don't immediately hit onSlideEnd again
	        x = 0;

	        // fire callback to Slider
	        _this.props.onSlideEnd(nextIndex);
	      }

	      return [{ x: (0, _reactMotion.spring)(x, slideConfig) }];
	    };
	  }

	  _createClass(Slide, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this._node = _react2['default'].findDOMNode(this);
	      this._getHeight(this.props.currIndex);
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      this._firstPass = false;
	      this._getHeight(this.props.nextIndex);
	    }
	  }, {
	    key: '_getHeight',
	    value: function _getHeight(nextIndex) {
	      var index = this.props.index;

	      var height = this._node.scrollHeight;

	      if (index === nextIndex && height !== this._lastHeight) {
	        this.props.onGetHeight(height);
	      }

	      this._lastHeight = height;
	    }
	  }, {
	    key: '_getStyles',
	    value: function _getStyles(x) {
	      var _props2 = this.props;
	      var index = _props2.index;
	      var currIndex = _props2.currIndex;
	      var nextIndex = _props2.nextIndex;
	      var direction = _props2.direction;
	      var isSliding = _props2.isSliding;

	      var style = {
	        width: '100%',
	        position: null,
	        top: 0,
	        left: 0
	      };

	      // only apply styles to slides that need to move
	      if (currIndex === index || nextIndex === index) {
	        var translateX = direction === 'prev' ? x : -x;

	        if (nextIndex === index) {
	          style.position = 'absolute';

	          if (direction === 'prev') {
	            translateX -= 100;
	          } else {
	            translateX += 100;
	          }
	        }

	        // don't apply any styles if we aren't sliding
	        if (!isSliding) {
	          style = {};
	        } else {
	          style[TRANSFORM] = 'translate3d(' + translateX + '%, 0, 0)';
	        }
	      } else {
	        // don't set outside slides to "display: none" on first pass, this allows
	        // proper DOM calculation for height to be achieved
	        if (this._firstPass) {
	          style = {
	            width: '100%',
	            height: 0,
	            overflow: 'hidden'
	          };
	        } else {
	          style = { display: 'none' };
	        }
	      }

	      return style;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var child = _react.Children.only(this.props.children);

	      return (0, _react.createElement)(_reactMotion.StaggeredMotion, {
	        styles: this._getEndValues
	      }, function (values) {
	        return (0, _react.cloneElement)(child, {
	          style: _this2._getStyles(values[0].x)
	        });
	      });
	    }
	  }]);

	  return Slide;
	})(_react.Component);

	exports['default'] = Slide;
	module.exports = exports['default'];

/***/ },
/* 5 */
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