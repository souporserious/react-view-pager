import React, { Component, Children, PropTypes, cloneElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Pager from './Pager'

class View extends Component {
  static contextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  static childContextTypes = {
    view: PropTypes.any
  }

  _viewInstance = null

  getChildContext() {
    return {
      view: this._viewInstance
    }
  }

  componentDidMount() {
    this._viewInstance = this.context.pager.addView(findDOMNode(this))
    this.forceUpdate()
  }

  componentWillUnmount() {
    this.context.pager.removeView(this._viewInstance)
  }

  render() {
    const { pager } = this.context
    const { viewsToShow, axis } = pager.options
    const { children, ...restProps } = this.props
    const child = Children.only(children)
    let style = {
      ...child.props.style,
      position: 'relative',
      top: 0,
      left: 0
    }

    // set width or height on view when viewsToShow is not auto
    if (viewsToShow !== 'auto') {
      style[axis === 'x' ? 'width' : 'height'] = (100 / viewsToShow) + '%'
    }

    if (this._viewInstance) {
      // absolute position non-current views
      if (!this._viewInstance.isCurrent) {
        style.position = 'absolute'
      }

      // apply top or left value and any animations defined in props
      const edge = (axis === 'y') ? 'top' : 'left'

      style = {
        ...style,
        [edge]: this._viewInstance.getPosition(),
        ...pager.animationBus.getStyles(this._viewInstance)
      }
    }

    return cloneElement(child, { ...restProps, style })
  }
}

export default View
