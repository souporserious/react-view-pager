import React, { Component, PropTypes, Children } from 'react';
import { Spring } from 'react-motion';
import Measure from 'react-measure';
import getPrefix from './getPrefix.js';

class Slider extends Component {
  static propTypes = {
    draggable: PropTypes.bool,
    currentKey: PropTypes.any,
    currentIndex: PropTypes.number,
    springConfig: PropTypes.array,
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number,
    slidesToShow: PropTypes.number,
    slidesToMove: PropTypes.number
  }

  static defaultProps = {
    draggable: true,
    currentKey: 0,
    currentIndex: 0,
    springConfig: [262, 24],
    swipeThreshold: 10,
    flickTimeout: 300,
    slidesToShow: 1,
    slidesToMove: 1
  }

  slideCount = this.props.children.length
  isSliding = false
  transform = getPrefix('transform')
  supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints
  deltaX = false
  deltaY = false
  startX = false
  startY = false
  isDragging = false
  isSwiping = false
  isFlick = false
  state = {
    currIndex: this._getCurrentChildIndex(this.props),
    direction: null,
    dimensions: {},
    sliderWidth: (this.slideCount * 100) / this.props.slidesToShow
  }

  componentWillReceiveProps(nextProps) {
    this.setState({currIndex: this._getCurrentChildIndex(nextProps)})
  }
  
  prev() {
    if(this.state.currIndex <= 0) return;
    this.setState({currIndex: this.state.currIndex - 1, direction: null});
  }
  
  next() {
    if(this.state.currIndex >= this.slideCount-1) return;
    this.setState({currIndex: this.state.currIndex + 1, direction: null});
  }

  _getCurrentChildIndex(props) {
    const { children, currentKey } = props
    let index = 0
    
    Children.forEach(children, (child, i) => {
      if(child.key === currentKey) {
        index = i
        return
      }
    })
    return index
  }

  _getChildByIndex(i) {
    const { children } = this.props
    let child = null

    Children.forEach(children, (_child, _i) => {
      if(i === _i) {
        child = _child
        return
      }
    })
    return child
  }

  _isEndSlide() {
    const { currIndex } = this.state;
    return currIndex === 0 || currIndex === this.slideCount - 1;
  }
  
  _isSwipe(threshold) {
    return Math.abs(this.deltaX) > Math.max(threshold, Math.abs(this.deltaY));
  }
  
  _dragStart = (e) =>  {
    // get proper event
    const touch = e.touches && e.touches[0] || e;

    // we're now dragging
    this.isDragging = true;

    // reset deltas
    this.deltaX = this.deltaY = 0;

    // store the initial starting coordinates
    this.startX = touch.pageX;
    this.startY = touch.pageY;

    // determine if a flick or not
    this.isFlick = true;

    setTimeout(() => {
      this.isFlick = false;
    }, this.props.flickTimeout);
  }

  _dragMove = (e) =>  {
    // if we aren't dragging bail
    if(!this.isDragging) return;

    const touch = e.touches && e.touches[0] || e;
    const { currIndex, sliderWidth } = this.state;
    const threshold = sliderWidth / 2;

    // determine how much we have moved
    this.deltaX = this.startX - touch.pageX;
    this.deltaY = this.startY - touch.pageY;

    if(this._isSwipe(this.props.swipeThreshold)) {
      e.preventDefault();
      e.stopPropagation();
      this.isSwiping = true;
    }

    if(this.isSwiping) {
      this.setState({direction: this.deltaX / sliderWidth});
    }
  }

  _dragEnd = () =>  {
    const { currIndex, sliderWidth } = this.state;
    const threshold = this.isFlick ? this.props.swipeThreshold : sliderWidth / 2;

    // handle swipe
    if(this._isSwipe(threshold)) {
      // id if an end slide, we still need to set the direction
      if(this._isEndSlide()) {
        this.setState({direction: 0});
      }
      (this.deltaX < 0) ? this.prev() : this.next();
    } else {
      this.setState({direction: 0});
    }

    // we are no longer swiping or dragging
    this.isSwiping = this.isDragging = false;
  }

  _dragPast = () =>  {
    // perform a dragend if we dragged past component
    if(this.isDragging) {
      this._dragEnd();
    }
  }

  _storeDimensions = (key, childDimensions) => {
    const { dimensions } = this.state
    dimensions[key] = childDimensions
    this.setState({dimensions})
  }
  
  render() {
    const { children, springConfig, draggable } = this.props;
    const { currIndex, direction, sliderWidth } = this.state;
    // normalize index when on end slides
    const slidesToMove = this._isEndSlide() ? 1 : this.props.slidesToMove;
    const destX = -((direction + (currIndex * slidesToMove)) * 100) / this.slideCount;
    const currChild = this._getChildByIndex(currIndex)
    const dimensions = this.state.dimensions[currChild.key]
    const height = dimensions && dimensions.height || 0

    return(
      <Spring
        endValue={{val: {height, x: destX}, config: springConfig}}
      >
        {({val: {height, x}}) => {
          this.isSliding = x !== destX;

          let sliderClassName = 'slider';
          let modifiers = [];

          if(this.isSliding) {
            modifiers.push('is-sliding');
          }

          if(draggable) {
            modifiers.push('is-draggable');
          }

          if(this.isDragging) {
            modifiers.push('is-dragging');
          }

          sliderClassName += modifiers.map(modifier => ` ${sliderClassName}--${modifier}`).join('');

          return(
            <div className={sliderClassName}>
              <ul
                className="slider__track"
                onMouseDown={draggable && this._dragStart}
                onMouseMove={draggable && this._dragMove}
                onMouseUp={draggable && this._dragEnd}
                onMouseLeave={draggable && this._dragPast}
                onTouchStart={draggable && this._dragStart}
                onTouchMove={draggable && this._dragMove}
                onTouchEnd={draggable && this._dragEnd}
                style={{
                  height,
                  width: sliderWidth + '%',
                  [this.transform]: `translate3d(${x}%, 0, 0)`
                }}
              >
                {Children.map(children, child =>
                  <Measure
                    whitelist={['height']}
                    onChange={this._storeDimensions.bind(null, child.key)}
                  >
                    {child}
                  </Measure>
                )}
              </ul>
            </div>
          );
        }}
      </Spring>
    );
  }
}

export default Slider;
