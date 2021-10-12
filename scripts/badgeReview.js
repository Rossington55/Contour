const styles = {
    generateBtn: {
        height: "40px",
        padding: "0 30px",
        borderRadius: "500px",
        marginTop: "15px",
        marginRight: "3%",
        whiteSpace: "nowrap",
        backgroundImage: "linear-gradient(97.08deg, rgb(7, 30, 87), rgb(0, 52, 141))",
        color: "white",
        fontSize: "20px",
    },
    body: {
        backgroundColor: "rgb(250,250,250)",
        display: "flex",
        flexDirection: "column",
    },
    section: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flexStart",
    },
    table: {
        border: "1px solid #bbbbbb",
        backgroundColor: "white",
        borderCollapse: "collapse",
        borderRadius: "4px",
        marginBottom: "45px",
    },
    tr: {
        height: "28px",
        borderTop: "1px solid rgb(229,233,236)",
        borderBottom: "1px solid rgb(229,233,236)",
    },
    tn: {
        fontSize: "20px",
        fontFamily: "arial",
        fontWeight: "700",
        width: "200px",
        padding: "10px"
    },
    th: {
        fontSize: "14px",
        fontFamily: "arial",
        fontWeight: "700",
        paddingRight: "20px"
    },
    tdc: {
        fontFamily: "arial",
        fontSize: "12px",
        padding: "10px",
        textAlign: "center",
    },
    td: {
        fontFamily: "arial",
        fontSize: "12px",
        padding: "10px"
    },
    totName: {
        fontFamily: "arial",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "right",
        paddingRight: "5px",
    },
    totCell: {
        textAlign: "center",
        fontFamily: "arial",
        fontSize: "12px",
        fontWeight: "bold",
        color: "white"
    }
};

//Array of {name, level} for each OAS
const defaultOASData = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
]
let oasData = JSON.parse(JSON.stringify(defaultOASData));

/*Array of {name, curLevel, milestones} for each Milestone
milestones are represented a 3 bits, each bit representing the respective milestone

e.g milestone: 0b101 means they completed 1 and 3
*/
let milestoneData = [];
let milestoneDetailData = [];

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
const oasColours = [
    "rgb(32,44,100,0.4)", //Bushcraft
    "rgb(32,44,100,0.4)", //Bushwalking
    "rgb(32,44,100,0.4)", //Camping
    "rgb(0,104,71,0.4)", //Alpine
    "rgb(31,152,213,0.4)", //Aquatics
    "rgb(31,152,213,0.4)", //Boating
    "rgb(0,104,71,0.4)", //Cycling
    "rgb(31,152,213,0.4)", //Paddling
    "rgb(0,104,71,0.4)", //Vertical
];
const milestoneColours = [
    "#ed1c24",
    "#071e57",
    "#2f9e49"
];
const milestoneBins = [
    0b100,
    0b010,
    0b001,
]
const oasNames = [
    "Bushwalking",
    "Bushcraft",
    "Camping",
    "Alpine",
    "Aquatics",
    "Boating",
    "Cycling",
    "Paddling",
    "Vertical"
];



//Download html to device
function download(filename, file) {

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(file.outerHTML));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function css(element, style) {
    for (const property in style)
        element.style[property] = style[property];
}

//Get the total amount of people currently in this level
function getLevelTotal(stream, level) {
    let sum = 0;
    for (let i in stream) {
        if (Number(stream[i].level) === level) { //If this persons level is the level we are looking for
            sum++;
        }
    }

    return sum;
}

//Get total amount of people with this milestone level badge
function getMilestoneTotal(level) {
    let sum = 0;
    milestoneData.map(youth => {
        if ((youth.milestones & milestoneBins[level]) === milestoneBins[level]) {
            sum++;
        };
    })

    return sum;
}

