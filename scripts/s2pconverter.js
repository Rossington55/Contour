
const sections = {
    Joeys: {
        col1: "#bd6428",
        col2: "#f18c20",
        areas: [
            {
                name: "Participation Scheme",
                badges: [
                    "Adventure",
                    "Buddy",
                    "Care & Sharing",
                    "Environment"
                ]
            },
            {
                name: "Major badges",
                badges: [
                    "Promise Challenge"
                ]
            }
        ]
    },
    Cubs: {
        col1: "#f18c20",
        col2: "#fec52d",
        areas: [
            {
                name: "Boomerangs",
                badges: [
                    "Bronze",
                    "Silver",
                    "Gold"
                ]
            },
            {
                name: "Achievement Badges",
                badges: [
                    "1 Animals & Birds",
                    "2 Animals & Birds",
                    "1 Athlete",
                    "2 Athlete",
                    "1 Canoeing",
                    "2 Canoeing",
                    "1 Codes & Signals",
                    "2 Codes & Signals",
                    "1 Cooking",
                    "2 Cooking",
                    "1 Engineer",
                    "2 Engineer",
                    "1 First Aider",
                    "2 First Aider",
                    "1 Flight",
                    "2 Flight",
                    "1 Handcraft",
                    "2 Handcraft",
                    "1 International Culture",
                    "2 International Culture",
                    "1 Literature",
                    "2 Literature",
                    "1 Musician",
                    "2 Musician",
                    "1 Pets",
                    "2 Pets",
                    "1 Sailing",
                    "2 Sailing",
                    "1 Space",
                    "2 Space",
                    "1 Swimmer",
                    "2 Swimmer",
                    "1 Weather",
                    "2 Weather",
                    "1 Art & Design",
                    "2 Art & Design",
                    "1 Bushcraft",
                    "2 Bushcraft",
                    "1 Citizenship",
                    "2 Citizenship",
                    "1 Collector",
                    "2 Collector",
                    "1 Cyclist",
                    "2 Cyclist",
                    "1 Entertainer",
                    "2 Entertainer",
                    "1 Fishing",
                    "2 Fishing",
                    "1 Gardener",
                    "2 Gardener",
                    "1 Handyworker",
                    "2 Handyworker",
                    "1 IT",
                    "2 IT",
                    "1 Masks & Sculpture",
                    "2 Masks & Sculpture",
                    "1 Naturalist",
                    "2 Naturalist",
                    "1 Photography",
                    "2 Photography",
                    "1 Scientist",
                    "2 Scientist",
                    "1 Sports",
                    "2 Sports",
                    "1 Traveller",
                    "2 Traveller",
                    "1 World Friendship",
                    "2 World Friendship",
                ]
            },
            {
                name: "Major Badges",
                badges: [
                    "Grey Wolf"
                ]
            }
        ]
    },
    Scouts: {
        col1: "#289e49",
        col2: "#7dbd42"
    },
    Venturers: {
        col1: "#7a232f",
        col2: "#a42036",
        areas: [
            {
                name: "Venturer Skills",
                badges: [
                    "Venturer Skills"
                ]
            },
            {
                name: "Venturer Award",
                badges: [
                    "VA Unit Management",
                    "VA Vocations",
                    "VA Initiative",
                    "VA Expedition",
                    "VA Outdoor",
                    "VA Ideals",
                    "VA Expression",
                    "VA Lifestyle",
                    "VA Pursuits",
                    "VA Citizenship",
                    "VA Environment",
                    "VA First Aid",
                    "VA Service"
                ]
            },
            {
                name: "Queen Scout",
                badges: [
                    "QS Leadership",
                    "QS Expedition",
                    "QS Outdoor",
                    "QS Ideals",
                    "QS Expression",
                    "QS Lifestyle",
                    "QS Pursuits",
                    "QS Environment",
                    "QS Service"
                ]
            },
            {
                name: "Major Badges",
                badges: [
                    "Venturer Award",
                    "Endeavor Award",
                    "Queen Scout"
                ]
            }
        ]
    },
    Rovers: {
        col1: "#ed1c24",
        col2: "#ec6952"
    }
}

let selectedBadges = []

var selectedSection = "Cubs"

//Im lazy and didn't want to type /images/ every time
loadImg = (name) => {
    return curl(`/images/${name}`)
}

//CHROME URL. Im really lazy and couldnt be bothered writing chrome.runtime every time
curl = (path) => {
    return chrome.runtime.getURL(path)
}

