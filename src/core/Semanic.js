import { Sql } from "./Sql"

export class Semantic {
  executeRutine(no, token) {
    this.routines[no](token);
  };

  constructor() {
    this.tables = {};
    this.tablesCount = 0;
    this.atributes = {};
    this.currentAtr = null;
    this.atrCount = 0;
    this.constraints = {};
    this.constraintsCount = 0;
    this.currentTable = null;

    this.routines = {
      700: (token) => { this.#addTable(token) },
      // carga atributos
      701: (token) => { this.#addAtribute(token) },
      702: (token) => { this.#checkDataType(token) },
      703: (token) => { this.#registerAtrSize(token) },
      704: (token) => { this.#setAtrNullable(token) },

      //carga constraints
      710: (token) => { this.#keyAtrExist(token) },
    };
  };

  // UTILS

  /**
   * Obten la informacion de un trabito en una tabla especifica
   * @param {string} atrId talba.atributo 
   */
  getAtr(atrId) {
    return this.atributes[atrId] ?? false;
  }

  /**
   * recive un nombre de atributo y retorna su informacion en al tabla actual
   * @param {string} atrName 
   * @returns tablaActual.atrName
  */
  getAtrCT(atrName) {
    return this.getAtr(this.currentTable.name + "." + atrName);
  }


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

    if (this.atributes[atrId] != undefined) {
      Sql.error({
        code: 302,
        message: `Nombre de atributo: “${name}” está duplicado en la tabla: "${this.currentTable.name}"`
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
      nullable: true,
      table: this.currentTable
    }
    this.atributes[atrId] = atr;
    this.currentAtr = atr;
  }

  #checkDataType(token) {
    if ([18, 19, 31].includes(token.sintaxValue) == false)
      Sql.error({
        code: 301,
        message: `El tipo de dato: ${token.tok} no existe.`
      },
        token.line
      );
    this.currentAtr.type = token.tok;
  }

  #registerAtrSize(token) {
    let size = parseInt(token.tok);
    if (size == NaN) {
      console.log("whut??");
      return;
    }
    if (this.currentAtr.size == null) {
      this.currentAtr.size = size;
    } else {
      this.currentAtr.size = [this.currentAtr.size, size];
    }
  }

  #setAtrNullable(token) {
    this.currentAtr.nullable = false;
  }

  #keyAtrExist(token) {
    if (this.getAtrCT(token.tok) == false) {
      Sql.error({
        code: 303,
        message: `El nombre del atributo(llave): “${token.tok}" no existe en la tabla: “${this.currentTable.name}”.`
      },
        token.line
      );
    }
  }

  #addContstraint(token) {
    let name = token.tok;
    let tableName = this.currentTable.name;
    let constraintID = tableName + "." + name;

    if (this.constraints[constraintID] != undefined) {
      Sql.error({
        code: 306,
        message: `Nombre de restricion: “${name}” está duplicado en la tabla: "${tableName}"`
      },
        token.line
      );
    }

    this.constraintsCount++;

    let con = {
      tableNo: this.currentTable.no,
      tableRef: this.currentTable,
      constraintNo: this.constraintsCount,
      type: -1,
      atrNo: -1,
      atrRef: null,
      tableRef
    }

    this.constraints[constraintID] = con;
  }

  // #(token){
  //   let tableName = token.tok;
  //   if(this.tables[tableName] == false){

  //   }
  // }
}
