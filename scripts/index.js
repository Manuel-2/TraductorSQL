const keywords = {
  select: 10,
  from: 11,
  where: 12,
  in: 13,
  and: 14,
  or: 15,
  create: 16,
  table: 17,
  char: 18,
  numeric: 19,
  not: 20,
  null: 21,
  constraint: 22,
  key: 23,
  primary: 24,
  foreign: 25,
  references: 26,
  insert: 27,
  into: 28,
  values: 29
};

const delimiters = {
  ",": 50,
  ".": 51,
  "(": 52,
  ")": 53,
  "\'": 54,
}

const mathOperators = {
  "+": 70,
  "-": 71,
  "*": 72,
  "/": 73,
}

const relationalOperators = {
  ">": 81,
  "<": 82,
  "=": 83,
  ">=": 84,
  "<=": 85,
}


//setup
input.value = `SELECT ANOMBRE, CALIFICACION, TURNO
FROM ALUMNOS, INSCRITOS, MATERIAS, CARRERAS
WHERE MNOMBRE = 'PROGSIST' AND TURNO = 'TV'
AND CNOMBRE = 'IDS' AND SEMESTRE = 'EJ2026' AND CALIFICACION >= 6`;


run.addEventListener("click", () => {
  let sql = input.value;
  let lines = sql.split('\n');

  let identifiers = [];
  let constants = [];
  let constantsValueCounter = 400;
  let identifiersValueCounter = 300;

  lines.forEach((line, lineIndex) => {

    let tokens = line.match(/'[^']*'|\d+|[A-Za-z_]\w*/g) || [];

    const stringRegex = /^'[^']*'$/;
    const numberRegex = /^\d+$/;

    tokens.forEach(token => {
      let tokenLower = token.toLowerCase();

      if (stringRegex.test(token) || numberRegex.test(token)) {
        constantsValueCounter++;
        constants.push({
          token: token,
          value: constantsValueCounter,
          line: lineIndex+1,
        });
      }

      else if (!keywords[tokenLower]) {
        identifiersValueCounter++;
        identifiers.push({
          token: token,
          value: identifiersValueCounter,
          line: lineIndex+1,
        });
      }
    });

  });

  renderTable(identifiers,identifiersTable);
  renderTable(identifiers,constantsTable);
  // console.log("CONSTANTS:", constants);
  // console.log("IDENTIFIERS:", identifiers);
});

function renderTable(data, table) {
  console.log(table.innerHTML);
  let toRender = table.innerHTML;

  data.forEach(row => {
    toRender += `<tr>
          <td>${row.token}</td>
          <td>${row.value}</td>
          <td>${row.line}</td>
        </tr>`;
  });
  table.innerHTML = toRender;
}
