# Custom Command Runner

Run node script file, methods and shell commands from command pallet

## Getting started

- Install the Extension.
- From Command Palette (`(Ctrl/Cmd)+Shift+P`) type Custom Commands and select `Custom Commands: Open Command Pallet`
- Now Pick `Browse File` or Pick a script file to get the list of methods to execute.
- Now Pick `Run File` command to run the full script file or Pick a method name to execute

or 

- Right click on any `.js` file and select `Run File`
- Now Pick `Run File` command to run the full script file or Pick a method name to execute

Sample command script file: `/myCommandScriptsFolder/myCommandScript.js`
```js
exports.Copy_Text = async (vscode, args, editorProps, output) => {
  const currentFilePath = args?.fsPath // ! Can be undefined
  const { editor, document, selection, textRange, editorText, selectedText } = editorProps // ! Can be an empty object
  
  vscode.env.clipboard.writeText("Copy Text");
  vscode.window.showInformationMessage('Copied command to the clipboard 📋');
  
  output.appendLine("Copied command to the clipboard 📋") // this will be logged under `Custom Commands Log` output panel in vscode
}

exports.Npm_Version = "npm -v" // direct string value will be executed as a shell commands
```

## Settings

`custom-command-runner.settings.scriptsPath` - Set your script file paths 
```jsonc
{
  // Can give both javascript file or folder path.
  // All the javascript files under the given folder will be picked when opening a Custom Command Pallet to pick a file to execute the command
  "custom-command-runner.settings.scriptsPat":[
    "/myCommandScript.js",
    "/myCommandScriptsFolder"
  ]
}
```


## Author

**Sivaraman** - [sendmsg2siva.siva@gmail.com](sendmsg2siva.siva@gmail.com)

- _GitHub_ - [https://github.com/R35007/custom-command-runner-vscode-extension](https://github.com/R35007/custom-command-runner-vscode-extension)

## License

MIT
