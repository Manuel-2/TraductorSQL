export class View {

  static showLexiconTables(results) {
    this.cleanTables();

    if (results.status == 'Error') {
      log.innerText = results.message;
      return;
    }
    log.innerText = "Analizis Lexico Correcto :) ";

    let { identifiers, constants, tokens } = results.data;
    this.renderDinamicTable(identifiers, identifiersTable);
    this.renderDinamicTable(constants, constantsTable);
    this.renderLexiconTable(tokens);
  }

  static cleanTables() {
    let tables = [identifiersTable, constantsTable, lexicon]

    tables.forEach(table => {
      let prevRows = table.querySelectorAll(':scope > *:not(:first-child)')
      prevRows.forEach(prev_row => table.removeChild(prev_row));
    });
  }

  static renderLexiconTable(data) {

    let fragment = document.createDocumentFragment();
    data.forEach(row => {
      let rowTable = document.createElement('tr');

      let NoCell = document.createElement('td');
      NoCell.innerText = row.no;

      let lineCell = document.createElement('td');
      lineCell.innerText = row.line;

      let tokenCell = document.createElement('td');
      tokenCell.innerText = row.tok;

      let typeCell = document.createElement('td');
      typeCell.innerText = row.type;

      let codeCell = document.createElement('td');
      codeCell.innerText = row.code;


      rowTable.appendChild(NoCell);
      rowTable.appendChild(lineCell);
      rowTable.appendChild(tokenCell);
      rowTable.appendChild(typeCell);
      rowTable.appendChild(codeCell);

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
