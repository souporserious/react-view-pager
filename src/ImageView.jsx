import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import Pager from './Pager'

class ImageView extends Component {
  static contextTypes = {
    pager: PropTypes.instanceOf(Pager)
  }

  _handleLoaded = (e) => {
    // hydrate the pager now that the image has loaded
    this.context.pager.hydrate()

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(e)
    }
  }

  render() {
    return createElement('img', {
      ...this.props,
      onLoad: this._handleLoaded
    })
  }
}

export default ImageView
