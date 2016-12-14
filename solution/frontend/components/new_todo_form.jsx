import React from 'react';

// class NewTodoForm extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = f
//   }
// }

const NewTodoForm = ({handleSubmit}) => {

  let inputDomNode;

  const _handleSubmit = e => {
    e.preventDefault();
    
    const todo = {
      id: (new Date).getTime(),
      body: inputDomNode.value,
      done: false
    }

    handleSubmit(todo);
    inputDomNode.value = "";
  }

  return(
    <form onSubmit={_handleSubmit}>
      <input type="text"
             ref={ node => inputDomNode = node }
             placeholder="New Todo"/>

      <input type="submit" value="Create Todo" />
    </form>
  )
};

export default NewTodoForm;
