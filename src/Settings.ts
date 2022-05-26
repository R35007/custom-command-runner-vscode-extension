import * as vscode from "vscode";

export class Settings {
  static get configuration() {
    return vscode.workspace.getConfiguration("custom-command-runner.settings");
  }
  static getSettings(val: string) {
    return Settings.configuration.get(val);
  }
  static setSettings(key: string, val: any, isGlobal = true) {
    return Settings.configuration.update(key, val, isGlobal);
  }
  static get scriptsPath() {
    return (Settings.getSettings("scriptsPath") as string[]) || [];
  }
  static get showInfoMsg() {
    return Settings.getSettings("showInfoMsg") as boolean;
  }
  static set showInfoMsg(val: boolean) {
    Settings.setSettings("showInfoMsg", val);
  }
}
