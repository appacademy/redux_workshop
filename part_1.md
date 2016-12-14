# Redux Todos - Part 1

## Phase 1: Redux

### State Shape

We want to build a state that allows us to easily add and remove todos. Remember, this state is the single state object for our entire application. It needs to contain all the information that every piece of our app needs to render appropriately.

We might use an array to manage our list of todos.

```js
{
  todos: [ {}, {}, {} ]
}
```

Here, each todo is represented by an object that may look like this:

```js
{
  id: 1,
  body: "learn redux",
  done: false
}
```

### Action Creators

Let's write a couple action creators, these are functions that will create the Redux `actions` that will later be used to update our application state.

Remember that:
  * Redux actions are plain-old javascript objects that have a `type` property.
  * Action creators don't directly interact with reducers or the `store`, **they simply return action objects.**

* Create a file `frontend/actions/todo_actions.js` that will house our action creators.

#### `receiveTodo`

Our first action creator will be responsible for creating a todo object, nested inside an action. It might look something like this:

```js
function receiveTodo(todo) {
  return {
    type: "RECEIVE_TODO",
    todo: todo
  }
}
```

Note, we wrote this using ES5 syntax. If we use ES6, (and we will use ES6 for most of this project) we can instead write:

```js
const receiveTodo = todo => ({
  type: "RECEIVE_TODO",
  todo
});
```

Since we're using a module bundler, we have to make sure we export `receiveTodo`, like so:

```js
export const receiveTodo = todo => ({
  type: "RECEIVE_TODO",
  todo
});
```

We'll write more action creators later. Let's move on to our reducer!

### Reducers

#### `todosReducer`

Redux reducers manage the shape of our application state. Here, we'll create a reducer that is specifically responsible for the `state.todos` piece of our state.

+ Create a file, `frontend/reducers/todos_reducer.js` that exports a reducing function `todosReducer`.

A Redux reducer accepts two arguments:
  + `state` - the previous application state.
  + `action` - the action object being dispatched.

Remember that reducers should:
  + Return the initial state if the state argument is undefined;
  + Return the `state` if the reducer doesn't care about the action;
  + Return a new state object if the reducer cares about the `action`

**N.B.** the reducer must never mutate the previous state. Instead it should return a brand new state object with the necessary changes."

Let's start by just setting up our `todosReducer` to return its default state - an empty object with no todos:

```js
const todosReducer = (state = [], action) => {
  switch(action.type) {
    default:
      return state;
  }
};
```

Next, let's tell our reducer how to produce the new state when it receives a "RECEIVE_TODO" action.

```js
const todosReducer = (state = [], action) => {
  switch(action.type) {
    case "RECEIVE_TODO":
      return state.concat(action.todo);
    default:
      return state;
  }
};
```

As usual, `export default`.

```js
export default todosReducer;
```

Here, we're telling the reducer that when we receive a new todo, add it to the end of the array of todos. Note that **we never mutate the state object.** If we had said `state.push(action.todo)`, we'd be in trouble.

### The `Store`

Let's create the central piece that connects our entire app! The `Store`.

A Redux `Store` holds a reference to an application state. The `Store` handles updating state when actions are dispatched and tells the necessary components to re-render. Let's create our Redux `Store`.

+ Create a new file, `frontend/store/store.js`.
+ Import `createStore` and `combineReducers` from the `redux` library.
+ Import your `todosReducer`.

```js
import { createStore, combineReducers } from 'redux';
import todosReducer from '../reducers/todos_reducer';
```

Next, let's use the `combineReducers` function to generate a `rootReducer`

```js
const rootReducer = combineReducers({
  todos: todosReducer
});
```

While the purpose `rootReducer` may not be obvious right now, it will later allow us to connect several domain-specific reducers to our store by combining them into a single `rootReducer`;

Finally, let's create and export our store! Note that the `createStore` function accepts the `rootReducer` as an argument.

```js
const Store = createStore(rootReducer);
export default Store;
```

### Getting up and running!

You did it! Action Creators, Reducers, and the Store are some of the major players in any redux application. Let's require them in our entry file (to ensure they make it into the `bundle.js`) and then let's test!

We should also add our `Store` and action creator to the window for testing.

```js
// in frontend/entry.jsx
import Store from './store/store.js'
import { receiveTodo } from './actions/todo_actions.js'

// Just for testing!
window.Store = Store;
window.receiveTodo = receiveTodo;
```

#### Test your code

Make sure you have the server running, and navigate to localhost:8080. Open the console, no red errors? Good.

Try typing `Store.getState()`, you should see our default application state returned! It should look like:

```js
{
  todos: []
}
```

Next, let's create and dispatch an action. In the console type:

```js
let action = receiveTodo("learn redux");
Store.dispatch(action);
Store.getState();
```

You should see:

```js
{
  todos: ["learn redux"]
}
```

Try creating and dispatching more actions! You can always refresh the page to reset. Also keep in mind that we're just populating our state with strings to test, but later we'll wrap our todos in objects, as discussed at the top of this document.

---
## Phase 2: React-Redux

### React Views

Now comes the fun part - let's connect some react views to our redux store! We've already given you a component to use, the `TodoList`.

This component accepts a prop called `todos` and renders an <li> for each todo! The `TodoList` component expects the `todos` prop to be an array of todo objects.

Let's `connect` this component to our redux `Store`. We'll use a container to do this.

