sudo ufw allow 8080

# nodejs
sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt -y upgrade
curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo DEBIAN_FRONTEND=noninteractive apt -y install nodejs

npm install -g pm2

git clone https://github.com/hirebarend/three-phase-commit.git

cd three-phase-commit

npm install

npm run build

pm2 start dist/server.js
