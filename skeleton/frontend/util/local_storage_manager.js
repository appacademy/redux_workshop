const LocalStorageManager = {

  getTodos(){
    const todosJson = localStorage.getItem("_todos");
    return JSON.parse(todosJson) || [];
  },

  addTodo(todoToAdd){
    const currentTodos = this.getTodos();
    currentTodos.push(todoToAdd);
    this._saveTodos(currentTodos);
  },

  toggleTodo(id){
    const currentTodos = this.getTodos();
    const idx = currentTodos.findIndex( todo => todo.id === id );
    currentTodos[idx].done = !currentTodos[idx].done;
    this._saveTodos(currentTodos);
  },

  deleteTodo(id){
    const currentTodos = this.getTodos();
    const idx = currentTodos.findIndex( todo => todo.id === id );
    currentTodos.splice(idx, 1);
    this._saveTodos(currentTodos);
  },

  _saveTodos(todos){
    const todosJson = JSON.stringify(todos);
    localStorage.setItem("_todos", todosJson);
  }

};

// Permanently bind methods
const lsm = LocalStorageManager;
["addTodo", "toggleTodo", "deleteTodo"].forEach( method => {
  lsm[method] = lsm[method].bind(lsm);
});


module.exports = LocalStorageManager;
