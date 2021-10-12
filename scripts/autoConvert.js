const stylesAC = {
    s2pBtn: {
        height: "40px",
        padding: "0 30px",
        borderRadius: "500px",
        marginRight: "3%",
        whiteSpace: "nowrap",
        backgroundImage: "linear-gradient(97.08deg, rgb(7, 30, 87), rgb(0, 52, 141))",
        color: "white",
        fontSize: "20px",
    },
    topBtnsDiv: {
        display: "flex",
        justifyContent: "center"
    },
    converterContainer: {
        top: 0,
        padding: "2%",
        zIndex: 4
    },
    converterBody: {
        marginTop: "2%"
    },
}

//Do they have intro to this section
hasIntro = () => {
    let curSection = document.getElementsByClassName("v-select__selection v-select__selection--comma")
    curSection = curSection[0]
    curSection = curSection.innerText.split(" ")[0] + "s"

    for (let area of sections[curSection].areas) {
        for (let badge of area.badges) {
            if (selectedBadges.includes(badge)) {
                return true
            }
        }
    }
}


//Populate the intro to scouting and section fields
popIntro = (introSection) => {
    var addBtn = document.getElementsByClassName("v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--small")
    if (addBtn.length < 2) { return; }

    //If into to section, make sure a badge has been awarded in that section
    if (!hasIntro()) { return }
    addBtn = addBtn[1];
    addBtn.click();

    setTimeout(() => {
        setAsToday("date")
    }, 20);
}

//Check to see if the user has changed the bagde type
checkBadgeSelectChange = () => {
    var selectors = document.getElementsByClassName("v-select__selection v-select__selection--comma");
    sectionSelector = selectors[0]
    badgeSelector = selectors[1]

    if (badgeSelector.innerText !== lastBadgeSelectValue || sectionSelector.innerText !== lastSelectSection) {//If a new badge type is selected
        lastBadgeSelectValue = badgeSelector.innerText
        lastSelectSection = sectionSelector.innerText

        //Page takes a while to load after changing badge types
        setTimeout(() => {
            populateBadge()
        }, 200);
    }
}

populateBadge = () => {
    switch (lastBadgeSelectValue) {
        case "Introduction To Section":
            popIntro(true)
            break
        case "Introduction To Scouting":
            popIntro(false)
            break
        default:
            break;
    }

}

setAsToday = (fieldName) => {
    var dateField = document.getElementsByName(fieldName);
    dateField = dateField[0];
    dateField.focus()
    setTimeout(() => {
        let todayDate = document.getElementsByClassName("cell today")
        todayDate = todayDate[0]
        todayDate.click()
    }, 20);
}


initAC = () => {
    //Check if the badge type has changed every time the user clicks
    window.onclick = checkBadgeSelectChange

    //Add the auto convert button
    let topRow = document.getElementsByClassName("row mb-4 d-flex justify-space-between no-gutters");
    topRow = topRow[0];

    let newDiv = document.createElement("div");
    let newButton = document.createElement("button");
    newButton.id = "s2pConvertBtn"
    css(newDiv, stylesAC.topBtnsDiv)
    css(newButton, stylesAC.s2pBtn)

    newButton.onclick = openConverter;
    newButton.innerHTML = "S2P Convert";

    newDiv.appendChild(newButton)
    newDiv.appendChild(topRow.children[1])

    topRow.appendChild(newDiv)


    //Inject converter page
    injectConverter()
}


//Don't load anything until you're sure this is the data-import page
setInterval(() => {
    if (window.location.href.includes("data-import")) {
        if (!acLock) {
            initAC()
            acLock = true;
        }
    } else {
        window.onclick = "";
        acLock = false;
    }
}, 3000)

acLock = false;
lastBadgeSelectValue = "Introduction To Scouting";
lastSelectSection = "Cub Scout"