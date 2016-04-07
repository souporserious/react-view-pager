import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Slide from './Slide'
import getIndexFromKey from './get-index-from-key'
import getValidIndex from './get-valid-index'

const TRANSFORM = require('get-prefix')('transform')


const range = (a, b) => Array(b).fill().map((_, i) => i + a)

const overlaps = (function () {
    function getPositions(el) {
        const rect = el.getBoundingClientRect()
        return [[rect.left, rect.right], [rect.top, rect.bottom]]
    }

    function comparePositions(p1, p2) {
        const r1 = p1[0] < p2[0] ? p1 : p2
        const r2 = p1[0] < p2[0] ? p2 : p1
        return r1[1] > r2[0] || r1[0] === r2[0]
    }

    return function (a, b) {
        const pos1 = getPositions( a )
        const pos2 = getPositions( b )
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1])
    }
})()

class Slider extends Component {
  static propTypes = {
    component: PropTypes.string,
    vertical: PropTypes.bool,
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    slidesToShow: PropTypes.number,
    slidesToMove: PropTypes.number,
    springConfig: React.PropTypes.objectOf(React.PropTypes.number)
  }

  static defaultProps = {
    component: 'div',
    vertical: false,
    slidesToShow: 1,
    slidesToMove: 1,
    //springConfig: presets.noWobble
    springConfig: { stiffness: 33, damping: 35 }
  }

  _node = null
  _sliderWidth = 0
  _slideCount = Children.count(this.props.children)
  _slideWidth = 100 / this._slideCount
  _trackWidth = (this._slideCount * 100) / this.props.slidesToShow
  _currentTween = 0

  state = {
    currentIndex: 0,
    direction: null,
    instant: false,
    height: 0
  }

  componentWillReceiveProps(nextProps) {
    const { currentIndex } = this.state
    const nextIndex = this._getNextIndex(nextProps)

    this._slideCount = Children.count(nextProps.children)
    this._slideWidth = 100 / this._slideCount
    this._trackWidth = (this._slideCount * 100) / nextProps.slidesToShow

    // don't update state if index hasn't changed and we're not in the middle of a slide
    if (currentIndex !== nextIndex && nextIndex !== null) {
      this.setState({ currentIndex: nextIndex })
    }
  }

  componentDidUpdate() {
    if (this.state.instant) {
      this.setState({ instant: false })
    }
  }

  prev() {
    const { currentIndex } = this.state
    if (currentIndex <= 0) return

    this.slide()

    this.setState({ currentIndex: currentIndex - 1, direction: null })
  }

  next() {
    const { currentIndex } = this.state
    if (currentIndex >= this._slideCount - 1) return

    this.slide()

    this.setState({ currentIndex: currentIndex + 1, direction: null })
  }

  slide() {
    const slider = findDOMNode(this)
    const slides = slider.querySelectorAll('.slide')
    const indices = []

    for (let i = slides.length; i--;) {
      const slide = slides[i]

      if (overlaps(slider, slide)) {
        indices.push(i)
      }
    }

    const visibleIndex = Math.abs(this._currentTween / (this._slideCount - 1))

    console.log(indices, visibleIndex)
  }

  _getNextIndex({ currentIndex, currentKey, children }) {
    return (
      currentKey
      ? getIndexFromKey(currentKey, children)
      : (currentIndex || 0)
    )
  }

  _isEndSlide() {
    const { currentIndex } = this.state
    return (currentIndex === 0) || (currentIndex === this._slideCount - 1)
  }

