var versionStamp = 'cac55db6-ab68-4e91-8c0a-c0f88e618941';
var installFiles = ['./',
'./engine.html',
'./favicon.ico',
'./index.html',
'./manifest.json',
'./css/awesome.css',
'./css/bootstrap.css',
'./css/toaster.css',
'./fonts/fa-brands-400.eot',
'./fonts/fa-brands-400.svg',
'./fonts/fa-brands-400.ttf',
'./fonts/fa-brands-400.woff',
'./fonts/fa-brands-400.woff2',
'./fonts/fa-regular-400.eot',
'./fonts/fa-regular-400.svg',
'./fonts/fa-regular-400.ttf',
'./fonts/fa-regular-400.woff',
'./fonts/fa-regular-400.woff2',
'./fonts/fa-solid-900.eot',
'./fonts/fa-solid-900.svg',
'./fonts/fa-solid-900.ttf',
'./fonts/fa-solid-900.woff',
'./fonts/fa-solid-900.woff2',
'./icons/icon-128x128.png',
'./icons/icon-144x144.png',
'./icons/icon-152x152.png',
'./icons/icon-192x192.png',
'./icons/icon-384x384.png',
'./icons/icon-512x512.png',
'./icons/icon-72x72.png',
'./icons/icon-96x96.png',
'./icons/splash-1125x2436.png',
'./icons/splash-1136x640.png',
'./icons/splash-1242x2208.png',
'./icons/splash-1334x750.png',
'./icons/splash-1536x2048.png',
'./icons/splash-1668x2224.png',
'./icons/splash-2048x1536.png',
'./icons/splash-2048x2732.png',
'./icons/splash-2208x1242.png',
'./icons/splash-2224x1668.png',
'./icons/splash-2436x1125.png',
'./icons/splash-2732x2048.png',
'./icons/splash-640x1136.png',
'./icons/splash-750x1334.png',
'./icons/touch-114x114.png',
'./icons/touch-120x120.png',
'./icons/touch-144x144.png',
'./icons/touch-152x152.png',
'./icons/touch-167x167.png',
'./icons/touch-180x180.png',
'./icons/touch-57x57.png',
'./icons/touch-72x72.png',
'./icons/touch-76x76.png',
'./images/logo.png',
'./images/splash.jpg',
'./scenes/ARaceProject.d.ts',
'./scenes/ARaceProject.js',
'./scenes/FioranoTrack.bin',
'./scenes/FioranoTrack.gltf',
'./scenes/SampleScene.bin',
'./scenes/SampleScene.gltf',
'./scenes/UnityMotors.bin',
'./scenes/UnityMotors.gltf',
'./scenes/assets/Default-Skybox_env.dds',
'./scenes/assets/Default-Skybox_nx.png',
'./scenes/assets/Default-Skybox_ny.png',
'./scenes/assets/Default-Skybox_nz.png',
'./scenes/assets/Default-Skybox_px.png',
'./scenes/assets/Default-Skybox_py.png',
'./scenes/assets/Default-Skybox_pz.png',
'./scenes/assets/Grass01.png',
'./scenes/assets/ScreenRender.png',
'./scenes/assets/SkyMAPSsunset0002_nx.png',
'./scenes/assets/SkyMAPSsunset0002_ny.png',
'./scenes/assets/SkyMAPSsunset0002_nz.png',
'./scenes/assets/SkyMAPSsunset0002_px.png',
'./scenes/assets/SkyMAPSsunset0002_py.png',
'./scenes/assets/SkyMAPSsunset0002_pz.png',
'./scenes/assets/TerrainBuilder.Asset.json',
'./scenes/assets/TerrainBuilder.Height.png',
'./scenes/assets/TerrainBuilder.Layers.png',
'./scenes/assets/TerrainBuilder.Normal.png',
'./scenes/assets/TerrainBuilder.Normals.png',
'./scenes/assets/TerrainBuilder.Splatmaps.png',
'./scenes/assets/UnityMotors_Lightmap-0_comp_light.png',
'./scenes/assets/UnityMotors_Lightmap-1_comp_light.png',
'./scenes/assets/babylon/images/Shadow.png',
'./scenes/assets/babylon/images/Skidmark.png',
'./scenes/assets/babylon/images/Smoke.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Brakedisc.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Caliper.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Cockpit.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Driver_White.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Floor.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Gearbox.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Helmet_White.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/IRL_Carbody_N.tga.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Lug.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Player1_Purple.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Player2_Blue.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Player3_Red.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Player4_Green.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Sidewall.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Sidewall_N.tga.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Spindle.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/SteeringWL.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Tread.png',
'./scenes/assets/project/materials/v360_2/textures/cartextures/Tread_N.png',
'./scenes/assets/racing/formula/audio/F1_Engine.wav',
'./scenes/assets/racing/formula/audio/F1_Skidding.wav',
'./scenes/assets/racing/mustang/audio/Engine.wav',
'./scenes/assets/racing/mustang/audio/Skidding.wav',
'./scenes/assets/racing/mustang/driver/Driver_Difuse.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_CarBody_CustomBody_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_LightsON_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_Lights_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_Rotor_nm.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_Rotor_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_Tire_nm.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_Tire_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_carBottom_nm.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_carBottom_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_carbonfiber_nm.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_carbonfiber_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_cardetails_nm.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_cardetails_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_interior_low_shdr.png',
'./scenes/assets/racing/mustang/models/textures/U_MC02_wheel_shdr.png',
'./scenes/assets/racing/startup/1.png',
'./scenes/assets/racing/startup/2.png',
'./scenes/assets/racing/startup/3.png',
'./scenes/assets/racing/startup/beep1.wav',
'./scenes/assets/racing/startup/beep2.wav',
'./scenes/assets/racing/startup/beep3.wav',
'./scenes/assets/racing/startup/beepGo.wav',
'./scenes/assets/racing/startup/go.png',
'./scenes/assets/resource/gameinstitute/tracks/bathhurst/textures/bldg1.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/ad.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/astro.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/bara.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/bldg2.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/bldg3.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/bldg4.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/bldg5.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/bldg6.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/bldggs.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/fencea.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/fenceb.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/gfloor.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/grass.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/grassf.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/grasst.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/hedge.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/kerb.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/misc1.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/ovlays.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/pavet.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/road.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/roadp.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/roadr.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/sand.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/tr01.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/tr02.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/tr03.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/tr04.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/track.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/trackch.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/trackst.png',
'./scenes/assets/resource/gameinstitute/tracks/fiorano/textures/tyres.png',
'./scenes/assets/resource/masterpixel3d/rtg/contents/flags/materials/Flags.png',
'./scenes/assets/resource/masterpixel3d/rtg/contents/grandstands/sound/Audience.wav',
'./scenes/assets/resource/masterpixel3d/rtg/contents/poststart/strip.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Atlas-01.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Atlas-02.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Audience.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Crane.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Metal.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/OutDoor-01.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/SideTrack_A.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Stone.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/TrackSide-A.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Trackside-02.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Trees-01.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/Wall-01.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/ground/Grass-01.png',
'./scenes/assets/resource/masterpixel3d/rtg/textures/ground/Road-04.png',
'./scenes/assets/resource/unitycartutorial/terrainassets/treesambient-occlusion/treetextures/PineTrunk.png',
'./scenes/assets/resource/unitycartutorial/terrainassets/treesambient-occlusion/treetextures/Pinebranch.png',
'./scenes/assets/resource/unitycartutorial/textures/car/CAR_bottom-interior-wheel.png',
'./scenes/assets/resource/unitycartutorial/textures/car/CAR_bottom-wheel_normals.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Bridge_Base.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Concrete_wall.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/FuelTank.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Gallery_Blinds.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/LightBridge.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/LightBridge_normals.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/MissionControl_Alpha.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/MissionControl_Lower.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/MissionControl_Upper.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/MissionControl_Upper_Bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/OilDrum_Base.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/OilDrum_Bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/RoadBlock.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/RoadGuards_Candy_Tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/RoadGuards_Tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/RoadGuards_Tile_Bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/RoadSide_Tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Road_Shoulders.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Road_Tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/RockLayered.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Tree_Base.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/TunnelLight.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Tunnel_Gallery.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Wire_lights.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/Wire_lights_Bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/asphalt.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/bridge.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/chainlink_fence_simple_tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/chainlink_fence_simple_tile_bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/chainlink_fence_tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/chainlink_fence_tile_bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/concrete_pavement_tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/electrical_tower.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/electrical_tower_Bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/electrical_wire.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/electrical_wire_bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/fence_simple_tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/fence_simple_tile_bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/logo.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/metal_rib_fence_tile.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/metal_rib_fence_tile_bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/pit_entrance.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/roadSigns.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/roadSigns_bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/rockslide_fence.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/rockslide_fence_bump.png',
'./scenes/assets/resource/unitycartutorial/textures/environment/lm/MissionCntrl_Glass_LM.png',
'./scripts/ammo.js',
'./scripts/ammo.wasm.js',
'./scripts/ammo.wasm.wasm',
'./scripts/babylon.earcut.js',
'./scripts/babylon.gltf.js',
'./scripts/babylon.gui.js',
'./scripts/babylon.inspector.js',
'./scripts/babylon.ktx2decoder.js',
'./scripts/babylon.manager.js',
'./scripts/babylon.materials.js',
'./scripts/babylon.materials.min.js',
'./scripts/babylon.max.js',
'./scripts/babylon.min.js',
'./scripts/bootstrap.js',
'./scripts/colyseus.js',
'./scripts/fastclick.js',
'./scripts/glslang.js',
'./scripts/glslang.wasm',
'./scripts/hls.js',
'./scripts/jquery.js',
'./scripts/meter.js',
'./scripts/msc_basis_transcoder.js',
'./scripts/msc_basis_transcoder.wasm',
'./scripts/peer.js',
'./scripts/pep.js',
'./scripts/photon.js',
'./scripts/recast.js',
'./scripts/recast.wasm.js',
'./scripts/recast.wasm.wasm',
'./scripts/socket.io.js',
'./scripts/toaster.js',
'./scripts/uastc_astc.wasm',
'./scripts/uastc_bc7.wasm',
'./scripts/uastc_rgba32_srgb.wasm',
'./scripts/uastc_rgba32_unorm.wasm',
'./scripts/zstddec.wasm'];
// ..
// Post Service Worker Version Message
// ..
self.addEventListener('message', function(evt) {
    if (evt.data != null && evt.data === 'version' && evt.ports != null && evt.ports.length > 0) {
        var port = evt.ports[0];
        if (port && port.postMessage) {
            // console.log('WORKER: Version check: ' + versionStamp);
            port.postMessage(versionStamp);
        }
    }
 });
