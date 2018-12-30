import { Observable } from "rxjs";
import { NetworkStatus, IAddress } from "./netservice.common";
export declare class NetworkMonitorService {
    static monitorNetwork(): Observable<NetworkStatus>;
    static getWiFiIpAddress(): Observable<string>;
    static getCellularIpAddress(): Observable<string>;
    static getNetworkStatus(): Observable<NetworkStatus>;
    static dumpIpAddress(): Observable<IAddress[]>;
    private static getNetworkStatusFromType;
    private static getInterfaceCardIpAddress;
}
