function getTouchEvent(e) {
  return e.touches && e.touches[0] || e
}

class Swipe {
  constructor(pager) {
    this.pager = pager
    this._trackStart = false
    this._swipeStart =
    this._swipeDiff = {
      x: 0,
      y: 0
    }
  }

  _isSwipe(threshold) {
    const { x, y } = this._swipeDiff
    return this.pager.options.axis === 'x'
      ? Math.abs(x) > Math.max(threshold, Math.abs(y))
      : Math.abs(x) < Math.max(threshold, Math.abs(y))
  }

  _onSwipeStart = (e) => {
    const { pageX, pageY } = getTouchEvent(e)

    // we're now swiping
    this.pager.isSwiping = true

    // store the initial starting coordinates
    this._swipeStart = {
      x: pageX,
      y: pageY
    }

    // reset swipeDiff
    this._swipeDiff = {
      x: 0,
      y: 0
    }

    // determine if a flick or not
    this._isFlick = true

    setTimeout(() => {
      this._isFlick = false
    }, this.pager.options.flickTimeout)

    this.pager.emit('swipeStart')
  }

  _onSwipeMove = (e) =>  {
    // bail if we aren't swiping
    if (!this.pager.isSwiping) return

    const { swipeThreshold, axis } = this.pager.options
    const { pageX, pageY } = getTouchEvent(e)

    // grab the current position of the track before
    if (!this._trackStart) {
      this._trackStart = this.pager.currentTween
    }

    // determine how much we have moved
    this._swipeDiff = {
      x: this._swipeStart.x - pageX,
      y: this._swipeStart.y - pageY
    }

    if (this._isSwipe(swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()

      const swipeDiff = this._swipeDiff[axis]
      const trackPosition = this._trackStart - swipeDiff

      this.pager.setPositionValue(trackPosition)

      this.pager.emit('swipeMove')
    }
  }

  _onSwipeEnd = () =>  {
    const { frame, currentView, trackPosition } = this.pager
    const { swipeThreshold, viewsToMove, axis, infinite } = this.pager.options
    const threshold = this._isFlick
      ? swipeThreshold
      : (currentView.getSize() * viewsToMove) * swipeThreshold

    // we've stopped swiping
    this.pager.isSwiping = false

    // reset start track so we can grab it again on the next swipe
    this._trackStart = false

    // don't move anything if there hasn't been an attempted swipe
    if (this._swipeDiff.x || this._swipeDiff.y) {
      // determine if we've passed the defined threshold
      if (this._isSwipe(threshold)) {
        if (this._swipeDiff[axis] < 0) {
          this.pager.prev()
        } else {
          this.pager.next()
        }
      }
      // if we didn't, reset back to original view
      else {
        this.pager.setPositionValue()
      }
    }

    this.pager.emit('swipeEnd')
  }

  _onSwipePast = () =>  {
    // perform a swipe end if we swiped past the component
    if (this.pager.isSwiping) {
      this._onSwipeEnd()
    }
  }

  getEvents() {
    const { swipe } = this.pager.options
    let swipeEvents = {}

    if (swipe === true || swipe === 'mouse') {
      swipeEvents.onMouseDown = this._onSwipeStart
      swipeEvents.onMouseMove = this._onSwipeMove
      swipeEvents.onMouseUp = this._onSwipeEnd
      swipeEvents.onMouseLeave = this._onSwipePast
    }

    if (swipe === true || swipe === 'touch') {
      swipeEvents.onTouchStart = this._onSwipeStart
      swipeEvents.onTouchMove = this._onSwipeMove
      swipeEvents.onTouchEnd = this._onSwipeEnd
    }

    return swipeEvents
  }
}

export default Swipe
