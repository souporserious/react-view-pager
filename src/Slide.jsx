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
    const { index, isCurrent, hasEnded } = this.props

    if (isCurrent && lastProps.hasEnded !== hasEnded &&
        hasEnded === true) {
      this.props.onSlideEnd(index)
    }
  }

  render() {
    const { speed, direction, position, outgoing, isCurrent, isOutgoing, currValue, destValue, hasEnded, children } = this.props
    let style = {}

    if (isOutgoing && isOutgoing !== isCurrent) {
      const slideOffset = -((outgoing.length - 1 - position) * 100)
      const translate = (-currValue + ((speed - 1) * 100)) + slideOffset

      style = {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        [TRANSFORM]: `translateX(${(direction === -1 ? -translate : translate)}%)`
      }
    }

    if (isCurrent && !hasEnded) {
      const translate = (destValue - currValue)
      style[TRANSFORM] = `translateX(${direction === -1 ? -translate : translate}%)`
    }

    return cloneElement(Children.only(children), {style})
  }
}

export default Slide