// ..
// Install Service Worker File System
// ..
self.addEventListener('install', function(evt) {
    // console.log('WORKER: Installing version: ' + versionStamp);
    evt.waitUntil(
        caches.open(versionStamp).then(function(cache) {
            // console.log('WORKER: Fetching cache: ' + versionStamp);
            var cachePromises = installFiles.map(function(urlToPrefetch) {
                var url = (urlToPrefetch.startsWith && urlToPrefetch.startsWith("http")) ? new URL(urlToPrefetch) : new URL(urlToPrefetch, location.href);
                url.search += (url.search ? '&' : '?') + 'time=' + new Date().getTime().toString();
                var request = new Request(url, { mode: 'no-cors' });
                return fetch(request, { cache: 'no-store' }).then(function(response) {
                    if (response.status >= 400) throw new Error('request for ' + urlToPrefetch + ' failed with status: ' + response.statusText);
                    return cache.put(urlToPrefetch, response);
                }).catch(function(error) {
                    console.warn('WORKER: Not caching ' + urlToPrefetch + ' due to error: ' + error);
                });
            });
            return Promise.all(cachePromises).then(function() {
                // console.log('WORKER: Cache updated: ' + versionStamp);
                return self.skipWaiting();
            });
        }).catch(function(error) {
            console.warn('WORKER: Installation Failed: ', error);
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
                        // console.log('WORKER: Cleaning cache: ' + cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // console.log('WORKER: Activate cache: ' + versionStamp);
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