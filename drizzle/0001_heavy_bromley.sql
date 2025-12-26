ALTER TABLE `users` ADD `role` enum('user','admin') DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('accepted','pending','rejected') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `is_verified`;