## React Motion Slider 0.1.0

Slider/Carousel powered by React Motion.

## Example Usage
![alt tag](images/react-motion-slider.gif)

```
<div>
  <Slider
    ref="slider"
    draggable={true}
    currentKey={'slide-1'}
    springConfig={[262, 24]}
    swipeThreshold={10}
    flickTimeout={300}
    slidesToShow={1}
    slidesToMove={1}
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
### 0.1.0
**Breaking Changes**
`defaultSlide` prop is now `currentKey`, pass the slides key to navigate to it

exposed as the component `Slider` now instead of and an object

## TODOS

- [x] touch support
- [x] handle dragging outside of slider
- [x] add props to allow flexibility
- [ ] remove dependency on React Measure
- [ ] infinite navigation
- [ ] keyboard support
- [ ] ARIA support