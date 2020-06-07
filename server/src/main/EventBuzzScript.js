const fs = require("fs");
const readline = require("readline"); //very important
const { google, gap } = require("googleapis"); //very important
var parseMessage = require("gmail-api-parse-message"); //very important
const Path = require("path"); //very important
const Axios = require("axios"); //very important
const { Builder, By, Key, util, until } = require("selenium-webdriver");
const LogControllerFile = require("./LogController");
const LogController = LogControllerFile.LogController;
const logger = LogController.getInstance("system");
const ReportController = require("./ReportController");
const moment = require("moment");
const NotificationController = require("./NotificationController");
require("chromedriver");

const reportPath = "MoviesReport.csv";
let deletedEmail = {};

let json_ans = class {
  constructor(enforcer) {
    throw new Error("Cannot construct singleton");
  }
  static subscribers = [];
  static value = null;
  static subscribe(fn) {
    if (!this.subscribers.includes(fn)) {
      console.log(fn);
      this.subscribers.push(fn);
    }
  }
  static dateCompare(d1, d2) {
    if (d1.getYear() !== d2.getYear()) return false;
    if (d1.getMonth() !== d2.getMonth()) return false;
    if (d1.getDate() === d2.getDate()) {
      console.log("d1= ", d1, " in day is  of ", d1.getDate());
      console.log("d2= ", d2, " in day is  of ", d2.getDate());
    }
    return d1.getDate() === d2.getDate();
  }
  static async fire(value) {
    let addTheTest = false;
    let output = [];
    this.value = value;
    console.log("fire!");
    for (let i = 0; i < 100; i++) {
      let event = value[i];
      let date = moment(event.date, "DD-MM-YYYY HH:mm").toDate();
      if (this.dateCompare(date, new Date())) {
        output.push(event);
        if (dateCompare(date, new Date(2018, 5, 12))) {
          console.log("add the test movie report");
          addTheTest = true;
        }
      }
    }
    // console.log(output);
    let result = await ReportController.createMovieReport(output);
    if (typeof result === "string") this.errorHandler(result);
  }
  //TODO
  static errorHandler(msg) {
    console.log(msg);
    logger.writeToLog("error", "EventBuzzScript", "errorHandler", msg);
    NotificationController.notifyEventBuzzError(
      "There was a problem creating movies report\n" + msg
    );
  }
};

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

const TOKEN_PATH = "token.json";

