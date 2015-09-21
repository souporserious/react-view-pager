## React Motion Slider 0.0.2

Slider/Carousel powered by React Motion.

## Example Usage
![alt tag](images/react-motion-slider.gif)

```js
<div>
  <Slider
    ref="slider"
    draggable={true}
    defaultSlide={0}
    springConfig={[262, 24]}
    swipeThreshold={10}
    flickTimeout={300}
    slidesToShow={1}
    slidesToMove={1}
  >
    {this.state.slides.map((slide, i) => <li key={i} className="slide" />)}
  </Slider>
  <nav className="slider__controls">
    <a className="slider__control slider__control--prev" onClick={() => this.refs['slider].prev()}>Prev</a>
    <a className="slider__control slider__control--next" onClick={() => this.refs['slider].next()}>Next</a>
  </nav>
</div>
```

## TODOS

- [x] touch support
- [x] handle dragging outside of slider
- [x] add props to allow flexibility
- [ ] infinite navigation
- [ ] keyboard support
- [ ] ARIA support
