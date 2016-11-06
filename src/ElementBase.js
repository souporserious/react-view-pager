class ElementBase {
  constructor({ node, axis, width, height }) {
    this.node = node
    this.axis = axis
    this.x = this.y = 0
    this.setSize(width, height)
  }

  setSize(width, height) {
    this.width = width || this.node.offsetWidth
    this.height = height || this.node.offsetHeight
  }

  setPosition(position) {
    this[this.axis] = position
  }

  getSize(dimension) {
    if (dimension === 'width' || dimension === 'height') {
      return this[dimension]
    } else {
      return this[this.axis === 'x' ? 'width' : 'height']
    }
  }

  getPosition() {
    return this[this.axis]
  }
}

export default ElementBase
