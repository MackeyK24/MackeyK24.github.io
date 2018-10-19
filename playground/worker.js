var versionStamp = '3bc2696e-5416-4894-874f-e13b43694082';
var installFiles = ['./', './index.html', './favicon.ico', './manifest.json', './scripts/CanvasTools.js', './scripts/playcanvas-ammo.js', './scripts/playcanvas-anim.js', './scripts/playcanvas-gltf.js', './scripts/playcanvas-stick.js', './scripts/playcanvas-tools.js', './scripts/playcanvas-webvr.js', './scripts/playcanvas.js', './scene/PlayCanvasToolkit.js', './scene/TestScene.bin', './scene/TestScene.gltf', './scene/assets/Country_env.dds', './scene/assets/Country_negx.png', './scene/assets/Country_negy.png', './scene/assets/Country_negz.png', './scene/assets/Country_posx.png', './scene/assets/Country_posy.png', './scene/assets/Country_posz.png', './scene/assets/TestScene_Lightmap-0_comp_light.png'];
// ..
// Install Service Worker File System
// ..
self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(versionStamp).then(function(cache) {
            console.log('Installing cache: ' + versionStamp);
            var cachePromises = installFiles.map(function(urlToPrefetch) {
                var url = new URL(urlToPrefetch, location.href);
                url.search += (url.search ? '&' : '?') + 'time=' + new Date().getTime().toString();
                var request = new Request(url, { mode: 'no-cors' });
                return fetch(request, { cache: 'no-store' }).then(function(response) {
                    if (response.status >= 400) throw new Error('request for ' + urlToPrefetch + ' failed with status ' + response.statusText);
                    return cache.put(urlToPrefetch, response);
                }).catch(function(error) {
                    console.warn('Not caching ' + urlToPrefetch + ' due to ' + error);
                });
            });
            return Promise.all(cachePromises).then(function() {
                return self.skipWaiting();
            });
        }).catch(function(error) {
            console.warn('Pre-Fetching Failed: ', error);
        })
    );
});
// ..
// Activate Service Worker File System
// ..
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    if (cache !== versionStamp) {
                        console.log('Cleaning cache: ' + cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});
// ..
// Fetch Service Worker Request Files
// ..
self.addEventListener('fetch', function(evt) {
    // Chrome Dev Tools Bug - Temporary Workaround
    // https://bugs.chromium.org/p/chromium/issues/detail?id=823392    
    if (evt.request.cache === 'only-if-cached' && evt.request.mode !== 'same-origin') {
        var oStrangeRequest = evt.request.clone();
        console.warn('Chrome Dev Tools. Request cache has only-if-cached, but not same-origin.', oStrangeRequest.cache, oStrangeRequest.mode, 'request redirect:', oStrangeRequest.redirect, oStrangeRequest.url, oStrangeRequest);
        return;
    }
    evt.respondWith(
        caches.match(evt.request).then(function(response) {
            return response || fetch(evt.request, { cache: 'no-store' });
        })
    );
});