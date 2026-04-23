import { Dml } from "./definitions/sintax/Dml";
import { Ddl } from "./definitions/sintax/Ddl";
import { StatusCodes } from "./definitions/StatusCodes";
import { Sql } from "./Sql";

export class Sintax {
  static sintaxTable;
  static ll(tokensTable) {
    const st = tokensTable[0].code;
    let stack = [199];


    Sintax.sintaxTable = Dml;
    if(st == 16){
      Sintax.sintaxTable = Ddl;
      stack.push(200);
    }else if(st == 27){
      Sintax.sintaxTable = Ddl;
      stack.push(211);
    }else{
      stack.push(300);
    }


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
          console.log(("-------------"));
          console.log("K: " + k + " X: " + x);
          let err = StatusCodes.Code[k?x:300];
          Sql.error(err, tokensTable[tokenIndex].line);
        }
      } else {
        if (Sintax.#isProduction(x, k)) {
          if (Sintax.sintaxTable.getTokenRules(k)[x][0] != 99) {
            let production = Sintax.sintaxTable.getTokenRules(k)[x];
            for (let i = production.length - 1; i >= 0; i--) {
              stack.push(production[i]);
            }
          }
        }
        else {
          console.log("prod no existente");
          let err = StatusCodes.Code[k?x:300];
          console.log(("-------------"));
          console.log("K: " + k + " X: " + x);
          console.table(err);
          Sql.error(err, tokensTable[tokenIndex].line);
        }
      }
    } while (x != 199);
  }

  static #isTerminal(x) {
    return x < 200;
  }

  static #isProduction(x, k) {
    let rules = Sintax.sintaxTable.getTokenRules(k);
    if (rules) {
      return rules[x] != null;
    } 
  }
}
