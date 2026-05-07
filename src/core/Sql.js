import { View } from "../View";
import { Lexicon } from "./Lexicon";
import { Semantic } from "./Semanic";
import { Sintax } from "./Sintax";


export class Sql {
  static semanticContext;


  static process(rawSql) {

  pr6Table.innerHTML = `
        <tr>
          <th>No.tabla</th>
          <th>Nombre</th>
          <th>No.atributos</th>
          <th>No.restricciones</th>
        </tr>`;


    if(this.semanticContext == null){
      this.semanticContext = new Semantic();
    }

    const results = {};
    // pasarle el texto crudo al analizador lexico
    let lexicalResults = Lexicon.scan(rawSql);

    // Analisis Sintactico
    const semantic  = Sintax.ll(lexicalResults.tokens);

    View.pr6(semantic.tables);
    View.log("Todo Correcto :)");
    return results;
  }

  static startSemantic(){
      this.semanticContext = new Semantic();


  pr6Table.innerHTML = `
        <tr>
          <th>No.tabla</th>
          <th>Nombre</th>
          <th>No.atributos</th>
          <th>No.restricciones</th>
        </tr>`;

  }

  static error(errorCodeOjb, line, description = '') {
    if(!errorCodeOjb){
      errorCodeOjb = {
        code: 201,
        message: "Error Sintactico en sentencia sql"
      }
    }
    throw new Error(`${errorCodeOjb.code} | Linea: ${line} | ${errorCodeOjb.message}\n${description}`);
  }
}
