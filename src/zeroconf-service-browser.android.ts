// Please refer to the Java implementation
// https://github.com/andriydruk/RxDNSSD

import { Observable, Observer } from "rxjs";
import { android as androidApplication } from "tns-core-modules/application";
import { ZeroConf, zeroConfStatus } from "./netservice.common";
import { mapError } from "./zeroconf-service.common";
import { startWith } from "rxjs/operators";

declare const com: any;
declare const io: any;

const MORE_COMING: number = 1 << 0;
const SERVICE_LOST: number = 1 << 8;

export class ZeroConfServiceBrowser {
  private _rxdnssd: any;

  constructor() {
    this._rxdnssd = new com.github.druk.rx2dnssd.Rx2DnssdBindable(
      androidApplication.context
    );
  }

  searchForBrowsableDomains(): Observable<ZeroConf> {
    return Observable.create((observer: Observer<ZeroConf>) => {
      let status = zeroConfStatus.add;
      status |= zeroConfStatus.stopComing;
      observer.next(new ZeroConf({ status, domain: "local." }));
      observer.complete();
    });
  }

  searchForRegistrationDomains(): Observable<ZeroConf> {
    return Observable.create((observer: Observer<ZeroConf>) => {
      let status = zeroConfStatus.add;
      status |= zeroConfStatus.stopComing;
      observer.next(new ZeroConf({ status, domain: "local." }));
      observer.complete();
    });
  }

  searchForServicesOfTypeInDomain(
    type: string,
    domain: string
  ): Observable<ZeroConf> {
    const observable = Observable.create((observer: Observer<ZeroConf>) => {
      const nextHandler = new io.reactivex.functions.Consumer({
        accept: bonjourService => {
          // https://github.com/andriydruk/RxDNSSD/blob/master/dnssd/src/main/java/com/github/druk/dnssd/DNSSD.java
          let status = zeroConfStatus.unKnown;
          const flags = bonjourService.getFlags();
          if (flags & SERVICE_LOST) {
            status = zeroConfStatus.remove;
          } else {
            status = zeroConfStatus.add;
          }

          status |=
            flags & MORE_COMING
              ? zeroConfStatus.moreComing
              : zeroConfStatus.stopComing;

          observer.next(
            new ZeroConf({
              status: status,
              name: bonjourService.getServiceName(),
              type: bonjourService.getRegType(),
              domain: bonjourService.getDomain(),
              hostName: bonjourService.getHostname(),
              port: bonjourService.getPort()
            })
          );
        }
      });

      const errorHandler = new io.reactivex.functions.Consumer({
        accept: ec => {
          observer.error(mapError(ec));
        }
      });

      const disposable = this._rxdnssd
        .browse(type, domain)
        .subscribe(nextHandler, errorHandler);

      return () => disposable.dispose();
    });

    return observable.pipe(
      startWith(new ZeroConf({
        status: zeroConfStatus.serviceBegins,
        type: type,
        domain: domain
      }))
    );
  }

  stop(): void {
    console.assert(false, "On Android stop api is not implemented.");
  }
}
