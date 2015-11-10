import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import { StaggeredMotion, spring, presets } from 'react-motion'

const TRANSFORM = require('get-prefix')('transform')

class Slide extends Component {
  _firstPass = true
  _lastHeight = null

  componentDidMount() {
    this._getHeight(this.props.currIndex)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return shallowCompare(this, nextProps, nextState)
  // }

  componentDidUpdate() {
    this._firstPass = false
    this._getHeight(this.props.nextIndex)
  }

  _getHeight(nextIndex) {
    const { index } = this.props
    const height = this._slide.scrollHeight
    
    if (index === nextIndex && height !== this._lastHeight) {
      this.props.onGetHeight(height)
    }

    this._lastHeight = height
  }

  _getEndValues = (prevValue) => {
    const { nextIndex, isSliding, slideConfig } = this.props
    const config = isSliding ? slideConfig : []
    let endValue = isSliding ? 100 : 0

    if (prevValue &&
        (prevValue[0].endValue).toFixed(2) === (endValue).toFixed(2) &&
        isSliding) {
      // reset x value so we don't immediately hit onSlideEnd again
      endValue = 0

      // fire callback to Slider
      this.props.onSlideEnd(nextIndex)
    }

    return [{endValue: spring(endValue, slideConfig)}]
  }

  _getStyles(endValue) {
    const { index, currIndex, nextIndex, direction, isSliding, vertical } = this.props
    let style = {
      width: '100%',
      position: null,
      top: 0,
      left: 0
    }
    
    // only apply styles to slides that need to move
    if (currIndex === index || nextIndex === index) {
      let translate = (direction === 'prev') ? endValue : -endValue

      if (nextIndex === index) {
        style.position = 'absolute'

        if(direction === 'prev') {
          translate -= 100
        } else {
          translate += 100
        }
      }

      // don't apply any styles if we aren't sliding
      if (!isSliding) {
        style = {}
      } else {
        let translateAxis = `translate3d(${translate}%, 0, 0)`

        if (vertical) {
          translateAxis = `translate3d(0, ${translate}%, 0)`
        }
        style[TRANSFORM] = translateAxis
      }
    } else {
      // don't set outside slides to "display: none" on first pass, this allows
      // proper DOM calculation for height to be achieved
      if (this._firstPass) {
        style = {
          width: '100%',
          height: 0,
          overflow: 'hidden'
        }
      } else {
        style = { display: 'none' }
      }
    }

    return style
  }

  render() {
    const child = Children.only(this.props.children)

    return createElement(
      StaggeredMotion,
      {
        styles: this._getEndValues
      },
      ([{endValue}]) => {
        return cloneElement(child, {
          ref: c => this._slide = ReactDOM.findDOMNode(c),
          style: this._getStyles(endValue)
        })
      }
    )
  }
}

export default Slide