import React, { Component, Children, PropTypes, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Pager from './Pager'
import View from './View'
import getIndex from './get-index'
import specialAssign from './special-assign'

const TRANSFORM = require('get-prefix')('transform')

// Track scroller is an intermediate component that allows us to provide the
// React Motion value to onScroll and lets any user of onScroll use setState
class TrackScroller extends Component {
  static propTypes = checkedProps

  static contextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  state = {
    x: 0,
    y: 0
  }

  componentWillReceiveProps({ trackPosition }) {
    const { pager } = this.context

    // update view styles with current position tween
    // this method can get called hundreds of times, let's make sure to optimize as much as we can
    pager.setViewStyles(trackPosition)

    // get the x & y values to position the track
    this.setState(pager.getPositionValue(trackPosition))

    // update onScroll callback, we use requestAnimationFrame to avoid bouncing
    // back from updates from onScroll while React Motion is trying to update it's own tree
    // https://github.com/chenglou/react-motion/issues/357#issuecomment-262393424
    if (this.props.trackPosition !== trackPosition) {
      requestAnimationFrame(() =>
        this.props.onScroll((trackPosition / pager.getTrackSize(false)) * -1, trackPosition)
      )
    }
  }

  _renderViews() {
    return (
      Children.map(this.props.children, child =>
        <View children={child}/>
      )
    )
  }

  render() {
    const { tag, trackPosition, ...restProps } = this.props
    const { x, y } = this.state
    const style = {
      ...restProps.style,
      [TRANSFORM]: `translate3d(${x}px, ${y}px, 0)`
    }

    return createElement(tag, {
      ...restProps,
      style
    }, this._renderViews())
  }
}

const noop = () => null
const checkedProps = {
  tag: PropTypes.any,
  currentView: PropTypes.any,
  viewsToShow: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
  viewsToMove: PropTypes.number,
  align: PropTypes.number,
  contain: PropTypes.bool,
  axis: PropTypes.oneOf(['x', 'y']),
  animations: PropTypes.array,
  infinite: PropTypes.bool,
  instant: PropTypes.bool,
  swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
  swipeThreshold: PropTypes.number,
  flickTimeout: PropTypes.number,
  springConfig: PropTypes.objectOf(PropTypes.number),
  onSwipeStart: PropTypes.func,
  onSwipeMove: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  onScroll: PropTypes.func,
  // rightToLeft: PropTypes.bool,
  // lazyLoad: PropTypes.bool,
  beforeViewChange: PropTypes.func,
  afterViewChange: PropTypes.func
  // beforeAnimation: PropTypes.func,
  // afterAnimation: PropTypes.func
}

class Track extends Component {
  static propTypes = checkedProps

  static defaultProps = {
    tag: 'div',
    currentView: 0,
    viewsToShow: 1,
    viewsToMove: 1,
    align: 0,
    contain: false,
    axis: 'x',
    infinite: false,
    instant: false,
    swipe: true,
    swipeThreshold: 0.5,
    flickTimeout: 300,
    springConfig: presets.noWobble,
    onSwipeStart: noop,
    onSwipeMove: noop,
    onSwipeEnd: noop,
    onScroll: noop,
    beforeViewChange: noop,
    afterViewChange: noop
  }

  static contextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  state = {
    instant: false
  }

  _currentTween = 0

  componentWillMount() {
    this.context.pager.setOptions(this.props)
  }

  componentDidMount() {
    const { pager } = this.context

    // add track to pager
    pager.addTrack(findDOMNode(this))

    // refresh instantly to set first track position
    // this._setValueInstantly(true, true)

    // set initial view index and listen for any incoming view index changes
    // this.setCurrentView(this.props.currentView)

    // set values instantly on respective events
    pager.on('hydrated', () => this._setValueInstantly(true, true))
    pager.on('swipeMove', () => this._setValueInstantly(true))
    pager.on('swipeEnd', () => this._setValueInstantly(false))

    // prop callbacks
    pager.on('swipeStart', this.props.onSwipeStart)
    pager.on('swipeMove', this.props.onSwipeMove)
    pager.on('swipeEnd', this.props.onSwipeEnd)
    pager.on('viewChange', this.props.beforeViewChange)
  }

  componentWillReceiveProps({ currentView, instant, children }) {
    // update instant state from props
    if (this.props.instant !== instant) {
      this._setValueInstantly(instant)
    }

    // update state with new index if necessary
    if (typeof currentView !== undefined && this.props.currentView !== currentView) {
      this.scrollTo(getIndex(currentView, children))
    }
  }

  prev() {
    this.context.pager.prev()
  }

  next() {
    this.context.pager.next()
  }

  scrollTo(index) {
    this.context.pager.setCurrentView(0, index)
  }

  _setValueInstantly(instant, reset) {
    this.setState({ instant }, () => {
      if (reset) {
        this.setState({ instant: false })
      }
    })
  }

  _getTrackStyle() {
    let { trackPosition } = this.context.pager
    if (!this.state.instant) {
      trackPosition = spring(trackPosition, this.props.springConfig)
    }
    return { trackPosition }
  }

  _handleOnRest = () => {
    if (this.props.infinite && !this.state.instant) {
      // reset back to a normal index
      this.context.pager.resetViews()

      // set instant flag so we can prime track for next move
      this._setValueInstantly(true, true)
    }

    this.props.afterViewChange()
  }

  render() {
    const { tag, onScroll, ...restProps } = this.props
    return (
      <Motion
        style={this._getTrackStyle()}
        onRest={this._handleOnRest}
        >
        { ({ trackPosition }) =>
          createElement(TrackScroller,
            specialAssign({ trackPosition, tag, onScroll }, restProps, checkedProps)
          )
        }
      </Motion>
    )
  }
}

export default Track
