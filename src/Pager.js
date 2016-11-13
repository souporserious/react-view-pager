import PagerElement from './PagerElement'
import Events from 'minivents'

const emitter = new Events()

function modulo(val, max) {
  return ((val % max) + max) % max
}

function clamp(val, min, max) {
  return Math.min(Math.max(min, val), max)
}

function getTouchEvent(e) {
  return e.touches && e.touches[0] || e
}

// use to measure but not show element
// opacity: 0,
// pointer-events: none


class View extends PagerElement {
  constructor({ index, target, ...restOptions }) {
    super(restOptions)
    this.index = index
    this.target = 0
  }

  setTarget(position) {
    this.target = position
  }
}

class Pager {
  constructor(options = {}) {
    this.views = []
    this.currentIndex = 0
    this.trackPosition = 0
    this.currentView = null

    this.on = emitter.on
    this.off = emitter.off
    this.emit = emitter.emit

    this.options = {
      axis: 'x',
      align: 0,
      infinite: false,
      viewsToShow: 'auto',
      viewsToMove: 1,
      ...options
    }
  }

  addFrame(node) {
    this.frame = new PagerElement({ node, pager: this })
  }

  addTrack(node) {
    this.track = new PagerElement({ node, pager: this })
  }

  prev() {
    this.setCurrentView(-1)
  }

  next() {
    this.setCurrentView(1)
  }

  setCurrentView(direction, index = this.currentIndex) {
    const { viewsToMove, infinite, onChange } = this.options
    const newIndex = index + (direction * viewsToMove)
    const currentIndex = infinite
      ? newIndex
      : clamp(newIndex, 0, this.views.length - 1)

    this.currentIndex = currentIndex
    this.currentView = this.getView(currentIndex)
    this.positionTrack()
  }

  positionTrack() {
    const { infinite, align, contain } = this.options
    const frameSize = this.frame.getSize()
    const trackSize = this.getTrackSize()

    // set track position
    let trackPosition = -(this.currentView.target)

    // wrapping
    if (infinite) {
      // trackPosition = modulo(trackPosition, trackSize)
    }

    // alignment
    // if (align) {
    //   trackPosition += this._getAlignOffset()
    // }

    // contain
    // if (!bypassContain && contain) {
    //   position = clamp(position, frameSize - trackSize, 0)
    // }
    const scaleFactor = Math.ceil(this.currentIndex / this.views.length)

    trackPosition *= scaleFactor

    this.positionViews(trackPosition)

    this.emit('change')

    this.trackPosition = trackPosition
  }

  getTransformValue() {
    const position = { x: 0, y: 0 }
    position[this.options.axis] = modulo(this.trackPosition, this.getTrackSize())
    return `translate3d(${position.x}px, ${position.y}px, 0)`
  }

  getNumericViewsToShow() {
    const { viewsToShow } = this.options
    return isNaN(viewsToShow) ? 1 : viewsToShow
  }

  getStartCoords(index) {
    const viewsToShow = this.getNumericViewsToShow()
    let target = 0
    this.views.slice(0, index).forEach(view => {
      target -= view.getSize() / viewsToShow
    })
    return target
  }

  getAlignOffset(view) {
    const frameSize = this.frame.getSize()
    const viewSize = view.getSize()
    const viewsToShow = this.getNumericViewsToShow()
    return (frameSize - (viewSize / viewsToShow)) * this.options.align
  }

  // prepend insert append
  addView(node) {
    const { align } = this.options
    const index = this.views.length
    const view = new View({
      node,
      index,
      pager: this
    })

    // add view to collection
    this.views.push(view)

    // set target position
    let target = this.getStartCoords(index)

    if (align) {
      target += this.getAlignOffset(view)
    }

    view.setTarget(-target)

    // set this as the first view if there isn't one
    if (!this.currentView) {
      this.currentView = view
    }
  }

  removeView() {

  }

  onViewChange(view) {
    // use resize detector to do changes?
  }

  getView(index) {
    return this.views[modulo(index, this.views.length)]
  }

  positionViews(trackPosition = 0) {
    const { infinite, align } = this.options
    const frameSize = this.frame.getSize()
    const trackSize = this.getTrackSize()

    trackPosition = modulo(trackPosition, trackSize)

    this.views.reduce((lastPosition, view, index) => {
      const viewSize = view.getSize()
      const nextPosition = lastPosition + viewSize
      let position = lastPosition

      if (infinite) {
        // offset by one view as well as take the current alignment into account
        // so variable views don't shift in the middle of track animation
        const offset = viewSize + (viewSize * align)

        if (nextPosition + offset < Math.abs(trackPosition)) {
          position += trackSize
        } else if (lastPosition > (frameSize - trackPosition)) {
          position -= trackSize
        }
      }

      view.setPosition(position)

      return nextPosition
    }, 0)
  }

  getTrackSize() {
    const { viewsToShow, axis } = this.options

    if (viewsToShow !== 'auto') {
      return (this.frame.getSize() / viewsToShow) * this.views.length
    } else {
      const dimension = (axis === 'x') ? 'width' : 'height'
      let size = 0
      this.views.forEach(view => {
        size += view[dimension]
      })
      return size
    }
  }
}

export default Pager
