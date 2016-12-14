import { createStore, combineReducers } from 'redux';
import todosReducer from '../reducers/todos_reducer';

const rootReducer = combineReducers({
  todos: todosReducer
});

const Store = createStore(rootReducer);
export default Store;
