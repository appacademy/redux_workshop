import { connect } from 'react-redux';
import NewTodoForm from './new_todo_form';
import { receiveTodo } from '../actions/todos_actions';

const mapDispatchToProps = dispatch => ({
  handleSubmit: todo => dispatch(receiveTodo(todo))
});

const NewTodoFormContainer = connect(
  null,
  mapDispatchToProps
)(NewTodoForm);

export default NewTodoFormContainer;
