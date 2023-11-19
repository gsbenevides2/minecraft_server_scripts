#!/bin/bash

echo "Run Stop insied screen session"
screen -S mc_server -X stuff "stop^M"