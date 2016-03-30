import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import isInteger from 'is-integer'
import Slide from './Slide'
import getIndexFromKey from './get-index-from-key'
import modulo from './modulo'

class Slider extends Component {
  static propTypes = {
    component: PropTypes.string,
    draggable: PropTypes.bool,
    vertical: PropTypes.bool,
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number,
    renderSlidesAtRest: PropTypes.bool
  }

  static defaultProps = {
    component: 'div',
    draggable: false,
    vertical: false,
    swipeThreshold: 10,
    flickTimeout: 300,
    renderSlidesAtRest: true
  }

  state = {
    current: this._getNextIndex(this.props),
    outgoing: [],
    speed: 0,
    height: 0
  }

  _deltaX = false
  _deltaY = false
  _startX = false
  _startY = false
  _isSliding = false
  _isDragging = false
  _isSwiping = false
  _isFlick = false

  componentWillReceiveProps(nextProps) {
    const { current } = this.state
    const nextIndex = this._getNextIndex(nextProps)

    // don't update state if index hasn't changed and we're not in the middle of a slide
    if (current !== nextIndex && nextIndex !== null) {
      const direction = (current > nextIndex) ? -1 : 1
      this.slide(direction, nextIndex)
    }
  }

  prev() {
    this.slide(-1)
  }

  next() {
    this.slide(1)
  }

  slide(direction, index) {
    const { current, speed } = this.state
    const newIndex = isInteger(index) ? index : modulo(current + direction, this.props.children.length)
    const outgoing = this.state.outgoing.slice(0)
    const outgoingPos = outgoing.indexOf(newIndex)

    // if new index exists in outgoing, remove it
    if (outgoingPos > -1) {
      outgoing.splice(outgoingPos, 1)
    }

    this.setState({
      current: newIndex,
      outgoing: outgoing.concat([current]),
      speed: speed + 1,
      direction,
      isSliding: true
    })
  }

  _getNextIndex({ currentIndex, currentKey, children }) {
    return (
      currentKey
      ? getIndexFromKey(currentKey, children)
      : (currentIndex || 0)
    )
  }

  _handleSlideEnd = () => {
    if (this.state.outgoing.length > 0) {
      this.setState({ outgoing: [], speed: 0 })
    }
  }

  _handleSlideHeight = (height) => {
    this.setState({ height })
  }

  _isEndSlide() {
    const { current } = this.state
    return current === 0 || current === this.props.children.length - 1
  }

  _isSwipe(threshold) {
    return Math.abs(this._deltaX) > Math.max(threshold, Math.abs(this._deltaY))
  }

  _onDragStart = (e) => {
    // get proper event
    const touch = e.touches && e.touches[0] || e

    // we're now dragging
    this._isDragging = true

    // reset deltas
    this._deltaX = this._deltaY = 0

    // store the initial starting coordinates
    this._startX = touch.pageX
    this._startY = touch.pageY

    // determine if a flick or not
    this._isFlick = true

    setTimeout(() => {
      this._isFlick = false
    }, this.props.flickTimeout)
  }

  _onDragMove = (e) =>  {
    // if we aren't dragging bail
    if (!this._isDragging) return

    const touch = e.touches && e.touches[0] || e
    const threshold = 50

    // determine how much we have moved
    this._deltaX = this._startX - touch.pageX
    this._deltaY = this._startY - touch.pageY

    if (this._isSwipe(this.props.swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()
      this._isSwiping = true
    }

    if (this._isSwiping) {
      this.slide(this._deltaX / 100)
    }
  }

  _dragEnd = () =>  {
    const threshold = this._isFlick ? this.props.swipeThreshold : 50

    // handle swipe
    if (this._isSwipe(threshold)) {
      // if an end slide, we still need to set the direction
      if(this._isEndSlide()) {
        this.slide(0)
      }
      (this._deltaX < 0) ? this.prev() : this.next()
    } else {
      this.slide(0)
    }

    // we are no longer swiping or dragging
    this._isSwiping = this._isDragging = false
  }

  _dragPast = () =>  {
    // perform a dragend if we dragged past component
    if (this._isDragging) {
      this._dragEnd()
    }
  }

  _getTouchEvents() {
    return this.props.draggable && {
      onMouseDown: this._onDragStart,
      onMouseMove: this._onDragMove,
      onMouseUp: this._onDragEnd,
      onMouseLeave: this._onDragPast,
      onTouchStart: this._onDragStart,
      onTouchMove: this._onDragMove,
      onTouchEnd: this._onDragEnd
    }
  }

  _childrenToRender(currValue, destValue, instant) {
    const { children, vertical } = this.props
    const { current, outgoing, speed, direction, isSliding } = this.state

    return (
      Children.map(children, (child, index) => {
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
            isSliding,
            onSlideEnd: this._handleSlideEnd,
            onSlideHeight: this._handleSlideHeight
          },
          child
        )
      })
    )
  }

  render() {
    const { component } = this.props
    const { speed, height } = this.state
    const destValue = (speed * 100)
    const instant = (speed === 0)

    return createElement(
      Motion,
      {
        style: {
          currValue: instant ? destValue : spring(destValue),
          wrapperHeight: instant ? height : spring(height)
        },
        onRest: () => this.setState({ isSliding: false })
      },
      ({ currValue, wrapperHeight }) => createElement(
        component,
        {
          className: 'slider',
          style: {
            height: wrapperHeight
          },
          ...this._getTouchEvents()
        },
        this._childrenToRender(currValue, destValue, instant)
      )
    )
  }
}

export default Slider
