import { Analyzer } from './Analyzer.js';
import { SintaxTableDML } from "./SintaxTableDML";
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

    findRules.addEventListener("click", (e => {
      this.readTokenRuleInput(e);
    }))
  }

  readSQLInput(event) {
    let input = this.#textInput.value;
    input = input.trim();
    input = input.split('\n');

    const results = Analyzer.analyzeLexicaly(input);

    View.showLexiconTables(results);
  }

  readTokenRuleInput(event) {
    let tokenValue = token.value;
    let findedRules = SintaxTableDML.getTokenRules(parseInt(tokenValue)); 
    console.log(tokenValue);
    console.log(findedRules)
    View.renderFindedTokenRules(findedRules);
  }
}
