const levelColours = [
    "#003c1c",
    "#106236",
    "#00897b",
    "#00aac1",
    "#00838f",
    "#2548a8",
    "#16347f",
    "#071e57",
    "#001d3e",
];

const badges = {
    OAS: [
        //ALPINE
        { name: "Alpine", minLevel: 0, maxLevel: 3, next: 1 }, //0
        { name: "Cross Country Skiing", minLevel: 4, maxLevel: 9, prev: 0 }, //1
        { name: "Snow Camping & Hiking", minLevel: 4, maxLevel: 9, prev: 0 }, //2
        { name: "Downhill Skiing", minLevel: 4, maxLevel: 9, prev: 0 }, //3
        { name: "Snowboarding", minLevel: 4, maxLevel: 9, prev: 0 }, //4

        //AQUATICS
        { name: "Aquatics", minLevel: 0, maxLevel: 3, next: 6 }, //5
        { name: "Life Saving", minLevel: 4, maxLevel: 6, next: 7, prev: 5 }, //6
        { name: "Swift Water Rescue", minLevel: 7, maxLevel: 9, prev: 6 }, //7
        { name: "Snorkelling", minLevel: 4, maxLevel: 6, next: 9, prev: 5 }, //8
        { name: "Scuba", minLevel: 7, maxLevel: 9, prev: 8 }, //9
        { name: "Surfing", minLevel: 4, maxLevel: 9, prev: 5 }, //10

        //BOATING
        { name: "Boating", minLevel: 0, maxLevel: 3, next: 12 }, //11
        { name: "Sailing", minLevel: 4, maxLevel: 9, prev: 11 }, //12
        { name: "Windsurfing", minLevel: 4, maxLevel: 9, prev: 11 }, //13

        //BUSHCRAFT
        { name: "Bushcraft", minLevel: 0, maxLevel: 3, next: 15 }, //14
        { name: "Pioneering", minLevel: 4, maxLevel: 9, prev: 14 }, //15
        { name: "Survival Skills", minLevel: 4, maxLevel: 9, prev: 14 }, //16

        //BUSHWALKING
        { name: "Bushwalking", minLevel: 0, maxLevel: 9 }, //17

        //CAMPING
        { name: "Camping", minLevel: 0, maxLevel: 9 }, //18

        //CYCLING
        { name: "Cycling", minLevel: 0, maxLevel: 3, next: 20 }, //19
        { name: "Cycle Touring", minLevel: 4, maxLevel: 9, ppev: 19 }, //20
        { name: "Mountain Biking", minLevel: 4, maxLevel: 9, prev: 19 }, //21

        //PADDLING
        { name: "Paddling", minLevel: 0, maxLevel: 3, next: 23 }, //22
        { name: "Canoeing", minLevel: 4, maxLevel: 9, prev: 22 }, //23
        { name: "White Water Rafting", minLevel: 7, maxLevel: 9, prev: 23 }, //24
        { name: "Kayaking", minLevel: 4, maxLevel: 6, next: 26, prev: 22 }, //25
        { name: "White Water Kayaking", minLevel: 7, maxLevel: 9, prev: 25 }, //26
        { name: "Sea Kayaking", minLevel: 4, maxLevel: 9, prev: 22 }, //27

        //VERTICAL
        { name: "Vertical", minLevel: 0, maxLevel: 3, next: 29 }, //28
        { name: "Abseiling", minLevel: 4, maxLevel: 9, prev: 28 }, //29
        { name: "Canyoning", minLevel: 4, maxLevel: 9, prev: 28 }, //30
        { name: "Caving", minLevel: 4, maxLevel: 9, prev: 28 }, //31
        { name: "Climbing", minLevel: 4, maxLevel: 9, prev: 28 }, //32
    ],
    SIA: [
        "Adventure & Sport",
        "Arts & Literature",
        "Creating a better world",
        "Environment",
        "Growth & Development",
        "STEM & Innovation",
    ]
};

