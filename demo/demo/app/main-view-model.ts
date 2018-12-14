import { Observable } from "tns-core-modules/data/observable";
import {
  ZeroConfServiceBrowser,
  ZeroConfService,
  NetworkMonitorService,
  networkType,
  zeroConfError
} from "nativescript-dna-netservices";

import { EventData } from "tns-core-modules/data/observable";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";

export class DnaNetServiceDemoModel extends Observable {
  public message: string;
  private dnaZeroConfServiceBrowser: ZeroConfServiceBrowser;
  private dnaZeroConfService: ZeroConfService;
  private subscription: Subscription = null;
  private networkStatusSubscription: Subscription = null;
  private resolveSubscription: Subscription = null;
  private registrationSubscription: Subscription = null;

  constructor() {
    super();
    this.dnaZeroConfServiceBrowser = new ZeroConfServiceBrowser();
    this.dnaZeroConfService = new ZeroConfService();
  }

  public onBrowseServiceTap(args: EventData) {
    if (this.subscription) this.subscription.unsubscribe();
    this.subscription = this.dnaZeroConfServiceBrowser
      .searchForServicesOfTypeInDomain("_transably._tcp", "local.")
      .subscribe(data => {
        console.log(data);
      });
  }

  public onWifiIpAddressTap(args: EventData) {
    NetworkMonitorService.getWiFiIpAddress()
      .pipe(tap(ip => console.info(ip)))
      .subscribe(ipAddr => {
        this.set("message", ipAddr);
      });
  }

  public onResolveServiceTap(args: EventData) {
    if (this.resolveSubscription) this.resolveSubscription.unsubscribe();
    this.resolveSubscription = this.dnaZeroConfService
      .resolve({ domain: "local.", type: "_airplay._tcp.", name: "Apple TV" })
      .pipe(tap(data => console.info(data)))
      .subscribe(data => console.info(data), error => console.error(error));
  }

  public onRegisterServiceTap(args: EventData) {
    if (this.registrationSubscription)
      this.registrationSubscription.unsubscribe();

    this.registrationSubscription = this.dnaZeroConfService
      .publish({
        domain: "local.",
        type: "_bridge-the-world._tcp.",
        name: "Bridge The World",
        port: 61234
      })
      .pipe(tap(data => console.error(data)))
      .subscribe(data => console.info(data), error => console.error(error));
  }

  public onSubscribeToNetworkStatusTap(args: EventData) {
    if (this.networkStatusSubscription) return;
    this.networkStatusSubscription = NetworkMonitorService.monitorNetwork()
      .pipe(tap(networkStatus => console.info(networkStatus)))
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
        this.set("networkStatus", connType + ": " + ns.ipAddress);
      });
  }
}
