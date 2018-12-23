import { Observable } from "rxjs";
import { ZeroConf } from "./netservice.common";
export declare class ZeroConfService {
  constructor();
  publish(o: {domain: string; type: string; name: string; port: number;}): Observable<ZeroConf>;
  resolve(o: {domain: string; type: string; name: string; }): Observable<ZeroConf>;
}