const SPREADSHEET_ID = "1pv8JbzVp4X8pvSx16dJqRimUAbEfwX-jUtG-6do3m_Y";
const SPREADSHEET_TAB_NAME = "Sheet1";


const sendEmail = (to, subject, body) => new Promise((res, rej) => {
    Email.send({
        SecureToken: "0f14d61a-160d-46c0-9466-8d9017af5105",
        To: to,
        From: "15thscoutbadges@gmail.com",
        Subject: subject,
        Body: body
    }).then(response => {
        res();
    }).catch(e => {
        rej(e);
    });

});


function validateSheet() {
    let sheet = document.getElementById("sheet");
    let sheetStatus = document.getElementById("sheetStatus");

    if (sheet.value === "") {
        sheetStatus.classList.remove("fa-check-circle");
        sheetStatus.classList.remove("fa-exclamation-circle");
        return;
    }

    const url = `https://sheetdb.io/api/v1/${encodeURIComponent(sheet.value)}/count`;

    fetch(url, { method: "get" }).then(response => {
        if (response.ok) {
            sheetStatus.classList.add("fa-check-circle");
            sheetStatus.classList.remove("fa-exclamation-circle");
            sheetStatus.style.color = "#38d161";
        } else {
            sheetStatus.classList.add("fa-exclamation-circle");
            sheetStatus.classList.remove("fa-check-circle");
            sheetStatus.style.color = "#cf2411";
        }

    });

}

