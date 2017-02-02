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

export function range(start, end, max) {
  return [...Array(1 + end - start)].map(val =>
    max ? modulo(start + val, max) : start + val
  )
}
