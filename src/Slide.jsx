import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import { StaggeredMotion, spring, presets } from 'react-motion'

const TRANSFORM = require('get-prefix')('transform')

class Slide extends Component {
  _firstPass = true
  _lastHeight = null

  componentDidMount() {
    this._node = React.findDOMNode(this)
    this._getHeight(this.props.currIndex)
  }

  componentDidUpdate() {
    this._firstPass = false
    this._getHeight(this.props.nextIndex)
  }

  _getHeight(nextIndex) {
    const { index } = this.props
    const height = this._node.scrollHeight
    
    if(index === nextIndex && height !== this._lastHeight) {
      this.props.onGetHeight(height)
    }

    this._lastHeight = height
  }

  _getEndValues = (prevValue) => {
    const { nextIndex, isSliding, slideConfig } = this.props
    const config = isSliding ? slideConfig : []
    let x = isSliding ? 100 : 0

    if(prevValue && prevValue[0].x === x && isSliding) {
      // reset x value so we don't immediately hit onSlideEnd again
      x = 0

      // fire callback to Slider
      this.props.onSlideEnd(nextIndex)
    }

    return [{x: spring(x, slideConfig)}]
  }

  _getStyles(x) {
    const { index, currIndex, nextIndex, direction, isSliding } = this.props
    let style = {
      width: '100%',
      position: null,
      top: 0,
      left: 0
    }
    
    // only apply styles to slides that need to move
    if(currIndex === index || nextIndex === index) {
      let translateX = (direction === 'prev') ? x : -x

      if(nextIndex === index) {
        style.position = 'absolute'

        if(direction === 'prev') {
          translateX -= 100
        } else {
          translateX += 100
        }
      }

      // don't apply any styles if we aren't sliding
      if(!isSliding) {
        style = {}
      } else {
        style[TRANSFORM] = `translate3d(${translateX}%, 0, 0)`
      }
    } else {
      // don't set outside slides to "display: none" on first pass, this allows
      // proper DOM calculation for height to be achieved
      if(this._firstPass) {
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
      (values) => {
        return cloneElement(child, {
          style: this._getStyles(values[0].x)
        })
      }
    )
  }
}

export default Slide