import View from './View'

class Views {
  constructor(axis, viewsToShow, infinite) {
    this.size = 0
    this.axis = axis
    this.viewsToShow = viewsToShow
    this.infinite = infinite
    this.collection = []
  }

  setFrame(frame) {
    this.frame = frame
  }

  setTrack(track) {
    this.track = track
  }

  addView(options) {
    const lastView = this.collection[options.index - 1]
    const view = new View({
      axis: this.axis,
      track: this.track,
      ...options
    })

    // add view to collection
    this.collection.push(view)

    // calculate the size of the slider as views are added
    this.size += view.getSize()

    // hydrate positions every time a new view is added
    this.setPositions()
  }

  removeView(node) {
    // subtract this view from full size
    this.size -= view.getSize()
  }

  setPositions() {
    // bail if frame or track haven't been set yet
    if (!this.frame && !this.track) return

    const frameSize = this.frame.getSize()
    const trackSize = this.getTotalSize()
    const trackPosition = this.track.getPosition()
    const startCoords = { top: 0, left: 0 }

    this.collection.reduce((lastView, view) => {
      const lastPosition = lastView && lastView.getCoords().original || 0
      const nextPosition = lastPosition + (view.getSize() / (this.viewsToShow || 1))
      let offsetPosition = lastPosition

      // offset slides in the proper position when wrapping
      if (this.infinite) {
        if (nextPosition < Math.abs(trackPosition)) {
          offsetPosition += trackSize
        } else if (lastPosition > (frameSize - trackPosition)) {
          offsetPosition -= trackSize
        }
      }

      view.setCoords({
        original: nextPosition,
        offset: {
          pixel: offsetPosition,
          percent: this.getPercentValue(offsetPosition)
        }
      })

      return view
    }, null)
  }

  getTotalSize() {
    if (this.viewsToShow) {
      return (this.frame.getSize() / this.viewsToShow) * this.collection.length
    } else {
      const dimension = (this.axis === 'x') ? 'width' : 'height'
      let size = 0

      this.collection.forEach(view => {
        size += view[dimension]
      })

      return size
    }
  }

  getStartCoords(index) {
    let target = 0
    this.collection.slice(0, index).forEach(view => {
      target -= (view.getSize() / (this.viewsToShow || 1))
    })
    return target
  }

  getPercentValue(position) {
    return Math.round(position / this.frame.getSize() * 10000) * 0.01
  }
}

export default Views
