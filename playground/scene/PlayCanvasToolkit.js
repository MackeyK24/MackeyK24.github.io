if (!navigator.shaders) navigator.shaders = {};

// Browser Window Services
// Progressive Web Application
var progressiveApp = true;
if (progressiveApp === true && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('worker.js', { updateViaCache: 'none' }).then(function(reg) {
        window.registration = reg;
        console.log('===> Service worker registration succeeded. Scope is ' + reg.scope);
    }).catch(function(error) {
        console.warn('===> Service worker registration failed with ' + error);
    });
}

// FPS Performance Meter Panel
var showStatsPanel = true;
if (showStatsPanel === true && typeof FPSMeter !== "undefined") {
    var stats = 'fps';
    var look = 'dark';
    var meter = new FPSMeter({
        interval:  100,         // Update interval in milliseconds.
        smoothing: 10,          // Spike smoothing strength. 1 means no smoothing.
        show:      stats,       // Whether to show 'fps', or 'ms' = frame duration in milliseconds.
        toggleOn:  'click',     // Toggle between show 'fps' and 'ms' on this event.
        decimals:  1,           // Number of decimals in FPS number. 1 = 59.9, 2 = 59.94, ...
        maxFps:    60,          // Max expected FPS value.
        threshold: 100,         // Minimal tick reporting interval in milliseconds.
        // ..
        // Position Options
        // ..
        position: 'absolute',   // Meter position.
        zIndex:   10,           // Meter Z index.
        right:    '5px',        // Meter right offset.
        top:      '5px',        // Meter top offset.
        left:     'auto',       // Meter left offset.
        bottom:   'auto',       // Meter bottom offset.
        margin:   '0 0 0 0',    // Meter margin. Helps with centering the counter when left: 50%;
        // ..
        // Theme Options
        // ..
        theme: look,            // Meter theme. Build in: 'dark', 'light', 'transparent', 'colorful'.
        heat:  1,               // Allow themes to use coloring by FPS heat. 0 FPS = red, maxFps = green.
        // ..
        // Graph Options
        // ..
        graph:   1,             // Whether to show history graph.
        history: 20             // How many history states to show in a graph.
    });
    if (meter != null) {
        TimerPlugin.requestAnimFrame(function loop() {
            meter.tick();
            TimerPlugin.requestAnimFrame(loop);
        });
    }
}

// Initialize PlayCanvas Application
var app = app || pc.Application.getApplication();
if (app != null) {
    // TODO: Get Input Options From Editor
    if (window != null) {
        app.keyboard = new pc.Keyboard(window);
        app.gamepads = new pc.GamePads();
    }
    if (app.graphicsDevice.canvas != null) {
        app.mouse = new pc.Mouse(app.graphicsDevice.canvas);
        app.touch = new pc.TouchDevice(app.graphicsDevice.canvas);
    }
    console.log("Attached input devices to application...");
}


// Project Shader Store
// FirstPersonCamera.js
var FirstPersonCamera = pc.createScript('firstPersonCamera');

// Note: Substitue Unity Editor Properties
FirstPersonCamera.attributes.add('speed', {
    type: 'number',
    default: 25
});

FirstPersonCamera.prototype.initialize = function () {
    // Camera euler angle rotation around x and y axes
    var eulers = this.entity.getLocalEulerAngles();
    this.ex = eulers.x;
    this.ey = eulers.y;
    this.ez = eulers.z;

    // Disabling the context menu stops the browser displaying a menu when you right-click the page
    if (this.app.mouse != null) {
        var mouse = this.app.mouse;
        //mouse.disableContextMenu();
        mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    }
};

FirstPersonCamera.prototype.update = function (dt) {
    // Update the camera's orientation
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);
    if (this.app.keyboard != null) {

        // Update the camera's position
        var keyboard = this.app.keyboard;
        var forwards  = keyboard.isPressed(pc.KEY_UP)   || keyboard.isPressed(pc.KEY_W);
        var backwards = keyboard.isPressed(pc.KEY_DOWN) || keyboard.isPressed(pc.KEY_S);
        var left  = keyboard.isPressed(pc.KEY_LEFT)  || keyboard.isPressed(pc.KEY_A);
        var right = keyboard.isPressed(pc.KEY_RIGHT) || keyboard.isPressed(pc.KEY_D);

        if (forwards) {
            this.entity.translateLocal(0, 0, -this.speed*dt);
        } else if (backwards) {
            this.entity.translateLocal(0, 0, this.speed*dt);
        }

        if (left) {
            this.entity.translateLocal(-this.speed*dt, 0, 0);
        } else if (right) {
            this.entity.translateLocal(this.speed*dt, 0, 0);
        }
    }
};

