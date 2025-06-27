import { sheet_url } from "./config.js";

let headerClasses = [];
let allRecords = [];
let appEl;
let searchEl;
let allRecordsEl;
let showAllEl;
let oneRecordEl;

function getGoogleSheetData(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      header: true,
      download: true,
      complete(results) {
        resolve(results.data);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

function createAllRecordsElement(data) {
  allRecordsEl = document.createElement("table");
  appEl.appendChild(allRecordsEl);

  let theadEl = document.createElement("thead");
  allRecordsEl.appendChild(theadEl);

  theadEl.appendChild(createHeaderRow(data));

  let tbodyEl = document.createElement("tbody");
  tbodyEl.className = "list";
  allRecordsEl.appendChild(tbodyEl);

  data.forEach((row, i) => {
    tbodyEl.appendChild(createRow(row, i));
  });
}

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
  let headerEl = document.createElement("th");
  rowEl.appendChild(headerEl);

  return rowEl;
}

function createRow(row, rowIndex) {
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

  let tdEl = document.createElement("td");
  tdEl.innerText = "show";
  tdEl.className = "show-record";
  tdEl.onclick = () => displayOneRecord(rowIndex);
  rowEl.appendChild(tdEl);

  return rowEl;
}

function createShowAllButton() {
  showAllEl = document.createElement("button");
  showAllEl.className = "show-all";
  showAllEl.innerText = "Show all records";

  showAllEl.className = "show-all";
  showAllEl.onclick = () => displayAllRecords();

  appEl.appendChild(showAllEl);
}

function createOneRecordElement(row) {
  oneRecordEl = document.createElement("table");
  appEl.appendChild(oneRecordEl);

  for (let key in row) {
    let trEl = document.createElement("tr");

    let thEl = document.createElement("th");

    if (key === "Timestamp") {
      thEl.innerText = "Date added";
    } else {
      thEl.innerText = key;
    }

    trEl.appendChild(thEl);

    let tdEl = document.createElement("td");

    if (key === "Timestamp") {
      tdEl.innerText = row[key].split(" ")[0];
    } else {
      tdEl.innerText = row[key];
    }

    trEl.appendChild(tdEl);

    oneRecordEl.appendChild(trEl);
  }
}

function displayOneRecord(rowIndex) {
  if (allRecordsEl) allRecordsEl.classList.add("hidden");
  if (searchEl) searchEl.classList.add("hidden");
  if (showAllEl) showAllEl.remove();
  if (oneRecordEl) oneRecordEl.remove();

  createShowAllButton();
  createOneRecordElement(allRecords[rowIndex]);
}

function displayAllRecords() {
  if (allRecordsEl) allRecordsEl.classList.remove("hidden");
  if (searchEl) searchEl.classList.remove("hidden");
  if (showAllEl) showAllEl.remove();
  if (oneRecordEl) oneRecordEl.remove();
}

window.addEventListener("DOMContentLoaded", async () => {
  appEl = document.getElementById("data-container");
  searchEl = document.getElementById("search-form");

  let loaderEl = document.getElementById("loader");

  if (appEl && loaderEl) {
    loaderEl.className = "loading";

    allRecords = await getGoogleSheetData(sheet_url);
    console.log(allRecords[0]);

    loaderEl.className = "";
    displayAllRecords();
    createAllRecordsElement(allRecords);

    // sortable table
    var options = {
      valueNames: headerClasses,
    };
    new List("data-container", options);
  }
});
