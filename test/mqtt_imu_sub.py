import json
import time

import paho.mqtt.client as mqtt

import mqtt_config as MQTT_CONFIG


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print(f"Connected to {client} with result code {rc}")
    client.subscribe("imu")


start_time, samples = time.time(), 0


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    global start_time, samples
    data = json.loads(msg.payload)
    print(data)
    if "accelerometer" in data:
        # print(data["accelerometer"])
        now = time.time()
        elapsed = now - start_time
        if elapsed > 1:
            # logger.info("{:0.1f} samples/sec", samples / elapsed)
            # print("samples", samples)
            start_time, samples = now, 0
        samples += 1


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.on_log = True

if MQTT_CONFIG.user:
    client.username_pw_set(MQTT_CONFIG.user, password=MQTT_CONFIG.password)
print("Connecting to", MQTT_CONFIG.host, end="...")
client.connect(MQTT_CONFIG.host, MQTT_CONFIG.port)
print("done")

client.loop_forever()
