import { Observable, of } from "rxjs";
import { finalize, flatMap } from "rxjs/operators";
import * as Connectivity from "tns-core-modules/connectivity";
import { networkType, NetworkStatus } from "./netservice.common";

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

  public static getWiFiIpAddress(): Observable<string> {
    return of(NetworkMonitorService.getIPAddressOfInterface("en0"));
  }

  public static getCellularIpAddress(): Observable<string> {
    let ipAddress = NetworkMonitorService.getIPAddressOfInterface("pdp_ip0");
    if (!ipAddress.length)
      ipAddress = NetworkMonitorService.getIPAddressOfInterface("pdp_ip1");
    else if (!ipAddress.length)
      ipAddress = NetworkMonitorService.getIPAddressOfInterface("pdp_ip2");
    else if (!ipAddress.length)
      ipAddress = NetworkMonitorService.getIPAddressOfInterface("pdp_ip3");
    return of(ipAddress);
  }

  public static getNetworkStatus(): Observable<NetworkStatus> {
    return NetworkMonitorService.getNetworkStatusFromType(
      Connectivity.getConnectionType()
    );
  }

  private static getNetworkStatusFromType(
    cType: number
  ): Observable<NetworkStatus> {
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

  private static getIPAddressOfInterface(inetrfaceCard: string): string {
    let address = "";
    if (!inetrfaceCard) {
      return address;
    }

    const AF_INET = 2;
    let interfacesPtrPtr = new interop.Reference<interop.Reference<ifaddrs>>();
    if (getifaddrs(interfacesPtrPtr) === 0) {
      const interfacesPtr = interfacesPtrPtr.value;
      let tempAddrPtr = interfacesPtr;
      while (tempAddrPtr != null) {
        let addr = tempAddrPtr.value;
        let sa = new interop.Reference(sockaddr, addr.ifa_addr).value;
        if (sa.sa_family === AF_INET) {
          if (
            NSString.stringWithUTF8String(addr.ifa_name).isEqualToString(
              inetrfaceCard
            )
          ) {
            const ifa_addrPtr = addr.ifa_addr;
            const ifa_addrPtrAsSockAddtr_in = new interop.Reference(
              sockaddr_in,
              addr.ifa_addr
            );
            const sin_adr = ifa_addrPtrAsSockAddtr_in.value.sin_addr;
            if (sin_adr.s_addr === 0x00000000) {
              address = "";
            } else {
              address = NSString.stringWithUTF8String(
                inet_ntoa(sin_adr)
              ).toString();
            }
            console.log(address);
          }
        }
        tempAddrPtr = <interop.Reference<ifaddrs>>addr.ifa_next; // tempAddrPtr[0].ifa_next;
      }
      freeifaddrs(interfacesPtr);
    }
    return address;
  }
}

