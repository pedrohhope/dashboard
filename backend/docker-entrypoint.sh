#!/bin/sh

set -e

echo "Waiting for MongoDB to be ready..."

until nc -z -v -w30 mongo 27017; do
  echo "Waiting for MongoDB connection..."
  sleep 5
done

echo "MongoDB is up!"

echo "Running database seed..."
npm run seed || echo "Seeding failed, continuing..."

echo "Starting application..."
exec "$@"
