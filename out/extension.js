"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const property_datatype_1 = require("./property-datatype");
const fs = require("fs");
const path = require("path");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "typescript-class-generator" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('typescript-class-generator.createTsClass', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello, This is Typescript Class Generator!');
        if (!vscode.workspace.workspaceFolders) {
            return vscode.window.showErrorMessage("Please open a directory before creating a class");
        }
        const className = await vscode.window.showInputBox({
            prompt: "Class Name?"
        });
        if (!className) {
            vscode.window.showErrorMessage("you have not provided any class name");
            return;
        }
        let count = 1;
        let propertiesDatatype = [];
        let datatype;
        let property = await vscode.window.showInputBox({
            prompt: `Property #${count}? ('done' when finished)`
        });
        if (!property) {
            vscode.window.showErrorMessage("you have not provided any property name");
        }
        else {
            datatype = await vscode.window.showInputBox({
                prompt: `datatype for property number #${count}`
            });
        }
        while (property !== "done" && datatype !== "done") {
            propertiesDatatype.push(new property_datatype_1.PropertyDatatype());
            propertiesDatatype[count - 1].property = property;
            propertiesDatatype[count - 1].datatype = datatype;
            count++;
            property = await vscode.window.showInputBox({
                prompt: `Property #${count}? ('done' when finished)`
            });
            if (!property) {
                vscode.window.showErrorMessage("you have not provided any property name");
            }
            else {
                datatype = await vscode.window.showInputBox({
                    prompt: `datatype for property number #${count}`
                });
            }
        }
        const classDefinition = `class ${className}{\n`;
        let propertyWithDatatype = '\t\t';
        for (let i = 0; i < propertiesDatatype.length; i++) {
            propertyWithDatatype = propertyWithDatatype + propertiesDatatype[i].property + ":" + propertiesDatatype[i].datatype + ";\n\t\t";
        }
        const classString = `${classDefinition} ${propertyWithDatatype} \n\t}`;
        console.log(classString);
        vscode.window.showInformationMessage("class definition " + classString);
        const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath
            .toString();
        ;
        console.log("the path is", folderPath);
        vscode.window.showInformationMessage("folder path " + folderPath);
        fs.writeFile(path.join(folderPath, `${className}.ts`), classString, () => { });
        fs.writeFile(path.join(folderPath, `${className}.ts`), classString, (err) => {
            if (err) {
                vscode.window.showErrorMessage("Something went wrong");
                return console.log(err);
            }
            vscode.window.showInformationMessage(`${className} Class created.`);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map