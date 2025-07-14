import {
  processConfig,
  renderTabularData,
  renderPageIntro,
  getAndParseCSV,
} from "./dataTable.js";

window.addEventListener("DOMContentLoaded", async () => {
  let loaderEl = document.getElementById("loader");

  if (loaderEl) {
    loaderEl.className = "loading";

    let configData = await getAndParseCSV("./config.csv", false, true);
    let config = processConfig(configData);
    if (config == undefined) return;

    const sheet_url = `https://docs.google.com/spreadsheets/d/e/${config.sheetId}/pub?output=csv`;
    let allRecords = await getAndParseCSV(sheet_url, true, true);
    allRecords.forEach((record) => {
      record["Date Added"] = record["Timestamp"];
      delete record["Timestamp"];
    });
    // console.log(allRecords[0]);

    loaderEl.className = "";
    renderPageIntro(config);
    renderTabularData(allRecords, config);
  }
});
