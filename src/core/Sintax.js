import { Dml } from "./definitions/sintax/Dml";
import { StatusCodes } from "./definitions/StatusCodes";
import { Sql } from "./Sql";

export class Sintax {
  static ll(tokensTable) {
    let stack = [199, 300];
    tokensTable.push({ code: 199 });
    let tokenIndex = 0;

    let x = null;
    let k = null;
    do {
      x = stack.pop();
      k = tokensTable[tokenIndex].code
      k = Sintax.#normalizeTokenCode(k);

      if (Sintax.#isTerminal(x)) {
        if (x == k) {
          tokenIndex++;
        } else {
          Sql.error({ code: 300, message: "Error Sintactico" }, tokensTable[tokenIndex].line);
        }
      } else {
        if (Sintax.#isProduction(x, k)) {
          if (Dml.getTokenRules(k)[x][0] != 99) {
            let production = Dml.getTokenRules(k)[x];
            for (let i = production.length - 1; i >= 0; i--) {
              stack.push(production[i]);
            }
          }
        }
        else {
          Sql.error({ code: 300, message: "Error Sintactico" }, tokensTable[tokenIndex].line);
        }
      }
    } while (x != 199);
  }

  static #isTerminal(x) {
    return x < 200 || x == 199;
  }

  static #isProduction(x, k) {
    let rules = Dml.getTokenRules(k);
    return rules && rules[x] != null;
  }

  static #normalizeTokenCode(code) {
    // delimitadores
    if (code >= 50 && code < 6) return 5; 
    // constantes
    if (code >= 60 && code < 70) return 6;
    // operadores
    if (code >= 70 && code < 80) return 7;
    // relacionales
    if (code >= 80 && code < 99) return 8;
    return code;
  }
}
