import * as WifiControl from "wifi-control";

export const init = (setting: { debug?: boolean }) => WifiControl.init(setting);

export async function scanForWiFi() {
  return new Promise<WifiControl.NetworkScanResult>((ok, ng) => {
    WifiControl.scanForWiFi((err, result) => {
      if (err) return ng(err);
      ok(result);
    });
  });
}

export async function connectToAP(ap: { ssid: string; password: string }) {
  return new Promise<WifiControl.Result>((ok, ng) => {
    WifiControl.connectToAP(ap, (err, result) => {
      if (err) return ng(err);
      ok(result);
    });
  });
}

export async function getIfaceState() {
  return WifiControl.getIfaceState();
}
