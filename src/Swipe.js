function getTouchEvent(e) {
  return e.touches && e.touches[0] || e
}

class Swipe {
  constructor(pager) {
    this.pager = pager
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
    this._startTrack = this.pager.currentTween
    this._startSwipe = {
      x: pageX,
      y: pageY
    }

    // determine if a flick or not
    this._isFlick = true

    setTimeout(() => {
      this._isFlick = false
    }, this.pager.options.flickTimeout)
  }

  _onSwipeMove = (e) =>  {
    // bail if we aren't swiping
    if (!this.pager.isSwiping) return

    const { swipeThreshold, axis } = this.pager.options
    const { pageX, pageY } = getTouchEvent(e)

    // determine how much we have moved
    this._swipeDiff = {
      x: this._startSwipe.x - pageX,
      y: this._startSwipe.y - pageY
    }

    if (this._isSwipe(swipeThreshold)) {
      e.preventDefault()
      e.stopPropagation()

      const swipeDiff = this._swipeDiff[axis]
      const trackPosition = this._startTrack - swipeDiff

      this.pager.setPositionValue(trackPosition)

      this.pager.emit('swipeMove', trackPosition)
    }
  }

  _onSwipeEnd = () =>  {
    const { frame, currentView, trackPosition } = this.pager
    const { swipeThreshold, viewsToMove, axis, infinite } = this.pager.options
    const threshold = this._isFlick
      ? swipeThreshold
      : (currentView.getSize() * viewsToMove) * swipeThreshold

    this.pager.isSwiping = false

    if (this._isSwipe(threshold)) {
      (this._swipeDiff[axis] < 0)
        ? this.pager.prev()
        : this.pager.next()
    } else {
      this.pager.setPositionValue()
    }

    this.pager.emit('swipeEnd', trackPosition)
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
