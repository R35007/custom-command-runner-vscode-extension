import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export const getVariables = (args: any) => {
  const file = args?.fsPath;
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || "./";
  const pathDetail = file ? path.parse(file) : {} as any;

  const variables = {
    workspaceFolder,
    workspaceFolderBasename: path.basename(workspaceFolder),
    file,
    fileWorkspaceFolder: workspaceFolder,
    relativeFile: file ? path.relative(workspaceFolder, file) : undefined,
    relativeFileDirname: pathDetail.dir ? path.basename(pathDetail.dir) : undefined,
    fileBasename: pathDetail.base,
    fileBasenameNoExtension: pathDetail.name,
    fileDirname: pathDetail.dir,
    fileExtname: pathDetail.ext,
    pathSeparator: "/"
  }

  return variables
}

export const getEditorProps = (args: any) => {
  const editor = vscode.window.activeTextEditor;
  const variables = getVariables(args)
  if (editor) {
    const document = editor.document;
    const selection = editor.selection;
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
    const editorText = document.getText(textRange);
    const selectedText = document.getText(selection);
    return { editor, document, selection, textRange, editorText, selectedText, variables };
  }
  return { variables };
};

export const getFilesList = (directoryPath: string, foldersToExclude: string[] = [], recursive: boolean = true): PathDetails[] => {
  const stats = getStats(directoryPath);
  if (!stats) { return []; }
  if (stats.isFile) {
    return [stats];
  } else if (stats.isDirectory && foldersToExclude.indexOf(directoryPath) < 0) {
    const files = fs.readdirSync(directoryPath);
    const filteredFiles = files.filter((file) => foldersToExclude.indexOf(file) < 0);
    const filesList = filteredFiles.reduce((res: PathDetails[], file: string) => {
      if (recursive) {
        return res.concat(getFilesList(`${directoryPath}/${file}`, foldersToExclude, true));
      }
      return res.concat(getStats(`${directoryPath}/${file}`) || []);
    }, []);

    return filesList;
  }
  return [];
};

export const getStats = (directoryPath: string): PathDetails | undefined => {
  if (!fs.existsSync(directoryPath)) { return; }
  const stats = fs.statSync(directoryPath);
  const extension = path.extname(directoryPath);
  const fileName = path.basename(directoryPath, extension);
  return { fileName, extension, filePath: directoryPath, isFile: stats.isFile(), isDirectory: stats.isDirectory() };
};

export const executeShellCommand = (terminalName: string = "Custom Command", commands: string[] = [], variables: object = {}) => {
  const terminal = vscode.window.createTerminal({ name: terminalName });
  commands.forEach(command => {
    const interpolatedCommand = interpolate(command, variables).replace(/undefined/g, "");
    terminal.sendText(interpolatedCommand)
  })
  terminal.show();
};

export const interpolate = (format: string = "", object: object = {}) => {
  try {
    const keys = Object.keys(object);
    const values = Object.values(object);
    return new Function(...keys, `return \`${format}\`;`)(...values);
  } catch (error) {
    console.log(error);
    return format;
  }
};

export type PathDetails = {
  fileName: string;
  extension: string;
  filePath: string;
  isFile: boolean;
  isDirectory: boolean;
};


