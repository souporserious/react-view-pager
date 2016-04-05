import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import isInteger from 'is-integer'
import Slide from './Slide'
import getIndexFromKey from './get-index-from-key'
import getValidIndex from './get-valid-index'

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
    slidesToMove: 1,
    swipe: true,
    swipeThreshold: 10,
    flickTimeout: 300,
    springConfig: presets.noWobble
  }

  _node = null
  _sliderWidth = 0
  _slideCount = Children.count(this.props.children)
  _slideWidth = 100 / this.props.slidesToShow
  _deltaX = false
  _deltaY = false
  _startX = false
  _startY = false
  _isSwiping = false
  _isFlick = false

  state = {
    current: 0,
    leaving: [],
    direction: 0,
    speed: 0,
    translate: 0,
    instant: false
  }

  componentWillReceiveProps(nextProps) {
    const { current } = this.state
    const nextIndex = this._getNextIndex(nextProps)

    this._slideCount = Children.count(nextProps.children)
    this._slideWidth = 100 / nextProps.slidesToShow

    // don't update state if index hasn't changed and we're not in the middle of a slide
    if (current !== nextIndex && nextIndex !== null) {
      const direction = (current > nextIndex) ? -1 : 1
      this.slide(nextIndex, direction)
    }
  }

  componentDidMount() {
    this._node = ReactDOM.findDOMNode(this)
    // setTimeout(() => {
    //   this.slide(5, 1)
    // }, 2000)
  }

  componentDidUpdate() {
    if (this.state.instant) {
      this.setState({ instant: false })
    }
  }

  prev() {
    this.navigate(-1)
  }

  next() {
    this.navigate(1)
  }

  navigate(direction) {
    this.slide(this.state.current + (this.props.slidesToMove * direction), direction)
  }

  slide(index, direction = 1) {
    const { current, speed, translate } = this.state
    const newIndex = getValidIndex(index, this._slideCount)
    const leaving = [...this.state.leaving]
    const leavingPos = leaving.indexOf(newIndex)

    // if new index exists in leaving array, remove it
    if (leavingPos > -1) {
      leaving.splice(leavingPos, 1)
    }

    this.setState({
      current: newIndex,
      leaving: leaving.concat([current]),
      direction,
      speed: speed + 1,
      translate: 100 // change this value for swipe
    })
  }

  _getNextIndex({ currentIndex, currentKey, children }) {
    return (
      currentKey
      ? getIndexFromKey(currentKey, children)
      : (currentIndex || 0)
    )
  }

  _onSlideEnd = () => {
    this.setState({
      leaving: [],
      direction: 0,
      speed: 0,
      translate: 0,
      instant: true
    })
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
    // get proper event
    const swipe = e.touches && e.touches[0] || e

    // we're now swiping
    this._isSwiping = true

    // reset deltas
    this._deltaX = this._deltaY = 0

    // store the initial starting coordinates
    this._startX = swipe.pageX
    this._startY = swipe.pageY

    // store slider dimensions
    this.sliderWidth = this._node.offsetWidth
    this.sliderHeight = this._node.offsetHeight

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
    const { current, sliderWidth } = this.state
    const swipe = e.touches && e.touches[0] || e

    // determine how much we have moved
    this._deltaX = this._startX - swipe.pageX
    this._deltaY = this._startY - swipe.pageY

    if (this._isSwipe(swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()
      const axis = vertical ? this._deltaY : this._deltaX
      const dimension = vertical ? this.sliderHeight : this.sliderWidth
      this.setState({ translate: axis / dimension })
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

  _calcSlidePosition(index) {
    const { current, leaving, direction, speed } = this.state
    const speedOffset = (direction * (speed - 1))
    const leavingPos = leaving.indexOf(index)

    if (leavingPos > -1) {
      const indexOffset = ((leaving.length - 1) - leavingPos)
      return (((speed - 1) * 100) + (indexOffset * -100)) * direction
    } else {
      const indexOffset = (index + direction)
      return (indexOffset - (current - speedOffset)) * 100
    }
  }

  render() {
    const { children, slidesToShow, springConfig } = this.props
    const { current, leaving, instant, translate, direction, speed } = this.state
    const destValue = (translate * speed)

    return (
      <Motion
        style={{ translate: instant ? destValue : spring(destValue, springConfig) }}
        onRest={this._onSlideEnd}
      >
        {({ translate }) =>
          <div className="slider" {...this._getSwipeEvents()}>
            {Children.map(children, (child, index) => {
              const slidePosition = this._calcSlidePosition(index)
              let style = {
                width: this._slideWidth + '%',
                transform: `translateX(${slidePosition - (translate * direction)}%)`
              }

              // apply an absolute position to every slide except the current one
              if (index !== current) {
                style = {
                  ...style,
                  position: 'absolute',
                  top: 0,
                  left: 0
                }
              }

              if (leaving.indexOf(index) > -1) {
                style = {
                  ...style,
                  zIndex: 1
                }
              }

              return cloneElement(child, { style })
            })}
          </div>
        }
      </Motion>
    )
  }
}

export default Slider
