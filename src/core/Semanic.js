import { View } from "../View";
import { Sql } from "./Sql"

export class Semantic {
  executeRutine(no, token) {
    this.routines[no](token);
  };

  constructor() {
    this.tables = {};
    this.tablesCount = 0;
    this.currentTable = null;

    this.atributes = {};
    this.atrCount = 0;
    this.currentAtr = null;

    this.constraints = {};
    this.constraintsCount = 0;
    this.currentCons = null;
    this.currentAtrAsFK = null;
    this.fkTableRef = null;

    this.currentTableAtrs = null;
    this.insertValueIndex = 0;


    this.routines = {
      700: (token) => { this.#addTable(token) },
      710: (token) => { this.#registertable(token) },
      // carga atributos
      701: (token) => { this.#addAtribute(token) },
      702: (token) => { this.#checkDataType(token) },
      703: (token) => { this.#registerAtrSize(token) },
      704: (token) => { this.#setAtrNullable(token) },

      //carga constraints
      711: (token) => { this.#addContstraint(token) },
      712: (token) => { this.#keyAtrExist(token) },
      713: (token) => { this.#tableRef(token) },
      714: (token) => { this.#atrRef(token) },

      // sentencias Insert
      720: (token) => { this.#startInsert(token) },
      721: (token) => { this.#addInsertValue(token) },
      722: (token) => { this.#endInsert(token) }
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


    this.currentTable = table;
    this.tables[this.currentTable.name] = this.currentTable;
  };

  #registertable(token) {
    // console.log("HEREEEEEEEEEEEEEEEEE:");
    // console.log(this.currentTable);

    // console.log(this.currentTable.name + "  | HA SIDO REGISTRADA");


    // this.currentTable = null;
    View.pr6(this.tables);
    //mostar resultado
  }

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

    this.currentTable.atributesCount++;
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


  #contraintDefBegin(token) {
    this.currentCons = {
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
      name,
      type: -1,
      atrNo: -1,
      atrRef: null,
    }
    this.constraints[constraintID] = con;
    this.currentCons = con;
    this.currentTable.contraintsCount++;
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
    this.currentAtrAsFK = token.tok;
  }

  #tableRef(token) {
    let table = this.tables[token.tok];

    if (table == undefined) {
      Sql.error({
        code: 320,
        message: `En la restricion de llave foranea: ${this.currentCons.name} se hace referencia una tabla que no existe: ${token.tok}`
      },
        token.line
      );
    }
    this.fkTableRef = table;
  }

  #atrRef(token) {
    let atributeName = token.tok;
    let refId = this.fkTableRef.name + "." + atributeName;
    let atr = this.atributes[refId];

    if (atr == null || atr == undefined) {
      Sql.error({
        code: 320,
        message: `En la restricion de llave foranea: "${this.currentCons.name}"
que usa el campo: "${this.currentAtrAsFK}"
el cual hace referencia a 
un atributo: "${token.tok}" que no existe en la tabla: "${this.fkTableRef.name}"`
      },
        token.line
      );
    }

    let currentAtr = this.atributes[this.currentTable.name + "." + this.currentAtrAsFK];

    if (currentAtr.type != atr.type || currentAtr.size != atr.size) {
      Sql.error({
        code: 320,
        message: `En la restricion de llave foranea: "${this.currentCons.name}"
que usa el campo: "${this.currentAtrAsFK}"
el cual hace referencia a 
un atributo: "${token.tok}" no coincide (en tipo o en tamaño) en la tabla: "${this.fkTableRef.name}"`
      },
        token.line
      );
    }


  }



  #startInsert(token) {
    let table = this.tables[token.tok] ?? false;
    if (table == false) {
      Sql.error({
        code: 309,
        message: `La tabla: “${token.tok}" no existe.`
      },
        token.line
      );
    }
    this.currentTable = table;
    this.currentTableAtrs = Object.values(this.atributes).filter(atr => atr.table == this.currentTable);
    this.insertValueIndex = 0;
  }

  #addInsertValue(token) {
    let value = token.tok;
    let valueType = token.sintaxValue == 62 ? 'char' : 'numeric';

    let atr = this.currentTableAtrs[this.insertValueIndex]
    let atrType = atr?.type;

    if (valueType != atrType) {
      Sql.error({
        code: 307,
        message: `En INSERT el valor: "${value}",  no corresponde con la tabla: ${this.currentTable.name}`
      },
        token.line
      );
    }

    let valueSize = (value + "").length
    if (valueSize > atr.size) {
      Sql.error({
        code: 308,
        message: `En INSERT el valor "${value}" se truncaria`
      },
        token.line
      );
    }

    this.insertValueIndex++;
  }

  #endInsert(token) {
    if (this.insertValueIndex != this.currentTableAtrs.length) {
      Sql.error({
        code: 309,
        message: `En INSERT faltan valores para que corresponda con la tabla: ${this.currentTable.name}`
      },
        token.line
      );
    }
  }
}
