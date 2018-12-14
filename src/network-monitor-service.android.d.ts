import { Observable } from "rxjs";
import { NetworkStatus } from "./netservice.common";
export declare class NetworkMonitorService {
    static monitorNetwork(): Observable<NetworkStatus>;
    static getWiFiIpAddress(): Observable<string>;
    static getCellularIpAddress(): Observable<string>;
    static getNetworkStatus(): Observable<NetworkStatus>;
    private static getNetworkStatusFromType;
    private static requestNetworkPermission;
}
