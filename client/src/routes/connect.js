// Access app instance
const Connect = Sammy.apps.body;

Connect.get('/error', function() {
    this.partial($.COMMON_PATH + 'dash/list.html');
});

Connect.notFound = function() {
    this.runRoute('get', "/error");
}

Connect.get('/', async function() {
    // this.partial(
    //     $.CONNECT_PATH + 'dash/list.html');
    // this.partial(
    //     $.CONNECT_PATH + 'dash/list.js');
        await renderUI(
            this,
            "layout/side-navigation/client-side-nav.html",
            "layout/top-navigation/client-top-nav.html",
            $.CONNECT_PATH + 'dash/list.html', [$.CONNECT_PATH + 'dash/list.js']
        );
});

Connect.get('/gotoplay', async function() {
    await renderUI(
        this,
        "layout/side-navigation/client-side-nav.html",
        "layout/top-navigation/client-top-nav.html",
        $.CONNECT_PATH + 'dash/playing.html', [$.CONNECT_PATH + 'dash/playing.js']
    );
});

Connect.get('/enrollment', async function() {
    await this.partial($.COMMON_PATH + "enrollment/enroll.html?v=" + $.VERSION)
    // await $.getScript($.COMMON_PATH + "enrollment/enroll-conditions.js?v=" + $.VERSION);
    await $.getScript($.COMMON_PATH + "enrollment/enroll.js?v=" + $.VERSION);
});