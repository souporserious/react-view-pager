## React Motion Slider 0.2.0

Slider/Carousel powered by React Motion.

## Disclaimer
This is highly experimental. API is changing right now and props are going in and out. Working on a stable release as soon as possible. Any ideas or problems, please file an issue.

## Example Usage
```js
<div>
  <Slider
    ref="slider"
    component={'ul'} // define what tag to use for wrapper
    currentKey={'slide-1'} // move to a specific slide by passing it's key
    autoHeight={true} // animate slider wrapper
    sliderConfig={[262, 24]} // RM config for slider if using autoHeight
    slideConfig={[262, 24]} // RM config for slides 
    onChange={this._handleChange} // callback after moving to a new slide
  >
    {this.state.slides.map((slide, i) =>
      <li key={`slide-${i}`} className="slide" />
    )}
  </Slider>
  <nav className="slider__controls">
    <a className="slider__control slider__control--prev" onClick={() => this.refs['slider].prev()}>Prev</a>
    <a className="slider__control slider__control--next" onClick={() => this.refs['slider].next()}>Next</a>
  </nav>
</div>
```

## CHANGELOG
### 0.2.0
**Breaking Changes**
Refactored almost all code, somewhat similiar API, touch support and some other props were removed for now, will be back in soon

Slider now moves directly to new slides rather than running through everything in between

If using a custom component be sure to pass the `style` prop passed in to apply proper styles for moving slides around. Look in example folder for implementation.

### 0.1.0
**Breaking Changes**
`defaultSlide` prop is now `currentKey`, pass the slides key to navigate to it

exposed as the component `Slider` now instead of and an object