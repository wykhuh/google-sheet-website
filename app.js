import { sheet_url } from "./config.js";

async function fetchGoogleSheetData(url) {
  let response = await fetch(url);
  return await response.text();
}

function parseCSV(stringData) {
  let parsedData = Papa.parse(stringData, { header: true });
  if (parsedData.errors.length === 0) {
    return parsedData.data;
  }
  return [];
}

let headerClasses = [];

function createHeaderRow(data) {
  let rowEl = document.createElement("tr");

  for (let key in data[0]) {
    let headerEl = document.createElement("th");
    let header = key === "Timestamp" ? "Date added" : key;
    headerEl.innerText = header;

    // add html markup for sortable table
    let headerClass = header.replace(" ", "-").toLowerCase();
    headerEl.dataset.sort = headerClass;
    headerEl.className = "sort";
    headerClasses.push(headerClass);

    rowEl.appendChild(headerEl);
  }

  return rowEl;
}

function createRow(row) {
  let rowEl = document.createElement("tr");

  for (let key in row) {
    let tdEl = document.createElement("td");

    if (key === "Timestamp") {
      tdEl.innerText = row[key].split(" ")[0];
      tdEl.className = "date-added";
    } else {
      tdEl.innerText = row[key];
      tdEl.className = key.replace(" ", "-").toLowerCase();
    }

    rowEl.appendChild(tdEl);
  }

  return rowEl;
}

function displayData(data, parentElement) {
  let tableEl = document.createElement("table");
  parentElement.appendChild(tableEl);

  let theadEl = document.createElement("thead");
  tableEl.appendChild(theadEl);

  theadEl.appendChild(createHeaderRow(data));

  let tbodyEl = document.createElement("tbody");
  tbodyEl.className = "list";
  tableEl.appendChild(tbodyEl);

  data.forEach((row) => {
    tbodyEl.appendChild(createRow(row));
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  let dataDiv = document.getElementById("sheet-data");
  let loaderEl = document.getElementById("loader");

  if (dataDiv && loaderEl) {
    loaderEl.className = "loading";

    let data = await fetchGoogleSheetData(sheet_url);
    console.log(data);
    let parsedData = parseCSV(data);

    loaderEl.className = "";
    displayData(parsedData, dataDiv);

    // sortable table
    var options = {
      valueNames: headerClasses,
    };
    new List("sheet-data", options);
  }
});