* Create a file, `frontend/components/todo_list_container.js`
* import `connect` from `react-redux`
* import the `TodoList` component

```js
import { connect } from 'react-redux';
import TodoList from './todo_list';
```

We need to define a function called `mapStateToProps`. This function accepts the application state as an argument and returns the props that get passed to our presentational component.

Let's use `mapStateToProps` to extract `state.todos` from our application state.

```js
const mapStateToProps = state => ({
  todos: state.todos
});
```

Finally, let's create our container component by the `connect` function.

```js
const TodoListContainer = connect(
  mapStateToProps
)(TodoList);
```

Note that the `connect` function employs a currying pattern to create the container. Finally, `export default` your connected component.

```js
export default TodoListContainer;
```

---

### The entry file

Let's tell the browser to render our component! Make you entry file look like this:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Store from './store/store';
import TodoListContainer from './components/todo_list_container';
import { receiveTodo } from './actions/todo_actions';

// Just for testing!
window.Store = Store;
window.receiveTodo = receiveTodo;

const Root = () => (
  <Provider store={Store}>
    <TodoListContainer />
  </Provider>
);

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById('root');
  ReactDOM.render(<Root />, root);
});
```

Pay special attention to our use of the `Provider` from `react-redux`. The `Provider` makes the store globally available throughout the react component hierarchy. This is what allows your `connect` function to work it's magic.

You should now be able to open the browser, dispatch some actions through the console, and see your todo list get populated!

```js
// DO THIS IN THE CONSOLE
todo1 = {
  id: 1,
  body: "Learn redux",
  done: false
};

todo2 = {
  id: 2,
  body: "Learn it well!",
  done: false
};

Store.dispatch(receiveTodo(todo1));
Store.dispatch(receiveTodo(todo2));
```

Make sure you see your todo items rendering before moving on!

## Phase 3: Adding todos

We've given you another component, the `NewTodoForm`. You're going to use this form to create new todos! The `NewTodoForm` accepts a single prop: `handleSubmit`. This function is invoked whenever the `Submit` button is clicked on the form.

Let's start by `connect`ing this component to our `Store`.

* Create a new file, `frontend/components/new_todo_form_container.js`
* import the following:
  * `connect`
  * `NewTodoForm`
  * `receiveTodo`

Our `NewTodoForm` doesn't need any information from the state in order to do it's job. The only thing our `NewTodoForm` needs from the container, is a function that tells it how to submit a todo. We know that **when we submit a todo, we need to dispatch a "RECEIVE_TODO" action**.

`react-redux` provides us with this lovely helper: `mapDispatchToProps`. We're going to give our `NewTodoForm` a function prop that, when invoked, triggers a dispatch.

The `mapDispatchToProps` function accepts the `Store`'s dispatch method as an argument and returns the props that are to be passed to the presentational component.

```js
const mapDispatchToProps = dispatch => ({
  handleSubmit: todo => dispatch(receiveTodo(todo))
});
```

Again, we're giving `NewTodoForm` a prop called 'handleSubmit', a function. When invoked, 'handleSubmit' will trigger a dispatch.

Note that the `mapDispatchToProps` function is the second argument that `connect` accepts. Since we don't have a `mapStateToProps` function, the first arguent will be `null`.

```js
const NewTodoFormContainer = connect(
  null,
  mapDispatchToProps
)(NewTodoForm);

export default NewTodoFormContainer;
```

Finally, we can update our entry point to include the `NewTodoForm`!

  * Import the `NewTodoFormContainer`

  Update your `Root` component to look like this:

```js
const Root = () => (
  <Provider store={Store}>
    <div>
      <TodoListContainer />
      <NewTodoFormContainer />
    </div>
  </Provider>
);
```

Note that the provider only works with a single child node (hence the extra div).

Play around with this in the browser! Check out `Store.getState` periodically.

## Phase 4: Bonus -- Toggle Todos

Let's add the functionality to "cross-out" todos! This part will be less hand-holdy ;)

Our `TodoList` component is already checking the "done" property of our todo objects, but so far all of them have been `done: false`. We need to do three things:

  * Add a new action-creator called `toggleTodo`
  * Update our reducer to respond to the "TOGGLE_TODO" action
  * Update our `TodoListContainer` to also use a `mapDispatchToProps` function

### `toggleTodo`

Your action-creator should look something like this:

```js
const toggleTodo = id => ({
  type: "TOGGLE_TODO",
  id
})
```

### `TodoReducer`

Do this part carefully! **Do not mutate the old state!** Here is one possible sequence of steps to accomplish the goal of the reducer:

  * Find the index of the toggled todo by searching for it's id
  * Create a copy of the old todo using `Object.assign`
  * Toggle the "done" property of the new todo
  * Return a new array of todo objects with the new, toggled todo supplemented for the old one

```js
case "TOGGLE_TODO":
  const idx = state.findIndex( todo => todo.id === action.id );
  const status = !state[idx].done;
  const newTodo = Object.assign({}, state[idx], {done: status});
  return [...state.slice(0, idx), newTodo, ...state.slice(idx + 1)];
```

### TodoListContainer

Finally, our `TodoListContainer` needs a `mapDispatchToProps` function. Our `ToDoList` component is setup to accept a `toggleTodo` prop. This function is invoked whenever we click a todo item, and the function is passed the `id` of the item clicked.

```js
const mapDispatchToProps = dispatch => ({
  toggleTodo: id => dispatch(toggleTodo(id))
});
```
