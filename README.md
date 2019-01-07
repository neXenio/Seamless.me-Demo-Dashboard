# BAuth Demo Dashboard

BAuth is an app that uses sensor data from mobile devices to authenticate users. You can read more about it [here](https://www.nexenio.com/bauth).

The BAuth Demo Dashboard can be used to get an idea of how the data that BAuth uses looks like. That includes sensor data, features, classification results and trust levels.

![Dashboard Screenshot](https://raw.githubusercontent.com/neXenio/BAuth-Demo-Dashboard/master/media/dashboard-screenshot.jpg)

> Please note that production versions of BAuth are not allowed to transfer any data (for privacy reasons), to use the dashboard you need to deploy BAuth with the *Demo* flavour.

### Start the BAuth Demo Server

The BAuth Demo Server is a simple `Node.js` server, hosted on [Repl.it](https://repl.it/@Steppschuh/BAuth-Demo-Server). It's only purpose is to provide a `Socket.io` instance and forward data from the BAuth app to all connected BAuth Demo Dashboards.

In case that it's not currently running, simply open [this URL](https://repl.it/@Steppschuh/BAuth-Demo-Server).

### Enable Data Streaming

Start the BAuth app and navigate to `Settings > Recording` and enable `Stream Data`. This will connect to the BAuth Demo Server websocket and start streaming data. You need a working internet connection.

### Open the BAuth Demo Dashboard

The BAuth Demo Dashboard is a simple website hosted on [JSFiddle](https://jsfiddle.net/Steppschuh/3r8e2zmh/embedded/result). It connects to the BAuth Demo Server websocket and visualizes the streamed data.

Please feel free to fork the JSFiddle and adjust the visualizations for your needs.
