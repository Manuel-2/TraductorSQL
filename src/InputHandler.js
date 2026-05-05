import { Sql } from './core/Sql.js';
import { Dml } from "./core/definitions/sintax/Dml.js";
import { View } from './View.js';


const placeHolder = `Create Table Empleado (
idEmpleado Numeric(3) Not Null,
idDepartamento Numeric(3) NOT Null,
Jefe Numeric(3),
Sexo Char(1),
Salario Numeric(10,2),
FechaNac Date Not Null,
FechaIni Date,
Constraint DMEmpleado Check (Salario > 0),
Constraint PKEmpleado Primary Key (idEmpleado),
Constraint FKEmpleado1 Foreign Key (Jefe)
References Empleado(idEmpleado),
Constraint FKEmpleado2 Foreign Key (idDepartamento)
References Departamento(idDepartamento));
`;

export class InputHandler {
  #textInput;
  #runButton;

  constructor(textInput, runButton) {

    this.#textInput = textInput;
    this.#runButton = runButton;

    this.#textInput.value = placeHolder;

    this.#runButton.addEventListener("click", (e) => {
      this.readSQLInput(e);
    });

    // findRules.addEventListener("click", (e => {
    //   this.readTokenRuleInput(e);
    // }))
  }

  readSQLInput(event) {
    // obtener input
    try {
      let results = Sql.process(this.#textInput.value);
    } catch (error) {
      View.log(error);  
    }

    //try 
    // pasarselo al SQL process()
    // modulo de resultados y status code
    // catch error
    // modulo de errores mostrar fallo status code



    // const results = Analyzer.analyzeLexicaly(input);

    // View.showLexiconTables(results);
  }

  readTokenRuleInput(event) {
    let tokenValue = token.value;
    let findedRules = Dml.getTokenRules(parseInt(tokenValue));
    View.renderFindedTokenRules(findedRules);
  }
}
