var versionStamp = 'f251050c-d5a1-4be8-b237-73b08a84ee7d';
var installFiles = ['./', './index.html', './favicon.ico', './manifest.json', './scripts/CanvasTools.js', './scripts/playcanvas-ammo.js', './scripts/playcanvas-anim.js', './scripts/playcanvas-gltf.js', './scripts/playcanvas-stick.js', './scripts/playcanvas-tools.js', './scripts/playcanvas-webvr.js', './scripts/playcanvas.js', './scene/PlayCanvasToolkit.js', './scene/TestScene.bin', './scene/TestScene.gltf', './scene/assets/Country_env.dds', './scene/assets/Country_negx.png', './scene/assets/Country_negy.png', './scene/assets/Country_negz.png', './scene/assets/Country_posx.png', './scene/assets/Country_posy.png', './scene/assets/Country_posz.png', './scene/assets/TestScene_Lightmap-0_comp_light.png'];

// Install Service Worker Cache Files
self.addEventListener('install', function(evt) {
    var versionCheck = new URL(location).searchParams.get('versionCheck');
    if (versionCheck != null && versionCheck !== "0" && versionCheck !== versionStamp) {
        console.log("===> Updating cache version stamp " + versionStamp);
        versionStamp = versionCheck;
    }
    evt.waitUntil(
        caches.open(versionStamp).then(function(cache) {
            console.log("===> Installing cache file system " + versionStamp);
            return cache.addAll(installFiles);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

// Remove Service Worker Cache Files
self.addEventListener('activate', function(evt) {
    evt.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cache) {
                    if (cache !== versionStamp) {
                        console.log("===> Cleaning cache file system " + cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Service Worker Cache First Pattern
self.addEventListener('fetch', function(evt) {
    if (evt.request.url.indexOf('version.js') < 0) {
        evt.respondWith(
            caches.match(evt.request).then(function(response) {
                return response || fetch(evt.request);
            })
        );
    }
});

// Service Worker Fetch First Pattern
// self.addEventListener('fetch', function(evt) {
//    if (evt.request.url.indexOf('version.js') < 0) {
//        evt.respondWith(
//            fetch(evt.request).catch(function() {
//                return caches.match(evt.request);
//            })
//        );
//    }
// });
