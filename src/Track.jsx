import React, { Component, Children, PropTypes, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Pager from './Pager'
import View from './View'
import getIndex from './get-index'

const TRANSFORM = require('get-prefix')('transform')

class Track extends Component {
  static propTypes = {
    springConfig: React.PropTypes.objectOf(React.PropTypes.number)
  }

  static defaultProps = {
    tag: 'div',
    springConfig: presets.noWobble
  }

  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  state = {
    instant: false
  }

  _currentTween = 0

  componentDidMount() {
    const { viewPager } = this.context

    // add track to pager
    viewPager.addTrack(findDOMNode(this))

    // refresh instantly to set first track position
    this._setValueInstantly(true, true)

    viewPager.on('viewAdded', () => this._setValueInstantly(true, true))
    viewPager.on('swipeMove', () => this._setValueInstantly(true))
    viewPager.on('swipeEnd', () => this._setValueInstantly(false))

    // set initial view index and listen for any incoming view index changes
    this.setCurrentView(viewPager.options.currentView)

    viewPager.on('updateView', index => {
      this.setCurrentView(index)
    })
  }

  setCurrentView(index) {
    this.context.viewPager.setCurrentView(0, getIndex(index, this.props.children))
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
    let { trackPosition } = this.context.viewPager
    if (!this.state.instant) {
      trackPosition = spring(trackPosition, this.props.springConfig)
    }
    return { trackPosition }
  }

  _handleOnRest = () => {
    const { viewPager } = this.context
    if (viewPager.options.infinite && !this.state.instant) {
      // reset back to a normal index
      viewPager.resetViews()

      // set instant flag so we can prime track for next move
      this._setValueInstantly(true, true)
    }

    // fire event for prop callback on Frame component
    viewPager.emit('rest')
  }

  _renderViews() {
    return (
      Children.map(this.props.children, child =>
        <View children={child}/>
      )
    )
  }

  render() {
    const { viewPager } = this.context
    const { tag, springConfig, ...restProps } = this.props
    return (
      <Motion
        style={this._getTrackStyle()}
        onRest={this._handleOnRest}
        >
        { ({ trackPosition }) => {
          const { x, y } = viewPager.getPositionValue(trackPosition)
          const style = {
            ...restProps.style,
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            [TRANSFORM]: `translate3d(${x}px, ${y}px, 0)`
          }

          if (viewPager.options.infinite) {
            // update view positions with current position tween
            // this method can get called hundreds of times, let's make sure to optimize as much as we can
            // maybe we do a cheaper calculation each time and run a reposition only if a new view has left/entered
            // this could possibly help out with lazy rendering
            viewPager.positionViews(trackPosition)
          }

          return createElement(tag, { ...restProps, style }, this._renderViews())
        }}
      </Motion>
    )
  }
}

export default Track
