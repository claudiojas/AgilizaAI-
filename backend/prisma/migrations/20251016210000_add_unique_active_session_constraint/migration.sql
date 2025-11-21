-- This migration adds a partial unique index to the sessions table.
-- It ensures that there can be only one session with the status 'ACTIVE' for each 'tableId'.
-- This prevents race conditions where multiple active sessions could be created for the same table simultaneously.

CREATE UNIQUE INDEX "one_active_session_per_table" ON "public"."sessions" ("tableId") WHERE "status" = 'ACTIVE';
