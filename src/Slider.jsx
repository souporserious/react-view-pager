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
  
  prev() {
    let currIndex = this.state.currIndex - 1;
    let direction = null;
    
    if(this.state.currIndex <= 0 && this.deltaX < 0) {
      currIndex = this.state.currIndex;
      direction = 0;
    }
    
    //if(this.state.currIndex <= 0) return;
    
    this.setState({currIndex, direction});
  }
  
  next() {
    if(this.state.currIndex >= this.props.children.length-1) return;
    this.setState({
      currIndex: this.state.currIndex + 1,
      direction: null
    });
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
    const touch = this.supportsTouch ? e.touches[0] : e;
    const sliderWidth = this.props.children.length * 100;

    // determine how much we have moved
    this.deltaX = this.startX - touch.pageX;
    this.deltaY = this.startY - touch.pageY;

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
    const sliderWidth = this.props.children.length * 100;
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
  
  getX() {
    return -((this.state.direction + this.state.currIndex) * 100) / this.props.children.length;
  }
  
  render() {
    const { children } = this.props;
    const { currIndex, currX } = this.state;
    const count = children.length;
    const destX = this.getX();
    
    return(
      <Spring
        endValue={{val: {x: currX || destX}}}
      >
        {({val: {x}}) => {
          this.isSliding = !(x === destX);
          return(
            <div className="slider">
              <ul
                className="slider__track"
                onMouseDown={this._dragStart.bind(this)}
                onMouseMove={this._dragMove.bind(this)}
                onMouseUp={this._dragEnd.bind(this)}
                style={{
                  width: (100 * count) + '%',
                  [this.transform]: `translate3d(${(currX || x)}%, 0, 0)`
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
