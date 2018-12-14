// Please refer to the Java implementation
// https://github.com/andriydruk/RxDNSSD

import { Observable, Observer, throwError } from "rxjs";
import { android as androidApplication } from "tns-core-modules/application";
import { mapError } from "./zeroconf-service.common";
import {
  ZeroConf,
  zeroConfStatus,
  zeroConfError,
  IAddress,
  addressType
} from "./netservice.common";
import { startWith } from "rxjs/operators";

declare const com: any;
declare const io: any;

export class ZeroConfService {
  private _rxdnssd: any;
  constructor() {
    this._rxdnssd = new com.github.druk.rx2dnssd.Rx2DnssdBindable(
      androidApplication.context
    );
  }

  publish(o: {
    domain: string;
    type: string;
    name: string;
    port: number;
  }): Observable<ZeroConf> {
    if (o.port === 0) {
      const port = this.availablePort();
      if (port < 0) throwError(zeroConfError.failedToFindAvailablePort);
      else o.port = port;
    }

    const observable = Observable.create((observer: Observer<ZeroConf>) => {
      const bs = new com.github.druk.rx2dnssd.BonjourService.Builder(
        0,
        0,
        o.name,
        o.type,
        o.domain
      )
        .port(o.port)
        .build();

      const onNext = new io.reactivex.functions.Consumer({
        accept: bonjourService =>
          observer.next(this.makeZeroConf(bonjourService))
      });

      const onError = new io.reactivex.functions.Consumer({
        accept: function(ec) {
          observer.error(mapError(ec));
        }
      });

      const disposable = this._rxdnssd
        .register(bs)
        .subscribeOn(io.reactivex.schedulers.Schedulers.io())
        .observeOn(
          io.reactivex.android.schedulers.AndroidSchedulers.mainThread()
        )
        .subscribe(onNext, onError);

      return () => disposable.dispose();
    });

    return observable.pipe(
      startWith(new ZeroConf({ status: zeroConfStatus.serviceBegins }))
    );
  }

  resolve(o: {
    domain: string;
    type: string;
    name: string;
  }): Observable<ZeroConf> {
    const observable = Observable.create((observer: Observer<ZeroConf>) => {
      const isMatchingName = new io.reactivex.functions.Predicate({
        test: bonjourService => bonjourService.getServiceName() === o.name
      });

      const onNext = new io.reactivex.functions.Consumer({
        accept: bonjourService =>
          observer.next(this.makeZeroConf(bonjourService))
      });

      const onError = new io.reactivex.functions.Consumer({
        accept: ec => {
          observer.error(mapError(ec));
        }
      });

      const disposable = this._rxdnssd
        .browse(o.type, o.domain)
        .filter(isMatchingName)
        .compose(this._rxdnssd.resolve())
        .compose(this._rxdnssd.queryIPRecords())
        .subscribeOn(io.reactivex.schedulers.Schedulers.io())
        .observeOn(
          io.reactivex.android.schedulers.AndroidSchedulers.mainThread()
        )
        .take(1)
        .subscribe(onNext, onError);

      return () => disposable.dispose();
    });

    return observable.pipe(
      startWith(new ZeroConf({ status: zeroConfStatus.serviceBegins }))
    );
  }

  stop(): void {
    console.assert(false, "On Android stop api is not implemented.");
  }

  private makeZeroConf(bonjourService: any): ZeroConf {
    let addrs: IAddress[] = [];

    if (bonjourService.getInet4Address()) {
      let address = bonjourService.getInet4Address().getHostAddress();
      if (address) addrs.push({ address: address, type: addressType.IPv4 });
    }

    if (bonjourService.getInet6Address()) {
      let address = bonjourService.getInet6Address().getHostAddress();
      if (address) addrs.push({ address: address, type: addressType.IPv6 });
    }

    return new ZeroConf({
      status: zeroConfStatus.success,
      domain: bonjourService.getDomain(),
      type: bonjourService.getRegType(),
      hostName: bonjourService.getHostname(),
      name: bonjourService.getServiceName(),
      port: bonjourService.getPort(),
      addresses: addrs
    });
  }

  private availablePort(): number {
    let socket: java.net.ServerSocket = null;
    try {
      socket = new java.net.ServerSocket(0);
      socket.setReuseAddress(true);
      const port = socket.getLocalPort();
      try {
        socket.close();
      } catch (exception) {}
      return port;
    } catch (ex) {}
    return -1;
  }
}
