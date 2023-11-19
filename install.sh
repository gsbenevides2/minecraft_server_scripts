#!/bin/bash

echo "Cheking dependencies..."

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

echo "Cloning scripts repository..."
git clone https://github.com/gsbenevides2/minecraft_server_scripts.git mc_server
echo "Installing BDS Server..."
cd mc_server/game_server
node updateOrInstallBinaries.js
echo "Download development behavior pack"
git clone https://github.com/gsbenevides2/minecraft_development_behavior_packs development_behavior_packs
cd development_behavior_packs
echo "Installing development behavior pack"
folders=$(ls -d */)
for folder in $folders
do
    cd $folder
    npm install
    npm run build
    cd ..
done
cd ..
echo "Installing development resource pack"
git clone https://github.com/gsbenevides2/minecraft_development_resource_packs development_resource_packs
echo "\n\n\n\n\n"
echo "Finished ..................................................... but not really"
echo "Remender to change the server.properties file to your needs"
echo "Remender to change the whitelist.json file to your needs"
echo "Remender to change the config/default/permissions.json file to your needs"
echo "Remender to add the downloaded behavior pack in the worlds/WORLD_NAME/world_behavior_packs.json file"
echo "Remender to add the downloaded resource pack in the worlds/WORLD_NAME/world_resource_packs.json file"
echo "Remender to change the worlds/WORLD_NAME/level.dat in https://offroaders123.github.io/Dovetail/ and change the lines to be like this:"
echo "  experiments: {
    experiments_ever_used: 1b,
    gametest: 1b,
    saved_with_toggled_experiments: 1b
  }"
echo "Done!"

