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
    instant: PropTypes.bool,
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
    instant: false,
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

  constructor(props) {
    super(props)
    
    this._node = null
    this._sliderWidth = 0
    this._slideCount = Children.count(props.children)
    this._frameWidth = 100 / this._slideCount
    this._slideWidth = this._frameWidth / props.slidesToShow
    this._trackWidth = this._slideCount / props.slidesToShow * 100
    this._deltaX = false
    this._deltaY = false
    this._startX = false
    this._startY = false
    this._isSwiping = false
    this._isFlick = false

    this.state = {
      currentIndex: props.currentIndex,
      currentKey: props.currentKey,
      swipeOffset: 0,
      instant: false,
      wrapping: false,
      height: 0
    }
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

  componentWillReceiveProps({ currentKey, currentIndex, slidesToShow, align, children }) {
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

      // "contain" the slides if left aligned
      if (align === 'left' && nextIndex !== this.state.currentIndex) {
        // const direction = nextIndex > this.state.currentIndex ? 1 : -1
        // nextIndex += this._getSlidesToMove(nextIndex, direction)
      // if not containing, make sure index stays within bounds
      } else {
        nextIndex = Math.max(0, Math.min(nextIndex, this._slideCount - 1))
      }

      this._beforeSlide(this.state.currentIndex, nextIndex)

      this.setState({
        currentIndex: nextIndex,
        currentKey: getKeyfromIndex(nextIndex, children)
      }, () => {
        this._onChange(nextIndex, slidesToShow)
      })
    // if slidesToShow has changed we need to fire an onChange with the updated indexes
    } else if (this.props.slidesToShow !== slidesToShow) {
      this._onChange(this.state.currentIndex, slidesToShow)
    }

    // if we are receiving new slides we need to animate to the new position instantly
    if (Children.count(this.props.children) !== Children.count(children)) {
      this.setState({ instant: true })
    }
  }

  componentDidUpdate() {
    const { swipeOffset, instant, wrapping } = this.state
    if (swipeOffset === 0 && (instant || wrapping)) {
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

    // determine if we need to wrap the index
    if (this.props.infinite) {
      nextIndex = modulo(nextIndex, this._slideCount)

      if ((currentIndex === this._slideCount - 1 && nextIndex === 0) ||
          (currentIndex === 0 && nextIndex === this._slideCount - 1)) {
        newState.wrapping = true
        newState.instant = true
      } else {
        newState.wrapping = false
      }
    // bail out if index does not exist
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
        swipeOffset: (axis / dimension) * slidesToMove,
        instant: true
      })
    }
  }

  _onSwipeEnd = () =>  {
    const { swipeThreshold } = this.props
    const threshold = this._isFlick ? swipeThreshold : (this._sliderWidth * swipeThreshold)

    this.setState({
      swipeOffset: 0,
      instant: false
    }, () => {
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

  _setSlideHeight = (height) => {
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
    const { currentIndex, lastIndex, height } = this.state
    const instant = this.props.instant || this.state.instant
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
                      onSlideHeight: this._setSlideHeight
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
