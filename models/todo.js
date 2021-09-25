function validateTodo(todo){
  if(!(todo.name  != undefined &&
       todo.description != undefined &&
       todo.status != undefined &&
       todo.effort_hour != undefined &&
       todo.todo_assigned != undefined &&
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
