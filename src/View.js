import ElementBase from './PagerElement'

class View extends ElementBase {
  constructor({ index, align, ...restOptions }) {
    super(restOptions)
    this.position = (this.axis === 'x') ? 'left' : 'top'
    this.index = index
    this.align = align || 0.5
    this.top = this.left = {
      original: 0,
      target: 0,
      offset: {
        pixel: 0,
        percent: 0
      }
    }
  }

  setTarget(position) {
    // this.target = (this.getSize() * this.align) + position
    const { align, viewsToShow } = this.options
    const frameSize = this._frame.getSize()
    return (frameSize - (this.getSize() / (viewsToShow || 1))) * align
  }

  setCoords(position) {
    this[this.position] = position
  }

  getCoords() {
    return this[this.position]
  }
}

export default View
