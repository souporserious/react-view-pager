import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Slide from './Slide'
import getIndexFromKey from './get-index-from-key'
import getKeyfromIndex from './get-key-from-index'
import getSlideRange from './get-slide-range'
import modulo from './modulo'

const TRANSFORM = require('get-prefix')('transform')
const ALIGN_TYPES = {
  left: 0,
  center: 0.5,
  right: 1
}

class Slider extends Component {
  static propTypes = {
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    slidesToShow: PropTypes.number,
    slidesToMove: PropTypes.number,
    infinite: PropTypes.bool,
    vertical: PropTypes.bool,
    autoHeight: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number,
    springConfig: React.PropTypes.objectOf(React.PropTypes.number),
    beforeSlide: PropTypes.func,
    afterSlide: PropTypes.func
  }

  static defaultProps = {
    currentKey: null,
    currentIndex: 0,
    slidesToShow: 1,
    slidesToMove: 1,
    infinite: false,
    vertical: false,
    autoHeight: false,
    align: 'left',
    swipe: true,
    swipeThreshold: 0.5,
    flickTimeout: 300,
    springConfig: presets.noWobble,
    onChange: () => null,
    beforeSlide: () => null,
    afterSlide: () => null
  }

  _node = null
  _sliderWidth = 0
  _slideCount = Children.count(this.props.children)
  _frameWidth = 100 / this._slideCount
  _slideWidth = this._frameWidth / this.props.slidesToShow
  _trackWidth = this._slideCount / this.props.slidesToShow * 100
  _deltaX = false
  _deltaY = false
  _startX = false
  _startY = false
  _isSwiping = false
  _isFlick = false

  state = {
    currentIndex: this.props.currentIndex,
    currentKey: this.props.currentKey,
    swipeOffset: 0,
    instant: false,
    wrapping: false,
    height: 0
  }

  componentWillMount() {
    const { currentKey, currentIndex, children } = this.props
    let nextIndex = null

    if (currentKey) {
      nextIndex = getIndexFromKey(currentKey, children)
    } else if (currentIndex) {
      nextIndex = currentIndex
    }

    if (nextIndex) {
      const clampedIndex = Math.max(0, Math.min(nextIndex, this._slideCount - 1))

      this.setState({
        currentIndex: clampedIndex,
        currentKey: getKeyfromIndex(clampedIndex, children),
        instant: true
      })
    }
  }

  componentDidMount() {
    this._node = ReactDOM.findDOMNode(this)
    this._getSliderDimensions()
    this._onChange(this.state.currentIndex, this.props.slidesToShow)
  }

  componentWillReceiveProps({ currentKey, currentIndex, slidesToShow, children }) {
    this._slideCount = Children.count(children)
    this._frameWidth = (100 / this._slideCount)
    this._slideWidth = this._frameWidth / slidesToShow
    this._trackWidth = (this._slideCount * 100) / slidesToShow

    const newKey = (this.props.currentKey !== currentKey && this.state.currentKey !== currentKey)
    const newIndex = (this.props.currentIndex !== currentIndex && this.state.currentIndex !== currentIndex)

    if (newKey || newIndex) {
      let nextIndex = null

      if (newKey) {
        nextIndex = getIndexFromKey(currentKey, children)
      } else if (newIndex) {
        nextIndex = currentIndex
      }

      const clampedIndex = Math.max(0, Math.min(nextIndex, this._slideCount - 1))

      this._beforeSlide(this.state.currentIndex, clampedIndex)

      this.setState({
        currentIndex: clampedIndex,
        currentKey: getKeyfromIndex(clampedIndex, children)
      }, () => {
        this._onChange(clampedIndex, slidesToShow)
      })
    } else if (this.props.slidesToShow !== slidesToShow) {
      this._onChange(this.state.currentIndex, slidesToShow)
    }
  }

  componentDidUpdate() {
    const { instant, wrapping } = this.state
    if (instant || wrapping) {
      this._onSlideEnd()
    }
  }

  prev() {
    this.slide(-1)
  }

  next() {
    this.slide(1)
  }

  slide(direction) {
    const { currentIndex } = this.state
    const childrenArray = Children.toArray(this.props.children)
    const newState = {}
    let nextIndex = currentIndex

    // when align type is left we make sure to only move the amount of slides that are available
    if (this.props.align === 'left') {
      nextIndex += this._getSlidesToMove(currentIndex, direction)
    } else {
      nextIndex += direction
    }

    // determine if we need to wrap the index or bail out and keep it in bounds
    if (this.props.infinite) {
      nextIndex = modulo(nextIndex, this._slideCount)

      if ((currentIndex === this._slideCount - 1 && nextIndex === 0) ||
          (currentIndex === 0 && nextIndex === this._slideCount - 1)) {
        newState.wrapping = true
        newState.instant = true
      } else {
        newState.wrapping = false
      }
    } else if (!childrenArray[nextIndex]) {
      return
    }

    newState.currentIndex = nextIndex
    newState.currentKey = getKeyfromIndex(nextIndex, this.props.children)

    this._beforeSlide(currentIndex, nextIndex)

    this.setState(newState, () => {
      this._onChange(nextIndex, this.props.slidesToShow)
    })
  }

  _getSliderDimensions() {
    this._sliderWidth = this._node.offsetWidth
    this._sliderHeight = this._node.offsetHeight
  }

  _getSlidesToMove(index, direction) {
    const { slidesToShow, slidesToMove } = this.props
    const slidesRemaining = (direction === 1)
      ? this._slideCount - (index + slidesToShow)
      : index

    return Math.min(slidesRemaining, slidesToMove) * direction
  }

