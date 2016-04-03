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
    vertical: PropTypes.bool,
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    slidesToShow: PropTypes.number,
    slidesToMove: PropTypes.number,
    swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number,
    renderSlidesAtRest: PropTypes.bool
  }

  static defaultProps = {
    component: 'div',
    vertical: false,
    slidesToShow: 1,
    slidesToMove: 1,
    swipe: true,
    swipeThreshold: 10,
    flickTimeout: 300,
    renderSlidesAtRest: true
  }

  _slideCount = Children.count(this.props.children)
  _deltaX = false
  _deltaY = false
  _startX = false
  _startY = false
  _isSwiping = false
  _isFlick = false
  _isSliding = false

  state = {
    current: this._getNextIndex(this.props),
    outgoing: [],
    direction: 0,
    speed: 0,
    height: 0,
    sliderWidth: (this._slideCount * 100) / this.props.slidesToShow
  }

  componentWillReceiveProps(nextProps) {
    const { current } = this.state
    const nextIndex = this._getNextIndex(nextProps)

    this._slideCount = Children.count(nextProps.children)

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
    const newIndex = isInteger(index) ? index : modulo(current + direction, this._slideCount)
    const outgoing = [...this.state.outgoing]
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
    return current === 0 || current === this._slideCount - 1
  }

  _isSwipe(threshold) {
    return Math.abs(this._deltaX) > Math.max(threshold, Math.abs(this._deltaY))
  }

  _onSwipeStart = (e) => {
    // get proper event
    const touch = e.touches && e.touches[0] || e

    // we're now swiping
    this._isSwiping = true

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

  _onSwipeMove = (e) =>  {
    // bail if we aren't swiping
    if (!this._isSwiping) return

    const { current, sliderWidth } = this.state
    const touch = e.touches && e.touches[0] || e

    // determine how much we have moved
    this._deltaX = this._startX - touch.pageX
    this._deltaY = this._startY - touch.pageY

    if (this._isSwipe(this.props.swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()
      this.setState({ direction: this._deltaX / sliderWidth })
    }
  }

  _onSwipeEnd = () =>  {
    const threshold = this._isFlick ? this.props.swipeThreshold : (this.state.sliderWidth / 2)

    // handle swipe
    if (this._isSwipe(threshold)) {
      // if an end slide, we still need to set the direction
      if (this._isEndSlide()) {
        this.setState({ direction: 0 })
      }
      (this._deltaX < 0) ? this.prev() : this.next()
    } else {
      this.setState({ direction: 0 })
    }

    // we are no longer swiping
    this._isSwiping = false
  }

  _onSwipePast = () =>  {
    // perform a swipe end if we swiped past the component
    if (this._isSwiping) {
      this._onSwipeEnd()
    }
  }

  _getSwipeEvents() {
    const { swipe } = this.props
    let swipeEvents = {}

    if (swipe === true || swipe === 'mouse') {
      swipeEvents = {
        onMouseDown: this._onSwipeStart,
        onMouseMove: this._onSwipeMove,
        onMouseUp: this._onSwipeEnd,
        onMouseLeave: this._onSwipePast
      }
    }

    if (swipe === true || swipe === 'touch') {
      swipeEvents = {
        ...swipeEvents,
        onTouchStart: this._onSwipeStart,
        onTouchMove: this._onSwipeMove,
        onTouchEnd: this._onSwipeEnd
      }
    }

    return swipeEvents
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
            axis: vertical ? 'Y' : 'X',
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
    const { component, children } = this.props
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
          ...this._getSwipeEvents()
        },
        this._childrenToRender(currValue, destValue, instant)
      )
    )
  }
}

export default Slider
