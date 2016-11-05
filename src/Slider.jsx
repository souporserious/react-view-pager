import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'

const modulo = (num, max) => ((num % max) + max) % max

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

const ALIGN_OFFSETS = {
  left: 0,
  center: 0.5,
  right: 1
}

class ElementSize {
  constructor({ node, axis, width, height }) {
    this.node = node
    this.axis = axis
    this.setSize(width, height)
  }

  setSize(width, height) {
    this.width = width || this.node.offsetWidth
    this.height = height || this.node.offsetHeight
  }

  getSize(dimension) {
    if (dimension === 'width' || dimension === 'height') {
      return this[dimension]
    } else {
      return this[this.axis === 'x' ? 'width' : 'height']
    }
  }
}

class View extends ElementSize {
  constructor(options) {
    super(options)
    this.top = this.left = {
      original: 0,
      offset: {
        pixel: 0,
        percent: 0
      }
    }
  }

  setCoords(position) {
    this[this.axis === 'y' ? 'top' : 'left'] = position
  }

  getCoords() {
    return this[this.axis === 'y' ? 'top' : 'left']
  }
}

class Views {
  constructor(axis, viewsToShow, infinite) {
    this.axis = axis
    this.viewsToShow = viewsToShow
    this.infinite = infinite
    this.collection = []
  }

  setFrame(frame) {
    this.frame = frame
  }

  setTrack(track) {
    this.track = track
  }

  addView(node, options = {}) {
    const view = new View({
      node,
      axis: this.axis,
      track: this.track,
      ...options
    })

    this.collection.push(view)

    // hydrate positions every time a new view is added
    this.setPositions()
  }

  setPositions() {
    // bail if frame or track haven't been set yet
    if (!this.frame && !this.track) return

    const frameSize = this.frame.getSize()
    const trackSize = this.getTotalSize()
    const trackPosition = this.track.getPosition()
    const startCoords = { top: 0, left: 0 }

    this.collection.reduce((lastView, view) => {
      const lastPosition = lastView && lastView.getCoords().original || 0
      const nextPosition = lastPosition + (view.getSize() / (this.viewsToShow || 1))
      let offsetPosition = lastPosition

      // offset slides in the proper position when wrapping
      if (this.infinite) {
        if (nextPosition < Math.abs(trackPosition)) {
          offsetPosition += trackSize
        } else if (lastPosition > (frameSize - trackPosition)) {
          offsetPosition -= trackSize
        }
      }

      view.setCoords({
        original: nextPosition,
        offset: {
          pixel: offsetPosition,
          percent: this.getPercentValue(offsetPosition)
        }
      })

      return view
    }, null)
  }

  getTotalSize() {
    if (this.viewsToShow) {
      return (this.frame.getSize() / this.viewsToShow) * this.collection.length
    } else {
      const dimension = (this.axis === 'x') ? 'width' : 'height'
      let size = 0

      this.collection.forEach(view => {
        size += view[dimension]
      })

      return size
    }
  }

  getStartCoords(index) {
    let size = 0
    this.collection.slice(0, index).forEach(view => {
      size -= (view.getSize() / (this.viewsToShow || 1))
    })
    return size
  }

  getPercentValue(position) {
    return Math.round(position / this.frame.getSize() * 10000) * 0.01
  }
}

class Track extends ElementSize {
  constructor(options) {
    super(options)
    this.x = this.y = 0
  }

  setPosition(position) {
    this[this.axis] = position
  }

  getPosition() {
    return this[this.axis]
  }
}

class Frame extends ElementSize {
  constructor(options) {
    super(options)
    this.x = this.y = 0
  }

  setPosition(position) {
    this[this.axis] = position
  }

  getPosition() {
    return this[this.axis]
  }
}

///////////////////////////////////////////////////////////
// START REACT
///////////////////////////////////////////////////////////

function getTouchEvent(e) {
  return e.touches && e.touches[0] || e
}

function clamp(val, min, max) {
  return Math.min(Math.max(min, val), max)
}

class ViewPage extends Component {
  componentDidMount() {
    this.props.onMount(findDOMNode(this))
  }

  render() {
    const { view, viewsToShow, axis, children } = this.props
    const child = Children.only(children)
    const style = {
      ...child.props.style,
      top: (view.top && view.top.offset.percent) + '%' || 0 + '%',
      left: (view.left && view.left.offset.percent) + '%' || 0 + '%'
    }

    if (viewsToShow) {
      style[axis === 'x' ? 'width' : 'height'] = (100 / viewsToShow) + '%'
    }

    return cloneElement(child, { ref: this._handleNode, style })
  }
}

class ViewPager extends Component {
  static propTypes = {
    currentView: PropTypes.any,
    viewsToShow: PropTypes.number,
    viewsToMove: PropTypes.number,
    infinite: PropTypes.bool,
    instant: PropTypes.bool,
    axis: PropTypes.oneOf(['x', 'y']),
    align: PropTypes.oneOf(['left', 'center', 'right', PropTypes.number]),
    autoSize: PropTypes.bool,
    swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
    swipeThreshold: PropTypes.number, // to advance slides, the user must swipe a length of (1/touchThreshold) * the width of the slider
    flickTimeout: PropTypes.number,
    contain: PropTypes.bool,
    // lazyLoad: PropTypes.bool,
    // rtl: PropTypes.bool,
    // springConfig: React.PropTypes.objectOf(React.PropTypes.number),
    beforeAnimation: PropTypes.func,
    afterAnimation: PropTypes.func
  }

