import { Observable } from "rxjs";
import { ZeroConf } from "./netservice.common";
export declare class ZeroConfService {
    private _rxdnssd;
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
    private stop;
    private static getZeroConf;
    private static availablePort;
}
