import { Children } from 'react'

export default function getIndex(key, children) {
  let index = null

  Children.forEach(children, (child, _index) => {
    if (child.key === key || _index === key) {
      index = _index
      return
    }
  })

  return index
}
