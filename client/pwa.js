

const registerSWAndCheckForUpdates = new Promise(function (resolve, reject) {
    if ('serviceWorker' in navigator && ['localhost', '127'].indexOf(location.hostname) === -1) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                reg.onupdatefound = () => {
                    const installingWorker = reg.installing;
                    installingWorker.onstatechange = () => {
                        switch (installingWorker.state) {
                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                    resolve(reg.installing);
                                } else {
                                    resolve(false);
                                }
                                break;
                        }
                    };
                };
            })
            .catch(err => console.error('[SW ERROR]', err));
    }
});

/**
 * Trigger the SW Registration and check for available updates.
 */
registerSWAndCheckForUpdates
    .then(updates => {
        if (updates) {
            updates.postMessage({ action: 'SKIP_WAITING' });
            window.location.reload()
        }
    });