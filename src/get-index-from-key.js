import { Children } from 'react'

export default function getIndexFromKey(key, children) {
  let index = null

  Children.forEach(children, (child, _index) => {
    if (child.key === key) {
      index = _index
      return
    }
  })

  return index
}