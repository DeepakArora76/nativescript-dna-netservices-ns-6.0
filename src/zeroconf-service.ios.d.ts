import { Observable } from "rxjs";
import { ZeroConf } from "./netservice.common";
export declare class ZeroConfService {
    private _netService;
    private _dnaNSNetServiceDelegate;
    constructor();
    publish(o: {
        domain: string;
        type: string;
        name: string;
        port: number;
    }): Observable<ZeroConf>;
    resolve(o: {
        domain: string;
        type: string;
        name: string;
    }): Observable<ZeroConf>;
    private resolveWithTimeout;
    private stop;
    private availablePort;
}
