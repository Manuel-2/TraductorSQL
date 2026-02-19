const keywords = {
  select: 10,
  'from': 11,
  where: 12,
  in: 13,
  and: 14,
  or: 15,
  create: 16,
  table: 17,
  char: 18,
  numeric: 19,
  not: 20,
  'null': 21,
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

const operatorRegex = />=|<=|<>|[+\-*/=<>]/;
const stringRegex = /^'[^']*'$/;
const numberRegex = /^\d+$/;
const delimiterRegex = /,|\(|\)|\./;
const identifierRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;

const tokenRegex = /'[^']*'|>=|<=|<>|[+\-*/=<>]|,|\(|\)|\.|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b/g;

export class Analyzer {

  static analyzeLexicaly(lines) {
    let identifiers = [];
    let constants = [];
    let tokens = [];

    let constantsValueCounter = 400;
    let identifiersValueCounter = 300;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      let line = lines[lineIndex];
      let lineTokens = line.match(tokenRegex) || [];

      for (let tokenIndex = 0; tokenIndex < lineTokens.length; tokenIndex++) {

        let token = lineTokens[tokenIndex];
        let type = 0;
        let code = 0;

        // CONSTANTS
        if (stringRegex.test(token) || numberRegex.test(token)) {
          constantsValueCounter++;
          code = constantsValueCounter;
          type = 6;

          constants.push({
            token,
            value: code,
            line: lineIndex + 1,
          });

        // OPERATORS
        } else if (operatorRegex.test(token)) {
          type = 8;
          code = relationalOperators[token] || mathOperators[token];

        // DELIMITERS
        } else if (delimiterRegex.test(token)) {
          type = 5;
          code = delimiters[token];

        // IDENTIFIERS / KEYWORDS
        } else if (identifierRegex.test(token)) {

          let tokenLower = token.toLowerCase();

          if (keywords.hasOwnProperty(tokenLower)) {
            type = 1;
            code = keywords[tokenLower];
          } else {
            identifiersValueCounter++;
            code = identifiersValueCounter;
            type = 4;

            identifiers.push({
              token,
              value: code,
              line: lineIndex + 1,
            });
          }

        } else {
          return {
            status: "Error",
            message: `Error Léxico | Línea: ${lineIndex + 1} | Token no reconocido: ${token}`,
          };
        }

        tokens.push({
          no: tokens.length + 1,
          line: lineIndex + 1,
          tok: token,
          type,
          code
        });
      }
    }

    return {
      status: "Correct",
      message: "Lexicamente Correcto :)",
      data: {
        tokens,
        identifiers,
        constants,
      }
    };
  }
}
