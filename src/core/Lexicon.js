import { StatusCodes } from './definitions/StatusCodes.js'
import { Sql } from './Sql.js';

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
  values: 29,
  check: 30,
  'date': 31
};

const delimiters = {
  ",": 50,
  ".": 51,
  "(": 52,
  ")": 53,
  "'": 54,
  ";": 55,
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
const delimiterRegex = /,|\(|\)|\.|'|;/;
const identifierRegex = /^[A-Za-z_][A-Za-z0-9_#]*#?$/;
const tokenRegex = /'[^']*'|>=|<=|<>|[+\-*/=<>]|,|\(|\)|\.|\b\d+\b|\b[A-Za-z_][A-Za-z0-9_]*\b#?|\S+|/g;

export class Lexicon {

  static scan(rawSql) {
    let lines = rawSql.trim().split('\n');

    let identifiers = [];
    let constants = [];
    let tokens = [];

    let constantsValueCounter = 600;
    let identifiersValueCounter = 400;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      let line = lines[lineIndex];
      let lineTokens = line.match(tokenRegex) || [];

      for (let tokenIndex = 0; tokenIndex < lineTokens.length; tokenIndex++) {
        let token = lineTokens[tokenIndex];
        if (token.trim().length == 0) {
          continue;
        }
        let type = 0;
        let code = 0;
        let sintaxValue = -1;


        // =================== Identificar Tipo de token ===================== //

        // Constantes =========================================================
        if (stringRegex.test(token) || numberRegex.test(token)) {
          constantsValueCounter++;
          code = constantsValueCounter;
          constants.push({
            token,
            value: code,
            line: lineIndex + 1,
          });

          // Constantes Numericas -------------------------
          if (numberRegex.test(token)) {
            type = 61;
            sintaxValue = 61;
          }
          // Constantes Alfanumericas ---------------------
          else if (stringRegex.test(token)) {
            type = 5;
            code = delimiters['\''];
            sintaxValue = code;

            let delimiterBeforeEntry = {
              no: tokens.length + 1,
              line: lineIndex + 1,
              tok: '\'',
              type,
              code,
              sintaxValue
            }
            tokens.push(delimiterBeforeEntry);


            let constantTokenEntry = {
              no: tokens.length + 1,
              line: lineIndex + 1,
              tok: token.slice(1, token.length - 1),
              type: 6,
              code: constantsValueCounter,
              sintaxValue: 62
            }
            tokens.push(constantTokenEntry);

            // al final se deveria insertar otro delimitador de comilla
            token = '\'';
          }
        }

        // Operadores ==========================================================
        else if (operatorRegex.test(token)) {
          type = 8;
          code = relationalOperators[token] || mathOperators[token];

          // Regla super arbitraria, la tabla sintactica espera ciertos valores como categorias
          // (todos los operadores son el numero 8), mientras que para el * usando en un select se usa su codigo especifo
          // por sitauciones similares no se usa el type ni code y ya (de aqui surge la nececidad de sintaxValue),
          // por que la tabla sintactica mescla terminales con codigos de categoria con codigos especificos
          sintaxValue = 8;
          if (token == '*') {
            sintaxValue = 72;
          }
        }

        // Delimitadores =======================================================
        else if (delimiterRegex.test(token)) {
          type = 5;
          code = delimiters[token];
          sintaxValue = code;
        }

        // Identificadores y Palabras reservadas ===============================
        else if (identifierRegex.test(token)) {
          let tokenLower = token.toLowerCase();

          // Plabra reservada -----------------------
          if (keywords.hasOwnProperty(tokenLower)) {
            type = 1;
            code = keywords[tokenLower];
            sintaxValue = code;
          }

          // Identificador --------------------------
          else {
            identifiersValueCounter++;
            code = identifiersValueCounter;
            type = 4;
            sintaxValue = 4;

            identifiers.push({
              token,
              value: code,
              line: lineIndex + 1,
            });
          }

        } else {
          Sql.error(StatusCodes.Code[101], lineIndex + 1, `Token no reconocido: ${token}`);
        }

        tokens.push({
          no: tokens.length + 1,
          line: lineIndex + 1,
          tok: token,
          type,
          code,
          sintaxValue
        });
      }
    }

    // TODO: usar el codigo de status correcto
    return {
      tokens,
      identifiers,
      constants,
    };
  }
}
