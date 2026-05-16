import { Sql } from './core/Sql.js';
import { Dml } from "./core/definitions/sintax/Dml.js";
import { View } from './View.js';


const placeHolder = `Create Table Empleado (
idEmpleado Numeric(3) Not Null,
idDepartamento Numeric(3) NOT Null,
Jefe Numeric(3),
Sexo Char(1),
Salario Numeric(10,2),
FechaNac Date Not Null
);

select salario from empleado where idempleado = 1`;

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
  }

  readTokenRuleInput(event) {
    let tokenValue = token.value;
    let findedRules = Dml.getTokenRules(parseInt(tokenValue));
    View.renderFindedTokenRules(findedRules);
  }
}
