import React, { Component, PropTypes, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Pager from './Pager'

const TRANSFORM = require('get-prefix')('transform')

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

  componentWillUpdate({ position }) {
    // update view positions with current position tween
    // this method can get called hundreds of times, let's make sure to optimize as much as we can
    this.context.viewPager.positionViews(position)
  }

  render() {
    const { tag, position, ...restProps } = this.props
    const style = {
      ...restProps.style,
      [TRANSFORM]: this.context.viewPager.getTransformValue(position)
    }

    return createElement(tag, { ...restProps, style })
  }
}

export default Track
