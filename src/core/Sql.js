import { View } from "../View";
import { Lexicon } from "./Lexicon";
import { Sintax } from "./Sintax";


export class Sql {
  static process(rawSql) {
    const results = {};
    // pasarle el texto crudo al analizador lexico
    let lexicalResults = Lexicon.scan(rawSql);

    // Analisis Sintactico
    const semantic  = Sintax.ll(lexicalResults.tokens);

    View.pr6(semantic.tables);
    View.log("Todo Correcto :)");
    return results;
  }

  static error(errorCodeOjb, line, description = '') {
    if(!errorCodeOjb){
      errorCodeOjb = {
        code: 201,
        message: "Error en sentencia sql"
      }
    }
    throw new Error(`${errorCodeOjb.code} | Linea: ${line} | ${errorCodeOjb.message}\n${description}`);
  }
}
