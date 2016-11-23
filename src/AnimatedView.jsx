import React, { Component, PropTypes, createElement } from 'react'
import AnimationBus from 'animation-bus'

class AnimateView extends Component {
  static contextTypes = {
    view: PropTypes.any
  }

  static propTypes = {
    tag: PropTypes.string,
    animations: PropTypes.array
  }

  static defaultProps = {
    tag: 'div',
    animations: []
  }

  componentWillUpdate({ animations }) {
    if (animations.length && !this._animationBus && this.context.view) {
      this._animationBus = new AnimationBus(
        animations,
        view => this.context.view.origin
      )
    }
  }

  render() {
    const { tag, animations, ...restProps } = this.props
    let style = {
      ...restProps.style
    }

    if (animations.length && this._animationBus) {
      style = {
        ...restProps.style,
        ...this._animationBus.getStyles(this.context.view)
      }
    }

    return createElement(tag, { ...restProps, style })
  }
}

export default AnimateView
