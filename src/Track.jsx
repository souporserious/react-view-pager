import React, { Component, Children, createElement } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Pager from './Pager'
import getIndex from './get-index'
import specialAssign from './special-assign'

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
  // rightToLeft: PropTypes.bool,
  // lazyLoad: PropTypes.bool,
  springConfig: PropTypes.objectOf(PropTypes.number),
  onSwipeStart: PropTypes.func,
  onSwipeMove: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  onScroll: PropTypes.func,
  onViewChange: PropTypes.func,
  onRest: PropTypes.func
}
const isNotEqual = (current, next) => (
  current.viewsToShow !== next.viewsToShow ||
  current.viewsToMove !== next.viewsToMove ||
  current.align !== next.align ||
  current.axis !== next.axis ||
  current.animations !== next.animations ||
  current.infinite !== next.infinite ||
  current.swipe !== next.swipe ||
  current.swipeThreshold !== next.swipeThreshold ||
  current.flickTimeout !== next.flickTimeout
)

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
    // we need Children map in order for the infinite option to work
    // not actually sure why this is the case
    return Children.map(this.props.children, child => child)
  }

  render() {
    const { pager } = this.context
    const { tag, trackPosition, children, ...restProps } = this.props
    let style = {
      ...restProps.style
    }

    if (pager.track) {
      style = {
        ...style,
        ...pager.track.getStyles(trackPosition)
      }
    }

    return createElement(tag, {
      ...restProps,
      style
    }, this._renderViews())
  }
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
    onViewChange: noop,
    onRest: noop
  }

  static contextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  state = {
    instant: false
  }

  _currentTween = 0
  _hydrate = false

  componentWillMount() {
    this.context.pager.setOptions(this.props)
  }

  componentDidMount() {
    const { pager } = this.context

    // add track to pager
    pager.addTrack(findDOMNode(this))

    // set initial view index and listen for any incoming view index changes
    this.scrollTo(getIndex(this.props.currentView, this.props.children))

    // set values instantly on respective events
    pager.on('hydrated', () => this._setValueInstantly(true, true))
    pager.on('swipeMove', () => this._setValueInstantly(true))
    pager.on('swipeEnd', () => this._setValueInstantly(false))

    // prop callbacks
    pager.on('swipeStart', this.props.onSwipeStart)
    pager.on('swipeMove', this.props.onSwipeMove)
    pager.on('swipeEnd', this.props.onSwipeEnd)
    pager.on('viewChange', this.props.onViewChange)
  }

  componentWillReceiveProps(nextProps) {
    const { currentView, instant, children } = nextProps

    // update instant state from props
    if (this.props.instant !== instant) {
      this._setValueInstantly(instant)
    }

    // update state with new index if necessary
    if (typeof currentView !== undefined && this.props.currentView !== currentView) {
      this.scrollTo(getIndex(currentView, children))
    }

    // update any options that have changed
    if (isNotEqual(this.props, nextProps)) {
      this.context.pager.setOptions(nextProps)
      this._hydrate = true
    }
  }

  componentDidUpdate(nextProps) {
    if (this._hydrate) {
      this.context.pager.hydrate()
      this._hydrate = false
    }
  }

  prev() {
    this.context.pager.prev()
  }

  next() {
    this.context.pager.next()
  }

  scrollTo(index) {
    this.context.pager.setCurrentView({ index })
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
      this.context.pager.resetViewIndex()

      // set instant flag so we can prime track for next move
      this._setValueInstantly(true, true)
    }

    this.props.onRest()
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
