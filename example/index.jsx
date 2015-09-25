import React, { Component, PropTypes } from 'react'
import Alt from 'alt'
import connectToStores from 'alt/utils/connectToStores'
import { Slider } from '../src/index'

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
  currentRoute = 'slide-1'

  moveTo = (route) => {
    this.currentRoute = route
  }
}

const routerStore = alt.createStore(RouterStore);


class One extends Component {
  render() {
    return(
      <div className="c-1" style={{height: 250}}>
        Component 1
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
  render() {
    return <div className="c-2" style={{height: 300}}>Component 2</div>
  }
}

class Three extends Component {
  render() {
    return <div className="c-3" style={{height: 200}}>Component 3</div>
  }
}

class View extends Component {
  render() {
    return(
      <div className="slide" style={{width: this.props.width + '%'}}>
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
        <Slider
          ref="slider"
          calcWidths={true}
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
        <nav className="slider__controls">
          <a className="slider__control slider__control--prev" onClick={this.prev.bind(this)}>Prev</a>
          <a className="slider__control slider__control--next" onClick={this.next.bind(this)}>Next</a>
        </nav>
      </div>
    );
  }
}

React.render(<App />, document.body);