//Put together the html
function createPage() {
    //Create a new html page
    const newPage = document.implementation.createHTMLDocument("Test1").body;
    css(newPage, styles.body);

    //Milestones & SIA
    const milestoneSIAsection = document.createElement("section");
    css(milestoneSIAsection, styles.section);
    milestoneSIAsection.style.justifyContent = "space-between";
    newPage.appendChild(milestoneSIAsection);


    //Summary
    const makeSummary = () => {
        //Summary table
        const summTable = document.createElement("table");
        css(summTable, styles.table);
        summTable.style.marginRight = "2%";
        summTable.style.width = "100%";
        milestoneSIAsection.appendChild(summTable);

        //Header
        const header = summTable.insertRow();
        let title = header.insertCell();
        css(title, styles.tn);
        title.colSpan = 10;
        title.innerText = "All Required Badges";
        title.style.fontSize = "25px";
        title.style.textAlign = "center";
        title.style.height = "50px";

        //Levels
        const levelsHeader = summTable.insertRow();
        levelsHeader.style.height = "20px"
        levelsHeader.insertCell();
        for (let i = 1; i < 10; i++) {
            let level = levelsHeader.insertCell();
            css(level, styles.th);
            level.style.textAlign = "center";
            level.innerText = `Stage ${i}`;
        }

        /*Body
            Milestones
            OAS
        */
        //Milestone summary
        let row = summTable.insertRow();
        css(row, styles.tr);
        let name = row.insertCell();
        css(name, styles.td);
        name.innerText = "Milestone";
        name.style.fontSize = "14px";
        for (let i = 0; i < 3; i++) {
            let sum = row.insertCell();
            css(sum, styles.tdc);
            sum.innerText = getMilestoneTotal(i);
            sum.style.fontSize = "14px";
        }

        //OAS Summary
        for (let i in oasNames) {
            row = summTable.insertRow();
            css(row, styles.tr);
            name = row.insertCell();
            css(name, styles.td);
            name.innerText = oasNames[i];
            name.style.fontSize = "14px";

            for (let j = 0; j < 9; j++) {
                let sum = row.insertCell();
                css(sum, styles.tdc);

                sum.style.fontSize = "14px";
                sum.innerText = getLevelTotal(oasData[i], j + 1);
            }
        }



    }
    makeSummary();

    //Milestones
    const makeMilestones = () => {
        //Milestone Table
        const mileTable = document.createElement("table");
        css(mileTable, styles.table);
        mileTable.style.backgroundColor = "rgb(0,0,0,0.2)";
        milestoneSIAsection.appendChild(mileTable);

        //Header
        const header = mileTable.insertRow();
        let title = header.insertCell();
        css(title, styles.tn);
        title.innerText = "Milestones"
        title.style.textAlign = "center";

        //Level Headers
        for (let i = 1; i < 4; i++) {
            let th = header.insertCell();
            css(th, styles.th);
            th.innerText = `Milestone ${i}`;
            th.style.textAlign = "center"
        }

        let lastLvl = 4;

        //Body
        for (let i in milestoneData) {
            const youth = milestoneData[i];

            //If this youth is a level lower, the next row is a category title
            if (youth.curLevel < lastLvl) {
                const nextLvlRow = mileTable.insertRow();
                let nextLvl = nextLvlRow.insertCell();
                css(nextLvl, styles.th);
                lastLvl = youth.curLevel;
                nextLvl.innerText = `Currently Level ${lastLvl}`;
                nextLvl.style.height = "50px";
                nextLvl.style.textAlign = "center";
            }

            const row = mileTable.insertRow();
            css(row, styles.tr);


            //Name
            let name = row.insertCell();
            css(name, styles.td);
            name.innerText = youth.name;

            for (let j = 0; j < 3; j++) {
                let level = row.insertCell();
                if ((youth.milestones & milestoneBins[j]) === milestoneBins[j]) {
                    level.style.backgroundColor = milestoneColours[j];

                }
            }
        }

        //Total summary
        let tots = mileTable.insertRow();
        css(tots, styles.tr);
        let totName = tots.insertCell();
        css(totName, styles.totName);
        totName.innerText = "Total"

        //Total values
        for (let i = 0; i < 3; i++) {

            let total = tots.insertCell();
            css(total, styles.totCell);
            total.style.backgroundColor = milestoneColours[i];
            total.innerText = getMilestoneTotal(i);
        }
    }
    makeMilestones();


    // const makeSIA = () => {

    // }
    // makeSIA();





    //OAS
    for (let i in oasData) {
        let table = document.createElement("table");
        css(table, styles.table);
        table.style.backgroundColor = oasColours[i];

        /*Create Table header START*/
        let header = table.insertRow();
        let tblName = header.insertCell();
        tblName.innerText = oasNames[i]; //Set the name of the table in the top left corner
        css(tblName, styles.tn);

        //For every level
        for (let j = 1; j < 10; j++) {
            let cell = header.insertCell();
            cell.innerText = `Stage ${j}`;
            css(cell, styles.th);

        }
        /*Table header END*/

        //For every person
        for (let j in oasData[i]) {
            let row = table.insertRow();
            css(row, styles.tr);

            //Add their name as the first column
            let name = row.insertCell();
            name.innerText = oasData[i][j].name;
            css(name, styles.td);

            //Span their level
            let currentLevel = row.insertCell();
            currentLevel.style.backgroundColor = levelColours[oasData[i][j].level - 1];
            currentLevel.colSpan = oasData[i][j].level;

            //Inverse span their level
            let inverseLevel = row.insertCell();
            inverseLevel.colSpan = 9 - oasData[i][j].level;

        }

        //Total summary
        let tots = table.insertRow();
        css(tots, styles.tr);
        let totName = tots.insertCell();
        css(totName, styles.totName);
        totName.innerText = "Total"
        for (let j = 1; j < 10; j++) {
            let total = tots.insertCell();
            css(total, styles.totCell);
            total.style.backgroundColor = levelColours[j - 1];
            total.innerText = getLevelTotal(oasData[i], j);
        }


        newPage.appendChild(table);
    }

    //Milestone Detail

    const msdTable = document.createElement("table");
    css(msdTable, styles.table);
    msdTable.style.backgroundColor = "rgb(0,0,0,0.2)";
    msdTable.style.width = "100%";

    let header = msdTable.insertRow();
    let tblName = header.insertCell();
    tblName.innerText = "Milestones Remaining"; //Set the name of the table in the top left corner
    css(tblName, styles.tn);
    ["Participate","Assist","Lead","Community","Outdoors", "Creative", "Personal Growth"].forEach((msType)=>{
        let cell = header.insertCell();
        cell.innerText = msType;
        css(cell, styles.th);
        cell.style.textAlign = "center";
    })

    milestoneDetailData.forEach((i) => {
        let row = msdTable.insertRow();
        css(row, styles.tr);
        let cell = row.insertCell();
        css(cell, styles.td);
        cell.innerText = i["name"];

        ["participate","assist","lead","community","outdoors", "creative", "personalgrowth"].forEach((msType)=>{
            let cell = row.insertCell();
            css(cell, styles.td);
            cell.style.textAlign = "center";
            const msData = i[msType].split("/");
            cell.innerText = parseInt(msData[1].trim()) - parseInt(msData[0].trim());
        })
    });
    // Maximum Row
    let row = msdTable.insertRow();
    css(row, styles.tr);
    let cell = row.insertCell();
    css(cell, styles.th);
    cell.innerText = "Maximum";
    ["participate","assist","lead","community","outdoors", "creative", "personalgrowth"].forEach((msType)=>{
        let cell = row.insertCell();
        css(cell, styles.td);
        cell.style.textAlign = "center";
        cell.style.fontWeight = "bold";
        const values = milestoneDetailData.map((ms) => {
            const msData = ms[msType].split("/");
            return (parseInt(msData[1].trim()) - parseInt(msData[0].trim()));
        });
        cell.innerText = Math.max(...values).toString();
    })

    newPage.appendChild(msdTable);

    //download and clean up
    download("Unit badge report", newPage);
    document.getElementsByClassName("v-card__actions")[1].children[1].click(); //close tab
    document.getElementsByClassName("v-card__actions")[0].children[1].click(); //close tab
}



