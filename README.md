# NativeScript DNA NetServices

![nativescript-dna-netservices](https://raw.githubusercontent.com/DeepakArora76/nativescript-dna-netservices/master/dna-netservices.png)

NativeScript plugin for Bonjour/ZeroConf and network monitoring. RxJS based APIs for service discovery, browsing and publication, and networking monitoring.

### Features

- Cross-platform APIs for Android and iOS
- Service Discovery, Resolution, Browse, and Publication
- Monitor network availability
- WiFi and Cellular IP address retrieval

More about Bonjour/ZerConf can be found at:
[ Apple’s Bonjour implementation](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/NetServices/Introduction.html#//apple_ref/doc/uid/TP40002445-SW1 " Apple’s Bonjour implementation") and [Android mDNSResponder](https://github.com/andriydruk/RxDNSSD "Android mDNSResponder")

## Installation

From the command prompt go to your app's root folder and execute:

```javascript
tns plugin add nativescript-dna-netservices
```
This command automatically installs the necessary files, as well as stores **nativescript-dna-netservices** as a dependency in your project's package.json file.

## API

NativeScript DNA NetServices APIs are classified into the following services:
- **NetworkMonitorService**: Provides API for monitoring network availability and accessing device IP address
- **ZeroConfService**: Deals with service resolution and publication part of Bonjour/ZeroConf 
- **ZeroConfServiceBrowser**: Involves with service browsing part of Bonjour/ZeroConf

Each of these services with their APIs is covered below.

### - NetworkMonitorService
Depending on the type of framework, NetworkMonitorService can be imported using one of the following ways:

TypeScript:
```javascript
import { NetworkMonitorService } from "nativescript-dna-netservices";
```
JavaScript:
```javascript
var NetworkMonitorService = require("nativescript-dna-netservices");
```

Below are the APIs available in NetworkMonitorService: 

**getWiFiIpAddress**: Retrieves IPv4 address of a device assigned for communication in a WiFi network.
```javascript
NetworkMonitorService.getWiFiIpAddress().subscribe(
  ipAddr => console.info(ipAddr),
  err => console.error(err),
  () => console.log("completed")
);
```

**getCellularIpAddress**: Gets IPv4 address of a device used for communication in a mobile/cellular network. It's not a public IP address.
```javascript
NetworkMonitorService.getCellularIpAddress().subscribe(
  ipAddr => console.info(ipAddr),
  err => console.error(err),
  () => console.log("completed")
);
```

**getNetworkStatus**: Depending on a network type a device is connected to, it gets network status which includes connection type (wifi, cellular, or none) and IPv4 address. If for some reason the device is not on a network, then the status would be an empty address with the connection type **none**.

```javascript
NetworkMonitorService.getNetworkStatus().subscribe(
  networkStatus => console.info(networkStatus.connType, networkStatus.ipAddress),
  err => console.error(err),
  () => console.log("completed")
);
```

**monitorNetwork**: It tracks and notifies of any changes in network condition a device sees. If for some reason the device is not on a network, then the status would be an empty address with the connection type **none**.

```javascript
const networkStatusSubscription = NetworkMonitorService.monitorNetwork()
.subscribe(ns => {
  let connType = "";
  switch (ns.connType) {
    case networkType.wifi:
      connType = "WiFi";
      break;
    case networkType.cellular:
      connType = "Cellular";
      break;
    default:
      connType = "Unavailable";
  }
  console.info(connType, ns.ipAddress);
});
```

### - ZeroConfService
The ZeroConfService class represents a network service, either one your application publishes or is a client of. This class uses multicast DNS to convey information about network services to and from your application.

Depending on the type of framework, ZeroConfService can be imported using one of the following ways:

TypeScript:
```javascript
import { ZeroConfService } from "nativescript-dna-netservices";
```
JavaScript:
```javascript
var ZeroConfService = require("nativescript-dna-netservices");
```

Below are the APIs offered by ZeroConfService:

**publish**: Provides a convenient way for publishing a network service of type *type* at the socket location specified by *domain*, *name*, and *port*.

```javascript
const zeroConfService = new ZeroConfService();
const registrationSubscription = zeroConfService
  .publish({
    domain: "local.",
    type: "_my_special_radio_service._tcp.",
    name: "Radio Service",
    port: 61234
  })
  .subscribe(data => console.info(data), error => console.error(error));
```

Note: The API will use one of the available free port in the system, if the specified port is 0.

In the event of success, the *next stream handler* receives data of type **ZeroConf**. And, in the event of an error, an event data contains **zeroConfError** error code. **ZeroConf** and **zeroConfError** can be imported using one of the above-mentioned ways from **nativescript-dna-netservices**.

## License

Apache License Version 2.0, January 2004
