let loc = "";

//different ways Terrain seems to use for page changes plus a interval fallback for the programming page which I am yet to work out.
window.onclick = checkLocation;
window.onhashchange = checkLocation;
window.onpopstate = checkLocation;
window.onload = checkLocation;
setInterval(checkLocation,100);
startContourChecks();

function checkLocation(){
  //check if page has changed
  if (location.href != loc) {
    loc = location.href;
    startContourChecks();
  }
}

 function startContourChecks(){
  console.debug("Starting Contour");
  //page selector
  switch (document.location.pathname) {
    case "/logbook/view-record":
      if (checkPage(`//button[ancestor::section[contains(@class, 'ViewRecord__no-print')] and contains(@data-cy, 'PRINT')]`, "copyClipboardBtn",20))
        initLogbookRead();
      break;
    case "/logbook":
      if (checkPage(`//button[contains(@data-cy, 'ADD_NEW_RECORD')]`, "writeClipboardBtn",20))
        initLogbookWrite();
    break;
    case "/programming/view-planned-activity":
      if (checkPage(`//button[ancestor::div[contains(@class, 'ViewPlannedActivity__actions')] and contains(@data-cy, 'EXPORT')]`, "exportiCalBtn",20)) 
        initProgrammingExportBtn();
      break;
    case "/group-life/unit":
      if (checkPage(`//td[ancestor::div[contains(@class, 'MembersTable')] and contains(@class, 'text-start')]`, "contourBadgeReportBtn",200))
        initBadgeReview();
      break;
  }
  //all pages
  if (checkPage(`//div[ancestor::nav[contains(@class, 'NavMenu')] and contains(@class, 'NavMenu__menu-container')]`, "contourReportsMenu-contourMenu",20))
  createContourReportMenuItem(false, contourMenu, "Contour Menu", "contourMenu");
}

function checkPage(query,id,delay){ //query = xpath query as string, id = id of an element contour creates to see if it has run, delay is ms delay before retry.
  //evaluate if page is loaded
  if(document.evaluate(query, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
    //check if Contour element needs to be added and return result
    return !document.getElementById(id);
  //try again in 20ms and return false
  setTimeout(()=>{ startContourChecks() },delay);
  return false;
}


// set some constants for reports etc
const LastAuthUser = localStorage.getItem('CognitoIdentityServiceProvider.6v98tbc09aqfvh52fml3usas3c.LastAuthUser');
let currentProfile = {};

fetch("https://members.terrain.scouts.com.au/profiles", {
  method: 'GET', mode: 'cors', cache: 'no-cache', credentials: 'same-origin', 
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("CognitoIdentityServiceProvider.6v98tbc09aqfvh52fml3usas3c."+LastAuthUser+".idToken")
  },
  redirect: 'error', referrerPolicy: 'no-referrer', 
})
.then(response => response.json())
.then(data => {
  currentProfile = data;
})
.catch((error) => {
  currentProfile = {'Error:': error};
});

$("head").append(`<style type="text/css" id="contour"> 
.contour-btn { 
  background: linear-gradient(97.08deg,#004C00,#197419) !important;
}
.contour-menu { 
  background: #004C00 !important;
  border-bottom-color: #197419 !important;
  border-top-color: #197419 !important;
}

.contour-menu:hover {
  background-color: #197419 !important;
}

</style>}`);
