export default function slideRange(a, b) {
  const range = []

  if (a === b) {
    return [a]
  }

  for (let i = a; i < b; i++) {
    range.push(i)
  }

  return range
}
