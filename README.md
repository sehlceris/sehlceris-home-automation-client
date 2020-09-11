# sehlceris-home-automation-client

Super simple client to respond to home automation requests from the main server.
Requires node.js 12+

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
```

Edit your config.json to your needs

Next, depending on your platform (Windows vs Linux), install the service:

## windows

Copy the `windows-startup` folder into `C:\apps`, editing the files as necessary depending on your folder structure.

Go to RUN > `shell:startup` and create a shortcut to `autostart.bat`

## linux

```bash
sudo su

SERVICE_NAME=sehlceris-home-automation-client
NPM_PATH="$(which npm)"
APP_DIRECTORY=$PWD

echo "[Unit]
Description=$SERVICE_NAME

[Service]
Restart=always
ExecStart=$NPM_PATH --prefix $APP_DIRECTORY run start

[Install]
WantedBy=default.target
" | sudo tee /etc/systemd/system/$SERVICE_NAME.service  > /dev/null

systemctl stop $SERVICE_NAME
systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME
sleep 5
systemctl status $SERVICE_NAME
```
