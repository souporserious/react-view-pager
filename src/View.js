import ElementBase from './ElementBase'

class View extends ElementBase {
  constructor(options) {
    super(options)
    this.top = this.left = {
      original: 0,
      offset: {
        pixel: 0,
        percent: 0
      }
    }
  }

  setCoords(position) {
    this[this.axis === 'y' ? 'top' : 'left'] = position
  }

  getCoords() {
    return this[this.axis === 'y' ? 'top' : 'left']
  }
}

export default View
