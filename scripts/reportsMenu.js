function contourMenu(){
  //Menu items in contour page:
  createContourReportMenuItem(true, contourHomePage, "Home", "home"); //first one should be true to clear other menu items
  createContourReportMenuItem(false, testReport, "Test Report", "test"); //example report with table and chart
  createContourReportMenuItem(false, () => location.href = "https://terrain.scouts.com.au/", "Go back", "back");

  //load home page
  contourHomePage();
}



function createContourReportMenuItem(replaceMenu, func, menuText, menuId){

  //add libraries
  var dataTablesScript = document.createElement('script');
  dataTablesScript.type = 'text/javascript';
  dataTablesScript.src = 'https://cdn.datatables.net/v/dt/jq-3.6.0/dt-1.11.3/datatables.min.js';
  dataTablesScript.charset = 'utf8';
  document.head.appendChild(dataTablesScript);

  var dataTablesStyleSheet = document.createElement('link');
  dataTablesStyleSheet.rel = 'stylesheet';  
  dataTablesStyleSheet.type = 'text/css';
  dataTablesStyleSheet.href = 'https://cdn.datatables.net/v/dt/jq-3.6.0/dt-1.11.3/datatables.min.css';    
  document.head.appendChild(dataTablesStyleSheet);

  const mainMenu = document.evaluate(`//div[ancestor::nav[contains(@class, 'NavMenu')] and contains(@class, 'NavMenu__menu-container')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  
  const navMenuGroup = document.createElement("div");
  navMenuGroup.classList = "NavMenu__menu-group";

  const menuListGroup = document.createElement("div");
  menuListGroup.classList = "v-list-group NavMenu__list-group v-list-group--no-action";
  navMenuGroup.appendChild(menuListGroup);

  const menuGroupHeader = document.createElement("div");
  menuGroupHeader.classList = "v-list-group__header v-list-item v-list-item--link theme--light";
  menuGroupHeader.setAttribute("role","button")
  menuListGroup.appendChild(menuGroupHeader);

  const menuLink = document.createElement("a");
  menuLink.classList = "NavMenu__item v-list-item v-list-item--link theme--light";
  menuGroupHeader.appendChild(menuLink);

  const menuItemContent = document.createElement("div");
  menuItemContent.classList = "v-list-item__content";
  menuLink.appendChild(menuItemContent);

  const menuItemTitle = document.createElement("div");
  menuItemTitle.classList = "v-list-item__title";
  menuItemTitle.id = "contourReportsMenu";
  menuItemContent.appendChild(menuItemTitle);

  menuItemTitle.onclick = func;
  menuItemTitle.id = "contourReportsMenu-" + menuId;
  menuItemTitle.innerHTML = menuText;

  if (replaceMenu) mainMenu.replaceChildren(navMenuGroup);
  else mainMenu.appendChild(navMenuGroup);
}

function contourHomePage(){
  contourLoadPage("CONTOUR REPORTS",`
  <h1>Welcome to the contour reports area</h1><br>
  Please note that these reports run inside the terrain website and do not transmit information to any third party services.<br>
  These reports only show information that you have access to with your account. No additional information can be gathered that you don't already have access to by clicking around Terrain.<br>
  The purpose of these reports is simiply to assist in providing a snapshot of your units information in a single screen.<br>
  <br>
  Please select the report you wish to run from the left hand side bar. To go back to the rest of Terrain click "Go Back".<br>
  <br>
  Thanks for using Contour!
  `);
}


function contourLoadPage(breadcrumbText, content){
  if (document.evaluate(`//div[ancestor::nav[contains(@class, 'NavMenu')] and contains(@class, 'v-list-item--active')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
    document.evaluate(`//div[ancestor::nav[contains(@class, 'NavMenu')] and contains(@class, 'v-list-item--active')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.classList.remove("v-list-item--active");  
    const breadcrumb =document.evaluate(`//ul[ancestor::header[contains(@class, 'AppBar')] and contains(@class, 'AppBar__breadcrumbs')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    const breadcrumbLi = document.createElement("li");
    const breadcrumbA = document.createElement("a");
    breadcrumbA.classList = "v-breadcrumbs__item--disabled v-breadcrumbs__item v-breadcrumbs__item--disabled";
    breadcrumbA.text = breadcrumbText;
    breadcrumbLi.appendChild(breadcrumbA);
    breadcrumb.replaceChildren(breadcrumbLi);

    const mainArea =document.evaluate(`//div[ancestor::main[contains(@class, 'v-main')] and contains(@class, 'app-container')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const contentArea = document.createElement("div");
    contentArea.innerHTML = content;
    mainArea.replaceChildren(contentArea);
}