const addToSheet = (sheet, data) => new Promise((res, rej) => {
    const findDuplicate = new Promise((resolve) => {
        const url = `https://sheetdb.io/api/v1/${encodeURIComponent(sheet)}/search?Name=${encodeURIComponent(data.name)}&Badge=${encodeURIComponent(data.badge)}&Level=${encodeURIComponent(data.level)}`;
        fetch(url, { method: "get" }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(newData => {
            resolve(newData);
        }).catch(e => {
            rej("Could not access the sheet. Try double checking the sheet ID");
        });
    });

    findDuplicate.then(response => {
        console.log(response.length);
        if (response.length > 0) { rej("You have already requested this badge"); return; }
        const postUrl = `https://sheetdb.io/api/v1/${sheet}`;
        const date = new Date();
        const body = JSON.stringify({
            data: [{
                Name: data.name,
                Type: data.type,
                Badge: data.badge,
                Level: data.level,
                "Requested Date": `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
                "Awarded?": "No",
            }]
        });

        fetch(postUrl, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        }).then(response => {
            if (response.ok) {
                res("No duplicate");
            }
        }).catch(e => {
            rej("Could not add data to sheet");
        });
    })

});

function addUnitToSheet(unit, withSheet) {
    url = `https://sheetdb.io/api/v1/75d6vrunwd978`;

    var body = {
        "Unit": unit,
        "With Sheet": withSheet ? 1 : 0,
        "Timestamp": new Date(),
    };
    var method = "Post";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}

function formatData(data) {
    const localSendEmail = () => {
        sendEmail(email, subject, body).then(response => {
            //Email was sent!
            submit.classList.remove("hidden");
            spinner.classList.add("hidden");
            errMsg.innerText = "Badge request sent!";
            errMsg.style.color = "green";
            errMsg.classList.remove("hidden");
            localStorage.setItem("email", email);
            confetti.start();
            setTimeout(() => {
                confetti.stop();
            }, 750)
        }).catch(e => {
            //Error sending email
            errMsg.innerText = "Error sending email";
            errMsg.style.color = "red";
            errMsg.classList.remove("hidden");
            submit.classList.remove("hidden");
            spinner.classList.add("hidden");
        });
    }

    const sheetStatus = document.getElementById("sheetStatus");
    let submit = document.getElementById("submit");
    let spinner = document.getElementById("spinner");
    let errMsg = document.getElementById("errMsg");
    let subject = "";
    let body = "";
    submit.classList.add("hidden");
    spinner.classList.remove("hidden");
    errMsg.innerText = "";
    data.preventDefault();
    data = new FormData(data.target);

    let name = data.get('name');
    let type = data.get("type");
    let badge = data.get("badge");
    let level = data.get("level");
    let email = data.get("email");
    let sheet = data.get("sheet");
    const unit = data.get("unitName");

    subject = `${type} badge request`;
    body = `<b>${name}</b> is requesting a${type !== "Milestone"? "n" : ""} <b>${type}</b> `;

    switch (type) {
        case "Milestone":
            body += `<b>${level}</b>`;
            badge = "Milestone";
            break;
        case "SIA":
            body += `<i>${badge}</i>`;
            level = "1";
            break;
        case "OAS":
            body += `<i>${badge} level ${level}</i>`;
            break;
        default:
            break;
    }

    body += " badge.";

    data = { name: name, type: type, badge: badge, level: level }
    if (sheet !== "") {

        if (sheetStatus.classList.contains("fa-exclamation-circle")) {
            //Invalid
            errMsg.innerText = `Error: Invalid google sheet`;
            errMsg.style.color = "red";
            errMsg.classList.remove("hidden");
            submit.classList.remove("hidden");
            spinner.classList.add("hidden");
        } else {
            //Send to google sheet
            addToSheet(sheet, data).then(res => {
                addUnitToSheet(unit, true);
                localSendEmail();
            }).catch(e => {
                errMsg.innerText = `Error: ${e}`;
                errMsg.style.color = "red";
                errMsg.classList.remove("hidden");
                submit.classList.remove("hidden");
                spinner.classList.add("hidden");
            });

        }



    } else {
        //Only send to email
        localSendEmail();
        addUnitToSheet(unit, false);
    }



    return false;
}

function populateOAS() {
    var badge = document.getElementById("badge");
    var level = document.getElementById("level").value;

    clearSelect();
    let cur = {};
    for (let i in badges.OAS) {
        cur = badges.OAS[i];
        if (level >= cur.minLevel && level <= cur.maxLevel) {
            let newOption = document.createElement("option");
            newOption.value = cur.name;
            newOption.innerText = cur.name;
            newOption.id = cur.name;

            badge.appendChild(newOption);
        }
    }
}


function populateBadges(ev) {
    const type = ev.target.value;
    var levelGrandparent = document.getElementById("levelGrandparent");
    var badgeContainer = document.getElementById("badgeContainer");
    var badge = document.getElementById("badge");
    var level = document.getElementById("level");
    let nextLevel = document.getElementById("nextLevel");

    //-----------SIA-------------
    //Hide or show levels
    if (type === "SIA") {
        levelGrandparent.classList.add("hidden");

        //Add all the SIA badges
        clearSelect();
        for (let i in badges.SIA) {
            let newOption = document.createElement("option");
            newOption.value = badges.SIA[i];
            newOption.innerText = badges.SIA[i];

            badge.appendChild(newOption);
        }
    } else {
        levelGrandparent.classList.remove("hidden");
    }

    //-----------MILESTONES-------------
    //Hide or show badge
    if (type === "Milestone") {
        badgeContainer.classList.add("hidden");
        //Reset level back to 3 if it is too great
        if (level.value > 3) {
            nextLevel.classList.add("disabled");
            setLevel(3);
        }
    } else {
        if (type === "OAS") {
            if (level.value < 9) {
                nextLevel.classList.remove("disabled");
            }
        }
        badgeContainer.classList.remove("hidden");
    }

    //-----------OAS-------------
    if (type === "OAS") {
        populateOAS();
    }
}


function changeLevel(ev) {
    if (ev.target.classList.contains("disabled")) { return; }

    const dir = ev.target.id;
    const type = document.getElementById("badgeType");
    const badge = document.getElementById("badge");
    let prevLevel = document.getElementById("prevLevel");
    let nextLevel = document.getElementById("nextLevel");
    var level = document.getElementById("level");


    if (dir === "prevLevel") {
        setLevel(parseInt(level.value) - 1);
        nextLevel.classList.remove("disabled");
        if (level.value <= 1) {
            prevLevel.classList.add("disabled");
        }
    } else {
        setLevel(parseInt(level.value) + 1);
        prevLevel.classList.remove("disabled");
        if (level.value >= 9 || (type.value === "Milestone" && level.value >= 3)) {
            nextLevel.classList.add("disabled");
        }
    }

    if (type.value === "OAS") {
        const oas = getOASobj();
        populateOAS();

        if (oas.minLevel > level.value) {
            badge.value = badges.OAS[oas.prev].name;
        } else if (oas.maxLevel < level.value) {
            badge.value = badges.OAS[oas.next].name;
        } else {
            badge.value = oas.name;
        }
    }
}

function setLevel(newLevel) {
    var levelContainer = document.getElementById("levelContainer")
    var level = document.getElementById("level");
    var levelShown = document.getElementById("levelShown");
    level.value = newLevel;
    levelShown.innerText = newLevel;
    levelContainer.style.backgroundColor = levelColours[newLevel - 1];
}


function getOASobj() {
    const badge = document.getElementById("badge");
    for (let i in badges.OAS) {
        if (badges.OAS[i].name == badge.value) {
            return badges.OAS[i];
        }
    }
}

function clearSelect() {
    let select = document.getElementById("badge");
    select.innerHTML = "";
}

function openUnit() {
    let container = document.getElementById("unitContainer");

    container.classList.remove("hidden");
    setTimeout(() => {
        container.style.maxHeight = "500px";
    }, 1)
}

function openSheetInfo() {
    let container = document.getElementById("sheetContainer");

    container.classList.remove("hidden");
    setTimeout(() => {
        container.style.maxHeight = "522px";
    }, 1)
}


function closeSheetInfo() {
    let container = document.getElementById("sheetContainer");

    container.classList.add("hidden");
    container.style.maxHeight = "0";
}

function saveUnit() {
    const unitName = document.getElementById("unitName");
    const email = document.getElementById("email");
    const sheet = document.getElementById("sheet");
    const unit = document.getElementById("unit");

    localStorage.setItem("unitName", unitName.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("sheet", sheet.value);
    unit.value = unitName.value;

    closeUnit();
}

function closeUnit() {
    let container = document.getElementById("unitContainer");

    container.classList.add("hidden");
    container.style.maxHeight = "0";
}

function init() {
    const form = document.getElementById("badgeForm");
    const type = document.getElementById("badgeType");
    const prevLevel = document.getElementById("prevLevel");
    const nextLevel = document.getElementById("nextLevel");
    const unitEdit = document.getElementById("unitEdit");
    const sheetInfo = document.getElementById("sheetDbInfo");
    const sheetClose = document.getElementById("sheetClose");
    const unitSave = document.getElementById("unitSave");
    const unitCancel = document.getElementById("unitCancel");
    let sheet = document.getElementById("sheet");
    let email = document.getElementById("email");

    prevLevel.onclick = changeLevel;
    nextLevel.onclick = changeLevel;
    unitEdit.onclick = openUnit;
    sheetInfo.onclick = openSheetInfo;
    sheetClose.onclick = closeSheetInfo;
    unitSave.onclick = saveUnit;
    unitCancel.onclick = closeUnit;
    type.onchange = populateBadges;
    form.onsubmit = formatData;

    const prevEmail = localStorage.getItem("email");
    const prevSheet = localStorage.getItem("sheet");
    const prevUnit = localStorage.getItem("unitName");

    if (prevUnit) {
        let unit = document.getElementById("unit");
        let unitName = document.getElementById("unitName");

        unit.value = prevUnit;
        unitName.value = prevUnit;
    }

    if (prevEmail) {
        email.value = prevEmail;
    }

    if (prevSheet) {
        sheet.value = prevSheet;
        validateSheet();
    }


    sheet.onchange = validateSheet;
}


window.onload = init;