# Creating website with Google Forms

Demo of using data from Google Form to populate an website.

[Google Form](https://docs.google.com/forms/d/e/1FAIpQLSd1dCRdCy0rvsOnlYnxv7rAbTDbMm0JMnr9Y6A4R2OSXhQi7w/viewform?usp=header). [Website](https://wykhuh.github.io/google-forms-demo/)

The app uses vanilla javascript and PapaParse.

## Instructions

1. Create a form using Google Form.

2. Make the form data publically accessible.
    1. Go to Google Form admin section, and select "Responses".
    2. Click "Link to Sheets"
    3. Select "Create a new spreadsheet"
    4. Click "View in Sheets"
    5. In Google Sheets select "File" > "Share" > "Publish to web"
    6. Select "Entire Document" and "Comma-separated values (.csv)"
    7. Click "Publish"

3. Connect website to Google Sheets.
    1. Replace the url (https://docs.google.com/spreadsheets...) in config.js with the "Publish to Web" url.

The website will display all the records in the Google Sheets as a table.
