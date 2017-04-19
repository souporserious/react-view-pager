import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
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
      ...restProps.style
    }

    // hide view visually until it has been added to the pager
    // this should help avoid FOUC
    if (!this._viewAdded) {
      style.visibility = 'hidden'
      style.pointerEvents = 'none'
    }

    if (this._viewInstance) {
      style = {
        ...style,
        ...this._viewInstance.getStyles()
      }
    }

    return createElement(tag, { ...restProps, style })
  }
}

export default View
