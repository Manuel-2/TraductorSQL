import { View } from "../View";
import { Lexicon } from "./Lexicon";
import { Semantic } from "./Semanic";
import { Sintax } from "./Sintax";


async function sendSql(data) {
  const response = await fetch('http://localhost:8000/api/sql', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });

  const d = await response.json();
  View.log(d.data);
}

async function thanos(data) {
  const response = await fetch('http://localhost:8000/api/thanos', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });

  const d = await response.json();
  View.log(d.data);
}

export class Sql {
  static semanticContext;


  static process(rawSql) {



    if (this.semanticContext == null) {
      this.semanticContext = new Semantic();
    }

    const results = {};
    // pasarle el texto crudo al analizador lexico
    let lexicalResults = Lexicon.scan(rawSql);

    // Analisis Sintactico
    const semantic = Sintax.ll(lexicalResults.tokens);

    View.pr6(semantic.tables);
    View.log("Todo Correcto :)");
    rawSql = rawSql.replace(/(\r\n|\n|\r)/gm, "");

    if(rawSql.includes('SELECT') || rawSql.includes('select')){
      console.log("select");
      sendSql(rawSql);
    }else{
      thanos(rawSql);
    }


    return results;
  }

  static startSemantic() {
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
    if (!errorCodeOjb) {
      errorCodeOjb = {
        code: 201,
        message: "Error Sintactico en sentencia sql"
      }
    }
    throw new Error(`${errorCodeOjb.code} | Linea: ${line} | ${errorCodeOjb.message}\n${description}`);
  }
}
