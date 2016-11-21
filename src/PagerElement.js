class PagerElement {
  constructor({ node, pager, width, height }) {
    this.node = node
    this.pager = pager
    this.x = this.y = 0
    this.setSize(width, height)
  }

  setSize(width, height) {
    this.width = width || this.node.offsetWidth
    this.height = height || this.node.offsetHeight
  }

  setPosition(position) {
    this[this.pager.options.axis] = position
  }

  getSize(dimension) {
    if (dimension === 'width' || dimension === 'height') {
      return this[dimension]
    } else {
      const axis = this.pager.options.axis
      return this[axis === 'x' ? 'width' : 'height']
    }
  }

  getPosition() {
    return this[this.pager.options.axis]
  }
}

export default PagerElement
