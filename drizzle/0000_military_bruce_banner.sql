CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`id_document_path` varchar(512) NOT NULL,
	`is_verified` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`owner_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`address` varchar(255) NOT NULL,
	`beds` int NOT NULL,
	`baths` int NOT NULL,
	`property_type` enum('apartment','flat','room','house') NOT NULL,
	`image_url` varchar(512),
	`badge` varchar(50),
	`latitude` varchar(50) NOT NULL,
	`longitude` varchar(50) NOT NULL,
	`is_roommate_option` boolean DEFAULT false,
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roommate` (
	`id` int AUTO_INCREMENT NOT NULL,
	`property_id` int NOT NULL,
	`occupation` varchar(100) NOT NULL,
	`age` int NOT NULL,
	`genderEnums` enum('male','female','other') NOT NULL DEFAULT 'other',
	`facultyEnum` enum('Science','Management','Humanities','Others') NOT NULL,
	`educationEnum` enum('High School','Bachelor','Master','PhD','undisclosable') NOT NULL,
	`is_smoker` boolean DEFAULT false,
	`has_pets` boolean DEFAULT false,
	`pref_min_age` int DEFAULT 18,
	`pref_max_age` int DEFAULT 40,
	CONSTRAINT `roommate_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `properties` ADD CONSTRAINT `properties_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roommate` ADD CONSTRAINT `roommate_property_id_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;