import React, { Component, PropTypes, createElement } from 'react'
import ReactDOM, { findDOMNode } from 'react-dom'
import { Motion, spring } from 'react-motion'
import Pager from './Pager'
import Swipe from './Swipe'

class Frame extends Component {
  static defaultProps = {
    tag: 'div'
  }

  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  constructor(props) {
    super(props)
    this.state ={
      width: 0,
      height: 0,
      instant: true
    }
  }

  componentWillMount() {
    this.swipe = new Swipe(this.context.viewPager)
  }

  componentDidMount() {
    const { viewPager } = this.context
    viewPager.addFrame(findDOMNode(this))
    viewPager.on('firstViewAdded', this._setFrameSize)
    viewPager.on('onViewChange', this._setFrameSize)
  }

  _setFrameSize = () => {
    const { viewPager } = this.context

    if (viewPager.options.autoSize) {
      const frameSize = viewPager.getFrameSize(true)

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
      width: instant ? width : spring(width),
      height: instant ? height : spring(height)
    }
  }

  render() {
    const { viewPager } = this.context
    const { tag, ...restProps } = this.props
    const componentProps = {
      ...restProps,
      ...this.swipe.getEvents()
    }

    if (viewPager.options.autoSize) {
      return (
        <Motion style={this._getFrameStyle()}>
          { frameStyles =>
            createElement(tag, {
              ...componentProps,
              style: {
                ...frameStyles,
                ...componentProps.style
              }
            })
          }
        </Motion>
      )
    } else {
      return createElement(tag, componentProps)
    }
  }
}

export default Frame
