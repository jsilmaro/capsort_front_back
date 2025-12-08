#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push database schema (for initial deployment)
# Use this instead of migrate for Render free tier
npx prisma db push --accept-data-loss

echo "Build completed successfully!"
