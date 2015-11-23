import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import { StaggeredMotion, spring, presets } from 'react-motion'
import getDifference from './get-difference'

const TRANSFORM = require('get-prefix')('transform')

class Slide extends Component {
  shouldComponentUpdate(nextProps) {
    return !nextProps.instant
  }

  componentDidUpdate(lastProps) {
    const { isCurrent, hasEnded } = this.props

    if (lastProps.hasEnded !== hasEnded && hasEnded === true) {
      this.props.onSlideEnd()
    }
  }

  render() {
    const { speed, position, isCurrent, isOutgoing, currValue, destValue, hasEnded, children } = this.props
    let style = {}

    if (isOutgoing && isOutgoing !== isCurrent) {
      //let current = ((destValue - currValue) / destValue) * 100

      style = {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translateX(${-currValue + ((speed - 1) * 100)}%)`
      }
    }

    if (isCurrent && !hasEnded) {
      style.transform = `translateX(${destValue - currValue}%)`
    }

    return cloneElement(Children.only(children), {style})
  }
}

export default Slide