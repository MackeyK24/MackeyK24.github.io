// mvrkracing3d.js
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon universal camera rig system pro class
     * @class UniversalCameraSystem - All rights reserved (c) 2020 Mackey Kinard
     * https://doc.babylonjs.com/divingDeeper/postProcesses/defaultRenderingPipeline
     */
    class UniversalCameraSystem extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.mainCamera = false;
            this.cameraType = 0;
            this.cameraInertia = 0.5;
            this.cameraController = null;
            this.virtualReality = null;
            this.arcRotateConfig = null;
            this.multiPlayerSetup = null;
            this.editorPostProcessing = null;
            this.m_cameraRig = null;
        }
        static GetRenderingPipeline() { return PROJECT.UniversalCameraSystem.renderingPipeline; }
        ;
        static IsCameraSystemReady() { return PROJECT.UniversalCameraSystem.cameraReady; }
        isMainCamera() { return this.mainCamera; }
        getCameraType() { return this.cameraType; }
        awake() { this.awakeCameraSystemState(); }
        start() { this.startCameraSystemState(); }
        update() { this.updateCameraSystemState(); }
        destroy() { this.destroyCameraSystemState(); }
        /////////////////////////////////////////////
        // Universal Camera System State Functions //
        /////////////////////////////////////////////
        awakeCameraSystemState() {
            this.mainCamera = (this.getTransformTag() === "MainCamera");
            this.cameraType = this.getProperty("mainCameraType", this.cameraType);
            this.cameraInertia = this.getProperty("setCameraInertia", this.cameraInertia);
            this.virtualReality = this.getProperty("virtualRealityRig", this.virtualReality);
            this.arcRotateConfig = this.getProperty("arcRotateConfig", this.arcRotateConfig);
            this.multiPlayerSetup = this.getProperty("multiPlayerSetup", this.multiPlayerSetup);
            this.cameraController = this.getProperty("cameraController", this.cameraController);
            this.editorPostProcessing = this.getProperty("renderingPipeline", this.editorPostProcessing);
            if (this.cameraType === 1) { // Virtual Reality Camera Override
                const webxr = BABYLON.SceneManager.GetWindowState("webxr");
                if (webxr != null && webxr === "disabled") {
                    this.cameraType = 0;
                }
            }
        }
        async startCameraSystemState() {
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
            if (this.multiPlayerSetup != null) {
                PROJECT.UniversalCameraSystem.startupMode = this.multiPlayerSetup.playerStartupMode;
                PROJECT.UniversalCameraSystem.stereoCameras = this.multiPlayerSetup.stereoSideBySide;
            }
            // ..
            // Default Camera System Support
            // ..
            this.m_cameraRig = this.getCameraRig();
            if (this.m_cameraRig != null) {
                this.m_cameraRig.inertia = this.cameraInertia;
                if (this.m_cameraRig.inputs != null && this.m_cameraRig.inputs.attached != null && this.m_cameraRig.inputs.attached.mouse != null) {
                    const mouseInput = this.m_cameraRig.inputs.attached.mouse;
                    if (BABYLON.Utilities.HasOwnProperty(mouseInput, "touchEnabled")) {
                        mouseInput.touchEnabled = true;
                    }
                }
                if (this.cameraType === 0) { // Universal Target Camera
                    //if (PROJECT.UniversalCameraSystem.PlayerOneCamera == null) {
                    PROJECT.UniversalCameraSystem.PlayerOneCamera = this.m_cameraRig;
                    PROJECT.UniversalCameraSystem.PlayerOneCamera.inertia = this.cameraInertia;
                    PROJECT.UniversalCameraSystem.PlayerOneCamera.transform = this.transform;
                    //}             
                }
                else if (this.cameraType === 1) { // Virtual Reality Camera
                    if (this.virtualReality != null) {
                        let webvrFloorMeshes = null;
                        let webvrHelperOptions = null;
                        let webvrImmersiveMode = (this.virtualReality.immersiveExperience === 1) ? "immersive-ar" : "immersive-vr";
                        let webvrReferenceType = "local-floor";
                        switch (this.virtualReality.referenceSpaceType) {
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
                        if (this.virtualReality.setFloorMeshesTags == null || this.virtualReality.setFloorMeshesTags === "")
                            this.virtualReality.setFloorMeshesTags = "Navigation";
                        if (this.virtualReality.enableTeleportation === true)
                            webvrFloorMeshes = this.scene.getMeshesByTags(this.virtualReality.setFloorMeshesTags);
                        if (this.virtualReality.enableTeleportation === true && webvrFloorMeshes != null && webvrFloorMeshes.length > 0) {
                            webvrHelperOptions = {
                                floorMeshes: webvrFloorMeshes,
                                renderingGroupId: this.virtualReality.renderingGroupNum,
                                disableDefaultUI: this.virtualReality.disableUserInterface,
                                disableTeleportation: (this.virtualReality.enableTeleportation === false),
                                ignoreNativeCameraTransformation: this.virtualReality.ignoreNativeCamera,
                                inputOptions: {
                                    doNotLoadControllerMeshes: this.virtualReality.experienceInputOptions.disableMeshLoad,
                                    forceInputProfile: this.virtualReality.experienceInputOptions.forceInputProfile,
                                    disableOnlineControllerRepository: this.virtualReality.experienceInputOptions.disableRepository,
                                    customControllersRepositoryURL: this.virtualReality.experienceInputOptions.customRepository,
                                    disableControllerAnimation: this.virtualReality.experienceInputOptions.disableModelAnim,
                                    controllerOptions: {
                                        disableMotionControllerAnimation: this.virtualReality.experienceInputOptions.controllerOptions.disableCtrlAnim,
                                        doNotLoadControllerMesh: this.virtualReality.experienceInputOptions.controllerOptions.disableCtrlMesh,
                                        forceControllerProfile: this.virtualReality.experienceInputOptions.controllerOptions.forceCtrlProfile,
                                        renderingGroupId: this.virtualReality.experienceInputOptions.controllerOptions.renderingGroup
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
                                renderingGroupId: this.virtualReality.renderingGroupNum,
                                disableDefaultUI: this.virtualReality.disableUserInterface,
                                disableTeleportation: (this.virtualReality.enableTeleportation === false),
                                ignoreNativeCameraTransformation: this.virtualReality.ignoreNativeCamera,
                                inputOptions: {
                                    doNotLoadControllerMeshes: this.virtualReality.experienceInputOptions.disableMeshLoad,
                                    forceInputProfile: this.virtualReality.experienceInputOptions.forceInputProfile,
                                    disableOnlineControllerRepository: this.virtualReality.experienceInputOptions.disableRepository,
                                    customControllersRepositoryURL: this.virtualReality.experienceInputOptions.customRepository,
                                    disableControllerAnimation: this.virtualReality.experienceInputOptions.disableModelAnim,
                                    controllerOptions: {
                                        disableMotionControllerAnimation: this.virtualReality.experienceInputOptions.controllerOptions.disableCtrlAnim,
                                        doNotLoadControllerMesh: this.virtualReality.experienceInputOptions.controllerOptions.disableCtrlMesh,
                                        forceControllerProfile: this.virtualReality.experienceInputOptions.controllerOptions.forceCtrlProfile,
                                        renderingGroupId: this.virtualReality.experienceInputOptions.controllerOptions.renderingGroup
                                    }
                                },
                                uiOptions: {
                                    sessionMode: webvrImmersiveMode,
                                    referenceSpaceType: webvrReferenceType
                                }
                            };
                        }
                        PROJECT.UniversalCameraSystem.XRExperienceHelper = await this.scene.createDefaultXRExperienceAsync(webvrHelperOptions);
                        if (!PROJECT.UniversalCameraSystem.XRExperienceHelper.baseExperience) {
                            BABYLON.SceneManager.LogWarning("WebXR not supported in current browser.");
                        }
                    }
                }
                else if (this.cameraType === 2) { // Multi Player Camera
                    const cameraName = this.m_cameraRig.name;
                    //if (PROJECT.UniversalCameraSystem.PlayerOneCamera == null) {
                    const playerOneTransform = new BABYLON.TransformNode("Player Camera 1", this.scene);
                    playerOneTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    playerOneTransform.position = this.transform.position.clone();
                    playerOneTransform.parent = this.transform.parent;
                    // ..
                    const playerOneName = cameraName + ".1";
                    const playerOneCamerax = this.m_cameraRig.clone(playerOneName);
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
                    //}             
                    //if (PROJECT.UniversalCameraSystem.PlayerTwoCamera == null) {
                    const playerTwoTransform = new BABYLON.TransformNode("Player Camera 2", this.scene);
                    playerTwoTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    playerTwoTransform.position = this.transform.position.clone();
                    playerTwoTransform.parent = this.transform.parent;
                    // ..
                    const playerTwoName = cameraName + ".2";
                    const playerTwoCamerax = this.m_cameraRig.clone(playerTwoName);
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
                    //}
                    //if (PROJECT.UniversalCameraSystem.PlayerThreeCamera == null) {
                    const playerThreeTransform = new BABYLON.TransformNode("Player Camera 3", this.scene);
                    playerThreeTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    playerThreeTransform.position = this.transform.position.clone();
                    playerThreeTransform.parent = this.transform.parent;
                    // ..
                    const playerThreeName = cameraName + ".3";
                    const playerThreeCamerax = this.m_cameraRig.clone(playerThreeName);
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
                    //}
                    //if (PROJECT.UniversalCameraSystem.PlayerFourCamera == null) {
                    const playerFourTransform = new BABYLON.TransformNode("Player Camera 4", this.scene);
                    playerFourTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    playerFourTransform.position = this.transform.position.clone();
                    playerFourTransform.parent = this.transform.parent;
                    // ..
                    const playerFourName = cameraName + ".4";
                    const playerFourCamerax = this.m_cameraRig.clone(playerFourName);
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
            }
            const quality = BABYLON.SceneManager.GetRenderQuality();
            const allowProcessing = (quality === BABYLON.RenderQuality.High);
            //if (PROJECT.UniversalCameraSystem.renderingPipeline == null) {
            if (allowProcessing === true && this.editorPostProcessing != null && this.editorPostProcessing.usePostProcessing === true) {
                PROJECT.UniversalCameraSystem.renderingPipeline = new BABYLON.DefaultRenderingPipeline("UniversalCameraSystem", this.editorPostProcessing.highDynamicRange, this.scene, this.scene.cameras, true);
                if (PROJECT.UniversalCameraSystem.renderingPipeline.isSupported === true) {
                    const defaultPipeline = PROJECT.UniversalCameraSystem.renderingPipeline;
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
                                const vcolor = BABYLON.Utilities.ParseColor4(this.editorPostProcessing.imageProcessingConfig.vignetteColor);
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
                                const colorGradingTexture = BABYLON.Utilities.ParseTexture(this.editorPostProcessing.imageProcessingConfig.setGradingTexture, this.scene, true, false);
                                colorGradingTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                colorGradingTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                defaultPipeline.imageProcessing.colorGradingTexture = colorGradingTexture;
                                defaultPipeline.imageProcessing.colorGradingWithGreenDepth = false;
                            }
                        }
                        /* Color Curves */
                        defaultPipeline.imageProcessing.colorCurvesEnabled = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.curvesEnabled; // false by default
                        if (defaultPipeline.imageProcessing.colorCurvesEnabled) {
                            var curve = new BABYLON.ColorCurves();
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
        }
        updateCameraSystemState() {
            if (this.m_cameraRig != null) {
                if (this.cameraType === 0) { // Standard Free Camera
                }
                else if (this.cameraType === 1) { // Virtual Reality Camera
                }
                else if (this.cameraType === 2) { // Multi Player Camera
                }
            }
        }
        destroyCameraSystemState() {
            this.virtualReality = null;
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera Virtual Reality Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Get the WebXR default experience helper */
        static GetWebXR() { return PROJECT.UniversalCameraSystem.XRExperienceHelper; }
        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera System Player Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Get universal camera rig for desired player */
        static GetPlayerCamera(scene, player = BABYLON.PlayerNumber.One, detach = false) {
            let result = null;
            if (PROJECT.UniversalCameraSystem.IsCameraSystemReady()) {
                if (player === BABYLON.PlayerNumber.One && PROJECT.UniversalCameraSystem.PlayerOneCamera != null)
                    result = PROJECT.UniversalCameraSystem.PlayerOneCamera;
                else if (player === BABYLON.PlayerNumber.Two && PROJECT.UniversalCameraSystem.PlayerTwoCamera != null)
                    result = PROJECT.UniversalCameraSystem.PlayerTwoCamera;
                else if (player === BABYLON.PlayerNumber.Three && PROJECT.UniversalCameraSystem.PlayerThreeCamera != null)
                    result = PROJECT.UniversalCameraSystem.PlayerThreeCamera;
                else if (player === BABYLON.PlayerNumber.Four && PROJECT.UniversalCameraSystem.PlayerFourCamera != null)
                    result = PROJECT.UniversalCameraSystem.PlayerFourCamera;
            }
            if (detach === true && parent != null)
                result.parent = null;
            return result;
        }
        /** Get camera transform node for desired player */
        static GetCameraTransform(scene, player = BABYLON.PlayerNumber.One) {
            let result = null;
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
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera System Multi Player Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Are stereo side side camera services available. */
        static IsStereoCameras() {
            return PROJECT.UniversalCameraSystem.stereoCameras;
        }
        /** Are local multi player view services available. */
        static IsMultiPlayerView() {
            return PROJECT.UniversalCameraSystem.multiPlayerView;
        }
        /** Get the current local multi player count */
        static GetMultiPlayerCount() {
            return PROJECT.UniversalCameraSystem.multiPlayerCount;
        }
        /** Activates current local multi player cameras. */
        static ActivateMultiPlayerCameras(scene) {
            let result = false;
            if (PROJECT.UniversalCameraSystem.multiPlayerCameras != null && PROJECT.UniversalCameraSystem.multiPlayerCameras.length > 0) {
                scene.activeCameras = PROJECT.UniversalCameraSystem.multiPlayerCameras;
                result = true;
            }
            return result;
        }
        /** Disposes current local multiplayer cameras */
        static DisposeMultiPlayerCameras() {
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
        }
        /** Sets the multi player camera view layout */
        static SetMultiPlayerViewLayout(scene, totalNumPlayers) {
            let result = false;
            let players = BABYLON.Scalar.Clamp(totalNumPlayers, 1, 4);
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
        }
    }
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
    PROJECT.UniversalCameraSystem = UniversalCameraSystem;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class UserInterface
    */
    class UserInterface extends BABYLON.ScriptComponent {
        awake() {
            /* Init component function */
        }
        start() {
            /* Start render loop function */
        }
        update() {
            /* Update render loop function */
        }
        late() {
            /* Late update render loop function */
        }
        after() {
            /* After render loop function */
        }
        fixed() {
            /* Fixed update physics step function */
        }
        destroy() {
            /* Destroy component function */
        }
    }
    PROJECT.UserInterface = UserInterface;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class LightProjection
    */
    class LightProjection extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.projectionTexture = null;
            this.spotLightExponent = 16.0;
            this.spotLightAngle = 120;
            this.nearClipPlane = 0.1;
            this.farClipPlane = 100.0;
            this.excludeChildren = true;
            this.includeTags = null;
            this.enableRotation = true;
            this.projectionRotation = 0;
            this.projectionPosition = new BABYLON.Vector3(0, 1, 0);
            this.m_spotLight = null;
            this.m_projectorDirty = false;
            this.m_projectorPosition = new BABYLON.Vector3(0, 0, 0);
            this.m_projectorRotation = new BABYLON.Vector3(0, 0, 0);
            this.m_lastPosition = new BABYLON.Vector3(0, 0, 0);
            this.m_lastRotation = new BABYLON.Vector3(0, 0, 0);
        }
        getLightProjector() { return this.m_spotLight; }
        awake() {
            if (PROJECT.LightProjection.ShaderFragmentUpdated === false) {
                BABYLON.Effect.IncludesShadersStore["lightFragment"] = BABYLON.Effect.IncludesShadersStore["lightFragment"].replace("info.diffuse*=computeProjectionTextureDiffuseLighting(projectionLightSampler{X},textureProjectionMatrix{X});", `surfaceAlbedo.rgb*=computeProjectionTextureDiffuseLighting(projectionLightSampler{X},textureProjectionMatrix{X});
                    info.diffuse=vec3(0.);
                    info.specular=vec3(0.);
                    `);
                PROJECT.LightProjection.ShaderFragmentUpdated = true;
            }
            // ..
            // Setup Projection Texture Without Mipmapping
            // ..
            const projectionTextureData = this.getProperty("projectionTexture");
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
                let tagQuery = this.includeTags.join(" || ");
                let includeMeshes = this.scene.getMeshesByTags(tagQuery);
                let includeTransforms = this.scene.getTransformNodesByTags(tagQuery);
                if (includeMeshes != null) {
                    if (includeTransforms == null)
                        includeTransforms = [];
                    includeTransforms.push(...includeMeshes);
                }
                if (includeTransforms != null) {
                    includeTransforms.forEach((element) => {
                        const childDetailMesh = SM.GetTransformDetailMesh(element);
                        if (childDetailMesh != null) {
                            if (this.m_spotLight.includedOnlyMeshes == null)
                                this.m_spotLight.includedOnlyMeshes = [];
                            this.m_spotLight.includedOnlyMeshes.push(childDetailMesh);
                        }
                        else {
                            if (element instanceof BABYLON.AbstractMesh) {
                                if (this.m_spotLight.includedOnlyMeshes == null)
                                    this.m_spotLight.includedOnlyMeshes = [];
                                this.m_spotLight.includedOnlyMeshes.push(element);
                            }
                        }
                    });
                }
            }
            else if (this.excludeChildren === true) {
                const abstractMesh = this.getAbstractMesh();
                if (abstractMesh != null) {
                    if (this.m_spotLight.excludedMeshes == null)
                        this.m_spotLight.excludedMeshes = [];
                    this.m_spotLight.excludedMeshes.push(abstractMesh);
                }
                const childMeshes = this.transform.getChildMeshes(false);
                if (childMeshes != null && childMeshes.length > 0) {
                    if (this.m_spotLight.excludedMeshes == null)
                        this.m_spotLight.excludedMeshes = [];
                    this.m_spotLight.excludedMeshes.push(...childMeshes);
                }
            }
            this.updateProjectorPosition();
        }
        start() {
            this.updateProjectorPosition();
        }
        update() {
            this.updateProjectorPosition();
        }
        destroy() {
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
        }
        updateProjectorPosition() {
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
                    let rotationAngle = -this.m_projectorRotation.y;
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
    }
    LightProjection.ShaderFragmentUpdated = false;
    PROJECT.LightProjection = LightProjection;
})(PROJECT || (PROJECT = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon photon client controller class (Photon Engine)
     * @class PhotonController - All rights reserved (c) 2020 Mackey Kinard
     */
    class PhotonController {
        /** Connects a window state photon client to a name server (Photon Cloud Services) */
        static ConnectToNameServer(options, address, handler) {
            let client = null;
            if (window.top["photonNameServer"]) {
                client = window.top["photonNameServer"](options, address, handler);
            }
            return client;
        }
        /** Connects a window state photon client to a region server (Photon Cloud Services) */
        static ConnectToRegionServer(region, address, handler) {
            let client = null;
            if (window.top["photonRegionServer"]) {
                client = window.top["photonRegionServer"](region, address, handler);
            }
            return client;
        }
        /** Connects a window state photon client to a master server (Private Windows Server) */
        static ConnectToMasterServer(server, options, handler) {
            let client = null;
            if (window.top["photonMasterServer"]) {
                client = window.top["photonMasterServer"](server, options, handler);
            }
            return client;
        }
        /** Get the window state photon client */
        static GetPhotonClient() {
            return BABYLON.SceneManager.GetWindowState("photon");
        }
    }
    BABYLON.PhotonController = PhotonController;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon window socket controller class (Socket.IO)
     * @class SocketController - All rights reserved (c) 2020 Mackey Kinard
     */
    class SocketController {
        /** Registers an handler for window socket connect event */
        static RegisterOnSocketConnect(func) {
            BABYLON.SceneManager.SetWindowState("onSocketConnect", func);
        }
        /** Registers an handler for window socket disconnect event */
        static RegisterOnSocketDisconnect(func) {
            BABYLON.SceneManager.SetWindowState("onSocketDisconnect", func);
        }
        /** Connects a window state socket */
        static ConnectWindowSocket(connection) {
            let socket = null;
            if (window.top["socketConnect"]) {
                socket = window.top["socketConnect"](connection);
            }
            return socket;
        }
        /** Get the window state socket */
        static GetWindowSocket() {
            return BABYLON.SceneManager.GetWindowState("socket");
        }
    }
    BABYLON.SocketController = SocketController;
})(BABYLON || (BABYLON = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class UniversalPlayerController
    */
    class UniversalPlayerController extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.enableInput = false;
            this.attachCamera = false;
            this.rotateCamera = true;
            this.moveCharacter = true;
            this.toggleView = true;
            this.freeLooking = false;
            this.rootMotion = false;
            this.gravityForce = 0.5;
            this.slopeForce = 0;
            this.rayLength = 1;
            this.rayOrigin = 0;
            this.maxAngle = 45;
            this.speedFactor = 1.0;
            this.moveSpeed = 5.0;
            this.lookSpeed = 2.0;
            this.jumpSpeed = 8.0;
            this.jumpDelay = 0.0;
            this.eyesHeight = 1.0;
            this.pivotHeight = 1.0;
            this.topLookLimit = 60.0;
            this.downLookLimit = 30.0;
            this.lowTurnSpeed = 15.0;
            this.highTurnSpeed = 25.0;
            this.takeoffPower = 2.5;
            this.stoppingPower = 5.0;
            this.acceleration = false;
            this.avatarSkinTag = "Skin";
            this.distanceFactor = 0.85;
            this.cameraSmoothing = 5;
            this.cameraCollisions = true;
            this.inputMagnitude = 0;
            this.minimumDistance = 0.85;
            this.buttonJump = BABYLON.Xbox360Button.A;
            this.keyboardJump = BABYLON.UserInputKey.SpaceBar;
            this.buttonCamera = BABYLON.Xbox360Button.Y;
            this.keyboardCamera = BABYLON.UserInputKey.P;
            this.playerNumber = BABYLON.PlayerNumber.One;
            this.boomPosition = new BABYLON.Vector3(0, 0, 0);
            this.movementVelocity = BABYLON.Vector3.Zero();
            this.abstractMesh = null;
            this.cameraDistance = 0;
            this.forwardCamera = false;
            this.dollyDirection = BABYLON.Vector3.Zero();
            this.rotationEulers = BABYLON.Vector3.Zero();
            this.cameraPivotOffset = BABYLON.Vector3.Zero();
            this.cameraForwardVector = new BABYLON.Vector3(0, 0, 0);
            this.cameraRightVector = new BABYLON.Vector3(0, 0, 0);
            this.desiredForwardVector = new BABYLON.Vector3(0, 0, 0);
            this.desiredRightVector = new BABYLON.Vector3(0, 0, 0);
            this.scaledCamDirection = BABYLON.Vector3.Zero();
            this.scaledMaxDirection = BABYLON.Vector3.Zero();
            this.parentNodePosition = BABYLON.Vector3.Zero();
            this.maximumCameraPos = BABYLON.Vector3.Zero();
            this.raycastShape = null;
            this.raycastGroup = BABYLON.CollisionFilters.DefaultFilter;
            this.raycastMask = (BABYLON.CollisionFilters.AllFilter ^ BABYLON.CollisionFilters.CharacterFilter);
            this.avatarSkins = null;
            this.cameraNode = null;
            this.cameraPivot = null;
            this.navigationAgent = null;
            this.characterController = null;
            this.isCharacterNavigating = false;
            this.isCharacterGrounded = false;
            this.isCharacterJumpFrame = false;
            this.isCharacterJumpState = false;
            this.navigationAngularSpeed = 0;
            this.animationStateMachine = false;
            this.animationStateParams = null;
            this.showDebugColliders = false;
            this.colliderVisibility = 0;
            this.deltaTime = 0;
            this.jumpTimer = 0;
            this.playerControl = 0;
            this.playerInputX = 0;
            this.playerInputZ = 0;
            this.playerMouseX = 0;
            this.playerMouseY = 0;
            this.groundedMesh = null;
            this.groundedPoint = null;
            this.groundedAngle = 0;
            this.groundedNormal = null;
            this.verticalVelocity = 0;
            this.rootmotionSpeed = 0;
            this.smoothDeltaTime = 0;
            this.animationState = null;
            this.inputMovementVector = BABYLON.Vector3.Zero();
            this.playerLookRotation = BABYLON.Vector3.Zero();
            this.playerRotationVector = BABYLON.Vector2.Zero();
            this.playerMovementVelocity = BABYLON.Vector3.Zero();
            this.playerRotationQuaternion = BABYLON.Quaternion.Zero();
            /** Register handler that is triggered before the controller has been updated */
            this.onPreUpdateObservable = new BABYLON.Observable();
            /** Register handler that is triggered before the controller movement has been applied */
            this.onBeforeMoveObservable = new BABYLON.Observable();
            /** Register handler that is triggered after the controller has been updated */
            this.onPostUpdateObservable = new BABYLON.Observable();
            this.pickingRay = null;
            this.pickingHelper = null;
            this.pickingOrigin = null;
            this.pickingDirection = new BABYLON.Vector3(0, -1, 0);
            this.cameraRay = null;
            this.cameraHelper = null;
            this.cameraForward = new BABYLON.Vector3(0, 0, 0);
            this.cameraDirection = new BABYLON.Vector3(0, 0, 0);
        }
        getPlayerInputX() { return this.playerInputX; }
        getPlayerInputZ() { return this.playerInputZ; }
        getPlayerMouseX() { return this.playerMouseX; }
        getPlayerMouseY() { return this.playerMouseY; }
        getPlayerJumping() { return this.isCharacterJumpState; }
        getPlayerGrounded() { return this.isCharacterGrounded; }
        getGroundedMesh() { return this.groundedMesh; }
        getGroundedPoint() { return this.groundedPoint; }
        getGroundedAngle() { return this.groundedAngle; }
        getGroundedNormal() { return this.groundedNormal; }
        getCameraBoomNode() { return this.cameraNode; }
        getCameraTransform() { return this.cameraPivot; }
        getAnimationState() { return this.animationState; }
        getCharacterController() { return this.characterController; }
        awake() { this.awakePlayerController(); }
        start() { this.startPlayerController(); }
        update() { this.updatePlayerController(); }
        late() { this.latePlayerController(); }
        after() { this.afterPlayerController(); }
        destroy() { this.destroyPlayerController(); }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Controller Attachment Functions
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /** TODO */
        setPlayerControl(mode) {
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
        }
        /** TODO */
        togglePlayerControl() {
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
        }
        showAvatarSkins(show) {
            if (this.avatarSkins != null) {
                // TODO - Make Skins Visible Or Not TO Camera But Keep Shadows - ???
                this.avatarSkins.forEach((skin) => { skin.isVisible = show; });
            }
        }
        /** TODO */
        attachPlayerCamera(player) {
            if (this.cameraNode == null) {
                const playerCamera = (player <= 0 || player > 4) ? 1 : player;
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
        }
        attachAnimationController() {
            if (this.animationState == null) {
                this.animationState = this.getComponent("BABYLON.AnimationState");
                if (this.animationState == null) {
                    const animationNode = this.getChildWithScript("BABYLON.AnimationState");
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
        }
        /** TODO */
        resetPlayerRotation() {
            this.transform.rotationQuaternion.toEulerAnglesToRef(this.rotationEulers);
            this.playerRotationVector.x = this.rotationEulers.x;
            this.playerRotationVector.y = this.rotationEulers.y;
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Controller Worker Functions
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        awakePlayerController() {
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
            const boomPositionData = this.getProperty("boomPosition");
            if (boomPositionData != null)
                this.boomPosition = BABYLON.Utilities.ParseVector3(boomPositionData);
            // ..
            const sphereRadius = this.getProperty("sphereRadius", 0.5);
            this.raycastShape = BABYLON.SceneManager.CreatePhysicsSphereShape(sphereRadius);
            // ..
            this.abstractMesh = this.getAbstractMesh();
            this.showDebugColliders = BABYLON.Utilities.ShowDebugColliders();
            this.colliderVisibility = BABYLON.Utilities.ColliderVisibility();
            // Note: Get Avatar Skins First Thing
            if (this.avatarSkinTag != null && this.avatarSkinTag !== "") {
                this.avatarSkins = this.getChildrenWithTags(this.avatarSkinTag, false);
            }
            const pcontrol = this.getProperty("playerControl", this.playerControl);
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
                const testPivot = BABYLON.MeshBuilder.CreateBox("TestPivot", { width: 0.25, height: 0.25, depth: 0.5 }, this.scene);
                testPivot.parent = this.cameraPivot;
                testPivot.position.set(0, 0, 0);
                testPivot.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                testPivot.visibility = 0.5;
                testPivot.checkCollisions = false;
                testPivot.isPickable = false;
            }
            // ..
            BABYLON.SceneManager.OnKeyboardPress(this.keyboardCamera, () => { this.togglePlayerControl(); });
            BABYLON.SceneManager.OnGamepadButtonPress(this.buttonCamera, () => { this.togglePlayerControl(); });
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
                    const ellipsoidSegs = 16;
                    const capsuleSize = this.abstractMesh.ellipsoid.clone();
                    const debugName = this.transform.name + ".Debug";
                    const debugCapsule = BABYLON.MeshBuilder.CreateSphere(debugName, { segments: ellipsoidSegs, diameterX: (capsuleSize.x * 2), diameterY: (capsuleSize.y * 2), diameterZ: (capsuleSize.z * 2) }, this.scene);
                    debugCapsule.position.set(0, 0, 0);
                    debugCapsule.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    debugCapsule.setParent(this.transform);
                    debugCapsule.position.set(0, 0, 0);
                    debugCapsule.visibility = this.colliderVisibility;
                    debugCapsule.material = BABYLON.Utilities.GetColliderMaterial(this.scene);
                    debugCapsule.checkCollisions = false;
                    debugCapsule.isPickable = false;
                    this.transform._debugCollider = debugCapsule;
                }
            }
        }
        startPlayerController() {
            // TODO - Support Dynamic PlayerNumber Change - ???
            if (this.attachCamera === true) {
                this.attachPlayerCamera(this.playerNumber);
            }
        }
        updatePlayerController() {
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
            const movementSpeed = (this.inputMagnitude * this.moveSpeed * this.deltaTime * this.speedFactor);
            const locomotionSpeed = (this.rootmotionSpeed * this.speedFactor);
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
                        const strafingTurnRatio = (this.playerMovementVelocity.length() / this.moveSpeed);
                        const strafingTurnSpeed = BABYLON.Scalar.Lerp(this.highTurnSpeed, this.lowTurnSpeed, strafingTurnRatio);
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
                    const forwardTurnRatio = (this.playerMovementVelocity.length() / this.moveSpeed);
                    const forwardTurnSpeed = BABYLON.Scalar.Lerp(this.highTurnSpeed, this.lowTurnSpeed, forwardTurnRatio);
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
                const playerMovementLength = this.playerMovementVelocity.length();
                const finalMovementLength = this.movementVelocity.length();
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
        }
        updateCharacterController() {
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
        }
        updateCheckCollisions() {
            if (this.moveCharacter === true && this.abstractMesh != null) {
                const pick = this.pickCheckCollisionsRaycast();
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
                        const slopeFactor = (this.maxAngle > 0 && this.groundedAngle > 0 && this.groundedAngle < this.maxAngle) ? 0 : this.slopeForce;
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
        }
        pickCheckCollisionsRaycast(fastCheck = true) {
            if (this.abstractMesh == null)
                return null;
            if (this.rayLength <= 0)
                this.rayLength = 0.1;
            const raycastLength = (this.rayLength / this.transform.scaling.y) + 0.05;
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
            return (this.pickingRay != null) ? this.scene.pickWithRay(this.pickingRay, (mesh) => { return (mesh != this.abstractMesh && mesh.checkCollisions === true); }, fastCheck) : null;
        }
        pickCameraCollisionsRaycast(origin, direction, rayLength, fastCheck = true) {
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
            return (this.cameraRay != null) ? this.scene.pickWithRay(this.cameraRay, (mesh) => { return (mesh != this.abstractMesh && mesh.checkCollisions === true); }, fastCheck) : null;
        }
        latePlayerController() {
            if (this.enableInput === false)
                return;
            let allowRotation = this.rotateCamera;
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
                        const maxDistance = Math.abs(this.boomPosition.z);
                        const parentNode = this.cameraNode.parent;
                        this.dollyDirection.scaleToRef(maxDistance, this.scaledMaxDirection);
                        this.dollyDirection.scaleToRef(this.cameraDistance, this.scaledCamDirection);
                        BABYLON.Utilities.GetAbsolutePositionToRef(parentNode, this.parentNodePosition);
                        BABYLON.Utilities.TransformPointToRef(parentNode, this.scaledMaxDirection, this.maximumCameraPos);
                        // ..
                        let contact = false;
                        let distance = 0;
                        if (this.characterController != null) {
                            // Note: Use Bullet Physics Shape Cast
                            const raycast = BABYLON.SceneManager.PhysicsShapecastToPoint(this.scene, this.raycastShape, this.parentNodePosition, this.maximumCameraPos, this.raycastGroup, this.raycastMask);
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
                            const pick = this.pickCameraCollisionsRaycast(this.parentNodePosition, this.cameraDirection, this.maximumCameraPos.length());
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
        }
        afterPlayerController() {
            if (this.enableInput === false)
                return;
            this.rootmotionSpeed = 0;
            if (this.animationState != null && this.animationStateMachine === true) {
                this.rootmotionSpeed = this.animationState.getRootMotionSpeed();
            }
        }
        destroyPlayerController() {
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
        }
        validateAnimationStateParams() {
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
        }
    }
    PROJECT.UniversalPlayerController = UniversalPlayerController;
    /**
    * Babylon Enum Definition
    * @interface PlayerInputControl
    */
    let PlayerInputControl;
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
    class FxParticleSystem extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.m_particleEmitter = null;
            this.m_particleSystem = null;
        }
        getParticleEmitter() { return this.m_particleEmitter; }
        getParticleSystem() { return this.m_particleSystem; }
        awake() {
            const rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
            const classType = this.getProperty("classType", 0);
            const particleText = this.getProperty("base64ParticleSystem");
            const playOnAwake = this.getProperty("playOnAwake", false);
            const particleTexture = this.getProperty("particleTexture");
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
                const particleJson = window.atob(particleText);
                if (particleJson != null && particleJson !== "") {
                    const particleParsed = JSON.parse(particleJson);
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
        }
        destroy() {
            this.m_particleEmitter = null;
            if (this.m_particleSystem != null) {
                this.m_particleSystem.dispose();
                this.m_particleSystem = null;
            }
        }
    }
    PROJECT.FxParticleSystem = FxParticleSystem;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon water material system pro class (Babylon Water Material)
     * @class SkyMaterialSystem - All rights reserved (c) 2020 Mackey Kinard
     */
    class SkyMaterialSystem extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.skyfog = false;
            this.skysize = 1000;
            this.probesize = 128;
            this.reflections = false;
            this.reflectlevel = 1;
            this.skytintcolor = new BABYLON.Color3(1, 1, 1);
            this.m_skyboxMesh = null;
            this.m_skyMaterial = null;
            this.m_reflectProbe = null;
        }
        getSkyboxMesh() { return this.m_skyboxMesh; }
        getSkyMaterial() { return this.m_skyMaterial; }
        getReflectionProbe() { return this.m_reflectProbe; }
        awake() { this.awakeSkyboxMaterial(); }
        start() { }
        update() { }
        late() { }
        after() { }
        destroy() { this.destroySkyboxMaterial(); }
        awakeSkyboxMaterial() {
            this.skyfog = this.getProperty("skyfog", this.skyfog);
            this.skysize = this.getProperty("skysize", this.skysize);
            this.probesize = this.getProperty("probesize", this.probesize);
            this.reflections = this.getProperty("reflections", this.reflections);
            this.reflectlevel = this.getProperty("reflectlevel", this.reflectlevel);
            // ..
            const tintColor = this.getProperty("tintColor");
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
            const camOffsetData = this.getProperty("cameraoffset");
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
        }
        destroySkyboxMaterial() {
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
        }
        /** Set Skybox Mesh tint color. (Box Mesh Vertex Colors) */
        setSkyboxTintColor(color) {
            const colors = [];
            const numVertices = this.m_skyboxMesh.getTotalVertices();
            for (let i = 0; i < numVertices; ++i) {
                colors.push(color.r, color.g, color.b, 1.0);
            }
            this.m_skyboxMesh.setVerticesData("color", colors);
            this.m_skyboxMesh.useVertexColors = true;
        }
    }
    PROJECT.SkyMaterialSystem = SkyMaterialSystem;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon water material system pro class (Babylon Water Material)
     * @class WaterMaterialSystem - All rights reserved (c) 2020 Mackey Kinard
     */
    class WaterMaterialSystem extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.waterTag = "Water";
            this.targetSize = new BABYLON.Vector2(128, 128);
            this.renderSize = new BABYLON.Vector2(512, 512);
            this.depthFactor = 1.0;
            this.reflectSkybox = true;
            this.subDivisions = 32;
            this.heightOffset = 1.0;
            this.windDirection = new BABYLON.Vector2(0, 1);
            this.windForce = 6;
            this.waveSpeed = 1.0;
            this.waveLength = 0.4;
            this.waveHeight = 0.4;
            this.bumpHeight = 0.4;
            this.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
            this.colorBlendFactor = 0.2;
            this.waterColor2 = new BABYLON.Color3(0.1, 0.1, 0.6);
            this.colorBlendFactor2 = 0.2;
            this.disableClipPlane = false;
            this.m_waterGeometry = null;
            this.m_waterMaterial = null;
        }
        getWaterGeometry() { return this.m_waterGeometry; }
        getWaterMaterial() { return this.m_waterMaterial; }
        awake() {
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
            const wcolor1 = this.getProperty("watercolor");
            this.waterColor = BABYLON.Utilities.ParseColor3(wcolor1);
            // ..
            const wcolor2 = this.getProperty("watercolor2");
            this.waterColor2 = BABYLON.Utilities.ParseColor3(wcolor2);
            // ..
            const wdirection = this.getProperty("winddirection");
            this.windDirection = BABYLON.Utilities.ParseVector2(wdirection);
            // ..
            const itargetsize = this.getProperty("targetsize");
            if (itargetsize != null)
                this.targetSize = BABYLON.Utilities.ParseVector2(itargetsize);
            // ..        
            const irendersize = this.getProperty("rendersize");
            if (irendersize != null)
                this.renderSize = BABYLON.Utilities.ParseVector2(irendersize);
            /* Awake component function */
            let bumpTexture = null;
            const bumpTextureData = this.getProperty("bumptexture");
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
                    const skyboxMesh = BABYLON.SceneManager.GetAmbientSkybox(this.scene);
                    if (skyboxMesh != null)
                        this.m_waterMaterial.addToRenderList(skyboxMesh);
                }
                if (this.waterTag != null && this.waterTag !== "") {
                    const waterMeshes = this.scene.getMeshesByTags(this.waterTag);
                    if (waterMeshes != null && waterMeshes.length > 0) {
                        waterMeshes.forEach((mesh) => {
                            this.m_waterMaterial.addToRenderList(mesh);
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
        }
        start() { }
        update() { }
        late() { }
        after() { }
        destroy() { }
    }
    PROJECT.WaterMaterialSystem = WaterMaterialSystem;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class SimpleFollowCamera
    */
    class SimpleFollowCamera extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.smoothFollow = 0;
            this.smoothRotate = 0;
            this.matchRotation = false;
            this.followTarget = null;
            this.targetPosition = BABYLON.Vector3.Zero();
            this.targetRotation = BABYLON.Quaternion.Zero();
        }
        awake() {
            this.smoothFollow = this.getProperty("smoothFollow", this.smoothFollow);
            this.smoothRotate = this.getProperty("smoothRotate", this.smoothRotate);
            this.matchRotation = this.getProperty("matchRotation", this.matchRotation);
            const ftarget = this.getProperty("followTarget");
            if (ftarget != null) {
                this.followTarget = BABYLON.Utilities.ParseTransformByID(ftarget, this.scene);
                if (this.followTarget != null) {
                    BABYLON.Utilities.ValidateTransformQuaternion(this.followTarget);
                }
            }
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
        }
        start() {
            BABYLON.SceneManager.ConsoleLog("Starting simple follow target for: " + this.transform.name);
        }
        late() {
            if (this.followTarget != null) {
                const deltaTime = this.getDeltaSeconds();
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
        }
    }
    PROJECT.SimpleFollowCamera = SimpleFollowCamera;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class SmoothFollowTarget
    */
    class SmoothFollowTarget extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.target = null;
            this.targetHeight = 1.75;
            this.followHeight = 1.75;
            this.heightDamping = 12.0;
            this.rotationDamping = 3.0;
            this.minimumDistance = 6.0;
            this.maximumDistance = 8.0;
            this.startBehindTarget = true;
            this.followBehindTarget = true;
            this.targetPosition = BABYLON.Vector3.Zero();
            this.targetAngles = new BABYLON.Vector3(0, 0, 0);
            this.transformAngles = new BABYLON.Vector3(0, 0, 0);
            this.positionBuffer = new BABYLON.Vector3(0, 0, 0);
            this.rotationBuffer = new BABYLON.Quaternion(0, 0, 0, 1);
            this.tempRotationBuffer = new BABYLON.Vector3(0, 0, 0);
        }
        awake() {
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
            const followTarget = this.getProperty("target");
            if (followTarget != null) {
                this.target = BABYLON.Utilities.ParseTransformByID(followTarget, this.scene);
            }
        }
        start() {
            if (this.target != null) {
                if (this.startBehindTarget === true) {
                    // TODO - this.transform.position = this.target.position.clone(); - ???
                }
            }
        }
        late() {
            if (this.target != null) {
                this.targetPosition.copyFrom(this.target.position);
                if (this.followBehindTarget === true) {
                    const deltaTime = this.getDeltaSeconds();
                    BABYLON.Utilities.ToEulerToRef(this.target.rotationQuaternion, this.targetAngles);
                    BABYLON.Utilities.ToEulerToRef(this.transform.rotationQuaternion, this.transformAngles);
                    const normalizedSpeed = 1.0; // TODO - Get Target Normalized Speed
                    const wantedHeight = (this.targetPosition.y + this.followHeight);
                    const currentHeight = BABYLON.Scalar.Lerp(this.transform.position.y, wantedHeight, (this.heightDamping * deltaTime));
                    const wantedRotationAngle = this.targetAngles.y;
                    const currentRotationAngle = BABYLON.Scalar.LerpAngle(this.transformAngles.y, wantedRotationAngle, (this.rotationDamping * deltaTime));
                    const wantedTargetDistance = BABYLON.Scalar.Lerp(this.minimumDistance, this.maximumDistance, normalizedSpeed);
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
        }
        destroy() {
            this.target = null;
            this.targetAngles = null;
            this.transformAngles = null;
            this.positionBuffer = null;
            this.rotationBuffer = null;
            this.tempRotationBuffer = null;
        }
    }
    PROJECT.SmoothFollowTarget = SmoothFollowTarget;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class WaypointTargetManager
    */
    class WaypointTargetManager extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this._waypointMeshLines = null;
            this._waypointSplineCurve = null;
            this._waypointTransformNodes = null;
            this._waypointSplinePositions = null;
            this._waypointSphereMaterial = null;
            this.resolution = 1;
            this.closedLoop = true;
            this.drawLines = false;
            this.drawPoints = false;
            this.drawTraces = false;
            this.pointSize = 0.5;
            this.lineHeight = 0.25;
            this.lineColor = new BABYLON.Color3(1, 1, 1);
            this.pointColor = new BABYLON.Color3(1, 1, 1);
            this.traceColor = new BABYLON.Color3(1, 1, 1);
        }
        getSplineCurve() { return this._waypointSplineCurve; }
        getSplineCurveLength() { return (this._waypointSplineCurve != null) ? this._waypointSplineCurve.length() : 0; }
        getSplineCurvePositions() { return this._waypointSplinePositions; }
        getControlPointTransforms() { return this._waypointTransformNodes; }
        awake() {
            this.resolution = this.getProperty("resolution", this.resolution);
            this.closedLoop = this.getProperty("closedLoop", this.closedLoop);
            this.drawLines = this.getProperty("drawLines", this.drawLines);
            this.drawPoints = this.getProperty("drawPoints", this.drawPoints);
            this.drawTraces = this.getProperty("drawTraces", this.drawTraces);
            this.pointSize = this.getProperty("pointSize", this.pointSize);
            this.lineHeight = this.getProperty("lineHeight", this.lineHeight);
            // ..
            const lcolor = this.getProperty("lineColor");
            const pcolor = this.getProperty("pointColor");
            const tcolor = this.getProperty("traceColor");
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
                const controlPoints = [];
                this._waypointTransformNodes.forEach((transform) => {
                    BABYLON.Utilities.ValidateTransformQuaternion(transform);
                    // TODO - FIXME - Use Transform Point To Get World Position
                    // controlPoints.push(transform.getAbsolutePosition().clone());
                    controlPoints.push(BABYLON.Utilities.GetAbsolutePosition(transform));
                    if (this.drawPoints === true) {
                        const controlPoint = BABYLON.MeshBuilder.CreateSphere(transform.name + ".WireSphere", { segments: 24, diameter: (this.pointSize * 2) }, this.scene);
                        controlPoint.parent = transform;
                        controlPoint.position.set(0, 0, 0);
                        controlPoint.visibility = 0.25;
                        controlPoint.isVisible = true;
                        controlPoint.material = this._waypointSphereMaterial;
                    }
                });
                this._waypointSplineCurve = BABYLON.Curve3.CreateCatmullRomSpline(controlPoints, this.resolution, this.closedLoop);
                if (this._waypointSplineCurve != null)
                    this._waypointSplinePositions = this._waypointSplineCurve.getPoints();
                if (this._waypointSplinePositions != null)
                    BABYLON.SceneManager.ConsoleWarn("DEBUG: Waypoint Manager - " + this.transform.name + ": (" + this._waypointTransformNodes.length + " - " + this._waypointSplinePositions.length + " - " + this._waypointSplineCurve.length().toFixed(2) + ")");
            }
        }
        start() {
            if (this._waypointSplinePositions != null && this.drawLines === true) {
                this._waypointMeshLines = BABYLON.MeshBuilder.CreateLines((this.transform.name + ".SplineMesh"), { points: this._waypointSplinePositions }, this.scene);
                this._waypointMeshLines.parent = this.transform;
                this._waypointMeshLines.color = this.lineColor;
                this._waypointMeshLines.position.y += this.lineHeight;
            }
        }
        destroy() {
            this.lineColor = null;
            this._waypointSplineCurve = null;
            this._waypointTransformNodes = null;
            this._waypointSplinePositions = null;
            if (this._waypointMeshLines != null) {
                this._waypointMeshLines.dispose();
                this._waypointMeshLines = null;
            }
        }
    }
    PROJECT.WaypointTargetManager = WaypointTargetManager;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon Script Component
     * @class DebugInformation
     */
    class DebugInformation extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.keys = true;
            this.show = true;
            this.popup = false;
            this.views = false;
            this.xbox = false;
            this.color = BABYLON.Color3.Green();
        }
        awake() {
            this.keys = this.getProperty("enableDebugKeys", this.keys);
            this.show = this.getProperty("showDebugLabels", this.show);
            this.popup = this.getProperty("popupDebugPanel", this.popup);
            this.views = this.getProperty("togglePlayerViews", this.views);
            this.xbox = this.getProperty("allowXboxLiveSignIn", this.xbox);
            // ..
            const debugLabelColor = this.getProperty("debugOutputTextColor");
            if (debugLabelColor != null)
                this.color = BABYLON.Utilities.ParseColor3(debugLabelColor);
            // ..
            if (BABYLON.SceneManager.IsWindows())
                this.popup = false;
            BABYLON.SceneManager.LogMessage("Debug information overlay loaded");
        }
        start() {
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
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.Num1, () => {
                        PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(this.scene, 1);
                        BABYLON.SceneManager.LogMessage("1 player pressed");
                    });
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.Num2, () => {
                        PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(this.scene, 2);
                        BABYLON.SceneManager.LogMessage("2 players pressed");
                    });
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.Num3, () => {
                        PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(this.scene, 3);
                        BABYLON.SceneManager.LogMessage("3 players pressed");
                    });
                    BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.Num4, () => {
                        PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(this.scene, 4);
                        BABYLON.SceneManager.LogMessage("4 players pressed");
                    });
                }
                BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.R, () => {
                    window.location.reload();
                });
                BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.I, () => {
                    if (this.popup === true) {
                        BABYLON.SceneManager.PopupDebug(this.scene);
                    }
                    else {
                        BABYLON.SceneManager.ToggleDebug(this.scene, true, null);
                    }
                });
                BABYLON.SceneManager.OnKeyboardPress(BABYLON.UserInputKey.F, () => {
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
        }
        destroy() {
            //this.screen = null;
            //this.toggle = null;
            //this.signin = null;
            //this.reload = null;
            //this.mouse = null;
            //this.debug = null;
        }
    }
    PROJECT.DebugInformation = DebugInformation;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class TestNavigationAgent
    */
    class TestNavigationAgent extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.m_playerAgent = null;
            this.m_charController = null;
            // Note: Animation Jump Curve Support
            this.time = -1;
            this.duration = -1;
            this.jumpCurve = null;
            this.traversalTime = 0.5;
        }
        awake() {
            this.doPointerCancel(); // Note: Disable Right Click So Can Be Used For Teleport
            this.scene.onPointerObservable.add((pointerInfo) => {
                switch (pointerInfo.type) {
                    case BABYLON.PointerEventTypes.POINTERDOWN:
                        if (pointerInfo.pickInfo.hit) {
                            this.doPointerDown(pointerInfo);
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
                this.m_playerAgent.onPreUpdateObservable.add(() => { this.updateNavAgent(); });
                BABYLON.SceneManager.LogMessage("Test navigation mesh agent for: " + this.transform.name);
            }
            else
                BABYLON.SceneManager.LogMessage("Failed to locate test nav mesh agent for: " + this.transform.name);
        }
        doPointerCancel() {
            const canvas = this.scene.getEngine().getRenderingCanvas();
            canvas.oncontextmenu = function (e) { e.preventDefault(); };
        }
        doPointerDown(pointerInfo) {
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
        }
        update() {
            if (this.m_playerAgent != null) {
                // DEBUG: const agentState:number = this.m_playerAgent.getAgentState();
                // DEBUG: UTIL.PrintToScreen("Navigation State: " + agentState.toFixed() , "green");
                // DEBUG: if (agentState === 0) console.warn(">>> INVALID NAV STATE: " + this.transform.name);
            }
        }
        updateNavAgent() {
            let deltaTime = this.getDeltaSeconds();
            let normalizedTime = 0;
            if (this.duration >= 0 && this.time >= 0) {
                normalizedTime = (this.time / this.duration);
                this.time += deltaTime;
            }
            if (this.m_playerAgent != null) {
                this.m_playerAgent.heightOffset = 0; // Note: Always Reset Height Offset Here
                const teleporting = this.m_playerAgent.isTeleporting();
                const offmeshlink = this.m_playerAgent.isOnOffMeshLink();
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
                            const animationCurveValue = UTIL.SampleAnimationFloat(this.jumpCurve, normalizedTime);
                            this.m_playerAgent.heightOffset = animationCurveValue;
                        }
                    }
                }
                else {
                    if (this.m_charController != null) {
                        this.m_playerAgent.updatePosition = false; // Disable Navigation Agent Movement
                        this.m_charController.updatePosition = true; // Enable Character Controller Movement
                        // Override Character Controller Movement
                        const pos = this.m_playerAgent.getCurrentPosition().clone();
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
        }
    }
    PROJECT.TestNavigationAgent = TestNavigationAgent;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class TestRootMotion
    */
    class TestRootMotion extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.motionType = 0;
            this.updatePosition = true;
            this.updateRotation = true;
            this.moveWithCollisions = false;
            this.m_animator = null;
            this.m_character = null;
            this.m_rigidbody = null;
        }
        awake() {
            this.motionType = this.getProperty("motionType", this.motionType);
            this.updatePosition = this.getProperty("updatePosition", this.updatePosition);
            this.updateRotation = this.getProperty("updateRotation", this.updateRotation);
            this.moveWithCollisions = this.getProperty("moveWithCollisions", this.moveWithCollisions);
        }
        start() {
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
        }
        update() {
            this.move();
            this.turn();
        }
        turn() {
            if (this.m_animator != null) {
                if (this.updateRotation === true) { // Rotation
                    this.transform.addRotation(0, this.m_animator.getAngularVelocity().y, 0);
                }
            }
        }
        move() {
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
        }
    }
    PROJECT.TestRootMotion = TestRootMotion;
})(PROJECT || (PROJECT = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon metadata parser class (Internal use only)
     * @class PerlinNoiseGenerator - All rights reserved (c) 2020 Mackey Kinard
     */
    class PerlinNoiseGenerator {
        static rand_vect() {
            let theta = Math.random() * 2 * Math.PI;
            return { x: Math.cos(theta), y: Math.sin(theta) };
        }
        static dot_prod_grid(x, y, vx, vy) {
            let g_vect;
            let d_vect = { x: x - vx, y: y - vy };
            if (PerlinNoiseGenerator.gradients[[vx, vy]]) {
                g_vect = PerlinNoiseGenerator.gradients[[vx, vy]];
            }
            else {
                g_vect = PerlinNoiseGenerator.rand_vect();
                PerlinNoiseGenerator.gradients[[vx, vy]] = g_vect;
            }
            return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
        }
        static smootherstep(x) {
            return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
        }
        static interp(x, a, b) {
            return a + PerlinNoiseGenerator.smootherstep(x) * (b - a);
        }
        /** Seed perlin noise generator */
        static seed() {
            PerlinNoiseGenerator.gradients = {};
        }
        /** Generate perlin noise value from 2D coordinates. (Note: Use normalized input values) */
        static generate(x, y) {
            let xf = Math.floor(x);
            let yf = Math.floor(y);
            //interpolate
            let tl = PerlinNoiseGenerator.dot_prod_grid(x, y, xf, yf);
            let tr = PerlinNoiseGenerator.dot_prod_grid(x, y, xf + 1, yf);
            let bl = PerlinNoiseGenerator.dot_prod_grid(x, y, xf, yf + 1);
            let br = PerlinNoiseGenerator.dot_prod_grid(x, y, xf + 1, yf + 1);
            let xt = PerlinNoiseGenerator.interp(x - xf, tl, tr);
            let xb = PerlinNoiseGenerator.interp(x - xf, bl, br);
            return PerlinNoiseGenerator.interp(y - yf, xt, xb);
        }
    }
    PerlinNoiseGenerator.gradients = {};
    BABYLON.PerlinNoiseGenerator = PerlinNoiseGenerator;
})(BABYLON || (BABYLON = {}));
BABYLON.PerlinNoiseGenerator.seed();
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon windows platform pro class
     * @class WindowsPlatform - All rights reserved (c) 2020 Mackey Kinard
     */
    class WindowsPlatform {
        /** Is xbox live user signed in if platform services enabled. (WinRT) */
        static IsXboxLiveUserSignedIn(systemUser = null, player = BABYLON.PlayerNumber.One) {
            if (BABYLON.SceneManager.IsWindows()) {
                let user = (systemUser != null) ? BABYLON.WindowsPlatform.GetXboxLiveSystemUser(systemUser, player) : BABYLON.WindowsPlatform.GetXboxLiveUser(player);
                return (user != null && user.isSignedIn == true);
            }
            else {
                return false;
            }
        }
        /** Validated sign in xbox live user if platform services available. (WinRT) */
        static XboxLiveUserSignIn(player = BABYLON.PlayerNumber.One, oncomplete, onerror, onprogress) {
            if (BABYLON.SceneManager.IsWindows()) {
                BABYLON.WindowsPlatform.XboxLiveUserSilentSignIn(player, (first) => {
                    if (first.status === Microsoft.Xbox.Services.System.SignInStatus.userInteractionRequired) {
                        BABYLON.WindowsPlatform.XboxLiveUserDialogSignIn(player, (second) => {
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
        }
        /** Silent sign in xbox live user if platform services available. (WinRT) */
        static XboxLiveUserSilentSignIn(player = BABYLON.PlayerNumber.One, oncomplete, onerror, onprogress) {
            return (BABYLON.SceneManager.IsWindows()) ? BABYLON.WindowsPlatform.GetXboxLiveUser(player).signInSilentlyAsync(null).then(oncomplete, onerror, onprogress) : null;
        }
        /** Dialog sign in xbox live user if platform services available. (WinRT) */
        static XboxLiveUserDialogSignIn(player = BABYLON.PlayerNumber.One, oncomplete, onerror, onprogress) {
            return (BABYLON.SceneManager.IsWindows()) ? BABYLON.WindowsPlatform.GetXboxLiveUser(player).signInAsync(null).then(oncomplete, onerror, onprogress) : null;
        }
        /** Loads a xbox live user profile if platform services available. (WinRT) */
        static LoadXboxLiveUserProfile(player = BABYLON.PlayerNumber.One, oncomplete, onerror, onprogress) {
            return (BABYLON.SceneManager.IsWindows()) ? BABYLON.WindowsPlatform.GetXboxLiveUserContext(player).profileService.getUserProfileAsync(BABYLON.WindowsPlatform.GetXboxLiveUser(player).xboxUserId).then(oncomplete, onerror, onprogress) : null;
        }
        // ************************************** //
        // * Babylon Xbox Live Player Functions * //
        // ************************************** //
        /** Get xbox live user if platform services available. (WinRT) */
        static GetXboxLiveUser(player = BABYLON.PlayerNumber.One) {
            let user = null;
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
        }
        /** Get xbox live user if platform services available. (WinRT) */
        static GetXboxLiveSystemUser(systemUser, player = BABYLON.PlayerNumber.One) {
            let user = null;
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
        }
        /** Get xbox live user context if platform services available. (WinRT) */
        static GetXboxLiveUserContext(player = BABYLON.PlayerNumber.One) {
            let context = null;
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
        }
        /** Resets xbox live user context if platform services available. (WinRT) */
        static ResetXboxLiveUserContext(player = BABYLON.PlayerNumber.One) {
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
        }
        // *************************************** //
        // * Babylon Xbox Live Context Functions * //
        // *************************************** //
        /** Get xbox live context property if platform services available. (WinRT) */
        static GetXboxLiveContextProperty(name) {
            return (BABYLON.SceneManager.IsWindows()) ? window.BabylonToolkit.XboxLive.Plugin.getXboxLiveContextProperty(name) : null;
        }
        /** Get xbox live context property if platform services available. (WinRT) */
        static SetXboxLiveContextProperty(name, property) {
            if (BABYLON.SceneManager.IsWindows()) {
                window.BabylonToolkit.XboxLive.Plugin.setXboxLiveContextProperty(name, property);
            }
        }
        /** Resets xbox live property context bag if platform services available. (WinRT) */
        static ResetXboxLivePropertyContexts() {
            if (BABYLON.SceneManager.IsWindows()) {
                window.BabylonToolkit.XboxLive.Plugin.resetXboxLivePropertyContexts();
            }
        }
        // **************************************** //
        // * Babylon Xbox Live Sign Out Functions * //
        // **************************************** //
        /** Sets the Xbox User Sign Out Complete Handler (WinRT) */
        static SetXboxLiveSignOutHandler(handler = null) {
            if (BABYLON.SceneManager.IsWindows()) {
                window.BabylonToolkit.XboxLive.Plugin.onusersignout = handler;
            }
        }
    }
    BABYLON.WindowsPlatform = WindowsPlatform;
})(BABYLON || (BABYLON = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class CaptionManager
    */
    class CaptionManager extends BABYLON.ScriptComponent {
        awake() {
            /* Init component function */
            var DOMelement = this.getProperty("DomElement");
            var fontType = this.getProperty("fontType");
            var fontSize = this.getProperty("fontSize");
            var fontHexColor = this.getProperty("fontHexColor");
            var fontOutlineColor = this.getProperty("fontOutlineColor");
            var debugLanguageCode = this.getProperty("debugLanguageCode");
            // Enable debug language locale for testing
            if (debugLanguageCode != null && debugLanguageCode !== "") {
                BABYLON.SceneManager.SetWindowState("debugLocale", debugLanguageCode.toLowerCase());
            }
            // Make sure this element doesn't already exist
            if (!document.getElementById(DOMelement)) {
                const captionsDiv = document.createElement("div");
                captionsDiv.id = DOMelement;
                if (fontType)
                    captionsDiv.style.fontFamily = fontType;
                if (fontSize)
                    captionsDiv.style.fontSize = fontSize + "pt";
                captionsDiv.style.zIndex = "2";
                captionsDiv.style.position = "absolute";
                captionsDiv.style.bottom = "100px";
                captionsDiv.style.left = "0";
                captionsDiv.style.right = "0";
                captionsDiv.style.margin = "0 auto";
                captionsDiv.style.textAlign = "center";
                captionsDiv.style.fontWeight = "bold";
                captionsDiv.style.userSelect = "none";
                captionsDiv.style.pointerEvents = "none";
                captionsDiv.style.color = fontHexColor;
                if (fontOutlineColor) {
                    captionsDiv.style.textShadow = "0 0 1px " + fontOutlineColor + ", 0 0 1px " + fontOutlineColor + ", 0 0 1px " + fontOutlineColor + ", 0 0 1px " + fontOutlineColor;
                }
                document.body.append(captionsDiv);
            }
        }
    }
    MVRK.CaptionManager = CaptionManager;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class CaptionSystem
    */
    class CaptionSystem extends BABYLON.ScriptComponent {
        constructor(transform, scene, properties) {
            super(transform, scene, properties);
            this.captionType = 0;
            this.displayTimer = 5;
            this.domElement = null;
            this.textTracks = null;
            this.userLocale = "en";
            this.logCaptions = false;
            this.m_captionSource = null;
            this.m_captionTimer = 0;
            /** Register handler that is triggered on vtt caption cue changed */
            this.onUpdateCaptionObservable = new BABYLON.Observable();
            if (this.transform.metadata == null)
                this.transform.metadata = {};
            // ..
            // Flag WebVTT Support Required
            // ..            
            this.transform.metadata.vtt = true;
        }
        getUserLocale() { return this.userLocale; }
        getCaptionType() { return this.captionType; }
        awake() { this.awakeCaptionSystem(); }
        start() { this.startCaptionSystem(); }
        update() { this.updateCaptionSystem(); }
        destroy() { this.destroyCaptionSystem(); }
        awakeCaptionSystem() {
            this.captionType = this.getProperty("captionType", this.captionType);
            this.displayTimer = this.getProperty("displayTimer", this.displayTimer);
            this.domElement = this.getProperty("domElement", this.domElement);
            this.textTracks = this.getProperty("textTracks", this.textTracks);
            this.logCaptions = this.getProperty("logCaptions", this.logCaptions);
            this.userLocale = BABYLON.SceneManager.GetWindowState("debugLocale") || this.getLocalUserLocaleInfo() || this.userLocale;
            // HACK: Quick Fix
            if (this.userLocale === "zh")
                this.userLocale = "ch";
            else if (this.userLocale === "ja")
                this.userLocale = "jp";
        }
        startCaptionSystem() {
            if (this.captionType === 0) {
                this.m_captionSource = this.getComponent("BABYLON.WebVideoPlayer");
                if (this.m_captionSource == null)
                    BABYLON.Tools.Warn("Failed to locate web video player component for: " + this.transform.name);
            }
            else {
                this.m_captionSource = this.getComponent("BABYLON.AudioSource");
                if (this.m_captionSource == null)
                    BABYLON.Tools.Warn("Failed to locate audio source component for: " + this.transform.name);
            }
            if (this.m_captionSource != null)
                this.attachCaptionSystem();
            this.postCaptionMessage(""); // Note: Post Initial Clear Screen Message
        }
        updateCaptionSystem() {
            if (this.displayTimer > 0 && this.m_captionTimer > 0) {
                this.m_captionTimer += this.getDeltaSeconds();
                if (this.m_captionTimer >= this.displayTimer) {
                    this.postCaptionMessage(""); // Note: Post Timeout Clear Screen Message
                }
            }
        }
        destroyCaptionSystem() {
            this.textTracks = null;
            this.m_captionSource = null;
            this.m_captionElement = null;
            this.onUpdateCaptionObservable.clear();
            this.onUpdateCaptionObservable = null;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////
        // Private Worker Functions
        ///////////////////////////////////////////////////////////////////////////////////////////
        attachCaptionSystem() {
            const rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
            if (this.m_captionSource != null && this.userLocale != null && this.userLocale !== "") {
                if (this.textTracks != null && this.textTracks.length > 0) {
                    for (let index = 0; index < this.textTracks.length; index++) {
                        const textTrack = this.textTracks[index];
                        if (textTrack.trackLanguage === this.userLocale) {
                            const trackElement = document.createElement("track");
                            trackElement.src = (rootUrl + textTrack.trackAsset.filename);
                            trackElement.kind = this.formatTextTrackKind(textTrack.trackKind);
                            trackElement.label = textTrack.trackLabel;
                            trackElement.srclang = textTrack.trackLanguage;
                            trackElement.default = false;
                            trackElement.addEventListener("cuechange", (event) => {
                                const target = event.target;
                                if (target != null && target.track != null && target.track.activeCues != null && target.track.activeCues[0] != null) {
                                    const cue = target.track.activeCues[0];
                                    if (cue.text != null && cue.text !== "") {
                                        if (this.logCaptions === true)
                                            console.log(cue.text);
                                        this.postCaptionMessage(cue.text); // Note: Post Caption System Track Message
                                    }
                                }
                            });
                            // ..
                            // Attach Track Element To Source
                            // ..
                            if (this.m_captionSource instanceof BABYLON.WebVideoPlayer) {
                                const velement = this.m_captionSource.getVideoElement();
                                if (velement != null)
                                    velement.appendChild(trackElement);
                            }
                            else if (this.m_captionSource instanceof BABYLON.AudioSource) {
                                const aelement = this.m_captionSource.getAudioElement();
                                if (aelement != null)
                                    aelement.appendChild(trackElement);
                            }
                            break;
                        }
                    }
                }
            }
            // ..
            // Setup Default Caption System Locale
            // ..
            if (this.m_captionSource instanceof BABYLON.WebVideoPlayer) {
                const video = this.m_captionSource.getVideoElement();
                if (video != null) {
                    MVRK.CaptionSystem.EnableDefaultTextTrack(video, true);
                }
                else {
                    BABYLON.Tools.Warn("Null html video element for: " + this.transform.name);
                }
            }
            else if (this.m_captionSource instanceof BABYLON.AudioSource) {
                const audio = this.m_captionSource.getAudioElement();
                if (audio != null) {
                    MVRK.CaptionSystem.EnableDefaultTextTrack(audio, true);
                }
                else {
                    BABYLON.Tools.Warn("Null html audio element for: " + this.transform.name);
                }
            }
        }
        postCaptionMessage(message) {
            this.m_captionTimer = 0;
            if (message != null) {
                if (this.onUpdateCaptionObservable.hasObservers() === true) {
                    this.onUpdateCaptionObservable.notifyObservers(message);
                }
                if (this.domElement != null) {
                    if (this.m_captionElement == null)
                        this.m_captionElement = document.getElementById(this.domElement);
                    if (this.m_captionElement != null)
                        this.m_captionElement.innerHTML = message;
                }
                if (message !== "")
                    this.m_captionTimer = 0.00001; // Note: Set Very Small Timer Start Value
            }
        }
        getLocalUserLocaleInfo() {
            let result = null;
            const user = MVRK.System.GetUserInfo();
            if (user["locale"] != null) {
                result = user["locale"];
            }
            return result;
        }
        formatTextTrackKind(kind) {
            let result = "subtitles";
            switch (kind) {
                case 0:
                    result = "subtitles";
                    break;
                case 1:
                    result = "captions";
                    break;
                case 2:
                    result = "descriptions";
                    break;
                case 3:
                    result = "chapters";
                    break;
                case 4:
                    result = "metadata";
                    break;
            }
            return result;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////
        // Static Helper Functions
        ///////////////////////////////////////////////////////////////////////////////////////////
        static EnableDefaultTextTrack(source, enable) {
            if (source != null && source.textTracks != null && source.textTracks.length > 0) {
                source.textTracks[0].mode = (enable === true) ? "showing" : "disabled";
            }
        }
    }
    MVRK.CaptionSystem = CaptionSystem;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class SceneSoundSystem
    */
    class SceneSoundSystem extends BABYLON.ScriptComponent {
        static get MUSIC() { return SceneSoundSystem._MUSIC; }
        static get SFX() { return SceneSoundSystem._SFX; }
        start() {
            const musicNode = this.getChildNode("MUSIC");
            if (musicNode != null)
                MVRK.SceneSoundSystem._MUSIC = BABYLON.SceneManager.FindScriptComponent(musicNode, "MVRK.SoundManager");
            const soundNode = this.getChildNode("SFX");
            if (soundNode != null)
                MVRK.SceneSoundSystem._SFX = BABYLON.SceneManager.FindScriptComponent(soundNode, "MVRK.SoundManager");
            const defaultMusicTrack = this.getProperty("defaultMusicTrack");
            if (defaultMusicTrack != null && defaultMusicTrack !== "") {
                if (MVRK.SceneSoundSystem.MUSIC != null)
                    MVRK.SceneSoundSystem.MUSIC.playTrack(defaultMusicTrack);
            }
        }
    }
    SceneSoundSystem._MUSIC = null;
    SceneSoundSystem._SFX = null;
    MVRK.SceneSoundSystem = SceneSoundSystem;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class SoundManager
    */
    class SoundManager extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.groupName = null;
            this.cachedVolume = false;
            this.volumeProperty = "volume";
            this.m_soundMap = null;
            this.m_soundList = null;
        }
        getGroupName() { return this.groupName; }
        awake() {
            this.groupName = this.getProperty("groupName", this.transform.name); // Note: Default Transform Group Name
            this.cachedVolume = this.getProperty("cachedVolume", this.cachedVolume);
            this.volumeProperty = this.getProperty("volumeProperty", this.volumeProperty);
            this.m_soundMap = new Map();
            this.m_soundList = [];
        }
        start() {
            const audioTransforms = this.transform.getChildren(null, true);
            if (audioTransforms != null && audioTransforms.length > 0) {
                for (let index = 0; index < audioTransforms.length; index++) {
                    const audioTrackNode = audioTransforms[index];
                    const audioSource = BABYLON.SceneManager.FindScriptComponent(audioTrackNode, "BABYLON.AudioSource");
                    if (audioSource != null) {
                        if (this.cachedVolume === true) {
                            const volume = window.top.localStorage.getItem(this.volumeProperty);
                            if (volume != null && volume !== "") {
                                const volumeLevel = parseFloat(volume);
                                if (volumeLevel != null) {
                                    audioSource.setVolume(volumeLevel);
                                }
                            }
                        }
                        this.m_soundMap.set(audioTrackNode.name, audioSource);
                        this.m_soundList.push(audioSource);
                    }
                }
            }
        }
        update() { }
        destroy() {
            this.m_soundList = null;
            this.m_soundMap.clear();
            this.m_soundMap = null;
        }
        ///////////////////////////////////////////////////
        // Public Sound Manager Helpers
        //////////////////////////////////////////////////
        /**
         * Play the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         * @param offset (optional) Start the sound at a specific time in seconds
         * @param length (optional) Sound duration (in seconds)
         */
        playTrack(name, time, offset, length) {
            const audioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.play(time, offset, length) : false;
        }
        /**
         * Pause the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        pauseTrack(name) {
            const audioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.pause() : false;
        }
        /**
         * Pause the sound for all tracks in the group
         * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
         */
        pauseAllTracks() {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].pause();
                    }
                }
            }
        }
        /**
         * Stop the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        stopTrack(name, time) {
            const audioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.stop(time) : false;
        }
        /**
         * Stop the sound for all tracks in the group
         * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
         */
        stopAllTracks(time) {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].stop(time);
                    }
                }
            }
        }
        /**
         * Mute the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        muteTrack(name, time) {
            const audioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.mute(time) : false;
        }
        /**
         * Unmute the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        unmuteTrack(name, time) {
            const audioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.unmute(time) : false;
        }
        /**
         * Mutes the volume for all sound tracks in the group
         * @param time Define time for gradual change to new volume
         */
        muteAllTracks(time) {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].mute(time);
                    }
                }
            }
        }
        /**
         * Unmutes the volume for all sound tracks in the group
         * @param time Define time for gradual change to new volume
         */
        unmuteAllTracks(time) {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].unmute(time);
                    }
                }
            }
        }
        /**
         * Sets the volume for all sound tracks in the group
         * @param volume Define the new volume of the sound
         * @param time Define time for gradual change to new volume
         */
        setGroupVolume(volume, time) {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].setVolume(volume, time);
                    }
                }
            }
        }
        /**
         * Get a sound source by name
         */
        getAudioSource(name) {
            return this.m_soundMap.get(name);
        }
    }
    MVRK.SoundManager = SoundManager;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class VideoController
    */
    class VideoController extends BABYLON.ScriptComponent {
        awake() {
            /* Init component function */
        }
        start() {
            /* Start render loop function */
        }
        update() {
            /* Update render loop function */
        }
        late() {
            /* Late update render loop function */
        }
        after() {
            /* After render loop function */
        }
        destroy() {
            /* Destroy component function */
        }
    }
    MVRK.VideoController = VideoController;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class InsideNotification
    */
    class InsideNotification extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.abstractMesh = null;
        }
        awake() {
            this.abstractMesh = this.getAbstractMesh();
        }
        update() {
            if (MVRK.InsideNotification.CurrentRoom !== this.transform.name) {
                const cameraPos = this.scene.activeCamera.globalPosition;
                if (this.pointIsInside(cameraPos)) {
                    MVRK.InsideNotification.CurrentRoom = this.transform.name;
                    const JSON = '{"command":"location","param1":"' + this.transform.name + '"}';
                    BABYLON.SceneManager.PostWindowMessage(JSON, '*');
                    //SM.ConsoleLog("MVRK.InsideNotification: " + this.transform.name);
                }
            }
        }
        pointIsInside(point) {
            if (this.abstractMesh != null) {
                const boundInfo = this.abstractMesh.getBoundingInfo();
                const max = boundInfo.boundingBox.maximumWorld;
                const min = boundInfo.boundingBox.minimumWorld;
                if (point.x < min.x || point.x > max.x) {
                    return false;
                }
                if (point.y < min.y || point.y > max.y) {
                    return false;
                }
                if (point.z < min.z || point.z > max.z) {
                    return false;
                }
            }
            return true;
        }
    }
    InsideNotification.CurrentRoom = "";
    MVRK.InsideNotification = InsideNotification;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class PopupTrigger
    */
    class PopupTrigger extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.triggerType = "vod";
            this.triggerParam = "defaultParam";
            this.triggerFocus = null;
            this.abstractMesh = null;
            this.hasFocused = false;
            this.lerpDoneView = true;
            this.lerpDonePosition = true;
            this.lerpSpeed = 5;
            this.lerpIncrement = 0.02;
            // FIXME: private navObject: PROJECT.Nav = null;
            this.navContainer = null;
            /** Register handler that is triggered when the mesh has been picked */
            this.onPickTriggerObservable = new BABYLON.Observable();
            // private lerpCameraView(vecSource: BABYLON.Vector3, vecDest: BABYLON.Vector3, amount: number): void {
            //     const newVec:BABYLON.Vector3 = BABYLON.Vector3.Lerp(vecSource, vecDest, amount);
            //     if (amount < 1) {
            //         setTimeout(() => {
            //             let newAmount = amount + 0.01;
            //             this.scene.activeCamera["lockedTarget"] = newVec;
            //             this.lerpCameraView(vecSource, vecDest, newAmount)
            //         }, 100);
            //     } else {
            //         this.scene.activeCamera["lockedTarget"] = null;
            //     }
            // }
        }
        awake() {
            this.triggerParam = this.getProperty("triggerParam", this.triggerParam);
            this.triggerType = this.getProperty("triggerType", this.triggerType);
            const nodeFocusData = this.getProperty("triggerFocus");
            if (nodeFocusData != null)
                this.triggerFocus = BABYLON.Utilities.ParseTransformByID(nodeFocusData, this.scene);
            this.abstractMesh = this.getAbstractMesh();
            const JSON = '{"command":"' + this.triggerType + '","param":"' + this.triggerParam + '"}';
            this.navContainer = this.scene.getMeshByName("Nav Agent");
            // FIXME: this.navObject = BABYLON.SceneManager.FindScriptComponent(this.navContainer, "PROJECT.Nav")            
            if (this.abstractMesh != null) {
                this.abstractMesh.actionManager = new BABYLON.ActionManager(this.scene);
            }
            if (this.abstractMesh != null) {
                this.abstractMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnPickTrigger
                }, () => {
                    if (this.getComponent("PROJECT.LerpObject") == null) {
                        if (!!this.triggerFocus) {
                            ////this.navObject.deadStop();
                            //this.navObject.disable();	//FIXME
                            this.gradualFocus(this.triggerFocus);
                        }
                        if (this.onPickTriggerObservable.hasObservers() === true) {
                            this.onPickTriggerObservable.notifyObservers(this.abstractMesh);
                        }
                        BABYLON.SceneManager.PostWindowMessage(JSON, '*');
                    }
                }));
            }
        }
        sendMessage() {
            const JSON = '{"command":"' + this.triggerType + '","param":"' + this.triggerParam + '"}';
            BABYLON.SceneManager.PostWindowMessage(JSON, '*');
        }
        registerNewTrigger() {
            const JSON = '{"command":"' + this.triggerType + '","param":"' + this.triggerParam + '"}';
            if (this.abstractMesh != null) {
                this.abstractMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnPickTrigger
                }, () => {
                    if (!!this.triggerFocus) {
                        this.gradualFocus(this.triggerFocus);
                    }
                    if (this.onPickTriggerObservable.hasObservers() === true) {
                        this.onPickTriggerObservable.notifyObservers(this.abstractMesh);
                    }
                    BABYLON.SceneManager.PostWindowMessage(JSON, '*');
                }));
            }
        }
        gradualFocus(targetMesh) {
            console.log("we're gradual focusing");
            const objLerp = targetMesh;
            const camera = this.scene.activeCamera;
            camera.detachControl();
            camera.computeWorldMatrix();
            const focusDestination = objLerp.position;
            //this.navObject.canMove = false;
            var empty = new BABYLON.Mesh("empty", this.scene);
            empty.position = camera.position.clone();
            empty.rotationQuaternion = camera.absoluteRotation.clone();
            empty.movePOV(0, 0, -2);
            empty.computeWorldMatrix();
            var previousPosition = empty.absolutePosition.clone();
            // Don't update return position if we've come from another focusable object
            // if (!this.hasFocused) {
            // 	this.origTargetPosition = empty.absolutePosition.clone(); 		
            // 	empty.dispose();
            // 	this.origCameraPosition = this.scene.activeCamera.position.clone();
            // 	this.previousPosition = previousPosition;
            // }
            this.lerpDonePosition = false;
            this.lerpDoneView = false;
            this.scene.activeCamera.setTarget(previousPosition);
            //this.lerpCameraPosition(this.scene.activeCamera.position, objLerp.pivotPoint.absolutePosition, 0, true);
            this.lerpCameraView(previousPosition, objLerp.absolutePosition, 0, true);
        }
        // private gradualFocus(): void {
        //     const camera:BABYLON.Camera = this.scene.activeCamera;
        //     const empty:BABYLON.Mesh = new BABYLON.Mesh("empty", this.scene);
        //     empty.position = camera.position.clone();
        //     empty.rotation = camera["rotation"].clone();
        //     empty.movePOV(0,0,-2);
        //     const vecSource:BABYLON.Vector3 = empty.position.clone();
        //     const vecDest:BABYLON.Vector3 = this.triggerFocus.absolutePosition;
        //     //this.scene.activeCamera["lockedTarget"] = vecSource;
        //     empty.dispose();
        //     this.lerpCameraView(vecSource, vecDest, 0, true);
        // }
        lerpCameraView(vecSource, vecDest, amount, isForward) {
            var condition;
            var multiplier;
            var finalAmount;
            if (isForward) {
                condition = (amount < 1);
                multiplier = 1;
                finalAmount = 1;
            }
            else {
                condition = (amount > 0);
                multiplier = -1;
                finalAmount = 0;
            }
            if (condition) {
                const newVec = BABYLON.Vector3.Lerp(vecSource, vecDest, amount);
                setTimeout(() => {
                    this.scene.activeCamera.setTarget(newVec);
                    let newAmount = amount + multiplier * this.lerpIncrement;
                    this.lerpCameraView(vecSource, vecDest, newAmount, isForward);
                }, this.lerpSpeed);
            }
            else {
                const newVec = BABYLON.Vector3.Lerp(vecSource, vecDest, finalAmount);
                this.scene.activeCamera.setTarget(newVec);
                this.lerpDoneView = true;
                //this.navObject.enable();	// FIXME
                if (this.lerpDonePosition && this.lerpDoneView) {
                    if (isForward) {
                        ////this.lerpOnFinish();
                        //this.navObject.enable();	// FIXME
                    }
                    else {
                        this.hasFocused = false;
                        ////this.navObject.deadStop();
                        //this.navObject.enable();	// FIXME
                    }
                }
            }
        }
    }
    MVRK.PopupTrigger = PopupTrigger;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component State Class
    * @class State
    */
    class State {
        tick() { }
        ;
    }
    MVRK.State = State;
    /**
    * Babylon Stateful Script Component
    * @class StatefulScriptComponent
    */
    class StatefulScriptComponent extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this._currentState = null;
            /** Register handler that is triggered when the animation ik setup has been triggered */
            this.onStateChangeObservable = new BABYLON.Observable();
        }
        /** Gets the current script component state */
        getCurrentState() { return this._currentState; }
        /** Sets the new script component state */
        setState(newState, forced) {
            if (this._currentState === newState) {
                return false;
            }
            if (forced != null && forced == true) {
                if (this._currentState)
                    this._currentState.onExit();
                this._currentState = newState;
                newState.onEnter();
                if (this.onStateChangeObservable.hasObservers() === true) {
                    this.onStateChangeObservable.notifyObservers(this._currentState);
                }
                return true;
            }
            else if (newState.canChangeState()) {
                if (this._currentState)
                    this._currentState.onExit();
                this._currentState = newState;
                newState.onEnter();
                if (this.onStateChangeObservable.hasObservers() === true) {
                    this.onStateChangeObservable.notifyObservers(this._currentState);
                }
                return true;
            }
            else {
                newState.onStateChangeFail();
                return false;
            }
        }
    }
    MVRK.StatefulScriptComponent = StatefulScriptComponent;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class BillboardMesh
    */
    class BillboardMesh extends BABYLON.ScriptComponent {
        update() {
            /* Update render loop function */
            let absCameraPos = this.scene.activeCamera.globalPosition;
            let absTransformPos = this.transform.absolutePosition;
            let lookDirection = absCameraPos.subtract(absTransformPos).normalize().scale(-1);
            this.transform.lookAt(absTransformPos.add(lookDirection), null, null, null, BABYLON.Space.WORLD);
        }
    }
    MVRK.BillboardMesh = BillboardMesh;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class BlinkManager
    */
    class BlinkManager extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.enableBlinking = false;
            this.blinkingState = false;
            this.blinkingTimer = 0;
            this.blinkTimeout = 0.5;
            /** Register handler that is triggered when the blink change has been triggered */
            this.onBlinkUpdateObservable = new BABYLON.Observable();
        }
        awake() {
            this.blinkTimeout = this.getProperty("blinkTimeout", this.blinkTimeout);
        }
        update() {
            if (this.enableBlinking === true) {
                this.blinkingTimer += this.getDeltaSeconds();
                if (this.blinkingTimer >= this.blinkTimeout) {
                    this.blinkingTimer = 0;
                    this.blinkingState = !this.blinkingState;
                    if (this.onBlinkUpdateObservable.hasObservers() === true) {
                        this.onBlinkUpdateObservable.notifyObservers(this.blinkingState);
                    }
                }
            }
        }
        destroy() {
            this.onBlinkUpdateObservable.clear();
            this.onBlinkUpdateObservable = null;
        }
        enableBlinkMode(blinking) {
            this.blinkingTimer = 0;
            this.blinkingState = false;
            this.enableBlinking = blinking;
        }
    }
    MVRK.BlinkManager = BlinkManager;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class FloatingAnimation
    */
    class FloatingAnimation extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.floatSpeed = 1.0;
            this.floatDistance = 0.2;
            this.randomOffset = 0.1;
            this.initPosition = new BABYLON.Vector3(0, 0, 0);
            this.floatingVector = new BABYLON.Vector3(0, 0, 0);
        }
        awake() {
            this.floatSpeed = this.getProperty("floatSpeed", this.floatSpeed);
            this.floatDistance = this.getProperty("floatDistance", this.floatDistance);
            this.randomOffset = BABYLON.Scalar.RandomRange(-Math.PI, Math.PI);
            this.initPosition.copyFrom(this.transform.position);
        }
        update() {
            const time = this.getGameTime();
            this.floatingVector.set(0, Math.sin((time + this.randomOffset) * this.floatSpeed) * this.floatDistance, 0);
            this.floatingVector.addToRef(this.initPosition, this.transform.position);
        }
        destroy() {
            this.initPosition = null;
            this.floatingVector = null;
        }
    }
    MVRK.FloatingAnimation = FloatingAnimation;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class RotateTransform
    */
    class RotateTransform extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.rotateSpeedX = 0.0;
            this.rotateSpeedY = 0.0;
            this.rotateSpeedZ = 0.0;
            this.m_rotationEulers = new BABYLON.Vector3(0, 0, 0);
        }
        awake() {
            this.rotateSpeedX = this.getProperty("rotateSpeedX", this.rotateSpeedX);
            this.rotateSpeedY = this.getProperty("rotateSpeedY", this.rotateSpeedY);
            this.rotateSpeedZ = this.getProperty("rotateSpeedZ", this.rotateSpeedZ);
        }
        update() {
            const deltaTime = this.getDeltaSeconds();
            this.transform.rotationQuaternion.toEulerAnglesToRef(this.m_rotationEulers);
            if (this.rotateSpeedX !== 0)
                this.m_rotationEulers.x += (this.rotateSpeedX * deltaTime);
            if (this.rotateSpeedY !== 0)
                this.m_rotationEulers.y += (this.rotateSpeedY * deltaTime);
            if (this.rotateSpeedZ !== 0)
                this.m_rotationEulers.z += (this.rotateSpeedZ * deltaTime);
            BABYLON.Quaternion.FromEulerVectorToRef(this.m_rotationEulers, this.transform.rotationQuaternion);
        }
    }
    MVRK.RotateTransform = RotateTransform;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class RuntimeTexture
    */
    class RuntimeTexture extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.m_dynamicTexture = null;
            this.m_dynamicMaterial = null;
        }
        awake() {
            const textureUrl = this.getProperty("textureUrl");
            const invertAxis = this.getProperty("invertAxis", false);
            const genMipmaps = this.getProperty("genMipmaps", false);
            const materialIndex = this.getProperty("materialIndex", 0);
            const abstractMesh = this.getAbstractMesh();
            if (abstractMesh != null) {
                if (abstractMesh.material instanceof BABYLON.MultiMaterial) {
                    const mmat1 = abstractMesh.material.clone(abstractMesh.material.name + "." + abstractMesh.name);
                    this.m_dynamicMaterial = mmat1.subMaterials[materialIndex].clone(mmat1.subMaterials[materialIndex].name + "_" + abstractMesh.name);
                    mmat1.subMaterials[materialIndex] = this.m_dynamicMaterial;
                    abstractMesh.material = mmat1;
                }
                else {
                    this.m_dynamicMaterial = abstractMesh.material.clone(abstractMesh.material.name + "." + abstractMesh.name);
                    abstractMesh.material = this.m_dynamicMaterial;
                }
                this.m_dynamicMaterial.unfreeze();
            }
            if (textureUrl != null && textureUrl !== "")
                this.setTextureUrl(textureUrl, invertAxis, genMipmaps);
        }
        destroy() {
            if (this.m_dynamicTexture != null) {
                this.m_dynamicTexture.dispose();
                this.m_dynamicTexture = null;
            }
            if (this.m_dynamicMaterial != null) {
                this.m_dynamicMaterial.dispose();
                this.m_dynamicMaterial = null;
            }
        }
        setTextureUrl(url, invertY = false, createMipmaps = false) {
            if (this.m_dynamicTexture != null) {
                this.m_dynamicTexture.dispose();
                this.m_dynamicTexture = null;
            }
            this.m_dynamicTexture = new BABYLON.Texture(url, this.scene, !createMipmaps, invertY);
            if (this.m_dynamicMaterial != null) {
                this.m_dynamicTexture.onLoadObservable.addOnce(() => {
                    if (this.m_dynamicMaterial instanceof BABYLON.PBRMaterial) {
                        this.m_dynamicMaterial.albedoTexture = this.m_dynamicTexture;
                    }
                    else if (this.m_dynamicMaterial instanceof BABYLON.StandardMaterial) {
                        this.m_dynamicMaterial.diffuseTexture = this.m_dynamicTexture;
                    }
                });
            }
        }
    }
    MVRK.RuntimeTexture = RuntimeTexture;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
    * Babylon Script Component
    * @class SpriteAnimation
    */
    class SpriteAnimation extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.gridCols = 1;
            this.gridRows = 1;
            this.startRow = 1;
            this.bottomUp = false;
            this.timeInSeconds = 1;
            this.colWidth = 0;
            this.rowHeight = 0;
            this.animTimer = 0;
            this.tileIndex = 0;
            this.tileReset = 0;
            this.baseTexture = null;
        }
        awake() {
            this.gridCols = this.getProperty("gridCols", this.gridCols);
            this.gridRows = this.getProperty("gridRows", this.gridRows);
            this.startRow = this.getProperty("startRow", this.startRow);
            this.bottomUp = this.getProperty("bottomUp", this.bottomUp);
            this.timeInSeconds = this.getProperty("timeInSeconds", this.timeInSeconds);
            // ..
            this.colWidth = (1 / this.gridCols);
            this.rowHeight = (1 / this.gridRows);
            // ..
            // Set Max Tile Reset Count
            // ..
            this.tileIndex = 0;
            this.tileReset = 0;
            const totalTiles = (this.gridCols * this.gridRows);
            const maxTileCount = this.getProperty("maxTileCount", 0);
            if (maxTileCount > 0 && maxTileCount < totalTiles) {
                this.tileReset = maxTileCount;
            }
            // ..
            // Create Mesh Material Clone
            // ..
            const mesh = this.getAbstractMesh();
            if (mesh != null && mesh.material != null) {
                if (mesh.material instanceof BABYLON.PBRMaterial) {
                    const pbrMaterial = mesh.material.clone(mesh.name + "." + mesh.material.name);
                    this.baseTexture = pbrMaterial.albedoTexture;
                    mesh.material = pbrMaterial;
                }
                else if (mesh.material instanceof BABYLON.StandardMaterial) {
                    const stdMaterial = mesh.material.clone(mesh.name + "." + mesh.material.name);
                    this.baseTexture = stdMaterial.diffuseTexture;
                    mesh.material = stdMaterial;
                }
            }
            // ..
            // Setup Texture Rows And Columns
            // ..
            if (this.baseTexture != null) {
                this.baseTexture.uScale = this.colWidth;
                this.baseTexture.vScale = this.rowHeight;
                // ..
                // Offset Starting Row And Column
                // ..
                const startRowOffset = BABYLON.Scalar.Clamp(((this.startRow - 1) * this.rowHeight));
                this.baseTexture.uOffset = 0;
                this.baseTexture.vOffset = (this.bottomUp === true) ? startRowOffset : ((1 - startRowOffset) - this.rowHeight);
                if (this.startRow > 1) {
                    this.tileIndex = ((this.startRow - 1) * this.gridCols);
                }
            }
        }
        start() {
            this.animTimer = 0;
        }
        reset() {
            if (this.baseTexture != null) {
                this.baseTexture.uOffset = 0;
                this.baseTexture.vOffset = (this.bottomUp === true) ? 0 : (1 - this.rowHeight);
            }
        }
        update() {
            if (this.timeInSeconds > 0) {
                this.animTimer += this.getDeltaSeconds();
                if (this.animTimer >= this.timeInSeconds) {
                    this.animTimer = 0;
                    this.animate();
                }
            }
        }
        animate() {
            // ..
            // Animate Tile Offset
            // ..
            if (this.baseTexture != null) {
                if (this.baseTexture.uOffset >= (1 - this.colWidth)) {
                    this.baseTexture.uOffset = 0;
                    /////////////////////////////////////////////////////////////////
                    // Update Row After Whole Column
                    /////////////////////////////////////////////////////////////////
                    if (this.bottomUp === true) {
                        if (this.baseTexture.vOffset >= (1 - this.rowHeight)) {
                            this.baseTexture.vOffset = 0;
                        }
                        else {
                            this.baseTexture.vOffset += this.rowHeight;
                        }
                    }
                    else {
                        if (this.baseTexture.vOffset <= 0) {
                            this.baseTexture.vOffset = (1 - this.rowHeight);
                        }
                        else {
                            this.baseTexture.vOffset -= this.rowHeight;
                        }
                    }
                    if (this.baseTexture.vOffset < 0 || this.baseTexture.vOffset > 0) {
                        this.baseTexture.vOffset = BABYLON.Scalar.Clamp(this.baseTexture.vOffset);
                    }
                    /////////////////////////////////////////////////////////////////
                }
                else {
                    this.baseTexture.uOffset += this.colWidth;
                }
                if (this.baseTexture.uOffset < 0 || this.baseTexture.uOffset > 0) {
                    this.baseTexture.uOffset = BABYLON.Scalar.Clamp(this.baseTexture.uOffset);
                }
            }
            // ..
            // Validate Max Tile Reset
            // ..            
            if (this.tileReset > 0) {
                this.tileIndex++;
                if (this.tileIndex >= this.tileReset) {
                    this.tileIndex = 0;
                    this.reset();
                }
            }
        }
        destroy() {
            this.baseTexture = null;
        }
    }
    MVRK.SpriteAnimation = SpriteAnimation;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
     * Babylon scene loader helper class
     * @class SceneLoader
     */
    class SceneLoader {
        static SwitchScene(sceneFile, blanketColor = "black", onFadeComplete = null) {
            BABYLON.SceneManager.RegisterOnShowSceneLoader((show) => { });
            MVRK.Teleporter.OnFadeToBlack = () => {
                if (onFadeComplete != null)
                    onFadeComplete();
                BABYLON.SceneManager.ShowParentLoader(true);
                BABYLON.SceneManager.LoadSceneFile(sceneFile);
            };
            MVRK.Teleporter.FadeToBlack(blanketColor);
        }
        static LoadSceneComplete() {
            BABYLON.SceneManager.ShowParentLoader(false);
            MVRK.Teleporter.RestoreView();
        }
    }
    MVRK.SceneLoader = SceneLoader;
})(MVRK || (MVRK = {}));
/**
 * Wireup Scene Manager On Load Complete
 */
BABYLON.SceneManager.OnLoadCompleteObservable.add((engine) => { MVRK.SceneLoader.LoadSceneComplete(); });
var MVRK;
(function (MVRK) {
    /**
     * Babylon scene teleporter helper class
     * @class Teleporter
     */
    class Teleporter {
        // ..
        // Fade To Black
        // ..
        static FadeToBlack(blanketColor = "black") {
            let blanket = window.top.document.getElementById("blanket");
            if (blanket == null) {
                blanket = window.top.document.createElement("div");
                blanket.id = "blanket";
                blanket.style.position = "absolute";
                blanket.style.minHeight = "100%";
                blanket.style.width = "100%";
                blanket.style.height = "100%";
                blanket.style.padding = "0px";
                blanket.style.margin = "0px";
                blanket.style.top = "0";
                blanket.style.left = "0";
                blanket.style.display = "none";
                blanket.style.outline = "none";
                blanket.style.overflow = "hidden";
                blanket.style.opacity = "0";
                blanket.style.zIndex = "-1";
                window.top.document.body.appendChild(blanket);
            }
            if (blanket != null) {
                blanket.style.backgroundColor = blanketColor || "black";
                blanket.style.zIndex = "2001";
                blanket.style.display = "block";
                blanket.style.opacity = "0";
                MVRK.Teleporter.FadeToBlanketView(blanket, MVRK.Teleporter.TeleFade.FadeSpeed);
            }
        }
        // ..
        // Restore Scene View
        // ..
        static RestoreView() {
            let blanket = window.top.document.getElementById("blanket");
            if (blanket != null)
                MVRK.Teleporter.RestoreToSceneView(blanket, MVRK.Teleporter.TeleFade.RestoreSpeed);
        }
        // ..
        // Animation View Helpers
        // ..
        static FadeToBlanketView(blanket, speed) {
            if (blanket != null) {
                const start = parseFloat(blanket.style.opacity);
                const scene = MVRK.Teleporter.TeleFade.BabylonScene || BABYLON.Engine.LastCreatedScene;
                SM.StartTweenAnimation(scene, "FadeToBlackTween", blanket.style, "opacity", start, 1, speed, 30, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => {
                    blanket.style.opacity = "1";
                    if (MVRK.Teleporter.OnFadeToBlack != null) {
                        MVRK.Teleporter.OnFadeToBlack();
                    }
                });
            }
        }
        static RestoreToSceneView(blanket, speed) {
            if (blanket != null) {
                const start = parseFloat(blanket.style.opacity);
                const scene = MVRK.Teleporter.TeleFade.BabylonScene || BABYLON.Engine.LastCreatedScene;
                SM.StartTweenAnimation(scene, "FadeToBlackTween", blanket.style, "opacity", start, 0, speed, 30, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, null, () => {
                    blanket.style.zIndex = "-1";
                    blanket.style.display = "none";
                    blanket.style.opacity = "0";
                    if (MVRK.Teleporter.OnRestoreView != null) {
                        MVRK.Teleporter.OnRestoreView();
                    }
                });
            }
        }
    }
    Teleporter.TeleFade = { FadeSpeed: 1.0, RestoreSpeed: 1.0, BabylonScene: null };
    Teleporter.OnFadeToBlack = null;
    Teleporter.OnRestoreView = null;
    MVRK.Teleporter = Teleporter;
})(MVRK || (MVRK = {}));
var MVRK;
(function (MVRK) {
    /**
     * Babylon system utilities helper class
     * @class System
     */
    class System {
        static GetUserInfo() {
            let result = null;
            if (window.top["getMVRKUser"]) {
                result = window.top["getMVRKUser"]();
            }
            if (result == null) {
                result = { id: BABYLON.Utilities.CreateGuid(), firstName: "Default", lastName: "Player" };
            }
            return result;
        }
        static GetGameLobbyInfo() {
            let result = null;
            if (window.top["getGameLobbyInfo"]) {
                result = window.top["getGameLobbyInfo"]();
            }
            if (result == null) {
                result = { id: "12345" };
            }
            return result;
        }
    }
    MVRK.System = System;
})(MVRK || (MVRK = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class DemoRaceController
    */
    class DemoRaceController extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.countdownState = 0;
            this.countdownImage1 = null;
            this.countdownImage2 = null;
            this.countdownImage3 = null;
            this.countdownImageGo = null;
            this.countdownImagesLoaded = false;
            this.countdownSound1 = null;
            this.countdownSound2 = null;
            this.countdownSound3 = null;
            this.countdownSoundGo = null;
            this.countdownSoundsLoaded = false;
            this.mustangOneVehicle = null;
            this.mustangTwoVehicle = null;
            this.mustangThreeVehicle = null;
            this.mustangFourVehicle = null;
            this.startPositionHeight = 0;
            this.startCountdownVolume = 0.5;
        }
        awake() { this.awakeDemoController(); }
        start() { this.initDemoController(); }
        update() { this.updateDemoController(); }
        awakeDemoController() {
            this.startPositionHeight = this.getProperty("startHeight", this.startPositionHeight);
            this.startCountdownVolume = this.getProperty("startVolume", this.startCountdownVolume);
        }
        async initDemoController() {
            // TODO - Get Managed Advanced Dynamic Texture UI
            const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
            const playerCount = BABYLON.Scalar.Clamp(parseInt(BABYLON.Utilities.GetUrlParameter("players") || "0"), 0, 4);
            if (playerCount >= 2 && PROJECT.UniversalCameraSystem.IsMultiPlayerView()) {
                PROJECT.UniversalCameraSystem.SetMultiPlayerViewLayout(this.scene, playerCount);
            }
            // ..
            // Setup start positions
            // ..
            let startPosition1 = BABYLON.SceneManager.GetAbstractMesh(this.scene, "StartPosition1");
            if (startPosition1 == null)
                startPosition1 = BABYLON.Mesh.CreateBox("StartPosition1", 1, this.scene);
            BABYLON.Utilities.ValidateTransformQuaternion(startPosition1);
            startPosition1.isVisible = false;
            let startPosition2 = BABYLON.SceneManager.GetAbstractMesh(this.scene, "StartPosition2");
            if (startPosition2 == null)
                startPosition2 = BABYLON.Mesh.CreateBox("StartPosition2", 1, this.scene);
            BABYLON.Utilities.ValidateTransformQuaternion(startPosition2);
            startPosition2.isVisible = false;
            let startPosition3 = BABYLON.SceneManager.GetAbstractMesh(this.scene, "StartPosition3");
            if (startPosition3 == null)
                startPosition3 = BABYLON.Mesh.CreateBox("StartPosition3", 1, this.scene);
            BABYLON.Utilities.ValidateTransformQuaternion(startPosition3);
            startPosition3.isVisible = false;
            let startPosition4 = BABYLON.SceneManager.GetAbstractMesh(this.scene, "StartPosition4");
            if (startPosition4 == null)
                startPosition4 = BABYLON.Mesh.CreateBox("StartPosition4", 1, this.scene);
            BABYLON.Utilities.ValidateTransformQuaternion(startPosition4);
            startPosition4.isVisible = false;
            let startPosition5 = BABYLON.SceneManager.GetAbstractMesh(this.scene, "StartPosition5");
            if (startPosition5 == null)
                startPosition5 = BABYLON.Mesh.CreateBox("StartPosition5", 1, this.scene);
            BABYLON.Utilities.ValidateTransformQuaternion(startPosition5);
            startPosition5.isVisible = false;
            let startPosition6 = BABYLON.SceneManager.GetAbstractMesh(this.scene, "StartPosition6");
            if (startPosition6 == null)
                startPosition6 = BABYLON.Mesh.CreateBox("StartPosition6", 1, this.scene);
            BABYLON.Utilities.ValidateTransformQuaternion(startPosition6);
            startPosition6.isVisible = false;
            let startPosition7 = BABYLON.SceneManager.GetAbstractMesh(this.scene, "StartPosition7");
            if (startPosition7 == null)
                startPosition7 = BABYLON.Mesh.CreateBox("StartPosition7", 1, this.scene);
            BABYLON.Utilities.ValidateTransformQuaternion(startPosition7);
            startPosition7.isVisible = false;
            let startPosition8 = BABYLON.SceneManager.GetAbstractMesh(this.scene, "StartPosition8");
            if (startPosition8 == null)
                startPosition8 = BABYLON.Mesh.CreateBox("StartPosition8", 1, this.scene);
            BABYLON.Utilities.ValidateTransformQuaternion(startPosition8);
            startPosition8.isVisible = false;
            const rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
            const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(rootUrl, "MustangPrefab.gltf", this.scene);
            // ..
            // Setup first mustang
            // ..
            const mustangOnePlayer = (playerCount >= 4) ? 4 : 0;
            const mustangOneCamera = (playerCount >= 4);
            this.mustangOneVehicle = PROJECT.DemoRaceController.CreateMustangVehicle(this.scene, container, "Mustang", "MustangOne", mustangOnePlayer, startPosition1, this.startPositionHeight, true, mustangOneCamera, 160, 1.5, 10, BABYLON.Color3.White());
            // ..
            // Setup second mustang
            // ..
            const mustangTwoPlayer = (playerCount >= 3) ? 3 : 0;
            const mustangTwoCamera = (playerCount >= 3);
            this.mustangTwoVehicle = PROJECT.DemoRaceController.CreateMustangVehicle(this.scene, container, "Mustang", "MustangTwo", mustangTwoPlayer, startPosition2, this.startPositionHeight, true, mustangTwoCamera, 160, 1.4, 6, BABYLON.Color3.Blue());
            // ..
            // Setup third mustang
            // ..
            const mustangThreePlayer = (playerCount >= 2) ? 2 : 0;
            const mustangThreeCamera = (playerCount >= 2);
            this.mustangThreeVehicle = PROJECT.DemoRaceController.CreateMustangVehicle(this.scene, container, "Mustang", "MustangThree", mustangThreePlayer, startPosition3, this.startPositionHeight, true, mustangThreeCamera, 160, 1.6, 8, BABYLON.Color3.Black());
            // ..
            // Setup fourth mustang
            // ..
            const mustangFourPlayer = (playerCount >= 1) ? 1 : 0;
            const mustangFourCamera = true; // Note Always Attach Player One Camera View
            this.mustangFourVehicle = PROJECT.DemoRaceController.CreateMustangVehicle(this.scene, container, "Mustang", "MustangFour", mustangFourPlayer, startPosition4, this.startPositionHeight, true, mustangFourCamera, 161, 1.66, 10, BABYLON.Color3.Red());
            // ..
            // Setup countdown timer
            // ..
            const countdownImages = this.getProperty("countdownImages");
            if (countdownImages != null && countdownImages.length > 0) {
                let image = countdownImages[0];
                this.countdownImage1 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage1.isVisible = false;
                this.countdownImage1.width = "50%";
                this.countdownImage1.height = "50%";
                advancedTexture.addControl(this.countdownImage1);
                // ..
                image = countdownImages[1];
                this.countdownImage2 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage2.isVisible = false;
                this.countdownImage2.width = "50%";
                this.countdownImage2.height = "50%";
                advancedTexture.addControl(this.countdownImage2);
                // ..
                image = countdownImages[2];
                this.countdownImage3 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage3.isVisible = false;
                this.countdownImage3.width = "50%";
                this.countdownImage3.height = "50%";
                advancedTexture.addControl(this.countdownImage3);
                // ..
                image = countdownImages[3];
                this.countdownImageGo = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImageGo.isVisible = false;
                this.countdownImageGo.width = "50%";
                this.countdownImageGo.height = "50%";
                advancedTexture.addControl(this.countdownImageGo);
            }
            else {
                BABYLON.SceneManager.ShowPageErrorMessage("No countdown images specified");
            }
            const countdownSounds = this.getProperty("countdownSounds");
            if (countdownSounds != null && countdownSounds.length > 0) {
                let sound = countdownSounds[0];
                this.countdownSound1 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound1.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[1];
                this.countdownSound2 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound2.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[2];
                this.countdownSound3 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound3.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[3];
                this.countdownSoundGo = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSoundGo.setVolume(this.startCountdownVolume); });
            }
            else {
                BABYLON.SceneManager.ShowPageErrorMessage("No countdown sounds specified");
            }
        }
        updateDemoController() {
            if (this.countdownImagesLoaded === false) {
                if (this.countdownImage1 != null && this.countdownImage2 != null && this.countdownImage3 != null && this.countdownImageGo != null) {
                    this.countdownImagesLoaded = (this.countdownImage1.isLoaded && this.countdownImage2.isLoaded && this.countdownImage3.isLoaded && this.countdownImageGo.isLoaded);
                }
            }
            if (this.countdownSoundsLoaded === false) {
                if (this.countdownSound1 != null && this.countdownSound2 != null && this.countdownSound3 != null && this.countdownSoundGo != null) {
                    this.countdownSoundsLoaded = (this.countdownSound1.isReady() && this.countdownSound2.isReady() && this.countdownSound3.isReady() && this.countdownSoundGo.isReady());
                }
            }
            if (this.countdownState === 0) {
                if (this.countdownImagesLoaded === true && this.countdownSoundsLoaded === true) {
                    // BABYLON.SceneManager.HideSceneLoader(); - ???
                    this.countdownState = 1;
                    this.processNextCountdown(1000);
                }
            }
        }
        updateNextCountdown() {
            this.hideCountdownItems();
            switch (this.countdownState) {
                case 1: {
                    this.countdownState = 2;
                    this.countdownImage3.isVisible = true;
                    this.countdownSound3.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 2: {
                    this.countdownState = 3;
                    this.countdownImage2.isVisible = true;
                    this.countdownSound2.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 3: {
                    this.countdownState = 4;
                    this.countdownImage1.isVisible = true;
                    this.countdownSound1.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 4: {
                    this.countdownState = 5;
                    this.countdownImageGo.isVisible = true;
                    this.countdownSoundGo.play();
                    this.processNextCountdown(500);
                    break;
                }
                default: {
                    this.startDemoController();
                    break;
                }
            }
        }
        processNextCountdown(milliseconds) {
            BABYLON.SceneManager.SetTimeout(milliseconds, () => {
                this.updateNextCountdown();
            });
        }
        hideCountdownItems() {
            if (this.countdownImage1.isVisible)
                this.countdownImage1.isVisible = false;
            if (this.countdownImage2.isVisible)
                this.countdownImage2.isVisible = false;
            if (this.countdownImage3.isVisible)
                this.countdownImage3.isVisible = false;
            if (this.countdownImageGo.isVisible)
                this.countdownImageGo.isVisible = false;
        }
        killCountdownItems() {
            if (this.countdownImage1 != null) {
                this.countdownImage1.dispose();
                this.countdownImage1 = null;
            }
            if (this.countdownImage2 != null) {
                this.countdownImage2.dispose();
                this.countdownImage2 = null;
            }
            if (this.countdownImage3 != null) {
                this.countdownImage3.dispose();
                this.countdownImage3 = null;
            }
            if (this.countdownImageGo != null) {
                this.countdownImageGo.dispose();
                this.countdownImageGo = null;
            }
            // ..
            if (this.countdownSound1 != null) {
                this.countdownSound1.dispose();
                this.countdownSound1 = null;
            }
            if (this.countdownSound2 != null) {
                this.countdownSound2.dispose();
                this.countdownSound2 = null;
            }
            if (this.countdownSound3 != null) {
                this.countdownSound3.dispose();
                this.countdownSound3 = null;
            }
            if (this.countdownSoundGo != null) {
                this.countdownSoundGo.dispose();
                this.countdownSoundGo = null;
            }
        }
        startDemoController() {
            this.hideCountdownItems();
            this.killCountdownItems();
            if (this.mustangOneVehicle != null)
                PROJECT.DemoRaceController.EnableMustangVehicle(this.mustangOneVehicle, true);
            if (this.mustangTwoVehicle != null)
                PROJECT.DemoRaceController.EnableMustangVehicle(this.mustangTwoVehicle, true);
            if (this.mustangThreeVehicle != null)
                PROJECT.DemoRaceController.EnableMustangVehicle(this.mustangThreeVehicle, true);
            if (this.mustangFourVehicle != null)
                PROJECT.DemoRaceController.EnableMustangVehicle(this.mustangFourVehicle, true);
        }
        //////////////////////////////////////////////////
        // Static Helper Functions                      //
        //////////////////////////////////////////////////
        static CreateMustangVehicle(scene, container, prefab, name, player, startPosition, heightOffset, enableInput, attachCamera, topSpeed, powerRatio, skillLevel, bodyColor, wheelColor = null, wheelType = 0, decalIndex = 0) {
            const mustangVehicle = BABYLON.SceneManager.InstantiatePrefab(container, prefab, name);
            if (mustangVehicle != null) {
                mustangVehicle.rotationQuaternion = startPosition.rotationQuaternion.clone();
                mustangVehicle.position = startPosition.position.clone();
                mustangVehicle.position.y += heightOffset;
                const autoBodyShop = BABYLON.SceneManager.FindScriptComponent(mustangVehicle, "PROJECT.AutoBodyGarage");
                const inputController = BABYLON.SceneManager.FindScriptComponent(mustangVehicle, "PROJECT.VehicleInputController");
                const cameraManager = BABYLON.SceneManager.FindScriptComponent(mustangVehicle, "PROJECT.VehicleCameraManager");
                const carController = BABYLON.SceneManager.FindScriptComponent(mustangVehicle, "PROJECT.StandardCarController");
                if (autoBodyShop != null)
                    autoBodyShop.setupVehicleMaterials(bodyColor, wheelColor, wheelType, decalIndex);
                if (carController != null) {
                    carController.lowSpeedAngle = (player === 0) ? 20 : 10;
                    carController.highSpeedAngle = (player === 0) ? 10 : 1;
                    carController.topEngineSpeed = topSpeed;
                    carController.powerCoefficient = powerRatio;
                }
                if (inputController != null) {
                    inputController.enableInput = false;
                    inputController.playerNumber = player;
                    inputController.driverSkillLevel = skillLevel;
                }
                if (cameraManager != null && attachCamera === true) {
                    cameraManager.enableCamera = true;
                    cameraManager.attachPlayerCamera(player);
                }
            }
            else {
                BABYLON.SceneManager.LogWarning("===> Failed to instantiate mustang prefab: " + name);
            }
            return mustangVehicle;
        }
        static EnableMustangVehicle(mustangVehicle, enableInput) {
            const inputController = BABYLON.SceneManager.FindScriptComponent(mustangVehicle, "PROJECT.VehicleInputController");
            if (inputController != null)
                inputController.enableInput = enableInput;
        }
    }
    PROJECT.DemoRaceController = DemoRaceController;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class F1SceneController
    */
    class F1SceneController extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.countdownState = 0;
            this.countdownImage1 = null;
            this.countdownImage2 = null;
            this.countdownImage3 = null;
            this.countdownImageGo = null;
            this.countdownImagesLoaded = false;
            this.countdownSound1 = null;
            this.countdownSound2 = null;
            this.countdownSound3 = null;
            this.countdownSoundGo = null;
            this.countdownSoundsLoaded = false;
            this.raceCar1 = "F1_PurpleVariant";
            this.raceCar2 = "F1_BlueVariant";
            this.raceCar3 = "F1_RedVariant";
            this.raceCar4 = "F1_GreenVariant";
            //private updateTimeStep:boolean = true;
            this.raceOneVehicle = null;
            this.raceTwoVehicle = null;
            this.raceThreeVehicle = null;
            this.raceFourVehicle = null;
            this.startCountdownVolume = 0.25;
        }
        awake() { this.awakeRaceController(); }
        ready() { this.initRaceController(); }
        update() { this.updateRaceController(); }
        awakeRaceController() {
            this.raceCar1 = this.getProperty("raceCar1", this.raceCar1);
            this.raceCar2 = this.getProperty("raceCar2", this.raceCar2);
            this.raceCar3 = this.getProperty("raceCar3", this.raceCar3);
            this.raceCar4 = this.getProperty("raceCar4", this.raceCar4);
            //this.updateTimeStep = this.getProperty("updateTimeStep", this.updateTimeStep);
            this.startCountdownVolume = this.getProperty("startVolume", this.startCountdownVolume);
            console.warn("F1SceneController: Build 03-29-2021-A2");
        }
        initRaceController() {
            /* WORK - IN - PROGRESS
            if (this.updateTimeStep === true) {
                const defaultStep:number = 1 / 60;
                const animRatio:number = SM.GetAnimationRatio(this.scene);
                const timeStep:number = defaultStep * animRatio;
                this.scene.getPhysicsEngine().setTimeStep(timeStep);
                console.log("System Animation Ratio: " + animRatio);
                console.log("Using Fixed Time Step: " + timeStep);
            }*/
            const rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
            const countdownImages = this.getProperty("countdownImages");
            const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
            this.raceOneVehicle = BABYLON.SceneManager.GetTransformNode(this.scene, this.raceCar1);
            this.raceTwoVehicle = BABYLON.SceneManager.GetTransformNode(this.scene, this.raceCar2);
            this.raceThreeVehicle = BABYLON.SceneManager.GetTransformNode(this.scene, this.raceCar3);
            this.raceFourVehicle = BABYLON.SceneManager.GetTransformNode(this.scene, this.raceCar4);
            if (countdownImages != null && countdownImages.length > 0) {
                let image = countdownImages[0];
                this.countdownImage1 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage1.isVisible = false;
                this.countdownImage1.width = "50%";
                this.countdownImage1.height = "50%";
                advancedTexture.addControl(this.countdownImage1);
                // ..
                image = countdownImages[1];
                this.countdownImage2 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage2.isVisible = false;
                this.countdownImage2.width = "50%";
                this.countdownImage2.height = "50%";
                advancedTexture.addControl(this.countdownImage2);
                // ..
                image = countdownImages[2];
                this.countdownImage3 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage3.isVisible = false;
                this.countdownImage3.width = "50%";
                this.countdownImage3.height = "50%";
                advancedTexture.addControl(this.countdownImage3);
                // ..
                image = countdownImages[3];
                this.countdownImageGo = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImageGo.isVisible = false;
                this.countdownImageGo.width = "50%";
                this.countdownImageGo.height = "50%";
                advancedTexture.addControl(this.countdownImageGo);
            }
            else {
                BABYLON.SceneManager.ShowPageErrorMessage("No countdown images specified");
            }
            const countdownSounds = this.getProperty("countdownSounds");
            if (countdownSounds != null && countdownSounds.length > 0) {
                let sound = countdownSounds[0];
                this.countdownSound1 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound1.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[1];
                this.countdownSound2 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound2.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[2];
                this.countdownSound3 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound3.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[3];
                this.countdownSoundGo = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSoundGo.setVolume(this.startCountdownVolume); });
            }
            else {
                BABYLON.SceneManager.ShowPageErrorMessage("No countdown sounds specified");
            }
        }
        updateRaceController() {
            if (this.countdownImagesLoaded === false) {
                if (this.countdownImage1 != null && this.countdownImage2 != null && this.countdownImage3 != null && this.countdownImageGo != null) {
                    this.countdownImagesLoaded = (this.countdownImage1.isLoaded && this.countdownImage2.isLoaded && this.countdownImage3.isLoaded && this.countdownImageGo.isLoaded);
                }
            }
            if (this.countdownSoundsLoaded === false) {
                if (this.countdownSound1 != null && this.countdownSound2 != null && this.countdownSound3 != null && this.countdownSoundGo != null) {
                    this.countdownSoundsLoaded = (this.countdownSound1.isReady() && this.countdownSound2.isReady() && this.countdownSound3.isReady() && this.countdownSoundGo.isReady());
                }
            }
            if (this.countdownState === 0) {
                if (this.countdownImagesLoaded === true && this.countdownSoundsLoaded === true) {
                    this.countdownState = 1;
                    this.processNextCountdown(100);
                }
            }
        }
        updateNextCountdown() {
            this.hideCountdownItems();
            switch (this.countdownState) {
                case 1: {
                    this.countdownState = 2;
                    this.countdownImage3.isVisible = true;
                    this.countdownSound3.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 2: {
                    this.countdownState = 3;
                    this.countdownImage2.isVisible = true;
                    this.countdownSound2.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 3: {
                    this.countdownState = 4;
                    this.countdownImage1.isVisible = true;
                    this.countdownSound1.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 4: {
                    this.countdownState = 5;
                    this.countdownImageGo.isVisible = true;
                    this.countdownSoundGo.play();
                    this.processNextCountdown(500);
                    break;
                }
                default: {
                    this.startRaceController();
                    break;
                }
            }
        }
        processNextCountdown(milliseconds) {
            BABYLON.SceneManager.SetTimeout(milliseconds, () => { this.updateNextCountdown(); });
        }
        hideCountdownItems() {
            if (this.countdownImage1.isVisible)
                this.countdownImage1.isVisible = false;
            if (this.countdownImage2.isVisible)
                this.countdownImage2.isVisible = false;
            if (this.countdownImage3.isVisible)
                this.countdownImage3.isVisible = false;
            if (this.countdownImageGo.isVisible)
                this.countdownImageGo.isVisible = false;
        }
        killCountdownItems() {
            if (this.countdownImage1 != null) {
                this.countdownImage1.dispose();
                this.countdownImage1 = null;
            }
            if (this.countdownImage2 != null) {
                this.countdownImage2.dispose();
                this.countdownImage2 = null;
            }
            if (this.countdownImage3 != null) {
                this.countdownImage3.dispose();
                this.countdownImage3 = null;
            }
            if (this.countdownImageGo != null) {
                this.countdownImageGo.dispose();
                this.countdownImageGo = null;
            }
            // ..
            if (this.countdownSound1 != null) {
                this.countdownSound1.dispose();
                this.countdownSound1 = null;
            }
            if (this.countdownSound2 != null) {
                this.countdownSound2.dispose();
                this.countdownSound2 = null;
            }
            if (this.countdownSound3 != null) {
                this.countdownSound3.dispose();
                this.countdownSound3 = null;
            }
            if (this.countdownSoundGo != null) {
                this.countdownSoundGo.dispose();
                this.countdownSoundGo = null;
            }
        }
        startRaceController() {
            this.hideCountdownItems();
            this.killCountdownItems();
            if (this.raceOneVehicle != null)
                PROJECT.F1SceneController.EnableRacingVehicle(this.raceOneVehicle, true, true);
            if (this.raceTwoVehicle != null)
                PROJECT.F1SceneController.EnableRacingVehicle(this.raceTwoVehicle, true, true);
            if (this.raceThreeVehicle != null)
                PROJECT.F1SceneController.EnableRacingVehicle(this.raceThreeVehicle, true, false); // Note: Player Controller Vehicle
            if (this.raceFourVehicle != null)
                PROJECT.F1SceneController.EnableRacingVehicle(this.raceFourVehicle, true, true);
        }
        static EnableRacingVehicle(racingVehicle, enableInput, autoPilot) {
            const cameraManager = BABYLON.SceneManager.FindScriptComponent(racingVehicle, "PROJECT.VehicleCameraManager");
            if (cameraManager != null) {
                if (autoPilot === false) {
                    cameraManager.enableCamera = true;
                    cameraManager.followTarget = true;
                    cameraManager.attachPlayerCamera(BABYLON.PlayerNumber.One);
                }
            }
            const inputController = BABYLON.SceneManager.FindScriptComponent(racingVehicle, "PROJECT.VehicleInputController");
            if (inputController != null) {
                if (autoPilot === true) {
                    inputController.playerNumber = BABYLON.PlayerNumber.Auto;
                }
                else {
                    inputController.playerNumber = BABYLON.PlayerNumber.One;
                }
                inputController.enableInput = enableInput;
            }
        }
        destroy() {
            /* Destroy component function */
        }
    }
    PROJECT.F1SceneController = F1SceneController;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class MxSceneController
    */
    class MxSceneController extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.countdownState = 0;
            this.countdownImage1 = null;
            this.countdownImage2 = null;
            this.countdownImage3 = null;
            this.countdownImageGo = null;
            this.countdownImagesLoaded = false;
            this.countdownSound1 = null;
            this.countdownSound2 = null;
            this.countdownSound3 = null;
            this.countdownSoundGo = null;
            this.countdownSoundsLoaded = false;
            this.raceCar1 = "Mustang";
            this.raceOneVehicle = null;
            this.startCountdownVolume = 0.25;
        }
        awake() { this.awakeRaceController(); }
        ready() { this.initRaceController(); }
        update() { this.updateRaceController(); }
        awakeRaceController() {
            this.raceCar1 = this.getProperty("raceCar1", this.raceCar1);
            this.startCountdownVolume = this.getProperty("startVolume", this.startCountdownVolume);
            console.warn("MxSceneController: Build 03-29-2021-A2");
        }
        initRaceController() {
            const rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
            const countdownImages = this.getProperty("countdownImages");
            const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
            this.raceOneVehicle = BABYLON.SceneManager.GetTransformNode(this.scene, this.raceCar1);
            if (countdownImages != null && countdownImages.length > 0) {
                let image = countdownImages[0];
                this.countdownImage1 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage1.isVisible = false;
                this.countdownImage1.width = "50%";
                this.countdownImage1.height = "50%";
                advancedTexture.addControl(this.countdownImage1);
                // ..
                image = countdownImages[1];
                this.countdownImage2 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage2.isVisible = false;
                this.countdownImage2.width = "50%";
                this.countdownImage2.height = "50%";
                advancedTexture.addControl(this.countdownImage2);
                // ..
                image = countdownImages[2];
                this.countdownImage3 = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImage3.isVisible = false;
                this.countdownImage3.width = "50%";
                this.countdownImage3.height = "50%";
                advancedTexture.addControl(this.countdownImage3);
                // ..
                image = countdownImages[3];
                this.countdownImageGo = new BABYLON.GUI.Image("image_" + image.name, rootUrl + image.filename);
                this.countdownImageGo.isVisible = false;
                this.countdownImageGo.width = "50%";
                this.countdownImageGo.height = "50%";
                advancedTexture.addControl(this.countdownImageGo);
            }
            else {
                BABYLON.SceneManager.ShowPageErrorMessage("No countdown images specified");
            }
            const countdownSounds = this.getProperty("countdownSounds");
            if (countdownSounds != null && countdownSounds.length > 0) {
                let sound = countdownSounds[0];
                this.countdownSound1 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound1.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[1];
                this.countdownSound2 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound2.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[2];
                this.countdownSound3 = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSound3.setVolume(this.startCountdownVolume); });
                // ..
                sound = countdownSounds[3];
                this.countdownSoundGo = new BABYLON.Sound("sound_" + sound.name, rootUrl + sound.filename, this.scene, () => { this.countdownSoundGo.setVolume(this.startCountdownVolume); });
            }
            else {
                BABYLON.SceneManager.ShowPageErrorMessage("No countdown sounds specified");
            }
        }
        updateRaceController() {
            if (this.countdownImagesLoaded === false) {
                if (this.countdownImage1 != null && this.countdownImage2 != null && this.countdownImage3 != null && this.countdownImageGo != null) {
                    this.countdownImagesLoaded = (this.countdownImage1.isLoaded && this.countdownImage2.isLoaded && this.countdownImage3.isLoaded && this.countdownImageGo.isLoaded);
                }
            }
            if (this.countdownSoundsLoaded === false) {
                if (this.countdownSound1 != null && this.countdownSound2 != null && this.countdownSound3 != null && this.countdownSoundGo != null) {
                    this.countdownSoundsLoaded = (this.countdownSound1.isReady() && this.countdownSound2.isReady() && this.countdownSound3.isReady() && this.countdownSoundGo.isReady());
                }
            }
            if (this.countdownState === 0) {
                if (this.countdownImagesLoaded === true && this.countdownSoundsLoaded === true) {
                    this.countdownState = 1;
                    this.processNextCountdown(100);
                }
            }
        }
        updateNextCountdown() {
            this.hideCountdownItems();
            switch (this.countdownState) {
                case 1: {
                    this.countdownState = 2;
                    this.countdownImage3.isVisible = true;
                    this.countdownSound3.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 2: {
                    this.countdownState = 3;
                    this.countdownImage2.isVisible = true;
                    this.countdownSound2.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 3: {
                    this.countdownState = 4;
                    this.countdownImage1.isVisible = true;
                    this.countdownSound1.play();
                    this.processNextCountdown(1000);
                    break;
                }
                case 4: {
                    this.countdownState = 5;
                    this.countdownImageGo.isVisible = true;
                    this.countdownSoundGo.play();
                    this.processNextCountdown(500);
                    break;
                }
                default: {
                    this.startRaceController();
                    break;
                }
            }
        }
        processNextCountdown(milliseconds) {
            BABYLON.SceneManager.SetTimeout(milliseconds, () => { this.updateNextCountdown(); });
        }
        hideCountdownItems() {
            if (this.countdownImage1.isVisible)
                this.countdownImage1.isVisible = false;
            if (this.countdownImage2.isVisible)
                this.countdownImage2.isVisible = false;
            if (this.countdownImage3.isVisible)
                this.countdownImage3.isVisible = false;
            if (this.countdownImageGo.isVisible)
                this.countdownImageGo.isVisible = false;
        }
        killCountdownItems() {
            if (this.countdownImage1 != null) {
                this.countdownImage1.dispose();
                this.countdownImage1 = null;
            }
            if (this.countdownImage2 != null) {
                this.countdownImage2.dispose();
                this.countdownImage2 = null;
            }
            if (this.countdownImage3 != null) {
                this.countdownImage3.dispose();
                this.countdownImage3 = null;
            }
            if (this.countdownImageGo != null) {
                this.countdownImageGo.dispose();
                this.countdownImageGo = null;
            }
            // ..
            if (this.countdownSound1 != null) {
                this.countdownSound1.dispose();
                this.countdownSound1 = null;
            }
            if (this.countdownSound2 != null) {
                this.countdownSound2.dispose();
                this.countdownSound2 = null;
            }
            if (this.countdownSound3 != null) {
                this.countdownSound3.dispose();
                this.countdownSound3 = null;
            }
            if (this.countdownSoundGo != null) {
                this.countdownSoundGo.dispose();
                this.countdownSoundGo = null;
            }
        }
        startRaceController() {
            this.hideCountdownItems();
            this.killCountdownItems();
            if (this.raceOneVehicle != null)
                PROJECT.MxSceneController.EnableRacingVehicle(this.raceOneVehicle, true, false);
        }
        static EnableRacingVehicle(racingVehicle, enableInput, autoPilot) {
            const cameraManager = BABYLON.SceneManager.FindScriptComponent(racingVehicle, "PROJECT.VehicleCameraManager");
            if (cameraManager != null) {
                if (autoPilot === false) {
                    cameraManager.enableCamera = true;
                    cameraManager.followTarget = true;
                    cameraManager.attachPlayerCamera(BABYLON.PlayerNumber.One);
                }
            }
            const inputController = BABYLON.SceneManager.FindScriptComponent(racingVehicle, "PROJECT.VehicleInputController");
            if (inputController != null) {
                if (autoPilot === true) {
                    inputController.playerNumber = BABYLON.PlayerNumber.Auto;
                }
                else {
                    inputController.playerNumber = BABYLON.PlayerNumber.One;
                }
                inputController.enableInput = enableInput;
            }
        }
        destroy() {
            /* Destroy component function */
        }
    }
    PROJECT.MxSceneController = MxSceneController;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class NetworkingManager
    */
    // const AppInfo = {
    //     protocol: Photon.ConnectionProtocol.Ws,
    //     appVersion: "b582f7f4-0fee-4837-b440-8da66de1477a",
    //     gameVersion: "1"
    // }
    // const ConnectionInfo = {
    //     keepMasterConection: false,
    //     lobbyName: "MVRK Lobby",
    //     lobbyType: Photon.LoadBalancing.Constants.LobbyType.Default,
    //     lobbyStats: true,
    //     region: 'us'
    // }
    // const RoomInfo = {
    //     isVisible: true,
    //     isOpen: true,
    //     maxPlayers: 20,
    //     emptyRoomLiveTime: 20000, //20s
    //     suspendedPlayerLiveTime: 10000, //10s
    //     lobbyName: "MVRK Lobby",
    //     lobbyType: Photon.LoadBalancing.Constants.LobbyType.Default,
    // }
    // const RoomName = "MVRK World";
    class NetworkManager extends BABYLON.ScriptComponent {
        constructor(transform, scene, properties) {
            super(transform, scene, properties);
            this.masterPrefabName = "";
            this.playerPrefabName = "";
            NetworkManager.instance = this;
        }
        awake() {
            this.onRoomJoined = new BABYLON.Observable();
            this.client = new Colyseus.Client("ws://Mvrkmultiplayerserver-env.eba-ctjskxzw.us-east-1.elasticbeanstalk.com");
            this.syncedObjects = new Map();
        }
        start() {
            console.log();
        }
        async ready() {
            //load the prefab asset
            const rootUrl = SM.GetRootUrl(this.scene);
            this.assetContainer = await BABYLON.SceneLoader.LoadAssetContainerAsync(rootUrl, this.masterPrefabName + ".gltf", this.scene);
            this.createRoom();
            this.bindObservables();
        }
        update() {
            /* Update render loop function */
        }
        destroy() {
        }
        spawnObject(object, existing) {
            console.log("spawning", object);
            //instantiate object
            const networkObject = SM.InstantiatePrefab(this.assetContainer, this.playerPrefabName, "P-" + object.id);
            if (networkObject) {
                const networkObjectComponent = SM.FindScriptComponent(networkObject, "PROJECT.NetworkObject");
                networkObjectComponent.id = object.id;
                if (object.id == this.room.sessionId)
                    networkObjectComponent.isLocal = true;
                //if they're already tracked in the network and not a new spawn, give them their transform thru the network
                networkObject.position = new BABYLON.Vector3(object.transform.position.x, object.transform.position.y, object.transform.position.z);
                networkObject.rotation = new BABYLON.Vector3(object.transform.rotation.x, object.transform.rotation.y, object.transform.rotation.z);
                networkObject.scaling = new BABYLON.Vector3(object.transform.scale.x, object.transform.scale.y, object.transform.scale.z);
                this.syncedObjects.set(object.id, networkObject);
            }
            else {
                console.log("failed to spawn " + this.playerPrefabName);
            }
        }
        despawnObject(id) {
            console.log("despawning", id);
            //remove object from the game
            SM.SafeDestroy(this.syncedObjects.get(id));
            //remove object from our network objects list
            this.syncedObjects.delete(id);
        }
        initialSpawnObjects(objectMap) {
            for (var id in objectMap) {
                if (id != this.room.sessionId) {
                    this.spawnObject(objectMap[id], true);
                }
            }
        }
        bindObservables() {
            NetworkManager.instance.onRoomJoined.add((didJoin) => {
                this.room.onMessage("spawn", (object) => this.spawnObject(object));
                this.room.onMessage("despawn", (id) => this.despawnObject(id));
                this.room.onMessage("initialspawn", (objects) => this.initialSpawnObjects(objects));
            });
        }
        createRoom() {
            this.client.joinOrCreate("mainroom", { /* options */}).then(room => {
                console.log("joined the " + room.name + " room successfully");
                this.room = room;
                if (this.onRoomJoined.hasObservers()) {
                    this.onRoomJoined.notifyObservers(true);
                }
            }).catch(e => {
                console.error("join error", e);
            });
        }
    }
    PROJECT.NetworkManager = NetworkManager;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class NetworkObject
    */
    class NetworkObject extends BABYLON.ScriptComponent {
        awake() {
            /* Init component function */
            this.onPositionUpdate = new BABYLON.Observable();
            this.onRotationUpdate = new BABYLON.Observable();
            this.onScaleUpdate = new BABYLON.Observable();
        }
        start() {
            this.positionBuffer = this.transform.position.clone();
            this.rotationBuffer = this.transform.rotationQuaternion.clone();
            this.scaleBuffer = this.transform.scaling.clone();
            this.bindObservables();
        }
        update() {
            this.notifyTransformObservables();
        }
        validateTransformUpdates() {
        }
        notifyTransformObservables() {
            //notify users of your position changes if you are the local user
            if (this.isLocal) {
                if (this.onPositionUpdate.hasObservers() === true) {
                    if (!this.transform.position.equalsWithEpsilon(this.positionBuffer, this.syncDelta)) {
                        this.onPositionUpdate.notifyObservers(this.transform.position);
                    }
                }
                if (this.onRotationUpdate.hasObservers() === true) {
                    if (!this.transform.rotationQuaternion.equalsWithEpsilon(this.rotationBuffer, this.syncDelta)) {
                        this.onRotationUpdate.notifyObservers(this.transform.rotationQuaternion);
                    }
                }
                if (this.onScaleUpdate.hasObservers() === true) {
                    if (!this.transform.scaling.equalsWithEpsilon(this.scaleBuffer, this.syncDelta)) {
                        this.onScaleUpdate.notifyObservers(this.transform.scaling);
                    }
                }
            }
            else {
                this.transform.position = this.positionBuffer.clone();
                this.transform.rotationQuaternion = this.rotationBuffer.clone();
                this.transform.scaling = this.scaleBuffer.clone();
            }
        }
        assignSendTransformUpdates() {
            this.onPositionUpdate.add((position) => {
                if (PROJECT.NetworkManager.instance.room) {
                    PROJECT.NetworkManager.instance.room.send('move', {
                        x: position.x,
                        y: position.y,
                        z: position.z
                    });
                }
            });
            this.onRotationUpdate.add((rotation) => {
                if (PROJECT.NetworkManager.instance.room) {
                    PROJECT.NetworkManager.instance.room.send('rotate', {
                        x: rotation.x,
                        y: rotation.y,
                        z: rotation.z,
                        w: rotation.w
                    });
                }
            });
            this.onScaleUpdate.add((scale) => {
                if (PROJECT.NetworkManager.instance.room) {
                    PROJECT.NetworkManager.instance.room.send('scale', {
                        x: scale.x,
                        y: scale.y,
                        z: scale.z
                    });
                }
            });
        }
        assignRecieveTransformUpdates() {
            this.colyseusPosUpdate = PROJECT.NetworkManager.instance.room.onMessage("move", (position) => {
                if (PROJECT.NetworkManager.instance.syncedObjects.get(position.id) && position.id == this.id) {
                    this.transform.position = new BABYLON.Vector3(position.message.x, position.message.y, position.message.z);
                    this.positionBuffer = this.transform.position.clone();
                }
            });
            this.colysesusRotUpdate = PROJECT.NetworkManager.instance.room.onMessage("rotate", (rotation) => {
                if (PROJECT.NetworkManager.instance.syncedObjects.get(rotation.id) && rotation.id == this.id) {
                    this.transform.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(rotation.message.x, rotation.message.y, rotation.message.z);
                    this.rotationBuffer = this.transform.rotationQuaternion.clone();
                }
            });
            this.colysesusScaleUpdate = PROJECT.NetworkManager.instance.room.onMessage("scale", (scale) => {
                if (PROJECT.NetworkManager.instance.syncedObjects.get(scale.id) && scale.id == this.id) {
                    this.transform.scaling = new BABYLON.Vector3(scale.message.x, scale.message.y, scale.message.z);
                    this.scaleBuffer = this.transform.scaling.clone();
                }
            });
        }
        bindObservables() {
            this.assignSendTransformUpdates();
            this.assignRecieveTransformUpdates();
            // if(this.isLocal){
            //     SM.OnKeyboardPress(BABYLON.UserInputKey.LeftArrow, ()=>{
            //         this.transform.position.x -= .1;
            //     })
            //     SM.OnKeyboardPress(BABYLON.UserInputKey.RightArrow, ()=>{
            //         this.transform.position.x += .1;
            //     })
            //     SM.OnKeyboardPress(BABYLON.UserInputKey.UpArrow, ()=>{
            //         this.transform.position.y += .1;
            //     })
            //     SM.OnKeyboardPress(BABYLON.UserInputKey.DownArrow, ()=>{
            //         this.transform.position.y -= .1;
            //     })
            //     SM.OnKeyboardPress(BABYLON.UserInputKey.A, ()=>{
            //         //this.transform.rotationQuaternion = null;
            //         this.transform.addRotation(5, 0, 0);
            //     })
            //     SM.OnKeyboardPress(BABYLON.UserInputKey.D, ()=>{
            //         //this.transform.rotationQuaternion = null;
            //         this.transform.addRotation(-5, 0, 0);
            //     })
            //     SM.OnKeyboardPress(BABYLON.UserInputKey.W, ()=>{
            //         this.transform.scaling.y += .1;
            //     })
            //     SM.OnKeyboardPress(BABYLON.UserInputKey.S, ()=>{
            //         this.transform.scaling.y -= .1;
            //     })
            // }
        }
        unbindObservables() {
            this.onPositionUpdate.clear();
            this.onRotationUpdate.clear();
            this.onScaleUpdate.clear();
            this.colyseusPosUpdate = null;
            this.colysesusRotUpdate = null;
            this.colysesusScaleUpdate = null;
        }
        destroy() {
            this.unbindObservables();
        }
    }
    PROJECT.NetworkObject = NetworkObject;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class AutoBodyGarage
    */
    class AutoBodyGarage extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.m_bodyMaterial = null;
            this.m_bodyAbtractMesh = null;
        }
        awake() {
            const mainMaterialIndex = this.getProperty("mainMaterialIndex", 0);
            const mainBodyTransform = this.getProperty("mainBodyTransform");
            const mainBodyUnityColor = this.getProperty("mainBodyPaintColor");
            const mainBodyPaintColor = BABYLON.Utilities.ParseColor3(mainBodyUnityColor, BABYLON.Color3.White());
            if (mainBodyTransform != null) {
                this.m_bodyAbtractMesh = BABYLON.Utilities.ParseChildTransform(this.transform, mainBodyTransform);
                if (this.m_bodyAbtractMesh != null) {
                    if (this.m_bodyAbtractMesh.material instanceof BABYLON.MultiMaterial) {
                        const multiMaterial = this.m_bodyAbtractMesh.material;
                        if (multiMaterial.subMaterials != null && multiMaterial.subMaterials.length > mainMaterialIndex) {
                            const copyMaterial = multiMaterial.clone(multiMaterial.name + "." + this.transform.name);
                            const subMaterial = copyMaterial.subMaterials[mainMaterialIndex];
                            copyMaterial.subMaterials[mainMaterialIndex] = subMaterial.clone(subMaterial.name + "." + this.transform.name);
                            this.m_bodyMaterial = copyMaterial.subMaterials[mainMaterialIndex];
                            this.m_bodyAbtractMesh.material = copyMaterial;
                        }
                    }
                    else {
                        this.m_bodyMaterial = this.m_bodyAbtractMesh.material.clone(this.m_bodyAbtractMesh.material.name + "." + this.transform.name);
                        this.m_bodyAbtractMesh.material = this.m_bodyMaterial;
                    }
                    if (this.m_bodyMaterial != null) {
                        // Set Main Body Base Coloring
                        if (this.m_bodyMaterial.isFrozen)
                            this.m_bodyMaterial.unfreeze();
                        this.m_bodyMaterial.albedoColor.copyFrom(mainBodyPaintColor);
                        this.m_bodyMaterial.freeze();
                    }
                }
                else {
                    BABYLON.SceneManager.LogWarning("Failed to find auto body mesh for: " + this.transform.name);
                }
            }
        }
        //protected start(): void { }
        //protected update(): void { }
        //protected after(): void { }
        //protected destroy(): void { }
        setupVehicleMaterials(bodyColor, wheelColor = null, wheelType = 0, decalIndex = 0) {
            if (this.m_bodyMaterial != null) {
                // Set Main Body Base Coloring
                if (this.m_bodyMaterial.isFrozen)
                    this.m_bodyMaterial.unfreeze();
                this.m_bodyMaterial.albedoColor.copyFrom(bodyColor);
                this.m_bodyMaterial.freeze();
                // TODO - Setup Wheel Type And Color
                // TODO - Setup Decal Body Wrapping
            }
        }
    }
    PROJECT.AutoBodyGarage = AutoBodyGarage;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class BT_RaceTrackManager
    */
    class RaceTrackManager extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.trackNodes = null;
            this.raceLineData_1 = null;
            this.raceLineData_2 = null;
            this.raceLineData_3 = null;
            this.raceLineData_4 = null;
            this.raceLineData_5 = null;
            this.raceLineColor_1 = null;
            this.raceLineColor_2 = null;
            this.raceLineColor_3 = null;
            this.raceLineColor_4 = null;
            this.raceLineColor_5 = null;
            this.debugMeshLines_1 = null;
            this.debugMeshLines_2 = null;
            this.debugMeshLines_3 = null;
            this.debugMeshLines_4 = null;
            this.debugMeshLines_5 = null;
            this.drawDebugLines = false;
        }
        getTrackNodes() { return this.trackNodes; }
        getControlPoints(line) {
            let result = null;
            switch (line) {
                case 0:
                    result = this.raceLineData_1;
                    break;
                case 1:
                    result = this.raceLineData_2;
                    break;
                case 2:
                    result = this.raceLineData_3;
                    break;
                case 3:
                    result = this.raceLineData_4;
                    break;
                case 4:
                    result = this.raceLineData_5;
                    break;
            }
            return result;
        }
        awake() {
            this.trackNodes = this.getProperty("TrackNodes", this.trackNodes);
            this.raceLineData_1 = this.getProperty("RaceLineData_1", this.raceLineData_1);
            this.raceLineData_2 = this.getProperty("RaceLineData_2", this.raceLineData_2);
            this.raceLineData_3 = this.getProperty("RaceLineData_3", this.raceLineData_3);
            this.raceLineData_4 = this.getProperty("RaceLineData_4", this.raceLineData_4);
            this.raceLineData_5 = this.getProperty("RaceLineData_5", this.raceLineData_5);
            this.raceLineColor_1 = this.getProperty("RaceLineColor_1", this.raceLineColor_1);
            this.raceLineColor_2 = this.getProperty("RaceLineColor_2", this.raceLineColor_2);
            this.raceLineColor_3 = this.getProperty("RaceLineColor_3", this.raceLineColor_3);
            this.raceLineColor_4 = this.getProperty("RaceLineColor_4", this.raceLineColor_4);
            this.raceLineColor_5 = this.getProperty("RaceLineColor_5", this.raceLineColor_5);
            this.drawDebugLines = this.getProperty("DrawDebugLines", this.drawDebugLines);
        }
        start() {
            if (this.drawDebugLines === true) {
                let index = 0;
                const pointSize = 0.5;
                const debugLines = new BABYLON.TransformNode(this.transform.name + ".DebugLines", this.scene);
                debugLines.position.set(0, 0, 0);
                debugLines.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                // ..
                // Track Nodes
                // ..
                if (this.trackNodes != null && this.trackNodes.length > 0) {
                    const trackNodePos_1 = [];
                    const trackNodeCol_1 = BABYLON.Color3.White();
                    const trackNodeMat_1 = new BABYLON.StandardMaterial(this.transform.name + ".NodeMaterial", this.scene);
                    trackNodeMat_1.diffuseColor = trackNodeCol_1;
                    index = 0;
                    this.trackNodes.forEach((node) => {
                        const trackNodePosition = new BABYLON.Vector3(node.position.x, node.position.y, node.position.z);
                        const trackNodeRotation = new BABYLON.Quaternion(node.rotation.x, node.rotation.y, node.rotation.z, node.rotation.w);
                        trackNodePos_1.push(trackNodePosition);
                        const trackNode = BABYLON.MeshBuilder.CreateCylinder(this.transform.name + ".TrackNode_" + index, { diameterTop: 0, diameterBottom: (pointSize * 2), height: 2.0 }, this.scene);
                        trackNode.parent = debugLines;
                        trackNode.position.copyFrom(trackNodePosition);
                        trackNode.position.y += 0.5;
                        trackNode.rotationQuaternion = trackNodeRotation.multiply(BABYLON.Utilities.FromEuler(90, 0, 0));
                        trackNode.material = trackNodeMat_1;
                        index++;
                    });
                }
                // ..
                // Race Line 5
                // ..
                if (this.raceLineData_5 != null && this.raceLineData_5.length > 0) {
                    const raceLinePos_5 = [];
                    const raceLineCol_5 = (this.raceLineColor_5 != null) ? new BABYLON.Color3(this.raceLineColor_5.r, this.raceLineColor_5.g, this.raceLineColor_5.b) : BABYLON.Color3.White();
                    const raceLineMat_5 = new BABYLON.StandardMaterial(this.transform.name + ".PointMaterial_5", this.scene);
                    raceLineMat_5.diffuseColor = raceLineCol_5;
                    index = 0;
                    this.raceLineData_5.forEach((point) => {
                        const raceLinePoint = new BABYLON.Vector3(point.position.x, point.position.y, point.position.z);
                        raceLinePos_5.push(raceLinePoint);
                        const controlPoint_5 = BABYLON.MeshBuilder.CreateSphere(this.transform.name + ".ControlPoint_5_" + index, { segments: 24, diameter: (pointSize * 2) }, this.scene);
                        controlPoint_5.parent = debugLines;
                        controlPoint_5.position.copyFrom(raceLinePoint);
                        controlPoint_5.position.y += 0.5;
                        controlPoint_5.material = raceLineMat_5;
                        index++;
                    });
                    this.debugMeshLines_5 = BABYLON.MeshBuilder.CreateLines((this.transform.name + ".RaceLine_5"), { points: raceLinePos_5 }, this.scene);
                    this.debugMeshLines_5.parent = debugLines;
                    this.debugMeshLines_5.position.y += 0.5;
                    this.debugMeshLines_5.color = raceLineCol_5;
                }
                // ..
                // Race Line 4
                // ..
                if (this.raceLineData_4 != null && this.raceLineData_4.length > 0) {
                    const raceLinePos_4 = [];
                    const raceLineCol_4 = (this.raceLineColor_4 != null) ? new BABYLON.Color3(this.raceLineColor_4.r, this.raceLineColor_4.g, this.raceLineColor_4.b) : BABYLON.Color3.White();
                    const raceLineMat_4 = new BABYLON.StandardMaterial(this.transform.name + ".PointMaterial_4", this.scene);
                    raceLineMat_4.diffuseColor = raceLineCol_4;
                    index = 0;
                    this.raceLineData_4.forEach((point) => {
                        const raceLinePoint = new BABYLON.Vector3(point.position.x, point.position.y, point.position.z);
                        raceLinePos_4.push(raceLinePoint);
                        const controlPoint_4 = BABYLON.MeshBuilder.CreateSphere(this.transform.name + ".ControlPoint_4_" + index, { segments: 24, diameter: (pointSize * 2) }, this.scene);
                        controlPoint_4.parent = debugLines;
                        controlPoint_4.position.copyFrom(raceLinePoint);
                        controlPoint_4.position.y += 0.5;
                        controlPoint_4.material = raceLineMat_4;
                        index++;
                    });
                    this.debugMeshLines_4 = BABYLON.MeshBuilder.CreateLines((this.transform.name + ".RaceLine_4"), { points: raceLinePos_4 }, this.scene);
                    this.debugMeshLines_4.parent = debugLines;
                    this.debugMeshLines_4.position.y += 0.5;
                    this.debugMeshLines_4.color = raceLineCol_4;
                }
                // ..
                // Race Line 3
                // ..
                if (this.raceLineData_3 != null && this.raceLineData_3.length > 0) {
                    const raceLinePos_3 = [];
                    const raceLineCol_3 = (this.raceLineColor_3 != null) ? new BABYLON.Color3(this.raceLineColor_3.r, this.raceLineColor_3.g, this.raceLineColor_3.b) : BABYLON.Color3.White();
                    const raceLineMat_3 = new BABYLON.StandardMaterial(this.transform.name + ".PointMaterial_3", this.scene);
                    raceLineMat_3.diffuseColor = raceLineCol_3;
                    index = 0;
                    this.raceLineData_3.forEach((point) => {
                        const raceLinePoint = new BABYLON.Vector3(point.position.x, point.position.y, point.position.z);
                        raceLinePos_3.push(raceLinePoint);
                        const controlPoint_3 = BABYLON.MeshBuilder.CreateSphere(this.transform.name + ".ControlPoint_3_" + index, { segments: 24, diameter: (pointSize * 2) }, this.scene);
                        controlPoint_3.parent = debugLines;
                        controlPoint_3.position.copyFrom(raceLinePoint);
                        controlPoint_3.position.y += 0.5;
                        controlPoint_3.material = raceLineMat_3;
                        index++;
                    });
                    this.debugMeshLines_3 = BABYLON.MeshBuilder.CreateLines((this.transform.name + ".RaceLine_3"), { points: raceLinePos_3 }, this.scene);
                    this.debugMeshLines_3.parent = debugLines;
                    this.debugMeshLines_3.position.y += 0.5;
                    this.debugMeshLines_3.color = raceLineCol_3;
                }
                // ..
                // Race Line 2
                // ..
                if (this.raceLineData_2 != null && this.raceLineData_2.length > 0) {
                    const raceLinePos_2 = [];
                    const raceLineCol_2 = (this.raceLineColor_2 != null) ? new BABYLON.Color3(this.raceLineColor_2.r, this.raceLineColor_2.g, this.raceLineColor_2.b) : BABYLON.Color3.White();
                    const raceLineMat_2 = new BABYLON.StandardMaterial(this.transform.name + ".PointMaterial_2", this.scene);
                    raceLineMat_2.diffuseColor = raceLineCol_2;
                    index = 0;
                    this.raceLineData_2.forEach((point) => {
                        const raceLinePoint = new BABYLON.Vector3(point.position.x, point.position.y, point.position.z);
                        raceLinePos_2.push(raceLinePoint);
                        const controlPoint_2 = BABYLON.MeshBuilder.CreateSphere(this.transform.name + ".ControlPoint_2_" + index, { segments: 24, diameter: (pointSize * 2) }, this.scene);
                        controlPoint_2.parent = debugLines;
                        controlPoint_2.position.copyFrom(raceLinePoint);
                        controlPoint_2.position.y += 0.5;
                        controlPoint_2.material = raceLineMat_2;
                        index++;
                    });
                    this.debugMeshLines_2 = BABYLON.MeshBuilder.CreateLines((this.transform.name + ".RaceLine_2"), { points: raceLinePos_2 }, this.scene);
                    this.debugMeshLines_2.parent = debugLines;
                    this.debugMeshLines_2.position.y += 0.5;
                    this.debugMeshLines_2.color = raceLineCol_2;
                }
                // ..
                // Race Line 1
                // ..
                if (this.raceLineData_1 != null && this.raceLineData_1.length > 0) {
                    const raceLinePos_1 = [];
                    const raceLineCol_1 = (this.raceLineColor_1 != null) ? new BABYLON.Color3(this.raceLineColor_1.r, this.raceLineColor_1.g, this.raceLineColor_1.b) : BABYLON.Color3.White();
                    const raceLineMat_1 = new BABYLON.StandardMaterial(this.transform.name + ".PointMaterial_1", this.scene);
                    raceLineMat_1.diffuseColor = raceLineCol_1;
                    index = 0;
                    this.raceLineData_1.forEach((point) => {
                        const raceLinePoint = new BABYLON.Vector3(point.position.x, point.position.y, point.position.z);
                        raceLinePos_1.push(raceLinePoint);
                        const controlPoint_1 = BABYLON.MeshBuilder.CreateSphere(this.transform.name + ".ControlPoint_1_" + index, { segments: 24, diameter: (pointSize * 2) }, this.scene);
                        controlPoint_1.parent = debugLines;
                        controlPoint_1.position.copyFrom(raceLinePoint);
                        controlPoint_1.position.y += 0.5;
                        controlPoint_1.material = raceLineMat_1;
                        index++;
                    });
                    this.debugMeshLines_1 = BABYLON.MeshBuilder.CreateLines((this.transform.name + ".RaceLine_1"), { points: raceLinePos_1 }, this.scene);
                    this.debugMeshLines_1.parent = debugLines;
                    this.debugMeshLines_1.position.y += 0.5;
                    this.debugMeshLines_1.color = raceLineCol_1;
                }
            }
        }
        destroy() {
            // TODO - Destroy component function
        }
    }
    PROJECT.RaceTrackManager = RaceTrackManager;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon skidmark section class (Native Bullet Physics 2.82)
     * @class SkidMarkSection
     */
    class SkidMarkSection {
        constructor() {
            this.Pos = BABYLON.Vector3.Zero();
            this.Normal = BABYLON.Vector3.Zero();
            this.Tangent = BABYLON.Vector4.Zero();
            this.Posl = BABYLON.Vector3.Zero();
            this.Posr = BABYLON.Vector3.Zero();
            this.Intensity = 0.0;
            this.LastIndex = -1;
        }
    }
    PROJECT.SkidMarkSection = SkidMarkSection;
    /**
     * Babylon Script Component
     * @class SkidMarkManager
     */
    class SkidMarkManager extends BABYLON.ScriptComponent {
        constructor(transform, scene, properties = {}) {
            super(transform, scene, properties);
            SkidMarkManager.MAX_MARKS = this.getProperty("maxSections", SkidMarkManager.MAX_MARKS);
            SkidMarkManager.MARK_COLOR = BABYLON.Utilities.ParseColor3(this.getProperty("textureColor"), SkidMarkManager.MARK_COLOR);
            SkidMarkManager.MARK_WIDTH = this.getProperty("textureWidth", SkidMarkManager.MARK_WIDTH);
            SkidMarkManager.GROUND_OFFSET = this.getProperty("groundOffset", SkidMarkManager.GROUND_OFFSET);
            SkidMarkManager.GPU_TRIANGLES = this.getProperty("gpuQuadIndices", SkidMarkManager.GPU_TRIANGLES);
            SkidMarkManager.TEXTURE_MARKS = this.getProperty("textureMarks", SkidMarkManager.TEXTURE_MARKS);
            SkidMarkManager.TEX_INTENSITY = this.getProperty("textureIntensity", SkidMarkManager.TEX_INTENSITY);
            SkidMarkManager.MIN_DISTANCE = this.getProperty("textureDistance", SkidMarkManager.MIN_DISTANCE);
            SkidMarkManager.MIN_SQR_DISTANCE = (SkidMarkManager.MIN_DISTANCE * SkidMarkManager.MIN_DISTANCE);
        }
        start() { SkidMarkManager.CreateSkidMarkManager(this.scene); }
        update() { SkidMarkManager.UpdateSkidMarkManager(); }
        static AddSkidMarkSegment(pos, normal, intensity, lastIndex) {
            if (SkidMarkManager.SkidMarkMesh == null)
                return null;
            SkidMarkManager.TempVector3_POS.set(0, 0, 0);
            SkidMarkManager.TempVector3_DIR.set(0, 0, 0);
            SkidMarkManager.TempVector3_XDIR.set(0, 0, 0);
            SkidMarkManager.TempVector3_SDIR.set(0, 0, 0);
            // ..
            if (intensity > 1.0)
                intensity = 1.0;
            else if (intensity < 0.0)
                return -1.0;
            // ..
            if (lastIndex > 0) {
                pos.subtractToRef(SkidMarkManager.SkidMarkSections[lastIndex].Pos, SkidMarkManager.TempVector3_POS);
                const sqrDistance = SkidMarkManager.TempVector3_POS.lengthSquared();
                if (sqrDistance < SkidMarkManager.MIN_SQR_DISTANCE)
                    return lastIndex;
            }
            // ..
            const curSection = SkidMarkManager.SkidMarkSections[SkidMarkManager.SkidMarkIndex];
            normal.scaleToRef(SkidMarkManager.GROUND_OFFSET, SkidMarkManager.TempVector3_POS);
            pos.addToRef(SkidMarkManager.TempVector3_POS, curSection.Pos);
            curSection.Normal.copyFrom(normal);
            curSection.Intensity = (intensity * SkidMarkManager.TEX_INTENSITY);
            curSection.LastIndex = lastIndex;
            // ..
            if (lastIndex != -1) {
                const lastSection = SkidMarkManager.SkidMarkSections[lastIndex];
                curSection.Pos.subtractToRef(lastSection.Pos, SkidMarkManager.TempVector3_DIR);
                BABYLON.Vector3.CrossToRef(SkidMarkManager.TempVector3_DIR, normal, SkidMarkManager.TempVector3_XDIR);
                SkidMarkManager.TempVector3_XDIR.normalizeToRef(SkidMarkManager.TempVector3_XDIR);
                // ..
                SkidMarkManager.TempVector3_XDIR.scaleToRef(SkidMarkManager.MARK_WIDTH * 0.5, SkidMarkManager.TempVector3_SDIR);
                curSection.Pos.addToRef(SkidMarkManager.TempVector3_SDIR, curSection.Posl);
                curSection.Pos.subtractToRef(SkidMarkManager.TempVector3_SDIR, curSection.Posr);
                curSection.Tangent.set(SkidMarkManager.TempVector3_XDIR.x, SkidMarkManager.TempVector3_XDIR.y, SkidMarkManager.TempVector3_XDIR.z, 1);
                // ..
                if (lastSection.LastIndex === -1) {
                    curSection.Pos.addToRef(SkidMarkManager.TempVector3_SDIR, lastSection.Posl);
                    curSection.Pos.subtractToRef(SkidMarkManager.TempVector3_SDIR, lastSection.Posr);
                    lastSection.Tangent.copyFrom(curSection.Tangent);
                }
            }
            // ..
            SkidMarkManager.AddSkidMarkVertexData();
            const curIndex = SkidMarkManager.SkidMarkIndex;
            SkidMarkManager.SkidMarkIndex = ++SkidMarkManager.SkidMarkIndex % SkidMarkManager.MAX_MARKS;
            return curIndex;
        }
        static CreateSkidMarkManager(scene) {
            if (SkidMarkManager.SkidMarkMesh == null) {
                const skidmarkMaterial = new BABYLON.StandardMaterial("SkidMarkMaterial", scene);
                skidmarkMaterial.backFaceCulling = false;
                skidmarkMaterial.disableLighting = true;
                skidmarkMaterial.emissiveColor = SkidMarkManager.MARK_COLOR;
                skidmarkMaterial.diffuseColor = SkidMarkManager.MARK_COLOR;
                skidmarkMaterial.diffuseTexture = BABYLON.Utilities.ParseTexture(SkidMarkManager.TEXTURE_MARKS, scene);
                if (skidmarkMaterial.diffuseTexture != null) {
                    skidmarkMaterial.diffuseTexture.hasAlpha = true;
                    skidmarkMaterial.useAlphaFromDiffuseTexture = true;
                }
                skidmarkMaterial.freeze();
                SkidMarkManager.SkidMarkMesh = new BABYLON.Mesh("SkidMarkMesh", scene);
                SkidMarkManager.SkidMarkMesh.material = skidmarkMaterial;
                SkidMarkManager.SkidMarkMesh.alwaysSelectAsActiveMesh = true;
                SkidMarkManager.SkidMarkMesh.doNotSyncBoundingInfo = true;
                SkidMarkManager.SkidMarkMesh.receiveShadows = false;
                SkidMarkManager.SkidMarkMesh.checkCollisions = false;
                SkidMarkManager.SkidMarkMesh.useVertexColors = true;
                SkidMarkManager.SkidMarkMesh.hasVertexAlpha = true;
                SkidMarkManager.SkidMarkMesh.isPickable = false;
                // ..
                // Setup SkidMark Section Properties
                // ..
                SkidMarkManager.SkidMarkSections = new Array(SkidMarkManager.MAX_MARKS);
                for (let i = 0; i < SkidMarkManager.SkidMarkSections.length; i++) {
                    SkidMarkManager.SkidMarkSections[i] = new SkidMarkSection();
                }
                // ..
                // Setup Raw Mesh Vertex Buffer Data
                // ..
                SkidMarkManager.SkidBufferPositions = new Float32Array(SkidMarkManager.MAX_MARKS * 4 * 3);
                SkidMarkManager.SkidBufferNormals = new Float32Array(SkidMarkManager.MAX_MARKS * 4 * 3);
                SkidMarkManager.SkidBufferTangents = new Float32Array(SkidMarkManager.MAX_MARKS * 4 * 4);
                SkidMarkManager.SkidBufferColors = new Float32Array(SkidMarkManager.MAX_MARKS * 4 * 4);
                SkidMarkManager.SkidBufferUvs = new Float32Array(SkidMarkManager.MAX_MARKS * 4 * 2);
                SkidMarkManager.SkidBufferIndices = new Int32Array(SkidMarkManager.MAX_MARKS * 6);
                // ..
                // Apply Raw Vertex Buffer Data To Mesh
                // ..
                const vertexData = new BABYLON.VertexData();
                vertexData.positions = SkidMarkManager.SkidBufferPositions;
                vertexData.normals = SkidMarkManager.SkidBufferNormals;
                vertexData.tangents = SkidMarkManager.SkidBufferTangents;
                vertexData.colors = SkidMarkManager.SkidBufferColors;
                vertexData.uvs = SkidMarkManager.SkidBufferUvs;
                vertexData.indices = SkidMarkManager.SkidBufferIndices;
                vertexData.applyToMesh(SkidMarkManager.SkidMarkMesh, true);
                SkidMarkManager.SkidMarkMesh.freezeWorldMatrix();
            }
        }
        static AddSkidMarkVertexData() {
            const curr = SkidMarkManager.SkidMarkSections[SkidMarkManager.SkidMarkIndex];
            if (curr.LastIndex === -1)
                return;
            const last = SkidMarkManager.SkidMarkSections[curr.LastIndex];
            SkidMarkManager.SkidMarkUpdated = true;
            // ..
            // Update Position Buffers Directly
            // ..
            let index = SkidMarkManager.SkidMarkIndex * 4 + 0;
            SkidMarkManager.SkidBufferPositions[index * 3] = last.Posl.x;
            SkidMarkManager.SkidBufferPositions[(index * 3) + 1] = last.Posl.y;
            SkidMarkManager.SkidBufferPositions[(index * 3) + 2] = last.Posl.z;
            index = SkidMarkManager.SkidMarkIndex * 4 + 1;
            SkidMarkManager.SkidBufferPositions[index * 3] = last.Posr.x;
            SkidMarkManager.SkidBufferPositions[(index * 3) + 1] = last.Posr.y;
            SkidMarkManager.SkidBufferPositions[(index * 3) + 2] = last.Posr.z;
            index = SkidMarkManager.SkidMarkIndex * 4 + 2;
            SkidMarkManager.SkidBufferPositions[index * 3] = curr.Posl.x;
            SkidMarkManager.SkidBufferPositions[(index * 3) + 1] = curr.Posl.y;
            SkidMarkManager.SkidBufferPositions[(index * 3) + 2] = curr.Posl.z;
            index = SkidMarkManager.SkidMarkIndex * 4 + 3;
            SkidMarkManager.SkidBufferPositions[index * 3] = curr.Posr.x;
            SkidMarkManager.SkidBufferPositions[(index * 3) + 1] = curr.Posr.y;
            SkidMarkManager.SkidBufferPositions[(index * 3) + 2] = curr.Posr.z;
            // ..
            // Update Normal Buffers Directly
            // ..
            index = SkidMarkManager.SkidMarkIndex * 4 + 0;
            SkidMarkManager.SkidBufferNormals[index * 3] = last.Normal.x;
            SkidMarkManager.SkidBufferNormals[(index * 3) + 1] = last.Normal.y;
            SkidMarkManager.SkidBufferNormals[(index * 3) + 2] = last.Normal.z;
            index = SkidMarkManager.SkidMarkIndex * 4 + 1;
            SkidMarkManager.SkidBufferNormals[index * 3] = last.Normal.x;
            SkidMarkManager.SkidBufferNormals[(index * 3) + 1] = last.Normal.y;
            SkidMarkManager.SkidBufferNormals[(index * 3) + 2] = last.Normal.z;
            index = SkidMarkManager.SkidMarkIndex * 4 + 2;
            SkidMarkManager.SkidBufferNormals[index * 3] = curr.Normal.x;
            SkidMarkManager.SkidBufferNormals[(index * 3) + 1] = curr.Normal.y;
            SkidMarkManager.SkidBufferNormals[(index * 3) + 2] = curr.Normal.z;
            index = SkidMarkManager.SkidMarkIndex * 4 + 3;
            SkidMarkManager.SkidBufferNormals[index * 3] = curr.Normal.x;
            SkidMarkManager.SkidBufferNormals[(index * 3) + 1] = curr.Normal.y;
            SkidMarkManager.SkidBufferNormals[(index * 3) + 2] = curr.Normal.z;
            // ..
            // Update Tangent Buffers Directly
            // ..
            index = SkidMarkManager.SkidMarkIndex * 4 + 0;
            SkidMarkManager.SkidBufferTangents[index * 4] = last.Tangent.x;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 1] = last.Tangent.y;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 2] = last.Tangent.z;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 3] = last.Tangent.w;
            index = SkidMarkManager.SkidMarkIndex * 4 + 1;
            SkidMarkManager.SkidBufferTangents[index * 4] = last.Tangent.x;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 1] = last.Tangent.y;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 2] = last.Tangent.z;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 3] = last.Tangent.w;
            index = SkidMarkManager.SkidMarkIndex * 4 + 2;
            SkidMarkManager.SkidBufferTangents[index * 4] = curr.Tangent.x;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 1] = curr.Tangent.y;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 2] = curr.Tangent.z;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 3] = curr.Tangent.w;
            index = SkidMarkManager.SkidMarkIndex * 4 + 3;
            SkidMarkManager.SkidBufferTangents[index * 4] = curr.Tangent.x;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 1] = curr.Tangent.y;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 2] = curr.Tangent.z;
            SkidMarkManager.SkidBufferTangents[(index * 4) + 3] = curr.Tangent.w;
            // ..
            // Update Color Buffers Directly
            // ..
            index = SkidMarkManager.SkidMarkIndex * 4 + 0;
            SkidMarkManager.SkidBufferColors[index * 4] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 1] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 2] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 3] = last.Intensity;
            index = SkidMarkManager.SkidMarkIndex * 4 + 1;
            SkidMarkManager.SkidBufferColors[index * 4] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 1] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 2] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 3] = last.Intensity;
            index = SkidMarkManager.SkidMarkIndex * 4 + 2;
            SkidMarkManager.SkidBufferColors[index * 4] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 1] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 2] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 3] = curr.Intensity;
            index = SkidMarkManager.SkidMarkIndex * 4 + 3;
            SkidMarkManager.SkidBufferColors[index * 4] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 1] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 2] = 1.0;
            SkidMarkManager.SkidBufferColors[(index * 4) + 3] = curr.Intensity;
            // ..
            // Update Coord Buffers Directly
            // ..
            index = SkidMarkManager.SkidMarkIndex * 4 + 0;
            SkidMarkManager.SkidBufferUvs[index * 2] = 0;
            SkidMarkManager.SkidBufferUvs[(index * 2) + 1] = 0;
            index = SkidMarkManager.SkidMarkIndex * 4 + 1;
            SkidMarkManager.SkidBufferUvs[index * 2] = 1;
            SkidMarkManager.SkidBufferUvs[(index * 2) + 1] = 0;
            index = SkidMarkManager.SkidMarkIndex * 4 + 2;
            SkidMarkManager.SkidBufferUvs[index * 2] = 0;
            SkidMarkManager.SkidBufferUvs[(index * 2) + 1] = 1;
            index = SkidMarkManager.SkidMarkIndex * 4 + 3;
            SkidMarkManager.SkidBufferUvs[index * 2] = 1;
            SkidMarkManager.SkidBufferUvs[(index * 2) + 1] = 1;
            // ..
            // Update Triangle 1 Buffers Directly (QUAD)
            //..
            SkidMarkManager.SkidBufferIndices[SkidMarkManager.SkidMarkIndex * 6 + 0] = SkidMarkManager.SkidMarkIndex * 4 + 0;
            SkidMarkManager.SkidBufferIndices[SkidMarkManager.SkidMarkIndex * 6 + 2] = SkidMarkManager.SkidMarkIndex * 4 + 1;
            SkidMarkManager.SkidBufferIndices[SkidMarkManager.SkidMarkIndex * 6 + 1] = SkidMarkManager.SkidMarkIndex * 4 + 2;
            // ..
            // Update Triangle 2 Buffers Directly (QUAD)
            // ..
            SkidMarkManager.SkidBufferIndices[SkidMarkManager.SkidMarkIndex * 6 + 3] = SkidMarkManager.SkidMarkIndex * 4 + 2;
            SkidMarkManager.SkidBufferIndices[SkidMarkManager.SkidMarkIndex * 6 + 5] = SkidMarkManager.SkidMarkIndex * 4 + 1;
            SkidMarkManager.SkidBufferIndices[SkidMarkManager.SkidMarkIndex * 6 + 4] = SkidMarkManager.SkidMarkIndex * 4 + 3;
        }
        static UpdateSkidMarkManager() {
            if (SkidMarkManager.SkidMarkMesh != null && SkidMarkManager.SkidMarkUpdated === true) {
                SkidMarkManager.SkidMarkUpdated = false;
                if (SkidMarkManager.SkidMarkMesh.geometry != null) {
                    SkidMarkManager.SkidMarkMesh.geometry.updateVerticesDataDirectly(BABYLON.VertexBuffer.PositionKind, SkidMarkManager.SkidBufferPositions, 0, false);
                    SkidMarkManager.SkidMarkMesh.geometry.updateVerticesDataDirectly(BABYLON.VertexBuffer.NormalKind, SkidMarkManager.SkidBufferNormals, 0, false);
                    SkidMarkManager.SkidMarkMesh.geometry.updateVerticesDataDirectly(BABYLON.VertexBuffer.TangentKind, SkidMarkManager.SkidBufferTangents, 0, false);
                    SkidMarkManager.SkidMarkMesh.geometry.updateVerticesDataDirectly(BABYLON.VertexBuffer.ColorKind, SkidMarkManager.SkidBufferColors, 0, false);
                    SkidMarkManager.SkidMarkMesh.geometry.updateVerticesDataDirectly(BABYLON.VertexBuffer.UVKind, SkidMarkManager.SkidBufferUvs, 0, false);
                    SkidMarkManager.SkidMarkMesh.geometry.updateIndices(SkidMarkManager.SkidBufferIndices, 0, SkidMarkManager.GPU_TRIANGLES);
                }
            }
        }
    }
    SkidMarkManager.MAX_MARKS = 1024; // Max number of marks total for everyone together
    SkidMarkManager.GROUND_OFFSET = 0.01; // Distance above surface in metres
    SkidMarkManager.GPU_TRIANGLES = true; // GPU quad triangle indices only
    SkidMarkManager.MARK_COLOR = BABYLON.Color3.Black(); // SkidMark Color
    SkidMarkManager.MARK_WIDTH = 0.3; // Width of the SkidMarks. Should match the width of the wheels
    SkidMarkManager.TEX_INTENSITY = 1.0; // Amount of the skidmark texture intensity coeffecient
    SkidMarkManager.MIN_DISTANCE = 0.1; // Distance between skid texture sections in metres. Bigger = better performance, less smooth
    SkidMarkManager.MIN_SQR_DISTANCE = (SkidMarkManager.MIN_DISTANCE * SkidMarkManager.MIN_DISTANCE);
    SkidMarkManager.TEXTURE_MARKS = null;
    SkidMarkManager.SkidBufferPositions = null;
    SkidMarkManager.SkidBufferNormals = null;
    SkidMarkManager.SkidBufferTangents = null;
    SkidMarkManager.SkidBufferColors = null;
    SkidMarkManager.SkidBufferUvs = null;
    SkidMarkManager.SkidBufferIndices = null;
    SkidMarkManager.SkidMarkSections = null;
    SkidMarkManager.SkidMarkIndex = 0;
    SkidMarkManager.SkidMarkMesh = null;
    SkidMarkManager.SkidMarkUpdated = false;
    SkidMarkManager.TempVector3_POS = new BABYLON.Vector3(0, 0, 0);
    SkidMarkManager.TempVector3_DIR = new BABYLON.Vector3(0, 0, 0);
    SkidMarkManager.TempVector3_XDIR = new BABYLON.Vector3(0, 0, 0);
    SkidMarkManager.TempVector3_SDIR = new BABYLON.Vector3(0, 0, 0);
    PROJECT.SkidMarkManager = SkidMarkManager;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon standard rigidbody vehicle controller class (Native Bullet Physics 2.82)
     * @class StandardCarController
     */
    class StandardCarController extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.MIN_RPM = 1000;
            this.MAX_RPM = 6000;
            this._rigidbody = null;
            this._engineAudioSource = null;
            this._skidAudioSource = null;
            this.gearIndex = 0; // First Gear Ratio
            this.downShift = 1000;
            this.shiftingTime = 0;
            this.engineForce = 0;
            this.handBraking = false;
            this.linearDamping = 0;
            this.angularDamping = 0;
            this.forwardSpeed = 0;
            this.absoluteSpeed = 0;
            this.americanSpeed = 0;
            this.normalizedSpeed = 0;
            this.frontWheelPower = 0;
            this.backWheelPower = 0;
            this.wheelBrakingForce = 0;
            this.visualSteerAngle = 0;
            this.physicsSteerAngle = 0;
            this.normalizationSpeed = 100;
            this.raycastVehicle = null;
            this.brakeLightsMesh = null;
            this.brakeLightsTrans = null;
            this.reverseLightsMesh = null;
            this.reverseLightsTrans = null;
            this.frontLeftWheelTrans = null;
            this.frontRightWheelTrans = null;
            this.backLeftWheelTrans = null;
            this.backRightWheelTrans = null;
            this.frontLeftWheelMesh = null;
            this.frontRightWheelMesh = null;
            this.backLeftWheelMesh = null;
            this.backRightWheelMesh = null;
            this.frontLeftWheelEmitter = null;
            this.frontRightWheelEmitter = null;
            this.backLeftWheelEmitter = null;
            this.backRightWheelEmitter = null;
            this.frontLeftWheelParticle = null;
            this.frontRightWheelParticle = null;
            this.backLeftWheelParticle = null;
            this.backRightWheelParticle = null;
            this.frontLeftWheelCollider = null;
            this.frontRightWheelCollider = null;
            this.backLeftWheelCollider = null;
            this.backRightWheelCollider = null;
            this.engineTorqueCurve = null;
            this.wheelRadius = 0;
            this.clutchSlip = 0;
            this.engineRPM = 0;
            this.pitchRPM = 0;
            this.shiftRPM = 0;
            this.SKID_FL = 0;
            this.SKID_FR = 0;
            this.SKID_RL = 0;
            this.SKID_RR = 0;
            this.FRONT_LEFT = -1;
            this.FRONT_RIGHT = -1;
            this.BACK_LEFT = -1;
            this.BACK_RIGHT = -1;
            this.smokeTexture = null;
            this.skidThreashold = 0.55;
            this.skidDrawVelocity = 0.02;
            this.smokeIntensity = 250;
            this.smokeOpacity = 0.1;
            this.smokeDonuts = 2.0;
            this.maxTurnAngle = 20;
            this.maxBurnAngle = 50;
            this.maxSteerBoost = 3;
            this.overSteerSpeed = 1.0;
            this.topEngineSpeed = 125;
            this.powerCoefficient = 1.0;
            this.frictionLerpSpeed = 0.5;
            this.lowSpeedAngle = 10;
            this.highSpeedAngle = 1;
            this.lowSpeedTurning = 0.015;
            this.highSpeedTurning = 0.005;
            // DEPRECIATED: public rayTestingType:number = 0;
            // DEPRECIATED: public testPointCount:number = 32;
            // DEPRECIATED: public sweepPenetration:number = 0.0;
            this.stableDownImpulse = 5;
            this.roadConnectAccel = 5;
            this.totalImpulseForces = 100;
            this.smoothFlyingForce = 250;
            this.transmissionRatio = 0.75;
            this.differentialRatio = 3.55;
            this.maxFrontBraking = 0.0;
            this.maxReversePower = 0.25;
            this.minBrakingForce = 50;
            this.maxBrakingForce = 150;
            this.handBrakingForce = 2500;
            this.linearBrakingForce = 0.25;
            this.angularBrakingForce = 0.0;
            this.burnoutTimeDelay = 1;
            this.burnoutWheelPitch = 0.85;
            this.burnoutCoefficient = 10;
            this.burnoutTriggerMark = 10;
            this.maxThrottleBurnouts = false;
            this.playVehicleSounds = false;
            this.wheelDriveType = 0;
            this.gearBoxMaxPitching = 6500;
            this.gearBoxShiftChange = 4500;
            this.gearBoxShiftDelay = 0.35;
            this.gearBoxShiftRatios = [4.17, 2.34, 1.52, 1.14, 0.89, 0.68];
            this.gearBoxShiftRanges = [1000, 2400, 2800, 3200, 3200, 3200];
            this.slideWhenFootBraking = false;
            this.throttleBrakingForce = 0;
            this.throttleEngineSpeed = 0;
            this.powerSlideFriction = 1.0;
            this.wheelSkidFriction = 1.0;
            this.skiddingLerpSpeed = 0.25;
            this.burnoutLerpSpeed = 0.05;
            this.lowSpeedTurnRate = 2.0;
            this.highSpeedTurnRate = 10.0;
            this.m_physicsWorld = null;
            this.m_frontLeftWheel = null;
            this.m_frontRightWheel = null;
            this.m_backLeftWheel = null;
            this.m_backRightWheel = null;
            this.m_frontLeftWheelSkid = -1;
            this.m_frontRightWheelSkid = -1;
            this.m_backLeftWheelSkid = -1;
            this.m_backRightWheelSkid = -1;
            this.m_velocityOffset = new BABYLON.Vector3(0, 0, 0);
            this.m_angularDampener = new BABYLON.Vector3(1.0, 1.0, 1.0);
            ////////////////////////////////////////////////////
            // Public Vehicle Controller Movement Functions   //
            ////////////////////////////////////////////////////
            this.burnoutTimer = 0;
            this.restoreTimer = 0;
            this.cooldownTimer = 0;
            this.wheelDonuts = false;
            this.wheelBurnout = false;
            this.wheelSkidding = false;
            this.donutSpinTime = 0;
            this.currentForward = 0;
            this.currentTurning = 0;
            this.currentSkidding = false;
            this.currentDrifting = false;
            this.allowedTurningAngle = 0;
            this.allowedTurningIncement = 0;
        }
        getFootBraking() { return (this.currentForward < 0 && this.forwardSpeed > 1); }
        getHandBraking() { return this.handBraking; }
        getPowerSliding() { return (this.getFootBraking() === true && this.slideWhenFootBraking === true); }
        getCurrentForward() { return this.currentForward; }
        getCurrentTurning() { return this.currentTurning; }
        getCurrentSkidding() { return this.currentSkidding; }
        getCurrentDrifting() { return this.currentDrifting; }
        getReverseThrottle() { return (this.currentForward < 0 && this.forwardSpeed < 0); }
        getFrontLeftSkid() { return this.SKID_FL; }
        getFrontRightSkid() { return this.SKID_FR; }
        getBackLeftSkid() { return this.SKID_RL; }
        getBackRightSkid() { return this.SKID_RR; }
        getRigidbodyPhysics() { return this._rigidbody; }
        getRaycastVehicle() { return this.raycastVehicle; }
        getForwardSpeed() { return this.forwardSpeed; }
        getAbsoluteSpeed() { return this.absoluteSpeed; }
        getAmericanSpeed() { return this.americanSpeed; }
        getNormalizedSpeed() { return this.normalizedSpeed; }
        getCurrentGearIndex() { return this.gearIndex; }
        getCurrentEngineRPM() { return this.engineRPM; }
        getCurrentEnginePitch() { return BABYLON.Scalar.Clamp((this.pitchRPM / this.gearBoxMaxPitching) + 0.1); }
        getGearShiftRatioCount() { return (this.gearBoxShiftRatios != null) ? this.gearBoxShiftRatios.length : 0; }
        getSmokeTextureMask() { return this.smokeTexture; }
        getBrakeLightsMesh() { return this.brakeLightsMesh; }
        getReverseLightsMesh() { return this.reverseLightsMesh; }
        getFrontLeftWheelNode() { return this.frontLeftWheelMesh; }
        getFrontRightWheelNode() { return this.frontRightWheelMesh; }
        getBackLeftWheelNode() { return this.backLeftWheelMesh; }
        getBackRightWheelNode() { return this.backRightWheelMesh; }
        getWheelBurnoutEnabled() { return this.wheelBurnout; }
        getWheelDonutsEnabled() { return this.wheelDonuts; }
        getCurrentDonutSpinTime() { return this.donutSpinTime; }
        awake() { this.awakeVehicleState(); }
        start() { this.initVehicleState(); }
        destroy() { this.destroyVehicleState(); }
        //////////////////////////////////////////////////
        // Protected Vehicle Movement State Functions //
        //////////////////////////////////////////////////
        awakeVehicleState() {
            this.engineForce = 0;
            this.frontWheelPower = 0;
            this.backWheelPower = 0;
            this.wheelBrakingForce = 0;
            this.visualSteerAngle = 0;
            this.physicsSteerAngle = 0;
            this.m_physicsWorld = BABYLON.SceneManager.GetPhysicsWorld(this.scene);
            // DEPRECIATED: this.rayTestingType = this.getProperty("rayTestingType", this.rayTestingType);
            // DEPRECIATED: this.testPointCount = this.getProperty("testPointCount", this.testPointCount);
            // DEPRECIATED: this.sweepPenetration = this.getProperty("sweepPenetration", this.sweepPenetration);
            this.skidDrawVelocity = this.getProperty("skidDrawVelocity", this.skidDrawVelocity);
            this.skidThreashold = this.getProperty("skidThreashold", this.skidThreashold);
            this.skidDrawVelocity = this.getProperty("skidDrawVelocity", this.skidDrawVelocity);
            this.smokeIntensity = this.getProperty("smokeIntensity", this.smokeIntensity);
            this.smokeOpacity = this.getProperty("smokeOpacity", this.smokeOpacity);
            this.smokeDonuts = this.getProperty("smokeDonuts", this.smokeDonuts);
            this.topEngineSpeed = this.getProperty("topEngineSpeed", this.topEngineSpeed);
            this.powerCoefficient = this.getProperty("powerCoefficient", this.powerCoefficient);
            this.maxFrontBraking = this.getProperty("maxFrontBraking", this.maxFrontBraking);
            this.maxReversePower = this.getProperty("maxReversePower", this.maxReversePower);
            this.stableDownImpulse = this.getProperty("stableDownImpulse", this.stableDownImpulse);
            this.roadConnectAccel = this.getProperty("roadConnectAccel", this.roadConnectAccel);
            this.smoothFlyingForce = this.getProperty("smoothFlyingForce", this.smoothFlyingForce);
            this.totalImpulseForces = this.getProperty("totalImpulseForces", this.totalImpulseForces);
            this.frictionLerpSpeed = this.getProperty("frictionLerpSpeed", this.frictionLerpSpeed);
            this.maxTurnAngle = this.getProperty("maxTurnAngle", this.maxTurnAngle);
            this.maxBurnAngle = this.getProperty("maxBurnAngle", this.maxBurnAngle);
            this.maxSteerBoost = this.getProperty("maxSteerBoost", this.maxSteerBoost);
            this.overSteerSpeed = this.getProperty("overSteerSpeed", this.overSteerSpeed);
            this.lowSpeedAngle = this.getProperty("lowSpeedAngle", this.lowSpeedAngle);
            this.highSpeedAngle = this.getProperty("highSpeedAngle", this.highSpeedAngle);
            this.wheelDriveType = this.getProperty("wheelDriveType", this.wheelDriveType);
            this.minBrakingForce = this.getProperty("minBrakingForce", this.minBrakingForce);
            this.maxBrakingForce = this.getProperty("maxBrakingForce", this.maxBrakingForce);
            this.handBrakingForce = this.getProperty("handBrakingForce", this.handBrakingForce);
            this.linearBrakingForce = this.getProperty("linearBrakingForce", this.linearBrakingForce);
            this.angularBrakingForce = this.getProperty("angularBrakingForce", this.angularBrakingForce);
            this.lowSpeedTurning = this.getProperty("lowSpeedTurning", this.lowSpeedTurning);
            this.highSpeedTurning = this.getProperty("highSpeedTurning", this.highSpeedTurning);
            this.brakeLightsTrans = this.getProperty("brakeLightsMesh", this.brakeLightsTrans);
            this.reverseLightsTrans = this.getProperty("reverseLightsMesh", this.reverseLightsTrans);
            this.frontLeftWheelTrans = this.getProperty("frontLeftWheelMesh", this.frontLeftWheelTrans);
            this.frontRightWheelTrans = this.getProperty("frontRightWheelMesh", this.frontRightWheelTrans);
            this.backLeftWheelTrans = this.getProperty("rearLeftWheelMesh", this.backLeftWheelTrans);
            this.backRightWheelTrans = this.getProperty("rearRightWheelMesh", this.backRightWheelTrans);
            this.frontLeftWheelCollider = this.getProperty("frontLeftWheelCollider", this.frontLeftWheelCollider);
            this.frontRightWheelCollider = this.getProperty("frontRightWheelCollider", this.frontRightWheelCollider);
            this.backLeftWheelCollider = this.getProperty("rearLeftWheelCollider", this.backLeftWheelCollider);
            this.backRightWheelCollider = this.getProperty("rearRightWheelCollider", this.backRightWheelCollider);
            this.lowSpeedTurnRate = this.getProperty("lowSpeedTurnRate", this.lowSpeedTurnRate);
            this.highSpeedTurnRate = this.getProperty("highSpeedTurnRate", this.highSpeedTurnRate);
            this.burnoutTimeDelay = this.getProperty("burnoutTimeDelay", this.burnoutTimeDelay);
            this.burnoutWheelPitch = this.getProperty("burnoutWheelPitch", this.burnoutWheelPitch);
            this.burnoutCoefficient = this.getProperty("burnoutCoefficient", this.burnoutCoefficient);
            this.burnoutTriggerMark = this.getProperty("burnoutTriggerMark", this.burnoutTriggerMark);
            this.maxThrottleBurnouts = this.getProperty("maxThrottleBurnouts", this.maxThrottleBurnouts);
            this.playVehicleSounds = this.getProperty("playVehicleSounds", this.playVehicleSounds);
            this.differentialRatio = this.getProperty("gearBoxDifferential", this.differentialRatio);
            this.transmissionRatio = this.getProperty("gearBoxOverdrive", this.transmissionRatio);
            this.gearBoxMaxPitching = this.getProperty("gearBoxMaxPitching", this.gearBoxMaxPitching);
            this.gearBoxShiftChange = this.getProperty("gearBoxShiftChange", this.gearBoxShiftChange);
            this.gearBoxShiftDelay = this.getProperty("gearBoxShiftDelay", this.gearBoxShiftDelay);
            this.gearBoxShiftRatios = this.getProperty("gearBoxShiftRatios", this.gearBoxShiftRatios);
            this.gearBoxShiftRanges = this.getProperty("gearBoxShiftRanges", this.gearBoxShiftRanges);
            this.normalizationSpeed = this.getProperty("normalizationSpeed", this.normalizationSpeed);
            this.MIN_RPM = this.getProperty("gearBoxMinPower", this.MIN_RPM);
            this.MAX_RPM = this.getProperty("gearBoxMaxPower", this.MAX_RPM);
            if (this.maxTurnAngle <= 0)
                this.maxTurnAngle = 20;
            if (this.maxBurnAngle <= 0)
                this.maxBurnAngle = 50;
            if (this.stableDownImpulse <= 0)
                this.stableDownImpulse = 0;
            if (this.roadConnectAccel <= 0)
                this.roadConnectAccel = 0;
            if (this.smoothFlyingForce <= 0)
                this.smoothFlyingForce = 0;
            if (this.maxFrontBraking <= 0)
                this.maxFrontBraking = 0;
            if (this.maxReversePower <= 0)
                this.maxReversePower = 0.25;
            if (this.lowSpeedAngle <= 0)
                this.lowSpeedAngle = 10;
            if (this.highSpeedAngle <= 0)
                this.highSpeedAngle = 1;
            if (this.lowSpeedTurning <= 0)
                this.lowSpeedTurning = 0.015;
            if (this.highSpeedTurning <= 0)
                this.highSpeedTurning = 0.005;
            if (this.powerCoefficient <= 0)
                this.powerCoefficient = 1.0;
            if (this.topEngineSpeed <= 0)
                this.topEngineSpeed = 125;
            if (this.normalizationSpeed <= 0)
                this.normalizationSpeed = 100;
            if (this.gearBoxMaxPitching <= 0)
                this.gearBoxMaxPitching = 6500;
            if (this.gearBoxShiftChange <= 0)
                this.gearBoxShiftChange = 4500;
            if (this.gearBoxShiftDelay <= 0)
                this.gearBoxShiftDelay = 0.35;
            if (this.transmissionRatio <= 0)
                this.transmissionRatio = 1;
            if (this.differentialRatio <= 0)
                this.differentialRatio = 1;
            if (this.frictionLerpSpeed <= 0)
                this.frictionLerpSpeed = 1;
            if (this.skiddingLerpSpeed <= 0)
                this.skiddingLerpSpeed = 1;
            if (this.burnoutLerpSpeed <= 0)
                this.burnoutLerpSpeed = 1;
            if (this.burnoutTimeDelay <= 0)
                this.burnoutTimeDelay = 1;
            if (this.burnoutWheelPitch <= 0)
                this.burnoutWheelPitch = 1;
            const angularDampener = this.getProperty("angularDampener");
            if (angularDampener != null)
                this.m_angularDampener = BABYLON.Utilities.ParseVector3(angularDampener);
            const smokeTextureInfo = this.getProperty("smokeTexture");
            if (smokeTextureInfo != null) {
                this.smokeTexture = BABYLON.Utilities.ParseTexture(smokeTextureInfo, this.scene);
            }
            const engineTorqueInfo = this.getProperty("engineTorque");
            if (engineTorqueInfo != null && engineTorqueInfo.animation != null) {
                this.engineTorqueCurve = BABYLON.Animation.Parse(engineTorqueInfo.animation);
            }
            if (this.engineTorqueCurve == null)
                BABYLON.SceneManager.LogWarning("Failed to parse engine torque curve for: " + this.transform.name);
        }
        initVehicleState() {
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
            // Setup Engine Audio
            this._engineAudioSource = this.getComponent("BABYLON.AudioSource");
            if (this._engineAudioSource == null)
                BABYLON.SceneManager.LogWarning("No engine audio source manager found for: " + this.transform.name);
            // Setup Raycast Vehicle
            this._rigidbody = this.getComponent("BABYLON.RigidbodyPhysics");
            if (this._rigidbody != null) {
                this.raycastVehicle = BABYLON.RaycastVehicle.GetInstance(this.scene, this._rigidbody, this.m_angularDampener);
                if (this.raycastVehicle != null) {
                    this.linearDamping = this._rigidbody.getLinearDamping();
                    this.angularDamping = this._rigidbody.getAngularDamping();
                    const brakeLightslName = (this.brakeLightsTrans != null && this.brakeLightsTrans.name != null && this.brakeLightsTrans.name !== "") ? this.brakeLightsTrans.name : null;
                    const reverseLightslName = (this.reverseLightsTrans != null && this.reverseLightsTrans.name != null && this.reverseLightsTrans.name !== "") ? this.reverseLightsTrans.name : null;
                    const frontLeftWheelName = (this.frontLeftWheelTrans != null && this.frontLeftWheelTrans.name != null && this.frontLeftWheelTrans.name !== "") ? this.frontLeftWheelTrans.name : null;
                    const frontRightWheelName = (this.frontRightWheelTrans != null && this.frontRightWheelTrans.name != null && this.frontRightWheelTrans.name !== "") ? this.frontRightWheelTrans.name : null;
                    const backLeftWheelName = (this.backLeftWheelTrans != null && this.backLeftWheelTrans.name != null && this.backLeftWheelTrans.name !== "") ? this.backLeftWheelTrans.name : null;
                    const backRightWheelName = (this.backRightWheelTrans != null && this.backRightWheelTrans.name != null && this.backRightWheelTrans.name !== "") ? this.backRightWheelTrans.name : null;
                    const frontLeftWheelLabel = (this.frontLeftWheelCollider != null && this.frontLeftWheelCollider.name != null && this.frontLeftWheelCollider.name !== "") ? this.frontLeftWheelCollider.name : null;
                    const frontRightWheelLabel = (this.frontRightWheelCollider != null && this.frontRightWheelCollider.name != null && this.frontRightWheelCollider.name !== "") ? this.frontRightWheelCollider.name : null;
                    const backLeftWheelLabel = (this.backLeftWheelCollider != null && this.backLeftWheelCollider.name != null && this.backLeftWheelCollider.name !== "") ? this.backLeftWheelCollider.name : null;
                    const backRightWheelLabel = (this.backRightWheelCollider != null && this.backRightWheelCollider.name != null && this.backRightWheelCollider.name !== "") ? this.backRightWheelCollider.name : null;
                    // Get Wheel Indexs From Wheel Names
                    if (frontLeftWheelLabel != null)
                        this.FRONT_LEFT = this.raycastVehicle.getWheelIndexByName(frontLeftWheelLabel);
                    if (frontRightWheelLabel != null)
                        this.FRONT_RIGHT = this.raycastVehicle.getWheelIndexByName(frontRightWheelLabel);
                    if (backLeftWheelLabel != null)
                        this.BACK_LEFT = this.raycastVehicle.getWheelIndexByName(backLeftWheelLabel);
                    if (backRightWheelLabel != null)
                        this.BACK_RIGHT = this.raycastVehicle.getWheelIndexByName(backRightWheelLabel);
                    // Get Brake & Reverse Lights Meshes
                    if (brakeLightslName != null) {
                        this.brakeLightsMesh = this.getChildNode(brakeLightslName, BABYLON.SearchType.IndexOf, false);
                        if (this.brakeLightsMesh != null) {
                            this.brakeLightsMesh.isVisible = false;
                        }
                    }
                    if (reverseLightslName != null) {
                        this.reverseLightsMesh = this.getChildNode(reverseLightslName, BABYLON.SearchType.IndexOf, false);
                        if (this.reverseLightsMesh != null) {
                            this.reverseLightsMesh.isVisible = false;
                        }
                    }
                    // Setup Wheel Info And Transform Meshes
                    if (this.raycastVehicle.getNumWheels() >= 4) {
                        if (this.BACK_LEFT >= 0 && backLeftWheelName != null) {
                            this.m_backLeftWheel = this.raycastVehicle.getWheelInfo(this.BACK_LEFT);
                            this.backLeftWheelMesh = this.getChildNode(backLeftWheelName, BABYLON.SearchType.IndexOf, false);
                            if (this.backLeftWheelMesh != null) {
                                this.m_backLeftWheel.spinner = BABYLON.SceneManager.FindChildTransformNode(this.backLeftWheelMesh, "Wheel", BABYLON.SearchType.IndexOf, true);
                                this.raycastVehicle.setWheelTransformMesh(this.BACK_LEFT, this.backLeftWheelMesh);
                                this.backLeftWheelEmitter = new BABYLON.AbstractMesh("Emitter_RL");
                                this.backLeftWheelEmitter.parent = this.m_backLeftWheel.spinner || this.backLeftWheelMesh;
                                this.backLeftWheelEmitter.position = new BABYLON.Vector3(0, 0, 0);
                                this.backLeftWheelParticle = this.createSmokeParticleSystem(this.transform.name + "Smoke_RL", this.backLeftWheelEmitter);
                                if (this.wheelDriveType === 0 || this.wheelDriveType === 2) { // REAR OR ALL WHEEL DRIVE
                                    if (this.wheelRadius <= 0 && this.m_backLeftWheel != null) {
                                        this.wheelRadius = this.m_backLeftWheel.get_m_wheelsRadius();
                                    }
                                }
                            }
                        }
                        if (this.BACK_RIGHT >= 0 && backRightWheelName != null) {
                            this.m_backRightWheel = this.raycastVehicle.getWheelInfo(this.BACK_RIGHT);
                            this.backRightWheelMesh = this.getChildNode(backRightWheelName, BABYLON.SearchType.IndexOf, false);
                            if (this.backRightWheelMesh != null) {
                                this.m_backRightWheel.spinner = BABYLON.SceneManager.FindChildTransformNode(this.backRightWheelMesh, "Wheel", BABYLON.SearchType.IndexOf, true);
                                this.raycastVehicle.setWheelTransformMesh(this.BACK_RIGHT, this.backRightWheelMesh);
                                this.backRightWheelEmitter = new BABYLON.AbstractMesh("Emitter_RR");
                                this.backRightWheelEmitter.parent = this.m_backRightWheel.spinner || this.backRightWheelMesh;
                                this.backRightWheelEmitter.position = new BABYLON.Vector3(0, 0, 0);
                                this.backRightWheelParticle = this.createSmokeParticleSystem(this.transform.name + "Smoke_RR", this.backRightWheelEmitter);
                                if (this.wheelDriveType === 0 || this.wheelDriveType === 2) { // REAR OR ALL WHEEL DRIVE
                                    if (this.wheelRadius <= 0 && this.m_backRightWheel != null) {
                                        this.wheelRadius = this.m_backRightWheel.get_m_wheelsRadius();
                                    }
                                }
                            }
                        }
                        if (this.FRONT_LEFT >= 0 && frontLeftWheelName != null) {
                            this.m_frontLeftWheel = this.raycastVehicle.getWheelInfo(this.FRONT_LEFT);
                            this.frontLeftWheelMesh = this.getChildNode(frontLeftWheelName, BABYLON.SearchType.IndexOf, false);
                            if (this.frontLeftWheelMesh != null) {
                                this.m_frontLeftWheel.spinner = BABYLON.SceneManager.FindChildTransformNode(this.frontLeftWheelMesh, "Wheel", BABYLON.SearchType.IndexOf, true);
                                this.raycastVehicle.setWheelTransformMesh(this.FRONT_LEFT, this.frontLeftWheelMesh);
                                this.frontLeftWheelEmitter = new BABYLON.AbstractMesh("Emitter_FL");
                                this.frontLeftWheelEmitter.parent = this.m_frontLeftWheel.spinner || this.frontLeftWheelMesh;
                                this.frontLeftWheelEmitter.position = new BABYLON.Vector3(0, 0, 0);
                                this.frontLeftWheelParticle = this.createSmokeParticleSystem(this.transform.name + "Smoke_FL", this.frontLeftWheelEmitter);
                                if (this.wheelDriveType === 1 || this.wheelDriveType === 2) { // FRONT OR ALL WHEEL DRIVE
                                    if (this.wheelRadius <= 0 && this.m_frontLeftWheel != null) {
                                        this.wheelRadius = this.m_frontLeftWheel.get_m_wheelsRadius();
                                    }
                                }
                            }
                        }
                        if (this.FRONT_RIGHT >= 0 && frontRightWheelName != null) {
                            this.m_frontRightWheel = this.raycastVehicle.getWheelInfo(this.FRONT_RIGHT);
                            this.frontRightWheelMesh = this.getChildNode(frontRightWheelName, BABYLON.SearchType.IndexOf, false);
                            if (this.frontRightWheelMesh != null) {
                                this.m_frontRightWheel.spinner = BABYLON.SceneManager.FindChildTransformNode(this.frontRightWheelMesh, "Wheel", BABYLON.SearchType.IndexOf, true);
                                this.raycastVehicle.setWheelTransformMesh(this.FRONT_RIGHT, this.frontRightWheelMesh);
                                this.frontRightWheelEmitter = new BABYLON.AbstractMesh("Emitter_FR");
                                this.frontRightWheelEmitter.parent = this.m_frontRightWheel.spinner || this.frontRightWheelMesh;
                                this.frontRightWheelEmitter.position = new BABYLON.Vector3(0, 0, 0);
                                this.frontRightWheelParticle = this.createSmokeParticleSystem(this.transform.name + "Smoke_FR", this.frontRightWheelEmitter);
                                if (this.wheelDriveType === 1 || this.wheelDriveType === 2) { // FRONT OR ALL WHEEL DRIVE
                                    if (this.wheelRadius <= 0 && this.m_frontRightWheel != null) {
                                        this.wheelRadius = this.m_frontRightWheel.get_m_wheelsRadius();
                                    }
                                }
                            }
                        }
                        // ..
                        // Setup Raycasting
                        // ..
                        // DEPRECIATED: this.raycastVehicle.setShapeTestingMode(this.rayTestingType === 1);
                        // DEPRECIATED: this.raycastVehicle.setShapeTestingSize(this.wheelRadius * 0.5);
                        // DEPRECIATED: this.raycastVehicle.setShapeTestingCount(this.testPointCount);
                        // DEPRECIATED: this.raycastVehicle.setSweepPenetration(this.sweepPenetration);
                        this.raycastVehicle.setEnableMultiRaycast(true);
                        this.raycastVehicle.setInterpolateNormals(true);
                        // ..
                        // Setup Stabilzation
                        // ..
                        const zforceOffset = -this.raycastVehicle.getCenterMassOffset().z;
                        this.raycastVehicle.setMinimumWheelContacts(4);
                        this.raycastVehicle.setSmoothFlyingImpulse(this.smoothFlyingForce);
                        this.raycastVehicle.setTrackConnectionAccel(this.roadConnectAccel);
                        this.raycastVehicle.setStabilizingForce(this.stableDownImpulse);
                        this.raycastVehicle.setMaxImpulseForce(this.totalImpulseForces);
                        // ..
                        // Setup Collision Filter
                        // ..
                        this.raycastVehicle.setCollisionFilterGroup(BABYLON.CollisionFilters.DefaultFilter);
                        this.raycastVehicle.setCollisionFilterMask(BABYLON.CollisionFilters.StaticFilter);
                        // ..
                        // Setup Skid Audio Sources
                        // ..
                        if (this._skidAudioSource == null && this.backRightWheelMesh != null)
                            this._skidAudioSource = BABYLON.SceneManager.FindScriptComponent(this.backRightWheelMesh, "BABYLON.AudioSource");
                        if (this._skidAudioSource == null && this.backLeftWheelMesh != null)
                            this._skidAudioSource = BABYLON.SceneManager.FindScriptComponent(this.backLeftWheelMesh, "BABYLON.AudioSource");
                        if (this._skidAudioSource == null && this.frontRightWheelMesh != null)
                            this._skidAudioSource = BABYLON.SceneManager.FindScriptComponent(this.frontRightWheelMesh, "BABYLON.AudioSource");
                        if (this._skidAudioSource == null && this.frontLeftWheelMesh != null)
                            this._skidAudioSource = BABYLON.SceneManager.FindScriptComponent(this.frontLeftWheelMesh, "BABYLON.AudioSource");
                        if (this._skidAudioSource == null)
                            BABYLON.SceneManager.LogWarning("No skid audio source manager found for: " + this.transform.name);
                    }
                    else {
                        BABYLON.SceneManager.LogWarning("Invalid vehicle controller wheel count info for: " + this.transform.name);
                    }
                }
                else {
                    BABYLON.SceneManager.LogWarning("No wheel collider information found for: " + this.transform.name);
                }
            }
            else {
                BABYLON.SceneManager.LogWarning("Failed to get rigidbody component: " + this.transform.name);
            }
        }
        destroyVehicleState() {
            this._rigidbody = null;
            this._engineAudioSource = null;
            this._skidAudioSource = null;
            if (this.m_frontLeftWheel != null) {
                Ammo.destroy(this.m_frontLeftWheel); // ???
                this.m_frontLeftWheel = null;
            }
            if (this.m_frontRightWheel != null) {
                Ammo.destroy(this.m_frontRightWheel); // ???
                this.m_frontRightWheel = null;
            }
            if (this.m_backLeftWheel != null) {
                Ammo.destroy(this.m_backLeftWheel); // ???
                this.m_backLeftWheel = null;
            }
            if (this.m_backRightWheel != null) {
                Ammo.destroy(this.m_backRightWheel); // ???
                this.m_backRightWheel = null;
            }
            this.m_physicsWorld = null;
            this.raycastVehicle = null;
            this.frontLeftWheelMesh = null;
            this.frontRightWheelMesh = null;
            this.backLeftWheelMesh = null;
            this.backRightWheelMesh = null;
            this.frontLeftWheelTrans = null;
            this.frontRightWheelTrans = null;
            this.backLeftWheelTrans = null;
            this.backRightWheelTrans = null;
            this.frontLeftWheelCollider = null;
            this.frontRightWheelCollider = null;
            this.backLeftWheelCollider = null;
            this.backRightWheelCollider = null;
        }
        /** Drives the raycast vehicle with the specfied movement properties. */
        drive(throttle, steering, braking, drifting, assisted = true, autopilot = false) {
            this.currentForward = BABYLON.Scalar.Clamp(throttle, -1, 1);
            this.currentTurning = BABYLON.Scalar.Clamp(steering, -1, 1);
            this.currentSkidding = braking;
            this.currentDrifting = drifting;
            // ..
            // Update Driving System
            // ..
            const lowSpeedFactor = (autopilot === true) ? this.lowSpeedTurnRate : 1;
            const highSpeedFactor = (autopilot === true) ? this.highSpeedTurnRate : 1;
            this.handBraking = (this.getCurrentSkidding() === true && this.handBrakingForce > 0);
            if (this._rigidbody == null || this.raycastVehicle == null)
                return;
            if (this.FRONT_LEFT >= 0 && this.FRONT_RIGHT >= 0 && this.BACK_LEFT >= 0 && this.BACK_RIGHT >= 0) {
                const deltaTime = this.getDeltaSeconds();
                this.engineForce = 0;
                this.wheelBrakingForce = 0;
                this.frontWheelPower = 0;
                this.backWheelPower = 0;
                // ..
                // Update Engine Forces
                // ..
                const throttleSpeed = (this.throttleEngineSpeed > 0) ? this.throttleEngineSpeed : this.topEngineSpeed;
                const gearShiftRatio = (this.gearBoxShiftRatios != null && this.gearBoxShiftRatios.length > this.gearIndex) ? this.gearBoxShiftRatios[this.gearIndex] : 1.0;
                const finalGearRatio = (gearShiftRatio * this.differentialRatio * this.transmissionRatio);
                const engineMotorTorque = this.getVehicleEngineTorque(this.engineRPM) * Math.abs(this.currentForward);
                const allowedEnginePower = (engineMotorTorque * finalGearRatio);
                let allowedBrakingForce = BABYLON.Scalar.Lerp(this.minBrakingForce, this.maxBrakingForce, this.normalizedSpeed) * Math.abs(this.currentForward);
                if (this.currentForward > 0 && this.wheelBurnout === true && this.wheelDonuts === true) {
                    this.engineForce = allowedEnginePower;
                }
                else {
                    if (this.currentForward > 0) { // Forward
                        // TODO - Support Right Handed
                        if (this.forwardSpeed < -1)
                            this.wheelBrakingForce = allowedBrakingForce;
                        else
                            this.engineForce = allowedEnginePower;
                    }
                    else if (this.currentForward < 0) { // Reverse
                        // TODO - Support Right Handed
                        if (this.forwardSpeed > 1)
                            this.wheelBrakingForce = allowedBrakingForce;
                        else
                            this.engineForce = -(allowedEnginePower * this.maxReversePower);
                    }
                    else { // Static
                        this.engineForce = 0;
                        this.wheelBrakingForce = 10;
                    }
                }
                if (this.shiftingTime > 0 || this.americanSpeed > throttleSpeed)
                    this.engineForce = 0;
                if (assisted === false) {
                    // ..
                    // Update Direct Steer Angle (Non Assisted)
                    // ..
                    let smoothVisualTurning = 0;
                    if (this.americanSpeed >= 10) {
                        let autoTurnAngle = BABYLON.Tools.ToRadians(BABYLON.Scalar.Lerp((this.lowSpeedAngle * lowSpeedFactor), (this.highSpeedAngle * highSpeedFactor), this.normalizedSpeed));
                        autoTurnAngle *= (BABYLON.Scalar.Lerp(this.lowSpeedTurning, this.highSpeedTurning, this.normalizedSpeed) * 100);
                        this.physicsSteerAngle = (this.currentTurning * autoTurnAngle);
                        smoothVisualTurning = (this.currentTurning * BABYLON.Tools.ToRadians(this.maxTurnAngle));
                        if (this.maxSteerBoost > 0 && Math.abs(this.currentTurning) >= 0.1) {
                            smoothVisualTurning += (BABYLON.Tools.ToRadians(this.maxSteerBoost) * Math.sign(this.currentTurning));
                        }
                    }
                    else {
                        this.physicsSteerAngle = this.currentTurning * BABYLON.Tools.ToRadians(this.maxTurnAngle);
                        smoothVisualTurning = this.currentTurning * BABYLON.Tools.ToRadians(this.maxTurnAngle);
                    }
                    if (this.overSteerSpeed > 0 && this.handBraking === true) {
                        smoothVisualTurning *= -1; // Note: Invert Over Steering Angle
                    }
                    const smoothSteerAmount = (this.overSteerSpeed > 0) ? this.overSteerSpeed : 1.0;
                    this.visualSteerAngle = BABYLON.Scalar.Lerp(this.visualSteerAngle, smoothVisualTurning, (smoothSteerAmount * deltaTime * 9));
                }
                else {
                    // ..
                    // Update Physics Turn Angle (Assisted Steering)
                    // ..
                    this.allowedTurningIncement = BABYLON.Scalar.Lerp(this.lowSpeedTurning, this.highSpeedTurning, this.normalizedSpeed);
                    if (this.americanSpeed >= 10) {
                        this.allowedTurningAngle = BABYLON.Scalar.Lerp(BABYLON.Tools.ToRadians((this.lowSpeedAngle * lowSpeedFactor)), BABYLON.Tools.ToRadians((this.highSpeedAngle * highSpeedFactor)), this.normalizedSpeed);
                    }
                    else {
                        this.allowedTurningAngle = BABYLON.Tools.ToRadians(this.maxTurnAngle);
                    }
                    if (this.wheelBurnout === true && this.wheelDonuts === true) {
                        this.allowedTurningAngle = BABYLON.Tools.ToRadians(this.maxBurnAngle);
                    }
                    if (this.currentTurning > 0) { // Right
                        if (this.physicsSteerAngle < this.allowedTurningAngle) {
                            this.physicsSteerAngle += (this.allowedTurningIncement);
                        }
                    }
                    else if (this.currentTurning < 0) { // Left
                        if (this.physicsSteerAngle > -this.allowedTurningAngle) {
                            this.physicsSteerAngle -= (this.allowedTurningIncement);
                        }
                    }
                    else {
                        if (this.physicsSteerAngle < -this.allowedTurningIncement) {
                            this.physicsSteerAngle += this.allowedTurningIncement;
                        }
                        else {
                            if (this.physicsSteerAngle > this.allowedTurningIncement) {
                                this.physicsSteerAngle -= this.allowedTurningIncement;
                            }
                            else {
                                this.physicsSteerAngle = 0;
                            }
                        }
                    }
                    // ..
                    // Update Visual Turn Angle (No Steering Effect)
                    // ..
                    if (this.wheelBurnout === true || this.wheelSkidding == true) {
                        this.allowedTurningAngle = BABYLON.Tools.ToRadians(this.maxTurnAngle);
                        this.allowedTurningIncement = this.lowSpeedTurning;
                    }
                    else {
                        this.allowedTurningIncement = BABYLON.Scalar.Lerp(this.lowSpeedTurning, this.highSpeedTurning, this.normalizedSpeed);
                        this.allowedTurningAngle = BABYLON.Scalar.Lerp(BABYLON.Tools.ToRadians((this.lowSpeedAngle * lowSpeedFactor)), BABYLON.Tools.ToRadians((this.highSpeedAngle * highSpeedFactor)), this.normalizedSpeed);
                        if (this.maxSteerBoost > 0 && Math.abs(this.currentTurning) >= 0.1) {
                            this.allowedTurningAngle += BABYLON.Tools.ToRadians(this.maxSteerBoost);
                        }
                    }
                    if (this.overSteerSpeed > 0 && this.handBraking === true) {
                        this.currentTurning *= -1; // Note: Invert Over Steering Angle
                    }
                    if (this.currentTurning > 0) { // Right
                        if (this.visualSteerAngle < this.allowedTurningAngle) {
                            this.visualSteerAngle += (this.allowedTurningIncement);
                        }
                    }
                    else if (this.currentTurning < 0) { // Left
                        if (this.visualSteerAngle > -this.allowedTurningAngle) {
                            this.visualSteerAngle -= (this.allowedTurningIncement);
                        }
                    }
                    else {
                        if (this.visualSteerAngle < -this.allowedTurningIncement) {
                            this.visualSteerAngle += this.allowedTurningIncement;
                        }
                        else {
                            if (this.visualSteerAngle > this.allowedTurningIncement) {
                                this.visualSteerAngle -= this.allowedTurningIncement;
                            }
                            else {
                                this.visualSteerAngle = 0;
                            }
                        }
                    }
                }
                // ..
                // Update Raycast Vehicle Controls
                // ..
                let updateFriction = true;
                //const powerSliding:boolean = (this.handBraking === true) ? false : this.getPowerSliding();
                if (this.handBraking === true /* || powerSliding == true*/) {
                    this.wheelBurnout = false;
                    this.wheelDonuts = false;
                    this.burnoutTimer = 0;
                    // ..
                    // Validate Wheel Skidding Mode
                    // ..
                    //if (this.handBraking === true) {
                    if (this.raycastVehicle.lockedWheelIndexes == null)
                        this.raycastVehicle.lockedWheelIndexes = [this.BACK_LEFT, this.BACK_RIGHT];
                    if (this.americanSpeed >= 5) {
                        if (this.wheelSkidding === false) {
                            this.wheelSkidding = true;
                            if (this.m_frontLeftWheel != null)
                                this.m_frontLeftWheel.set_m_frictionSlip(this.wheelSkidFriction);
                            if (this.m_frontRightWheel != null)
                                this.m_frontRightWheel.set_m_frictionSlip(this.wheelSkidFriction);
                            if (this.m_backLeftWheel != null)
                                this.m_backLeftWheel.set_m_frictionSlip(this.wheelSkidFriction);
                            if (this.m_backRightWheel != null)
                                this.m_backRightWheel.set_m_frictionSlip(this.wheelSkidFriction);
                            updateFriction = false; // Note: Disable Friction Lerping This Frame
                        }
                    }
                    //} else if (powerSliding === true) {
                    //    if (this.raycastVehicle.lockedWheelIndexes != null) this.raycastVehicle.lockedWheelIndexes = null;
                    //    if (this.wheelSkidding === false) {
                    //        this.wheelSkidding = true;
                    //        if (this.m_frontLeftWheel != null) this.m_frontLeftWheel.set_m_frictionSlip(this.powerSlideFriction);
                    //        if (this.m_frontRightWheel != null) this.m_frontRightWheel.set_m_frictionSlip(this.powerSlideFriction);
                    //        if (this.m_backLeftWheel != null) this.m_backLeftWheel.set_m_frictionSlip(this.powerSlideFriction);
                    //        if (this.m_backRightWheel != null) this.m_backRightWheel.set_m_frictionSlip(this.powerSlideFriction);
                    //        updateFriction = false; // Note: Disable Friction Lerping This Frame
                    //    }
                    //}
                    // ..
                    // Update Vehicle Wheel Information
                    // ..
                    this.updateCurrentBrakeDamping(this.linearBrakingForce, this.angularBrakingForce);
                    if (updateFriction === true)
                        this.updateCurrentFrictionSlip(deltaTime * this.skiddingLerpSpeed);
                    this.updateCurrentRotationDelta(0);
                    this.updateCurrentRotationBoost(0);
                    // ..
                    this.raycastVehicle.setVisualSteeringAngle(this.visualSteerAngle, this.FRONT_LEFT);
                    this.raycastVehicle.setVisualSteeringAngle(this.visualSteerAngle, this.FRONT_RIGHT);
                    this.raycastVehicle.setPhysicsSteeringAngle(this.physicsSteerAngle, this.FRONT_LEFT);
                    this.raycastVehicle.setPhysicsSteeringAngle(this.physicsSteerAngle, this.FRONT_RIGHT);
                    // ..
                    this.raycastVehicle.setEngineForce(0, this.FRONT_LEFT);
                    this.raycastVehicle.setEngineForce(0, this.FRONT_RIGHT);
                    this.raycastVehicle.setEngineForce(0, this.BACK_LEFT);
                    this.raycastVehicle.setEngineForce(0, this.BACK_RIGHT);
                    // ..
                    this.raycastVehicle.setBrakingForce(0, this.FRONT_LEFT);
                    this.raycastVehicle.setBrakingForce(0, this.FRONT_RIGHT);
                    this.raycastVehicle.setBrakingForce(this.handBrakingForce, this.BACK_LEFT);
                    this.raycastVehicle.setBrakingForce(this.handBrakingForce, this.BACK_RIGHT);
                }
                else {
                    if (this.raycastVehicle.lockedWheelIndexes != null) {
                        this.raycastVehicle.lockedWheelIndexes = null;
                        this.updateCurrentRotationDelta(0);
                        this.updateCurrentRotationBoost(0);
                    }
                    this.wheelSkidding = false;
                    this.burnoutCoefficient = BABYLON.Scalar.Clamp(this.burnoutCoefficient, 1, 20);
                    this.burnoutTriggerMark = BABYLON.Scalar.Clamp(this.burnoutTriggerMark, 1, 20);
                    // ..
                    const isBurnoutSpeed = (this.americanSpeed <= this.burnoutTriggerMark);
                    const isFullThrottle = (this.currentForward < -0.9 || this.currentForward > 0.9);
                    const isFullTurning = (this.currentTurning < -0.9 || this.currentTurning > 0.9);
                    let wheelLerpSpeed = (deltaTime * this.frictionLerpSpeed);
                    let wheelBoostSpeed = 0; // Default Zero Wheel Rotation Boost
                    // ..
                    // Validate Wheel Burnout Mode
                    // ..
                    if (this.burnoutTimer <= 0 && isFullThrottle === true && isBurnoutSpeed === true && this.maxThrottleBurnouts === true) {
                        this.burnoutTimer = (this.burnoutTimeDelay * 0.25); // Note: 25 Percent Slipping Time
                        this.wheelDonuts = false;
                        this.wheelBurnout = true;
                    }
                    // ..
                    // Validate Wheel Burnout Timers
                    // ..
                    if (this.restoreTimer > 0) {
                        this.restoreTimer -= deltaTime;
                        if (this.restoreTimer < 0)
                            this.restoreTimer = 0;
                        wheelLerpSpeed *= this.burnoutLerpSpeed;
                    }
                    if (this.cooldownTimer > 0) {
                        this.cooldownTimer -= deltaTime;
                        if (this.cooldownTimer < 0)
                            this.cooldownTimer = 0;
                    }
                    if (this.wheelDonuts === true) {
                        this.donutSpinTime += deltaTime;
                        if (isFullTurning === false) {
                            this.burnoutTimer = 0;
                        }
                    }
                    else {
                        this.donutSpinTime = 0;
                    }
                    // ..
                    // Validate Wheel Drive Burnout Mode
                    // ..
                    if (this.burnoutTimer > 0 && isFullThrottle === true) {
                        wheelBoostSpeed = 0.1;
                        const frontSlipFactor = (this.wheelDonuts === true) ? 1.25 : 1.0;
                        if (this.burnoutCoefficient >= 1.0)
                            this.engineForce *= this.burnoutCoefficient;
                        if (this.m_frontLeftWheel != null)
                            this.m_frontLeftWheel.set_m_frictionSlip(this.wheelSkidFriction * frontSlipFactor);
                        if (this.m_frontRightWheel != null)
                            this.m_frontRightWheel.set_m_frictionSlip(this.wheelSkidFriction * frontSlipFactor);
                        if (this.m_backLeftWheel != null)
                            this.m_backLeftWheel.set_m_frictionSlip(this.wheelSkidFriction);
                        if (this.m_backRightWheel != null)
                            this.m_backRightWheel.set_m_frictionSlip(this.wheelSkidFriction);
                        updateFriction = false; // Note: Disable Friction Lerping This Frame
                        // ..
                        this.burnoutTimer -= deltaTime;
                        if (this.burnoutTimer <= 0 && isFullTurning === true && this.cooldownTimer <= 0 && this.currentForward > 0 && this.currentDrifting === true) {
                            this.burnoutTimer = 0.01; // Note: Use Fixed Donut Burnout Time Extension
                            this.wheelDonuts = true;
                        }
                    }
                    else {
                        this.burnoutTimer = 0; // Note: Clear Burnout Timer 
                        this.donutSpinTime = 0; // Note: Clear Donut Spin Time
                        if (this.wheelDonuts === true) {
                            this.wheelDonuts = false;
                            this.cooldownTimer = (this.burnoutTimeDelay * 2); // Note: 200 Percent Cooldown Time
                        }
                        if (this.wheelBurnout === true) {
                            this.wheelBurnout = false;
                            this.restoreTimer = (this.burnoutTimeDelay * 0.75); // Note: 75 Percent Restoring Time
                        }
                    }
                    // ..
                    // Validate Wheel Drive Power Force
                    // ..
                    if (this.wheelBurnout === true && this.wheelDonuts === true) {
                        this.frontWheelPower = (this.engineForce * 0.2); // Note: 20 Percent Engine Power Force
                    }
                    else if (this.wheelDriveType === 1 || this.wheelDriveType === 2) { // FRONT OR ALL WHEEL DRIVE
                        this.frontWheelPower = this.engineForce;
                    }
                    if (this.wheelDriveType === 0 || this.wheelDriveType === 2) { // REAR OR ALL WHEEL DRIVE
                        this.backWheelPower = this.engineForce;
                    }
                    // ..
                    // Update Vehicle Wheel Information
                    // ..
                    if (this.getFootBraking() === true)
                        this.updateCurrentBrakeDamping((this.linearBrakingForce * 0.2), (this.angularBrakingForce * 0.2)); // Note: 20 Percent Linear Brake Force
                    else if (this.throttleBrakingForce > 0)
                        this.updateCurrentBrakeDamping(this.throttleBrakingForce, this.angularDamping);
                    else
                        this.updateCurrentBrakeDamping(this.linearDamping, this.angularDamping);
                    if (updateFriction === true)
                        this.updateCurrentFrictionSlip(wheelLerpSpeed);
                    this.updateCurrentRotationBoost(wheelBoostSpeed);
                    // ..
                    this.raycastVehicle.setVisualSteeringAngle(this.visualSteerAngle, this.FRONT_LEFT);
                    this.raycastVehicle.setVisualSteeringAngle(this.visualSteerAngle, this.FRONT_RIGHT);
                    this.raycastVehicle.setPhysicsSteeringAngle(this.physicsSteerAngle, this.FRONT_LEFT);
                    this.raycastVehicle.setPhysicsSteeringAngle(this.physicsSteerAngle, this.FRONT_RIGHT);
                    // ..
                    this.raycastVehicle.setEngineForce(this.frontWheelPower, this.FRONT_LEFT);
                    this.raycastVehicle.setEngineForce(this.frontWheelPower, this.FRONT_RIGHT);
                    this.raycastVehicle.setEngineForce(this.backWheelPower, this.BACK_LEFT);
                    this.raycastVehicle.setEngineForce(this.backWheelPower, this.BACK_RIGHT);
                    // ..
                    if (this.maxFrontBraking > 0) {
                        this.raycastVehicle.setBrakingForce(this.wheelBrakingForce * this.maxFrontBraking, this.FRONT_LEFT);
                        this.raycastVehicle.setBrakingForce(this.wheelBrakingForce * this.maxFrontBraking, this.FRONT_RIGHT);
                    }
                    else {
                        this.raycastVehicle.setBrakingForce(this.wheelBrakingForce, this.FRONT_LEFT);
                        this.raycastVehicle.setBrakingForce(this.wheelBrakingForce, this.FRONT_RIGHT);
                    }
                    this.raycastVehicle.setBrakingForce(this.wheelBrakingForce, this.BACK_LEFT);
                    this.raycastVehicle.setBrakingForce(this.wheelBrakingForce, this.BACK_RIGHT);
                }
            }
            // ..
            // Update Driving Props
            // ..
            this.syncVehicleState();
        }
        syncVehicleState() {
            const deltaTime = this.getDeltaSeconds();
            const gearCount = this.getGearShiftRatioCount();
            if (this.shiftingTime > 0) {
                this.shiftingTime -= deltaTime;
                if (this.shiftingTime < 0)
                    this.shiftingTime = 0;
            }
            if (this._rigidbody != null && this.raycastVehicle != null) {
                const deadSpeed = 0.2; // Note: Dead Movement Speed Threshold
                this.forwardSpeed = this.raycastVehicle.getRawCurrentSpeedKph();
                if (Math.abs(this.forwardSpeed) < deadSpeed)
                    this.forwardSpeed = 0;
                // ..
                this.absoluteSpeed = this.raycastVehicle.getAbsCurrentSpeedKph();
                if (this.absoluteSpeed < deadSpeed)
                    this.absoluteSpeed = 0;
                // ..
                this.americanSpeed = (this.absoluteSpeed * BABYLON.System.Kph2Mph);
                this.normalizedSpeed = BABYLON.Scalar.Clamp((this.americanSpeed / this.normalizationSpeed));
                // ..
                if (this.gearBoxShiftRatios != null && this.gearIndex >= 0 && this.gearIndex < gearCount) {
                    const minimumDelta = Math.min(Math.max(deltaTime, 1 / 200), 1);
                    const wheelDiameter = (this.wheelRadius * 2 * BABYLON.System.Meter2Inch);
                    const finalGearRatio = (this.gearBoxShiftRatios[this.gearIndex] * this.differentialRatio * this.transmissionRatio);
                    // ..
                    // Update Engine Revolutions (TODO - No Shifting Donut Mode - RPM Bounce Boosting)
                    // ..
                    this.downShift = (this.gearBoxShiftRanges != null && this.gearBoxShiftRanges.length === this.gearBoxShiftRatios.length) ? this.gearBoxShiftRanges[this.gearIndex] : 1000;
                    this.clutchSlip = BABYLON.Utilities.LerpClamp(this.clutchSlip, 0, 1 - Math.pow(0.01, minimumDelta));
                    this.engineRPM = ((this.americanSpeed * finalGearRatio * 336) / wheelDiameter);
                    /////////////////////////////////////////////////////////
                    // TODO - Lock High Pitching RPM While Skidding & Donuts
                    /////////////////////////////////////////////////////////
                    this.pitchRPM = BABYLON.Utilities.LerpClamp(this.shiftRPM, this.engineRPM, (1 - this.clutchSlip)) + this.MIN_RPM;
                    /////////////////////////////////////////////////////////
                    /* Penny - Change Gears
                    float speedPercentage = Mathf.Abs(currentSpeed / maxSpeed);
                    float upperGearMax = (1 / (float)numGears) * (currentGear + 1);
                    float downGearMax = (1 / (float)numGears) * currentGear;
            
                    if (currentGear > 0 && speedPercentage < downGearMax)
                        currentGear--;
            
                    if (speedPercentage > upperGearMax && (currentGear < (numGears - 1)))
                        currentGear++;
                    */
                    // ..
                    // Update Engine Gearing Box (TODO - No Shifting Donut Mode - RPM Bounce Boosting)
                    // ..
                    if (this.americanSpeed < 5) {
                        this.gearIndex = 0;
                    }
                    else {
                        if (this.engineRPM > this.gearBoxShiftChange) {
                            // DEPRECIATED: Moved To If Statement Below
                            // this.shiftRPM = this.engineRPM;
                            // this.clutchSlip = 1.0;
                            // this.shiftingTime = this.gearBoxShiftDelay;
                            if (this.gearIndex < (gearCount - 1)) {
                                this.shiftRPM = this.engineRPM;
                                this.clutchSlip = 1.0;
                                this.shiftingTime = this.gearBoxShiftDelay;
                                this.gearIndex++;
                            }
                        }
                        else if (this.engineRPM < this.downShift) {
                            // DEPRECIATED: Moved To If Statement Below
                            // this.shiftRPM = this.engineRPM;
                            // this.clutchSlip = 1.0;
                            // this.shiftingTime = 0;
                            if (this.gearIndex > 0) {
                                this.shiftRPM = this.engineRPM;
                                this.clutchSlip = 1.0;
                                this.shiftingTime = 0;
                                this.gearIndex--;
                            }
                        }
                    }
                    ///////////////////////////////////////
                    // Double Check Gear Index - ???
                    ///////////////////////////////////////
                    if (this.gearIndex < 0)
                        this.gearIndex = 0;
                    else if (this.gearIndex >= gearCount)
                        this.gearIndex = (gearCount - 1);
                }
            }
            // Account for further movement since the last wheel update
            if (this.skidDrawVelocity > 0 && this._rigidbody != null) {
                this.m_velocityOffset.copyFrom(this._rigidbody.getLinearVelocity());
                this.m_velocityOffset.scaleInPlace(this.skidDrawVelocity);
            }
            // Update Engine Sound Pitch
            let pitching = 0;
            if (this.playVehicleSounds === true) {
                pitching = (this.getCurrentEnginePitch() * 0.75);
            }
            if (this._engineAudioSource != null) {
                const engineSoundClip = this._engineAudioSource.getSoundClip();
                //pitching = BABYLON.Scalar.Clamp(pitching, 0, 10);
                if (engineSoundClip != null)
                    engineSoundClip.setPlaybackRate(pitching);
            }
            // Update Smoke Instensity
            this.smokeDonuts = BABYLON.Scalar.Clamp(this.smokeDonuts, 1, 10);
            let smokeIntensityFactor = this.smokeIntensity;
            if (this.wheelBurnout === true && this.wheelDonuts === true)
                smokeIntensityFactor *= this.smokeDonuts;
            // Update Wheel Skidding Info
            this.SKID_FL = 0, this.SKID_FR = 0, this.SKID_RL = 0, this.SKID_RR = 0;
            if (this.m_frontLeftWheel != null) {
                const wheelContactFL = (this.m_frontLeftWheel.get_m_raycastInfo().get_m_groundObject() !== 0);
                this.SKID_FL = this.updateCurrentSkidInfo(this.m_frontLeftWheel);
                if (this.SKID_FL < this.skidThreashold)
                    this.SKID_FL = 0;
                if (this.SKID_FL > 0 && wheelContactFL === true) {
                    const contactPointFL = this.m_frontLeftWheel.get_m_raycastInfo().get_m_contactPointWS();
                    const contactNormalFL = this.m_frontLeftWheel.get_m_raycastInfo().get_m_contactNormalWS();
                    const skidPosFL = new BABYLON.Vector3(contactPointFL.x(), contactPointFL.y(), contactPointFL.z());
                    const skidNormFL = new BABYLON.Vector3(contactNormalFL.x(), contactNormalFL.y(), contactNormalFL.z());
                    const skidScaleFL = BABYLON.Scalar.Normalize(this.SKID_FL, this.skidThreashold, 1.0);
                    if (this.skidDrawVelocity > 0)
                        skidPosFL.addInPlace(this.m_velocityOffset);
                    this.m_frontLeftWheelSkid = PROJECT.SkidMarkManager.AddSkidMarkSegment(skidPosFL, skidNormFL, skidScaleFL, this.m_frontLeftWheelSkid);
                    if (this.frontLeftWheelParticle != null) {
                        if (this.frontLeftWheelParticle.isStarted() === false) {
                            this.frontLeftWheelParticle.start();
                        }
                        const smoke_FL = this.SKID_FL * this.SKID_FL;
                        this.frontLeftWheelParticle.emitRate = smokeIntensityFactor * smoke_FL;
                        this.frontLeftWheelParticle.minSize = 0.2 * smoke_FL + 0.2;
                        this.frontLeftWheelParticle.maxSize = 1.5 * smoke_FL + 1.2;
                    }
                }
                else {
                    if (this.frontLeftWheelParticle != null)
                        this.frontLeftWheelParticle.emitRate = 0;
                    this.m_frontLeftWheelSkid = -1;
                }
            }
            if (this.m_frontRightWheel != null) {
                const wheelContactFR = (this.m_frontRightWheel.get_m_raycastInfo().get_m_groundObject() !== 0);
                this.SKID_FR = this.updateCurrentSkidInfo(this.m_frontRightWheel);
                if (this.SKID_FR < this.skidThreashold)
                    this.SKID_FR = 0;
                if (this.SKID_FR > 0 && wheelContactFR === true) {
                    const contactPointFR = this.m_frontRightWheel.get_m_raycastInfo().get_m_contactPointWS();
                    const contactNormalFR = this.m_frontRightWheel.get_m_raycastInfo().get_m_contactNormalWS();
                    const skidPosFR = new BABYLON.Vector3(contactPointFR.x(), contactPointFR.y(), contactPointFR.z());
                    const skidNormFR = new BABYLON.Vector3(contactNormalFR.x(), contactNormalFR.y(), contactNormalFR.z());
                    const skidScaleFR = BABYLON.Scalar.Normalize(this.SKID_FR, this.skidThreashold, 1.0);
                    if (this.skidDrawVelocity > 0)
                        skidPosFR.addInPlace(this.m_velocityOffset);
                    this.m_frontRightWheelSkid = PROJECT.SkidMarkManager.AddSkidMarkSegment(skidPosFR, skidNormFR, skidScaleFR, this.m_frontRightWheelSkid);
                    if (this.frontRightWheelParticle != null) {
                        if (this.frontRightWheelParticle.isStarted() === false) {
                            this.frontRightWheelParticle.start();
                        }
                        const smoke_FR = this.SKID_FR * this.SKID_FR;
                        this.frontRightWheelParticle.emitRate = smokeIntensityFactor * smoke_FR;
                        this.frontRightWheelParticle.minSize = 0.2 * smoke_FR + 0.2;
                        this.frontRightWheelParticle.maxSize = 1.5 * smoke_FR + 1.2;
                    }
                }
                else {
                    if (this.frontRightWheelParticle != null)
                        this.frontRightWheelParticle.emitRate = 0;
                    this.m_frontRightWheelSkid = -1;
                }
            }
            if (this.wheelBurnout == true || this.restoreTimer > 0) {
                this.SKID_FL *= this.burnoutWheelPitch;
                this.SKID_FR *= this.burnoutWheelPitch;
            }
            ///////////////////////////////
            // 75% Skid For Front Wheels
            ///////////////////////////////
            this.SKID_FL *= 0.75;
            this.SKID_FR *= 0.75;
            if (this.m_backLeftWheel != null) {
                const wheelContactBL = (this.m_backLeftWheel.get_m_raycastInfo().get_m_groundObject() !== 0);
                this.SKID_RL = this.updateCurrentSkidInfo(this.m_backLeftWheel);
                if (this.SKID_RL < this.skidThreashold)
                    this.SKID_RL = 0;
                if (this.SKID_RL > 0 && wheelContactBL === true) {
                    const contactPointRL = this.m_backLeftWheel.get_m_raycastInfo().get_m_contactPointWS();
                    const contactNormalRL = this.m_backLeftWheel.get_m_raycastInfo().get_m_contactNormalWS();
                    const skidPosRL = new BABYLON.Vector3(contactPointRL.x(), contactPointRL.y(), contactPointRL.z());
                    const skidNormRL = new BABYLON.Vector3(contactNormalRL.x(), contactNormalRL.y(), contactNormalRL.z());
                    const skidScaleRL = BABYLON.Scalar.Normalize(this.SKID_RL, this.skidThreashold, 1.0);
                    if (this.skidDrawVelocity > 0)
                        skidPosRL.addInPlace(this.m_velocityOffset);
                    this.m_backLeftWheelSkid = PROJECT.SkidMarkManager.AddSkidMarkSegment(skidPosRL, skidNormRL, skidScaleRL, this.m_backLeftWheelSkid);
                    if (this.backLeftWheelParticle != null) {
                        if (this.backLeftWheelParticle.isStarted() === false) {
                            this.backLeftWheelParticle.start();
                        }
                        const smoke_RL = this.SKID_RL * this.SKID_RL;
                        this.backLeftWheelParticle.emitRate = smokeIntensityFactor * smoke_RL;
                        this.backLeftWheelParticle.minSize = 0.2 * smoke_RL + 0.2;
                        this.backLeftWheelParticle.maxSize = 1.5 * smoke_RL + 1.2;
                    }
                }
                else {
                    if (this.backLeftWheelParticle != null)
                        this.backLeftWheelParticle.emitRate = 0;
                    this.m_backLeftWheelSkid = -1;
                }
            }
            if (this.m_backRightWheel != null) {
                const wheelContactBR = (this.m_backRightWheel.get_m_raycastInfo().get_m_groundObject() !== 0);
                this.SKID_RR = this.updateCurrentSkidInfo(this.m_backRightWheel);
                if (this.SKID_RR < this.skidThreashold)
                    this.SKID_RR = 0;
                if (this.SKID_RR > 0 && wheelContactBR === true) {
                    const contactPointRR = this.m_backRightWheel.get_m_raycastInfo().get_m_contactPointWS();
                    const contactNormalRR = this.m_backRightWheel.get_m_raycastInfo().get_m_contactNormalWS();
                    const skidPosRR = new BABYLON.Vector3(contactPointRR.x(), contactPointRR.y(), contactPointRR.z());
                    const skidNormRR = new BABYLON.Vector3(contactNormalRR.x(), contactNormalRR.y(), contactNormalRR.z());
                    const skidScaleRR = BABYLON.Scalar.Normalize(this.SKID_RR, this.skidThreashold, 1.0);
                    if (this.skidDrawVelocity > 0)
                        skidPosRR.addInPlace(this.m_velocityOffset);
                    this.m_backRightWheelSkid = PROJECT.SkidMarkManager.AddSkidMarkSegment(skidPosRR, skidNormRR, skidScaleRR, this.m_backRightWheelSkid);
                    if (this.backRightWheelParticle != null) {
                        if (this.backRightWheelParticle.isStarted() === false) {
                            this.backRightWheelParticle.start();
                        }
                        const smoke_RR = this.SKID_RR * this.SKID_RR;
                        this.backRightWheelParticle.emitRate = smokeIntensityFactor * smoke_RR;
                        this.backRightWheelParticle.minSize = 0.2 * smoke_RR + 0.2;
                        this.backRightWheelParticle.maxSize = 1.5 * smoke_RR + 1.2;
                    }
                }
                else {
                    if (this.backRightWheelParticle != null)
                        this.backRightWheelParticle.emitRate = 0;
                    this.m_backRightWheelSkid = -1;
                }
            }
            if (this.wheelBurnout == true || this.restoreTimer > 0) {
                this.SKID_RL *= this.burnoutWheelPitch;
                this.SKID_RR *= this.burnoutWheelPitch;
            }
            ///////////////////////////////////////////
            // Play Skid Audio Track
            ///////////////////////////////////////////
            let skidding = 0;
            if (this.playVehicleSounds === true) {
                if (this.SKID_FL > skidding)
                    skidding = this.SKID_FL;
                if (this.SKID_FR > skidding)
                    skidding = this.SKID_FR;
                if (this.SKID_RL > skidding)
                    skidding = this.SKID_RL;
                if (this.SKID_RR > skidding)
                    skidding = this.SKID_RR;
            }
            if (this._skidAudioSource != null) {
                const skidSoundClip = this._skidAudioSource.getSoundClip();
                //skidding = BABYLON.Scalar.Clamp(skidding, 0, 10);
                if (skidSoundClip != null)
                    skidSoundClip.setPlaybackRate(skidding);
            }
            ///////////////////////////////////////////
            // Vehicle Braking Lights Check
            ///////////////////////////////////////////
            if (this.brakeLightsMesh != null) {
                this.brakeLightsMesh.isVisible = (this.getFootBraking() || this.getHandBraking());
            }
            ///////////////////////////////////////////
            // Vehicle Reverse Lights Check
            ///////////////////////////////////////////
            if (this.reverseLightsMesh != null) {
                this.reverseLightsMesh.isVisible = this.getReverseThrottle();
            }
        }
        getVehicleEngineTorque(rpm) {
            let result = 0;
            if (this.engineTorqueCurve != null) {
                result = (BABYLON.Utilities.SampleAnimationFloat(this.engineTorqueCurve, BABYLON.Scalar.Clamp(rpm, this.MIN_RPM, this.MAX_RPM)) * this.powerCoefficient);
            }
            return result;
        }
        createSmokeParticleSystem(name, emitter) {
            const result = new BABYLON.ParticleSystem(name, 10000, this.scene);
            result.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
            result.particleTexture = this.smokeTexture;
            result.emitter = emitter;
            result.emitRate = 0;
            result.updateSpeed = 0.01;
            // change size and speed
            result.minSize = 0.2;
            result.maxSize = 1.3;
            result.minAngularSpeed = -1.5;
            result.maxAngularSpeed = 1.5;
            // changed lifetime to control shape of the cloud in conjunction with velocity gradient
            result.minLifeTime = 3.0;
            result.maxLifeTime = 5.0;
            // adding velocity over time to prevent large bloom of particles by launching them fast and then slowing them down GPU particles don't take a gradient on velocity, but the reduction in velocity over time is worth the trade off for less randomization
            result.addVelocityGradient(0, 1);
            result.addVelocityGradient(0.1, 0.7);
            result.addVelocityGradient(0.7, 0.2);
            result.addVelocityGradient(1.0, 0.05);
            // reduced the emit rate to reduce bloom of particles in the center of mass
            result.gravity = new BABYLON.Vector3(0, -0.1, 0);
            result.minEmitBox = new BABYLON.Vector3(0, -0.25, 0);
            result.maxEmitBox = new BABYLON.Vector3(0, -0.25, 0);
            result.direction1 = new BABYLON.Vector3(-1, -1, -1);
            result.direction2 = new BABYLON.Vector3(1, 1, 1);
            // The color1, color2, colorDead pattern is overridden by color gradient so is unnecessary
            result.color1 = new BABYLON.Color4(0.95, 0.95, 0.95, this.smokeOpacity);
            result.color2 = new BABYLON.Color4(0.85, 0.85, 0.85, this.smokeOpacity);
            result.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, (this.smokeOpacity * 0.5));
            // Changed the color gradient to add a second value for randomization and ramped the color down further to create more texture with alpha blending
            //result.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0.0), new BABYLON.Color4(0.7, 0.7, 0.7, 0.0));
            //result.addColorGradient(0.2, new BABYLON.Color4(0.7, 0.7, 0.7, 0.2), new BABYLON.Color4(0.6, 0.6, 0.6, 0.2));
            //result.addColorGradient(0.6, new BABYLON.Color4(0.6, 0.6, 0.6, 0.1),new BABYLON.Color4(0.4, 0.4, 0.4, 0.1));
            //result.addColorGradient(1.0, new BABYLON.Color4(0.3, 0.3, 0.3, 0.0),new BABYLON.Color4(0.1, 0.1, 0.1, 0.0));            
            return result;
        }
        updateCurrentSkidInfo(wheel) {
            if (this.getPowerSliding() === true)
                return BABYLON.Scalar.Lerp(0, 1, this.normalizedSpeed);
            else
                return BABYLON.Scalar.Clamp((1 - wheel.get_m_skidInfo()));
        }
        updateCurrentBrakeDamping(linear, angular) {
            if (this._rigidbody != null)
                this._rigidbody.setDamping(linear, angular);
        }
        updateCurrentRotationDelta(delta) {
            if (this.m_frontLeftWheel != null)
                this.m_frontLeftWheel.set_m_deltaRotation(delta);
            if (this.m_frontRightWheel != null)
                this.m_frontRightWheel.set_m_deltaRotation(delta);
            if (this.m_backLeftWheel != null)
                this.m_backLeftWheel.set_m_deltaRotation(delta);
            if (this.m_backRightWheel != null)
                this.m_backRightWheel.set_m_deltaRotation(delta);
        }
        updateCurrentRotationBoost(boost) {
            if (this.wheelDriveType === 1 || this.wheelDriveType === 2) { // FRONT OR ALL WHEEL DRIVE
                if (this.m_frontLeftWheel != null)
                    this.m_frontLeftWheel.rotationBoost = boost;
                if (this.m_frontRightWheel != null)
                    this.m_frontRightWheel.rotationBoost = boost;
            }
            if (this.wheelDriveType === 0 || this.wheelDriveType === 2) { // REAR OR ALL WHEEL DRIVE
                if (this.m_backLeftWheel != null)
                    this.m_backLeftWheel.rotationBoost = boost;
                if (this.m_backRightWheel != null)
                    this.m_backRightWheel.rotationBoost = boost;
            }
        }
        updateCurrentFrictionSlip(lerpSpeed) {
            if (this.m_frontLeftWheel != null && this.m_frontLeftWheel.defaultFriction != null) {
                let frontLeftFriction = this.m_frontLeftWheel.get_m_frictionSlip();
                if (frontLeftFriction < this.m_frontLeftWheel.defaultFriction) {
                    frontLeftFriction = BABYLON.Scalar.Lerp(frontLeftFriction, this.m_frontLeftWheel.defaultFriction, lerpSpeed);
                    this.m_frontLeftWheel.set_m_frictionSlip(frontLeftFriction);
                }
                else if (frontLeftFriction > this.m_frontLeftWheel.defaultFriction) {
                    this.m_frontLeftWheel.set_m_frictionSlip(this.m_frontLeftWheel.defaultFriction);
                }
            }
            if (this.m_frontRightWheel != null && this.m_frontRightWheel.defaultFriction != null) {
                let frontRightFriction = this.m_frontRightWheel.get_m_frictionSlip();
                if (frontRightFriction !== this.m_frontRightWheel.defaultFriction) {
                    frontRightFriction = BABYLON.Scalar.Lerp(frontRightFriction, this.m_frontRightWheel.defaultFriction, lerpSpeed);
                    this.m_frontRightWheel.set_m_frictionSlip(frontRightFriction);
                }
                else if (frontRightFriction > this.m_frontRightWheel.defaultFriction) {
                    this.m_frontRightWheel.set_m_frictionSlip(this.m_frontRightWheel.defaultFriction);
                }
            }
            if (this.m_backLeftWheel != null && this.m_backLeftWheel.defaultFriction != null) {
                let backLeftFriction = this.m_backLeftWheel.get_m_frictionSlip();
                if (backLeftFriction !== this.m_backLeftWheel.defaultFriction) {
                    backLeftFriction = BABYLON.Scalar.Lerp(backLeftFriction, this.m_backLeftWheel.defaultFriction, lerpSpeed);
                    this.m_backLeftWheel.set_m_frictionSlip(backLeftFriction);
                }
                else if (backLeftFriction > this.m_backLeftWheel.defaultFriction) {
                    this.m_backLeftWheel.set_m_frictionSlip(this.m_backLeftWheel.defaultFriction);
                }
            }
            if (this.m_backRightWheel != null && this.m_backRightWheel.defaultFriction != null) {
                let backRightFriction = this.m_backRightWheel.get_m_frictionSlip();
                if (backRightFriction !== this.m_backRightWheel.defaultFriction) {
                    backRightFriction = BABYLON.Scalar.Lerp(backRightFriction, this.m_backRightWheel.defaultFriction, lerpSpeed);
                    this.m_backRightWheel.set_m_frictionSlip(backRightFriction);
                }
                else if (backRightFriction > this.m_backRightWheel.defaultFriction) {
                    this.m_backRightWheel.set_m_frictionSlip(this.m_backRightWheel.defaultFriction);
                }
            }
        }
    }
    PROJECT.StandardCarController = StandardCarController;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
    * Babylon Script Component
    * @class VehicleCameraManager
    */
    class VehicleCameraManager extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.enableCamera = false;
            this.followTarget = false;
            this.followHeight = 1.75;
            this.setCameraPitch = 20.0;
            this.rotationDamping = 5.0;
            this.minimumDistance = 6.0;
            this.maximumDistance = 8.0;
            this.buttonCamera = BABYLON.Xbox360Button.Y;
            this.keyboardCamera = BABYLON.UserInputKey.P;
            this.firstPerson = false;
            this.cameraPivot = null;
            this.targetEulers = BABYLON.Vector3.Zero();
            this.cameraEulers = BABYLON.Vector3.Zero();
            this.cameraRotation = BABYLON.Quaternion.Zero();
            this.cameraPivotOffset = BABYLON.Vector3.Zero();
            this.cameraBoomPosition = BABYLON.Vector3.Zero();
            this.autoAttachCamera = false;
            this.m_cameraTransform = null;
            this.m_inputController = null;
            this.m_standardController = null;
            this.m_donutCameraLock = new BABYLON.Vector3(0.0, 0.5, 7.5);
            this.m_firstPersonOffset = new BABYLON.Vector3(0.0, 1.15, 0.15);
            this.testSphere = null;
            this.smoothDeltaTime = 0.0;
        }
        awake() { this.awakeCameraManager(); }
        start() { this.initCameraManager(); }
        update() { this.updateCameraManager(); }
        destroy() { this.destroyCameraManager(); }
        awakeCameraManager() {
            this.enableCamera = this.getProperty("enableCamera", this.enableCamera);
            this.followTarget = this.getProperty("followTarget", this.followTarget);
            this.followHeight = this.getProperty("followHeight", this.followHeight);
            this.setCameraPitch = this.getProperty("setCameraPitch", this.setCameraPitch);
            this.rotationDamping = this.getProperty("rotationDamping", this.rotationDamping);
            this.minimumDistance = this.getProperty("minimumDistance", this.minimumDistance);
            this.maximumDistance = this.getProperty("maximumDistance", this.maximumDistance);
            this.autoAttachCamera = this.getProperty("attachCamera", this.autoAttachCamera);
            // ..
            const donutCameraLock = this.getProperty("donutCameraLock");
            if (donutCameraLock != null)
                this.m_donutCameraLock = BABYLON.Utilities.ParseVector3(donutCameraLock);
            // ..
            const firstPersonOffset = this.getProperty("firstPersonOffset");
            if (firstPersonOffset != null)
                this.m_firstPersonOffset = BABYLON.Utilities.ParseVector3(firstPersonOffset);
            // ..
            if (this.rotationDamping <= 0)
                this.rotationDamping = 3;
        }
        initCameraManager() {
            this.m_standardController = this.getComponent("PROJECT.StandardCarController");
            this.m_inputController = this.getComponent("PROJECT.VehicleInputController");
            if (this.m_inputController != null) {
                BABYLON.SceneManager.OnKeyboardPress(this.keyboardCamera, () => {
                    //if (this.playerNumber === BABYLON.PlayerNumber.One) {
                    this.togglePlayerCamera();
                    //}
                });
                BABYLON.SceneManager.OnGamepadButtonPress(this.buttonCamera, () => {
                    this.togglePlayerCamera();
                } /*, this.playerNumber*/);
            }
            this.cameraPivot = new BABYLON.TransformNode(this.transform.name + ".CameraPivot", this.scene);
            this.cameraPivot.parent = null;
            this.cameraPivot.position = this.transform.position.clone();
            this.cameraPivot.rotationQuaternion = this.transform.rotationQuaternion.clone();
            // ..
            // DEBUG: const testPivot:BABYLON.Mesh = BABYLON.Mesh.CreateBox("TestPivot", 0.25, this.scene);
            // DEBUG: testPivot.parent = this.cameraPivot;
            // DEBUG: testPivot.position.set(0,0,0);
            // DEBUG: testPivot.rotationQuaternion = new BABYLON.Quaternion(0,0,0,1);
        }
        updateCameraManager() {
            if (this.m_cameraTransform == null && this.autoAttachCamera === true) {
                if (this.m_inputController != null)
                    this.attachPlayerCamera(this.m_inputController.playerNumber);
            }
            if (this.firstPerson === true) {
                this.firstPersonCamera();
            }
            else {
                this.thirdPersonCamera();
            }
        }
        destroyCameraManager() {
            this.m_donutCameraLock = null;
            this.m_standardController = null;
            this.m_cameraTransform = null;
        }
        //////////////////////////////////////////////////
        // Player Camera Functions //
        //////////////////////////////////////////////////
        attachPlayerCamera(player) {
            if (this.m_cameraTransform == null) {
                const playerCamera = (player <= 0 || player > 4) ? 1 : player;
                this.m_cameraTransform = PROJECT.UniversalCameraSystem.GetCameraTransform(this.scene, playerCamera);
                if (this.m_cameraTransform != null && this.followTarget === true) {
                    this.m_cameraTransform.parent = this.cameraPivot;
                    this.m_cameraTransform.position.copyFrom(this.cameraBoomPosition);
                    this.m_cameraTransform.rotationQuaternion = BABYLON.Utilities.FromEuler(this.setCameraPitch, 0, 0);
                }
                //this.testSphere = BABYLON.SceneManager.GetAbstractMesh(this.scene, "TestSphere");
            }
        }
        togglePlayerCamera() {
            this.firstPerson = !this.firstPerson;
        }
        firstPersonCamera() {
            if (this.enableCamera === true && this.m_cameraTransform != null && this.m_standardController != null) {
                const target = this.transform;
                if (this.followTarget === true) {
                    if (this.cameraPivot != null) {
                        // ..
                        // Update Rotation
                        // ..
                        this.cameraPivot.rotationQuaternion.copyFrom(target.rotationQuaternion);
                        // ..
                        // Update Position
                        // ..
                        BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.cameraPivot.position);
                        // ..
                        // Update Camera Boom
                        // ..
                        this.m_cameraTransform.position.copyFrom(this.m_firstPersonOffset);
                        BABYLON.Utilities.FromEulerToRef(0, 0, 0, this.m_cameraTransform.rotationQuaternion);
                    }
                }
                else {
                    this.m_cameraTransform.lookAt(target.position);
                }
            }
        }
        thirdPersonCamera() {
            if (this.enableCamera === true && this.m_cameraTransform != null && this.m_standardController != null) {
                const target = this.transform;
                if (this.followTarget === true) {
                    if (this.cameraPivot != null) {
                        // ..
                        // Update Position
                        // ..
                        this.cameraPivotOffset.set(0, this.followHeight, 0);
                        BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.cameraPivot.position, this.cameraPivotOffset);
                        // ..
                        // Update Rotation (TODO - Smooth Sharp Turning Jitters)
                        // ..
                        const deltaTime = this.getDeltaSeconds();
                        const deltaFactor = BABYLON.System.SmoothDeltaFactor;
                        this.smoothDeltaTime = deltaFactor * deltaTime + (1 - deltaFactor) * this.smoothDeltaTime;
                        // ..
                        const turnDampener = (this.smoothDeltaTime * this.rotationDamping);
                        target.rotationQuaternion.toEulerAnglesToRef(this.targetEulers);
                        this.cameraPivot.rotationQuaternion.toEulerAnglesToRef(this.cameraEulers);
                        ////BABYLON.Quaternion.FromEulerAnglesToRef(this.cameraEulers.x, this.targetEulers.y, this.cameraEulers.z, this.cameraRotation);
                        BABYLON.Quaternion.FromEulerAnglesToRef(0, this.targetEulers.y, 0, this.cameraRotation);
                        BABYLON.Quaternion.SlerpToRef(this.cameraPivot.rotationQuaternion, this.cameraRotation, turnDampener, this.cameraPivot.rotationQuaternion);
                        // ..
                        // Set Camera Boom
                        // ..
                        const targetDistance = BABYLON.Scalar.Lerp(this.minimumDistance, this.maximumDistance, this.m_standardController.getNormalizedSpeed());
                        this.cameraBoomPosition.set(0, 0, -targetDistance);
                        this.m_cameraTransform.position.copyFrom(this.cameraBoomPosition);
                        BABYLON.Utilities.FromEulerToRef(this.setCameraPitch, 0, 0, this.m_cameraTransform.rotationQuaternion);
                    }
                }
                else {
                    this.m_cameraTransform.lookAt(target.position);
                }
            }
        }
    }
    PROJECT.VehicleCameraManager = VehicleCameraManager;
})(PROJECT || (PROJECT = {}));
var PROJECT;
(function (PROJECT) {
    /**
     * Babylon Script Component
     * @class VehicleInputController
     */
    class VehicleInputController extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.playerDeltaX = 0;
            this.playerDeltaY = 0;
            this.playerMouseX = 0;
            this.playerMouseY = 0;
            this.inBrakingZone = false;
            this.brakingZoneTag = "";
            this.waypointPosition = BABYLON.Vector3.Zero();
            this.waypointCount = 0;
            this.waypointIndex = 0;
            this.nextTargetSpeed = 0;
            this.prevTargetSpeed = 0;
            this.lastMovementTime = 0;
            this.vehicleResetCheck = 0;
            this.showChaseRabbit = false;
            this.showSensorLines = false;
            this.rabbitTrackerLine = null;
            this.rabbitTrackerColor = new BABYLON.Color3(1, 1, 1);
            this.greenTrackingColor = new BABYLON.Color3(0, 1, 0);
            this.redTrackingColor = new BABYLON.Color3(1, 0, 0);
            this.localTargetPosition = new BABYLON.Vector3(0, 0, 0);
            this.mainCenterSensorLine = null;
            this.mainRightSensorLine = null;
            this.mainLeftSensorLine = null;
            this.angleRightSensorLine = null;
            this.angleLeftSensorLine = null;
            this.sideRightSensorLine = null;
            this.sideLeftSensorLine = null;
            this.backRightSensorLine = null;
            this.backLeftSensorLine = null;
            this.sidewaysOffsetVector = BABYLON.Vector3.Zero();
            this.backBumperEdgeVector = BABYLON.Vector3.Zero();
            this.sensorStartPos = BABYLON.Vector3.Zero();
            this.sensorPointPos = BABYLON.Vector3.Zero();
            this.sensorAnglePos = BABYLON.Vector3.Zero();
            this.rsideStartPos = BABYLON.Vector3.Zero();
            this.rsidePointPos = BABYLON.Vector3.Zero();
            this.lsideStartPos = BABYLON.Vector3.Zero();
            this.lsidePointPos = BABYLON.Vector3.Zero();
            this.tempScaleVector = BABYLON.Vector3.Zero();
            this.rbackStartPos = BABYLON.Vector3.Zero();
            this.rbackPointPos = BABYLON.Vector3.Zero();
            this.lbackStartPos = BABYLON.Vector3.Zero();
            this.lbackPointPos = BABYLON.Vector3.Zero();
            this.trackVehiclePosition = BABYLON.Vector3.Zero();
            this.trackRabbitPosition = BABYLON.Vector3.Zero();
            this.enableInput = false;
            this.resetTiming = 3.0;
            this.playerNumber = BABYLON.PlayerNumber.One;
            this.triggerForward = BABYLON.Xbox360Trigger.Right;
            this.keyboardForawrd = BABYLON.UserInputKey.W;
            this.auxKeyboardForawrd = BABYLON.UserInputKey.UpArrow;
            this.triggerBackwards = BABYLON.Xbox360Trigger.Left;
            this.keyboardBackwards = BABYLON.UserInputKey.S;
            this.auxKeyboardBackwards = BABYLON.UserInputKey.DownArrow;
            this.buttonHandbrake = BABYLON.Xbox360Button.X;
            this.keyboardHandbrake = BABYLON.UserInputKey.SpaceBar;
            this.buttonDonut = BABYLON.Xbox360Button.B;
            this.keyboardDonut = BABYLON.UserInputKey.Shift;
            // Auto Pilot Properties
            this.raceLineNode = 0;
            this.minLookAhead = 5;
            this.maxLookAhead = 50;
            this.driverSkillLevel = 1;
            this.chaseRabbitSpeed = 1.0;
            this.throttleSensitivity = 1;
            this.steeringSensitivity = 1;
            this.brakingSensitivity = 1;
            this.brakingTurnAngle = 20;
            this.brakingSpeedLimit = 40;
            this.skiddingSpeedLimit = 80;
            this.linearDampenForce = 0.1;
            this.driveSpeedMultiplier = 5.0;
            this.resetMovingTimeout = 5;
            this.maxRaceTrackSpeed = 0;
            this.handBrakeZoneTag = "HandBrake";
            this.trackManagerIdentity = "TrackManager";
            // Auto Pilot Avoid Sensors
            this.vehicleTag = "Vehicle";
            this.obstacleTag = "Obstacle";
            this.sensorLength = 8;
            this.spacerWidths = 0.85;
            this.angleFactors = 1.5;
            this.initialOffsetX = 1;
            this.initialOffsetY = 0.5;
            this.initialOffsetZ = 2;
            this.sidewaysLength = 1.5;
            this.sidewaysOffset = 0.5;
            this.backBumperEdge = 2.5;
            this.avoidanceFactor = 0.5;
            // Auto Pilot Reverse Options
            this.reversingFlag = false;
            this.reversingTime = 0.0;
            this.reversingWait = 2.0;
            this.reversingFor = 1.5;
            // Vehicle Drive Properties
            this.m_chaseRabbitMesh = null;
            this.m_circuitInterfaces = null;
            this.m_circuitRaceLine_1 = null;
            this.m_circuitRaceLine_2 = null;
            this.m_circuitRaceLine_3 = null;
            this.m_circuitRaceLine_4 = null;
            this.m_circuitRaceLine_5 = null;
            this.m_rigidbodyPhysics = null;
            this.m_standardCarController = null;
        }
        // Public Properties
        getPlayerDeltaX() { return this.playerDeltaX; }
        ;
        getPlayerDeltaY() { return this.playerDeltaY; }
        ;
        getPlayerMouseX() { return this.playerMouseX; }
        ;
        getPlayerMouseY() { return this.playerMouseY; }
        ;
        getWaypointIndex() { return this.waypointIndex; }
        ;
        getChaseRabbitMesh() { return this.m_chaseRabbitMesh; }
        ;
        resetChaseRabbitMesh() {
            if (this.m_chaseRabbitMesh != null) {
                this.m_chaseRabbitMesh.position = this.transform.position.clone();
                this.m_chaseRabbitMesh.rotationQuaternion = this.transform.rotationQuaternion.clone();
            }
        }
        awake() { this.awakeVehicleController(); }
        start() { this.initVehicleController(); }
        update() { this.updateVehicleController(); }
        destroy() { this.destroyVehicleController(); }
        //////////////////////////////////////////////////
        // Protected Character Movement State Functions //
        //////////////////////////////////////////////////
        awakeVehicleController() {
            this.enableInput = this.getProperty("enableInput", this.enableInput);
            this.resetTiming = this.getProperty("resetTiming", this.resetTiming);
            this.playerNumber = this.getProperty("playerNumber", this.playerNumber);
            this.showChaseRabbit = this.getProperty("showChaseRabbit", this.showChaseRabbit);
            this.showSensorLines = this.getProperty("showSensorLines", this.showSensorLines);
            // ..
            this.minLookAhead = this.getProperty("minLookAhead", this.minLookAhead);
            this.maxLookAhead = this.getProperty("maxLookAhead", this.maxLookAhead);
            this.handBrakeZoneTag = this.getProperty("handBrakeZoneTag", this.handBrakeZoneTag);
            this.driverSkillLevel = this.getProperty("driverSkillLevel", this.driverSkillLevel);
            this.throttleSensitivity = this.getProperty("throttleSensitivity", this.throttleSensitivity);
            this.steeringSensitivity = this.getProperty("steeringSensitivity", this.steeringSensitivity);
            this.brakingSensitivity = this.getProperty("brakingSensitivity", this.brakingSensitivity);
            this.brakingTurnAngle = this.getProperty("brakingTurnAngle", this.brakingTurnAngle);
            this.brakingSpeedLimit = this.getProperty("brakingSpeedLimit", this.brakingSpeedLimit);
            this.skiddingSpeedLimit = this.getProperty("skiddingSpeedLimit", this.skiddingSpeedLimit);
            this.linearDampenForce = this.getProperty("linearDampenForce", this.linearDampenForce);
            this.resetMovingTimeout = this.getProperty("resetMovingTimeout", this.resetMovingTimeout);
            this.driveSpeedMultiplier = this.getProperty("driveSpeedMultiplier", this.driveSpeedMultiplier);
            this.maxRaceTrackSpeed = this.getProperty("maxRaceTrackSpeed", this.maxRaceTrackSpeed);
            this.trackManagerIdentity = this.getProperty("trackManagerIdentity", this.trackManagerIdentity);
            // ..
            this.vehicleTag = this.getProperty("vehicleTag", this.vehicleTag);
            this.obstacleTag = this.getProperty("obstacleTag", this.obstacleTag);
            this.sensorLength = this.getProperty("sensorLength", this.sensorLength);
            this.spacerWidths = this.getProperty("spacerWidths", this.spacerWidths);
            this.angleFactors = this.getProperty("angleFactors", this.angleFactors);
            this.initialOffsetX = this.getProperty("initialOffsetX", this.initialOffsetX);
            this.initialOffsetY = this.getProperty("initialOffsetY", this.initialOffsetY);
            this.initialOffsetZ = this.getProperty("initialOffsetZ", this.initialOffsetZ);
            this.sidewaysLength = this.getProperty("sidewaysLength", this.sidewaysLength);
            this.sidewaysOffset = this.getProperty("sidewaysOffset", this.sidewaysOffset);
            this.backBumperEdge = this.getProperty("backBumperEdge", this.backBumperEdge);
            this.avoidanceFactor = this.getProperty("avoidanceFactor", this.avoidanceFactor);
            // ..
            if (this.throttleSensitivity <= 0)
                this.throttleSensitivity = 1;
            if (this.steeringSensitivity <= 0)
                this.steeringSensitivity = 1;
            if (this.brakingSensitivity <= 0)
                this.brakingSensitivity = 1;
            if (this.linearDampenForce <= 0)
                this.linearDampenForce = 0.1;
            if (this.angleFactors <= 0)
                this.angleFactors = 1.5;
            if (this.sensorLength <= 0)
                this.sensorLength = 8;
            if (this.sidewaysLength <= 0)
                this.sidewaysLength = 1;
            // ..
            if (this.brakingSpeedLimit <= 0)
                this.brakingSpeedLimit = 40;
            if (this.skiddingSpeedLimit <= 0)
                this.skiddingSpeedLimit = 80;
            if (this.driveSpeedMultiplier <= 1)
                this.driveSpeedMultiplier = 1;
            if (this.handBrakeZoneTag == null || this.handBrakeZoneTag === "")
                this.handBrakeZoneTag = "HandBrake";
            if (this.trackManagerIdentity == null || this.trackManagerIdentity === "")
                this.trackManagerIdentity = "TrackManager";
            // ..
            const initialRaceLineNode = this.getProperty("initialRaceLineNode", 1);
            this.raceLineNode = (initialRaceLineNode - 1);
        }
        initVehicleController() {
            this.m_rigidbodyPhysics = this.getComponent("BABYLON.RigidbodyPhysics");
            if (this.m_rigidbodyPhysics != null) {
                this.m_rigidbodyPhysics.onCollisionEnterObservable.add((mesh) => {
                    const tag = BABYLON.SceneManager.GetTransformTag(mesh);
                    if (tag === this.vehicleTag) {
                        // BABYLON.SceneManager.ConsoleWarn(this.transform.name.toLocaleUpperCase() + " CAR COLLISION ENTER: " + mesh.name + " ---> TAG: " + tag);
                    }
                    else if (tag === this.handBrakeZoneTag) {
                        this.inBrakingZone = true;
                        this.brakingZoneTag = tag;
                        //BABYLON.SceneManager.ConsoleWarn(this.transform.name.toLocaleUpperCase() + " BRAKE ZONE ENTER: " + mesh.name + " ---> TAG: " + tag);
                    }
                });
                this.m_rigidbodyPhysics.onCollisionStayObservable.add((mesh) => {
                    if (mesh != null) {
                        const tag = BABYLON.SceneManager.GetTransformTag(mesh);
                        if (tag === this.vehicleTag) {
                            // BABYLON.SceneManager.ConsoleLog(this.transform.name.toLocaleUpperCase() + " CAR COLLISION STAY: " + mesh.name + " ---> TAG: " + tag);
                        }
                        else if (tag === this.handBrakeZoneTag) {
                            //this.inbrakingZone = true;
                            //this.brakingZoneTag = tag;
                            //BABYLON.SceneManager.ConsoleLog(this.transform.name.toLocaleUpperCase() + " BRAKE ZONE STAY: " + mesh.name + " ---> TAG: " + tag);
                        }
                    }
                });
                this.m_rigidbodyPhysics.onCollisionExitObservable.add((mesh) => {
                    if (mesh != null) {
                        const tag = BABYLON.SceneManager.GetTransformTag(mesh);
                        if (tag === this.vehicleTag) {
                            // BABYLON.SceneManager.ConsoleWarn(this.transform.name.toLocaleUpperCase() + " CAR COLLISION EXIT: " + mesh.name + " ---> TAG: " + tag);
                        }
                        else if (tag === this.handBrakeZoneTag) {
                            this.inBrakingZone = false;
                            this.brakingZoneTag = "";
                            //BABYLON.SceneManager.ConsoleWarn(this.transform.name.toLocaleUpperCase() + " BRAKE ZONE EXIT: " + mesh.name + " ---> TAG: " + tag);
                        }
                    }
                });
            }
            else {
                BABYLON.SceneManager.LogWarning("Null rigidbody physics for: " + this.transform.name);
            }
            // Get Standard Car Controller
            this.m_standardCarController = this.getComponent("PROJECT.StandardCarController");
            if (this.m_standardCarController != null) {
                this.m_standardCarController.playVehicleSounds = true;
            }
            else {
                BABYLON.SceneManager.LogWarning("Null standard car controller for: " + this.transform.name);
            }
            // Get Race Track Manager Waypoints
            const waypointsTransform = BABYLON.SceneManager.GetTransformNode(this.scene, this.trackManagerIdentity);
            if (waypointsTransform != null) {
                const raceTrackManager = BABYLON.SceneManager.FindScriptComponent(waypointsTransform, "PROJECT.RaceTrackManager");
                if (raceTrackManager != null) {
                    this.waypointCount = 0;
                    this.waypointIndex = 0;
                    this.m_circuitInterfaces = raceTrackManager.getTrackNodes();
                    this.m_circuitRaceLine_1 = raceTrackManager.getControlPoints(0);
                    this.m_circuitRaceLine_2 = raceTrackManager.getControlPoints(1);
                    this.m_circuitRaceLine_3 = raceTrackManager.getControlPoints(2);
                    this.m_circuitRaceLine_4 = raceTrackManager.getControlPoints(3);
                    this.m_circuitRaceLine_5 = raceTrackManager.getControlPoints(4);
                    if (this.m_circuitInterfaces != null && this.m_circuitInterfaces.length > 0) {
                        this.waypointCount = this.m_circuitInterfaces.length;
                    }
                }
                else {
                    BABYLON.SceneManager.LogWarning("Fail to locate race track manager for: " + this.transform.name);
                }
            }
            else {
                BABYLON.SceneManager.LogWarning("Fail to locate race track manager '" + this.trackManagerIdentity + "' for: " + this.transform.name);
            }
        }
        updateVehicleController() {
            if (this.enableInput === true) {
                if (this.playerNumber === 0) {
                    this.updateAutoPilotDrive();
                }
                else {
                    this.updateManualInputDrive();
                }
            }
            //////////////////////////////////////////////////////////////////////////////////
            // Validate Vehicle Flipped Upright
            //////////////////////////////////////////////////////////////////////////////////
            if (this.resetTiming > 0 && this.m_standardCarController != null) {
                const gameTime = BABYLON.SceneManager.GetGameTime();
                if (this.transform.up.y > 0.5 || this.m_standardCarController.getAbsoluteSpeed() > 1) {
                    this.vehicleResetCheck = gameTime;
                }
                if (gameTime > (this.vehicleResetCheck + this.resetTiming)) {
                    this.transform.position.addInPlace(BABYLON.Vector3.Up().scale(0.5));
                    BABYLON.Utilities.LookRotationToRef(this.transform.forward, this.transform.rotationQuaternion);
                }
            }
        }
        updateManualInputDrive() {
            if (this.m_standardCarController != null) {
                this.playerDeltaX = BABYLON.SceneManager.GetUserInput(BABYLON.UserInputAxis.Horizontal, this.playerNumber);
                this.playerDeltaY = BABYLON.SceneManager.GetUserInput(BABYLON.UserInputAxis.Vertical, this.playerNumber);
                this.playerMouseX = BABYLON.SceneManager.GetUserInput(BABYLON.UserInputAxis.MouseX, this.playerNumber);
                this.playerMouseY = BABYLON.SceneManager.GetUserInput(BABYLON.UserInputAxis.MouseY, this.playerNumber);
                // Get Button Triggers
                const auxForwardKeyboard = BABYLON.SceneManager.GetKeyboardInput(this.auxKeyboardForawrd); // Player One Only
                const forwardKeyboard = BABYLON.SceneManager.GetKeyboardInput(this.keyboardForawrd); // Player One Only
                const forwardTrigger = BABYLON.SceneManager.GetGamepadTriggerInput(this.triggerForward, this.playerNumber);
                const auxBackwardKeyboard = BABYLON.SceneManager.GetKeyboardInput(this.auxKeyboardBackwards); // Player One Only
                const backwardKeyboard = BABYLON.SceneManager.GetKeyboardInput(this.keyboardBackwards); // Player One Only
                const backwardTrigger = BABYLON.SceneManager.GetGamepadTriggerInput(this.triggerBackwards, this.playerNumber);
                const handbrakeKeyboard = BABYLON.SceneManager.GetKeyboardInput(this.keyboardHandbrake); // Player One Only
                const handbrakeButton = BABYLON.SceneManager.GetGamepadButtonInput(this.buttonHandbrake, this.playerNumber);
                const donutKeyboard = BABYLON.SceneManager.GetKeyboardInput(this.keyboardDonut); // Player One Only
                const donutButton = BABYLON.SceneManager.GetGamepadButtonInput(this.buttonDonut, this.playerNumber);
                // Reset Player Movement
                let playerNumber = this.playerNumber;
                let playerMovement = 0;
                let playerSteering = 0;
                let playerAssisted = true;
                let playerHandbrake = false;
                let playerDonuts = false;
                // Primary Accelerattion
                if (forwardTrigger > 0.2)
                    playerMovement = forwardTrigger;
                else if (this.playerNumber === BABYLON.PlayerNumber.One && (forwardKeyboard === true || auxForwardKeyboard === true))
                    playerMovement = 1;
                // Braking Takes Precedence
                if (backwardTrigger > 0.2)
                    playerMovement = -backwardTrigger;
                else if (this.playerNumber === BABYLON.PlayerNumber.One && (backwardKeyboard === true || auxBackwardKeyboard === true))
                    playerMovement = -1;
                // Includes AD And Arrow Keys
                playerSteering = this.playerDeltaX;
                // Pull Hard Hand Brake Lever
                playerHandbrake = (handbrakeKeyboard === true || handbrakeButton === true);
                // Press Burnout Donut Button
                playerDonuts = (donutKeyboard === true || donutButton === true);
                // Drive Standard Car Controller
                this.m_standardCarController.throttleEngineSpeed = 0;
                this.m_standardCarController.throttleBrakingForce = 0;
                this.m_standardCarController.slideWhenFootBraking = false;
                this.m_standardCarController.drive(playerMovement, playerSteering, playerHandbrake, playerDonuts, playerAssisted, false);
            }
        }
        updateAutoPilotDrive() {
            if (this.m_standardCarController != null) {
                const gameTime = this.getGameTime();
                const transformPosition = this.transform.getAbsolutePosition();
                this.driverSkillLevel = BABYLON.Scalar.Clamp(this.driverSkillLevel, 1, 10);
                this.raceLineNode = BABYLON.Scalar.Clamp(this.raceLineNode, 0, 4);
                if (this.m_chaseRabbitMesh == null) {
                    this.m_chaseRabbitMesh = BABYLON.MeshBuilder.CreateSphere(this.transform.name + ".Rabbit", { segments: 24, diameter: 1 }, this.scene);
                    this.m_chaseRabbitMesh.checkCollisions = false;
                    this.m_chaseRabbitMesh.receiveShadows = false;
                    this.m_chaseRabbitMesh.visibility = 1.0;
                    this.m_chaseRabbitMesh.isVisible = false;
                    this.resetChaseRabbitMesh();
                }
                if (this.m_chaseRabbitMesh != null) {
                    if (this.m_chaseRabbitMesh.isVisible === true && this.showChaseRabbit === false) {
                        this.m_chaseRabbitMesh.isVisible = false;
                    }
                    if (this.m_chaseRabbitMesh.isVisible === false && this.showChaseRabbit === true) {
                        this.m_chaseRabbitMesh.isVisible = true;
                    }
                }
                if (this.m_standardCarController.getAbsoluteSpeed() >= 1) {
                    this.lastMovementTime = gameTime;
                }
                ////////////////////////////////////////////////////////////////////////////////////////////
                // Sensor Update System
                ////////////////////////////////////////////////////////////////////////////////////////////
                let tagname = "";
                let contact = false;
                let raycast = null;
                let avoidance = 0;
                this.sidewaysOffsetVector.set(0, 0, -this.sidewaysOffset);
                this.backBumperEdgeVector.set(0, 0, -this.backBumperEdge);
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Setup Main Sensor Start
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                this.sensorStartPos.copyFrom(transformPosition);
                this.transform.up.scaleAndAddToRef(this.initialOffsetY, this.sensorStartPos);
                this.transform.forward.scaleAndAddToRef(this.initialOffsetZ, this.sensorStartPos);
                // Setup Main Sensor Point
                this.sensorPointPos.copyFrom(this.sensorStartPos);
                this.transform.forward.scaleAndAddToRef(this.sensorLength, this.sensorPointPos);
                this.sensorAnglePos.copyFrom(this.sensorPointPos);
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Setup Right Side Sensor Start
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.rsideStartPos, this.sidewaysOffsetVector);
                this.transform.up.scaleAndAddToRef(this.initialOffsetY, this.rsideStartPos);
                this.transform.right.scaleAndAddToRef(this.initialOffsetX, this.rsideStartPos);
                // Setup Right Side Sensor Point
                this.rsidePointPos.copyFrom(this.rsideStartPos);
                this.transform.right.scaleAndAddToRef(this.sidewaysLength, this.rsidePointPos);
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Setup Right Back Sensor Start
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.rbackStartPos, this.backBumperEdgeVector);
                this.transform.up.scaleAndAddToRef(this.initialOffsetY, this.rbackStartPos);
                this.transform.right.scaleAndAddToRef(this.initialOffsetX, this.rbackStartPos);
                // Setup Right Back Sensor Point
                this.rbackPointPos.copyFrom(this.rbackStartPos);
                this.transform.right.scaleAndAddToRef(this.sidewaysLength, this.rbackPointPos);
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Setup Left Side Sensor Start
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.lsideStartPos, this.sidewaysOffsetVector);
                this.transform.up.scaleAndAddToRef(this.initialOffsetY, this.lsideStartPos);
                this.transform.right.scaleAndAddToRef(-this.initialOffsetX, this.lsideStartPos);
                // Setup Left Side Sensor Point
                this.lsidePointPos.copyFrom(this.lsideStartPos);
                this.transform.right.scaleAndAddToRef(-this.sidewaysLength, this.lsidePointPos);
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Setup Left Back Sensor Start
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.lbackStartPos, this.backBumperEdgeVector);
                this.transform.up.scaleAndAddToRef(this.initialOffsetY, this.lbackStartPos);
                this.transform.right.scaleAndAddToRef(-this.initialOffsetX, this.lbackStartPos);
                // Setup Left Back Sensor Point
                this.lbackPointPos.copyFrom(this.lbackStartPos);
                this.transform.right.scaleAndAddToRef(-this.sidewaysLength, this.lbackPointPos);
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Save Initial Start Point
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                const firstSensorStartPos = this.sensorStartPos.clone();
                const firstSensorPointPos = this.sensorPointPos.clone();
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Main Right Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let mainRightSensorContact = false;
                this.transform.right.scaleToRef(this.spacerWidths, this.tempScaleVector);
                this.sensorStartPos.addInPlace(this.tempScaleVector);
                this.sensorPointPos.addInPlace(this.tempScaleVector);
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, this.sensorStartPos, this.sensorPointPos);
                if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                    tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                    contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                    if (contact === true) {
                        mainRightSensorContact = true;
                        avoidance -= 1.0;
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.mainRightSensorLine == null)
                        this.mainRightSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".MainRightSensorLine", this.scene);
                    if (contact === true) {
                        this.mainRightSensorLine.drawLine([this.sensorStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.mainRightSensorLine.drawLine([this.sensorStartPos, this.sensorPointPos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Angle Right Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let angleRightSensorContact = false;
                this.transform.right.scaleToRef((this.spacerWidths * 2) * this.angleFactors, this.tempScaleVector);
                this.sensorAnglePos.addInPlace(this.tempScaleVector);
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, this.sensorStartPos, this.sensorAnglePos);
                if (mainRightSensorContact === false) {
                    if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                        tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                        contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                        if (contact === true) {
                            angleRightSensorContact = true;
                            avoidance -= 0.5;
                        }
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.angleRightSensorLine == null)
                        this.angleRightSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".AngleRightSensorLine", this.scene);
                    if (contact === true) {
                        this.angleRightSensorLine.drawLine([this.sensorStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.angleRightSensorLine.drawLine([this.sensorStartPos, this.sensorAnglePos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Side Right Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let sideRightSensorContact = false;
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, this.rsideStartPos, this.rsidePointPos);
                if (mainRightSensorContact === false && angleRightSensorContact === false) {
                    if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                        tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                        contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                        if (contact === true) {
                            sideRightSensorContact = true;
                            avoidance -= 0.5;
                        }
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.sideRightSensorLine == null)
                        this.sideRightSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".SideRightSensorLine", this.scene);
                    if (contact === true) {
                        this.sideRightSensorLine.drawLine([this.rsideStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.sideRightSensorLine.drawLine([this.rsideStartPos, this.rsidePointPos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Back Right Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, this.rbackStartPos, this.rbackPointPos);
                if (mainRightSensorContact === false && angleRightSensorContact === false && sideRightSensorContact === false) {
                    if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                        tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                        contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                        if (contact === true) {
                            avoidance -= 0.5;
                        }
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.backRightSensorLine == null)
                        this.backRightSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".BackRightSensorLine", this.scene);
                    if (contact === true) {
                        this.backRightSensorLine.drawLine([this.rbackStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.backRightSensorLine.drawLine([this.rbackStartPos, this.rbackPointPos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Main Left Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let mainLeftSensorContact = false;
                this.transform.right.scaleToRef(-(this.spacerWidths * 2), this.tempScaleVector);
                this.sensorStartPos.addInPlace(this.tempScaleVector);
                this.sensorPointPos.addInPlace(this.tempScaleVector);
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, this.sensorStartPos, this.sensorPointPos);
                if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                    tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                    contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                    if (contact === true) {
                        mainLeftSensorContact = true;
                        avoidance += 1.0;
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.mainLeftSensorLine == null)
                        this.mainLeftSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".MainLeftSensorLine", this.scene);
                    if (contact === true) {
                        this.mainLeftSensorLine.drawLine([this.sensorStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.mainLeftSensorLine.drawLine([this.sensorStartPos, this.sensorPointPos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Angle Left Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let angleLeftSensorContact = false;
                this.transform.right.scaleToRef(-(this.spacerWidths * 4) * this.angleFactors, this.tempScaleVector);
                this.sensorAnglePos.addInPlace(this.tempScaleVector);
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, this.sensorStartPos, this.sensorAnglePos);
                if (mainLeftSensorContact === false) {
                    if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                        tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                        contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                        if (contact === true) {
                            angleLeftSensorContact = true;
                            avoidance += 0.5;
                        }
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.angleLeftSensorLine == null)
                        this.angleLeftSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".AngleLeftSensorLine", this.scene);
                    if (contact === true) {
                        this.angleLeftSensorLine.drawLine([this.sensorStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.angleLeftSensorLine.drawLine([this.sensorStartPos, this.sensorAnglePos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Side Left Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let sideLeftSensorContact = false;
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, this.lsideStartPos, this.lsidePointPos);
                if (mainLeftSensorContact === false && angleLeftSensorContact === false) {
                    if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                        tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                        contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                        if (contact === true) {
                            sideLeftSensorContact = true;
                            avoidance += 0.5;
                        }
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.sideLeftSensorLine == null)
                        this.sideLeftSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".SideLeftSensorLine", this.scene);
                    if (contact === true) {
                        this.sideLeftSensorLine.drawLine([this.lsideStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.sideLeftSensorLine.drawLine([this.lsideStartPos, this.lsidePointPos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Back Left Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, this.lbackStartPos, this.lbackPointPos);
                if (mainLeftSensorContact === false && angleLeftSensorContact === false && sideLeftSensorContact === false) {
                    if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                        tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                        contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                        if (contact === true) {
                            avoidance += 0.5;
                        }
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.backLeftSensorLine == null)
                        this.backLeftSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".BackLeftSensorLine", this.scene);
                    if (contact === true) {
                        this.backLeftSensorLine.drawLine([this.lbackStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.backLeftSensorLine.drawLine([this.lbackStartPos, this.lbackPointPos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Main Center Line Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, firstSensorStartPos, firstSensorPointPos);
                if (avoidance === 0) {
                    if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                        tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                        contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                        if (contact === true) {
                            if (raycast.hitNormal.x < 0) {
                                avoidance = -1;
                            }
                            else {
                                avoidance = 1;
                            }
                        }
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.mainCenterSensorLine == null)
                        this.mainCenterSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".MainCenterSensorLine", this.scene);
                    if (contact === true) {
                        this.mainCenterSensorLine.drawLine([firstSensorStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    }
                    else {
                        this.mainCenterSensorLine.drawLine([firstSensorStartPos, firstSensorPointPos], BABYLON.Color3.Blue());
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // TODO - Long Range Brake Threat Raycast
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /*
                tagname = "";
                contact = false;
                raycast = BABYLON.SceneManager.PhysicsRaycastToPoint(this.scene, firstSensorStartPos, firstSensorPointPos);
                if (avoidance === 0) {
                    if (raycast.hasHit === true && raycast.collisionObject != null && raycast.collisionObject.entity != null) {
                        tagname = BABYLON.SceneManager.GetTransformTag(raycast.collisionObject.entity);
                        contact = (tagname == this.vehicleTag || tagname === this.obstacleTag);
                        if (contact === true) {
                        }
                    }
                }
                if (this.showSensorLines === true) {
                    if (this.mainCenterSensorLine == null) this.mainCenterSensorLine = new BABYLON.LinesMeshRenderer(this.transform.name + ".MainCenterSensorLine", this.scene);
                    if (contact === true) {
                        this.mainCenterSensorLine.drawLine([firstSensorStartPos, raycast.hitPoint], BABYLON.Color3.Yellow());
                    } else {
                        this.mainCenterSensorLine.drawLine([firstSensorStartPos, firstSensorPointPos], BABYLON.Color3.Blue());
                    }
                }
                */
                ////////////////////////////////////////////////////////////////////////////////////////////
                /* TODO - CarAIControl.cs (Standard Assets)
                // if are we currently taking evasive action to prevent being stuck against another car:
                if (Time.time < m_AvoidOtherCarTime)
                {
                    // slow down if necessary (if we were behind the other car when collision occured)
                    desiredSpeed *= m_AvoidOtherCarSlowdown;

                    // and veer towards the side of our path-to-target that is away from the other car
                    offsetTargetPos += m_Target.right * m_AvoidPathOffset;
                }
                else
                {
                    // no need for evasive action, we can just wander across the path-to-target in a random way,
                    // which can help prevent AI from seeming too uniform and robotic in their driving
                    offsetTargetPos += m_Target.right * (Mathf.PerlinNoise(Time.time*m_LateralWanderSpeed, m_RandomPerlin)*2 - 1) * m_LateralWanderDistance;
                }*/
                const trackNode = this.getCurrentTrackNode(this.waypointIndex);
                const controlPoint = this.getCurrentControlPoint(this.raceLineNode, this.waypointIndex);
                if (this.m_chaseRabbitMesh != null && this.waypointCount > 0 && trackNode != null && controlPoint != null) {
                    this.waypointPosition.set(controlPoint.position.x, controlPoint.position.y, controlPoint.position.z);
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    const targetSpeed = (controlPoint.speed > 0 ? controlPoint.speed : 100) * this.getDriverSkillFactor();
                    const targetRadius = (trackNode.radius * 1);
                    const distToTarget = BABYLON.Vector3.Distance(this.waypointPosition, transformPosition);
                    if (distToTarget < targetRadius) {
                        if (this.prevTargetSpeed <= 0)
                            this.prevTargetSpeed = targetSpeed;
                        this.nextTargetSpeed = BABYLON.Scalar.Lerp(this.prevTargetSpeed, targetSpeed, (1.0 - (distToTarget / targetRadius)));
                        if (this.showChaseRabbit === true)
                            this.rabbitTrackerColor = this.redTrackingColor;
                    }
                    else {
                        this.nextTargetSpeed = targetSpeed;
                        if (this.showChaseRabbit === true)
                            this.rabbitTrackerColor = this.greenTrackingColor;
                    }
                    const normalizeSpeed = this.m_standardCarController.getNormalizedSpeed();
                    const americanSpeed = this.m_standardCarController.getAmericanSpeed();
                    const lookAhead = BABYLON.Scalar.Lerp(this.minLookAhead, this.maxLookAhead, normalizeSpeed);
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // TODO - UPDATE CHASE RABBIT - Walk Spline Waypoint Positions - (RaceTrackManager.GetRoadAheadDirection) - ???
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    const rabbitPosition = this.m_chaseRabbitMesh.getAbsolutePosition();
                    const rabbitDistance = BABYLON.Vector3.Distance(transformPosition, rabbitPosition);
                    if (rabbitDistance <= lookAhead) {
                        this.chaseRabbitSpeed = BABYLON.Scalar.Lerp(1.0, this.driveSpeedMultiplier, normalizeSpeed);
                        this.m_chaseRabbitMesh.lookAt(this.waypointPosition);
                        this.m_chaseRabbitMesh.translate(BABYLON.Axis.Z, this.chaseRabbitSpeed);
                    }
                    if (this.showChaseRabbit === true) {
                        this.trackVehiclePosition.set(transformPosition.x, (transformPosition.y + 0.5), transformPosition.z);
                        this.trackRabbitPosition.set(rabbitPosition.x, (rabbitPosition.y + 0.25), rabbitPosition.z);
                        if (this.rabbitTrackerLine == null)
                            this.rabbitTrackerLine = new BABYLON.LinesMeshRenderer((this.transform.name + ".TrackingLine"), this.scene);
                        if (this.rabbitTrackerLine != null)
                            this.rabbitTrackerLine.drawLine([this.trackVehiclePosition, this.trackRabbitPosition], this.rabbitTrackerColor);
                    }
                    // ..
                    // Validate Waypoint Distance
                    // ..
                    const waypointDistance = BABYLON.Vector3.Distance(rabbitPosition, this.waypointPosition);
                    if (waypointDistance <= 5.0) {
                        this.prevTargetSpeed = this.nextTargetSpeed;
                        this.waypointIndex++;
                        if (this.waypointIndex >= this.waypointCount) {
                            this.waypointIndex = 0;
                        }
                    }
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    BABYLON.Utilities.InverseTransformPointToRef(this.transform, rabbitPosition, this.localTargetPosition);
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // TODO - Reset Stuck Movement
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (gameTime > (this.lastMovementTime + this.resetMovingTimeout)) {
                        //const localWaypointTrn:BABYLON.TransformNode = (this.transform.parent != null) ? this.transform.parent as BABYLON.TransformNode : this.transform
                        //const localWaypointPos:BABYLON.Vector3 = BABYLON.Utilities.InverseTransformPoint(localWaypointTrn, this.waypointPosition);
                        //const localWaypointPos:BABYLON.Vector3 = transformPosition.clone();
                        //localWaypointPos.multiplyInPlace(BABYLON.Vector3.Up().scale(0.25));
                        //this.transform.position.copyFrom(localWaypointPos);
                        // TODO - FIXME - Reset To Waypoint Global Position
                        // this.transform.position.y += 0.25;
                        // BABYLON.SceneManager.ConsoleLog(this.transform.name.toUpperCase() + " - RESET WAYPOINT POS: " + transformPosition.toString());
                    }
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    const localTargetAngle = BABYLON.Tools.ToDegrees(Math.atan2(this.localTargetPosition.x, this.localTargetPosition.z));
                    const cornerAngle = BABYLON.Scalar.Clamp(Math.abs(localTargetAngle), 0, 90);
                    const cornerFactor = cornerAngle / 90;
                    // ..
                    // Update Vehicle Driving
                    // ..
                    let braking = 0;
                    let slowdown = 0;
                    let sliding = false;
                    let drifting = false;
                    let assisted = false;
                    let topspeed = this.maxRaceTrackSpeed;
                    let throttle = (1.0 * this.throttleSensitivity);
                    let steering = BABYLON.Scalar.Clamp(((this.localTargetPosition.x / this.localTargetPosition.length()) * this.steeringSensitivity), -1, 1);
                    if (this.avoidanceFactor > 0 && avoidance !== 0) {
                        const lowSpeedAvoidance = ((avoidance * 0.6) * this.avoidanceFactor);
                        const highSpeedAvoidance = ((avoidance * 0.3) * this.avoidanceFactor);
                        steering += BABYLON.Scalar.Lerp(lowSpeedAvoidance, highSpeedAvoidance, normalizeSpeed);
                    }
                    // ..
                    // TODO - CarAIControl.cs (Standard Assets)
                    // add acceleration 'wander', which also prevents AI from seeming too uniform and robotic in their driving
                    // i.e. increasing the accel wander amount can introduce jostling and bumps between AI cars in a race
                    // accel *= (1 - m_AccelWanderAmount) + (Mathf.PerlinNoise(Time.time * m_AccelWanderSpeed, m_RandomPerlin) * m_AccelWanderAmount);
                    // ..
                    let handbraking = false;
                    if (this.nextTargetSpeed <= 0)
                        this.nextTargetSpeed = targetSpeed;
                    if (americanSpeed > this.nextTargetSpeed) { // Target Speed Throttling
                        slowdown = BABYLON.Scalar.Lerp(0.0, this.linearDampenForce, normalizeSpeed);
                        throttle *= 0.2; // Note : 20 Percent Throttle Input
                    }
                    if (this.brakingTurnAngle > 0) { // Corner Angle Foot Braking
                        if (cornerAngle >= this.brakingTurnAngle && americanSpeed >= this.brakingSpeedLimit) {
                            braking = BABYLON.Scalar.Lerp(0, (1 + normalizeSpeed), cornerFactor);
                            slowdown = 0;
                            sliding = true;
                            // ..
                            // Hard Hand Braking Zones
                            // ..
                            handbraking = (braking > 0 && this.inBrakingZone === true && this.brakingZoneTag === this.handBrakeZoneTag && americanSpeed >= this.skiddingSpeedLimit);
                            if (handbraking === true)
                                braking = 1.0; // Note: Use Hand Braking Zone Strength
                        }
                    }
                    if (braking > 0)
                        braking = BABYLON.Scalar.Clamp((braking * this.brakingSensitivity), 0, 1);
                    // if (braking > 0) BABYLON.SceneManager.ConsoleLog(this.transform.name.toUpperCase() + " - AUTO BRAKING: " + braking.toFixed(2) + " AT ANGLE: " + cornerAngle.toFixed(2) + " HAND BRAKING: " + handbraking);
                    if (braking > 0)
                        throttle = (-braking);
                    // ..
                    this.m_standardCarController.throttleEngineSpeed = topspeed;
                    this.m_standardCarController.throttleBrakingForce = slowdown;
                    this.m_standardCarController.slideWhenFootBraking = sliding;
                    this.m_standardCarController.drive(throttle, steering, handbraking, drifting, assisted, true);
                }
            }
        }
        getDriverSkillFactor() {
            let result = 0.60;
            switch (this.driverSkillLevel) {
                case 10:
                    result = 1.00;
                    break;
                case 9:
                    result = 0.98;
                    break;
                case 8:
                    result = 0.95;
                    break;
                case 7:
                    result = 0.90;
                    break;
                case 6:
                    result = 0.85;
                    break;
                case 5:
                    result = 0.80;
                    break;
                case 4:
                    result = 0.75;
                    break;
                case 3:
                    result = 0.70;
                    break;
                case 2:
                    result = 0.65;
                    break;
                case 1:
                    result = 0.60;
                    break;
            }
            return result;
        }
        getCurrentTrackNode(index) {
            let result = null;
            if (index >= 0 && index < this.waypointCount) {
                result = this.m_circuitInterfaces[index];
            }
            return result;
        }
        getCurrentControlPoint(lane, index) {
            let result = null;
            if (index >= 0 && index < this.waypointCount) {
                switch (lane) {
                    case 0:
                        result = this.m_circuitRaceLine_1[index];
                        break;
                    case 1:
                        result = this.m_circuitRaceLine_2[index];
                        break;
                    case 2:
                        result = this.m_circuitRaceLine_3[index];
                        break;
                    case 3:
                        result = this.m_circuitRaceLine_4[index];
                        break;
                    case 4:
                        result = this.m_circuitRaceLine_5[index];
                        break;
                }
            }
            return result;
        }
        destroyVehicleController() {
            this.m_circuitInterfaces = null;
            this.m_circuitRaceLine_1 = null;
            this.m_circuitRaceLine_2 = null;
            this.m_circuitRaceLine_3 = null;
            this.m_circuitRaceLine_4 = null;
            this.m_circuitRaceLine_5 = null;
            this.m_rigidbodyPhysics = null;
            this.m_standardCarController = null;
            if (this.m_chaseRabbitMesh != null) {
                this.m_chaseRabbitMesh.dispose();
                this.m_chaseRabbitMesh = null;
            }
        }
    }
    PROJECT.VehicleInputController = VehicleInputController;
})(PROJECT || (PROJECT = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon animation state pro class (Unity Style Mechanim Animation System)
     * @class AnimationState - All rights reserved (c) 2020 Mackey Kinard
     */
    class AnimationState extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this._frametime = 0;
            this._layercount = 0;
            this._updatemode = 0;
            this._hasrootmotion = false;
            this._initialtargetblending = false;
            this._hastransformhierarchy = false;
            this._leftfeetbottomheight = 0;
            this._rightfeetbottomheight = 0;
            this._runtimecontroller = null;
            this._executed = false;
            this._checkers = new BABYLON.TransitionCheck();
            this._source = "";
            this._machine = null;
            this._deltaPosition = new BABYLON.Vector3(0, 0, 0);
            this._deltaRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            this._positionWeight = false;
            this._rootBoneWeight = false;
            this._rotationWeight = false;
            this._rootQuatWeight = false;
            //private _linearVelocity:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            this._angularVelocity = new BABYLON.Vector3(0, 0, 0);
            this._positionHolder = new BABYLON.Vector3(0, 0, 0);
            this._rootBoneHolder = new BABYLON.Vector3(0, 0, 0);
            this._rotationHolder = new BABYLON.Quaternion(0, 0, 0, 1);
            this._rootQuatHolder = new BABYLON.Quaternion(0, 0, 0, 1);
            this._rootMotionMatrix = BABYLON.Matrix.Zero();
            this._rootMotionScaling = new BABYLON.Vector3(0, 0, 0);
            this._rootMotionRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            this._rootMotionPosition = new BABYLON.Vector3(0, 0, 0);
            this._lastMotionRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            this._lastMotionPosition = new BABYLON.Vector3(0, 0, 0);
            this._deltaPositionFixed = new BABYLON.Vector3(0, 0, 0);
            this._deltaPositionMatrix = new BABYLON.Matrix();
            this._saveDeltaPosition = new BABYLON.Vector3(0, 0, 0);
            this._saveDeltaRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            this._dirtyMotionMatrix = null;
            this._dirtyBlenderMatrix = null;
            //private _bodyOrientationAngleY:number = 0;
            //private transformForwardVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            //private transformRightVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            //private desiredForwardVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            //private desiredRightVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            this._targetPosition = new BABYLON.Vector3(0, 0, 0);
            this._targetRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            this._targetScaling = new BABYLON.Vector3(1, 1, 1);
            this._updateMatrix = BABYLON.Matrix.Zero();
            this._blenderMatrix = BABYLON.Matrix.Zero();
            this._blendWeights = new BABYLON.BlendingWeights();
            this._emptyScaling = new BABYLON.Vector3(1, 1, 1);
            this._emptyPosition = new BABYLON.Vector3(0, 0, 0);
            this._emptyRotation = new BABYLON.Quaternion(0, 0, 0, 1);
            this._data = new Map();
            this._anims = new Map();
            this._numbers = new Map();
            this._booleans = new Map();
            this._triggers = new Map();
            this._parameters = new Map();
            this.speedRatio = 1.0;
            this.updatePosition = false;
            this.updateRotation = false;
            this.applyRootMotion = false;
            this.enableAnimation = true;
            this.moveWithCollisions = false;
            /** Register handler that is triggered when the animation ik setup has been triggered */
            this.onAnimationIKObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the animation end has been triggered */
            this.onAnimationEndObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the animation loop has been triggered */
            this.onAnimationLoopObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the animation event has been triggered */
            this.onAnimationEventObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the animation frame has been updated */
            this.onAnimationUpdateObservable = new BABYLON.Observable();
            this.m_avatarMask = null;
            this.m_defaultGroup = null;
            this.m_animationTargets = null;
            this.m_characterController = null;
        }
        hasRootMotion() { return this._hasrootmotion; }
        getAnimationTime() { return this._frametime; }
        getDeltaPosition() { return this._deltaPositionFixed; }
        getDeltaRotation() { return this._deltaRotation; }
        getAngularVelocity() { return this._angularVelocity; }
        getRootMotionAngle() { return this._angularVelocity.y; }
        getRootMotionSpeed() { return this._deltaPosition.length(); }
        getCharacterController() { return this.m_characterController; }
        getRuntimeController() { return this._runtimecontroller; }
        awake() { this.awakeStateMachine(); }
        update() { this.updateStateMachine(); }
        destroy() { this.destroyStateMachine(); }
        /////////////////////////////////////////////////////////////////////////////////////
        // State Machine Functions
        /////////////////////////////////////////////////////////////////////////////////////
        playAnimation(state, transitionDuration = 0, animationLayer = 0, frameRate = null) {
            let result = false;
            if (this._machine.layers != null && this._machine.layers.length > animationLayer) {
                const layer = this._machine.layers[animationLayer];
                const blendFrameRate = (layer.animationStateMachine != null) ? (layer.animationStateMachine.rate || BABYLON.AnimationState.FPS) : BABYLON.AnimationState.FPS;
                const blendingSpeed = (transitionDuration > 0) ? BABYLON.Utilities.ComputeBlendingSpeed(frameRate || blendFrameRate, transitionDuration) : 0;
                this.setCurrentAnimationState(layer, state, blendingSpeed);
                result = true;
            }
            else {
                BABYLON.Tools.Warn("No animation state layers on " + this.transform.name);
            }
            return result;
        }
        /////////////////////////////////////////////////////////////////////////////////////
        // State Machine Functions
        /////////////////////////////////////////////////////////////////////////////////////
        getBool(name) {
            return this._booleans.get(name) || false;
        }
        setBool(name, value) {
            this._booleans.set(name, value);
        }
        getFloat(name) {
            return this._numbers.get(name) || 0;
        }
        setFloat(name, value) {
            this._numbers.set(name, value);
        }
        getInteger(name) {
            return this._numbers.get(name) || 0;
        }
        setInteger(name, value) {
            this._numbers.set(name, value);
        }
        getTrigger(name) {
            return this._triggers.get(name) || false;
        }
        setTrigger(name) {
            this._triggers.set(name, true);
        }
        resetTrigger(name) {
            this._triggers.set(name, false);
        }
        getMachineState(name) {
            return this._data.get(name);
        }
        setMachineState(name, value) {
            this._data.set(name, value);
        }
        getCurrentState(layer) {
            return (this._machine.layers != null && this._machine.layers.length > layer) ? this._machine.layers[layer].animationStateMachine : null;
        }
        getAnimationGroup(name) {
            return this._anims.get(name);
        }
        getAnimationGroups() {
            return this._anims;
        }
        setAnimationGroups(groups, remapTargets = false) {
            // ..
            // TODO - Handle Remap Animation Targets
            // ..
            if (groups != null && groups.length > 0) {
                this._anims = new Map();
                this.m_animationTargets = [];
                this.m_defaultGroup = groups[0];
                groups.forEach((group) => {
                    const agroup = group;
                    try {
                        group.stop();
                    }
                    catch { }
                    if (group.targetedAnimations != null && group.targetedAnimations.length > 0) {
                        group.targetedAnimations.forEach((targetedAnimation) => {
                            // Note: For Loop Faster Than IndexOf
                            let indexOfTarget = -1;
                            for (let i = 0; i < this.m_animationTargets.length; i++) {
                                if (this.m_animationTargets[i].target === targetedAnimation.target) {
                                    indexOfTarget = i;
                                    break;
                                }
                            }
                            if (indexOfTarget < 0) {
                                this.m_animationTargets.push(targetedAnimation);
                                if (targetedAnimation.target.metadata == null)
                                    targetedAnimation.target.metadata = {};
                                if (targetedAnimation.target instanceof BABYLON.TransformNode) {
                                    BABYLON.Utilities.ValidateTransformQuaternion(targetedAnimation.target);
                                    const layerMixers = [];
                                    for (let index = 0; index < this._layercount; index++) {
                                        const layerMixer = new BABYLON.AnimationMixer();
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
                                    const morphLayerMixers = [];
                                    for (let index = 0; index < this._layercount; index++) {
                                        const morphLayerMixer = new BABYLON.AnimationMixer();
                                        morphLayerMixer.influenceBuffer = null;
                                        morphLayerMixers.push(morphLayerMixer);
                                    }
                                    targetedAnimation.target.metadata.mixer = morphLayerMixers;
                                }
                            }
                        });
                    }
                    if (agroup != null && agroup.metadata != null && agroup.metadata.unity != null && agroup.metadata.unity.clip != null && agroup.metadata.unity.clip !== "") {
                        this._anims.set(agroup.metadata.unity.clip, group);
                    }
                });
            }
        }
        /* Animation Controller State Machine Functions */
        awakeStateMachine() {
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
                    const plist = this._machine.parameters;
                    plist.forEach((parameter) => {
                        const name = parameter.name;
                        const type = parameter.type;
                        const curve = parameter.curve;
                        const defaultFloat = parameter.defaultFloat;
                        const defaultBool = parameter.defaultBool;
                        const defaultInt = parameter.defaultInt;
                        this._parameters.set(name, type);
                        if (type === BABYLON.AnimatorParameterType.Bool) {
                            this.setBool(name, defaultBool);
                        }
                        else if (type === BABYLON.AnimatorParameterType.Float) {
                            this.setFloat(name, defaultFloat);
                        }
                        else if (type === BABYLON.AnimatorParameterType.Int) {
                            this.setInteger(name, defaultInt);
                        }
                        else if (type === BABYLON.AnimatorParameterType.Trigger) {
                            this.resetTrigger(name);
                        }
                    });
                }
                // ..
                // Process Machine State Layers
                // ..
                if (this._machine.layers != null && this._machine.layers.length > 0) {
                    this._layercount = this._machine.layers.length;
                    // Sort In Ascending Order
                    this._machine.layers.sort((left, right) => {
                        if (left.index < right.index)
                            return -1;
                        if (left.index > right.index)
                            return 1;
                        return 0;
                    });
                    // Parse State Machine Layers
                    this._machine.layers.forEach((layer) => {
                        // Set Layer Avatar Mask Transform Path
                        if (layer.avatarMask != null && layer.avatarMask.transformPaths != null && layer.avatarMask.transformPaths.length > 0) {
                            for (let i = 0; i < layer.avatarMask.transformPaths.length; i++) {
                                this.m_avatarMask.set(layer.avatarMask.transformPaths[i], i);
                            }
                        }
                    });
                }
            }
            if (this._source != null && this._source !== "" && this.scene.animationGroups != null) {
                let sourceanims = null;
                // ..
                // TODO - Optimize Searching Global Animation Groups - ???
                // ..
                this.scene.animationGroups.forEach((group) => {
                    const agroup = group;
                    if (agroup != null && agroup.metadata != null && agroup.metadata.unity != null && agroup.metadata.unity.source != null && agroup.metadata.unity.source !== "") {
                        if (agroup.metadata.unity.source === this._source) {
                            if (sourceanims == null)
                                sourceanims = [];
                            sourceanims.push(group);
                        }
                    }
                });
                if (sourceanims != null && sourceanims.length > 0) {
                    this.setAnimationGroups(sourceanims);
                }
            }
            // ..
            // Map State Machine Tracks (Animation Groups)
            // ..
            if (this._machine != null && this._machine.states != null && this._machine.states.length > 0) {
                this._machine.states.forEach((state) => {
                    if (state != null && state.name != null) {
                        // Set Custom Animation Curves
                        if (state.ccurves != null && state.ccurves.length > 0) {
                            state.ccurves.forEach((curve) => {
                                if (curve.animation != null) {
                                    const anim = BABYLON.Animation.Parse(curve.animation);
                                    if (anim != null) {
                                        if (state.tcurves == null)
                                            state.tcurves = [];
                                        state.tcurves.push(anim);
                                    }
                                }
                            });
                        }
                        // Setup Animation State Machines
                        this.setupTreeBranches(state.blendtree);
                        this.setMachineState(state.name, state);
                    }
                });
            }
            // DEBUG: Dump State Machine Debug Information
            // console.warn("*** Animation State Machine: " + this.transform.name);
            // console.log(this);
        }
        updateStateMachine(deltaTime = null) {
            if (this._executed === false) {
                this._executed = true;
                if (this._machine.layers != null && this._machine.layers.length > 0) {
                    this._machine.layers.forEach((layer) => {
                        this.setCurrentAnimationState(layer, layer.entry, 0);
                    });
                }
            }
            if (this.enableAnimation === true) {
                const frameDeltaTime = deltaTime || this.getDeltaSeconds();
                this.updateAnimationState(frameDeltaTime);
                this.updateAnimationTargets(frameDeltaTime);
                if (this.onAnimationUpdateObservable.hasObservers() === true) {
                    this.onAnimationUpdateObservable.notifyObservers(this.transform);
                }
            }
        }
        destroyStateMachine() {
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
        }
        /* Animation Controller Private Update Functions */
        updateAnimationState(deltaTime) {
            if (this._machine.layers != null && this._machine.layers.length > 0) {
                this._machine.layers.forEach((layer) => {
                    this.checkStateMachine(layer, deltaTime);
                });
            }
        }
        updateAnimationTargets(deltaTime) {
            //this._bodyOrientationAngleY = 0;
            if (this.transform.rotationQuaternion != null) {
                //this._bodyOrientationAngleY = this.transform.rotationQuaternion.toEulerAngles().y; // TODO - OPTIMIZE THIS
            }
            else if (this.transform.rotation != null) {
                //this._bodyOrientationAngleY = this.transform.rotation.y;
            }
            if (this._machine.layers != null && this._machine.layers.length > 0) {
                this._machine.layers.forEach((layer) => {
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (layer.index === 0)
                        this._frametime = layer.animationTime; // Note: Update Master Animation Frame Time
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (layer.animationStateMachine != null && layer.animationStateMachine.blendtree != null) {
                        if (layer.iKPass === true && this.onAnimationIKObservable.hasObservers() === true) {
                            this.onAnimationIKObservable.notifyObservers(layer.index);
                        }
                        const layerState = layer.animationStateMachine;
                        if (layerState.type === BABYLON.MotionType.Clip && layerState.played !== -1)
                            layerState.played += deltaTime;
                        if (layerState.blendtree.children != null && layerState.blendtree.children.length > 0) {
                            const primaryBlendTree = layerState.blendtree.children[0];
                            if (primaryBlendTree != null) {
                                if (layerState.blendtree.blendType == BABYLON.BlendTreeType.Clip) {
                                    const animationTrack = primaryBlendTree.track;
                                    if (animationTrack != null) {
                                        const frameRatio = (BABYLON.AnimationState.TIME / animationTrack.to);
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Motion Clip Animation Timeline
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        layer.animationNormal = (layer.animationTime / BABYLON.AnimationState.TIME); // Note: Normalize Layer Frame Time
                                        const validateTime = (layer.animationNormal > 0.99) ? 1 : layer.animationNormal;
                                        const formattedTime = Math.round(validateTime * 100) / 100;
                                        if (layerState.speed < 0)
                                            layer.animationNormal = (1 - layer.animationNormal); // Note: Reverse Normalized Frame Time
                                        const animationFrameTime = (animationTrack.to * layer.animationNormal); // Note: Denormalize Animation Frame Time
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
                                        let level = 0.0;
                                        let xspeed = 0.0;
                                        let zspeed = 0.0;
                                        let looptime = false;
                                        let loopblend = false;
                                        let cycleoffset = 0.0;
                                        let heightfromfeet = false;
                                        let correctionoffsety = 0.0;
                                        let orientationoffsety = 0.0;
                                        let keeporiginalorientation = false;
                                        let keeporiginalpositionxz = false;
                                        let keeporiginalpositiony = false;
                                        let loopblendorientation = false;
                                        let loopblendpositiony = false;
                                        let loopblendpositionxz = false;
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        const agroup = animationTrack;
                                        if (agroup.metadata != null && agroup.metadata.unity != null) {
                                            if (agroup.metadata.unity.averagespeed != null) {
                                                xspeed = (agroup.metadata.unity.averagespeed.x != null) ? agroup.metadata.unity.averagespeed.x : 0;
                                                zspeed = (agroup.metadata.unity.averagespeed.z != null) ? agroup.metadata.unity.averagespeed.z : 0;
                                            }
                                            if (agroup.metadata.unity.settings != null) {
                                                level = (agroup.metadata.unity.settings.level != null) ? agroup.metadata.unity.settings.level : 0;
                                                looptime = (agroup.metadata.unity.settings.looptime != null) ? agroup.metadata.unity.settings.looptime : false;
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
                                        if (layer.animationTime >= BABYLON.AnimationState.TIME) {
                                            layer.animationFirstRun = false;
                                            layer.animationLoopFrame = true;
                                            if (looptime === true) {
                                                if (this.onAnimationLoopObservable.hasObservers() === true) {
                                                    this.onAnimationLoopObservable.notifyObservers(layer.index);
                                                }
                                            }
                                            else {
                                                if (layer.animationEndFrame === false) {
                                                    layer.animationEndFrame = true;
                                                    if (this.onAnimationEndObservable.hasObservers() === true) {
                                                        this.onAnimationEndObservable.notifyObservers(layer.index);
                                                    }
                                                }
                                            }
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationFirstRun === true || looptime === true) {
                                            animationTrack.targetedAnimations.forEach((targetedAnim) => {
                                                if (targetedAnim.target instanceof BABYLON.TransformNode) {
                                                    const clipTarget = targetedAnim.target;
                                                    if (layer.index === 0 || layer.avatarMask == null || this.filterTargetAvatarMask(layer, clipTarget)) {
                                                        const targetRootBone = (clipTarget.metadata != null && clipTarget.metadata.unity != null && clipTarget.metadata.unity.rootbone != null) ? clipTarget.metadata.unity.rootbone : false;
                                                        if (clipTarget.metadata != null && clipTarget.metadata.mixer != null) {
                                                            const clipTargetMixer = clipTarget.metadata.mixer[layer.index];
                                                            if (clipTargetMixer != null) {
                                                                if (targetedAnim.animation.targetProperty === "position") {
                                                                    this._targetPosition = BABYLON.Utilities.SampleAnimationVector3(targetedAnim.animation, animationFrameTime);
                                                                    // ..
                                                                    // Handle Root Motion (Position)
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
                                                                            if (clipTargetMixer.positionBuffer == null)
                                                                                clipTargetMixer.positionBuffer = new BABYLON.Vector3(0, 0, 0);
                                                                            BABYLON.Utilities.BlendVector3Value(clipTargetMixer.positionBuffer, this._positionHolder, 1.0);
                                                                        }
                                                                        // Bake Root Bone Holder
                                                                        if (this._rootBoneWeight === true) {
                                                                            if (clipTargetMixer.rootPosition == null)
                                                                                clipTargetMixer.rootPosition = new BABYLON.Vector3(0, 0, 0);
                                                                            if (keeporiginalorientation === true) {
                                                                                // Flip Negative Root Motion
                                                                                if (correctionoffsety > 0 && BABYLON.AnimationState.DEG90 > 0) {
                                                                                    if (correctionoffsety > BABYLON.AnimationState.DEG90) {
                                                                                        this._rootBoneHolder.x *= -1;
                                                                                        this._rootBoneHolder.z *= -1;
                                                                                    }
                                                                                }
                                                                            }
                                                                            BABYLON.Utilities.BlendVector3Value(clipTargetMixer.rootPosition, this._rootBoneHolder, 1.0);
                                                                        }
                                                                    }
                                                                    else {
                                                                        // Bake Normal Pose Position
                                                                        if (clipTargetMixer.positionBuffer == null)
                                                                            clipTargetMixer.positionBuffer = new BABYLON.Vector3(0, 0, 0);
                                                                        BABYLON.Utilities.BlendVector3Value(clipTargetMixer.positionBuffer, this._targetPosition, 1.0);
                                                                    }
                                                                }
                                                                else if (targetedAnim.animation.targetProperty === "rotationQuaternion") {
                                                                    this._targetRotation = BABYLON.Utilities.SampleAnimationQuaternion(targetedAnim.animation, animationFrameTime);
                                                                    // ..
                                                                    // Handle Root Motion (Rotation)
                                                                    // ..
                                                                    if (targetRootBone === true) {
                                                                        this._rotationWeight = false;
                                                                        this._rotationHolder.set(0, 0, 0, 0);
                                                                        this._rootQuatWeight = false;
                                                                        this._rootQuatHolder.set(0, 0, 0, 0);
                                                                        // TODO - OPTIMIZE TO EULER ANGLES
                                                                        const eulerAngle = this._targetRotation.toEulerAngles();
                                                                        const orientationAngleY = eulerAngle.y; //(keeporiginalorientation === true) ? eulerAngle.y : this._bodyOrientationAngleY;
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
                                                                            if (clipTargetMixer.rotationBuffer == null)
                                                                                clipTargetMixer.rotationBuffer = new BABYLON.Quaternion(0, 0, 0, 1);
                                                                            BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rotationBuffer, this._rotationHolder, 1.0);
                                                                        }
                                                                        // Bake Root Bone Rotation
                                                                        if (this._rootQuatWeight === true) {
                                                                            if (clipTargetMixer.rootRotation == null)
                                                                                clipTargetMixer.rootRotation = new BABYLON.Quaternion(0, 0, 0, 1);
                                                                            BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rootRotation, this._rootQuatHolder, 1.0);
                                                                        }
                                                                    }
                                                                    else {
                                                                        // Bake Normal Pose Rotation
                                                                        if (clipTargetMixer.rotationBuffer == null)
                                                                            clipTargetMixer.rotationBuffer = new BABYLON.Quaternion(0, 0, 0, 1);
                                                                        BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rotationBuffer, this._targetRotation, 1.0);
                                                                    }
                                                                }
                                                                else if (targetedAnim.animation.targetProperty === "scaling") {
                                                                    this._targetScaling = BABYLON.Utilities.SampleAnimationVector3(targetedAnim.animation, animationFrameTime);
                                                                    if (clipTargetMixer.scalingBuffer == null)
                                                                        clipTargetMixer.scalingBuffer = new BABYLON.Vector3(1, 1, 1);
                                                                    BABYLON.Utilities.BlendVector3Value(clipTargetMixer.scalingBuffer, this._targetScaling, 1.0);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                else if (targetedAnim.target instanceof BABYLON.MorphTarget) {
                                                    const morphTarget = targetedAnim.target;
                                                    if (morphTarget.metadata != null && morphTarget.metadata.mixer != null) {
                                                        const morphTargetMixer = morphTarget.metadata.mixer[layer.index];
                                                        if (targetedAnim.animation.targetProperty === "influence") {
                                                            const floatValue = BABYLON.Utilities.SampleAnimationFloat(targetedAnim.animation, animationFrameTime);
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
                                            layer.animationStateMachine.tcurves.forEach((animation) => {
                                                if (animation.targetProperty != null && animation.targetProperty !== "") {
                                                    const sample = BABYLON.Utilities.SampleAnimationFloat(animation, layer.animationNormal);
                                                    this.setFloat(animation.targetProperty, sample);
                                                }
                                            });
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Validate Layer Animation Events (TODO - Pass Layer Index Properties To Observers)
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationStateMachine.events != null && layer.animationStateMachine.events.length > 0) {
                                            layer.animationStateMachine.events.forEach((animatorEvent) => {
                                                if (animatorEvent.time === formattedTime) {
                                                    const animEventKey = animatorEvent.function + "_" + animatorEvent.time;
                                                    if (layer.animationLoopEvents == null)
                                                        layer.animationLoopEvents = {};
                                                    if (!layer.animationLoopEvents[animEventKey]) {
                                                        layer.animationLoopEvents[animEventKey] = true;
                                                        // console.log("Blend Tree Animation Event: " + animatorEvent.time + " >> " + animatorEvent.clip + " >> " + animatorEvent.function);
                                                        if (this.onAnimationEventObservable.hasObservers() === true) {
                                                            this.onAnimationEventObservable.notifyObservers(animatorEvent);
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
                                            layer.animationTime += (deltaTime * frameRatio * Math.abs(layerState.speed) * Math.abs(this.speedRatio));
                                            layer.animationTime = BABYLON.Scalar.Clamp(layer.animationTime, 0, BABYLON.AnimationState.TIME);
                                        }
                                    }
                                    else {
                                        // console.warn(">>> No Motion Clip Animation Track Found For: " + this.transform.name);
                                    }
                                }
                                else {
                                    // this._blendMessage = "";
                                    this._blendWeights.primary = null;
                                    this._blendWeights.secondary = null;
                                    const scaledWeightList = [];
                                    const primaryBlendTree = layerState.blendtree;
                                    this.parseTreeBranches(layer, primaryBlendTree, 1.0, scaledWeightList);
                                    const frameRatio = this.computeWeightedFrameRatio(scaledWeightList);
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Blend Tree Animation Timeline
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    layer.animationNormal = (layer.animationTime / BABYLON.AnimationState.TIME); // Note: Normalize Layer Frame Time
                                    const validateTime = (layer.animationNormal > 0.99) ? 1 : layer.animationNormal;
                                    const formattedTime = Math.round(validateTime * 100) / 100;
                                    if (layerState.speed < 0)
                                        layer.animationNormal = (1 - layer.animationNormal); // Note: Reverse Normalized Frame Time
                                    const blendingNormalTime = layer.animationNormal; // Note: Denormalize Animation Frame Time
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationTime >= BABYLON.AnimationState.TIME) {
                                        layer.animationLoopFrame = true; // Note: No Loop Or End Events For Blend Trees
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    const masterAnimationTrack = (scaledWeightList != null && scaledWeightList.length > 0 && scaledWeightList[0].track != null) ? scaledWeightList[0].track : null;
                                    if (masterAnimationTrack != null) {
                                        const targetCount = masterAnimationTrack.targetedAnimations.length;
                                        for (let targetIndex = 0; targetIndex < targetCount; targetIndex++) {
                                            const masterAnimimation = masterAnimationTrack.targetedAnimations[targetIndex];
                                            if (masterAnimimation.target instanceof BABYLON.TransformNode) {
                                                const blendTarget = masterAnimimation.target;
                                                if (layer.index === 0 || layer.avatarMask == null || this.filterTargetAvatarMask(layer, blendTarget)) {
                                                    const targetRootBone = (blendTarget.metadata != null && blendTarget.metadata.unity != null && blendTarget.metadata.unity.rootbone != null) ? blendTarget.metadata.unity.rootbone : false;
                                                    if (blendTarget.metadata != null && blendTarget.metadata.mixer != null) {
                                                        this._initialtargetblending = true; // Note: Reset First Target Blending Buffer
                                                        const blendTargetMixer = blendTarget.metadata.mixer[layer.index];
                                                        this.updateBlendableTargets(deltaTime, layer, primaryBlendTree, masterAnimimation, targetIndex, blendTargetMixer, blendingNormalTime, targetRootBone);
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
                                        layer.animationStateMachine.tcurves.forEach((animation) => {
                                            if (animation.targetProperty != null && animation.targetProperty !== "") {
                                                const sample = BABYLON.Utilities.SampleAnimationFloat(animation, layer.animationNormal);
                                                this.setFloat(animation.targetProperty, sample);
                                            }
                                        });
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Validate Layer Animation Events (TODO - Pass Layer Index And Clip Blended Weight Properties To Observers)
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationStateMachine.events != null && layer.animationStateMachine.events.length > 0) {
                                        layer.animationStateMachine.events.forEach((animatorEvent) => {
                                            if (animatorEvent.time === formattedTime) {
                                                const animEventKey = animatorEvent.function + "_" + animatorEvent.time;
                                                if (layer.animationLoopEvents == null)
                                                    layer.animationLoopEvents = {};
                                                if (!layer.animationLoopEvents[animEventKey]) {
                                                    layer.animationLoopEvents[animEventKey] = true;
                                                    // console.log("Blend Tree Animation Event: " + animatorEvent.time + " >> " + animatorEvent.clip + " >> " + animatorEvent.function);
                                                    if (this.onAnimationEventObservable.hasObservers() === true) {
                                                        this.onAnimationEventObservable.notifyObservers(animatorEvent);
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
                                        layer.animationTime += (deltaTime * frameRatio * Math.abs(layerState.speed) * Math.abs(this.speedRatio));
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
        }
        // private _blendMessage:string = "";
        updateBlendableTargets(deltaTime, layer, tree, masterAnimation, targetIndex, targetMixer, normalizedFrameTime, targetRootBone) {
            if (targetMixer != null && tree.children != null && tree.children.length > 0) {
                for (let index = 0; index < tree.children.length; index++) {
                    const child = tree.children[index];
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
                                let level = 0.0;
                                let xspeed = 0.0;
                                let zspeed = 0.0;
                                let loopblend = false;
                                let cycleoffset = 0.0;
                                let heightfromfeet = false;
                                let correctionoffsety = 0.0;
                                let orientationoffsety = 0.0;
                                let keeporiginalorientation = false;
                                let keeporiginalpositionxz = false;
                                let keeporiginalpositiony = false;
                                let loopblendorientation = false;
                                let loopblendpositiony = false;
                                let loopblendpositionxz = false;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                const agroup = child.track;
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
                                const blendableAnim = child.track.targetedAnimations[targetIndex];
                                const blendableWeight = (this._initialtargetblending === true) ? 1.0 : parseFloat(child.weight.toFixed(2));
                                this._initialtargetblending = false; // Note: Clear First Target Blending Buffer
                                if (blendableAnim.target === masterAnimation.target && blendableAnim.animation.targetProperty === masterAnimation.animation.targetProperty) {
                                    let adjustedFrameTime = normalizedFrameTime; // Note: Adjust Normalized Frame Time
                                    if (child.timescale < 0)
                                        adjustedFrameTime = (1 - adjustedFrameTime); // Note: Reverse Normalized Frame Time
                                    const animationFrameTime = (child.track.to * adjustedFrameTime); // Note: Denormalize Animation Frame Time
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
                                            const eulerAngle = this._targetRotation.toEulerAngles();
                                            const orientationAngleY = eulerAngle.y; //(keeporiginalorientation === true) ? eulerAngle.y : this._bodyOrientationAngleY;
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
        }
        finalizeAnimationTargets() {
            this._deltaPosition.set(0, 0, 0);
            this._deltaRotation.set(0, 0, 0, 1);
            this._deltaPositionFixed.set(0, 0, 0);
            this._dirtyMotionMatrix = null;
            if (this.m_animationTargets != null && this.m_animationTargets.length > 0) {
                this.m_animationTargets.forEach((targetedAnim) => {
                    const animationTarget = targetedAnim.target;
                    // ..
                    // Update Direct Transform Targets For Each Layer
                    // ..
                    if (animationTarget.metadata != null && animationTarget.metadata.mixer != null) {
                        if (this._machine.layers != null && this._machine.layers.length > 0) {
                            this._blenderMatrix.reset();
                            this._dirtyBlenderMatrix = null;
                            this._machine.layers.forEach((layer) => {
                                const animationTargetMixer = animationTarget.metadata.mixer[layer.index];
                                if (animationTargetMixer != null) {
                                    if (animationTarget instanceof BABYLON.TransformNode) {
                                        // ..
                                        // Update Dirty Transform Matrix
                                        // ..
                                        if (animationTargetMixer.positionBuffer != null || animationTargetMixer.rotationBuffer != null || animationTargetMixer.scalingBuffer != null) {
                                            BABYLON.Matrix.ComposeToRef((animationTargetMixer.scalingBuffer || animationTarget.scaling), (animationTargetMixer.rotationBuffer || animationTarget.rotationQuaternion), (animationTargetMixer.positionBuffer || animationTarget.position), this._updateMatrix);
                                            if (animationTargetMixer.blendingSpeed > 0.0) {
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix == null) {
                                                    animationTargetMixer.originalMatrix = BABYLON.Matrix.Compose((animationTarget.scaling), (animationTarget.rotationQuaternion), (animationTarget.position));
                                                }
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix != null) {
                                                    BABYLON.Utilities.FastMatrixSlerp(animationTargetMixer.originalMatrix, this._updateMatrix, animationTargetMixer.blendingFactor, this._updateMatrix);
                                                    animationTargetMixer.blendingFactor += animationTargetMixer.blendingSpeed;
                                                }
                                            }
                                            BABYLON.Utilities.FastMatrixSlerp(this._blenderMatrix, this._updateMatrix, layer.defaultWeight, this._blenderMatrix);
                                            this._dirtyBlenderMatrix = true;
                                            animationTargetMixer.positionBuffer = null;
                                            animationTargetMixer.rotationBuffer = null;
                                            animationTargetMixer.scalingBuffer = null;
                                        }
                                        // ..
                                        // Update Dirty Root Motion Matrix
                                        // ..
                                        if (animationTargetMixer.rootPosition != null || animationTargetMixer.rootRotation != null) {
                                            BABYLON.Matrix.ComposeToRef((this._emptyScaling), (animationTargetMixer.rootRotation || this._emptyRotation), (animationTargetMixer.rootPosition || this._emptyPosition), this._updateMatrix);
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
                                            BABYLON.Utilities.FastMatrixSlerp(this._rootMotionMatrix, this._updateMatrix, layer.defaultWeight, this._rootMotionMatrix);
                                            this._dirtyMotionMatrix = true;
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
                            if (this._dirtyBlenderMatrix != null) {
                                this._blenderMatrix.decompose(animationTarget.scaling, animationTarget.rotationQuaternion, animationTarget.position);
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
        }
        checkStateMachine(layer, deltaTime) {
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
                this._checkers.triggered.forEach((trigger) => { this.resetTrigger(trigger); });
                this._checkers.triggered = null;
            }
            // ..
            // Set Current Machine State Result
            // ..
            if (this._checkers.result != null) {
                if (this._checkers.offest > 0)
                    BABYLON.SceneManager.SetTimeout((this._checkers.offest * 1000), () => { this.setCurrentAnimationState(layer, this._checkers.result, this._checkers.blending); });
                else
                    this.setCurrentAnimationState(layer, this._checkers.result, this._checkers.blending);
            }
        }
        checkStateTransitions(layer, transitions, time, length, rate) {
            if (transitions != null && transitions.length > 0) {
                let i = 0;
                let ii = 0;
                let solo = -1;
                // ..
                // Check Has Solo Transitions
                // ..
                for (i = 0; i < transitions.length; i++) {
                    if (transitions[i].solo === true && transitions[i].mute === false) {
                        solo = i;
                        break;
                    }
                }
                // ..
                // Check State Machine Transitions
                // ..
                for (i = 0; i < transitions.length; i++) {
                    const transition = transitions[i];
                    if (transition.layerIndex !== layer.index)
                        continue;
                    if (transition.mute === true)
                        continue;
                    if (solo >= 0 && solo !== i)
                        continue;
                    let transitionOk = false;
                    // ..
                    // Check Has Transition Exit Time
                    // ..
                    const exitTimeSecs = BABYLON.Scalar.Denormalize(transition.exitTime, 0, length);
                    const exitTimeExpired = ((BABYLON.SceneManager.GetGameTime() - time) >= exitTimeSecs);
                    if (transition.hasExitTime === true && transition.intSource == BABYLON.InterruptionSource.None && exitTimeExpired === false)
                        continue;
                    // ..
                    // Check All Transition Conditions
                    // ..
                    if (transition.conditions != null && transition.conditions.length > 0) {
                        let passed = 0;
                        let checks = transition.conditions.length;
                        transition.conditions.forEach((condition) => {
                            const ptype = this._parameters.get(condition.parameter);
                            if (ptype != null) {
                                if (ptype == BABYLON.AnimatorParameterType.Float || ptype == BABYLON.AnimatorParameterType.Int) {
                                    const numValue = parseFloat(this.getFloat(condition.parameter).toFixed(2));
                                    if (condition.mode === BABYLON.ConditionMode.Greater && numValue > condition.threshold) {
                                        passed++;
                                    }
                                    else if (condition.mode === BABYLON.ConditionMode.Less && numValue < condition.threshold) {
                                        passed++;
                                    }
                                    else if (condition.mode === BABYLON.ConditionMode.Equals && numValue === condition.threshold) {
                                        passed++;
                                    }
                                    else if (condition.mode === BABYLON.ConditionMode.NotEqual && numValue !== condition.threshold) {
                                        passed++;
                                    }
                                }
                                else if (ptype == BABYLON.AnimatorParameterType.Bool) {
                                    const boolValue = this.getBool(condition.parameter);
                                    if (condition.mode === BABYLON.ConditionMode.If && boolValue === true) {
                                        passed++;
                                    }
                                    else if (condition.mode === BABYLON.ConditionMode.IfNot && boolValue === false) {
                                        passed++;
                                    }
                                }
                                else if (ptype == BABYLON.AnimatorParameterType.Trigger) {
                                    const triggerValue = this.getTrigger(condition.parameter);
                                    if (triggerValue === true) {
                                        passed++;
                                        // Note: For Loop Faster Than IndexOf
                                        let indexOfTrigger = -1;
                                        for (let i = 0; i < this._checkers.triggered.length; i++) {
                                            if (this._checkers.triggered[i] === condition.parameter) {
                                                indexOfTrigger = i;
                                                break;
                                            }
                                        }
                                        if (indexOfTrigger < 0) {
                                            this._checkers.triggered.push(condition.parameter);
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
                            transitionOk = (exitTimeExpired === true && passed === checks);
                        }
                        else {
                            // Validate All Transition Conditions Passed
                            transitionOk = (passed === checks);
                        }
                    }
                    else {
                        // Validate Transition Has Expired Exit Time Only
                        transitionOk = (transition.hasExitTime === true && exitTimeExpired === true);
                    }
                    // Validate Current Transition Destination Change
                    if (transitionOk === true) {
                        const blendSize = (length > 0) ? length : 1;
                        const blendRate = (rate > 0) ? rate : BABYLON.AnimationState.FPS;
                        const destState = (transition.isExit === false) ? transition.destination : BABYLON.AnimationState.EXIT;
                        const offsetSecs = (transition.fixedDuration === true) ? transition.offset : BABYLON.Scalar.Denormalize(transition.offset, 0, blendSize);
                        const durationSecs = (transition.fixedDuration === true) ? transition.duration : BABYLON.Scalar.Denormalize(transition.duration, 0, blendSize);
                        const blendingSpeed = BABYLON.Utilities.ComputeBlendingSpeed(blendRate, durationSecs);
                        this._checkers.result = destState;
                        this._checkers.offest = offsetSecs;
                        this._checkers.blending = blendingSpeed;
                        break;
                    }
                }
            }
        }
        setCurrentAnimationState(layer, name, blending) {
            if (name == null || name === "" || name === BABYLON.AnimationState.EXIT)
                return;
            if (layer.animationStateMachine != null && layer.animationStateMachine.name === name)
                return;
            const state = this.getMachineState(name);
            // ..
            // Reset Animation Target Mixers
            // ..
            if (this.m_animationTargets != null && this.m_animationTargets.length > 0) {
                this.m_animationTargets.forEach((targetedAnim) => {
                    const animationTarget = targetedAnim.target;
                    if (animationTarget.metadata != null && animationTarget.metadata.mixer != null) {
                        const animationTargetMixer = animationTarget.metadata.mixer[layer.index];
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
        }
        checkAvatarTransformPath(layer, transformPath) {
            let result = false;
            if (this.m_avatarMask != null) {
                const transformIndex = this.m_avatarMask.get(transformPath);
                if (transformIndex != null && transformIndex >= 0) {
                    result = true;
                }
            }
            return result;
        }
        filterTargetAvatarMask(layer, target) {
            let result = false;
            if (target.metadata != null && target.metadata.unity != null && target.metadata.unity.bone != null && target.metadata.unity.bone !== "") {
                const transformPath = target.metadata.unity.bone;
                result = this.checkAvatarTransformPath(layer, transformPath);
            }
            return result;
        }
        sortWeightedBlendingList(weightList) {
            if (weightList != null && weightList.length > 0) {
                // Sort In Descending Order
                weightList.sort((left, right) => {
                    if (left.weight < right.weight)
                        return 1;
                    if (left.weight > right.weight)
                        return -1;
                    return 0;
                });
            }
        }
        computeWeightedFrameRatio(weightList) {
            let result = 1.0;
            if (weightList != null && weightList.length > 0) {
                this.sortWeightedBlendingList(weightList);
                this._blendWeights.primary = weightList[0];
                const primaryWeight = this._blendWeights.primary.weight;
                if (primaryWeight < 1.0 && weightList.length > 1) {
                    this._blendWeights.secondary = weightList[1];
                }
                // ..
                if (this._blendWeights.primary != null && this._blendWeights.secondary != null) {
                    const frameWeightDelta = BABYLON.Scalar.Clamp(this._blendWeights.primary.weight);
                    result = BABYLON.Scalar.Lerp(this._blendWeights.secondary.ratio, this._blendWeights.primary.ratio, frameWeightDelta);
                }
                else if (this._blendWeights.primary != null && this._blendWeights.secondary == null) {
                    result = this._blendWeights.primary.ratio;
                }
            }
            return result;
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////
        // Blend Tree Branches -  Helper Functions
        ///////////////////////////////////////////////////////////////////////////////////////////////
        setupTreeBranches(tree) {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                tree.children.forEach((child) => {
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.setupTreeBranches(child.subtree);
                    }
                    else if (child.type === BABYLON.MotionType.Clip) {
                        if (child.motion != null && child.motion !== "") {
                            child.weight = 0;
                            child.ratio = 0;
                            child.track = this.getAnimationGroup(child.motion);
                            if (child.track != null)
                                child.ratio = (BABYLON.AnimationState.TIME / child.track.to);
                        }
                    }
                });
            }
        }
        parseTreeBranches(layer, tree, parentWeight, weightList) {
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
        }
        parse1DSimpleTreeBranches(layer, tree, parentWeight, weightList) {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                const blendTreeArray = [];
                tree.children.forEach((child) => {
                    child.weight = 0; // Note: Reset Weight Value
                    const item = {
                        source: child,
                        motion: child.motion,
                        posX: child.threshold,
                        posY: child.threshold,
                        weight: child.weight
                    };
                    blendTreeArray.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate1DSimpleBlendTree(tree.valueParameterX, blendTreeArray);
                blendTreeArray.forEach((element) => {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach((child) => {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        }
        parse2DSimpleDirectionalTreeBranches(layer, tree, parentWeight, weightList) {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                const blendTreeArray = [];
                tree.children.forEach((child) => {
                    child.weight = 0; // Note: Reset Weight Value
                    const item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformDirectional(tree.valueParameterX, tree.valueParameterY, blendTreeArray);
                blendTreeArray.forEach((element) => {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach((child) => {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        }
        parse2DFreeformDirectionalTreeBranches(layer, tree, parentWeight, weightList) {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                const blendTreeArray = [];
                tree.children.forEach((child) => {
                    child.weight = 0; // Note: Reset Weight Value
                    const item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformDirectional(tree.valueParameterX, tree.valueParameterY, blendTreeArray);
                blendTreeArray.forEach((element) => {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach((child) => {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        }
        parse2DFreeformCartesianTreeBranches(layer, tree, parentWeight, weightList) {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                const blendTreeArray = [];
                tree.children.forEach((child) => {
                    child.weight = 0; // Note: Reset Weight Value
                    const item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformCartesian(tree.valueParameterX, tree.valueParameterY, blendTreeArray);
                blendTreeArray.forEach((element) => {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach((child) => {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        }
    }
    AnimationState.FPS = 30;
    AnimationState.TIME = 1;
    AnimationState.EXIT = "[EXIT]";
    AnimationState.DEG90 = 90;
    BABYLON.AnimationState = AnimationState;
    ///////////////////////////////////////////
    // Support Classes, Blend Tree Utilities
    ///////////////////////////////////////////
    class BlendTreeValue {
        constructor(config) {
            this.source = config.source;
            this.motion = config.motion;
            this.posX = config.posX || 0;
            this.posY = config.posY || 0;
            this.weight = config.weight || 0;
        }
    }
    BABYLON.BlendTreeValue = BlendTreeValue;
    class BlendTreeUtils {
        static ClampValue(num, min, max) {
            return num <= min ? min : num >= max ? max : num;
        }
        static GetSignedAngle(a, b) {
            return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
        }
        static GetLinearInterpolation(x0, y0, x1, y1, x) {
            return y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
        }
        static GetRightNeighbourIndex(inputX, blendTreeArray) {
            blendTreeArray.sort((a, b) => { return (a.posX - b.posX); });
            for (let i = 0; i < blendTreeArray.length; ++i) {
                if (blendTreeArray[i].posX > inputX) {
                    return i;
                }
            }
            return -1;
        }
    }
    BABYLON.BlendTreeUtils = BlendTreeUtils;
    class BlendTreeSystem {
        static Calculate1DSimpleBlendTree(inputX, blendTreeArray) {
            const firstBlendTree = blendTreeArray[0];
            const lastBlendTree = blendTreeArray[blendTreeArray.length - 1];
            if (inputX <= firstBlendTree.posX) {
                firstBlendTree.weight = 1;
            }
            else if (inputX >= lastBlendTree.posX) {
                lastBlendTree.weight = 1;
            }
            else {
                const rightNeighbourBlendTreeIndex = BABYLON.BlendTreeUtils.GetRightNeighbourIndex(inputX, blendTreeArray);
                const leftNeighbour = blendTreeArray[rightNeighbourBlendTreeIndex - 1];
                const rightNeighbour = blendTreeArray[rightNeighbourBlendTreeIndex];
                const interpolatedValue = BABYLON.BlendTreeUtils.GetLinearInterpolation(leftNeighbour.posX, 1, rightNeighbour.posX, 0, inputX);
                leftNeighbour.weight = interpolatedValue;
                rightNeighbour.weight = 1 - leftNeighbour.weight;
            }
        }
        static Calculate2DFreeformDirectional(inputX, inputY, blendTreeArray) {
            BABYLON.BlendTreeSystem.TempVector2_IP.set(inputX, inputY);
            BABYLON.BlendTreeSystem.TempVector2_POSI.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSJ.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSIP.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(0, 0);
            const kDirScale = 2;
            let totalWeight = 0;
            let inputLength = BABYLON.BlendTreeSystem.TempVector2_IP.length();
            for (let i = 0; i < blendTreeArray.length; ++i) {
                const blendTree = blendTreeArray[i];
                BABYLON.BlendTreeSystem.TempVector2_POSI.set(blendTree.posX, blendTree.posY);
                const posILength = BABYLON.BlendTreeSystem.TempVector2_POSI.length();
                const inputToPosILength = (inputLength - posILength);
                const posIToInputAngle = BABYLON.BlendTreeUtils.GetSignedAngle(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_IP);
                let weight = 1;
                for (let j = 0; j < blendTreeArray.length; ++j) {
                    if (j === i) {
                        continue;
                    }
                    else {
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.set(blendTreeArray[j].posX, blendTreeArray[j].posY);
                        const posJLength = BABYLON.BlendTreeSystem.TempVector2_POSJ.length();
                        const averageLengthOfIJ = (posILength + posJLength) / 2;
                        const magOfPosIToInputPos = (inputToPosILength / averageLengthOfIJ);
                        const magOfIJ = (posJLength - posILength) / averageLengthOfIJ;
                        const angleIJ = BABYLON.BlendTreeUtils.GetSignedAngle(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSJ);
                        BABYLON.BlendTreeSystem.TempVector2_POSIP.set(magOfPosIToInputPos, posIToInputAngle * kDirScale);
                        BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(magOfIJ, angleIJ * kDirScale);
                        const lenSqIJ = BABYLON.BlendTreeSystem.TempVector2_POSIJ.lengthSquared();
                        let newWeight = BABYLON.Vector2.Dot(BABYLON.BlendTreeSystem.TempVector2_POSIP, BABYLON.BlendTreeSystem.TempVector2_POSIJ) / lenSqIJ;
                        newWeight = 1 - newWeight;
                        newWeight = BABYLON.BlendTreeUtils.ClampValue(newWeight, 0, 1);
                        weight = Math.min(newWeight, weight);
                    }
                }
                blendTree.weight = weight;
                totalWeight += weight;
            }
            for (const blendTree of blendTreeArray) {
                blendTree.weight /= totalWeight;
            }
        }
        static Calculate2DFreeformCartesian(inputX, inputY, blendTreeArray) {
            BABYLON.BlendTreeSystem.TempVector2_IP.set(inputX, inputY);
            BABYLON.BlendTreeSystem.TempVector2_POSI.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSJ.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSIP.set(0, 0);
            BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(0, 0);
            let totalWeight = 0;
            for (let i = 0; i < blendTreeArray.length; ++i) {
                const blendTree = blendTreeArray[i];
                BABYLON.BlendTreeSystem.TempVector2_POSI.set(blendTree.posX, blendTree.posY);
                BABYLON.BlendTreeSystem.TempVector2_IP.subtractToRef(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSIP);
                let weight = 1;
                for (let j = 0; j < blendTreeArray.length; ++j) {
                    if (j === i) {
                        continue;
                    }
                    else {
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.set(blendTreeArray[j].posX, blendTreeArray[j].posY);
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.subtractToRef(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSIJ);
                        const lenSqIJ = BABYLON.BlendTreeSystem.TempVector2_POSIJ.lengthSquared();
                        let newWeight = BABYLON.Vector2.Dot(BABYLON.BlendTreeSystem.TempVector2_POSIP, BABYLON.BlendTreeSystem.TempVector2_POSIJ) / lenSqIJ;
                        newWeight = 1 - newWeight;
                        newWeight = BABYLON.BlendTreeUtils.ClampValue(newWeight, 0, 1);
                        weight = Math.min(weight, newWeight);
                    }
                }
                blendTree.weight = weight;
                totalWeight += weight;
            }
            for (const blendTree of blendTreeArray) {
                blendTree.weight /= totalWeight;
            }
        }
    }
    BlendTreeSystem.TempVector2_IP = new BABYLON.Vector2(0, 0);
    BlendTreeSystem.TempVector2_POSI = new BABYLON.Vector2(0, 0);
    BlendTreeSystem.TempVector2_POSJ = new BABYLON.Vector2(0, 0);
    BlendTreeSystem.TempVector2_POSIP = new BABYLON.Vector2(0, 0);
    BlendTreeSystem.TempVector2_POSIJ = new BABYLON.Vector2(0, 0);
    BABYLON.BlendTreeSystem = BlendTreeSystem;
    ///////////////////////////////////////////
    // Support Classes, Enums And Interfaces
    ///////////////////////////////////////////
    class MachineState {
        constructor() { }
    }
    BABYLON.MachineState = MachineState;
    class TransitionCheck {
    }
    BABYLON.TransitionCheck = TransitionCheck;
    class AnimationMixer {
    }
    BABYLON.AnimationMixer = AnimationMixer;
    class BlendingWeights {
    }
    BABYLON.BlendingWeights = BlendingWeights;
    let MotionType;
    (function (MotionType) {
        MotionType[MotionType["Clip"] = 0] = "Clip";
        MotionType[MotionType["Tree"] = 1] = "Tree";
    })(MotionType = BABYLON.MotionType || (BABYLON.MotionType = {}));
    let ConditionMode;
    (function (ConditionMode) {
        ConditionMode[ConditionMode["If"] = 1] = "If";
        ConditionMode[ConditionMode["IfNot"] = 2] = "IfNot";
        ConditionMode[ConditionMode["Greater"] = 3] = "Greater";
        ConditionMode[ConditionMode["Less"] = 4] = "Less";
        ConditionMode[ConditionMode["Equals"] = 6] = "Equals";
        ConditionMode[ConditionMode["NotEqual"] = 7] = "NotEqual";
    })(ConditionMode = BABYLON.ConditionMode || (BABYLON.ConditionMode = {}));
    let InterruptionSource;
    (function (InterruptionSource) {
        InterruptionSource[InterruptionSource["None"] = 0] = "None";
        InterruptionSource[InterruptionSource["Source"] = 1] = "Source";
        InterruptionSource[InterruptionSource["Destination"] = 2] = "Destination";
        InterruptionSource[InterruptionSource["SourceThenDestination"] = 3] = "SourceThenDestination";
        InterruptionSource[InterruptionSource["DestinationThenSource"] = 4] = "DestinationThenSource";
    })(InterruptionSource = BABYLON.InterruptionSource || (BABYLON.InterruptionSource = {}));
    let BlendTreeType;
    (function (BlendTreeType) {
        BlendTreeType[BlendTreeType["Simple1D"] = 0] = "Simple1D";
        BlendTreeType[BlendTreeType["SimpleDirectional2D"] = 1] = "SimpleDirectional2D";
        BlendTreeType[BlendTreeType["FreeformDirectional2D"] = 2] = "FreeformDirectional2D";
        BlendTreeType[BlendTreeType["FreeformCartesian2D"] = 3] = "FreeformCartesian2D";
        BlendTreeType[BlendTreeType["Direct"] = 4] = "Direct";
        BlendTreeType[BlendTreeType["Clip"] = 5] = "Clip";
    })(BlendTreeType = BABYLON.BlendTreeType || (BABYLON.BlendTreeType = {}));
    let BlendTreePosition;
    (function (BlendTreePosition) {
        BlendTreePosition[BlendTreePosition["Lower"] = 0] = "Lower";
        BlendTreePosition[BlendTreePosition["Upper"] = 1] = "Upper";
    })(BlendTreePosition = BABYLON.BlendTreePosition || (BABYLON.BlendTreePosition = {}));
    let AnimatorParameterType;
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
    class AudioSource extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this._audio = null;
            this._name = null;
            this._loop = false;
            this._mute = false;
            this._pitch = 1;
            this._volume = 1;
            this._preload = false;
            this._priority = 128;
            this._panstereo = 0;
            this._mindistance = 1;
            this._maxdistance = 50;
            this._rolloffmode = "linear";
            this._rollofffactor = 1;
            this._playonawake = true;
            this._spatialblend = 0;
            this._preloaderUrl = null;
            this._reverbzonemix = 1;
            this._lastmutedvolume = null;
            this._bypasseffects = false;
            this._bypassreverbzones = false;
            this._bypasslistenereffects = false;
            this._initializedReadyInstance = false;
            /** Register handler that is triggered when the audio clip is ready */
            this.onReadyObservable = new BABYLON.Observable();
        }
        getSoundClip() { return this._audio; }
        getAudioElement() { return (this._audio != null) ? this._audio._htmlAudioElement : null; }
        awake() { this.awakeAudioSource(); }
        destroy() { this.destroyAudioSource(); }
        awakeAudioSource() {
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
            const filename = this.getProperty("file");
            if (filename != null && filename !== "") {
                const rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
                const playUrl = (rootUrl + filename);
                if (playUrl != null && playUrl !== "") {
                    if (this._preload === true) {
                        this._preloaderUrl = playUrl;
                    }
                    else {
                        this.setDataSource(playUrl);
                    }
                }
            }
        }
        destroyAudioSource() {
            this.onReadyObservable.clear();
            this.onReadyObservable = null;
            if (this._audio != null) {
                this._audio.dispose();
                this._audio = null;
            }
        }
        /**
         * Gets the ready status for track
         */
        isReady() {
            let result = false;
            if (this._audio != null) {
                result = this._audio.isReady();
            }
            return result;
        }
        /**
         * Gets the playing status for track
         */
        isPlaying() {
            let result = false;
            if (this._audio != null) {
                result = this._audio.isPlaying;
            }
            return result;
        }
        /**
         * Gets the paused status for track
         */
        isPaused() {
            let result = false;
            if (this._audio != null) {
                result = this._audio.isPaused;
            }
            return result;
        }
        /**
         * Play the sound track
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         * @param offset (optional) Start the sound at a specific time in seconds
         * @param length (optional) Sound duration (in seconds)
         */
        play(time, offset, length) {
            if (BABYLON.SceneManager.HasAudioContext()) {
                this.internalPlay(time, offset, length);
            }
            else {
                BABYLON.Engine.audioEngine.onAudioUnlockedObservable.addOnce(() => { this.internalPlay(time, offset, length); });
            }
            return true;
        }
        internalPlay(time, offset, length) {
            if (this._audio != null) {
                if (this._initializedReadyInstance === true) {
                    this._audio.play(time, offset, length);
                }
                else {
                    this.onReadyObservable.addOnce(() => { this._audio.play(time, offset, length); });
                }
            }
        }
        /**
         * Pause the sound track
         */
        pause() {
            let result = false;
            if (this._audio != null) {
                this._audio.pause();
                result = true;
            }
            return result;
        }
        /**
         * Stop the sound track
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        stop(time) {
            let result = false;
            if (this._audio != null) {
                this._audio.stop(time);
                result = true;
            }
            return result;
        }
        /**
         * Mute the sound track
         * @param time (optional) Mute the sound after X seconds. Start immediately (0) by default.
         */
        mute(time) {
            let result = false;
            if (this._audio != null) {
                this._lastmutedvolume = this._audio.getVolume();
                this._audio.setVolume(0, time);
            }
            return result;
        }
        /**
         * Unmute the sound track
         * @param time (optional) Unmute the sound after X seconds. Start immediately (0) by default.
         */
        unmute(time) {
            let result = false;
            if (this._audio != null) {
                if (this._lastmutedvolume != null) {
                    this._audio.setVolume(this._lastmutedvolume, time);
                    this._lastmutedvolume = null;
                }
            }
            return result;
        }
        /**
         * Gets the volume of the track
         */
        getVolume() {
            let result = 0;
            if (this._audio != null) {
                result = this._audio.getVolume();
            }
            else {
                result = this._volume;
            }
            return result;
        }
        /**
         * Sets the volume of the track
         * @param volume Define the new volume of the sound
         * @param time Define time for gradual change to new volume
         */
        setVolume(volume, time) {
            let result = false;
            this._volume = volume;
            if (this._audio != null) {
                this._audio.setVolume(this._volume, time);
            }
            result = true;
            return result;
        }
        /**
         * Gets the spatial sound option of the track
         */
        getSpatialSound() {
            let result = false;
            if (this._audio != null) {
                result = this._audio.spatialSound;
            }
            return result;
        }
        /**
         * Gets the spatial sound option of the track
         * @param value Define the value of the spatial sound
         */
        setSpatialSound(value) {
            if (this._audio != null) {
                this._audio.spatialSound = value;
            }
        }
        /**
         * Sets the sound track playback speed
         * @param rate the audio playback rate
         */
        setPlaybackSpeed(rate) {
            if (this._audio != null) {
                this._audio.setPlaybackRate(rate);
            }
        }
        /**
         * Gets the current time of the track
         */
        getCurrentTrackTime() {
            let result = 0;
            if (this._audio != null) {
                result = this._audio.currentTime;
            }
            return result;
        }
        /** Set audio data source */
        setDataSource(source) {
            if (this._audio != null) {
                this._audio.dispose();
                this._audio = null;
            }
            const spatialBlend = (this._spatialblend >= 0.1);
            const distanceModel = (this._rolloffmode === "logarithmic") ? "exponential" : "linear";
            const htmlAudioElementRequired = (this.transform.metadata != null && this.transform.metadata.vtt != null && this.transform.metadata.vtt === true);
            this._initializedReadyInstance = false;
            this._audio = new BABYLON.Sound(this._name, source, this.scene, () => {
                this._lastmutedvolume = this._volume;
                this._audio.setVolume((this._mute === true) ? 0 : this._volume);
                this._audio.setPlaybackRate(this._pitch);
                this._initializedReadyInstance = true;
                if (this.onReadyObservable.hasObservers() === true) {
                    this.onReadyObservable.notifyObservers(this._audio);
                }
                // ..
                // Support Auto Play On Awake
                // ..
                if (this._playonawake === true)
                    this.play();
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
        }
        /** Add audio preloader asset tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        addPreloaderTasks(assetsManager) {
            if (this._preload === true) {
                const assetTask = assetsManager.addBinaryFileTask((this.transform.name + ".AudioTask"), this._preloaderUrl);
                assetTask.onSuccess = (task) => { this.setDataSource(task.data); };
                assetTask.onError = (task, message, exception) => { console.error(message, exception); };
            }
        }
    }
    BABYLON.AudioSource = AudioSource;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon kinematic character controller pro class (Native Bullet Physics 2.82)
     * @class CharacterController - All rights reserved (c) 2020 Mackey Kinard
     */
    class CharacterController extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this._abstractMesh = null;
            this._avatarRadius = 0.5;
            this._avatarHeight = 2;
            this._centerOffset = new BABYLON.Vector3(0, 0, 0);
            this._skinWidth = 0.08;
            this._stepOffset = 0.3; // See https://discourse.threejs.org/t/ammo-js-with-three-js/12530/47 (Works Best With 0.535 and Box Or Cylinder Shape - ???)
            this._slopeLimit = 45;
            this._capsuleSegments = 16;
            this._minMoveDistance = 0.001;
            this._isPhysicsReady = false;
            this._maxCollisions = 4;
            this._useGhostSweepTest = false;
            this._tmpPositionBuffer = new BABYLON.Vector3(0, 0, 0);
            this._tmpCollisionContacts = null;
            this.updatePosition = true;
            /** Register handler that is triggered when the transform position has been updated */
            this.onUpdatePositionObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact has entered */
            this.onCollisionEnterObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact is active */
            this.onCollisionStayObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact has exited */
            this.onCollisionExitObservable = new BABYLON.Observable();
            this.m_character = null;
            this.m_ghostShape = null;
            this.m_ghostObject = null;
            this.m_ghostCollision = null;
            this.m_ghostTransform = null;
            this.m_ghostPosition = null;
            this.m_startPosition = null;
            this.m_startTransform = null;
            this.m_walkDirection = null;
            this.m_warpPosition = null;
            this.m_turningRate = 0;
            this.m_moveDeltaX = 0;
            this.m_moveDeltaZ = 0;
            this.m_physicsEngine = null;
            this.m_characterPosition = BABYLON.Vector3.Zero();
        }
        getInternalCharacter() { return this.m_character; }
        getAvatarRadius() { return this._avatarRadius; }
        getAvatarHeight() { return this._avatarHeight; }
        getSkinWidth() { return this._skinWidth; }
        getStepOffset() { return this._stepOffset; }
        getUseSweepTest() { return this._useGhostSweepTest; }
        getMinMoveDistance() { return this._minMoveDistance; }
        setMinMoveDistance(distance) { this._minMoveDistance = distance; }
        getVerticalVelocity() { return (this.m_character != null && this.m_character.getVerticalVelocity) ? this.m_character.getVerticalVelocity() : 0; } // Note: Toolkit Addon Function
        getAddedMargin() { return (this.m_character != null && this.m_character.getAddedMargin) ? this.m_character.getAddedMargin() : 0; } // Note: Toolkit Addon Function
        setAddedMargin(margin) { if (this.m_character != null && this.m_character.getAddedMargin)
            this.m_character.setAddedMargin(margin); } // Note: Toolkit Addon Function
        setMaxJumpHeight(maxJumpHeight) { if (this.m_character != null)
            this.m_character.setMaxJumpHeight(maxJumpHeight); }
        setFallingSpeed(fallSpeed) { if (this.m_character != null)
            this.m_character.setFallSpeed(fallSpeed); }
        getSlopeLimit() { return (this.m_character != null) ? this.m_character.getMaxSlope() : 0; }
        setSlopeLimit(slopeRadians) { if (this.m_character != null)
            this.m_character.setMaxSlope(slopeRadians); }
        setUpAxis(axis) { if (this.m_character != null)
            this.m_character.setUpAxis(axis); }
        getGravity() { return (this.m_character != null) ? this.m_character.getGravity() : 0; }
        setGravity(gravity) { if (this.m_character != null)
            this.m_character.setGravity(gravity); }
        isGrounded() { return (this.m_character != null) ? this.m_character.onGround() : false; }
        isReady() { return (this.m_character != null); }
        canJump() { return (this.m_character != null) ? this.m_character.canJump() : false; }
        internalWarp(position) { if (this.m_character != null)
            this.m_character.warp(position); } // Position: Ammo.btVector3
        internalJump() { if (this.m_character != null)
            this.m_character.jump(); }
        internalSetJumpSpeed(speed) { if (this.m_character != null)
            this.m_character.setJumpSpeed(speed); }
        internalSetWalkDirection(direction) { if (this.m_character != null)
            this.m_character.setWalkDirection(direction); } // Direction: Ammo.btVector3
        internalSetVelocityForTimeInterval(velocity, interval) { if (this.m_character != null)
            this.m_character.setVelocityForTimeInterval(velocity, interval); } // Velocity: Ammo.btVector3
        awake() { this.awakeMovementState(); }
        start() { this.startMovementState(); }
        update() { this.updateMovementState(); }
        destroy() { this.destroyMovementState(); }
        //////////////////////////////////////////////////
        // Protected Character Movement State Functions //
        //////////////////////////////////////////////////
        awakeMovementState() {
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
            const centerOffsetData = this.getProperty("centerOffset");
            if (centerOffsetData != null)
                this._centerOffset = BABYLON.Utilities.ParseVector3(centerOffsetData);
            // console.warn("Starting Character Controller For: " + this.transform.name);
            this.setMaxNotifications(this._maxCollisions);
            const world = BABYLON.SceneManager.GetPhysicsWorld(this.scene);
            if (world != null) {
                const startingPos = BABYLON.Utilities.GetAbsolutePosition(this.transform, this._centerOffset);
                this.m_startPosition = new Ammo.btVector3(startingPos.x, startingPos.y, startingPos.z);
                this.m_startTransform = new Ammo.btTransform();
                this.m_startTransform.setIdentity();
                this.m_startTransform.setOrigin(this.m_startPosition);
                // ..
                // Create a debug collision shape
                // ..
                const showDebugColliders = BABYLON.Utilities.ShowDebugColliders();
                const colliderVisibility = BABYLON.Utilities.ColliderVisibility();
                if (showDebugColliders === true && this.transform._debugCollider == null) {
                    const capsuleSize = new BABYLON.Vector3(this._avatarRadius, this._avatarHeight, 1);
                    capsuleSize.x *= Math.max(Math.abs(this.transform.scaling.x), Math.abs(this.transform.scaling.z));
                    capsuleSize.y *= this.transform.scaling.y;
                    const debugName = this.transform.name + ".Debug";
                    const debugCapsule = BABYLON.MeshBuilder.CreateCapsule(debugName, { tessellation: this._capsuleSegments, subdivisions: 8, capSubdivisions: 16, height: capsuleSize.y, radius: capsuleSize.x }, this.scene);
                    debugCapsule.position.set(0, 0, 0);
                    debugCapsule.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    debugCapsule.setParent(this.transform);
                    debugCapsule.position.copyFrom(this._centerOffset);
                    debugCapsule.visibility = colliderVisibility;
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
        }
        startMovementState() {
            this.updateMovementState();
        }
        syncMovementState() {
            if (this._isPhysicsReady === true) {
                this.m_ghostTransform = this.m_ghostObject.getWorldTransform();
                if (this.m_ghostTransform != null) {
                    this.m_ghostPosition = this.m_ghostTransform.getOrigin();
                }
                else {
                    this.m_ghostPosition = null;
                }
            }
        }
        updateMovementState() {
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
        }
        parseGhostCollisionContacts() {
            if (this._isPhysicsReady === true) {
                const hasEnterObservers = this.onCollisionEnterObservable.hasObservers();
                const hasStayObservers = this.onCollisionStayObservable.hasObservers();
                const hasExitObservers = this.onCollisionExitObservable.hasObservers();
                if (hasEnterObservers || hasStayObservers || hasExitObservers) {
                    let index = 0; // Note: Flag All Collision List Items For End Contact State
                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                        this._tmpCollisionContacts[index].reset = true;
                    }
                    // ..
                    // Parse Overlapping Ghost Contact Objects
                    // ..
                    let contacts = this.m_ghostObject.getNumOverlappingObjects();
                    if (contacts > this._maxCollisions)
                        contacts = this._maxCollisions;
                    if (contacts > 0) {
                        for (index = 0; index < contacts; index++) {
                            const contactObject = this.m_ghostObject.getOverlappingObject(index);
                            if (contactObject != null) {
                                const contactBody = Ammo.castObject(contactObject, Ammo.btCollisionObject);
                                if (contactBody != null && contactBody.entity != null && contactBody.isActive()) {
                                    let foundindex = -1;
                                    const contactMesh = contactBody.entity;
                                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                        const check = this._tmpCollisionContacts[index];
                                        if (check.mesh != null && check.mesh === contactMesh) {
                                            check.state = 1;
                                            check.reset = false;
                                            foundindex = index;
                                            break;
                                        }
                                    }
                                    if (foundindex === -1) {
                                        for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                            const insert = this._tmpCollisionContacts[index];
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
                        const info = this._tmpCollisionContacts[index];
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
        }
        destroyMovementState() {
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
        }
        ////////////////////////////////////////////////////
        // Character Controller Advanced Helper Functions //
        ////////////////////////////////////////////////////
        /** Sets the maximum number of simultaneous contact notfications to dispatch per frame. Defaults value is 4. (Advanved Use Only) */
        setMaxNotifications(max) {
            this._maxCollisions = max;
            this._tmpCollisionContacts = [];
            for (let index = 0; index < this._maxCollisions; index++) {
                this._tmpCollisionContacts.push(new BABYLON.CollisionContactInfo());
            }
        }
        /** Sets character collision activation state using physics ghost object. (Advanved Use Only) */
        setActivationState(state) {
            if (this.m_ghostCollision != null && this.m_ghostCollision.setActivationState) {
                this.m_ghostCollision.setActivationState(state);
            }
        }
        /** Gets character collision group filter using physics ghost object. (Advanved Use Only) */
        getCollisionFilterGroup() {
            let result = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                result = this.m_ghostCollision.getBroadphaseHandle().get_m_collisionFilterGroup();
            }
            return result;
        }
        /** Sets character collision group filter using physics ghost object. (Advanved Use Only) */
        setCollisionFilterGroup(group) {
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                this.m_ghostCollision.getBroadphaseHandle().set_m_collisionFilterGroup(group);
            }
        }
        /** Gets character collision mask filter using physics ghost object. (Advanved Use Only) */
        getCollisionFilterMask() {
            let result = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                result = this.m_ghostCollision.getBroadphaseHandle().get_m_collisionFilterMask();
            }
            return result;
        }
        /** Sets the character collision mask filter using physics ghost object. (Advanved Use Only) */
        setCollisionFilterMask(mask) {
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                this.m_ghostCollision.getBroadphaseHandle().set_m_collisionFilterMask(mask);
            }
        }
        /** Gets the chracter contact processing threshold using physics ghost object. (Advanved Use Only) */
        getContactProcessingThreshold() {
            let result = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getContactProcessingThreshold) {
                this.m_ghostCollision.getContactProcessingThreshold();
            }
            return result;
        }
        /** Sets character contact processing threshold using physics ghost object. (Advanved Use Only) */
        setContactProcessingThreshold(threshold) {
            if (this.m_ghostCollision != null && this.m_ghostCollision.setContactProcessingThreshold) {
                this.m_ghostCollision.setContactProcessingThreshold(threshold);
            }
        }
        /** Get the current position of the physics ghost object world transform. (Advanved Use Only) */
        getGhostWorldPosition() {
            const result = new BABYLON.Vector3(0, 0, 0);
            if (this.m_ghostPosition != null) {
                result.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
            }
            return result;
        }
        /** Get the current position of the physics ghost object world transform. (Advanved Use Only) */
        getGhostWorldPositionToRef(result) {
            if (this.m_ghostPosition != null && result != null) {
                result.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
            }
        }
        /** Manually set the position of the physics ghost object world transform. (Advanved Use Only) */
        setGhostWorldPosition(position) {
            if (this.m_ghostObject != null && this.m_ghostTransform != null) {
                if (this.m_ghostPosition != null && position != null) {
                    this.m_ghostPosition.setValue(position.x, position.y, position.z);
                    this.m_ghostTransform.setOrigin(this.m_ghostPosition);
                }
                this.m_ghostObject.setWorldTransform(this.m_ghostTransform);
            }
        }
        ////////////////////////////////////////////////////
        // Public Character Controller Movement Functions //
        ////////////////////////////////////////////////////
        /** Sets the kinematic character position to the specified location. */
        set(x, y, z) {
            this._tmpPositionBuffer.set(x, y, z);
            this.setGhostWorldPosition(this._tmpPositionBuffer);
        }
        /** Translates the kinematic character with the specfied velocity. */
        move(velocity) {
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
        }
        /** Jumps the kinematic chacracter with the specified speed. */
        jump(speed) {
            this.internalSetJumpSpeed(speed);
            this.internalJump();
        }
        /** Warps the kinematic chacracter to the specified position. */
        warp(position) {
            if (this.m_warpPosition != null) {
                this.m_warpPosition.setValue(position.x, position.y, position.z);
                this.internalWarp(this.m_warpPosition);
            }
        }
    }
    CharacterController.MARGIN_FACTOR = -0.04;
    BABYLON.CharacterController = CharacterController;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon navigation agent pro class (Unity Style Navigation Agent System)
     * @class NavigationAgent - All rights reserved (c) 2020 Mackey Kinard
     */
    class NavigationAgent extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.distanceToTarget = 0;
            this.teleporting = false;
            this.moveDirection = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.resetPosition = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.lastPosition = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.distancePosition = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.currentPosition = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.currentRotation = new BABYLON.Quaternion(0.0, 0.0, 0.0, 1.0);
            this.currentVelocity = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.currentWaypoint = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.heightOffset = 0;
            this.angularSpeed = 0;
            this.updatePosition = true;
            this.updateRotation = true;
            this.distanceEpsilon = 0.1;
            this.velocityEpsilon = 1.1;
            this.offMeshVelocity = 1.5;
            this.stoppingDistance = 0;
            /** Register handler that is triggered when the agent is ready for navigation */
            this.onReadyObservable = new BABYLON.Observable();
            /** Register handler that is triggered before the navigation update */
            this.onPreUpdateObservable = new BABYLON.Observable();
            /** Register handler that is triggered after the navigation update */
            this.onPostUpdateObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the navigation is complete */
            this.onNavCompleteObservable = new BABYLON.Observable();
            this.m_agentState = 0;
            this.m_agentIndex = -1;
            this.m_agentReady = false;
            this.m_agentGhost = null;
            this.m_agentParams = null;
            this.m_agentMovement = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.m_agentDirection = new BABYLON.Vector3(0.0, 0.0, 1.0);
            this.m_agentQuaternion = new BABYLON.Quaternion(0.0, 0.0, 0.0, 1.0);
            this.m_agentDestination = null;
        }
        isReady() { return this.m_agentReady; }
        isNavigating() { return (this.m_agentDestination != null); }
        isTeleporting() { return this.teleporting; }
        isOnOffMeshLink() { return (this.m_agentState === BABYLON.CrowdAgentState.DT_CROWDAGENT_STATE_OFFMESH); }
        getAgentType() { return this.type; }
        getAgentState() { return this.m_agentState; }
        getAgentIndex() { return this.m_agentIndex; }
        getAgentOffset() { return this.baseOffset; }
        getTargetDistance() { return this.distanceToTarget; }
        getCurrentPosition() { return this.currentPosition; }
        getCurrentRotation() { return this.currentRotation; }
        getCurrentVelocity() { return this.currentVelocity; }
        getAgentParameters() { return this.m_agentParams; }
        setAgentParameters(parameters) { this.m_agentParams = parameters; this.updateAgentParameters(); }
        awake() { this.awakeNavigationAgent(); }
        update() { this.updateNavigationAgent(); }
        destroy() { this.destroyNavigationAgent(); }
        //////////////////////////////////////////////////////
        // Navigation Private Functions                     //
        //////////////////////////////////////////////////////
        awakeNavigationAgent() {
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
        }
        updateNavigationAgent() {
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
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
                const rotateFactor = (this.angularSpeed * BABYLON.NavigationAgent.ANGULAR_SPEED_RATIO * this.getDeltaSeconds());
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
                    const targetAngle = (BABYLON.NavigationAgent.TARGET_ANGLE_FACTOR - Math.atan2(this.m_agentDirection.x, this.m_agentDirection.z));
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
        }
        updateAgentParameters() {
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0)
                crowd.updateAgentParameters(this.m_agentIndex, this.m_agentParams);
        }
        destroyNavigationAgent() {
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
        }
        //////////////////////////////////////////////////////
        // Navigation Public Functions                      //
        //////////////////////////////////////////////////////
        /** Move agent relative to current position. */
        move(offset, closetPoint = true) {
            const plugin = BABYLON.SceneManager.GetNavigationTools();
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
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
        }
        /** Teleport agent to destination point. */
        teleport(destination, closetPoint = true) {
            const plugin = BABYLON.SceneManager.GetNavigationTools();
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
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
        }
        /** Sets agent current destination point. */
        setDestination(destination, closetPoint = true) {
            const plugin = BABYLON.SceneManager.GetNavigationTools();
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
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
        }
        /** Gets agent current world space velocity. */
        getAgentVelocity() {
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentVelocity(this.m_agentIndex) : null;
        }
        /** Gets agent current world space velocity. */
        getAgentVelocityToRef(result) {
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0)
                crowd.getAgentVelocityToRef(this.m_agentIndex, result);
        }
        /** Gets agent current world space position. */
        getAgentPosition() {
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentPosition(this.m_agentIndex) : null;
        }
        /** Gets agent current world space position. */
        getAgentPositionToRef(result) {
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0)
                crowd.getAgentPositionToRef(this.m_agentIndex, result);
        }
        /** Gets agent current waypoint position. */
        getAgentWaypoint() {
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentNextTargetPath(this.m_agentIndex) : null;
        }
        /** Gets agent current waypoint position. */
        getAgentWaypointToRef(result) {
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0)
                crowd.getAgentNextTargetPathToRef(this.m_agentIndex, result);
        }
        /** Cancel current waypoint path navigation. */
        cancelNavigation() {
            this.m_agentDestination = null; // Note: Disable Auto Position Update
            const crowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            const position = this.getAgentPosition();
            if (position != null && crowd != null && this.m_agentIndex >= 0) {
                crowd.agentTeleport(this.m_agentIndex, position);
                // DEPRECIATED: position.y += (this.baseOffset + this.heightOffset);
                // DEPRECIATED: this.transform.position.copyFrom(position);
            }
        }
    }
    NavigationAgent.TARGET_ANGLE_FACTOR = (Math.PI * 0.5);
    NavigationAgent.ANGULAR_SPEED_RATIO = 0.05;
    BABYLON.NavigationAgent = NavigationAgent;
    /**
     *  Recast Detour Crowd Agent States
     */
    let CrowdAgentState;
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
    class RaycastVehicle {
        constructor(entity, world, center, defaultAngularFactor = null) {
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
        getCenterMassOffset() { return this._centerMass; }
        getInternalVehicle() { return this.m_vehicle; }
        getUpAxis() { if (this.m_vehicle != null)
            return this.m_vehicle.getUpAxis(); }
        getRightAxis() { if (this.m_vehicle != null)
            return this.m_vehicle.getRightAxis(); }
        getForwardAxis() { if (this.m_vehicle != null)
            return this.m_vehicle.getForwardAxis(); }
        getForwardVector() { if (this.m_vehicle != null)
            return this.m_vehicle.getForwardVector(); }
        getNumWheels() { if (this.m_vehicle != null)
            return this.m_vehicle.getNumWheels(); }
        getWheelInfo(wheel) { if (this.m_vehicle != null)
            return this.m_vehicle.getWheelInfo(wheel); } // Ammo.btWheelInfo
        resetSuspension() { if (this.m_vehicle != null)
            this.m_vehicle.resetSuspension(); }
        setPitchControl(pitch) { if (this.m_vehicle != null)
            this.m_vehicle.setPitchControl(pitch); }
        setEngineForce(power, wheel) { if (this.m_vehicle != null)
            this.m_vehicle.applyEngineForce(power, wheel); }
        setBrakingForce(brake, wheel) { if (this.m_vehicle != null)
            this.m_vehicle.setBrake(brake, wheel); }
        getWheelTransform(wheel) { if (this.m_vehicle != null)
            return this.m_vehicle.getWheelTransformWS(wheel); } // Ammo.btTransform
        updateWheelTransform(wheel, interpolate) { if (this.m_vehicle != null)
            this.m_vehicle.updateWheelTransform(wheel, interpolate); }
        getUserConstraintType() { if (this.m_vehicle != null)
            return this.m_vehicle.getUserConstraintType(); }
        setUserConstraintType(userConstraintType) { if (this.m_vehicle != null)
            this.m_vehicle.setUserConstraintType(userConstraintType); }
        setUserConstraintId(uid) { if (this.m_vehicle != null)
            this.m_vehicle.setUserConstraintId(uid); }
        getUserConstraintId() { if (this.m_vehicle != null)
            return this.m_vehicle.getUserConstraintId(); }
        getRawCurrentSpeedKph() { if (this.m_vehicle != null)
            return this.m_vehicle.getCurrentSpeedKmHour(); }
        getRawCurrentSpeedMph() { if (this.m_vehicle != null)
            return this.m_vehicle.getCurrentSpeedKmHour() * BABYLON.System.Kph2Mph; }
        getAbsCurrentSpeedKph() { if (this.m_vehicle != null)
            return Math.abs(this.m_vehicle.getCurrentSpeedKmHour()); }
        getAbsCurrentSpeedMph() { if (this.m_vehicle != null)
            return Math.abs(this.m_vehicle.getCurrentSpeedKmHour()) * BABYLON.System.Kph2Mph; }
        getVehicleTuningSystem() { return this.m_vehicleTuning; } // Ammo.btVehicleTuning
        getChassisWorldTransform() { if (this.m_vehicle != null)
            return this.m_vehicle.getChassisWorldTransform(); } // Ammo.btTransform
        dispose() {
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
                Ammo.destroy(this.m_tempPosition); // ???
                this.m_tempPosition = null;
            }
            if (this.m_tempTransform != null) {
                Ammo.destroy(this.m_tempTransform); // ???
                this.m_tempTransform = null;
            }
            this.m_vehicleColliders = null;
        }
        ///////////////////////////////////////////////////////
        // Static Raycast Vehicle Instance Helper Functions
        ///////////////////////////////////////////////////////
        /** Gets the rigidbody raycast vehicle controller for the entity. Note: Wheel collider metadata informaion is required for raycast vehicle control. */
        static GetInstance(scene, rigidbody, defaultAngularFactor = null) {
            const anybody = rigidbody;
            if (anybody.m_raycastVehicle == null) {
                if (rigidbody.hasWheelColliders()) {
                    const rightHanded = BABYLON.SceneManager.GetRightHanded(scene);
                    if (rightHanded === true)
                        BABYLON.Tools.Warn("Raycast vehicle not supported for right handed scene: " + anybody._abstractMesh.name);
                    anybody.m_raycastVehicle = new BABYLON.RaycastVehicle(anybody._abstractMesh, anybody.m_physicsWorld, anybody._centerOfMass, defaultAngularFactor);
                }
                else {
                    BABYLON.Tools.Warn("No wheel collider metadata found for: " + anybody._abstractMesh.name);
                }
            }
            return anybody.m_raycastVehicle;
        }
        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Advanced Helper Functions
        ///////////////////////////////////////////////////////
        /** Gets vehicle enable multi raycast flag using physics vehicle object. (Advanved Use Only) */
        getEnableMultiRaycast() {
            let result = false;
            if (this.m_vehicle != null && this.m_vehicle.get_m_enableMultiRaycast) {
                result = this.m_vehicle.get_m_enableMultiRaycast();
            }
            return result;
        }
        /** Sets vehicle enable multi raycast flag using physics vehicle object. (Advanved Use Only) */
        setEnableMultiRaycast(flag) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_enableMultiRaycast) {
                this.m_vehicle.set_m_enableMultiRaycast(flag);
            }
        }
        /** Gets vehicle stable force using physics vehicle object. (Advanved Use Only) */
        getStabilizingForce() {
            let result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_stabilizingForce) {
                result = this.m_vehicle.get_m_stabilizingForce();
            }
            return result;
        }
        /** Sets vehicle stable force using physics vehicle object. (Advanved Use Only) */
        setStabilizingForce(force) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_stabilizingForce) {
                this.m_vehicle.set_m_stabilizingForce(force);
            }
        }
        /** Gets vehicle max stable force using physics vehicle object. (Advanved Use Only) */
        getMaxImpulseForce() {
            let result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_maxImpulseForce) {
                result = this.m_vehicle.get_m_maxImpulseForce();
            }
            return result;
        }
        /** Sets vehicle max stable force using physics vehicle object. (Advanved Use Only) */
        setMaxImpulseForce(force) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_maxImpulseForce) {
                this.m_vehicle.set_m_maxImpulseForce(force);
            }
        }
        /** Gets vehicle smooth flying impulse force using physics vehicle object. (Advanved Use Only) */
        getSmoothFlyingImpulse() {
            let result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_smoothFlyingImpulse) {
                result = this.m_vehicle.get_m_smoothFlyingImpulse();
            }
            return result;
        }
        /** Sets vehicle smooth flying impulse using physics vehicle object. (Advanved Use Only) */
        setSmoothFlyingImpulse(impulse) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_smoothFlyingImpulse) {
                this.m_vehicle.set_m_smoothFlyingImpulse(impulse);
            }
        }
        /** Gets vehicle track connection accel force using physics vehicle object. (Advanved Use Only) */
        getTrackConnectionAccel() {
            let result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_trackConnectionAccel) {
                result = this.m_vehicle.get_m_trackConnectionAccel();
            }
            return result;
        }
        /** Sets vehicle track connection accel force using physics vehicle object. (Advanved Use Only) */
        setTrackConnectionAccel(force) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_trackConnectionAccel) {
                this.m_vehicle.set_m_trackConnectionAccel(force);
            }
        }
        /** Gets vehicle min wheel contact count using physics vehicle object. (Advanved Use Only) */
        getMinimumWheelContacts() {
            let result = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_minimumWheelContacts) {
                result = this.m_vehicle.get_m_minimumWheelContacts();
            }
            return result;
        }
        /** Sets vehicle min wheel contact count using physics vehicle object. (Advanved Use Only) */
        setMinimumWheelContacts(force) {
            if (this.m_vehicle != null && this.m_vehicle.set_m_minimumWheelContacts) {
                this.m_vehicle.set_m_minimumWheelContacts(force);
            }
        }
        /** Gets vehicle interpolate mesh normals flag using physics raycaster object. (Advanved Use Only) */
        getInterpolateNormals() {
            let result = false;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_interpolateNormals) {
                result = this.m_vehicleRaycaster.get_m_interpolateNormals();
            }
            return result;
        }
        /** Sets the vehicle interpolate mesh normals using physics raycaster object. (Advanved Use Only) */
        setInterpolateNormals(flag) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_interpolateNormals) {
                this.m_vehicleRaycaster.set_m_interpolateNormals(flag);
            }
        }
        /** Gets vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        getShapeTestingMode() {
            let result = false;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_shapeTestingMode) {
                result = this.m_vehicleRaycaster.get_m_shapeTestingMode();
            }
            return result;
        }
        /** Sets the vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        setShapeTestingMode(mode) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_shapeTestingMode) {
                this.m_vehicleRaycaster.set_m_shapeTestingMode(mode);
            }
        }
        /** Gets vehicle shape testing size using physics raycaster object. (Advanved Use Only) */
        getShapeTestingSize() {
            let result = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_shapeTestingSize) {
                result = this.m_vehicleRaycaster.get_m_shapeTestingSize();
            }
            return result;
        }
        /** Sets the vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        setShapeTestingSize(size) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_shapeTestingSize) {
                this.m_vehicleRaycaster.set_m_shapeTestingSize(size);
            }
        }
        /** Gets vehicle shape test point count using physics raycaster object. (Advanved Use Only) */
        getShapeTestingCount() {
            let result = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_testPointCount) {
                result = this.m_vehicleRaycaster.get_m_testPointCount();
            }
            return result;
        }
        /** Sets the vehicle shape test point count using physics raycaster object. (Advanved Use Only) */
        setShapeTestingCount(count) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_testPointCount) {
                this.m_vehicleRaycaster.set_m_testPointCount(count);
            }
        }
        /** Gets vehicle sweep penetration amount using physics raycaster object. (Advanved Use Only) */
        getSweepPenetration() {
            let result = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_sweepPenetration) {
                result = this.m_vehicleRaycaster.get_m_sweepPenetration();
            }
            return result;
        }
        /** Sets the vehicle sweep penetration amount using physics raycaster object. (Advanved Use Only) */
        setSweepPenetration(amount) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_sweepPenetration) {
                this.m_vehicleRaycaster.set_m_sweepPenetration(amount);
            }
        }
        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Advanced Collision Functions
        ///////////////////////////////////////////////////////
        /** Gets vehicle collision group filter using physics raycaster object. (Advanved Use Only) */
        getCollisionFilterGroup() {
            let result = -1;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_collisionFilterGroup) {
                result = this.m_vehicleRaycaster.get_m_collisionFilterGroup();
            }
            return result;
        }
        /** Sets vehicle collision group filter using physics raycaster object. (Advanved Use Only) */
        setCollisionFilterGroup(group) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_collisionFilterGroup) {
                this.m_vehicleRaycaster.set_m_collisionFilterGroup(group);
            }
        }
        /** Gets vehicle collision mask filter using physics raycaster object. (Advanved Use Only) */
        getCollisionFilterMask() {
            let result = -1;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_collisionFilterMask) {
                result = this.m_vehicleRaycaster.get_m_collisionFilterMask();
            }
            return result;
        }
        /** Sets the vehicle collision mask filter using physics raycaster object. (Advanved Use Only) */
        setCollisionFilterMask(mask) {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_collisionFilterMask) {
                this.m_vehicleRaycaster.set_m_collisionFilterMask(mask);
            }
        }
        ///////////////////////////////////////////////////////
        // Raycast Vehicle Wheel Information Helper Funtions
        ///////////////////////////////////////////////////////
        /** Gets the internal wheel index by id string. */
        getWheelIndexByID(id) {
            let result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                for (let index = 0; index < this.m_vehicleColliders.length; index++) {
                    const wheel = this.m_vehicleColliders[index];
                    if (id.toLowerCase() === wheel.id.toLowerCase()) {
                        result = index;
                        break;
                    }
                }
            }
            return result;
        }
        /** Gets the internal wheel index by name string. */
        getWheelIndexByName(name) {
            let result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                for (let index = 0; index < this.m_vehicleColliders.length; index++) {
                    const wheel = this.m_vehicleColliders[index];
                    if (name.toLowerCase() === wheel.name.toLowerCase()) {
                        result = index;
                        break;
                    }
                }
            }
            return result;
        }
        /** Gets the internal wheel collider information. */
        getWheelColliderInfo(wheel) {
            let result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0 && this.m_vehicleColliders.length > wheel) {
                result = this.m_vehicleColliders[wheel];
            }
            return result;
        }
        /** Sets the internal wheel hub transform mesh by index. Used to rotate and bounce wheels. */
        setWheelTransformMesh(wheel, transform) {
            if (transform == null)
                return;
            const wheelinfo = this.getWheelInfo(wheel);
            if (wheelinfo != null)
                wheelinfo.transform = transform;
        }
        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Seering Helper Functions
        ///////////////////////////////////////////////////////
        getVisualSteeringAngle(wheel) {
            let result = 0;
            const wheelinfo = this.getWheelInfo(wheel);
            if (wheelinfo != null && wheelinfo.steeringAngle != null) {
                result = wheelinfo.steeringAngle;
            }
            return result;
        }
        setVisualSteeringAngle(angle, wheel) {
            const wheelinfo = this.getWheelInfo(wheel);
            if (wheelinfo != null) {
                wheelinfo.steeringAngle = angle;
            }
        }
        getPhysicsSteeringAngle(wheel) {
            if (this.m_vehicle != null) {
                return Math.abs(this.m_vehicle.getSteeringValue(wheel));
            }
        }
        setPhysicsSteeringAngle(angle, wheel) {
            if (this.m_vehicle != null) {
                this.m_vehicle.setSteeringValue(angle, wheel);
            }
        }
        /////////////////////////////////////////////
        // Setup Wheel Information Helper Funtions //
        /////////////////////////////////////////////
        setupWheelInformation(defaultAngularFactor = null) {
            if (this._chassisMesh != null && this._chassisMesh.physicsImpostor != null && this._chassisMesh.physicsImpostor.physicsBody != null) {
                if (defaultAngularFactor != null) {
                    // https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=8153
                    // prevent vehicle from flip over, by limit the rotation  on forward axis or limit angles for vehicle stablization
                    this._chassisMesh.physicsImpostor.physicsBody.setAngularFactor(new Ammo.btVector3(defaultAngularFactor.x, defaultAngularFactor.y, defaultAngularFactor.z));
                }
                this._chassisMesh.physicsImpostor.physicsBody.setActivationState(BABYLON.CollisionState.DISABLE_DEACTIVATION);
            }
            if (this.m_vehicle != null && this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                let index = -1;
                for (index = 0; index < this.m_vehicleColliders.length; index++) {
                    const wheel = this.m_vehicleColliders[index];
                    const wheelName = (wheel.name != null) ? wheel.name : "Unknown";
                    const wheelRadius = (wheel.radius != null) ? wheel.radius : 0.35;
                    const wheelHalfTrack = (wheel.position != null && wheel.position.length >= 3) ? wheel.position[0] : 1;
                    const wheelAxisPosition = (wheel.position != null && wheel.position.length >= 3) ? wheel.position[2] : -1;
                    // ..
                    // Raycast Wheel Script Properties
                    // ..
                    const wheelConnectionPoint = (wheel.wheelconnectionpoint != null) ? wheel.wheelconnectionpoint : 0.5;
                    const suspensionRestLength = (wheel.suspensionrestlength != null) ? wheel.suspensionrestlength : 0.3;
                    const isfrontwheel = (wheel.frontwheel != null) ? true : (wheelName.toLowerCase().indexOf("front") >= 0);
                    const wheelposition = wheelAxisPosition;
                    const wheeltracking = wheelHalfTrack;
                    const centermassx = -this._centerMass.x;
                    const centermassz = -this._centerMass.z;
                    this.m_vehicle.addWheel(new Ammo.btVector3((wheeltracking + centermassx), wheelConnectionPoint, (wheelposition + centermassz)), this.m_wheelDirectionCS0, this.m_wheelAxleCS, suspensionRestLength, wheelRadius, this.m_vehicleTuning, isfrontwheel);
                }
                if (this.m_vehicle.getNumWheels() === this.m_vehicleColliders.length) {
                    for (index = 0; index < this.m_vehicleColliders.length; index++) {
                        const wheel = this.m_vehicleColliders[index];
                        const defaultForce = (wheel.totalsuspensionforces != null) ? wheel.totalsuspensionforces : 25000; // Bullet: 6000
                        const defaultTravel = (wheel.suspensiontravelcm != null) ? wheel.suspensiontravelcm : 100; // Bullet: 500
                        const defaultRolling = (wheel.rollinfluence != null) ? wheel.rollinfluence : 0.2; // Bullet: 0.1
                        const defaultFriction = (wheel.frictionslip != null) ? wheel.frictionslip : 10; // Bullet: 10.5
                        const suspensionStiffness = (wheel.suspensionstiffness != null) ? wheel.suspensionstiffness : 50; // Bullet: 5.88
                        const suspensionCompression = (wheel.dampingcompression != null) ? wheel.dampingcompression : 2.5; // Bullet: 0.83
                        const suspensionDamping = (wheel.dampingrelaxation != null) ? wheel.dampingrelaxation : 4.5; // Bullet: 0.88
                        const wheelinfo = this.m_vehicle.getWheelInfo(index);
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
        }
        updateWheelInformation() {
            const wheels = this.getNumWheels();
            if (wheels > 0) {
                for (let index = 0; index < wheels; index++) {
                    const wheelinfo = this.getWheelInfo(index);
                    if (wheelinfo != null) {
                        const locked = this.lockedWheelInformation(index);
                        this.updateWheelTransform(index, false);
                        // Update Wheel Information Internals
                        this.m_tempTransform = this.getWheelTransform(index);
                        this.m_tempPosition = this.m_tempTransform.getOrigin();
                        // Sync Wheel Hub Transform To Raycast Wheel
                        if (wheelinfo.transform != null) {
                            const transform = wheelinfo.transform;
                            if (transform.parent != null) {
                                // Update Wheel Hub Position
                                BABYLON.Utilities.ConvertAmmoVector3ToRef(this.m_tempPosition, this._tempVectorPos);
                                BABYLON.Utilities.InverseTransformPointToRef(transform.parent, this._tempVectorPos, this._tempVectorPos);
                                transform.position.y = this._tempVectorPos.y;
                                // Update Wheel Hub Steering
                                let steeringAngle = (wheelinfo.steeringAngle != null) ? wheelinfo.steeringAngle : 0;
                                BABYLON.Quaternion.FromEulerAnglesToRef(0, steeringAngle, 0, transform.rotationQuaternion);
                                // Update Wheel Spinner Rotation
                                if (wheelinfo.spinner != null && wheelinfo.spinner.addRotation) {
                                    if (locked === false) {
                                        let wheelrotation = 0;
                                        let deltaRotation = (wheelinfo.get_m_deltaRotation != null) ? wheelinfo.get_m_deltaRotation() : 0;
                                        let rotationBoost = (wheelinfo.rotationBoost != null) ? wheelinfo.rotationBoost : 0;
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
        }
        lockedWheelInformation(wheel) {
            let result = false;
            if (this.lockedWheelIndexes != null && this.lockedWheelIndexes.length > 0) {
                for (let index = 0; index < this.lockedWheelIndexes.length; index++) {
                    if (this.lockedWheelIndexes[index] === wheel) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }
        deleteWheelInformation() {
            const wheels = this.getNumWheels();
            if (wheels > 0) {
                for (let index = 0; index < wheels; index++) {
                    const info = this.getWheelInfo(index);
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
        }
    }
    BABYLON.RaycastVehicle = RaycastVehicle;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon realtime reflection system pro class (Unity Style Realtime Reflection Probes)
     * @class RealtimeReflection - All rights reserved (c) 2020 Mackey Kinard
     */
    class RealtimeReflection extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.renderList = null;
            this.probeList = null;
            this.refreshMode = 0;
            this.cullingMask = 0;
            this.clearFlags = 0;
            this.probeid = 0;
            this.useProbeList = false;
            this.includeChildren = false;
            this.resolution = 128;
            this.boxPos = null;
            this.boxSize = null;
            this.boxProjection = false;
        }
        getProbeList() { return this.probeList; }
        getRenderList() { return this.renderList; }
        awake() { this.awakeRealtimReflections(); }
        start() { this.startRealtimReflections(); }
        destroy() { this.destroyRealtimReflections(); }
        awakeRealtimReflections() {
            this.probeid = this.getProperty("id", this.probeid);
            this.resolution = this.getProperty("resolution", this.resolution);
            this.cullingMask = this.getProperty("culling", this.cullingMask);
            this.clearFlags = this.getProperty("clearflags", this.clearFlags);
            this.refreshMode = this.getProperty("refreshmode", this.refreshMode);
            this.useProbeList = this.getProperty("useprobelist", this.useProbeList);
            this.includeChildren = this.getProperty("includechildren", this.includeChildren);
            this.boxProjection = this.getProperty("boxprojection", this.boxProjection);
            if (this.boxProjection === true) {
                const bbp = this.getProperty("boundingboxposition");
                if (bbp != null && bbp.length >= 3) {
                    this.boxPos = new BABYLON.Vector3(bbp[0], bbp[1], bbp[2]);
                }
                const bbz = this.getProperty("boundingboxsize");
                if (bbz != null && bbz.length >= 3) {
                    this.boxSize = new BABYLON.Vector3(bbz[0], bbz[1], bbz[2]);
                }
            }
        }
        startRealtimReflections() {
            let index = 0;
            const quality = BABYLON.SceneManager.GetRenderQuality();
            const allowReflections = (quality === BABYLON.RenderQuality.High);
            if (allowReflections === true) {
                if (this.cullingMask === 0) { // Nothing
                    if (this.clearFlags === BABYLON.RealtimeReflection.SKYBOX_FLAG) {
                        const skybox = BABYLON.SceneManager.GetAmbientSkybox(this.scene);
                        if (skybox != null) {
                            if (this.renderList == null)
                                this.renderList = [];
                            this.renderList.push(skybox);
                        }
                    }
                }
                else if (this.cullingMask === -1) { // Everything
                    for (index = 0; index < this.scene.meshes.length; index++) {
                        let render = false;
                        const mesh = this.scene.meshes[index];
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
                    const renderListData = this.getProperty("renderlist");
                    if (renderListData != null && renderListData.length > 0) {
                        for (index = 0; index < renderListData.length; index++) {
                            const renderId = renderListData[index];
                            const renderMesh = BABYLON.SceneManager.GetMeshByID(this.scene, renderId);
                            if (renderMesh != null) {
                                if (this.renderList == null)
                                    this.renderList = [];
                                const detailName = renderMesh.name + ".Detail";
                                const detailChildren = renderMesh.getChildren((node) => { return (node.name === detailName); }, true);
                                if (detailChildren != null && detailChildren.length > 0) {
                                    this.renderList.push(detailChildren[0]);
                                }
                                else {
                                    this.renderList.push(renderMesh);
                                }
                            }
                        }
                    }
                    if (this.clearFlags === BABYLON.RealtimeReflection.SKYBOX_FLAG) {
                        const skybox = BABYLON.SceneManager.GetAmbientSkybox(this.scene);
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
                    const probeListData = this.getProperty("probelist");
                    if (probeListData != null && probeListData.length > 0) {
                        for (index = 0; index < probeListData.length; index++) {
                            const probeId = probeListData[index];
                            const probeMesh = BABYLON.SceneManager.GetMeshByID(this.scene, probeId);
                            if (probeMesh != null) {
                                if (this.probeList == null)
                                    this.probeList = [];
                                this.probeList.push(probeMesh);
                                if (this.includeChildren === true) {
                                    const childMeshes = probeMesh.getChildMeshes(false);
                                    for (let ii = 0; ii < childMeshes.length; ii++) {
                                        const childMesh = childMeshes[ii];
                                        this.probeList.push(childMesh);
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    const probeTag = "PROBE_" + this.probeid.toFixed(0);
                    this.probeList = this.scene.getMeshesByTags(probeTag);
                }
                if (this.probeList != null && this.probeList.length > 0) {
                    const abstractMesh = this.getAbstractMesh();
                    for (index = 0; index < this.probeList.length; index++) {
                        const probemesh = this.probeList[index];
                        const reflectionProbe = new BABYLON.ReflectionProbe(probemesh.name + ".Probe", this.resolution, this.scene);
                        reflectionProbe.refreshRate = (this.refreshMode === 0) ? BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE : BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYFRAME;
                        reflectionProbe.renderList.push(...this.renderList);
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
                            const mmat1 = probemesh.material.clone(probemesh.material.name + "." + probemesh.name);
                            for (let xx = 0; xx < mmat1.subMaterials.length; xx++) {
                                const smat1 = mmat1.subMaterials[xx];
                                const subMaterial = mmat1.subMaterials[xx].clone(mmat1.subMaterials[xx].name + "_" + probemesh.name);
                                subMaterial.unfreeze();
                                subMaterial.reflectionTexture = reflectionProbe.cubeTexture;
                                mmat1.subMaterials[xx] = subMaterial;
                            }
                            probemesh.material = mmat1;
                        }
                        else {
                            const meshMaterial = probemesh.material.clone(probemesh.material.name + "." + probemesh.name);
                            meshMaterial.unfreeze();
                            meshMaterial.reflectionTexture = reflectionProbe.cubeTexture;
                            probemesh.material = meshMaterial;
                        }
                    }
                }
            }
        }
        destroyRealtimReflections() {
            this.probeList = null;
            this.renderList = null;
        }
    }
    RealtimeReflection.SKYBOX_FLAG = 1;
    BABYLON.RealtimeReflection = RealtimeReflection;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon full rigidbody physics pro class (Native Bullet Physics 2.82)
     * @class RigidbodyPhysics - All rights reserved (c) 2020 Mackey Kinard
     */
    class RigidbodyPhysics extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this._abstractMesh = null;
            this._isKinematic = false;
            this._maxCollisions = 4;
            this._isPhysicsReady = false;
            this._collisionObject = null;
            this._centerOfMass = new BABYLON.Vector3(0, 0, 0);
            this._tmpLinearFactor = new BABYLON.Vector3(0, 0, 0);
            this._tmpAngularFactor = new BABYLON.Vector3(0, 0, 0);
            this._tmpCenterOfMass = new BABYLON.Vector3(0, 0, 0);
            this._tmpGravityVector = null;
            this._tmpCollisionContacts = null;
            /** Register handler that is triggered when the a collision contact has entered */
            this.onCollisionEnterObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact is active */
            this.onCollisionStayObservable = new BABYLON.Observable();
            /** Register handler that is triggered when the a collision contact has exited */
            this.onCollisionExitObservable = new BABYLON.Observable();
            this.m_physicsWorld = null;
            this.m_physicsEngine = null;
            this.m_raycastVehicle = null;
        }
        get isKinematic() { return this._isKinematic; }
        get centerOfMass() { return this._centerOfMass; }
        awake() { this.awakeRigidbodyState(); }
        update() { this.updateRigidbodyState(); }
        after() { this.afterRigidbodyState(); }
        destroy() { this.destroyRigidbodyState(); }
        /////////////////////////////////////////////////
        // Protected Rigidbody Physics State Functions //
        /////////////////////////////////////////////////
        awakeRigidbodyState() {
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
            const collisionGroup = (this._isKinematic === true) ? BABYLON.CollisionFilters.StaticFilter : BABYLON.CollisionFilters.DefaultFilter;
            const collisionMask = (this._isKinematic === true) ? BABYLON.CollisionFilters.AllFilter ^ BABYLON.CollisionFilters.StaticFilter : BABYLON.CollisionFilters.AllFilter;
            this.setCollisionFilterGroup(collisionGroup);
            this.setCollisionFilterMask(collisionMask);
            this.resetBodyCollisionContacts();
        }
        updateRigidbodyState() {
            this.syncronizeVehicleController();
        }
        afterRigidbodyState() {
            this.parseBodyCollisionContacts();
            this.resetBodyCollisionContacts();
        }
        destroyRigidbodyState() {
            this.m_physicsWorld = null;
            this.m_physicsEngine = null;
            if (this.m_raycastVehicle != null) {
                if (this.m_raycastVehicle.dispose) {
                    this.m_raycastVehicle.dispose();
                }
                this.m_raycastVehicle = null;
            }
            if (this._tmpGravityVector != null) {
                Ammo.destroy(this._tmpGravityVector); // ???
                this._tmpGravityVector = null;
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
        }
        //////////////////////////////////////////////////
        // Rigidbody Physics Life Cycle Event Functions //
        //////////////////////////////////////////////////
        syncronizeVehicleController() {
            if (this.m_raycastVehicle != null) {
                if (this.m_raycastVehicle.updateWheelInformation) {
                    this.m_raycastVehicle.updateWheelInformation();
                }
            }
        }
        parseBodyCollisionContacts() {
            if (this._isPhysicsReady === true) {
                const hasEnterObservers = this.onCollisionEnterObservable.hasObservers();
                const hasStayObservers = this.onCollisionStayObservable.hasObservers();
                const hasExitObservers = this.onCollisionExitObservable.hasObservers();
                if (hasEnterObservers || hasStayObservers || hasExitObservers) {
                    let index = 0; // Note: Flag All Collision List Items For End Contact State
                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                        this._tmpCollisionContacts[index].reset = true;
                    }
                    // ..
                    // Parse Overlapping Body Contact Objects
                    // ..
                    let collisionCount = 0;
                    if (this._abstractMesh.physicsImpostor.tmpCollisionObjects != null) {
                        const tmpCollisionObjectMap = this._abstractMesh.physicsImpostor.tmpCollisionObjects;
                        for (const contactKey in tmpCollisionObjectMap) {
                            let foundindex = -1;
                            const contactMesh = tmpCollisionObjectMap[contactKey];
                            for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                const check = this._tmpCollisionContacts[index];
                                if (check.mesh != null && check.mesh === contactMesh) {
                                    check.state = 1;
                                    check.reset = false;
                                    foundindex = index;
                                    break;
                                }
                            }
                            if (foundindex === -1) {
                                for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                    const insert = this._tmpCollisionContacts[index];
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
                        const info = this._tmpCollisionContacts[index];
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
        }
        resetBodyCollisionContacts() {
            if (this._isPhysicsReady === true) {
                const hasEnterObservers = this.onCollisionEnterObservable.hasObservers();
                const hasStayObservers = this.onCollisionStayObservable.hasObservers();
                const hasExitObservers = this.onCollisionExitObservable.hasObservers();
                if (hasEnterObservers || hasStayObservers || hasExitObservers) {
                    this._abstractMesh.physicsImpostor.tmpCollisionObjects = {};
                }
                else {
                    this._abstractMesh.physicsImpostor.tmpCollisionObjects = null;
                }
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Gravity Advanced Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Sets entity gravity value using physics impostor body. */
        setGravity(gravity) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setGravity) {
                if (gravity != null) {
                    if (this._tmpGravityVector == null)
                        this._tmpGravityVector = new Ammo.btVector3(0, 0, 0);
                    this._tmpGravityVector.setValue(gravity.x, gravity.y, gravity.z);
                    this._abstractMesh.physicsImpostor.physicsBody.setGravity(this._tmpGravityVector);
                }
            }
        }
        /** Gets entity gravity value using physics impostor body. */
        getGravity() {
            const result = new BABYLON.Vector3(0, 0, 0);
            this.getGravityToRef(result);
            return result;
        }
        /** Gets entity gravity value using physics impostor body. */
        getGravityToRef(result) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getGravity) {
                const gravity = this._abstractMesh.physicsImpostor.physicsBody.getGravity();
                BABYLON.Utilities.ConvertAmmoVector3ToRef(gravity, result);
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Impostor Helper Functions -  TODO - Use Native Physics API - ???
        ////////////////////////////////////////////////////////////////////////////////////
        /** Gets mass of entity using physics impostor. */
        getMass() {
            let result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.mass;
            }
            return result;
        }
        /** Sets mass to entity using physics impostor. */
        setMass(mass) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.mass !== mass) {
                    this._abstractMesh.physicsImpostor.mass = mass;
                }
            }
        }
        /** Gets entity friction level using physics impostor. */
        getFriction() {
            let result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.friction;
            }
            return result;
        }
        /** Applies friction to entity using physics impostor. */
        setFriction(friction) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.friction !== friction) {
                    this._abstractMesh.physicsImpostor.friction = friction;
                }
            }
        }
        /** Gets restitution of entity using physics impostor. */
        getRestitution() {
            let result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.restitution;
            }
            return result;
        }
        /** Sets restitution to entity using physics impostor. */
        setRestitution(restitution) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.restitution !== restitution) {
                    this._abstractMesh.physicsImpostor.restitution = restitution;
                }
            }
        }
        /** Gets entity linear velocity using physics impostor. */
        getLinearVelocity() {
            let result = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.getLinearVelocity();
            }
            return result;
        }
        /** Sets entity linear velocity using physics impostor. */
        setLinearVelocity(velocity) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (velocity != null)
                    this._abstractMesh.physicsImpostor.setLinearVelocity(velocity);
            }
        }
        /** Gets entity angular velocity using physics impostor. */
        getAngularVelocity() {
            let result = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.getAngularVelocity();
            }
            return result;
        }
        /** Sets entity angular velocity using physics impostor. */
        setAngularVelocity(velocity) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (velocity != null)
                    this._abstractMesh.physicsImpostor.setAngularVelocity(velocity);
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Transform Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Gets the native physics world transform object using physics impostor body. (Ammo.btTransform) */
        getWorldTransform() {
            let result = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.getWorldTransform) {
                    result = this._collisionObject.getWorldTransform();
                }
            }
            return result;
        }
        /** sets the native physics world transform object using physics impostor body. (Ammo.btTransform) */
        setWorldTransform(btTransform) {
            let result = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setWorldTransform) {
                    this._collisionObject.setWorldTransform(btTransform);
                }
                if (this._abstractMesh.physicsImpostor.mass === 0 && this._abstractMesh.physicsImpostor.physicsBody.getMotionState) {
                    const motionState = this._abstractMesh.physicsImpostor.physicsBody.getMotionState();
                    if (motionState != null && motionState.setWorldTransform) {
                        motionState.setWorldTransform(btTransform);
                    }
                }
            }
            return result;
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Applied Physics Movement Functions
        ////////////////////////////////////////////////////////////////////////////////////
        clearForces() {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.clearForces) {
                this._abstractMesh.physicsImpostor.physicsBody.clearForces();
            }
        }
        ////////////////////////////////////////////////// 
        // TODO - Use Function Specific Temp Ammo Buffer //
        ////////////////////////////////////////////////// 
        applyTorque(torque) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyTorque) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyTorque(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        applyLocalTorque(torque) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyLocalTorque) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyLocalTorque(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        applyImpulse(impulse, rel_pos) {
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
        }
        applyCentralImpulse(impulse) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralImpulse) {
                if (impulse != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(impulse.x, impulse.y, impulse.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralImpulse(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        applyTorqueImpulse(torque) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyTorqueImpulse) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyTorqueImpulse(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        applyForce(force, rel_pos) {
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
        }
        applyCentralForce(force) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralForce) {
                if (force != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(force.x, force.y, force.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralForce(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        applyCentralLocalForce(force) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralLocalForce) {
                if (force != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                        BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(force.x, force.y, force.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralLocalForce(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        /** gets rigidbody center of mass */
        getCenterOfMassTransform() {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getCenterOfMassTransform) {
                const bttransform = this._abstractMesh.physicsImpostor.physicsBody.getCenterOfMassTransform();
                const btposition = bttransform.getOrigin();
                this._tmpCenterOfMass.set(btposition.x(), btposition.y(), btposition.z());
            }
            return this._tmpCenterOfMass;
        }
        /** Sets rigidbody center of mass */
        setCenterOfMassTransform(center) {
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
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Native Body Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Gets entity linear factor using physics impostor body. */
        getLinearFactor() {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getLinearFactor) {
                const linearFactor = this._abstractMesh.physicsImpostor.physicsBody.getLinearFactor();
                this._tmpLinearFactor.set(linearFactor.x(), linearFactor.y(), linearFactor.z());
            }
            return this._tmpLinearFactor;
        }
        /** Sets entity linear factor using physics impostor body. */
        setLinearFactor(factor) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setLinearFactor) {
                if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                    BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(factor.x, factor.y, factor.z);
                this._abstractMesh.physicsImpostor.physicsBody.setLinearFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
            }
        }
        /** Gets entity angular factor using physics impostor body. */
        getAngularFactor() {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getAngularFactor) {
                const angularFactor = this._abstractMesh.physicsImpostor.physicsBody.getAngularFactor();
                this._tmpAngularFactor.set(angularFactor.x(), angularFactor.y(), angularFactor.z());
            }
            return this._tmpAngularFactor;
        }
        /** Sets entity angular factor using physics impostor body. */
        setAngularFactor(factor) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setAngularFactor) {
                if (BABYLON.RigidbodyPhysics.TempAmmoVector == null)
                    BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(factor.x, factor.y, factor.z);
                this._abstractMesh.physicsImpostor.physicsBody.setAngularFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
            }
        }
        /** Gets entity angular damping using physics impostor body. */
        getAngularDamping() {
            let result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getAngularDamping) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getAngularDamping();
            }
            return result;
        }
        /** Gets entity linear damping using physics impostor body. */
        getLinearDamping() {
            let result = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getLinearDamping) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getLinearDamping();
            }
            return result;
        }
        /** Sets entity drag damping using physics impostor body. */
        setDamping(linear, angular) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setDamping) {
                this._abstractMesh.physicsImpostor.physicsBody.setDamping(linear, angular);
            }
        }
        /** Sets entity sleeping threshold using physics impostor body. */
        setSleepingThresholds(linear, angular) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setSleepingThresholds) {
                this._abstractMesh.physicsImpostor.physicsBody.setSleepingThresholds(linear, angular);
            }
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Native Advanced Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        /** Checks if rigidbody has wheel collider metadata for the entity. Note: Wheel collider metadata informaion is required for vehicle control. */
        hasWheelColliders() {
            return (this._isPhysicsReady === true && this._abstractMesh.metadata != null && this._abstractMesh.metadata.unity != null && this._abstractMesh.metadata.unity.wheels != null);
        }
        /** Sets the maximum number of simultaneous contact notfications to dispatch per frame. Defaults value is 4. (Advanved Use Only) */
        setMaxNotifications(max) {
            this._maxCollisions = max;
            this._tmpCollisionContacts = [];
            for (let index = 0; index < this._maxCollisions; index++) {
                this._tmpCollisionContacts.push(new CollisionContactInfo());
            }
        }
        /** Sets entity collision activation state using physics impostor body. (Advanved Use Only) */
        setActivationState(state) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setActivationState) {
                    this._collisionObject.setActivationState(state);
                }
            }
        }
        /** Gets entity collision filter group using physics impostor body. (Advanved Use Only) */
        getCollisionFilterGroup() {
            let result = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().get_m_collisionFilterGroup();
            }
            return result;
        }
        /** Sets entity collision filter group using physics impostor body. (Advanved Use Only) */
        setCollisionFilterGroup(group) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().set_m_collisionFilterGroup(group);
            }
        }
        /** Gets entity collision filter mask using physics impostor body. (Advanved Use Only) */
        getCollisionFilterMask() {
            let result = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().get_m_collisionFilterMask();
            }
            return result;
        }
        /** Sets entity collision filter mask using physics impostor body. (Advanved Use Only) */
        setCollisionFilterMask(mask) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().set_m_collisionFilterMask(mask);
            }
        }
        /** Gets the entity collision shape type using physics impostor body. (Advanved Use Only) */
        getCollisionShapeType() {
            let result = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    const collisionShape = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.getShapeType) {
                        result = collisionShape.getShapeType();
                    }
                }
            }
            return result;
        }
        /** Gets the entity collision shape margin using physics impostor body. (Advanved Use Only) */
        getCollisionShapeMargin() {
            let result = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    const collisionShape = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.getMargin) {
                        result = collisionShape.getMargin();
                    }
                }
            }
            return result;
        }
        /** Sets entity collision shape margin using physics impostor body. (Advanved Use Only) */
        setCollisionShapeMargin(margin) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    const collisionShape = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.setMargin) {
                        collisionShape.setMargin(margin);
                    }
                }
            }
        }
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
        setContactProcessingThreshold(threshold) {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null)
                    this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setContactProcessingThreshold) {
                    this._collisionObject.setContactProcessingThreshold(threshold);
                }
            }
        }
        // ************************************ //
        // * Physics Physics Helper Functions * //
        // ************************************ //
        /** TODO */
        static CreatePhysicsMetadata(mass, drag = 0.0, angularDrag = 0.05, centerMass = null) {
            const center = (centerMass != null) ? centerMass : new BABYLON.Vector3(0, 0, 0);
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
        }
        /** TODO */
        static CreateCollisionMetadata(type, trigger = false, convexmesh = false, restitution = 0.0, dynamicfriction = 0.6, staticfriction = 0.6) {
            return {
                "type": type,
                "trigger": trigger,
                "convexmesh": convexmesh,
                "restitution": restitution,
                "dynamicfriction": dynamicfriction,
                "staticfriction": staticfriction,
                "wheelinformation": null
            };
        }
        /** TODO */
        static CreatePhysicsProperties(mass, drag = 0.0, angularDrag = 0.05, useGravity = true, isKinematic = false) {
            return {
                "mass": mass,
                "drag": drag,
                "angularDrag": angularDrag,
                "useGravity": useGravity,
                "isKinematic": isKinematic
            };
        }
        /** TODO */
        static SetupPhysicsComponent(scene, entity) {
            // console.warn(">>> TRACE - Setup Physics For: " + entity.name);
            // console.log(entity);
            const metadata = (entity.metadata != null && entity.metadata.unity != null) ? entity.metadata.unity : null;
            if (metadata != null && (metadata.physics != null || metadata.collision != null)) {
                // Physics Metadata
                const hasphysics = (metadata.physics != null);
                const isroot = (metadata.physics != null && metadata.physics.root != null) ? metadata.physics.root : false;
                const mass = (metadata.physics != null && metadata.physics.mass != null) ? metadata.physics.mass : 0;
                const isstatic = (mass === 0);
                // Collision Metadata
                const hascollision = (metadata.collision != null);
                const collider = (metadata.collision != null && metadata.collision.type != null) ? metadata.collision.type : "BoxCollider";
                const convexmesh = (metadata.collision != null && metadata.collision.convexmesh != null) ? metadata.collision.convexmesh : false;
                const dynamicfriction = (metadata.collision != null && metadata.collision.dynamicfriction != null) ? metadata.collision.dynamicfriction : 0.6;
                const staticfriction = (metadata.collision != null && metadata.collision.staticfriction != null) ? metadata.collision.staticfriction : 0.6;
                const restitution = (metadata.collision != null && metadata.collision.restitution != null) ? metadata.collision.restitution : 0;
                const istrigger = (metadata.collision != null && metadata.collision.trigger != null) ? metadata.collision.trigger : false;
                let impostortype = BABYLON.PhysicsImpostor.BoxImpostor;
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
                // Create Physics Impostor Node
                if (hasphysics === true) {
                    if (isroot) {
                        let fwheels = null;
                        let fdynamicfriction = 0;
                        let fstaticfriction = 0;
                        let frestitution = 0;
                        let ftrigger = false;
                        let fcount = 0;
                        // Note: Bullet Physics Center Mass Must Offset Meshes (No Working Set Center Mass Property Support)
                        const center = (metadata.physics != null && metadata.physics.center != null) ? BABYLON.Utilities.ParseVector3(metadata.physics.center, BABYLON.Vector3.Zero()) : BABYLON.Vector3.Zero();
                        let centernodes = entity.getChildren(null, true);
                        if (centernodes != null && centernodes.length > 0) {
                            centernodes.forEach((centernode) => { centernode.position.subtractInPlace(center); });
                        }
                        let childnodes = entity.getChildren(null, false);
                        if (childnodes != null && childnodes.length > 0) {
                            childnodes.forEach((childnode) => {
                                if (childnode.metadata != null && childnode.metadata.unity != null) {
                                    if (childnode.metadata.unity.collision != null) {
                                        const ccollision = childnode.metadata.unity.collision;
                                        const cwheelinformation = (ccollision.wheelinformation != null) ? ccollision.wheelinformation : null;
                                        if (cwheelinformation != null) {
                                            // Trace Wheel Collider
                                            // BABYLON.Tools.Warn("Push raycast wheel collider: " + childnode.name + " --> on to: " + entity.name);
                                            if (fwheels == null)
                                                fwheels = [];
                                            fwheels.push(cwheelinformation);
                                        }
                                        else {
                                            const cdynamicfriction = (ccollision.dynamicfriction != null) ? ccollision.dynamicfriction : 0.6;
                                            const cstaticfriction = (ccollision.staticfriction != null) ? ccollision.staticfriction : 0.6;
                                            const crestitution = (ccollision.restitution != null) ? ccollision.restitution : 0;
                                            const cistrigger = (ccollision.trigger != null) ? ccollision.trigger : false;
                                            const ccollider = (ccollision.type != null) ? ccollision.type : "BoxCollider";
                                            let cimpostortype = BABYLON.PhysicsImpostor.BoxImpostor;
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
                                            if (cdynamicfriction > fdynamicfriction)
                                                fdynamicfriction = cdynamicfriction;
                                            if (cstaticfriction > fstaticfriction)
                                                fstaticfriction = cstaticfriction;
                                            if (crestitution > frestitution)
                                                frestitution = crestitution;
                                            if (cistrigger == true)
                                                ftrigger = true;
                                            // Trace Compound Collider
                                            // BABYLON.Tools.Warn("Setup " + BABYLON.SceneManager.GetPhysicsImposterType(cimpostortype).toLowerCase() + " compound imposter for: " + childnode.name);
                                            BABYLON.SceneManager.CreatePhysicsImpostor(scene, childnode, cimpostortype, { mass: 0, friction: 0, restitution: 0 });
                                            BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, childnode, true, false, metadata.physics);
                                            fcount++;
                                        }
                                    }
                                }
                            });
                        }
                        if (fcount > 0) {
                            // Trace Physics Root
                            // BABYLON.Tools.Warn(">>> Created physics root no imposter for: " + entity.name);
                            BABYLON.SceneManager.CreatePhysicsImpostor(scene, entity, BABYLON.PhysicsImpostor.NoImpostor, { mass: mass, friction: fdynamicfriction, restitution: frestitution });
                            BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, entity, false, ftrigger, metadata.physics);
                        }
                        if (fwheels != null && fwheels.length > 0) {
                            if (entity.metadata == null)
                                entity.metadata = {};
                            if (entity.metadata.unity == null)
                                entity.metadata.unity = {};
                            entity.metadata.unity.wheels = fwheels;
                        }
                        childnodes = null;
                    }
                    else {
                        if (hascollision === true) {
                            // Trace Physics Impostor
                            // BABYLON.Tools.Warn("Setup " + BABYLON.SceneManager.GetPhysicsImposterType(impostortype).toLowerCase() + " physics impostor for: " + entity.name);
                            BABYLON.SceneManager.CreatePhysicsImpostor(scene, entity, impostortype, { mass: mass, friction: (isstatic) ? staticfriction : dynamicfriction, restitution: restitution });
                            BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, entity, false, istrigger, metadata.physics);
                        }
                    }
                }
            }
        }
        static ConfigRigidbodyPhysics(scene, entity, child, trigger, physics) {
            if (entity == null)
                return;
            if (entity.physicsImpostor != null) {
                entity.physicsImpostor.executeNativeFunction((word, body) => {
                    if (body.activate)
                        body.activate();
                    const colobj = Ammo.castObject(body, Ammo.btCollisionObject);
                    colobj.entity = entity;
                    // ..
                    // Setup Edge Contact (DEPRECIATED: KEEP FOR REFERENCE)
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
                    const gravity = (physics != null && physics.gravity != null) ? physics.gravity : true;
                    if (gravity === false) {
                        if (body.setGravity) {
                            body.setGravity(new Ammo.btVector3(0, 0, 0));
                        }
                        else {
                            BABYLON.Tools.Warn("Physics engine set gravity override not supported for: " + entity.name);
                        }
                    }
                    // ..
                    // Setup Drag Damping
                    // ..
                    if (body.setDamping) {
                        const ldrag = (physics != null && physics.ldrag != null) ? physics.ldrag : 0;
                        const adrag = (physics != null && physics.adrag != null) ? physics.adrag : 0.05;
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
                    const freeze = (physics != null && physics.freeze != null) ? physics.freeze : null;
                    if (freeze != null) {
                        if (body.setLinearFactor) {
                            const freeze_pos_x = (freeze.positionx != null && freeze.positionx === true) ? 0 : 1;
                            const freeze_pos_y = (freeze.positiony != null && freeze.positiony === true) ? 0 : 1;
                            const freeze_pos_z = (freeze.positionz != null && freeze.positionz === true) ? 0 : 1;
                            body.setLinearFactor(new Ammo.btVector3(freeze_pos_x, freeze_pos_y, freeze_pos_z));
                        }
                        else {
                            BABYLON.Tools.Warn("Physics engine set linear factor not supported for: " + entity.name);
                        }
                        if (body.setAngularFactor) {
                            const freeze_rot_x = (freeze.rotationx != null && freeze.rotationx === true) ? 0 : 1;
                            const freeze_rot_y = (freeze.rotationy != null && freeze.rotationy === true) ? 0 : 1;
                            const freeze_rot_z = (freeze.rotationz != null && freeze.rotationz === true) ? 0 : 1;
                            body.setAngularFactor(new Ammo.btVector3(freeze_rot_x, freeze_rot_y, freeze_rot_z));
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
        }
    }
    RigidbodyPhysics.TempAmmoVector = null;
    RigidbodyPhysics.TempAmmoVectorAux = null;
    RigidbodyPhysics.TempCenterTransform = null;
    BABYLON.RigidbodyPhysics = RigidbodyPhysics;
    /**
     * Babylon collision contact info pro class (Native Bullet Physics 2.82)
     * @class CollisionContactInfo - All rights reserved (c) 2020 Mackey Kinard
     */
    class CollisionContactInfo {
        constructor() {
            this.mesh = null;
            this.state = 0;
            this.reset = false;
        }
    }
    BABYLON.CollisionContactInfo = CollisionContactInfo;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon shuriken particle system pro class (Unity Style Shuriken Particle System)
     * @class ShurikenParticles - All rights reserved (c) 2020 Mackey Kinard
     */
    class ShurikenParticles extends BABYLON.ScriptComponent {
        awake() { }
        start() { }
        update() { }
        late() { }
        after() { }
        destroy() { }
    }
    BABYLON.ShurikenParticles = ShurikenParticles;
})(BABYLON || (BABYLON = {}));
var BABYLON;
(function (BABYLON) {
    /**
     * Babylon web video player pro class (Unity Style Shuriken Particle System)
     * @class WebVideoPlayer - All rights reserved (c) 2020 Mackey Kinard
     */
    class WebVideoPlayer extends BABYLON.ScriptComponent {
        constructor() {
            super(...arguments);
            this.videoLoop = false;
            this.videoMuted = false;
            this.videoAlpha = false;
            this.videoFaded = false;
            this.videoPoster = null;
            this.videoInvert = true;
            this.videoSample = 3;
            this.videoVolume = 1.0;
            this.videoMipmaps = false;
            this.videoPlayback = 1.0;
            this.videoPlayOnAwake = true;
            this.videoPreloaderUrl = null;
            this.videoBlobUrl = null;
            this.videoPreload = false;
            this._initializedReadyInstance = false;
            /** Register handler that is triggered when the audio clip is ready */
            this.onReadyObservable = new BABYLON.Observable();
            this.m_abstractMesh = null;
            this.m_videoTexture = null;
            this.m_videoMaterial = null;
            this.m_diffuseIntensity = 1.0;
        }
        getVideoMaterial() { return this.m_videoMaterial; }
        getVideoTexture() { return this.m_videoTexture; }
        getVideoElement() { return (this.m_videoTexture != null) ? this.m_videoTexture.video : null; }
        getVideoScreen() { return this.m_abstractMesh; }
        getVideoBlobUrl() { return this.videoBlobUrl; }
        awake() { this.awakeWebVideoPlayer(); }
        destroy() { this.destroyWebVideoPlayer(); }
        awakeWebVideoPlayer() {
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
            const setPoster = this.getProperty("poster");
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
            const videoUrl = this.getProperty("url", null);
            const videoSrc = this.getProperty("source", null);
            let playUrl = videoUrl;
            if (videoSrc != null && videoSrc.filename != null && videoSrc.filename !== "") {
                const rootUrl = BABYLON.SceneManager.GetRootUrl(this.scene);
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
        }
        destroyWebVideoPlayer() {
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
        }
        /**
         * Gets the video ready status
         */
        isReady() {
            return (this.getVideoElement() != null);
        }
        /**
         * Gets the video playing status
         */
        isPlaying() {
            let result = false;
            const video = this.getVideoElement();
            if (video != null) {
                result = (video.paused === false);
            }
            return result;
        }
        /**
         * Gets the video paused status
         */
        isPaused() {
            let result = false;
            const video = this.getVideoElement();
            if (video != null) {
                result = (video.paused === true);
            }
            return result;
        }
        /**
         * Play the video track
         */
        play() {
            if (BABYLON.SceneManager.HasAudioContext()) {
                this.internalPlay();
            }
            else {
                BABYLON.Engine.audioEngine.onAudioUnlockedObservable.addOnce(() => { this.internalPlay(); });
            }
            return true;
        }
        internalPlay() {
            if (this._initializedReadyInstance === true) {
                this.checkedPlay();
            }
            else {
                this.onReadyObservable.addOnce(() => { this.checkedPlay(); });
            }
        }
        checkedPlay() {
            const video = this.getVideoElement();
            if (video != null) {
                video.play().then(() => {
                    if (video.paused === true) {
                        this.checkedRePlay();
                    }
                });
            }
        }
        checkedRePlay() {
            const video = this.getVideoElement();
            if (video != null) {
                video.play().then(() => { });
            }
        }
        /**
         * Pause the video track
         */
        pause() {
            let result = false;
            const video = this.getVideoElement();
            if (video != null) {
                video.pause();
                result = true;
            }
            return result;
        }
        /**
         * Mute the video track
         */
        mute() {
            let result = false;
            const video = this.getVideoElement();
            if (video != null) {
                video.muted = true;
                result = true;
            }
            return result;
        }
        /**
         * Unmute the video track
         */
        unmute() {
            let result = false;
            const video = this.getVideoElement();
            if (video != null) {
                video.muted = false;
                result = true;
            }
            return result;
        }
        /**
         * Gets the video volume
         */
        getVolume() {
            let result = 0;
            const video = this.getVideoElement();
            if (video != null) {
                result = video.volume;
            }
            return result;
        }
        /**
         * Sets the video volume
         * @param volume Define the new volume of the sound
         */
        setVolume(volume) {
            let result = false;
            const video = this.getVideoElement();
            if (video != null) {
                video.volume = volume;
                result = true;
            }
            return result;
        }
        /** Set video data source */
        setDataSource(source) {
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
                            this.m_videoTexture.video.addEventListener("loadeddata", () => {
                                this._initializedReadyInstance = true;
                                if (this.onReadyObservable.hasObservers() === true) {
                                    this.onReadyObservable.notifyObservers(this.m_videoTexture);
                                }
                                if (this.videoPlayOnAwake === true) {
                                    this.play();
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
        }
        /** Revokes the current video blob url and releases resouces */
        revokeVideoBlobUrl() {
            if (this.videoBlobUrl != null) {
                URL.revokeObjectURL(this.videoBlobUrl);
                this.videoBlobUrl = null;
            }
        }
        /** Add video preloader asset tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        addPreloaderTasks(assetsManager) {
            if (this.videoPreload === true) {
                const assetTask = assetsManager.addBinaryFileTask((this.transform.name + ".VideoTask"), this.videoPreloaderUrl);
                assetTask.onSuccess = (task) => {
                    this.revokeVideoBlobUrl();
                    this.videoBlobUrl = URL.createObjectURL(new Blob([task.data]));
                    this.setDataSource(this.videoBlobUrl);
                };
                assetTask.onError = (task, message, exception) => { console.error(message, exception); };
            }
        }
    }
    BABYLON.WebVideoPlayer = WebVideoPlayer;
})(BABYLON || (BABYLON = {}));


// Project Shader Fixes
if (BABYLON.Effect.IncludesShadersStore["pbrBlockFinalColorComposition"]) BABYLON.Effect.IncludesShadersStore["pbrBlockFinalColorComposition"] = BABYLON.Effect.IncludesShadersStore["pbrBlockFinalColorComposition"].replace("finalColor.rgb*=lightmapColor.rgb", "finalColor.rgb*=(lightmapColor.rgb+finalEmissive.rgb)");
if (BABYLON.Effect.ShadersStore["defaultPixelShader"]) BABYLON.Effect.ShadersStore["defaultPixelShader"] = BABYLON.Effect.ShadersStore["defaultPixelShader"].replace("color.rgb *= lightmapColor.rgb", "color.rgb *= (lightmapColor.rgb + finalEmissive.rgb)");
