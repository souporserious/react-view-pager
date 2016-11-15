import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Collapse from 'react-collapse'
import Slider from '../src/react-motion-slider'

import './main.scss';

class One extends Component {
  render() {
    return (
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
    return (
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
    this.refs['slider'].prev()
  }

  next() {
    this.refs['slider'].next()
  }

  render() {
    return (
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
        style={{ ...style }}
      >
        {this.props.children}
      </div>
    )
  }
}

class Slide extends Component {
  render() {
    return (
      <div>
        Slide {this.props.index}
      </div>
    )
  }
}

// class App extends Component {
//   state = {
//     slides: [Slide, Slide, Slide, Slide, Slide, Slide, Slide],
//     currentKey: 'slide-3',
//     currentIndexes: [],
//     autoHeight: false,
//     vertical: false,
//     slidesToShow: 3,
//     slidesToMove: 1,
//     align: 'left',
//     instant: false
//   }
//
//   addSlide = () => {
//     this.setState({
//       slides: [...this.state.slides, Slide]
//     })
//   }
//
//   prev = () => {
//     this.refs['slider'].prev()
//   }
//
//   next = () => {
//     this.refs['slider'].next()
//   }
//
//   _handleChange = (nextIndexes, nextKey) => {
//     this.setState({
//       currentKey: nextKey,
//       currentIndexes: nextIndexes
//     })
//   }
//
//   render() {
//     const { currentKey, currentIndexes, slides, autoHeight, vertical, slidesToShow, slidesToMove, align, instant } = this.state
//     return (
//       <div>
//         <button onClick={this.addSlide}>
//           Add Slides
//         </button>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => this.setState({autoHeight: !autoHeight})}
//           />
//           Auto Height
//         </label>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => this.setState({vertical: !vertical})}
//           />
//           Vertical
//         </label>
//         <label>
//           <input
//             type="checkbox"
//             onChange={() => this.setState({instant: !instant})}
//           />
//           Instant
//         </label>
//         <label>
//           <input
//             type="number"
//             onChange={e => this.setState({slidesToShow: +e.target.value})}
//             value={slidesToShow}
//           />
//           Slides To Show
//         </label>
//         <label>
//           <input
//             type="number"
//             onChange={e => this.setState({slidesToMove: +e.target.value})}
//             value={slidesToMove}
//           />
//           Slides To Move
//         </label>
//         <select
//           onChange={e => this.setState({align: e.target.value})}
//           value={align}
//         >
//           <option value="left">Left</option>
//           <option value="center">Center</option>
//           <option value="right">Right</option>
//         </select>
//         <nav className="slider__controls">
//           <a className="slider__control slider__control--prev" onClick={this.prev}>Prev</a>
//           <a className="slider__control slider__control--next" onClick={this.next}>Next</a>
//         </nav>
//         <div className="slider-wrapper">
//           <Slider
//             ref="slider"
//             className="slider"
//             vertical={vertical}
//             slidesToShow={slidesToShow}
//             slidesToMove={slidesToMove}
//             autoHeight={autoHeight}
//             align={align}
//             instant={instant}
//             currentKey={currentKey}
//             onChange={this._handleChange}
//           >
//             {
//               this.state.slides.map((InnerView, i) =>
//                 <View key={`slide-${i}`} index={i}>
//                   <InnerView
//                     index={i}
//                     isCurrentSlide={this.props.currentRoute === `slide-${i}`}
//                     onHeightUpdate={this._handleHeightUpdate}
//                   />
//                 </View>
//               )
//             }
//           </Slider>
//         </div>
//         <nav className="slider__pager">
//           {this.state.slides.map((slide, i) =>
//             <a
//               key={`page-${i}`}
//               className={`slider__page ${currentIndexes.indexOf(i) > -1 ? 'slider__page--active' : ''}`}
//               onClick={() => this.setState({ currentKey: `slide-${i}` })}
//             >
//               {i}
//             </a>
//           )}
//         </nav>
//       </div>
//     )
//   }
// }

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [[500, 350], [800, 600], [800, 400], [700, 500], [200, 650], [600, 600]],
      activeIndex: 0,
      // size: '50%'
    }
  }

  render() {
    const { images, activeIndex, size } = this.state
    return (
      <div>
        <div>
          <button onClick={() => this.slider.prev()}>
            Prev
          </button>
          <input
            type="range"
            min={0}
            max={3}
            value={activeIndex}
            onChange={e => this.setState({ activeIndex: +e.target.value })}
          />
          <button onClick={() => this.slider.next()}>
            Next
          </button>
        </div>
        current view: {activeIndex + 1}
        <Slider
          ref={c => this.slider = c}
          currentView={activeIndex}
          // autoSize
          // viewsToShow={1}
          // viewsToMove={2}
          // axis="y"
          // align={0.5}
          infinite
          // contain
          onChange={index => this.setState({ activeIndex: index })}
        >
          <div className="cell cell-1" style={{ width: size ? size : 300, height: 100 }}>1</div>
          <div className="cell cell-2" style={{ width: size ? size : 175, height: 200 }}>2</div>
          <div className="cell cell-3" style={{ width: size ? size : 315, height: 300 }}>3</div>
          <div className="cell cell-4" style={{ width: size ? size : 125, height: 400 }}>4</div>
        </Slider>

        {/*<Slider axis="y">
          <div className="cell cell-1">1</div>
          <div className="cell cell-2">2</div>
          <div className="cell cell-3">3</div>
          <div className="cell cell-4">4</div>
        </Slider>*/}
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
