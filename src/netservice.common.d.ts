export declare enum networkType {
    none = 0,
    wifi = 1,
    cellular = 2
}
export interface NetworkStatus {
    connType: networkType;
    ipAddress: string;
}
export declare enum zeroConfError {
    unknownError = -72000,
    collisionError = -72001,
    notFoundError = -72002,
    activityInProgress = -72003,
    badArgumentError = -72004,
    cancelledError = -72005,
    invalidError = -72006,
    timeoutError = -72007,
    failedToFindAvailablePort = -72008
}
export declare enum zeroConfStatus {
    unKnown = 0,
    serviceBegins = 1,
    serviceEnds = 2,
    moreComing = 4,
    stopComing = 8,
    add = 16,
    remove = 32,
    success = 64,
    failed = 128
}
export declare enum addressType {
    IPv4 = 2,
    IPv6 = 30
}
export interface IAddress {
    address: string;
    type: addressType;
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
export declare class ZeroConf {
    private zeroConf;
    private _domain;
    private _type;
    private _name;
    private _port;
    private _hostName;
    private _addresses;
    private _status;
    constructor(zeroConf: IZeroConf);
    readonly status: zeroConfStatus;
    readonly name: string;
    readonly type: string;
    readonly domain: string;
    readonly hostName: string;
    readonly port: number;
    readonly addresses: IAddress[];
}
