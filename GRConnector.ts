import { init, scanForWiFi, connectToAP, getIfaceState } from "./WifiControl";
import { log } from "./Logger";

export async function connectToGR() {
  init({ debug: false });
  const connectionResult = await getIfaceState();
  if (connectionResult.ssid.includes("RICOH_")) {
    log("Wifi already connected to RICOH GR.");
    return;
  }
  const scanResult = await scanForWiFi();
  if (!scanResult.success) {
    throw Error("Scan failed.");
  }
  log(`Found ${scanResult.networks.length} access point.`);
  const grWifi = scanResult.networks.find(n => n.ssid.includes("RICOH_"));
  if (!grWifi) {
    throw Error("RICOH GR has not been found. Please turn on WI-FI.");
  }
  const password = grWifi.ssid.replace("RICOH_", "A4");
  const ap = { ssid: grWifi.ssid, password };
  log(`Connect with ssid: ${ap.ssid}, password: ${ap.password}`);
  const connectResult = await connectToAP(ap);
  if (!connectResult.success) {
    throw Error("Failed to connect to GR.");
  }
  log(`Success to connect with GR.`);
}