  static defaultProps = {
    currentView: 0,
    viewsToShow: 0,
    viewsToMove: 1,
    infinite: false,
    instant: false,
    axis: 'x',
    align: 'left',
    autoSize: false,
    contain: true, // don't allow slider to show empty cells
    swipe: true,
    swipeThreshold: 0.5,
    flickTimeout: 300,
    edgeFriction: 0, // the amount the slider can swipe past on the ends if infinite is false
    // lazyLoad: false, // lazyily load components as they enter
    // rtl: false, // right to left
    // springConfig: presets.gentle,
    onChange: () => null,
    beforeAnimation: () => null,
    afterAnimation: () => null
  }

  constructor(props) {
    super(props)

    this._views = new Views(props.axis, props.viewsToShow, props.infinite)
    this._viewCount = Children.count(props.children)

    // swiping
    this._startSwipe = {}
    this._swipeDiff = {}
    this._isSwiping = false
    this._isFlick = false

    this.state = {
      trackPosition: 0,
      currentView: props.currentView
    }
  }

  componentDidMount() {
    const { autoSize, axis } = this.props

    this._frame = new Frame({
      node: this._frameNode,
      width: autoSize && this._getCurrentViewSize('width'),
      height: autoSize && this._getCurrentViewSize('height'),
      axis
    })

    this._track = new Track({
      node: this._trackNode,
      axis
    })

    // set frame and track for views to access
    this._views.setFrame(this._frame)
    this._views.setTrack(this._track)

    // set positions so we can get a total width
    this._views.setPositions()

    // set track width to the size of views
    const totalViewSize = this._views.getTotalSize()
    this._track.setSize(totalViewSize, totalViewSize)

    // finally, set the initial track position
    this._setTrackPosition(this._getStartCoords())
  }

  componentWillReceiveProps({ currentView }) {
    // update state with new index if necessary
    if (typeof currentView !== undefined && this.props.currentView !== currentView) {
      this.setState({ currentView })
    }
  }

  componentDidUpdate(lastProps, lastState) {
    // reposition slider if index has changed
    if (this.state.currentView !== lastState.currentView) {
      this._setTrackPosition(this._getStartCoords())
    }

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

  prev() {
    this.slide(-1)
  }

  next() {
    this.slide(1)
  }

  slide = (direction, index = this.state.currentView) => {
    const { children, viewsToMove, infinite } = this.props
    const newIndex = index + (direction * viewsToMove)
    const currentView = infinite
      ? modulo(newIndex, this._viewCount)
      : clamp(newIndex, 0, this._viewCount - 1)

    this.setState({ currentView }, () => {
      this.props.onChange(currentView)
    })
  }

  _handleViewMount = (node) => {
    this._views.addView(node)
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
    const alignMultiplier = isNaN(align) ? ALIGN_OFFSETS[align] : align
    return (frameSize - (currentViewSize / (viewsToShow || 1))) * alignMultiplier
  }

  _setTrackPosition(position, bypassContain) {
    const { infinite, contain } = this.props
    const frameSize = this._frame.getSize()
    const trackSize = this._track.getSize()

    // wrapping
    if (infinite) {
      position = modulo(position, trackSize) - trackSize
    }

    // alignment
    position += this._getAlignOffset()

    // contain
    if (!bypassContain && contain) {
      position = clamp(position, frameSize - trackSize, 0)
    }

    // set new track position
    this._track.setPosition(position)

    // update view positions
    this._views.setPositions()

    // update state
    this.setState({
      trackPosition: position
    })
  }

  _isSwipe(threshold) {
    const { axis } = this.props
    let { x, y } = this._swipeDiff
    return axis === 'x'
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

  _inBounds(trackPosition) {
    const frameEnd = (this._track.getSize() - this._frame.getSize())
    return trackPosition > 0 || Math.abs(trackPosition) > frameEnd
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

      // let swipDiff = this._swipeDiff[axis] * edgeFriction
      let swipDiff = this._swipeDiff[axis]
      let newTrackPosition = (this._startTrack - swipDiff) * viewsToMove

      this._setTrackPosition(newTrackPosition, this._inBounds(newTrackPosition))
    }
  }

  _onSwipeEnd = () =>  {
    const { swipeThreshold, axis } = this.props
    const { trackPosition } = this.state
    const currentViewSize = this._getCurrentViewSize()
    const threshold = this._isFlick ? swipeThreshold : (currentViewSize * swipeThreshold)

    // if "contain" is activated and we have swiped past the frame we need to
    // reset the value back to the clamped position
    if (this._inBounds(trackPosition)) {
      this._setTrackPosition(trackPosition, false)
    }

    // if (this._isSwipe(threshold)) {
    //   (this._swipeDiff[axis] < 0) ? this.prev() : this.next()
    // }

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
    const { autoSize, viewsToShow, axis, children } = this.props
    const trackPosition = this._getPositionValue(this.state.trackPosition)
    const frameStyles = {}

    if (autoSize) {
      frameStyles.width = this._getCurrentViewSize('width') || 'auto'
      frameStyles.height = this._getCurrentViewSize('height') || 'auto'
    }

    return (
      <div
        ref={c => this._frameNode = findDOMNode(c)}
        className="frame"
        style={frameStyles}
        {...this._getSwipeEvents()}
      >
        <div
          ref={c => this._trackNode = findDOMNode(c)}
          className="track"
          style={{
            transform: this._getTransformValue(trackPosition)
          }}
        >
          {Children.map(children, (child, index) =>
            <ViewPage
              view={this._views.collection[index] || {}}
              viewsToShow={viewsToShow}
              axis={axis}
              onMount={this._handleViewMount}
              children={child}
            />
          )}
        </div>
      </div>
    )
  }
}

export default ViewPager
