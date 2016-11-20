import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Collapse from 'react-collapse'
import { Frame, Track, ImageView } from '../src/react-motion-slider'

import './main.scss';

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
            value={+activeIndex}
            onChange={e => this.setState({ activeIndex: +e.target.value })}
          />
          <button onClick={() => this.slider.next()}>
            Next
          </button>
        </div>
        current view: {activeIndex + 1}
        <Frame
          ref={c => this.slider = c}
          currentView={activeIndex}
          autoSize
          // viewsToShow={2}
          // viewsToMove={2}
          // axis="y"
          // align={0.5}
          // infinite
          contain
          // onSwipeStart={() => console.log('swipe start')}
          // onSwipeMove={() => console.log('swipe move')}
          // onSwipeEnd={() => console.log('swipe end')}
          // onScroll={position => console.log(position)}
          beforeViewChange={({ from, to }) => {
            this.setState({ activeIndex: to[0] })
          }}
          // afterViewChange={() => console.log('after view change')}
          className="frame"
        >
          <Track className="track">
            <div className="view" style={{ width: size ? size : 500, height: 100 }}>1</div>
            <div className="view" style={{ width: size ? size : 175, height: 200 }}>2</div>
            <div className="view" style={{ width: size ? size : 315, height: 300 }}>3</div>
            <div className="view" style={{ width: size ? size : 125, height: 125 }}>4</div>
          </Track>
        </Frame>

        <h1 className="center">Y Axis</h1>
        <Frame ref={c => this.pager = c} axis="y" className="frame">
          <Track className="track track-y">
            <div className="view">1</div>
            <div className="view">2</div>
            <div className="view">3</div>
            <div className="view">4</div>
          </Track>
        </Frame>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => this.pager.scrollTo(0)}>1</button>
          <button onClick={() => this.pager.scrollTo(1)}>2</button>
          <button onClick={() => this.pager.scrollTo(2)}>3</button>
          <button onClick={() => this.pager.scrollTo(3)}>4</button>
        </div>

        <h1 className="center">Infinite</h1>
        <Frame
          infinite
          viewsToShow={2}
          className="frame"
        >
          <Track className="track">
            <div className="view">1</div>
            <div className="view">2</div>
            <div className="view">3</div>
            <div className="view">4</div>
          </Track>
        </Frame>

        <h1 className="center">Align</h1>
        <Frame
          align={0.5}
          className="frame"
        >
          <Track className="track">
            <div className="view" style={{ width: size ? size : 200 }}>1</div>
            <div className="view" style={{ width: size ? size : 175 }}>2</div>
            <div className="view" style={{ width: size ? size : 315 }}>3</div>
            <div className="view" style={{ width: size ? size : 125 }}>4</div>
          </Track>
        </Frame>

        <h1 className="center">Images</h1>
        <Frame align={0.5} className="frame">
          <Track className="track">
            <ImageView src="https://unsplash.it/300/200?image=10" className="view"/>
            <ImageView src="https://unsplash.it/450/200?image=20" className="view"/>
            <ImageView src="https://unsplash.it/200/200?image=30" className="view"/>
            <ImageView src="https://unsplash.it/250/200?image=40" className="view"/>
            <ImageView src="https://unsplash.it/375/200?image=50" className="view"/>
          </Track>
        </Frame>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
