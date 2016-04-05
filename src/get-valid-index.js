export default function getValidIndex(n, m) {
  return n < 0 ? ((n % m) + m) % m : n % m
}
