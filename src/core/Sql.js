import { View } from "../View";
import { StatusCodes } from "./definitions/StatusCodes";
import { Lexicon } from "./Lexicon";


export class Sql {
  static process(rawSql) {
    const results = {};
    // pasarle el texto crudo al analizador lexico
    let lexicalResults = Lexicon.scan(rawSql);
    View.showLexiconTables(lexicalResults);
    View.log("Todo Correcto :)");

    //TODO: determinar el sublenguaje y aplicar la tabla de reglas correspondiente
    // let sintax status = llamar al analizis DML(tablaLexica)

    // retornar json de resultados de cada proceso
    return results;
  }

  static error(errorCodeOjb, line, description = '') {
    throw new Error(`${errorCodeOjb.code} | Linea: ${line} | ${errorCodeOjb.message} .\n${description}`);
  }
}
