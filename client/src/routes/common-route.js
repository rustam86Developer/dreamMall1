/**
    * @author Aasif
    * @description Render UI for Admin,Partners and Client.We pass topnavbar,sidenavbar,html body and all js file which we include
    **/
 async function renderUI(selector, topNav, sideNav, body, jsArray) {
    await selector.partial($.COMMON_PATH + "layout/layout.html?v=" + $.VERSION)
    $('#sidebar').load($.COMMON_PATH + topNav);
    $('#header').load($.COMMON_PATH + sideNav);
    $('#main').load(body);
    await $.getScript($.COMMON_PATH + 'user-management/user-management-helper.js?v=' + $.VERSION);
    await $.getScript($.COMMON_PATH + 'common.js?v=' + $.VERSION)
    for (let i = 0; i < jsArray.length; i++) {
        const element = jsArray[i];
        await $.getScript(element);
    }
}


