import React, { Component, Children, PropTypes, cloneElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Pager from './Pager'

class View extends Component {
  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  componentDidMount() {
    this._viewInstance = this.context.viewPager.addView(findDOMNode(this))
    this.forceUpdate()
  }

  componentWillUnmount() {
    this.context.viewPager.removeView(this._viewInstance)
  }

  render() {
    const { viewPager } = this.context
    const { viewsToShow, axis } = viewPager.options
    const { children, ...restProps } = this.props
    const child = Children.only(children)
    const style = { ...child.props.style }

    if (viewsToShow !== 'auto') {
      style[axis === 'x' ? 'width' : 'height'] = (100 / viewsToShow) + '%'
    }

    if (this._viewInstance) {
      style[axis === 'y' ? 'top' : 'left'] = this._viewInstance.getPosition()
    }

    return cloneElement(child, { ...restProps, style })
  }
}

export default View
