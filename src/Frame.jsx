import React, { Component, PropTypes, Children, createElement, cloneElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Pager from './Pager'
import Swipe from './Swipe'
import Keyboard from './Keyboard'
import specialAssign from './special-assign'

const checkedProps = {
  tag: PropTypes.any,
  autoSize: PropTypes.bool,
  accessibility: PropTypes.bool,
  springConfig: PropTypes.objectOf(PropTypes.number)
}

class Frame extends Component {
  static contextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  static propTypes = checkedProps

  static defaultProps = {
    tag: 'div',
    autoSize: false,
    accessibility: true,
    springConfig: presets.noWobble
  }

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
      instant: true
    }
  }

  componentWillMount() {
    const { pager } = this.context

    pager.setOptions(this.props)

    this._swipe = new Swipe(pager)
    this._keyboard = new Keyboard(pager)
  }

  componentDidMount() {
    const { pager } = this.context

    pager.addFrame(findDOMNode(this))

    // set frame size initially and then based on certain view events
    this._setFrameSize()
    pager.on('viewAdded', this._setFrameSize)
    pager.on('viewChange', this._setFrameSize)
  }

  _setFrameSize = () => {
    const frameSize = this.context.pager.getFrameSize(true, true)

    if (frameSize.width && frameSize.height) {
      this.setState(frameSize, () => {
        // we need to unset the instant flag now that React Motion has dimensions to animate to
        if (this.state.instant) {
          this.setState({ instant: false })
        }
      })
    }
  }

  _getFrameStyle() {
    const { width, height, instant } = this.state
    return {
      maxWidth: instant ? width : spring(width),
      height: instant ? height : spring(height)
    }
  }

  _renderFrame(style) {
    const { tag, accessibility } = this.props
    const props = specialAssign({
      ...this._swipe.getEvents(),
      ...this._keyboard.getEvents(),
      tabIndex: accessibility ? 0 : null
    }, this.props, checkedProps)

    return createElement(tag, {
      ...props,
      style: {
        ...style,
        ...props.style
      }
    })
  }

  render() {
    const { height } = this.state
    const style = {
      position: 'relative',
      overflow: 'hidden'
    }

    if (this.props.autoSize) {
      return (
        <Motion style={this._getFrameStyle()}>
          { dimensions => {
            if (dimensions.maxWidth) {
              style.maxWidth = dimensions.maxWidth
            }
            if (dimensions.height) {
              style.height = dimensions.height
            }
            return this._renderFrame(style)
          }}
        </Motion>
      )
    } else {
      return this._renderFrame(style)
    }
  }
}

export default Frame
