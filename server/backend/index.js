const ROOM_DEVICES = 'devices'
const ROOM_DASHBOARDS = 'dashboards'

const MESSAGE_INITIALIZE_DEVICE = 'initialize_device';
const MESSAGE_INITIALIZE_DASHBOARD = 'initialize_dashboard';
const MESSAGE_DATA_RECORDING = 'data_recording';

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var initializedDeviceDataMap = {}; // key: socket ID, value: initialized data

// magic required for repl.it
if (typeof __dirname === 'undefined') {
  __dirname = path.resolve(path.dirname(''));
}

io.on('connect', function(socket){
  console.log('A client connected');

  socket.on('disconnect', function(){
    if (socket.id in initializedDeviceDataMap) {
      console.log('A device disconnected');
      delete initializedDeviceDataMap[socket.id]
      logCurrentlyInitializedDevices();
    } else {
      console.log('A client disconnected');
    }
  });

  socket.on('message', function(message){
    try {
      if (typeof message === 'string') {
        message = JSON.parse(message);
      }

      var key = message.key;
      var data = message.data;

      switch(key) {
        case MESSAGE_INITIALIZE_DEVICE:
          initializeDevice(socket, data);
          io.to(ROOM_DASHBOARDS).send(message);
          break;
        case MESSAGE_INITIALIZE_DASHBOARD:
          initializeDashboard(socket, data);
          break;
        case MESSAGE_DATA_RECORDING:
          io.to(ROOM_DASHBOARDS).send(message);
          break;
        default:
          console.log('Unknown message key: ' + key);
          break;
      }
    } catch(error) {
      console.log('Unable to handle message:\n' + JSON.stringify(message));
      console.error(error);
    }
  });

});

function initializeDevice(socket, data){
  console.log('Initializing a device running the BAuth app:\n' + JSON.stringify(data));
  socket.join(ROOM_DEVICES);
  initializedDeviceDataMap[socket.id] = data;
  logCurrentlyInitializedDevices();
}

function initializeDashboard(socket, data){
  console.log('Initializing a dashboard:\n' + JSON.stringify(data));
  socket.join(ROOM_DASHBOARDS);

  Object.values(initializedDeviceDataMap).forEach(function(deviceData) {
    socket.send({
      key: MESSAGE_INITIALIZE_DEVICE,
      data: deviceData
    });
  });
}

function logCurrentlyInitializedDevices() {
  var initializedDeviceData = Object.values(initializedDeviceDataMap);
  var readableDeviceList = '';
  initializedDeviceData.forEach(function(deviceData) {
    readableDeviceList += '\n - ' + deviceData.name + ' (' + deviceData.id + ')';
  });
  console.log('Currently initialized devices: ' + initializedDeviceData.length + readableDeviceList);
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('Listening on port 3000');
});