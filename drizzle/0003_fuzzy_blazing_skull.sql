CREATE TABLE `property_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`property_id` int NOT NULL,
	`applicant_id` int NOT NULL,
	`message` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `property_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roommate_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roommate_opening_id` int NOT NULL,
	`applicant_id` int NOT NULL,
	`message` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `roommate_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `roommate` MODIFY COLUMN `facultyEnum` enum('science','management','humanities','others') NOT NULL;--> statement-breakpoint
ALTER TABLE `roommate` MODIFY COLUMN `educationEnum` enum('high-school','bachelor','master','phd','undisclosable') NOT NULL;--> statement-breakpoint
ALTER TABLE `roommate` ADD `gender` enum('male','female','other') NOT NULL;--> statement-breakpoint
ALTER TABLE `roommate` ADD `pref_gender` enum('male','female','other') DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE `property_applications` ADD CONSTRAINT `property_applications_property_id_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `property_applications` ADD CONSTRAINT `property_applications_applicant_id_users_id_fk` FOREIGN KEY (`applicant_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roommate_applications` ADD CONSTRAINT `roommate_applications_roommate_opening_id_roommate_id_fk` FOREIGN KEY (`roommate_opening_id`) REFERENCES `roommate`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roommate_applications` ADD CONSTRAINT `roommate_applications_applicant_id_users_id_fk` FOREIGN KEY (`applicant_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roommate` DROP COLUMN `genderEnums`;