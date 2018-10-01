declare module "wifi-control" {
  interface Result {
    success: boolean;
    msg: string;
  }

  interface NetworkScanResult extends Result {
    networks: Array<{
      mac: string;
      channel: string;
      signal_level: string;
      ssid: string;
    }>;
  }

  interface IFaceStateResult extends Result {
    ssid: string;
    connection: "connected";
    power: boolean;
  }

  interface ResultCallback<T extends Result> {
    (err: Error | null, result: T): void;
  }
  function init(
    settings: Partial<{
      debug: boolean;
      iface: string;
      connectionTimeout: number;
    }>,
  ): void;
  function scanForWiFi(cb: ResultCallback<NetworkScanResult>): void;
  function connectToAP(
    ap: { ssid: string; password: string },
    cb: ResultCallback<Result>,
  ): void;
  function resetWiFi(cb: ResultCallback<Result>);
  function getIfaceState(): IFaceStateResult;
}
