ALTER TABLE "students" ADD COLUMN "is_enrolled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "isEnrolled";