import React, { Component, PropTypes, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Pager from './Pager'

class Frame extends Component {
  static defaultProps = {
    tag: 'div'
  }

  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  componentDidMount() {
    this.context.viewPager.addFrame(findDOMNode(this))
  }

  render() {
    const { tag, ...restProps } = this.props
    return createElement(tag, restProps)
  }
}

export default Frame
