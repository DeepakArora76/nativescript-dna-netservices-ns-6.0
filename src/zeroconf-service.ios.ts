import { Observable, Observer, throwError } from "rxjs";
import {
  ZeroConf,
  zeroConfStatus,
  IAddress,
  zeroConfError
} from "./netservice.common";

export class ZeroConfService {
  private _netService: NSNetService;
  private _dnaNSNetServiceDelegate: ZeroConfServiceDelegate;

  constructor() {
    this._netService = NSNetService.new();
    this._dnaNSNetServiceDelegate = ZeroConfServiceDelegate.new();
    this._netService.delegate = this._dnaNSNetServiceDelegate;
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
    const ns = this._netService;
    ns.initWithDomainTypeNamePort(o.domain, o.type, o.name, o.port);

    return Observable.create((observer: Observer<ZeroConf>) => {
      this._dnaNSNetServiceDelegate.initWithObserver(observer);
      this._netService.publish();
      return () => this._netService.stop();
    });
  }

  resolve(o: {
    domain: string;
    type: string;
    name: string;
  }): Observable<ZeroConf> {
    this._netService.initWithDomainTypeName(o.domain, o.type, o.name);
    return this.resolveWithTimeout(9000);
  }

  stop(): void {
    this._netService.stop();
  }

  private resolveWithTimeout(timeout: number): Observable<ZeroConf> {
    return Observable.create((observer: Observer<ZeroConf>) => {
      this._dnaNSNetServiceDelegate.initWithObserver(observer);
      this._netService.resolveWithTimeout(timeout);
      return () => this._netService.stop();
    });
  }

  private availablePort(): number {
    const SIZE_OF_SOCKADDR_IN = 16; // 16 bytes in length on mac
    const sock = socket(2 /* AF_INET */, 1 /*SOCK_STREAM*/, 0);
    if (sock < 0) {
      return -1;
    }

    let sockAddrIn = new sockaddr_in();
    sockAddrIn.sin_len = SIZE_OF_SOCKADDR_IN;
    sockAddrIn.sin_family = 2; // AF_INET. IPv4 internetworking
    sockAddrIn.sin_port = 0; // Used to find available port
    sockAddrIn.sin_addr.s_addr = 0; // INADDR_ANY

    const sockAddrRef = new interop.Reference(sockaddr, sockAddrIn);
    if (bind(sock, sockAddrRef, SIZE_OF_SOCKADDR_IN) < 0) {
      return -1;
    }

    const length = new interop.Reference<number>(SIZE_OF_SOCKADDR_IN);
    if (getsockname(sock, sockAddrRef, length) < 0) {
      return -1;
    }

    close(sock);

    // ntohs : network to host
    const port = (sockAddrIn.sin_port << 8) | (sockAddrIn.sin_port >> 8);
    const portIs16Bits = port & 0xffff;

    return portIs16Bits;
  }
}

class ZeroConfServiceDelegate extends NSObject implements NSNetServiceDelegate {
  // Note: This ObjCProtocols is needed.
  public static ObjCProtocols = [NSNetServiceDelegate];
  private _observer: Observer<ZeroConf>;

  static new(): ZeroConfServiceDelegate {
    return <ZeroConfServiceDelegate>super.new();
  }

  initWithObserver(observer: Observer<ZeroConf>): ZeroConfServiceDelegate {
    this._observer = observer;
    return this;
  }

  netServiceDidNotPublish(
    sender: NSNetService,
    errorDict: NSDictionary<string, number>
  ): void {
    const errCode = Number(errorDict.objectForKey("NSNetServicesErrorCode"));
    this._observer.error(errCode);
  }

  netServiceDidNotResolve(
    sender: NSNetService,
    errorDict: NSDictionary<string, number>
  ): void {
    const errCode = Number(errorDict.objectForKey("NSNetServicesErrorCode"));
    this._observer.error(errCode);
  }

  netServiceDidPublish(sender: NSNetService): void {
    const status = zeroConfStatus.success;
    this._observer.next(
      new ZeroConf({
        status: status,
        domain: sender.domain,
        type: sender.type,
        port: sender.port,
        name: sender.name,
        hostName: sender.hostName
      })
    );
  }

  netServiceDidResolveAddress(sender: NSNetService): void {
    const INET6_ADDRLEN = 46;
    const addrCount = sender.addresses.count;

    let addrs: IAddress[] = [];
    for (let count = 0; count < addrCount; count++) {
      const bytes = sender.addresses.objectAtIndex(count).bytes;
      const sockAddrRef = new interop.Reference(sockaddr_in, bytes);

      let sinAddr = null;
      if (sockAddrRef.value.sin_family === 2 /*AF_INET*/) {
        sinAddr = sockAddrRef.value.sin_addr;
      } else if (sockAddrRef.value.sin_family === 30 /*AF_INET6*/) {
        // At the 8th bytes offset,from the start of the structure, IPv6
        // address starts
        sinAddr = interop.handleof(sockAddrRef).add(8);
      }

      if (sinAddr) {
        const sinFamily = sockAddrRef.value.sin_family;
        const addrStr = <string>(<unknown>interop.alloc(INET6_ADDRLEN));
        const result = inet_ntop(sinFamily, sinAddr, addrStr, INET6_ADDRLEN);
        if (result) {
          const addr = NSString.stringWithUTF8String(addrStr).toString();
          let address = { address: addr, type: sinFamily };
          addrs.push(address);
        }
      }
    }

    if (addrs.length) {
      const status = zeroConfStatus.success;
      this._observer.next(
        new ZeroConf({
          status: status,
          domain: sender.domain,
          type: sender.type,
          hostName: sender.hostName,
          name: sender.name,
          port: sender.port,
          addresses: addrs
        })
      );
    }
  }

  netServiceDidStop?(sender: NSNetService): void {
    const status = zeroConfStatus.serviceEnds;
    this._observer.next(new ZeroConf({ status }));
    this._observer.complete();
  }

  netServiceDidUpdateTXTRecordData(sender: NSNetService, data: NSData): void {}

  netServiceWillPublish(sender: NSNetService): void {
    const status = zeroConfStatus.serviceBegins;
    this._observer.next(new ZeroConf({ status }));
  }

  netServiceWillResolve(sender: NSNetService): void {
    const status = zeroConfStatus.serviceBegins;
    this._observer.next(new ZeroConf({ status }));
  }
}
