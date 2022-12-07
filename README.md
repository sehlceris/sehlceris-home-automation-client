# sehlceris-home-automation-client

Super simple client to respond to home automation requests from the main server.
Requires node.js 12+

## setup

```shell
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

First, enable passwordless sudo for the necessary commands:

```shell
visudo
```

```
## admins can shutdown/suspend/reboot without password
%sudo   ALL=(ALL) NOPASSWD:/sbin/shutdown
%sudo   ALL=(ALL) NOPASSWD:/sbin/shutdown -i
%sudo   ALL=(ALL) NOPASSWD:/bin/systemctl poweroff
%sudo   ALL=(ALL) NOPASSWD:/bin/systemctl reboot
%sudo   ALL=(ALL) NOPASSWD:/bin/systemctl suspend
%sudo   ALL=(ALL) NOPASSWD:/bin/systemctl suspend -i --no-wall
%sudo   ALL=(ALL) NOPASSWD:/bin/systemctl hibernate
%sudo   ALL=(ALL) NOPASSWD:/bin/systemctl hibernate -i --no-wall
```

Secondly, you can install a service that runs on boot.

```shell
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

sudo systemctl stop $SERVICE_NAME
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME
sleep 5
sudo systemctl status $SERVICE_NAME
```
