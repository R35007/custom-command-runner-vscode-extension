import * as vscode from "vscode";
import { Settings } from "./Settings";
import { BROWSE_FILE, CommandTypes, getFilesList, PathDetails } from './utils';

export class Prompt {
  static getFilePath = async () => {
    const defaultUri = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri : undefined;
    const filePaths = await vscode.window.showOpenDialog({
      defaultUri,
      title: "Please select a file",
    });
    const filePath = filePaths && filePaths[0].fsPath.toString();
    return filePath;
  };

  static pickACommand = async (scriptPaths: string[] = [], output: vscode.OutputChannel, shouldBrowseFile: boolean = false) => {
    try {
      output.appendLine("Picking a Command...");

      const scriptFiles = scriptPaths.reduce((res, scriptPath) => res.concat(
        getFilesList(scriptPath)
          .map(file => ({
            ...file,
            fileName: file.fileName.replace(/( |_|-){1,}/g, ' ').trim(),
            filePath: file.filePath.replace(/\\/g, "/")
          }))
      ), [] as PathDetails[])
        .filter((currentFile, index, files) => files.findIndex(file => file.filePath === currentFile.filePath) === index); // filter out repetitive path

      const filesList = scriptFiles.map(file => ({
        label: file.fileName,
        description: file.filePath,
        value: Settings.runFileCommand,
        filePath: file.filePath,
        type: CommandTypes.FILE
      }))

      const { functionalCommands, shellCommands } = scriptFiles.reduce((result, file) => {
        try {
          delete require.cache[require.resolve(file.filePath)];
          const scriptFile = require(require.resolve(file.filePath));
          const commandEntries = Object.entries(scriptFile);

          commandEntries.forEach(([commandName, code]) => {
            const command = {
              label: commandName.replace(/( |_|-){1,}/g, ' ').trim(),
              value: code,
              description: file.filePath,
              filePath: file.filePath,
              type: typeof code === "string" ? CommandTypes.SHELL : CommandTypes.FUNCTIONAL
            }
            if (typeof command.value === 'string') result.shellCommands.push(command);
            if (typeof command.value === 'function') result.functionalCommands.push(command);
          })

          return result;
        } catch (err) {
          console.log(err);
          return result
        }
      }, { functionalCommands: [], shellCommands: [] } as any)

      const quickPickList = [
        { label: "Run File", kind: vscode.QuickPickItemKind.Separator },
        ...filesList,
        { label: "Run Functional Commands", kind: vscode.QuickPickItemKind.Separator },
        ...functionalCommands,
        { label: "Run Shell Commands", kind: vscode.QuickPickItemKind.Separator },
        ...shellCommands,
        { kind: vscode.QuickPickItemKind.Separator }
      ];

      if (shouldBrowseFile) quickPickList.push({ label: BROWSE_FILE, value: BROWSE_FILE })

      const selectedCommand: any = await vscode.window.showQuickPick(quickPickList, {
        placeHolder: 'Please select command or File to execute',
      });

      // return if no command is selected
      if (!selectedCommand) {
        output.appendLine("Selected Command: undefined");
        return;
      };

      output.appendLine(`\nSelected Command: ${JSON.stringify(selectedCommand, null, 2)}\n`);

      return selectedCommand;
    } catch (error: any) {
      output.appendLine(error.message);
      return;
    }
  };

  static showPopupMessage = (message: string, action: "info" | "warning" | "error", ...args: any) => {
    if (action === "info") {
      vscode.window.showInformationMessage(message, ...args);
    } else if (action === "error") {
      vscode.window.showErrorMessage(message, ...args);
    } else if (action === "warning") {
      vscode.window.showWarningMessage(message, ...args);
    }
  };
}
