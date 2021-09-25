
$(() => {

  var todoApiUrl = "http://localhost:1234/api/v1/todo";
  var taskApiUrl = "http://localhost:1234/api/v1/task";
  var projectApiUrl = "http://localhost:1234/api/v1/project";
  var memberApiUrl = "http://localhost:1234/api/v1/member";

  const TODO_STATUS = ["ACTIVE", "PENDING", "COMPLETE", "DELEGATED", "ABANDONED"];

  let jsToSqlDate = d => d.toString().slice(0, 10);  


  var taskControls = {
    add: $(`#addNewTask`),
    cancel: $(`#cancelNewTask`),
    confirm: $(`#confirmNewTask`), // will update too if(id != 0)!
    delete: $(`#taskDelete`),
    edit: $(`#taskEdit`),
    disableTaskListItems: false, // controls taskListItems, when in task is in form fill up mode
  };

  loadTasks(data.tasks);  

  taskControls.add.click((e) => {
    e.preventDefault();
    taskControls.disableTaskListItems = true;


    $(`#taskShowInfo`).hide();
    $(`#taskEditInfo`).show();

    taskControls.confirm.find('p').text("Add Task");    

    clearTaskMembersList();
    clearTodos();
    unsetCurrentTask();
  });

  taskControls.cancel.click((e) => {
    e.preventDefault();

    $(`#taskShowInfo`).show();
    $(`#taskEditInfo`).hide();
    if(data.tasks[0])
      $(`#task${data.tasks[0].id}`).trigger("click");    
    
    console.log("Cancel New Task!");
    taskControls.disableTaskListItems = false;
  });

  taskControls.confirm.click(async (e) => {
    e.preventDefault();
    var taskNewName = $(`#taskEditName`).val();
    var taskNewDescription = $(`#taskEditDescription`).val();      
    var taskNewStartDate = $(`#taskEditStart`).val();
    var taskNewDeadline = $(`#taskEditDeadline`).val();

    console.log(taskNewStartDate);

    var task = {
      name: taskNewName,
      description: taskNewDescription,
      status: 0,
      project_id: data.proj.id,
      start_date: taskNewStartDate,
      end_date: taskNewDeadline,
      progress: 0,
      efforts_needed: 0,
      efforts_put: 0,
    };

    var taskId = getCurrentTaskId();
    var response = {};
    
    if(taskId == 0) {
      console.log("adding");
      response = await $.post({
	url: `${taskApiUrl}/add`,
	data: JSON.stringify(task),
	contentType: "application/json; charset=utf-8",
      });

      if(response.status == "Success") {
	data.tasks.push(response.task);
	appendTask(response.task);
      } else {
	console.log(response);
      }
      $(`#task${response.task.id}`).trigger("click");
    } else {
      console.log("updating");

      response = await $.post({
	url: `${taskApiUrl}/${taskId}/update`,
	data: JSON.stringify(task),
	contentType: "application/json; charset=utf-8",
      });

      if(response.status == "Success"){
        console.log(data.tasks);
	var updatedTaskRes = await $.get(`${taskApiUrl}/id/${response.taskId}?todos&members`);

	// remove old tasks and add new to frontend values
	for(var i = 0; i < data.tasks.length; i++){
	  if(data.tasks[i].id == updatedTaskRes.task.id) data.tasks.splice(i, 1);
	}
	data.tasks.push(updatedTaskRes.task);

	// update front-end UI with front-end values 
	$(`#task${updatedTaskRes.task.id}`).text(updatedTaskRes.task.name);
	loadTaskUI(updatedTaskRes.task);
      } else {
	console.log("Update failed!");
	console.log(response);
      }

    }

    $(`#taskShowInfo`).show();
    $(`#taskEditInfo`).hide();    
    taskControls.disableTaskListItems = false;

  });

  taskControls.delete.click((e) => {
    e.preventDefault();
    if(window.confirm("Do you really want to delete current Todo?")){
      removeTask(getCurrentTaskId());
    }
  });


  taskControls.edit.click((e) => {
    e.preventDefault();
    taskControls.disableTaskListItems = true;

    $(`#taskShowInfo`).hide();
    $(`#taskEditInfo`).show();

    // update form task edit values with currently selected task to edit
    var task = getCurrentTask();
    $(`#taskEditName`).val(task.name);
    $(`#taskEditDescription`).text(task.description);      

    $(`#taskEditStart`).val(jsToSqlDate(task.start_date));
    $(`#taskEditDeadline`).val(jsToSqlDate(task.end_date));

    taskControls.confirm.find('p').text("Update Task");

  });


  $(`#taskAddTodo`).click((e) => {
    e.preventDefault();

    if(getCurrentTaskId() == 0) {
      console.log("First, you need to create task!");
      return;
    }
    
    appendTodo();

    $(e.target).hide();
    $(`#taskAddTodoConfirm`).show();
    $(`#taskAddTodoCancel`).show();    
  });


  $(`#taskAddTodoConfirm`).click( async (e) => {
    e.preventDefault();


    // id with 0 is linked to new todo to be added
    var todoId = 0;
    var todoName = $(`#todo${todoId}Name`);
    var todoDesc = $(`#todo${todoId}Description`);
    var todoAssigned = $(`#membersSelectTodo${todoId}`).find(":selected");

    var todo = {
      name: todoName.val(),
      description: todoDesc.val(),
      todo_assigned: todoAssigned.val(),
      status: 0,
      effort_hour: 0,
      task_id: getCurrentTaskId(),
    };    

    var res = await dbTodoAdd(todo);

    if(res.status == "Success") {
      $(`#taskMessage`).text("Todo added successfully!").css('color', 'green').fadeOut(3000);
      appendTodo(res.todo);
    } else {
      $(`#taskMessage`).text(res.message).css('color', 'red').fadeOut(3000);
    }

    $(`#todo0`).remove();

    $(e.target).hide();
    $(`#taskAddTodoCancel`).hide();        
    $(`#taskAddTodo`).show();

  });


  $(`#taskAddTodoCancel`).click((e) => {
    e.preventDefault();

    // id with 0 is linked to new todo to be added
    $(`#todo0`).remove();

    $(e.target).hide();
    $(`#taskAddTodoConfirm`).hide();        
    $(`#taskAddTodo`).show();    
  });

  function refreshTasks(tasks){
    var response = $.get();
  }

  function loadTasks(tasks){
    tasks.forEach((task) => appendTask(task));
    // setting up intial active task, if there isn't any
    if (getCurrentTaskId() == 0){
      if(data.tasks[0])
      $(`#task${data.tasks[0].id}`).trigger("click");
    }    
  }

  function appendTask(task){
    var progressColor = "bg-green-400";
    var progressTextColor = "text-gray-800";
    var progress = task.progress;
    if(progress < 20){
      progressColor = "bg-red-400";
    } else if(progress < 40){
      progressColor = "bg-yellow-400";
    } else if(progress < 60){
      progressColor = "bg-blue-400";
    } else if(progress < 80){
      progressColor = "bg-pink-400";
    }

    $('#taskList').append(`
	<li class="w-full cursor-pointer flex font-bold items-center text-white bg-purple-400 rounded-md px-4 py-2 my-2" id="task${task.id}">
          ${task.name}
	  <div class="w-4 h-4 ${progressColor} ml-auto"></div>
	</li>
    `);

    // add click handler to task list item
    $(`#task${task.id}`).click(taskListItemClickHandler);

  }


  function taskListItemClickHandler(e){
    e.preventDefault();

    if(taskControls.disableTaskListItems) {
      console.log("changing list is disabled right now!");
      return;
    }

    if(!e.target.classList.contains("active")) {
      var activeTarget = $('.task-list>.active');
      activeTarget.removeClass("bg-purple-700");
      activeTarget.addClass("bg-purple-400");                              
      activeTarget.removeClass("active");
      e.target.classList.add("active");
      e.target.classList.remove("bg-purple-400");
      e.target.classList.add("bg-purple-700");    

      var task = getCurrentTask();
      loadTaskUI(task);
    }

  }

  function loadTaskUI(task){
    var taskName = $("#taskName");
    var taskStart = $("#taskStart");    
    var todoRemain = $("#todoRemain");
    var taskDeadline = $("#taskDeadline");
    var taskProgressBar = $("#taskProgressBar");
    var taskDescription = $("#taskDescription");

    taskName.text(task.name);
    taskStart.text(new Date(task.start_date).toDateString());
    todoRemain.text(task.todos.length + " Todos Remaining");
    taskDeadline.text(new Date(task.end_date).toDateString());
    taskProgressBar.css({width: `${task.progress}%`}).addClass("bg-yellow-400");
    taskDescription.text(task.description);

    loadTaskMembersList(task);

    // load select members
    loadMembersInSelect();
    loadTodos(task.todos);    
  }
  

  function detachTask(taskId){
    $(`#task${taskId}`).remove();
    for(var i = 0; i < data.tasks.length; i++)
      if(data.tasks[i].id == taskId) data.tasks.splice(i, 1);

    var taskName = $("#taskName");
    var taskStart = $("#taskStart");    
    var todoRemain = $("#todoRemain");
    var taskDeadline = $("#taskDeadline");
    var taskProgressBar = $("#taskProgressBar");
    var taskDescription = $("#taskDescription");
    taskName.text("Default Name");
    taskDescription.text("Default Description");
    todoRemain.text("0 Todos Remaining");
    taskProgressBar.css({width: '20%'}).css('color', 'red');
    taskStart.text(new Date().toDateString());
    taskDeadline.text(new Date().toDateString());    
  }

  
  function updateTask(task){ // frontend only
    
  }

  
  async function removeTask(taskId){
    try  {
      var response =  await $.ajax({
	method: 'delete',
	url: `${taskApiUrl}/${taskId}/delete`
      });

      if(response.status == "Success") {
	console.log(response);
	console.log("Deleted successfully");
	
	detachTask(taskId);

	if(data.tasks[0])
	  $(`#task${data.tasks[0].id}`).trigger("click");    	

      } else {
	console.log(response);
      }
    } catch(error) {
      console.log(error);
    }
  }

  function loadTodos(todos){
    clearTodos();
    todos.forEach((todo) => {
      // TODO: LATER: icon and color according to status; 
      appendTodo(todo);
    });
  }

  function clearTodos(){
    $('#todoList').text("");
  }

  // gets the current task shown in task manager
  function getCurrentTaskId(){
    if ($('.task-list>.active').length == 0)
      return 0;
    return extractId($('.task-list>.active').attr('id'));
  }

  function getCurrentTask(){
    for(var i = 0; i < data.tasks.length; i++)
      if(data.tasks[i].id == getCurrentTaskId()) {
	if(data.tasks[i].todos == undefined) data.tasks[i].todos = [];
	if(data.tasks[i].assignedMembers == undefined) data.tasks[i].assignedMembers = [];	
	return data.tasks[i];
      }
    return false;
  }

  function unsetCurrentTask(){
    if ($('.task-list>.active').length != 0)
      $('.task-list>.active').removeClass('active');
  }

  function loadMembersInSelect(){
    $("#membersSelect").text("");    
    for(var i = 0; i < data.tasks.length; i++){
      if(data.tasks[i].id == getCurrentTaskId()) {
        var assignedMembers = data.tasks[i].assignedMembers;
        var arrDiff = data.members.filter(e => {
          for(var j = 0; j < assignedMembers.length; j++)
            if(assignedMembers[j].id == e.id) return false;
          return true;
        });
        if(arrDiff.length == 0) {
          return false;
        }
        arrDiff.forEach((mem) => {
          $("#membersSelect").append(`<option value="${mem.id}">${mem.username}</option>`);
        });
      }
    }
    return true;
  }

  $('#taskMemberAdd').click(async (e)=> {
    e.preventDefault();
    if(getCurrentTaskId() == 0) {
      console.log("First, you need to create task!");
      return;
    }
    
    if(loadMembersInSelect()) {
      $('#memberSelectListItem').show();
      $('#taskMemberAddConfirm').show();
      $('#taskMemberCancel').show();              
    } else {
      console.log("There are only this much member in your project! Add more member to this project");
    }
  });

  $('#taskMemberCancel').click((e) => {
    $('#memberSelectListItem').hide();
    $('#taskMemberAddConfirm').hide();
    $('#taskMemberCancel').hide();            
  });

  $('#taskMemberAddConfirm').click(async (e) => {
    e.preventDefault();
    console.log("confirm add");

    var memId = $('#membersSelect').find(":selected").val();
    var member = (await $.get(`${memberApiUrl}/id/${memId}`)).member;

    var taskId = getCurrentTaskId();
    $.post({
      url: `${taskApiUrl}/${taskId}/add_member`,
      data: JSON.stringify({member_id: memId}),
      contentType: "application/json; charset=utf-8",
      success: (response) => {
        console.log(response);
        if(response.status == "Success"){
          appendTaskMember(member);

          // update local values too | assigned members too...
          for(var i = 0; i < data.tasks.length; i++)
            if(data.tasks[i].id == taskId) data.tasks[i].assignedMembers.push(member);

        } else {
          // TODO: put some error message ui
          console.log("Failed to add new member!");
        }
      }
    });

    $('#memberSelectListItem').hide();
    $('#taskMemberAddConfirm').hide();
    $('#taskMemberCancel').hide();        
  });
  
  function loadTaskMembersList(task){
    var taskMembersList = $("#taskMembersList");
    clearTaskMembersList();
    task.assignedMembers.forEach((member)=> {
      appendTaskMember(member);
    });
  }

  function clearTaskMembersList(){
    var taskMembersList = $("#taskMembersList");    
    taskMembersList.text('');    
  }

  function appendTaskMember(member){
    var taskMembersList = $("#taskMembersList");    
    taskMembersList.append(`
      <div class="flex justify-between" id="taskMember${member.id}">
        <li class="text-sm text-indigo-700 font-bold">${member.username}</li>
        <span><i class="fa fa-trash cursor-pointer text-sm text-red-600 hover:text-red-800 ml-auto transition-all" id="taskMember${member.id}Delete"></i></span>
      </div>
    `);

    $(`#taskMember${member.id}Delete`).click((e)=> {
      e.preventDefault();

      var taskId = getCurrentTaskId();
      var memId = extractId(e.target.id);

      $.ajax({
        method: 'delete',
        url: `${taskApiUrl}/${getCurrentTaskId()}/delete_member`,
        data: JSON.stringify({member_id: memId}),
        contentType: "application/json; charset=utf-8",
        success: (response)=> {
          if(response.status == "Success"){
            $(e.target).parent().parent().remove(); // div > span > i#delete
            console.log("member unassigned!");


            // update local values too
            for(var i = 0; i < data.tasks.length; i++) 
              if(data.tasks[i].id == taskId) {
                data.tasks[i].assignedMembers = data.tasks[i].assignedMembers.filter((e) => {
                  return !(e.id==memId);
                });
              }

          } else {
            console.log("member unassigned failed!");
          }
        }
      });
    });
  }



  // --------------------------------------------------------------------------------
  // TODO -- CODEBASE
  // --------------------------------------------------------------------------------

  // if todo === undefined, it's new todo to be inserted
  function appendTodo(todo){ 
    if(todo == undefined) {
      console.log("Adding empty todo");
      todo = {
	id: 0, // new todo,
	name: "New Todo Name",
	description: "New Todo Description",
	status: 0
      };
    }

    $('#todoList').append(`
	<div class="w-full sm:max-w-xs bg-indigo-100 rounded-md p-4 my-4" id="todo${todo.id}">
          <div class="border-b-8 ${todo.status == 2 ? "border-green-500" : "border-indigo-500"} mb-2 rounded-sm" id="todo${todo.id}Status"></div>
          <form id="todo${todo.id}Form" action="#"> 
            <input class="font-bold py-1 my-1 w-full text-sm bg-indigo-100 rounded-md outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 overflow-hidden transition-all" id="todo${todo.id}Name" value="${todo.name}" disabled/>
            <textarea class="text-sm w-full h-20 resize-none bg-indigo-100 rounded-md outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 overflow-x-hidden transition-all custom-scrollbar" type="text" id="todo${todo.id}Description"  disabled> ${todo.description}</textarea>

 	    <div class="flex justify-between items-center" id="todo${todo.id}Controls">
              <button class="focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50">
  	        <i class="fa fa-check cursor-pointer text-lg ${todo.status == 2 ? "text-green-600 hover:text-green-800" : "text-gray-600 hover:text-gray-800"} ${TODO_STATUS[todo.status]} p-2 transition-all" id="todo${todo.id}Check"></i>
              </button>
              <button class="focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50">
    	        <i class="fas fa-edit cursor-pointer text-lg text-indigo-600 hover:text-indigo-800 p-2 transition-all" id="todo${todo.id}Edit"></i>
              </button>
              <p class="text-xs text-green-400 ml-auto transition-all" id="todo${todo.id}Message" style="visibility: hidden;"> Todo updated successfully. </p>
  	      <i class="fa fa-trash cursor-pointer text-lg text-red-600 hover:text-red-800 p-2 ml-auto transition-all" id="todo${todo.id}Delete"></i>
              <button type="submit" class="focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"> 
                <i class="fa fa-check cursor-pointer text-lg text-green-600 hover:text-green-800 p-2 transition-all" id="todo${todo.id}EditDone" style="display: none;"></i>
              <button/>
      	    </div>
          </form>
	</div>
        `);

    
    var formInputs = [];
    var jqTodoName = $(`#todo${todo.id}Name`);
    var jqTodoDesc = $(`#todo${todo.id}Description`);
    var jqTodoAssigned = newTodoAssignedElement(todo).insertAfter(jqTodoDesc);
    formInputs.push(jqTodoName);
    formInputs.push(jqTodoDesc);
    formInputs.push(jqTodoAssigned);

    for(var i = 0; i < formInputs.length; i++){
      formInputs[i].focusout(focusoutCallback);	
    }

    $(`#todo${todo.id}EditDone`).click(editDoneCallback);
    $(`#todo${todo.id}Edit`).click(editCallback);
    $(`#todo${todo.id}Delete`).click(deleteCallback);
    $(`#todo${todo.id}Check`).click(checkCallback);

    // if this is new todo to be added 
    if(todo.id == 0) {
      enableTodoForm(todo.id, true);
    }

    return todo.id;
  }

  function enableTodoForm(todoId, focus){
    var formInputs = [];
    var jqTodoName = $(`#todo${todoId}Name`);
    var jqTodoDesc = $(`#todo${todoId}Description`);
    formInputs.push(jqTodoName);
    formInputs.push(jqTodoDesc);;    

    for(var i = 0; i < formInputs.length; i++){
      if(formInputs[i].attr("disabled")) {
        formInputs[i].attr("disabled", false);
      }
      if(formInputs[i].hasClass("bg-indigo-100")) {
        formInputs[i].removeClass("bg-indigo-100");
        formInputs[i].addClass("bg-white");            
      }
    }

    enableFormAssignTodoMemberDOM(todoId);
    
    if(focus)
      jqTodoName.focus();

    if(todoId != 0)
      $(`#todo${todoId}EditDone`).show();
  }


  function newTodoAssignedElement(todo){
    var todoAssignedElement = $(`
     <p class="text-xs font-bold"> Assigned To: </p>
     <div class="p-2">
       <i class="fas fa-user-check text-blue-500"></i>
       <p class="inline text-sm font-bold text-indigo-700" id="todoAssigned${todo.id}"></p>
       <select name="members" id="membersSelectTodo${todo.id}" class="w-32 text-sm font-bold text-indigo-600 px-2 rounded-md focus:outline-none border-2 border-indigo-100"></select>
     </div>
    `);
    getCurrentTask().assignedMembers.forEach((mem) => {
      todoAssignedElement.find(`#membersSelectTodo${todo.id}`).append(`<option value="${mem.id}" >${mem.username}</option>`);
      if(mem.id === todo.todo_assigned){
        todoAssignedElement.find(`#todoAssigned${todo.id}`).text(mem.username);      
      }
    });

    todoAssignedElement.find(`#membersSelectTodo${todo.id}`).hide();    
    return todoAssignedElement;
  }

  function refreshTodoAssignmentElement(todoId){
    $(`#membersSelectTodo${todoId}`).text("");
    getCurrentTask().assignedMembers.forEach((mem) => {
      $(`#membersSelectTodo${todoId}`).append(`<option value="${mem.id}" >${mem.username}</option>`);
    });    
  }
  
  function disableFormAssignTodoMemberDOM(todoId){
    $(`#todoAssigned${todoId}`).show();
    $(`#membersSelectTodo${todoId}`).hide();
  }

  function enableFormAssignTodoMemberDOM(todoId){
    $(`#todoAssigned${todoId}`).hide();
    refreshTodoAssignmentElement(todoId);
    $(`#membersSelectTodo${todoId}`).show();
  }

  function disableTodoForm(todoId){
    var formInputs = [];
    var jqTodoName = $(`#todo${todoId}Name`);
    var jqTodoDesc = $(`#todo${todoId}Description`);
    formInputs.push(jqTodoName);
    formInputs.push(jqTodoDesc);;        

    for(var i = 0; i < formInputs.length; i++) {
      formInputs[i].attr("disabled", true);
      if(formInputs[i].hasClass("bg-white")) {
	formInputs[i].removeClass("bg-white");            
	formInputs[i].addClass("bg-indigo-100");
      }				  
    }    
    disableFormAssignTodoMemberDOM(todoId);
    $(`#todo${todoId}EditDone`).hide();
  }

  function updateUITodo(todo){
    var todoItem = $(`#todo${todo.id}`);
    if(todoItem.length == 0) {
      console.log("No UI related to todo with id " + todo.id);
      return false; 
    }
    // var todoName = $(`#todo${todo.id}Name`);
    $(`#todo${todo.id}Description`).val(todo.description);
    return true;
  }

  function removeUITodo(todoId){
    $(`#todo${todoId}`).remove();
  }

  function extractId(id){
    return parseInt(id.match(/\d+/)[0]);
  }

  function editCallback(e){
    e.preventDefault();
    var todoId = extractId(e.target.id);
    enableTodoForm(todoId, true);
  }

  function deleteCallback(e){
    e.preventDefault();
    removeUITodo(extractId(e.target.id));
    // TODO: ajax delete 
  }

  function checkCallback(e){
    e.preventDefault();
    var todoId = extractId(e.target.id);
    var todoStatus = $(`#todo${todoId}Check`).hasClass("ACTIVE") ? 2 : 0;

    var todo = {
      status: todoStatus,
    };

    $.post({
      url: `${todoApiUrl}/edit/${todoId}`,
      data: JSON.stringify(todo),
      contentType: "application/json; charset=utf-8",
      success: (response) => {
	if(response.status == "Success"){
	  if(todoStatus == 2){
	    $(`#todo${todoId}Check`).removeClass("text-gray-600");
	    $(`#todo${todoId}Check`).removeClass("hover:text-gray-800");
	    $(`#todo${todoId}Check`).addClass("text-green-600");
	    $(`#todo${todoId}Check`).addClass("hover:text-green-800");
	    if($(`#todo${todoId}Check`).hasClass("ACTIVE")) {
	      $(`#todo${todoId}Check`).removeClass("ACTIVE");
	      $(`#todo${todoId}Check`).addClass(TODO_STATUS[todoStatus]);
	    }
            $(`#todo${todoId}Status`).removeClass("border-indigo-300");            
            $(`#todo${todoId}Status`).addClass("border-green-300");            
	  } else { 
	    $(`#todo${todoId}Check`).removeClass("text-green-600");
	    $(`#todo${todoId}Check`).removeClass("hover:text-green-800");
	    $(`#todo${todoId}Check`).addClass("text-gray-600");
	    $(`#todo${todoId}Check`).addClass("hover:text-gray-800");
	    if($(`#todo${todoId}Check`).hasClass("COMPLETE")) {
	      $(`#todo${todoId}Check`).removeClass("COMPLETE");
	      $(`#todo${todoId}Check`).addClass(TODO_STATUS[todoStatus]);
	    }
            $(`#todo${todoId}Status`).addClass("border-indigo-300");            
            $(`#todo${todoId}Status`).removeClass("border-green-300");                        
	  }

	  // TODO: update intenal data..
	  for(var i = 0; i < data.tasks.length; i++){
	    if(getCurrentTaskId() == data.tasks[i].id)
	      for(var j = 0; j < data.tasks[i].todos.length; j++)
		if(data.tasks[i].todos[j].id == todoId)
		  data.tasks[i].todos[j].status = todoStatus;
	  }
	}
      }
    });
    
  }


  function editDoneCallback(e){
    e.preventDefault();
    var todoId = extractId(e.target.id);
    var todoName = $(`#todo${todoId}Name`);
    var todoDesc = $(`#todo${todoId}Description`);
    var todoAssigned = $(`#membersSelectTodo${todoId}`).find(":selected");

    var todo = {
      name: todoName.val(),
      description: todoDesc.val(),
      todo_assigned: todoAssigned.val(),
    };

    $.post({
      url: `${todoApiUrl}/edit/${todoId}`,
      data: JSON.stringify(todo),
      contentType: "application/json; charset=utf-8",
      success: (response) => {
        $(`#todo${todoId}Message`).text(response.message);                  
        $(`#todo${todoId}Message`).css('visibility', 'visible').fadeOut(3000);
        setTimeout(() => {
          $(`#todo${todoId}Message`).css('visibility', 'hidden');
        }, 3000);
        $(`#todoAssigned${todoId}`).text(todoAssigned.text());
      }
    });

    disableTodoForm(todoId);	  
    $(`#todo${todoId}EditDone`).hide();    
  }


  function focusoutCallback(e){
    var todoId = extractId(e.target.id);
    if(todoId == 0) return;
    var jqTodoForm = $(`#todo${todoId}Form`);

    if(jqTodoForm.is(":focus-within")){
      console.log("form within focus");
    } else {
      console.log("form not in focus");
      // NOTE: we hide it later if edit focus is out without editDone being pressed
      // FIXME: find better solution than this.. 
      setTimeout(async () => {
	disableTodoForm(todoId);
	// we update to database to clear out any not saved edits
	$.get({
	  url: `${todoApiUrl}/id/${todoId}`,
	  success: (response) => {
	    updateUITodo(response);
	  }
	});
      }, 500);	      	      
    }
  }


  async function dbTodoAdd(todo){
    // add defaults to work

    return await $.post({
      url: `${todoApiUrl}/add`,
      data: JSON.stringify(todo),
      contentType: "application/json; charset=utf-8",
    });
  }

});
