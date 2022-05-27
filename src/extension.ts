import * as vscode from "vscode";
import { Commands } from './enum';
import { Prompt } from './prompt';
import { executeShellCommand, getEditorProps } from './utils';

const output = vscode.window.createOutputChannel("Custom Commands Log");

export function activate(context: vscode.ExtensionContext) {
  // Opens Custom Commands Pallet
  context.subscriptions.push(vscode.commands.registerCommand(Commands.OPEN_CUSTOM_COMMANDS, async (args) => {
    const scriptFilePath = await Prompt.pickAScriptFile(output);
    await executeCustomCommand(scriptFilePath, args)
  }));
  // Run Custom Commands from current file
  context.subscriptions.push(vscode.commands.registerCommand(Commands.RUN_CUSTOM_COMMANDS, async (args) => {
    await executeCustomCommand(args?.fsPath, args)
  }));
}
export function deactivate() { }

const executeCustomCommand = async (scriptFilePath?: string, args?: any) => {

  if (!scriptFilePath) return;

  const editorProps = getEditorProps(args);
  editorProps.variables.file = scriptFilePath.replace(/\\/g, "/");


  const [commandName, command] = await Prompt.pickACommand(scriptFilePath, output) || [];
  if (!command) return;

  if (typeof command === "string") {
    try {
      output.appendLine(`Started executing ${commandName}...`);
      executeShellCommand(commandName, command.split(";"), editorProps.variables);
      output.appendLine(`${commandName} executed successfully !`);
    } catch (error: any) {
      output.appendLine(error.message);
      Prompt.showPopupMessage(error.message || "Command Failed to Execute", "error");
    }
  }

  if (typeof command === "function") {
    try {
      output.appendLine(`Started executing ${commandName}...`);
      await command(vscode, args, editorProps, output);
      output.appendLine(`${commandName} executed successfully !`);
    } catch (error: any) {
      output.appendLine(error.message);
      Prompt.showPopupMessage(error.message || "Command Failed to Execute", "error");
    }
  }

  output.appendLine("\n");
}
