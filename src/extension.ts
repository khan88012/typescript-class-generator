// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require("fs");
const path = require("path");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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

		if(!vscode.workspace.workspaceFolders)
		{
			return vscode.window.showErrorMessage("Please open a directory before creating a class");
		}
		const className =  await vscode.window.showInputBox(
			{
					prompt: "Class Name?"
			}
		);
		
		if(!className)
		{
			vscode.window.showErrorMessage("you have not provided any class name");
			return;
		}

		let count = 1;
		
		let property = await vscode.window.showInputBox(
			{
				prompt: `Property #${count}? ('done' when finished)`
				
			}
		);
		
		let datatype = await vscode.window.showInputBox(
			{
				prompt: `datatype for property number #${count}`
			}
		);
		const datatypes: string | (string | undefined)[] = [];
		const properties :string | (string | undefined)[] = [];
		while(property!== "done" && datatype!== "done")
		{
			properties.push(property);
			datatypes.push(datatype);
			count++;
			property = await vscode.window.showInputBox(
				{
					prompt: `Property #${count}? ('done' when finished)`
				}
			);
			datatype = await vscode.window.showInputBox(
				{
					prompt: `datatype for property number #${count}`
				}
			);

		}
		vscode.window.showInformationMessage("Properties received  are " +properties);
		vscode.window.showInformationMessage("datatypes received  are " +datatypes);

		const classDefinition = `class ${className}{\n`;
		let propertyWithDatatype ='\t\t';
		for (let i = 0; i < properties.length; i++) {
			propertyWithDatatype = propertyWithDatatype + properties[i]+ ":" + datatypes[i] +";\n\t\t" ;
		  }

		const classString = `${classDefinition} ${propertyWithDatatype} \n\t}`;
		console.log(classString);







		

		vscode.window.showInformationMessage("class definition " +classString);

		const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath
		  .toString();
		  ;
		
		console.log("the path is", folderPath);
		
		  vscode.window.showInformationMessage("folder path " +folderPath);
		
		fs.writeFile(path.join(folderPath, `${className}.ts`), classString, () => {});
		
		fs.writeFile(path.join(folderPath, `${className}.ts`), classString, (err: any) => {
			if (err) {
			  vscode.window.showErrorMessage("Something went wrong");
			  return console.log(err);
			}
			vscode.window.showInformationMessage(`${className} Class created.`);
		  });
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
