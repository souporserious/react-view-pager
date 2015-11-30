import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import isInteger from 'is-integer'
import Slide from './Slide'
import getIndexFromKey from './get-index-from-key'
import modulo from './modulo'

// touch / swipe
// http://codepen.io/barTsoury/post/optimization-of-swipe-gesture-on-list-items
// https://github.com/kenwheeler/nuka-carousel/blob/master/src/carousel.js#L162

class Slider extends Component {
  static propTypes = {
    component: PropTypes.string,
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    vertical: PropTypes.bool
  }

  static defaultProps = {
    component: 'div',
    vertical: false
  }

  state = {
    current: this._getNextIndex(this.props),
    outgoing: [],
    speed: 0
  }

  componentWillReceiveProps(nextProps) {
    const { current } = this.state
    const nextIndex = this._getNextIndex(nextProps)

    // don't update state if index hasn't changed and we're not in the middle of a slide
    if (current !== nextIndex && nextIndex !== null) {
      this.slide((current > nextIndex) ? -1 : 1, nextIndex)
    }
  }

  prev() {
    this.slide(-1)
  }

  next() {
    this.slide(1)
  }

  slide(direction, index) {
    const outgoing = this.state.outgoing.slice(0)
    const { current, speed } = this.state
    const newIndex = isInteger(index) ? index : modulo(current + direction, this.props.children.length)
    const outgoingPos = outgoing.indexOf(newIndex)
    
    // if new index exists in outgoing, remove it
    if (outgoingPos > -1) {
      outgoing.splice(outgoingPos, 1)
    }

    this.setState({
      current: newIndex,
      outgoing: outgoing.concat([current]),
      speed: speed + 1,
      direction
    })
  }

  _getNextIndex({currentIndex, currentKey, children}) {
    return (
      currentKey ?
      getIndexFromKey(currentKey, children) :
      (currentIndex || 0)
    )
  }

  _handleSlideEnd = () => {
    if (this.state.outgoing.length > 0) {
      this.setState({outgoing: [], speed: 0})
    }
  }

  render() {
    const { component, children, vertical } = this.props
    const { current, outgoing, speed, direction } = this.state
    const destValue = (speed * 100)
    const instant = (speed === 0)

    const childrenToRender = (currValue, destValue, instant) => Children.map(children, (child, index) => {
      const position = outgoing.indexOf(index)
      const isCurrent = (current === index)
      const isOutgoing = (position > -1)

      return (isCurrent || isOutgoing) && createElement(
        Slide,
        {
          position,
          speed,
          direction,
          vertical,
          outgoing,
          isCurrent,
          isOutgoing,
          currValue,
          destValue,
          instant,
          hasEnded: (currValue === destValue),
          onSlideEnd: this._handleSlideEnd
        },
        child
      )
    })

    return createElement(
      Motion,
      {
        style: {
          //currValue: instant ? destValue : spring(destValue, [9, 5])
          currValue: instant ? destValue : spring(destValue)
        }
      },
      ({currValue}) => createElement(
        component,
        {
          className: 'slider'
        },
        childrenToRender(currValue, destValue, instant)
      )
    )
  }
}

export default Slider