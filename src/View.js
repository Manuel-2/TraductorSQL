import { Ddl } from "./core/definitions/sintax/Ddl.js";

export class View {

  static log(message){
    log.innerText = message;
  }

  static showLexiconTables(results) {
    this.cleanTables();

    let { identifiers, constants, tokens } = results;
    // this.renderDinamicTable(identifiers, identifiersTable);
    // this.renderDinamicTable(constants, constantsTable);
    this.renderLexiconTable(tokens);
  }

  static cleanTables() {
    let tables = [lexicon]

    tables.forEach(table => {
      let prevRows = table.querySelectorAll(':scope > *:not(:first-child)')
      prevRows.forEach(prev_row => table.removeChild(prev_row));
    });
  }

  static renderFindedTokenRules(tokenRules) {
    let text = "";
    if (tokenRules) {
      text = tokenRules.reduce((total, current) => total + current + ", ", "");
    } else {
      text = "No hay reglas para ese token.";
    }

    rules.innerText = text;
  }

  static renderLexiconTable(data) {

    let fragment = document.createDocumentFragment();
    data.forEach(row => {
      let rowTable = document.createElement('tr');

      let tokenCell = document.createElement('td');
      tokenCell.innerText = row.tok;
      
      let codeCell = document.createElement('td');
      codeCell.innerText = row.sintaxValue;

      let rulesCell = document.createElement('td');
      let rules = Ddl.getTerminalRules(row.sintaxValue);
      if(rules == undefined){
        rules = 'No hay reglas asociadas';
      }else{
        rules = Object.keys(rules).join(',');
      }
      rulesCell.innerText = rules; 


      rowTable.appendChild(tokenCell);
      rowTable.appendChild(codeCell);
      rowTable.appendChild(rulesCell);

      fragment.appendChild(rowTable);
    });
    lexicon.appendChild(fragment);
  }

  static renderDinamicTable(data, table) {
    let fragment = document.createDocumentFragment();
    data.forEach(row => {
      let rowTable = document.createElement('tr');

      let tokenCell = document.createElement('td');
      tokenCell.innerText = row.token;
      let valueCell = document.createElement('td');
      valueCell.innerText = row.value;
      let lineCell = document.createElement('td');
      lineCell.innerText = row.line;

      rowTable.appendChild(tokenCell);
      rowTable.appendChild(valueCell);
      rowTable.appendChild(lineCell);

      fragment.appendChild(rowTable);
    });
    table.appendChild(fragment);
  }
}
