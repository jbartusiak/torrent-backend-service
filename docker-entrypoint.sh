#!/bin/bash

sed -i "s|PLACEHOLDER_SERVER_HOST|${SERVER_HOST}|" /app/.env
sed -i "s|PLACEHOLDER_SERVER_PORT|${SERVER_PORT}|" /app/.env
sed -i "s|PLACEHOLDER_SERVER_USERNAME|${SERVER_USERNAME}|" /app/.env
sed -i "s|PLACEHOLDER_SERVER_PASSWORD|${SERVER_PASSWORD}|" /app/.env

node build/index.js