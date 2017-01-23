import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { ViewPager, Frame, Track, View, AnimatedView } from '../src/react-view-pager'

import './main.scss';

const animations = [{
  prop: 'scale',
  stops: [
    [-200, 0.85],
    [0, 1],
    [200, 0.85]
  ]
}, {
  prop: 'opacity',
  stops: [
    [-200, 0.15],
    [0, 1],
    [200, 0.15]
  ]
}]

class ProgressView extends Component {
  render() {
    return (
      <View className="view" {...this.props}>
        <AnimatedView
          animations={[{
            prop: 'opacity',
            stops: [
              [-200, 0],
              [0, 1],
              [200, 0]
            ]
          }, {
            prop: 'translateY',
            stops: [
              [-200, 50],
              [0, 0],
              [200, 50]
            ]
          }]}
        >
          {this.props.children}
        </AnimatedView>
      </View>
    )
  }
}

const ProgressBar = ({ progress }) => (
  <div className="progress-container">
    <div
      className="progress-bar"
      style={{
        transform: `scaleX(${Math.max(0, Math.min(1, progress))})`,
      }}
    />
  </div>
)

const colors = ['#209D22', '#106CCC', '#C1146B', '#11BDBF', '#8A19EA']
const ProgressPage = ({ view, index, onClick }) => (
  <AnimatedView
    key={index}
    index={index}
    // index={[0, 1]} // maybe allow the ability to specify a range of indices
    animations={[{
      prop: 'scale',
      stops: [
        [-300, 0.75],
        [0, 1],
        [300, 0.75]
      ]
    }, {
      prop: 'opacity',
      stops: [
        [-300, 0.5],
        [0, 1],
        [300, 0.5]
      ]
    }, {
      prop: 'backgroundColor',
      stops: [
        [-300, '#cccccc'],
        [0, colors[index]],
        [300, '#cccccc']
      ]
    }]}
    className="page"
    onClick={e => {
      onClick(e)
    }}
  />
)

class ProgressExample extends Component {
  state = {
    views: [1, 2, 3, 4],
    currentView: 2,
    progress: 0,
  }

  _handleScroll = (progress, trackPosition) => {
    this.setState({ progress })
  }

  render() {
    const { views, currentView, progress } = this.state
    return (
      <ViewPager className="viewport">
        <Frame
          ref={c => this.frame = c}
          className="frame"
        >
          <Track
            currentView={currentView}
            onScroll={this._handleScroll}
            // onSwipeStart={() => console.log('swipe start')}
            // onSwipeMove={() => console.log('swipe move')}
            // onSwipeEnd={() => console.log('swipe end')}
            onViewChange={currentIndicies => {
              this.setState({ currentView: currentIndicies[0] })
            }}
            className="track"
          >
            {views.map((view, index) =>
              <ProgressView key={`page-${index}`} children={view}/>
            )}
          </Track>
        </Frame>
        <ProgressBar progress={progress}/>
        <nav className="pager">
          {views.map((view, index) =>
            <ProgressPage
              key={view}
              view={view}
              index={index}
              onClick={() =>
                this.setState({ currentView: `page-${index}` })
              }
            />
          )}
        </nav>
      </ViewPager>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [[500, 350], [800, 600], [800, 400], [700, 500], [200, 650], [600, 600]],
      activeIndex: 0,
      viewsToShow: 1
      // size: '50%'
    }
  }

  render() {
    const { images, activeIndex, size, viewsToShow } = this.state
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

          <label>Views To Show</label>
          <input
            type="range"
            min={1}
            max={3}
            value={+viewsToShow}
            onChange={e => this.setState({ viewsToShow: +e.target.value })}
          />
        </div>
        current view: {activeIndex + 1}
        <ViewPager>
          <Frame
            autoSize="height"
            className="frame"
          >
            <Track
              ref={c => this.slider = c}
              currentView={activeIndex}
              viewsToShow={viewsToShow}
              // viewsToMove={2}
              // axis="y"
              // align={0.5}
              // infinite
              contain
              onViewChange={currentIndicies => {
                this.setState({ activeIndex: currentIndicies[0] })
              }}
              // onRest={() => console.log('after view change')}
              className="track"
            >
              <View className="view" style={{ width: size ? size : 500, height: 100 }}>
                1
                <button>button</button>
              </View>
              <View className="view" style={{ width: size ? size : 175, height: 200 }}>
                2
                <button>button</button>
              </View>
              <View className="view" style={{ width: size ? size : 315, height: 300 }}>
                3
                <button>button</button>
              </View>
              <View className="view" style={{ width: size ? size : 125, height: 125 }}>
                4
                <button>button</button>
              </View>
            </Track>
          </Frame>
        </ViewPager>

        <h1 className="center">Y Axis</h1>
        <ViewPager>
          <Frame autoSize className="frame">
            <Track ref={c => this.track = c} axis="y" className="track track-y">
              <View className="view">1</View>
              <View className="view">2</View>
              <View className="view">3</View>
              <View className="view">4</View>
            </Track>
          </Frame>
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => this.track.scrollTo(0)}>1</button>
            <button onClick={() => this.track.scrollTo(1)}>2</button>
            <button onClick={() => this.track.scrollTo(2)}>3</button>
            <button onClick={() => this.track.scrollTo(3)}>4</button>
          </div>
        </ViewPager>

        <h1 className="center">Infinite</h1>
        <ViewPager>
          <Frame className="frame">
            <Track viewsToShow={2} infinite className="track">
              <View className="view">1</View>
              <View className="view">2</View>
              <View className="view">3</View>
              <View className="view">4</View>
            </Track>
          </Frame>
        </ViewPager>

        <h1 className="center">Align</h1>
        <ViewPager>
          <Frame className="frame">
            <Track viewsToShow="auto" align={0.5}>
              <View className="view" style={{ width: size ? size : 200 }}>1</View>
              <View className="view" style={{ width: size ? size : 175 }}>2</View>
              <View className="view" style={{ width: size ? size : 315 }}>3</View>
              <View className="view" style={{ width: size ? size : 125 }}>4</View>
            </Track>
          </Frame>
        </ViewPager>

        <h1 className="center">Images</h1>
        <ViewPager>
          <Frame className="frame">
            <Track viewsToShow="auto" align={0.5} className="track">
              <View tag="img" src="http://lorempixel.com/300/200?image=10"/>
              <View tag="img" src="http://lorempixel.com/450/200?image=20"/>
              <View tag="img" src="http://lorempixel.com/200/200?image=30"/>
              <View tag="img" src="http://lorempixel.com/250/200?image=40"/>
              <View tag="img" src="http://lorempixel.com/375/200?image=50"/>
            </Track>
          </Frame>
        </ViewPager>

        <h1 className="center">Animations</h1>
        <ViewPager>
          <Frame
            style={{
              margin: '0 auto',
              outline: 0
            }}
          >
            <Track
              viewsToShow="auto"
              align={0.5}
              animations={animations}
            >
              <View tag="img" src="http://lorempixel.com/200/200?image=10"/>
              <View tag="img" src="http://lorempixel.com/200/200?image=20"/>
              <View tag="img" src="http://lorempixel.com/200/200?image=30"/>
              <View tag="img" src="http://lorempixel.com/200/200?image=40"/>
              <View tag="img" src="http://lorempixel.com/200/200?image=50"/>
            </Track>
          </Frame>
        </ViewPager>

        <h1 className="center">Progress</h1>
        <ProgressExample/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
