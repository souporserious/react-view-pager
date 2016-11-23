## React View Pager

[![Dependency Status](https://david-dm.org/souporserious/react-view-pager.svg)](https://david-dm.org/souporserious/react-view-pager)

View-Pager/Slider/Carousel powered by React Motion.

![react-motion-slider](example/images/react-view-pager.gif)

## Usage

`yarn add react-view-pager`

`npm install react-view-pager --save`

```html
<script src="https://unpkg.com/react-view-pager/dist/react-view-pager.js"></script>
(UMD library exposed as `Reactpager`)
```

## Example Usage
```js
import { Frame, Track } from 'react-view-pager'

<div>
  <Frame
    ref={c => this.pager = c}
    viewsToShow={2}
    infinite
    className="frame"
  >
    <Track className="track">
      <div className="view">1</div>
      <div className="view">2</div>
      <div className="view">3</div>
      <div className="view">4</div>
    </Track>
  </Frame>
  <nav className="pager-controls">
    <a
      className="pager-control pager-control--prev"
      onClick={() => this.pager.prev()}
    >
      Prev
    </a>
    <a
      className="pager-control pager-control--next"
      onClick={() => this.pager.next()}
    >
      Next
    </a>
  </nav>
</div>
```

## `Frame` Props

### `tag`: PropTypes.string
The HTML tag for this element. Defaults to `div`.

### `currentView`: PropTypes.any

Specify the index or key of a view to move to that view. Use with `beforeViewChange` to control the state of the pager.

### `viewsToShow`: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])])

The number of views visible in the frame at one time. Defaults to `1`. Use `auto` to respect the views's natural or defined dimensions.

### `viewsToMove`: PropTypes.number

The number of views to move upon using `prev` and `next` methods. Defaults to `1`.

### `align`: PropTypes.number

Pass any number to offset the view from the start of the track. For example, `0` aligns to the start of the track, `0.5` to the center, and `1` aligns to the end.

### `contain`: PropTypes.bool

Prevents empty space from showing in frame. Defaults to `false`.

### `infinite`: PropTypes.bool

Prepare your pager for intergalactic space travel. Allows the track to wrap to the beginning/end when moving to a view. To infinity and beyond!

### `instant`: PropTypes.bool

Move to a view instantly without any animation. This will control the internal `instant` state inside of the component.

### `axis`: PropTypes.oneOf(['x', 'y'])

Which axis the track moves on. Defaults to `x`.

### `autoSize`: PropTypes.bool

Animates the wrapper's width and height to fit the current view. Defaults to `false`.

### `animations`: PropTypes.array

Define a limitless array of animation stops. Each object in the array requires a `name` and `stops` property along with an optional `unit` property.

```js
// scale and fade views as they enter and leave
const animations = [{
  name: 'scale',
  stops: [
    [-200, 0.85],
    [0, 1],
    [200, 0.85]
  ]
}, {
  name: 'opacity',
  stops: [
    [-200, 0.15],
    [0, 1],
    [200, 0.15]
  ]
}]
```

### `swipe`: PropTypes.oneOf([true, false, 'touch', 'mouse'])

Enable touch and/or mouse dragging. Defaults to `true`.

### `swipeThreshold`: PropTypes.number

The amount the user must swipe to advance views. `(frameWidth * swipeThreshold)`. Defaults  to `0.5`.

### `flickTimeout`: PropTypes.number

The amount of time in milliseconds that determines if a swipe was a flick or not.

### `accessibility`: PropTypes.bool

Enable tabbing and keyboard navigation.

### `springConfig`: React.PropTypes.objectOf(React.PropTypes.number)

Accepts a [React Motion spring config](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig).

### `rightToLeft`: PropTypes.bool (Coming Soon)

### `lazyLoad`: PropTypes.bool (Coming Soon)

### `beforeViewChange`: PropTypes.func

Prop callback fired before view change. Passes back the newly selected index.

### `afterViewChange`: PropTypes.fun

Prop callback fired after view change.

### Public methods
### `prev`

Moves to the previous view.

### `next`

Advances to the next view.

### `scrollTo`

Scroll to a view by it's index or key.

## `Track` Props

### `tag`: PropTypes.string
The HTML tag for this element. Defaults to `div`.

### `springConfig`: React.PropTypes.objectOf(React.PropTypes.number)

Accepts a [React Motion spring config](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig).

### `onSwipeStart`: PropTypes.func

Prop callback fired before swipe.

### `onSwipeMove`: PropTypes.func

Prop callback fired during swipe.

### `onSwipeEnd`: PropTypes.func

Prop callback fired after swipe.

### `onScroll`: PropTypes.func

Prop callback fired when track is scrolling. Useful for parallax or progress bars.

## Running Locally

clone repo

`git clone git@github.com:souporserious/react-view-pager.git`

move into folder

`cd ~/react-view-pager`

install dependencies

`npm install`

run dev mode

`npm run dev`

open your browser and visit: `http://localhost:8080/`
