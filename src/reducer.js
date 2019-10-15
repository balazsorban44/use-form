const reducer = (state, { type, payload }) =>
  (type in state) ?
    { ...state, [type]: { ...state[type], ...payload } } :
    { ...state, ...payload }

export default reducer