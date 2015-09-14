import React, { Component, PropTypes } from 'react';
import { Slider } from '../src/index';

import './main.scss';

class App extends Component {
  constructor() {
    super();
    this.slider = null;
    this.state = {
      slides: [0, 1, 2]
    }
  }

  prev() {
    this.refs['slider'].prev();
  }

  next() {
    this.refs['slider'].next();
  }
  
  render() {
    return(
      <div>
        <Slider ref="slider">
          {this.state.slides.map((slide, i) => <li key={i} className="slide" />)}
        </Slider>
        <nav className="slider__controls">
          <a className="slider__control slider__control--prev" onClick={this.prev.bind(this)}>Prev</a>
          <a className="slider__control slider__control--next" onClick={this.next.bind(this)}>Next</a>
        </nav>
      </div>
    );
  }
}

React.render(<App />, document.body);