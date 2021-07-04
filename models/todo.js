function validateTodo(todo){
  if(!(todo.name &&
       todo.description &&
       todo.status &&
       todo.effort_hour &&
       todo.todo_assigned &&
       todo.task_id
      )){
    throw Error("All Todo fields are not set!");
  }

  if(todo.name.length < 6){
    throw Error("Todo name must be greater than 5");
  }

  // need to make this minutes
  // if(todo.effort_hour)

  return true;
}

export { validateTodo };
