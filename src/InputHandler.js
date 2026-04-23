import { Sql } from './core/Sql.js';
import { Dml } from "./core/definitions/sintax/Dml.js";
import { View } from './View.js';


const placeHolder = `SELECT ANOMBRE, CALIFICACION, TURNO
FROM ALUMNOS, INSCRITOS, MATERIAS, CARRERAS
WHERE MNOMBRE = 'PROGSIST' AND TURNO = 'TV'
AND CNOMBRE = 'IDS' AND SEMESTRE = 'EJ2026' AND CALIFICACION >= 6`;

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
