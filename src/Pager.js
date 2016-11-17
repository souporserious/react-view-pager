import Events from 'minivents'
import PagerElement from './PagerElement'

function modulo(val, max) {
  return ((val % max) + max) % max
}

function clamp(val, min, max) {
  return Math.min(Math.max(min, val), max)
}

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0)
}

function max(arr) {
  return Math.max.apply(null, arr)
}

class View extends PagerElement {
  constructor({ index, ...restOptions }) {
    super(restOptions)
    this.index = index
    this.setTarget()
  }

  setTarget() {
    let target = this.pager.getStartCoords(this.index)

    if (this.pager.options.align) {
      target += this.pager.getAlignOffset(this)
    }

    this.target = target
  }

  getTarget() {
    return this.target
  }
}

class Pager extends Events {
  constructor(options = {}) {
    super()

    this.views = []
    this.currentIndex = 0
    this.currentView = null
    this.currentTween = 0
    this.trackPosition = 0
    this.isSwiping = false

    this.options = {
      axis: 'x',
      align: 0,
      contain: false,
      infinite: false,
      viewsToMove: 1,
      autoSize: false,
      ...options
    }

    window.addEventListener('resize', this.updateSizes)
  }

  updateSizes = () => {
    this.frame.setSize()
    this.track.setSize()
    this.views.forEach(view => {
      view.setSize()
      view.setTarget()
    })
    this.positionViews()
    this.setPositionValue()
    this.emit('resize')
  }

  addFrame(node) {
    this.frame = new PagerElement({ node, pager: this })
  }

  addTrack(node) {
    this.track = new PagerElement({ node, pager: this })
  }

  addView(node) {
    const index = this.views.length
    const view = new View({
      node,
      index,
      pager: this
    })

    // add view to collection
    this.views.push(view)

    // set this as the first view if there isn't one yet
    if (!this.currentView) {
      this.setCurrentView(0, index, true)
    }

    // with each view added we need to re-calculate positions
    this.positionViews()

    // fire an event
    this.emit('viewAdded')

    return view
  }

  removeView(view) {
    // filter out view
    this.views = this.views.filter(_view => view !== _view)

    // re-calculate view positions
    this.positionViews()
  }

  prev() {
    this.setCurrentView(-1)
  }

  next() {
    this.setCurrentView(1)
  }

  setCurrentView(direction, index = this.currentIndex, suppressEvent) {
    const { viewsToMove, infinite, onChange } = this.options
    const newIndex = index + (direction * viewsToMove)
    const currentIndex = infinite
      ? newIndex
      : clamp(newIndex, 0, this.views.length - 1)

    this.currentIndex = currentIndex
    this.currentView = this.getView(currentIndex)
    this.setPositionValue()

    if (!suppressEvent) {
      this.emit('viewChange', currentIndex)
    }
  }

  setPositionValue(trackPosition = this.currentView ? this.currentView.target : 0) {
    if (!this.isSwiping) {
      const { viewsToShow, autoSize, infinite, contain } = this.options
      const trackSize = this.getTrackSize()

      if (infinite) {
        // we offset by a track multiplier so infinite animation can take advantage of
        // physics by animating to a large value, the final value provided in getTransformValue
        // will return the proper wrapped value
        trackPosition -= (Math.floor(this.currentIndex / this.views.length) || 0) * trackSize
      }

      if (contain) {
        const trackEndOffset = ((viewsToShow === 'auto' && autoSize) || viewsToShow <= 1) ? 0 : this.frame.getSize()
        trackPosition = clamp(trackPosition, trackEndOffset - trackSize, 0)
      }
    }

    this.trackPosition = trackPosition
  }

  getMaxDimensions(views) {
    const { axis } = this.options
    const widths = views.map(view => view.getSize('width'))
    const heights = views.map(view => view.getSize('height'))
    return {
      width: (axis === 'x') ? sum(widths) : max(widths),
      height: (axis === 'y') ? sum(heights) : max(heights)
    }
  }

  getFrameSize(autoSize = this.options.autoSize, fullSize = false) {
    const { infinite, contain, axis } = this.options
    let dimensions = {
      width: 0,
      height: 0
    }

    if (this.views.length) {
      if (autoSize) {
        // gather all current indices depending on options
        const currentViews = []
        const viewsToShow = isNaN(this.options.viewsToShow) ? 1 : this.options.viewsToShow
        let minIndex = this.currentIndex
        let maxIndex = this.currentIndex + (viewsToShow - 1)

        if (contain) {
          // if containing, we need to clamp the start and end indexes so we only return what's in view
          minIndex = clamp(minIndex, 0, this.views.length - viewsToShow)
          maxIndex = clamp(maxIndex, 0, this.views.length - 1)
          for (let i = minIndex; i <= maxIndex; i++) {
            currentViews.push(this.getView(i))
          }
        } else {
          for (let i = minIndex; i <= maxIndex; i++) {
            const index = infinite
              ? modulo(i, this.views.length)
              : clamp(i, 0, this.views.length - 1)
            currentViews.push(this.getView(index))
          }
        }
        dimensions = this.getMaxDimensions(currentViews)
      } else {
        dimensions = {
          width: this.frame.getSize('width'),
          height: this.frame.getSize('height')
        }
      }
    }

    if (fullSize) {
      return dimensions
    } else {
      return dimensions[axis === 'x' ? 'width' : 'height']
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

  getPercentValue(value, frameSize = this.getFrameSize()) {
    return Math.round((value / frameSize) * 1000) * 0.1
  }

  // where the view should start
  getStartCoords(index) {
    let target = 0
    this.views.slice(0, index).forEach(view => {
      target -= view.getSize()
    })
    return target
  }

  // how much to offset the view defined by the align option
  getAlignOffset(view) {
    const frameSize = this.frame.getSize()
    const viewSize = view.getSize()
    return (frameSize - viewSize) * this.options.align
  }

  getPositionValue(trackPosition = this.trackPosition) {
    const { infinite, contain } = this.options
    const position = { x: 0, y: 0 }

    // store the current animated value so we can reference it later
    this.currentTween = trackPosition

    // wrap the track position if this is an infinite track
    if (infinite) {
      const trackSize = this.getTrackSize()
      trackPosition = modulo(trackPosition, -trackSize) || 0
    }

    // emit a "scroll" event so we can do things based on the progress of the track
    this.emit('scroll', trackPosition)

    // set the proper transform axis based on our options
    position[this.options.axis] = trackPosition

    return position
  }

  resetViews() {
    // reset back to a normal index
    this.setCurrentView(0, modulo(this.currentIndex, this.views.length), true)
  }

  positionViews(trackPosition = 0) {
    const { infinite, align } = this.options
    const frameSize = this.getFrameSize()
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
