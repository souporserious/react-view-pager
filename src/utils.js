export function modulo(val, max) {
  return ((val % max) + max) % max
}

export function clamp(val, min, max) {
  return Math.min(Math.max(min, val), max)
}

export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0)
}

export function max(arr) {
  return Math.max.apply(null, arr)
}

export function range(from, to, max) {
  return [...Array(to - from)].map(
    (_, i) => modulo(from + i, max)
  )
}
