import { Ddl } from "./core/definitions/sintax/Ddl.js";

export class View {

  static log(message) {
    log.innerText = message;
  }

  static renderTable(container, data) {
    if(!data) {
      View.log("Resultado vacio.");
      return;
    };

    container.innerHTML = "";
    let table = document.createElement('table');
    let fragment = document.createDocumentFragment();

    let keys = Object.keys(data[0]);

    let headerRow = document.createElement("tr");
    for (let c = 0; c < keys.length; c++) {
      let key = keys[c];
      let header = document.createElement("th");
      header.innerText = key;
      headerRow.appendChild(header);
    }

    fragment.appendChild(headerRow);

    data.forEach(val => {
      let row = document.createElement("tr");
      for (let c = 0; c < keys.length; c++) {
        let key = keys[c];
        let cell = document.createElement("td");
        cell.innerText = val[key];
        row.appendChild(cell);
      }
      fragment.appendChild(row);
    });
    table.appendChild(fragment);
    container.appendChild(table);
  }


  static pr6(data) {
    pr6Table.innerHTML = `
        <tr>
          <th>No.tabla</th>
          <th>Nombre</th>
        </tr>
`;
    let tables = Object.values(data);

    let fragment = document.createDocumentFragment();
    for (let i = 0; i < tables.length; i++) {
      let tab = tables[i];
      let rowTable = document.createElement('tr');

      let a = document.createElement('td');
      a.innerText = tab.no;


      let b = document.createElement('td');
      b.innerText = tab.name;

 
      rowTable.appendChild(a);
      rowTable.appendChild(b);
      fragment.appendChild(rowTable);
    }
    pr6Table.appendChild(fragment);
  }
}
