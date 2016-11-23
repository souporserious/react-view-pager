import React, { Component, PropTypes } from 'react'
import AnimationBus from 'animation-bus'

class AnimateView extends Component {
  static contextTypes = {
    view: PropTypes.any
  }

  static defaultProps = {
    animations: []
  }

  componentWillUpdate() {
    if (!this._animationBus && this.context.view) {
      this._animationBus = new AnimationBus(
        this.props.animations,
        view => this.context.view.origin
      )
    }
  }

  render() {
    const { animations, ...restProps } = this.props
    let style = {}

    if (this._animationBus) {
      style = {
        ...this._animationBus.getStyles(this.context.view)
      }
    }

    return (
      <div {...restProps} style={style}>
        {this.props.children}
      </div>
    )
  }
}

export default AnimateView
