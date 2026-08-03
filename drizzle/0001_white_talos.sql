CREATE INDEX "offering_schedules_subject_offering_id_idx" ON "offering_schedules" USING btree ("subject_offering_id");--> statement-breakpoint
CREATE INDEX "students_course_id_idx" ON "students" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "students_section_id_idx" ON "students" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "subject_offerings_subject_id_idx" ON "subject_offerings" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "subject_offerings_faculty_id_idx" ON "subject_offerings" USING btree ("faculty_id");--> statement-breakpoint
CREATE INDEX "subject_offerings_section_period_idx" ON "subject_offerings" USING btree ("section_id","period_id");--> statement-breakpoint
ALTER TABLE "academic_periods" ADD CONSTRAINT "academic_periods_year_term_unique" UNIQUE("start_year","end_year","term");--> statement-breakpoint
ALTER TABLE "subject_offerings" ADD CONSTRAINT "subject_offerings_subject_section_period_unique" UNIQUE("subject_id","section_id","period_id");