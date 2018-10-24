var versionStamp = 'c9f5a8ac-b5a8-4973-96ab-22634e7e8e16';
var installFiles = ['./', './index.html', './toaster.css', './favicon.ico', './manifest.json', './scripts/CanvasTools.js', './scripts/playcanvas-ammo.js', './scripts/playcanvas-anim.js', './scripts/playcanvas-gltf.js', './scripts/playcanvas-stick.js', './scripts/playcanvas-toast.js', './scripts/playcanvas-tools.js', './scripts/playcanvas-webvr.js', './scripts/playcanvas.js', './scene/PlayCanvasToolkit.js', './scene/TestScene.bin', './scene/TestScene.gltf', './scene/assets/Country_env.dds', './scene/assets/Country_negx.png', './scene/assets/Country_negy.png', './scene/assets/Country_negz.png', './scene/assets/Country_posx.png', './scene/assets/Country_posy.png', './scene/assets/Country_posz.png', './scene/assets/TestScene_Lightmap-0_comp_light.png'];
// ..
// Post Service Worker Version Message
// ..
self.addEventListener('message', function(evt) {
    if (evt.data != null && evt.data === 'version' && evt.ports != null && evt.ports.length > 0) {
        var port = evt.ports[0];
        if (port && port.postMessage) {
            port.postMessage(versionStamp);
        }
    }
});
// ..
// Install Service Worker File System
// ..
self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(versionStamp).then(function(cache) {
            console.log('WORKER: Fetching cache: ' + versionStamp);
            var cachePromises = installFiles.map(function(urlToPrefetch) {
                var url = new URL(urlToPrefetch, location.href);
                url.search += (url.search ? '&' : '?') + 'time=' + new Date().getTime().toString();
                var request = new Request(url, { mode: 'no-cors' });
                return fetch(request, { cache: 'no-store' }).then(function(response) {
                    if (response.status >= 400) throw new Error('request for ' + urlToPrefetch + ' failed with status ' + response.statusText);
                    return cache.put(urlToPrefetch, response);
                }).catch(function(error) {
                    console.warn('WORKER: Not caching ' + urlToPrefetch + ' due to ' + error);
                });
            });
            return Promise.all(cachePromises).then(function() {
                var skipped = self.skipWaiting();
                console.log('WORKER: Cache updated: ' + versionStamp);
                return skipped;
            });
        }).catch(function(error) {
            console.warn('WORKER: Pre-Fetching Failed: ', error);
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
                        console.log('WORKER: Cleaning cache: ' + cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    var activate = self.clients.claim();
    console.log('WORKER: Activate cache: ' + versionStamp);
    return activate;
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