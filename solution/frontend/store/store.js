import { createStore, combineReducers, applyMiddleware } from 'redux';
import TodosReducer from '../reducers/todos_reducer';
import TodosMiddleware from '../middleware/todos_middleware';

const RootReducer = combineReducers({
  todos: TodosReducer
});

const MasterMiddleware = applyMiddleware(TodosMiddleware);

const Store = createStore(
  RootReducer,
  MasterMiddleware
);

export default Store;
