# sehlceris-home-automation-client

Super simple client to respond to home automation requests from the main server.

## setup

```bash
SERVICE_NAME=sehlceris-home-automation-client
mkdir -p ~/apps
cd ~/apps
git clone https://github.com/sehlceris/$SERVICE_NAME.git
cd $SERVICE_NAME
touch config.json
chmod 600 config.json
npm i
npm run build
```

Edit your config.json to your needs (you only need to set the WSS URL)

Next, depending on your platform (Windows vs Linux), install the service:

## windows

Copy the `windows-startup` folder into `C:\apps`, editing the files as necessary depending on your folder structure.

Go to RUN > `shell:startup` and create a shortcut to `autostart.bat`

## linux

```bash
echo "[Unit]
Description=$SERVICE_NAME

[Service]
Restart=always
ExecStart=npm --prefix $PWD run start

[Install]
WantedBy=default.target
" | sudo tee /etc/systemd/system/$SERVICE_NAME.service  > /dev/null

sudo systemctl stop $SERVICE_NAME
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME
```
