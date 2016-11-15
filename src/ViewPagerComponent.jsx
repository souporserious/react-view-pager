import React, { Component, PropTypes, Children, createElement, cloneElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import PagerElement from './PagerElement'
import getIndex from './get-index'

const TRANSFORM = require('get-prefix')('transform')

function modulo(val, max) {
  return ((val % max) + max) % max
}

function clamp(val, min, max) {
  return Math.min(Math.max(min, val), max)
}

function getTouchEvent(e) {
  return e.touches && e.touches[0] || e
}

class Pager {
  constructor(options = {}) {
    this.views = []
    this.currentIndex = 0
    this.currentView = null
    this.trackPosition = 0
    this.isSwiping = false

    this.options = {
      axis: 'x',
      align: 0,
      contain: false,
      infinite: false,
      viewsToMove: 1,
      ...options
    }
  }

  addFrame(node) {
    this.frame = new PagerElement({ node, pager: this })
  }

  addTrack(node) {
    this.track = new PagerElement({ node, pager: this })
  }

  addView(node) {
    const { align } = this.options
    const index = this.views.length
    const view = new PagerElement({
      node,
      pager: this
    })

    // add view to collection
    // allow option to prepend, insert, or append
    this.views.push(view)

    // set target position
    let target = this.getStartCoords(index)

    if (align) {
      target += this.getAlignOffset(view)
    }

    view.target = target

    // set this as the first view if there isn't one
    if (!this.currentView) {
      this.currentView = view
    }

    // with each view added we need to re-calculate positions
    this.positionViews()

    return view
  }

  prev() {
    this.setCurrentView(-1)
  }

  next() {
    this.setCurrentView(1)
  }

  setPositionValue(trackPosition = this.currentView ? this.currentView.target : 0) {
    const { infinite, contain } = this.options
    const trackSize = this.getTrackSize()

    if (infinite && !this.isSwiping) {
      // we offset by a track multiplier so infinite animation works as expected
      trackPosition -= (Math.floor(this.currentIndex / this.views.length) || 0) * trackSize
    }

    if (contain && !this.isSwiping) {
      trackPosition = clamp(trackPosition, this.frame.getSize() - trackSize, 0)
    }

    this.trackPosition = trackPosition
  }

  setCurrentView(direction, index = this.currentIndex) {
    const { viewsToMove, infinite, onChange } = this.options
    const newIndex = index + (direction * viewsToMove)
    const currentIndex = infinite
      ? newIndex
      : clamp(newIndex, 0, this.views.length - 1)

    this.currentIndex = currentIndex
    this.currentView = this.getView(currentIndex)
    this.setPositionValue()
  }

  resetViews() {
    // reset back to a normal index
    this.setCurrentView(0, modulo(this.currentIndex, this.views.length))
  }

  getTransformValue(trackPosition = this.trackPosition) {
    const { infinite, contain } = this.options
    const position = { x: 0, y: 0 }

    if (infinite) {
      trackPosition = this.getWrappedTrackValue(trackPosition)
    }

    position[this.options.axis] = trackPosition

    return `translate3d(${position.x}px, ${position.y}px, 0)`
  }

  getWrappedTrackValue(position) {
    const trackSize = this.getTrackSize()
    return modulo(position, -trackSize) || 0
  }

  // where the view should start
  getStartCoords(index) {
    let target = 0
    this.views.slice(0, index).forEach(view => {
      target -= view.getSize()
    })
    return target
  }

  getFrameAutoSize() {
    const { viewsToShow, axis } = this.options
    let maxHeight = 0
    let maxWidth = 0

    if (viewsToShow !== 'auto') {
      this.views.slice(this.currentIndex, this.currentIndex + viewsToShow).forEach(view => {
        const width = view.getSize('width')
        const height = view.getSize('height')
        if (axis === 'x') {
          maxWidth += width
          if (height > maxHeight) {
            maxHeight = height
          }
        } else {
          maxHeight += height
          if (width > maxWidth) {
            maxWidth = width
          }
        }
      })
    } else {
      maxWidth = this.currentView.getSize('width')
      maxHeight = this.currentView.getSize('height')
    }

    return {
      width: maxWidth,
      height: maxHeight
    }
  }

  getTrackSize() {
    let size = 0
    this.views.forEach(view => {
      size += view.getSize()
    })
    return size
  }

  // how much to offset the view considering the align option
  getAlignOffset(view) {
    const frameSize = this.frame.getSize()
    const viewSize = view.getSize()
    return (frameSize - viewSize) * this.options.align
  }

  getView(index) {
    return this.views[modulo(index, this.views.length)]
  }

  positionViews(trackPosition = 0) {
    const { infinite, align } = this.options
    const frameSize = this.frame.getSize()
    const trackSize = this.getTrackSize()

    trackPosition = modulo(trackPosition, -trackSize)

    this.views.reduce((lastPosition, view, index) => {
      const viewSize = view.getSize()
      const nextPosition = lastPosition + viewSize
      let position = lastPosition

      if (infinite) {
        // shift views around so they are always visible in frame
        if (nextPosition + (viewSize * align) < Math.abs(trackPosition)) {
          position += trackSize
        } else if (lastPosition > (frameSize - trackPosition)) {
          position -= trackSize
        }
      }

      view.setPosition(position)

      return nextPosition
    }, 0)
  }
}



class Frame extends Component {
  static defaultProps = {
    tag: 'div'
  }

  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  componentDidMount() {
    this.context.viewPager.addFrame(findDOMNode(this))
  }

  render() {
    const { tag, ...restProps } = this.props
    return createElement(tag, restProps)
  }
}



class Track extends Component {
  static defaultProps = {
    tag: 'div'
  }

  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  componentDidMount() {
    this.context.viewPager.addTrack(findDOMNode(this))
  }

  componentWillUpdate({ position }) {
    // update view positions with current position tween
    // this method can get called thousands of times, let's make sure to optimize as much as we can
    this.context.viewPager.positionViews(position)
  }

  render() {
    const { tag, position, ...restProps } = this.props
    const style = {
      ...restProps.style,
      transform: this.context.viewPager.getTransformValue(position)
    }

    return createElement(tag, { ...restProps, style })
  }
}



class View extends Component {
  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  state = {
    viewInstance: null
  }

  componentDidMount() {
    this.setState({
      viewInstance: this.context.viewPager.addView(findDOMNode(this))
    })
  }

  render() {
    const { viewsToShow, axis } = this.context.viewPager.options
    const { children, ...restProps } = this.props
    const { viewInstance } = this.state
    const child = Children.only(children)
    const style = { ...child.props.style }

    if (viewsToShow !== 'auto') {
      style[axis === 'x' ? 'width' : 'height'] = this.context.viewPager.frame.getSize() / viewsToShow
    }

    if (viewInstance) {
      style[axis === 'y' ? 'top' : 'left'] = viewInstance.getPosition()
    }

    return cloneElement(child, { ...restProps, style })
  }
}



class ViewPager extends Component {
  static propTypes = {
    currentView: PropTypes.any,
    viewsToShow: PropTypes.any,
    viewsToMove: PropTypes.number,
    align: PropTypes.number,
    contain: PropTypes.bool,
    axis: PropTypes.oneOf(['x', 'y']),
    autoSize: PropTypes.bool,
    infinite: PropTypes.bool,
    instant: PropTypes.bool,
    swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
    swipeThreshold: PropTypes.number, // to advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider
    flickTimeout: PropTypes.number,
    // rightToLeft: PropTypes.bool,
    // lazyLoad: PropTypes.bool, // lazyily load components as they enter
    springConfig: React.PropTypes.objectOf(React.PropTypes.number),
    onReady: PropTypes.func,
    // onChange: PropTypes.func,
    // beforeAnimation: PropTypes.func,
    // afterAnimation: PropTypes.func
  }

  static defaultProps = {
    currentView: 0,
    viewsToShow: 'auto',
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
    rightToLeft: false,
    lazyLoad: false,
    springConfig: presets.noWobble,
    onReady: () => null,
    onChange: () => null,
    beforeAnimation: () => null,
    afterAnimation: () => null
  }

  static childContextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  constructor(props) {
    super(props)

    this._viewPager = new Pager(props)
    this._currentTween = 0

    // swiping
    this._startSwipe = {}
    this._swipeDiff = {}
    this._isFlick = false

    this.state = {
      currentView: getIndex(props.currentView, props.children),
      frameSize: {},
      instant: false,
      isMounted: false
    }
  }

  getChildContext() {
    return {
      viewPager: this._viewPager
    }
  }

  componentDidMount() {
    // we need to mount the frame and track before we can gather the proper info
    // for views, we use this flag to determine when we can mount the views
    this.setState({ isMounted: true }, () => {
      this._setFrameAutoSize()
      this._viewPager.setPositionValue()

      // now the pager is ready, animate to whatever value instantly
      this.setState({ instant: true }, () => {
        this.props.onReady()
        this.setState({ instant: false })
      })
    })
  }

  componentWillReceiveProps({ currentView, children, instant }) {
    // update state with new index if necessary
    if (typeof currentView !== undefined && this.props.currentView !== currentView) {
      const newIndex = getIndex(currentView, children)

      // set the new view index
      this._viewPager.setCurrentView(0, newIndex)

      // store it so we can compare it later
      this.setState({
        currentView: newIndex
      })
    }

    // update instant state from props
    if (this.props.instant !== instant) {
      this.setState({
        instant
      })
    }
  }

  componentDidUpdate(lastProps, lastState) {
    if (this.state.currentView !== lastState.currentView) {
      // update frame size to match new view size
      this._setFrameAutoSize()
    }
  }

  _setFrameAutoSize() {
    if (!this.props.autoSize) return
    this.setState({
      frameSize: this._viewPager.getFrameAutoSize()
    })
  }

  prev() {
    this._viewPager.prev()
    this.setState({
      currentView: this._viewPager.currentIndex
    })
  }

  next() {
    this._viewPager.next()
    this.setState({
      currentView: this._viewPager.currentIndex
    })
  }

  _isSwipe(threshold) {
    const { x, y } = this._swipeDiff
    return this.props.axis === 'x'
      ? Math.abs(x) > Math.max(threshold, Math.abs(y))
      : Math.abs(x) < Math.max(threshold, Math.abs(y))
  }

  _onSwipeStart = (e) => {
    const { pageX, pageY } = getTouchEvent(e)

    // we're now swiping
    this._viewPager.isSwiping = true

    // store the initial starting coordinates
    this._startTrack = this._currentTween
    this._startSwipe = {
      x: pageX,
      y: pageY
    }

    // determine if a flick or not
    this._isFlick = true

    setTimeout(() => {
      this._isFlick = false
    }, this.props.flickTimeout)
  }

  _onSwipeMove = (e) =>  {
    // bail if we aren't swiping
    if (!this._viewPager.isSwiping) return

    const { swipeThreshold, axis } = this.props
    const { pageX, pageY } = getTouchEvent(e)

    // determine how much we have moved
    this._swipeDiff = {
      x: this._startSwipe.x - pageX,
      y: this._startSwipe.y - pageY
    }

    if (this._isSwipe(swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()

      const swipeDiff = this._swipeDiff[axis]
      const trackPosition = this._startTrack - swipeDiff

      this._viewPager.setPositionValue(trackPosition)

      this.setState({
        instant: true
      })
    }
  }

  _onSwipeEnd = () =>  {
    const { swipeThreshold, viewsToMove, axis, infinite } = this.props
    const { frame, currentView, trackPosition } = this._viewPager
    const threshold = this._isFlick
      ? swipeThreshold
      : (currentView.getSize() * viewsToMove) * swipeThreshold

    this._viewPager.isSwiping = false

    this.setState({
      instant: true
    }, () => {
      if (this._isSwipe(threshold)) {
        (this._swipeDiff[axis] < 0)
          ? this.prev()
          : this.next()
      } else {
        this._viewPager.setPositionValue()
      }
      this.setState({ instant: false })
    })
  }

  _onSwipePast = () =>  {
    // perform a swipe end if we swiped past the component
    if (this._viewPager.isSwiping) {
      this._onSwipeEnd()
    }
  }

  _getSwipeEvents() {
    const { swipe } = this.props
    let swipeEvents = {}

    if (swipe === true || swipe === 'mouse') {
      swipeEvents.onMouseDown = this._onSwipeStart
      swipeEvents.onMouseMove = this._onSwipeMove
      swipeEvents.onMouseUp = this._onSwipeEnd
      swipeEvents.onMouseLeave = this._onSwipePast
    }

    if (swipe === true || swipe === 'touch') {
      swipeEvents.onTouchStart = this._onSwipeStart
      swipeEvents.onTouchMove = this._onSwipeMove
      swipeEvents.onTouchEnd = this._onSwipeEnd
    }

    return swipeEvents
  }

  _getMotionStyle(val = 0) {
    const { springConfig } = this.props
    const { instant } = this.state
    return (this._viewPager.isSwiping || instant) ? val : spring(val, springConfig)
  }

  _getFrameStyle() {
    const { frameSize } = this.state
    return {
      width: this._getMotionStyle(frameSize.width),
      height: this._getMotionStyle(frameSize.height)
    }
  }

  _getTrackStyle() {
    return {
      trackPosition: this._getMotionStyle(this._viewPager.trackPosition)
    }
  }

  _handleOnRest = () => {
    const { infinite, children } = this.props

    if (infinite && !this.state.instant) {
      // reset back to a normal index
      this._viewPager.resetViews()

      // set instant flag so we can prime track for next move
      this.setState({ instant: true }, () => {
        this.setState({ instant: false })
      })
    }
  }

  _renderViews() {
    return (
      this.state.isMounted &&
      Children.map(this.props.children, (child, index) =>
        <View children={child}/>
      )
    )
  }

  render() {
    return (
      <Motion style={this._getFrameStyle()}>
        { frameStyles =>
          <Frame
            className="frame"
            style={{
              width: frameStyles.width ? frameStyles.width : null,
              height: frameStyles.height ? frameStyles.height : null
            }}
            {...this._getSwipeEvents()}
          >
            <Motion
              style={this._getTrackStyle()}
              onRest={this._handleOnRest}
            >
              { ({ trackPosition }) => {
                this._currentTween = trackPosition

                if (!this.state.instant) {
                  this._startTrack = this._currentTween
                }

                return (
                  <Track
                    position={trackPosition}
                    className="track"
                  >
                    {this._renderViews()}
                  </Track>
                )
              }}
            </Motion>
          </Frame>
        }
      </Motion>
    )
  }
}

export default ViewPager
