## React Motion Slider

[![Dependency Status](https://david-dm.org/souporserious/react-motion-slider.svg)](https://david-dm.org/souporserious/react-motion-slider)

Slider/Carousel powered by React Motion.

![react-motion-slider](images/react-motion-slider.gif)

## Help Wanted
This is highly experimental right now. The idea behind this slider is it moves each slide independently rather than on a track. The main benefit of this is that it allows moving to the next slide immediately rather than traveling through every slide in between as well as having an infinite slider. Working on a stable release as soon as possible. Any ideas or problems, please file an issue. Any help is greatly appreciated and welcome.

## Example Usage
```js
<div>
  <Slider
    ref="slider"
    component="ul" // define what tag to use for wrapper
    currentKey="slide-1" // move to a specific slide by passing it's key
    autoHeight={true} // animate slider wrapper
  >
    {this.state.slides.map((slide, i) =>
      <li key={`slide-${i}`} className="slide" />
    )}
  </Slider>
  <nav className="slider__controls">
    <a className="slider__control slider__control--prev" onClick={() => this.refs['slider'].prev()}>Prev</a>
    <a className="slider__control slider__control--next" onClick={() => this.refs['slider'].next()}>Next</a>
  </nav>
</div>
```

## Props
#### `component`: PropTypes.string
#### `vertical`: PropTypes.bool
#### `currentKey`: PropTypes.any
#### `currentIndex`: PropTypes.number
#### `slidesToShow`: PropTypes.number
#### `slidesToMove`: PropTypes.number
#### `swipe`: PropTypes.oneOf([true, false, 'mouse', 'touch'])
#### `swipeThreshold`: PropTypes.number
#### `flickTimeout`: PropTypes.number
#### `springConfig`: React.PropTypes.objectOf(React.PropTypes.number

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

## CHANGELOG
### 0.3.0
**Breaking Changes**
Upgraded to React Motion 0.3.0

### 0.2.0
**Breaking Changes**
Refactored almost all code, somewhat similiar API, touch support and some other props were removed for now, will be back in soon

Slider now moves directly to new slides rather than running through everything in between

If using a custom component be sure to pass the `style` prop passed in to apply proper styles for moving slides around. Look in example folder for implementation.

### 0.1.0
**Breaking Changes**
`defaultSlide` prop is now `currentKey`, pass the slides key to navigate to it

exposed as the component `Slider` now instead of and an object
