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
    outgoing: [],
    speed: 0
  }

  prev() {
    this.slide(-1)
  }

  next() {
    this.slide(1)
  }

  slide(direction) {
    const outgoing = this.state.outgoing.slice(0)
    const { current, speed } = this.state
    const newIndex = modulo(current + direction, this.props.children.length)
    const outgoingPos = outgoing.indexOf(newIndex)
    
    // if new index exists in outgoing, remove it
    if (outgoingPos > -1) {
      outgoing.splice(outgoingPos, 1)
    }

    // 0 based cycle we're on
    // if (Math.floor(this.slideArrayLength / this.slideCount)) {
    //    
    //    if (this.slideArrayLength % this.slideCount) {
    //    
    //    }
    // }

    this.setState({
      current: newIndex,
      //outgoing: [current].concat(outgoing),
      outgoing: outgoing.concat([current]),
      speed: speed + 1,
      direction
    })
  }

  _handleSlideEnd = () => {
    if (this.state.outgoing) {
      this.setState({outgoing: [], speed: 0})
    }
  }

  render() {
    const { component, children } = this.props
    const { current, outgoing, speed, direction } = this.state
    const destValue = (speed * 100)
    const instant = (speed === 0)

    const childrenToRender = (currValue, destValue, instant) => Children.map(children, (child, i) => {
      const position = outgoing.indexOf(i)
      const isCurrent = (current === i)
      const isOutgoing = (position > -1)

      return (isCurrent || isOutgoing) && createElement(
        Slide,
        {
          position,
          speed,
          direction,
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