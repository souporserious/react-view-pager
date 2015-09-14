import React, { Component, PropTypes } from 'react';
import { Spring } from 'react-motion';
import getPrefix from './getPrefix.js';

class Slider extends Component {
  static propTypes = {
    springConfig: PropTypes.array,
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number
  }

  static defaultProps = {
    springConfig: [262, 24],
    swipeThreshold: 10,
    flickTimeout: 300
  }

  state = {
    currIndex: 0,
    direction: null
  }
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
  
  prev(hold = this.state.currIndex <= 0) {
    const currIndex = hold ? this.state.currIndex : this.state.currIndex - 1;
    this.setState({currIndex, direction: null});
  }
  
  next(hold = this.state.currIndex >= this.props.children.length-1) {
    const currIndex = hold ? this.state.currIndex : this.state.currIndex + 1;
    this.setState({currIndex, direction: null});
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
    const { currIndex } = this.state;
    const sliderCount = this.props.children.length;
    const sliderWidth = sliderCount * 100;
    const threshold = sliderWidth / 2;

    // determine how much we have moved
    this.deltaX = this.startX - touch.pageX;
    this.deltaY = this.startY - touch.pageY;

    // bail if we're on the first or last slide and we've moved past the threshold
    if(this._isSwipe(threshold) &&
      (currIndex === 0 || currIndex === sliderCount - 1)) {
      return;
    }

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
    const { currIndex } = this.state;
    const slideCount = this.props.children.length;
    const sliderWidth = slideCount * 100;
    const threshold = this.isFlick ? this.props.swipeThreshold : sliderWidth / 2;

    // handle swipe
    if(this._isSwipe(threshold)) {
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
  
  render() {
    const { children, springConfig } = this.props;
    const { currIndex, direction } = this.state;
    const count = children.length;
    const destX = -((direction + currIndex) * 100) / count;

    return(
      <Spring
        endValue={{val: {x: destX}, config: springConfig}}
      >
        {({val: {x}}) => {
          this.isSliding = x !== destX;

          let sliderClassName = 'slider';
          let modifiers = [];

          if(this.isSliding) {
            modifiers.push('is-sliding');
          }

          if(this.isDragging) {
            modifiers.push('is-dragging');
          }

          sliderClassName += modifiers.map(modifier => ` ${sliderClassName}--${modifier}`).join('');

          return(
            <div className={sliderClassName}>
              <ul
                className="slider__track"
                onMouseDown={this._dragStart}
                onMouseMove={this._dragMove}
                onMouseUp={this._dragEnd}
                onTouchStart={this._dragStart}
                onTouchMove={this._dragMove}
                onTouchEnd={this._dragEnd}
                style={{
                  width: (100 * count) + '%',
                  [this.transform]: `translate3d(${x}%, 0, 0)`
                }}
              >
                {children}
              </ul>
            </div>
          );
        }}
      </Spring>
    );
  }
}

export default Slider;
