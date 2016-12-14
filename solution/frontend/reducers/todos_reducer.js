const TodosReducer = (state = [], action) => {
  let idx;
  switch(action.type) {
    case "RECEIVE_TODO":
      return state.concat(action.todo);
    case "TOGGLE_TODO":
      idx = state.findIndex( todo => todo.id === action.id );
      const status = !state[idx].done;
      const newTodo = Object.assign({}, state[idx], {done: status});
      return [...state.slice(0, idx), newTodo, ...state.slice(idx + 1)];
    case "RECEIVE_ALL_TODOS":
      return action.todos;
    case "DELETE_TODO":
      idx = state.findIndex( todo => todo.id === action.id );
      return [...state.slice(0, idx), ...state.slice(idx + 1)];
    default:
      return state;
  }
};

export default TodosReducer;
