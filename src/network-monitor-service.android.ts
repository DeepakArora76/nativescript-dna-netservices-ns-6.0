import { Observable, from, of, throwError, Observer } from "rxjs";
import { finalize, flatMap, catchError } from "rxjs/operators";
import { android as androidApp } from "tns-core-modules/application";
import * as Connectivity from "tns-core-modules/connectivity";
import * as Permissions from "nativescript-permissions";
import {
  addressType,
  networkType,
  NetworkStatus,
  IAddress
} from "./netservice.common";

export class NetworkMonitorService {
  public static monitorNetwork(): Observable<NetworkStatus> {
    const netMon: Observable<Observable<NetworkStatus>> = Observable.create(
      observer => {
        observer.next(NetworkMonitorService.getNetworkStatus());

        Connectivity.startMonitoring((newConnectionType: number) => {
          observer.next(
            NetworkMonitorService.getNetworkStatusFromType(newConnectionType)
          );
        });

        return () => {
          Connectivity.stopMonitoring();
        };
      }
    );
    return netMon.pipe(
      flatMap(value => value),
      finalize(() => Connectivity.stopMonitoring())
    );
  }

  static getWiFiIpAddress(): Observable<string> {
    const ipAddrObserable: Observable<string> = Observable.create(observer => {
      const context = android.content.Context;
      const wifiManager = androidApp.context.getSystemService(
        context.WIFI_SERVICE
      );
      const javaByteOrder = java.nio.ByteOrder;
      const wInfo = wifiManager.getConnectionInfo();
      let ipAddress = wInfo.getIpAddress();
      if (javaByteOrder.nativeOrder().equals(javaByteOrder.LITTLE_ENDIAN)) {
        ipAddress = java.lang.Integer.reverseBytes(ipAddress);
      }

      const wifiIpAddress = java.lang.String.format("%d.%d.%d.%d", [
        (ipAddress >> 24) & 0xff,
        (ipAddress >> 16) & 0xff,
        (ipAddress >> 8) & 0xff,
        ipAddress & 0xff
      ]);

      observer.next(wifiIpAddress);
      observer.complete();
    });

    return NetworkMonitorService.requestNetworkPermission().pipe(
      flatMap(() => ipAddrObserable)
    );
  }

  static getCellularIpAddress(): Observable<string> {
    const ipAddrObserable: Observable<string> = Observable.create(observer => {
      try {
        const javaCollections = java.util.Collections;
        const interfaces = javaCollections.list(
          java.net.NetworkInterface.getNetworkInterfaces()
        );
        for (let i = 0; i < interfaces.size(); i++) {
          const addrs = javaCollections.list(
            interfaces.get(i).getInetAddresses()
          );
          for (let a = 0; a < addrs.size(); a++) {
            if (!addrs.get(a).isLoopbackAddress()) {
              observer.next(addrs.get(a).getHostAddress());
              observer.complete();
              break;
            }
          }
        }
      } catch (Exception) {}
      observer.next("");
      observer.complete();
    });

    return NetworkMonitorService.requestNetworkPermission().pipe(
      flatMap(() => ipAddrObserable)
    );
  }

  static getNetworkStatus(): Observable<NetworkStatus> {
    return NetworkMonitorService.getNetworkStatusFromType(
      Connectivity.getConnectionType()
    );
  }

  static dumpIpAddress(): Observable<IAddress[]> {
    const ipAddrObserable: Observable<IAddress[]> = Observable.create(
      (observer: Observer<IAddress[]>) => {
        let addresses: IAddress[] = [];

        const NI = java.net.NetworkInterface;
        try {
          for (let en = NI.getNetworkInterfaces(); en.hasMoreElements(); ) {
            let intf = en.nextElement();
            for (let adr = intf.getInetAddresses(); adr.hasMoreElements(); ) {
              const inetAddress = adr.nextElement();
              {
                let ipAddr = inetAddress.getHostAddress().toString();
                const pos = ipAddr.search("%");
                if (pos !== -1) ipAddr = ipAddr.substr(0, pos);

                const displayName = intf.getDisplayName();

                const type =
                  inetAddress.getClass() === java.net.Inet4Address.class
                    ? addressType.IPv4
                    : addressType.IPv6;

                addresses.push({
                  address: ipAddr,
                  adapterName: displayName,
                  type: type
                });
              }
            }
          }
        } catch (ex) {}

        observer.next(addresses);
        observer.complete();
      }
    );

    return NetworkMonitorService.requestNetworkPermission().pipe(
      flatMap(() => ipAddrObserable)
    );
  }

  private static getNetworkStatusFromType(cType): Observable<NetworkStatus> {
    switch (cType) {
      case Connectivity.connectionType.wifi:
        return NetworkMonitorService.getWiFiIpAddress().pipe(
          flatMap(ipAddr =>
            of({
              connType: networkType.wifi,
              ipAddress: ipAddr
            })
          )
        );

      case Connectivity.connectionType.mobile:
        return NetworkMonitorService.getCellularIpAddress().pipe(
          flatMap(ipAddr =>
            of({
              connType: networkType.cellular,
              ipAddress: ipAddr
            })
          )
        );

      default:
        return of({ connType: networkType.none, ipAddress: "" });
    }
  }

  private static requestNetworkPermission() {
    return from(
      Permissions.requestPermission(
        [
          "android.permission.ACCESS_NETWORK_STATE",
          "android.permission.INTERNET",
          "android.permission.ACCESS_WIFI_STATE"
        ],
        "App requires Network permissions"
      )
    ).pipe(catchError(() => throwError("Failed to get required permissions.")));
  }
}
