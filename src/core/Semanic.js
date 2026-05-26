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

    // DML
    this.selectCtx = null;


    this.routines = {
      // DDL ==============================================
      //tablas
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
      722: (token) => { this.#endInsert(token) },


      // DML ===============================================
      750: (token) => { this.#startSelectCtx(token) },
      751: (token) => { this.#selectColumn(token) },
      752: (token) => { this.#changeCol2Table(token) },
      753: (token) => { this.#addTable2Context(token) },
      // 754: (token) => { this.#endFrom(token) },
      755: (token) => { this.#endSelect(token) },
      756: (token) => { this.#addAliasforTable(token) },
      757: (token) => { this.#startWhere(token) },
      758: (token) => { this.#storeCondition(token) },


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


  // DML PROCEDURES ====================================================
  #startSelectCtx() {
    this.selectCtx = {
      usedAtrsNames: [],
      usedAtrsIds: [],

      fromTables: [],
      scopeAtributes: {},
      scopeTables: {},

      where: {
        active: false,
        a: null,
        b: null
      }
    };
  }

  #selectColumn(token) {
    // if (this.#storeCondition(token)) return;
    this.#storeCondition(token)

    let name = token.tok;
    this.selectCtx.usedAtrsNames.push({
      name,
      line: token.line
    });
  }

  #changeCol2Table(token) {
    // let table = this.selectCtx.usedAtrsNames[this.selectCtx.usedAtrsNames.length - 1];
    let table = this.selectCtx.usedAtrsNames.pop();
    let realCol = token.tok;
    let id = table.name + "." + realCol;

    if (this.#storeCondition(id, true)) return;

    this.selectCtx.usedAtrsNames.pop();

    this.selectCtx.usedAtrsIds.push({
      id,
      line: token.line
    });
  }

  #storeCondition(atr, change2TableId = false) {
    let where = this.selectCtx.where;
    if (where.active) {
      // console.log("storing a value");
      // console.log(atr);


      if (where.a == null || (where.a != null && change2TableId && typeof where.a != 'string')) {
        where.a = atr;
      } else {
        where.b = atr;
        // this.#validateComparison();
      }
    }
    return where.active;
  }

  #validateComparison() {
    let where = this.selectCtx.where;
    console.log('==================== where ======================');
    console.log(where);
    where.active = false;
    // return;


    //TODO: parche rapido obtener el atr real del where.a segun si es  un 'table.col' o si si solo es atr

    let getValue = (ab) => {
      if ((typeof ab) == 'string') {
        // tabla.atributo
        return this.atributes[ab].type;
      } else if (ab.sintaxValue == 4) {
        let val = ab.tok;
        // atributo puro
        this.#checkColumnsInSelectContext();

        let tablesAtrs = Object.keys(this.atributes)
          .filter(id => this.selectCtx.fromTables.includes(id.split('.')[0]));

        let appearances = tablesAtrs.filter(a => a.split('.')[1] == val);

        if (appearances.length = 1) {
          return this.atributes[appearances[0]].type;
        } else {
          if (appearances == 0) {
            Sql.error({
              code: 311,
              message: `El nombre del atributo: “${ab}" no es valido.`
            },
              line
            );
          }

          if (appearances > 1) {
            Sql.error({
              code: 311,
              message: `El nombre atributo: “${ab}" es ambiguo`
            },
              line
            );
          }
        }

        console.log(appearances);
        return null;


        // return ab.;
      } else if (ab.sintaxValue == 61) {
        return 'numeric';
      } else {
        return 'char';
      }
    }

    let typeA = getValue(where.a);
    let typeB = getValue(where.b);


    if (typeA != typeB) {
      Sql.error({
        code: 313,
        message: `Error de conversión al convertir el valor del atributo
‘${where.a.tok}’ del tipo:${typeA} a tipo de dato:${typeB}.`
      },
        where.a.line
      );
    }

    console.log('Types:');
    console.log("A :" + typeA);
    console.log("B :" + typeB);
    console.log('='.repeat(50));
  }



  #addTable2Context(token) {
    let tableName = token.tok;

    if (this.tables[tableName] == undefined) {
      Sql.error({
        code: 309,
        message: `La tabla: “${token.tok}" no existe.`
      },
        token.line
      );
    }

    this.selectCtx.fromTables.push(tableName);

    //create scoped atributies
    Object.keys(this.atributes)
      .filter(id => id.split(".")[0] == tableName)
      .forEach(id => {
        this.selectCtx.scopeAtributes[id] = true;
      });

    this.selectCtx.scopeTables[tableName] = true;
  }

  #addAliasforTable(token) {
    let tableName = this.selectCtx.fromTables[this.selectCtx.fromTables.length - 1];
    let alias = token.tok;
    this.selectCtx.scopeTables[alias] = true;

    Object.keys(this.atributes)
      .filter(id => id.split(".")[0] == tableName)
      .forEach(id => {
        let aliasedId = alias + "." + id.split(".")[1]
        this.selectCtx.scopeAtributes[aliasedId] = true;
      });
  }

  #endSelect(token) {
    this.#validateComparison();
    // console.log(this.selectCtx);

    // TODO:validar luego que las tablas y atributos estan en el from (solo las de tipo tabla.atr)
    // let atrsIdInScope = Object.keys(this.atributes)
    //   .filter(id => this.selectCtx.fromTables.includes(id.split('.')[0]));
    // let tablesInScope = atrsIdInScope.map(id => id.split('.')[0]);

    this.selectCtx.usedAtrsIds.forEach(dat => {
      let { id, line } = dat;
      let tableName = id.split(".")[0];

      if (this.selectCtx.scopeTables[tableName] == undefined) {
        Sql.error({
          code: 314,
          message: `La tabla: “${tableName}" no es valida`
        },
          line
        );
      }

      if (this.selectCtx.scopeAtributes[id] == undefined) {
        Sql.error({
          code: 311,
          message: `El nombre identificador: “${id}" no es valido.`
        },
          line
        );
      }
    });

    this.#checkColumnsInSelectContext();

  }

  #checkColumnsInSelectContext() {
    let tablesAtrs = Object.keys(this.atributes)
      .filter(id => this.selectCtx.fromTables.includes(id.split('.')[0]))
      .map(id => id.split('.')[1]);


    this.selectCtx.usedAtrsNames.forEach(atr => {
      let { name, line } = atr;
      let appearances = tablesAtrs.filter(a => a == name).length;

      if (appearances == 0) {
        Sql.error({
          code: 311,
          message: `El nombre del atributo: “${name}" no es valido.`
        },
          line
        );
      }

      if (appearances > 1) {
        Sql.error({
          code: 311,
          message: `El nombre atributo: “${name}" es ambiguo`
        },
          line
        );
      }
    });
  }

  #startWhere() {
    this.selectCtx.where.active = true;
  }
}
