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

function createHeaderRow(data) {
  let rowEl = document.createElement("tr");

  for (let key in data[0]) {
    let headerEl = document.createElement("th");
    headerEl.innerText = key === "Timestamp" ? "Date added" : key;
    rowEl.appendChild(headerEl);
  }

  return rowEl;
}

function createRow(row) {
  let rowEl = document.createElement("tr");

  for (let key in row) {
    let tdEl = document.createElement("td");
    tdEl.innerText = key === "Timestamp" ? row[key].split(" ")[0] : row[key];
    rowEl.appendChild(tdEl);
  }

  return rowEl;
}

function displayData(data, parentElement) {
  let tableEl = document.createElement("table");
  parentElement.appendChild(tableEl);

  tableEl.appendChild(createHeaderRow(data));

  data.forEach((row) => {
    tableEl.appendChild(createRow(row));
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
  }
});
