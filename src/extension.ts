
import * as vscode from 'vscode';
import { PropertyDatatype } from './property-datatype';
const fs = require("fs");
const path = require("path");


export function activate(context: vscode.ExtensionContext) {


	let disposable = vscode.commands.registerCommand('typescript-class-generator.createTsClass', async () => {
		vscode.window.showInformationMessage('Hello, This is Typescript Class Generator!');
		let dataTypes: string[] = [
			"number",
			"string",
			"boolean",
			"Array",
			"Tuple",
			"Enum",
			"any",
			"void",
		];
		let className : string ;
		let count = 1;
		let validInput = false;
		let propertiesDatatype: PropertyDatatype[]=[];
		let datatype : string ;
		let isConstructorNeeded;
		
		if(!vscode.workspace.workspaceFolders)
		{
			return vscode.window.showErrorMessage("Please open a directory before creating a class");
		}
		className =  await vscode.window.showInputBox(
			{
					prompt: "Class Name?"
			}
		)||'';
		className = className.charAt(0).toUpperCase() + className.slice(1);


		if(!className?.trim())
		{
			vscode.window.showErrorMessage("you have not provided any class name");
			return;
		}


		let property = await vscode.window.showInputBox(
			{
				prompt: `Property #${count}? (keep the input box empty and press enter when finished)`
				
			}
		);

		if(!property)
		{
			vscode.window.showErrorMessage("you have not provided any property name");
			datatype='';
		}

		else{

				
			do{
				datatype = await vscode.window.showInputBox(
					{
						prompt: `datatype for property number #${count}`
					}
				)||'';
				if(dataTypes.includes(datatype))
				{
					validInput = true;
				}
				else{
			    vscode.window.showErrorMessage("Please provide a correct datatype");

					validInput = false;
				}
			}while (!validInput);

			if(!datatype)
			{
			vscode.window.showErrorMessage("data type was not provided");

				property='';
			}
		}

		
		
		
		
		while(property && datatype)
		{
			propertiesDatatype.push(new PropertyDatatype());

			propertiesDatatype[count-1].property = property!;
			propertiesDatatype[count-1].datatype = datatype!;
			
			count++;
			property = await vscode.window.showInputBox(
				{
					prompt: `Property #${count}? (keep the input box empty and press enter when finished)`
				}
			);
			if(!property)
			{
				vscode.window.showErrorMessage("you have not provided any property name");
				datatype ='';
			}
	
			else{
				do{
					datatype = await vscode.window.showInputBox(
						{
							prompt: `datatype for property number #${count}`
						}
					)||'';
					if(dataTypes.includes(datatype))
					{
						validInput = true;
					}
					else
					{
						vscode.window.showErrorMessage("Please provide a correct datatype");

						validInput = false;

					}
				}while (!validInput);
			}

		}
		isConstructorNeeded = await vscode.window.showInputBox(
            {
                prompt: `do you want to generate constructor as well,if yes press 'y'`
            }
        );

		const classDefinition = `class ${className}{\n`;
		let propertyWithDatatype ='\t\t';
		let classString;
        let constructorString = `constructor(args: any = {}){\n\t\t`;
        let constructorFields = '\t\t';

		for (let i = 0; i < propertiesDatatype.length; i++) {
			propertyWithDatatype = propertyWithDatatype + propertiesDatatype[i].property.trim()+ ":" + propertiesDatatype[i].datatype.trim() +";\n\t\t" ;
		  }

		 classString = `${classDefinition} ${propertyWithDatatype} \n\t}`;


        if(isConstructorNeeded==='y')
        {
             for (let i = 0; i < propertiesDatatype.length; i++) {
                constructorFields = constructorFields+ 'this.'  + propertiesDatatype[i].property.trim() + ' = args.'+ propertiesDatatype[i].property.trim() + "\n\t\t\t\t";
             }
             classString = `${classDefinition} ${propertyWithDatatype} ${constructorString} ${constructorFields} }\n\t}`;
        }


		

		vscode.window.showInformationMessage("class definition " +classString);

		const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath
		  .toString();
		  ;
		
		
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
