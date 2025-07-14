let headerClasses = [];
let allRecords = [];
let appEl;
let searchEl;
let allRecordsEl;
let showAllEl;
let oneRecordEl;
let showMore;
let displayFields = [];

function getConfig() {
  return new Promise((resolve, reject) => {
    Papa.parse("/config.csv", {
      header: false,
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

function processConfig(configData) {
  let sheetId;
  let displayFields = [];
  let title = "";
  let summary = "";

  configData.forEach((row) => {
    switch (row[0]) {
      case "sheetId":
        sheetId = row[1].trim();
        break;
      case "displayFields":
        displayFields = row[1].split(",").map((field) => field.trim());
        break;
      case "title":
        title = row[1].trim();
      case "summary":
        summary = row[1].trim();
      default:
        break;
    }
  });

  if (sheetId == undefined) {
    renderError("sheetId must be present in config.csv");
    return;
  }

  return { displayFields, sheetId, title, summary };
}

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
    if (showMore && !displayFields.includes(key)) continue;

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

  if (showMore) {
    let headerEl = document.createElement("th");
    rowEl.appendChild(headerEl);
  }

  return rowEl;
}

function createRow(row, rowIndex) {
  let rowEl = document.createElement("tr");

  for (let key in row) {
    if (showMore && !displayFields.includes(key)) continue;

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

  if (showMore) {
    let tdEl = document.createElement("td");
    tdEl.innerText = "show";
    tdEl.className = "show-record";
    tdEl.onclick = () => displayOneRecord(rowIndex);
    rowEl.appendChild(tdEl);
  }

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

function displayAllRecords(data) {
  if (allRecordsEl) allRecordsEl.classList.remove("hidden");
  if (searchEl) searchEl.classList.remove("hidden");
  if (showAllEl) showAllEl.remove();
  if (oneRecordEl) oneRecordEl.remove();

  if (allRecordsEl == undefined) {
    createAllRecordsElement(data);
  }
}

function addSortableTable() {
  var options = {
    valueNames: headerClasses,
  };
  new List("data-container", options);
}

function renderTabularData(data, configDisplayFields) {
  showMore = configDisplayFields.length > 0;
  displayFields = configDisplayFields;

  allRecords = data;
  searchEl = document.getElementById("search-form");
  if (searchEl == undefined) return;

  appEl = document.getElementById("data-container");
  if (appEl == undefined) return;

  displayAllRecords(allRecords);

  addSortableTable();
}

function renderError(error) {
  appEl = document.getElementById("data-container");
  if (appEl == undefined) return;
  appEl.innerText = error;
  appEl.classList.add("error");
}

function renderPageIntro(configData) {
  if (configData.title) {
    let titleEl = document.querySelector(".title");
    if (titleEl) {
      titleEl.textContent = configData.title;
    }
  }
  if (configData.summary) {
    let summaryEl = document.querySelector(".summary");
    if (summaryEl) {
      summaryEl.innerText = configData.summary;
    }
  }
}

export {
  getGoogleSheetData,
  getConfig,
  processConfig,
  renderTabularData,
  renderPageIntro,
};
