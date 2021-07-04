CREATE TABLE `Checklist`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` INT NOT NULL,
    `effort_hour` INT NOT NULL COMMENT 'Checklist is the smallest thing you can do. So, we can approximate effort in work hours needed to complete the Check. This is the last leaf in this hierarchy.',
    `check_assigned` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `task_members`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_id` INT UNSIGNED NOT NULL,
    `member_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `Task`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` INT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `progress` INT NOT NULL,
    `efforts_needed` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    `checklist` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `project_members`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INT UNSIGNED NOT NULL,
    `member_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

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
    `tasks` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `Members`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `level` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    PRIMARY KEY(`id`)
);

ALTER TABLE
    `Projects` ADD CONSTRAINT `projects_tasks_foreign` FOREIGN KEY(`tasks`) REFERENCES `Task`(`id`);
ALTER TABLE
    `Projects` ADD CONSTRAINT `projects_project_manager_foreign` FOREIGN KEY(`project_manager`) REFERENCES `Members`(`id`);
ALTER TABLE
    `Task` ADD CONSTRAINT `task_checklist_foreign` FOREIGN KEY(`checklist`) REFERENCES `Checklist`(`id`);
ALTER TABLE
    `project_members` ADD CONSTRAINT `project_members_project_id_foreign` FOREIGN KEY(`project_id`) REFERENCES `Projects`(`id`);
ALTER TABLE
    `project_members` ADD CONSTRAINT `project_members_member_id_foreign` FOREIGN KEY(`member_id`) REFERENCES `Members`(`id`);
ALTER TABLE
    `task_members` ADD CONSTRAINT `task_members_task_id_foreign` FOREIGN KEY(`task_id`) REFERENCES `Task`(`id`);
ALTER TABLE
    `task_members` ADD CONSTRAINT `task_members_member_id_foreign` FOREIGN KEY(`member_id`) REFERENCES `Members`(`id`);
