


function initWrite() {
  const btn = document.evaluate(`//button[contains(@data-cy, 'ADD_NEW_RECORD')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const newButton = document.createElement("button");
  //css(newButton, styles.generateBtn);
  newButton.classList = "float-right v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default";
  newButton.setAttribute("onclick", "saveData()");
  newButton.id = "writeClipboardBtn";
  newButton.innerHTML = "Paste from Clipboard";

  //Add the generate button to the page
  btn.parentElement.parentElement.appendChild(newButton);
  var newScript = document.createElement("script");
  var inlineScript = document.createTextNode(`
  async function saveData(){
    const text = await navigator.clipboard.readText();
    if (!text.startsWith("{") || !JSON.parse(text).achievement_meta) { 
      alert("Please copy a log entry from the view page first.");
      return;
    }
    await fetch('https://achievements.terrain.scouts.com.au/members/' + window.$nuxt.$store._vm["user/getCurrentProfile"].member.id + '/logbook', {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "authorization": window.$nuxt.$store._vm["auth/getIdToken"],
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "'Chromium';v='94', 'Microsoft Edge';v='94', ';Not A Brand';v='99'",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://terrain.scouts.com.au/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": text,
      "method": "POST",
      "mode": "cors"
    });
    location.reload();
  }
  `);
  newScript.appendChild(inlineScript); 
  document.body.appendChild(newScript);
  console.log(window.$nuxt);
}

function initRead() {
    const btn = document.evaluate(`//button[ancestor::section[contains(@class, 'ViewRecord__no-print')] and contains(@data-cy, 'PRINT')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const newButton = document.createElement("button");
    //css(newButton, styles.generateBtn);
    newButton.classList = "float-right v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default";
    newButton.setAttribute("onclick", "loadData()");
    
    newButton.innerHTML = "Copy to Clipboard";
    newButton.id = "copyClipboardBtn";
    //Add the generate button to the page
    btn.parentElement.appendChild(newButton);

    var newScript = document.createElement("script");
    var inlineScript = document.createTextNode(`
    async function loadData(){
      const result = await fetch("https://achievements.terrain.scouts.com.au/members/" + window.$nuxt.$store._vm["user/getCurrentProfile"].member.id + "/logbook/" + window.$nuxt.$store._vm["logbook/getRecordId"], {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "authorization": window.$nuxt.$store._vm["auth/getIdToken"],
          "sec-ch-ua": "'Chromium';v='94', 'Microsoft Edge';v='94', ';Not A Brand';v='99'",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "Windows",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        },
        "referrer": "https://terrain.scouts.com.au/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });
      const data = JSON.parse(await result.text());
      delete data.id;
      navigator.clipboard.writeText(JSON.stringify(data));
    }
    `);
    newScript.appendChild(inlineScript); 
    document.body.appendChild(newScript);
    console.log(window.$nuxt);
}

if (window.location.href.includes("logbook")) {
  setInterval(() => {
      if (
        document.evaluate(`//button[ancestor::section[contains(@class, 'ViewRecord__no-print')] and contains(@data-cy, 'PRINT')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        && !document.getElementById("copyClipboardBtn")
        ) {
        initRead();
      } else
      if (document.evaluate(`//button[contains(@data-cy, 'ADD_NEW_RECORD')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        && !document.getElementById("writeClipboardBtn")) {
        initWrite();
        }
  }, 2000);
}
