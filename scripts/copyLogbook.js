


function initWrite() {
  const btn = document.evaluate(`//button[contains(@data-cy, 'ADD_NEW_RECORD')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const pasteBtn = document.createElement("button");
  //css(newButton, styles.generateBtn);
  pasteBtn.classList = "mr-4 float-right v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default";
  pasteBtn.setAttribute("onclick", "saveData(undefined)");
  pasteBtn.id = "writeClipboardBtn";
  pasteBtn.innerHTML = "Paste from Clipboard";
  btn.parentElement.parentElement.appendChild(pasteBtn);

  const importBtn = document.createElement("button");
  //css(newButton, styles.generateBtn);
  importBtn.classList = "mr-4 float-right v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default";
  importBtn.setAttribute("onclick", "uploadBtnClicked()");
  importBtn.id = "writeUploadBtn";
  importBtn.innerHTML = "Import";
  btn.parentElement.parentElement.appendChild(importBtn);
  
  var newScript = document.createElement("script");
  var inlineScript = document.createTextNode(`
  function pickFile(onFilePicked) {
    const inputElemenet = document.createElement('input');
    inputElemenet.style.display = 'none';
    inputElemenet.type = 'file';

    inputElemenet.addEventListener('change', () => {
        if (inputElemenet.files) {
            onFilePicked(inputElemenet.files[0]);
        }
    });

    const teardown = () => {
        document.body.removeEventListener('focus', teardown, true);
        setTimeout(() => {
            document.body.removeChild(inputElemenet);
        }, 1000);
    }
    document.body.addEventListener('focus', teardown, true);

    document.body.appendChild(inputElemenet);
    inputElemenet.click();
  }
  function uploadBtnClicked(){
    pickFile((file) => {
      var reader = new FileReader();
      reader.onload  = function(evt) {
          // file is loaded
          saveData(evt.target.result);
          ready = true;
      };
      reader.readAsText(file);
    })
  }

  async function saveData(text){
    if (!text){
      text = await navigator.clipboard.readText();
      if (!text.startsWith("{") || !JSON.parse(text).achievement_meta) { 
        alert("Please copy a log entry from the view page first.");
        return;
      }
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
    }).then(()=>{location.reload()});
  }
  `);
  newScript.appendChild(inlineScript); 
  document.body.appendChild(newScript);
}

function initRead() {
    const btn = document.evaluate(`//button[ancestor::section[contains(@class, 'ViewRecord__no-print')] and contains(@data-cy, 'PRINT')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    btn.classList.add("mr-4");
    const clipBtn = document.createElement("button");
    //css(newButton, styles.generateBtn);
    clipBtn.classList = "mr-4 float-right v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default";
    clipBtn.setAttribute("onclick", "loadData(false)");
    
    clipBtn.innerHTML = "Copy to Clipboard";
    clipBtn.id = "copyClipboardBtn";
    //Add the generate button to the page
    btn.parentElement.appendChild(clipBtn);

    const exportBtn = document.createElement("button");
    //css(exportBtn, styles.generateBtn);
    exportBtn.classList = "mr-4 float-right v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default";
    exportBtn.setAttribute("onclick", "loadData(true)");
    
    exportBtn.innerHTML = "Export";
    exportBtn.id = "copyClipboardBtn";
    //Add the generate button to the page
    btn.parentElement.appendChild(exportBtn);

    var newScript = document.createElement("script");
    var inlineScript = document.createTextNode(`
    async function loadData(download){
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
        "credentials": "omit"
      });
      const data = JSON.parse(await result.text());
      delete data.id;
      if (download){
          var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
          var downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute("href",     dataStr);
          downloadAnchorNode.setAttribute("download", data.title + "-logbook.json");
          document.body.appendChild(downloadAnchorNode);
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
      }
      else{
        navigator.clipboard.writeText(JSON.stringify(data));
        alert("Event copied");
        }
      
    }
    `);
    newScript.appendChild(inlineScript); 
    document.body.appendChild(newScript);
}


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