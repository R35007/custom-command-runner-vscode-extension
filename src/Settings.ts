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
  static get paths() {
    return (Settings.getSettings("paths") as string[]) || [];
  }
  static get runFileCommand() {
    return Settings.getSettings("runFileCommand") as boolean;
  }
}
