
export default function modulo (n, m) {
  return n < 0 ? ((n % m) + m) % m : n % m;
}
