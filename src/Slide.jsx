import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'

const TRANSFORM = require('get-prefix')('transform')

class Slide extends Component {
  _lastHeight = null

  componentDidMount() {
    this._node = ReactDOM.findDOMNode(this)
    this._getDimensions()
    this._onHeightChange()
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.instant
  }

  componentDidUpdate(lastProps) {
    const { index, isCurrent, isSliding } = this.props

    if (lastProps.isCurrent !== isCurrent &&
        isCurrent === true) {
      this._onHeightChange()
    }

    if (isCurrent && lastProps.isSliding !== isSliding &&
        isSliding === false) {
      this.props.onSlideEnd(index)
    }
  }

  _getDimensions() {
    this._width = this._node.offsetWidth
    this._height = this._node.offsetHeight
  }

  _onHeightChange() {
    this.props.onSlideHeight(this._height)
  }

  render() {
    const { speed, direction, vertical, position, outgoing, isCurrent, isOutgoing, isSliding, currValue, destValue, children } = this.props
    const axis = vertical ? 'Y' : 'X'
    let style = {}

    if (isOutgoing && isOutgoing !== isCurrent) {
      const slideOffset = -((outgoing.length - 1 - position) * 100)
      const translate = (-currValue + ((speed - 1) * 100)) + slideOffset

      style = {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        [TRANSFORM]: `translate${axis}(${(direction === -1 ? -translate : translate)}%)`
      }
    }

    if (isCurrent && isSliding) {
      const translate = (destValue - currValue)
      style[TRANSFORM] = `translate${axis}(${direction === -1 ? -translate : translate}%)`
    }

    return cloneElement(Children.only(children), { style })
  }
}

export default Slide
