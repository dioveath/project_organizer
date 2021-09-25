


-- Gets the project of the member with member_id 
select p.id, p.name, p.description, p.status, p.budget, p.start_date, p.end_date, p.project_manager, p.efforts_needed, p.efforts_put, p.progress from projects as p join project_members as pm on p.id = pm.project_id where member_id=5;

-- Gets all the tasks for the given member, 
select p.name, t.name from projects as p join project_members as pm on p.id = pm.project_id join tasks as t on t.project_id = p.id where pm.member_id=5 and pm.project_id=2;


-- Gets ids of all the projects where member is given member_id
select p.id as project_id from projects as p join project_members as pm on p.id = pm.project_id where p.member_id=5;


-- Gets members of the project where project is given project_id excluding password
select m.id, m.username, m.email, m.level, m.efforts_put, m.profile_image, m.color from members as m join project_members as pm on m.id = pm.member_id join projects as p on p.id = pm.project_id where p.id=2;


-- Gets working projects and managing projects of member.
select * from (select * from projects where project_manager=5) as mp union all (select p.id, p.name, p.description, p.status, p.budget, p.start_date, p.end_date, p.project_manager, p.efforts_needed, p.efforts_put, p.progress from projects as p join project_members as pm on p.id = pm.project_id where pm.member_id=5);


-- Gets all the todos of the project with given id.
SELECT todos.* FROM (SELECT todos.id as todo_id, tasks.id as task_id, tasks.project_id FROM todos left join tasks on tasks.id = todos.task_id) as project_tasks join todos on project_tasks.todo_id = todos.id where project_id=2;


-- Update projects
UPDATE  projects SET name=?, description=?, status=?, budget=?, start_date=?, end_date=?, project_manager=?, efforts_needed=?, efforts_put=?, progress=? WHERE id=?;





-- Get All todos of task with given id
SELECT * FROM todos WHERE task_id=?; 


-- Update Todos
UPDATE todos SET name=?, description=?, status=?, effort_hour=?, todo_assigned=?, task_id=? where id=?;
UPDATE todos SET name='Take down the guard.' where id=2;


-- Is In Project
select * from (select * from (select * from projects where project_manager=5) as mp union all (select p.* from projects as p join project_members as pm on p.id = pm.project_id where pm.member_id=5)) as ap where ap.id = 1;


-- Is Project Manager
-- select * from projects left join members on members.id = projects.project_manager where members.id=1;
select * from projects where id=3 and project_manager=1;


-- get taskmembers
select * from members as m left join task_members as tm on tm.member_id=m.id where tm.task_id=1;


-- delete/unassign members from task
delete from task_members where task_id=1 and member_id=1;





--------------------------------------------------------------------------------
-- PROJECTS
--------------------------------------------------------------------------------

-- deletes/removes project member from project.
delete from project_members where project_id=2 and member_id=1;

-- Gets all the tasks of the project
SELECT tasks.* from tasks where project_id=2;


-- sets the progress of tasks according to all project's tasks completion percent
update projects set
       progress = (select overallProgress/totalPercent * 100 from
       	      (select sum(progress) as overallProgress from tasks where project_id=2) as table1,
       	      (select (count(*)*100) as totalPercent from tasks where project_id=2) as table2)
       where id=2;

-- using this as trigger on tasks
IF OLD.progress <> NEW.progress THEN

update projects set
       progress = (select overallProgress/totalPercent * 100 from
       	      (select sum(progress) as overallProgress from tasks where project_id=old.project_id) as table1,
       	      (select (count(*)*100) as totalPercent from tasks where project_id=old.project_id) as table2)
       where id=old.project_id;       
       
END IF




-- porgress percent
update projects set 
       progress = (select ((completed_tasks.completed_tasks_count/all_tasks.all_tasks_count)*100) as progressPercent from 
       	      (select count(*) as all_tasks_count from todos where task_id=1) as all_tasks,
              (select count(*) as completed_tasks_count from todos where task_id=1 and status=2) as completed_tasks)
       WHERE id=1;



--------------------------------------------------------------------------------
-- TASKS
--------------------------------------------------------------------------------

-- progress percent
select * from 
     (select count(*) as all_tasks_count from todos where task_id=1) as all_tasks,
     (select count(*) as completed_tasks_count from todos where task_id=1 and status=2) as completed_tasks;

select ((completed_tasks.completed_tasks_count/all_tasks.all_tasks_count)*100) as progressPercent from 
     (select count(*) as all_tasks_count from todos where task_id=1) as all_tasks,
     (select count(*) as completed_tasks_count from todos where task_id=1 and status=2) as completed_tasks;


update tasks set 
       progress = (select ((completed_tasks.completed_tasks_count/all_tasks.all_tasks_count)*100) as progressPercent from 
       	      (select count(*) as all_tasks_count from todos where task_id=1) as all_tasks,
              (select count(*) as completed_tasks_count from todos where task_id=1 and status=2) as completed_tasks)
       WHERE id=1;


-- tasks progress triggerer
IF OLD.status <> NEW.status THEN
update tasks set 
       progress = (select ((completed_tasks.completed_tasks_count/all_tasks.all_tasks_count)*100) as progressPercent from 
       	      (select count(*) as all_tasks_count from todos where task_id=old.task_id) as all_tasks,
              (select count(*) as completed_tasks_count from todos where task_id=old.task_id and status=2) as completed_tasks)
       WHERE id=old.task_id;
END IF




