import { sheet_url } from "./config.js";
import { getGoogleSheetData, init } from "./dataTable.js";

window.addEventListener("DOMContentLoaded", async () => {
  let loaderEl = document.getElementById("loader");

  if (loaderEl) {
    loaderEl.className = "loading";

    let allRecords = await getGoogleSheetData(sheet_url);
    console.log(allRecords[0]);

    loaderEl.className = "";
    init(allRecords);
  }
});
