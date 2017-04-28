import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import Pager from './Pager'

class ViewPager extends Component {
  static childContextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  static propTypes = {
    tag: PropTypes.string
  }

  static defaultProps = {
    tag: 'div'
  }

  constructor(props) {
    super(props)

    const pager = new Pager()
    const forceUpdate = () => this.forceUpdate()

    // re-render the whole tree to update components on certain events
    pager.on('viewChange', forceUpdate)
    pager.on('hydrated', forceUpdate)

    this._pager = pager
  }

  getChildContext() {
    return {
      pager: this._pager
    }
  }

  componentDidMount() {
    // run a hydration on the next animation frame to obtain proper targets and positioning
    requestAnimationFrame(() => {
      this._pager.hydrate()
    })
  }

  getInstance() {
    return this._pager
  }

  render() {
    const { tag, ...restProps } = this.props
    return createElement(tag, restProps)
  }
}

export default ViewPager
