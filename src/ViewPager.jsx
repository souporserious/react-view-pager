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

// look into making sure autoSize doesn't animate on page load
// this is happening because instant only gets called on the track right now

// move to percentage values over pixel, maybe allow this as an option

// clicking the view pager shouldn't move

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
      instant: false,
      isMounted: false,
      isReady: false
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
      this._viewPager.setPositionValue()

      // now the pager is ready, animate to whatever value instantly
      this.props.onReady()
      this.setState({ isReady: true })
    })

    this._viewPager.on('swipeMove', () => {
      this.setState({
        instant: true
      })
    })
    this._viewPager.on('swipeEnd', () => {
      this.setState({
        instant: false
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

  _getTrackStyle() {
    let { trackPosition } = this._viewPager

    if (!this.state.instant) {
      trackPosition = spring(trackPosition, this.props.springConfig)
    }
    return { trackPosition }
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
      <Frame className="frame">
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
    )
  }
}

export default ViewPager
