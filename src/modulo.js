export default function modulo(val, max) {
  return val < 0 ? ((val % max) + max) % max : val % max
}
