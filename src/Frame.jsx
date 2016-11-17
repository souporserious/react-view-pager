import React, { Component, PropTypes, Children, createElement, cloneElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring, presets } from 'react-motion'
import Pager from './Pager'
import Swipe from './Swipe'
import Track from './Track'
import View from './View'
import specialAssign from './special-assign'

const checkedProps = {
  tag: PropTypes.string,
  currentView: PropTypes.any,
  viewsToShow: PropTypes.any,
  viewsToMove: PropTypes.number,
  align: PropTypes.number,
  contain: PropTypes.bool,
  axis: PropTypes.oneOf(['x', 'y']),
  autoSize: PropTypes.bool,
  infinite: PropTypes.bool,
  instant: PropTypes.bool,
  swipe: PropTypes.oneOf([true, false, 'mouse', 'touch']),
  swipeThreshold: PropTypes.number,
  flickTimeout: PropTypes.number,
  // rightToLeft: PropTypes.bool,
  // lazyLoad: PropTypes.bool,
  springConfig: React.PropTypes.objectOf(React.PropTypes.number),
  // onViewChange: PropTypes.func,
  // beforeAnimation: PropTypes.func,
  // afterAnimation: PropTypes.func
}

class ViewPager extends Component {
  static propTypes = checkedProps

  static defaultProps = {
    tag: 'div',
    currentView: 0,
    viewsToShow: 'auto',
    viewsToMove: 1,
    align: 0,
    contain: false,
    axis: 'x',
    autoSize: false,
    infinite: false,
    instant: false,
    swipe: true,
    swipeThreshold: 0.5,
    flickTimeout: 300,
    // rightToLeft: false,
    // lazyLoad: false,
    springConfig: presets.noWobble,
    // onViewChange: () => null,
    // beforeAnimation: () => null,
    // afterAnimation: () => null
  }

  static childContextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  constructor(props) {
    super(props)

    this._viewPager = new Pager(props)
    this._swipe = new Swipe(this._viewPager)

    this.state = {
      width: 0,
      height: 0,
      instant: true
    }
  }

  getChildContext() {
    return {
      viewPager: this._viewPager
    }
  }

  componentDidMount() {
    this._viewPager.addFrame(findDOMNode(this))

    // set frame size initially and then based on certain view events
    this._setFrameSize()
    this._viewPager.on('viewAdded', this._setFrameSize)
    this._viewPager.on('viewChange', this._setFrameSize)

    // force update top level component so children update with any new values
    this._viewPager.on('resize', () => {
      this.forceUpdate()
    })
  }

  componentWillReceiveProps({ currentView, children }) {
    // update state with new index if necessary
    if (typeof currentView !== undefined && this.props.currentView !== currentView) {
      // this is pretty anti-react, but since we might not know the children we need
      // to listen for this event in Track and update it there to allow people the ability
      // to move to a view by it's key
      this._viewPager.emit('updateView', currentView)
    }
  }

  prev() {
    this._viewPager.prev()
  }

  next() {
    this._viewPager.next()
  }

  _setFrameSize = () => {
    if (this.props.autoSize) {
      const frameSize = this._viewPager.getFrameSize(true, true)

      if (frameSize.width && frameSize.height) {
        this.setState(frameSize, () => {
          // we need to unset instant flag now that React Motion has dimensions to animate to
          if (this.state.instant) {
            this.setState({ instant: false })
          }
        })
      }
    }
  }

  _getFrameStyle() {
    const { width, height, instant } = this.state
    return {
      maxWidth: instant ? width : spring(width),
      height: instant ? height : spring(height)
    }
  }

  render() {
    const { tag, autoSize } = this.props
    const { width, height } = this.state
    const props = specialAssign(this._swipe.getEvents(), this.props, checkedProps)

    if (autoSize) {
      return (
        <Motion style={this._getFrameStyle()}>
          { dimensions => {
            const frameStyles = {}

            if (dimensions.maxWidth) {
              frameStyles.maxWidth = dimensions.maxWidth
            }

            if (dimensions.height) {
              frameStyles.height = dimensions.height
            }

            return createElement(tag, {
              ...props,
              style: {
                ...frameStyles,
                ...props.style
              }
            })
          }}
        </Motion>
      )
    } else {
      return createElement(tag, props)
    }
  }
}

export default ViewPager
