export class View {

  static showLexiconTables(results) {

    //TODO: aceder a la consola esa y mortar el error

    if (results.status == 'Error') {
      return;
    }

    //TODO mostar tabla de lexico completo con delimitadores palabras clave y asi
    this.renderDinamicTable(results.data.identifiers, identifiersTable);
    this.renderDinamicTable(results.data.constants, constantsTable);
  }


  static renderDinamicTable(data, table) {
    let prevRows = table.querySelectorAll(':scope > *:not(:first-child)')
    prevRows.forEach(prev_row => table.removeChild(prev_row));

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
