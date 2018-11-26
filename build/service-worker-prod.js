(function () {
    'use strict';

    // 查看你的地址是否支持pwa
    var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
    );

    window.addEventListener('load', function () {
        if ('serviceWorker' in navigator &&
            (window.location.protocol === 'https:' || isLocalhost)) {
            navigator.serviceWorker.register('/wapa/service-worker.js')
                .then(function (registration) {
                    // 更新时发现文件变更从service-work中移除
                    registration.onupdatefound = function () {
                        // updatefound is also fired the very first time the SW is installed,
                        // and there's no need to prompt for a reload at that point.
                        // So check here to see if the page is already controlled,
                        // i.e. whether there's an existing service worker.
                        if (navigator.serviceWorker.controller) {
                            // The updatefound event implies that registration.installing is set
                            var installingWorker = registration.installing;

                            installingWorker.onstatechange = function () {
                                switch (installingWorker.state) {
                                    case 'installed':
                                        // 如果资源已经注册，结束
                                        break;

                                    case 'redundant':
                                        throw new Error('The installing ' +
                                            'service worker became redundant.');

                                    default:
                                        // Ignore
                                }
                            };
                        }
                    };
                }).catch(function (e) {
                    console.error('Error during service worker registration:', e);
                });
        }
    });
})();