FirstPersonCamera.prototype.onMouseMove = function (event) {
    // Update the current Euler angles, clamp the pitch.
    if (pc.Mouse.isPointerLocked()) {
        this.ex -= event.dy / 5;
        this.ex = pc.math.clamp(this.ex, -90, 90);
        this.ey -= event.dx / 5;
    }
};

FirstPersonCamera.prototype.onMouseDown = function (event) {
    // When the mouse button is clicked try and capture the pointer
    if (!pc.Mouse.isPointerLocked()) {
        this.app.mouse.enablePointerLock();
    }
};


// PlayCanvasToolkit.ts
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Demo Rotator Class
 * @class DemoRotator
 */
var DemoRotator = /** @class */ (function (_super) {
    __extends(DemoRotator, _super);
    function DemoRotator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.speed = 10.0;
        return _this;
    }
    DemoRotator.prototype.initialize = function () {
        console.log("Starting demo rotator for: " + this.entity.getName());
        this.speed = this.getProperty("rotateSpeed", 10.0);
        var hello = this.getProperty("helloWorld", "Hello World");
        console.log("===> Test Demo Rotator Says: " + hello);
    };
    DemoRotator.prototype.update = function (delta) {
        this.entity.rotate(0, this.speed * delta, 0);
    };
    DemoRotator = __decorate([
        createScript()
    ], DemoRotator);
    return DemoRotator;
}(CanvasScript));
// New TypeScript File
console.log("Attached Global.App script...");
// Test Scene Ready Event
SceneManager.OnExecuteReady(function () {
    console.log("===> GOT EXECUTE READY EVENT <===");
});
/**
 * Backing Script Class
 * @class SkyboxController
 */
var SkyboxController = /** @class */ (function (_super) {
    __extends(SkyboxController, _super);
    function SkyboxController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SkyboxController.prototype.initialize = function () {
        var wnd = window;
        var aniso = 2;
        var rgbm = (wnd.hdrPacking != null && wnd.hdrPacking !== "none") ? true : false;
        console.log("Window HDR Packing: " + wnd.hdrPacking);
        console.log("Window RGBM Enabled: " + rgbm.toString());
        this.app.scene.exposure = 1;
        this.app.scene.toneMapping = pc.TONEMAP_LINEAR;
        this.app.scene.gammaCorrection = pc.GAMMA_SRGB;
        //
        var basename = "Country";
        var environ = this.app.assets.find(basename + "_env");
        var textures = [
            this.app.assets.find(basename + "_posx"),
            this.app.assets.find(basename + "_negx"),
            this.app.assets.find(basename + "_posy"),
            this.app.assets.find(basename + "_negy"),
            this.app.assets.find(basename + "_posz"),
            this.app.assets.find(basename + "_negz")
        ];
        if (environ != null && environ.resource != null) {
            // WITH ENVIRONMENT
            console.log("==> Loading Skybox WITH ENVIROMENT");
            var cubemap = environ.resource;
            cubemap.rgbm = rgbm;
            cubemap.setSource(textures.map(function (texture) {
                return texture.resource.getSource();
            }));
            this.app.setSkybox(environ);
        }
        else {
            // WITHOUT ENVIRONMENT
            console.log("==> Loading Skybox WITHOUT ENVIROMENT");
            var options = {
                anisotropy: 2,
                magFilter: pc.FILTER_LINEAR,
                minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
                textures: [],
                cubemap: false,
                rgbm: rgbm,
            };
            var cubemap = new pc.Texture(this.app.graphicsDevice, options);
            cubemap.rgbm = rgbm;
            cubemap.setSource(textures.map(function (texture) {
                return texture.resource.getSource();
            }));
            this.app.scene.skybox = cubemap;
        }
        //
        /*
        let aniso:number = 2;
        this.app.scene.exposure = 1;
        this.app.scene.toneMapping = pc.TONEMAP_LINEAR;
        this.app.scene.gammaCorrection = pc.GAMMA_SRGB;
        this.loadSkybox("scenes/", "Daytime", {
            anisotropy: aniso,
            magFilter: pc.FILTER_LINEAR,
            minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
            textures: [],
            cubemap: true,
            rgbm: true,
        }, ()=>{
            console.log("*** Daytime Skybox Loaded ***");
        });
        */
    };
    SkyboxController = __decorate([
        createScript()
    ], SkyboxController);
    return SkyboxController;
}(CanvasScript));


