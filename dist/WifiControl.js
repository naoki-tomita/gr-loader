"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WifiControl = require("wifi-control");
exports.init = (setting) => WifiControl.init(setting);
async function scanForWiFi() {
    return new Promise((ok, ng) => {
        WifiControl.scanForWiFi((err, result) => {
            if (err)
                return ng(err);
            ok(result);
        });
    });
}
exports.scanForWiFi = scanForWiFi;
async function connectToAP(ap) {
    return new Promise((ok, ng) => {
        WifiControl.connectToAP(ap, (err, result) => {
            if (err)
                return ng(err);
            ok(result);
        });
    });
}
exports.connectToAP = connectToAP;
async function getIfaceState() {
    return WifiControl.getIfaceState();
}
exports.getIfaceState = getIfaceState;