function downlowdReportMainFlow() {
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    authorize(JSON.parse(content), getRecentEmail);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.labels.list(
    {
      userId: "me",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const labels = res.data.labels;
      if (labels.length) {
        console.log("Labels:");
        labels.forEach((label) => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log("No labels found.");
      }
    }
  );
}

function getRecentEmail(auth) {
  deletedEmail = {};
  getRecentEmailreq(auth, 0);
}

/**
 * Get the recent email from your Gmail account
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getRecentEmailreq(auth, i) {
  try {
    //if all 15 attempts fail stop trying
    if (i > 15) {
      //add to log file
      console.log(
        "The download of the movie report fail - all the 15 tries fail"
      );
      json_ans.errorHandler(
        "The download of the movie report fail - all the 15 tries fail"
      );
      return;
    }
    const gmail = google.gmail({ version: "v1", auth });
    // Only get the recent email - 'maxResults' parameter
    gmail.users.messages.list(
      { auth: auth, userId: "me", maxResults: 1 },
      function(err, response) {
        if (err) {
          console.log("The API returned an error: " + err);
          return;
        }
        //if Mailbox is empty then wait 1 minute and try again
        if (response.data.resultSizeEstimate == 0) {
          //add to log file
          setTimeout(() => {
            getRecentEmailreq(auth, i + 1);
          }, 60000);
          return;
        }
        // Get the message id which we will need to retreive tha actual message next.

        var message_id = response["data"]["messages"][0]["id"];
        // Retreive the actual message using the message id
        gmail.users.messages.get(
          { auth: auth, userId: "me", id: message_id },
          function(err, response) {
            if (err) {
              console.log("The API returned an error: " + err);
            } else {
              const emailDate = new Date(
                response.data.payload.headers[
                  response.data.payload.headers.length - 14
                ].value
              );
              emailDate.setHours(0, 0, 0, 0);
              const curDate = new Date();
              curDate.setHours(0, 0, 0, 0);
              const fromMail =
                response.data.payload.headers[
                  response.data.payload.headers.length - 9
                ].value;
              //if the mail is not relevant or not from today then delete him
              if (
                !fromMail.includes("info@eventbuzz.co.il") ||
                dateCompare(emailDate, curDate) != 0
              ) {
                deletedEmail[message_id] = message_id;
                setTimeout(() => {
                  getRecentEmailreq(auth, i + 1);
                }, 60000);
                return;
              }
              console.log(
                "The download of the movie report succeed. Begin with msg proccessor"
              );
              msgProcessor(response.data);
            }
          }
        );
      }
    );
  } catch {
    console.log("The download of the movie report fail");
    json_ans.errorHandler("The download of the movie report fail");
  }
}

function dateCompare(d1, d2) {
  if (d1.getYear() != d2.getYear()) return d1.getYear() - d2.getYear();
  if (d1.getMonth() != d2.getMonth()) return d1.getMonth() - d2.getMonth();
  return d1.getDate() - d2.getDate();
}

function msgProcessor(data) {
  try {
    var parsedMessage = parseMessage(data);
    let downloadUrl = extractHref(parsedMessage.textHtml);
    download(downloadUrl).then(
      setTimeout(() => {
        csvToJson();
      }, 90000)
    );
  } catch {
    json_ans.errorHandler("The msg processor fail");
    return;
  }
}

function extractHref(text) {
  let href = text.substr(text.indexOf("http"));
  let link = href.substr(0, href.indexOf('"'));
  return link;
}

function hasContent(values) {
  if (values.length > 0) {
    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        return true;
      }
    }
  }
  return false;
}

function buildJsonResult(headers, currentLine) {
  let jsonObject = {};
  for (let j = 0; j < headers.length; j++) {
    let propertyName = trimPropertyName(headers[j]);

    let value = currentLine[j];
    if (this.printValueFormatByType) {
      value = getValueFormatByType(currentLine[j]);
    }
    jsonObject[propertyName] = value;
  }
  return jsonObject;
}

function trimPropertyName(value) {
  return value.replace(/\s/g, "");
}

function getValueFormatByType(value) {
  let isNumber = !isNaN(value);
  if (isNumber) {
    return Number(value);
  }
  return String(value);
}

function csvToJson() {
  if (!reportPath) {
    json_ans.errorHandler("inputFileName is not defined!!!");
  }
  let parsedCsv = fs.readFileSync("server/src/main/" + reportPath).toString();
  let lines = parsedCsv.split("\n");
  let fieldDelimiter = ",";
  let headers = [
    "name",
    "date",
    "location",
    "numberOfTicketsAssigned",
    "numberOfTicketsSales",
    "totalSalesIncomes",
    "totalTicketsReturns",
    "totalFees",
    "totalRevenuesWithoutCash",
    "totalCashIncomes",
  ];

  let jsonResult = [];
  for (let i = 1; i < lines.length; i++) {
    let currentLine = lines[i].split(fieldDelimiter);
    if (hasContent(currentLine)) {
      jsonResult.push(buildJsonResult(headers, currentLine));
    }
  }
  console.log("The json is created. Fire!");
  json_ans.fire(jsonResult);
  //assignment to const var, maybe intend to create instance of json_ans
  //json_ans = { date: new Date(), value: jsonResult };
  return jsonResult;
}

async function download(url) {
  const path = Path.resolve(__dirname, reportPath);
  const writer = fs.createWriteStream(path);
  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function eventbuzzScript() {
  return new Promise(async function() {
    try {
      let driver = await new Builder().forBrowser("chrome").build();
      driver
        .manage()
        .window()
        .maximize();
      await driver.get("https://eventbuzz.co.il/backoffice/");
      await driver
        .findElement(By.id("email"))
        .sendKeys("diklakat93@gmail.com", Key.RETURN);
      await driver.findElement(By.id("password")).sendKeys("נגטיב", Key.RETURN);
      await driver
        .findElement(By.xpath("/html/body/div[1]/form/div[3]/input"))
        .sendKeys(Key.ENTER);

      var personalEaraBtn = await driver.wait(
        until.elementLocated(
          By.xpath("/html/body/div[1]/div[1]/div/div[1]/div[2]/img"),
          2000
        )
      );
      await personalEaraBtn.click();
      var reportsBtn = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="menu-main-div"]/main/div/div[2]/a[2]'),
          2000
        )
      );
      await reportsBtn.click();
      var send = await driver.wait(
        until.elementLocated(
          By.xpath('//*[@id="event_export_form"]/form/div[1]/input'),
          2000
        )
      );
      await driver
        .findElement(By.id("email"))
        .sendKeys("negativesystem123@gmail.com", Key.RETURN);
      let promises = await driver
        .findElement(By.xpath('//*[@id="event_export_form"]/form/div[1]/input'))
        .click();
      await driver.sleep(5000);
      driver.close();
      console.log(
        "The EventBuzzScript - end the integration with the eventbuzz Web. Begin with the download step"
      );
      setTimeout(() => {
        downlowdReportMainFlow();
      }, 120000);
    } catch (error) {
      console.log("The script fail to integrate to eventbuzz web " + error);
      json_ans.errorHandler("The script fail to integrate to eventbuzz web");
    }
  });
}

async function main() {
  await eventbuzzScript();
}

module.exports = {
  main,
  eventbuzzScript,
  downlowdReportMainFlow,
  json_ans,
  csvToJson: csvToJson,
};
