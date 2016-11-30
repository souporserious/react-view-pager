import { clamp } from './utils'

class Keyboard {
  constructor(pager) {
    this.pager = pager
  }

  _handleKeyDown = (e) => {
    // handle respective key controls
    switch (e.key) {
      // move to the previous view
      case 'ArrowUp':
      case 'ArrowLeft':
        this.pager.prev()
        return;

      // move to the next view
      case 'ArrowDown':
      case 'ArrowRight':
      case ' ':
        this.pager.next()
        return;

      // move to first view
      case 'Home':
        this.pager.setCurrentView({ index: 0 })
        return;

      // move to last view
      case 'End':
        this.pager.setCurrentView({ index: this.pager.views.length - 1 })
        return;
    }

    // 1 - 9 keys mapped to respective slide number
    const maxNumKey = clamp(this.pager.views.length, 0, 9)

    for (let i = 1; i <= maxNumKey; i++) {
      if (+e.key === i) {
        this.pager.setCurrentView({ index: i - 1 })
      }
    }
  }

  getEvents() {
    const keyboardEvents = {}

    if (this.pager.options.accessibility) {
      keyboardEvents.onKeyDown = this._handleKeyDown
    }

    return keyboardEvents
  }
}

export default Keyboard
