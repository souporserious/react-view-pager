import React, { Component, PropTypes, Children, createElement, cloneElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Pager from './Pager'
import Frame from './Frame'
import Track from './Track'
import View from './View'
import getIndex from './get-index'

function getTouchEvent(e) {
  return e.touches && e.touches[0] || e
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
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number,
    // rightToLeft: PropTypes.bool,
    // lazyLoad: PropTypes.bool,
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
      frameSize: {
        width: 0,
        height: 0
      },
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

  _setFrameAutoSize() {
    if (!this.props.autoSize) return
    this.setState({
      frameSize: this._viewPager.getFrameSize(true)
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

  _getFrameStyle() {
    const { springConfig } = this.props
    const { frameSize } = this.state
    return {
      width: spring(frameSize.width, springConfig),
      height: spring(frameSize.height, springConfig)
    }
  }

  _getTrackStyle() {
    const { trackPosition } = this._viewPager
    const { springConfig } = this.props
    const { instant } = this.state
    return {
      trackPosition: (instant)
        ? trackPosition
        : spring(trackPosition, springConfig)
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
