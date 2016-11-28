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
    const { trackSize, children, ...restProps } = this.props
    const child = Children.only(children)
    let style = {
      ...child.props.style
    }

    // we need to position views inline when using the x axis
    if (axis === 'x') {
      style.display = 'inline-block'
    }

    // set width or height on view when viewsToShow is not auto
    if (viewsToShow !== 'auto' && pager.views.length) {
      style[axis === 'x' ? 'width' : 'height'] = 100 / pager.views.length + '%'
    }

    if (this._viewInstance) {
      // make sure view stays in frame
      if (pager.options.infinite && !this._viewInstance.inBounds) {
        style.position = 'relative'
        style[(axis === 'y') ? 'top' : 'left'] = this._viewInstance.getPosition()
      }

      // apply any animations
      style = {
        ...style,
        ...pager.animationBus.getStyles(this._viewInstance)
      }
    }

    return cloneElement(child, { ...restProps, style })
  }
}

export default View
