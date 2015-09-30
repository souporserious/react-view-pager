import React, { Component, PropTypes, Children, cloneElement, createElement } from 'react';
import { Spring, presets } from 'react-motion';
import Measure from 'react-measure';

const TRANSFORM = require('./getPrefix.js')('transform')

class Slide extends Component {
  _getEndValue = (prevValue) => {
    const { nextIndex, isSliding } = this.props
    let x = isSliding ? 100 : 0
    let config = isSliding ? presets.noWobble : []

    if(prevValue && prevValue.val.x === x && isSliding) {
      // reset x value so we don't immediately hit onSlideEnd again
      x = 0

      // fire callback to Slider
      this.props.onSlideEnd()
    }
    return {val: {x}, config}
  }

  _getStyles(x) {
    const { index, currIndex, nextIndex, direction, isSliding } = this.props
    let style = {
      width: '100%',
      position: null,
      top: 0,
      left: 0
    }

    // only apply styles to slides that need to move
    if(currIndex === index || nextIndex === index) {
      let translateX = (direction === 'prev') ? x : -x

      if(nextIndex === index) {
        style.position = 'absolute'

        if(direction === 'prev') {
          translateX -= 100
        } else {
          translateX += 100
        }
      }

      // only apply styles if we are sliding
      if(!isSliding) {
        style = {}
      } else {
        style[TRANSFORM] = `translate3d(${translateX}%, 0, 0)`
      }
    } else {
      style = { display: 'none' }
    }

    return style
  }

  render() {
    const child = Children.only(this.props.children)

    return createElement(Spring,
      { endValue: this._getEndValue },
      ({val: {x}}) => {
        this._lastX = x
        return cloneElement(child, {
          style: this._getStyles(x)
        })
      }
    )
  }
}

class Slider extends Component {
  static propTypes = {
    draggable: PropTypes.bool,
    currentKey: PropTypes.any,
    //currentIndex: PropTypes.number,
    springConfig: PropTypes.array,
    swipeThreshold: PropTypes.number,
    flickTimeout: PropTypes.number,
    slidesToShow: PropTypes.number,
    slidesToMove: PropTypes.number,
    autoHeight: PropTypes.bool,
    forceAutoHeight: PropTypes.bool
  }

  static defaultProps = {
    component: 'ul',
    draggable: true,
    currentKey: 0,
    //currentIndex: 0, soon
    springConfig: presets.noWobble,
    swipeThreshold: 10,
    flickTimeout: 300,
    slidesToShow: 1,
    slidesToMove: 1,
    autoHeight: true,
    forceAutoHeight: false
  }

  _slideCount = this.props.children.length
  state = {
    currIndex: this._getIndexFromKey(this.props),
    nextIndex: null,
    direction: null,
    isSliding: false
  }

  componentWillReceiveProps(nextProps) {
    this._slideCount = nextProps.children.length
    this.setState({nextIndex: this._getIndexFromKey(nextProps), isSliding: true})
  }
  
  prev() {
    if(this.state.isSliding) return
    this.setState({nextIndex: this._getNewIndex('prev'), direction: 'prev', isSliding: true})
  }
  
  next() {
    if(this.state.isSliding) return
    this.setState({nextIndex: this._getNewIndex('next'), direction: 'next', isSliding: true})
  }

  _getIndexFromKey(props) {
    const { children, currentKey } = props
    let index = 0

    Children.forEach(children, (child, _index) => {
      if(child.key === currentKey) {
        index = _index
        return
      }
    })
    return index
  }

  _isEndSlide() {
    const { currIndex } = this.state
    return currIndex === 0 || currIndex === this._slideCount - 1
  }

  _getNewIndex(direction) {
    const { currIndex } = this.state
    const delta = (direction === 'prev') ? -1 : 1
    const willWrap = (direction == 'prev' && currIndex === 0) ||
                     (direction == 'next' && currIndex === this._slideCount - 1)

    return willWrap ? currIndex : (currIndex + delta) % this._slideCount
  }

  _getEndValue = (index, prevValue) => {
    const x = this._isSliding ? 100 : 0
    const config = this._isSliding ? presets.noWobble : []
    const nextIndex = index === this.state.nextIndex

    // callback when we've finished sliding
    // make sure we are on the last index before firing
    // so when we update we get a an up to date render ;)
    if(prevValue && prevValue.val.x === x &&
       nextIndex && this._isSliding) {
      this._onSlideEnd()
    }
    return {val: {x}, config}
  }

  _onSlideEnd = () => {
    const { currIndex, nextIndex } = this.state
    
    this.setState({
      currIndex: this.state.nextIndex,
      nextIndex: null,
      direction: null,
      isSliding: false
    })
  }

  _getStyles(index, x) {
    const { currIndex, nextIndex, direction } = this.state;
    let style = {
      width: '100%',
      position: null,
      top: 0,
      left: 0
    }

    // only apply styles to slides that need to move
    if(currIndex === index || nextIndex === index) {
      let translateX = (direction === 'prev') ? x : -x

      if(nextIndex === index) {
        style.position = 'absolute'

        if(direction === 'prev') {
          translateX -= 100
        } else {
          translateX += 100
        }
      }
//console.log(index, translateX)
      // only apply styles if we are sliding
      if(!this._isSliding) {
        style = {}
      } else {
        style[this._transform] = `translate3d(${translateX}%, 0, 0)`
      }
    } else {
      style = { display: 'none' }
    }

    return style
  }
  
  render() {
    const { component, children, springConfig, draggable, autoHeight, forceAutoHeight } = this.props;
    const { currIndex, nextIndex, direction, sliderWidth, isSliding } = this.state;
    let sliderClassName = 'slider'

    const childrenToRender = Children.map(children, (child, index) => {
      return createElement(Slide, {
        index, currIndex, nextIndex, direction, isSliding,
        onSlideEnd: this._onSlideEnd
      }, child)
    })

    return(
      <div className={sliderClassName}>
        {createElement(
          component,
          {
            className: 'slider__track',
            style: {
              //height: height === destHeight ? '' : height,
              //height,
              //width: sliderWidth + '%',
              //[this.transform]: `translate3d(${x}%, 0, 0)`
            }
          },
          childrenToRender
        )}
      </div>
    );
  }
}

export default Slider;
