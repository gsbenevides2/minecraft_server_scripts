#!/bin/bash

# Check if git is installed
if ! [ -x "$(command -v git)" ]; then
    echo 'Git is not installed. Installing Git...' >&2
    sudo apt-get update -y && sudo apt-get upgrade -y && sudo apt-get install -y git
fi

# Check if curl is installed
if ! [ -x "$(command -v curl)" ]; then
    echo 'Curl is not installed. Installing Curl...' >&2
    sudo apt-get update -y && sudo apt-get upgrade -y && sudo apt-get install -y curl
fi

# Check if node is installed
if ! [ -x "$(command -v node)" ]; then
    echo 'Error: Node is not installed. Please install via NVM' >&2
    exit 1
fi

