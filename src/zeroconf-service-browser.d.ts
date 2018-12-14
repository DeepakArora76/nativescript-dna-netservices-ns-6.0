import { Observable } from "rxjs";
import { ZeroConf } from "./netservice.common";
export declare class ZeroConfServiceBrowser {
  constructor();
  searchForBrowsableDomains(): Observable<ZeroConf>;
  searchForRegistrationDomains(): Observable<ZeroConf>;
  searchForServicesOfTypeInDomain(type: string, domain: string): Observable<ZeroConf>;
  stop(): void;
}