  render() {
    const { children, vertical, springConfig } = this.props
    const { currentIndex, leaving, instant, translate, direction, speed, height } = this.state
    const slidesToMove = this._isEndSlide() ? 1 : this.props.slidesToMove
    const destValue = ((direction - (currentIndex * slidesToMove)) * 100) / this._slideCount
    const axis = vertical ? 'Y' : 'X'

    return (
      <Motion
        style={{
          translate: instant ? destValue : spring(destValue, springConfig),
          wrapperHeight: instant ? height : spring(height, springConfig)
        }}
      >
        {({ translate, wrapperHeight }) => {
          this._currentTween = translate
          return (
            <div className="slider">
              <div
                className="slider__track"
                style={{
                  width: this._trackWidth + '%',
                  [TRANSFORM]: `translate3d(${translate}%, 0, 0)`
                }}
              >
                {Children.map(children, (child, index) =>
                  cloneElement(child)
                )}
              </div>
            </div>
          )
        }}
      </Motion>
    )
  }
}

class Sliders extends Component {
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
    springConfig: React.PropTypes.objectOf(React.PropTypes.number)
  }

  static defaultProps = {
    component: 'div',
    vertical: false,
    slidesToShow: 1,
    slidesToMove: 1,
    swipe: true,
    swipeThreshold: 10,
    flickTimeout: 300,
    springConfig: presets.noWobble
  }

  _node = null
  _sliderWidth = 0
  _slideCount = Children.count(this.props.children)
  _slideWidth = 100 / this._slideCount
  _trackWidth = (this._slideCount * 100) / this.props.slidesToShow
  _deltaX = false
  _deltaY = false
  _startX = false
  _startY = false
  _isSwiping = false
  _isFlick = false

  state = {
    current: 0,
    direction: null,
    instant: false,
    height: 0
  }

  componentDidMount() {
    this._node = ReactDOM.findDOMNode(this)
  }

  componentWillReceiveProps(nextProps) {
    const { current } = this.state
    const nextIndex = this._getNextIndex(nextProps)

    this._slideCount = Children.count(nextProps.children)
    this._slideWidth = 100 / this._slideCount
    this._trackWidth = (this._slideCount * 100) / nextProps.slidesToShow

    // don't update state if index hasn't changed and we're not in the middle of a slide
    if (current !== nextIndex && nextIndex !== null) {
      this.setState({ current: nextIndex })
    }
  }

  componentDidUpdate() {
    if (this.state.instant) {
      this.setState({ instant: false })
    }
  }

  prev() {
    const { current } = this.state
    if (current <= 0) return
    this.setState({ current: current - 1, direction: null })
  }

  next() {
    const { current } = this.state
    if (current >= this._slideCount - 1) return
    this.setState({ current: current + 1, direction: null })
  }

  _getNextIndex({ currentIndex, currentKey, children }) {
    return (
      currentKey
      ? getIndexFromKey(currentKey, children)
      : (currentIndex || 0)
    )
  }

  _isEndSlide() {
    const { current } = this.state
    return current === 0 || current === this._slideCount - 1
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

    // store slider dimensions
    this._sliderWidth = this._node.offsetWidth
    this._sliderHeight = this._node.offsetHeight

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
      this.setState({ direction: axis / dimension })
    }
  }

  _onSwipeEnd = () =>  {
    const threshold = this._isFlick ? this.props.swipeThreshold : (this._sliderWidth / 2)

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

  _handleSlideHeight = (height) => {
    this.setState({ height })
  }

  render() {
    const { children, vertical, springConfig } = this.props
    const { current, leaving, instant, translate, direction, speed, height } = this.state
    const slidesToMove = this._isEndSlide() ? 1 : this.props.slidesToMove
    const destValue = -((direction + (current * slidesToMove)) * 100) / this._slideCount
    const axis = vertical ? 'Y' : 'X'

    return (
      <Motion
        style={{
          translate: instant ? destValue : spring(destValue, springConfig),
          wrapperHeight: instant ? height : spring(height, springConfig)
        }}
      >
        {({ translate, wrapperHeight }) =>
          <div className="slider">
            <div
              className="slider__track"
              style={{
                width: this._trackWidth + '%',
                height: wrapperHeight,
                [TRANSFORM]: `translate3d(${translate}%, 0, 0)`
              }}
              {...this._getSwipeEvents()}
            >
              {Children.map(children, (child, index) =>
                createElement(Slide, {
                  isCurrent: current === index,
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
