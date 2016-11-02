import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'

const modulo = (num, max) => ((num % max) + max) % max

// react-view-pager

// const Slider = ({ slides }) => (
  // <Frame>
  //   { ({ position, isSliding, isSwiping }) =>
  //     <Motion style={{ value: isSwiping ? position : spring(position) }}>
  //       { value =>
  //         <Track position={value}> // overrides internal position
  //           {slides} // that position would set proper wrapper values
  //         </Track>
  //       }
  //     </Motion>
  //   }
  // </Frame>
// )

const ALIGN_OFFSETS = {
  left: 0,
  center: 0.5,
  right: 1
}

class Slide extends Component {
  componentDidMount() {
    this.props.onSlideMount(findDOMNode(this), this.props.index)
  }

  render() {
    const { width, position, children } = this.props
    const child = Children.only(children)
    const style = {
      ...child.props.style,
      left: position.left + '%'
    }

    if (width) {
      style.width = width + '%'
    }

    // pass isCurrent here so we can do stuff with it. Also pass as child function
    // because people may want that functionality

    return cloneElement(child, { style })
  }
}

class Slider extends Component {
  static propTypes = {
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    slidesToShow: PropTypes.number, // can be false as well
    slidesToMove: PropTypes.number,
    infinite: PropTypes.bool,
    instant: PropTypes.bool,
    vertical: PropTypes.bool,
    autoHeight: PropTypes.bool,
    // align: PropTypes.oneOf(['left', 'center', 'right', PropTypes.number]),
    align: PropTypes.any,
    swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number,
    beforeSlide: PropTypes.func,
    afterSlide: PropTypes.func
  }

  static defaultProps = {
    currentKey: null,
    currentIndex: 0,
    slidesToShow: false,
    slidesToShow: 3,
    slidesToMove: 1,
    infinite: false,
    // instant: false,
    // vertical: false,
    // autoHeight: false,
    align: 'left',
    swipe: true,
    swipeThreshold: 0.5,
    flickTimeout: 300,
    onChange: () => null,
    beforeSlide: () => null,
    afterSlide: () => null
  }

  constructor(props) {
    super(props)

    this._slideCount = Children.count(props.children)
    this._deltaX = false
    this._deltaY = false
    this._startX = {}
    this._startY = {}
    this._isSwiping = false
    this._isFlick = false

    this.state = {
      currentIndex: props.currentIndex,
      currentKey: props.currentKey,
      swipeOffset: 0,
      instant: false
    }

    // NEW
    this._sliderX = 0
    this._sliderPosition = 0
    this._frameWidth = -1
    this._trackWidth = -1
    this._slideWidth = -1
    this._slideDimensions = []
  }

  componentDidMount() {
    this._frameWidth = this._frame.offsetWidth
    this._slideWidth = (this._frameWidth / this.props.slidesToShow) / this._slideCount
    this._sliderX = this._getLeftStartCoords()
    this._setSliderPosition()
  }

  componentWillReceiveProps({ currentIndex }) {
    if (typeof currentIndex !== undefined && this.props.currentIndex !== currentIndex) {
      this.setState({ currentIndex })
    }
  }

  componentDidUpdate(lastProps, lastState) {
    // reposition slider if index has changed
    if (this.state.currentIndex !== lastState.currentIndex) {
      this._sliderX = this._getLeftStartCoords()
      this._setSliderPosition()
    }
  }

  prev() {
    this.slide(-1)
  }

  next() {
    this.slide(1)
  }

  slide = (direction, index = this.state.currentIndex) => {
    const currentIndex = modulo(index + direction, this._slideCount)
    this.setState({ currentIndex }, () => {
      this.props.onChange(currentIndex)
    })
  }

  _handleSlideMount = (node, index) => {
    this._slideDimensions.push([node.offsetWidth, node.offsetHeight])
    this._trackWidth += node.offsetWidth
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
    this._startX = {
      slider: this._sliderX,
      page: swipe.pageX
    }
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
    this._deltaX = this._startX.page - swipe.pageX
    this._deltaY = this._startY - swipe.pageY

    if (this._isSwipe(swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()

      const deltaAxis = vertical ? this._deltaY : this._deltaX

      this._sliderX = this._startX.slider - deltaAxis
      this._setSliderPosition()

      // this.setState({
      //   swipeOffset: (axis / dimension) * slidesToMove,
      //   instant: true
      // })
    }
  }

  _onSwipeEnd = () =>  {
    const { swipeThreshold } = this.props
    const slideWidth = this._getCurrentSlideDimensions()[0]
    const threshold = this._isFlick ? swipeThreshold : (slideWidth * swipeThreshold)

    // this.setState({
    //   swipeOffset: 0,
    //   instant: false
    // }, () => {
      // if (this._isSwipe(threshold)) {
      //   (this._deltaX < 0) ? this.prev() : this.next()
      // }
    // })

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

  _getCurrentSlideDimensions() {
    const { slidesToShow } = this.props
    return slidesToShow
      ? [this._slideWidth, 0]
      : this._slideDimensions[this.state.currentIndex] || [0, 0]
  }

  _setSliderPosition() {
    const { align } = this.props
    const slideWidth = this._getCurrentSlideDimensions()[0]
    const alignMultiplier = isNaN(align) ? ALIGN_OFFSETS[align] : align
    let position = modulo(this._sliderX, this._trackWidth) - this._trackWidth

    position += (this._frameWidth - slideWidth) * alignMultiplier

    this._sliderPosition = position

    this.forceUpdate()
  }

  _getPercentValue(position) {
    return Math.round(position / this._frameWidth * 10000) * 0.01
  }

  _getLeftStartCoords(index = this.state.currentIndex) {
    return this._slideDimensions
      .slice(0, index)
      .reduce((sum, [width]) => sum - width, 0)
  }

  _getSlidePositions() {
    const positions = []

    this._slideDimensions.reduce((prevLeft, [origW, origH], i) => {
      let left = prevLeft
      let nextLeft = prevLeft + origW

      // offset slides in the proper position when wrapping
      if (nextLeft < Math.abs(this._sliderPosition)) {
        left += this._trackWidth
      } else if (prevLeft > (this._frameWidth - this._sliderPosition)) {
        left -= this._trackWidth
      }

      positions.push({
        // this can be cleaned up, slidesToShow should be moved into a conditional
        left: this._getPercentValue(left)
      })

      return nextLeft
    }, 0)

    return positions
  }

  render() {
    const { slidesToShow, children } = this.props
    const trackPosition = this._getPercentValue(this._sliderPosition)
    const slidePositions = this._getSlidePositions()
    return (
      <div
        ref={c => this._frame = findDOMNode(c)}
        className="gallery"
        {...this._getSwipeEvents()}
      >
        <div
          ref={c => this._track = findDOMNode(c)}
          className="slider"
          style={{
            transform: `translate3d(${trackPosition}%, 0, 0)`
          }}
        >
          {Children.map(children, (child, index) =>
            <Slide
              index={index}
              width={slidesToShow && this._slideWidth}
              position={slidePositions[index] || { left: 0 }}
              onSlideMount={this._handleSlideMount}
            >
              {child}
            </Slide>
          )}
        </div>
      </div>
    )
  }
}

export default Slider
