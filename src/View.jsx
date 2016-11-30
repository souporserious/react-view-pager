import React, { Component, PropTypes, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Pager from './Pager'

class View extends Component {
  static contextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  static childContextTypes = {
    view: PropTypes.any
  }

  static propTypes = {
    tag: PropTypes.any
  }

  static defaultProps = {
    tag: 'div'
  }

  _viewAdded = false
  _viewInstance = null

  getChildContext() {
    return {
      view: this._viewInstance
    }
  }

  componentDidMount() {
    this._viewInstance = this.context.pager.addView(findDOMNode(this))
    this._viewAdded = true
    this.forceUpdate()
  }

  componentWillUnmount() {
    this.context.pager.removeView(this._viewInstance)
  }

  render() {
    const { pager } = this.context
    const { viewsToShow, axis } = pager.options
    const { tag, trackSize, ...restProps } = this.props
    let style = {
      ...this.props.style
    }

    // hide view visually until it has been added to the pager
    // this should help avoid FOUC
    if (!this._viewAdded) {
      style.visibility = 'hidden'
      style.pointerEvents = 'none'
    }

    // we need to position views inline when using the x axis
    if (axis === 'x') {
      style.display = 'inline-block'
      style.verticalAlign = 'top'
    }

    // set width or height on view when viewsToShow is not auto
    if (viewsToShow !== 'auto' && pager.views.length) {
      style[axis === 'x' ? 'width' : 'height'] = 100 / pager.views.length + '%'
    }

    if (this._viewInstance) {
      // make sure view stays in frame when using infinite option
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

    return createElement(tag, { ...restProps, style })
  }
}

export default View
