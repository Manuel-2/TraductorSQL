import { View } from "../View";
import { Lexicon } from "./Lexicon";
import { Semantic } from "./Semanic";
import { Sintax } from "./Sintax";

async function execute(endpoint, data, render = false) {
  const response = await fetch('http://localhost:8000/api/' + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });

  const d = await response.json();
  if (render) {
    View.renderTable(stable, d.data);
  }
  View.log(d.message);
}

export class Sql {
  static semanticContext;

  static clean() {
    execute('clean', 'hi');
  }

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
    View.log("Ejecutando en la base de datos...");

    rawSql = rawSql.replace(/#/gm, "");
    rawSql = rawSql.replace(/(\r\n|\n|\r)/gm, " ");
    rawSql = rawSql.toUpperCase();

    let url = 'ddl';
    if (rawSql.includes('SELECT') || rawSql.includes('select')) {
      url = 'select';
    }
    let render = (url == 'select');

    execute(url, rawSql, render);
    return results;
  }

  static startSemantic() {
    this.semanticContext = new Semantic();


    pr6Table.innerHTML = `
        <tr>
          <th>No.tabla</th>
          <th>Nombre</th>
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
