import React from 'react';

const TodoList = ({todos, toggleTodo = function(){}}) => {

  const _getClassName = done => (
    done ? "done" : ""
  );

  const _generateLis = () => (
    todos.map( todo => (
      <li key={todo.id}
          className={_getClassName(todo.done)}
          onClick={() => toggleTodo(todo.id)}>
          {todo.body}
      </li>
    ))
  );

  return (
    <ul id="todoList">
      {_generateLis()}
    </ul>
  );
}

export default TodoList;
