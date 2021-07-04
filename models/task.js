function validateTask(task){
  if(!(task.name &&
       task.description &&
       task.status &&
       task.project_id &&
       task.start_date &&
       task.end_date &&
       task.progress &&
       task.efforts_needed &&
       task.efforts_put
      )){
    throw Error("All Task fields are not set!");
  }

  if(task.name.length < 6){
    throw Error("Task name must be greater than 5");
  }

  if(task.description.length < 10) {
    throw Error("Task name must be greater than 5");
  }

  if(task.progress <= 0 && task.progress >= 100) {
    throw Error("Task progress should be between 0 to 100 inclusive");
  }

  if(task.efforts_needed < 0) {
    throw Error("Negative Effort is not possible!");
  }

  if(task.efforts_put < 0) {
    throw Error("Negative Effort is not possible, but could be Xp");
  }

  return true;
}

export { validateTask };