  _onChange(index, slidesToShow) {
    const currentIndexes = getSlideRange(index, index + slidesToShow)
    this.props.onChange(currentIndexes, this.state.currentKey)
  }

  _beforeSlide = (currentIndex, nextIndex) => {
    const { beforeSlide, slidesToShow } = this.props

    beforeSlide(
      getSlideRange(currentIndex, currentIndex + slidesToShow),
      getSlideRange(nextIndex, nextIndex + slidesToShow)
    )

    this._isSliding = true
    this.forceUpdate()
  }

  _afterSlide = () => {
    const { afterSlide, slidesToShow } = this.props
    const { currentIndex } = this.state

    afterSlide(
      getSlideRange(currentIndex, currentIndex + slidesToShow)
    )

    this._isSliding = false
    this.forceUpdate()
  }

  _isSwipe(threshold) {
    let x = this._deltaX
    let y = this._deltaY

    if (this.props.vertical) {
      [y, x] = [x, y]
    }

    return Math.abs(x) > Math.max(threshold, Math.abs(y))
  }

  _onSwipeStart = (e) => {
    const swipe = e.touches && e.touches[0] || e

    // we're now swiping
    this._isSwiping = true

    // reset deltas
    this._deltaX = this._deltaY = 0

    // store the initial starting coordinates
    this._startX = swipe.pageX
    this._startY = swipe.pageY

    // determine if a flick or not
    this._isFlick = true

    setTimeout(() => {
      this._isFlick = false
    }, this.props.flickTimeout)
  }

  _onSwipeMove = (e) =>  {
    // bail if we aren't swiping
    if (!this._isSwiping) return

    const { vertical, swipeThreshold, slidesToMove } = this.props
    const swipe = e.touches && e.touches[0] || e

    // determine how much we have moved
    this._deltaX = this._startX - swipe.pageX
    this._deltaY = this._startY - swipe.pageY

    if (this._isSwipe(swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()

      const axis = vertical ? this._deltaY : this._deltaX
      const dimension = vertical ? this.sliderHeight : this._sliderWidth

      this.setState({
        swipeOffset: (axis / dimension) * slidesToMove
      })
    }
  }

  _onSwipeEnd = () =>  {
    const { swipeThreshold } = this.props
    const threshold = this._isFlick ? swipeThreshold : (this._sliderWidth * swipeThreshold)

    this.setState({ swipeOffset: 0 }, () => {
      if (this._isSwipe(threshold)) {
        (this._deltaX < 0) ? this.prev() : this.next()
      }
    })

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

  _handleSlideHeight = (height) => {
    this.setState({ height })
  }

  _getDestValue() {
    const { currentIndex, wrapping, swipeOffset } = this.state
    const alignType = ALIGN_TYPES[this.props.align]
    const offsetFactor = (this._frameWidth - this._slideWidth) * alignType
    const alignOffset = (this._frameWidth / this._slideWidth) * offsetFactor
    let destValue = (this._frameWidth * (currentIndex + swipeOffset)) - alignOffset

    if (wrapping) {
      if (currentIndex === 0) {
        destValue -= this._frameWidth
      }
      if (currentIndex === this._slideCount - 1) {
        destValue += this._frameWidth
      }
    }

    return destValue * -1
  }

  _onSlideEnd = () => {
    this.setState({
      instant: false,
      wrapping: false
    })
    this._isSliding = false
  }

  _getSliderClassNames() {
    const { swipe } = this.props
    const modifiers = []
    let sliderClassName = 'slider'

    if (this._isSliding) {
      modifiers.push('is-sliding')
    }

    if (swipe) {
      modifiers.push('is-swipeable')
    }

    if (this._isSwiping) {
      modifiers.push('is-swiping')
    }

    sliderClassName += modifiers.map(modifier => ` ${sliderClassName}--${modifier}`).join('')

    return sliderClassName
  }

  render() {
    const { children, springConfig, autoHeight, infinite } = this.props
    const { currentIndex, lastIndex, instant, height } = this.state
    const destValue = this._getDestValue()

    return (
      <Motion
        style={{
          translate: instant ? destValue : spring(destValue, springConfig),
          wrapperHeight: instant ? height : spring(height, springConfig)
        }}
        onRest={this._afterSlide}
      >
        {({ translate, wrapperHeight }) => {
          this._currentTween = translate
          return (
            <div className={this._getSliderClassNames()}>
              <div
                className="slider__track"
                style={{
                  width: this._trackWidth + '%',
                  height: autoHeight && wrapperHeight,
                  [TRANSFORM]: `translate3d(${translate}%, 0, 0)`
                }}
                {...this._getSwipeEvents()}
              >
                {Children.map(children, (child, index) => {
                  let style = {
                    width: this._slideWidth + '%'
                  }

                  if (infinite) {
                    if (currentIndex === 0 && index === this._slideCount - 1) {
                      style = {
                        ...style,
                        position: 'relative',
                        left: '-100%'
                      }
                    }

                    if (currentIndex === this._slideCount - 1 && index === 0) {
                      style = {
                        ...style,
                        position: 'relative',
                        right: '-100%'
                      }
                    }
                  }

                  return (
                    createElement(Slide, {
                      style,
                      isCurrent: currentIndex === index,
                      onSlideHeight: this._handleSlideHeight
                    }, child)
                  )
                })}
              </div>
            </div>
          )
        }}
      </Motion>
    )
  }
}

export default Slider
