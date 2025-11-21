#!/bin/bash
set -e

# Export the password so psql can use it automatically
export PGPASSWORD=$POSTGRES_PASSWORD

# This script will be executed by the PostgreSQL container on initialization.
# It creates an additional database for testing purposes.

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Check if the test database already exists before attempting to create it.
    -- This makes the script idempotent (safe to run multiple times).
    SELECT 'CREATE DATABASE rockbandpay_test'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'rockbandpay_test')\gexec
EOSQL
