import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Pager from './Pager'

class View extends Component {
  static defaultProps = {
    tag: 'div'
  }

  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  componentDidMount() {
    this.context.viewPager.addView(findDOMNode(this))
  }

  render() {
    const { tag, view, viewsToShow, axis, index, ...restProps } = this.props
    const style = { ...this.props.style }
console.log(this.context.viewPager.views)
    // if (viewsToShow) {
    //   style[axis === 'x' ? 'width' : 'height'] = (100 / viewsToShow) + '%'
    // }
    //
    // if (view.top) {
    //   style['top'] = view.top.offset.percent + '%'
    // }
    //
    // if (view.left) {
    //   style['left'] = view.left.offset.percent + '%'
    // }

    return createElement(tag, restProps)
  }
}

export default View
