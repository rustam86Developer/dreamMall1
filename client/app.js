$(document).ready(function() {
    try{
    Sammy('body', async function(App) {

        // await $.getScript('src/components/global.js')
        await $.getScript('config.js')
        await $.getScript('src/components/helper/constant.js')

        const routes = [
            'src/routes/common-route.js',
            // 'src/routes/common.js',
            'src/routes/connect.js',
        ];

        await Promise.all(routes.map(route => $.getScriptCached(route)));

        $('#appLoader').hide();
        App.run();
    });

    $.getScriptCached = function(url, callback) {
        return $.ajax({
            url: url,
            dataType: "script",
            cache: true
        }).done(callback);
    };}catch(err){
        console.log("error>>>>>>>>>>>>>>>>>>>>",err);
    }
});