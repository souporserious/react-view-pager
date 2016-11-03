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
  constructor({ node, width, height, axis }) {
    this.node = node
    this.axis = axis
    this.setSize(width, height)
  }

  setSize(width, height) {
    this.width = width || this.node.offsetWidth
    this.height = height || this.node.offsetHeight
  }

  getSize() {
    return this[this.axis === 'x' ? 'width' : 'height']
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

  setEdge(position) {
    this[this.axis === 'y' ? 'top' : 'left'] = position
  }

  getEdge() {
    return this[this.axis === 'y' ? 'top' : 'left']
  }
}

class Views {
  constructor(axis) {
    this.axis = axis
    this.collection = []
  }

  setFrame(frame) {
    this.frame = frame
  }

  setTrack(track) {
    this.track = track
  }

  addView(view) {
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
      const lastPosition = lastView && lastView.getEdge().original || 0
      const nextPosition = lastPosition + view.getSize()
      let offsetPosition = lastPosition

      // offset slides in the proper position when wrapping
      if (nextPosition < Math.abs(trackPosition)) {
        offsetPosition += trackSize
      } else if (lastPosition > (frameSize - trackPosition)) {
        offsetPosition -= trackSize
      }

      view.setEdge({
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
    let size = 0
    this.collection.forEach(view => { size += view.width })
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

class ViewPage extends Component {
  componentDidMount() {
    this.props.onMount(findDOMNode(this), this.props.index)
  }

  render() {
    const { width, position, view, children } = this.props
    const child = Children.only(children)
    const style = {
      ...child.props.style,
      left: (view.left && view.left.offset.percent) + '%' || 0 + '%'
    }

    if (width) {
      style.width = width + '%'
    }

    // pass isCurrent here so we can do stuff with it. Also pass as child function
    // because people may want that functionality

    return cloneElement(child, { ref: this._handleNode, style })
  }
}

class ViewPager extends Component {
  static propTypes = {
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    // viewsToShow: PropTypes.number, // can be false as well
    viewsToMove: PropTypes.number,
    infinite: PropTypes.bool,
    instant: PropTypes.bool,
    vertical: PropTypes.bool,
    autoHeight: PropTypes.bool,
    // align: PropTypes.oneOf(['left', 'center', 'right', PropTypes.number]),
    align: PropTypes.any,
    swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number,
    beforeAnimation: PropTypes.func,
    afterAnimation: PropTypes.func
  }

  static defaultProps = {
    // currentKey: null,
    currentIndex: 0,
    viewsToShow: false,
    viewsToMove: 1,
    infinite: false,
    // instant: false,
    axis: 'x',
    // autoHeight: false,
    align: 'center',
    swipe: true,
    swipeThreshold: 0.5,
    flickTimeout: 300,
    onChange: () => null,
    beforeAnimation: () => null,
    afterAnimation: () => null
  }

  constructor(props) {
    super(props)

    this._viewCount = Children.count(props.children)

    // swiping
    this._deltaX = false
    this._deltaY = false
    this._startX = {}
    this._startY = {}
    this._isSwiping = false
    this._isFlick = false

    this.state = {
      currentIndex: props.currentIndex,
      currentKey: props.currentKey,
      swipeOffset: 0,
      instant: false
    }

    // NEW
    this._trackX = 0
    this._trackPosition = 0
    this._viewDimensions = []

    if (props.viewsToShow) {
      this._viewWidth = 100 / props.viewsToShow
      this._trackWidth = this._viewWidth * this._viewCount
      this._frameWidth = this._viewWidth * props.viewsToShow

      this._viewHeight = 100 / props.viewsToShow
      this._trackHeight = this._viewWidth * this._viewCount
      this._frameHeight = this._viewWidth * props.viewsToShow
    } else {
      this._viewWidth = -1
      this._trackWidth = -1
      this._frameWidth = -1

      this._viewHeight = -1
      this._trackHeight = -1
      this._frameHeight = -1
    }

    // NEW new
    this._views = new Views(props.axis)
  }

  // some type of method that hydrates the variables so it can be used
  // with a resize detector or whatever
  hydrate() {
    const { axis } = this.props

    this._frame = new Frame({
      node: this._frameNode,
      axis
    })

    this._track = new Track({
      node: this._trackNode,
      axis
    })


    this._views.setFrame(this._frame)
    this._views.setTrack(this._track)

    // set positions so we can get a total width
    this._views.setPositions()

    // set track width to the size of views
    this._track.setSize(this._views.getTotalSize(), 0)

    if (!this.props.viewsToShow) {
      this._frameWidth = this._frameNode.offsetWidth
      this._frameHeight = this._frameNode.offsetHeight
    }

    this._trackX = this._getLeftStartCoords()
  }

  componentDidMount() {
    this.hydrate()
    this._setTrackPosition()
  }

  componentWillReceiveProps({ currentIndex }) {
    if (typeof currentIndex !== undefined && this.props.currentIndex !== currentIndex) {
      this.setState({ currentIndex })
    }
  }

  componentWillUpdate() {
    this._views.setPositions()
  }

  componentDidUpdate(lastProps, lastState) {
    // reposition slider if index has changed
    if (this.state.currentIndex !== lastState.currentIndex) {
      this._trackX = this._getLeftStartCoords()
      this._setTrackPosition()
    }
  }

  prev() {
    this.slide(-1)
  }

  next() {
    this.slide(1)
  }

  slide = (direction, index = this.state.currentIndex) => {
    const { viewsToMove } = this.props
    const currentIndex = modulo(index + (direction * viewsToMove), this._viewCount)
    this.setState({ currentIndex }, () => {
      this.props.onChange(currentIndex)
    })
  }

  _handleViewMount = (node, index) => {
    const { viewsToShow, axis } = this.props

    if (viewsToShow) {
      this._viewDimensions.push([this._viewWidth, this._viewHeight])
    } else {
      this._viewDimensions.push([node.offsetWidth, node.offsetHeight])
      // console.log('track', this._trackWidth)
      this._trackWidth += node.offsetWidth
      this._trackHeight += node.offsetHeight
    }

    ////////////////////////////
    const view = new View({
      index,
      node,
      axis,
      track: this._track
    })

    this._views.addView(view)

    this.forceUpdate()
  }

  _isSwipe(threshold) {
    let x = this._deltaX
    let y = this._deltaY

    if (this.props.vertical) {
      [y, x] = [x, y]
    }

    return Math.abs(x) > Math.max(threshold, Math.abs(y))
  }

  _onSwipeStart = (e) => {
    const swipe = e.touches && e.touches[0] || e

    // we're now swiping
    this._isSwiping = true

    // reset deltas
    this._deltaX = this._deltaY = 0

    // store the initial starting coordinates
    this._startX = {
      slider: this._trackX,
      page: swipe.pageX
    }
    this._startY = swipe.pageY

    // determine if a flick or not
    this._isFlick = true

    setTimeout(() => {
      this._isFlick = false
    }, this.props.flickTimeout)
  }

  _onSwipeMove = (e) =>  {
    // bail if we aren't swiping
    if (!this._isSwiping) return

    const { vertical, swipeThreshold, viewsToMove } = this.props
    const swipe = e.touches && e.touches[0] || e

    // determine how much we have moved
    this._deltaX = this._startX.page - swipe.pageX
    this._deltaY = this._startY - swipe.pageY

    if (this._isSwipe(swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()

      const deltaAxis = vertical ? this._deltaY : this._deltaX

      this._trackX = (this._startX.slider - deltaAxis) * viewsToMove
      this._setTrackPosition()

      // this.setState({
      //   swipeOffset: (axis / dimension) * viewsToMove,
      //   instant: true
      // })
    }
  }

  _onSwipeEnd = () =>  {
    const { swipeThreshold } = this.props
    const currentViewSize = this._getCurrentViewSize()
    const threshold = this._isFlick ? swipeThreshold : (currentViewSize * swipeThreshold)

    // this.setState({
    //   swipeOffset: 0,
    //   instant: false
    // }, () => {
      // if (this._isSwipe(threshold)) {
      //   (this._deltaX < 0) ? this.prev() : this.next()
      // }
    // })

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
      swipeEvents = {
        onMouseDown: this._onSwipeStart,
        onMouseMove: this._onSwipeMove,
        onMouseUp: this._onSwipeEnd,
        onMouseLeave: this._onSwipePast
      }
    }

    if (swipe === true || swipe === 'touch') {
      swipeEvents = {
        ...swipeEvents,
        onTouchStart: this._onSwipeStart,
        onTouchMove: this._onSwipeMove,
        onTouchEnd: this._onSwipeEnd
      }
    }

    return swipeEvents
  }

  _getCurrentViewSize() {
    const { viewsToShow, vertical } = this.props
    const slideDimensions = this._viewDimensions[this.state.currentIndex]
    return viewsToShow
      ? ( vertical ? this._viewHeight : this._viewWidth )
      : ( slideDimensions && vertical ? slideDimensions[1] : slideDimensions[0] ) || 0
  }

  _setTrackPosition() {
    const { align, vertical } = this.props
    const alignMultiplier = isNaN(align) ? ALIGN_OFFSETS[align] : align
    const currentViewSize = this._getCurrentViewSize()
    const trackSize = this._track.getSize()
    const frameSize = this._frame.getSize()

    let position = modulo(this._trackX, trackSize) - trackSize

    position += (frameSize - currentViewSize) * alignMultiplier

    this._trackPosition = position

    this._track.setPosition(position, 0)

    this.forceUpdate()
  }

  _getPercentValue(position) {
    const frameDimension = this.props.vertical ? this._frameHeight : this._frameWidth
    // console.log('internal position', position)
    // console.log('INTERNAL TOTAL SIZE', frameDimension)
    return Math.round(position / frameDimension * 10000) * 0.01
  }

  _getLeftStartCoords(index = this.state.currentIndex) {
    return this._viewDimensions
      .slice(0, index)
      .reduce((sum, [width, height]) => sum - (this.props.vertical ? height : width), 0)
  }

  render() {
    const { viewsToShow, children } = this.props
    const trackPosition = this._getPercentValue(this._trackPosition)
    return (
      <div
        ref={c => this._frameNode = findDOMNode(c)}
        className="frame"
        {...this._getSwipeEvents()}
      >
        <div
          ref={c => this._trackNode = findDOMNode(c)}
          className="track"
          style={{
            transform: `translate3d(${trackPosition}%, 0, 0)`
          }}
        >
          {Children.map(children, (child, index) =>
            <ViewPage
              index={index}
              view={this._views.collection[index] || {}}
              width={viewsToShow && this._viewWidth}
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
