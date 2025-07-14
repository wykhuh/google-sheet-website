import {
  getConfig,
  processConfig,
  getGoogleSheetData,
  renderTabularData,
  renderPageIntro,
} from "./dataTable.js";

window.addEventListener("DOMContentLoaded", async () => {
  let loaderEl = document.getElementById("loader");

  if (loaderEl) {
    loaderEl.className = "loading";

    let configData = await getConfig();
    let config = processConfig(configData);
    if (config == undefined) return;

    const sheet_url = `https://docs.google.com/spreadsheets/d/e/${config.sheetId}/pub?output=csv`;
    let allRecords = await getGoogleSheetData(sheet_url);
    // console.log(allRecords[0]);

    loaderEl.className = "";
    renderPageIntro(config);
    renderTabularData(allRecords, config.displayFields);
  }
});
