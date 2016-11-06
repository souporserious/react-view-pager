import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'

class ViewComponent extends Component {
  componentDidMount() {
    this.props.onMount(findDOMNode(this))
  }

  render() {
    const { view, viewsToShow, axis, children } = this.props
    const child = Children.only(children)
    const style = { ...child.props.style }

    if (viewsToShow) {
      style[axis === 'x' ? 'width' : 'height'] = (100 / viewsToShow) + '%'
    }

    if (view.top) {
      style['top'] = view.top.offset.percent + '%'
    }

    if (view.left) {
      style['left'] = view.left.offset.percent + '%'
    }

    return cloneElement(child, { style })
  }
}

export default ViewComponent
