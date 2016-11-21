import React, { Component, Children, PropTypes, createElement } from 'react'
import Pager from './Pager'

class ImageView extends Component {
  static contextTypes = {
    viewPager: PropTypes.instanceOf(Pager)
  }

  _handleLoaded = (e) => {
    // hydrate the pager now that the image has loaded
    this.context.viewPager.hydrate()

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
