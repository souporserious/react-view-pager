import React, { Component, PropTypes, Children, createElement, cloneElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Pager from './Pager'
import Swipe from './Swipe'
import Keyboard from './Keyboard'
import Track from './Track'
import View from './View'
import specialAssign from './special-assign'

const noop = () => null
const checkedProps = {
  tag: PropTypes.string,
  currentView: PropTypes.any,
  viewsToShow: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  viewsToMove: PropTypes.number,
  align: PropTypes.number,
  contain: PropTypes.bool,
  axis: PropTypes.oneOf(['x', 'y']),
  autoSize: PropTypes.bool,
  animations: PropTypes.array,
  infinite: PropTypes.bool,
  instant: PropTypes.bool,
  swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
  swipeThreshold: PropTypes.number,
  flickTimeout: PropTypes.number,
  accessibility: PropTypes.bool,
  springConfig: React.PropTypes.objectOf(React.PropTypes.number),
  // rightToLeft: PropTypes.bool,
  // lazyLoad: PropTypes.bool,
  beforeViewChange: PropTypes.func,
  afterViewChange: PropTypes.func
}

class Frame extends Component {
  static propTypes = checkedProps

  static defaultProps = {
    tag: 'div',
    currentView: 0,
    viewsToShow: 1,
    viewsToMove: 1,
    align: 0,
    contain: false,
    axis: 'x',
    autoSize: false,
    infinite: false,
    instant: false,
    swipe: true,
    swipeThreshold: 0.5,
    flickTimeout: 300,
    accessibility: true,
    springConfig: presets.noWobble,
    // rightToLeft: false,
    // lazyLoad: false,
    beforeViewChange: noop,
    afterViewChange: noop
  }

  static childContextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  constructor(props) {
    super(props)

    this._pager = new Pager(props)
    this._swipe = new Swipe(this._pager)
    this._keyboard = new Keyboard(this._pager)

    this.state = {
      width: 0,
      height: 0,
      instant: true
    }
  }

  getChildContext() {
    return {
      pager: this._pager
    }
  }

  componentDidMount() {
    this._pager.addFrame(findDOMNode(this))

    // set frame size initially and then based on certain view events
    this._setFrameSize()
    this._pager.on('viewAdded', this._setFrameSize)
    this._pager.on('viewChange', this._setFrameSize)

    // prop callbacks
    this._pager.on('viewChange', this.props.beforeViewChange)
    this._pager.on('rest', this.props.afterViewChange)
  }

  componentWillReceiveProps({ currentView, children }) {
    // update state with new index if necessary
    // if (typeof currentView !== undefined && this._pager.currentIndex !== currentView) {
    if (typeof currentView !== undefined && this.props.currentView !== currentView) {
      this.scrollTo(currentView)
    }
  }

  componentWillUnmount() {
    this._pager.destroy()
  }

  getInstance() {
    return this._pager
  }

  prev() {
    this._pager.prev()
  }

  next() {
    this._pager.next()
  }

  scrollTo(view) {
    // this is pretty anti-react, but since we might not know the children we need
    // to listen for this event in Track and update it there to allow people the ability
    // to move to a view by it's key
    this._pager.emit('updateView', view)
  }

  _setFrameSize = () => {
    const frameSize = this._pager.getFrameSize(true, true)

    if (frameSize.width && frameSize.height) {
      this.setState(frameSize, () => {
        // we need to unset the instant flag now that React Motion has dimensions to animate to
        if (this.state.instant) {
          this.setState({ instant: false })
        }
      })
    }
  }

  _getFrameStyle() {
    const { width, height, instant } = this.state
    return {
      maxWidth: instant ? width : spring(width),
      height: instant ? height : spring(height)
    }
  }

  _renderFrame(style) {
    const { tag, accessibility } = this.props
    const props = specialAssign({
      ...this._swipe.getEvents(),
      ...this._keyboard.getEvents(),
      tabIndex: accessibility ? 0 : null
    }, this.props, checkedProps)

    return createElement(tag, {
      ...props,
      style: {
        ...style,
        ...props.style
      }
    })
  }

  render() {
    const { height } = this.state
    const style = {
      position: 'relative',
      overflow: 'hidden'
    }

    if (this.props.autoSize) {
      return (
        <Motion style={this._getFrameStyle()}>
          { dimensions => {
            if (dimensions.maxWidth) {
              style.maxWidth = dimensions.maxWidth
            }
            if (dimensions.height) {
              style.height = dimensions.height
            }
            return this._renderFrame(style)
          }}
        </Motion>
      )
    } else {
      return this._renderFrame(style)
    }
  }
}

export default Frame
