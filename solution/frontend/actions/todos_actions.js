export const receiveTodo = todo => ({
  type: "RECEIVE_TODO",
  todo
});

export const toggleTodo = id => ({
  type: "TOGGLE_TODO",
  id
});

export const requestTodos = () => ({
  type: "REQUEST_TODOS"
});

export const requestAllTodos = () => ({
  type: "REQUEST_ALL_TODOS"
});

export const receiveAllTodos = todos => ({
  type: "RECEIVE_ALL_TODOS",
  todos
});

export const deleteTodo = id => ({
  type: "DELETE_TODO",
  id
});
