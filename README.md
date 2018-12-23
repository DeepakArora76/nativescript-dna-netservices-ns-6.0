

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
const nativescript_dna_netservices = require("nativescript-dna-netservices");
const NetworkMonitorService = nativescript_dna_netservices.NetworkMonitorService;
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
const nativescript_dna_netservices = require("nativescript-dna-netservices");
const ZeroConfService = nativescript_dna_netservices.ZeroConfService;
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

 - **Note**: *The API will use one of the available free port in the system, if the specified port is 0.*

In the event of success, observer's *next* handler receives data of type **ZeroConf**. Furthermore, in the event of failure, the *error* handler receives an error object which looks like **{** ***errorCode***: **zeroConfError**, ***zeroConf***: **ZeroConf** **}**.  Both **ZeroConf** and **zeroConfError** can be imported using one of the above-mentioned ways from **nativescript-dna-netservices**.

**resolve**: Performs a resolve process for the service of a given type and name within a specified domain. If the service is available, observer's **next** handler receives **ZeroConf** data which contains socket information for your application to connect to the service.  In the event of failure, the *error* handler receives an error object which looks like **{** ***errorCode***: **zeroConfError**, ***zeroConf***: **ZeroConf** **}**. 

```javascript
const zeroConfService = new ZeroConfService();
const registrationSubscription = zeroConfService
  .resolve({
    domain: "local.",
    type: "_my_special_radio_service._tcp.",
    name: "Radio Service"
  })
  .subscribe(data => console.info(data), error => console.error(error));
```

### - ZeroConfServiceBrowser
The ZeroConfServiceBrowser class offers a possibility to browse services of a certain type within a given domain.

Depending on the type of framework, ZeroConfServiceBrowser can be imported using one of the following ways:

TypeScript:
```javascript
import { ZeroConfServiceBrowser } from "nativescript-dna-netservices";
```
JavaScript:
```javascript
const nativescript_dna_netservices = require("nativescript-dna-netservices");
const ZeroConfServiceBrowser = nativescript_dna_netservices.ZeroConfServiceBrowser;
```

Below are the APIs offered by ZeroConfServiceBrowser:

**searchForServicesOfTypeInDomain**: Starts a search for services of a particular type within a specific domain.

```javascript
const zeroConfServiceBrowser = new ZeroConfServiceBrowser();
const subscription = zeroConfServiceBrowser
    .searchForServicesOfTypeInDomain("_my_special_radio_service._tcp", "local.")
    .subscribe(data => console.info(data), error => console.error(error));
```

If the services are available, observer's **next** handler will be invoked multiple times with **ZeroConf** data which your application can use to **resolve** to socket info to make network connection. And, if there is an error, the *error* handler receives a **zeroConfError** error code.

## Combining *ZeroConfService* & *ZeroConfServiceBrowser*
Sometimes functionalities from these services can be combined together to create new purposes.
One of the use cases is to have socket information for every browsed service. To accomplish this, RxJS pipeable operators come in handy. Below is the sample snippet illustrating the same. 
```javascript
const patternToSearch = /^radio_channel/i;
const serviceFinderTimeout = timer(3000);
const serviceFinder = zeroConfServiceBrowser
  .searchForServicesOfTypeInDomain("_my_special_radio_service._tcp", "local.")
  .pipe(
    filter(service => service.name && service.name.match(patternToSearch).length > 0),
    distinct(),
    concatMap(service =>
      zeroConfService.resolve(service).pipe(
        filter(service => service.status === zeroConfStatus.success),
        take(1),
        observeOn(asyncScheduler)
      )
    ),
    takeUntil(serviceFinderTimeout)
  );

serviceFinder.subscribe(
  service => console.info(service),
  error => console.error(error),
  () => console.info("Completed Here...")
);
```

## License

MIT license (see LICENSE file)
