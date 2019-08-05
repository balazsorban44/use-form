/** Checks if a given agrument is of type Object*/
export default function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]'
}