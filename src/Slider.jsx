import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Slide from './Slide'
import getIndexFromKey from './get-index-from-key'

const TRANSFORM = require('get-prefix')('transform')
const ALIGN_TYPES = {
  left: 0,
  center: 0.5,
  right: 1
}

class Slider extends Component {
  static propTypes = {
    vertical: PropTypes.bool,
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    slidesToShow: PropTypes.number,
    slidesToMove: PropTypes.number,
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
    vertical: false,
    slidesToShow: 1,
    slidesToMove: 1,
    autoHeight: false,
    align: 'left',
    swipe: true,
    swipeThreshold: 0.5,
    flickTimeout: 300,
    springConfig: presets.noWobble,
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
    currentIndex: 0,
    swipeOffset: 0,
    instant: false,
    height: 0
  }

  componentDidMount() {
    this._node = ReactDOM.findDOMNode(this)
    this._getSliderDimensions()
  }

  componentWillReceiveProps(nextProps) {
    const { currentIndex } = this.state
    const nextIndex = this._getNextIndex(nextProps)

    this._slideCount = Children.count(nextProps.children)
    this._frameWidth = (100 / this._slideCount)
    this._slideWidth = this._frameWidth / nextProps.slidesToShow
    this._trackWidth = (this._slideCount * 100) / nextProps.slidesToShow

    // don't update state if index hasn't changed and we're not in the middle of a slide
    if (currentIndex !== nextIndex && nextIndex !== null) {
      this.setState({
        currentIndex: Math.max(0, Math.min(nextIndex, this._slideCount - 1))
      }, () => {
        nextProps.beforeSlide(currentIndex, nextIndex)
      })
    }
  }

  componentDidUpdate() {
    if (this.state.instant) {
      this.setState({ instant: false })
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
    let nextIndex

    // get proper next index
    if (this.props.align === 'left') {
      const { slidesToShow } = this.props
      const slidesRemaining = (direction === -1) ? currentIndex : this._slideCount - (currentIndex + slidesToShow)
      const slidesToMove = Math.min(slidesRemaining, this.props.slidesToMove)

      nextIndex = currentIndex + (slidesToMove * direction)
    } else {
      nextIndex = currentIndex + direction
    }

    // keep slides in bounds
    if (nextIndex < 0 || nextIndex > this._slideCount - 1) return

    this.setState({ currentIndex: nextIndex }, () => {
      this.props.beforeSlide(currentIndex, nextIndex)
    })
  }

  _getSliderDimensions() {
    this._sliderWidth = this._node.offsetWidth
    this._sliderHeight = this._node.offsetHeight
  }

  _getNextIndex({ currentIndex, currentKey, children }) {
    if (this.props.currentIndex !== currentIndex) {
      return currentIndex
    } else if (this.props.currentKey !== currentKey) {
      return getIndexFromKey(currentKey, children)
    } else {
      return this.state.currentIndex
    }
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

    const { vertical, swipeThreshold } = this.props
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
        swipeOffset: (axis / dimension) * this.props.slidesToMove
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
    const { currentIndex, swipeOffset } = this.state
    const alignType = ALIGN_TYPES[this.props.align]
    const offsetFactor = (this._frameWidth - this._slideWidth) * alignType
    const alignOffset = (this._frameWidth / this._slideWidth) * offsetFactor

    return (this._frameWidth * (currentIndex + swipeOffset)) - alignOffset
  }

  render() {
    const { children, springConfig, autoHeight } = this.props
    const { currentIndex, instant, height } = this.state
    const destValue = this._getDestValue()

    return (
      <Motion
        style={{
          translate: instant ? destValue : spring(destValue, springConfig),
          wrapperHeight: instant ? height : spring(height, springConfig)
        }}
        onRest={() => this.props.afterSlide(currentIndex)}
      >
        {({ translate, wrapperHeight }) =>
          <div className="slider">
            <div
              className="slider__track"
              style={{
                width: this._trackWidth + '%',
                height: autoHeight && wrapperHeight,
                [TRANSFORM]: `translate3d(${-translate}%, 0, 0)`
              }}
              {...this._getSwipeEvents()}
            >
              {Children.map(children, (child, index) =>
                createElement(Slide, {
                  isCurrent: currentIndex === index,
                  onSlideHeight: this._handleSlideHeight
                }, child)
              )}
            </div>
          </div>
        }
      </Motion>
    )
  }
}

export default Slider
