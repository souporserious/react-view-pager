import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Alt from 'alt'
import connectToStores from 'alt/utils/connectToStores'
import Collapse from 'react-collapse'
import Slider from '../src/react-motion-slider'

import './main.scss';

const alt = new Alt();

class RouterActions {
  moveTo(route) {
    this.dispatch(route)
  }
}

const routerActions = alt.createActions(RouterActions);

class RouterStore {
  constructor() {
    const { moveTo } = routerActions
    this.bindListeners({moveTo})
  }
  currentRoute = 'slide-0'

  moveTo = (route) => {
    this.currentRoute = route
  }
}

const routerStore = alt.createStore(RouterStore);

class HeightActions {
  updateHeight(bool) {
    this.dispatch(bool)
  }
}

const heightActions = alt.createActions(HeightActions);

class HeightStore {
  constructor() {
    const { updateHeight } = heightActions
    this.bindListeners({updateHeight})
  }
  shouldUpdateHeight = false

  updateHeight = (bool) => {
    this.shouldUpdateHeight = bool
  }
}

const heightStore = alt.createStore(HeightStore);

class One extends Component {
  render() {
    return(
      <div>
        <h1>Component 1</h1>
        <div>
          <a href="#" onClick={() => routerActions.moveTo('slide-1')}>
            Move to Component Two.
          </a>
        </div>
      </div>
    )
  }
}

class Two extends Component {
  state = {
    toggle: true
  }

  render() {
    const { isCurrentSlide } = this.props
    const { toggle } = this.state

    return(
      <div>
        <button
          onClick={() => this.setState({toggle: !toggle})}
        >
          Toggle
        </button>
        <Collapse isOpened={toggle}>
          <div>
            <h1 style={{margin: 0}}>Component 2</h1>
          </div>
        </Collapse>
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

  render() {
    return(
      <div>
        <h1>Component 3</h1>
        <div className="slider-wrapper">
          <Slider
            ref="slider"
            className="slider"
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
        <div>
          <a href="#" onClick={() => routerActions.moveTo('slide-0')}>
            Move to Component One.
          </a>
        </div>
      </div>
    )
  }
}

class View extends Component {
  render() {
    const { style, index } = this.props

    return(
      <div
        className={`slide slide--${index + 1}`}
        style={{
          ...style,
          height: 200
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

@connectToStores
class App extends Component {
  state = {
    slides: [One, Two, Three]
  }

  static getStores() {
    return [routerStore, heightStore]
  }

  static getPropsFromStores() {
    return {
      ...routerStore.getState(),
      ...heightStore.getState()
    }
  }

  componentDidUpdate() {
  }

  prev = () => {
    this.refs['slider'].prev()
  }

  next = () => {
    this.refs['slider'].next()
  }

  _handleChange(key, index) {
  }

  _handleHeightUpdate = () => {
    this.refs['slider'].setHeight()
  }
  
  render() {
    const { slides } = this.state

    return(
      <div>
        <nav className="slider__controls">
          <a className="slider__control slider__control--prev" onClick={this.prev}>Prev</a>
          <a className="slider__control slider__control--next" onClick={this.next}>Next</a>
        </nav>
        <div className="slider-wrapper">
          <Slider
            ref="slider"
            className="slider"
            vertical
            autoHeight={true}
            slideConfig={[300, 30]}
            currentKey={this.props.currentRoute}
            onChange={this._handleChange}
          >
            {
              this.state.slides.map((InnerView, i) => 
                <View key={`slide-${i}`} index={i}>
                  <InnerView
                    isCurrentSlide={this.props.currentRoute === `slide-${i}`}
                    onHeightUpdate={this._handleHeightUpdate}
                  />
                </View>
              )
            }
          </Slider>
        </div>
        <nav className="slider__pager">
          {this.state.slides.map((slide, i) =>
            <a
              key={`page-${i}`}
              className="slider__page"
              onClick={() => routerActions.moveTo(`slide-${i}`)}
            >
              {i+1}
            </a>
          )}
        </nav>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'))