selectBadge = (ev) => {
    ev = ev.target
    if (selectedBadges.includes(ev.id)) {//If badge already selected

        //Unselect the badge
        const i = selectedBadges.indexOf(ev.id)
        selectedBadges.splice(i, 1)
        ev.style.backgroundColor = ""
    } else {

        //Select the badge
        selectedBadges.push(ev.id)
        ev.style.backgroundColor = "#a1a1a1"
    }
}

openConverter = () => {
    let converter = document.getElementById("converter")
    converter.classList.remove("hidden")
    converter.classList.add("inlineTable")
}

closeConverter = () => {

    let converter = document.getElementById("converter")
    converter.classList.add("hidden")
    converter.classList.remove("inlineTable")

    populateBadge()
}

injectConverter = () => {
    //Add the custom stylesheet
    let head = document.getElementsByTagName("head")
    head = head[0]
    let stylesheet = document.createElement("link")
    stylesheet.rel = "stylesheet"
    stylesheet.href = chrome.runtime.getURL("styles/structure.css")
    head.appendChild(stylesheet)

    //Add the converter page to the screen
    let anchor = document.getElementsByClassName("v-main__wrap");//Parent of converter page
    anchor = anchor[0]

    //Init converter container
    let converterContainer = document.createElement("article")
    converterContainer.id = "converter"
    converterContainer.classList.add("card__contour")
    converterContainer.classList.add("hidden")
    converterContainer.style.overflow = "auto"
    css(converterContainer, stylesAC.converterContainer)


    //Section Buttons
    let sectionGroup = document.createElement("section")
    sectionGroup.classList.add("around")
    converterContainer.appendChild(sectionGroup)

    for (section in sections) {

        let sectElement = document.createElement("button")
        sectElement.innerText = section
        sectElement.id = section
        if (selectedSection == section) {//Colour in the selected element
            sectElement.classList.add("b_contained")
        } else {
            sectElement.classList.add("b_outlined")
        }
        sectElement.style.backgroundImage = `linear-gradient(97.08deg,${sections[section].col1},${sections[section].col2})`
        sectElement.onclick = changeSection
        sectionGroup.appendChild(sectElement)
    }


    //Body
    let body = document.createElement("article")
    body.id = "converter_body"
    css(body, stylesAC.converterBody)
    converterContainer.appendChild(body)

    //Close button
    let footer = document.createElement("section")
    let closeBtn = document.createElement("button")
    closeBtn.classList.add("b_contained")
    closeBtn.innerText = "Save & Close"
    closeBtn.onclick = closeConverter

    footer.classList.add("end")
    footer.appendChild(closeBtn)
    converterContainer.append(footer)

    anchor.appendChild(converterContainer)

    populateArea(selectedSection)

}

populateArea = (section) => {
    let body = clearBody()

    //For every area (i.e Venturer Award, Queen Scout)
    for (let area of sections[section].areas) {
        //Add the area name

        createHeader(body, area.name)


        //Add each badge
        let row = null
        for (let i in area.badges) {

            //split badges into rows of 2
            if (i % 2 === 0) {
                row = document.createElement("section")
                row.classList.add("selfCenter")
                row.classList.add("around")
                row.style.width = "50%"
                body.appendChild(row)
            }


            //Badge name
            let badge = document.createElement("button")
            row.appendChild(badge)
            badge.classList.add("hoverable")
            badge.classList.add("b_outlined")
            badge.style.whiteSpace = "nowrap"
            badge.style.width = "230px"
            badge.style.textAlign = "start"
            badge.style.marginTop = "2px"
            if (selectedBadges.includes(area.badges[i])) {
                badge.style.backgroundColor = "#a1a1a1"
            }
            badge.innerText = area.badges[i]
            badge.id = area.badges[i]
            badge.onclick = selectBadge

        }
    }
}



createHeader = (body, text) => {
    let textField = document.createElement("h2")
    textField.innerText = text
    textField.marginTop = "20px"

    body.appendChild(textField)
}

clearBody = () => {
    let body = document.getElementById("converter_body")
    body.innerHTML = ""

    return body
}

changeSection = (ev) => {
    ev = ev.target

    selectedSection = ev.id

    //Change styling for all unselected buttons
    for (section in sections) {
        let sectElement = document.getElementById(section)
        if (section == selectedSection) {

            sectElement.classList.remove("b_outlined")
            sectElement.classList.add("b_contained")
        } else {

            sectElement.classList.add("b_outlined");
            sectElement.classList.remove("b_contained");
        }
    }

    populateArea(ev.id)
}