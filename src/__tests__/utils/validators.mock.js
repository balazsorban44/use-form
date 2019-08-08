// always returns true for any field
const validatorsMock = new Proxy({}, { get: () => () => true })
export default validatorsMock