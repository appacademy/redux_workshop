# Redux Todos - Part 2

## Phase 1: Middleware

### Basic Structure

We use redux middleware whenever a dispatch is supposed to do something *other than* or *in addition to* updating the application state. You might need a middleware to:
  * Talk to an external API
  * Manage a session
  * Change browser permissions
  * Save data to localStorage

In this phase, we'll add a layer of middleware to our Redux `Store`. This middleware will be responsible for saving our todo list so that it persists between sessions.

We'll be using the `localStorage` browser API to accomplish this task (for simplicity's sake), but this same pattern applies when making calls to external APIs.

Redux middleware uses a currying pattern to link the middleware and provide each with access to:
  * The `Store`
  * The next middleware in the chain
  * The current action being dispatched

Redux middleware must adhere to the following pattern:

```js
const YourMiddleware = function(Store){
  return function(nextMiddleware){
    return function(action){

      // Your code goes here

    }
  }
}
```

This looks hella confusing right? Luckily arrow function clean this up considerably, but the functionality is still the same!

```js
const YourMiddleware = store => next => action => {

  // Your code goes here

}
```

### `LocalStorageManager`

In this section we're going to use a `localStorage` utility called `LocalStorageManager`. This was already made for you in `util/local_storage_manager.js` You don't need to worry too much about *how* it works, but you should get familiar with the functions it performs:

  * `addTodo(todo)` --> accepts a `todo` object and saves it to `localStorage`
  * `toggleTodo(id)` --> accepts an id as an argument and toggles the "done" status of that todo in `localStorage`
  * `deleteTodo(id)` --> accepts an id as an argument and removes the corresponding todo object from `localStorage`
  * `getTodos` --> returns an array of all the todos saves in `localStorage`

### TodosMiddleware

  * Create a new file, `frontend/middleware/todos_middleware`
  * Start with this structure:

```js
import { addTodo } from '../util/local_storage_manager';

const TodosMiddleware = store => next => action => {

  // Your code goes here

}

export default TodosMiddleware;
```

Like in our `Reducers`, we'll start by defining a switch statement that looks at `action.type`

```js
const TodosMiddleware = store => next => action => {
  switch(action.type){
    case "RECEIVE_TODO":
      // Let's save the todo here!
      break;
  }
}
```

Remember that **middleware receives the dispatch before the store**. We have to accomplish two tasks here:

  * Save the todo to `localStorage`
  * Pass the action on to the Store once we're done

```js
const TodosMiddleware = store => next => action => {
  switch(action.type){
    case "RECEIVE_TODO":
      addTodo(action.todo);
      next(action);
      break;
  }
}
```

Finally, the `TodosMiddleware`'s default behavior -- if it doesn't care about the action being dispatched -- should be to just pass the action along to the next middleware in the chain.

```js
const TodosMiddleware = store => next => action => {
  switch(action.type){
    case "RECEIVE_TODO":
      addTodo(action.todo);
      next(action);
      break;
    default:
      next(action);
  }
}
```

### Apply the Middleware

The last step here is to tell our `Store` to use our `TodosMiddleware`! in `store/store.js`

  * Import `applyMiddleware` from `redux`
  * Import your `TodosMiddleware`
  * Use `applyMiddleware` to create a `MasterMiddleware`


```js

```

#### Test it

Try reloading your app. Visually, everything should look the same. But try running `localStorage.getItem('_todos')` in the console. You should see your todos being persisted!

### Phase 2: Loading All Todos

As you've probably notices, we're saving our todos to `localStorage` just fine, but when we refresh the page all our todos disappear! We need to tell our app to retrieve all our todos once the page loads.

### Action Creators

Build two new action creators, `requestAllTodos` and `receiveAllTodos`. `requestAllTodos` should produce an object that looks like this:

```js
{
  type: "REQUEST_ALL_TODOS"
}
```

While `receiveAllTodos` should produce an object that looks like this:

```js
{
  type: "RECEIVE_ALL_TODOS",
  todos: [todo1, todo2 ...]
}
```

### Entry

In our entry point, we're going to dispatch a 'REQUEST_TODOS' action when the page loads.

  * Import `requestAllTodos`
  * Refactor your document-ready callback to look like this:

```js
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById('root');
  ReactDOM.render(<Root />, root);
  Store.dispatch(requestAllTodos());
});
```

### `TodosMiddleware`

Next, in our middleware, let's listen for the 'REQUEST_ALL_TODOS' action. When our `TodosMiddleware` receives that dispatch, it should do three things:

  * Fetch all the saved todos by invoking `getTodos` from the `LocalStorageManager`
  * Create a "RECEIVE_ALL_TODOS" action by invoking `receiveAllTodos`
  * Trigger a new dispatch by invoking `store.dispatch`

```js
case "REQUEST_ALL_TODOS":
  const allTodos = getTodos();
  store.dispatch(receiveAllTodos(allTodos));
  break;
```

### `TodosReducer`

The last step here is to teach our `TodosReducer` how to handle the "RECEIVE_ALL_TODOS" action. This should be a fairly straightforward situation, all we need to do is return the array of todos attached to the object!

```js
case "RECEIVE_ALL_TODOS":
  return action.todos;
```

### Test it!

Your todos should now last forever! You can create todos, refresh, and see them persisted.

## Phase 3: Bonus - Deleting Todos

As you've probably noticed, our todo list items have a small "x" on them. When clicked, this event triggers the "deleteTodo" prop passed to the `TodoList` component.

You know all the pieces of this puzzle! We'll give you some structure, but there are no code snippets in this section!

You'll need to build:
  * `deleteTodo` action creator
  * `deleteTodo` prop in `TodoListContainer`'s `mapDispatchToProps`
  * "DELETE_TODO" case statement in your `TodosMiddleware`
  * "DELETE_TODO" case statement in your `TodosReducer`

## Phase 4: Bonus - Saving Todos Status

Our todoList doesn't save the status of our todos items when we mark them complete / incomplete. Let's change that!

You'll need to build:
  * "TOGGLE_TODO" case statement in your `TodosMiddleware`

Great work, yah redux master :)

## Phase 5: Super Bones - Visibility Filters

This will put your understanding to the test! We want to build a set of buttons that toggle which todos are visible. They won't affect which todos persist in `localStorage`, just which ones the user can see.

  * Build an action creator called `toggleFilter`. It should produce an action that looks like this:

```js
{
  type: "TOGGLE_FILTER",
  filter: "ALL"
}
```

Other types of filters could include "COMPLETE" or "INCOMPLETE".

  * Build another reducer called `FiltersReducer`, this should manage a single piece of state: a string. The string will either be "ALL", "COMPLETE", or "INCOMPLETE"
  * Update your `RootReducer` to use your new `FiltersReducer`
  * Update your `TodoListContainer` to pass the appropriate list of todos to the `TodoList` component
  * Finally, build the `FilterButtons` component! (Yup, this one is on you!)
  * As a super-super bonus, you could get your visibility preferences to persist between refreshes! You'll want to update the `LocalStorageManager` to do this.

Thanks for attending the Redux Workshop!

All the <3,
App Academy
