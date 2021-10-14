function exportiCal(){
  const dateString = document.evaluate(`//div[ancestor::div[contains(@class, 'row ViewActivity__question no-gutters')] and .='Date']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentElement.nextElementSibling.firstElementChild.innerText;
  const time = document.evaluate(`//div[ancestor::div[contains(@class, 'row ViewActivity__question no-gutters')] and .='Time']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentElement.nextElementSibling.firstElementChild.innerText;
  const location = document.evaluate(`//div[ancestor::div[contains(@class, 'row ViewActivity__question no-gutters')] and .='Location']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentElement.nextElementSibling.firstElementChild.innerText;
  const title =  document.getElementsByClassName("ViewActivity__title")[0].innerText;
  const what = document.evaluate(`//div[ancestor::div[contains(@class, 'row ViewActivity__question no-gutters')] and .='What is this activity about?']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentElement.nextElementSibling.firstElementChild.innerText;
  const why = document.evaluate(`//div[ancestor::div[contains(@class, 'row ViewActivity__question no-gutters')] and .='Why this activity?']`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentElement.nextElementSibling.firstElementChild.innerText;
  var icsMSG = `BEGIN:VCALENDAR
BEGIN:VEVENT
URL:
DTSTART:${new Date(dateString.split(" to ")[0].split("/").reverse().join("-") + " " + time.split(" to ")[0]).toISOString().replace(/[.:-]/g,"").substring(0,15) + "Z"}
DTEND:${new Date(dateString.split(" to ")[1].split("/").reverse().join("-") + " " + time.split(" to ")[1]).toISOString().replace(/[.:-]/g,"").substring(0,15) + "Z"}
SUMMARY:${title}
DESCRIPTION:${what + " "+ why}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
console.log(icsMSG);
  var element = document.createElement('a');
    element.setAttribute('href', 'data:text/calendar;charset=utf8,' + escape(icsMSG));
    element.setAttribute('download', title + ".ics");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function initProgrammingExportBtn() {
  const btn = document.evaluate(`//button[ancestor::div[contains(@class, 'ViewPlannedActivity__actions')] and contains(@data-cy, 'EXPORT')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const newButton = document.createElement("button");
  //css(newButton, styles.generateBtn);
  newButton.classList = "mb-2 mr-4 v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--small";
  newButton.onclick = exportiCal;
  newButton.innerHTML = "Save to Calendar (iCal)";
  newButton.id = "exportiCalBtn";
  //Add the generate button to the page
  btn.parentElement.appendChild(newButton);
  document.evaluate(`//button[contains(@data-cy, 'PRINT')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.classList.add("mr-4");
}

// setInterval(() => {
//     if (
//       document.evaluate(`//button[ancestor::div[contains(@class, 'ViewPlannedActivity__actions')] and contains(@data-cy, 'EXPORT')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
//       && !document.getElementById("exportiCalBtn")
//       ) {
//         initExportBtn();
//     } 
// }, 2000);
