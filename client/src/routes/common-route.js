/**
    * @author Aasif
    * @description Render UI for Admin,Partners and Client.We pass topnavbar,sidenavbar,html body and all js file which we include
    **/
async function renderUI(selector, topNav, sideNav, body, jsArray) {
    await selector.partial($.COMMON_PATH + "layout/layout.html")
    $('#sidebar').load($.COMMON_PATH + topNav);
    $('#header').load($.COMMON_PATH + sideNav);
    $('#main').load(body);

    await $.getScript($.COMMON_PATH + 'common.js')

    // Get a reference to the last interval
    const intervalId = window.setInterval(function () { }, 3000);
    // Clear any timeout/interval up to that id
    for (let i = 1; i < intervalId; i++) {
        window.clearInterval(i);
    }
    
    for (let i = 0; i < jsArray.length; i++) {
        const element = jsArray[i];
        await $.getScript(element);
    }
}


