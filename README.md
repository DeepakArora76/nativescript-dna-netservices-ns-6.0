# NativeScript DNA NetServices

![nativescript-dna-netservices](https://raw.githubusercontent.com/DeepakArora76/nativescript-dna-netservices/master/dna-netservices.png)

NativeScript plugin for Bonjour/ZeroConf and network monitor. RxJS based APIs for Android and iOS. Easy to use APIs for service discovery, browsing and publication, and networking monitoring.

### Features

- Cross platform APIs for Android and iOS
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
- **NetworkMonitorService**: Provides APIs for monitoring network availability and accessing device IP address
- **ZeroConfService**: Deals with service resolution and publication part of Bonjour/ZeroConf 
- **ZeroConfServiceBrowser**: Involves with service browsing part of Bonjour/ZeroConf

Each of these services with their APIs are covered below.

### - NetworkMonitorService
Depending on the framework, NetworkMonitorService can be imported in one of the following ways:

TypeScript:
```javascript
import { NetworkMonitorService } from "nativescript-dna-netservices";
```
JavaScript:
```javascript
var NetworkMonitorService = require("nativescript-dna-netservices");
```

Below are the APIs available in NetworkMonitorService: 

> **getWiFiIpAddress**: Retrieves IPv4 address of a device assigned with on a WiFi network.
```javascript
NetworkMonitorService.getWiFiIpAddress().subscribe(
  ipAddr => console.info(ipAddr),
  err => console.error(err),
  () => console.log("completed")
);
```

> **getCellularIpAddress**: Provides a cellular IPv4 address one assigned by a cellular carrier. It's not a public IP address.
```javascript
NetworkMonitorService.getCellularIpAddress().subscribe(
  ipAddr => console.info(ipAddr),
  err => console.error(err),
  () => console.log("completed")
);
```

**getNetworkStatus**: Depending on a network type a device is connected with, it gets network status which includes connection type (wifi, cellular, or none) and IPv4 address. If for some reason the device is not on a network, then the status would be an empty address with connection type **none**.

```javascript
NetworkMonitorService.getNetworkStatus().subscribe(
  networkStatus => console.info(networkStatus.connType, networkStatus.ipAddress),
  err => console.error(err),
  () => console.log("completed")
);
```
## License

Apache License Version 2.0, January 2004
