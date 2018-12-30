export enum networkType {
  none = 0,
  wifi = 1,
  cellular = 2
}

export interface NetworkStatus {
  connType: networkType;
  ipAddress: string; // IPv4
}

export enum zeroConfError {
  // An unknown error occured during resolution or publication.
  unknownError = -72000,

  // A ZeroConf with the same domain, type and name was already present when
  // the publication request was made.
  collisionError = -72001,

  // Service was not found when a resolution request was made.
  notFoundError = -72002,

  // A publication or resolution request was sent to an ZeroConfService
  // instance which was already published or a search request was made of an
  // ZeroConfServiceBrowser instance which was already searching.
  activityInProgress = -72003,

  // An required argument was not provided when initializing the
  // ZeroConfService instance.
  badArgumentError = -72004,

  // The operation being performed by the ZeroConfService or
  // ZeroConfServiceBrowser instance was cancelled.
  cancelledError = -72005,

  // An invalid argument was provided when initializing the ZeroConfService
  // instance or starting a search with an ZeroConfServiceBrowser instance.
  invalidError = -72006,

  // Resolution of an DnaZeroConfService instance failed because the timeout
  // was reached.
  timeoutError = -72007,

  // Port is unavailable
  failedToFindAvailablePort = -72008,
}

export enum zeroConfStatus {
  unKnown = 0,
  serviceBegins = 1 << 0,
  serviceEnds = 1 << 1,
  moreComing = 1 << 2,
  stopComing = 1 << 3,
  add = 1 << 4,
  remove = 1 << 5,
  success = 1 << 6,
  failed = 1 << 7
}

export enum addressType {
  IPv4 = 2,
  IPv6 = 30
}

export interface IAddress {
  address: string;
  type: addressType;
  adapterName?: string;
}

export interface IZeroConf {
  domain?: string;
  type?: string;
  name?: string;
  port?: number;
  hostName?: string;
  addresses?: IAddress[];
  status: zeroConfStatus;
}

export class ZeroConf {
  private _domain: string;
  private _type: string;
  private _name: string;
  private _port: number;
  private _hostName: string;
  private _addresses: IAddress[];
  private _status: zeroConfStatus;

  constructor(private zeroConf: IZeroConf) {
    this._domain = zeroConf.domain || "";
    this._type = zeroConf.type || "";
    this._name = zeroConf.name || "";
    this._port = zeroConf.port == null ? -1 : zeroConf.port;
    this._hostName = zeroConf.hostName || "";
    this._addresses = zeroConf.addresses || <IAddress[]>[];
    this._status = zeroConf.status || zeroConfStatus.unKnown;
  }

  get status(): zeroConfStatus {
    return this._status;
  }

  // Returns the name of the discovered or published service.
  get name(): string {
    return this._name;
  }

  // Returns the type of the discovered or published service.
  get type(): string {
    return this._type;
  }

  // Returns the domain of the discovered or published service.
  get domain(): string {
    return this._domain;
  }

  // Returns the DNS host name of the computer hosting the discovered or
  // published service. If a successful resolve has not yet occurred, this
  // method will return empty string.
  get hostName(): string {
    return this._hostName;
  }

  // The port of a resolved service. This returns -1 if the service has not
  // been resolved.
  get port(): number {
    return this._port;
  }

  get addresses(): IAddress[] {
    return this._addresses;
  }
}
