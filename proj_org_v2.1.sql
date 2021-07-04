CREATE TABLE `Todos`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` INT NOT NULL,
    `effort_hour` INT NOT NULL COMMENT 'Todos is the smallest thing you can do. So, we can approximate effort in work hours needed to complete the Todo. This is the last leaf in this hierarchy.',
    `todo_assigned` INT NOT NULL,
    `task_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

ALTER TABLE
    `Todos` ADD UNIQUE `todos_todo_assigned_unique`(`todo_assigned`);
ALTER TABLE
    `Todos` ADD UNIQUE `todos_task_id_unique`(`task_id`);
CREATE TABLE `task_members`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_id` INT UNSIGNED NOT NULL,
    `member_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `Tasks`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` INT NOT NULL,
    `project_id` INT UNSIGNED NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `progress` INT NOT NULL,
    `efforts_needed` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    PRIMARY KEY(`id`)
);

ALTER TABLE
    `Tasks` ADD UNIQUE `task_project_id_unique`(`project_id`);
CREATE TABLE `project_members`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INT UNSIGNED NOT NULL,
    `member_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

ALTER TABLE
    `project_members` ADD UNIQUE `project_members_project_id_unique`(`project_id`);
ALTER TABLE
    `project_members` ADD UNIQUE `project_members_member_id_unique`(`member_id`);
CREATE TABLE `Projects`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `status` INT NOT NULL,
    `budget` INT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL COMMENT 'Deadline of the project',
    `project_manager` INT UNSIGNED NOT NULL,
    `progress` DOUBLE(8, 2) NOT NULL,
    `efforts_needed` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    PRIMARY KEY(`id`)
);

ALTER TABLE
    `Projects` ADD UNIQUE `projects_project_manager_unique`(`project_manager`);
CREATE TABLE `Members`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `level` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    PRIMARY KEY(`id`)
);


ALTER TABLE
    `Projects` ADD CONSTRAINT `projects_project_manager_foreign` FOREIGN KEY(`project_manager`) REFERENCES `Members`(`id`) ON DELETE CASCADE;
ALTER TABLE
    `Tasks` ADD CONSTRAINT `task_project_id_foreign` FOREIGN KEY(`project_id`) REFERENCES `Projects`(`id`) ON DELETE CASCADE;
ALTER TABLE
    `project_members` ADD CONSTRAINT `project_members_project_id_foreign` FOREIGN KEY(`project_id`) REFERENCES `Projects`(`id`);
ALTER TABLE
    `project_members` ADD CONSTRAINT `project_members_member_id_foreign` FOREIGN KEY(`member_id`) REFERENCES `Members`(`id`);
ALTER TABLE
    `Todos` ADD CONSTRAINT `todos_task_id_foreign` FOREIGN KEY(`task_id`) REFERENCES `Tasks`(`id`) ON DELETE CASCADE;
ALTER TABLE
    `task_members` ADD CONSTRAINT `task_members_task_id_foreign` FOREIGN KEY(`task_id`) REFERENCES `Tasks`(`id`);
ALTER TABLE
    `task_members` ADD CONSTRAINT `task_members_member_id_foreign` FOREIGN KEY(`member_id`) REFERENCES `Members`(`id`);
