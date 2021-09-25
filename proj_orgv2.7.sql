CREATE TABLE `Todos`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` INT NOT NULL,
    `effort_hour` INT NOT NULL COMMENT 'Checklist is the smallest thing you can do. So, we can approximate effort in work hours needed to complete the Check. This is the last leaf in this hierarchy.',
    `todo_assigned` INT UNSIGNED NOT NULL,
    `task_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `task_members`(
    `task_id` INT UNSIGNED NOT NULL,
    `member_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`task_id`, `member_id`)
);

CREATE TABLE `Tasks`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `status` INT NOT NULL,
    `project_id` INT UNSIGNED NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `efforts_needed` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    `progress` INT NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `project_members`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INT UNSIGNED NOT NULL,
    `member_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `project_efforts_daily`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `project_id` INT NOT NULL,
    `member_id` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    `date` DATE NOT NULL,
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
    `efforts_needed` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    `progress` INT NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `Members`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` INT NOT NULL,
    `level` INT NOT NULL,
    `efforts_put` INT NOT NULL,
    `profile_image` TEXT NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
);

ALTER TABLE
    `Projects` ADD CONSTRAINT `projects_project_manager_foreign` FOREIGN KEY(`project_manager`) REFERENCES `Members`(`id`);
ALTER TABLE
    `project_members` ADD CONSTRAINT `project_members_project_id_foreign` FOREIGN KEY(`project_id`) REFERENCES `Projects`(`id`);
ALTER TABLE
    `project_members` ADD CONSTRAINT `project_members_member_id_foreign` FOREIGN KEY(`member_id`) REFERENCES `Members`(`id`);
ALTER TABLE
    `Todos` ADD CONSTRAINT `todos_task_id_foreign` FOREIGN KEY(`task_id`) REFERENCES `Tasks`(`id`);
ALTER TABLE
    `task_members` ADD CONSTRAINT `task_members_task_id_foreign` FOREIGN KEY(`task_id`) REFERENCES `Tasks`(`id`);
