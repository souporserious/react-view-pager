import React, { Component, PropTypes, createElement } from 'react'
import { StaggeredMotion, spring, presets } from 'react-motion'
import Measure from 'react-measure'

class Slideable extends Component {
  static propTypes = {
    component: PropTypes.string,
    defaultHeight: PropTypes.number,
    springConfig: PropTypes.array,
    toggle: PropTypes.bool,
    forceAutoHeight: PropTypes.bool,
    measure: PropTypes.bool,
    instant: PropTypes.bool,
    onSlideEnd: PropTypes.func
  }

  static defaultProps = {
    component: 'div',
    defaultHeight: 0,
    springConfig: presets.noWobble,
    toggle: false,
    forceAutoHeight: false,
    measure: true,
    instant: false,
    onSlideEnd: () => null
  }

  state = {
    height: null
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.toggle !== nextProps.toggle ||
           this.state.height !== nextState.height
  }

  _getEndValues = (prevValue) => {
    const { toggle, defaultHeight, springConfig, instant } = this.props
    const config = instant ? [] : springConfig
    const height = toggle ? (this.state.height || defaultHeight) : defaultHeight

    if(prevValue && prevValue[0].height === height) {
      this.props.onSlideEnd()
    }

    return [{height: spring(height, config)}]
  }

  render() {
    const { toggle, component, className, defaultHeight, springConfig, style, children, forceAutoHeight, measure, instant } = this.props;
    const childrenToRender = createElement(
      StaggeredMotion,
      {
        styles: this._getEndValues
      },
      (values) => {
        const height = values[0].height
        
        return createElement(
          component,
          {
            className,
            style: {
              height: instant || (height === this.state.height) ? '' : height,
              overflow: 'hidden',
              ...style
            }
          },
          children
        )
      }
    )

    return createElement(
      Measure,
      {
        clone: true,
        forceAutoHeight,
        whitelist: ['height'],
        onChange: d => {
          if(measure) {
            this.setState({height: d.height})
          }
        }
      },
      childrenToRender
    )
  }
}

export default Slideable