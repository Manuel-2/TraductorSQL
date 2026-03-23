import { Dml } from "./definitions/sintax/Dml";
import { StatusCodes } from "./definitions/StatusCodes";
import { Sql } from "./Sql";

export class Sintax {
  static ll(tokensTable) {
    let stack = [199, 300];

    let lastLine = tokensTable[tokensTable.length -1].line
    tokensTable.push({ sintaxValue: 199, line: lastLine });
    let tokenIndex = 0;

    let x = null;
    let k = null;
    do {
      x = stack.pop();
      k = tokensTable[tokenIndex].sintaxValue

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
    return x < 200;
  }

  static #isProduction(x, k) {
    let rules = Dml.getTokenRules(k);
    if (rules) {
      return rules[x] != null;
    } else {
      alert('Terminal/token no contemplado en la tabla sintactica k: ' + k);
    }
  }
}
