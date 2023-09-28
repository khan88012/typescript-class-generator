import * as vscode from "vscode";
import { PropertyDatatype } from "./property-datatype";
const fs = require("fs");
const path = require("path");

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "typescript-class-generator.createClass",
    async () => {
      vscode.window.showInformationMessage(
        "Hello, This is Model Class Generator!"
      );

      const languages = ["Typescript", "Python"];
      const language = await vscode.window.showQuickPick(languages, {
        placeHolder: "Select the language.",
      });
      const options: vscode.OpenDialogOptions = {
        canSelectFiles: false, 
        canSelectFolders: true, 
        canSelectMany: false, 
        openLabel: 'Open Folder', 
    };
    

    let newFolderPath;
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
      let className: string;
      let count = 1;
      let validInput = false;
      let propertiesDatatype: PropertyDatatype[] = [];
      let datatype: string;
      let isConstructorNeeded;
      let extension;
      let propertyWithDatatype = "\t\t";
      let classString;
      let constructorString = `constructor(args: any = {}){\n\t\t`;
      let constructorFields = "\t\t";

      

      if (!vscode.workspace.workspaceFolders) {
        return vscode.window.showErrorMessage(
          "Please open a directory before creating a class"
        );
      }


      if (language) {
      await  vscode.window.showOpenDialog(options).then( (uri) => {
          if (uri && uri.length > 0) {
           newFolderPath  = uri[0].fsPath;
          } else {
              console.log('Dialog canceled by the user.');
          }
      });
        className =
          (await vscode.window.showInputBox({
            prompt: "Class Name?",
          })) || "";
        className = className.charAt(0).toUpperCase() + className.slice(1);

        if (!className?.trim()) {
          vscode.window.showErrorMessage(
            "you have not provided any class name"
          );
          return;
        }

        if (language === "Typescript") {
          extension = ".ts";
          let property = await vscode.window.showInputBox({
            prompt: `Property #${count}? (keep the input box empty and press enter when finished)`,
          });

          if (!property) {
            vscode.window.showErrorMessage(
              "you have not provided any property name"
            );
            datatype = "";
          } else {
            do {
              datatype =
                (await vscode.window.showQuickPick(dataTypes, {
                  placeHolder: "Select datatype for the property",
                })) || "";

              if (dataTypes.includes(datatype)) {
                validInput = true;
              } else {
                vscode.window.showErrorMessage(
                  "Please provide a correct datatype"
                );

                validInput = false;
              }
            } while (!validInput);

            if (!datatype) {
              vscode.window.showErrorMessage("data type was not provided");

              property = "";
            }
          }

          while (property && datatype) {
            propertiesDatatype.push(new PropertyDatatype());

            propertiesDatatype[count - 1].property = property!;
            propertiesDatatype[count - 1].datatype = datatype!;

            count++;
            property = await vscode.window.showInputBox({
              prompt: `Property #${count}? (keep the input box empty and press enter when finished)`,
            });
            if (!property) {
              vscode.window.showErrorMessage(
                "you have not provided any property name"
              );
              datatype = "";
            } else {
              do {
                datatype =
                  (await vscode.window.showQuickPick(dataTypes, {
                    placeHolder: "Select datatype for the property",
                  })) || "";

                if (dataTypes.includes(datatype)) {
                  validInput = true;
                } else {
                  vscode.window.showErrorMessage(
                    "Please provide a correct datatype"
                  );

                  validInput = false;
                }
              } while (!validInput);
            }
          }
          isConstructorNeeded= ( await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'Do you want to generate constructor?' })) || '';


          const classDefinition = `class ${className}{\n`;

          for (let i = 0; i < propertiesDatatype.length; i++) {
            propertyWithDatatype =
              propertyWithDatatype +
              propertiesDatatype[i].property.trim() +
              ":" +
              propertiesDatatype[i].datatype.trim() +
              ";\n\t\t";
          }

          classString = `${classDefinition} ${propertyWithDatatype} \n\t}`;

          if (isConstructorNeeded === "Yes") {
            for (let i = 0; i < propertiesDatatype.length; i++) {
              constructorFields =
                constructorFields +
                "this." +
                propertiesDatatype[i].property.trim() +
                " = args." +
                propertiesDatatype[i].property.trim() +
                "\n\t\t\t\t";
            }
            classString = `${classDefinition} ${propertyWithDatatype} ${constructorString} ${constructorFields} }\n\t}`;
          }
        } else {
          extension = ".py";
          let property = await vscode.window.showInputBox({
            prompt: `Property #${count}? (keep the inputbox empty and press 'Enter' when finished)`,
          });
          const properties = [];
          while (property) {
            properties.push(property);
            count++;
            property = await vscode.window.showInputBox({
              prompt: `Property #${count}? (keep the inputbox empty and press 'Enter' when finished)`,
            });
          }
          vscode.window.showInformationMessage(
            "Properties received  are " + properties
          );

          const classDefinition = `class ${className}:`;
          const constructorDefinition = `def _init_(self, ${properties.join(
            ","
          )}):`;

          const constructorAssignments = properties
            .map((property) => `self.${property} = ${property}\n\t\t`)
            .join("");
          const classGetters = properties
            .map(
              (property) =>
                `\tdef get_${property}(self):\n\t\treturn self.${property}\n\n`
            )
            .join("");
          const dunderStrString = `\tdef __str__():\n \t\treturn ${properties
            .map(
              (property) =>
                '"' + property + ': "' + " + " + property + ' + " , " + '
            )
            .join("")
            .slice(0, -11)}`;
          classString = `${classDefinition}${constructorDefinition} ${constructorAssignments}${classGetters}${dunderStrString}`;
        }

        vscode.window.showInformationMessage("class definition " + classString);

        let folderPath ;
        if(newFolderPath)
        {
          folderPath = newFolderPath;
        }
        else{
          folderPath =   vscode.workspace.workspaceFolders[0].uri.fsPath.toString();

        }
        vscode.window.showInformationMessage("folder path " + folderPath);

        fs.writeFile(
          path.join(folderPath, `${className}${extension}`),
          classString,
          () => {}
        );

        fs.writeFile(
          path.join(folderPath, `${className}${extension}`),
          classString,
          (err: any) => {
            if (err) {
              vscode.window.showErrorMessage("Something went wrong");
              return console.log(err);
            }
            vscode.window.showInformationMessage(`${className} Class created.`);
          }
        );
      } else {
        vscode.window.showErrorMessage("Please choose a language.");
        return;
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
