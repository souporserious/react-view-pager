import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Slide from './Slide'
import modulo from './modulo'

// touch / swipe
// http://codepen.io/barTsoury/post/optimization-of-swipe-gesture-on-list-items
// https://github.com/kenwheeler/nuka-carousel/blob/master/src/carousel.js#L162

class Slider extends Component {
  static defaultProps = {
    component: 'div'
  }

  state = {
    current: 0,
    outgoing: null,
    speed: 0
  }

  prev() {
    this.slide('prev')
  }

  next() {
    this.slide('next')
  }

  slide(direction) {
    // convert direction into a number
    direction = (direction === 'prev') ? -1 : 1

    //const outgoing = this.state.outgoing.slice(0)
    const { current, speed } = this.state
    const newIndex = modulo(current + direction, this.props.children.length)
    //const outgoingPos = outgoing.indexOf(newIndex)
    
    // if new index exists in outgoing, remove it
    // if (outgoingPos > -1) {
    //   outgoing.splice(outgoingPos, 1)
    // }

    this.setState({
      current: newIndex,
      outgoing: current,
      speed: speed + 1
    })
  }

  _handleSlideEnd(index) {
    if (this.state.outgoing) {
      this.setState({outgoing: null, speed: 0})
    }
  }

  render() {
    const { component, children } = this.props
    const { current, outgoing, speed } = this.state
    const destValue = (speed * 100)
    const instant = (speed === 0)

    const childrenToRender = (currValue, destValue, instant) => Children.map(children, (child, i) => {
      const position = null
      const isCurrent = (current === i)
      const isOutgoing = (outgoing === i)

      return (isCurrent || isOutgoing) && createElement(
        Slide,
        {
          position,
          speed,
          isCurrent,
          isOutgoing,
          currValue,
          destValue,
          instant,
          hasEnded: (currValue === destValue),
          onSlideEnd: this._handleSlideEnd.bind(this, i)
        },
        child
      )
    })

    return createElement(
      Motion,
      {
        style: {
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