import React, { Component, Children, PropTypes } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import Pager from './Pager'

class PagerState extends Component {
  static childContextTypes = {
    setTrackPosition: PropTypes.func,
    getTrackPosition: PropTypes.func
  }

  _trackProgress = 0
  _trackPosition = 0

  getChildContext() {
    return {
      setTrackPosition: this._setTrackPosition,
      getTrackPosition: this._getTrackPosition
    }
  }

  _setTrackPosition = (progress, position) => {
    this._trackProgress = progress
    this._trackPosition = position
    this.forceUpdate()
  }

  _getTrackPosition = () => {
    return this._trackPosition
  }

  render() {
    return Children.only(this.props.children({
      progress: this._trackProgress,
      position: this._trackPosition
    }))
  }
}

export default PagerState
