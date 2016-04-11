## React Motion Slider

[![Dependency Status](https://david-dm.org/souporserious/react-motion-slider.svg)](https://david-dm.org/souporserious/react-motion-slider)

Slider/Carousel powered by React Motion.

![react-motion-slider](images/react-motion-slider.gif)

## Usage

`npm install react-motion-slider --save`

`bower install react-motion-slider --save`

## Example Usage
```js
<div>
  <Slider
    ref="slider"
    currentKey="slide-3" // move to a specific slide by passing its key
    autoHeight={true} // animate slider wrapper
  >
    {this.state.slides.map((slide, i) =>
      <li key={`slide-${i}`} className="slide" />
    )}
  </Slider>
  <nav className="slider__controls">
    <a
      className="slider__control slider__control--prev"
      onClick={() => this.refs['slider'].prev()}
    >
      Prev
    </a>
    <a
      className="slider__control slider__control--next"
      onClick={() => this.refs['slider'].next()}
    >
      Next
    </a>
  </nav>
</div>
```

## Props
### `currentKey`: PropTypes.any

Move to a slide by its key.

### `currentIndex`: PropTypes.number

Move to a slide by its index.

### `slidesToShow`: PropTypes.number

The amount of slides shown in view. Defaults to `1`.

### `slidesToMove`: PropTypes.number

The amount of slides to move upon using `prev` and `next` methods. Defaults to `1`.

### `autoHeight`: PropTypes.bool

Animates the wrapper height to fit the current slide. Defaults to `false`.

### `align`: PropTypes.oneOf(['left', 'center', 'right'])

Offsets the slide to align either `left` (default), `center`, or `right`.

### `swipe`: PropTypes.oneOf([true, false, 'touch', 'mouse'])

Enable touch and/or mouse dragging. Defaults to `true`.

### `swipeThreshold`: PropTypes.number

The amount the user must swipe to advance slides. `(sliderWidth * swipeThreshold)`. Defaults  to `0.5`

### `flickTimeout`: PropTypes.number

The amount of time in milliseconds that determines if a swipe was a flick or not.

### `springConfig`: React.PropTypes.objectOf(React.PropTypes.number)

Accepts a [React Motion spring config](https://github.com/chenglou/react-motion#--spring-val-number-config-springhelperconfig--opaqueconfig).

### `beforeSlide`: PropTypes.func(currentIndex, nextIndex)

Prop callback fired before slide change.

### `afterSlide`: PropTypes.fun(currentIndex)

Prop callback fired after slide change.

## Public methods
### `prev`

Moves to the previous slide.

### `next`

Advances to the next slide.

## Running Locally

clone repo

`git clone git@github.com:souporserious/react-motion-slider.git`

move into folder

`cd ~/react-motion-slider`

install dependencies

`npm install`

run dev mode

`npm run dev`

open your browser and visit: `http://localhost:8080/`
