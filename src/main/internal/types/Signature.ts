type Signature<T> = T extends (...args: infer S) => any ? S : []

export default Signature
