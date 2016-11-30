import React from 'react'
import reactDom from 'react-dom/server'
import { shallow } from 'enzyme';
import assert from 'assert'

import { ViewPager, Frame, Track, View }  from '../src/react-view-pager'

describe('ViewPager', () => {

  let pages = [1, 2, 3].map(page => <div>{page}</div>)

  it('can render on the server side', () => {
    let shallowRenderedComponent = shallow(
      <ViewPager>
        <Frame>
          <Track>
            {pages.map((page, index) => <View key={index}>{page}</View>)}
          </Track>
        </Frame>
      </ViewPager>
    )
    assert(shallowRenderedComponent.length, 1);
  })

})
