import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import AnimationBus from 'animation-bus'
import Pager from './Pager'
import specialAssign from './special-assign'

const checkedProps = {
  tag: PropTypes.string,
  index: PropTypes.number,
  animations: PropTypes.array
}

class AnimatedView extends Component {
  static contextTypes = {
    pager: PropTypes.instanceOf(Pager),
    view: PropTypes.any
  }

  static propTypes = checkedProps

  static defaultProps = {
    tag: 'div',
    animations: []
  }

  componentWillMount() {
    const { animations } = this.props

    if (animations.length) {
      this._animationBus = new AnimationBus({
        animations,
        origin: view => view.origin
      })
    }
  }

  render() {
    const { tag, index, ...restProps } = this.props
    let style = {
      ...restProps.style
    }

    if (this._animationBus) {
      const view = this.context.view || this.context.pager.getView(index)
      if (view) {
        style = {
          ...restProps.style,
          ...this._animationBus.getStyles(view)
        }
      }
    }

    return createElement(tag,
      specialAssign({ style }, this.props, checkedProps)
    )
  }
}

export default AnimatedView
