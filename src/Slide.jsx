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
    const { speed, direction, position, outgoing, isCurrent, isOutgoing, currValue, destValue, hasEnded, children } = this.props
    let style = {}

    if (isOutgoing && isOutgoing !== isCurrent) {
      // const percentMoved = 1 - ((destValue - currValue) / destValue)
      // const outgoingPosition = (position + 1)
      // const translate = -(percentMoved * outgoingPosition * 100)

      // speed = (speed - 1) // get 0 based speed
      // const pos = (25 - 0) % 25
      // const pos = (speed - position) / speed
      
      const slideOffset = -((outgoing.length - 1 - position) * 100)
      const translate = (-currValue + ((speed - 1) * 100)) + slideOffset

      style = {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translateX(${(direction === -1 ? -translate : translate)}%)`
      }
    }

    if (isCurrent && !hasEnded) {
      const translate = destValue - currValue
      style.transform = `translateX(${direction === -1 ? -translate : translate}%)`
    }

    return cloneElement(Children.only(children), {style})
  }
}

export default Slide