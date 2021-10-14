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

