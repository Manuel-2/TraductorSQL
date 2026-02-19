

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

    this.#runButton.addEventListener("click", this.readSQLInput);
  }

  readSQLInput(event) {
    let input = this.#textInput.value;
    input = input.trim();
    input = input.split('\n');

    const results = Analyzer.analyzeLexicaly(input);

  }
}
