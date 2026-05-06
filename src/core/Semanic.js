import { Sql } from "./Sql"

export class Semantic {
  executeRutine(no, token) {
    this.routines[no](token);
  };

  constructor() {
    this.tables = {};
    this.tablesCount = 0;
    this.atributes = {};
    this.atrCount = 0;
    this.constraints = {};
    this.currentTable = null;

    this.routines = {
      700: (token) => { this.#addTable(token) },
      701: (token) => { this.#addAtribute(token) },
      702: (token) => { this.#checkDataType(token) },
    };
  };

  // Routines ------------------------------------
  #addTable(token) {
    let name = token.tok;
    if (this.tables[name]) Sql.error({ code: 306, message: `Nombre de tabla “${name}” está duplicado` }, token.line);

    this.tablesCount++;
    let table = {
      no: this.tablesCount,
      name,
      atributesCount: 0,
      contraintsCount: 0
    };
    this.tables[name] = table;
    this.currentTable = table;
  };

  #addAtribute(token) {
    let name = token.tok;
    let currentTableName = this.currentTable.name;
    let atrId = currentTableName + "." + name;

    if (this.atributes[atrId]?.table == this.currentTable) {
      Sql.error({
        code: 302,
        message: `Nombre de atributo “${name}” está duplicado en la tabla: "${this.currentTable.name}"`
      },
        token.line
      );
    }
    this.atrCount++;

    let atr = {
      tableNo: this.currentTable.no,
      atrNo: this.atrCount,
      name,
      type: null,
      size: null,
      nullable: null,
      table: this.currentTable
    }
    this.atributes[atrId] = atr;
  }

  #checkDataType(token) {
    if ([18, 19, 31].includes(token.sintaxValue) == false)
      Sql.error({
        code: 301,
        message: `El tipo de dato: ${token.tok} no existe.`
      },
        token.line
      );
  }
}
