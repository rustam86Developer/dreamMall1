// Access app instance
const Connect = Sammy.apps.body;
console.log("111111111");
Connect.get('/error', function() {
console.log("2222222222222");

    this.partial($.COMMON_PATH + 'dash/list.html');
});

Connect.notFound = function() {
console.log("333333333333");

    this.runRoute('get', "/error");
}

Connect.get('/', function() {
console.log("444444444444");

    this.partial(
        $.CONNECT_PATH + 'dash/list.html');
});

Connect.get('/gotoplay', async function() {
console.log("555555555");
        await renderUI(
            this,
            "layout/side-navigation/client-side-nav.html",
            "layout/top-navigation/client-top-nav.html",
            $.CONNECT_PATH + 'dash/playing.html'
        );
});