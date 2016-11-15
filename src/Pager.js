import PagerElement from './PagerElement'

function modulo(val, max) {
  return ((val % max) + max) % max
}

function clamp(val, min, max) {
  return Math.min(Math.max(min, val), max)
}

function between(val, a, b) {
  return val >= Math.min(a, b) && val <= Math.max(a, b)
}

function range(start, end) {
  return Array.from({ length: end }, (v, k) => k + start)
}

class Pager {
  constructor(options = {}) {
    this.views = []
    this.currentIndex = 0
    this.currentView = null
    this.trackPosition = 0
    this.isSwiping = false

    this.options = {
      axis: 'x',
      align: 0,
      contain: false,
      infinite: false,
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

  addView(node) {
    const { align } = this.options
    const index = this.views.length
    const view = new PagerElement({
      node,
      pager: this
    })

    // add view to collection
    // TODO: allow option to prepend, insert, or append
    this.views.push(view)

    // set target position
    let target = this.getStartCoords(index)

    if (align) {
      target += this.getAlignOffset(view)
    }

    view.target = target

    // set this as the first view if there isn't one
    if (!this.currentView) {
      this.currentView = view
    }

    // with each view added we need to re-calculate positions
    this.positionViews()

    return view
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
    this.setPositionValue()
  }

  setPositionValue(trackPosition = this.currentView ? this.currentView.target : 0) {
    const { infinite, contain } = this.options
    const trackSize = this.getTrackSize()

    if (infinite && !this.isSwiping) {
      // we offset by a track multiplier so infinite animation works as expected
      trackPosition -= (Math.floor(this.currentIndex / this.views.length) || 0) * trackSize
    }

    if (contain && !this.isSwiping) {
      trackPosition = clamp(trackPosition, this.frame.getSize() - trackSize, 0)
    }

    this.trackPosition = trackPosition
  }

  getFrameSize(auto = this.options.auto) {
    const { viewsToShow, infinite, axis } = this.options
    let maxHeight = 0
    let maxWidth = 0

    if (auto) {
      if (viewsToShow !== 'auto') {
        const currentViews = []

        // gather all current indices
        for (let i = this.currentIndex; i <= this.currentIndex + (viewsToShow - 1); i++) {
          currentViews.push(
            infinite
              ? modulo(i, this.views.length)
              : clamp(i, 0, this.views.length - 1)
          )
        }

        // loop through current views and gather the biggest dimensions
        this.views.forEach((view, index) => {
          if (currentViews.indexOf(index) <= -1) return

          const width = view.getSize('width')
          const height = view.getSize('height')

          if (axis === 'x') {
            maxWidth += width
            if (height > maxHeight) {
              maxHeight = height
            }
          } else {
            maxHeight += height
            if (width > maxWidth) {
              maxWidth = width
            }
          }
        })
      } else {
        maxWidth = this.currentView.getSize('width')
        maxHeight = this.currentView.getSize('height')
      }
    } else {
      maxWidth = this.frame.getSize('width')
      maxHeight = this.frame.getSize('height')
    }

    return {
      width: maxWidth,
      height: maxHeight
    }
  }

  getTrackSize() {
    let size = 0
    this.views.forEach(view => {
      size += view.getSize()
    })
    return size
  }

  getView(index) {
    return this.views[modulo(index, this.views.length)]
  }

  // how much to offset the view defined by the align option
  getAlignOffset(view) {
    const frameSize = this.frame.getSize()
    const viewSize = view.getSize()
    return (frameSize - viewSize) * this.options.align
  }

  getTransformValue(trackPosition = this.trackPosition) {
    const { infinite, contain } = this.options
    const position = { x: 0, y: 0 }

    if (infinite) {
      const trackSize = this.getTrackSize()
      trackPosition = modulo(trackPosition, -trackSize) || 0
    }

    position[this.options.axis] = trackPosition

    return `translate3d(${position.x}px, ${position.y}px, 0)`
  }

  // where the view should start
  getStartCoords(index) {
    let target = 0
    this.views.slice(0, index).forEach(view => {
      target -= view.getSize()
    })
    return target
  }

  resetViews() {
    // reset back to a normal index
    this.setCurrentView(0, modulo(this.currentIndex, this.views.length))
  }

  positionViews(trackPosition = 0) {
    const { infinite, align } = this.options
    const frameSize = this.frame.getSize()
    const trackSize = this.getTrackSize()

    trackPosition = modulo(trackPosition, -trackSize)

    this.views.reduce((lastPosition, view, index) => {
      const viewSize = view.getSize()
      const nextPosition = lastPosition + viewSize
      let position = lastPosition

      if (infinite) {
        // shift views around so they are always visible in frame
        if (nextPosition + (viewSize * align) < Math.abs(trackPosition)) {
          position += trackSize
        } else if (lastPosition > (frameSize - trackPosition)) {
          position -= trackSize
        }
      }

      view.setPosition(position)

      return nextPosition
    }, 0)
  }
}

export default Pager
