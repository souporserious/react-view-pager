import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'

class Slide extends Component {
  componentDidMount() {
    this._node = ReactDOM.findDOMNode(this)
    this._getDimensions()

    if (this.props.isCurrent) {
      this._onHeightChange()
    }
  }

  componentDidUpdate(lastProps) {
    const { isCurrent } = this.props
    if (lastProps.isCurrent !== isCurrent &&
        isCurrent === true) {
      this._onHeightChange()
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
    const { children, style } = this.props
    return cloneElement(Children.only(children), { style })
  }
}

export default Slide
