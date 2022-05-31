# Custom Command Runner

Run node script file, methods and shell commands from command pallet

## Getting started

- Install the Extension.
- From Command Palette (`(Ctrl/Cmd)+Shift+P`) type Custom Commands and select `Custom Commands: Open Custom Command Pallet`
- Now Pick a command or `Browse File` to execute

or 

- Right click on a file and select `Run Custom Commands`
- Now Pick a command to execute

Sample command script file: `/myCommandScriptsFolder/myCommandScript.js`
```js
exports.Copy_Text = async (vscode, args, editorProps, output) => {
  let currentFilePath = args?.fsPath // ! Can be undefined
  const { editor, document, selection, textRange, editorText, selectedText, variables } = editorProps // ! Can be an empty object

  const {
    workspaceFolder,
    workspaceFolderBasename,
    currentFile,
    file,
    fileWorkspaceFolder,
    relativeFile,
    relativeFileDirname,
    fileBasename,
    fileBasenameNoExtension,
    fileDirname,
    fileExtname,
    pathSeparator
  } = variables; // predefined variables which can also be used to run shell commands
  
  vscode.env.clipboard.writeText("Copy Text");
  vscode.window.showInformationMessage('Copied command to the clipboard 📋');
  
  output.appendLine("Copied command to the clipboard 📋") // this will be logged under `Custom Commands Log` output panel in vscode
}

exports.Npm_Version = "npm -v" // direct string value will be executed as a shell commands

exports.Run_File = "node ${currentFile}" // can use predefined variables
```

## Settings

 - `custom-command-runner.settings.paths` - Set your script file paths 
```jsonc
{
  "custom-command-runner.settings.paths":[
    "/myCommandScript.js",
    "/myCommandScriptsFolder"
  ]
}
```
- `custom-command-runner.settings.runFileFormat` - Set your custom shell command to run the file
```jsonc
{ "custom-command-runner.settings.runFileFormat": "node ${currentFile}" }
```

## Predefined Variables 

The following predefined variables are supported:

 - ${workspaceFolder} - the path of the folder opened in VS Code
 - ${workspaceFolderBasename} - the name of the folder opened in VS Code without any slashes (/)
 - ${currentFile} - the current command file or selected file
 - ${file} - the current opened file
 - ${fileWorkspaceFolder} - the current opened file's workspace folder
 - ${relativeFile} - the current opened file relative to workspaceFolder
 - ${relativeFileDirname} - the current opened file's dirname relative to workspaceFolder
 - ${fileBasename} - the current opened file's basename
 - ${fileBasenameNoExtension} - the current opened file's basename with no file extension
 - ${fileDirname} - the current opened file's dirname
 - ${fileExtname} - the current opened file's extension
 - ${pathSeparator} - the character used by the operating system to separate components in file paths
  
## Predefined Variables Examples

 - ${workspaceFolder} - `/home/your-username/your-project`
 - ${workspaceFolderBasename} - `your-project`
 - ${currentFile} - `/home/your-username/your-project/commands/command.js`
 - ${file} - `/home/your-username/your-project/folder/file.js`
 - ${fileWorkspaceFolder} - `/home/your-username/your-project`
 - ${relativeFile} - `folder/file.ext`
 - ${relativeFileDirname} - `folder`
 - ${fileBasename} - `file.ext`
 - ${fileBasenameNoExtension} - `file`
 - ${fileDirname} - `/home/your-username/your-project/folder`
 - ${fileExtname} - `.ext`
 - ${pathSeparator} - `/`
  
## Author

**Sivaraman** - [sendmsg2siva.siva@gmail.com](sendmsg2siva.siva@gmail.com)

- _GitHub_ - [https://github.com/R35007/custom-command-runner-vscode-extension](https://github.com/R35007/custom-command-runner-vscode-extension)

## License

MIT
