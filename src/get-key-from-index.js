import { Children } from 'react'

export default function getKeyfromIndex(index, children) {
  let key = null

  Children.forEach(children, (child, _index) => {
    if (index === _index) {
      key = child.key
      return
    }
  })

  return key
}
