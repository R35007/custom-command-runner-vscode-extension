## `V3.0.1`

 - Now current active file shows up in the pick list when using `Custom Commands: Open Custom Command Pallet`
## `V3.0.0`

- renamed `custom-command-runner.settings.scriptsPath` to `custom-command-runner.settings.paths`
- renamed `custom-command-runner.settings.runFileFormat` to `custom-command-runner.settings.runFileCommand`
- removed `custom-command-runner.settings.showInfoMsg` from setting
- QuickPick is categorized to `Run File`, `Run Functional Commands`, `Run Shell Commands` or Browse a File
- Now all the functional commands, shell commands and a files list will show in a single quickPick

## `V2.0.0`

- Added predefined variables which can be used too run the shell commands
  Example :
  ```js
  exports.Run_File = "node ${file}" // can use predefined variables
  ```

## `V1.0.0`

- Initial release