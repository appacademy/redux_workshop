export const receiveTodo = todo => ({
  type: "RECEIVE_TODO",
  todo
});

export const toggleTodo = id => ({
  type: "TOGGLE_TODO",
  id
});
