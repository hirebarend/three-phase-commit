# v7DyW$925&6i

sudo ufw allow 8080

# nodejs
sudo apt update
sudo apt -y upgrade
curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt -y install nodejs
# sudo dpkg -i --force-overwrite /var/cache/apt/archives/nodejs_20.5.0-deb-1nodesource1_amd64.deb
# sudo apt -y install npm

npm install -g pm2

git clone https://github.com/hirebarend/three-phase-commit.git

cd three-phase-commit

npm install

npm run build

pm2 start dist/server.js
