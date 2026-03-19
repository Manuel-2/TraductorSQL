import { View } from "../View";
import { Lexicon } from "./Lexicon";
import { Sintax } from "./Sintax";


export class Sql {
  static process(rawSql) {
    const results = {};
    // pasarle el texto crudo al analizador lexico
    let lexicalResults = Lexicon.scan(rawSql);
    View.showLexiconTables(lexicalResults);

    // Analisis Sintactico DML
    Sintax.ll(lexicalResults.tokens);
    View.log("Todo Correcto :)");
    return results;
  }

  static error(errorCodeOjb, line, description = '') {
    throw new Error(`${errorCodeOjb.code} | Linea: ${line} | ${errorCodeOjb.message}\n${description}`);
  }
}
