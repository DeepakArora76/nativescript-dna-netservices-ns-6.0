import { zeroConfError } from "./netservice.common";

// https://github.com/andriydruk/RxDNSSD/blob/master/dnssd/src/main/java/com/github/druk/dnssd/DNSSDException.java
// Used to report various DNS-SD-related error conditions.
const   NO_ERROR                  =  0;
const	UNKNOWN                   = -65537;
const	NO_SUCH_NAME              = -65538;
const	NO_MEMORY                 = -65539;
const	BAD_PARAM                 = -65540;
const	BAD_REFERENCE             = -65541;
const	BAD_STATE                 = -65542;
const	BAD_FLAGS                 = -65543;
const	UNSUPPORTED               = -65544;
const	NOT_INITIALIZED           = -65545;
const	NO_CACHE                  = -65546;
const	ALREADY_REGISTERED        = -65547;
const	NAME_CONFLICT             = -65548;
const	INVALID                   = -65549;
const	FIREWALL                  = -65550;
const	INCOMPATIBLE              = -65551;
const	BAD_INTERFACE_INDEX       = -65552;
const	REFUSED                   = -65553;
const	NOSUCHRECORD              = -65554;
const	NOAUTH                    = -65555;
const	NOSUCHKEY                 = -65556;
const	NATTRAVERSAL              = -65557;
const	DOUBLENAT                 = -65558;
const	BADTIME                   = -65559;
const	BADSIG                    = -65560;
const	BADKEY                    = -65561;
const	TRANSIENT                 = -65562;
const	SERVICENOTRUNNING         = -65563;
const	NATPORTMAPPINGUNSUPPORTED = -65564;
const	NATPORTMAPPINGDISABLED    = -65565;

export function mapError(errorCode: number): zeroConfError {
  switch (errorCode) {
    case UNKNOWN:
      errorCode = zeroConfError.unknownError;
      break;
    case INVALID:
      errorCode = zeroConfError.invalidError;
      break;
    case BAD_REFERENCE:
      errorCode = zeroConfError.badArgumentError;
      break;
    case BAD_PARAM:
      errorCode = zeroConfError.badArgumentError;
      break;
    case BAD_STATE:
      errorCode = zeroConfError.activityInProgress;
      break;
    case NOSUCHKEY:
    case NO_SUCH_NAME:
    case NO_CACHE:
    case NOSUCHRECORD:
      errorCode = zeroConfError.notFoundError;
      break;
    case NAME_CONFLICT:
    case ALREADY_REGISTERED:
      errorCode = zeroConfError.collisionError;
      break;
    default:
      errorCode = zeroConfError.unknownError;
  }

  return errorCode;
}
