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
  springConfig: React.PropTypes.objectOf(React.PropTypes.number),
  onSwipeStart: PropTypes.func,
  onSwipeMove: PropTypes.func,
  onSwipeEnd: PropTypes.func,
  onScroll: PropTypes.func
}

class Track extends Component {
  static propTypes = {
    springConfig: PropTypes.objectOf(PropTypes.number)
  }

  static defaultProps = {
    tag: 'div',
    springConfig: presets.noWobble,
    onSwipeStart: noop,
    onSwipeMove: noop,
    onSwipeEnd: noop,
    onScroll: noop
  }

  static contextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  state = {
    instant: false
  }

  _currentTween = 0

  componentDidMount() {
    const { pager } = this.context

    // add track to pager
    pager.addTrack(findDOMNode(this))

    // refresh instantly to set first track position
    this._setValueInstantly(true, true)

    // set values instantly on respective events
    pager.on('hydrated', () => this._setValueInstantly(true, true))
    pager.on('swipeMove', () => this._setValueInstantly(true))
    pager.on('swipeEnd', () => this._setValueInstantly(false))

    // set initial view index and listen for any incoming view index changes
    this.setCurrentView(pager.options.currentView)

    // updateView event comes from Frame component props
    // this is a little weird, probably should handle this through context
    pager.on('updateView', index => {
      this.setCurrentView(index)
    })

    // prop callbacks
    pager.on('swipeStart', this.props.onSwipeStart)
    pager.on('swipeMove', this.props.onSwipeMove)
    pager.on('swipeEnd', this.props.onSwipeEnd)
  }

  setCurrentView(index) {
    this.context.pager.setCurrentView(0, getIndex(index, this.props.children))
  }

  componentWillReceiveProps({ instant }) {
    // update instant state from props
    if (this.props.instant !== instant) {
      this.setState({ instant })
    }
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
    const { pager } = this.context

    if (pager.options.infinite && !this.state.instant) {
      // reset back to a normal index
      pager.resetViews()

      // set instant flag so we can prime track for next move
      this._setValueInstantly(true, true)
    }

    // fire event for prop callback on Frame component
    // this is super weird as well, can't be a prop callback though since
    // we can have two motion callbacks, maybe use context here as well?
    pager.emit('rest')
  }

  render() {
    const { onScroll, ...restProps } = this.props
    return (
      <Motion
        style={this._getTrackStyle()}
        onRest={this._handleOnRest}
        >
        { ({ trackPosition }) =>
          createElement(TrackScroller,
            specialAssign({ trackPosition, onScroll }, restProps, checkedProps)
          )
        }
      </Motion>
    )
  }
}

export default Track
