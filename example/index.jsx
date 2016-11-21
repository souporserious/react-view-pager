import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Frame, Track, ImageView } from '../src/react-view-pager'

import './main.scss';

const animations = [{
  name: 'scale',
  stops: [
    [-200, 0.85],
    [0, 1],
    [200, 0.85]
  ]
}, {
  name: 'opacity',
  stops: [
    [-200, 0.15],
    [0, 1],
    [200, 0.15]
  ]
}]

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
          viewsToShow="auto"
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
        <Frame
          viewsToShow="auto"
          align={0.5}
          className="frame"
        >
          <Track className="track">
            <ImageView src="https://unsplash.it/300/200?image=10" className="view"/>
            <ImageView src="https://unsplash.it/450/200?image=20" className="view"/>
            <ImageView src="https://unsplash.it/200/200?image=30" className="view"/>
            <ImageView src="https://unsplash.it/250/200?image=40" className="view"/>
            <ImageView src="https://unsplash.it/375/200?image=50" className="view"/>
          </Track>
        </Frame>

        <h1 className="center">Animations</h1>
        <Frame
          viewsToShow="auto"
          align={0.5}
          animations={animations}
          style={{
            margin: '0 auto',
            outline: 0
          }}
        >
          <Track>
            <ImageView src="https://unsplash.it/200/200?image=10" className="view"/>
            <ImageView src="https://unsplash.it/200/200?image=20" className="view"/>
            <ImageView src="https://unsplash.it/200/200?image=30" className="view"/>
            <ImageView src="https://unsplash.it/200/200?image=40" className="view"/>
            <ImageView src="https://unsplash.it/200/200?image=50" className="view"/>
          </Track>
        </Frame>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
