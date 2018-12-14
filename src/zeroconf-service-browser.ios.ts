import { Observable, Observer } from "rxjs";
import { ZeroConf, zeroConfStatus } from "./netservice.common";

export class ZeroConfServiceBrowser {
  private _netServiceBrowser: NSNetServiceBrowser;

  constructor() {
    this._netServiceBrowser = NSNetServiceBrowser.new();
  }

  searchForBrowsableDomains(): Observable<ZeroConf> {
    return Observable.create((observer: Observer<ZeroConf>) => {
      this._netServiceBrowser.delegate = ZeroConfServiceBrowserDelegate.new().initWithObserver(
        observer
      );
      this._netServiceBrowser.searchForBrowsableDomains();
      return () => this._netServiceBrowser.stop();
    });
  }

  searchForRegistrationDomains(): Observable<ZeroConf> {
    return Observable.create((observer: Observer<ZeroConf>) => {
      this._netServiceBrowser.delegate = ZeroConfServiceBrowserDelegate.new().initWithObserver(
        observer
      );
      this._netServiceBrowser.searchForRegistrationDomains();
      return () => this._netServiceBrowser.stop();
    });
  }

  searchForServicesOfTypeInDomain(
    type: string,
    domain: string
  ): Observable<ZeroConf> {
    const obserable: Observable<ZeroConf> = Observable.create(
      (observer: Observer<ZeroConf>) => {
        this._netServiceBrowser.delegate = ZeroConfServiceBrowserDelegate.new().initWithObserver(
          observer
        );

        this._netServiceBrowser.searchForServicesOfTypeInDomain(type, domain);
        return () => this._netServiceBrowser.stop();
      }
    );

    return obserable;
  }

  stop(): void {
    this._netServiceBrowser.stop();
  }
}

class ZeroConfServiceBrowserDelegate extends NSObject
  implements NSNetServiceBrowserDelegate {
  // Note: This ObjCProtocols is needed.
  public static ObjCProtocols = [NSNetServiceBrowserDelegate];
  private _observer: Observer<ZeroConf>;

  static new(): ZeroConfServiceBrowserDelegate {
    return <ZeroConfServiceBrowserDelegate>super.new();
  }

  initWithObserver(
    observer: Observer<ZeroConf>
  ): ZeroConfServiceBrowserDelegate {
    this._observer = observer;
    return this;
  }

  netServiceBrowserDidFindDomainMoreComing(
    browser: NSNetServiceBrowser,
    domain: string,
    moreComing: boolean
  ): void {
    let status = zeroConfStatus.add;
    status |= moreComing
      ? zeroConfStatus.moreComing
      : zeroConfStatus.stopComing;
    this._observer.next(new ZeroConf({ status, domain }));
  }

  netServiceBrowserDidFindServiceMoreComing(
    browser: NSNetServiceBrowser,
    service: NSNetService,
    moreComing: boolean
  ): void {
    let status = zeroConfStatus.add;
    status |= moreComing
      ? zeroConfStatus.moreComing
      : zeroConfStatus.stopComing;

    this._observer.next(
      new ZeroConf({
        status: status,
        name: service.name,
        type: service.type,
        domain: service.domain,
        hostName: service.hostName,
        port: service.port
      })
    );
  }

  netServiceBrowserDidNotSearch?(
    browser: NSNetServiceBrowser,
    errorDict: NSDictionary<string, number>
  ): void {
    const status = zeroConfStatus.failed;
    this._observer.next(new ZeroConf({ status }));
  }

  netServiceBrowserDidRemoveDomainMoreComing?(
    browser: NSNetServiceBrowser,
    domain: string,
    moreComing: boolean
  ): void {
    let status = zeroConfStatus.remove;
    status |= moreComing
      ? zeroConfStatus.moreComing
      : zeroConfStatus.stopComing;

    this._observer.next(new ZeroConf({ status, domain }));
  }

  netServiceBrowserDidRemoveServiceMoreComing?(
    browser: NSNetServiceBrowser,
    service: NSNetService,
    moreComing: boolean
  ): void {
    let status = zeroConfStatus.remove;
    status |= moreComing
      ? zeroConfStatus.moreComing
      : zeroConfStatus.stopComing;

    this._observer.next(
      new ZeroConf({
        status: status,
        name: service.name,
        type: service.type,
        domain: service.domain,
        hostName: service.hostName,
        port: service.port
      })
    );
  }

  netServiceBrowserDidStopSearch?(browser: NSNetServiceBrowser): void {
    const status = zeroConfStatus.serviceEnds;
    this._observer.next(new ZeroConf({ status }));

    this._observer.complete();
  }

  netServiceBrowserWillSearch?(browser: NSNetServiceBrowser): void {
    const status = zeroConfStatus.serviceBegins;
    this._observer.next(new ZeroConf({ status }));
  }
}
