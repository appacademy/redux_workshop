const todosReducer = (state = [], action) => {
  switch(action.type) {
    case "RECEIVE_TODO":
      return state.concat(action.todo);
    case "TOGGLE_TODO":
      const idx = state.findIndex( todo => todo.id === action.id );
      const status = !state[idx].done;
      const newTodo = Object.assign({}, state[idx], {done: status});
      return [...state.slice(0, idx), newTodo, ...state.slice(idx + 1)];
    default:
      return state;
  }
};

export default todosReducer;
