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
    const { viewPager } = this.context
    // update view positions with current position tween
    // this method can get called hundreds of times, let's make sure to optimize as much as we can
    // maybe we do a cheaper calculation each time and run a reposition only if a new view has left/entered
    if (viewPager.options.infinite) {
      viewPager.positionViews(position)
    }
  }

  render() {
    const { tag, position, ...restProps } = this.props
    const { x, y } = this.context.viewPager.getPositionValue(position)
    const style = {
      ...restProps.style,
      [TRANSFORM]: `translate3d(${x}px, ${y}px, 0)`
    }

    return createElement(tag, { ...restProps, style })
  }
}

export default Track
