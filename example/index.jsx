import React, { Component, PropTypes } from 'react'
import Alt from 'alt'
import connectToStores from 'alt/utils/connectToStores'
import Slideable from './Slideable'
import Slider from '../src/react-motion-slider'

import './main.scss';

const alt = new Alt();

class RouterActions {
  constructor() {
    this.generateActions('moveTo');
  }
  moveTo(route) {
    this.dispatch(route)
  }
}

const routerActions = alt.createActions(RouterActions);

class RouterStore {
  constructor() {
    const {moveTo} = routerActions
    this.bindListeners({moveTo})
  }
  currentRoute = 'slide-0'

  moveTo = (route) => {
    this.currentRoute = route
  }
}

const routerStore = alt.createStore(RouterStore);


class One extends Component {
  render() {
    return(
      <div className="c c1">
        <h1>Component 1</h1>
        <div>
          <a href="#" onClick={() => routerActions.moveTo('slide-2')}>
            Move to Component Three.
          </a>
        </div>
      </div>
    )
  }
}

class Two extends Component {
  state = {toggle: false}
  
  _handleToggle = () => {
    this.setState({toggle: !this.state.toggle});
  }

  renders() {
    return(
      <div className="c c2">
        <button onClick={this._handleToggle}>Toggle</button>
        <Slideable
          forceAutoHeight={true}
          toggle={!this.state.toggle}
        >
          <div>
            <h1>Component 2</h1>
          </div>
        </Slideable>
      </div>
    )
  }
  render() {
    return(
      <div className="c c2">
        <h1>Component 2</h1>
        <div>
          <a href="#" onClick={() => routerActions.moveTo('slide-2')}>
            Move to Component Three.
          </a>
        </div>
      </div>
    )
  }
}

class Three extends Component {
  prev() {
    this.refs['slider'].prev();
  }

  next() {
    this.refs['slider'].next();
  }

  renders() {
    return(
      <div className="c c3">
        <h1>Component 3</h1>
        <div className="slider-wrapper">
          <Slider
            ref="slider"
          >
            <div style={{flex: 1}}>Slide 1</div>
            <div style={{flex: 1}}>Slide 2</div>
            <div style={{flex: 1}}>Slide 3</div>
          </Slider>
        </div>
        <nav className="slider__controls">
          <a className="slider__control slider__control--prev" onClick={this.prev.bind(this)}>Prev</a>
          <a className="slider__control slider__control--next" onClick={this.next.bind(this)}>Next</a>
        </nav>
      </div>
    )
  }

  render() {
    return(
      <div className="c c3">
        <h1>Component 3</h1>
        <div>
          <a href="#" onClick={() => routerActions.moveTo('slide-2')}>
            Move to Component Three.
          </a>
        </div>
      </div>
    )
  }
}

class View extends Component {
  render() {
    const { style } = this.props
    return(
      <div
        className="slide"
        style={style}
      >
        {this.props.children}
      </div>
    )
  }
}

@connectToStores
class App extends Component {
  _slider = null
  state = {
    slides: [One, Two, Three]
  }

  static getStores() {
    return [routerStore]
  }

  static getPropsFromStores() {
    return routerStore.getState()
  }

  prev() {
    this.refs['slider'].prev();
  }

  next() {
    this.refs['slider'].next();
  }
  
  render() {
    const { slides } = this.state
    const slideCount = slides.length
    const slideWidth = (100/slideCount).toFixed(2)

    return(
      <div>
        <div className="slider-wrapper">
          <Slider
            ref="slider"
            currentKey={this.props.currentRoute}
          >
            {
              this.state.slides.map((InnerView, i) => 
                <View key={`slide-${i}`} width={slideWidth}>
                  <InnerView/>
                </View>
              )
            }
          </Slider>
        </div>
        <nav className="slider__controls">
          <a className="slider__control slider__control--prev" onClick={this.prev.bind(this)}>Prev</a>
          <a className="slider__control slider__control--next" onClick={this.next.bind(this)}>Next</a>
        </nav>
      </div>
    );
  }
}

React.render(<App />, document.body);