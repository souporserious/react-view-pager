import React, { Component, PropTypes } from 'react';
import { Spring } from 'react-motion';

const getPrefix = function (prop) {
  const styles = document.createElement('p').style;
  const vendors = ['ms', 'O', 'Moz', 'Webkit'];

  if(styles[prop] === '') return prop;

  prop = prop.charAt(0).toUpperCase() + prop.slice(1);

  for(let i = vendors.length; i--;) {
    if(styles[vendors[i] + prop] === '') {
      return (vendors[i] + prop);
    }
  }
};

class Slider extends Component {
  constructor(props) {
    super(props)
    
    this.isSliding = false;
    this.transform = getPrefix('transform');
    this.supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

    // swipe props
    this.deltaX =
    this.deltaY =
    this.startX =
    this.startY =
    this.isDragging =
    this.isSwiping =
    this.isFlick = false;
    this.swipeThreshold = 10;
    
    this.state = {
      currIndex: 0,
      direction: null
    }
  }
  
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
  
  _dragStart(e) {
    // get proper event
    const touch = this.supportsTouch ? e.touches[0] : e;

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
    }, 300);
  }

  _dragMove(e) {
    // if we aren't dragging bail
    if(!this.isDragging) return;

    // get proper event
    const { currIndex } = this.state;
    const touch = this.supportsTouch ? e.touches[0] : e;
    const sliderCount = this.props.children.length;
    const sliderWidth = sliderCount * 100;
    const threshold = sliderWidth / 2;

    // determine how much we have moved
    this.deltaX = this.startX - touch.pageX;
    this.deltaY = this.startY - touch.pageY;

    // if on the first or last side check for a threshold
    if(this._isSwipe(threshold) &&
      (currIndex === 0 || currIndex === sliderCount - 1)) {
      return;
    }

    if(this._isSwipe(this.swipeThreshold)) {
      e.preventDefault();
      e.stopPropagation();
      this.isSwiping = true;
    }
    
    if(this.isSwiping) {
      this.setState({direction: this.deltaX / sliderWidth});
    }
  }

  _dragEnd(e) {
    const { currIndex } = this.state;
    const slideCount = this.props.children.length;
    const sliderWidth = slideCount * 100;
    const threshold = this.isFlick ? this.swipeThreshold : sliderWidth / 2;

    // handle swipe
    if(this._isSwipe(threshold)) {
      (this.deltaX < 0) ? this.prev() : this.next();
    } else {
      this.setState({direction: 0});
    }

    // we are no longer swiping or dragging
    this.isSwiping = this.isDragging = false;
  }
  
  _getX() {
    return -((this.state.direction + this.state.currIndex) * 100) / this.props.children.length;
  }
  
  render() {
    const { children } = this.props;
    const { currIndex, currX } = this.state;
    const count = children.length;
    const destX = this._getX();

    return(
      <Spring
        endValue={{val: {x: destX}, config: [211, 21]}}
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
                onMouseDown={this._dragStart.bind(this)}
                onMouseMove={this._dragMove.bind(this)}
                onMouseUp={this._dragEnd.bind(this)}
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
