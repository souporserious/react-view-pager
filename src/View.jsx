import React, { Component, Children, PropTypes, cloneElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Pager from './Pager'

class View extends Component {
  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  state = {
    viewInstance: null
  }

  componentDidMount() {
    this.setState({
      viewInstance: this.context.viewPager.addView(findDOMNode(this))
    })
  }

  render() {
    const { viewsToShow, axis } = this.context.viewPager.options
    const { children, ...restProps } = this.props
    const { viewInstance } = this.state
    const child = Children.only(children)
    const style = { ...child.props.style }

    if (viewsToShow !== 'auto') {
      style[axis === 'x' ? 'width' : 'height'] = this.context.viewPager.frame.getSize() / viewsToShow
    }

    if (viewInstance) {
      style[axis === 'y' ? 'top' : 'left'] = viewInstance.getPosition()
    }

    return cloneElement(child, { ...restProps, style })
  }
}

export default View
