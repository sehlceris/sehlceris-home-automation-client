# sehlceris-home-automation-client

Super simple client to respond to home automation requests from the main server.

## setup

```bash
SERVICE_NAME=sehlceris-home-automation-client
mkdir -p ~/apps
cd ~/apps
git clone https://github.com/sehlceris/$SERVICE_NAME.git
cd $SERVICE_NAME
cp config.example.json config.json
chmod 600 config.json
npm i

echo "[Unit]
Description=$SERVICE_NAME

[Service]
Restart=always
ExecStart=npm --prefix $PWD start

[Install]
WantedBy=default.target
" | sudo tee /etc/systemd/system/$SERVICE_NAME.service  > /dev/null

sudo systemctl stop $SERVICE_NAME
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME
```
