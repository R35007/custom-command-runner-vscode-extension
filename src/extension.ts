import * as vscode from "vscode";
import { Commands } from './enum';
import { Prompt } from './prompt';
import { Settings } from './Settings';
import { BROWSE_FILE, executeShellCommand, getEditorProps } from './utils';

const output = vscode.window.createOutputChannel("Custom Commands Log");

export function activate(context: vscode.ExtensionContext) {
  // Opens Custom Commands Pallet
  context.subscriptions.push(vscode.commands.registerCommand(Commands.OPEN_CUSTOM_COMMANDS, async (args) => {
    await executeCustomCommand(args)
  }));
  // Run Custom Commands from current file
  context.subscriptions.push(vscode.commands.registerCommand(Commands.RUN_CUSTOM_COMMANDS, async (args) => {
    await executeCustomCommand(args)
  }));
}
export function deactivate() { }

const executeCustomCommand = async (args?: any) => {
  // if (!scriptFilePath) return;
  const editorProps = getEditorProps(args);

  let scriptFilePaths, selectedCommand;

  scriptFilePaths = [].concat(args?.fsPath || Settings.paths);

  selectedCommand = await Prompt.pickACommand(scriptFilePaths, output, true);
  if (!selectedCommand) return;

  if (selectedCommand.label === BROWSE_FILE) {
    const scriptFilePath = await Prompt.getFilePath();
    if (!scriptFilePath) return;
    scriptFilePaths = [scriptFilePath];
    selectedCommand = await Prompt.pickACommand(scriptFilePaths, output) || [];
  }

  editorProps.variables.currentFile = selectedCommand.filePath;

  if (typeof selectedCommand.value === "string") {
    try {
      output.appendLine(`Started executing ${selectedCommand.label}...`);
      executeShellCommand(selectedCommand.label, selectedCommand.value.split(";"), editorProps.variables);
      output.appendLine(`${selectedCommand.label} executed successfully !`);
    } catch (error: any) {
      output.appendLine(error.message);
      Prompt.showPopupMessage(error.message || "Command Failed to Execute", "error");
    }
  }

  if (typeof selectedCommand.value === "function") {
    try {
      output.appendLine(`Started executing ${selectedCommand.label}...`);
      await selectedCommand.value(vscode, args, editorProps, output);
      output.appendLine(`${selectedCommand.label} executed successfully !`);
    } catch (error: any) {
      output.appendLine(error.message);
      Prompt.showPopupMessage(error.message || "Command Failed to Execute", "error");
    }
  }

  output.appendLine("\n");
}
