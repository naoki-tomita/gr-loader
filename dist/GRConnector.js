"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WifiControl_1 = require("./WifiControl");
const Logger_1 = require("./Logger");
async function connectToGR() {
    WifiControl_1.init({ debug: false });
    const connectionResult = await WifiControl_1.getIfaceState();
    if (connectionResult.ssid.includes("RICOH_")) {
        Logger_1.log("Wifi already connected to RICOH GR.");
        return;
    }
    const scanResult = await WifiControl_1.scanForWiFi();
    if (!scanResult.success) {
        throw Error("Scan failed.");
    }
    Logger_1.log(`Found ${scanResult.networks.length} access point.`);
    const grWifi = scanResult.networks.find(n => n.ssid.includes("RICOH_"));
    if (!grWifi) {
        throw Error("RICOH GR has not been found. Please turn on WI-FI.");
    }
    const password = grWifi.ssid.replace("RICOH_", "A4");
    const ap = { ssid: grWifi.ssid, password };
    Logger_1.log(`Connect with ssid: ${ap.ssid}, password: ${ap.password}`);
    const connectResult = await WifiControl_1.connectToAP(ap);
    if (!connectResult.success) {
        throw Error("Failed to connect to GR.");
    }
    Logger_1.log(`Success to connect with GR.`);
}
exports.connectToGR = connectToGR;
