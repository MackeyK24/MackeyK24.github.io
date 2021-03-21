declare module PROJECT {
    /**
     * Babylon universal camera rig system pro class
     * @class UniversalCameraSystem - All rights reserved (c) 2020 Mackey Kinard
     * https://doc.babylonjs.com/divingDeeper/postProcesses/defaultRenderingPipeline
     */
    class UniversalCameraSystem extends BABYLON.ScriptComponent {
        protected static PlayerOneCamera: BABYLON.UniversalCamera;
        protected static PlayerTwoCamera: BABYLON.UniversalCamera;
        protected static PlayerThreeCamera: BABYLON.UniversalCamera;
        protected static PlayerFourCamera: BABYLON.UniversalCamera;
        protected static XRExperienceHelper: BABYLON.WebXRDefaultExperience;
        private static multiPlayerView;
        private static multiPlayerCount;
        private static multiPlayerCameras;
        private static stereoCameras;
        private static startupMode;
        private static cameraReady;
        private static renderingPipeline;
        static GetRenderingPipeline(): BABYLON.DefaultRenderingPipeline;
        static IsCameraSystemReady(): boolean;
        private mainCamera;
        private cameraType;
        private cameraInertia;
        private cameraController;
        private virtualReality;
        private arcRotateConfig;
        private multiPlayerSetup;
        private editorPostProcessing;
        isMainCamera(): boolean;
        getCameraType(): number;
        protected m_cameraRig: BABYLON.TargetCamera;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        protected awakeCameraSystemState(): void;
        protected startCameraSystemState(): Promise<void>;
        protected updateCameraSystemState(): void;
        protected destroyCameraSystemState(): void;
        /** Get the WebXR default experience helper */
        static GetWebXR(): BABYLON.WebXRDefaultExperience;
        /** Get universal camera rig for desired player */
        static GetPlayerCamera(scene: BABYLON.Scene, player?: BABYLON.PlayerNumber, detach?: boolean): BABYLON.UniversalCamera;
        /** Get camera transform node for desired player */
        static GetCameraTransform(scene: BABYLON.Scene, player?: BABYLON.PlayerNumber): BABYLON.TransformNode;
        /** Are stereo side side camera services available. */
        static IsStereoCameras(): boolean;
        /** Are local multi player view services available. */
        static IsMultiPlayerView(): boolean;
        /** Get the current local multi player count */
        static GetMultiPlayerCount(): number;
        /** Activates current local multi player cameras. */
        static ActivateMultiPlayerCameras(scene: BABYLON.Scene): boolean;
        /** Disposes current local multiplayer cameras */
        static DisposeMultiPlayerCameras(): void;
        /** Sets the multi player camera view layout */
        static SetMultiPlayerViewLayout(scene: BABYLON.Scene, totalNumPlayers: number): boolean;
    }
    /*********************************************/
    /** Camera Editor Properties Support Classes */
    /*********************************************/
    interface IEditorArcRtotate {
        alpha: number;
        beta: number;
        radius: number;
        target: BABYLON.IUnityVector3;
    }
    interface IEditorPostProcessing {
        usePostProcessing: boolean;
        highDynamicRange: boolean;
        screenAntiAliasing: PROJECT.IEditorAntiAliasing;
        focalDepthOfField: PROJECT.IEditorDepthOfField;
        chromaticAberration: PROJECT.IEditorChromaticAberration;
        glowLayerProperties: PROJECT.IEditorGlowLayer;
        grainEffectProperties: PROJECT.IEditorGrainEffect;
        sharpEffectProperties: PROJECT.IEditorSharpenEffect;
        bloomEffectProperties: PROJECT.IEditorBloomProcessing;
        imageProcessingConfig: PROJECT.IEditorImageProcessing;
    }
    interface IEditorAntiAliasing {
        msaaSamples: number;
        fxaaEnabled: boolean;
        fxaaScaling: boolean;
        fxaaSamples: number;
    }
    interface IEditorDepthOfField {
        depthOfField: boolean;
        blurLevel: number;
        focalStop: number;
        focalLength: number;
        focusDistance: number;
        maxLensSize: number;
    }
    interface IEditorChromaticAberration {
        aberrationEnabled: boolean;
        aberrationAmount: number;
        adaptScaleViewport: boolean;
        alphaMode: number;
        alwaysForcePOT: boolean;
        pixelPerfectMode: boolean;
        fullscreenViewport: boolean;
    }
    interface IEditorGlowLayer {
        glowEnabled: boolean;
        glowIntensity: number;
        blurKernelSize: number;
    }
    interface IEditorGrainEffect {
        grainEnabled: boolean;
        grainAnimated: boolean;
        grainIntensity: number;
        adaptScaleViewport: boolean;
    }
    interface IEditorSharpenEffect {
        sharpenEnabled: boolean;
        sharpEdgeAmount: number;
        sharpColorAmount: number;
        adaptScaleViewport: boolean;
    }
    interface IEditorBloomProcessing {
        bloomEnabled: boolean;
        bloomKernel: number;
        bloomScale: number;
        bloomWeight: number;
        bloomThreshold: number;
    }
    interface IEditorColorCurves {
        curvesEnabled: boolean;
        globalDen: number;
        globalExp: number;
        globalHue: number;
        globalSat: number;
        highlightsDen: number;
        highlightsExp: number;
        highlightsHue: number;
        highlightsSat: number;
        midtonesDen: number;
        midtonesExp: number;
        midtonesHue: number;
        midtonesSat: number;
        shadowsDen: number;
        shadowsExp: number;
        shadowsHue: number;
        shadowsSat: number;
    }
    interface IEditorImageProcessing {
        imageProcessing: boolean;
        imageContrast: number;
        imageExposure: number;
        vignetteEnabled: boolean;
        vignetteBlendMode: number;
        vignetteCameraFov: number;
        vignetteStretch: number;
        vignetteCentreX: number;
        vignetteCentreY: number;
        vignetteWeight: number;
        vignetteColor: BABYLON.IUnityColor;
        useColorGrading: boolean;
        setGradingTexture: any;
        imagingColorCurves: PROJECT.IEditorColorCurves;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class UserInterface
    */
    class UserInterface extends BABYLON.ScriptComponent {
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected late(): void;
        protected after(): void;
        protected fixed(): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class LightProjection
    */
    class LightProjection extends BABYLON.ScriptComponent {
        private static ShaderFragmentUpdated;
        private projectionTexture;
        private spotLightExponent;
        private spotLightAngle;
        private nearClipPlane;
        private farClipPlane;
        private excludeChildren;
        private includeTags;
        enableRotation: boolean;
        projectionRotation: number;
        projectionPosition: BABYLON.Vector3;
        getLightProjector(): BABYLON.SpotLight;
        protected m_spotLight: BABYLON.SpotLight;
        protected m_projectorDirty: boolean;
        protected m_projectorPosition: BABYLON.Vector3;
        protected m_projectorRotation: BABYLON.Vector3;
        protected m_lastPosition: BABYLON.Vector3;
        protected m_lastRotation: BABYLON.Vector3;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        private updateProjectorPosition;
    }
}
declare module BABYLON {
    /**
     * Babylon photon client controller class (Photon Engine)
     * @class PhotonController - All rights reserved (c) 2020 Mackey Kinard
     */
    class PhotonController {
        /** Connects a window state photon client to a name server (Photon Cloud Services) */
        static ConnectToNameServer(options?: {
            region?: string;
            lobbyName?: string;
            lobbyType?: number;
            lobbyStats?: boolean;
            keepMasterConnection?: boolean;
        }, address?: string, handler?: (state: number) => void): Photon.LoadBalancing.LoadBalancingClient;
        /** Connects a window state photon client to a region server (Photon Cloud Services) */
        static ConnectToRegionServer(region: string, address?: string, handler?: (state: number) => void): Photon.LoadBalancing.LoadBalancingClient;
        /** Connects a window state photon client to a master server (Private Windows Server) */
        static ConnectToMasterServer(server: string, options?: {
            keepMasterConnection?: boolean;
            lobbyName?: string;
            lobbyType?: number;
            lobbyStats?: boolean;
            userAuthSecret?: string;
            region?: string;
        }, handler?: (state: number) => void): Photon.LoadBalancing.LoadBalancingClient;
        /** Get the window state photon client */
        static GetPhotonClient(): Photon.LoadBalancing.LoadBalancingClient;
    }
}
declare module BABYLON {
    /**
     * Babylon window socket controller class (Socket.IO)
     * @class SocketController - All rights reserved (c) 2020 Mackey Kinard
     */
    class SocketController {
        /** Registers an handler for window socket connect event */
        static RegisterOnSocketConnect(func: () => void): void;
        /** Registers an handler for window socket disconnect event */
        static RegisterOnSocketDisconnect(func: () => void): void;
        /** Connects a window state socket */
        static ConnectWindowSocket(connection: string): SocketIOClient.Socket;
        /** Get the window state socket */
        static GetWindowSocket(): SocketIOClient.Socket;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class UniversalPlayerController
    */
    class UniversalPlayerController extends BABYLON.ScriptComponent {
        enableInput: boolean;
        attachCamera: boolean;
        rotateCamera: boolean;
        moveCharacter: boolean;
        toggleView: boolean;
        freeLooking: boolean;
        rootMotion: boolean;
        gravityForce: number;
        slopeForce: number;
        rayLength: number;
        rayOrigin: number;
        maxAngle: number;
        speedFactor: number;
        moveSpeed: number;
        lookSpeed: number;
        jumpSpeed: number;
        jumpDelay: number;
        eyesHeight: number;
        pivotHeight: number;
        topLookLimit: number;
        downLookLimit: number;
        lowTurnSpeed: number;
        highTurnSpeed: number;
        takeoffPower: number;
        stoppingPower: number;
        acceleration: boolean;
        avatarSkinTag: string;
        distanceFactor: number;
        cameraSmoothing: number;
        cameraCollisions: boolean;
        inputMagnitude: number;
        minimumDistance: number;
        buttonJump: number;
        keyboardJump: number;
        buttonCamera: number;
        keyboardCamera: number;
        playerNumber: BABYLON.PlayerNumber;
        boomPosition: BABYLON.Vector3;
        movementVelocity: BABYLON.Vector3;
        getPlayerInputX(): number;
        getPlayerInputZ(): number;
        getPlayerMouseX(): number;
        getPlayerMouseY(): number;
        getPlayerJumping(): boolean;
        getPlayerGrounded(): boolean;
        getGroundedMesh(): BABYLON.AbstractMesh;
        getGroundedPoint(): BABYLON.Vector3;
        getGroundedAngle(): number;
        getGroundedNormal(): BABYLON.Vector3;
        getCameraBoomNode(): BABYLON.TransformNode;
        getCameraTransform(): BABYLON.TransformNode;
        getAnimationState(): BABYLON.AnimationState;
        getCharacterController(): BABYLON.CharacterController;
        private abstractMesh;
        private cameraDistance;
        private forwardCamera;
        private dollyDirection;
        private rotationEulers;
        private cameraPivotOffset;
        private cameraForwardVector;
        private cameraRightVector;
        private desiredForwardVector;
        private desiredRightVector;
        private scaledCamDirection;
        private scaledMaxDirection;
        private parentNodePosition;
        private maximumCameraPos;
        private raycastShape;
        private raycastGroup;
        private raycastMask;
        private avatarSkins;
        private cameraNode;
        private cameraPivot;
        private navigationAgent;
        private characterController;
        private isCharacterNavigating;
        private isCharacterGrounded;
        private isCharacterJumpFrame;
        private isCharacterJumpState;
        private navigationAngularSpeed;
        private animationStateMachine;
        private animationStateParams;
        private showDebugColliders;
        private colliderVisibility;
        private deltaTime;
        private jumpTimer;
        private playerControl;
        private playerInputX;
        private playerInputZ;
        private playerMouseX;
        private playerMouseY;
        private groundedMesh;
        private groundedPoint;
        private groundedAngle;
        private groundedNormal;
        private verticalVelocity;
        private rootmotionSpeed;
        private smoothDeltaTime;
        private animationState;
        private inputMovementVector;
        private playerLookRotation;
        private playerRotationVector;
        private playerMovementVelocity;
        private playerRotationQuaternion;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected late(): void;
        protected after(): void;
        protected destroy(): void;
        /** Register handler that is triggered before the controller has been updated */
        onPreUpdateObservable: BABYLON.Observable<BABYLON.TransformNode>;
        /** Register handler that is triggered before the controller movement has been applied */
        onBeforeMoveObservable: BABYLON.Observable<BABYLON.TransformNode>;
        /** Register handler that is triggered after the controller has been updated */
        onPostUpdateObservable: BABYLON.Observable<BABYLON.TransformNode>;
        /** TODO */
        setPlayerControl(mode: PROJECT.PlayerInputControl): void;
        /** TODO */
        togglePlayerControl(): void;
        private showAvatarSkins;
        /** TODO */
        attachPlayerCamera(player: BABYLON.PlayerNumber): void;
        private attachAnimationController;
        /** TODO */
        resetPlayerRotation(): void;
        private awakePlayerController;
        private startPlayerController;
        private updatePlayerController;
        private updateCharacterController;
        private updateCheckCollisions;
        private pickingRay;
        private pickingHelper;
        private pickingOrigin;
        private pickingDirection;
        private pickCheckCollisionsRaycast;
        private cameraRay;
        private cameraHelper;
        private cameraForward;
        private cameraDirection;
        private pickCameraCollisionsRaycast;
        private latePlayerController;
        private afterPlayerController;
        private destroyPlayerController;
        private validateAnimationStateParams;
    }
    /**
    * Babylon Interface Definition
    * @interface AnimationStateParams
    */
    interface AnimationStateParams {
        horizontalInput: string;
        verticalInput: string;
        mouseXInput: string;
        mouseYInput: string;
        speedInput: string;
        jumpedInput: string;
        jumpingInput: string;
        groundedInput: string;
    }
    /**
    * Babylon Enum Definition
    * @interface PlayerInputControl
    */
    enum PlayerInputControl {
        FirstPersonStrafing = 0,
        ThirdPersonStrafing = 1,
        ThirdPersonForward = 2
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class FxParticleSystem
    */
    class FxParticleSystem extends BABYLON.ScriptComponent {
        getParticleEmitter(): BABYLON.AbstractMesh;
        getParticleSystem(): BABYLON.ParticleSystem | BABYLON.GPUParticleSystem;
        protected m_particleEmitter: BABYLON.AbstractMesh;
        protected m_particleSystem: BABYLON.ParticleSystem | BABYLON.GPUParticleSystem;
        protected awake(): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
     * Babylon water material system pro class (Babylon Water Material)
     * @class SkyMaterialSystem - All rights reserved (c) 2020 Mackey Kinard
     */
    class SkyMaterialSystem extends BABYLON.ScriptComponent {
        private skyfog;
        private skysize;
        private probesize;
        private reflections;
        private reflectlevel;
        private skytintcolor;
        getSkyboxMesh(): BABYLON.AbstractMesh;
        getSkyMaterial(): BABYLON.SkyMaterial;
        getReflectionProbe(): BABYLON.ReflectionProbe;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected late(): void;
        protected after(): void;
        protected destroy(): void;
        protected m_skyboxMesh: BABYLON.Mesh;
        protected m_skyMaterial: BABYLON.SkyMaterial;
        protected m_reflectProbe: BABYLON.ReflectionProbe;
        protected awakeSkyboxMaterial(): void;
        protected destroySkyboxMaterial(): void;
        /** Set Skybox Mesh tint color. (Box Mesh Vertex Colors) */
        setSkyboxTintColor(color: BABYLON.Color3): void;
    }
}
declare module PROJECT {
    /**
     * Babylon water material system pro class (Babylon Water Material)
     * @class WaterMaterialSystem - All rights reserved (c) 2020 Mackey Kinard
     */
    class WaterMaterialSystem extends BABYLON.ScriptComponent {
        private waterTag;
        private targetSize;
        private renderSize;
        private depthFactor;
        private reflectSkybox;
        private subDivisions;
        private heightOffset;
        private windDirection;
        private windForce;
        private waveSpeed;
        private waveLength;
        private waveHeight;
        private bumpHeight;
        private bumpSuperimpose;
        private bumpAffectsReflection;
        private waterColor;
        private colorBlendFactor;
        private waterColor2;
        private colorBlendFactor2;
        private disableClipPlane;
        private fresnelSeparate;
        getWaterGeometry(): BABYLON.AbstractMesh;
        getWaterMaterial(): BABYLON.WaterMaterial;
        protected m_waterGeometry: BABYLON.AbstractMesh;
        protected m_waterMaterial: BABYLON.WaterMaterial;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected late(): void;
        protected after(): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class SimpleFollowCamera
    */
    class SimpleFollowCamera extends BABYLON.ScriptComponent {
        private smoothFollow;
        private smoothRotate;
        private matchRotation;
        private followTarget;
        private targetPosition;
        private targetRotation;
        protected awake(): void;
        protected start(): void;
        protected late(): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class SmoothFollowTarget
    */
    class SmoothFollowTarget extends BABYLON.ScriptComponent {
        target: BABYLON.TransformNode;
        targetHeight: number;
        followHeight: number;
        heightDamping: number;
        rotationDamping: number;
        minimumDistance: number;
        maximumDistance: number;
        startBehindTarget: boolean;
        followBehindTarget: boolean;
        private targetPosition;
        private targetAngles;
        private transformAngles;
        private positionBuffer;
        private rotationBuffer;
        private tempRotationBuffer;
        protected awake(): void;
        protected start(): void;
        protected late(): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class WaypointTargetManager
    */
    class WaypointTargetManager extends BABYLON.ScriptComponent {
        private _waypointMeshLines;
        private _waypointSplineCurve;
        private _waypointTransformNodes;
        private _waypointSplinePositions;
        private _waypointSphereMaterial;
        resolution: number;
        closedLoop: boolean;
        drawLines: boolean;
        drawPoints: boolean;
        drawTraces: boolean;
        pointSize: number;
        lineHeight: number;
        lineColor: BABYLON.Color3;
        pointColor: BABYLON.Color3;
        traceColor: BABYLON.Color3;
        getSplineCurve(): BABYLON.Curve3;
        getSplineCurveLength(): number;
        getSplineCurvePositions(): BABYLON.Vector3[];
        getControlPointTransforms(): BABYLON.TransformNode[];
        protected awake(): void;
        protected start(): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
     * Babylon Script Component
     * @class DebugInformation
     */
    class DebugInformation extends BABYLON.ScriptComponent {
        private keys;
        private show;
        private popup;
        private views;
        private xbox;
        private color;
        protected awake(): void;
        protected start(): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class TestNavigationAgent
    */
    class TestNavigationAgent extends BABYLON.ScriptComponent {
        protected m_playerAgent: BABYLON.NavigationAgent;
        protected m_charController: BABYLON.CharacterController;
        protected awake(): void;
        protected doPointerCancel(): void;
        protected doPointerDown(pointerInfo: BABYLON.PointerInfo): void;
        protected update(): void;
        private time;
        private duration;
        private jumpCurve;
        private traversalTime;
        protected updateNavAgent(): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class TestRootMotion
    */
    class TestRootMotion extends BABYLON.ScriptComponent {
        private motionType;
        updatePosition: boolean;
        updateRotation: boolean;
        moveWithCollisions: boolean;
        protected m_animator: BABYLON.AnimationState;
        protected m_character: BABYLON.CharacterController;
        protected m_rigidbody: BABYLON.RigidbodyPhysics;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected turn(): void;
        protected move(): void;
    }
}
declare module BABYLON {
    /**
     * Babylon metadata parser class (Internal use only)
     * @class PerlinNoiseGenerator - All rights reserved (c) 2020 Mackey Kinard
     */
    class PerlinNoiseGenerator {
        private static gradients;
        private static rand_vect;
        private static dot_prod_grid;
        private static smootherstep;
        private static interp;
        /** Seed perlin noise generator */
        static seed(): void;
        /** Generate perlin noise value from 2D coordinates. (Note: Use normalized input values) */
        static generate(x: number, y: number): number;
    }
}
declare module BABYLON {
    /**
     * Babylon windows platform pro class
     * @class WindowsPlatform - All rights reserved (c) 2020 Mackey Kinard
     */
    class WindowsPlatform {
        /** Is xbox live user signed in if platform services enabled. (WinRT) */
        static IsXboxLiveUserSignedIn(systemUser?: Windows.System.User, player?: BABYLON.PlayerNumber): boolean;
        /** Validated sign in xbox live user if platform services available. (WinRT) */
        static XboxLiveUserSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): void;
        /** Silent sign in xbox live user if platform services available. (WinRT) */
        static XboxLiveUserSilentSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
        /** Dialog sign in xbox live user if platform services available. (WinRT) */
        static XboxLiveUserDialogSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
        /** Loads a xbox live user profile if platform services available. (WinRT) */
        static LoadXboxLiveUserProfile(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.Social.XboxUserProfile) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
        /** Get xbox live user if platform services available. (WinRT) */
        static GetXboxLiveUser(player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.System.XboxLiveUser;
        /** Get xbox live user if platform services available. (WinRT) */
        static GetXboxLiveSystemUser(systemUser: Windows.System.User, player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.System.XboxLiveUser;
        /** Get xbox live user context if platform services available. (WinRT) */
        static GetXboxLiveUserContext(player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.XboxLiveContext;
        /** Resets xbox live user context if platform services available. (WinRT) */
        static ResetXboxLiveUserContext(player?: BABYLON.PlayerNumber): void;
        /** Get xbox live context property if platform services available. (WinRT) */
        static GetXboxLiveContextProperty(name: any): any;
        /** Get xbox live context property if platform services available. (WinRT) */
        static SetXboxLiveContextProperty(name: any, property: any): void;
        /** Resets xbox live property context bag if platform services available. (WinRT) */
        static ResetXboxLivePropertyContexts(): void;
        /** Sets the Xbox User Sign Out Complete Handler (WinRT) */
        static SetXboxLiveSignOutHandler(handler?: (result: Microsoft.Xbox.Services.System.SignOutCompletedEventArgs) => void): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class CaptionManager
    */
    class CaptionManager extends BABYLON.ScriptComponent {
        protected awake(): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class CaptionSystem
    */
    class CaptionSystem extends BABYLON.ScriptComponent {
        private captionType;
        private displayTimer;
        private domElement;
        private textTracks;
        private userLocale;
        logCaptions: boolean;
        getUserLocale(): string;
        getCaptionType(): number;
        protected m_captionElement: HTMLElement;
        protected m_captionSource: BABYLON.WebVideoPlayer | BABYLON.AudioSource;
        protected m_captionTimer: number;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        /** Register handler that is triggered on vtt caption cue changed */
        onUpdateCaptionObservable: BABYLON.Observable<string>;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any);
        protected awakeCaptionSystem(): void;
        protected startCaptionSystem(): void;
        protected updateCaptionSystem(): void;
        protected destroyCaptionSystem(): void;
        private attachCaptionSystem;
        private postCaptionMessage;
        private getLocalUserLocaleInfo;
        private formatTextTrackKind;
        static EnableDefaultTextTrack(source: HTMLVideoElement | HTMLAudioElement, enable: boolean): void;
    }
    /**
     * Text Track Interface Data
     */
    interface ICaptionTextTrack {
        trackKind: number;
        trackLabel: string;
        trackAsset: BABYLON.IUnityDefaultAsset;
        trackLanguage: string;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class SceneSoundSystem
    */
    class SceneSoundSystem extends BABYLON.ScriptComponent {
        private static _MUSIC;
        static get MUSIC(): MVRK.SoundManager;
        private static _SFX;
        static get SFX(): MVRK.SoundManager;
        protected start(): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class SoundManager
    */
    class SoundManager extends BABYLON.ScriptComponent {
        private groupName;
        private cachedVolume;
        private volumeProperty;
        getGroupName(): string;
        protected m_soundMap: Map<string, BABYLON.AudioSource>;
        protected m_soundList: BABYLON.AudioSource[];
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        /**
         * Play the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         * @param offset (optional) Start the sound at a specific time in seconds
         * @param length (optional) Sound duration (in seconds)
         */
        playTrack(name: string, time?: number, offset?: number, length?: number): boolean;
        /**
         * Pause the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        pauseTrack(name: string): boolean;
        /**
         * Pause the sound for all tracks in the group
         * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
         */
        pauseAllTracks(): void;
        /**
         * Stop the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        stopTrack(name: string, time?: number): boolean;
        /**
         * Stop the sound for all tracks in the group
         * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
         */
        stopAllTracks(time?: number): void;
        /**
         * Mute the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        muteTrack(name: string, time?: number): boolean;
        /**
         * Unmute the sound track by name
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        unmuteTrack(name: string, time?: number): boolean;
        /**
         * Mutes the volume for all sound tracks in the group
         * @param time Define time for gradual change to new volume
         */
        muteAllTracks(time?: number): void;
        /**
         * Unmutes the volume for all sound tracks in the group
         * @param time Define time for gradual change to new volume
         */
        unmuteAllTracks(time?: number): void;
        /**
         * Sets the volume for all sound tracks in the group
         * @param volume Define the new volume of the sound
         * @param time Define time for gradual change to new volume
         */
        setGroupVolume(volume: number, time?: number): void;
        /**
         * Get a sound source by name
         */
        getAudioSource(name: string): BABYLON.AudioSource;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class VideoController
    */
    class VideoController extends BABYLON.ScriptComponent {
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected late(): void;
        protected after(): void;
        protected destroy(): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class InsideNotification
    */
    class InsideNotification extends BABYLON.ScriptComponent {
        private static CurrentRoom;
        private abstractMesh;
        protected awake(): void;
        protected update(): void;
        private pointIsInside;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class PopupTrigger
    */
    class PopupTrigger extends BABYLON.ScriptComponent {
        triggerType: string;
        triggerParam: string;
        private triggerFocus;
        private abstractMesh;
        hasFocused: boolean;
        private lerpDoneView;
        private lerpDonePosition;
        private lerpSpeed;
        private lerpIncrement;
        private navContainer;
        /** Register handler that is triggered when the mesh has been picked */
        onPickTriggerObservable: BABYLON.Observable<BABYLON.AbstractMesh>;
        protected awake(): void;
        sendMessage(): void;
        registerNewTrigger(): void;
        private gradualFocus;
        private lerpCameraView;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component State Class
    * @class State
    */
    abstract class State {
        abstract onEnter(): void;
        abstract onExit(): void;
        abstract canChangeState(): boolean;
        abstract onStateChangeFail(): void;
        tick(): void;
    }
    /**
    * Babylon Stateful Script Component
    * @class StatefulScriptComponent
    */
    abstract class StatefulScriptComponent extends BABYLON.ScriptComponent {
        private _currentState;
        /** Gets the current script component state */
        getCurrentState(): MVRK.State;
        /** Sets the new script component state */
        setState(newState: MVRK.State, forced?: boolean): boolean;
        /** Register handler that is triggered when the animation ik setup has been triggered */
        onStateChangeObservable: BABYLON.Observable<State>;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class BillboardMesh
    */
    class BillboardMesh extends BABYLON.ScriptComponent {
        protected update(): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class BlinkManager
    */
    class BlinkManager extends BABYLON.ScriptComponent {
        private enableBlinking;
        private blinkingState;
        private blinkingTimer;
        blinkTimeout: number;
        /** Register handler that is triggered when the blink change has been triggered */
        onBlinkUpdateObservable: BABYLON.Observable<boolean>;
        protected awake(): void;
        protected update(): void;
        protected destroy(): void;
        enableBlinkMode(blinking: boolean): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class FloatingAnimation
    */
    class FloatingAnimation extends BABYLON.ScriptComponent {
        private floatSpeed;
        private floatDistance;
        private randomOffset;
        private initPosition;
        private floatingVector;
        protected awake(): void;
        protected update(): void;
        protected destroy(): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class RotateTransform
    */
    class RotateTransform extends BABYLON.ScriptComponent {
        private rotateSpeedX;
        private rotateSpeedY;
        private rotateSpeedZ;
        protected m_rotationEulers: BABYLON.Vector3;
        protected awake(): void;
        protected update(): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class RuntimeTexture
    */
    class RuntimeTexture extends BABYLON.ScriptComponent {
        protected m_dynamicTexture: BABYLON.Texture;
        protected m_dynamicMaterial: BABYLON.Material;
        protected awake(): void;
        protected destroy(): void;
        setTextureUrl(url: string, invertY?: boolean, createMipmaps?: boolean): void;
    }
}
declare module MVRK {
    /**
    * Babylon Script Component
    * @class SpriteAnimation
    */
    class SpriteAnimation extends BABYLON.ScriptComponent {
        private gridCols;
        private gridRows;
        private startRow;
        private bottomUp;
        private timeInSeconds;
        private colWidth;
        private rowHeight;
        private animTimer;
        private tileIndex;
        private tileReset;
        private baseTexture;
        protected awake(): void;
        protected start(): void;
        protected reset(): void;
        protected update(): void;
        protected animate(): void;
        protected destroy(): void;
    }
}
declare module MVRK {
    /**
     * Babylon scene loader helper class
     * @class SceneLoader
     */
    class SceneLoader {
        static SwitchScene(sceneFile: string, blanketColor?: string, onFadeComplete?: () => void): void;
        static LoadSceneComplete(): void;
    }
}
declare module MVRK {
    /**
     * Babylon scene teleporter helper class
     * @class Teleporter
     */
    class Teleporter {
        static TeleFade: {
            FadeSpeed: number;
            RestoreSpeed: number;
            BabylonScene: any;
        };
        static OnFadeToBlack: () => void;
        static OnRestoreView: () => void;
        static FadeToBlack(blanketColor?: string): void;
        static RestoreView(): void;
        private static FadeToBlanketView;
        private static RestoreToSceneView;
    }
}
declare module MVRK {
    /**
     * Babylon system utilities helper class
     * @class System
     */
    class System {
        static GetUserInfo(): MVRK.IUserInfo;
        static GetGameLobbyInfo(): MVRK.IGameLobby;
    }
    /**
     * User Info Interface
     */
    interface IUserInfo {
        id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        avatar?: string;
        phoneNumber?: string;
        title?: string;
        company?: string;
        companyAddress1?: string;
        companyAddress2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    }
    interface IGameLobby {
        id: string;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class DemoRaceController
    */
    class DemoRaceController extends BABYLON.ScriptComponent {
        private countdownState;
        private countdownImage1;
        private countdownImage2;
        private countdownImage3;
        private countdownImageGo;
        private countdownImagesLoaded;
        private countdownSound1;
        private countdownSound2;
        private countdownSound3;
        private countdownSoundGo;
        private countdownSoundsLoaded;
        private mustangOneVehicle;
        private mustangTwoVehicle;
        private mustangThreeVehicle;
        private mustangFourVehicle;
        private startPositionHeight;
        private startCountdownVolume;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected awakeDemoController(): void;
        protected initDemoController(): Promise<void>;
        protected updateDemoController(): void;
        protected updateNextCountdown(): void;
        protected processNextCountdown(milliseconds: number): void;
        protected hideCountdownItems(): void;
        protected killCountdownItems(): void;
        protected startDemoController(): void;
        protected static CreateMustangVehicle(scene: BABYLON.Scene, container: BABYLON.AssetContainer, prefab: string, name: string, player: BABYLON.PlayerNumber, startPosition: BABYLON.AbstractMesh, heightOffset: number, enableInput: boolean, attachCamera: boolean, topSpeed: number, powerRatio: number, skillLevel: number, bodyColor: BABYLON.Color3, wheelColor?: BABYLON.Color3, wheelType?: number, decalIndex?: number): BABYLON.TransformNode;
        protected static EnableMustangVehicle(mustangVehicle: BABYLON.TransformNode, enableInput: boolean): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class F1SceneController
    */
    class F1SceneController extends BABYLON.ScriptComponent {
        private countdownState;
        private countdownImage1;
        private countdownImage2;
        private countdownImage3;
        private countdownImageGo;
        private countdownImagesLoaded;
        private countdownSound1;
        private countdownSound2;
        private countdownSound3;
        private countdownSoundGo;
        private countdownSoundsLoaded;
        private raceCar1;
        private raceCar2;
        private raceCar3;
        private raceCar4;
        private raceOneVehicle;
        private raceTwoVehicle;
        private raceThreeVehicle;
        private raceFourVehicle;
        private startCountdownVolume;
        protected awake(): void;
        protected ready(): void;
        protected update(): void;
        protected awakeRaceController(): void;
        protected initRaceController(): void;
        protected updateRaceController(): void;
        protected updateNextCountdown(): void;
        protected processNextCountdown(milliseconds: number): void;
        protected hideCountdownItems(): void;
        protected killCountdownItems(): void;
        protected startRaceController(): void;
        protected static EnableRacingVehicle(racingVehicle: BABYLON.TransformNode, enableInput: boolean, autoPilot: boolean): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class MxSceneController
    */
    class MxSceneController extends BABYLON.ScriptComponent {
        private countdownState;
        private countdownImage1;
        private countdownImage2;
        private countdownImage3;
        private countdownImageGo;
        private countdownImagesLoaded;
        private countdownSound1;
        private countdownSound2;
        private countdownSound3;
        private countdownSoundGo;
        private countdownSoundsLoaded;
        private raceCar1;
        private raceOneVehicle;
        private startCountdownVolume;
        protected awake(): void;
        protected ready(): void;
        protected update(): void;
        protected awakeRaceController(): void;
        protected initRaceController(): void;
        protected updateRaceController(): void;
        protected updateNextCountdown(): void;
        protected processNextCountdown(milliseconds: number): void;
        protected hideCountdownItems(): void;
        protected killCountdownItems(): void;
        protected startRaceController(): void;
        protected static EnableRacingVehicle(racingVehicle: BABYLON.TransformNode, enableInput: boolean, autoPilot: boolean): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class AutoBodyGarage
    */
    class AutoBodyGarage extends BABYLON.ScriptComponent {
        private m_bodyMaterial;
        private m_bodyAbtractMesh;
        protected awake(): void;
        setupVehicleMaterials(bodyColor: BABYLON.Color3, wheelColor?: BABYLON.Color3, wheelType?: number, decalIndex?: number): void;
    }
}
declare module PROJECT {
    interface ITrackNode {
        radius: number;
        position: BABYLON.IUnityVector3;
        rotation: BABYLON.IUnityVector4;
    }
    interface IControlPoint {
        speed: number;
        tvalue: number;
        position: BABYLON.IUnityVector3;
    }
    /**
    * Babylon Script Component
    * @class BT_RaceTrackManager
    */
    class RaceTrackManager extends BABYLON.ScriptComponent {
        private trackNodes;
        private raceLineData_1;
        private raceLineData_2;
        private raceLineData_3;
        private raceLineData_4;
        private raceLineData_5;
        private raceLineColor_1;
        private raceLineColor_2;
        private raceLineColor_3;
        private raceLineColor_4;
        private raceLineColor_5;
        private debugMeshLines_1;
        private debugMeshLines_2;
        private debugMeshLines_3;
        private debugMeshLines_4;
        private debugMeshLines_5;
        drawDebugLines: boolean;
        getTrackNodes(): PROJECT.ITrackNode[];
        getControlPoints(line: number): PROJECT.IControlPoint[];
        protected awake(): void;
        protected start(): void;
        protected destroy(): void;
    }
}
declare module PROJECT {
    /**
     * Babylon skidmark section class (Native Bullet Physics 2.82)
     * @class SkidMarkSection
     */
    class SkidMarkSection {
        Pos: BABYLON.Vector3;
        Normal: BABYLON.Vector3;
        Tangent: BABYLON.Vector4;
        Posl: BABYLON.Vector3;
        Posr: BABYLON.Vector3;
        Intensity: number;
        LastIndex: number;
    }
    /**
     * Babylon Script Component
     * @class SkidMarkManager
     */
    class SkidMarkManager extends BABYLON.ScriptComponent {
        private static MAX_MARKS;
        private static GROUND_OFFSET;
        private static GPU_TRIANGLES;
        private static MARK_COLOR;
        private static MARK_WIDTH;
        private static TEX_INTENSITY;
        private static MIN_DISTANCE;
        private static MIN_SQR_DISTANCE;
        private static TEXTURE_MARKS;
        private static SkidBufferPositions;
        private static SkidBufferNormals;
        private static SkidBufferTangents;
        private static SkidBufferColors;
        private static SkidBufferUvs;
        private static SkidBufferIndices;
        private static SkidMarkSections;
        private static SkidMarkIndex;
        private static SkidMarkMesh;
        private static SkidMarkUpdated;
        private static TempVector3_POS;
        private static TempVector3_DIR;
        private static TempVector3_XDIR;
        private static TempVector3_SDIR;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any);
        protected start(): void;
        protected update(): void;
        static AddSkidMarkSegment(pos: BABYLON.Vector3, normal: BABYLON.Vector3, intensity: number, lastIndex: number): BABYLON.Nullable<number>;
        private static CreateSkidMarkManager;
        private static AddSkidMarkVertexData;
        private static UpdateSkidMarkManager;
    }
}
declare module PROJECT {
    /**
     * Babylon standard rigidbody vehicle controller class (Native Bullet Physics 2.82)
     * @class StandardCarController
     */
    class StandardCarController extends BABYLON.ScriptComponent {
        static MIN_RPM: number;
        static MAX_RPM: number;
        private _rigidbody;
        private _engineAudioSource;
        private _skidAudioSource;
        private gearIndex;
        private downShift;
        private shiftingTime;
        private engineForce;
        private handBraking;
        private linearDamping;
        private angularDamping;
        private forwardSpeed;
        private absoluteSpeed;
        private americanSpeed;
        private normalizedSpeed;
        private frontWheelPower;
        private backWheelPower;
        private wheelBrakingForce;
        private visualSteerAngle;
        private physicsSteerAngle;
        private raycastVehicle;
        private brakeLightsMesh;
        private brakeLightsTrans;
        private reverseLightsMesh;
        private reverseLightsTrans;
        private frontLeftWheelTrans;
        private frontRightWheelTrans;
        private backLeftWheelTrans;
        private backRightWheelTrans;
        private frontLeftWheelMesh;
        private frontRightWheelMesh;
        private backLeftWheelMesh;
        private backRightWheelMesh;
        private frontLeftWheelEmitter;
        private frontRightWheelEmitter;
        private backLeftWheelEmitter;
        private backRightWheelEmitter;
        private frontLeftWheelParticle;
        private frontRightWheelParticle;
        private backLeftWheelParticle;
        private backRightWheelParticle;
        private frontLeftWheelCollider;
        private frontRightWheelCollider;
        private backLeftWheelCollider;
        private backRightWheelCollider;
        private engineTorqueCurve;
        private wheelRadius;
        private clutchSlip;
        private engineRPM;
        private pitchRPM;
        private shiftRPM;
        private SKID_FL;
        private SKID_FR;
        private SKID_RL;
        private SKID_RR;
        private FRONT_LEFT;
        private FRONT_RIGHT;
        private BACK_LEFT;
        private BACK_RIGHT;
        getFootBraking(): boolean;
        getHandBraking(): boolean;
        getPowerSliding(): boolean;
        getCurrentForward(): number;
        getCurrentTurning(): number;
        getCurrentSkidding(): boolean;
        getcurrentDrifting(): boolean;
        getReverseThrottle(): boolean;
        getFrontLeftSkid(): number;
        getFrontRightSkid(): number;
        getBackLeftSkid(): number;
        getBackRightSkid(): number;
        getRigidbodyPhysics(): BABYLON.RigidbodyPhysics;
        getRaycastVehicle(): BABYLON.RaycastVehicle;
        getForwardSpeed(): number;
        getAbsoluteSpeed(): number;
        getAmericanSpeed(): number;
        getNormalizedSpeed(): number;
        getCurrentGearIndex(): number;
        getCurrentEngineRPM(): number;
        getCurrentEnginePitch(): number;
        getGearShiftRatioCount(): number;
        getSmokeTextureMask(): BABYLON.Texture;
        getBrakeLightsMesh(): BABYLON.TransformNode;
        getReverseLightsMesh(): BABYLON.TransformNode;
        getFrontLeftWheelNode(): BABYLON.TransformNode;
        getFrontRightWheelNode(): BABYLON.TransformNode;
        getBackLeftWheelNode(): BABYLON.TransformNode;
        getBackRightWheelNode(): BABYLON.TransformNode;
        getWheelBurnoutEnabled(): boolean;
        getWheelDonutsEnabled(): boolean;
        getCurrentDonutSpinTime(): number;
        smokeTexture: BABYLON.Texture;
        skidThreashold: number;
        skidDrawVelocity: number;
        smokeIntensity: number;
        smokeOpacity: number;
        smokeDonuts: number;
        maxTurnAngle: number;
        maxBurnAngle: number;
        maxSteerBoost: number;
        overSteerSpeed: number;
        topEngineSpeed: number;
        powerCoefficient: number;
        frictionLerpSpeed: number;
        lowSpeedAngle: number;
        highSpeedAngle: number;
        lowSpeedTurning: number;
        highSpeedTurning: number;
        stableDownImpulse: number;
        roadConnectAccel: number;
        smoothFlyingForce: number;
        transmissionRatio: number;
        differentialRatio: number;
        maxFrontBraking: number;
        maxReversePower: number;
        minBrakingForce: number;
        maxBrakingForce: number;
        handBrakingForce: number;
        linearBrakingForce: number;
        angularBrakingForce: number;
        burnoutTimeDelay: number;
        burnoutWheelPitch: number;
        burnoutCoefficient: number;
        burnoutTriggerMark: number;
        maxThrottleBurnouts: boolean;
        playVehicleSounds: boolean;
        wheelDriveType: number;
        gearBoxMaxPitching: number;
        gearBoxShiftChange: number;
        gearBoxShiftDelay: number;
        gearBoxShiftRatios: number[];
        gearBoxShiftRanges: number[];
        slideWhenFootBraking: boolean;
        throttleBrakingForce: number;
        throttleEngineSpeed: number;
        powerSlideFriction: number;
        wheelSkidFriction: number;
        skiddingLerpSpeed: number;
        burnoutLerpSpeed: number;
        lowSpeedTurnRate: number;
        highSpeedTurnRate: number;
        protected m_physicsWorld: any;
        protected m_frontLeftWheel: any;
        protected m_frontRightWheel: any;
        protected m_backLeftWheel: any;
        protected m_backRightWheel: any;
        protected m_frontLeftWheelSkid: number;
        protected m_frontRightWheelSkid: number;
        protected m_backLeftWheelSkid: number;
        protected m_backRightWheelSkid: number;
        protected m_velocityOffset: BABYLON.Vector3;
        protected m_angularDampener: BABYLON.Vector3;
        protected awake(): void;
        protected start(): void;
        protected destroy(): void;
        protected awakeVehicleState(): void;
        protected initVehicleState(): void;
        protected destroyVehicleState(): void;
        private burnoutTimer;
        private restoreTimer;
        private cooldownTimer;
        private wheelDonuts;
        private wheelBurnout;
        private wheelSkidding;
        private donutSpinTime;
        private currentForward;
        private currentTurning;
        private currentSkidding;
        private currentDrifting;
        private allowedTurningAngle;
        private allowedTurningIncement;
        /** Drives the raycast vehicle with the specfied movement properties. */
        drive(throttle: number, steering: number, braking: boolean, drifting: boolean, assisted?: boolean, autopilot?: boolean): void;
        private syncVehicleState;
        private getVehicleEngineTorque;
        private createSmokeParticleSystem;
        private updateCurrentSkidInfo;
        private updateCurrentBrakeDamping;
        private updateCurrentRotationDelta;
        private updateCurrentRotationBoost;
        private updateCurrentFrictionSlip;
    }
}
declare module PROJECT {
    /**
    * Babylon Script Component
    * @class VehicleCameraManager
    */
    class VehicleCameraManager extends BABYLON.ScriptComponent {
        enableCamera: boolean;
        followTarget: boolean;
        followHeight: number;
        setCameraPitch: number;
        rotationDamping: number;
        minimumDistance: number;
        maximumDistance: number;
        buttonCamera: number;
        keyboardCamera: number;
        private firstPerson;
        private cameraPivot;
        private targetEulers;
        private cameraEulers;
        private cameraRotation;
        private cameraPivotOffset;
        private cameraBoomPosition;
        private autoAttachCamera;
        protected m_cameraTransform: BABYLON.TransformNode;
        protected m_inputController: PROJECT.VehicleInputController;
        protected m_standardController: PROJECT.StandardCarController;
        protected m_donutCameraLock: BABYLON.Vector3;
        protected m_firstPersonOffset: BABYLON.Vector3;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        protected awakeCameraManager(): void;
        protected initCameraManager(): void;
        protected updateCameraManager(): void;
        protected destroyCameraManager(): void;
        attachPlayerCamera(player: BABYLON.PlayerNumber): void;
        togglePlayerCamera(): void;
        firstPersonCamera(): void;
        private testSphere;
        private smoothDeltaTime;
        thirdPersonCamera(): void;
    }
}
declare module PROJECT {
    /**
     * Babylon Script Component
     * @class VehicleInputController
     */
    class VehicleInputController extends BABYLON.ScriptComponent {
        private playerDeltaX;
        private playerDeltaY;
        private playerMouseX;
        private playerMouseY;
        private inBrakingZone;
        private brakingZoneTag;
        private waypointPosition;
        private waypointCount;
        private waypointIndex;
        private nextTargetSpeed;
        private prevTargetSpeed;
        private lastMovementTime;
        private vehicleResetCheck;
        private showChaseRabbit;
        private showSensorLines;
        private rabbitTrackerLine;
        private rabbitTrackerColor;
        private greenTrackingColor;
        private redTrackingColor;
        private localTargetPosition;
        private mainCenterSensorLine;
        private mainRightSensorLine;
        private mainLeftSensorLine;
        private angleRightSensorLine;
        private angleLeftSensorLine;
        private sideRightSensorLine;
        private sideLeftSensorLine;
        private backRightSensorLine;
        private backLeftSensorLine;
        private sidewaysOffsetVector;
        private backBumperEdgeVector;
        private sensorStartPos;
        private sensorPointPos;
        private sensorAnglePos;
        private rsideStartPos;
        private rsidePointPos;
        private lsideStartPos;
        private lsidePointPos;
        private tempScaleVector;
        private rbackStartPos;
        private rbackPointPos;
        private lbackStartPos;
        private lbackPointPos;
        private trackVehiclePosition;
        private trackRabbitPosition;
        getPlayerDeltaX(): number;
        getPlayerDeltaY(): number;
        getPlayerMouseX(): number;
        getPlayerMouseY(): number;
        getWaypointIndex(): number;
        getChaseRabbitMesh(): BABYLON.Mesh;
        resetChaseRabbitMesh(): void;
        enableInput: boolean;
        resetTiming: number;
        playerNumber: BABYLON.PlayerNumber;
        triggerForward: number;
        keyboardForawrd: number;
        auxKeyboardForawrd: number;
        triggerBackwards: number;
        keyboardBackwards: number;
        auxKeyboardBackwards: number;
        buttonHandbrake: number;
        keyboardHandbrake: number;
        buttonDonut: number;
        keyboardDonut: number;
        raceLineNode: number;
        minLookAhead: number;
        maxLookAhead: number;
        driverSkillLevel: number;
        chaseRabbitSpeed: number;
        throttleSensitivity: number;
        steeringSensitivity: number;
        brakingSensitivity: number;
        brakingTurnAngle: number;
        brakingSpeedLimit: number;
        skiddingSpeedLimit: number;
        linearDampenForce: number;
        driveSpeedMultiplier: number;
        resetMovingTimeout: number;
        maxRaceTrackSpeed: number;
        handBrakeZoneTag: string;
        trackManagerIdentity: string;
        vehicleTag: string;
        obstacleTag: string;
        sensorLength: number;
        spacerWidths: number;
        angleFactors: number;
        initialOffsetX: number;
        initialOffsetY: number;
        initialOffsetZ: number;
        sidewaysLength: number;
        sidewaysOffset: number;
        backBumperEdge: number;
        avoidanceFactor: number;
        private reversingFlag;
        private reversingTime;
        private reversingWait;
        private reversingFor;
        protected m_chaseRabbitMesh: BABYLON.Mesh;
        protected m_circuitInterfaces: PROJECT.ITrackNode[];
        protected m_circuitRaceLine_1: PROJECT.IControlPoint[];
        protected m_circuitRaceLine_2: PROJECT.IControlPoint[];
        protected m_circuitRaceLine_3: PROJECT.IControlPoint[];
        protected m_circuitRaceLine_4: PROJECT.IControlPoint[];
        protected m_circuitRaceLine_5: PROJECT.IControlPoint[];
        protected m_rigidbodyPhysics: BABYLON.RigidbodyPhysics;
        protected m_standardCarController: PROJECT.StandardCarController;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        protected awakeVehicleController(): void;
        protected initVehicleController(): void;
        protected updateVehicleController(): void;
        protected updateManualInputDrive(): void;
        protected updateAutoPilotDrive(): void;
        protected getDriverSkillFactor(): number;
        protected getCurrentTrackNode(index: number): PROJECT.ITrackNode;
        protected getCurrentControlPoint(lane: number, index: number): PROJECT.IControlPoint;
        protected destroyVehicleController(): void;
    }
}
declare module BABYLON {
    /**
     * Babylon animation state pro class (Unity Style Mechanim Animation System)
     * @class AnimationState - All rights reserved (c) 2020 Mackey Kinard
     */
    class AnimationState extends BABYLON.ScriptComponent {
        private static FPS;
        private static TIME;
        private static EXIT;
        private static DEG90;
        private _frametime;
        private _layercount;
        private _updatemode;
        private _hasrootmotion;
        private _initialtargetblending;
        private _hastransformhierarchy;
        private _leftfeetbottomheight;
        private _rightfeetbottomheight;
        private _runtimecontroller;
        private _executed;
        private _checkers;
        private _source;
        private _machine;
        private _deltaPosition;
        private _deltaRotation;
        private _positionWeight;
        private _rootBoneWeight;
        private _rotationWeight;
        private _rootQuatWeight;
        private _angularVelocity;
        private _positionHolder;
        private _rootBoneHolder;
        private _rotationHolder;
        private _rootQuatHolder;
        private _rootMotionMatrix;
        private _rootMotionScaling;
        private _rootMotionRotation;
        private _rootMotionPosition;
        private _lastMotionRotation;
        private _lastMotionPosition;
        private _deltaPositionFixed;
        private _deltaPositionMatrix;
        private _saveDeltaPosition;
        private _saveDeltaRotation;
        private _dirtyMotionMatrix;
        private _dirtyBlenderMatrix;
        private _targetPosition;
        private _targetRotation;
        private _targetScaling;
        private _updateMatrix;
        private _blenderMatrix;
        private _blendWeights;
        private _emptyScaling;
        private _emptyPosition;
        private _emptyRotation;
        private _data;
        private _anims;
        private _numbers;
        private _booleans;
        private _triggers;
        private _parameters;
        speedRatio: number;
        updatePosition: boolean;
        updateRotation: boolean;
        applyRootMotion: boolean;
        enableAnimation: boolean;
        moveWithCollisions: boolean;
        hasRootMotion(): boolean;
        getAnimationTime(): number;
        getDeltaPosition(): BABYLON.Vector3;
        getDeltaRotation(): BABYLON.Quaternion;
        getAngularVelocity(): BABYLON.Vector3;
        getRootMotionAngle(): number;
        getRootMotionSpeed(): number;
        getCharacterController(): BABYLON.CharacterController;
        getRuntimeController(): string;
        /** Register handler that is triggered when the animation ik setup has been triggered */
        onAnimationIKObservable: Observable<number>;
        /** Register handler that is triggered when the animation end has been triggered */
        onAnimationEndObservable: Observable<number>;
        /** Register handler that is triggered when the animation loop has been triggered */
        onAnimationLoopObservable: Observable<number>;
        /** Register handler that is triggered when the animation event has been triggered */
        onAnimationEventObservable: Observable<IAnimatorEvent>;
        /** Register handler that is triggered when the animation frame has been updated */
        onAnimationUpdateObservable: Observable<TransformNode>;
        protected m_avatarMask: Map<string, number>;
        protected m_defaultGroup: BABYLON.AnimationGroup;
        protected m_animationTargets: BABYLON.TargetedAnimation[];
        protected m_characterController: BABYLON.CharacterController;
        protected awake(): void;
        protected late(): void;
        protected destroy(): void;
        playAnimation(state: string, transitionDuration?: number, animationLayer?: number, frameRate?: number): boolean;
        getBool(name: string): boolean;
        setBool(name: string, value: boolean): void;
        getFloat(name: string): float;
        setFloat(name: string, value: float): void;
        getInteger(name: string): int;
        setInteger(name: string, value: int): void;
        getTrigger(name: string): boolean;
        setTrigger(name: string): void;
        resetTrigger(name: string): void;
        private getMachineState;
        private setMachineState;
        getCurrentState(layer: number): BABYLON.MachineState;
        getAnimationGroup(name: string): BABYLON.AnimationGroup;
        getAnimationGroups(): Map<string, BABYLON.AnimationGroup>;
        setAnimationGroups(groups: BABYLON.AnimationGroup[], remapTargets?: boolean): void;
        private awakeStateMachine;
        private lateStateMachine;
        private destroyStateMachine;
        private updateAnimationState;
        private updateAnimationTargets;
        private updateBlendableTargets;
        private finalizeAnimationTargets;
        private checkStateMachine;
        private checkStateTransitions;
        private setCurrentAnimationState;
        private checkAvatarTransformPath;
        private filterTargetAvatarMask;
        private sortWeightedBlendingList;
        private computeWeightedFrameRatio;
        private setupTreeBranches;
        private parseTreeBranches;
        private parse1DSimpleTreeBranches;
        private parse2DSimpleDirectionalTreeBranches;
        private parse2DFreeformDirectionalTreeBranches;
        private parse2DFreeformCartesianTreeBranches;
    }
    class BlendTreeValue {
        source: BABYLON.IBlendTreeChild;
        motion: string;
        posX: number;
        posY: number;
        weight: number;
        constructor(config: {
            source: BABYLON.IBlendTreeChild;
            motion: string;
            posX?: number;
            posY?: number;
            weight?: number;
        });
    }
    class BlendTreeUtils {
        static ClampValue(num: number, min: number, max: number): number;
        static GetSignedAngle(a: BABYLON.Vector2, b: BABYLON.Vector2): number;
        static GetLinearInterpolation(x0: number, y0: number, x1: number, y1: number, x: number): number;
        static GetRightNeighbourIndex(inputX: number, blendTreeArray: BABYLON.BlendTreeValue[]): number;
    }
    class BlendTreeSystem {
        static Calculate1DSimpleBlendTree(inputX: number, blendTreeArray: BABYLON.BlendTreeValue[]): void;
        static Calculate2DFreeformDirectional(inputX: number, inputY: number, blendTreeArray: BABYLON.BlendTreeValue[]): void;
        static Calculate2DFreeformCartesian(inputX: number, inputY: number, blendTreeArray: BABYLON.BlendTreeValue[]): void;
        private static TempVector2_IP;
        private static TempVector2_POSI;
        private static TempVector2_POSJ;
        private static TempVector2_POSIP;
        private static TempVector2_POSIJ;
    }
    class MachineState {
        hash: number;
        name: string;
        tag: string;
        time: number;
        type: BABYLON.MotionType;
        rate: number;
        length: number;
        layer: string;
        layerIndex: number;
        played: number;
        machine: string;
        motionid: number;
        interrupted: boolean;
        apparentSpeed: number;
        averageAngularSpeed: number;
        averageDuration: number;
        averageSpeed: number[];
        cycleOffset: number;
        cycleOffsetParameter: string;
        cycleOffsetParameterActive: boolean;
        iKOnFeet: boolean;
        mirror: boolean;
        mirrorParameter: string;
        irrorParameterActive: boolean;
        speed: number;
        speedParameter: string;
        speedParameterActive: boolean;
        blendtree: BABYLON.IBlendTree;
        transitions: BABYLON.ITransition[];
        behaviours: BABYLON.IBehaviour[];
        events: BABYLON.IAnimatorEvent[];
        ccurves: BABYLON.IUnityCurve[];
        tcurves: BABYLON.Animation[];
        constructor();
    }
    class TransitionCheck {
        result: string;
        offest: number;
        blending: number;
        triggered: string[];
    }
    class AnimationMixer {
        influenceBuffer: number;
        positionBuffer: BABYLON.Vector3;
        rotationBuffer: BABYLON.Quaternion;
        scalingBuffer: BABYLON.Vector3;
        originalMatrix: BABYLON.Matrix;
        blendingFactor: number;
        blendingSpeed: number;
        rootPosition: BABYLON.Vector3;
        rootRotation: BABYLON.Quaternion;
    }
    class BlendingWeights {
        primary: BABYLON.IBlendTreeChild;
        secondary: BABYLON.IBlendTreeChild;
    }
    enum MotionType {
        Clip = 0,
        Tree = 1
    }
    enum ConditionMode {
        If = 1,
        IfNot = 2,
        Greater = 3,
        Less = 4,
        Equals = 6,
        NotEqual = 7
    }
    enum InterruptionSource {
        None = 0,
        Source = 1,
        Destination = 2,
        SourceThenDestination = 3,
        DestinationThenSource = 4
    }
    enum BlendTreeType {
        Simple1D = 0,
        SimpleDirectional2D = 1,
        FreeformDirectional2D = 2,
        FreeformCartesian2D = 3,
        Direct = 4,
        Clip = 5
    }
    enum BlendTreePosition {
        Lower = 0,
        Upper = 1
    }
    enum AnimatorParameterType {
        Float = 1,
        Int = 3,
        Bool = 4,
        Trigger = 9
    }
    interface IAnimatorEvent {
        id: number;
        clip: string;
        time: number;
        function: string;
        intParameter: number;
        floatParameter: number;
        stringParameter: string;
        objectIdParameter: string;
        objectNameParameter: string;
    }
    interface IAvatarMask {
        hash: number;
        maskName: string;
        maskType: string;
        transformCount: number;
        transformPaths: string[];
    }
    interface IAnimationLayer {
        hash: number;
        name: string;
        index: number;
        entry: string;
        machine: string;
        iKPass: boolean;
        avatarMask: BABYLON.IAvatarMask;
        blendingMode: number;
        defaultWeight: number;
        syncedLayerIndex: number;
        syncedLayerAffectsTiming: boolean;
        animationTime: number;
        animationNormal: number;
        animationFirstRun: boolean;
        animationEndFrame: boolean;
        animationLoopFrame: boolean;
        animationLoopEvents: any;
        animationStateMachine: BABYLON.MachineState;
    }
    interface IAnimationCurve {
        length: number;
        preWrapMode: string;
        postWrapMode: string;
        keyframes: BABYLON.IAnimationKeyframe[];
    }
    interface IAnimationKeyframe {
        time: number;
        value: number;
        inTangent: number;
        outTangent: number;
        tangentMode: number;
    }
    interface IBehaviour {
        hash: number;
        name: string;
        layerIndex: number;
        properties: any;
    }
    interface ITransition {
        hash: number;
        anyState: boolean;
        layerIndex: number;
        machineLayer: string;
        machineName: string;
        canTransitionToSelf: boolean;
        destination: string;
        duration: number;
        exitTime: number;
        hasExitTime: boolean;
        fixedDuration: boolean;
        intSource: BABYLON.InterruptionSource;
        isExit: boolean;
        mute: boolean;
        name: string;
        offset: number;
        orderedInt: boolean;
        solo: boolean;
        conditions: BABYLON.ICondition[];
    }
    interface ICondition {
        hash: number;
        mode: BABYLON.ConditionMode;
        parameter: string;
        threshold: number;
    }
    interface IBlendTree {
        hash: number;
        name: string;
        state: string;
        children: BABYLON.IBlendTreeChild[];
        layerIndex: number;
        apparentSpeed: number;
        averageAngularSpeed: number;
        averageDuration: number;
        averageSpeed: number[];
        blendParameterX: string;
        blendParameterY: string;
        blendType: BABYLON.BlendTreeType;
        isAnimatorMotion: boolean;
        isHumanMotion: boolean;
        isLooping: boolean;
        minThreshold: number;
        maxThreshold: number;
        useAutomaticThresholds: boolean;
        valueParameterX: number;
        valueParameterY: number;
    }
    interface IBlendTreeChild {
        hash: number;
        layerIndex: number;
        cycleOffset: number;
        directBlendParameter: string;
        apparentSpeed: number;
        averageAngularSpeed: number;
        averageDuration: number;
        averageSpeed: number[];
        mirror: boolean;
        type: BABYLON.MotionType;
        motion: string;
        positionX: number;
        positionY: number;
        threshold: number;
        timescale: number;
        subtree: BABYLON.IBlendTree;
        weight: number;
        ratio: number;
        track: BABYLON.AnimationGroup;
    }
}
declare module BABYLON {
    /**
     * Babylon audio source manager pro class
     * @class AudioSource - All rights reserved (c) 2020 Mackey Kinard
     */
    class AudioSource extends BABYLON.ScriptComponent implements BABYLON.IAssetPreloader {
        private _audio;
        private _name;
        private _loop;
        private _mute;
        private _pitch;
        private _volume;
        private _preload;
        private _priority;
        private _panstereo;
        private _mindistance;
        private _maxdistance;
        private _rolloffmode;
        private _rollofffactor;
        private _playonawake;
        private _spatialblend;
        private _preloaderUrl;
        private _reverbzonemix;
        private _lastmutedvolume;
        private _bypasseffects;
        private _bypassreverbzones;
        private _bypasslistenereffects;
        private _initializedReadyInstance;
        getSoundClip(): BABYLON.Sound;
        getAudioElement(): HTMLAudioElement;
        /** Register handler that is triggered when the audio clip is ready */
        onReadyObservable: Observable<Sound>;
        protected awake(): void;
        protected destroy(): void;
        protected awakeAudioSource(): void;
        protected destroyAudioSource(): void;
        /**
         * Gets the ready status for track
         */
        isReady(): boolean;
        /**
         * Gets the playing status for track
         */
        isPlaying(): boolean;
        /**
         * Gets the paused status for track
         */
        isPaused(): boolean;
        /**
         * Play the sound track
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         * @param offset (optional) Start the sound at a specific time in seconds
         * @param length (optional) Sound duration (in seconds)
         */
        play(time?: number, offset?: number, length?: number): boolean;
        private internalPlay;
        /**
         * Pause the sound track
         */
        pause(): boolean;
        /**
         * Stop the sound track
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        stop(time?: number): boolean;
        /**
         * Mute the sound track
         * @param time (optional) Mute the sound after X seconds. Start immediately (0) by default.
         */
        mute(time?: number): boolean;
        /**
         * Unmute the sound track
         * @param time (optional) Unmute the sound after X seconds. Start immediately (0) by default.
         */
        unmute(time?: number): boolean;
        /**
         * Gets the volume of the track
         */
        getVolume(): number;
        /**
         * Sets the volume of the track
         * @param volume Define the new volume of the sound
         * @param time Define time for gradual change to new volume
         */
        setVolume(volume: number, time?: number): boolean;
        /**
         * Gets the spatial sound option of the track
         */
        getSpatialSound(): boolean;
        /**
         * Gets the spatial sound option of the track
         * @param value Define the value of the spatial sound
         */
        setSpatialSound(value: boolean): void;
        /**
         * Sets the sound track playback speed
         * @param rate the audio playback rate
         */
        setPlaybackSpeed(rate: number): void;
        /**
         * Gets the current time of the track
         */
        getCurrentTrackTime(): number;
        /** Set audio data source */
        setDataSource(source: string | ArrayBuffer | MediaStream): void;
        /** Add audio preloader asset tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        addPreloaderTasks(assetsManager: BABYLON.AssetsManager): void;
    }
}
declare module BABYLON {
    /**
     * Babylon kinematic character controller pro class (Native Bullet Physics 2.82)
     * @class CharacterController - All rights reserved (c) 2020 Mackey Kinard
     */
    class CharacterController extends BABYLON.ScriptComponent {
        private static MARGIN_FACTOR;
        private _abstractMesh;
        private _avatarRadius;
        private _avatarHeight;
        private _centerOffset;
        private _skinWidth;
        private _stepOffset;
        private _slopeLimit;
        private _capsuleSegments;
        private _minMoveDistance;
        private _isPhysicsReady;
        private _maxCollisions;
        private _useGhostSweepTest;
        private _tmpPositionBuffer;
        private _tmpCollisionContacts;
        updatePosition: boolean;
        getInternalCharacter(): any;
        getAvatarRadius(): number;
        getAvatarHeight(): number;
        getSkinWidth(): number;
        getStepOffset(): number;
        getUseSweepTest(): any;
        getMinMoveDistance(): number;
        setMinMoveDistance(distance: number): void;
        getVerticalVelocity(): number;
        getAddedMargin(): number;
        setAddedMargin(margin: number): void;
        setMaxJumpHeight(maxJumpHeight: number): void;
        setFallingSpeed(fallSpeed: number): void;
        getSlopeLimit(): number;
        setSlopeLimit(slopeRadians: number): void;
        setUpAxis(axis: number): void;
        getGravity(): number;
        setGravity(gravity: number): void;
        isGrounded(): boolean;
        isReady(): boolean;
        canJump(): boolean;
        /** Register handler that is triggered when the transform position has been updated */
        onUpdatePositionObservable: Observable<TransformNode>;
        /** Register handler that is triggered when the a collision contact has entered */
        onCollisionEnterObservable: Observable<AbstractMesh>;
        /** Register handler that is triggered when the a collision contact is active */
        onCollisionStayObservable: Observable<AbstractMesh>;
        /** Register handler that is triggered when the a collision contact has exited */
        onCollisionExitObservable: Observable<AbstractMesh>;
        protected m_character: any;
        protected m_ghostShape: any;
        protected m_ghostObject: any;
        protected m_ghostCollision: any;
        protected m_ghostTransform: any;
        protected m_ghostPosition: any;
        protected m_startPosition: any;
        protected m_startTransform: any;
        protected m_walkDirection: any;
        protected m_warpPosition: any;
        protected m_turningRate: number;
        protected m_moveDeltaX: number;
        protected m_moveDeltaZ: number;
        protected m_physicsEngine: BABYLON.IPhysicsEngine;
        protected m_characterPosition: BABYLON.Vector3;
        protected internalWarp(position: any): void;
        protected internalJump(): void;
        protected internalSetJumpSpeed(speed: number): void;
        protected internalSetWalkDirection(direction: any): void;
        protected internalSetVelocityForTimeInterval(velocity: any, interval: number): void;
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        protected awakeMovementState(): void;
        protected startMovementState(): void;
        protected syncMovementState(): void;
        protected updateMovementState(): void;
        protected parseGhostCollisionContacts(): void;
        protected destroyMovementState(): void;
        /** Sets the maximum number of simultaneous contact notfications to dispatch per frame. Defaults value is 4. (Advanved Use Only) */
        setMaxNotifications(max: number): void;
        /** Sets character collision activation state using physics ghost object. (Advanved Use Only) */
        setActivationState(state: number): void;
        /** Gets character collision group filter using physics ghost object. (Advanved Use Only) */
        getCollisionFilterGroup(): number;
        /** Sets character collision group filter using physics ghost object. (Advanved Use Only) */
        setCollisionFilterGroup(group: number): void;
        /** Gets character collision mask filter using physics ghost object. (Advanved Use Only) */
        getCollisionFilterMask(): number;
        /** Sets the character collision mask filter using physics ghost object. (Advanved Use Only) */
        setCollisionFilterMask(mask: number): void;
        /** Gets the chracter contact processing threshold using physics ghost object. (Advanved Use Only) */
        getContactProcessingThreshold(): number;
        /** Sets character contact processing threshold using physics ghost object. (Advanved Use Only) */
        setContactProcessingThreshold(threshold: number): void;
        /** Get the current position of the physics ghost object world transform. (Advanved Use Only) */
        getGhostWorldPosition(): BABYLON.Vector3;
        /** Get the current position of the physics ghost object world transform. (Advanved Use Only) */
        getGhostWorldPositionToRef(result: BABYLON.Vector3): void;
        /** Manually set the position of the physics ghost object world transform. (Advanved Use Only) */
        setGhostWorldPosition(position: BABYLON.Nullable<BABYLON.Vector3>): void;
        /** Sets the kinematic character position to the specified location. */
        set(x: number, y: number, z: number): void;
        /** Translates the kinematic character with the specfied velocity. */
        move(velocity: BABYLON.Vector3): void;
        /** Jumps the kinematic chacracter with the specified speed. */
        jump(speed: number): void;
        /** Warps the kinematic chacracter to the specified position. */
        warp(position: BABYLON.Vector3): void;
    }
}
declare module BABYLON {
    /**
     * Babylon navigation agent pro class (Unity Style Navigation Agent System)
     * @class NavigationAgent - All rights reserved (c) 2020 Mackey Kinard
     */
    class NavigationAgent extends BABYLON.ScriptComponent {
        private static TARGET_ANGLE_FACTOR;
        private static ANGULAR_SPEED_RATIO;
        private type;
        private speed;
        private baseOffset;
        private avoidRadius;
        private avoidHeight;
        private acceleration;
        private areaMask;
        private autoRepath;
        private autoBraking;
        private autoTraverseOffMeshLink;
        private avoidancePriority;
        private obstacleAvoidanceType;
        private distanceToTarget;
        private teleporting;
        private moveDirection;
        private resetPosition;
        private lastPosition;
        private distancePosition;
        private currentPosition;
        private currentRotation;
        private currentVelocity;
        private currentWaypoint;
        heightOffset: number;
        angularSpeed: number;
        updatePosition: boolean;
        updateRotation: boolean;
        distanceEpsilon: number;
        velocityEpsilon: number;
        offMeshVelocity: number;
        stoppingDistance: number;
        isReady(): boolean;
        isNavigating(): boolean;
        isTeleporting(): boolean;
        isOnOffMeshLink(): boolean;
        getAgentType(): number;
        getAgentState(): number;
        getAgentIndex(): number;
        getAgentOffset(): number;
        getTargetDistance(): number;
        getCurrentPosition(): BABYLON.Vector3;
        getCurrentRotation(): BABYLON.Quaternion;
        getCurrentVelocity(): BABYLON.Vector3;
        getAgentParameters(): BABYLON.IAgentParameters;
        setAgentParameters(parameters: BABYLON.IAgentParameters): void;
        /** Register handler that is triggered when the agent is ready for navigation */
        onReadyObservable: Observable<TransformNode>;
        /** Register handler that is triggered before the navigation update */
        onPreUpdateObservable: Observable<TransformNode>;
        /** Register handler that is triggered after the navigation update */
        onPostUpdateObservable: Observable<TransformNode>;
        /** Register handler that is triggered when the navigation is complete */
        onNavCompleteObservable: Observable<TransformNode>;
        protected m_agentState: number;
        protected m_agentIndex: number;
        protected m_agentReady: boolean;
        protected m_agentGhost: BABYLON.TransformNode;
        protected m_agentParams: BABYLON.IAgentParameters;
        protected m_agentMovement: BABYLON.Vector3;
        protected m_agentDirection: BABYLON.Vector3;
        protected m_agentQuaternion: BABYLON.Quaternion;
        protected m_agentDestination: BABYLON.Vector3;
        protected awake(): void;
        protected update(): void;
        protected destroy(): void;
        private awakeNavigationAgent;
        private updateNavigationAgent;
        private updateAgentParameters;
        private destroyNavigationAgent;
        /** Move agent relative to current position. */
        move(offset: BABYLON.Vector3, closetPoint?: boolean): void;
        /** Teleport agent to destination point. */
        teleport(destination: BABYLON.Vector3, closetPoint?: boolean): void;
        /** Sets agent current destination point. */
        setDestination(destination: BABYLON.Vector3, closetPoint?: boolean): void;
        /** Gets agent current world space velocity. */
        getAgentVelocity(): BABYLON.Vector3;
        /** Gets agent current world space velocity. */
        getAgentVelocityToRef(result: BABYLON.Vector3): void;
        /** Gets agent current world space position. */
        getAgentPosition(): BABYLON.Vector3;
        /** Gets agent current world space position. */
        getAgentPositionToRef(result: BABYLON.Vector3): void;
        /** Gets agent current waypoint position. */
        getAgentWaypoint(): BABYLON.Vector3;
        /** Gets agent current waypoint position. */
        getAgentWaypointToRef(result: BABYLON.Vector3): void;
        /** Cancel current waypoint path navigation. */
        cancelNavigation(): void;
    }
    /**
     *  Recast Detour Crowd Agent States
     */
    enum CrowdAgentState {
        DT_CROWDAGENT_STATE_INVALID = 0,
        DT_CROWDAGENT_STATE_WALKING = 1,
        DT_CROWDAGENT_STATE_OFFMESH = 2
    }
}
declare module BABYLON {
    /**
     * Babylon raycast vehicle controller pro class (Native Bullet Physics 2.82)
     * @class RaycastVehicle - All rights reserved (c) 2020 Mackey Kinard
     */
    class RaycastVehicle {
        private _centerMass;
        private _chassisMesh;
        private _tempVectorPos;
        lockedWheelIndexes: number[];
        getInternalVehicle(): any;
        getUpAxis(): number;
        getRightAxis(): number;
        getForwardAxis(): number;
        getForwardVector(): any;
        getNumWheels(): number;
        getWheelInfo(wheel: number): any;
        resetSuspension(): void;
        setPitchControl(pitch: number): void;
        setEngineForce(power: number, wheel: number): void;
        setBrakingForce(brake: number, wheel: number): void;
        getWheelTransform(wheel: number): any;
        updateWheelTransform(wheel: number, interpolate: boolean): void;
        getUserConstraintType(): number;
        setUserConstraintType(userConstraintType: number): void;
        setUserConstraintId(uid: number): void;
        getUserConstraintId(): number;
        getRawCurrentSpeedKph(): number;
        getRawCurrentSpeedMph(): number;
        getAbsCurrentSpeedKph(): number;
        getAbsCurrentSpeedMph(): number;
        getVehicleTuningSystem(): any;
        getChassisWorldTransform(): any;
        protected m_vehicle: any;
        protected m_vehicleTuning: any;
        protected m_vehicleRaycaster: any;
        protected m_vehicleColliders: any[];
        protected m_tempTransform: any;
        protected m_tempPosition: any;
        protected m_wheelDirectionCS0: any;
        protected m_wheelAxleCS: any;
        constructor(entity: BABYLON.AbstractMesh, world: any, center: BABYLON.Vector3, defaultAngularFactor?: BABYLON.Vector3);
        dispose(): void;
        /** Gets the rigidbody raycast vehicle controller for the entity. Note: Wheel collider metadata informaion is required for raycast vehicle control. */
        static GetInstance(scene: BABYLON.Scene, rigidbody: BABYLON.RigidbodyPhysics, defaultAngularFactor?: BABYLON.Vector3): BABYLON.RaycastVehicle;
        /** Gets vehicle enable multi raycast flag using physics vehicle object. (Advanved Use Only) */
        getEnableMultiRaycast(): boolean;
        /** Sets vehicle enable multi raycast flag using physics vehicle object. (Advanved Use Only) */
        setEnableMultiRaycast(flag: boolean): void;
        /** Gets vehicle stable force using physics vehicle object. (Advanved Use Only) */
        getStabilizingForce(): number;
        /** Sets vehicle stable force using physics vehicle object. (Advanved Use Only) */
        setStabilizingForce(force: number): void;
        /** Gets vehicle smooth flying impulse force using physics vehicle object. (Advanved Use Only) */
        getSmoothFlyingImpulse(): number;
        /** Sets vehicle smooth flying impulse using physics vehicle object. (Advanved Use Only) */
        setSmoothFlyingImpulse(impulse: number): void;
        /** Gets vehicle track connection accel force using physics vehicle object. (Advanved Use Only) */
        getTrackConnectionAccel(): number;
        /** Sets vehicle track connection accel force using physics vehicle object. (Advanved Use Only) */
        setTrackConnectionAccel(force: number): void;
        /** Gets vehicle min wheel contact count using physics vehicle object. (Advanved Use Only) */
        getMinimumWheelContacts(): number;
        /** Sets vehicle min wheel contact count using physics vehicle object. (Advanved Use Only) */
        setMinimumWheelContacts(force: number): void;
        /** Gets vehicle interpolate mesh normals flag using physics raycaster object. (Advanved Use Only) */
        getInterpolateNormals(): boolean;
        /** Sets the vehicle interpolate mesh normals using physics raycaster object. (Advanved Use Only) */
        setInterpolateNormals(flag: boolean): void;
        /** Gets vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        getShapeTestingMode(): boolean;
        /** Sets the vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        setShapeTestingMode(mode: boolean): void;
        /** Gets vehicle shape testing size using physics raycaster object. (Advanved Use Only) */
        getShapeTestingSize(): float;
        /** Sets the vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        setShapeTestingSize(size: float): void;
        /** Gets vehicle shape test point count using physics raycaster object. (Advanved Use Only) */
        getShapeTestingCount(): float;
        /** Sets the vehicle shape test point count using physics raycaster object. (Advanved Use Only) */
        setShapeTestingCount(count: float): void;
        /** Gets vehicle sweep penetration amount using physics raycaster object. (Advanved Use Only) */
        getSweepPenetration(): float;
        /** Sets the vehicle sweep penetration amount using physics raycaster object. (Advanved Use Only) */
        setSweepPenetration(amount: float): void;
        /** Gets vehicle collision group filter using physics raycaster object. (Advanved Use Only) */
        getCollisionFilterGroup(): number;
        /** Sets vehicle collision group filter using physics raycaster object. (Advanved Use Only) */
        setCollisionFilterGroup(group: number): void;
        /** Gets vehicle collision mask filter using physics raycaster object. (Advanved Use Only) */
        getCollisionFilterMask(): number;
        /** Sets the vehicle collision mask filter using physics raycaster object. (Advanved Use Only) */
        setCollisionFilterMask(mask: number): void;
        /** Gets the internal wheel index by id string. */
        getWheelIndexByID(id: string): number;
        /** Gets the internal wheel index by name string. */
        getWheelIndexByName(name: string): number;
        /** Gets the internal wheel collider information. */
        getWheelColliderInfo(wheel: number): number;
        /** Sets the internal wheel hub transform mesh by index. Used to rotate and bounce wheels. */
        setWheelTransformMesh(wheel: number, transform: BABYLON.TransformNode): void;
        getVisualSteeringAngle(wheel: number): number;
        setVisualSteeringAngle(angle: number, wheel: number): void;
        getPhysicsSteeringAngle(wheel: number): number;
        setPhysicsSteeringAngle(angle: number, wheel: number): void;
        protected setupWheelInformation(defaultAngularFactor?: BABYLON.Vector3): void;
        protected updateWheelInformation(): void;
        protected lockedWheelInformation(wheel: number): boolean;
        protected deleteWheelInformation(): void;
    }
}
declare module BABYLON {
    /**
     * Babylon realtime reflection system pro class (Unity Style Realtime Reflection Probes)
     * @class RealtimeReflection - All rights reserved (c) 2020 Mackey Kinard
     */
    class RealtimeReflection extends BABYLON.ScriptComponent {
        private static SKYBOX_FLAG;
        private renderList;
        private probeList;
        private refreshMode;
        private cullingMask;
        private clearFlags;
        private probeid;
        private useProbeList;
        private includeChildren;
        private resolution;
        private boxPos;
        private boxSize;
        private boxProjection;
        getProbeList(): BABYLON.AbstractMesh[];
        getRenderList(): BABYLON.AbstractMesh[];
        protected awake(): void;
        protected start(): void;
        protected destroy(): void;
        protected awakeRealtimReflections(): void;
        protected startRealtimReflections(): void;
        protected destroyRealtimReflections(): void;
    }
}
declare module BABYLON {
    /**
     * Babylon full rigidbody physics pro class (Native Bullet Physics 2.82)
     * @class RigidbodyPhysics - All rights reserved (c) 2020 Mackey Kinard
     */
    class RigidbodyPhysics extends BABYLON.ScriptComponent {
        private static TempAmmoVector;
        private static TempAmmoVectorAux;
        private static TempCenterTransform;
        private _abstractMesh;
        private _isKinematic;
        private _maxCollisions;
        private _isPhysicsReady;
        private _collisionObject;
        private _centerOfMass;
        private _tmpLinearFactor;
        private _tmpAngularFactor;
        private _tmpCenterOfMass;
        private _tmpGravityVector;
        private _tmpCollisionContacts;
        get isKinematic(): boolean;
        get centerOfMass(): BABYLON.Vector3;
        /** Register handler that is triggered when the a collision contact has entered */
        onCollisionEnterObservable: Observable<AbstractMesh>;
        /** Register handler that is triggered when the a collision contact is active */
        onCollisionStayObservable: Observable<AbstractMesh>;
        /** Register handler that is triggered when the a collision contact has exited */
        onCollisionExitObservable: Observable<AbstractMesh>;
        protected m_physicsWorld: any;
        protected m_physicsEngine: BABYLON.IPhysicsEngine;
        protected m_raycastVehicle: any;
        protected awake(): void;
        protected update(): void;
        protected after(): void;
        protected destroy(): void;
        protected awakeRigidbodyState(): void;
        protected updateRigidbodyState(): void;
        protected afterRigidbodyState(): void;
        protected destroyRigidbodyState(): void;
        protected syncronizeVehicleController(): void;
        protected parseBodyCollisionContacts(): void;
        protected resetBodyCollisionContacts(): void;
        /** Sets entity gravity value using physics impostor body. */
        setGravity(gravity: BABYLON.Vector3): void;
        /** Gets entity gravity value using physics impostor body. */
        getGravity(): BABYLON.Nullable<BABYLON.Vector3>;
        /** Gets entity gravity value using physics impostor body. */
        getGravityToRef(result: BABYLON.Vector3): void;
        /** Gets mass of entity using physics impostor. */
        getMass(): number;
        /** Sets mass to entity using physics impostor. */
        setMass(mass: number): void;
        /** Gets entity friction level using physics impostor. */
        getFriction(): number;
        /** Applies friction to entity using physics impostor. */
        setFriction(friction: number): void;
        /** Gets restitution of entity using physics impostor. */
        getRestitution(): number;
        /** Sets restitution to entity using physics impostor. */
        setRestitution(restitution: number): void;
        /** Gets entity linear velocity using physics impostor. */
        getLinearVelocity(): BABYLON.Nullable<BABYLON.Vector3>;
        /** Sets entity linear velocity using physics impostor. */
        setLinearVelocity(velocity: BABYLON.Vector3): void;
        /** Gets entity angular velocity using physics impostor. */
        getAngularVelocity(): BABYLON.Nullable<BABYLON.Vector3>;
        /** Sets entity angular velocity using physics impostor. */
        setAngularVelocity(velocity: BABYLON.Vector3): void;
        /** Gets the native physics world transform object using physics impostor body. (Ammo.btTransform) */
        getWorldTransform(): any;
        /** sets the native physics world transform object using physics impostor body. (Ammo.btTransform) */
        setWorldTransform(btTransform: any): any;
        clearForces(): void;
        applyTorque(torque: BABYLON.Vector3): void;
        applyLocalTorque(torque: BABYLON.Vector3): void;
        applyImpulse(impulse: BABYLON.Vector3, rel_pos: BABYLON.Vector3): void;
        applyCentralImpulse(impulse: BABYLON.Vector3): void;
        applyTorqueImpulse(torque: BABYLON.Vector3): void;
        applyForce(force: BABYLON.Vector3, rel_pos: BABYLON.Vector3): void;
        applyCentralForce(force: BABYLON.Vector3): void;
        applyCentralLocalForce(force: BABYLON.Vector3): void;
        /** gets rigidbody center of mass */
        getCenterOfMassTransform(): BABYLON.Vector3;
        /** Sets rigidbody center of mass */
        setCenterOfMassTransform(center: BABYLON.Vector3): void;
        /** Gets entity linear factor using physics impostor body. */
        getLinearFactor(): BABYLON.Vector3;
        /** Sets entity linear factor using physics impostor body. */
        setLinearFactor(factor: BABYLON.Vector3): void;
        /** Gets entity angular factor using physics impostor body. */
        getAngularFactor(): BABYLON.Vector3;
        /** Sets entity angular factor using physics impostor body. */
        setAngularFactor(factor: BABYLON.Vector3): void;
        /** Gets entity angular damping using physics impostor body. */
        getAngularDamping(): number;
        /** Gets entity linear damping using physics impostor body. */
        getLinearDamping(): number;
        /** Sets entity drag damping using physics impostor body. */
        setDamping(linear: number, angular: number): void;
        /** Sets entity sleeping threshold using physics impostor body. */
        setSleepingThresholds(linear: number, angular: number): void;
        /** Checks if rigidbody has wheel collider metadata for the entity. Note: Wheel collider metadata informaion is required for vehicle control. */
        hasWheelColliders(): boolean;
        /** Sets the maximum number of simultaneous contact notfications to dispatch per frame. Defaults value is 4. (Advanved Use Only) */
        setMaxNotifications(max: number): void;
        /** Sets entity collision activation state using physics impostor body. (Advanved Use Only) */
        setActivationState(state: number): void;
        /** Gets entity collision filter group using physics impostor body. (Advanved Use Only) */
        getCollisionFilterGroup(): number;
        /** Sets entity collision filter group using physics impostor body. (Advanved Use Only) */
        setCollisionFilterGroup(group: number): void;
        /** Gets entity collision filter mask using physics impostor body. (Advanved Use Only) */
        getCollisionFilterMask(): number;
        /** Sets entity collision filter mask using physics impostor body. (Advanved Use Only) */
        setCollisionFilterMask(mask: number): void;
        /** Gets the entity collision shape type using physics impostor body. (Advanved Use Only) */
        getCollisionShapeType(): number;
        /** Gets the entity collision shape margin using physics impostor body. (Advanved Use Only) */
        getCollisionShapeMargin(): number;
        /** Sets entity collision shape margin using physics impostor body. (Advanved Use Only) */
        setCollisionShapeMargin(margin: number): void;
        /** Gets the entity contact processing threshold using physics impostor body. (Advanved Use Only) */
        /** Sets entity contact processing threshold using physics impostor body. (Advanved Use Only) */
        setContactProcessingThreshold(threshold: number): void;
        /** TODO */
        static CreatePhysicsMetadata(mass: number, drag?: number, angularDrag?: number, centerMass?: Vector3): any;
        /** TODO */
        static CreateCollisionMetadata(type: string, trigger?: boolean, convexmesh?: boolean, restitution?: number, dynamicfriction?: number, staticfriction?: number): any;
        /** TODO */
        static CreatePhysicsProperties(mass: number, drag?: number, angularDrag?: number, useGravity?: boolean, isKinematic?: boolean): any;
        /** TODO */
        static SetupPhysicsComponent(scene: BABYLON.Scene, entity: BABYLON.AbstractMesh): void;
        private static ConfigRigidbodyPhysics;
    }
    /**
     * Babylon collision contact info pro class (Native Bullet Physics 2.82)
     * @class CollisionContactInfo - All rights reserved (c) 2020 Mackey Kinard
     */
    class CollisionContactInfo {
        mesh: BABYLON.AbstractMesh;
        state: number;
        reset: boolean;
    }
}
declare module BABYLON {
    /**
     * Babylon shuriken particle system pro class (Unity Style Shuriken Particle System)
     * @class ShurikenParticles - All rights reserved (c) 2020 Mackey Kinard
     */
    class ShurikenParticles extends BABYLON.ScriptComponent {
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected late(): void;
        protected after(): void;
        protected destroy(): void;
    }
}
declare module BABYLON {
    /**
     * Babylon web video player pro class (Unity Style Shuriken Particle System)
     * @class WebVideoPlayer - All rights reserved (c) 2020 Mackey Kinard
     */
    class WebVideoPlayer extends BABYLON.ScriptComponent implements BABYLON.IAssetPreloader {
        private videoLoop;
        private videoMuted;
        private videoAlpha;
        private videoFaded;
        private videoPoster;
        private videoInvert;
        private videoSample;
        private videoVolume;
        private videoMipmaps;
        private videoPlayback;
        private videoPlayOnAwake;
        private videoPreloaderUrl;
        private videoBlobUrl;
        private videoPreload;
        private _initializedReadyInstance;
        getVideoMaterial(): BABYLON.StandardMaterial;
        getVideoTexture(): BABYLON.VideoTexture;
        getVideoElement(): HTMLVideoElement;
        getVideoScreen(): BABYLON.AbstractMesh;
        getVideoBlobUrl(): string;
        /** Register handler that is triggered when the audio clip is ready */
        onReadyObservable: Observable<VideoTexture>;
        protected m_abstractMesh: BABYLON.AbstractMesh;
        protected m_videoTexture: BABYLON.VideoTexture;
        protected m_videoMaterial: BABYLON.StandardMaterial;
        protected m_diffuseIntensity: number;
        protected awake(): void;
        protected destroy(): void;
        protected awakeWebVideoPlayer(): void;
        protected destroyWebVideoPlayer(): void;
        /**
         * Gets the video ready status
         */
        isReady(): boolean;
        /**
         * Gets the video playing status
         */
        isPlaying(): boolean;
        /**
         * Gets the video paused status
         */
        isPaused(): boolean;
        /**
         * Play the video track
         */
        play(): boolean;
        private internalPlay;
        private checkedPlay;
        private checkedRePlay;
        /**
         * Pause the video track
         */
        pause(): boolean;
        /**
         * Mute the video track
         */
        mute(): boolean;
        /**
         * Unmute the video track
         */
        unmute(): boolean;
        /**
         * Gets the video volume
         */
        getVolume(): number;
        /**
         * Sets the video volume
         * @param volume Define the new volume of the sound
         */
        setVolume(volume: number): boolean;
        /** Set video data source */
        setDataSource(source: string | string[] | HTMLVideoElement): void;
        /** Revokes the current video blob url and releases resouces */
        revokeVideoBlobUrl(): void;
        /** Add video preloader asset tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        addPreloaderTasks(assetsManager: BABYLON.AssetsManager): void;
    }
}
