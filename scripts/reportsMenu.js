function createContourReportMenu(replaceMenu){
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

  if (replaceMenu) {
    menuItemTitle.onclick = () => location.href = "https://terrain.scouts.com.au/";
    menuItemTitle.id = "contourReportsMenu";
    menuItemTitle.innerHTML = "Go back";
    mainMenu.replaceChildren(navMenuGroup);
  }
  else {
    menuItemTitle.onclick = contourButtonClicked;
    menuItemTitle.id = "contourReportsMenu";
    menuItemTitle.innerHTML = "Contour Reports";
    mainMenu.appendChild(navMenuGroup);
  }
  console.log("added");
}

function contourButtonClicked(){
  if (document.evaluate(`//div[ancestor::nav[contains(@class, 'NavMenu')] and contains(@class, 'v-list-item--active')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)
    document.evaluate(`//div[ancestor::nav[contains(@class, 'NavMenu')] and contains(@class, 'v-list-item--active')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.classList.remove("v-list-item--active");  
    const breadcrumb =document.evaluate(`//ul[ancestor::header[contains(@class, 'AppBar')] and contains(@class, 'AppBar__breadcrumbs')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
    const breadcrumbLi = document.createElement("li");
    const breadcrumbA = document.createElement("a");
    breadcrumbA.classList = "v-breadcrumbs__item--disabled v-breadcrumbs__item v-breadcrumbs__item--disabled";
    breadcrumbA.text = "CONTOUR REPORTS";
    breadcrumbLi.appendChild(breadcrumbA);
    breadcrumb.replaceChildren(breadcrumbLi);

    const mainArea =document.evaluate(`//div[ancestor::main[contains(@class, 'v-main')] and contains(@class, 'app-container')]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const contentArea = document.createElement("div");
    contentArea.innerHTML = "Hello World<br>This is the future home of some very cool reports coming soon!";
    mainArea.replaceChildren(contentArea);
    createContourReportMenu(true);
}