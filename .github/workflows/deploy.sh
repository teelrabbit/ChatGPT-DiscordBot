#!/bin/bash
set -e

# Copy the code to the EC2 instance
aws s3 cp s3://my-bucket/my-discord-bot.zip .
unzip my-discord-bot.zip

# Stop the current bot process
pm2 stop my-discord-bot

# Start the new bot process
pm2 start my-discord-bot
