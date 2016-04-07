import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Slide from './Slide'
import getIndexFromKey from './get-index-from-key'
import getValidIndex from './get-valid-index'

const TRANSFORM = require('get-prefix')('transform')

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
    springConfig: React.PropTypes.objectOf(React.PropTypes.number)
  }

  static defaultProps = {
    component: 'div',
    vertical: false,
    slidesToShow: 1,
    slidesToMove: 3,
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
    currentIndex: 0,
    direction: null,
    instant: false,
    height: 0
  }

  componentDidMount() {
    this._node = ReactDOM.findDOMNode(this)
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
    this.setState({ currentIndex: currentIndex - 1, direction: null })
  }

  next() {
    const { currentIndex } = this.state
    const newIndex = (currentIndex + this.props.slidesToMove)

    if (currentIndex >= this._slideCount - 1 ) return


    //console.log(this._isEndSlide(newIndex + this.props.slidesToShow))


    this.setState({ currentIndex: currentIndex + this.props.slidesToMove, direction: null })
  }

  slide() {
    //slidesToMove
  }

  _getNextIndex({ currentIndex, currentKey, children }) {
    return (
      currentKey
      ? getIndexFromKey(currentKey, children)
      : (currentIndex || 0)
    )
  }

  _isEndSlide(index = this.state.currentIndex) {
    return (index === 0) || (index === this._slideCount - 1)
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
    const { currentIndex, direction, instant, height } = this.state
    const destValue = ((direction - currentIndex) * 100) / this._slideCount
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
