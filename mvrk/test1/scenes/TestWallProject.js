// TestWallProject.js
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon universal camera rig system pro class
     * @class UniversalCameraSystem - All rights reserved (c) 2020 Mackey Kinard
     * https://doc.babylonjs.com/divingDeeper/postProcesses/defaultRenderingPipeline
     */
    var UniversalCameraSystem = /** @class */ (function (_super) {
        __extends(UniversalCameraSystem, _super);
        function UniversalCameraSystem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mainCamera = false;
            _this.cameraType = 0;
            _this.cameraInertia = 0.5;
            _this.cameraController = null;
            _this.immersiveOptions = null;
            _this.arcRotateConfig = null;
            _this.multiPlayerSetup = null;
            _this.editorPostProcessing = null;
            _this.m_cameraRig = null;
            return _this;
        }
        UniversalCameraSystem.GetRenderingPipeline = function () { return PROJECT.UniversalCameraSystem.renderingPipeline; };
        ;
        UniversalCameraSystem.IsCameraSystemReady = function () { return PROJECT.UniversalCameraSystem.cameraReady; };
        UniversalCameraSystem.prototype.isMainCamera = function () { return this.mainCamera; };
        UniversalCameraSystem.prototype.getCameraType = function () { return this.cameraType; };
        UniversalCameraSystem.prototype.awake = function () { this.awakeCameraSystemState(); };
        UniversalCameraSystem.prototype.start = function () { this.startCameraSystemState(); };
        UniversalCameraSystem.prototype.update = function () { this.updateCameraSystemState(); };
        UniversalCameraSystem.prototype.destroy = function () { this.destroyCameraSystemState(); };
        /////////////////////////////////////////////
        // Universal Camera System State Functions //
        /////////////////////////////////////////////
        UniversalCameraSystem.prototype.awakeCameraSystemState = function () {
            this.mainCamera = (this.getTransformTag() === "MainCamera");
            this.cameraType = this.getProperty("mainCameraType", this.cameraType);
            this.cameraInertia = this.getProperty("setCameraInertia", this.cameraInertia);
            this.immersiveOptions = this.getProperty("immersiveOptions", this.immersiveOptions);
            this.arcRotateConfig = this.getProperty("arcRotateConfig", this.arcRotateConfig);
            this.multiPlayerSetup = this.getProperty("multiPlayerSetup", this.multiPlayerSetup);
            this.cameraController = this.getProperty("cameraController", this.cameraController);
            this.editorPostProcessing = this.getProperty("renderingPipeline", this.editorPostProcessing);
            this.cleanCameraSystemState();
        };
        UniversalCameraSystem.prototype.startCameraSystemState = function () {
            return __awaiter(this, void 0, void 0, function () {
                var mouseInput, localStorageRequired, webvrFloorMeshes, webvrHelperOptions, webvrImmersiveMode, webvrReferenceType, _a, navmesh, cameraName, playerOneTransform, playerOneName, playerOneCamerax, playerTwoTransform, playerTwoName, playerTwoCamerax, playerThreeTransform, playerThreeName, playerThreeCamerax, playerFourTransform, playerFourName, playerFourCamerax, quality, allowProcessing, defaultPipeline, vcolor, colorGradingTexture, curve;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
                            if (this.multiPlayerSetup != null) {
                                PROJECT.UniversalCameraSystem.startupMode = this.multiPlayerSetup.playerStartupMode;
                                PROJECT.UniversalCameraSystem.stereoCameras = this.multiPlayerSetup.stereoSideBySide;
                            }
                            // ..
                            // Default Camera System Support
                            // ..
                            this.m_cameraRig = this.getCameraRig();
                            if (!(this.m_cameraRig != null)) return [3 /*break*/, 6];
                            this.m_cameraRig.inertia = this.cameraInertia;
                            if (this.m_cameraRig.inputs != null && this.m_cameraRig.inputs.attached != null && this.m_cameraRig.inputs.attached.mouse != null) {
                                mouseInput = this.m_cameraRig.inputs.attached.mouse;
                                if (BABYLON.Utilities.HasOwnProperty(mouseInput, "touchEnabled")) {
                                    mouseInput.touchEnabled = true;
                                }
                            }
                            if (!(this.cameraType === 0)) return [3 /*break*/, 1];
                            //if (PROJECT.UniversalCameraSystem.PlayerOneCamera == null) {
                            PROJECT.UniversalCameraSystem.PlayerOneCamera = this.m_cameraRig;
                            PROJECT.UniversalCameraSystem.PlayerOneCamera.inertia = this.cameraInertia;
                            PROJECT.UniversalCameraSystem.PlayerOneCamera.transform = this.transform;
                            return [3 /*break*/, 5];
                        case 1:
                            if (!(this.cameraType === 1 || this.cameraType === 2)) return [3 /*break*/, 4];
                            //if (PROJECT.UniversalCameraSystem.PlayerOneCamera == null) {
                            PROJECT.UniversalCameraSystem.PlayerOneCamera = this.m_cameraRig;
                            PROJECT.UniversalCameraSystem.PlayerOneCamera.inertia = this.cameraInertia;
                            PROJECT.UniversalCameraSystem.PlayerOneCamera.transform = this.transform;
                            if (!(this.immersiveOptions != null)) return [3 /*break*/, 3];
                            localStorageRequired = (this.immersiveOptions.localStorageOption === true);
                            if (!(localStorageRequired === false || (localStorageRequired === true && BABYLON.SceneManager.GetVirtualRealityEnabled()))) return [3 /*break*/, 3];
                            webvrFloorMeshes = null;
                            webvrHelperOptions = null;
                            webvrImmersiveMode = (this.cameraType === 1) ? "immersive-ar" : "immersive-vr";
                            webvrReferenceType = "local-floor";
                            switch (this.immersiveOptions.referenceSpaceType) {
                                case 0:
                                    webvrReferenceType = "viewer";
                                    break;
                                case 1:
                                    webvrReferenceType = "local";
                                    break;
                                case 2:
                                    webvrReferenceType = "local-floor";
                                    break;
                                case 3:
                                    webvrReferenceType = "bounded-floor";
                                    break;
                                case 4:
                                    webvrReferenceType = "unbounded";
                                    break;
                                default:
                                    webvrReferenceType = "local-floor";
                                    break;
                            }
                            if (this.immersiveOptions.setFloorMeshesTags == null || this.immersiveOptions.setFloorMeshesTags === "")
                                this.immersiveOptions.setFloorMeshesTags = "Navigation";
                            if (this.immersiveOptions.defaultTeleportationSetup.useTeleportation === true)
                                webvrFloorMeshes = this.scene.getMeshesByTags(this.immersiveOptions.setFloorMeshesTags);
                            if (this.immersiveOptions.defaultTeleportationSetup.useTeleportation === true && webvrFloorMeshes != null && webvrFloorMeshes.length > 0) {
                                webvrHelperOptions = {
                                    floorMeshes: webvrFloorMeshes,
                                    optionalFeatures: this.immersiveOptions.optionalFeatures,
                                    useStablePlugins: this.immersiveOptions.useStablePlugins,
                                    renderingGroupId: this.immersiveOptions.renderingGroupNum,
                                    disableDefaultUI: this.immersiveOptions.disableUserInterface,
                                    disableTeleportation: (this.immersiveOptions.defaultTeleportationSetup.useTeleportation === false),
                                    disablePointerSelection: this.immersiveOptions.disablePointerSelect,
                                    ignoreNativeCameraTransformation: this.immersiveOptions.ignoreNativeCamera,
                                    inputOptions: {
                                        doNotLoadControllerMeshes: this.immersiveOptions.experienceInputOptions.disableMeshLoad,
                                        forceInputProfile: this.immersiveOptions.experienceInputOptions.forceInputProfile,
                                        disableOnlineControllerRepository: this.immersiveOptions.experienceInputOptions.disableRepository,
                                        customControllersRepositoryURL: this.immersiveOptions.experienceInputOptions.customRepository,
                                        disableControllerAnimation: this.immersiveOptions.experienceInputOptions.disableModelAnim,
                                        controllerOptions: {
                                            disableMotionControllerAnimation: this.immersiveOptions.experienceInputOptions.controllerOptions.disableCtrlAnim,
                                            doNotLoadControllerMesh: this.immersiveOptions.experienceInputOptions.controllerOptions.disableCtrlMesh,
                                            forceControllerProfile: this.immersiveOptions.experienceInputOptions.controllerOptions.forceCtrlProfile,
                                            renderingGroupId: this.immersiveOptions.experienceInputOptions.controllerOptions.renderingGroup
                                        }
                                    },
                                    uiOptions: {
                                        sessionMode: webvrImmersiveMode,
                                        referenceSpaceType: webvrReferenceType
                                    }
                                };
                            }
                            else {
                                webvrHelperOptions = {
                                    optionalFeatures: this.immersiveOptions.optionalFeatures,
                                    useStablePlugins: this.immersiveOptions.useStablePlugins,
                                    renderingGroupId: this.immersiveOptions.renderingGroupNum,
                                    disableDefaultUI: this.immersiveOptions.disableUserInterface,
                                    disableTeleportation: (this.immersiveOptions.defaultTeleportationSetup.useTeleportation === false),
                                    disablePointerSelection: this.immersiveOptions.disablePointerSelect,
                                    ignoreNativeCameraTransformation: this.immersiveOptions.ignoreNativeCamera,
                                    inputOptions: {
                                        doNotLoadControllerMeshes: this.immersiveOptions.experienceInputOptions.disableMeshLoad,
                                        forceInputProfile: this.immersiveOptions.experienceInputOptions.forceInputProfile,
                                        disableOnlineControllerRepository: this.immersiveOptions.experienceInputOptions.disableRepository,
                                        customControllersRepositoryURL: this.immersiveOptions.experienceInputOptions.customRepository,
                                        disableControllerAnimation: this.immersiveOptions.experienceInputOptions.disableModelAnim,
                                        controllerOptions: {
                                            disableMotionControllerAnimation: this.immersiveOptions.experienceInputOptions.controllerOptions.disableCtrlAnim,
                                            doNotLoadControllerMesh: this.immersiveOptions.experienceInputOptions.controllerOptions.disableCtrlMesh,
                                            forceControllerProfile: this.immersiveOptions.experienceInputOptions.controllerOptions.forceCtrlProfile,
                                            renderingGroupId: this.immersiveOptions.renderingGroupNum
                                        }
                                    },
                                    uiOptions: {
                                        sessionMode: webvrImmersiveMode,
                                        referenceSpaceType: webvrReferenceType
                                    }
                                };
                            }
                            _a = PROJECT.UniversalCameraSystem;
                            return [4 /*yield*/, this.scene.createDefaultXRExperienceAsync(webvrHelperOptions)];
                        case 2:
                            _a.XRExperienceHelper = _b.sent();
                            if (PROJECT.UniversalCameraSystem.XRExperienceHelper != null && PROJECT.UniversalCameraSystem.XRExperienceHelper.baseExperience != null) {
                                if (PROJECT.UniversalCameraSystem.XRExperienceHelper.teleportation != null) {
                                    PROJECT.UniversalCameraSystem.XRExperienceHelper.teleportation.rotationAngle = BABYLON.Tools.ToRadians(this.immersiveOptions.defaultTeleportationSetup.turningAxisAngle);
                                    PROJECT.UniversalCameraSystem.XRExperienceHelper.teleportation.rotationEnabled = this.immersiveOptions.defaultTeleportationSetup.rotationsEnabled;
                                    PROJECT.UniversalCameraSystem.XRExperienceHelper.teleportation.backwardsMovementEnabled = this.immersiveOptions.defaultTeleportationSetup.backwardsEnabled;
                                    PROJECT.UniversalCameraSystem.XRExperienceHelper.teleportation.backwardsTeleportationDistance = this.immersiveOptions.defaultTeleportationSetup.backwardsDistance;
                                    PROJECT.UniversalCameraSystem.XRExperienceHelper.teleportation.parabolicCheckRadius = this.immersiveOptions.defaultTeleportationSetup.parabolicRadius;
                                }
                                if (PROJECT.UniversalCameraSystem.OnXRExperienceHelperObservable.hasObservers() === true) {
                                    PROJECT.UniversalCameraSystem.OnXRExperienceHelperObservable.notifyObservers(PROJECT.UniversalCameraSystem.XRExperienceHelper);
                                }
                                if (BABYLON.SceneManager.HasNavigationData()) {
                                    navmesh = BABYLON.SceneManager.GetNavigationMesh();
                                    PROJECT.UniversalCameraSystem.SetupNavigationWebXR(navmesh, this.immersiveOptions.setFloorMeshesTags);
                                }
                                else {
                                    BABYLON.SceneManager.OnNavMeshReadyObservable.addOnce(function (navmesh) {
                                        PROJECT.UniversalCameraSystem.SetupNavigationWebXR(navmesh, _this.immersiveOptions.setFloorMeshesTags);
                                    });
                                }
                            }
                            else {
                                BABYLON.SceneManager.LogWarning("WebXR not supported in current browser.");
                            }
                            _b.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            if (this.cameraType === 3) { // Multi Player Camera
                                cameraName = this.m_cameraRig.name;
                                playerOneTransform = new BABYLON.TransformNode("Player Camera 1", this.scene);
                                playerOneTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                                playerOneTransform.position = this.transform.position.clone();
                                playerOneTransform.parent = this.transform.parent;
                                playerOneName = cameraName + ".1";
                                playerOneCamerax = this.m_cameraRig.clone(playerOneName);
                                playerOneCamerax.name = playerOneName;
                                playerOneCamerax.parent = playerOneTransform;
                                playerOneCamerax.position = new BABYLON.Vector3(0, 0, 0);
                                playerOneCamerax.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                                playerOneCamerax.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                                playerOneCamerax.setEnabled(false);
                                PROJECT.UniversalCameraSystem.PlayerOneCamera = playerOneCamerax;
                                PROJECT.UniversalCameraSystem.PlayerOneCamera.inertia = this.cameraInertia;
                                PROJECT.UniversalCameraSystem.PlayerOneCamera.transform = playerOneTransform;
                                playerOneTransform.cameraRig = PROJECT.UniversalCameraSystem.PlayerOneCamera;
                                playerTwoTransform = new BABYLON.TransformNode("Player Camera 2", this.scene);
                                playerTwoTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                                playerTwoTransform.position = this.transform.position.clone();
                                playerTwoTransform.parent = this.transform.parent;
                                playerTwoName = cameraName + ".2";
                                playerTwoCamerax = this.m_cameraRig.clone(playerTwoName);
                                playerTwoCamerax.name = playerTwoName;
                                playerTwoCamerax.parent = playerTwoTransform;
                                playerTwoCamerax.position = new BABYLON.Vector3(0, 0, 0);
                                playerTwoCamerax.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                                playerTwoCamerax.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                                playerTwoCamerax.setEnabled(false);
                                PROJECT.UniversalCameraSystem.PlayerTwoCamera = playerTwoCamerax;
                                PROJECT.UniversalCameraSystem.PlayerTwoCamera.inertia = this.cameraInertia;
                                PROJECT.UniversalCameraSystem.PlayerTwoCamera.transform = playerTwoTransform;
                                playerTwoTransform.cameraRig = PROJECT.UniversalCameraSystem.PlayerTwoCamera;
                                playerThreeTransform = new BABYLON.TransformNode("Player Camera 3", this.scene);
                                playerThreeTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                                playerThreeTransform.position = this.transform.position.clone();
                                playerThreeTransform.parent = this.transform.parent;
                                playerThreeName = cameraName + ".3";
                                playerThreeCamerax = this.m_cameraRig.clone(playerThreeName);
                                playerThreeCamerax.name = playerThreeName;
                                playerThreeCamerax.parent = playerThreeTransform;
                                playerThreeCamerax.position = new BABYLON.Vector3(0, 0, 0);
                                playerThreeCamerax.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                                playerThreeCamerax.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                                playerThreeCamerax.setEnabled(false);
                                PROJECT.UniversalCameraSystem.PlayerThreeCamera = playerThreeCamerax;
                                PROJECT.UniversalCameraSystem.PlayerThreeCamera.inertia = this.cameraInertia;
                                PROJECT.UniversalCameraSystem.PlayerThreeCamera.transform = playerThreeTransform;
                                playerThreeTransform.cameraRig = PROJECT.UniversalCameraSystem.PlayerThreeCamera;
                                playerFourTransform = new BABYLON.TransformNode("Player Camera 4", this.scene);
                                playerFourTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                                playerFourTransform.position = this.transform.position.clone();
                                playerFourTransform.parent = this.transform.parent;
                                playerFourName = cameraName + ".4";
                                playerFourCamerax = this.m_cameraRig.clone(playerFourName);
                                playerFourCamerax.name = playerFourName;
                                playerFourCamerax.parent = playerFourTransform;
                                playerFourCamerax.position = new BABYLON.Vector3(0, 0, 0);
                                playerFourCamerax.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                                playerFourCamerax.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                                playerFourCamerax.setEnabled(false);
                                PROJECT.UniversalCameraSystem.PlayerFourCamera = playerFourCamerax;
                                PROJECT.UniversalCameraSystem.PlayerFourCamera.inertia = this.cameraInertia;
                                PROJECT.UniversalCameraSystem.PlayerFourCamera.transform = playerFourTransform;
                                playerFourTransform.cameraRig = PROJECT.UniversalCameraSystem.PlayerFourCamera;
                                //}
                                PROJECT.UniversalCameraSystem.multiPlayerView = true;
                                PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(this.scene, PROJECT.UniversalCameraSystem.startupMode);
                            }
                            _b.label = 5;
                        case 5:
                            // ..
                            // Validate Camera Attach Control
                            // ..
                            if (this.cameraController.attachControl === true) {
                                this.m_cameraRig.parent = null; // Detach Camera Parent When Attaching Control
                                this.m_cameraRig.position.copyFrom(this.transform.position);
                                this.m_cameraRig.rotationQuaternion = (this.transform.rotationQuaternion != null) ? this.transform.rotationQuaternion.clone() : BABYLON.Quaternion.FromEulerAngles(this.transform.rotation.x, this.transform.rotation.y, this.transform.rotation.z);
                                if (this.m_cameraRig instanceof BABYLON.FreeCamera) { // Note: Check Base Class For Universal Camera
                                    this.m_cameraRig.checkCollisions = this.cameraController.checkCollisions;
                                    this.m_cameraRig.applyGravity = this.cameraController.setApplyGravity;
                                }
                                this.m_cameraRig.attachControl(this.cameraController.preventDefault);
                            }
                            _b.label = 6;
                        case 6:
                            quality = BABYLON.SceneManager.GetRenderQuality();
                            allowProcessing = (quality === BABYLON.RenderQuality.High);
                            //if (PROJECT.UniversalCameraSystem.renderingPipeline == null) {
                            if (allowProcessing === true && this.editorPostProcessing != null && this.editorPostProcessing.usePostProcessing === true) {
                                PROJECT.UniversalCameraSystem.renderingPipeline = new BABYLON.DefaultRenderingPipeline("UniversalCameraSystem", this.editorPostProcessing.highDynamicRange, this.scene, this.scene.cameras, true);
                                if (PROJECT.UniversalCameraSystem.renderingPipeline.isSupported === true) {
                                    defaultPipeline = PROJECT.UniversalCameraSystem.renderingPipeline;
                                    defaultPipeline.samples = this.editorPostProcessing.screenAntiAliasing.msaaSamples; // 1 by default (MSAA)
                                    /* Image Processing */
                                    defaultPipeline.imageProcessingEnabled = this.editorPostProcessing.imageProcessingConfig.imageProcessing; //true by default
                                    if (defaultPipeline.imageProcessingEnabled) {
                                        defaultPipeline.imageProcessing.contrast = this.editorPostProcessing.imageProcessingConfig.imageContrast; // 1 by default
                                        defaultPipeline.imageProcessing.exposure = this.editorPostProcessing.imageProcessingConfig.imageExposure; // 1 by default
                                        defaultPipeline.imageProcessing.vignetteEnabled = this.editorPostProcessing.imageProcessingConfig.vignetteEnabled;
                                        if (defaultPipeline.imageProcessing.vignetteEnabled) {
                                            defaultPipeline.imageProcessing.vignetteBlendMode = this.editorPostProcessing.imageProcessingConfig.vignetteBlendMode;
                                            defaultPipeline.imageProcessing.vignetteCameraFov = this.editorPostProcessing.imageProcessingConfig.vignetteCameraFov;
                                            defaultPipeline.imageProcessing.vignetteCentreX = this.editorPostProcessing.imageProcessingConfig.vignetteCentreX;
                                            defaultPipeline.imageProcessing.vignetteCentreY = this.editorPostProcessing.imageProcessingConfig.vignetteCentreY;
                                            defaultPipeline.imageProcessing.vignetteStretch = this.editorPostProcessing.imageProcessingConfig.vignetteStretch;
                                            defaultPipeline.imageProcessing.vignetteWeight = this.editorPostProcessing.imageProcessingConfig.vignetteWeight;
                                            if (this.editorPostProcessing.imageProcessingConfig.vignetteColor != null) {
                                                vcolor = BABYLON.Utilities.ParseColor4(this.editorPostProcessing.imageProcessingConfig.vignetteColor);
                                                if (vcolor != null)
                                                    defaultPipeline.imageProcessing.vignetteColor = vcolor;
                                            }
                                        }
                                        /* Color Grading */
                                        defaultPipeline.imageProcessing.colorGradingEnabled = this.editorPostProcessing.imageProcessingConfig.useColorGrading; // false by default
                                        if (defaultPipeline.imageProcessing.colorGradingEnabled) {
                                            // KEEP FOR REFERENCE
                                            /* using .3dl (best) : defaultPipeline.imageProcessing.colorGradingTexture = new BABYLON.ColorGradingTexture("textures/LateSunset.3dl", this.scene); */
                                            /* using .png :
                                            var colorGradingTexture = new BABYLON.Texture("textures/colorGrade-highContrast.png", this.scene, true, false);
                                            colorGradingTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                            colorGradingTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                            defaultPipeline.imageProcessing.colorGradingTexture = colorGradingTexture;
                                            defaultPipeline.imageProcessing.colorGradingWithGreenDepth = false; */
                                            //////////////////////////////////////////////////////////////////////////
                                            if (this.editorPostProcessing.imageProcessingConfig.setGradingTexture != null) {
                                                colorGradingTexture = BABYLON.Utilities.ParseTexture(this.editorPostProcessing.imageProcessingConfig.setGradingTexture, this.scene, true, false);
                                                colorGradingTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                                colorGradingTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                                defaultPipeline.imageProcessing.colorGradingTexture = colorGradingTexture;
                                                defaultPipeline.imageProcessing.colorGradingWithGreenDepth = false;
                                            }
                                        }
                                        /* Color Curves */
                                        defaultPipeline.imageProcessing.colorCurvesEnabled = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.curvesEnabled; // false by default
                                        if (defaultPipeline.imageProcessing.colorCurvesEnabled) {
                                            curve = new BABYLON.ColorCurves();
                                            curve.globalDensity = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.globalDen; // 0 by default
                                            curve.globalExposure = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.globalExp; // 0 by default
                                            curve.globalHue = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.globalHue; // 30 by default
                                            curve.globalSaturation = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.globalSat; // 0 by default
                                            curve.highlightsDensity = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.highlightsDen; // 0 by default
                                            curve.highlightsExposure = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.highlightsExp; // 0 by default
                                            curve.highlightsHue = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.highlightsHue; // 30 by default
                                            curve.highlightsSaturation = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.highlightsSat; // 0 by default
                                            curve.midtonesDensity = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.midtonesDen; // 0 by default
                                            curve.midtonesExposure = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.midtonesExp; // 0 by default
                                            curve.midtonesHue = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.midtonesHue; // 30 by default
                                            curve.midtonesSaturation = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.midtonesSat; // 0 by default
                                            curve.shadowsDensity = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.shadowsDen; // 0 by default
                                            curve.shadowsExposure = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.shadowsExp; // 800 by default
                                            curve.shadowsHue = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.shadowsHue; // 30 by default
                                            curve.shadowsSaturation = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.shadowsSat; // 0 by default;
                                            defaultPipeline.imageProcessing.colorCurves = curve;
                                        }
                                    }
                                    /* Bloom */
                                    defaultPipeline.bloomEnabled = this.editorPostProcessing.bloomEffectProperties.bloomEnabled; // false by default
                                    if (defaultPipeline.bloomEnabled) {
                                        defaultPipeline.bloomKernel = this.editorPostProcessing.bloomEffectProperties.bloomKernel; // 64 by default
                                        defaultPipeline.bloomScale = this.editorPostProcessing.bloomEffectProperties.bloomScale; // 0.5 by default
                                        defaultPipeline.bloomWeight = this.editorPostProcessing.bloomEffectProperties.bloomWeight; // 0.15 by default
                                        defaultPipeline.bloomThreshold = this.editorPostProcessing.bloomEffectProperties.bloomThreshold; // 0.9 by default
                                    }
                                    /* Chromatic Abberation */
                                    defaultPipeline.chromaticAberrationEnabled = this.editorPostProcessing.chromaticAberration.aberrationEnabled; // false by default
                                    if (defaultPipeline.chromaticAberrationEnabled) {
                                        defaultPipeline.chromaticAberration.aberrationAmount = this.editorPostProcessing.chromaticAberration.aberrationAmount; // 30 by default
                                        defaultPipeline.chromaticAberration.adaptScaleToCurrentViewport = this.editorPostProcessing.chromaticAberration.adaptScaleViewport; // false by default
                                        defaultPipeline.chromaticAberration.alphaMode = this.editorPostProcessing.chromaticAberration.alphaMode; // 0 by default
                                        defaultPipeline.chromaticAberration.alwaysForcePOT = this.editorPostProcessing.chromaticAberration.alwaysForcePOT; // false by default
                                        defaultPipeline.chromaticAberration.enablePixelPerfectMode = this.editorPostProcessing.chromaticAberration.pixelPerfectMode; // false by default
                                        defaultPipeline.chromaticAberration.forceFullscreenViewport = this.editorPostProcessing.chromaticAberration.fullscreenViewport; // true by default
                                    }
                                    /* DOF */
                                    defaultPipeline.depthOfFieldEnabled = this.editorPostProcessing.focalDepthOfField.depthOfField; // false by default
                                    if (defaultPipeline.depthOfFieldEnabled && defaultPipeline.depthOfField.isSupported) {
                                        defaultPipeline.depthOfFieldBlurLevel = this.editorPostProcessing.focalDepthOfField.blurLevel; // 0 by default
                                        defaultPipeline.depthOfField.fStop = this.editorPostProcessing.focalDepthOfField.focalStop; // 1.4 by default
                                        defaultPipeline.depthOfField.focalLength = this.editorPostProcessing.focalDepthOfField.focalLength; // 50 by default, mm
                                        defaultPipeline.depthOfField.focusDistance = this.editorPostProcessing.focalDepthOfField.focusDistance; // 2000 by default, mm
                                        defaultPipeline.depthOfField.lensSize = this.editorPostProcessing.focalDepthOfField.maxLensSize; // 50 by default
                                    }
                                    /* FXAA */
                                    defaultPipeline.fxaaEnabled = this.editorPostProcessing.screenAntiAliasing.fxaaEnabled; // false by default
                                    if (defaultPipeline.fxaaEnabled) {
                                        defaultPipeline.fxaa.samples = this.editorPostProcessing.screenAntiAliasing.fxaaSamples; // 1 by default
                                        defaultPipeline.fxaa.adaptScaleToCurrentViewport = this.editorPostProcessing.screenAntiAliasing.fxaaScaling; // false by default
                                    }
                                    /* GlowLayer */
                                    defaultPipeline.glowLayerEnabled = this.editorPostProcessing.glowLayerProperties.glowEnabled;
                                    if (defaultPipeline.glowLayerEnabled) {
                                        defaultPipeline.glowLayer.intensity = this.editorPostProcessing.glowLayerProperties.glowIntensity; // 1 by default
                                        defaultPipeline.glowLayer.blurKernelSize = this.editorPostProcessing.glowLayerProperties.blurKernelSize; // 16 by default
                                    }
                                    /* Grain */
                                    defaultPipeline.grainEnabled = this.editorPostProcessing.grainEffectProperties.grainEnabled;
                                    if (defaultPipeline.grainEnabled) {
                                        defaultPipeline.grain.animated = this.editorPostProcessing.grainEffectProperties.grainAnimated; // false by default
                                        defaultPipeline.grain.intensity = this.editorPostProcessing.grainEffectProperties.grainIntensity; // 30 by default
                                        defaultPipeline.grain.adaptScaleToCurrentViewport = this.editorPostProcessing.grainEffectProperties.adaptScaleViewport; // false by default
                                    }
                                    /* Sharpen */
                                    defaultPipeline.sharpenEnabled = this.editorPostProcessing.sharpEffectProperties.sharpenEnabled;
                                    if (defaultPipeline.sharpenEnabled) {
                                        defaultPipeline.sharpen.edgeAmount = this.editorPostProcessing.sharpEffectProperties.sharpEdgeAmount; // 0.3 by default
                                        defaultPipeline.sharpen.colorAmount = this.editorPostProcessing.sharpEffectProperties.sharpColorAmount; // 1 by default
                                        defaultPipeline.sharpen.adaptScaleToCurrentViewport = this.editorPostProcessing.sharpEffectProperties.adaptScaleViewport; // false by default
                                    }
                                }
                                else {
                                    BABYLON.SceneManager.LogWarning("Babylon.js default rendering pipeline not supported");
                                }
                            }
                            //}
                            PROJECT.UniversalCameraSystem.cameraReady = true;
                            return [2 /*return*/];
                    }
                });
            });
        };
        UniversalCameraSystem.prototype.updateCameraSystemState = function () {
            if (this.m_cameraRig != null) {
                if (this.cameraType === 0) { // Default Universal Camera
                }
                else if (this.cameraType === 1) { // Augmented Reality Camera
                }
                else if (this.cameraType === 2) { // Virtual Reality Camera
                }
                else if (this.cameraType === 3) { // Multi Player Camera
                }
            }
        };
        UniversalCameraSystem.prototype.cleanCameraSystemState = function () {
            if (PROJECT.UniversalCameraSystem.PlayerOneCamera != null) {
                //PROJECT.UniversalCameraSystem.PlayerOneCamera.dispose();
                PROJECT.UniversalCameraSystem.PlayerOneCamera = null;
            }
            if (PROJECT.UniversalCameraSystem.PlayerTwoCamera != null) {
                //PROJECT.UniversalCameraSystem.PlayerTwoCamera.dispose();
                PROJECT.UniversalCameraSystem.PlayerTwoCamera = null;
            }
            if (PROJECT.UniversalCameraSystem.PlayerThreeCamera != null) {
                //PROJECT.UniversalCameraSystem.PlayerThreeCamera.dispose();
                PROJECT.UniversalCameraSystem.PlayerThreeCamera = null;
            }
            if (PROJECT.UniversalCameraSystem.PlayerFourCamera != null) {
                //PROJECT.UniversalCameraSystem.PlayerFourCamera.dispose();
                PROJECT.UniversalCameraSystem.PlayerFourCamera = null;
            }
        };
        UniversalCameraSystem.prototype.destroyCameraSystemState = function () {
            this.immersiveOptions = null;
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera Virtual Reality Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Get the WebXR default experience helper */
        UniversalCameraSystem.GetWebXR = function () { return PROJECT.UniversalCameraSystem.XRExperienceHelper; };
        /** Is universal camera system in WebXR mode */
        UniversalCameraSystem.IsInWebXR = function () { return (PROJECT.UniversalCameraSystem.XRExperienceHelper != null && PROJECT.UniversalCameraSystem.XRExperienceHelper.baseExperience != null && PROJECT.UniversalCameraSystem.XRExperienceHelper.baseExperience.state === BABYLON.WebXRState.IN_XR); };
        /** Setup navigation mesh for WebXR */
        UniversalCameraSystem.SetupNavigationWebXR = function (mesh, tag) {
            var webxr = PROJECT.UniversalCameraSystem.XRExperienceHelper;
            if (webxr != null && webxr.teleportation != null && mesh != null && tag != null && tag != "") {
                var hastag = BABYLON.Tags.MatchesQuery(mesh, tag);
                if (hastag === true)
                    webxr.teleportation.addFloorMesh(mesh);
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera System Player Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Get main camera rig for the scene */
        UniversalCameraSystem.GetMainCamera = function (scene, detach) {
            if (detach === void 0) { detach = false; }
            return PROJECT.UniversalCameraSystem.GetPlayerCamera(scene, BABYLON.PlayerNumber.One, detach);
        };
        /** Get universal camera rig for desired player */
        UniversalCameraSystem.GetPlayerCamera = function (scene, player, detach) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            if (detach === void 0) { detach = false; }
            var result = null;
            if (PROJECT.UniversalCameraSystem.IsCameraSystemReady()) {
                if (player === BABYLON.PlayerNumber.One && PROJECT.UniversalCameraSystem.PlayerOneCamera != null)
                    result = PROJECT.UniversalCameraSystem.PlayerOneCamera;
                else if (player === BABYLON.PlayerNumber.Two && PROJECT.UniversalCameraSystem.PlayerTwoCamera != null)
                    result = PROJECT.UniversalCameraSystem.PlayerTwoCamera;
                else if (player === BABYLON.PlayerNumber.Three && PROJECT.UniversalCameraSystem.PlayerThreeCamera != null)
                    result = PROJECT.UniversalCameraSystem.PlayerThreeCamera;
                else if (player === BABYLON.PlayerNumber.Four && PROJECT.UniversalCameraSystem.PlayerFourCamera != null)
                    result = PROJECT.UniversalCameraSystem.PlayerFourCamera;
                if (result != null && detach === true && parent != null)
                    result.parent = null;
            }
            return result;
        };
        /** Get camera transform node for desired player */
        UniversalCameraSystem.GetCameraTransform = function (scene, player) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            var result = null;
            if (PROJECT.UniversalCameraSystem.IsCameraSystemReady()) {
                if (player === BABYLON.PlayerNumber.One && PROJECT.UniversalCameraSystem.PlayerOneCamera != null && PROJECT.UniversalCameraSystem.PlayerOneCamera.transform != null)
                    result = PROJECT.UniversalCameraSystem.PlayerOneCamera.transform;
                else if (player === BABYLON.PlayerNumber.Two && PROJECT.UniversalCameraSystem.PlayerTwoCamera != null && PROJECT.UniversalCameraSystem.PlayerTwoCamera.transform != null)
                    result = PROJECT.UniversalCameraSystem.PlayerTwoCamera.transform;
                else if (player === BABYLON.PlayerNumber.Three && PROJECT.UniversalCameraSystem.PlayerThreeCamera != null && PROJECT.UniversalCameraSystem.PlayerThreeCamera.transform != null)
                    result = PROJECT.UniversalCameraSystem.PlayerThreeCamera.transform;
                else if (player === BABYLON.PlayerNumber.Four && PROJECT.UniversalCameraSystem.PlayerFourCamera != null && PROJECT.UniversalCameraSystem.PlayerFourCamera.transform != null)
                    result = PROJECT.UniversalCameraSystem.PlayerFourCamera.transform;
            }
            return result;
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera System Multi Player Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Are stereo side side camera services available. */
        UniversalCameraSystem.IsStereoCameras = function () {
            return PROJECT.UniversalCameraSystem.stereoCameras;
        };
        /** Are local multi player view services available. */
        UniversalCameraSystem.IsMultiPlayerView = function () {
            return PROJECT.UniversalCameraSystem.multiPlayerView;
        };
        /** Get the current local multi player count */
        UniversalCameraSystem.GetMultiPlayerCount = function () {
            return PROJECT.UniversalCameraSystem.multiPlayerCount;
        };
        /** Activates current local multi player cameras. */
        UniversalCameraSystem.ActivateMultiPlayerCameras = function (scene) {
            var result = false;
            if (PROJECT.UniversalCameraSystem.multiPlayerCameras != null && PROJECT.UniversalCameraSystem.multiPlayerCameras.length > 0) {
                scene.activeCameras = PROJECT.UniversalCameraSystem.multiPlayerCameras;
                result = true;
            }
            return result;
        };
        /** Disposes current local multiplayer cameras */
        UniversalCameraSystem.DisposeMultiPlayerCameras = function () {
            if (PROJECT.UniversalCameraSystem.PlayerOneCamera != null) {
                PROJECT.UniversalCameraSystem.PlayerOneCamera.dispose();
                PROJECT.UniversalCameraSystem.PlayerOneCamera = null;
            }
            if (PROJECT.UniversalCameraSystem.PlayerTwoCamera != null) {
                PROJECT.UniversalCameraSystem.PlayerTwoCamera.dispose();
                PROJECT.UniversalCameraSystem.PlayerTwoCamera = null;
            }
            if (PROJECT.UniversalCameraSystem.PlayerThreeCamera != null) {
                PROJECT.UniversalCameraSystem.PlayerThreeCamera.dispose();
                PROJECT.UniversalCameraSystem.PlayerThreeCamera = null;
            }
            if (PROJECT.UniversalCameraSystem.PlayerFourCamera != null) {
                PROJECT.UniversalCameraSystem.PlayerFourCamera.dispose();
                PROJECT.UniversalCameraSystem.PlayerFourCamera = null;
            }
        };
        /** Sets the multi player camera view layout */
        UniversalCameraSystem.SetMultiPlayerViewLayout = function (scene, totalNumPlayers) {
            var result = false;
            var players = BABYLON.Scalar.Clamp(totalNumPlayers, 1, 4);
            if (PROJECT.UniversalCameraSystem.IsMultiPlayerView()) {
                if (PROJECT.UniversalCameraSystem.PlayerOneCamera != null && PROJECT.UniversalCameraSystem.PlayerTwoCamera != null && PROJECT.UniversalCameraSystem.PlayerThreeCamera != null && PROJECT.UniversalCameraSystem.PlayerFourCamera != null) {
                    PROJECT.UniversalCameraSystem.multiPlayerCameras = [];
                    if (players === 1) {
                        PROJECT.UniversalCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0, 1, 1);
                        PROJECT.UniversalCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.UniversalCameraSystem.PlayerTwoCamera.setEnabled(false);
                        PROJECT.UniversalCameraSystem.PlayerThreeCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.UniversalCameraSystem.PlayerThreeCamera.setEnabled(false);
                        PROJECT.UniversalCameraSystem.PlayerFourCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.UniversalCameraSystem.PlayerFourCamera.setEnabled(false);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerOneCamera);
                    }
                    else if (players === 2) {
                        if (PROJECT.UniversalCameraSystem.stereoCameras === true) {
                            PROJECT.UniversalCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0, 0.5, 1);
                            PROJECT.UniversalCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1);
                        }
                        else {
                            PROJECT.UniversalCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0.5, 1, 0.5);
                            PROJECT.UniversalCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0, 0, 1, 0.5);
                        }
                        PROJECT.UniversalCameraSystem.PlayerTwoCamera.setEnabled(true);
                        PROJECT.UniversalCameraSystem.PlayerThreeCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.UniversalCameraSystem.PlayerThreeCamera.setEnabled(false);
                        PROJECT.UniversalCameraSystem.PlayerFourCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.UniversalCameraSystem.PlayerFourCamera.setEnabled(false);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerOneCamera);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerTwoCamera);
                    }
                    else if (players === 3) {
                        PROJECT.UniversalCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0, 0.5, 1);
                        PROJECT.UniversalCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0.5, 0.5, 0.5, 0.5);
                        PROJECT.UniversalCameraSystem.PlayerTwoCamera.setEnabled(true);
                        PROJECT.UniversalCameraSystem.PlayerThreeCamera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 0.5);
                        PROJECT.UniversalCameraSystem.PlayerThreeCamera.setEnabled(true);
                        PROJECT.UniversalCameraSystem.PlayerFourCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.UniversalCameraSystem.PlayerFourCamera.setEnabled(false);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerOneCamera);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerTwoCamera);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerThreeCamera);
                    }
                    else if (players === 4) {
                        PROJECT.UniversalCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0.5, 0.5, 0.5);
                        PROJECT.UniversalCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0, 0, 0.5, 0.5);
                        PROJECT.UniversalCameraSystem.PlayerTwoCamera.setEnabled(true);
                        PROJECT.UniversalCameraSystem.PlayerThreeCamera.viewport = new BABYLON.Viewport(0.5, 0.5, 0.5, 0.5);
                        PROJECT.UniversalCameraSystem.PlayerThreeCamera.setEnabled(true);
                        PROJECT.UniversalCameraSystem.PlayerFourCamera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 0.5);
                        PROJECT.UniversalCameraSystem.PlayerFourCamera.setEnabled(true);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerOneCamera);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerTwoCamera);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerThreeCamera);
                        PROJECT.UniversalCameraSystem.multiPlayerCameras.push(PROJECT.UniversalCameraSystem.PlayerFourCamera);
                    }
                    else {
                        BABYLON.SceneManager.LogWarning("Babylon.js camera rig invalid player count specified: " + players);
                    }
                }
                else {
                    BABYLON.SceneManager.LogWarning("Babylon.js camera rig failed to initialize multi player cameras");
                }
                PROJECT.UniversalCameraSystem.multiPlayerCount = players;
                result = PROJECT.UniversalCameraSystem.ActivateMultiPlayerCameras(scene);
                if (result === false)
                    BABYLON.SceneManager.LogWarning("Babylon.js camera rig failed to initialize multi player views");
            }
            else {
                BABYLON.SceneManager.LogWarning("Babylon.js camera rig multi player view option not enabled");
            }
            return result;
        };
        UniversalCameraSystem.PlayerOneCamera = null;
        UniversalCameraSystem.PlayerTwoCamera = null;
        UniversalCameraSystem.PlayerThreeCamera = null;
        UniversalCameraSystem.PlayerFourCamera = null;
        UniversalCameraSystem.XRExperienceHelper = null;
        UniversalCameraSystem.multiPlayerView = false;
        UniversalCameraSystem.multiPlayerCount = 1;
        UniversalCameraSystem.multiPlayerCameras = null;
        UniversalCameraSystem.stereoCameras = true;
        UniversalCameraSystem.startupMode = 1;
        UniversalCameraSystem.cameraReady = false;
        UniversalCameraSystem.renderingPipeline = null;
        /** Register handler that is triggered when the webxr experience helper has been created */
        UniversalCameraSystem.OnXRExperienceHelperObservable = new BABYLON.Observable();
        return UniversalCameraSystem;
    }(BABYLON.ScriptComponent));
    PROJECT.UniversalCameraSystem = UniversalCameraSystem;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class LightProjection
    */
    var LightProjection = /** @class */ (function (_super) {
        __extends(LightProjection, _super);
        function LightProjection() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.projectionTexture = null;
            _this.spotLightExponent = 16.0;
            _this.spotLightAngle = 150;
            _this.nearClipPlane = 0.1;
            _this.farClipPlane = 2.0;
            _this.excludeChildren = true;
            _this.includeTags = null;
            _this.enableRotation = true;
            _this.projectionRotation = 0;
            _this.projectionPosition = new BABYLON.Vector3(0, 1, 0);
            _this.m_spotLight = null;
            _this.m_projectorDirty = false;
            _this.m_projectorPosition = new BABYLON.Vector3(0, 0, 0);
            _this.m_projectorRotation = new BABYLON.Vector3(0, 0, 0);
            _this.m_lastPosition = new BABYLON.Vector3(0, 0, 0);
            _this.m_lastRotation = new BABYLON.Vector3(0, 0, 0);
            return _this;
        }
        LightProjection.prototype.getLightProjector = function () { return this.m_spotLight; };
        LightProjection.prototype.awake = function () {
            var _a;
            var _this = this;
            PROJECT.LightProjection.UpdateShaderStore();
            // ..
            // Setup Projection Texture Without Mipmapping
            // ..
            var projectionTextureData = this.getProperty("projectionTexture");
            if (projectionTextureData != null)
                this.projectionTexture = UTIL.ParseTexture(projectionTextureData, this.scene, true);
            // ..
            // .. Setup Spot Light As Texture Projector
            // ..
            this.m_spotLight = new BABYLON.SpotLight((this.transform.name + ".Projector"), new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, -1, 0), BABYLON.Tools.ToRadians(this.spotLightAngle), this.spotLightExponent, this.scene);
            this.m_spotLight.shadowEnabled = false;
            this.m_spotLight.intensity = 0;
            this.m_spotLight.range = 0;
            this.m_spotLight.projectionTextureLightNear = this.nearClipPlane;
            this.m_spotLight.projectionTextureLightFar = this.farClipPlane;
            if (this.projectionTexture != null) {
                this.m_spotLight.projectionTexture = this.projectionTexture;
                this.m_spotLight.projectionTexture.wrapU = BABYLON.Constants.TEXTURE_CLAMP_ADDRESSMODE;
                this.m_spotLight.projectionTexture.wrapV = BABYLON.Constants.TEXTURE_CLAMP_ADDRESSMODE;
            }
            if (this.includeTags != null && this.includeTags.length > 0) {
                var tagQuery = this.includeTags.join(" || ");
                var includeMeshes = this.scene.getMeshesByTags(tagQuery);
                var includeTransforms = this.scene.getTransformNodesByTags(tagQuery);
                if (includeMeshes != null) {
                    if (includeTransforms == null)
                        includeTransforms = [];
                    includeTransforms.push.apply(includeTransforms, includeMeshes);
                }
                if (includeTransforms != null) {
                    includeTransforms.forEach(function (element) {
                        var childDetailMesh = SM.GetTransformDetailMesh(element);
                        if (childDetailMesh != null) {
                            if (_this.m_spotLight.includedOnlyMeshes == null)
                                _this.m_spotLight.includedOnlyMeshes = [];
                            _this.m_spotLight.includedOnlyMeshes.push(childDetailMesh);
                        }
                        else {
                            if (element instanceof BABYLON.AbstractMesh) {
                                if (_this.m_spotLight.includedOnlyMeshes == null)
                                    _this.m_spotLight.includedOnlyMeshes = [];
                                _this.m_spotLight.includedOnlyMeshes.push(element);
                            }
                        }
                    });
                }
                if (this.m_spotLight.includedOnlyMeshes == null)
                    this.m_spotLight.includedOnlyMeshes = [];
                if (this.m_spotLight.includedOnlyMeshes.length <= 0)
                    this.m_spotLight.includedOnlyMeshes.push(new BABYLON.Mesh(this.transform.name + ".ProjectorMesh", this.scene));
            }
            else if (this.excludeChildren === true) {
                var abstractMesh = this.getAbstractMesh();
                if (abstractMesh != null) {
                    if (this.m_spotLight.excludedMeshes == null)
                        this.m_spotLight.excludedMeshes = [];
                    this.m_spotLight.excludedMeshes.push(abstractMesh);
                }
                var childMeshes = this.transform.getChildMeshes(false);
                if (childMeshes != null && childMeshes.length > 0) {
                    if (this.m_spotLight.excludedMeshes == null)
                        this.m_spotLight.excludedMeshes = [];
                    (_a = this.m_spotLight.excludedMeshes).push.apply(_a, childMeshes);
                }
            }
            this.updateProjectorPosition();
        };
        LightProjection.prototype.start = function () {
            this.updateProjectorPosition();
        };
        LightProjection.prototype.update = function () {
            this.updateProjectorPosition();
        };
        LightProjection.prototype.destroy = function () {
            this.projectionPosition = null;
            if (this.projectionTexture != null) {
                this.projectionTexture.dispose();
                this.projectionTexture = null;
            }
            this.m_projectorPosition = null;
            this.m_projectorRotation = null;
            this.m_lastPosition = null;
            this.m_lastRotation = null;
            if (this.m_spotLight != null) {
                this.m_spotLight.dispose();
                this.m_spotLight = null;
            }
        };
        LightProjection.prototype.updateProjectorPosition = function () {
            if (this.m_spotLight != null) {
                this.m_projectorDirty = false;
                UTIL.GetAbsolutePositionToRef(this.transform, this.m_projectorPosition, this.projectionPosition);
                if (this.transform.rotationQuaternion != null) {
                    this.transform.rotationQuaternion.toEulerAnglesToRef(this.m_projectorRotation);
                }
                else if (this.transform.rotation != null) {
                    this.m_projectorRotation.copyFrom(this.transform.rotation);
                }
                if (this.m_lastPosition.x !== this.m_projectorPosition.x || this.m_lastPosition.y !== this.m_projectorPosition.y || this.m_lastPosition.z !== this.m_projectorPosition.z) {
                    this.m_spotLight.position.copyFrom(this.m_projectorPosition);
                    this.m_projectorDirty = true;
                }
                if (this.enableRotation === true) {
                    if (this.m_lastRotation.x !== this.m_projectorRotation.x || this.m_lastRotation.y !== this.m_projectorRotation.y || this.m_lastRotation.z !== this.m_projectorRotation.z) {
                        var rotationAngle = -this.m_projectorRotation.y;
                        if (this.projectionRotation !== 0)
                            rotationAngle += BABYLON.Tools.ToRadians(this.projectionRotation);
                        this.m_spotLight.projectionTextureUpDirection.set(Math.cos(rotationAngle), 0, Math.sin(rotationAngle));
                        this.m_projectorDirty = true;
                    }
                }
                if (this.m_projectorDirty === true) {
                    this.m_spotLight.position = this.m_spotLight.position; // Note: Force Projection Texture Is Dirty
                }
                this.m_lastPosition.copyFrom(this.m_projectorPosition);
                this.m_lastRotation.copyFrom(this.m_projectorRotation);
            }
        };
        ////////////////////////////////////////////////
        // Static Helper Functions
        ////////////////////////////////////////////////
        LightProjection.UpdateShaderStore = function () {
            if (PROJECT.LightProjection.ShaderFragmentUpdated === false) {
                BABYLON.Effect.IncludesShadersStore["lightFragment"] = BABYLON.Effect.IncludesShadersStore["lightFragment"].replace("info.diffuse*=computeProjectionTextureDiffuseLighting(projectionLightSampler{X},textureProjectionMatrix{X});", "surfaceAlbedo.rgb*=computeProjectionTextureDiffuseLighting(projectionLightSampler{X},textureProjectionMatrix{X});\n                    info.diffuse=vec3(0.);\n                    info.specular=vec3(0.);\n                    ");
                PROJECT.LightProjection.ShaderFragmentUpdated = true;
            }
        };
        LightProjection.ShaderFragmentUpdated = false;
        return LightProjection;
    }(BABYLON.ScriptComponent));
    PROJECT.LightProjection = LightProjection;
})(PROJECT || (PROJECT = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon photon client controller class (Photon Engine)
     * @class PhotonController - All rights reserved (c) 2020 Mackey Kinard
     */
    var PhotonController = /** @class */ (function () {
        function PhotonController() {
        }
        /** Connects a window state photon client to a name server (Photon Cloud Services) */
        PhotonController.ConnectToNameServer = function (options, address, handler) {
            var client = null;
            if (window.top["photonNameServer"]) {
                client = window.top["photonNameServer"](options, address, handler);
            }
            return client;
        };
        /** Connects a window state photon client to a region server (Photon Cloud Services) */
        PhotonController.ConnectToRegionServer = function (region, address, handler) {
            var client = null;
            if (window.top["photonRegionServer"]) {
                client = window.top["photonRegionServer"](region, address, handler);
            }
            return client;
        };
        /** Connects a window state photon client to a master server (Private Windows Server) */
        PhotonController.ConnectToMasterServer = function (server, options, handler) {
            var client = null;
            if (window.top["photonMasterServer"]) {
                client = window.top["photonMasterServer"](server, options, handler);
            }
            return client;
        };
        /** Get the window state photon client */
        PhotonController.GetPhotonClient = function () {
            return BABYLON.SceneManager.GetWindowState("photon");
        };
        return PhotonController;
    }());
    BABYLON.PhotonController = PhotonController;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon window socket controller class (Socket.IO)
     * @class SocketController - All rights reserved (c) 2020 Mackey Kinard
     */
    var SocketController = /** @class */ (function () {
        function SocketController() {
        }
        /** Registers an handler for window socket connect event */
        SocketController.RegisterOnSocketConnect = function (func) {
            BABYLON.SceneManager.SetWindowState("onSocketConnect", func);
        };
        /** Registers an handler for window socket disconnect event */
        SocketController.RegisterOnSocketDisconnect = function (func) {
            BABYLON.SceneManager.SetWindowState("onSocketDisconnect", func);
        };
        /** Connects a window state socket */
        SocketController.ConnectWindowSocket = function (connection) {
            var socket = null;
            if (window.top["socketConnect"]) {
                socket = window.top["socketConnect"](connection);
            }
            return socket;
        };
        /** Get the window state socket */
        SocketController.GetWindowSocket = function () {
            return BABYLON.SceneManager.GetWindowState("socket");
        };
        return SocketController;
    }());
    BABYLON.SocketController = SocketController;
})(BABYLON || (BABYLON = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class UniversalPlayerController
    */
    var UniversalPlayerController = /** @class */ (function (_super) {
        __extends(UniversalPlayerController, _super);
        function UniversalPlayerController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.enableInput = false;
            _this.attachCamera = false;
            _this.rotateCamera = true;
            _this.moveCharacter = true;
            _this.toggleView = true;
            _this.freeLooking = false;
            _this.rootMotion = false;
            _this.gravityForce = 0.5;
            _this.slopeForce = 0;
            _this.rayLength = 1;
            _this.rayOrigin = 0;
            _this.maxAngle = 45;
            _this.speedFactor = 1.0;
            _this.moveSpeed = 5.0;
            _this.lookSpeed = 2.0;
            _this.jumpSpeed = 8.0;
            _this.jumpDelay = 0.0;
            _this.eyesHeight = 1.0;
            _this.pivotHeight = 1.0;
            _this.topLookLimit = 60.0;
            _this.downLookLimit = 30.0;
            _this.lowTurnSpeed = 15.0;
            _this.highTurnSpeed = 25.0;
            _this.takeoffPower = 2.5;
            _this.stoppingPower = 5.0;
            _this.acceleration = false;
            _this.avatarSkinTag = "Skin";
            _this.distanceFactor = 0.85;
            _this.cameraSmoothing = 5;
            _this.cameraCollisions = true;
            _this.inputMagnitude = 0;
            _this.minimumDistance = 0.85;
            _this.buttonJump = BABYLON.Xbox360Button.A;
            _this.keyboardJump = BABYLON.UserInputKey.SpaceBar;
            _this.buttonCamera = BABYLON.Xbox360Button.Y;
            _this.keyboardCamera = BABYLON.UserInputKey.P;
            _this.playerNumber = BABYLON.PlayerNumber.One;
            _this.boomPosition = new BABYLON.Vector3(0, 0, 0);
            _this.movementVelocity = BABYLON.Vector3.Zero();
            _this.abstractMesh = null;
            _this.cameraDistance = 0;
            _this.forwardCamera = false;
            _this.dollyDirection = BABYLON.Vector3.Zero();
            _this.rotationEulers = BABYLON.Vector3.Zero();
            _this.cameraPivotOffset = BABYLON.Vector3.Zero();
            _this.cameraForwardVector = new BABYLON.Vector3(0, 0, 0);
            _this.cameraRightVector = new BABYLON.Vector3(0, 0, 0);
            _this.desiredForwardVector = new BABYLON.Vector3(0, 0, 0);
            _this.desiredRightVector = new BABYLON.Vector3(0, 0, 0);
            _this.scaledCamDirection = BABYLON.Vector3.Zero();
            _this.scaledMaxDirection = BABYLON.Vector3.Zero();
            _this.parentNodePosition = BABYLON.Vector3.Zero();
            _this.maximumCameraPos = BABYLON.Vector3.Zero();
            _this.raycastShape = null;
            _this.raycastGroup = BABYLON.CollisionFilters.DefaultFilter;
            _this.raycastMask = (BABYLON.CollisionFilters.AllFilter ^ BABYLON.CollisionFilters.CharacterFilter);
            _this.avatarSkins = null;
            _this.cameraNode = null;
            _this.cameraPivot = null;
            _this.navigationAgent = null;
            _this.characterController = null;
            _this.isCharacterNavigating = false;
            _this.isCharacterGrounded = false;
            _this.isCharacterJumpFrame = false;
            _this.isCharacterJumpState = false;
            _this.navigationAngularSpeed = 0;
            _this.animationStateMachine = false;
            _this.animationStateParams = null;
            _this.showDebugColliders = false;
            _this.colliderVisibility = 0;
            _this.colliderRenderGroup = 0;
            _this.deltaTime = 0;
            _this.jumpTimer = 0;
            _this.playerControl = 0;
            _this.playerInputX = 0;
            _this.playerInputZ = 0;
            _this.playerMouseX = 0;
            _this.playerMouseY = 0;
            _this.groundedMesh = null;
            _this.groundedPoint = null;
            _this.groundedAngle = 0;
            _this.groundedNormal = null;
            _this.verticalVelocity = 0;
            _this.rootmotionSpeed = 0;
            _this.smoothDeltaTime = 0;
            _this.animationState = null;
            _this.inputMovementVector = BABYLON.Vector3.Zero();
            _this.playerLookRotation = BABYLON.Vector3.Zero();
            _this.playerRotationVector = BABYLON.Vector2.Zero();
            _this.playerMovementVelocity = BABYLON.Vector3.Zero();
            _this.playerRotationQuaternion = BABYLON.Quaternion.Zero();
            /** Register handler that is triggered before the controller has been updated */
            _this.onPreUpdateObservable = new BABYLON.Observable();
            /** Register handler that is triggered before the controller movement has been applied */
            _this.onBeforeMoveObservable = new BABYLON.Observable();
            /** Register handler that is triggered after the controller has been updated */
            _this.onPostUpdateObservable = new BABYLON.Observable();
            _this.pickingRay = null;
            _this.pickingHelper = null;
            _this.pickingOrigin = null;
            _this.pickingDirection = new BABYLON.Vector3(0, -1, 0);
            _this.cameraRay = null;
            _this.cameraHelper = null;
            _this.cameraForward = new BABYLON.Vector3(0, 0, 0);
            _this.cameraDirection = new BABYLON.Vector3(0, 0, 0);
            return _this;
        }
        UniversalPlayerController.prototype.getPlayerInputX = function () { return this.playerInputX; };
        UniversalPlayerController.prototype.getPlayerInputZ = function () { return this.playerInputZ; };
        UniversalPlayerController.prototype.getPlayerMouseX = function () { return this.playerMouseX; };
        UniversalPlayerController.prototype.getPlayerMouseY = function () { return this.playerMouseY; };
        UniversalPlayerController.prototype.getPlayerJumping = function () { return this.isCharacterJumpState; };
        UniversalPlayerController.prototype.getPlayerGrounded = function () { return this.isCharacterGrounded; };
        UniversalPlayerController.prototype.getGroundedMesh = function () { return this.groundedMesh; };
        UniversalPlayerController.prototype.getGroundedPoint = function () { return this.groundedPoint; };
        UniversalPlayerController.prototype.getGroundedAngle = function () { return this.groundedAngle; };
        UniversalPlayerController.prototype.getGroundedNormal = function () { return this.groundedNormal; };
        UniversalPlayerController.prototype.getCameraBoomNode = function () { return this.cameraNode; };
        UniversalPlayerController.prototype.getCameraTransform = function () { return this.cameraPivot; };
        UniversalPlayerController.prototype.getAnimationState = function () { return this.animationState; };
        UniversalPlayerController.prototype.getCharacterController = function () { return this.characterController; };
        UniversalPlayerController.prototype.awake = function () { this.awakePlayerController(); };
        UniversalPlayerController.prototype.start = function () { this.startPlayerController(); };
        UniversalPlayerController.prototype.update = function () { this.updatePlayerController(); };
        UniversalPlayerController.prototype.late = function () { this.latePlayerController(); };
        UniversalPlayerController.prototype.after = function () { this.afterPlayerController(); };
        UniversalPlayerController.prototype.destroy = function () { this.destroyPlayerController(); };
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Controller Attachment Functions
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /** TODO */
        UniversalPlayerController.prototype.setPlayerControl = function (mode) {
            this.playerControl = mode;
            if (this.playerControl === PROJECT.PlayerInputControl.ThirdPersonStrafing || this.playerControl === PROJECT.PlayerInputControl.ThirdPersonForward) {
                this.showAvatarSkins(true);
            }
            else {
                this.showAvatarSkins(false);
            }
            if (this.playerControl === PROJECT.PlayerInputControl.ThirdPersonForward) {
                this.forwardCamera = true;
            }
            else if (this.playerControl === PROJECT.PlayerInputControl.ThirdPersonStrafing) {
                this.forwardCamera = false;
            }
        };
        /** TODO */
        UniversalPlayerController.prototype.togglePlayerControl = function () {
            if (this.toggleView === true) {
                if (this.playerControl === PROJECT.PlayerInputControl.FirstPersonStrafing) {
                    if (this.forwardCamera === true) {
                        this.setPlayerControl(PROJECT.PlayerInputControl.ThirdPersonForward);
                    }
                    else {
                        this.setPlayerControl(PROJECT.PlayerInputControl.ThirdPersonStrafing);
                    }
                }
                else {
                    this.setPlayerControl(PROJECT.PlayerInputControl.FirstPersonStrafing);
                }
            }
        };
        UniversalPlayerController.prototype.showAvatarSkins = function (show) {
            if (this.avatarSkins != null) {
                // TODO - Make Skins Visible Or Not TO Camera But Keep Shadows - ???
                this.avatarSkins.forEach(function (skin) { skin.isVisible = show; });
            }
        };
        /** TODO */
        UniversalPlayerController.prototype.attachPlayerCamera = function (player) {
            if (this.cameraNode == null) {
                var playerCamera = (player <= 0 || player > 4) ? 1 : player;
                this.cameraNode = PROJECT.UniversalCameraSystem.GetCameraTransform(this.scene, playerCamera);
                if (this.cameraNode != null) {
                    this.cameraNode.parent = this.cameraPivot;
                    this.cameraNode.position.copyFrom(this.boomPosition);
                    this.cameraNode.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                    // ..
                    // TODO - Move somewhere better - ???
                    // TODO - Handle Long Intitial Camera Pan - ???
                    // ..
                    this.cameraDistance = this.cameraNode.position.length();
                    this.dollyDirection.copyFrom(this.cameraNode.position);
                    this.dollyDirection.normalize();
                }
                else {
                    BABYLON.SceneManager.LogWarning("Failed to locate player camera for: " + this.transform.name);
                }
            }
        };
        UniversalPlayerController.prototype.attachAnimationController = function () {
            if (this.animationState == null) {
                this.animationState = this.getComponent("BABYLON.AnimationState");
                if (this.animationState == null) {
                    var animationNode = this.getChildWithScript("BABYLON.AnimationState");
                    if (animationNode != null) {
                        this.animationState = BABYLON.SceneManager.FindScriptComponent(animationNode, "BABYLON.AnimationState");
                    }
                    else {
                        BABYLON.SceneManager.LogWarning("Failed to locate animator node for: " + this.transform);
                    }
                }
                // Disable Root Motion - ???
                if (this.animationState != null) {
                    this.animationState.updatePosition = false;
                    this.animationState.updateRotation = false;
                }
            }
        };
        /** TODO */
        UniversalPlayerController.prototype.resetPlayerRotation = function () {
            this.transform.rotationQuaternion.toEulerAnglesToRef(this.rotationEulers);
            this.playerRotationVector.x = this.rotationEulers.x;
            this.playerRotationVector.y = this.rotationEulers.y;
        };
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Controller Worker Functions
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        UniversalPlayerController.prototype.awakePlayerController = function () {
            var _this = this;
            this.gravityForce = this.getProperty("gravityForce", this.gravityForce);
            this.rotateCamera = this.getProperty("rotateCamera", this.rotateCamera);
            this.moveCharacter = this.getProperty("moveCharacter", this.moveCharacter);
            this.slopeForce = this.getProperty("slopeForce", this.slopeForce);
            this.rayLength = this.getProperty("rayLength", this.rayLength);
            this.rayOrigin = this.getProperty("rayOrigin", this.rayOrigin);
            this.maxAngle = this.getProperty("maxAngle", this.maxAngle);
            this.speedFactor = this.getProperty("speedFactor", this.speedFactor);
            this.moveSpeed = this.getProperty("moveSpeed", this.moveSpeed);
            this.lookSpeed = this.getProperty("lookSpeed", this.lookSpeed);
            this.jumpSpeed = this.getProperty("jumpSpeed", this.jumpSpeed);
            this.jumpDelay = this.getProperty("jumpDelay", this.jumpDelay);
            this.eyesHeight = this.getProperty("eyesHeight", this.eyesHeight);
            this.pivotHeight = this.getProperty("pivotHeight", this.pivotHeight);
            this.topLookLimit = this.getProperty("topLookLimit", this.topLookLimit);
            this.downLookLimit = this.getProperty("downLookLimit", this.downLookLimit);
            this.lowTurnSpeed = this.getProperty("lowTurnSpeed", this.lowTurnSpeed);
            this.highTurnSpeed = this.getProperty("highTurnSpeed", this.highTurnSpeed);
            this.enableInput = this.getProperty("enableInput", this.enableInput);
            this.rootMotion = this.getProperty("rootMotion", this.rootMotion);
            this.playerNumber = this.getProperty("playerNumber", this.playerNumber);
            this.attachCamera = this.getProperty("attachCamera", this.attachCamera);
            this.freeLooking = this.getProperty("freeLooking", this.freeLooking);
            this.toggleView = this.getProperty("toggleView", this.toggleView);
            this.avatarSkinTag = this.getProperty("avatarSkinTag", this.avatarSkinTag);
            this.cameraCollisions = this.getProperty("cameraCollisions", this.cameraCollisions);
            this.cameraSmoothing = this.getProperty("cameraSmoothing", this.cameraSmoothing);
            this.distanceFactor = this.getProperty("distanceFactor", this.distanceFactor);
            this.minimumDistance = this.getProperty("minimumDistance", this.minimumDistance);
            this.stoppingPower = this.getProperty("stoppingPower", this.stoppingPower);
            this.takeoffPower = this.getProperty("takeoffPower", this.takeoffPower);
            this.acceleration = this.getProperty("acceleration", this.acceleration);
            this.animationStateMachine = this.getProperty("animationStateMachine", this.animationStateMachine);
            this.animationStateParams = this.getProperty("animationStateParams", this.animationStateParams);
            // ..
            var boomPositionData = this.getProperty("boomPosition");
            if (boomPositionData != null)
                this.boomPosition = BABYLON.Utilities.ParseVector3(boomPositionData);
            // ..
            var sphereRadius = this.getProperty("sphereRadius", 0.5);
            this.raycastShape = BABYLON.SceneManager.CreatePhysicsSphereShape(sphereRadius);
            // ..
            this.abstractMesh = this.getAbstractMesh();
            this.showDebugColliders = BABYLON.Utilities.ShowDebugColliders();
            this.colliderVisibility = BABYLON.Utilities.ColliderVisibility();
            this.colliderRenderGroup = BABYLON.Utilities.ColliderRenderGroup();
            // Note: Get Avatar Skins First Thing
            if (this.avatarSkinTag != null && this.avatarSkinTag !== "") {
                this.avatarSkins = this.getChildrenWithTags(this.avatarSkinTag, false);
            }
            var pcontrol = this.getProperty("playerControl", this.playerControl);
            this.setPlayerControl(pcontrol);
            this.resetPlayerRotation();
            // ..
            this.cameraPivot = new BABYLON.Mesh(this.transform.name + ".CameraPivot", this.scene);
            this.cameraPivot.parent = null;
            this.cameraPivot.position = this.transform.position.clone();
            this.cameraPivot.rotationQuaternion = this.transform.rotationQuaternion.clone();
            this.cameraPivot.checkCollisions = false;
            this.cameraPivot.isPickable = false;
            // ..
            if (this.showDebugColliders === true) {
                var testPivot = BABYLON.MeshBuilder.CreateBox("TestPivot", { width: 0.25, height: 0.25, depth: 0.5 }, this.scene);
                testPivot.parent = this.cameraPivot;
                testPivot.position.set(0, 0, 0);
                testPivot.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                testPivot.visibility = 0.5;
                testPivot.renderingGroupId = this.colliderRenderGroup;
                testPivot.checkCollisions = false;
                testPivot.isPickable = false;
            }
            // ..
            BABYLON.SceneManager.OnKeyboardPress(this.keyboardCamera, function () { _this.togglePlayerControl(); });
            BABYLON.SceneManager.OnGamepadButtonPress(this.buttonCamera, function () { _this.togglePlayerControl(); });
            //
            this.navigationAgent = this.getComponent("BABYLON.NavigationAgent");
            this.characterController = this.getComponent("BABYLON.CharacterController");
            if (this.characterController != null) {
                BABYLON.SceneManager.LogWarning("Starting player controller in physic engine mode for: " + this.transform.name);
            }
            else {
                BABYLON.SceneManager.LogWarning("Starting player controller in check collisions mode for: " + this.transform.name);
            }
            if (this.characterController == null && this.abstractMesh != null) {
                this.abstractMesh.checkCollisions = true;
                this.abstractMesh.isPickable = true;
                // ..
                // Create a debug collision shape
                // ..
                if (this.showDebugColliders === true && this.transform._debugCollider == null) {
                    var ellipsoidSegs = 16;
                    var capsuleSize = this.abstractMesh.ellipsoid.clone();
                    var debugName = this.transform.name + ".Debug";
                    var debugCapsule = BABYLON.MeshBuilder.CreateSphere(debugName, { segments: ellipsoidSegs, diameterX: (capsuleSize.x * 2), diameterY: (capsuleSize.y * 2), diameterZ: (capsuleSize.z * 2) }, this.scene);
                    debugCapsule.position.set(0, 0, 0);
                    debugCapsule.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    debugCapsule.setParent(this.transform);
                    debugCapsule.position.set(0, 0, 0);
                    debugCapsule.visibility = this.colliderVisibility;
                    debugCapsule.renderingGroupId = this.colliderRenderGroup;
                    debugCapsule.material = BABYLON.Utilities.GetColliderMaterial(this.scene);
                    debugCapsule.checkCollisions = false;
                    debugCapsule.isPickable = false;
                    this.transform._debugCollider = debugCapsule;
                }
            }
        };
        UniversalPlayerController.prototype.startPlayerController = function () {
            // TODO - Support Dynamic PlayerNumber Change - ???
            if (this.attachCamera === true) {
                this.attachPlayerCamera(this.playerNumber);
            }
        };
        UniversalPlayerController.prototype.updatePlayerController = function () {
            // TODO - FIX THIS SHIT
            if (this.animationStateMachine === true) {
                this.attachAnimationController();
            }
            // ..
            this.deltaTime = this.getDeltaSeconds();
            this.smoothDeltaTime = BABYLON.System.SmoothDeltaFactor * this.deltaTime + (1 - BABYLON.System.SmoothDeltaFactor) * this.smoothDeltaTime;
            if (this.jumpTimer > 0) {
                this.jumpTimer -= this.deltaTime;
                if (this.jumpTimer < 0)
                    this.jumpTimer = 0;
            }
            // ..
            if (this.enableInput === false)
                return;
            this.playerInputX = BABYLON.SceneManager.GetUserInput(BABYLON.UserInputAxis.Horizontal, this.playerNumber);
            this.playerInputZ = BABYLON.SceneManager.GetUserInput(BABYLON.UserInputAxis.Vertical, this.playerNumber);
            this.playerMouseX = BABYLON.SceneManager.GetUserInput(BABYLON.UserInputAxis.MouseX, this.playerNumber);
            this.playerMouseY = BABYLON.SceneManager.GetUserInput(BABYLON.UserInputAxis.MouseY, this.playerNumber);
            //..
            // Update Input Magnitude
            // ..
            this.inputMovementVector.set(this.playerInputX, 0, this.playerInputZ);
            BABYLON.Utilities.ClampMagnitudeVector3ToRef(this.inputMovementVector, 1.0, this.inputMovementVector);
            this.inputMagnitude = this.inputMovementVector.length();
            // ..
            // Update Pre Notifications
            // ..
            if (this.onPreUpdateObservable.hasObservers() === true) {
                this.onPreUpdateObservable.notifyObservers(this.transform);
            }
            // ..
            // Update Forward Camera Vector
            // ..
            this.cameraForwardVector.copyFrom(this.cameraPivot.forward);
            this.cameraForwardVector.y = 0;
            this.cameraForwardVector.normalize();
            this.cameraForwardVector.scaleToRef(this.playerInputZ, this.desiredForwardVector);
            // ..
            // Update Right Camera Vector
            // ..
            this.cameraRightVector.copyFrom(this.cameraPivot.right);
            this.cameraRightVector.y = 0;
            this.cameraRightVector.normalize();
            this.cameraRightVector.scaleToRef(this.playerInputX, this.desiredRightVector);
            // ..
            // Update Player Rotation Vector
            // ..
            this.playerRotationVector.y += (this.playerMouseX * this.lookSpeed * this.deltaTime);
            this.playerRotationVector.x += (-this.playerMouseY * this.lookSpeed * this.deltaTime);
            this.playerRotationVector.x = BABYLON.Scalar.Clamp(this.playerRotationVector.x, -BABYLON.Tools.ToRadians(this.downLookLimit), BABYLON.Tools.ToRadians(this.topLookLimit));
            // ..
            // Update Player Movement Velocity
            // ..
            var movementSpeed = (this.inputMagnitude * this.moveSpeed * this.deltaTime * this.speedFactor);
            var locomotionSpeed = (this.rootmotionSpeed * this.speedFactor);
            if (this.playerControl === PROJECT.PlayerInputControl.FirstPersonStrafing) {
                // Strafing First Person View - Player Movement Velocity
                this.desiredForwardVector.addToRef(this.desiredRightVector, this.playerMovementVelocity);
                if (this.rootMotion === true) {
                    this.playerMovementVelocity.scaleInPlace(locomotionSpeed);
                }
                else {
                    this.playerMovementVelocity.scaleInPlace(movementSpeed);
                }
                // No Free Looking - Snap Player Rotation (Euler Angle Rotation)
                BABYLON.Quaternion.FromEulerAnglesToRef(0, this.playerRotationVector.y, 0, this.transform.rotationQuaternion);
            }
            else if (this.playerControl === PROJECT.PlayerInputControl.ThirdPersonStrafing) {
                // Strafing Third Person View - Player Movement Velocity
                this.desiredForwardVector.addToRef(this.desiredRightVector, this.playerMovementVelocity);
                if (this.rootMotion === true) {
                    this.playerMovementVelocity.scaleInPlace(locomotionSpeed);
                }
                else {
                    this.playerMovementVelocity.scaleInPlace(movementSpeed);
                }
                // Validate Free Looking Rotation
                if (this.freeLooking === true) {
                    if (this.inputMagnitude > 0) {
                        // FIXME - Note: Large Movement - Slerp Player Rotation (Euler Angle Rotation)
                        var strafingTurnRatio = (this.playerMovementVelocity.length() / this.moveSpeed);
                        var strafingTurnSpeed = BABYLON.Scalar.Lerp(this.highTurnSpeed, this.lowTurnSpeed, strafingTurnRatio);
                        BABYLON.Quaternion.FromEulerAnglesToRef(0, this.playerRotationVector.y, 0, this.playerRotationQuaternion);
                        BABYLON.Quaternion.SlerpToRef(this.transform.rotationQuaternion, this.playerRotationQuaternion, (strafingTurnSpeed * this.deltaTime), this.transform.rotationQuaternion);
                    }
                }
                else {
                    // No Free Looking - Snap Player Rotation (Euler Angle Rotation)
                    BABYLON.Quaternion.FromEulerAnglesToRef(0, this.playerRotationVector.y, 0, this.transform.rotationQuaternion);
                }
            }
            else if (this.playerControl === PROJECT.PlayerInputControl.ThirdPersonForward) {
                // Forward Third Person View - Player Look Rotation
                this.desiredForwardVector.addToRef(this.desiredRightVector, this.playerLookRotation);
                if (this.rootMotion === true) {
                    this.transform.forward.scaleToRef(locomotionSpeed, this.playerMovementVelocity);
                }
                else {
                    this.transform.forward.scaleToRef(movementSpeed, this.playerMovementVelocity);
                }
                // Always Free Looking - Lerp Player Rotation (Turn And Burn)
                if (this.inputMagnitude > 0) {
                    var forwardTurnRatio = (this.playerMovementVelocity.length() / this.moveSpeed);
                    var forwardTurnSpeed = BABYLON.Scalar.Lerp(this.highTurnSpeed, this.lowTurnSpeed, forwardTurnRatio);
                    BABYLON.Utilities.LookRotationToRef(this.playerLookRotation, this.playerRotationQuaternion);
                    BABYLON.Quaternion.SlerpToRef(this.transform.rotationQuaternion, this.playerRotationQuaternion, (forwardTurnSpeed * this.deltaTime), this.transform.rotationQuaternion);
                }
            }
            // ..
            // Update Player Acceleration
            // ..
            if (this.acceleration === true) {
                if (this.takeoffPower < 0.1)
                    this.takeoffPower = 0.1;
                if (this.stoppingPower < 0.1)
                    this.stoppingPower = 0.1;
                BABYLON.Vector3.LerpToRef(this.movementVelocity, this.playerMovementVelocity, (this.takeoffPower * this.smoothDeltaTime), this.movementVelocity);
                var playerMovementLength = this.playerMovementVelocity.length();
                var finalMovementLength = this.movementVelocity.length();
                if (playerMovementLength === 0 && finalMovementLength > 0 && finalMovementLength < (this.stoppingPower * 0.01)) {
                    this.movementVelocity.copyFrom(this.playerMovementVelocity);
                }
            }
            else {
                this.movementVelocity.copyFrom(this.playerMovementVelocity);
            }
            // ..
            // Update Character Controller
            // ..
            this.isCharacterGrounded = true;
            this.isCharacterJumpFrame = false;
            this.isCharacterNavigating = (this.navigationAgent != null && this.navigationAgent.isNavigating());
            this.navigationAngularSpeed = (this.navigationAgent != null) ? this.navigationAgent.angularSpeed : 0;
            if (this.characterController != null) {
                this.updateCharacterController();
            }
            else {
                this.updateCheckCollisions();
            }
            // ..
            // Update Animation State Params
            // ..
            if (this.animationState != null) {
                if (this.animationStateMachine === true) {
                    this.validateAnimationStateParams();
                    this.animationState.setFloat(this.animationStateParams.horizontalInput, this.playerInputX);
                    this.animationState.setFloat(this.animationStateParams.verticalInput, this.playerInputZ);
                    this.animationState.setFloat(this.animationStateParams.mouseXInput, this.playerMouseX);
                    this.animationState.setFloat(this.animationStateParams.mouseYInput, this.playerMouseY);
                    this.animationState.setFloat(this.animationStateParams.speedInput, this.inputMagnitude);
                    this.animationState.setBool(this.animationStateParams.jumpedInput, this.isCharacterJumpFrame);
                    this.animationState.setBool(this.animationStateParams.jumpingInput, this.isCharacterJumpState);
                    this.animationState.setBool(this.animationStateParams.groundedInput, this.isCharacterGrounded);
                    if (this.isCharacterNavigating === true) {
                        // TODO - Update Speed Input With Navigation Magnitude
                        // this.animationState.setFloat(this.animationStateParams.speedInput, this.inputMagnitude);
                    }
                }
            }
            // ..
            // Update Post Notifications
            // ..
            if (this.onPostUpdateObservable.hasObservers() === true) {
                this.onPostUpdateObservable.notifyObservers(this.transform);
            }
        };
        UniversalPlayerController.prototype.updateCharacterController = function () {
            if (this.moveCharacter === true && this.characterController != null) {
                this.isCharacterGrounded = this.characterController.isGrounded();
                this.groundedMesh = null;
                this.groundedPoint = null;
                this.groundedNormal = null;
                this.groundedAngle = (this.groundedNormal != null) ? Math.abs(BABYLON.Utilities.GetAngle(this.groundedNormal, this.transform.forward) - 90) : 0;
                // ..
                // DEBUG: let msg:string = "Character Controller Gounded: " + this.isCharacterGrounded;
                // DEBUG: if (this.groundedNormal != null) msg += (" --> Hit Angle: " + this.groundedAngle.toString());
                // DEBUG: if (this.groundedMesh != null) msg += (" --> Ground Mesh: " + this.groundedMesh.name);
                // DEBUG: BABYLON.Utilities.PrintToScreen(msg);
                // ..
                if (this.isCharacterNavigating === false) {
                    if (this.isCharacterGrounded === true) {
                        if (this.isCharacterJumpState === true) {
                            if (this.jumpDelay > 0)
                                this.jumpTimer = (this.jumpDelay + this.deltaTime);
                            this.isCharacterJumpState = false;
                        }
                        if (this.jumpTimer <= 0)
                            this.isCharacterJumpFrame = (BABYLON.SceneManager.GetKeyboardInput(this.keyboardJump) || BABYLON.SceneManager.GetGamepadButtonInput(this.buttonJump));
                        if (this.isCharacterJumpFrame === true) {
                            this.isCharacterJumpState = true;
                            this.characterController.jump(this.jumpSpeed);
                        }
                        // ..
                        // Update Move Notifications
                        // ..
                        if (this.onBeforeMoveObservable.hasObservers() === true) {
                            this.onBeforeMoveObservable.notifyObservers(this.transform);
                        }
                        this.characterController.move(this.movementVelocity);
                    }
                }
                else {
                    this.characterController.setGhostWorldPosition(this.transform.position);
                }
            }
        };
        UniversalPlayerController.prototype.updateCheckCollisions = function () {
            if (this.moveCharacter === true && this.abstractMesh != null) {
                var pick = this.pickCheckCollisionsRaycast();
                this.isCharacterGrounded = (pick != null && pick.hit);
                this.groundedMesh = (pick != null && pick.hit) ? pick.pickedMesh : null;
                this.groundedPoint = (pick != null && pick.hit) ? pick.pickedPoint : null;
                this.groundedNormal = (pick != null && pick.hit) ? pick.getNormal(true) : null;
                this.groundedAngle = (this.groundedNormal != null) ? Math.abs(BABYLON.Utilities.GetAngle(this.groundedNormal, this.transform.forward) - 90) : 0;
                // ..
                // DEBUG: let msg:string = "Check Collisions Gounded: " + this.isCharacterGrounded;
                // DEBUG: if (this.groundedNormal != null) msg += (" --> Hit Angle: " + this.groundedAngle.toString());
                // DEBUG: if (this.groundedMesh != null) msg += (" --> Ground Mesh: " + this.groundedMesh.name);
                // DEBUG: BABYLON.Utilities.PrintToScreen(msg);
                // ..
                if (this.gravityForce > 0)
                    this.verticalVelocity -= (this.deltaTime * this.gravityForce); // Note: Apply Constant Gravity
                if (this.isCharacterNavigating === false) {
                    if (this.isCharacterGrounded === true) {
                        var slopeFactor = (this.maxAngle > 0 && this.groundedAngle > 0 && this.groundedAngle < this.maxAngle) ? 0 : this.slopeForce;
                        this.verticalVelocity = Math.max(-slopeFactor, this.verticalVelocity); // Note: Allowed Slope Angle Support
                        if (this.isCharacterJumpState === true) {
                            if (this.jumpDelay > 0)
                                this.jumpTimer = (this.jumpDelay + this.deltaTime);
                            this.isCharacterJumpState = false;
                        }
                        if (this.jumpTimer <= 0)
                            this.isCharacterJumpFrame = (BABYLON.SceneManager.GetKeyboardInput(this.keyboardJump) || BABYLON.SceneManager.GetGamepadButtonInput(this.buttonJump));
                        if (this.isCharacterJumpFrame === true) {
                            this.isCharacterJumpState = true;
                            this.verticalVelocity = (this.jumpSpeed * 0.015); // Note: Jump Speed Scale Factor
                        }
                    }
                    this.movementVelocity.y = this.verticalVelocity;
                    // ..
                    // Update Move Notifications
                    // ..
                    if (this.onBeforeMoveObservable.hasObservers() === true) {
                        this.onBeforeMoveObservable.notifyObservers(this.transform);
                    }
                    this.abstractMesh.moveWithCollisions(this.movementVelocity);
                }
            }
        };
        UniversalPlayerController.prototype.pickCheckCollisionsRaycast = function (fastCheck) {
            var _this = this;
            if (fastCheck === void 0) { fastCheck = true; }
            if (this.abstractMesh == null)
                return null;
            if (this.rayLength <= 0)
                this.rayLength = 0.1;
            var raycastLength = (this.rayLength / this.transform.scaling.y) + 0.05;
            if (this.pickingRay == null) {
                if (this.pickingOrigin == null)
                    this.pickingOrigin = new BABYLON.Vector3(0, this.rayOrigin, 0);
                this.pickingRay = new BABYLON.Ray(this.pickingOrigin, this.pickingDirection, raycastLength);
            }
            if (this.pickingHelper == null) {
                this.pickingHelper = new BABYLON.RayHelper(this.pickingRay);
                if (this.pickingOrigin == null)
                    this.pickingOrigin = new BABYLON.Vector3(0, this.rayOrigin, 0);
                this.pickingHelper.attachToMesh(this.abstractMesh, this.pickingDirection, this.pickingOrigin, raycastLength);
                if (this.showDebugColliders === true)
                    this.pickingHelper.show(this.scene, new BABYLON.Color3(1, 0, 0));
            }
            return (this.pickingRay != null) ? this.scene.pickWithRay(this.pickingRay, function (mesh) { return (mesh != _this.abstractMesh && mesh.checkCollisions === true); }, fastCheck) : null;
        };
        UniversalPlayerController.prototype.pickCameraCollisionsRaycast = function (origin, direction, rayLength, fastCheck) {
            var _this = this;
            if (fastCheck === void 0) { fastCheck = true; }
            if (this.abstractMesh == null)
                return null;
            if (this.cameraRay == null)
                this.cameraRay = new BABYLON.Ray(origin, direction, rayLength);
            if (this.cameraRay != null) {
                this.cameraRay.origin.copyFrom(origin);
                this.cameraRay.direction.copyFrom(direction);
                this.cameraRay.length = rayLength;
            }
            if (this.cameraHelper == null) {
                this.cameraHelper = new BABYLON.RayHelper(this.cameraRay);
                if (this.showDebugColliders === true)
                    this.cameraHelper.show(this.scene, new BABYLON.Color3(1, 0, 0));
            }
            return (this.cameraRay != null) ? this.scene.pickWithRay(this.cameraRay, function (mesh) { return (mesh != _this.abstractMesh && mesh.checkCollisions === true); }, fastCheck) : null;
        };
        UniversalPlayerController.prototype.latePlayerController = function () {
            if (this.enableInput === false)
                return;
            var allowRotation = this.rotateCamera;
            // DUNNO FUR SURE:  if (this.isCharacterNavigating === true && this.navigationAngularSpeed > 0) allowRotation = false;
            if (this.cameraPivot != null) {
                // .. 
                // Update Camera Pivot Offset
                // ..
                if (this.playerControl === PROJECT.PlayerInputControl.ThirdPersonStrafing || this.playerControl === PROJECT.PlayerInputControl.ThirdPersonForward) {
                    this.cameraPivotOffset.set(0, this.pivotHeight, 0);
                }
                else {
                    this.cameraPivotOffset.set(0, this.eyesHeight, 0);
                }
                // ..
                // Update Camera Pivot Position
                // ..
                BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.cameraPivot.position, this.cameraPivotOffset);
                // ..
                // Update Camera Pivot Rotation
                // ..
                if (allowRotation === true) {
                    BABYLON.Quaternion.FromEulerAnglesToRef(this.playerRotationVector.x, this.playerRotationVector.y, 0, this.cameraPivot.rotationQuaternion);
                }
            }
            if (allowRotation === true && this.cameraNode != null) {
                if (this.cameraSmoothing <= 0)
                    this.cameraSmoothing = 5.0; // Default Camera Smoothing
                if (this.playerControl === PROJECT.PlayerInputControl.ThirdPersonStrafing || this.playerControl === PROJECT.PlayerInputControl.ThirdPersonForward) {
                    if (this.cameraCollisions === true) {
                        // ..
                        // Check Camera Collision
                        // ..
                        var maxDistance = Math.abs(this.boomPosition.z);
                        var parentNode = this.cameraNode.parent;
                        this.dollyDirection.scaleToRef(maxDistance, this.scaledMaxDirection);
                        this.dollyDirection.scaleToRef(this.cameraDistance, this.scaledCamDirection);
                        BABYLON.Utilities.GetAbsolutePositionToRef(parentNode, this.parentNodePosition);
                        BABYLON.Utilities.TransformPointToRef(parentNode, this.scaledMaxDirection, this.maximumCameraPos);
                        // ..
                        var contact = false;
                        var distance = 0;
                        if (this.characterController != null) {
                            // Note: Use Bullet Physics Shape Cast
                            var raycast = BABYLON.SceneManager.PhysicsShapecastToPoint(this.scene, this.raycastShape, this.parentNodePosition, this.maximumCameraPos, this.raycastGroup, this.raycastMask);
                            contact = (raycast != null && raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null);
                            distance = (raycast != null && raycast.hasHit === true) ? raycast.hitDistance : 0;
                        }
                        else {
                            // Note: Use Native Scene Pick With Ray
                            this.cameraForward.set(0, 0, -1);
                            BABYLON.Utilities.TransformPointToRef(parentNode, this.cameraForward, this.cameraForward);
                            this.cameraForward.subtractToRef(this.parentNodePosition, this.cameraDirection);
                            this.cameraDirection.normalize();
                            // ..
                            var pick = this.pickCameraCollisionsRaycast(this.parentNodePosition, this.cameraDirection, this.maximumCameraPos.length());
                            contact = (pick != null && pick.hit);
                            distance = (pick != null && pick.distance);
                        }
                        if (contact === true) {
                            this.cameraDistance = BABYLON.Scalar.Clamp((distance * this.distanceFactor), this.minimumDistance, maxDistance);
                            // Lerp Past Camera Collisions
                            if (this.cameraNode.position.x !== this.scaledCamDirection.x || this.cameraNode.position.y !== this.scaledCamDirection.y || this.cameraNode.position.z !== this.scaledCamDirection.z) {
                                BABYLON.Vector3.LerpToRef(this.cameraNode.position, this.scaledCamDirection, (this.deltaTime * this.cameraSmoothing), this.cameraNode.position);
                            }
                        }
                        else {
                            // Lerp To Camera Boom Position
                            if (this.cameraNode.position.x !== this.boomPosition.x || this.cameraNode.position.y !== this.boomPosition.y || this.cameraNode.position.z !== this.boomPosition.z) {
                                BABYLON.Vector3.LerpToRef(this.cameraNode.position, this.boomPosition, (this.deltaTime * this.cameraSmoothing), this.cameraNode.position);
                            }
                        }
                    }
                    else {
                        // Lerp To Camera Boom Position
                        if (this.cameraNode.position.x !== this.boomPosition.x || this.cameraNode.position.y !== this.boomPosition.y || this.cameraNode.position.z !== this.boomPosition.z) {
                            BABYLON.Vector3.LerpToRef(this.cameraNode.position, this.boomPosition, (this.deltaTime * this.cameraSmoothing), this.cameraNode.position);
                        }
                    }
                }
                else {
                    // Note: Snap To Zero Camera Pivot Position - First Person View
                    if (this.cameraNode.position.x !== 0 || this.cameraNode.position.y !== 0 || this.cameraNode.position.z !== 0) {
                        this.cameraNode.position.set(0, 0, 0);
                    }
                }
            }
        };
        UniversalPlayerController.prototype.afterPlayerController = function () {
            if (this.enableInput === false)
                return;
            this.rootmotionSpeed = 0;
            if (this.animationState != null && this.animationStateMachine === true) {
                this.rootmotionSpeed = this.animationState.getRootMotionSpeed();
            }
        };
        UniversalPlayerController.prototype.destroyPlayerController = function () {
            this.cameraPivot = null;
            this.cameraNode = null;
            this.animationState = null;
            this.characterController = null;
            this.onPreUpdateObservable.clear();
            this.onPreUpdateObservable = null;
            this.onBeforeMoveObservable.clear();
            this.onBeforeMoveObservable = null;
            this.onPostUpdateObservable.clear();
            this.onPostUpdateObservable = null;
        };
        UniversalPlayerController.prototype.validateAnimationStateParams = function () {
            if (this.animationStateParams == null) {
                this.animationStateParams = {
                    horizontalInput: "Horizontal",
                    verticalInput: "Vertical",
                    mouseXInput: "MouseX",
                    mouseYInput: "MouseY",
                    speedInput: "Speed",
                    jumpedInput: "Jumped",
                    jumpingInput: "Jumping",
                    groundedInput: "Grounded"
                };
            }
        };
        return UniversalPlayerController;
    }(BABYLON.ScriptComponent));
    PROJECT.UniversalPlayerController = UniversalPlayerController;
    /**
    * Babylon Enum Definition
    * @interface PlayerInputControl
    */
    var PlayerInputControl;
    (function (PlayerInputControl) {
        PlayerInputControl[PlayerInputControl["FirstPersonStrafing"] = 0] = "FirstPersonStrafing";
        PlayerInputControl[PlayerInputControl["ThirdPersonStrafing"] = 1] = "ThirdPersonStrafing";
        PlayerInputControl[PlayerInputControl["ThirdPersonForward"] = 2] = "ThirdPersonForward";
    })(PlayerInputControl = PROJECT.PlayerInputControl || (PROJECT.PlayerInputControl = {}));
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class FxParticleSystem
    */
    var FxParticleSystem = /** @class */ (function (_super) {
        __extends(FxParticleSystem, _super);
        function FxParticleSystem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.m_particleEmitter = null;
            _this.m_particleSystem = null;
            return _this;
        }
        FxParticleSystem.prototype.getParticleEmitter = function () { return this.m_particleEmitter; };
        FxParticleSystem.prototype.getParticleSystem = function () { return this.m_particleSystem; };
        FxParticleSystem.prototype.awake = function () {
            var rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
            var classType = this.getProperty("classType", 0);
            var particleText = this.getProperty("base64ParticleSystem");
            var playOnAwake = this.getProperty("playOnAwake", false);
            var particleTexture = this.getProperty("particleTexture");
            this.m_particleEmitter = this.getAbstractMesh();
            if (this.m_particleEmitter == null) {
                this.m_particleEmitter = BABYLON.Mesh.CreateBox(this.transform.name + ".Emitter", 0.25, this.scene);
                this.m_particleEmitter.parent = this.transform;
                this.m_particleEmitter.position.set(0, 0, 0);
                this.m_particleEmitter.isVisible = false;
                this.m_particleEmitter.isPickable = false;
                this.m_particleEmitter.material = BABYLON.Utilities.GetColliderMaterial(this.scene);
            }
            if (particleText != null && particleText !== "") {
                var particleJson = window.atob(particleText);
                if (particleJson != null && particleJson !== "") {
                    var particleParsed = JSON.parse(particleJson);
                    if (particleParsed != null) {
                        if (particleParsed.texture != null && particleTexture != null) {
                            particleParsed.texture.name = particleTexture.filename; // Note: Particle System Parser Use Name Not Url
                            particleParsed.texture.url = particleTexture.filename; // Note: Particle System Parser Use Name Not Url
                        }
                        if (classType === 1) { // GPU Particle System
                            this.m_particleSystem = BABYLON.GPUParticleSystem.Parse(particleParsed, this.scene, rootUrl);
                        }
                        else { // CPU Particle System
                            this.m_particleSystem = BABYLON.ParticleSystem.Parse(particleParsed, this.scene, rootUrl);
                        }
                        if (this.m_particleSystem != null) {
                            if (this.m_particleEmitter != null)
                                this.m_particleSystem.emitter = this.m_particleEmitter;
                            if (playOnAwake === false)
                                this.m_particleSystem.stop();
                        }
                    }
                }
            }
        };
        FxParticleSystem.prototype.destroy = function () {
            this.m_particleEmitter = null;
            if (this.m_particleSystem != null) {
                this.m_particleSystem.dispose();
                this.m_particleSystem = null;
            }
        };
        return FxParticleSystem;
    }(BABYLON.ScriptComponent));
    PROJECT.FxParticleSystem = FxParticleSystem;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon water material system pro class (Babylon Water Material)
     * @class SkyMaterialSystem - All rights reserved (c) 2020 Mackey Kinard
     */
    var SkyMaterialSystem = /** @class */ (function (_super) {
        __extends(SkyMaterialSystem, _super);
        function SkyMaterialSystem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.skyfog = false;
            _this.skysize = 1000;
            _this.probesize = 128;
            _this.reflections = false;
            _this.reflectlevel = 1;
            _this.skytintcolor = new BABYLON.Color3(1, 1, 1);
            _this.m_skyboxMesh = null;
            _this.m_skyMaterial = null;
            _this.m_reflectProbe = null;
            return _this;
        }
        SkyMaterialSystem.prototype.getSkyboxMesh = function () { return this.m_skyboxMesh; };
        SkyMaterialSystem.prototype.getSkyMaterial = function () { return this.m_skyMaterial; };
        SkyMaterialSystem.prototype.getReflectionProbe = function () { return this.m_reflectProbe; };
        SkyMaterialSystem.prototype.awake = function () { this.awakeSkyboxMaterial(); };
        SkyMaterialSystem.prototype.start = function () { };
        SkyMaterialSystem.prototype.update = function () { };
        SkyMaterialSystem.prototype.late = function () { };
        SkyMaterialSystem.prototype.after = function () { };
        SkyMaterialSystem.prototype.destroy = function () { this.destroySkyboxMaterial(); };
        SkyMaterialSystem.prototype.awakeSkyboxMaterial = function () {
            this.skyfog = this.getProperty("skyfog", this.skyfog);
            this.skysize = this.getProperty("skysize", this.skysize);
            this.probesize = this.getProperty("probesize", this.probesize);
            this.reflections = this.getProperty("reflections", this.reflections);
            this.reflectlevel = this.getProperty("reflectlevel", this.reflectlevel);
            // ..
            var tintColor = this.getProperty("tintColor");
            if (tintColor != null)
                this.skytintcolor = BABYLON.Utilities.ParseColor3(tintColor);
            // ..
            this.m_skyboxMesh = BABYLON.Mesh.CreateBox("Ambient Skybox", this.skysize, this.scene);
            this.m_skyboxMesh.position.set(0, 0, 0);
            this.m_skyboxMesh.infiniteDistance = true;
            this.m_skyboxMesh.applyFog = this.skyfog;
            if (this.scene.useRightHandedSystem === true)
                this.m_skyboxMesh.scaling.x *= -1;
            // Setup Sky Material Properties
            this.m_skyMaterial = new BABYLON.SkyMaterial(this.transform.name + ".SkyMaterial", this.scene);
            this.m_skyMaterial.backFaceCulling = false;
            this.setSkyboxTintColor(this.skytintcolor);
            /**
             * Defines the overall luminance of sky in interval [0, 1].
             */
            this.m_skyMaterial.luminance = this.getProperty("luminance", this.m_skyMaterial.luminance);
            /**
            * Defines the amount (scattering) of haze as opposed to molecules in atmosphere.
            */
            this.m_skyMaterial.turbidity = this.getProperty("turbidity", this.m_skyMaterial.turbidity);
            /**
             * Defines the sky appearance (light intensity).
             */
            this.m_skyMaterial.rayleigh = this.getProperty("rayleigh", this.m_skyMaterial.rayleigh);
            /**
             * Defines the mieCoefficient in interval [0, 0.1] which affects the property .mieDirectionalG.
             */
            this.m_skyMaterial.mieCoefficient = this.getProperty("miecoefficient", this.m_skyMaterial.mieCoefficient);
            /**
             * Defines the amount of haze particles following the Mie scattering theory.
             */
            this.m_skyMaterial.mieDirectionalG = this.getProperty("miedirectionalg", this.m_skyMaterial.mieDirectionalG);
            /**
             * Defines the distance of the sun according to the active scene camera.
             */
            this.m_skyMaterial.distance = this.getProperty("distance", this.m_skyMaterial.distance);
            /**
             * Defines the sun inclination, in interval [-0.5, 0.5]. When the inclination is not 0, the sun is said
             * "inclined".
             */
            this.m_skyMaterial.inclination = this.getProperty("inclination", this.m_skyMaterial.inclination);
            /**
             * Defines the solar azimuth in interval [0, 1]. The azimuth is the angle in the horizontal plan between
             * an object direction and a reference direction.
             */
            this.m_skyMaterial.azimuth = this.getProperty("azimuth", this.m_skyMaterial.azimuth);
            /**
             * Defines an offset vector used to get a horizon offset.
             * @example skyMaterial.cameraOffset.y = camera.globalPosition.y // Set horizon relative to 0 on the Y axis
             */
            var camOffsetData = this.getProperty("cameraoffset");
            if (camOffsetData != null)
                this.m_skyMaterial.cameraOffset = BABYLON.Utilities.ParseVector3(camOffsetData);
            /**
             * Defines if the sun position should be computed (inclination and azimuth) according to the scene
             * sun position.
             */
            this.m_skyMaterial.useSunPosition = this.getProperty("usesunposition", this.m_skyMaterial.useSunPosition);
            this.m_skyMaterial.sunPosition = new BABYLON.Vector3(0, 50, 0);
            if (this.scene.metadata != null && this.scene.metadata.unity != null && this.scene.metadata.unity) {
                if (this.scene.metadata.unity.sunposition != null) {
                    this.m_skyMaterial.sunPosition = BABYLON.Utilities.ParseVector3(this.scene.metadata.unity.sunposition);
                }
            }
            // Assign Sky Material To Skybox Mesh
            this.m_skyboxMesh.material = this.m_skyMaterial;
            // Setup Environment Reflection Probe Texture
            if (this.reflections === true) {
                this.m_reflectProbe = new BABYLON.ReflectionProbe("Skybox-ReflectionProbe", this.probesize, this.scene);
                this.m_reflectProbe.renderList.push(this.m_skyboxMesh);
                this.scene.customRenderTargets.push(this.m_reflectProbe.cubeTexture);
                this.scene.environmentTexture = this.m_reflectProbe.cubeTexture;
                this.scene.environmentIntensity = this.reflectlevel;
            }
        };
        SkyMaterialSystem.prototype.destroySkyboxMaterial = function () {
            if (this.m_skyboxMesh != null) {
                this.m_skyboxMesh.dispose();
                this.m_skyboxMesh = null;
            }
            if (this.m_reflectProbe != null) {
                this.m_reflectProbe.dispose();
                this.m_reflectProbe = null;
            }
            if (this.m_skyMaterial != null) {
                this.m_skyMaterial.dispose();
                this.m_skyMaterial = null;
            }
        };
        /** Set Skybox Mesh tint color. (Box Mesh Vertex Colors) */
        SkyMaterialSystem.prototype.setSkyboxTintColor = function (color) {
            var colors = [];
            var numVertices = this.m_skyboxMesh.getTotalVertices();
            for (var i = 0; i < numVertices; ++i) {
                colors.push(color.r, color.g, color.b, 1.0);
            }
            this.m_skyboxMesh.setVerticesData("color", colors);
            this.m_skyboxMesh.useVertexColors = true;
        };
        return SkyMaterialSystem;
    }(BABYLON.ScriptComponent));
    PROJECT.SkyMaterialSystem = SkyMaterialSystem;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon water material system pro class (Babylon Water Material)
     * @class WaterMaterialSystem - All rights reserved (c) 2020 Mackey Kinard
     */
    var WaterMaterialSystem = /** @class */ (function (_super) {
        __extends(WaterMaterialSystem, _super);
        function WaterMaterialSystem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.waterTag = "Water";
            _this.targetSize = new BABYLON.Vector2(128, 128);
            _this.renderSize = new BABYLON.Vector2(512, 512);
            _this.depthFactor = 1.0;
            _this.reflectSkybox = true;
            _this.subDivisions = 32;
            _this.heightOffset = 1.0;
            _this.windDirection = new BABYLON.Vector2(0, 1);
            _this.windForce = 6;
            _this.waveSpeed = 1.0;
            _this.waveLength = 0.4;
            _this.waveHeight = 0.4;
            _this.bumpHeight = 0.4;
            _this.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
            _this.colorBlendFactor = 0.2;
            _this.waterColor2 = new BABYLON.Color3(0.1, 0.1, 0.6);
            _this.colorBlendFactor2 = 0.2;
            _this.disableClipPlane = false;
            _this.m_waterGeometry = null;
            _this.m_waterMaterial = null;
            return _this;
        }
        WaterMaterialSystem.prototype.getWaterGeometry = function () { return this.m_waterGeometry; };
        WaterMaterialSystem.prototype.getWaterMaterial = function () { return this.m_waterMaterial; };
        WaterMaterialSystem.prototype.awake = function () {
            var _this = this;
            this.waterTag = this.getProperty("watertag", this.waterTag);
            this.depthFactor = this.getProperty("depthfactor", this.depthFactor);
            this.subDivisions = this.getProperty("subdivisions", this.subDivisions);
            this.heightOffset = this.getProperty("heightoffset", this.heightOffset);
            this.reflectSkybox = this.getProperty("reflectskybox", this.reflectSkybox);
            this.windForce = this.getProperty("windforce", this.windForce);
            this.waveSpeed = this.getProperty("wavespeed", this.waveSpeed);
            this.waveLength = this.getProperty("wavelength", this.waveLength);
            this.waveHeight = this.getProperty("waveheight", this.waveHeight);
            this.bumpHeight = this.getProperty("bumpheight", this.bumpHeight);
            this.bumpSuperimpose = this.getProperty("bumpsuperimpose", this.bumpSuperimpose);
            this.bumpAffectsReflection = this.getProperty("bumpaffectsreflection", this.bumpAffectsReflection);
            this.colorBlendFactor = this.getProperty("colorblendfactor", this.colorBlendFactor);
            this.colorBlendFactor2 = this.getProperty("colorblendfactor2", this.colorBlendFactor2);
            this.disableClipPlane = this.getProperty("disableclipplane", this.disableClipPlane);
            this.fresnelSeparate = this.getProperty("fresnelseparate", this.fresnelSeparate);
            // ..
            var wcolor1 = this.getProperty("watercolor");
            this.waterColor = BABYLON.Utilities.ParseColor3(wcolor1);
            // ..
            var wcolor2 = this.getProperty("watercolor2");
            this.waterColor2 = BABYLON.Utilities.ParseColor3(wcolor2);
            // ..
            var wdirection = this.getProperty("winddirection");
            this.windDirection = BABYLON.Utilities.ParseVector2(wdirection);
            // ..
            var itargetsize = this.getProperty("targetsize");
            if (itargetsize != null)
                this.targetSize = BABYLON.Utilities.ParseVector2(itargetsize);
            // ..        
            var irendersize = this.getProperty("rendersize");
            if (irendersize != null)
                this.renderSize = BABYLON.Utilities.ParseVector2(irendersize);
            /* Awake component function */
            var bumpTexture = null;
            var bumpTextureData = this.getProperty("bumptexture");
            if (bumpTextureData != null)
                bumpTexture = BABYLON.Utilities.ParseTexture(bumpTextureData, this.scene);
            if (bumpTexture != null) {
                this.m_waterMaterial = new BABYLON.WaterMaterial(this.transform.name + ".Water", this.scene, this.renderSize);
                this.m_waterMaterial.bumpTexture = bumpTexture;
                this.m_waterMaterial.windDirection = this.windDirection;
                this.m_waterMaterial.windForce = this.windForce;
                this.m_waterMaterial.waveSpeed = this.waveSpeed;
                this.m_waterMaterial.waveLength = this.waveLength;
                this.m_waterMaterial.waveHeight = this.waveHeight;
                this.m_waterMaterial.bumpHeight = this.bumpHeight;
                this.m_waterMaterial.bumpSuperimpose = this.bumpSuperimpose;
                this.m_waterMaterial.bumpAffectsReflection = this.bumpAffectsReflection;
                this.m_waterMaterial.waterColor = this.waterColor;
                this.m_waterMaterial.colorBlendFactor = this.colorBlendFactor;
                this.m_waterMaterial.waterColor2 = this.waterColor2;
                this.m_waterMaterial.colorBlendFactor2 = this.colorBlendFactor2;
                this.m_waterMaterial.disableClipPlane = this.disableClipPlane;
                this.m_waterMaterial.fresnelSeparate = this.fresnelSeparate;
                // ..
                // Water Material Tags
                // ..
                if (this.reflectSkybox === true) {
                    var skyboxMesh = BABYLON.SceneManager.GetAmbientSkybox(this.scene);
                    if (skyboxMesh != null)
                        this.m_waterMaterial.addToRenderList(skyboxMesh);
                }
                if (this.waterTag != null && this.waterTag !== "") {
                    var waterMeshes = this.scene.getMeshesByTags(this.waterTag);
                    if (waterMeshes != null && waterMeshes.length > 0) {
                        waterMeshes.forEach(function (mesh) {
                            _this.m_waterMaterial.addToRenderList(mesh);
                        });
                    }
                }
                // ..
                // Water Material Mesh
                // ..
                this.m_waterGeometry = BABYLON.Mesh.CreateGround(this.transform.name + ".WaterMesh", this.targetSize.x, this.targetSize.y, this.subDivisions, this.scene, false);
                this.m_waterGeometry.parent = this.transform;
                this.m_waterGeometry.position.set(0, this.heightOffset, 0);
                if (this.depthFactor > 0)
                    this.m_waterGeometry.scaling.y *= this.depthFactor;
                this.m_waterGeometry.material = this.m_waterMaterial;
            }
            else {
                BABYLON.SceneManager.LogWarning("No supported water bump texture for: " + this.transform.name);
            }
        };
        WaterMaterialSystem.prototype.start = function () { };
        WaterMaterialSystem.prototype.update = function () { };
        WaterMaterialSystem.prototype.late = function () { };
        WaterMaterialSystem.prototype.after = function () { };
        WaterMaterialSystem.prototype.destroy = function () { };
        return WaterMaterialSystem;
    }(BABYLON.ScriptComponent));
    PROJECT.WaterMaterialSystem = WaterMaterialSystem;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class SimpleFollowCamera
    */
    var SimpleFollowCamera = /** @class */ (function (_super) {
        __extends(SimpleFollowCamera, _super);
        function SimpleFollowCamera() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.smoothFollow = 0;
            _this.smoothRotate = 0;
            _this.matchRotation = false;
            _this.followTarget = null;
            _this.targetPosition = BABYLON.Vector3.Zero();
            _this.targetRotation = BABYLON.Quaternion.Zero();
            return _this;
        }
        SimpleFollowCamera.prototype.awake = function () {
            this.smoothFollow = this.getProperty("smoothFollow", this.smoothFollow);
            this.smoothRotate = this.getProperty("smoothRotate", this.smoothRotate);
            this.matchRotation = this.getProperty("matchRotation", this.matchRotation);
            var ftarget = this.getProperty("followTarget");
            if (ftarget != null) {
                this.followTarget = BABYLON.Utilities.ParseTransformByID(ftarget, this.scene);
                if (this.followTarget != null) {
                    BABYLON.Utilities.ValidateTransformQuaternion(this.followTarget);
                }
            }
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
        };
        SimpleFollowCamera.prototype.start = function () {
            BABYLON.SceneManager.ConsoleLog("Starting simple follow target for: " + this.transform.name);
        };
        SimpleFollowCamera.prototype.late = function () {
            if (this.followTarget != null) {
                var deltaTime = this.getDeltaSeconds();
                BABYLON.Utilities.GetAbsolutePositionToRef(this.followTarget, this.targetPosition);
                this.targetRotation.copyFrom(this.followTarget.absoluteRotationQuaternion);
                // ..
                if (this.smoothFollow > 0) {
                    BABYLON.Vector3.LerpToRef(this.transform.position, this.targetPosition, (deltaTime * this.smoothFollow), this.transform.position);
                }
                else {
                    this.transform.position.copyFrom(this.targetPosition);
                }
                // ..
                if (this.matchRotation === true) {
                    if (this.smoothRotate > 0) {
                        BABYLON.Quaternion.SlerpToRef(this.transform.rotationQuaternion, this.targetRotation, (deltaTime * this.smoothRotate), this.transform.rotationQuaternion);
                    }
                    else {
                        this.transform.rotationQuaternion.copyFrom(this.targetRotation);
                    }
                }
            }
        };
        return SimpleFollowCamera;
    }(BABYLON.ScriptComponent));
    PROJECT.SimpleFollowCamera = SimpleFollowCamera;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class SmoothFollowTarget
    */
    var SmoothFollowTarget = /** @class */ (function (_super) {
        __extends(SmoothFollowTarget, _super);
        function SmoothFollowTarget() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.target = null;
            _this.targetHeight = 1.75;
            _this.followHeight = 1.75;
            _this.heightDamping = 12.0;
            _this.rotationDamping = 3.0;
            _this.minimumDistance = 6.0;
            _this.maximumDistance = 8.0;
            _this.startBehindTarget = true;
            _this.followBehindTarget = true;
            _this.targetPosition = BABYLON.Vector3.Zero();
            _this.targetAngles = new BABYLON.Vector3(0, 0, 0);
            _this.transformAngles = new BABYLON.Vector3(0, 0, 0);
            _this.positionBuffer = new BABYLON.Vector3(0, 0, 0);
            _this.rotationBuffer = new BABYLON.Quaternion(0, 0, 0, 1);
            _this.tempRotationBuffer = new BABYLON.Vector3(0, 0, 0);
            return _this;
        }
        SmoothFollowTarget.prototype.awake = function () {
            this.targetHeight = this.getProperty("targetHeight", this.targetHeight);
            this.followHeight = this.getProperty("followHeight", this.followHeight);
            this.heightDamping = this.getProperty("heightDamping", this.heightDamping);
            this.rotationDamping = this.getProperty("rotationDamping", this.rotationDamping);
            this.minimumDistance = this.getProperty("minimumDistance", this.minimumDistance);
            this.maximumDistance = this.getProperty("maximumDistance", this.maximumDistance);
            this.startBehindTarget = this.getProperty("startBehindTarget", this.startBehindTarget);
            this.followBehindTarget = this.getProperty("followBehindTarget", this.followBehindTarget);
            if (this.rotationDamping <= 0)
                this.rotationDamping = 3;
            if (this.heightDamping <= 0)
                this.heightDamping = 12;
            var followTarget = this.getProperty("target");
            if (followTarget != null) {
                this.target = BABYLON.Utilities.ParseTransformByID(followTarget, this.scene);
            }
        };
        SmoothFollowTarget.prototype.start = function () {
            if (this.target != null) {
                if (this.startBehindTarget === true) {
                    // TODO - this.transform.position = this.target.position.clone(); - ???
                }
            }
        };
        SmoothFollowTarget.prototype.late = function () {
            if (this.target != null) {
                this.targetPosition.copyFrom(this.target.position);
                if (this.followBehindTarget === true) {
                    var deltaTime = this.getDeltaSeconds();
                    BABYLON.Utilities.ToEulerToRef(this.target.rotationQuaternion, this.targetAngles);
                    BABYLON.Utilities.ToEulerToRef(this.transform.rotationQuaternion, this.transformAngles);
                    var normalizedSpeed = 1.0; // TODO - Get Target Normalized Speed
                    var wantedHeight = (this.targetPosition.y + this.followHeight);
                    var currentHeight = BABYLON.Scalar.Lerp(this.transform.position.y, wantedHeight, (this.heightDamping * deltaTime));
                    var wantedRotationAngle = this.targetAngles.y;
                    var currentRotationAngle = BABYLON.Scalar.LerpAngle(this.transformAngles.y, wantedRotationAngle, (this.rotationDamping * deltaTime));
                    var wantedTargetDistance = BABYLON.Scalar.Lerp(this.minimumDistance, this.maximumDistance, normalizedSpeed);
                    BABYLON.Utilities.FromEulerToRef(0, currentRotationAngle, 0, this.rotationBuffer);
                    BABYLON.Utilities.MultiplyQuaternionByVectorToRef(this.rotationBuffer, BABYLON.Vector3.Forward(), this.tempRotationBuffer);
                    this.tempRotationBuffer.scaleInPlace(wantedTargetDistance);
                    //let wantedRotationAngle = this.targetAngles.y;
                    //let wantedHeight = this.targetPosition.y + this.height;
                    //let currentRotationAngle = this.transformAngles.y;
                    //let currentHeight = this.transform.position.y;
                    //currentRotationAngle = BABYLON.Scalar.LerpAngle(currentRotationAngle, wantedRotationAngle, this.rotationDamping * deltaTime);
                    //currentHeight = BABYLON.Scalar.Lerp(currentHeight, wantedHeight, this.heightDamping * deltaTime);
                    //BABYLON.Utilities.FromEulerToRef(0, currentRotationAngle, 0, this.rotationBuffer);
                    //BABYLON.Utilities.MultiplyQuaternionByVectorToRef(this.rotationBuffer, BABYLON.Vector3.Forward(), this.tempRotationBuffer);
                    //this.tempRotationBuffer.scaleInPlace(this.distance);
                    this.positionBuffer.copyFrom(this.targetPosition);
                    this.positionBuffer.subtractInPlace(this.tempRotationBuffer);
                    this.transform.position.set(this.positionBuffer.x, currentHeight, this.positionBuffer.z);
                }
                this.targetPosition.y += this.targetHeight;
                this.transform.lookAt(this.targetPosition);
            }
        };
        SmoothFollowTarget.prototype.destroy = function () {
            this.target = null;
            this.targetAngles = null;
            this.transformAngles = null;
            this.positionBuffer = null;
            this.rotationBuffer = null;
            this.tempRotationBuffer = null;
        };
        return SmoothFollowTarget;
    }(BABYLON.ScriptComponent));
    PROJECT.SmoothFollowTarget = SmoothFollowTarget;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class WaypointTargetManager
    */
    var WaypointTargetManager = /** @class */ (function (_super) {
        __extends(WaypointTargetManager, _super);
        function WaypointTargetManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._waypointMeshLines = null;
            _this._waypointSplineCurve = null;
            _this._waypointTransformNodes = null;
            _this._waypointSplinePositions = null;
            _this._waypointSphereMaterial = null;
            _this.resolution = 1;
            _this.closedLoop = true;
            _this.drawLines = false;
            _this.drawPoints = false;
            _this.drawTraces = false;
            _this.pointSize = 0.5;
            _this.lineHeight = 0.25;
            _this.lineColor = new BABYLON.Color3(1, 1, 1);
            _this.pointColor = new BABYLON.Color3(1, 1, 1);
            _this.traceColor = new BABYLON.Color3(1, 1, 1);
            return _this;
        }
        WaypointTargetManager.prototype.getSplineCurve = function () { return this._waypointSplineCurve; };
        WaypointTargetManager.prototype.getSplineCurveLength = function () { return (this._waypointSplineCurve != null) ? this._waypointSplineCurve.length() : 0; };
        WaypointTargetManager.prototype.getSplineCurvePositions = function () { return this._waypointSplinePositions; };
        WaypointTargetManager.prototype.getControlPointTransforms = function () { return this._waypointTransformNodes; };
        WaypointTargetManager.prototype.awake = function () {
            var _this = this;
            this.resolution = this.getProperty("resolution", this.resolution);
            this.closedLoop = this.getProperty("closedLoop", this.closedLoop);
            this.drawLines = this.getProperty("drawLines", this.drawLines);
            this.drawPoints = this.getProperty("drawPoints", this.drawPoints);
            this.drawTraces = this.getProperty("drawTraces", this.drawTraces);
            this.pointSize = this.getProperty("pointSize", this.pointSize);
            this.lineHeight = this.getProperty("lineHeight", this.lineHeight);
            // ..
            var lcolor = this.getProperty("lineColor");
            var pcolor = this.getProperty("pointColor");
            var tcolor = this.getProperty("traceColor");
            // ..
            this.lineColor = BABYLON.Utilities.ParseColor3(lcolor, this.lineColor);
            this.pointColor = BABYLON.Utilities.ParseColor3(pcolor, this.pointColor);
            this.traceColor = BABYLON.Utilities.ParseColor3(tcolor, this.traceColor);
            // ..
            this._waypointSphereMaterial = new BABYLON.StandardMaterial(this.transform.name + ".SplineMaterial", this.scene);
            this._waypointSphereMaterial.diffuseColor = this.pointColor;
            //this._waypointSphereMaterial.wireframe = true;
            // ..
            this._waypointTransformNodes = this.transform.getChildren(null, true);
            if (this._waypointTransformNodes != null && this._waypointTransformNodes.length > 0) {
                var controlPoints_1 = [];
                this._waypointTransformNodes.forEach(function (transform) {
                    BABYLON.Utilities.ValidateTransformQuaternion(transform);
                    // TODO - FIXME - Use Transform Point To Get World Position
                    // controlPoints.push(transform.getAbsolutePosition().clone());
                    controlPoints_1.push(BABYLON.Utilities.GetAbsolutePosition(transform));
                    if (_this.drawPoints === true) {
                        var controlPoint = BABYLON.MeshBuilder.CreateSphere(transform.name + ".WireSphere", { segments: 24, diameter: (_this.pointSize * 2) }, _this.scene);
                        controlPoint.parent = transform;
                        controlPoint.position.set(0, 0, 0);
                        controlPoint.visibility = 0.25;
                        controlPoint.isVisible = true;
                        controlPoint.material = _this._waypointSphereMaterial;
                    }
                });
                this._waypointSplineCurve = BABYLON.Curve3.CreateCatmullRomSpline(controlPoints_1, this.resolution, this.closedLoop);
                if (this._waypointSplineCurve != null)
                    this._waypointSplinePositions = this._waypointSplineCurve.getPoints();
                if (this._waypointSplinePositions != null)
                    BABYLON.SceneManager.ConsoleWarn("DEBUG: Waypoint Manager - " + this.transform.name + ": (" + this._waypointTransformNodes.length + " - " + this._waypointSplinePositions.length + " - " + this._waypointSplineCurve.length().toFixed(2) + ")");
            }
        };
        WaypointTargetManager.prototype.start = function () {
            if (this._waypointSplinePositions != null && this.drawLines === true) {
                this._waypointMeshLines = BABYLON.MeshBuilder.CreateLines((this.transform.name + ".SplineMesh"), { points: this._waypointSplinePositions }, this.scene);
                this._waypointMeshLines.parent = this.transform;
                this._waypointMeshLines.color = this.lineColor;
                this._waypointMeshLines.position.y += this.lineHeight;
            }
        };
        WaypointTargetManager.prototype.destroy = function () {
            this.lineColor = null;
            this._waypointSplineCurve = null;
            this._waypointTransformNodes = null;
            this._waypointSplinePositions = null;
            if (this._waypointMeshLines != null) {
                this._waypointMeshLines.dispose();
                this._waypointMeshLines = null;
            }
        };
        return WaypointTargetManager;
    }(BABYLON.ScriptComponent));
    PROJECT.WaypointTargetManager = WaypointTargetManager;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon Script Component
     * @class DebugInformation
     */
    var DebugInformation = /** @class */ (function (_super) {
        __extends(DebugInformation, _super);
        function DebugInformation() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.keys = true;
            _this.show = true;
            _this.popup = false;
            _this.views = false;
            _this.xbox = false;
            _this.color = BABYLON.Color3.Green();
            return _this;
        }
        DebugInformation.prototype.awake = function () {
            this.keys = this.getProperty("enableDebugKeys", this.keys);
            this.show = this.getProperty("showDebugLabels", this.show);
            this.popup = this.getProperty("popupDebugPanel", this.popup);
            this.views = this.getProperty("togglePlayerViews", this.views);
            this.xbox = this.getProperty("allowXboxLiveSignIn", this.xbox);
            // ..
            var debugLabelColor = this.getProperty("debugOutputTextColor");
            if (debugLabelColor != null)
                this.color = BABYLON.Utilities.ParseColor3(debugLabelColor);
            // ..
            if (BABYLON.SceneManager.IsWindows())
                this.popup = false;
            BABYLON.SceneManager.LogMessage("Debug information overlay loaded");
        };
        DebugInformation.prototype.start = function () {
            var _this = this;
            //this.screen = document.getElementById("screen");
            //this.toggle = document.getElementById("toggle");
            //this.signin = document.getElementById("signin");
            //this.reload = document.getElementById("reload");
            //this.mouse = document.getElementById("mouse");
            //this.debug = document.getElementById("debug");
            if (this.show === true) {
                /*
                if (this.keys === true) {
                    if (!BABYLON.SceneManager.IsXboxOne()) {
                        if (this.screen) this.screen.innerHTML = "F - Show Full Screen";
                    }
                    if (BABYLON.CameraSystem.IsMultiPlayerView() && this.views === true) {
                        if (this.toggle) {
                            if (BABYLON.SceneManager.IsXboxOne()) {
                                this.toggle.style.top = "29px";
                            }
                            this.toggle.innerHTML = "1 - 4 Toggle Player View";
                        }
                    }
                    if (BABYLON.SceneManager.IsXboxLivePluginEnabled() && this.xbox === true) {
                        if (this.signin) {
                            if (BABYLON.SceneManager.IsXboxOne()) {
                                this.signin.style.top = "49px";
                            }
                            this.signin.innerHTML = "X - Xbox Live Sign In";
                        }
                    }
                    if (this.mouse) this.mouse.innerHTML = (BABYLON.SceneManager.IsXboxOne()) ? "M - Mouse" : "";
                    if (this.reload) this.reload.innerHTML = "R - Reload";
                    if (this.debug) this.debug.innerHTML = "P - Debug";
                }
                */
            }
            if (this.keys === true) {
                if (this.views === true) {
                    BABYLON.SceneManager.LogMessage("Enable Multiplayer Keys");
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.Num1, function () {
                        PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(_this.scene, 1);
                        BABYLON.SceneManager.LogMessage("1 player pressed");
                    });
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.Num2, function () {
                        PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(_this.scene, 2);
                        BABYLON.SceneManager.LogMessage("2 players pressed");
                    });
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.Num3, function () {
                        PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(_this.scene, 3);
                        BABYLON.SceneManager.LogMessage("3 players pressed");
                    });
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.Num4, function () {
                        PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(_this.scene, 4);
                        BABYLON.SceneManager.LogMessage("4 players pressed");
                    });
                }
                BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.R, function () {
                    window.location.reload();
                });
                BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.I, function () {
                    if (_this.popup === true) {
                        BABYLON.SceneManager.PopupDebug(_this.scene);
                    }
                    else {
                        BABYLON.SceneManager.ToggleDebug(_this.scene, true, null);
                    }
                });
                BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.F, function () {
                    //BABYLON.SceneManager.ToggleFullScreenMode(this.scene);
                });
                /*
                if (BABYLON.SceneManager.IsXboxOne()) {
                    if (navigator.gamepadInputEmulation) {
                        BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.M, ()=>{
                            if (navigator.gamepadInputEmulation !== "mouse") {
                                navigator.gamepadInputEmulation = "mouse";
                            } else {
                                navigator.gamepadInputEmulation = "gamepad";
                            }
                        });
                    }
                } else {
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.F, ()=>{
                        //BABYLON.Tools.RequestFullscreen(document.documentElement);
                        this.scene.getEngine().enterFullscreen(true);
                    });
                }
                if (BABYLON.WindowsPlatform.IsXboxLivePluginEnabled() && this.xbox === true) {
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.X, ()=>{
                        var player:BABYLON.PlayerNumber.One = BABYLON.PlayerNumber.One;
                        if (!BABYLON.WindowsPlatform.IsXboxLiveUserSignedIn(null, player)) {
                            BABYLON.SceneManager.LogMessage("===> Trying Xbox Live Sign In For Player: " + player.toString());
                            BABYLON.WindowsPlatform.XboxLiveUserSignIn(player, (result: Microsoft.Xbox.Services.System.SignInResult) => {
                                var user = BABYLON.WindowsPlatform.GetXboxLiveUser(player);
                                var msg = "(" + user.xboxUserId + ") - " + user.gamertag;
                                BABYLON.SceneManager.AlertMessage(msg, "Xbox Live User Signed In");
                            }, (err)=>{
                                BABYLON.SceneManager.LogMessage(err);
                                var msg:string = "Encountered Sign Error";
                                BABYLON.SceneManager.LogWarning(msg);
                                BABYLON.SceneManager.AlertMessage(msg, "Xbox Live Warning");
                            });
                        } else {
                            BABYLON.SceneManager.LogWarning("Xbox Live User Already Signed In");
                            BABYLON.SceneManager.AlertMessage("User Already Signed In", "Xbox Live Warning");
                        }
                    });
                }
                */
            }
            // Default Print To Screen Text
            var printColor = (this.scene.getEngine().webGLVersion < 2) ? "red" : this.color.toHexString();
            var graphicsVersion = BABYLON.SceneManager.GetWebGLVersionString(this.scene);
            BABYLON.Utilities.PrintToScreen(graphicsVersion, printColor);
        };
        DebugInformation.prototype.destroy = function () {
            //this.screen = null;
            //this.toggle = null;
            //this.signin = null;
            //this.reload = null;
            //this.mouse = null;
            //this.debug = null;
        };
        return DebugInformation;
    }(BABYLON.ScriptComponent));
    PROJECT.DebugInformation = DebugInformation;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class TestNavigationAgent
    */
    var TestNavigationAgent = /** @class */ (function (_super) {
        __extends(TestNavigationAgent, _super);
        function TestNavigationAgent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.m_playerAgent = null;
            _this.m_charController = null;
            // Note: Animation Jump Curve Support
            _this.time = -1;
            _this.duration = -1;
            _this.jumpCurve = null;
            _this.traversalTime = 0.5;
            return _this;
        }
        TestNavigationAgent.prototype.awake = function () {
            var _this = this;
            this.doPointerCancel(); // Note: Disable Right Click So Can Be Used For Teleport
            this.scene.onPointerObservable.add(function (pointerInfo) {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        if (pointerInfo.pickInfo.hit) {
                            _this.doPointerDown(pointerInfo);
                        }
                        break;
                }
            });
            // ..
            // Note: Get Navigation Agent Attached To Transform Node
            // ..
            this.m_charController = this.getComponent("BABYLON.CharacterController");
            this.m_playerAgent = this.getComponent("BABYLON.NavigationAgent");
            if (this.m_playerAgent != null) {
                this.m_playerAgent.onPreUpdateObservable.add(function () { _this.updateNavAgent(); });
                BABYLON.SceneManager.LogMessage("Test navigation mesh agent for: " + this.transform.name);
            }
            else
                BABYLON.SceneManager.LogMessage("Failed to locate test nav mesh agent for: " + this.transform.name);
        };
        TestNavigationAgent.prototype.doPointerCancel = function () {
            var canvas = this.scene.getEngine().getRenderingCanvas();
            canvas.oncontextmenu = function (e) { e.preventDefault(); };
        };
        TestNavigationAgent.prototype.doPointerDown = function (pointerInfo) {
            var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
            if (pickinfo.hit) {
                if (this.m_playerAgent != null) {
                    if (pointerInfo.event.button === 0) {
                        // Note: Use Navigation Agent - SetDestination
                        this.m_playerAgent.setDestination(pickinfo.pickedPoint);
                    }
                    else {
                        // Note: Use Navigation Agent - Teleport
                        this.m_playerAgent.teleport(pickinfo.pickedPoint);
                    }
                }
            }
        };
        TestNavigationAgent.prototype.update = function () {
            if (this.m_playerAgent != null) {
                // DEBUG: const agentState:number = this.m_playerAgent.getAgentState();
                // DEBUG: UTIL.PrintToScreen("Navigation State: " + agentState.toFixed() , "green");
                // DEBUG: if (agentState === 0) console.warn(">>> INVALID NAV STATE: " + this.transform.name);
            }
        };
        TestNavigationAgent.prototype.updateNavAgent = function () {
            var deltaTime = this.getDeltaSeconds();
            var normalizedTime = 0;
            if (this.duration >= 0 && this.time >= 0) {
                normalizedTime = (this.time / this.duration);
                this.time += deltaTime;
            }
            if (this.m_playerAgent != null) {
                this.m_playerAgent.heightOffset = 0; // Note: Always Reset Height Offset Here
                var teleporting = this.m_playerAgent.isTeleporting();
                var offmeshlink = this.m_playerAgent.isOnOffMeshLink();
                if (teleporting === true || offmeshlink === true) {
                    if (this.m_charController != null) {
                        this.m_playerAgent.updatePosition = true; // Enable Navigation Agent Movement
                        this.m_charController.updatePosition = false; // Disable Character Controller Movement
                    }
                    else {
                        this.m_playerAgent.updatePosition = true; // Enable Navigation Agent Movement
                    }
                    if (offmeshlink === true) {
                        if (this.time === -1)
                            this.time = 0;
                        if (this.duration === -1)
                            this.duration = this.traversalTime;
                        if (this.jumpCurve != null) {
                            var animationCurveValue = UTIL.SampleAnimationFloat(this.jumpCurve, normalizedTime);
                            this.m_playerAgent.heightOffset = animationCurveValue;
                        }
                    }
                }
                else {
                    if (this.m_charController != null) {
                        this.m_playerAgent.updatePosition = false; // Disable Navigation Agent Movement
                        this.m_charController.updatePosition = true; // Enable Character Controller Movement
                        // Override Character Controller Movement
                        var pos = this.m_playerAgent.getCurrentPosition().clone();
                        pos.y = this.m_charController.getGhostWorldPosition().y;
                        this.m_charController.set(pos.x, pos.y, pos.z);
                    }
                    else {
                        this.m_playerAgent.updatePosition = true; // Enable Navigation Agent Movement 
                    }
                    this.time = -1;
                    this.duration = -1;
                }
            }
        };
        return TestNavigationAgent;
    }(BABYLON.ScriptComponent));
    PROJECT.TestNavigationAgent = TestNavigationAgent;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class TestRootMotion
    */
    var TestRootMotion = /** @class */ (function (_super) {
        __extends(TestRootMotion, _super);
        function TestRootMotion() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.motionType = 0;
            _this.updatePosition = true;
            _this.updateRotation = true;
            _this.moveWithCollisions = false;
            _this.m_animator = null;
            _this.m_character = null;
            _this.m_rigidbody = null;
            return _this;
        }
        TestRootMotion.prototype.awake = function () {
            this.motionType = this.getProperty("motionType", this.motionType);
            this.updatePosition = this.getProperty("updatePosition", this.updatePosition);
            this.updateRotation = this.getProperty("updateRotation", this.updateRotation);
            this.moveWithCollisions = this.getProperty("moveWithCollisions", this.moveWithCollisions);
        };
        TestRootMotion.prototype.start = function () {
            // Attach Animation State
            this.m_animator = this.getComponent("BABYLON.AnimationState");
            if (this.m_animator == null)
                BABYLON.SceneManager.LogWarning("Test Root Motion: Failed to locate animation state for: " + this.transform.name);
            // Setup Root Transform
            if (this.motionType === 1) { // Rigidbody Physics
                this.m_rigidbody = BABYLON.SceneManager.FindScriptComponent(this.transform, "BABYLON.RigidbodyPhysics");
                if (this.m_rigidbody == null)
                    BABYLON.SceneManager.LogWarning("Test Root Motion: Failed to locate rigidbody physics for: " + this.transform.name);
            }
            else if (this.motionType === 2) { // Character Controller
                this.m_character = BABYLON.SceneManager.FindScriptComponent(this.transform, "BABYLON.CharacterController");
                if (this.m_character == null)
                    BABYLON.SceneManager.LogWarning("Test Root Motion: Failed to locate character controller for: " + this.transform.name);
            }
        };
        TestRootMotion.prototype.update = function () {
            this.move();
            this.turn();
        };
        TestRootMotion.prototype.turn = function () {
            if (this.m_animator != null) {
                if (this.updateRotation === true) { // Rotation
                    this.transform.addRotation(0, this.m_animator.getAngularVelocity().y, 0);
                }
            }
        };
        TestRootMotion.prototype.move = function () {
            if (this.m_animator != null) {
                if (this.updatePosition == true) {
                    if (this.motionType === 0) { // Translation
                        if (this.moveWithCollisions === true && this.transform instanceof BABYLON.AbstractMesh) {
                            this.transform.moveWithCollisions(this.m_animator.getDeltaPosition());
                        }
                        else {
                            this.transform.position.addInPlace(this.m_animator.getDeltaPosition());
                        }
                    }
                    else if (this.motionType === 1 && this.m_rigidbody != null) { // Rigidbody Physics
                        this.m_rigidbody.setLinearVelocity(this.m_animator.getDeltaPosition());
                    }
                    else if (this.motionType === 2 && this.m_character != null) { // Character Controller
                        this.m_character.move(this.m_animator.getDeltaPosition());
                    }
                }
            }
        };
        return TestRootMotion;
    }(BABYLON.ScriptComponent));
    PROJECT.TestRootMotion = TestRootMotion;
})(PROJECT || (PROJECT = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon metadata parser class (Internal use only)
     * @class PerlinNoiseGenerator - All rights reserved (c) 2020 Mackey Kinard
     */
    var PerlinNoiseGenerator = /** @class */ (function () {
        function PerlinNoiseGenerator() {
        }
        PerlinNoiseGenerator.rand_vect = function () {
            var theta = Math.random() * 2 * Math.PI;
            return { x: Math.cos(theta), y: Math.sin(theta) };
        };
        PerlinNoiseGenerator.dot_prod_grid = function (x, y, vx, vy) {
            var g_vect;
            var d_vect = { x: x - vx, y: y - vy };
            if (PerlinNoiseGenerator.gradients[[vx, vy]]) {
                g_vect = PerlinNoiseGenerator.gradients[[vx, vy]];
            }
            else {
                g_vect = PerlinNoiseGenerator.rand_vect();
                PerlinNoiseGenerator.gradients[[vx, vy]] = g_vect;
            }
            return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
        };
        PerlinNoiseGenerator.smootherstep = function (x) {
            return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
        };
        PerlinNoiseGenerator.interp = function (x, a, b) {
            return a + PerlinNoiseGenerator.smootherstep(x) * (b - a);
        };
        /** Seed perlin noise generator */
        PerlinNoiseGenerator.seed = function () {
            PerlinNoiseGenerator.gradients = {};
        };
        /** Generate perlin noise value from 2D coordinates. (Note: Use normalized input values) */
        PerlinNoiseGenerator.generate = function (x, y) {
            var xf = Math.floor(x);
            var yf = Math.floor(y);
            //interpolate
            var tl = PerlinNoiseGenerator.dot_prod_grid(x, y, xf, yf);
            var tr = PerlinNoiseGenerator.dot_prod_grid(x, y, xf + 1, yf);
            var bl = PerlinNoiseGenerator.dot_prod_grid(x, y, xf, yf + 1);
            var br = PerlinNoiseGenerator.dot_prod_grid(x, y, xf + 1, yf + 1);
            var xt = PerlinNoiseGenerator.interp(x - xf, tl, tr);
            var xb = PerlinNoiseGenerator.interp(x - xf, bl, br);
            return PerlinNoiseGenerator.interp(y - yf, xt, xb);
        };
        PerlinNoiseGenerator.gradients = {};
        return PerlinNoiseGenerator;
    }());
    BABYLON.PerlinNoiseGenerator = PerlinNoiseGenerator;
})(BABYLON || (BABYLON = {}));
BABYLON.PerlinNoiseGenerator.seed();
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon windows platform pro class
     * @class WindowsPlatform - All rights reserved (c) 2020 Mackey Kinard
     */
    var WindowsPlatform = /** @class */ (function () {
        function WindowsPlatform() {
        }
        /** Is xbox live user signed in if platform services enabled. (WinRT) */
        WindowsPlatform.IsXboxLiveUserSignedIn = function (systemUser, player) {
            if (systemUser === void 0) { systemUser = null; }
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            if (BABYLON.SceneManager.IsWindows()) {
                var user = (systemUser != null) ? BABYLON.WindowsPlatform.GetXboxLiveSystemUser(systemUser, player) : BABYLON.WindowsPlatform.GetXboxLiveUser(player);
                return (user != null && user.isSignedIn == true);
            }
            else {
                return false;
            }
        };
        /** Validated sign in xbox live user if platform services available. (WinRT) */
        WindowsPlatform.XboxLiveUserSignIn = function (player, oncomplete, onerror, onprogress) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            if (BABYLON.SceneManager.IsWindows()) {
                BABYLON.WindowsPlatform.XboxLiveUserSilentSignIn(player, function (first) {
                    if (first.status === Microsoft.Xbox.Services.System.SignInStatus.userInteractionRequired) {
                        BABYLON.WindowsPlatform.XboxLiveUserDialogSignIn(player, function (second) {
                            if (oncomplete)
                                oncomplete(second);
                        }, onerror, onprogress);
                    }
                    else {
                        if (oncomplete)
                            oncomplete(first);
                    }
                }, onerror, onprogress);
            }
        };
        /** Silent sign in xbox live user if platform services available. (WinRT) */
        WindowsPlatform.XboxLiveUserSilentSignIn = function (player, oncomplete, onerror, onprogress) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            return (BABYLON.SceneManager.IsWindows()) ? BABYLON.WindowsPlatform.GetXboxLiveUser(player).signInSilentlyAsync(null).then(oncomplete, onerror, onprogress) : null;
        };
        /** Dialog sign in xbox live user if platform services available. (WinRT) */
        WindowsPlatform.XboxLiveUserDialogSignIn = function (player, oncomplete, onerror, onprogress) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            return (BABYLON.SceneManager.IsWindows()) ? BABYLON.WindowsPlatform.GetXboxLiveUser(player).signInAsync(null).then(oncomplete, onerror, onprogress) : null;
        };
        /** Loads a xbox live user profile if platform services available. (WinRT) */
        WindowsPlatform.LoadXboxLiveUserProfile = function (player, oncomplete, onerror, onprogress) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            return (BABYLON.SceneManager.IsWindows()) ? BABYLON.WindowsPlatform.GetXboxLiveUserContext(player).profileService.getUserProfileAsync(BABYLON.WindowsPlatform.GetXboxLiveUser(player).xboxUserId).then(oncomplete, onerror, onprogress) : null;
        };
        // ************************************** //
        // * Babylon Xbox Live Player Functions * //
        // ************************************** //
        /** Get xbox live user if platform services available. (WinRT) */
        WindowsPlatform.GetXboxLiveUser = function (player) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            var user = null;
            if (BABYLON.SceneManager.IsWindows()) {
                switch (player) {
                    case BABYLON.PlayerNumber.One:
                        user = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveUserOne();
                        break;
                    case BABYLON.PlayerNumber.Two:
                        user = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveUserTwo();
                        break;
                    case BABYLON.PlayerNumber.Three:
                        user = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveUserThree();
                        break;
                    case BABYLON.PlayerNumber.Four:
                        user = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveUserFour();
                        break;
                }
            }
            return user;
        };
        /** Get xbox live user if platform services available. (WinRT) */
        WindowsPlatform.GetXboxLiveSystemUser = function (systemUser, player) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            var user = null;
            if (BABYLON.SceneManager.IsWindows()) {
                switch (player) {
                    case BABYLON.PlayerNumber.One:
                        user = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveSystemUserOne(systemUser);
                        break;
                    case BABYLON.PlayerNumber.Two:
                        user = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveSystemUserTwo(systemUser);
                        break;
                    case BABYLON.PlayerNumber.Three:
                        user = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveSystemUserThree(systemUser);
                        break;
                    case BABYLON.PlayerNumber.Four:
                        user = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveSystemUserFour(systemUser);
                        break;
                }
            }
            return user;
        };
        /** Get xbox live user context if platform services available. (WinRT) */
        WindowsPlatform.GetXboxLiveUserContext = function (player) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            var context = null;
            if (BABYLON.SceneManager.IsWindows()) {
                switch (player) {
                    case BABYLON.PlayerNumber.One:
                        context = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveContextOne();
                        break;
                    case BABYLON.PlayerNumber.Two:
                        context = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveContextTwo();
                        break;
                    case BABYLON.PlayerNumber.Three:
                        context = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveContextThree();
                        break;
                    case BABYLON.PlayerNumber.Four:
                        context = window.BabylonToolkit.XboxLive.Plugin.getXboxLiveContextFour();
                        break;
                }
            }
            return context;
        };
        /** Resets xbox live user context if platform services available. (WinRT) */
        WindowsPlatform.ResetXboxLiveUserContext = function (player) {
            if (player === void 0) { player = BABYLON.PlayerNumber.One; }
            if (BABYLON.SceneManager.IsWindows()) {
                switch (player) {
                    case BABYLON.PlayerNumber.One:
                        window.BabylonToolkit.XboxLive.Plugin.resetXboxLiveUserContextOne();
                        break;
                    case BABYLON.PlayerNumber.Two:
                        window.BabylonToolkit.XboxLive.Plugin.resetXboxLiveUserContextTwo();
                        break;
                    case BABYLON.PlayerNumber.Three:
                        window.BabylonToolkit.XboxLive.Plugin.resetXboxLiveUserContextThree();
                        break;
                    case BABYLON.PlayerNumber.Four:
                        window.BabylonToolkit.XboxLive.Plugin.resetXboxLiveUserContextFour();
                        break;
                }
            }
        };
        // *************************************** //
        // * Babylon Xbox Live Context Functions * //
        // *************************************** //
        /** Get xbox live context property if platform services available. (WinRT) */
        WindowsPlatform.GetXboxLiveContextProperty = function (name) {
            return (BABYLON.SceneManager.IsWindows()) ? window.BabylonToolkit.XboxLive.Plugin.getXboxLiveContextProperty(name) : null;
        };
        /** Get xbox live context property if platform services available. (WinRT) */
        WindowsPlatform.SetXboxLiveContextProperty = function (name, property) {
            if (BABYLON.SceneManager.IsWindows()) {
                window.BabylonToolkit.XboxLive.Plugin.setXboxLiveContextProperty(name, property);
            }
        };
        /** Resets xbox live property context bag if platform services available. (WinRT) */
        WindowsPlatform.ResetXboxLivePropertyContexts = function () {
            if (BABYLON.SceneManager.IsWindows()) {
                window.BabylonToolkit.XboxLive.Plugin.resetXboxLivePropertyContexts();
            }
        };
        // **************************************** //
        // * Babylon Xbox Live Sign Out Functions * //
        // **************************************** //
        /** Sets the Xbox User Sign Out Complete Handler (WinRT) */
        WindowsPlatform.SetXboxLiveSignOutHandler = function (handler) {
            if (handler === void 0) { handler = null; }
            if (BABYLON.SceneManager.IsWindows()) {
                window.BabylonToolkit.XboxLive.Plugin.onusersignout = handler;
            }
        };
        return WindowsPlatform;
    }());
    BABYLON.WindowsPlatform = WindowsPlatform;
})(BABYLON || (BABYLON = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon TypeScript File
     * @script Application
     */
    var Application = /** @class */ (function () {
        function Application() {
        }
        Application.Key = "glaUsRL0CmJhuYSQ1Jm7qFRK9UobDzYBg6u8PGlMEPOlMTEe6TH4hcaHOAFzlkXDXkZO1b";
        return Application;
    }());
    PROJECT.Application = Application;
})(PROJECT || (PROJECT = {}));
/**
 * 8th Wall Generic API
 */
var XR8 = window.XR8;
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class XRCamera8
    */
    var XRCamera8 = /** @class */ (function (_super) {
        __extends(XRCamera8, _super);
        function XRCamera8() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.XRCameraBehavior = false;
            return _this;
        }
        // Example: private helloWorld:string = "Hello World";
        XRCamera8.prototype.awake = function () {
            /* Init component function */
        };
        XRCamera8.prototype.start = function () {
            /* Start render loop function */
        };
        XRCamera8.prototype.update = function () {
            /* Update render loop function */
        };
        XRCamera8.prototype.late = function () {
            /* Late update render loop function */
        };
        XRCamera8.prototype.after = function () {
            /* After update render loop function */
        };
        XRCamera8.prototype.fixed = function () {
            /* Fixed update physics step function */
        };
        XRCamera8.prototype.ready = function () {
            /* Execute when scene is ready function */
            if (this.XRCameraBehavior === true) {
                this.setupCameraSystem8();
            }
        };
        XRCamera8.prototype.destroy = function () {
            /* Destroy component function */
        };
        XRCamera8.prototype.setupCameraSystem8 = function () {
            var camera = PROJECT.UniversalCameraSystem.GetMainCamera(this.scene);
            //const runConfig = {
            //    cameraConfig: {XR8.XrConfig.camera().FRONT},
            //    allowedDevices: XR8.XrConfig.device().ANY,
            //    verbose: true,
            //}
            //camera.addBehavior(XR8.Babylonjs.faceCameraBehavior(runConfig)) // Connect camera to XR and show camera feed.
            camera.addBehavior(XR8.Babylonjs.xrCameraBehavior(), true);
            console.log("XR Camera Behavior Added: " + this.transform.name);
        };
        return XRCamera8;
    }(BABYLON.ScriptComponent));
    PROJECT.XRCamera8 = XRCamera8;
})(PROJECT || (PROJECT = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon animation state pro class (Unity Style Mechanim Animation System)
     * @class AnimationState - All rights reserved (c) 2020 Mackey Kinard
     */
    var AnimationState = /** @class */ (function (_super) {
        __extends(AnimationState, _super);
        function AnimationState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._frametime = 0;
            _this._layercount = 0;
            _this._updatemode = 0;
            _this._hasrootmotion = false;
            _this._initialtargetblending = false;
            _this._hastransformhierarchy = false;
            _this._leftfeetbottomheight = 0;
            _this._rightfeetbottomheight = 0;
            _this._runtimecontroller = null;
            _this._executed = false;
            _this._checkers = new BABYLON.TransitionCheck();
            _this._source = "";
            _this._machine = null;
            _this._deltaPosition = new BABYLON.Vector3(0, 0, 0);
            _this._deltaRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            _this._positionWeight = false;
            _this._rootBoneWeight = false;
            _this._rotationWeight = false;
            _this._rootQuatWeight = false;
            //private _linearVelocity:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            _this._angularVelocity = new BABYLON.Vector3(0, 0, 0);
            _this._positionHolder = new BABYLON.Vector3(0, 0, 0);
            _this._rootBoneHolder = new BABYLON.Vector3(0, 0, 0);
            _this._rotationHolder = new BABYLON.Quaternion(0, 0, 0, 1);
            _this._rootQuatHolder = new BABYLON.Quaternion(0, 0, 0, 1);
            _this._rootMotionMatrix = BABYLON.Matrix.Zero();
            _this._rootMotionScaling = new BABYLON.Vector3(0, 0, 0);
            _this._rootMotionRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            _this._rootMotionPosition = new BABYLON.Vector3(0, 0, 0);
            _this._lastMotionRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            _this._lastMotionPosition = new BABYLON.Vector3(0, 0, 0);
            _this._deltaPositionFixed = new BABYLON.Vector3(0, 0, 0);
            _this._deltaPositionMatrix = new BABYLON.Matrix();
            _this._saveDeltaPosition = new BABYLON.Vector3(0, 0, 0);
            _this._saveDeltaRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            _this._dirtyMotionMatrix = null;
            _this._dirtyBlenderMatrix = null;
            //private _bodyOrientationAngleY:number = 0;
            //private transformForwardVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            //private transformRightVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            //private desiredForwardVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            //private desiredRightVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            _this._targetPosition = new BABYLON.Vector3(0, 0, 0);
            _this._targetRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            _this._targetScaling = new BABYLON.Vector3(1, 1, 1);
            _this._updateMatrix = BABYLON.Matrix.Zero();
            _this._blenderMatrix = BABYLON.Matrix.Zero();
            _this._blendWeights = new BABYLON.BlendingWeights();
            _this._emptyScaling = new BABYLON.Vector3(1, 1, 1);
            _this._emptyPosition = new BABYLON.Vector3(0, 0, 0);
            _this._emptyRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            _this._data = new Map();
            _this._anims = new Map();
            _this._numbers = new Map();
            _this._booleans = new Map();
            _this._triggers = new Map();
            _this._parameters = new Map();
            _this.speedRatio = 1.0;
            _this.updatePosition = false;
            _this.updateRotation = false;
            _this.applyRootMotion = false;
            _this.enableAnimation = true;
            _this.moveWithCollisions = false;
            /** Register handler that is triggered when the animation ik setup has been triggered */
            _this.onAnimationIKObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the animation end has been triggered */
            _this.onAnimationEndObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the animation loop has been triggered */
            _this.onAnimationLoopObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the animation event has been triggered */
            _this.onAnimationEventObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the animation frame has been updated */
            _this.onAnimationUpdateObservable = new BABYLON.Observable();
            _this.m_avatarMask = null;
            _this.m_defaultGroup = null;
            _this.m_animationTargets = null;
            _this.m_characterController = null;
            return _this;
        }
        AnimationState.prototype.hasRootMotion = function () { return this._hasrootmotion; };
        AnimationState.prototype.getAnimationTime = function () { return this._frametime; };
        AnimationState.prototype.getDeltaPosition = function () { return this._deltaPositionFixed; };
        AnimationState.prototype.getDeltaRotation = function () { return this._deltaRotation; };
        AnimationState.prototype.getAngularVelocity = function () { return this._angularVelocity; };
        AnimationState.prototype.getRootMotionAngle = function () { return this._angularVelocity.y; };
        AnimationState.prototype.getRootMotionSpeed = function () { return this._deltaPosition.length(); };
        AnimationState.prototype.getCharacterController = function () { return this.m_characterController; };
        AnimationState.prototype.getRuntimeController = function () { return this._runtimecontroller; };
        AnimationState.prototype.awake = function () { this.awakeStateMachine(); };
        AnimationState.prototype.update = function () { this.updateStateMachine(); };
        AnimationState.prototype.destroy = function () { this.destroyStateMachine(); };
        /////////////////////////////////////////////////////////////////////////////////////
        // State Machine Functions
        /////////////////////////////////////////////////////////////////////////////////////
        AnimationState.prototype.playAnimation = function (state, transitionDuration, animationLayer, frameRate) {
            if (transitionDuration === void 0) { transitionDuration = 0; }
            if (animationLayer === void 0) { animationLayer = 0; }
            if (frameRate === void 0) { frameRate = null; }
            var result = false;
            if (this._machine.layers != null && this._machine.layers.length > animationLayer) {
                var layer = this._machine.layers[animationLayer];
                var blendFrameRate = (layer.animationStateMachine != null) ? (layer.animationStateMachine.rate || BABYLON.AnimationState.FPS) : BABYLON.AnimationState.FPS;
                var blendingSpeed = (transitionDuration > 0) ? BABYLON.Utilities.ComputeBlendingSpeed(frameRate || blendFrameRate, transitionDuration) : 0;
                this.setCurrentAnimationState(layer, state, blendingSpeed);
                result = true;
            }
            else {
                BABYLON.Tools.Warn("No animation state layers on " + this.transform.name);
            }
            return result;
        };
        /////////////////////////////////////////////////////////////////////////////////////
        // State Machine Functions
        /////////////////////////////////////////////////////////////////////////////////////
        AnimationState.prototype.getBool = function (name) {
            return this._booleans.get(name) || false;
        };
        AnimationState.prototype.setBool = function (name, value) {
            this._booleans.set(name, value);
        };
        AnimationState.prototype.getFloat = function (name) {
            return this._numbers.get(name) || 0;
        };
        AnimationState.prototype.setFloat = function (name, value) {
            this._numbers.set(name, value);
        };
        AnimationState.prototype.getInteger = function (name) {
            return this._numbers.get(name) || 0;
        };
        AnimationState.prototype.setInteger = function (name, value) {
            this._numbers.set(name, value);
        };
        AnimationState.prototype.getTrigger = function (name) {
            return this._triggers.get(name) || false;
        };
        AnimationState.prototype.setTrigger = function (name) {
            this._triggers.set(name, true);
        };
        AnimationState.prototype.resetTrigger = function (name) {
            this._triggers.set(name, false);
        };
        AnimationState.prototype.getMachineState = function (name) {
            return this._data.get(name);
        };
        AnimationState.prototype.setMachineState = function (name, value) {
            this._data.set(name, value);
        };
        AnimationState.prototype.getCurrentState = function (layer) {
            return (this._machine.layers != null && this._machine.layers.length > layer) ? this._machine.layers[layer].animationStateMachine : null;
        };
        AnimationState.prototype.getAnimationGroup = function (name) {
            return this._anims.get(name);
        };
        AnimationState.prototype.getAnimationGroups = function () {
            return this._anims;
        };
        AnimationState.prototype.setAnimationGroups = function (groups, remapTargets) {
            var _this = this;
            if (remapTargets === void 0) { remapTargets = false; }
            // ..
            // TODO - Handle Remap Animation Targets
            // ..
            if (groups != null && groups.length > 0) {
                this._anims = new Map();
                this.m_animationTargets = [];
                this.m_defaultGroup = groups[0];
                groups.forEach(function (group) {
                    var agroup = group;
                    try {
                        group.stop();
                    }
                    catch (_a) { }
                    if (group.targetedAnimations != null && group.targetedAnimations.length > 0) {
                        group.targetedAnimations.forEach(function (targetedAnimation) {
                            // Note: For Loop Faster Than IndexOf
                            var indexOfTarget = -1;
                            for (var i = 0; i < _this.m_animationTargets.length; i++) {
                                if (_this.m_animationTargets[i].target === targetedAnimation.target) {
                                    indexOfTarget = i;
                                    break;
                                }
                            }
                            if (indexOfTarget < 0) {
                                _this.m_animationTargets.push(targetedAnimation);
                                if (targetedAnimation.target.metadata == null)
                                    targetedAnimation.target.metadata = {};
                                if (targetedAnimation.target instanceof BABYLON.TransformNode) {
                                    BABYLON.Utilities.ValidateTransformQuaternion(targetedAnimation.target);
                                    var layerMixers = [];
                                    for (var index = 0; index < _this._layercount; index++) {
                                        var layerMixer = new BABYLON.AnimationMixer();
                                        layerMixer.positionBuffer = null;
                                        layerMixer.rotationBuffer = null;
                                        layerMixer.scalingBuffer = null;
                                        layerMixer.originalMatrix = null;
                                        layerMixer.blendingFactor = 0;
                                        layerMixer.blendingSpeed = 0;
                                        layerMixer.rootPosition = null;
                                        layerMixer.rootRotation = null;
                                        layerMixers.push(layerMixer);
                                    }
                                    targetedAnimation.target.metadata.mixer = layerMixers;
                                }
                                else if (targetedAnimation.target instanceof BABYLON.MorphTarget) {
                                    var morphLayerMixers = [];
                                    for (var index = 0; index < _this._layercount; index++) {
                                        var morphLayerMixer = new BABYLON.AnimationMixer();
                                        morphLayerMixer.influenceBuffer = null;
                                        morphLayerMixers.push(morphLayerMixer);
                                    }
                                    targetedAnimation.target.metadata.mixer = morphLayerMixers;
                                }
                            }
                        });
                    }
                    if (agroup != null && agroup.metadata != null && agroup.metadata.unity != null && agroup.metadata.unity.clip != null && agroup.metadata.unity.clip !== "") {
                        _this._anims.set(agroup.metadata.unity.clip, group);
                    }
                });
            }
        };
        /* Animation Controller State Machine Functions */
        AnimationState.prototype.awakeStateMachine = function () {
            var _this = this;
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
            this.m_animationTargets = [];
            this.m_defaultGroup = null;
            this.m_avatarMask = new Map();
            this.m_characterController = this.getComponent("BABYLON.CharacterController");
            // ..
            this._source = (this.transform.metadata != null && this.transform.metadata.unity != null && this.transform.metadata.unity.animator != null && this.transform.metadata.unity.animator !== "") ? this.transform.metadata.unity.animator : null;
            this._machine = this.getProperty("machine", this._machine);
            this._updatemode = this.getProperty("updatemode", this._updatemode);
            this._hasrootmotion = this.getProperty("hasrootmotion", this._hasrootmotion);
            this._runtimecontroller = this.getProperty("runtimecontroller", this._runtimecontroller);
            this._hastransformhierarchy = this.getProperty("hastransformhierarchy", this._hastransformhierarchy);
            this._leftfeetbottomheight = this.getProperty("leftfeetbottomheight", this._leftfeetbottomheight);
            this._rightfeetbottomheight = this.getProperty("rightfeetbottomheight", this._rightfeetbottomheight);
            this.applyRootMotion = this.getProperty("applyrootmotion", this.applyRootMotion);
            // ..
            if (this._machine != null) {
                if (this._machine.speed != null) {
                    this.speedRatio = this._machine.speed;
                }
                if (this._machine.parameters != null && this._machine.parameters.length > 0) {
                    var plist = this._machine.parameters;
                    plist.forEach(function (parameter) {
                        var name = parameter.name;
                        var type = parameter.type;
                        var curve = parameter.curve;
                        var defaultFloat = parameter.defaultFloat;
                        var defaultBool = parameter.defaultBool;
                        var defaultInt = parameter.defaultInt;
                        _this._parameters.set(name, type);
                        if (type === BABYLON.AnimatorParameterType.Bool) {
                            _this.setBool(name, defaultBool);
                        }
                        else if (type === BABYLON.AnimatorParameterType.Float) {
                            _this.setFloat(name, defaultFloat);
                        }
                        else if (type === BABYLON.AnimatorParameterType.Int) {
                            _this.setInteger(name, defaultInt);
                        }
                        else if (type === BABYLON.AnimatorParameterType.Trigger) {
                            _this.resetTrigger(name);
                        }
                    });
                }
                // ..
                // Process Machine State Layers
                // ..
                if (this._machine.layers != null && this._machine.layers.length > 0) {
                    this._layercount = this._machine.layers.length;
                    // Sort In Ascending Order
                    this._machine.layers.sort(function (left, right) {
                        if (left.index < right.index)
                            return -1;
                        if (left.index > right.index)
                            return 1;
                        return 0;
                    });
                    // Parse State Machine Layers
                    this._machine.layers.forEach(function (layer) {
                        // Set Layer Avatar Mask Transform Path
                        if (layer.avatarMask != null && layer.avatarMask.transformPaths != null && layer.avatarMask.transformPaths.length > 0) {
                            for (var i = 0; i < layer.avatarMask.transformPaths.length; i++) {
                                _this.m_avatarMask.set(layer.avatarMask.transformPaths[i], i);
                            }
                        }
                    });
                }
            }
            if (this._source != null && this._source !== "" && this.scene.animationGroups != null) {
                var sourceanims_1 = null;
                // ..
                // TODO - Optimize Searching Global Animation Groups - ???
                // ..
                this.scene.animationGroups.forEach(function (group) {
                    var agroup = group;
                    if (agroup != null && agroup.metadata != null && agroup.metadata.unity != null && agroup.metadata.unity.source != null && agroup.metadata.unity.source !== "") {
                        if (agroup.metadata.unity.source === _this._source) {
                            if (sourceanims_1 == null)
                                sourceanims_1 = [];
                            sourceanims_1.push(group);
                        }
                    }
                });
                if (sourceanims_1 != null && sourceanims_1.length > 0) {
                    this.setAnimationGroups(sourceanims_1);
                }
            }
            // ..
            // Map State Machine Tracks (Animation Groups)
            // ..
            if (this._machine != null && this._machine.states != null && this._machine.states.length > 0) {
                this._machine.states.forEach(function (state) {
                    if (state != null && state.name != null) {
                        // Set Custom Animation Curves
                        if (state.ccurves != null && state.ccurves.length > 0) {
                            state.ccurves.forEach(function (curve) {
                                if (curve.animation != null) {
                                    var anim = BABYLON.Animation.Parse(curve.animation);
                                    if (anim != null) {
                                        if (state.tcurves == null)
                                            state.tcurves = [];
                                        state.tcurves.push(anim);
                                    }
                                }
                            });
                        }
                        // Setup Animation State Machines
                        _this.setupTreeBranches(state.blendtree);
                        _this.setMachineState(state.name, state);
                    }
                });
            }
            // DEBUG: Dump State Machine Debug Information
            // console.warn("*** Animation State Machine: " + this.transform.name);
            // console.log(this);
        };
        AnimationState.prototype.updateStateMachine = function (deltaTime) {
            var _this = this;
            if (deltaTime === void 0) { deltaTime = null; }
            if (this.getReadyState() === true) {
                if (this._executed === false) {
                    this._executed = true;
                    if (this._machine.layers != null && this._machine.layers.length > 0) {
                        this._machine.layers.forEach(function (layer) {
                            _this.setCurrentAnimationState(layer, layer.entry, 0);
                        });
                    }
                }
                if (this.enableAnimation === true) {
                    var frameDeltaTime = deltaTime || this.getDeltaSeconds();
                    this.updateAnimationState(frameDeltaTime);
                    this.updateAnimationTargets(frameDeltaTime);
                    if (this.onAnimationUpdateObservable.hasObservers() === true) {
                        this.onAnimationUpdateObservable.notifyObservers(this.transform);
                    }
                }
            }
        };
        AnimationState.prototype.destroyStateMachine = function () {
            this._data = null;
            this._anims = null;
            this._numbers = null;
            this._booleans = null;
            this._triggers = null;
            this._parameters = null;
            this._checkers = null;
            this._machine = null;
            this.onAnimationIKObservable.clear();
            this.onAnimationIKObservable = null;
            this.onAnimationEndObservable.clear();
            this.onAnimationEndObservable = null;
            this.onAnimationLoopObservable.clear();
            this.onAnimationLoopObservable = null;
            this.onAnimationEventObservable.clear();
            this.onAnimationEventObservable = null;
            this.onAnimationUpdateObservable.clear();
            this.onAnimationUpdateObservable = null;
        };
        /* Animation Controller Private Update Functions */
        AnimationState.prototype.updateAnimationState = function (deltaTime) {
            var _this = this;
            if (this._machine.layers != null && this._machine.layers.length > 0) {
                this._machine.layers.forEach(function (layer) {
                    _this.checkStateMachine(layer, deltaTime);
                });
            }
        };
        AnimationState.prototype.updateAnimationTargets = function (deltaTime) {
            var _this = this;
            //this._bodyOrientationAngleY = 0;
            if (this.transform.rotationQuaternion != null) {
                //this._bodyOrientationAngleY = this.transform.rotationQuaternion.toEulerAngles().y; // TODO - OPTIMIZE THIS
            }
            else if (this.transform.rotation != null) {
                //this._bodyOrientationAngleY = this.transform.rotation.y;
            }
            if (this._machine.layers != null && this._machine.layers.length > 0) {
                this._machine.layers.forEach(function (layer) {
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (layer.index === 0)
                        _this._frametime = layer.animationTime; // Note: Update Master Animation Frame Time
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (layer.animationStateMachine != null && layer.animationStateMachine.blendtree != null) {
                        if (layer.iKPass === true && _this.onAnimationIKObservable.hasObservers() === true) {
                            _this.onAnimationIKObservable.notifyObservers(layer.index);
                        }
                        var layerState = layer.animationStateMachine;
                        if (layerState.type === BABYLON.MotionType.Clip && layerState.played !== -1)
                            layerState.played += deltaTime;
                        if (layerState.blendtree.children != null && layerState.blendtree.children.length > 0) {
                            var primaryBlendTree = layerState.blendtree.children[0];
                            if (primaryBlendTree != null) {
                                if (layerState.blendtree.blendType == BABYLON.BlendTreeType.Clip) {
                                    var animationTrack = primaryBlendTree.track;
                                    if (animationTrack != null) {
                                        var frameRatio = (BABYLON.AnimationState.TIME / animationTrack.to);
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Motion Clip Animation Timeline
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        layer.animationNormal = (layer.animationTime / BABYLON.AnimationState.TIME); // Note: Normalize Layer Frame Time
                                        var validateTime = (layer.animationNormal > 0.99) ? 1 : layer.animationNormal;
                                        var formattedTime_1 = Math.round(validateTime * 100) / 100;
                                        if (layerState.speed < 0)
                                            layer.animationNormal = (1 - layer.animationNormal); // Note: Reverse Normalized Frame Time
                                        var animationFrameTime_1 = (animationTrack.to * layer.animationNormal); // Note: Denormalize Animation Frame Time
                                        // DEBUG: Animation Time
                                        // if (layer.index === 0) {
                                        //    const msg:string = "Animation Time: " + layer.animationNormal + " --> " + animationFrameTime;
                                        //    console.warn(msg);
                                        // }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // let additivereferenceposeclip:number = 0;
                                        // let additivereferenceposetime:number = 0.0;
                                        // let hasadditivereferencepose:boolean = false;
                                        // let starttime:number = 0.0;
                                        // let stoptime:number = 0.0;
                                        // let mirror:boolean = false;
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        var level_1 = 0.0;
                                        var xspeed = 0.0;
                                        var zspeed = 0.0;
                                        var looptime = false;
                                        var loopblend = false;
                                        var cycleoffset = 0.0;
                                        var heightfromfeet = false;
                                        var correctionoffsety_1 = 0.0;
                                        var orientationoffsety_1 = 0.0;
                                        var keeporiginalorientation_1 = false;
                                        var keeporiginalpositionxz = false;
                                        var keeporiginalpositiony = false;
                                        var loopblendorientation_1 = false;
                                        var loopblendpositiony_1 = false;
                                        var loopblendpositionxz_1 = false;
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        var agroup = animationTrack;
                                        if (agroup.metadata != null && agroup.metadata.unity != null) {
                                            if (agroup.metadata.unity.averagespeed != null) {
                                                xspeed = (agroup.metadata.unity.averagespeed.x != null) ? agroup.metadata.unity.averagespeed.x : 0;
                                                zspeed = (agroup.metadata.unity.averagespeed.z != null) ? agroup.metadata.unity.averagespeed.z : 0;
                                            }
                                            if (agroup.metadata.unity.settings != null) {
                                                level_1 = (agroup.metadata.unity.settings.level != null) ? agroup.metadata.unity.settings.level : 0;
                                                looptime = (agroup.metadata.unity.settings.looptime != null) ? agroup.metadata.unity.settings.looptime : false;
                                                loopblend = (agroup.metadata.unity.settings.loopblend != null) ? agroup.metadata.unity.settings.loopblend : false;
                                                cycleoffset = (agroup.metadata.unity.settings.cycleoffset != null) ? agroup.metadata.unity.settings.cycleoffset : 0;
                                                heightfromfeet = (agroup.metadata.unity.settings.heightfromfeet != null) ? agroup.metadata.unity.settings.heightfromfeet : false;
                                                correctionoffsety_1 = (agroup.metadata.unity.settings.orientationoffsety != null) ? agroup.metadata.unity.settings.orientationoffsety : 0;
                                                // DEPRECIATED: orientationoffsety = (agroup.metadata.unity.settings.orientationoffsety != null) ? agroup.metadata.unity.settings.orientationoffsety : 0;
                                                keeporiginalorientation_1 = (agroup.metadata.unity.settings.keeporiginalorientation != null) ? agroup.metadata.unity.settings.keeporiginalorientation : false;
                                                keeporiginalpositionxz = (agroup.metadata.unity.settings.keeporiginalpositionxz != null) ? agroup.metadata.unity.settings.keeporiginalpositionxz : false;
                                                keeporiginalpositiony = (agroup.metadata.unity.settings.keeporiginalpositiony != null) ? agroup.metadata.unity.settings.keeporiginalpositiony : false;
                                                loopblendorientation_1 = (agroup.metadata.unity.settings.loopblendorientation != null) ? agroup.metadata.unity.settings.loopblendorientation : false;
                                                loopblendpositiony_1 = (agroup.metadata.unity.settings.loopblendpositiony != null) ? agroup.metadata.unity.settings.loopblendpositiony : false;
                                                loopblendpositionxz_1 = (agroup.metadata.unity.settings.loopblendpositionxz != null) ? agroup.metadata.unity.settings.loopblendpositionxz : false;
                                            }
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Unity Inverts Root Motion Animation Offsets
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // DEPRECIATED: orientationoffsety = BABYLON.Tools.ToRadians(orientationoffsety);
                                        // DEPRECIATED: orientationoffsety *= -1;
                                        correctionoffsety_1 = Math.abs(correctionoffsety_1); // In Degrees
                                        xspeed = Math.abs(xspeed);
                                        zspeed = Math.abs(zspeed);
                                        level_1 *= -1;
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationTime >= BABYLON.AnimationState.TIME) {
                                            layer.animationFirstRun = false;
                                            layer.animationLoopFrame = true;
                                            if (looptime === true) {
                                                if (_this.onAnimationLoopObservable.hasObservers() === true) {
                                                    _this.onAnimationLoopObservable.notifyObservers(layer.index);
                                                }
                                            }
                                            else {
                                                if (layer.animationEndFrame === false) {
                                                    layer.animationEndFrame = true;
                                                    if (_this.onAnimationEndObservable.hasObservers() === true) {
                                                        _this.onAnimationEndObservable.notifyObservers(layer.index);
                                                    }
                                                }
                                            }
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationFirstRun === true || looptime === true) {
                                            animationTrack.targetedAnimations.forEach(function (targetedAnim) {
                                                if (targetedAnim.target instanceof BABYLON.TransformNode) {
                                                    var clipTarget = targetedAnim.target;
                                                    if (layer.index === 0 || layer.avatarMask == null || _this.filterTargetAvatarMask(layer, clipTarget)) {
                                                        var targetRootBone = (clipTarget.metadata != null && clipTarget.metadata.unity != null && clipTarget.metadata.unity.rootbone != null) ? clipTarget.metadata.unity.rootbone : false;
                                                        if (clipTarget.metadata != null && clipTarget.metadata.mixer != null) {
                                                            var clipTargetMixer = clipTarget.metadata.mixer[layer.index];
                                                            if (clipTargetMixer != null) {
                                                                if (targetedAnim.animation.targetProperty === "position") {
                                                                    _this._targetPosition = BABYLON.Utilities.SampleAnimationVector3(targetedAnim.animation, animationFrameTime_1);
                                                                    // ..
                                                                    // Handle Root Motion (Position)
                                                                    // ..
                                                                    if (targetRootBone === true) {
                                                                        _this._positionWeight = false;
                                                                        _this._positionHolder.set(0, 0, 0);
                                                                        _this._rootBoneWeight = false;
                                                                        _this._rootBoneHolder.set(0, 0, 0);
                                                                        // ..
                                                                        // Apply Root Motion
                                                                        // ..
                                                                        if (_this.applyRootMotion === true) {
                                                                            if (loopblendpositiony_1 === true && loopblendpositionxz_1 === true) {
                                                                                _this._positionWeight = true; // Bake XYZ Into Pose
                                                                                _this._positionHolder.set(_this._targetPosition.x, (_this._targetPosition.y + level_1), _this._targetPosition.z);
                                                                            }
                                                                            else if (loopblendpositiony_1 === false && loopblendpositionxz_1 === false) {
                                                                                _this._rootBoneWeight = true; // Use XYZ As Root Motion
                                                                                _this._rootBoneHolder.set(_this._targetPosition.x, (_this._targetPosition.y + level_1), _this._targetPosition.z);
                                                                            }
                                                                            else if (loopblendpositiony_1 === true && loopblendpositionxz_1 === false) {
                                                                                _this._positionWeight = true; // Bake Y Into Pose 
                                                                                _this._positionHolder.set(0, (_this._targetPosition.y + level_1), 0);
                                                                                _this._rootBoneWeight = true; // Use XZ As Root Motion
                                                                                _this._rootBoneHolder.set(_this._targetPosition.x, 0, _this._targetPosition.z);
                                                                            }
                                                                            else if (loopblendpositionxz_1 === true && loopblendpositiony_1 === false) {
                                                                                _this._positionWeight = true; // Bake XZ Into Pose
                                                                                _this._positionHolder.set(_this._targetPosition.x, 0, _this._targetPosition.z);
                                                                                _this._rootBoneWeight = true; // Use Y As Root Motion
                                                                                _this._rootBoneHolder.set(0, (_this._targetPosition.y + level_1), 0);
                                                                            }
                                                                        }
                                                                        else {
                                                                            //if (this._processmotion === true) {
                                                                            //    if (loopblendpositiony === true) {
                                                                            //        this._positionWeight = true;        // Bake Y Into Pose 
                                                                            //        this._positionHolder.set(0, (this._targetPosition.y + level), 0);
                                                                            //    }
                                                                            //    this._rootBoneWeight = true;        // Zero XZ In-Place Motion
                                                                            //    this._rootBoneHolder.set(0, 0, 0);
                                                                            //} else {
                                                                            _this._positionWeight = true; // Bake XYZ Original Motion
                                                                            _this._positionHolder.set(_this._targetPosition.x, (_this._targetPosition.y + level_1), _this._targetPosition.z);
                                                                            //}
                                                                        }
                                                                        // Bake Position Holder
                                                                        if (_this._positionWeight === true) {
                                                                            if (clipTargetMixer.positionBuffer == null)
                                                                                clipTargetMixer.positionBuffer = new BABYLON.Vector3(0, 0, 0);
                                                                            BABYLON.Utilities.BlendVector3Value(clipTargetMixer.positionBuffer, _this._positionHolder, 1.0);
                                                                        }
                                                                        // Bake Root Bone Holder
                                                                        if (_this._rootBoneWeight === true) {
                                                                            if (clipTargetMixer.rootPosition == null)
                                                                                clipTargetMixer.rootPosition = new BABYLON.Vector3(0, 0, 0);
                                                                            if (keeporiginalorientation_1 === true) {
                                                                                // Flip Negative Root Motion
                                                                                if (correctionoffsety_1 > 0 && BABYLON.AnimationState.DEG90 > 0) {
                                                                                    if (correctionoffsety_1 > BABYLON.AnimationState.DEG90) {
                                                                                        _this._rootBoneHolder.x *= -1;
                                                                                        _this._rootBoneHolder.z *= -1;
                                                                                    }
                                                                                }
                                                                            }
                                                                            BABYLON.Utilities.BlendVector3Value(clipTargetMixer.rootPosition, _this._rootBoneHolder, 1.0);
                                                                        }
                                                                    }
                                                                    else {
                                                                        // Bake Normal Pose Position
                                                                        if (clipTargetMixer.positionBuffer == null)
                                                                            clipTargetMixer.positionBuffer = new BABYLON.Vector3(0, 0, 0);
                                                                        BABYLON.Utilities.BlendVector3Value(clipTargetMixer.positionBuffer, _this._targetPosition, 1.0);
                                                                    }
                                                                }
                                                                else if (targetedAnim.animation.targetProperty === "rotationQuaternion") {
                                                                    _this._targetRotation = BABYLON.Utilities.SampleAnimationQuaternion(targetedAnim.animation, animationFrameTime_1);
                                                                    // ..
                                                                    // Handle Root Motion (Rotation)
                                                                    // ..
                                                                    if (targetRootBone === true) {
                                                                        _this._rotationWeight = false;
                                                                        _this._rotationHolder.set(0, 0, 0, 0);
                                                                        _this._rootQuatWeight = false;
                                                                        _this._rootQuatHolder.set(0, 0, 0, 0);
                                                                        // TODO - OPTIMIZE TO EULER ANGLES
                                                                        var eulerAngle = _this._targetRotation.toEulerAngles();
                                                                        var orientationAngleY = eulerAngle.y; //(keeporiginalorientation === true) ? eulerAngle.y : this._bodyOrientationAngleY;
                                                                        // ..
                                                                        // Apply Root Motion
                                                                        // ..
                                                                        if (_this.applyRootMotion === true) {
                                                                            if (loopblendorientation_1 === true) {
                                                                                _this._rotationWeight = true; // Bake XYZ Into Pose
                                                                                BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, (orientationAngleY + orientationoffsety_1), eulerAngle.z, _this._rotationHolder);
                                                                            }
                                                                            else {
                                                                                _this._rotationWeight = true; // Bake XZ Into Pose
                                                                                BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, 0, eulerAngle.z, _this._rotationHolder);
                                                                                _this._rootQuatWeight = true; // Use Y As Root Motion
                                                                                BABYLON.Quaternion.FromEulerAnglesToRef(0, (orientationAngleY + orientationoffsety_1), 0, _this._rootQuatHolder);
                                                                            }
                                                                        }
                                                                        else {
                                                                            _this._rotationWeight = true; // Bake XYZ Into Pose
                                                                            BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, (orientationAngleY + orientationoffsety_1), eulerAngle.z, _this._rotationHolder);
                                                                        }
                                                                        // Bake Rotation Holder
                                                                        if (_this._rotationWeight === true) {
                                                                            if (clipTargetMixer.rotationBuffer == null)
                                                                                clipTargetMixer.rotationBuffer = new BABYLON.Quaternion(0, 0, 0, 1);
                                                                            BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rotationBuffer, _this._rotationHolder, 1.0);
                                                                        }
                                                                        // Bake Root Bone Rotation
                                                                        if (_this._rootQuatWeight === true) {
                                                                            if (clipTargetMixer.rootRotation == null)
                                                                                clipTargetMixer.rootRotation = new BABYLON.Quaternion(0, 0, 0, 1);
                                                                            BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rootRotation, _this._rootQuatHolder, 1.0);
                                                                        }
                                                                    }
                                                                    else {
                                                                        // Bake Normal Pose Rotation
                                                                        if (clipTargetMixer.rotationBuffer == null)
                                                                            clipTargetMixer.rotationBuffer = new BABYLON.Quaternion(0, 0, 0, 1);
                                                                        BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rotationBuffer, _this._targetRotation, 1.0);
                                                                    }
                                                                }
                                                                else if (targetedAnim.animation.targetProperty === "scaling") {
                                                                    _this._targetScaling = BABYLON.Utilities.SampleAnimationVector3(targetedAnim.animation, animationFrameTime_1);
                                                                    if (clipTargetMixer.scalingBuffer == null)
                                                                        clipTargetMixer.scalingBuffer = new BABYLON.Vector3(1, 1, 1);
                                                                    BABYLON.Utilities.BlendVector3Value(clipTargetMixer.scalingBuffer, _this._targetScaling, 1.0);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else if (targetedAnim.target instanceof BABYLON.MorphTarget) {
                                                    var morphTarget = targetedAnim.target;
                                                    if (morphTarget.metadata != null && morphTarget.metadata.mixer != null) {
                                                        var morphTargetMixer = morphTarget.metadata.mixer[layer.index];
                                                        if (targetedAnim.animation.targetProperty === "influence") {
                                                            var floatValue = BABYLON.Utilities.SampleAnimationFloat(targetedAnim.animation, animationFrameTime_1);
                                                            if (morphTargetMixer.influenceBuffer == null)
                                                                morphTargetMixer.influenceBuffer = 0;
                                                            morphTargetMixer.influenceBuffer = BABYLON.Utilities.BlendFloatValue(morphTargetMixer.influenceBuffer, floatValue, 1.0);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Parse Layer Animation Curves
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationStateMachine.tcurves != null && layer.animationStateMachine.tcurves.length > 0) {
                                            layer.animationStateMachine.tcurves.forEach(function (animation) {
                                                if (animation.targetProperty != null && animation.targetProperty !== "") {
                                                    var sample = BABYLON.Utilities.SampleAnimationFloat(animation, layer.animationNormal);
                                                    _this.setFloat(animation.targetProperty, sample);
                                                }
                                            });
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Validate Layer Animation Events (TODO - Pass Layer Index Properties To Observers)
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationStateMachine.events != null && layer.animationStateMachine.events.length > 0) {
                                            layer.animationStateMachine.events.forEach(function (animatorEvent) {
                                                if (animatorEvent.time === formattedTime_1) {
                                                    var animEventKey = animatorEvent.function + "_" + animatorEvent.time;
                                                    if (layer.animationLoopEvents == null)
                                                        layer.animationLoopEvents = {};
                                                    if (!layer.animationLoopEvents[animEventKey]) {
                                                        layer.animationLoopEvents[animEventKey] = true;
                                                        // console.log("Blend Tree Animation Event: " + animatorEvent.time + " >> " + animatorEvent.clip + " >> " + animatorEvent.function);
                                                        if (_this.onAnimationEventObservable.hasObservers() === true) {
                                                            _this.onAnimationEventObservable.notifyObservers(animatorEvent);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Step Motion Clip Animation Time
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationLoopFrame === true) {
                                            layer.animationTime = 0;
                                            layer.animationNormal = 0;
                                            layer.animationLoopFrame = false;
                                            layer.animationLoopEvents = null;
                                        }
                                        else {
                                            layer.animationTime += (deltaTime * frameRatio * Math.abs(layerState.speed) * Math.abs(_this.speedRatio));
                                            layer.animationTime = BABYLON.Scalar.Clamp(layer.animationTime, 0, BABYLON.AnimationState.TIME);
                                        }
                                    }
                                    else {
                                        // console.warn(">>> No Motion Clip Animation Track Found For: " + this.transform.name);
                                    }
                                }
                                else {
                                    // this._blendMessage = "";
                                    _this._blendWeights.primary = null;
                                    _this._blendWeights.secondary = null;
                                    var scaledWeightList = [];
                                    var primaryBlendTree_1 = layerState.blendtree;
                                    _this.parseTreeBranches(layer, primaryBlendTree_1, 1.0, scaledWeightList);
                                    var frameRatio = _this.computeWeightedFrameRatio(scaledWeightList);
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Blend Tree Animation Timeline
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    layer.animationNormal = (layer.animationTime / BABYLON.AnimationState.TIME); // Note: Normalize Layer Frame Time
                                    var validateTime = (layer.animationNormal > 0.99) ? 1 : layer.animationNormal;
                                    var formattedTime_2 = Math.round(validateTime * 100) / 100;
                                    if (layerState.speed < 0)
                                        layer.animationNormal = (1 - layer.animationNormal); // Note: Reverse Normalized Frame Time
                                    var blendingNormalTime = layer.animationNormal; // Note: Denormalize Animation Frame Time
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationTime >= BABYLON.AnimationState.TIME) {
                                        layer.animationLoopFrame = true; // Note: No Loop Or End Events For Blend Trees
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    var masterAnimationTrack = (scaledWeightList != null && scaledWeightList.length > 0 && scaledWeightList[0].track != null) ? scaledWeightList[0].track : null;
                                    if (masterAnimationTrack != null) {
                                        var targetCount = masterAnimationTrack.targetedAnimations.length;
                                        for (var targetIndex = 0; targetIndex < targetCount; targetIndex++) {
                                            var masterAnimimation = masterAnimationTrack.targetedAnimations[targetIndex];
                                            if (masterAnimimation.target instanceof BABYLON.TransformNode) {
                                                var blendTarget = masterAnimimation.target;
                                                if (layer.index === 0 || layer.avatarMask == null || _this.filterTargetAvatarMask(layer, blendTarget)) {
                                                    var targetRootBone = (blendTarget.metadata != null && blendTarget.metadata.unity != null && blendTarget.metadata.unity.rootbone != null) ? blendTarget.metadata.unity.rootbone : false;
                                                    if (blendTarget.metadata != null && blendTarget.metadata.mixer != null) {
                                                        _this._initialtargetblending = true; // Note: Reset First Target Blending Buffer
                                                        var blendTargetMixer = blendTarget.metadata.mixer[layer.index];
                                                        _this.updateBlendableTargets(deltaTime, layer, primaryBlendTree_1, masterAnimimation, targetIndex, blendTargetMixer, blendingNormalTime, targetRootBone);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        // console.warn(">>> No Blend Tree Master Animation Track Found For: " + this.transform.name);
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Parse Layer Animation Curves
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationStateMachine.tcurves != null && layer.animationStateMachine.tcurves.length > 0) {
                                        layer.animationStateMachine.tcurves.forEach(function (animation) {
                                            if (animation.targetProperty != null && animation.targetProperty !== "") {
                                                var sample = BABYLON.Utilities.SampleAnimationFloat(animation, layer.animationNormal);
                                                _this.setFloat(animation.targetProperty, sample);
                                            }
                                        });
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Validate Layer Animation Events (TODO - Pass Layer Index And Clip Blended Weight Properties To Observers)
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationStateMachine.events != null && layer.animationStateMachine.events.length > 0) {
                                        layer.animationStateMachine.events.forEach(function (animatorEvent) {
                                            if (animatorEvent.time === formattedTime_2) {
                                                var animEventKey = animatorEvent.function + "_" + animatorEvent.time;
                                                if (layer.animationLoopEvents == null)
                                                    layer.animationLoopEvents = {};
                                                if (!layer.animationLoopEvents[animEventKey]) {
                                                    layer.animationLoopEvents[animEventKey] = true;
                                                    // console.log("Blend Tree Animation Event: " + animatorEvent.time + " >> " + animatorEvent.clip + " >> " + animatorEvent.function);
                                                    if (_this.onAnimationEventObservable.hasObservers() === true) {
                                                        _this.onAnimationEventObservable.notifyObservers(animatorEvent);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Step Blend Tree Animation Time
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationLoopFrame === true) {
                                        layer.animationTime = 0;
                                        layer.animationNormal = 0;
                                        layer.animationLoopFrame = false;
                                        layer.animationLoopEvents = null;
                                    }
                                    else {
                                        layer.animationTime += (deltaTime * frameRatio * Math.abs(layerState.speed) * Math.abs(_this.speedRatio));
                                        layer.animationTime = BABYLON.Scalar.Clamp(layer.animationTime, 0, BABYLON.AnimationState.TIME);
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                }
                            }
                        }
                    }
                });
            }
            this.finalizeAnimationTargets();
        };
        // private _blendMessage:string = "";
        AnimationState.prototype.updateBlendableTargets = function (deltaTime, layer, tree, masterAnimation, targetIndex, targetMixer, normalizedFrameTime, targetRootBone) {
            if (targetMixer != null && tree.children != null && tree.children.length > 0) {
                for (var index = 0; index < tree.children.length; index++) {
                    var child = tree.children[index];
                    if (child.weight > 0) {
                        if (child.type === BABYLON.MotionType.Clip) {
                            if (child.track != null) {
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // let additivereferenceposeclip:number = 0;
                                // let additivereferenceposetime:number = 0.0;
                                // let hasadditivereferencepose:boolean = false;
                                // let starttime:number = 0.0;
                                // let stoptime:number = 0.0;
                                // let mirror:boolean = false;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // let looptime:boolean = true;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                var level = 0.0;
                                var xspeed = 0.0;
                                var zspeed = 0.0;
                                var loopblend = false;
                                var cycleoffset = 0.0;
                                var heightfromfeet = false;
                                var correctionoffsety = 0.0;
                                var orientationoffsety = 0.0;
                                var keeporiginalorientation = false;
                                var keeporiginalpositionxz = false;
                                var keeporiginalpositiony = false;
                                var loopblendorientation = false;
                                var loopblendpositiony = false;
                                var loopblendpositionxz = false;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                var agroup = child.track;
                                if (agroup.metadata != null && agroup.metadata.unity != null) {
                                    if (agroup.metadata.unity.averagespeed != null) {
                                        xspeed = (agroup.metadata.unity.averagespeed.x != null) ? agroup.metadata.unity.averagespeed.x : 0;
                                        zspeed = (agroup.metadata.unity.averagespeed.z != null) ? agroup.metadata.unity.averagespeed.z : 0;
                                    }
                                    if (agroup.metadata.unity.settings != null) {
                                        level = (agroup.metadata.unity.settings.level != null) ? agroup.metadata.unity.settings.level : 0;
                                        loopblend = (agroup.metadata.unity.settings.loopblend != null) ? agroup.metadata.unity.settings.loopblend : false;
                                        cycleoffset = (agroup.metadata.unity.settings.cycleoffset != null) ? agroup.metadata.unity.settings.cycleoffset : 0;
                                        heightfromfeet = (agroup.metadata.unity.settings.heightfromfeet != null) ? agroup.metadata.unity.settings.heightfromfeet : false;
                                        correctionoffsety = (agroup.metadata.unity.settings.orientationoffsety != null) ? agroup.metadata.unity.settings.orientationoffsety : 0;
                                        // DEPRECIATED: orientationoffsety = (agroup.metadata.unity.settings.orientationoffsety != null) ? agroup.metadata.unity.settings.orientationoffsety : 0;
                                        keeporiginalorientation = (agroup.metadata.unity.settings.keeporiginalorientation != null) ? agroup.metadata.unity.settings.keeporiginalorientation : false;
                                        keeporiginalpositionxz = (agroup.metadata.unity.settings.keeporiginalpositionxz != null) ? agroup.metadata.unity.settings.keeporiginalpositionxz : false;
                                        keeporiginalpositiony = (agroup.metadata.unity.settings.keeporiginalpositiony != null) ? agroup.metadata.unity.settings.keeporiginalpositiony : false;
                                        loopblendorientation = (agroup.metadata.unity.settings.loopblendorientation != null) ? agroup.metadata.unity.settings.loopblendorientation : false;
                                        loopblendpositiony = (agroup.metadata.unity.settings.loopblendpositiony != null) ? agroup.metadata.unity.settings.loopblendpositiony : false;
                                        loopblendpositionxz = (agroup.metadata.unity.settings.loopblendpositionxz != null) ? agroup.metadata.unity.settings.loopblendpositionxz : false;
                                    }
                                }
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // Unity Inverts Root Motion Animation Offsets
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // DEPRECIATED: orientationoffsety = BABYLON.Tools.ToRadians(orientationoffsety);
                                // DEPRECIATED: orientationoffsety *= -1;
                                correctionoffsety = Math.abs(correctionoffsety); // In Degrees
                                xspeed = Math.abs(xspeed);
                                zspeed = Math.abs(zspeed);
                                level *= -1;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // this._blendMessage += (" >>> " + child.motion + ": " + child.weight.toFixed(2));
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // TODO - Get blendable animation from target map - ???
                                var blendableAnim = child.track.targetedAnimations[targetIndex];
                                var blendableWeight = (this._initialtargetblending === true) ? 1.0 : parseFloat(child.weight.toFixed(2));
                                this._initialtargetblending = false; // Note: Clear First Target Blending Buffer
                                if (blendableAnim.target === masterAnimation.target && blendableAnim.animation.targetProperty === masterAnimation.animation.targetProperty) {
                                    var adjustedFrameTime = normalizedFrameTime; // Note: Adjust Normalized Frame Time
                                    if (child.timescale < 0)
                                        adjustedFrameTime = (1 - adjustedFrameTime); // Note: Reverse Normalized Frame Time
                                    var animationFrameTime = (child.track.to * adjustedFrameTime); // Note: Denormalize Animation Frame Time
                                    //const animationFrameTime:number = (Math.round((child.track.to * adjustedFrameTime) * 100) / 100);  // Note: Denormalize Animation Frame Time
                                    if (masterAnimation.animation.targetProperty === "position") {
                                        this._targetPosition = BABYLON.Utilities.SampleAnimationVector3(blendableAnim.animation, animationFrameTime);
                                        // ..
                                        // Root Transform Position
                                        // ..
                                        if (targetRootBone === true) {
                                            this._positionWeight = false;
                                            this._positionHolder.set(0, 0, 0);
                                            this._rootBoneWeight = false;
                                            this._rootBoneHolder.set(0, 0, 0);
                                            // ..
                                            // Apply Root Motion
                                            // ..
                                            if (this.applyRootMotion === true) {
                                                if (loopblendpositiony === true && loopblendpositionxz === true) {
                                                    this._positionWeight = true; // Bake XYZ Into Pose
                                                    this._positionHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                                }
                                                else if (loopblendpositiony === false && loopblendpositionxz === false) {
                                                    this._rootBoneWeight = true; // Use XYZ As Root Motion
                                                    this._rootBoneHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                                }
                                                else if (loopblendpositiony === true && loopblendpositionxz === false) {
                                                    this._positionWeight = true; // Bake Y Into Pose 
                                                    this._positionHolder.set(0, (this._targetPosition.y + level), 0);
                                                    this._rootBoneWeight = true; // Use XZ As Root Motion
                                                    this._rootBoneHolder.set(this._targetPosition.x, 0, this._targetPosition.z);
                                                }
                                                else if (loopblendpositionxz === true && loopblendpositiony === false) {
                                                    this._positionWeight = true; // Bake XZ Into Pose
                                                    this._positionHolder.set(this._targetPosition.x, 0, this._targetPosition.z);
                                                    this._rootBoneWeight = true; // Use Y As Root Motion
                                                    this._rootBoneHolder.set(0, (this._targetPosition.y + level), 0);
                                                }
                                            }
                                            else {
                                                //if (this._processmotion === true) {
                                                //    if (loopblendpositiony === true) {
                                                //        this._positionWeight = true;        // Bake Y Into Pose 
                                                //        this._positionHolder.set(0, (this._targetPosition.y + level), 0);
                                                //    }
                                                //    this._rootBoneWeight = true;        // Zero XZ In-Place Motion
                                                //    this._rootBoneHolder.set(0, 0, 0);
                                                //} else {
                                                this._positionWeight = true; // Bake XYZ Original Motion
                                                this._positionHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                                //}
                                            }
                                            // Bake Position Holder
                                            if (this._positionWeight === true) {
                                                if (targetMixer.positionBuffer == null)
                                                    targetMixer.positionBuffer = new BABYLON.Vector3(0, 0, 0);
                                                BABYLON.Utilities.BlendVector3Value(targetMixer.positionBuffer, this._positionHolder, blendableWeight);
                                            }
                                            // Bake Root Bone Holder
                                            if (this._rootBoneWeight === true) {
                                                if (targetMixer.rootPosition == null)
                                                    targetMixer.rootPosition = new BABYLON.Vector3(0, 0, 0);
                                                if (keeporiginalorientation === true) {
                                                    // Flip Negative Root Motion
                                                    if (correctionoffsety > 0 && BABYLON.AnimationState.DEG90 > 0) {
                                                        if (correctionoffsety > BABYLON.AnimationState.DEG90) {
                                                            this._rootBoneHolder.x *= -1;
                                                            this._rootBoneHolder.z *= -1;
                                                        }
                                                    }
                                                }
                                                BABYLON.Utilities.BlendVector3Value(targetMixer.rootPosition, this._rootBoneHolder, blendableWeight);
                                            }
                                        }
                                        else {
                                            // Bake Normal Pose Position
                                            if (targetMixer.positionBuffer == null)
                                                targetMixer.positionBuffer = new BABYLON.Vector3(0, 0, 0);
                                            BABYLON.Utilities.BlendVector3Value(targetMixer.positionBuffer, this._targetPosition, blendableWeight);
                                        }
                                    }
                                    else if (masterAnimation.animation.targetProperty === "rotationQuaternion") {
                                        this._targetRotation = BABYLON.Utilities.SampleAnimationQuaternion(blendableAnim.animation, animationFrameTime);
                                        // ..
                                        // Root Transform Rotation
                                        // ..
                                        if (targetRootBone === true) {
                                            this._rotationWeight = false;
                                            this._rotationHolder.set(0, 0, 0, 0);
                                            this._rootQuatWeight = false;
                                            this._rootQuatHolder.set(0, 0, 0, 0);
                                            var eulerAngle = this._targetRotation.toEulerAngles();
                                            var orientationAngleY = eulerAngle.y; //(keeporiginalorientation === true) ? eulerAngle.y : this._bodyOrientationAngleY;
                                            // ..
                                            // Apply Root Motion
                                            // ..
                                            if (this.applyRootMotion === true) {
                                                if (loopblendorientation === true) {
                                                    this._rotationWeight = true; // Bake XYZ Into Pose
                                                    BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, (orientationAngleY + orientationoffsety), eulerAngle.z, this._rotationHolder);
                                                }
                                                else {
                                                    this._rotationWeight = true; // Bake XZ Into Pose
                                                    BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, 0, eulerAngle.z, this._rotationHolder);
                                                    this._rootQuatWeight = true; // Use Y As Root Motion
                                                    BABYLON.Quaternion.FromEulerAnglesToRef(0, (orientationAngleY + orientationoffsety), 0, this._rootQuatHolder);
                                                }
                                            }
                                            else {
                                                this._rotationWeight = true; // Bake XYZ Into Pose
                                                BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, (orientationAngleY + orientationoffsety), eulerAngle.z, this._rotationHolder);
                                            }
                                            // Bake Rotation Holder
                                            if (this._rotationWeight === true) {
                                                if (targetMixer.rotationBuffer == null)
                                                    targetMixer.rotationBuffer = new BABYLON.Quaternion(0, 0, 0, 1);
                                                BABYLON.Utilities.BlendQuaternionValue(targetMixer.rotationBuffer, this._rotationHolder, blendableWeight);
                                            }
                                            // Bake Root Bone Rotation
                                            if (this._rootQuatWeight === true) {
                                                if (targetMixer.rootRotation == null)
                                                    targetMixer.rootRotation = new BABYLON.Quaternion(0, 0, 0, 1);
                                                BABYLON.Utilities.BlendQuaternionValue(targetMixer.rootRotation, this._rootQuatHolder, blendableWeight);
                                            }
                                        }
                                        else {
                                            // Bake Normal Pose Rotation
                                            if (targetMixer.rotationBuffer == null)
                                                targetMixer.rotationBuffer = new BABYLON.Quaternion(0, 0, 0, 1);
                                            BABYLON.Utilities.BlendQuaternionValue(targetMixer.rotationBuffer, this._targetRotation, blendableWeight);
                                        }
                                    }
                                    else if (masterAnimation.animation.targetProperty === "scaling") {
                                        this._targetScaling = BABYLON.Utilities.SampleAnimationVector3(blendableAnim.animation, animationFrameTime);
                                        if (targetMixer.scalingBuffer == null)
                                            targetMixer.scalingBuffer = new BABYLON.Vector3(1, 1, 1);
                                        BABYLON.Utilities.BlendVector3Value(targetMixer.scalingBuffer, this._targetScaling, blendableWeight);
                                    }
                                }
                                else {
                                    BABYLON.Tools.Warn(tree.name + " - " + child.track.name + " blend tree mismatch (" + targetIndex + "): " + masterAnimation.target.name + " >>> " + blendableAnim.target.name);
                                }
                            }
                        }
                        else if (child.type === BABYLON.MotionType.Tree) {
                            this.updateBlendableTargets(deltaTime, layer, child.subtree, masterAnimation, targetIndex, targetMixer, normalizedFrameTime, targetRootBone);
                        }
                    }
                }
            }
            //if (targetIndex === 0) BABYLON.Utilities.PrintToScreen(this._blendMessage, "red");
        };
        AnimationState.prototype.finalizeAnimationTargets = function () {
            var _this = this;
            this._deltaPosition.set(0, 0, 0);
            this._deltaRotation.set(0, 0, 0, 1);
            this._deltaPositionFixed.set(0, 0, 0);
            this._dirtyMotionMatrix = null;
            if (this.m_animationTargets != null && this.m_animationTargets.length > 0) {
                this.m_animationTargets.forEach(function (targetedAnim) {
                    var animationTarget = targetedAnim.target;
                    // ..
                    // Update Direct Transform Targets For Each Layer
                    // ..
                    if (animationTarget.metadata != null && animationTarget.metadata.mixer != null) {
                        if (_this._machine.layers != null && _this._machine.layers.length > 0) {
                            _this._blenderMatrix.reset();
                            _this._dirtyBlenderMatrix = null;
                            _this._machine.layers.forEach(function (layer) {
                                var animationTargetMixer = animationTarget.metadata.mixer[layer.index];
                                if (animationTargetMixer != null) {
                                    if (animationTarget instanceof BABYLON.TransformNode) {
                                        // ..
                                        // Update Dirty Transform Matrix
                                        // ..
                                        if (animationTargetMixer.positionBuffer != null || animationTargetMixer.rotationBuffer != null || animationTargetMixer.scalingBuffer != null) {
                                            BABYLON.Matrix.ComposeToRef((animationTargetMixer.scalingBuffer || animationTarget.scaling), (animationTargetMixer.rotationBuffer || animationTarget.rotationQuaternion), (animationTargetMixer.positionBuffer || animationTarget.position), _this._updateMatrix);
                                            if (animationTargetMixer.blendingSpeed > 0.0) {
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix == null) {
                                                    animationTargetMixer.originalMatrix = BABYLON.Matrix.Compose((animationTarget.scaling), (animationTarget.rotationQuaternion), (animationTarget.position));
                                                }
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix != null) {
                                                    BABYLON.Utilities.FastMatrixSlerp(animationTargetMixer.originalMatrix, _this._updateMatrix, animationTargetMixer.blendingFactor, _this._updateMatrix);
                                                    animationTargetMixer.blendingFactor += animationTargetMixer.blendingSpeed;
                                                }
                                            }
                                            BABYLON.Utilities.FastMatrixSlerp(_this._blenderMatrix, _this._updateMatrix, layer.defaultWeight, _this._blenderMatrix);
                                            _this._dirtyBlenderMatrix = true;
                                            animationTargetMixer.positionBuffer = null;
                                            animationTargetMixer.rotationBuffer = null;
                                            animationTargetMixer.scalingBuffer = null;
                                        }
                                        // ..
                                        // Update Dirty Root Motion Matrix
                                        // ..
                                        if (animationTargetMixer.rootPosition != null || animationTargetMixer.rootRotation != null) {
                                            BABYLON.Matrix.ComposeToRef((_this._emptyScaling), (animationTargetMixer.rootRotation || _this._emptyRotation), (animationTargetMixer.rootPosition || _this._emptyPosition), _this._updateMatrix);
                                            // ..
                                            // TODO - May Need Seperate Blending Speed Properties
                                            // Note: Might Fix Large Root Motion Delta Issue - ???
                                            // ..
                                            /*
                                            if (animationTargetMixer.blendingSpeed > 0.0) {
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix == null) {
                                                    animationTargetMixer.originalMatrix = BABYLON.Matrix.Compose(
                                                        (this.transform.scaling),
                                                        (this.transform.rotationQuaternion),
                                                        (this.transform.position)
                                                    );
                                                }
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix != null) {
                                                    BABYLON.Utilities.FastMatrixSlerp(animationTargetMixer.originalMatrix, this._updateMatrix, animationTargetMixer.blendingFactor, this._updateMatrix);
                                                    animationTargetMixer.blendingFactor += animationTargetMixer.blendingSpeed;
                                                }
                                            }
                                            */
                                            BABYLON.Utilities.FastMatrixSlerp(_this._rootMotionMatrix, _this._updateMatrix, layer.defaultWeight, _this._rootMotionMatrix);
                                            _this._dirtyMotionMatrix = true;
                                            animationTargetMixer.rootPosition = null;
                                            animationTargetMixer.rootRotation = null;
                                        }
                                    }
                                    else if (animationTarget instanceof BABYLON.MorphTarget) {
                                        if (animationTargetMixer.influenceBuffer != null) {
                                            animationTarget.influence = BABYLON.Scalar.Lerp(animationTarget.influence, animationTargetMixer.influenceBuffer, layer.defaultWeight);
                                            animationTargetMixer.influenceBuffer = null;
                                        }
                                    }
                                }
                            });
                            if (_this._dirtyBlenderMatrix != null) {
                                _this._blenderMatrix.decompose(animationTarget.scaling, animationTarget.rotationQuaternion, animationTarget.position);
                            }
                        }
                    }
                });
            }
            // ..
            if (this.applyRootMotion === true) {
                if (this._dirtyMotionMatrix != null) {
                    this._rootMotionMatrix.decompose(this._rootMotionScaling, this._rootMotionRotation, this._rootMotionPosition);
                    if (this._frametime === 0) {
                        //this._lastMotionPosition.copyFrom(this.transform.position);
                        //this._lastMotionRotation.copyFrom(this.transform.rotationQuaternion);
                        // ..
                        this._lastMotionPosition.copyFrom(this._rootMotionPosition);
                        this._lastMotionRotation.copyFrom(this._rootMotionRotation);
                        // ..
                        // Subtract Last Delta (First Frame = Zero) - ???
                        // ..
                        //this._lastMotionPosition.subtractInPlace(this._saveDeltaPosition);
                        //BABYLON.Utilities.QuaternionDiffToRef(this._lastMotionRotation, this._saveDeltaRotation, this._lastMotionRotation);
                    }
                    // ..
                    // Update Current Delta Position
                    // ..
                    this._rootMotionPosition.subtractToRef(this._lastMotionPosition, this._deltaPosition);
                    // ..
                    // Update Current Delta Rotation
                    // ..
                    BABYLON.Utilities.QuaternionDiffToRef(this._rootMotionRotation, this._lastMotionRotation, this._deltaRotation);
                    this._deltaRotation.toEulerAnglesToRef(this._angularVelocity);
                    // ..
                    // Update Last Root Motion Deltas
                    // ..
                    this._saveDeltaPosition.copyFrom(this._deltaPosition);
                    this._saveDeltaRotation.copyFrom(this._deltaRotation);
                    this._lastMotionPosition.addInPlace(this._deltaPosition);
                    this._lastMotionRotation.multiplyInPlace(this._deltaRotation);
                    // ..
                    // Update Root Motion Transformation
                    // ..
                    this.transform.rotationQuaternion.toRotationMatrix(this._deltaPositionMatrix); // TODO: Optimize Rotation Matrix Is Dirty - ???
                    BABYLON.Vector3.TransformCoordinatesToRef(this._deltaPosition, this._deltaPositionMatrix, this._deltaPositionFixed);
                    // ..
                    // DEPRECIATED: let deltaTime:number = this.getDeltaSeconds();
                    // DEPRECIATED: if (deltaTime <= 0) deltaTime = 1; // Note: Protect Delta Time Divide By Zero
                    // DEPRECIATED: this._linearVelocity.set((this._deltaPositionFixed.x / deltaTime), (this._deltaPositionFixed.y / deltaTime), (this._deltaPositionFixed.z / deltaTime));
                }
                // ..
                // Update Transform Delta Position
                // ..
                if (this.updatePosition === true) {
                    if (this.m_characterController != null) {
                        // TODO: Handle Jumping Here - ???
                        // if (this.m_characterController.isGrounded()) {
                        this.m_characterController.move(this._deltaPositionFixed);
                        // }
                    }
                    else {
                        if (this.moveWithCollisions === true && this.transform instanceof BABYLON.AbstractMesh) {
                            this.transform.moveWithCollisions(this._deltaPositionFixed);
                        }
                        else {
                            this.transform.position.addInPlace(this._deltaPositionFixed);
                        }
                    }
                }
                // ..
                // Update Transform Angular Velocity
                // ..
                if (this.updateRotation === true) {
                    this.transform.addRotation(0, this._angularVelocity.y, 0);
                }
            }
        };
        AnimationState.prototype.checkStateMachine = function (layer, deltaTime) {
            var _this = this;
            this._checkers.result = null;
            this._checkers.offest = 0;
            this._checkers.blending = 0;
            this._checkers.triggered = [];
            // ..
            // Check Animation State Transitions
            // ..
            if (layer.animationStateMachine != null) {
                // Check Local Transition Conditions
                this.checkStateTransitions(layer, layer.animationStateMachine.transitions, layer.animationStateMachine.time, layer.animationStateMachine.length, layer.animationStateMachine.rate);
                // Check Any State Transition Conditions
                if (this._checkers.result == null && this._machine.transitions != null) {
                    this.checkStateTransitions(layer, this._machine.transitions, layer.animationStateMachine.time, layer.animationStateMachine.length, layer.animationStateMachine.rate);
                }
            }
            // ..
            // Reset Transition Condition Triggers
            // ..
            if (this._checkers.triggered != null && this._checkers.triggered.length > 0) {
                this._checkers.triggered.forEach(function (trigger) { _this.resetTrigger(trigger); });
                this._checkers.triggered = null;
            }
            // ..
            // Set Current Machine State Result
            // ..
            if (this._checkers.result != null) {
                if (this._checkers.offest > 0)
                    BABYLON.SceneManager.SetTimeout((this._checkers.offest * 1000), function () { _this.setCurrentAnimationState(layer, _this._checkers.result, _this._checkers.blending); });
                else
                    this.setCurrentAnimationState(layer, this._checkers.result, this._checkers.blending);
            }
        };
        AnimationState.prototype.checkStateTransitions = function (layer, transitions, time, length, rate) {
            var _this = this;
            if (transitions != null && transitions.length > 0) {
                var i = 0;
                var ii = 0;
                var solo = -1;
                // ..
                // Check Has Solo Transitions
                // ..
                for (i = 0; i < transitions.length; i++) {
                    if (transitions[i].solo === true && transitions[i].mute === false) {
                        solo = i;
                        break;
                    }
                }
                var _loop_1 = function () {
                    var transition = transitions[i];
                    if (transition.layerIndex !== layer.index)
                        return "continue";
                    if (transition.mute === true)
                        return "continue";
                    if (solo >= 0 && solo !== i)
                        return "continue";
                    var transitionOk = false;
                    // ..
                    // Check Has Transition Exit Time
                    // ..
                    var exitTimeSecs = BABYLON.Scalar.Denormalize(transition.exitTime, 0, length);
                    var exitTimeExpired = ((BABYLON.SceneManager.GetGameTime() - time) >= exitTimeSecs);
                    if (transition.hasExitTime === true && transition.intSource == BABYLON.InterruptionSource.None && exitTimeExpired === false)
                        return "continue";
                    // ..
                    // Check All Transition Conditions
                    // ..
                    if (transition.conditions != null && transition.conditions.length > 0) {
                        var passed_1 = 0;
                        var checks = transition.conditions.length;
                        transition.conditions.forEach(function (condition) {
                            var ptype = _this._parameters.get(condition.parameter);
                            if (ptype != null) {
                                if (ptype == BABYLON.AnimatorParameterType.Float || ptype == BABYLON.AnimatorParameterType.Int) {
                                    var numValue = parseFloat(_this.getFloat(condition.parameter).toFixed(2));
                                    if (condition.mode === BABYLON.ConditionMode.Greater && numValue > condition.threshold) {
                                        passed_1++;
                                    }
                                    else if (condition.mode === BABYLON.ConditionMode.Less && numValue < condition.threshold) {
                                        passed_1++;
                                    }
                                    else if (condition.mode === BABYLON.ConditionMode.Equals && numValue === condition.threshold) {
                                        passed_1++;
                                    }
                                    else if (condition.mode === BABYLON.ConditionMode.NotEqual && numValue !== condition.threshold) {
                                        passed_1++;
                                    }
                                }
                                else if (ptype == BABYLON.AnimatorParameterType.Bool) {
                                    var boolValue = _this.getBool(condition.parameter);
                                    if (condition.mode === BABYLON.ConditionMode.If && boolValue === true) {
                                        passed_1++;
                                    }
                                    else if (condition.mode === BABYLON.ConditionMode.IfNot && boolValue === false) {
                                        passed_1++;
                                    }
                                }
                                else if (ptype == BABYLON.AnimatorParameterType.Trigger) {
                                    var triggerValue = _this.getTrigger(condition.parameter);
                                    if (triggerValue === true) {
                                        passed_1++;
                                        // Note: For Loop Faster Than IndexOf
                                        var indexOfTrigger = -1;
                                        for (var i_1 = 0; i_1 < _this._checkers.triggered.length; i_1++) {
                                            if (_this._checkers.triggered[i_1] === condition.parameter) {
                                                indexOfTrigger = i_1;
                                                break;
                                            }
                                        }
                                        if (indexOfTrigger < 0) {
                                            _this._checkers.triggered.push(condition.parameter);
                                        }
                                    }
                                }
                            }
                        });
                        if (transition.hasExitTime === true) {
                            // ..
                            // TODO - CHECK TRANSITION INTERUPTION SOURCE STATUS
                            // ..
                            // Validate Transition Has Exit Time And All Conditions Passed
                            transitionOk = (exitTimeExpired === true && passed_1 === checks);
                        }
                        else {
                            // Validate All Transition Conditions Passed
                            transitionOk = (passed_1 === checks);
                        }
                    }
                    else {
                        // Validate Transition Has Expired Exit Time Only
                        transitionOk = (transition.hasExitTime === true && exitTimeExpired === true);
                    }
                    // Validate Current Transition Destination Change
                    if (transitionOk === true) {
                        var blendSize = (length > 0) ? length : 1;
                        var blendRate = (rate > 0) ? rate : BABYLON.AnimationState.FPS;
                        var destState = (transition.isExit === false) ? transition.destination : BABYLON.AnimationState.EXIT;
                        var offsetSecs = (transition.fixedDuration === true) ? transition.offset : BABYLON.Scalar.Denormalize(transition.offset, 0, blendSize);
                        var durationSecs = (transition.fixedDuration === true) ? transition.duration : BABYLON.Scalar.Denormalize(transition.duration, 0, blendSize);
                        var blendingSpeed = BABYLON.Utilities.ComputeBlendingSpeed(blendRate, durationSecs);
                        this_1._checkers.result = destState;
                        this_1._checkers.offest = offsetSecs;
                        this_1._checkers.blending = blendingSpeed;
                        return "break";
                    }
                };
                var this_1 = this;
                // ..
                // Check State Machine Transitions
                // ..
                for (i = 0; i < transitions.length; i++) {
                    var state_1 = _loop_1();
                    if (state_1 === "break")
                        break;
                }
            }
        };
        AnimationState.prototype.setCurrentAnimationState = function (layer, name, blending) {
            if (name == null || name === "" || name === BABYLON.AnimationState.EXIT)
                return;
            if (layer.animationStateMachine != null && layer.animationStateMachine.name === name)
                return;
            var state = this.getMachineState(name);
            // ..
            // Reset Animation Target Mixers
            // ..
            if (this.m_animationTargets != null && this.m_animationTargets.length > 0) {
                this.m_animationTargets.forEach(function (targetedAnim) {
                    var animationTarget = targetedAnim.target;
                    if (animationTarget.metadata != null && animationTarget.metadata.mixer != null) {
                        var animationTargetMixer = animationTarget.metadata.mixer[layer.index];
                        if (animationTargetMixer != null) {
                            animationTargetMixer.originalMatrix = null;
                            animationTargetMixer.blendingFactor = 0;
                            animationTargetMixer.blendingSpeed = blending;
                        }
                    }
                });
            }
            // ..
            // Setup Current Layer Animation State
            // ..
            if (state != null && state.layerIndex === layer.index) {
                state.time = 0;
                state.played = 0;
                state.interrupted = false;
                layer.animationTime = 0;
                layer.animationNormal = 0;
                layer.animationFirstRun = true;
                layer.animationEndFrame = false;
                layer.animationLoopFrame = false;
                layer.animationLoopEvents = null;
                layer.animationStateMachine = state;
                layer.animationStateMachine.time = BABYLON.SceneManager.GetGameTime();
                //console.warn("Set Animation State: " + this.transform.name + " --> " + name);
            }
        };
        AnimationState.prototype.checkAvatarTransformPath = function (layer, transformPath) {
            var result = false;
            if (this.m_avatarMask != null) {
                var transformIndex = this.m_avatarMask.get(transformPath);
                if (transformIndex != null && transformIndex >= 0) {
                    result = true;
                }
            }
            return result;
        };
        AnimationState.prototype.filterTargetAvatarMask = function (layer, target) {
            var result = false;
            if (target.metadata != null && target.metadata.unity != null && target.metadata.unity.bone != null && target.metadata.unity.bone !== "") {
                var transformPath = target.metadata.unity.bone;
                result = this.checkAvatarTransformPath(layer, transformPath);
            }
            return result;
        };
        AnimationState.prototype.sortWeightedBlendingList = function (weightList) {
            if (weightList != null && weightList.length > 0) {
                // Sort In Descending Order
                weightList.sort(function (left, right) {
                    if (left.weight < right.weight)
                        return 1;
                    if (left.weight > right.weight)
                        return -1;
                    return 0;
                });
            }
        };
        AnimationState.prototype.computeWeightedFrameRatio = function (weightList) {
            var result = 1.0;
            if (weightList != null && weightList.length > 0) {
                this.sortWeightedBlendingList(weightList);
                this._blendWeights.primary = weightList[0];
                var primaryWeight = this._blendWeights.primary.weight;
                if (primaryWeight < 1.0 && weightList.length > 1) {
                    this._blendWeights.secondary = weightList[1];
                }
                // ..
                if (this._blendWeights.primary != null && this._blendWeights.secondary != null) {
                    var frameWeightDelta = BABYLON.Scalar.Clamp(this._blendWeights.primary.weight);
                    result = BABYLON.Scalar.Lerp(this._blendWeights.secondary.ratio, this._blendWeights.primary.ratio, frameWeightDelta);
                }
                else if (this._blendWeights.primary != null && this._blendWeights.secondary == null) {
                    result = this._blendWeights.primary.ratio;
                }
            }
            return result;
        };
        ///////////////////////////////////////////////////////////////////////////////////////////////
        // Blend Tree Branches -  Helper Functions
        ///////////////////////////////////////////////////////////////////////////////////////////////
        AnimationState.prototype.setupTreeBranches = function (tree) {
            var _this = this;
            if (tree != null && tree.children != null && tree.children.length > 0) {
                tree.children.forEach(function (child) {
                    if (child.type === BABYLON.MotionType.Tree) {
                        _this.setupTreeBranches(child.subtree);
                    }
                    else if (child.type === BABYLON.MotionType.Clip) {
                        if (child.motion != null && child.motion !== "") {
                            child.weight = 0;
                            child.ratio = 0;
                            child.track = _this.getAnimationGroup(child.motion);
                            if (child.track != null)
                                child.ratio = (BABYLON.AnimationState.TIME / child.track.to);
                        }
                    }
                });
            }
        };
        AnimationState.prototype.parseTreeBranches = function (layer, tree, parentWeight, weightList) {
            if (tree != null) {
                tree.valueParameterX = (tree.blendParameterX != null) ? parseFloat(this.getFloat(tree.blendParameterX).toFixed(2)) : 0;
                tree.valueParameterY = (tree.blendParameterY != null) ? parseFloat(this.getFloat(tree.blendParameterY).toFixed(2)) : 0;
                switch (tree.blendType) {
                    case BABYLON.BlendTreeType.Simple1D:
                        this.parse1DSimpleTreeBranches(layer, tree, parentWeight, weightList);
                        break;
                    case BABYLON.BlendTreeType.SimpleDirectional2D:
                        this.parse2DSimpleDirectionalTreeBranches(layer, tree, parentWeight, weightList);
                        break;
                    case BABYLON.BlendTreeType.FreeformDirectional2D:
                        this.parse2DFreeformDirectionalTreeBranches(layer, tree, parentWeight, weightList);
                        break;
                    case BABYLON.BlendTreeType.FreeformCartesian2D:
                        this.parse2DFreeformCartesianTreeBranches(layer, tree, parentWeight, weightList);
                        break;
                }
            }
        };
        AnimationState.prototype.parse1DSimpleTreeBranches = function (layer, tree, parentWeight, weightList) {
            var _this = this;
            if (tree != null && tree.children != null && tree.children.length > 0) {
                var blendTreeArray_1 = [];
                tree.children.forEach(function (child) {
                    child.weight = 0; // Note: Reset Weight Value
                    var item = {
                        source: child,
                        motion: child.motion,
                        posX: child.threshold,
                        posY: child.threshold,
                        weight: child.weight
                    };
                    blendTreeArray_1.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate1DSimpleBlendTree(tree.valueParameterX, blendTreeArray_1);
                blendTreeArray_1.forEach(function (element) {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach(function (child) {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        _this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        };
        AnimationState.prototype.parse2DSimpleDirectionalTreeBranches = function (layer, tree, parentWeight, weightList) {
            var _this = this;
            if (tree != null && tree.children != null && tree.children.length > 0) {
                var blendTreeArray_2 = [];
                tree.children.forEach(function (child) {
                    child.weight = 0; // Note: Reset Weight Value
                    var item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray_2.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformDirectional(tree.valueParameterX, tree.valueParameterY, blendTreeArray_2);
                blendTreeArray_2.forEach(function (element) {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach(function (child) {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        _this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        };
        AnimationState.prototype.parse2DFreeformDirectionalTreeBranches = function (layer, tree, parentWeight, weightList) {
            var _this = this;
            if (tree != null && tree.children != null && tree.children.length > 0) {
                var blendTreeArray_3 = [];
                tree.children.forEach(function (child) {
                    child.weight = 0; // Note: Reset Weight Value
                    var item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray_3.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformDirectional(tree.valueParameterX, tree.valueParameterY, blendTreeArray_3);
                blendTreeArray_3.forEach(function (element) {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach(function (child) {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        _this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        };
        AnimationState.prototype.parse2DFreeformCartesianTreeBranches = function (layer, tree, parentWeight, weightList) {
            var _this = this;
            if (tree != null && tree.children != null && tree.children.length > 0) {
                var blendTreeArray_4 = [];
                tree.children.forEach(function (child) {
                    child.weight = 0; // Note: Reset Weight Value
                    var item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray_4.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformCartesian(tree.valueParameterX, tree.valueParameterY, blendTreeArray_4);
                blendTreeArray_4.forEach(function (element) {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach(function (child) {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        _this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        };
        AnimationState.FPS = 30;
        AnimationState.TIME = 1;
        AnimationState.EXIT = "[EXIT]";
        AnimationState.DEG90 = 90;
        return AnimationState;
    }(BABYLON.ScriptComponent));
    BABYLON.AnimationState = AnimationState;
    ///////////////////////////////////////////
    // Support Classes, Blend Tree Utilities
    ///////////////////////////////////////////
    var BlendTreeValue = /** @class */ (function () {
        function BlendTreeValue(config) {
            this.source = config.source;
            this.motion = config.motion;
            this.posX = config.posX || 0;
            this.posY = config.posY || 0;
            this.weight = config.weight || 0;
        }
        return BlendTreeValue;
    }());
    BABYLON.BlendTreeValue = BlendTreeValue;
    var BlendTreeUtils = /** @class */ (function () {
        function BlendTreeUtils() {
        }
        BlendTreeUtils.ClampValue = function (num, min, max) {
            return num <= min ? min : num >= max ? max : num;
        };
        BlendTreeUtils.GetSignedAngle = function (a, b) {
            return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
        };
        BlendTreeUtils.GetLinearInterpolation = function (x0, y0, x1, y1, x) {
            return y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
        };
        BlendTreeUtils.GetRightNeighbourIndex = function (inputX, blendTreeArray) {
            blendTreeArray.sort(function (a, b) { return (a.posX - b.posX); });
            for (var i = 0; i < blendTreeArray.length; ++i) {
                if (blendTreeArray[i].posX > inputX) {
                    return i;
                }
            }
            return -1;
        };
        return BlendTreeUtils;
    }());
    BABYLON.BlendTreeUtils = BlendTreeUtils;
    var BlendTreeSystem = /** @class */ (function () {
        function BlendTreeSystem() {
        }
        BlendTreeSystem.Calculate1DSimpleBlendTree = function (inputX, blendTreeArray) {
            var firstBlendTree = blendTreeArray[0];
            var lastBlendTree = blendTreeArray[blendTreeArray.length - 1];
            if (inputX <= firstBlendTree.posX) {
                firstBlendTree.weight = 1;
            }
            else if (inputX >= lastBlendTree.posX) {
                lastBlendTree.weight = 1;
            }
            else {
                var rightNeighbourBlendTreeIndex = BABYLON.BlendTreeUtils.GetRightNeighbourIndex(inputX, blendTreeArray);
                var leftNeighbour = blendTreeArray[rightNeighbourBlendTreeIndex - 1];
                var rightNeighbour = blendTreeArray[rightNeighbourBlendTreeIndex];
                var interpolatedValue = BABYLON.BlendTreeUtils.GetLinearInterpolation(leftNeighbour.posX, 1, rightNeighbour.posX, 0, inputX);
                leftNeighbour.weight = interpolatedValue;
                rightNeighbour.weight = 1 - leftNeighbour.weight;
            }
        };
        BlendTreeSystem.Calculate2DFreeformDirectional = function (inputX, inputY, blendTreeArray) {
            BABYLON.BlendTreeSystem.TempVector2_IP.set(inputX, inputY);
            BABYLON.BlendTreeSystem.TempVector2_POSI.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSJ.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSIP.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(0, 0);
            var kDirScale = 2;
            var totalWeight = 0;
            var inputLength = BABYLON.BlendTreeSystem.TempVector2_IP.length();
            for (var i = 0; i < blendTreeArray.length; ++i) {
                var blendTree = blendTreeArray[i];
                BABYLON.BlendTreeSystem.TempVector2_POSI.set(blendTree.posX, blendTree.posY);
                var posILength = BABYLON.BlendTreeSystem.TempVector2_POSI.length();
                var inputToPosILength = (inputLength - posILength);
                var posIToInputAngle = BABYLON.BlendTreeUtils.GetSignedAngle(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_IP);
                var weight = 1;
                for (var j = 0; j < blendTreeArray.length; ++j) {
                    if (j === i) {
                        continue;
                    }
                    else {
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.set(blendTreeArray[j].posX, blendTreeArray[j].posY);
                        var posJLength = BABYLON.BlendTreeSystem.TempVector2_POSJ.length();
                        var averageLengthOfIJ = (posILength + posJLength) / 2;
                        var magOfPosIToInputPos = (inputToPosILength / averageLengthOfIJ);
                        var magOfIJ = (posJLength - posILength) / averageLengthOfIJ;
                        var angleIJ = BABYLON.BlendTreeUtils.GetSignedAngle(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSJ);
                        BABYLON.BlendTreeSystem.TempVector2_POSIP.set(magOfPosIToInputPos, posIToInputAngle * kDirScale);
                        BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(magOfIJ, angleIJ * kDirScale);
                        var lenSqIJ = BABYLON.BlendTreeSystem.TempVector2_POSIJ.lengthSquared();
                        var newWeight = BABYLON.Vector2.Dot(BABYLON.BlendTreeSystem.TempVector2_POSIP, BABYLON.BlendTreeSystem.TempVector2_POSIJ) / lenSqIJ;
                        newWeight = 1 - newWeight;
                        newWeight = BABYLON.BlendTreeUtils.ClampValue(newWeight, 0, 1);
                        weight = Math.min(newWeight, weight);
                    }
                }
                blendTree.weight = weight;
                totalWeight += weight;
            }
            for (var _i = 0, blendTreeArray_5 = blendTreeArray; _i < blendTreeArray_5.length; _i++) {
                var blendTree = blendTreeArray_5[_i];
                blendTree.weight /= totalWeight;
            }
        };
        BlendTreeSystem.Calculate2DFreeformCartesian = function (inputX, inputY, blendTreeArray) {
            BABYLON.BlendTreeSystem.TempVector2_IP.set(inputX, inputY);
            BABYLON.BlendTreeSystem.TempVector2_POSI.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSJ.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSIP.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(0, 0);
            var totalWeight = 0;
            for (var i = 0; i < blendTreeArray.length; ++i) {
                var blendTree = blendTreeArray[i];
                BABYLON.BlendTreeSystem.TempVector2_POSI.set(blendTree.posX, blendTree.posY);
                BABYLON.BlendTreeSystem.TempVector2_IP.subtractToRef(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSIP);
                var weight = 1;
                for (var j = 0; j < blendTreeArray.length; ++j) {
                    if (j === i) {
                        continue;
                    }
                    else {
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.set(blendTreeArray[j].posX, blendTreeArray[j].posY);
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.subtractToRef(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSIJ);
                        var lenSqIJ = BABYLON.BlendTreeSystem.TempVector2_POSIJ.lengthSquared();
                        var newWeight = BABYLON.Vector2.Dot(BABYLON.BlendTreeSystem.TempVector2_POSIP, BABYLON.BlendTreeSystem.TempVector2_POSIJ) / lenSqIJ;
                        newWeight = 1 - newWeight;
                        newWeight = BABYLON.BlendTreeUtils.ClampValue(newWeight, 0, 1);
                        weight = Math.min(weight, newWeight);
                    }
                }
                blendTree.weight = weight;
                totalWeight += weight;
            }
            for (var _i = 0, blendTreeArray_6 = blendTreeArray; _i < blendTreeArray_6.length; _i++) {
                var blendTree = blendTreeArray_6[_i];
                blendTree.weight /= totalWeight;
            }
        };
        BlendTreeSystem.TempVector2_IP = new BABYLON.Vector2(0, 0);
        BlendTreeSystem.TempVector2_POSI = new BABYLON.Vector2(0, 0);
        BlendTreeSystem.TempVector2_POSJ = new BABYLON.Vector2(0, 0);
        BlendTreeSystem.TempVector2_POSIP = new BABYLON.Vector2(0, 0);
        BlendTreeSystem.TempVector2_POSIJ = new BABYLON.Vector2(0, 0);
        return BlendTreeSystem;
    }());
    BABYLON.BlendTreeSystem = BlendTreeSystem;
    ///////////////////////////////////////////
    // Support Classes, Enums And Interfaces
    ///////////////////////////////////////////
    var MachineState = /** @class */ (function () {
        function MachineState() {
        }
        return MachineState;
    }());
    BABYLON.MachineState = MachineState;
    var TransitionCheck = /** @class */ (function () {
        function TransitionCheck() {
        }
        return TransitionCheck;
    }());
    BABYLON.TransitionCheck = TransitionCheck;
    var AnimationMixer = /** @class */ (function () {
        function AnimationMixer() {
        }
        return AnimationMixer;
    }());
    BABYLON.AnimationMixer = AnimationMixer;
    var BlendingWeights = /** @class */ (function () {
        function BlendingWeights() {
        }
        return BlendingWeights;
    }());
    BABYLON.BlendingWeights = BlendingWeights;
    var MotionType;
    (function (MotionType) {
        MotionType[MotionType["Clip"] = 0] = "Clip";
        MotionType[MotionType["Tree"] = 1] = "Tree";
    })(MotionType = BABYLON.MotionType || (BABYLON.MotionType = {}));
    var ConditionMode;
    (function (ConditionMode) {
        ConditionMode[ConditionMode["If"] = 1] = "If";
        ConditionMode[ConditionMode["IfNot"] = 2] = "IfNot";
        ConditionMode[ConditionMode["Greater"] = 3] = "Greater";
        ConditionMode[ConditionMode["Less"] = 4] = "Less";
        ConditionMode[ConditionMode["Equals"] = 6] = "Equals";
        ConditionMode[ConditionMode["NotEqual"] = 7] = "NotEqual";
    })(ConditionMode = BABYLON.ConditionMode || (BABYLON.ConditionMode = {}));
    var InterruptionSource;
    (function (InterruptionSource) {
        InterruptionSource[InterruptionSource["None"] = 0] = "None";
        InterruptionSource[InterruptionSource["Source"] = 1] = "Source";
        InterruptionSource[InterruptionSource["Destination"] = 2] = "Destination";
        InterruptionSource[InterruptionSource["SourceThenDestination"] = 3] = "SourceThenDestination";
        InterruptionSource[InterruptionSource["DestinationThenSource"] = 4] = "DestinationThenSource";
    })(InterruptionSource = BABYLON.InterruptionSource || (BABYLON.InterruptionSource = {}));
    var BlendTreeType;
    (function (BlendTreeType) {
        BlendTreeType[BlendTreeType["Simple1D"] = 0] = "Simple1D";
        BlendTreeType[BlendTreeType["SimpleDirectional2D"] = 1] = "SimpleDirectional2D";
        BlendTreeType[BlendTreeType["FreeformDirectional2D"] = 2] = "FreeformDirectional2D";
        BlendTreeType[BlendTreeType["FreeformCartesian2D"] = 3] = "FreeformCartesian2D";
        BlendTreeType[BlendTreeType["Direct"] = 4] = "Direct";
        BlendTreeType[BlendTreeType["Clip"] = 5] = "Clip";
    })(BlendTreeType = BABYLON.BlendTreeType || (BABYLON.BlendTreeType = {}));
    var BlendTreePosition;
    (function (BlendTreePosition) {
        BlendTreePosition[BlendTreePosition["Lower"] = 0] = "Lower";
        BlendTreePosition[BlendTreePosition["Upper"] = 1] = "Upper";
    })(BlendTreePosition = BABYLON.BlendTreePosition || (BABYLON.BlendTreePosition = {}));
    var AnimatorParameterType;
    (function (AnimatorParameterType) {
        AnimatorParameterType[AnimatorParameterType["Float"] = 1] = "Float";
        AnimatorParameterType[AnimatorParameterType["Int"] = 3] = "Int";
        AnimatorParameterType[AnimatorParameterType["Bool"] = 4] = "Bool";
        AnimatorParameterType[AnimatorParameterType["Trigger"] = 9] = "Trigger";
    })(AnimatorParameterType = BABYLON.AnimatorParameterType || (BABYLON.AnimatorParameterType = {}));
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon audio source manager pro class
     * @class AudioSource - All rights reserved (c) 2020 Mackey Kinard
     */
    var AudioSource = /** @class */ (function (_super) {
        __extends(AudioSource, _super);
        function AudioSource() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._audio = null;
            _this._name = null;
            _this._loop = false;
            _this._mute = false;
            _this._pitch = 1;
            _this._volume = 1;
            _this._preload = false;
            _this._priority = 128;
            _this._panstereo = 0;
            _this._mindistance = 1;
            _this._maxdistance = 50;
            _this._rolloffmode = "linear";
            _this._rollofffactor = 1;
            _this._playonawake = true;
            _this._spatialblend = 0;
            _this._preloaderUrl = null;
            _this._reverbzonemix = 1;
            _this._lastmutedvolume = null;
            _this._bypasseffects = false;
            _this._bypassreverbzones = false;
            _this._bypasslistenereffects = false;
            _this._initializedReadyInstance = false;
            /** Register handler that is triggered when the audio clip is ready */
            _this.onReadyObservable = new BABYLON.Observable();
            return _this;
        }
        AudioSource.prototype.getSoundClip = function () { return this._audio; };
        AudioSource.prototype.getAudioElement = function () { return (this._audio != null) ? this._audio._htmlAudioElement : null; };
        AudioSource.prototype.awake = function () { this.awakeAudioSource(); };
        AudioSource.prototype.destroy = function () { this.destroyAudioSource(); };
        AudioSource.prototype.awakeAudioSource = function () {
            this._name = this.getProperty("name", this._name);
            this._loop = this.getProperty("loop", this._loop);
            this._mute = this.getProperty("mute", this._mute);
            this._pitch = this.getProperty("pitch", this._pitch);
            this._volume = this.getProperty("volume", this._volume);
            this._preload = this.getProperty("preload", this._preload);
            this._priority = this.getProperty("priority", this._priority);
            this._panstereo = this.getProperty("panstereo", this._panstereo);
            this._playonawake = this.getProperty("playonawake", this._playonawake);
            this._mindistance = this.getProperty("mindistance", this._mindistance);
            this._maxdistance = this.getProperty("maxdistance", this._maxdistance);
            this._rolloffmode = this.getProperty("rolloffmode", this._rolloffmode);
            this._rollofffactor = this.getProperty("rollofffactor", this._rollofffactor);
            this._spatialblend = this.getProperty("spatialblend", this._spatialblend);
            this._reverbzonemix = this.getProperty("reverbzonemix", this._reverbzonemix);
            this._bypasseffects = this.getProperty("bypasseffects", this._bypasseffects);
            this._bypassreverbzones = this.getProperty("bypassreverbzones", this._bypassreverbzones);
            this._bypasslistenereffects = this.getProperty("bypasslistenereffects", this._bypasslistenereffects);
            if (this._name == null || this._name === "")
                this._name = "Unknown";
            // ..
            var filename = this.getProperty("file");
            if (filename != null && filename !== "") {
                var rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
                var playUrl = (rootUrl + filename);
                if (playUrl != null && playUrl !== "") {
                    if (this._preload === true) {
                        this._preloaderUrl = playUrl;
                    }
                    else {
                        this.setDataSource(playUrl);
                    }
                }
            }
        };
        AudioSource.prototype.destroyAudioSource = function () {
            this.onReadyObservable.clear();
            this.onReadyObservable = null;
            if (this._audio != null) {
                this._audio.dispose();
                this._audio = null;
            }
        };
        /**
         * Gets the ready status for track
         */
        AudioSource.prototype.isReady = function () {
            var result = false;
            if (this._audio != null) {
                result = this._audio.isReady();
            }
            return result;
        };
        /**
         * Gets the playing status for track
         */
        AudioSource.prototype.isPlaying = function () {
            var result = false;
            if (this._audio != null) {
                result = this._audio.isPlaying;
            }
            return result;
        };
        /**
         * Gets the paused status for track
         */
        AudioSource.prototype.isPaused = function () {
            var result = false;
            if (this._audio != null) {
                result = this._audio.isPaused;
            }
            return result;
        };
        /**
         * Play the sound track
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         * @param offset (optional) Start the sound at a specific time in seconds
         * @param length (optional) Sound duration (in seconds)
         */
        AudioSource.prototype.play = function (time, offset, length) {
            var _this = this;
            if (BABYLON.SceneManager.HasAudioContext()) {
                this.internalPlay(time, offset, length);
            }
            else {
                BABYLON.Engine.audioEngine.onAudioUnlockedObservable.addOnce(function () { _this.internalPlay(time, offset, length); });
            }
            return true;
        };
        AudioSource.prototype.internalPlay = function (time, offset, length) {
            var _this = this;
            if (this._audio != null) {
                if (this._initializedReadyInstance === true) {
                    this._audio.play(time, offset, length);
                }
                else {
                    this.onReadyObservable.addOnce(function () { _this._audio.play(time, offset, length); });
                }
            }
        };
        /**
         * Pause the sound track
         */
        AudioSource.prototype.pause = function () {
            var result = false;
            if (this._audio != null) {
                this._audio.pause();
                result = true;
            }
            return result;
        };
        /**
         * Stop the sound track
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        AudioSource.prototype.stop = function (time) {
            var result = false;
            if (this._audio != null) {
                this._audio.stop(time);
                result = true;
            }
            return result;
        };
        /**
         * Mute the sound track
         * @param time (optional) Mute the sound after X seconds. Start immediately (0) by default.
         */
        AudioSource.prototype.mute = function (time) {
            var result = false;
            if (this._audio != null) {
                this._lastmutedvolume = this._audio.getVolume();
                this._audio.setVolume(0, time);
            }
            return result;
        };
        /**
         * Unmute the sound track
         * @param time (optional) Unmute the sound after X seconds. Start immediately (0) by default.
         */
        AudioSource.prototype.unmute = function (time) {
            var result = false;
            if (this._audio != null) {
                if (this._lastmutedvolume != null) {
                    this._audio.setVolume(this._lastmutedvolume, time);
                    this._lastmutedvolume = null;
                }
            }
            return result;
        };
        /**
         * Gets the volume of the track
         */
        AudioSource.prototype.getVolume = function () {
            var result = 0;
            if (this._audio != null) {
                result = this._audio.getVolume();
            }
            else {
                result = this._volume;
            }
            return result;
        };
        /**
         * Sets the volume of the track
         * @param volume Define the new volume of the sound
         * @param time Define time for gradual change to new volume
         */
        AudioSource.prototype.setVolume = function (volume, time) {
            var result = false;
            this._volume = volume;
            if (this._audio != null) {
                this._audio.setVolume(this._volume, time);
            }
            result = true;
            return result;
        };
        /**
         * Gets the spatial sound option of the track
         */
        AudioSource.prototype.getSpatialSound = function () {
            var result = false;
            if (this._audio != null) {
                result = this._audio.spatialSound;
            }
            return result;
        };
        /**
         * Gets the spatial sound option of the track
         * @param value Define the value of the spatial sound
         */
        AudioSource.prototype.setSpatialSound = function (value) {
            if (this._audio != null) {
                this._audio.spatialSound = value;
            }
        };
        /**
         * Sets the sound track playback speed
         * @param rate the audio playback rate
         */
        AudioSource.prototype.setPlaybackSpeed = function (rate) {
            if (this._audio != null) {
                this._audio.setPlaybackRate(rate);
            }
        };
        /**
         * Gets the current time of the track
         */
        AudioSource.prototype.getCurrentTrackTime = function () {
            var result = 0;
            if (this._audio != null) {
                result = this._audio.currentTime;
            }
            return result;
        };
        /** Set audio data source */
        AudioSource.prototype.setDataSource = function (source) {
            var _this = this;
            if (this._audio != null) {
                this._audio.dispose();
                this._audio = null;
            }
            var spatialBlend = (this._spatialblend >= 0.1);
            var distanceModel = (this._rolloffmode === "logarithmic") ? "exponential" : "linear";
            var htmlAudioElementRequired = (this.transform.metadata != null && this.transform.metadata.vtt != null && this.transform.metadata.vtt === true);
            this._initializedReadyInstance = false;
            this._audio = new BABYLON.Sound(this._name, source, this.scene, function () {
                _this._lastmutedvolume = _this._volume;
                _this._audio.setVolume((_this._mute === true) ? 0 : _this._volume);
                _this._audio.setPlaybackRate(_this._pitch);
                _this._initializedReadyInstance = true;
                if (_this.onReadyObservable.hasObservers() === true) {
                    _this.onReadyObservable.notifyObservers(_this._audio);
                }
                // ..
                // Support Auto Play On Awake
                // ..
                if (_this._playonawake === true)
                    _this.play();
            }, {
                loop: this._loop,
                autoplay: false,
                refDistance: this._mindistance,
                maxDistance: this._maxdistance,
                rolloffFactor: this._rollofffactor,
                spatialSound: spatialBlend,
                distanceModel: distanceModel,
                streaming: htmlAudioElementRequired
            });
            this._audio.setPosition(this.transform.position.clone());
            if (spatialBlend === true)
                this._audio.attachToMesh(this.transform);
        };
        /** Add audio preloader asset tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        AudioSource.prototype.addPreloaderTasks = function (assetsManager) {
            var _this = this;
            if (this._preload === true) {
                var assetTask = assetsManager.addBinaryFileTask((this.transform.name + ".AudioTask"), this._preloaderUrl);
                assetTask.onSuccess = function (task) { _this.setDataSource(task.data); };
                assetTask.onError = function (task, message, exception) { console.error(message, exception); };
            }
        };
        return AudioSource;
    }(BABYLON.ScriptComponent));
    BABYLON.AudioSource = AudioSource;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon kinematic character controller pro class (Native Bullet Physics 2.82)
     * @class CharacterController - All rights reserved (c) 2020 Mackey Kinard
     */
    var CharacterController = /** @class */ (function (_super) {
        __extends(CharacterController, _super);
        function CharacterController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._abstractMesh = null;
            _this._avatarRadius = 0.5;
            _this._avatarHeight = 2;
            _this._centerOffset = new BABYLON.Vector3(0, 0, 0);
            _this._skinWidth = 0.08;
            _this._stepOffset = 0.3; // See https://discourse.threejs.org/t/ammo-js-with-three-js/12530/47 (Works Best With 0.535 and Box Or Cylinder Shape - ???)
            _this._slopeLimit = 45;
            _this._capsuleSegments = 16;
            _this._minMoveDistance = 0.001;
            _this._isPhysicsReady = false;
            _this._maxCollisions = 4;
            _this._useGhostSweepTest = false;
            _this._tmpPositionBuffer = new BABYLON.Vector3(0, 0, 0);
            _this._tmpCollisionContacts = null;
            _this.updatePosition = true;
            /** Register handler that is triggered when the transform position has been updated */
            _this.onUpdatePositionObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact has entered */
            _this.onCollisionEnterObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact is active */
            _this.onCollisionStayObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact has exited */
            _this.onCollisionExitObservable = new BABYLON.Observable();
            _this.m_character = null;
            _this.m_ghostShape = null;
            _this.m_ghostObject = null;
            _this.m_ghostCollision = null;
            _this.m_ghostTransform = null;
            _this.m_ghostPosition = null;
            _this.m_startPosition = null;
            _this.m_startTransform = null;
            _this.m_walkDirection = null;
            _this.m_warpPosition = null;
            _this.m_turningRate = 0;
            _this.m_moveDeltaX = 0;
            _this.m_moveDeltaZ = 0;
            _this.m_physicsEngine = null;
            _this.m_characterPosition = BABYLON.Vector3.Zero();
            return _this;
        }
        CharacterController.prototype.getInternalCharacter = function () { return this.m_character; };
        CharacterController.prototype.getAvatarRadius = function () { return this._avatarRadius; };
        CharacterController.prototype.getAvatarHeight = function () { return this._avatarHeight; };
        CharacterController.prototype.getSkinWidth = function () { return this._skinWidth; };
        CharacterController.prototype.getStepOffset = function () { return this._stepOffset; };
        CharacterController.prototype.getUseSweepTest = function () { return this._useGhostSweepTest; };
        CharacterController.prototype.getMinMoveDistance = function () { return this._minMoveDistance; };
        CharacterController.prototype.setMinMoveDistance = function (distance) { this._minMoveDistance = distance; };
        CharacterController.prototype.getVerticalVelocity = function () { return (this.m_character != null && this.m_character.getVerticalVelocity) ? this.m_character.getVerticalVelocity() : 0; }; // Note: Toolkit Addon Function
        CharacterController.prototype.getAddedMargin = function () { return (this.m_character != null && this.m_character.getAddedMargin) ? this.m_character.getAddedMargin() : 0; }; // Note: Toolkit Addon Function
        CharacterController.prototype.setAddedMargin = function (margin) { if (this.m_character != null && this.m_character.getAddedMargin)
            this.m_character.setAddedMargin(margin); }; // Note: Toolkit Addon Function
        CharacterController.prototype.setMaxJumpHeight = function (maxJumpHeight) { if (this.m_character != null)
            this.m_character.setMaxJumpHeight(maxJumpHeight); };
        CharacterController.prototype.setFallingSpeed = function (fallSpeed) { if (this.m_character != null)
            this.m_character.setFallSpeed(fallSpeed); };
        CharacterController.prototype.getSlopeLimit = function () { return (this.m_character != null) ? this.m_character.getMaxSlope() : 0; };
        CharacterController.prototype.setSlopeLimit = function (slopeRadians) { if (this.m_character != null)
            this.m_character.setMaxSlope(slopeRadians); };
        CharacterController.prototype.setUpAxis = function (axis) { if (this.m_character != null)
            this.m_character.setUpAxis(axis); };
        CharacterController.prototype.getGravity = function () { return (this.m_character != null) ? this.m_character.getGravity() : 0; };
        CharacterController.prototype.setGravity = function (gravity) { if (this.m_character != null)
            this.m_character.setGravity(gravity); };
        CharacterController.prototype.isGrounded = function () { return (this.m_character != null) ? this.m_character.onGround() : false; };
        CharacterController.prototype.isReady = function () { return (this.m_character != null); };
        CharacterController.prototype.canJump = function () { return (this.m_character != null) ? this.m_character.canJump() : false; };
        CharacterController.prototype.internalWarp = function (position) { if (this.m_character != null)
            this.m_character.warp(position); }; // Position: Ammo.btVector3
        CharacterController.prototype.internalJump = function () { if (this.m_character != null)
            this.m_character.jump(); };
        CharacterController.prototype.internalSetJumpSpeed = function (speed) { if (this.m_character != null)
            this.m_character.setJumpSpeed(speed); };
        CharacterController.prototype.internalSetWalkDirection = function (direction) { if (this.m_character != null)
            this.m_character.setWalkDirection(direction); }; // Direction: Ammo.btVector3
        CharacterController.prototype.internalSetVelocityForTimeInterval = function (velocity, interval) { if (this.m_character != null)
            this.m_character.setVelocityForTimeInterval(velocity, interval); }; // Velocity: Ammo.btVector3
        CharacterController.prototype.awake = function () { this.awakeMovementState(); };
        CharacterController.prototype.start = function () { this.startMovementState(); };
        CharacterController.prototype.update = function () { this.updateMovementState(); };
        CharacterController.prototype.destroy = function () { this.destroyMovementState(); };
        //////////////////////////////////////////////////
        // Protected Character Movement State Functions //
        //////////////////////////////////////////////////
        CharacterController.prototype.awakeMovementState = function () {
            this._abstractMesh = this.getAbstractMesh();
            this._avatarRadius = this.getProperty("avatarRadius", this._avatarRadius);
            this._avatarHeight = this.getProperty("avatarHeight", this._avatarHeight);
            this._skinWidth = this.getProperty("skinWidth", this._skinWidth);
            this._slopeLimit = this.getProperty("slopeLimit", this._slopeLimit);
            this._stepOffset = this.getProperty("stepOffset", this._stepOffset);
            this._minMoveDistance = this.getProperty("minMoveDistance", this._minMoveDistance);
            this._capsuleSegments = this.getProperty("capsuleSegments", this._capsuleSegments);
            this._useGhostSweepTest = this.getProperty("useGhostSweepTest", this._useGhostSweepTest);
            this.m_warpPosition = new Ammo.btVector3(0, 0, 0);
            this.m_walkDirection = new Ammo.btVector3(0, 0, 0);
            this.m_physicsEngine = BABYLON.SceneManager.GetPhysicsEngine(this.scene);
            //
            var centerOffsetData = this.getProperty("centerOffset");
            if (centerOffsetData != null)
                this._centerOffset = BABYLON.Utilities.ParseVector3(centerOffsetData);
            // console.warn("Starting Character Controller For: " + this.transform.name);
            this.setMaxNotifications(this._maxCollisions);
            var world = BABYLON.SceneManager.GetPhysicsWorld(this.scene);
            if (world != null) {
                var startingPos = BABYLON.Utilities.GetAbsolutePosition(this.transform, this._centerOffset);
                this.m_startPosition = new Ammo.btVector3(startingPos.x, startingPos.y, startingPos.z);
                this.m_startTransform = new Ammo.btTransform();
                this.m_startTransform.setIdentity();
                this.m_startTransform.setOrigin(this.m_startPosition);
                // ..
                // Create a debug collision shape
                // ..
                var showDebugColliders = BABYLON.Utilities.ShowDebugColliders();
                var colliderVisibility = BABYLON.Utilities.ColliderVisibility();
                var colliderRenderGroup = BABYLON.Utilities.ColliderRenderGroup();
                if (showDebugColliders === true && this.transform._debugCollider == null) {
                    var capsuleSize = new BABYLON.Vector3(this._avatarRadius, this._avatarHeight, 1);
                    capsuleSize.x *= Math.max(Math.abs(this.transform.scaling.x), Math.abs(this.transform.scaling.z));
                    capsuleSize.y *= this.transform.scaling.y;
                    var debugName = this.transform.name + ".Debug";
                    var debugCapsule = BABYLON.MeshBuilder.CreateCapsule(debugName, { tessellation: this._capsuleSegments, subdivisions: 8, capSubdivisions: 16, height: capsuleSize.y, radius: capsuleSize.x }, this.scene);
                    debugCapsule.position.set(0, 0, 0);
                    debugCapsule.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    debugCapsule.setParent(this.transform);
                    debugCapsule.position.copyFrom(this._centerOffset);
                    debugCapsule.visibility = colliderVisibility;
                    debugCapsule.renderingGroupId = colliderRenderGroup;
                    debugCapsule.material = BABYLON.Utilities.GetColliderMaterial(this.scene);
                    debugCapsule.checkCollisions = false;
                    debugCapsule.isPickable = false;
                    this.transform._debugCollider = debugCapsule;
                }
                // Create a ghost collision shape
                this.m_ghostShape = new Ammo.btCapsuleShape(this._avatarRadius, this._avatarHeight / 2);
                this.m_ghostShape.setMargin((this._skinWidth + BABYLON.CharacterController.MARGIN_FACTOR));
                // Create a ghost collision object
                this.m_ghostObject = new Ammo.btPairCachingGhostObject();
                this.m_ghostObject.setWorldTransform(this.m_startTransform);
                this.m_ghostObject.setCollisionShape(this.m_ghostShape);
                this.m_ghostObject.setCollisionFlags(BABYLON.CollisionFlags.CF_CHARACTER_OBJECT);
                // Create a ghost collision casting
                this.m_ghostCollision = Ammo.castObject(this.m_ghostObject, Ammo.btCollisionObject);
                // DEPRECIATED: this.m_ghostCollision.setContactProcessingThreshold(0);
                this.m_ghostCollision.entity = this._abstractMesh;
                // Create kinematic character controller
                this.m_character = new Ammo.btKinematicCharacterController(this.m_ghostObject, this.m_ghostShape, this._stepOffset);
                this.m_character.setUseGhostSweepTest(this._useGhostSweepTest);
                this.m_character.setUpInterpolate(true);
                this.m_character.setMaxSlope(BABYLON.Tools.ToRadians(this._slopeLimit));
                this.m_character.setGravity(BABYLON.System.Gravity3G);
                // Add ghost object and character to world
                world.addCollisionObject(this.m_ghostObject, BABYLON.CollisionFilters.CharacterFilter, BABYLON.CollisionFilters.StaticFilter | BABYLON.CollisionFilters.DefaultFilter | BABYLON.CollisionFilters.CharacterFilter);
                world.addAction(this.m_character);
            }
            else {
                BABYLON.Tools.Warn("Null physics world detected. Failed to create character controller: " + this.transform.name);
            }
            this._isPhysicsReady = (this.m_physicsEngine != null && this._tmpCollisionContacts != null && this.m_ghostObject != null && this._abstractMesh != null);
        };
        CharacterController.prototype.startMovementState = function () {
            this.updateMovementState();
        };
        CharacterController.prototype.syncMovementState = function () {
            if (this._isPhysicsReady === true) {
                this.m_ghostTransform = this.m_ghostObject.getWorldTransform();
                if (this.m_ghostTransform != null) {
                    this.m_ghostPosition = this.m_ghostTransform.getOrigin();
                }
                else {
                    this.m_ghostPosition = null;
                }
            }
        };
        CharacterController.prototype.updateMovementState = function () {
            this.syncMovementState();
            if (this._isPhysicsReady === true) {
                if (this.m_ghostPosition != null) {
                    if (this.updatePosition === true) {
                        // DEPRECIATED: this.transform.position.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
                        this.m_characterPosition.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
                        if (this._centerOffset != null) {
                            // Note: Subtract Character Controller Center Offset
                            this.m_characterPosition.subtractInPlace(this._centerOffset);
                        }
                        this.transform.position.copyFrom(this.m_characterPosition);
                    }
                    else {
                        this.setGhostWorldPosition(this.transform.position);
                    }
                    if (this.onUpdatePositionObservable.hasObservers() === true) {
                        this.onUpdatePositionObservable.notifyObservers(this.transform);
                    }
                }
            }
            this.parseGhostCollisionContacts();
        };
        CharacterController.prototype.parseGhostCollisionContacts = function () {
            if (this._isPhysicsReady === true) {
                var hasEnterObservers = this.onCollisionEnterObservable.hasObservers();
                var hasStayObservers = this.onCollisionStayObservable.hasObservers();
                var hasExitObservers = this.onCollisionExitObservable.hasObservers();
                if (hasEnterObservers || hasStayObservers || hasExitObservers) {
                    var index = 0; // Note: Flag All Collision List Items For End Contact State
                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                        this._tmpCollisionContacts[index].reset = true;
                    }
                    // ..
                    // Parse Overlapping Ghost Contact Objects
                    // ..
                    var contacts = this.m_ghostObject.getNumOverlappingObjects();
                    if (contacts > this._maxCollisions)
                        contacts = this._maxCollisions;
                    if (contacts > 0) {
                        for (index = 0; index < contacts; index++) {
                            var contactObject = this.m_ghostObject.getOverlappingObject(index);
                            if (contactObject != null) {
                                var contactBody = Ammo.castObject(contactObject, Ammo.btCollisionObject);
                                if (contactBody != null && contactBody.entity != null && contactBody.isActive()) {
                                    var foundindex = -1;
                                    var contactMesh = contactBody.entity;
                                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                        var check = this._tmpCollisionContacts[index];
                                        if (check.mesh != null && check.mesh === contactMesh) {
                                            check.state = 1;
                                            check.reset = false;
                                            foundindex = index;
                                            break;
                                        }
                                    }
                                    if (foundindex === -1) {
                                        for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                            var insert = this._tmpCollisionContacts[index];
                                            if (insert.mesh == null) {
                                                insert.mesh = contactMesh;
                                                insert.state = 0;
                                                insert.reset = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // ..
                    // Dispatch Ghost Collision Contact State
                    // ..
                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                        var info = this._tmpCollisionContacts[index];
                        if (info.reset === true) {
                            // Dispatch On Collision Exit Event
                            if (hasExitObservers && info.mesh != null) {
                                this.onCollisionExitObservable.notifyObservers(info.mesh);
                            }
                            // Reset Collision Contact Info Item
                            info.mesh = null;
                            info.state = 0;
                            info.reset = false;
                        }
                        else {
                            if (info.state === 0) {
                                // Dispatch On Collision Enter Event
                                if (hasEnterObservers && info.mesh != null) {
                                    this.onCollisionEnterObservable.notifyObservers(info.mesh);
                                }
                            }
                            else {
                                // Dispatch On Collision Stay Event
                                if (hasStayObservers && info.mesh != null) {
                                    this.onCollisionStayObservable.notifyObservers(info.mesh);
                                }
                            }
                        }
                    }
                }
            }
        };
        CharacterController.prototype.destroyMovementState = function () {
            this.m_physicsEngine = null;
            if (this.m_character != null) {
                Ammo.destroy(this.m_character);
                this.m_character = null;
            }
            if (this.m_ghostObject != null) {
                Ammo.destroy(this.m_ghostObject);
                this.m_ghostObject = null;
            }
            if (this.m_ghostShape != null) {
                Ammo.destroy(this.m_ghostShape);
                this.m_ghostShape = null;
            }
            if (this.m_ghostCollision != null) {
                Ammo.destroy(this.m_ghostCollision); // ???
                this.m_ghostCollision = null;
            }
            if (this.m_ghostPosition != null) {
                Ammo.destroy(this.m_ghostPosition); // ???
                this.m_ghostPosition = null;
            }
            if (this.m_ghostTransform != null) {
                Ammo.destroy(this.m_ghostTransform); // ???
                this.m_ghostTransform = null;
            }
            if (this.m_startPosition != null) {
                Ammo.destroy(this.m_startPosition);
                this.m_startPosition = null;
            }
            if (this.m_startTransform != null) {
                Ammo.destroy(this.m_startTransform);
                this.m_startTransform = null;
            }
            if (this.m_warpPosition != null) {
                Ammo.destroy(this.m_warpPosition);
                this.m_warpPosition = null;
            }
            if (this.m_walkDirection != null) {
                Ammo.destroy(this.m_walkDirection);
                this.m_walkDirection = null;
            }
            this.onUpdatePositionObservable.clear();
            this.onUpdatePositionObservable = null;
            this.onCollisionEnterObservable.clear();
            this.onCollisionEnterObservable = null;
            this.onCollisionStayObservable.clear();
            this.onCollisionStayObservable = null;
            this.onCollisionExitObservable.clear();
            this.onCollisionExitObservable = null;
            this._tmpCollisionContacts = null;
            this._tmpPositionBuffer = null;
            this._abstractMesh = null;
        };
        ////////////////////////////////////////////////////
        // Character Controller Advanced Helper Functions //
        ////////////////////////////////////////////////////
        /** Sets the maximum number of simultaneous contact notfications to dispatch per frame. Defaults value is 4. (Advanved Use Only) */
        CharacterController.prototype.setMaxNotifications = function (max) {
            this._maxCollisions = max;
            this._tmpCollisionContacts = [];
            for (var index = 0; index < this._maxCollisions; index++) {
                this._tmpCollisionContacts.push(new BABYLON.CollisionContactInfo());
            }
        };
        /** Sets character collision activation state using physics ghost object. (Advanved Use Only) */
        CharacterController.prototype.setActivationState = function (state) {
            if (this.m_ghostCollision != null && this.m_ghostCollision.setActivationState) {
                this.m_ghostCollision.setActivationState(state);
            }
        };
        /** Gets character collision group filter using physics ghost object. (Advanved Use Only) */
        CharacterController.prototype.getCollisionFilterGroup = function () {
            var result = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                result = this.m_ghostCollision.getBroadphaseHandle().get_m_collisionFilterGroup();
            }
            return result;
        };
        /** Sets character collision group filter using physics ghost object. (Advanved Use Only) */
        CharacterController.prototype.setCollisionFilterGroup = function (group) {
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                this.m_ghostCollision.getBroadphaseHandle().set_m_collisionFilterGroup(group);
            }
        };
        /** Gets character collision mask filter using physics ghost object. (Advanved Use Only) */
        CharacterController.prototype.getCollisionFilterMask = function () {
            var result = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                result = this.m_ghostCollision.getBroadphaseHandle().get_m_collisionFilterMask();
            }
            return result;
        };
        /** Sets the character collision mask filter using physics ghost object. (Advanved Use Only) */
        CharacterController.prototype.setCollisionFilterMask = function (mask) {
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                this.m_ghostCollision.getBroadphaseHandle().set_m_collisionFilterMask(mask);
            }
        };
        /** Gets the chracter contact processing threshold using physics ghost object. (Advanved Use Only) */
        CharacterController.prototype.getContactProcessingThreshold = function () {
            var result = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getContactProcessingThreshold) {
                this.m_ghostCollision.getContactProcessingThreshold();
            }
            return result;
        };
        /** Sets character contact processing threshold using physics ghost object. (Advanved Use Only) */
        CharacterController.prototype.setContactProcessingThreshold = function (threshold) {
            if (this.m_ghostCollision != null && this.m_ghostCollision.setContactProcessingThreshold) {
                this.m_ghostCollision.setContactProcessingThreshold(threshold);
            }
        };
        /** Get the current position of the physics ghost object world transform. (Advanved Use Only) */
        CharacterController.prototype.getGhostWorldPosition = function () {
            var result = new BABYLON.Vector3(0, 0, 0);
            if (this.m_ghostPosition != null) {
                result.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
            }
            return result;
        };
        /** Get the current position of the physics ghost object world transform. (Advanved Use Only) */
        CharacterController.prototype.getGhostWorldPositionToRef = function (result) {
            if (this.m_ghostPosition != null && result != null) {
                result.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
            }
        };
        /** Manually set the position of the physics ghost object world transform. (Advanved Use Only) */
        CharacterController.prototype.setGhostWorldPosition = function (position) {
            if (this.m_ghostObject != null && this.m_ghostTransform != null) {
                if (this.m_ghostPosition != null && position != null) {
                    this.m_ghostPosition.setValue(position.x, position.y, position.z);
                    this.m_ghostTransform.setOrigin(this.m_ghostPosition);
                }
                this.m_ghostObject.setWorldTransform(this.m_ghostTransform);
            }
        };
        ////////////////////////////////////////////////////
        // Public Character Controller Movement Functions //
        ////////////////////////////////////////////////////
        /** Sets the kinematic character position to the specified location. */
        CharacterController.prototype.set = function (x, y, z) {
            this._tmpPositionBuffer.set(x, y, z);
            this.setGhostWorldPosition(this._tmpPositionBuffer);
        };
        /** Translates the kinematic character with the specfied velocity. */
        CharacterController.prototype.move = function (velocity) {
            if (velocity != null) {
                this.m_moveDeltaX = velocity.x;
                this.m_moveDeltaZ = velocity.z;
                if (Math.abs(velocity.x) < this._minMoveDistance) {
                    if (velocity.x > 0) {
                        this.m_moveDeltaX = this._minMoveDistance;
                    }
                    else if (velocity.x < 0) {
                        this.m_moveDeltaX = -this._minMoveDistance;
                    }
                }
                if (Math.abs(velocity.z) < this._minMoveDistance) {
                    if (velocity.z > 0) {
                        this.m_moveDeltaZ = this._minMoveDistance;
                    }
                    else if (velocity.z < 0) {
                        this.m_moveDeltaZ = -this._minMoveDistance;
                    }
                }
                if (this.m_walkDirection != null) {
                    this.m_walkDirection.setValue(this.m_moveDeltaX, 0, this.m_moveDeltaZ);
                    this.internalSetWalkDirection(this.m_walkDirection);
                }
            }
        };
        /** Jumps the kinematic chacracter with the specified speed. */
        CharacterController.prototype.jump = function (speed) {
            this.internalSetJumpSpeed(speed);
            this.internalJump();
        };
        /** Warps the kinematic chacracter to the specified position. */
        CharacterController.prototype.warp = function (position) {
            if (this.m_warpPosition != null) {
                this.m_warpPosition.setValue(position.x, position.y, position.z);
                this.internalWarp(this.m_warpPosition);
            }
        };
        CharacterController.MARGIN_FACTOR = -0.04;
        return CharacterController;
    }(BABYLON.ScriptComponent));
    BABYLON.CharacterController = CharacterController;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon navigation agent pro class (Unity Style Navigation Agent System)
     * @class NavigationAgent - All rights reserved (c) 2020 Mackey Kinard
     */
    var NavigationAgent = /** @class */ (function (_super) {
        __extends(NavigationAgent, _super);
        function NavigationAgent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.distanceToTarget = 0;
            _this.teleporting = false;
            _this.moveDirection = new BABYLON.Vector3(0.0, 0.0, 0.0);
            _this.resetPosition = new BABYLON.Vector3(0.0, 0.0, 0.0);
            _this.lastPosition = new BABYLON.Vector3(0.0, 0.0, 0.0);
            _this.distancePosition = new BABYLON.Vector3(0.0, 0.0, 0.0);
            _this.currentPosition = new BABYLON.Vector3(0.0, 0.0, 0.0);
            _this.currentRotation = new BABYLON.Quaternion(0.0, 0.0, 0.0, 1.0);
            _this.currentVelocity = new BABYLON.Vector3(0.0, 0.0, 0.0);
            _this.currentWaypoint = new BABYLON.Vector3(0.0, 0.0, 0.0);
            _this.heightOffset = 0;
            _this.angularSpeed = 0;
            _this.updatePosition = true;
            _this.updateRotation = true;
            _this.distanceEpsilon = 0.1;
            _this.velocityEpsilon = 1.1;
            _this.offMeshVelocity = 1.5;
            _this.stoppingDistance = 0;
            /** Register handler that is triggered when the agent is ready for navigation */
            _this.onReadyObservable = new BABYLON.Observable();
            /** Register handler that is triggered before the navigation update */
            _this.onPreUpdateObservable = new BABYLON.Observable();
            /** Register handler that is triggered after the navigation update */
            _this.onPostUpdateObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the navigation is complete */
            _this.onNavCompleteObservable = new BABYLON.Observable();
            _this.m_agentState = 0;
            _this.m_agentIndex = -1;
            _this.m_agentReady = false;
            _this.m_agentGhost = null;
            _this.m_agentParams = null;
            _this.m_agentMovement = new BABYLON.Vector3(0.0, 0.0, 0.0);
            _this.m_agentDirection = new BABYLON.Vector3(0.0, 0.0, 1.0);
            _this.m_agentQuaternion = new BABYLON.Quaternion(0.0, 0.0, 0.0, 1.0);
            _this.m_agentDestination = null;
            return _this;
        }
        NavigationAgent.prototype.isReady = function () { return this.m_agentReady; };
        NavigationAgent.prototype.isNavigating = function () { return (this.m_agentDestination != null); };
        NavigationAgent.prototype.isTeleporting = function () { return this.teleporting; };
        NavigationAgent.prototype.isOnOffMeshLink = function () { return (this.m_agentState === BABYLON.CrowdAgentState.DT_CROWDAGENT_STATE_OFFMESH); };
        NavigationAgent.prototype.getAgentType = function () { return this.type; };
        NavigationAgent.prototype.getAgentState = function () { return this.m_agentState; };
        NavigationAgent.prototype.getAgentIndex = function () { return this.m_agentIndex; };
        NavigationAgent.prototype.getAgentOffset = function () { return this.baseOffset; };
        NavigationAgent.prototype.getTargetDistance = function () { return this.distanceToTarget; };
        NavigationAgent.prototype.getCurrentPosition = function () { return this.currentPosition; };
        NavigationAgent.prototype.getCurrentRotation = function () { return this.currentRotation; };
        NavigationAgent.prototype.getCurrentVelocity = function () { return this.currentVelocity; };
        NavigationAgent.prototype.getAgentParameters = function () { return this.m_agentParams; };
        NavigationAgent.prototype.setAgentParameters = function (parameters) { this.m_agentParams = parameters; this.updateAgentParameters(); };
        NavigationAgent.prototype.awake = function () { this.awakeNavigationAgent(); };
        NavigationAgent.prototype.update = function () { this.updateNavigationAgent(); };
        NavigationAgent.prototype.destroy = function () { this.destroyNavigationAgent(); };
        //////////////////////////////////////////////////////
        // Navigation Private Functions                     //
        //////////////////////////////////////////////////////
        NavigationAgent.prototype.awakeNavigationAgent = function () {
            this.type = this.getProperty("type", this.type);
            this.speed = this.getProperty("speed", this.speed);
            this.baseOffset = this.getProperty("offset", this.baseOffset);
            this.angularSpeed = this.getProperty("angularspeed", this.angularSpeed);
            this.acceleration = this.getProperty("acceleration", this.acceleration);
            this.stoppingDistance = this.getProperty("stoppingdistance", this.stoppingDistance);
            this.autoBraking = this.getProperty("autobraking", this.autoBraking);
            this.avoidRadius = this.getProperty("avoidradius", this.avoidRadius);
            this.avoidHeight = this.getProperty("avoidheight", this.avoidHeight);
            this.obstacleAvoidanceType = this.getProperty("avoidquality", this.obstacleAvoidanceType);
            this.avoidancePriority = this.getProperty("avoidpriority", this.avoidancePriority);
            this.autoTraverseOffMeshLink = this.getProperty("autotraverse", this.autoTraverseOffMeshLink);
            this.autoRepath = this.getProperty("autopepath", this.autoRepath);
            this.areaMask = this.getProperty("areamask", this.areaMask);
            // ..
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
            // DEBUG: this.m_agentGhost = BABYLON.Mesh.CreateBox((this.transform.name + "Agent"), 1, this.scene);
            this.m_agentGhost = new BABYLON.TransformNode((this.transform.name + ".Agent"), this.scene);
            this.m_agentGhost.position = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.m_agentGhost.rotation = new BABYLON.Vector3(0.0, 0.0, 0.0);
            BABYLON.Utilities.ValidateTransformQuaternion(this.m_agentGhost);
            this.m_agentGhost.position.copyFrom(this.transform.position);
            this.lastPosition.copyFrom(this.transform.position);
        };
        NavigationAgent.prototype.updateNavigationAgent = function () {
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd == null)
                return; // Note: No Detour Navigation Mesh Available Yet
            if (this.m_agentIndex < 0) {
                this.m_agentParams = {
                    radius: this.avoidRadius,
                    height: this.avoidHeight,
                    maxSpeed: this.speed,
                    maxAcceleration: this.acceleration,
                    collisionQueryRange: 2.0,
                    pathOptimizationRange: 20.0,
                    separationWeight: 1.0
                };
                BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.resetPosition);
                this.m_agentIndex = crowd.addAgent(this.resetPosition, this.m_agentParams, this.m_agentGhost);
                if (this.m_agentIndex >= 0) {
                    this.m_agentReady = true;
                    if (this.onReadyObservable.hasObservers() === true) {
                        this.onReadyObservable.notifyObservers(this.transform);
                    }
                }
                return; // Note: Start Updating Navigation Agent Next Frame
            }
            // ..
            this.m_agentState = crowd.getAgentState(this.m_agentIndex);
            this.getAgentWaypointToRef(this.currentWaypoint);
            this.getAgentPositionToRef(this.currentPosition);
            this.distancePosition.copyFrom(this.currentPosition);
            if (this.isOnOffMeshLink()) {
                this.currentPosition.subtractToRef(this.lastPosition, this.currentVelocity);
                this.currentVelocity.scaleInPlace(this.speed * this.offMeshVelocity);
            }
            else {
                this.getAgentVelocityToRef(this.currentVelocity);
            }
            if (this.onPreUpdateObservable.hasObservers() === true) {
                this.onPreUpdateObservable.notifyObservers(this.transform);
            }
            this.currentPosition.y += (this.baseOffset + this.heightOffset);
            if (this.currentVelocity.length() >= this.velocityEpsilon) {
                this.currentVelocity.normalize();
                var rotateFactor = (this.angularSpeed * BABYLON.NavigationAgent.ANGULAR_SPEED_RATIO * this.getDeltaSeconds());
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // KEEP FOR REFERENCE: Compute Agent Orientation
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Note: Interpolate the rotation on Y to get a smoother orientation change
                // const desiredRotation:number = Math.atan2(this.currentVelocity.x, this.currentVelocity.z);
                // this.transform.rotation.y = this.transform.rotation.y + (desiredRotation - this.transform.rotation.y) * 0.05;
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.isOnOffMeshLink()) {
                    // Rotate Toward Velocity Direction
                    this.moveDirection.copyFrom(this.m_agentDirection);
                    this.m_agentDirection.set((this.moveDirection.x + (this.currentVelocity.x - this.moveDirection.x)), (this.moveDirection.y + (this.currentVelocity.y - this.moveDirection.y)), (this.moveDirection.z + (this.currentVelocity.z - this.moveDirection.z)));
                    this.m_agentDirection.normalize();
                    var targetAngle = (BABYLON.NavigationAgent.TARGET_ANGLE_FACTOR - Math.atan2(this.m_agentDirection.x, this.m_agentDirection.z));
                    BABYLON.Quaternion.FromEulerAnglesToRef(0.0, targetAngle, 0.0, this.currentRotation);
                    // Rotation Update
                    if (this.isNavigating() && this.updateRotation === true) {
                        BABYLON.Quaternion.SlerpToRef(this.transform.rotationQuaternion, this.currentRotation, rotateFactor, this.transform.rotationQuaternion);
                    }
                }
                else {
                    // Rotate Toward Next Target Waypoint
                    this.m_agentQuaternion.copyFrom(this.transform.rotationQuaternion);
                    if (this.isNavigating() && this.updateRotation === true) {
                        this.transform.lookAt(this.currentWaypoint);
                    }
                    // Correct Transform Look At Rotation
                    this.transform.rotationQuaternion.toEulerAnglesToRef(this.m_agentDirection);
                    BABYLON.Quaternion.FromEulerAnglesToRef(0.0, this.m_agentDirection.y, 0.0, this.currentRotation);
                    // Rotation Update
                    if (this.isNavigating() && this.updateRotation === true) {
                        BABYLON.Quaternion.SlerpToRef(this.m_agentQuaternion, this.currentRotation, rotateFactor, this.transform.rotationQuaternion);
                    }
                }
            }
            // Position Update
            if (this.isNavigating() && this.updatePosition === true) {
                this.transform.position.copyFrom(this.currentPosition);
            }
            // Target Distance
            if (this.isNavigating()) {
                this.distanceToTarget = BABYLON.Vector3.Distance(this.distancePosition, this.m_agentDestination);
                if (this.distanceToTarget <= Math.max(this.distanceEpsilon, this.stoppingDistance)) {
                    this.cancelNavigation();
                    if (this.onNavCompleteObservable.hasObservers() === true) {
                        this.onNavCompleteObservable.notifyObservers(this.transform);
                    }
                }
            }
            else {
                this.distanceToTarget = 0;
            }
            // Final Post Update
            this.lastPosition.copyFrom(this.currentPosition);
            if (this.onPostUpdateObservable.hasObservers() === true) {
                this.onPostUpdateObservable.notifyObservers(this.transform);
            }
            // Reset Teleport Flag
            this.teleporting = false;
        };
        NavigationAgent.prototype.updateAgentParameters = function () {
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0)
                crowd.updateAgentParameters(this.m_agentIndex, this.m_agentParams);
        };
        NavigationAgent.prototype.destroyNavigationAgent = function () {
            this.m_agentIndex = -1;
            this.m_agentReady = false;
            this.m_agentMovement = null;
            this.m_agentDirection = null;
            this.m_agentDestination = null;
            this.moveDirection = null;
            this.resetPosition = null;
            this.lastPosition = null;
            this.currentPosition = null;
            this.currentRotation = null;
            this.currentVelocity = null;
            this.currentWaypoint = null;
            this.onReadyObservable.clear();
            this.onReadyObservable = null;
            this.onPreUpdateObservable.clear();
            this.onPreUpdateObservable = null;
            this.onPostUpdateObservable.clear();
            this.onPostUpdateObservable = null;
            this.onNavCompleteObservable.clear();
            this.onNavCompleteObservable = null;
            if (this.m_agentGhost != null) {
                this.m_agentGhost.dispose();
                this.m_agentGhost = null;
            }
        };
        //////////////////////////////////////////////////////
        // Navigation Public Functions                      //
        //////////////////////////////////////////////////////
        /** Move agent relative to current position. */
        NavigationAgent.prototype.move = function (offset, closetPoint) {
            if (closetPoint === void 0) { closetPoint = true; }
            var plugin = BABYLON.SceneManager.GetNavigationTools();
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (plugin != null && crowd != null) {
                crowd.getAgentPosition(this.m_agentIndex).addToRef(offset, this.m_agentMovement);
                if (closetPoint === true)
                    this.m_agentDestination = plugin.getClosestPoint(this.m_agentMovement);
                else
                    this.m_agentDestination = this.m_agentMovement.clone();
                if (this.m_agentIndex >= 0)
                    crowd.agentGoto(this.m_agentIndex, this.m_agentDestination);
            }
            else {
                BABYLON.Tools.Warn("No recast navigation mesh or crowd interface data available!");
            }
        };
        /** Teleport agent to destination point. */
        NavigationAgent.prototype.teleport = function (destination, closetPoint) {
            if (closetPoint === void 0) { closetPoint = true; }
            var plugin = BABYLON.SceneManager.GetNavigationTools();
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (plugin != null && crowd != null) {
                this.teleporting = true;
                if (closetPoint === true)
                    this.m_agentDestination = plugin.getClosestPoint(destination);
                else
                    this.m_agentDestination = destination.clone();
                if (this.m_agentIndex >= 0)
                    crowd.agentTeleport(this.m_agentIndex, this.m_agentDestination);
            }
            else {
                BABYLON.Tools.Warn("No recast navigation mesh or crowd interface data available!");
            }
        };
        /** Sets agent current destination point. */
        NavigationAgent.prototype.setDestination = function (destination, closetPoint) {
            if (closetPoint === void 0) { closetPoint = true; }
            var plugin = BABYLON.SceneManager.GetNavigationTools();
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (plugin != null && crowd != null) {
                if (closetPoint === true)
                    this.m_agentDestination = plugin.getClosestPoint(destination);
                else
                    this.m_agentDestination = destination.clone();
                if (this.m_agentIndex >= 0)
                    crowd.agentGoto(this.m_agentIndex, this.m_agentDestination);
            }
            else {
                BABYLON.Tools.Warn("No recast navigation mesh or crowd interface data available!");
            }
        };
        /** Gets agent current world space velocity. */
        NavigationAgent.prototype.getAgentVelocity = function () {
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentVelocity(this.m_agentIndex) : null;
        };
        /** Gets agent current world space velocity. */
        NavigationAgent.prototype.getAgentVelocityToRef = function (result) {
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0)
                crowd.getAgentVelocityToRef(this.m_agentIndex, result);
        };
        /** Gets agent current world space position. */
        NavigationAgent.prototype.getAgentPosition = function () {
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentPosition(this.m_agentIndex) : null;
        };
        /** Gets agent current world space position. */
        NavigationAgent.prototype.getAgentPositionToRef = function (result) {
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0)
                crowd.getAgentPositionToRef(this.m_agentIndex, result);
        };
        /** Gets agent current waypoint position. */
        NavigationAgent.prototype.getAgentWaypoint = function () {
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentNextTargetPath(this.m_agentIndex) : null;
        };
        /** Gets agent current waypoint position. */
        NavigationAgent.prototype.getAgentWaypointToRef = function (result) {
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0)
                crowd.getAgentNextTargetPathToRef(this.m_agentIndex, result);
        };
        /** Cancel current waypoint path navigation. */
        NavigationAgent.prototype.cancelNavigation = function () {
            this.m_agentDestination = null; // Note: Disable Auto Position Update
            var crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            var position = this.getAgentPosition();
            if (position != null && crowd != null && this.m_agentIndex >= 0) {
                crowd.agentTeleport(this.m_agentIndex, position);
                // DEPRECIATED: position.y += (this.baseOffset + this.heightOffset);
                // DEPRECIATED: this.transform.position.copyFrom(position);
            }
        };
        NavigationAgent.TARGET_ANGLE_FACTOR = (Math.PI * 0.5);
        NavigationAgent.ANGULAR_SPEED_RATIO = 0.05;
        return NavigationAgent;
    }(BABYLON.ScriptComponent));
    BABYLON.NavigationAgent = NavigationAgent;
    /**
     *  Recast Detour Crowd Agent States
     */
    var CrowdAgentState;
    (function (CrowdAgentState) {
        CrowdAgentState[CrowdAgentState["DT_CROWDAGENT_STATE_INVALID"] = 0] = "DT_CROWDAGENT_STATE_INVALID";
        CrowdAgentState[CrowdAgentState["DT_CROWDAGENT_STATE_WALKING"] = 1] = "DT_CROWDAGENT_STATE_WALKING";
        CrowdAgentState[CrowdAgentState["DT_CROWDAGENT_STATE_OFFMESH"] = 2] = "DT_CROWDAGENT_STATE_OFFMESH";
    })(CrowdAgentState = BABYLON.CrowdAgentState || (BABYLON.CrowdAgentState = {}));
    ;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon raycast vehicle controller pro class (Native Bullet Physics 2.82)
     * @class RaycastVehicle - All rights reserved (c) 2020 Mackey Kinard
     */
    var RaycastVehicle = /** @class */ (function () {
        function RaycastVehicle(entity, world, center, defaultAngularFactor) {
            if (defaultAngularFactor === void 0) { defaultAngularFactor = null; }
            this._centerMass = new BABYLON.Vector3(0, 0, 0);
            this._chassisMesh = null;
            this._tempVectorPos = new BABYLON.Vector3(0, 0, 0);
            this.lockedWheelIndexes = null;
            this.m_vehicle = null;
            this.m_vehicleTuning = null;
            this.m_vehicleRaycaster = null;
            this.m_vehicleColliders = null;
            this.m_tempTransform = null;
            this.m_tempPosition = null;
            this.m_wheelDirectionCS0 = null;
            this.m_wheelAxleCS = null;
            this._chassisMesh = entity;
            this._centerMass = center;
            this.m_vehicleTuning = new Ammo.btVehicleTuning();
            this.m_vehicleRaycaster = (Ammo.btSmoothVehicleRaycaster != null) ? new Ammo.btSmoothVehicleRaycaster(world) : new Ammo.btDefaultVehicleRaycaster(world);
            this.m_vehicleColliders = (this._chassisMesh.metadata != null && this._chassisMesh.metadata.unity != null && this._chassisMesh.metadata.unity.wheels != null) ? this._chassisMesh.metadata.unity.wheels : null;
            this.m_vehicle = new Ammo.btRaycastVehicle(this.m_vehicleTuning, this._chassisMesh.physicsImpostor.physicsBody, this.m_vehicleRaycaster);
            this.m_vehicle.setCoordinateSystem(0, 1, 2); // Y-UP-AXIS
            this.m_wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0); // Y-UP-AXIS
            this.m_wheelAxleCS = new Ammo.btVector3(-1, 0, 0); // Y-UP-AXIS
            this.m_tempPosition = null;
            this.m_tempTransform = null;
            this.setupWheelInformation(defaultAngularFactor);
            world.addAction(this.m_vehicle);
        }
        RaycastVehicle.prototype.getCenterMassOffset = function () { return this._centerMass; };
        RaycastVehicle.prototype.getInternalVehicle = function () { return this.m_vehicle; };
        RaycastVehicle.prototype.getUpAxis = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getUpAxis(); };
        RaycastVehicle.prototype.getRightAxis = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getRightAxis(); };
        RaycastVehicle.prototype.getForwardAxis = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getForwardAxis(); };
        RaycastVehicle.prototype.getForwardVector = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getForwardVector(); };
        RaycastVehicle.prototype.getNumWheels = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getNumWheels(); };
        RaycastVehicle.prototype.getWheelInfo = function (wheel) { if (this.m_vehicle != null)
            return this.m_vehicle.getWheelInfo(wheel); }; // Ammo.btWheelInfo
        RaycastVehicle.prototype.resetSuspension = function () { if (this.m_vehicle != null)
            this.m_vehicle.resetSuspension(); };
        RaycastVehicle.prototype.setPitchControl = function (pitch) { if (this.m_vehicle != null)
            this.m_vehicle.setPitchControl(pitch); };
        RaycastVehicle.prototype.setEngineForce = function (power, wheel) { if (this.m_vehicle != null)
            this.m_vehicle.applyEngineForce(power, wheel); };
        RaycastVehicle.prototype.setBrakingForce = function (brake, wheel) { if (this.m_vehicle != null)
            this.m_vehicle.setBrake(brake, wheel); };
        RaycastVehicle.prototype.getWheelTransform = function (wheel) { if (this.m_vehicle != null)
            return this.m_vehicle.getWheelTransformWS(wheel); }; // Ammo.btTransform
        RaycastVehicle.prototype.updateWheelTransform = function (wheel, interpolate) { if (this.m_vehicle != null)
            this.m_vehicle.updateWheelTransform(wheel, interpolate); };
        RaycastVehicle.prototype.getUserConstraintType = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getUserConstraintType(); };
        RaycastVehicle.prototype.setUserConstraintType = function (userConstraintType) { if (this.m_vehicle != null)
            this.m_vehicle.setUserConstraintType(userConstraintType); };
        RaycastVehicle.prototype.setUserConstraintId = function (uid) { if (this.m_vehicle != null)
            this.m_vehicle.setUserConstraintId(uid); };
        RaycastVehicle.prototype.getUserConstraintId = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getUserConstraintId(); };
        RaycastVehicle.prototype.getRawCurrentSpeedKph = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getCurrentSpeedKmHour(); };
        RaycastVehicle.prototype.getRawCurrentSpeedMph = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getCurrentSpeedKmHour() * BABYLON.System.Kph2Mph; };
        RaycastVehicle.prototype.getAbsCurrentSpeedKph = function () { if (this.m_vehicle != null)
            return Math.abs(this.m_vehicle.getCurrentSpeedKmHour()); };
        RaycastVehicle.prototype.getAbsCurrentSpeedMph = function () { if (this.m_vehicle != null)
            return Math.abs(this.m_vehicle.getCurrentSpeedKmHour()) * BABYLON.System.Kph2Mph; };
        RaycastVehicle.prototype.getVehicleTuningSystem = function () { return this.m_vehicleTuning; }; // Ammo.btVehicleTuning
        RaycastVehicle.prototype.getChassisWorldTransform = function () { if (this.m_vehicle != null)
            return this.m_vehicle.getChassisWorldTransform(); }; // Ammo.btTransform
        RaycastVehicle.prototype.dispose = function () {
            this.deleteWheelInformation();
            if (this.m_vehicle != null) {
                Ammo.destroy(this.m_vehicle);
                this.m_vehicle = null;
            }
            if (this.m_vehicleTuning != null) {
                Ammo.destroy(this.m_vehicleTuning);
                this.m_vehicleTuning = null;
            }
            if (this.m_vehicleRaycaster != null) {
                Ammo.destroy(this.m_vehicleRaycaster);
                this.m_vehicleRaycaster = null;
            }
            if (this.m_wheelDirectionCS0 != null) {
                Ammo.destroy(this.m_wheelDirectionCS0);
                this.m_wheelDirectionCS0 = null;
            }
            if (this.m_wheelAxleCS != null) {
                Ammo.destroy(this.m_wheelAxleCS);
                this.m_wheelAxleCS = null;
            }
            if (this.m_tempPosition != null) {
                this.m_tempPosition = null;
            }
            if (this.m_tempTransform != null) {
                this.m_tempTransform = null;
            }
            this.m_vehicleColliders = null;
        };
        ///////////////////////////////////////////////////////
        // Static Raycast Vehicle Instance Helper Functions
        ///////////////////////////////////////////////////////
        /** Gets the rigidbody raycast vehicle controller for the entity. Note: Wheel collider metadata informaion is required for raycast vehicle control. */
        RaycastVehicle.GetInstance = function (scene, rigidbody, defaultAngularFactor) {
            if (defaultAngularFactor === void 0) { defaultAngularFactor = null; }
            var anybody = rigidbody;
            if (anybody.m_raycastVehicle == null) {
                if (rigidbody.hasWheelColliders()) {
                    var rightHanded = BABYLON.SceneManager.GetRightHanded(scene);
                    if (rightHanded === true)
                        BABYLON.Tools.Warn("Raycast vehicle not supported for right handed scene: " + anybody._abstractMesh.name);
                    anybody.m_raycastVehicle = new BABYLON.RaycastVehicle(anybody._abstractMesh, anybody.m_physicsWorld, anybody._centerOfMass, defaultAngularFactor);
                }
                else {
                    BABYLON.Tools.Warn("No wheel collider metadata found for: " + anybody._abstractMesh.name);
                }
            }
            return anybody.m_raycastVehicle;
        };
        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Advanced Helper Functions
        ///////////////////////////////////////////////////////
        /** Gets vehicle enable multi raycast flag using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.getEnableMultiRaycast = function () {
            var result = false;
            if (this.m_vehicle != null && this.m_vehicle.get_m_enableMultiRaycast) {
                result = this.m_vehicle.get_m_enableMultiRaycast();
            }
            return result;
        };
        /** Sets vehicle enable multi raycast flag using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.setEnableMultiRaycast = function (flag) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_enableMultiRaycast) {
                this.m_vehicle.set_m_enableMultiRaycast(flag);
            }
        };
        /** Gets vehicle stable force using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.getStabilizingForce = function () {
            var result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_stabilizingForce) {
                result = this.m_vehicle.get_m_stabilizingForce();
            }
            return result;
        };
        /** Sets vehicle stable force using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.setStabilizingForce = function (force) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_stabilizingForce) {
                this.m_vehicle.set_m_stabilizingForce(force);
            }
        };
        /** Gets vehicle max stable force using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.getMaxImpulseForce = function () {
            var result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_maxImpulseForce) {
                result = this.m_vehicle.get_m_maxImpulseForce();
            }
            return result;
        };
        /** Sets vehicle max stable force using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.setMaxImpulseForce = function (force) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_maxImpulseForce) {
                this.m_vehicle.set_m_maxImpulseForce(force);
            }
        };
        /** Gets vehicle smooth flying impulse force using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.getSmoothFlyingImpulse = function () {
            var result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_smoothFlyingImpulse) {
                result = this.m_vehicle.get_m_smoothFlyingImpulse();
            }
            return result;
        };
        /** Sets vehicle smooth flying impulse using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.setSmoothFlyingImpulse = function (impulse) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_smoothFlyingImpulse) {
                this.m_vehicle.set_m_smoothFlyingImpulse(impulse);
            }
        };
        /** Gets vehicle track connection accel force using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.getTrackConnectionAccel = function () {
            var result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_trackConnectionAccel) {
                result = this.m_vehicle.get_m_trackConnectionAccel();
            }
            return result;
        };
        /** Sets vehicle track connection accel force using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.setTrackConnectionAccel = function (force) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_trackConnectionAccel) {
                this.m_vehicle.set_m_trackConnectionAccel(force);
            }
        };
        /** Gets vehicle min wheel contact count using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.getMinimumWheelContacts = function () {
            var result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_minimumWheelContacts) {
                result = this.m_vehicle.get_m_minimumWheelContacts();
            }
            return result;
        };
        /** Sets vehicle min wheel contact count using physics vehicle object. (Advanved Use Only) */
        RaycastVehicle.prototype.setMinimumWheelContacts = function (force) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_minimumWheelContacts) {
                this.m_vehicle.set_m_minimumWheelContacts(force);
            }
        };
        /** Gets vehicle interpolate mesh normals flag using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.getInterpolateNormals = function () {
            var result = false;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_interpolateNormals) {
                result = this.m_vehicleRaycaster.get_m_interpolateNormals();
            }
            return result;
        };
        /** Sets the vehicle interpolate mesh normals using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.setInterpolateNormals = function (flag) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_interpolateNormals) {
                this.m_vehicleRaycaster.set_m_interpolateNormals(flag);
            }
        };
        /** Gets vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.getShapeTestingMode = function () {
            var result = false;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_shapeTestingMode) {
                result = this.m_vehicleRaycaster.get_m_shapeTestingMode();
            }
            return result;
        };
        /** Sets the vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.setShapeTestingMode = function (mode) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_shapeTestingMode) {
                this.m_vehicleRaycaster.set_m_shapeTestingMode(mode);
            }
        };
        /** Gets vehicle shape testing size using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.getShapeTestingSize = function () {
            var result = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_shapeTestingSize) {
                result = this.m_vehicleRaycaster.get_m_shapeTestingSize();
            }
            return result;
        };
        /** Sets the vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.setShapeTestingSize = function (size) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_shapeTestingSize) {
                this.m_vehicleRaycaster.set_m_shapeTestingSize(size);
            }
        };
        /** Gets vehicle shape test point count using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.getShapeTestingCount = function () {
            var result = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_testPointCount) {
                result = this.m_vehicleRaycaster.get_m_testPointCount();
            }
            return result;
        };
        /** Sets the vehicle shape test point count using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.setShapeTestingCount = function (count) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_testPointCount) {
                this.m_vehicleRaycaster.set_m_testPointCount(count);
            }
        };
        /** Gets vehicle sweep penetration amount using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.getSweepPenetration = function () {
            var result = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_sweepPenetration) {
                result = this.m_vehicleRaycaster.get_m_sweepPenetration();
            }
            return result;
        };
        /** Sets the vehicle sweep penetration amount using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.setSweepPenetration = function (amount) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_sweepPenetration) {
                this.m_vehicleRaycaster.set_m_sweepPenetration(amount);
            }
        };
        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Advanced Collision Functions
        ///////////////////////////////////////////////////////
        /** Gets vehicle collision group filter using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.getCollisionFilterGroup = function () {
            var result = -1;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_collisionFilterGroup) {
                result = this.m_vehicleRaycaster.get_m_collisionFilterGroup();
            }
            return result;
        };
        /** Sets vehicle collision group filter using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.setCollisionFilterGroup = function (group) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_collisionFilterGroup) {
                this.m_vehicleRaycaster.set_m_collisionFilterGroup(group);
            }
        };
        /** Gets vehicle collision mask filter using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.getCollisionFilterMask = function () {
            var result = -1;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_collisionFilterMask) {
                result = this.m_vehicleRaycaster.get_m_collisionFilterMask();
            }
            return result;
        };
        /** Sets the vehicle collision mask filter using physics raycaster object. (Advanved Use Only) */
        RaycastVehicle.prototype.setCollisionFilterMask = function (mask) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_collisionFilterMask) {
                this.m_vehicleRaycaster.set_m_collisionFilterMask(mask);
            }
        };
        ///////////////////////////////////////////////////////
        // Raycast Vehicle Wheel Information Helper Funtions
        ///////////////////////////////////////////////////////
        /** Gets the internal wheel index by id string. */
        RaycastVehicle.prototype.getWheelIndexByID = function (id) {
            var result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                for (var index = 0; index < this.m_vehicleColliders.length; index++) {
                    var wheel = this.m_vehicleColliders[index];
                    if (id.toLowerCase() === wheel.id.toLowerCase()) {
                        result = index;
                        break;
                    }
                }
            }
            return result;
        };
        /** Gets the internal wheel index by name string. */
        RaycastVehicle.prototype.getWheelIndexByName = function (name) {
            var result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                for (var index = 0; index < this.m_vehicleColliders.length; index++) {
                    var wheel = this.m_vehicleColliders[index];
                    if (name.toLowerCase() === wheel.name.toLowerCase()) {
                        result = index;
                        break;
                    }
                }
            }
            return result;
        };
        /** Gets the internal wheel collider information. */
        RaycastVehicle.prototype.getWheelColliderInfo = function (wheel) {
            var result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0 && this.m_vehicleColliders.length > wheel) {
                result = this.m_vehicleColliders[wheel];
            }
            return result;
        };
        /** Sets the internal wheel hub transform mesh by index. Used to rotate and bounce wheels. */
        RaycastVehicle.prototype.setWheelTransformMesh = function (wheel, transform) {
            if (transform == null)
                return;
            var wheelinfo = this.getWheelInfo(wheel);
            if (wheelinfo != null)
                wheelinfo.transform = transform;
        };
        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Seering Helper Functions
        ///////////////////////////////////////////////////////
        RaycastVehicle.prototype.getVisualSteeringAngle = function (wheel) {
            var result = 0;
            var wheelinfo = this.getWheelInfo(wheel);
            if (wheelinfo != null && wheelinfo.steeringAngle != null) {
                result = wheelinfo.steeringAngle;
            }
            return result;
        };
        RaycastVehicle.prototype.setVisualSteeringAngle = function (angle, wheel) {
            var wheelinfo = this.getWheelInfo(wheel);
            if (wheelinfo != null) {
                wheelinfo.steeringAngle = angle;
            }
        };
        RaycastVehicle.prototype.getPhysicsSteeringAngle = function (wheel) {
            if (this.m_vehicle != null) {
                return Math.abs(this.m_vehicle.getSteeringValue(wheel));
            }
        };
        RaycastVehicle.prototype.setPhysicsSteeringAngle = function (angle, wheel) {
            if (this.m_vehicle != null) {
                this.m_vehicle.setSteeringValue(angle, wheel);
            }
        };
        /////////////////////////////////////////////
        // Setup Wheel Information Helper Funtions //
        /////////////////////////////////////////////
        RaycastVehicle.prototype.setupWheelInformation = function (defaultAngularFactor) {
            if (defaultAngularFactor === void 0) { defaultAngularFactor = null; }
            if (this._chassisMesh != null && this._chassisMesh.physicsImpostor != null && this._chassisMesh.physicsImpostor.physicsBody != null) {
                if (defaultAngularFactor != null) {
                    // https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=8153
                    // prevent vehicle from flip over, by limit the rotation  on forward axis or limit angles for vehicle stablization
                    if (BABYLON.RaycastVehicle.TempAmmoVector == null)
                        BABYLON.RaycastVehicle.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RaycastVehicle.TempAmmoVector.setValue(defaultAngularFactor.x, defaultAngularFactor.y, defaultAngularFactor.z);
                    this._chassisMesh.physicsImpostor.physicsBody.setAngularFactor(BABYLON.RaycastVehicle.TempAmmoVector);
                }
                this._chassisMesh.physicsImpostor.physicsBody.setActivationState(BABYLON.CollisionState.DISABLE_DEACTIVATION);
            }
            if (this.m_vehicle != null && this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                var index = -1;
                for (index = 0; index < this.m_vehicleColliders.length; index++) {
                    var wheel = this.m_vehicleColliders[index];
                    var wheelName = (wheel.name != null) ? wheel.name : "Unknown";
                    var wheelRadius = (wheel.radius != null) ? wheel.radius : 0.35;
                    var wheelHalfTrack = (wheel.position != null && wheel.position.length >= 3) ? wheel.position[0] : 1;
                    var wheelAxisPosition = (wheel.position != null && wheel.position.length >= 3) ? wheel.position[2] : -1;
                    // ..
                    // Raycast Wheel Script Properties
                    // ..
                    var wheelConnectionPoint = (wheel.wheelconnectionpoint != null) ? wheel.wheelconnectionpoint : 0.5;
                    var suspensionRestLength = (wheel.suspensionrestlength != null) ? wheel.suspensionrestlength : 0.3;
                    var isfrontwheel = (wheel.frontwheel != null) ? true : (wheelName.toLowerCase().indexOf("front") >= 0);
                    var wheelposition = wheelAxisPosition;
                    var wheeltracking = wheelHalfTrack;
                    var centermassx = -this._centerMass.x;
                    var centermassz = -this._centerMass.z;
                    if (BABYLON.RaycastVehicle.TempAmmoVector == null)
                        BABYLON.RaycastVehicle.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RaycastVehicle.TempAmmoVector.setValue((wheeltracking + centermassx), wheelConnectionPoint, (wheelposition + centermassz));
                    this.m_vehicle.addWheel(BABYLON.RaycastVehicle.TempAmmoVector, this.m_wheelDirectionCS0, this.m_wheelAxleCS, suspensionRestLength, wheelRadius, this.m_vehicleTuning, isfrontwheel);
                }
                if (this.m_vehicle.getNumWheels() === this.m_vehicleColliders.length) {
                    for (index = 0; index < this.m_vehicleColliders.length; index++) {
                        var wheel = this.m_vehicleColliders[index];
                        var defaultForce = (wheel.totalsuspensionforces != null) ? wheel.totalsuspensionforces : 25000; // Bullet: 6000
                        var defaultTravel = (wheel.suspensiontravelcm != null) ? wheel.suspensiontravelcm : 100; // Bullet: 500
                        var defaultRolling = (wheel.rollinfluence != null) ? wheel.rollinfluence : 0.2; // Bullet: 0.1
                        var defaultFriction = (wheel.frictionslip != null) ? wheel.frictionslip : 10; // Bullet: 10.5
                        var suspensionStiffness = (wheel.suspensionstiffness != null) ? wheel.suspensionstiffness : 50; // Bullet: 5.88
                        var suspensionCompression = (wheel.dampingcompression != null) ? wheel.dampingcompression : 2.5; // Bullet: 0.83
                        var suspensionDamping = (wheel.dampingrelaxation != null) ? wheel.dampingrelaxation : 4.5; // Bullet: 0.88
                        var wheelinfo = this.m_vehicle.getWheelInfo(index);
                        if (wheelinfo != null) {
                            wheelinfo.steeringAngle = 0;
                            wheelinfo.rotationBoost = 0;
                            wheelinfo.defaultFriction = defaultFriction;
                            wheelinfo.set_m_frictionSlip(defaultFriction);
                            wheelinfo.set_m_rollInfluence(defaultRolling);
                            wheelinfo.set_m_maxSuspensionForce(defaultForce);
                            wheelinfo.set_m_maxSuspensionTravelCm(defaultTravel);
                            wheelinfo.set_m_suspensionStiffness(suspensionStiffness);
                            wheelinfo.set_m_wheelsDampingCompression(suspensionCompression);
                            wheelinfo.set_m_wheelsDampingRelaxation(suspensionDamping);
                        }
                    }
                }
                else {
                    BABYLON.Tools.Warn("Failed to create proper number of wheels for: " + this._chassisMesh.name);
                }
            }
        };
        RaycastVehicle.prototype.updateWheelInformation = function () {
            var wheels = this.getNumWheels();
            if (wheels > 0) {
                for (var index = 0; index < wheels; index++) {
                    var wheelinfo = this.getWheelInfo(index);
                    if (wheelinfo != null) {
                        var locked = this.lockedWheelInformation(index);
                        this.updateWheelTransform(index, false);
                        // Update Wheel Information Internals
                        this.m_tempTransform = this.getWheelTransform(index);
                        this.m_tempPosition = this.m_tempTransform.getOrigin();
                        // Sync Wheel Hub Transform To Raycast Wheel
                        if (wheelinfo.transform != null) {
                            var transform = wheelinfo.transform;
                            if (transform.parent != null) {
                                // Update Wheel Hub Position
                                BABYLON.Utilities.ConvertAmmoVector3ToRef(this.m_tempPosition, this._tempVectorPos);
                                BABYLON.Utilities.InverseTransformPointToRef(transform.parent, this._tempVectorPos, this._tempVectorPos);
                                transform.position.y = this._tempVectorPos.y;
                                // Update Wheel Hub Steering
                                var steeringAngle = (wheelinfo.steeringAngle != null) ? wheelinfo.steeringAngle : 0;
                                BABYLON.Quaternion.FromEulerAnglesToRef(0, steeringAngle, 0, transform.rotationQuaternion);
                                // Update Wheel Spinner Rotation
                                if (wheelinfo.spinner != null && wheelinfo.spinner.addRotation) {
                                    if (locked === false) {
                                        var wheelrotation = 0;
                                        var deltaRotation = (wheelinfo.get_m_deltaRotation != null) ? wheelinfo.get_m_deltaRotation() : 0;
                                        var rotationBoost = (wheelinfo.rotationBoost != null) ? wheelinfo.rotationBoost : 0;
                                        if (deltaRotation < 0)
                                            wheelrotation = (deltaRotation + -rotationBoost);
                                        else
                                            wheelrotation = (deltaRotation + rotationBoost);
                                        wheelinfo.spinner.addRotation(wheelrotation, 0, 0);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        RaycastVehicle.prototype.lockedWheelInformation = function (wheel) {
            var result = false;
            if (this.lockedWheelIndexes != null && this.lockedWheelIndexes.length > 0) {
                for (var index = 0; index < this.lockedWheelIndexes.length; index++) {
                    if (this.lockedWheelIndexes[index] === wheel) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        };
        RaycastVehicle.prototype.deleteWheelInformation = function () {
            var wheels = this.getNumWheels();
            if (wheels > 0) {
                for (var index = 0; index < wheels; index++) {
                    var info = this.getWheelInfo(index);
                    if (info != null) {
                        if (info.transform != null) {
                            delete info.transform;
                        }
                        if (info.spinner != null) {
                            delete info.spinner;
                        }
                        if (info.steeringAngle != null) {
                            delete info.steeringAngle;
                        }
                        if (info.rotationBoost != null) {
                            delete info.rotationBoost;
                        }
                        if (info.defaultFriction != null) {
                            delete info.defaultFriction;
                        }
                    }
                }
            }
        };
        RaycastVehicle.TempAmmoVector = null;
        return RaycastVehicle;
    }());
    BABYLON.RaycastVehicle = RaycastVehicle;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon realtime reflection system pro class (Unity Style Realtime Reflection Probes)
     * @class RealtimeReflection - All rights reserved (c) 2020 Mackey Kinard
     */
    var RealtimeReflection = /** @class */ (function (_super) {
        __extends(RealtimeReflection, _super);
        function RealtimeReflection() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.renderList = null;
            _this.probeList = null;
            _this.refreshMode = 0;
            _this.cullingMask = 0;
            _this.clearFlags = 0;
            _this.probeid = 0;
            _this.useProbeList = false;
            _this.includeChildren = false;
            _this.resolution = 128;
            _this.boxPos = null;
            _this.boxSize = null;
            _this.boxProjection = false;
            return _this;
        }
        RealtimeReflection.prototype.getProbeList = function () { return this.probeList; };
        RealtimeReflection.prototype.getRenderList = function () { return this.renderList; };
        RealtimeReflection.prototype.awake = function () { this.awakeRealtimReflections(); };
        RealtimeReflection.prototype.start = function () { this.startRealtimReflections(); };
        RealtimeReflection.prototype.destroy = function () { this.destroyRealtimReflections(); };
        RealtimeReflection.prototype.awakeRealtimReflections = function () {
            this.probeid = this.getProperty("id", this.probeid);
            this.resolution = this.getProperty("resolution", this.resolution);
            this.cullingMask = this.getProperty("culling", this.cullingMask);
            this.clearFlags = this.getProperty("clearflags", this.clearFlags);
            this.refreshMode = this.getProperty("refreshmode", this.refreshMode);
            this.useProbeList = this.getProperty("useprobelist", this.useProbeList);
            this.includeChildren = this.getProperty("includechildren", this.includeChildren);
            this.boxProjection = this.getProperty("boxprojection", this.boxProjection);
            if (this.boxProjection === true) {
                var bbp = this.getProperty("boundingboxposition");
                if (bbp != null && bbp.length >= 3) {
                    this.boxPos = new BABYLON.Vector3(bbp[0], bbp[1], bbp[2]);
                }
                var bbz = this.getProperty("boundingboxsize");
                if (bbz != null && bbz.length >= 3) {
                    this.boxSize = new BABYLON.Vector3(bbz[0], bbz[1], bbz[2]);
                }
            }
        };
        RealtimeReflection.prototype.startRealtimReflections = function () {
            var _a;
            var index = 0;
            var quality = BABYLON.SceneManager.GetRenderQuality();
            var allowReflections = (quality === BABYLON.RenderQuality.High);
            if (allowReflections === true) {
                if (this.cullingMask === 0) { // Nothing
                    if (this.clearFlags === BABYLON.RealtimeReflection.SKYBOX_FLAG) {
                        var skybox = BABYLON.SceneManager.GetAmbientSkybox(this.scene);
                        if (skybox != null) {
                            if (this.renderList == null)
                                this.renderList = [];
                            this.renderList.push(skybox);
                        }
                    }
                }
                else if (this.cullingMask === -1) { // Everything
                    for (index = 0; index < this.scene.meshes.length; index++) {
                        var render = false;
                        var mesh = this.scene.meshes[index];
                        if (mesh != null) {
                            if (mesh.id === "Ambient Skybox") {
                                render = (this.clearFlags === BABYLON.RealtimeReflection.SKYBOX_FLAG);
                            }
                            else {
                                render = true;
                            }
                            if (render === true) {
                                if (this.renderList == null)
                                    this.renderList = [];
                                this.renderList.push(mesh);
                            }
                        }
                    }
                }
                else { // Parse Render List Meta Data
                    var renderListData = this.getProperty("renderlist");
                    if (renderListData != null && renderListData.length > 0) {
                        var _loop_2 = function () {
                            var renderId = renderListData[index];
                            var renderMesh = BABYLON.SceneManager.GetMeshByID(this_2.scene, renderId);
                            if (renderMesh != null) {
                                if (this_2.renderList == null)
                                    this_2.renderList = [];
                                var detailName_1 = renderMesh.name + ".Detail";
                                var detailChildren = renderMesh.getChildren(function (node) { return (node.name === detailName_1); }, true);
                                if (detailChildren != null && detailChildren.length > 0) {
                                    this_2.renderList.push(detailChildren[0]);
                                }
                                else {
                                    this_2.renderList.push(renderMesh);
                                }
                            }
                        };
                        var this_2 = this;
                        for (index = 0; index < renderListData.length; index++) {
                            _loop_2();
                        }
                    }
                    if (this.clearFlags === BABYLON.RealtimeReflection.SKYBOX_FLAG) {
                        var skybox = BABYLON.SceneManager.GetAmbientSkybox(this.scene);
                        if (skybox != null) {
                            if (this.renderList == null)
                                this.renderList = [];
                            this.renderList.push(skybox);
                        }
                    }
                }
                // ..
                // Get Probe Render List
                // ..
                if (this.useProbeList === true) {
                    var probeListData = this.getProperty("probelist");
                    if (probeListData != null && probeListData.length > 0) {
                        for (index = 0; index < probeListData.length; index++) {
                            var probeId = probeListData[index];
                            var probeMesh = BABYLON.SceneManager.GetMeshByID(this.scene, probeId);
                            if (probeMesh != null) {
                                if (this.probeList == null)
                                    this.probeList = [];
                                this.probeList.push(probeMesh);
                                if (this.includeChildren === true) {
                                    var childMeshes = probeMesh.getChildMeshes(false);
                                    for (var ii = 0; ii < childMeshes.length; ii++) {
                                        var childMesh = childMeshes[ii];
                                        this.probeList.push(childMesh);
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    var probeTag = "PROBE_" + this.probeid.toFixed(0);
                    this.probeList = this.scene.getMeshesByTags(probeTag);
                }
                if (this.probeList != null && this.probeList.length > 0) {
                    var abstractMesh = this.getAbstractMesh();
                    for (index = 0; index < this.probeList.length; index++) {
                        var probemesh = this.probeList[index];
                        var reflectionProbe = new BABYLON.ReflectionProbe(probemesh.name + ".Probe", this.resolution, this.scene);
                        reflectionProbe.refreshRate = (this.refreshMode === 0) ? BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE : BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYFRAME;
                        (_a = reflectionProbe.renderList).push.apply(_a, this.renderList);
                        if (abstractMesh != null)
                            reflectionProbe.attachToMesh(abstractMesh);
                        if (this.boxProjection === true) {
                            if (this.boxSize != null) {
                                reflectionProbe.cubeTexture.boundingBoxSize = this.boxSize;
                            }
                            if (this.boxPos != null) {
                                reflectionProbe.cubeTexture.boundingBoxPosition = this.boxPos;
                            }
                        }
                        if (probemesh.material instanceof BABYLON.MultiMaterial) {
                            var mmat1 = probemesh.material.clone(probemesh.material.name + "." + probemesh.name);
                            for (var xx = 0; xx < mmat1.subMaterials.length; xx++) {
                                var smat1 = mmat1.subMaterials[xx];
                                var subMaterial = mmat1.subMaterials[xx].clone(mmat1.subMaterials[xx].name + "_" + probemesh.name);
                                subMaterial.unfreeze();
                                subMaterial.reflectionTexture = reflectionProbe.cubeTexture;
                                mmat1.subMaterials[xx] = subMaterial;
                            }
                            probemesh.material = mmat1;
                        }
                        else {
                            var meshMaterial = probemesh.material.clone(probemesh.material.name + "." + probemesh.name);
                            meshMaterial.unfreeze();
                            meshMaterial.reflectionTexture = reflectionProbe.cubeTexture;
                            probemesh.material = meshMaterial;
                        }
                    }
                }
            }
        };
        RealtimeReflection.prototype.destroyRealtimReflections = function () {
            this.probeList = null;
            this.renderList = null;
        };
        RealtimeReflection.SKYBOX_FLAG = 1;
        return RealtimeReflection;
    }(BABYLON.ScriptComponent));
    BABYLON.RealtimeReflection = RealtimeReflection;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon full rigidbody physics pro class (Native Bullet Physics 2.82)
     * @class RigidbodyPhysics - All rights reserved (c) 2020 Mackey Kinard
     */
    var RigidbodyPhysics = /** @class */ (function (_super) {
        __extends(RigidbodyPhysics, _super);
        function RigidbodyPhysics() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._abstractMesh = null;
            _this._isKinematic = false;
            _this._maxCollisions = 4;
            _this._isPhysicsReady = false;
            _this._collisionObject = null;
            _this._centerOfMass = new BABYLON.Vector3(0, 0, 0);
            _this._tmpLinearFactor = new BABYLON.Vector3(0, 0, 0);
            _this._tmpAngularFactor = new BABYLON.Vector3(0, 0, 0);
            _this._tmpCenterOfMass = new BABYLON.Vector3(0, 0, 0);
            _this._tmpCollisionContacts = null;
            /** Register handler that is triggered when the a collision contact has entered */
            _this.onCollisionEnterObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact is active */
            _this.onCollisionStayObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact has exited */
            _this.onCollisionExitObservable = new BABYLON.Observable();
            _this.m_physicsWorld = null;
            _this.m_physicsEngine = null;
            _this.m_raycastVehicle = null;
            return _this;
        }
        Object.defineProperty(RigidbodyPhysics.prototype, "isKinematic", {
            get: function () { return this._isKinematic; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RigidbodyPhysics.prototype, "centerOfMass", {
            get: function () { return this._centerOfMass; },
            enumerable: false,
            configurable: true
        });
        RigidbodyPhysics.prototype.awake = function () { this.awakeRigidbodyState(); };
        RigidbodyPhysics.prototype.update = function () { this.updateRigidbodyState(); };
        RigidbodyPhysics.prototype.after = function () { this.afterRigidbodyState(); };
        RigidbodyPhysics.prototype.destroy = function () { this.destroyRigidbodyState(); };
        /////////////////////////////////////////////////
        // Protected Rigidbody Physics State Functions //
        /////////////////////////////////////////////////
        RigidbodyPhysics.prototype.awakeRigidbodyState = function () {
            this._abstractMesh = this.getAbstractMesh();
            this._isKinematic = this.getProperty("isKinematic", this._isKinematic);
            this.m_physicsWorld = BABYLON.SceneManager.GetPhysicsWorld(this.scene);
            this.m_physicsEngine = BABYLON.SceneManager.GetPhysicsEngine(this.scene);
            if (this.transform.metadata != null && this.transform.metadata.unity != null && this.transform.metadata.unity.physics != null) {
                this._centerOfMass = (this.transform.metadata.unity.physics.center != null) ? BABYLON.Utilities.ParseVector3(this.transform.metadata.unity.physics.center, this._centerOfMass) : this._centerOfMass;
            }
            //console.warn("Starting Rigidbody Physics For: " + this.transform.name);
            this.setMaxNotifications(this._maxCollisions);
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
            this._isPhysicsReady = (this.m_physicsEngine != null && this._tmpCollisionContacts != null && this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null);
            var collisionGroup = (this._isKinematic === true) ? BABYLON.CollisionFilters.StaticFilter : BABYLON.CollisionFilters.DefaultFilter;
            var collisionMask = (this._isKinematic === true) ? BABYLON.CollisionFilters.AllFilter ^ BABYLON.CollisionFilters.StaticFilter : BABYLON.CollisionFilters.AllFilter;
            this.setCollisionFilterGroup(collisionGroup);
            this.setCollisionFilterMask(collisionMask);
            this.resetBodyCollisionContacts();
        };
        RigidbodyPhysics.prototype.updateRigidbodyState = function () {
            this.syncronizeVehicleController();
        };
        RigidbodyPhysics.prototype.afterRigidbodyState = function () {
            this.parseBodyCollisionContacts();
            this.resetBodyCollisionContacts();
        };
        RigidbodyPhysics.prototype.destroyRigidbodyState = function () {
            this.m_physicsWorld = null;
            this.m_physicsEngine = null;
            if (this.m_raycastVehicle != null) {
                if (this.m_raycastVehicle.dispose) {
                    this.m_raycastVehicle.dispose();
                }
                this.m_raycastVehicle = null;
            }
            this.onCollisionEnterObservable.clear();
            this.onCollisionEnterObservable = null;
            this.onCollisionStayObservable.clear();
            this.onCollisionStayObservable = null;
            this.onCollisionExitObservable.clear();
            this.onCollisionExitObservable = null;
            this._tmpCollisionContacts = null;
            this._collisionObject = null;
            this._abstractMesh = null;
        };
        //////////////////////////////////////////////////
        // Rigidbody Physics Life Cycle Event Functions //
        //////////////////////////////////////////////////
        RigidbodyPhysics.prototype.syncronizeVehicleController = function () {
            if (this.m_raycastVehicle != null) {
                if (this.m_raycastVehicle.updateWheelInformation) {
                    this.m_raycastVehicle.updateWheelInformation();
                }
            }
        };
        RigidbodyPhysics.prototype.parseBodyCollisionContacts = function () {
            if (this._isPhysicsReady === true) {
                var hasEnterObservers = this.onCollisionEnterObservable.hasObservers();
                var hasStayObservers = this.onCollisionStayObservable.hasObservers();
                var hasExitObservers = this.onCollisionExitObservable.hasObservers();
                if (hasEnterObservers || hasStayObservers || hasExitObservers) {
                    var index = 0; // Note: Flag All Collision List Items For End Contact State
                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                        this._tmpCollisionContacts[index].reset = true;
                    }
                    // ..
                    // Parse Overlapping Body Contact Objects
                    // ..
                    var collisionCount = 0;
                    if (this._abstractMesh.physicsImpostor.tmpCollisionObjects != null) {
                        var tmpCollisionObjectMap = this._abstractMesh.physicsImpostor.tmpCollisionObjects;
                        for (var contactKey in tmpCollisionObjectMap) {
                            var foundindex = -1;
                            var contactMesh = tmpCollisionObjectMap[contactKey];
                            for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                var check = this._tmpCollisionContacts[index];
                                if (check.mesh != null && check.mesh === contactMesh) {
                                    check.state = 1;
                                    check.reset = false;
                                    foundindex = index;
                                    break;
                                }
                            }
                            if (foundindex === -1) {
                                for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                    var insert = this._tmpCollisionContacts[index];
                                    if (insert.mesh == null) {
                                        insert.mesh = contactMesh;
                                        insert.state = 0;
                                        insert.reset = false;
                                        break;
                                    }
                                }
                            }
                            collisionCount++;
                            if (collisionCount > this._maxCollisions)
                                break;
                        }
                    }
                    // ..
                    // Dispatch Body Collision Contact State
                    // ..
                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                        var info = this._tmpCollisionContacts[index];
                        if (info.reset === true) {
                            // Dispatch On Collision Exit Event
                            if (hasExitObservers && info.mesh != null) {
                                this.onCollisionExitObservable.notifyObservers(info.mesh);
                            }
                            // Reset Collision Contact Info Item
                            info.mesh = null;
                            info.state = 0;
                            info.reset = false;
                        }
                        else {
                            if (info.state === 0) {
                                // Dispatch On Collision Enter Event
                                if (hasEnterObservers && info.mesh != null) {
                                    this.onCollisionEnterObservable.notifyObservers(info.mesh);
                                }
                            }
                            else {
                                // Dispatch On Collision Stay Event
                                if (hasStayObservers && info.mesh != null) {
                                    this.onCollisionStayObservable.notifyObservers(info.mesh);
                                }
                            }
                        }
                    }
                }
            }
        };
        RigidbodyPhysics.prototype.resetBodyCollisionContacts = function () {
            if (this._isPhysicsReady === true) {
                var hasEnterObservers = this.onCollisionEnterObservable.hasObservers();
                var hasStayObservers = this.onCollisionStayObservable.hasObservers();
                var hasExitObservers = this.onCollisionExitObservable.hasObservers();
                if (hasEnterObservers || hasStayObservers || hasExitObservers) {
                    this._abstractMesh.physicsImpostor.tmpCollisionObjects = {};
                }
                else {
                    this._abstractMesh.physicsImpostor.tmpCollisionObjects = null;
                }
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Gravity Advanced Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Sets entity gravity value using physics impostor body. */
        RigidbodyPhysics.prototype.setGravity = function (gravity) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setGravity) {
                if (gravity != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(gravity.x, gravity.y, gravity.z);
                    this._abstractMesh.physicsImpostor.physicsBody.setGravity(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        };
        /** Gets entity gravity value using physics impostor body. */
        RigidbodyPhysics.prototype.getGravity = function () {
            var result = new BABYLON.Vector3(0, 0, 0);
            this.getGravityToRef(result);
            return result;
        };
        /** Gets entity gravity value using physics impostor body. */
        RigidbodyPhysics.prototype.getGravityToRef = function (result) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getGravity) {
                var gravity = this._abstractMesh.physicsImpostor.physicsBody.getGravity();
                BABYLON.Utilities.ConvertAmmoVector3ToRef(gravity, result);
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Impostor Helper Functions -  TODO - Use Native Physics API - ???
        ////////////////////////////////////////////////////////////////////////////////////
        /** Gets mass of entity using physics impostor. */
        RigidbodyPhysics.prototype.getMass = function () {
            var result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.mass;
            }
            return result;
        };
        /** Sets mass to entity using physics impostor. */
        RigidbodyPhysics.prototype.setMass = function (mass) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.mass !== mass) {
                    this._abstractMesh.physicsImpostor.mass = mass;
                }
            }
        };
        /** Gets entity friction level using physics impostor. */
        RigidbodyPhysics.prototype.getFriction = function () {
            var result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.friction;
            }
            return result;
        };
        /** Applies friction to entity using physics impostor. */
        RigidbodyPhysics.prototype.setFriction = function (friction) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.friction !== friction) {
                    this._abstractMesh.physicsImpostor.friction = friction;
                }
            }
        };
        /** Gets restitution of entity using physics impostor. */
        RigidbodyPhysics.prototype.getRestitution = function () {
            var result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.restitution;
            }
            return result;
        };
        /** Sets restitution to entity using physics impostor. */
        RigidbodyPhysics.prototype.setRestitution = function (restitution) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.restitution !== restitution) {
                    this._abstractMesh.physicsImpostor.restitution = restitution;
                }
            }
        };
        /** Gets entity linear velocity using physics impostor. */
        RigidbodyPhysics.prototype.getLinearVelocity = function () {
            var result = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.getLinearVelocity();
            }
            return result;
        };
        /** Sets entity linear velocity using physics impostor. */
        RigidbodyPhysics.prototype.setLinearVelocity = function (velocity) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (velocity != null)
                    this._abstractMesh.physicsImpostor.setLinearVelocity(velocity);
            }
        };
        /** Gets entity angular velocity using physics impostor. */
        RigidbodyPhysics.prototype.getAngularVelocity = function () {
            var result = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.getAngularVelocity();
            }
            return result;
        };
        /** Sets entity angular velocity using physics impostor. */
        RigidbodyPhysics.prototype.setAngularVelocity = function (velocity) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (velocity != null)
                    this._abstractMesh.physicsImpostor.setAngularVelocity(velocity);
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Transform Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Gets the native physics world transform object using physics impostor body. (Ammo.btTransform) */
        RigidbodyPhysics.prototype.getWorldTransform = function () {
            var result = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.getWorldTransform) {
                    result = this._collisionObject.getWorldTransform();
                }
            }
            return result;
        };
        /** sets the native physics world transform object using physics impostor body. (Ammo.btTransform) */
        RigidbodyPhysics.prototype.setWorldTransform = function (btTransform) {
            var result = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setWorldTransform) {
                    this._collisionObject.setWorldTransform(btTransform);
                }
                if (this._abstractMesh.physicsImpostor.mass === 0 && this._abstractMesh.physicsImpostor.physicsBody.getMotionState) {
                    var motionState = this._abstractMesh.physicsImpostor.physicsBody.getMotionState();
                    if (motionState != null && motionState.setWorldTransform) {
                        motionState.setWorldTransform(btTransform);
                    }
                }
            }
            return result;
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Applied Physics Movement Functions
        ////////////////////////////////////////////////////////////////////////////////////
        RigidbodyPhysics.prototype.clearForces = function () {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.clearForces) {
                this._abstractMesh.physicsImpostor.physicsBody.clearForces();
            }
        };
        ////////////////////////////////////////////////// 
        // TODO - Use Function Specific Temp Ammo Buffer //
        ////////////////////////////////////////////////// 
        RigidbodyPhysics.prototype.applyTorque = function (torque) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyTorque) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyTorque(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        };
        RigidbodyPhysics.prototype.applyLocalTorque = function (torque) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyLocalTorque) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyLocalTorque(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        };
        RigidbodyPhysics.prototype.applyImpulse = function (impulse, rel_pos) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyImpulse) {
                if (impulse != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    if (BABYLON.RigidbodyPhysics.TempAmmoVectorAux == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVectorAux = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(impulse.x, impulse.y, impulse.z);
                    BABYLON.RigidbodyPhysics.TempAmmoVectorAux.setValue(rel_pos.x, rel_pos.y, rel_pos.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyImpulse(BABYLON.RigidbodyPhysics.TempAmmoVector, BABYLON.RigidbodyPhysics.TempAmmoVectorAux);
                }
            }
        };
        RigidbodyPhysics.prototype.applyCentralImpulse = function (impulse) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralImpulse) {
                if (impulse != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(impulse.x, impulse.y, impulse.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralImpulse(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        };
        RigidbodyPhysics.prototype.applyTorqueImpulse = function (torque) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyTorqueImpulse) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyTorqueImpulse(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        };
        RigidbodyPhysics.prototype.applyForce = function (force, rel_pos) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyForce) {
                if (force != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    if (BABYLON.RigidbodyPhysics.TempAmmoVectorAux == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVectorAux = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(force.x, force.y, force.z);
                    BABYLON.RigidbodyPhysics.TempAmmoVectorAux.setValue(rel_pos.x, rel_pos.y, rel_pos.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyForce(BABYLON.RigidbodyPhysics.TempAmmoVector, BABYLON.RigidbodyPhysics.TempAmmoVectorAux);
                }
            }
        };
        RigidbodyPhysics.prototype.applyCentralForce = function (force) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralForce) {
                if (force != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(force.x, force.y, force.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralForce(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        };
        RigidbodyPhysics.prototype.applyCentralLocalForce = function (force) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralLocalForce) {
                if (force != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(force.x, force.y, force.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralLocalForce(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        };
        /** gets rigidbody center of mass */
        RigidbodyPhysics.prototype.getCenterOfMassTransform = function () {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getCenterOfMassTransform) {
                var bttransform = this._abstractMesh.physicsImpostor.physicsBody.getCenterOfMassTransform();
                var btposition = bttransform.getOrigin();
                this._tmpCenterOfMass.set(btposition.x(), btposition.y(), btposition.z());
            }
            return this._tmpCenterOfMass;
        };
        /** Sets rigidbody center of mass */
        RigidbodyPhysics.prototype.setCenterOfMassTransform = function (center) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setCenterOfMassTransform) {
                if (center != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(center.x, center.y, center.z);
                    if (BABYLON.RigidbodyPhysics.TempCenterTransform == null)
                        BABYLON.RigidbodyPhysics.TempCenterTransform = new Ammo.btTransform();
                    BABYLON.RigidbodyPhysics.TempCenterTransform.setIdentity();
                    BABYLON.RigidbodyPhysics.TempCenterTransform.setOrigin(BABYLON.RigidbodyPhysics.TempAmmoVector);
                    this._abstractMesh.physicsImpostor.physicsBody.setCenterOfMassTransform(BABYLON.RigidbodyPhysics.TempCenterTransform);
                }
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Native Body Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Gets entity linear factor using physics impostor body. */
        RigidbodyPhysics.prototype.getLinearFactor = function () {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getLinearFactor) {
                var linearFactor = this._abstractMesh.physicsImpostor.physicsBody.getLinearFactor();
                this._tmpLinearFactor.set(linearFactor.x(), linearFactor.y(), linearFactor.z());
            }
            return this._tmpLinearFactor;
        };
        /** Sets entity linear factor using physics impostor body. */
        RigidbodyPhysics.prototype.setLinearFactor = function (factor) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setLinearFactor) {
                if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                    BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(factor.x, factor.y, factor.z);
                this._abstractMesh.physicsImpostor.physicsBody.setLinearFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
            }
        };
        /** Gets entity angular factor using physics impostor body. */
        RigidbodyPhysics.prototype.getAngularFactor = function () {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getAngularFactor) {
                var angularFactor = this._abstractMesh.physicsImpostor.physicsBody.getAngularFactor();
                this._tmpAngularFactor.set(angularFactor.x(), angularFactor.y(), angularFactor.z());
            }
            return this._tmpAngularFactor;
        };
        /** Sets entity angular factor using physics impostor body. */
        RigidbodyPhysics.prototype.setAngularFactor = function (factor) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setAngularFactor) {
                if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                    BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(factor.x, factor.y, factor.z);
                this._abstractMesh.physicsImpostor.physicsBody.setAngularFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
            }
        };
        /** Gets entity angular damping using physics impostor body. */
        RigidbodyPhysics.prototype.getAngularDamping = function () {
            var result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getAngularDamping) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getAngularDamping();
            }
            return result;
        };
        /** Gets entity linear damping using physics impostor body. */
        RigidbodyPhysics.prototype.getLinearDamping = function () {
            var result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getLinearDamping) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getLinearDamping();
            }
            return result;
        };
        /** Sets entity drag damping using physics impostor body. */
        RigidbodyPhysics.prototype.setDamping = function (linear, angular) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setDamping) {
                this._abstractMesh.physicsImpostor.physicsBody.setDamping(linear, angular);
            }
        };
        /** Sets entity sleeping threshold using physics impostor body. */
        RigidbodyPhysics.prototype.setSleepingThresholds = function (linear, angular) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setSleepingThresholds) {
                this._abstractMesh.physicsImpostor.physicsBody.setSleepingThresholds(linear, angular);
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Native Advanced Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Checks if rigidbody has wheel collider metadata for the entity. Note: Wheel collider metadata informaion is required for vehicle control. */
        RigidbodyPhysics.prototype.hasWheelColliders = function () {
            return (this._isPhysicsReady === true && this._abstractMesh.metadata != null && this._abstractMesh.metadata.unity != null && this._abstractMesh.metadata.unity.wheels != null);
        };
        /** Sets the maximum number of simultaneous contact notfications to dispatch per frame. Defaults value is 4. (Advanved Use Only) */
        RigidbodyPhysics.prototype.setMaxNotifications = function (max) {
            this._maxCollisions = max;
            this._tmpCollisionContacts = [];
            for (var index = 0; index < this._maxCollisions; index++) {
                this._tmpCollisionContacts.push(new CollisionContactInfo());
            }
        };
        /** Sets entity collision activation state using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.setActivationState = function (state) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setActivationState) {
                    this._collisionObject.setActivationState(state);
                }
            }
        };
        /** Gets entity collision filter group using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.getCollisionFilterGroup = function () {
            var result = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().get_m_collisionFilterGroup();
            }
            return result;
        };
        /** Sets entity collision filter group using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.setCollisionFilterGroup = function (group) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().set_m_collisionFilterGroup(group);
            }
        };
        /** Gets entity collision filter mask using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.getCollisionFilterMask = function () {
            var result = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().get_m_collisionFilterMask();
            }
            return result;
        };
        /** Sets entity collision filter mask using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.setCollisionFilterMask = function (mask) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().set_m_collisionFilterMask(mask);
            }
        };
        /** Gets the entity collision shape type using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.getCollisionShapeType = function () {
            var result = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    var collisionShape = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.getShapeType) {
                        result = collisionShape.getShapeType();
                    }
                }
            }
            return result;
        };
        /** Gets the entity collision shape margin using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.getCollisionShapeMargin = function () {
            var result = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    var collisionShape = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.getMargin) {
                        result = collisionShape.getMargin();
                    }
                }
            }
            return result;
        };
        /** Sets entity collision shape margin using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.setCollisionShapeMargin = function (margin) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    var collisionShape = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.setMargin) {
                        collisionShape.setMargin(margin);
                    }
                }
            }
        };
        /** Gets the entity contact processing threshold using physics impostor body. (Advanved Use Only) */
        /* DEPRECIATED: TODO - Must Expose This Function In Ammo.idl
        public getContactProcessingThreshold():number {
            let result:number = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.getContactProcessingThreshold) {
                    result = this._collisionObject.getContactProcessingThreshold();
                }
            }
            return result;
        }*/
        /** Sets entity contact processing threshold using physics impostor body. (Advanved Use Only) */
        RigidbodyPhysics.prototype.setContactProcessingThreshold = function (threshold) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setContactProcessingThreshold) {
                    this._collisionObject.setContactProcessingThreshold(threshold);
                }
            }
        };
        // ************************************ //
        // * Physics Physics Helper Functions * //
        // ************************************ //
        /** TODO */
        RigidbodyPhysics.CreatePhysicsMetadata = function (mass, drag, angularDrag, centerMass) {
            if (drag === void 0) { drag = 0.0; }
            if (angularDrag === void 0) { angularDrag = 0.05; }
            if (centerMass === void 0) { centerMass = null; }
            var center = (centerMass != null) ? centerMass : new BABYLON.Vector3(0, 0, 0);
            return {
                "type": "rigidbody",
                "mass": mass,
                "ldrag": drag,
                "adrag": angularDrag,
                "center": {
                    "x": center.x,
                    "y": center.y,
                    "z": center.z
                }
            };
        };
        /** TODO */
        RigidbodyPhysics.CreateCollisionMetadata = function (type, trigger, convexmesh, restitution, dynamicfriction, staticfriction) {
            if (trigger === void 0) { trigger = false; }
            if (convexmesh === void 0) { convexmesh = false; }
            if (restitution === void 0) { restitution = 0.0; }
            if (dynamicfriction === void 0) { dynamicfriction = 0.6; }
            if (staticfriction === void 0) { staticfriction = 0.6; }
            return {
                "type": type,
                "trigger": trigger,
                "convexmesh": convexmesh,
                "restitution": restitution,
                "dynamicfriction": dynamicfriction,
                "staticfriction": staticfriction,
                "wheelinformation": null
            };
        };
        /** TODO */
        RigidbodyPhysics.CreatePhysicsProperties = function (mass, drag, angularDrag, useGravity, isKinematic) {
            if (drag === void 0) { drag = 0.0; }
            if (angularDrag === void 0) { angularDrag = 0.05; }
            if (useGravity === void 0) { useGravity = true; }
            if (isKinematic === void 0) { isKinematic = false; }
            return {
                "mass": mass,
                "drag": drag,
                "angularDrag": angularDrag,
                "useGravity": useGravity,
                "isKinematic": isKinematic
            };
        };
        /** TODO */
        RigidbodyPhysics.SetupPhysicsComponent = function (scene, entity) {
            // console.warn(">>> TRACE - Setup Physics For: " + entity.name);
            // console.log(entity);
            var metadata = (entity.metadata != null && entity.metadata.unity != null) ? entity.metadata.unity : null;
            if (metadata != null && (metadata.physics != null || metadata.collision != null)) {
                // Physics Metadata
                var hasphysics = (metadata.physics != null);
                var isroot = (metadata.physics != null && metadata.physics.root != null) ? metadata.physics.root : false;
                var mass = (metadata.physics != null && metadata.physics.mass != null) ? metadata.physics.mass : 0;
                var isstatic = (mass === 0);
                // Create Physics Impostor Node
                if (hasphysics === true) {
                    if (isroot) {
                        var fwheels_1 = null;
                        var fdynamicfriction_1 = 0;
                        var fstaticfriction_1 = 0;
                        var frestitution_1 = 0;
                        var ftrigger_1 = false;
                        var fcount_1 = 0;
                        // Note: Bullet Physics Center Mass Must Offset Meshes (No Working Set Center Mass Property Support)
                        var center_1 = (metadata.physics != null && metadata.physics.center != null) ? BABYLON.Utilities.ParseVector3(metadata.physics.center, BABYLON.Vector3.Zero()) : BABYLON.Vector3.Zero();
                        var centernodes = entity.getChildren(null, true);
                        if (centernodes != null && centernodes.length > 0) {
                            centernodes.forEach(function (centernode) { centernode.position.subtractInPlace(center_1); });
                        }
                        var childnodes = entity.getChildren(null, false);
                        if (childnodes != null && childnodes.length > 0) {
                            childnodes.forEach(function (childnode) {
                                if (childnode.metadata != null && childnode.metadata.unity != null) {
                                    if (childnode.metadata.unity.collision != null) {
                                        var ccollision = childnode.metadata.unity.collision;
                                        var cwheelinformation = (ccollision.wheelinformation != null) ? ccollision.wheelinformation : null;
                                        if (cwheelinformation != null) {
                                            // Trace Wheel Collider
                                            // BABYLON.Tools.Warn("Push raycast wheel collider: " + childnode.name + " --> on to: " + entity.name);
                                            if (fwheels_1 == null)
                                                fwheels_1 = [];
                                            fwheels_1.push(cwheelinformation);
                                        }
                                        else {
                                            var cdynamicfriction = (ccollision.dynamicfriction != null) ? ccollision.dynamicfriction : 0.6;
                                            var cstaticfriction = (ccollision.staticfriction != null) ? ccollision.staticfriction : 0.6;
                                            var crestitution = (ccollision.restitution != null) ? ccollision.restitution : 0;
                                            var cistrigger = (ccollision.trigger != null) ? ccollision.trigger : false;
                                            var ccollider = (ccollision.type != null) ? ccollision.type : "BoxCollider";
                                            var cimpostortype = BABYLON.PhysicsImpostor.BoxImpostor;
                                            if (ccollider === "MeshCollider") {
                                                // Note: Always Force Convex Hull Impostor Usage
                                                cimpostortype = BABYLON.PhysicsImpostor.ConvexHullImpostor;
                                            }
                                            else if (ccollider === "CapsuleCollider") {
                                                cimpostortype = BABYLON.PhysicsImpostor.CapsuleImpostor;
                                            }
                                            else if (ccollider === "SphereCollider") {
                                                cimpostortype = BABYLON.PhysicsImpostor.SphereImpostor;
                                            }
                                            else {
                                                cimpostortype = BABYLON.PhysicsImpostor.BoxImpostor;
                                            }
                                            if (cdynamicfriction > fdynamicfriction_1)
                                                fdynamicfriction_1 = cdynamicfriction;
                                            if (cstaticfriction > fstaticfriction_1)
                                                fstaticfriction_1 = cstaticfriction;
                                            if (crestitution > frestitution_1)
                                                frestitution_1 = crestitution;
                                            if (cistrigger == true)
                                                ftrigger_1 = true;
                                            // Trace Compound Collider
                                            // BABYLON.Tools.Warn("Setup " + BABYLON.SceneManager.GetPhysicsImposterType(cimpostortype).toLowerCase() + " compound imposter for: " + childnode.name);
                                            BABYLON.SceneManager.CreatePhysicsImpostor(scene, childnode, cimpostortype, { mass: 0, friction: 0, restitution: 0 });
                                            BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, childnode, true, false, metadata.physics);
                                            fcount_1++;
                                        }
                                    }
                                }
                            });
                        }
                        if (fcount_1 > 0) {
                            // Trace Physics Root
                            // BABYLON.Tools.Warn(">>> Created physics root no imposter for: " + entity.name);
                            BABYLON.SceneManager.CreatePhysicsImpostor(scene, entity, BABYLON.PhysicsImpostor.NoImpostor, { mass: mass, friction: fdynamicfriction_1, restitution: frestitution_1 });
                            BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, entity, false, ftrigger_1, metadata.physics);
                        }
                        if (fwheels_1 != null && fwheels_1.length > 0) {
                            if (entity.metadata == null)
                                entity.metadata = {};
                            if (entity.metadata.unity == null)
                                entity.metadata.unity = {};
                            entity.metadata.unity.wheels = fwheels_1;
                        }
                        childnodes = null;
                    }
                    else if (metadata.collision != null) {
                        var collider = (metadata.collision.type != null) ? metadata.collision.type : "BoxCollider";
                        var convexmesh = (metadata.collision.convexmesh != null) ? metadata.collision.convexmesh : false;
                        var dynamicfriction = (metadata.collision.dynamicfriction != null) ? metadata.collision.dynamicfriction : 0.6;
                        var staticfriction = (metadata.collision.staticfriction != null) ? metadata.collision.staticfriction : 0.6;
                        var restitution = (metadata.collision.restitution != null) ? metadata.collision.restitution : 0;
                        var istrigger = (metadata.collision.trigger != null) ? metadata.collision.trigger : false;
                        var impostortype = BABYLON.PhysicsImpostor.BoxImpostor;
                        // Config Physics Impostor
                        if (collider === "MeshCollider") {
                            impostortype = (convexmesh === true) ? BABYLON.PhysicsImpostor.ConvexHullImpostor : BABYLON.PhysicsImpostor.MeshImpostor;
                        }
                        else if (collider === "CapsuleCollider") {
                            impostortype = BABYLON.PhysicsImpostor.CapsuleImpostor;
                        }
                        else if (collider === "SphereCollider") {
                            impostortype = BABYLON.PhysicsImpostor.SphereImpostor;
                        }
                        else {
                            impostortype = BABYLON.PhysicsImpostor.BoxImpostor;
                        }
                        // Trace Physics Impostor
                        // BABYLON.Tools.Warn("Setup " + BABYLON.SceneManager.GetPhysicsImposterType(impostortype).toLowerCase() + " physics impostor for: " + entity.name);
                        BABYLON.SceneManager.CreatePhysicsImpostor(scene, entity, impostortype, { mass: mass, friction: (isstatic) ? staticfriction : dynamicfriction, restitution: restitution });
                        BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, entity, false, istrigger, metadata.physics);
                    }
                }
            }
        };
        RigidbodyPhysics.ConfigRigidbodyPhysics = function (scene, entity, child, trigger, physics) {
            if (entity == null)
                return;
            if (entity.physicsImpostor != null) {
                entity.physicsImpostor.executeNativeFunction(function (word, body) {
                    if (body.activate)
                        body.activate();
                    var colobj = Ammo.castObject(body, Ammo.btCollisionObject);
                    colobj.entity = entity;
                    // ..
                    // Legacy Edge Contact (DEPRECIATED: KEEP FOR REFERENCE)
                    // ..
                    //const world:any = BABYLON.SceneManager.GetPhysicsWorld(scene);
                    //if (world != null && world.generateInternalEdgeInfo) {
                    //    const collisionShape:any = colobj.getCollisionShape();
                    //    if (collisionShape != null && collisionShape.getShapeType) {
                    //        const shapeType:number = collisionShape.getShapeType();
                    //        if (shapeType === 21) { // TRIANGLE_MESH_SHAPE_PROXYTYPE
                    //            const triangleShape:any = Ammo.castObject(collisionShape, Ammo.btBvhTriangleMeshShape);
                    //            if (triangleShape != null) {
                    //                colobj.triangleMapInfo = new Ammo.btTriangleInfoMap();
                    //                world.generateInternalEdgeInfo(triangleShape, colobj.triangleMapInfo);
                    //            }
                    //        }
                    //    }
                    //}
                    // ..
                    // Setup Main Gravity
                    // ..
                    var gravity = (physics != null && physics.gravity != null) ? physics.gravity : true;
                    if (gravity === false) {
                        if (body.setGravity) {
                            if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                                BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                            BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(0, 0, 0);
                            body.setGravity(BABYLON.RigidbodyPhysics.TempAmmoVector);
                        }
                        else {
                            BABYLON.Tools.Warn("Physics engine set gravity override not supported for: " + entity.name);
                        }
                    }
                    // ..
                    // Setup Drag Damping
                    // ..
                    if (body.setDamping) {
                        var ldrag = (physics != null && physics.ldrag != null) ? physics.ldrag : 0;
                        var adrag = (physics != null && physics.adrag != null) ? physics.adrag : 0.05;
                        body.setDamping(ldrag, adrag);
                    }
                    else {
                        BABYLON.Tools.Warn("Physics engine set drag damping not supported for: " + entity.name);
                    }
                    // ..
                    // Setup Collision Flags
                    // ..
                    if (body.setCollisionFlags && body.getCollisionFlags) {
                        // DEPRECIATED: if (trigger === true) body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_NO_CONTACT_RESPONSE | BABYLON.CollisionFlags.CF_CUSTOM_MATERIAL_CALLBACK);
                        // DEPRECIATED: else body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_CUSTOM_MATERIAL_CALLBACK);
                        // TODO: if (mass === 0) body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_KINEMATIC_OBJECT); // STATIC_OBJECT
                        if (trigger === true)
                            body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_NO_CONTACT_RESPONSE); // TRIGGER_OBJECT
                        body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_CUSTOM_MATERIAL_CALLBACK); // CUSTOM_MATERIAL
                    }
                    else {
                        BABYLON.Tools.Warn("Physics engine set collision flags not supported for: " + entity.name);
                    }
                    // ..
                    // Setup Freeze Constraints
                    // ..
                    var freeze = (physics != null && physics.freeze != null) ? physics.freeze : null;
                    if (freeze != null) {
                        if (body.setLinearFactor) {
                            var freeze_pos_x = (freeze.positionx != null && freeze.positionx === true) ? 0 : 1;
                            var freeze_pos_y = (freeze.positiony != null && freeze.positiony === true) ? 0 : 1;
                            var freeze_pos_z = (freeze.positionz != null && freeze.positionz === true) ? 0 : 1;
                            if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                                BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                            BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(freeze_pos_x, freeze_pos_y, freeze_pos_z);
                            body.setLinearFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
                        }
                        else {
                            BABYLON.Tools.Warn("Physics engine set linear factor not supported for: " + entity.name);
                        }
                        if (body.setAngularFactor) {
                            var freeze_rot_x = (freeze.rotationx != null && freeze.rotationx === true) ? 0 : 1;
                            var freeze_rot_y = (freeze.rotationy != null && freeze.rotationy === true) ? 0 : 1;
                            var freeze_rot_z = (freeze.rotationz != null && freeze.rotationz === true) ? 0 : 1;
                            if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                                BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                            BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(freeze_rot_x, freeze_rot_y, freeze_rot_z);
                            body.setAngularFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
                        }
                        else {
                            BABYLON.Tools.Warn("Physics engine set angular factor not supported for: " + entity.name);
                        }
                    }
                });
            }
            else {
                BABYLON.Tools.Warn("No valid physics impostor to setup for " + entity.name);
            }
        };
        RigidbodyPhysics.TempAmmoVector = null;
        RigidbodyPhysics.TempAmmoVectorAux = null;
        RigidbodyPhysics.TempCenterTransform = null;
        return RigidbodyPhysics;
    }(BABYLON.ScriptComponent));
    BABYLON.RigidbodyPhysics = RigidbodyPhysics;
    /**
     * Babylon collision contact info pro class (Native Bullet Physics 2.82)
     * @class CollisionContactInfo - All rights reserved (c) 2020 Mackey Kinard
     */
    var CollisionContactInfo = /** @class */ (function () {
        function CollisionContactInfo() {
            this.mesh = null;
            this.state = 0;
            this.reset = false;
        }
        return CollisionContactInfo;
    }());
    BABYLON.CollisionContactInfo = CollisionContactInfo;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon shuriken particle system pro class (Unity Style Shuriken Particle System)
     * @class ShurikenParticles - All rights reserved (c) 2020 Mackey Kinard
     */
    var ShurikenParticles = /** @class */ (function (_super) {
        __extends(ShurikenParticles, _super);
        function ShurikenParticles() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShurikenParticles.prototype.awake = function () { };
        ShurikenParticles.prototype.start = function () { };
        ShurikenParticles.prototype.update = function () { };
        ShurikenParticles.prototype.late = function () { };
        ShurikenParticles.prototype.after = function () { };
        ShurikenParticles.prototype.destroy = function () { };
        return ShurikenParticles;
    }(BABYLON.ScriptComponent));
    BABYLON.ShurikenParticles = ShurikenParticles;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon web video player pro class (Unity Style Shuriken Particle System)
     * @class WebVideoPlayer - All rights reserved (c) 2020 Mackey Kinard
     */
    var WebVideoPlayer = /** @class */ (function (_super) {
        __extends(WebVideoPlayer, _super);
        function WebVideoPlayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.videoLoop = false;
            _this.videoMuted = false;
            _this.videoAlpha = false;
            _this.videoFaded = false;
            _this.videoPoster = null;
            _this.videoInvert = true;
            _this.videoSample = 3;
            _this.videoVolume = 1.0;
            _this.videoMipmaps = false;
            _this.videoPlayback = 1.0;
            _this.videoPlayOnAwake = true;
            _this.videoPreloaderUrl = null;
            _this.videoBlobUrl = null;
            _this.videoPreload = false;
            _this._initializedReadyInstance = false;
            /** Register handler that is triggered when the video clip is ready */
            _this.onReadyObservable = new BABYLON.Observable();
            _this.m_abstractMesh = null;
            _this.m_videoTexture = null;
            _this.m_videoMaterial = null;
            _this.m_diffuseIntensity = 1.0;
            return _this;
        }
        WebVideoPlayer.prototype.getVideoMaterial = function () { return this.m_videoMaterial; };
        WebVideoPlayer.prototype.getVideoTexture = function () { return this.m_videoTexture; };
        WebVideoPlayer.prototype.getVideoElement = function () { return (this.m_videoTexture != null) ? this.m_videoTexture.video : null; };
        WebVideoPlayer.prototype.getVideoScreen = function () { return this.m_abstractMesh; };
        WebVideoPlayer.prototype.getVideoBlobUrl = function () { return this.videoBlobUrl; };
        WebVideoPlayer.prototype.awake = function () { this.awakeWebVideoPlayer(); };
        WebVideoPlayer.prototype.destroy = function () { this.destroyWebVideoPlayer(); };
        WebVideoPlayer.prototype.awakeWebVideoPlayer = function () {
            this.videoLoop = this.getProperty("looping", false);
            this.videoMuted = this.getProperty("muted", false);
            this.videoInvert = this.getProperty("inverty", true);
            this.videoSample = this.getProperty("sampling", 3);
            this.videoVolume = this.getProperty("volume", 1.0);
            this.videoMipmaps = this.getProperty("mipmaps", false);
            this.videoAlpha = this.getProperty("texturealpha", false);
            this.videoFaded = this.getProperty("diffusealpha", false);
            this.videoPlayback = this.getProperty("playbackspeed", 1.0);
            this.videoPlayOnAwake = this.getProperty("playonawake", true);
            this.videoPreload = this.getProperty("preload", this.videoPreload);
            this.m_diffuseIntensity = this.getProperty("intensity", 1.0);
            this.m_abstractMesh = this.getAbstractMesh();
            // ..
            var setPoster = this.getProperty("poster");
            if (setPoster === true && this.m_abstractMesh != null && this.m_abstractMesh.material != null) {
                if (this.m_abstractMesh.material instanceof BABYLON.PBRMaterial) {
                    if (this.m_abstractMesh.material.albedoTexture != null && this.m_abstractMesh.material.albedoTexture.url != null && this.m_abstractMesh.material.albedoTexture.url !== "") {
                        this.videoPoster = this.m_abstractMesh.material.albedoTexture.url.replace("data:", "");
                    }
                }
                else if (this.m_abstractMesh.material instanceof BABYLON.StandardMaterial) {
                    if (this.m_abstractMesh.material.diffuseTexture != null && this.m_abstractMesh.material.diffuseTexture.url != null && this.m_abstractMesh.material.diffuseTexture.url !== "") {
                        this.videoPoster = this.m_abstractMesh.material.diffuseTexture.url.replace("data:", "");
                    }
                }
            }
            // ..
            var videoUrl = this.getProperty("url", null);
            var videoSrc = this.getProperty("source", null);
            var playUrl = videoUrl;
            if (videoSrc != null && videoSrc.filename != null && videoSrc.filename !== "") {
                var rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
                playUrl = (rootUrl + videoSrc.filename);
            }
            if (playUrl != null && playUrl !== "") {
                if (this.videoPreload === true) {
                    this.videoPreloaderUrl = playUrl;
                }
                else {
                    this.setDataSource(playUrl);
                }
            }
        };
        WebVideoPlayer.prototype.destroyWebVideoPlayer = function () {
            this.m_abstractMesh = null;
            if (this.m_videoTexture != null) {
                this.m_videoTexture.dispose();
                this.m_videoTexture = null;
            }
            if (this.m_videoMaterial != null) {
                this.m_videoMaterial.dispose();
                this.m_videoMaterial = null;
            }
            this.revokeVideoBlobUrl();
        };
        /**
         * Gets the video ready status
         */
        WebVideoPlayer.prototype.isReady = function () {
            return (this.getVideoElement() != null);
        };
        /**
         * Gets the video playing status
         */
        WebVideoPlayer.prototype.isPlaying = function () {
            var result = false;
            var video = this.getVideoElement();
            if (video != null) {
                result = (video.paused === false);
            }
            return result;
        };
        /**
         * Gets the video paused status
         */
        WebVideoPlayer.prototype.isPaused = function () {
            var result = false;
            var video = this.getVideoElement();
            if (video != null) {
                result = (video.paused === true);
            }
            return result;
        };
        /**
         * Play the video track
         */
        WebVideoPlayer.prototype.play = function () {
            var _this = this;
            if (BABYLON.SceneManager.HasAudioContext()) {
                this.internalPlay();
            }
            else {
                BABYLON.Engine.audioEngine.onAudioUnlockedObservable.addOnce(function () { _this.internalPlay(); });
            }
            return true;
        };
        WebVideoPlayer.prototype.internalPlay = function () {
            var _this = this;
            if (this._initializedReadyInstance === true) {
                this.checkedPlay();
            }
            else {
                this.onReadyObservable.addOnce(function () { _this.checkedPlay(); });
            }
        };
        WebVideoPlayer.prototype.checkedPlay = function () {
            var _this = this;
            var video = this.getVideoElement();
            if (video != null) {
                video.play().then(function () {
                    if (video.paused === true) {
                        _this.checkedRePlay();
                    }
                });
            }
        };
        WebVideoPlayer.prototype.checkedRePlay = function () {
            var video = this.getVideoElement();
            if (video != null) {
                video.play().then(function () { });
            }
        };
        /**
         * Pause the video track
         */
        WebVideoPlayer.prototype.pause = function () {
            var result = false;
            var video = this.getVideoElement();
            if (video != null) {
                video.pause();
                result = true;
            }
            return result;
        };
        /**
         * Mute the video track
         */
        WebVideoPlayer.prototype.mute = function () {
            var result = false;
            var video = this.getVideoElement();
            if (video != null) {
                video.muted = true;
                result = true;
            }
            return result;
        };
        /**
         * Unmute the video track
         */
        WebVideoPlayer.prototype.unmute = function () {
            var result = false;
            var video = this.getVideoElement();
            if (video != null) {
                video.muted = false;
                result = true;
            }
            return result;
        };
        /**
         * Gets the video volume
         */
        WebVideoPlayer.prototype.getVolume = function () {
            var result = 0;
            var video = this.getVideoElement();
            if (video != null) {
                result = video.volume;
            }
            return result;
        };
        /**
         * Sets the video volume
         * @param volume Define the new volume of the sound
         */
        WebVideoPlayer.prototype.setVolume = function (volume) {
            var result = false;
            var video = this.getVideoElement();
            if (video != null) {
                video.volume = volume;
                result = true;
            }
            return result;
        };
        /** Set video data source */
        WebVideoPlayer.prototype.setDataSource = function (source) {
            var _this = this;
            if (this.m_abstractMesh != null) {
                // ..
                // Create Video Material
                // ..
                if (this.m_videoMaterial == null) {
                    this.m_videoMaterial = new BABYLON.StandardMaterial(this.transform.name + ".VideoMat", this.scene);
                    this.m_videoMaterial.roughness = 1;
                    this.m_videoMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
                    this.m_videoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
                    this.m_videoMaterial.useAlphaFromDiffuseTexture = this.videoFaded;
                    this.m_abstractMesh.material = this.m_videoMaterial;
                }
                // ..
                // Setup Video Texture
                // ..
                if (this.m_videoMaterial != null) {
                    this.m_videoMaterial.diffuseTexture = null;
                    if (this.m_videoTexture != null) {
                        this.m_videoTexture.dispose();
                        this.m_videoTexture = null;
                    }
                    this._initializedReadyInstance = false;
                    this.m_videoTexture = new BABYLON.VideoTexture(this.transform.name + ".VideoTex", source, this.scene, this.videoMipmaps, this.videoInvert, this.videoSample, { autoUpdateTexture: true, poster: this.videoPoster });
                    if (this.m_videoTexture != null) {
                        this.m_videoTexture.hasAlpha = this.videoAlpha;
                        if (this.m_videoTexture.video != null) {
                            this.m_videoTexture.video.loop = this.videoLoop;
                            this.m_videoTexture.video.muted = this.videoMuted;
                            this.m_videoTexture.video.volume = this.videoVolume;
                            this.m_videoTexture.video.playbackRate = this.videoPlayback;
                            this.m_videoTexture.video.addEventListener("loadeddata", function () {
                                _this._initializedReadyInstance = true;
                                if (_this.onReadyObservable.hasObservers() === true) {
                                    _this.onReadyObservable.notifyObservers(_this.m_videoTexture);
                                }
                                if (_this.videoPlayOnAwake === true) {
                                    _this.play();
                                }
                            });
                            this.m_videoTexture.video.load();
                        }
                    }
                    if (this.m_videoTexture != null) {
                        this.m_videoTexture.level = this.m_diffuseIntensity;
                        this.m_videoMaterial.diffuseTexture = this.m_videoTexture;
                    }
                }
                else {
                    BABYLON.Tools.Warn("No video mesh or material available for: " + this.transform.name);
                }
            }
        };
        /** Revokes the current video blob url and releases resouces */
        WebVideoPlayer.prototype.revokeVideoBlobUrl = function () {
            if (this.videoBlobUrl != null) {
                URL.revokeObjectURL(this.videoBlobUrl);
                this.videoBlobUrl = null;
            }
        };
        /** Add video preloader asset tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        WebVideoPlayer.prototype.addPreloaderTasks = function (assetsManager) {
            var _this = this;
            if (this.videoPreload === true) {
                var assetTask = assetsManager.addBinaryFileTask((this.transform.name + ".VideoTask"), this.videoPreloaderUrl);
                assetTask.onSuccess = function (task) {
                    _this.revokeVideoBlobUrl();
                    _this.videoBlobUrl = URL.createObjectURL(new Blob([task.data]));
                    _this.setDataSource(_this.videoBlobUrl);
                };
                assetTask.onError = function (task, message, exception) { console.error(message, exception); };
            }
        };
        return WebVideoPlayer;
    }(BABYLON.ScriptComponent));
    BABYLON.WebVideoPlayer = WebVideoPlayer;
})(BABYLON || (BABYLON = {}));


// Project Shader Fixes
if (BABYLON.Effect.IncludesShadersStore["pbrBlockFinalColorComposition"]) BABYLON.Effect.IncludesShadersStore["pbrBlockFinalColorComposition"] = BABYLON.Effect.IncludesShadersStore["pbrBlockFinalColorComposition"].replace("finalColor.rgb*=lightmapColor.rgb", "finalColor.rgb*=(lightmapColor.rgb+finalEmissive.rgb)");
if (BABYLON.Effect.ShadersStore["defaultPixelShader"]) BABYLON.Effect.ShadersStore["defaultPixelShader"] = BABYLON.Effect.ShadersStore["defaultPixelShader"].replace("color.rgb *= lightmapColor.rgb", "color.rgb *= (lightmapColor.rgb + finalEmissive.rgb)");