//The parent scrape function
async function ScrapePage() {

    oasData = JSON.parse(JSON.stringify(defaultOASData));
    milestoneData = [];

    //Go through the current table
    const analyzePage = async() => {
        const tabs = document.getElementsByClassName("MemberMetricsTable__showModal");
        const rows = document.getElementsByTagName("tr");
        let levels = [];
        let name = "";

        //OAS and SIA(Awaiting Data)
        //For every tab button in the table
        for (let i in tabs) {

            const waitForCheck = async() => {

                //OAS
                if (tabs[i].innerText === "View Progress") {
                    //Open the dialog
                    tabs[i].click();

                    //Wait for the dialog to open
                    await new Promise(res => {
                        //Inside dialog

                        setTimeout(() => {
                            const oldLevels = document.getElementsByClassName("col col-6");
                            name = document.getElementsByClassName("ConfirmationDialog__subtitle");

                            //Set each level to the text of the state (e.g. "Not Started" or "Stage 5 (Pioneering)")

                            /*
                            Old Levels is an array of:

                            <div class="col col6">
                                <div class="branchname or something idk">
                                    <div class="col"> Stage 3 </div>
                                </div>
                            </div>
                            */

                            //For each stream
                            for (let i = 0; i < oldLevels.length; i++) {
                                if (oldLevels[i].children.length > 1) { //If there are multiple branches in the stream
                                    let highest = 0;
                                    for (let j = 0; j < oldLevels[i].children.length; j++) { //For every branch in this stream
                                        const child = oldLevels[i].children[j].children[0]; //Let the child = the lowest div with text

                                        //If this level (e.g. Stage 5, hence text[6] = "5") is greater than the previously found highest level
                                        if (child.innerText[6] > oldLevels[i].children[highest].children[0].innerText[6]) {
                                            highest = j;
                                        }
                                    }

                                    //Set the current level to whatever is the highest value in this stream
                                    levels[i] = oldLevels[i].children[highest].children[0].innerText;
                                } else {

                                    levels[i] = oldLevels[i].children[0].children[0].innerText;
                                }
                            }

                            //For each OAS Stream
                            for (let i in oasData) {

                                //If this youth isn't level 0
                                if (levels[i] !== "Not started") {

                                    //Add their name and level to the OAS Stream

                                    oasData[i].push({
                                        name: name[name.length - 1].innerText,
                                        level: levels[i][6]
                                    })
                                }
                            }

                            res();
                        }, 50);
                    })
                }


            };

            await waitForCheck();
            i++;
        }

        //Milestones
        for (let i = 1; i < rows.length; i++) { //For each person
            const name = rows[i].children[0].innerText;
            let levels = 0b000;
            const milestones = rows[i].children[5].children[0];
            //Get the current level
            const curLevel = rows[i].children[4].children[0].innerText[10];

            //Get the previous levels
            for (let j = 0; j < milestones.children.length; j++) {
                const milestone = milestones.children[j];
                if (milestone.innerText.includes("Milestone 1")) {
                    levels |= 0b100;
                } else if (milestones.innerText.includes("Milestone 2")) {
                    levels |= 0b010;
                } else if (milestones.innerText.includes("Milestone 3")) {
                    levels |= 0b001;
                }
            }
            milestoneData.push({ name: name, curLevel: curLevel, milestones: levels });
            const waitForMileStoneCheck = async() => {
                rows[i].children[4].children[0].click();
                await new Promise(res => {
                    setTimeout(() => {
                        milestoneDetailData.push({
                            name: name, 
                            participate: document.getElementsByClassName("MilestoneDialog__strong-row")[0].children[1].innerText,
                            community: document.getElementsByClassName("row MilestoneDialog__normal-row")[0].children[2].innerText,
                            outdoors: document.getElementsByClassName("row MilestoneDialog__normal-row")[1].children[2].innerText,
                            creative: document.getElementsByClassName("row MilestoneDialog__normal-row")[2].children[2].innerText,
                            personalgrowth: document.getElementsByClassName("row MilestoneDialog__normal-row")[3].children[2].innerText,
                            lead: document.getElementsByClassName("MilestoneDialog__strong-row")[2].children[1].innerText,
                            assist: document.getElementsByClassName("MilestoneDialog__strong-row")[1].children[1].innerText,
                            });
                         res();
                    }, 50);
                });
            }
            await waitForMileStoneCheck();
        }



    };

    let rightBtn = true;
    let leftBtn = true;

    let repeatR = true,
        repeatL = true;

    //Go to start page
    do {

        leftBtn = document.getElementsByClassName("v-icon notranslate mdi mdi-chevron-left theme--light");
        await new Promise(res => {
            setTimeout(() => {
                //If the left button isnt disabled, go to the prev table page
                if (!leftBtn[leftBtn.length - 1].parentElement.parentElement.disabled) {
                    leftBtn[leftBtn.length - 1].click();
                } else {
                    repeatL = false;
                }
                res();
            }, 50)
        })

    } while (repeatL);

    await new Promise(res => {

        setTimeout(async() => {

            //For each table page
            do {
                //Go through the current table page
                await analyzePage();

                rightBtn = document.getElementsByClassName("v-icon notranslate mdi mdi-chevron-right theme--light");

                //If the right button isnt disabled, go to the next table page
                if (!rightBtn[0].parentElement.parentElement.disabled) {
                    rightBtn[0].click();
                } else {
                    repeatR = false;
                }

            } while (repeatR);

            //Sort each youth by current level on top
            milestoneData = milestoneData.sort((a, b) => { if (b.curLevel > a.curLevel) { return 1 } else { return -1 } });

            //Sort youth in each stream, highest level on top
            oasData = oasData.map(stream => stream.sort((a, b) => { if (b.level > a.level) { return 1 } else { return -1 } }));
            res();
        }, 100);
    });
    createPage();
}

function init() {
    let parent = document.getElementsByClassName("v-data-table v-data-table--has-bottom theme--light");
    parent = parent[0];

    let newButton = document.createElement("button");
    css(newButton, styles.generateBtn);

    newButton.onclick = ScrapePage;
    newButton.innerHTML = "Generate Report";

    //Add the generate button to the page
    parent.appendChild(newButton);
}

function initTable() {
    let table = document.getElementsByTagName("table");
    const waitForTable = setInterval(() => {
        if (table[0].children[2].children.length > 1) {
            init();
            clearInterval(waitForTable);
        }
    }, 500);

}

setInterval(() => {
    if (window.location.href.includes("group-life/unit")) {
        let table = document.getElementsByTagName("table");
        if (!lock && table.length > 0) {
            lock = true;
            initTable();
        }
    } else {
        lock = false;
    }
}, 3000)

let lock = false;
