import * as fs from "fs";
import * as vscode from "vscode";
import { Settings } from "./Settings";
import { getFilesList, PathDetails } from './utils';

export class Prompt {
  static getFilePath = async () => {
    const defaultUri = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri : undefined;
    const filePaths = await vscode.window.showOpenDialog({
      defaultUri,
      filters: { type: ["js"] },
      title: "Please select a javascript file",
    });
    const filePath = filePaths && filePaths[0].fsPath.toString();
    return filePath;
  };

  static pickAScriptFile = async (output: vscode.OutputChannel): Promise<string | undefined> => {
    try {
      output.appendLine("Picking a File...");

      // get list of all files from the given script paths
      const scriptFiles = Settings.scriptsPath.reduce((res, scriptPath) => res.concat(
        getFilesList(scriptPath)
          .map(file => ({
            ...file,
            fileName: file.fileName.replace(/( |_|-){1,}/g, ' ').trim()
          }))
          .filter(file => file.extension === ".js")
      ), [] as PathDetails[]);

      // transforming to pick list format
      const filesPickList: vscode.QuickPickItem[] = scriptFiles.map(file => ({
        label: file.fileName,
        description: file.filePath,
      }));
      const BROWSE_FILE = "Browse File";
      const quickPickList: vscode.QuickPickItem[] = [
        ...filesPickList,
        { label: BROWSE_FILE }
      ];
      const selectedOption = await vscode.window.showQuickPick(quickPickList, {
        placeHolder: "Please select any script file",
      });
      // return if no file name is selected
      if (!selectedOption) {
        output.appendLine(`Selected File : undefined`);
        return
      };

      // if Browse File is selected then browse for a javascript file
      const scriptPath = selectedOption.label === BROWSE_FILE ? await Prompt.getFilePath() : selectedOption.description;

      output.appendLine(`Selected File : ${scriptPath}`);

      if (fs.existsSync(scriptPath || '')) return scriptPath;

      return;
    } catch (error: any) {
      output.appendLine(error.message);
      return;
    }
  };

  static pickACommand = async (scriptFilePath: string, output: vscode.OutputChannel) => {
    try {
      output.appendLine("Picking a Command...");
      // gracefully require script file
      const commandEntries = (() => {
        try {
          delete require.cache[require.resolve(scriptFilePath)];
          const scriptFile = require(require.resolve(scriptFilePath));
          return Object.entries(scriptFile);
        } catch (err) {
          console.log(err);
          return []
        }
      })()
        .filter(([_key, val]) => ["string", "function"].includes(typeof val));


      // transforming to pick list format
      const commandsPickList: vscode.QuickPickItem[] = commandEntries.map(([commandName, code]) => ({
        label: commandName.replace(/( |_|-){1,}/g, ' ').trim(),
        value: code,
        description: typeof code === "string" ? "Shell Command" : "(vscode, args, editorProps, output) => { ... }"
      }));

      const RUN_FILE = "Run File";

      const quickPickList: vscode.QuickPickItem[] = [
        { label: RUN_FILE },
        ...commandsPickList,
      ];

      const selectedCommand: any = await vscode.window.showQuickPick(quickPickList, {
        placeHolder: 'Please select command to execute',
      });

      // return if no command is selected
      if (!selectedCommand) {
        output.appendLine("Selected Command: undefined");
        return;
      };

      const command = selectedCommand.label === RUN_FILE ? [RUN_FILE, Settings.runFileFormat] : [selectedCommand.label, selectedCommand.value];

      output.appendLine(`Selected Command: ${[command[0]]}`);

      return command;
    } catch (error: any) {
      output.appendLine(error.message);
      return;
    }
  };

  static showPopupMessage = (message: string, action: "info" | "warning" | "error", ...args: any) => {
    if (action === "info") {
      Settings.showInfoMsg &&
        vscode.window.showInformationMessage(message, ...args);
    } else if (action === "error") {
      vscode.window.showErrorMessage(message, ...args);
    } else if (action === "warning") {
      vscode.window.showWarningMessage(message, ...args);
    }
  };
}
