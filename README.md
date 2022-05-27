# Custom Command Runner

Run node script file, methods and shell commands from command pallet

## Getting started

- Install the Extension.
- From Command Palette (`(Ctrl/Cmd)+Shift+P`) type Custom Commands and select `Custom Commands: Open Custom Command Pallet`
- Now Pick `Browse File` or Pick a script file to get the list of methods to execute.
- Now Pick `Run File` command to run the full script file or Pick a method name to execute

or 

- Right click on any `.js` file and select `Run Custom Commands`
- Now Pick `Run File` command to run the full script file or Pick a method name to execute

Sample command script file: `/myCommandScriptsFolder/myCommandScript.js`
```js
exports.Copy_Text = async (vscode, args, editorProps, output) => {
  let currentFilePath = args?.fsPath // ! Can be undefined
  const { editor, document, selection, textRange, editorText, selectedText, variables } = editorProps // ! Can be an empty object

  const {
    workspaceFolder,
    workspaceFolderBasename,
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

exports.Run_File = "node ${file}" // can use predefined variables
```

## Settings

 - `custom-command-runner.settings.scriptsPath` - Set your script file paths 
```jsonc
{
  // Can give both javascript file or folder path.
  // All the javascript files under the given folder will be picked when opening a Custom Command Pallet to pick a file to execute the command
  "custom-command-runner.settings.scriptsPath":[
    "/myCommandScript.js",
    "/myCommandScriptsFolder"
  ]
}
```
- `custom-command-runner.settings.runFileFormat` - Set your custom shell command to run the file
```jsonc
{
  "custom-command-runner.settings.runFileFormat": "node ${file}"
}
```

## Predefined Variables

 - ${workspaceFolder} - `/home/your-username/your-project`
 - ${workspaceFolderBasename} - `your-project`
 - ${file} - `/home/your-username/your-project/folder/file.ext`
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
