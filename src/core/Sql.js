import { Lexicon } from "./Lexicon";


export class Sql {
  static process(rawSql) {
    const results = {};
    // pasarle el texto crudo al analizador lexico
    let lexicalResult = Lexicon.scan(rawSql);

    
    //TODO: determinar el sublenguaje y aplicar la tabla de reglas correspondiente

    // let sintax status = llamar al analizis DML(tablaLexica)

    // retornar json de resultados de cada proceso
    return results;
  }
}
