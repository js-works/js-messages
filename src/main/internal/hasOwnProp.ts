export default function hasOwnProp(obj: any, propName: string) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, propName)
}
