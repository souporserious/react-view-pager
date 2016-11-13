import React, { Component, PropTypes, Children, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import ElementBase from './PagerElement'
import Views from './Views'
import ViewComponent from './ViewComponent'
import getIndex from './get-index'
import Pager from './Pager'

// react-view-pager
// const Slider = ({ slides }) => (
//   <Frame>
//     { ({ position, isSliding, isSwiping }) =>
//       <Motion style={{ value: isSwiping ? position : spring(position) }}>
//         { value =>
//           <Track position={value}> // overrides internal position
//             {slides} // that position would set proper wrapper values
//           </Track>
//         }
//       </Motion>
//     }
//   </Frame>
// )

/*

const view = new View({
  position: x | y,
  target: // where the slider should position this slide, options are calculated against position
})

const track = new Track({
  position: x | y // current position of track
})

*/

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

class Frame extends Component {
  static defaultProps = {
    tag: 'div'
  }

  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  componentDidMount() {
    const { viewPager } = this.context
    viewPager.addFrame(findDOMNode(this))
    viewPager.positionTrack()
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

  render() {
    const { tag, ...restProps } = this.props
    return createElement(tag, restProps)
  }
}

class ViewPager extends Component {
  static propTypes = {
    currentView: PropTypes.any,
    viewsToShow: PropTypes.number,
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
    // lazyLoad: PropTypes.bool,
    springConfig: React.PropTypes.objectOf(React.PropTypes.number),
    // onReady: PropTypes.func,
    beforeAnimation: PropTypes.func,
    afterAnimation: PropTypes.func
  }

  static defaultProps = {
    currentView: 0,
    viewsToShow: 0,
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
    // rightToLeft: false,
    // lazyLoad: false, // lazyily load components as they enter
    springConfig: presets.noWobble,
    // onReady: () => null,
    onChange: () => null,
    beforeAnimation: () => null,
    afterAnimation: () => null
  }

  static childContextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  constructor(props) {
    super(props)

    this._viewPager = new Pager()
    this._views = new Views(props.axis, props.viewsToShow, props.infinite)
    this._viewCount = Children.count(props.children)

    // swiping
    this._startSwipe = {}
    this._swipeDiff = {}
    this._isSwiping = false
    this._isFlick = false

    this.state = {
      trackPosition: 0,
      currentView: getIndex(props.currentView, props.children)
    }
  }

  getChildContext() {
    return {
      viewPager: this._viewPager
    }
  }

  componentDidMount() {
    const { autoSize, axis } = this.props

    // this._frame = new ElementBase({
    //   node: this._frameNode,
    //   width: autoSize && this._getCurrentViewSize('width'),
    //   height: autoSize && this._getCurrentViewSize('height'),
    //   axis
    // })
    //
    // this._track = new ElementBase({
    //   node: this._trackNode,
    //   axis
    // })
    //
    // // set frame and track for views to access
    // this._views.setFrame(this._frame)
    // this._views.setTrack(this._track)
    //
    // // set positions so we can get a total width
    // this._views.setPositions()
    //
    // // set track width to the size of views
    // const totalViewSize = this._views.getTotalSize()
    // this._track.setSize(totalViewSize, totalViewSize)
    //
    // // finally, set the initial track position
    // this._setTrackPosition(this._getStartCoords())
  }

  componentWillReceiveProps({ currentView, children }) {
    // update state with new index if necessary
    if (typeof currentView !== undefined && this.props.currentView !== currentView) {
      this.setState({
        currentView: getIndex(currentView, children)
      })
    }
  }

  componentDidUpdate(lastProps, lastState) {
    if (this.state.currentView !== lastState.currentView) {
      // reposition slider if index has changed
      this._setTrackPosition(this._getStartCoords())

      // update frame size to match new view size
      if (this.props.autoSize) {
        const width = this._getCurrentViewSize('width')
        const height = this._getCurrentViewSize('height')

        // update frame size
        this._frame.setSize(width, height)

        // update view positions
        this._views.setPositions()
      }
    }
  }

  prev() {
    this.slide(-1)
  }

  next() {
    this.slide(1)
  }

  slide = (direction, index = this.state.currentView) => {
    this._viewPager.setCurrentView(direction, index)

    this.setState({ currentView: index + direction }, () => {
      console.log(this._viewPager.getTransformValue())
      // this.props.onChange(currentView)
    })
    // const { children, viewsToMove, infinite } = this.props
    // const newIndex = index + (direction * viewsToMove)
    // const currentView = infinite
    //   ? modulo(newIndex, this._viewCount)
    //   : clamp(newIndex, 0, this._viewCount - 1)
    //
  }

  _handleViewMount = (node, index) => {
    this._views.addView({ node, index })
    this.forceUpdate()
  }

  _getStartCoords(index = this.state.currentView) {
    return this._views.getStartCoords(index)
  }

  _getCurrentViewSize(dimension) {
    const currentView = this._views.collection[this.state.currentView]
    return currentView && currentView.getSize(dimension) || 0
  }

  _getAlignOffset() {
    const { align, viewsToShow } = this.props
    const frameSize = this._frame.getSize()
    const currentViewSize = this._getCurrentViewSize()
    return (frameSize - (currentViewSize / (viewsToShow || 1))) * align
  }

  _setTrackPosition(position, bypassContain) {
    // const { infinite, contain } = this.props
    // const frameSize = this._frame.getSize()
    // const trackSize = this._track.getSize()
    //
    // // wrapping
    // if (infinite) {
    //   position = modulo(position, trackSize) - trackSize
    // }
    //
    // // alignment
    // // position += this._getAlignOffset()
    //
    // // contain
    // if (!bypassContain && contain) {
    //   position = clamp(position, frameSize - trackSize, 0)
    // }
    //
    // // set new track position
    // this._track.setPosition(position)
    //
    // // update view positions
    // this._views.setPositions()
    //
    // // update state
    // this.setState({
    //   trackPosition: position
    // })
  }

  _isOutOfBounds(trackPosition) {
    const frameEnd = (this._track.getSize() - this._frame.getSize())
    return trackPosition > 0 || Math.abs(trackPosition) > frameEnd
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
    this._isSwiping = true

    // store the initial starting coordinates
    this._startTrack = this._track.getPosition() - this._getAlignOffset()
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
    if (!this._isSwiping) return

    const { swipeThreshold, axis, viewsToMove } = this.props
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
      const trackPosition = (this._startTrack - swipeDiff) * viewsToMove
      const isOutOfBounds = this._isOutOfBounds(trackPosition)
      this._setTrackPosition(trackPosition, isOutOfBounds)
    }
  }

  _onSwipeEnd = () =>  {
    const { swipeThreshold, axis, infinite } = this.props
    const { trackPosition } = this.state
    const currentViewSize = this._getCurrentViewSize()
    const threshold = this._isFlick ? swipeThreshold : (currentViewSize * swipeThreshold)

    // if "contain" is activated and we have swiped past the frame we need to
    // reset the value back to the clamped position
    if (this._isSwipe(threshold)) {
      (this._swipeDiff[axis] < 0) ? this.prev() : this.next()
    } else if (!infinite && this._isOutOfBounds(trackPosition)) {
      this._setTrackPosition(trackPosition, false)
    }

    this._isSwiping = false
  }

  _onSwipePast = () =>  {
    // perform a swipe end if we swiped past the component
    if (this._isSwiping) {
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

    return {}
    return swipeEvents
  }

  _getPositionValue(position) {
    const frameSize = this._frame && this._frame.getSize() || 0
    return Math.round(position / frameSize * 10000) * 0.01
  }

  _getTransformValue(trackPosition) {
    const { axis } = this.props
    const position = { x: 0, y: 0 }
    position[axis] = trackPosition || 0
    return `translate3d(${position.x}%, ${position.y}%, 0)`
  }

  render() {
    const { autoSize, viewsToShow, axis, springConfig, children } = this.props
    const destValue = this._getPositionValue(this.state.trackPosition) || 0
    const frameStyles = {}

    if (autoSize) {
      frameStyles.width = this._getCurrentViewSize('width') || 'auto'
      frameStyles.height = this._getCurrentViewSize('height') || 'auto'
    }

    return (
      <Frame
        ref={c => this._frameNode = findDOMNode(c)}
        className="frame"
        style={frameStyles}
        {...this._getSwipeEvents()}
      >
        <Motion style={{ trackPosition: this._isSwiping ? destValue : spring(destValue, springConfig) }}>
          { ({ trackPosition }) =>
            <Track
              ref={c => this._trackNode = findDOMNode(c)}
              className="track"
              style={{
                [TRANSFORM]: this._getTransformValue(trackPosition)
              }}
            >
              {Children.map(children, (child, index) =>
                <ViewComponent
                  index={index}
                  view={this._views.collection[index] || {}}
                  viewsToShow={viewsToShow}
                  axis={axis}
                  // onMount={this._handleViewMount}
                  children={child}
                />
              )}
            </Track>
          }
        </Motion>
      </Frame>
    )
  }
}

export default ViewPager
