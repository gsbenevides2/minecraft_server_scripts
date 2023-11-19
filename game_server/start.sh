#!/bin/bash

echo "Create a screen session and run ./bedrock_server and send the output to the screen.log file"
screen -S mc_server -d -L -Logfile teste.log -m ./bedrock_server