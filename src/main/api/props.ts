export default function props<
  P extends Record<string, any> & { type?: never }
>(): (props: P) => P {
  return (props) => props
}
