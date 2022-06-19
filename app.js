const fs = require('fs');
const {exec} = require('child_process');
const asyncMqtt = require('async-mqtt');

const RemoteControlMqttTopic = Object.freeze({
  sleepComputerRequest: 'sleepComputerRequest',
  shutdownComputerRequest: 'shutdownComputerRequest',
  wakeComputerRequest: 'wakeComputerRequest',
});

class HomeAutomationClient {
  constructor() {
    this.parseConfig();
  }

  async start() {
    try {
      await this.connectToMqtt();
      await this.subscribeToTopics();
    } catch (err) {
      console.error(`failed to connect to mqtt broker: ${err}`);
      throw err;
    }
  }

  parseConfig() {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    this.topicSubscriptions = config.topicSubscriptions;
    this.mqttBrokerUri = config.mqttBrokerUri;
    this.mqttUsername = config.mqttUsername;
    this.mqttPassword = config.mqttPassword;
    this.isWindows = process.platform === 'win32';
  }

  async publishMessage(topic, message) {
    if (this.mqttClient && this.mqttClient.connected) {
      if (typeof message === 'object') {
        message = JSON.stringify(message);
      }
      console.log(`publishing message to topic: ${topic}`);
      await this.mqttClient.publish(topic, message);
    } else {
      const errorMessage = 'unable to emit message due to mqtt client not being connected';
      console.error(errorMessage);
      throw errorMessage;
    }
  }

  async connectToMqtt() {
    console.log(
      `connecting to mqtt broker at ${this.mqttBrokerUri} with user '${this.mqttUsername}'`,
    );
    if (this.mqttClient) {
      await this.mqttClient.end();
      this.mqttClient = null;
    }
    this.mqttClient = await asyncMqtt.connectAsync(this.mqttBrokerUri, {
      username: this.mqttUsername,
      password: this.mqttPassword,
    });
    this.mqttClient.on('message', this.handleMessage.bind(this));
    console.log('mqtt client connected');
  }

  async subscribeToTopics() {
    for (const topic of this.topicSubscriptions) {
      await this.mqttClient.subscribe(topic);
      console.log(`subscribed to topic: ${topic}`);
    }
  }

  async handleMessage(topic, message) {
    console.log(`handling mqtt message from topic: '${topic}' and message: ${message}`);
    switch (topic) {
      case RemoteControlMqttTopic.sleepComputerRequest:
        return this.sleepComputer();
      case RemoteControlMqttTopic.shutdownComputerRequest:
        return this.shutdownComputer();
      case RemoteControlMqttTopic.wakeComputerRequest:
        return this.wakeComputer();
      default:
        console.warn(`ignoring unrecognized mqtt message topic`);
        break;
    }
  }

  sleepComputer(topic, message) {
    const command = this.isWindows
      ? 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0'
      : 'sudo systemctl suspend';
    console.log(`exec: ${command}`);
    exec(command);
  }

  shutdownComputer(topic, message) {
    const command = this.isWindows
      ? 'shutdown /s /t 1'
      : 'sudo systemctl poweroff';
    console.log(`exec: ${command}`);
    exec(command);
  }

  wakeComputer(topic, message) {
    // TODO, don't know how to use WOL effectively yet
  }
}

const main = async () => {
  const homeAutomationClient = new HomeAutomationClient();
  await homeAutomationClient.start();
};
main()
  .then(() => {
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });