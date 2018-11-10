/**
 * PlayCanvas helper tools
 * @class CanvasTools
 */
var CanvasTools = /** @class */ (function () {
    function CanvasTools() {
    }
    /**
     * Parse GLTF Project Level Meta Data
     * @param app
     * @param resources
     * @param onready
     */
    CanvasTools.TranslateScene = function (app, resources, onready) {
        var gltf = resources.gltf;
        var aniso = 1;
        if (gltf.scenes != null && gltf.scenes.length > 0) {
            var scene = gltf.scenes[0]; // Note: Only Supports One Scene Per File
            if (scene.hasOwnProperty("extras") && scene.extras.metadata != null) {
                if (scene.extras.metadata.hasOwnProperty('project')) {
                    var project = scene.extras.metadata.project;
                    // ..
                    // Project Script Loading
                    // ..
                    // TODO: Get Default Aniso Level
                    // ..
                    if (project.engine != null && project.engine !== "") {
                        if (project.engine.toLowerCase().indexOf("playcanvas") >= 0) {
                            if (project.script != null && project.script !== "") {
                                var prefix = "";
                                var scriptid = project.script;
                                if (resources.basePath != null && resources.basePath !== undefined && resources.basePath !== "") {
                                    prefix = resources.basePath;
                                    if (!prefix.endsWith("/"))
                                        prefix += "/";
                                }
                                if (document != null) {
                                    if (document.getElementById(scriptid) == null) {
                                        // ..
                                        // Require Project Dependencies
                                        // ..
                                        app.require((prefix + scriptid), function () { CanvasTools.LoadSceneAssets(app, aniso, resources, onready); });
                                        return;
                                    }
                                }
                            }
                        }
                        else {
                            console.warn("Unsupported script engine type: " + project.engine);
                        }
                    }
                }
            }
        }
        CanvasTools.LoadSceneAssets(app, aniso, resources, onready);
    };
    CanvasTools.LoadSceneAssets = function (app, aniso, resources, onready) {
        var gltf = resources.gltf;
        if (gltf.scenes != null && gltf.scenes.length > 0) {
            var scene = gltf.scenes[0]; // Note: Only Supports One Scene Per File
            if (scene.hasOwnProperty("extras") && scene.extras.metadata != null) {
                if (scene.extras.metadata.hasOwnProperty('assets')) {
                    var assetFiles = scene.extras.metadata.assets;
                    if (assetFiles != null && assetFiles.length > 0) {
                        var assets_1 = [];
                        assetFiles.forEach(function (assetFile) {
                            var uri = CanvasTools.ParseDataBufferUrl(assetFile, resources);
                            if (uri != null && uri !== "") {
                                var options = {};
                                if (assetFile.assetType === "cubemap") {
                                    options = {
                                        anisotropy: aniso,
                                        magFilter: pc.FILTER_LINEAR,
                                        minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
                                        textures: [],
                                        cubemap: true,
                                        rgbm: true,
                                    };
                                }
                                assets_1.push(new pc.Asset(assetFile.name, assetFile.assetType, { url: uri }, options));
                            }
                        });
                        if (assets_1.length > 0) {
                            SceneManager.LoadAssets(app, assets_1, function () { CanvasTools.ParseSceneNode(app, resources, onready); });
                            return;
                        }
                    }
                }
            }
        }
        CanvasTools.ParseSceneNode(app, resources, onready);
    };
    /**
     * Parse GLTF Node Level Meta Data
     * @param app
     * @param entity
     * @param data
     * @param resources
     */
    CanvasTools.TranslateNode = function (app, entity, data, resources) {
        if (data.hasOwnProperty("extras") && data.extras.metadata != null) {
            entity.metadata = data.extras.metadata;
            if (entity.metadata.components != null) {
                var components = entity.metadata.components;
                // ..
                // Parse Node Components
                // ..
                if (components != null && components.length > 0) {
                    var scripts_1 = [];
                    components.forEach(function (component) {
                        if (component != null) {
                            switch (component.alias) {
                                case "script":
                                    scripts_1.push(component);
                                    break;
                                case "camera":
                                    CanvasTools.ParseCameraNode(app, entity, data, resources, component);
                                    break;
                                case "light":
                                    CanvasTools.ParseLightNode(app, entity, data, resources, component);
                                    break;
                            }
                        }
                    });
                    // ..
                    // TODO: Store In Global List Then After All Nodes Process Add Script Components in Script Executtion Order
                    // ..
                    if (scripts_1.length > 0) {
                        scripts_1.forEach(function (script) { CanvasTools.ParseScriptNode(app, entity, data, resources, script); });
                    }
                }
            }
        }
    };
    /**
     *
     * @param app Parse GLTF Model Level Meta Data
     * @param entity
     * @param data
     * @param resources
     */
    CanvasTools.TranslateModel = function (app, entity, resources) {
        if (entity.model != null && entity.metadata != null && entity.metadata.renderer != null) {
            var renderer = entity.metadata.renderer;
            // ..
            // Model Rendering Properties
            // ..
            entity.model.receiveShadows = renderer.receiveshadows;
            if (renderer.lightmapstatic === true) {
                entity.model.castShadows = false;
                entity.model.castShadowsLightmap = false;
            }
            else {
                entity.model.castShadows = (renderer.shadowcastingmode.Key !== 0);
                entity.model.castShadowsLightmap = renderer.castshadowslightmap;
            }
        }
    };
    /**
     *
     * @param app Parse GLTF Material Level Meta Data
     * @param material
     * @param data
     * @param resources
     */
    CanvasTools.TranslateMaterial = function (app, material, data, resources) {
        console.log("===> Translate Material: " + material.name);
        var glossyReflections = true;
        var specularHighlights = true;
        if (data.hasOwnProperty('extras') && data.extras.hasOwnProperty('metadata')) {
            if (data.extras.metadata.hasOwnProperty('glossyreflections')) {
                glossyReflections = data.extras.metadata.glossyreflections;
            }
            if (data.extras.metadata.hasOwnProperty('specularhighlights')) {
                specularHighlights = data.extras.metadata.specularhighlights;
            }
        }
        if (glossyReflections === false)
            material.useSkybox = false;
        if (specularHighlights === true)
            specularHighlights = false;
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Parse Node Entity Functions
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    CanvasTools.ParseSceneNode = function (app, resources, onready) {
        if (app.scene != null) {
            var gltf = resources.gltf;
            if (gltf.scenes != null && gltf.scenes.length > 0) {
                var scene = gltf.scenes[0]; // Note: Only Supports One Scene Per File
                if (scene.hasOwnProperty("extras") && scene.extras.metadata != null) {
                    var component = scene.extras.metadata;
                    // ..
                    // Ambient Light & Fog Colors
                    // ..
                    var ambientLightIntensity = 1.0;
                    if (component.ambientlightintensity)
                        ambientLightIntensity = component.ambientlightintensity;
                    if (component.ambientskycolor != null)
                        app.scene.ambientLight = CanvasTools.ParseColorProperty(component.ambientskycolor);
                    if (component.fogmode != null && component.fogmode > 0) {
                        if (component.fogmode === 1)
                            app.scene.fog = pc.FOG_EXP;
                        else if (component.fogmode === 2)
                            app.scene.fog = pc.FOG_EXP2;
                        else
                            app.scene.fog = pc.FOG_LINEAR;
                        if (component.fogcolor != null)
                            app.scene.fogColor = CanvasTools.ParseColorProperty(component.fogcolor);
                        if (component.fogdensity != null)
                            app.scene.fogDensity = component.fogdensity;
                        if (component.fogstart != null)
                            app.scene.fogStart = component.fogstart;
                        if (component.fogend != null)
                            app.scene.fogEnd = component.fogend;
                    }
                    // ..
                    // TODO: Environment Skybox & Reflections
                    // ..
                    app.scene.skyboxIntensity = ambientLightIntensity;
                }
            }
        }
        else {
            console.warn("Failed to translate null scene object on file import");
        }
        if (onready != null)
            onready();
    };
    CanvasTools.ParseScriptNode = function (app, entity, data, resources, component) {
        if (component.klass != null && component.klass != "") {
            var scriptOptions = {};
            if (entity.script == null) {
                entity.addComponent("script", scriptOptions);
            }
            if (entity.script != null) {
                var args = { enabled: true };
                var stype = entity.script.create(component.klass, args);
                if (stype != null) {
                    var sany_1 = stype;
                    if (component.props != null && component.props.length > 0) {
                        if (sany_1.__proto__ != null && sany_1.__proto__.hasOwnProperty("_properties")) {
                            component.props.forEach(function (prop) {
                                if (sany_1._properties == null)
                                    sany_1._properties = {};
                                sany_1._properties[prop.name] = prop.value;
                            });
                        }
                        else if (sany_1.__scriptType != null && sany_1.__scriptType.attributes != null && sany_1.__scriptType.attributes.index != null) {
                            var attributes_1 = sany_1.__scriptType.attributes.index;
                            component.props.forEach(function (attrib) {
                                if (attributes_1.hasOwnProperty(attrib.name)) {
                                    var source = attributes_1[attrib.name];
                                    switch (source.type) {
                                        case "boolean":
                                            if (attrib.type === "Boolean") {
                                                sany_1[attrib.name] = attrib.value;
                                            }
                                            else {
                                                console.warn("Invalid Boolean Type For: " + attrib.name);
                                            }
                                            break;
                                        case "number":
                                            if (attrib.type === "Number") {
                                                sany_1[attrib.name] = attrib.value;
                                            }
                                            else {
                                                console.warn("Invalid Number Type For: " + attrib.name);
                                            }
                                            break;
                                        case "string":
                                            if (attrib.type === "String") {
                                                sany_1[attrib.name] = attrib.value;
                                            }
                                            else {
                                                console.warn("Invalid String Type For: " + attrib.name);
                                            }
                                            break;
                                        case "rgb":
                                            if (attrib.type === "Color") {
                                                sany_1[attrib.name] = CanvasTools.ParseColorProperty(attrib.value);
                                            }
                                            else {
                                                console.warn("Invalid Color Type For: " + attrib.name);
                                            }
                                            break;
                                        case "rgba":
                                            if (attrib.type === "Color") {
                                                sany_1[attrib.name] = CanvasTools.ParseColorProperty(attrib.value);
                                            }
                                            else {
                                                console.warn("Invalid Color Type For: " + attrib.name);
                                            }
                                            break;
                                        case "vec2":
                                            if (attrib.type === "Vector2") {
                                                sany_1[attrib.name] = CanvasTools.ParseVector2Property(attrib.value);
                                            }
                                            else {
                                                console.warn("Invalid Vector2 Type For: " + attrib.name);
                                            }
                                            break;
                                        case "vec3":
                                            if (attrib.type === "Vector3") {
                                                sany_1[attrib.name] = CanvasTools.ParseVector3Property(attrib.value);
                                            }
                                            else {
                                                console.warn("Invalid Vector3 Type For: " + attrib.name);
                                            }
                                            break;
                                        case "vec4":
                                            if (attrib.type === "Vector4") {
                                                sany_1[attrib.name] = CanvasTools.ParseVector4Property(attrib.value);
                                            }
                                            else {
                                                console.warn("Invalid Vector4 Type For: " + attrib.name);
                                            }
                                            break;
                                        case "json":
                                            if (attrib.type === "Json") {
                                                //sany[attrib.name] = CanvasTools.ParseJsonProperty(attrib.value);
                                            }
                                            else {
                                                //console.warn("Invalid Json Type For: " + attrib.name);
                                            }
                                            break;
                                        case "curve":
                                            if (attrib.type === "AnimationCurve") {
                                                //sany[attrib.name] = CanvasTools.ParseCurveProperty(attrib.value);
                                            }
                                            else {
                                                //console.warn("Invalid Curve Type For: " + attrib.name);
                                            }
                                            break;
                                        case "entity":
                                            if (attrib.type === "GameObject") {
                                                //sany[attrib.name] = CanvasTools.ParseEntityProperty(attrib.value);
                                            }
                                            else {
                                                //console.warn("Invalid Entity Type For: " + attrib.name);
                                            }
                                            break;
                                        case "asset":
                                            if (attrib.type === "DefaultAsset") {
                                                //sany[attrib.name] = CanvasTools.ParseAssetProperty(attrib.value);
                                            }
                                            else {
                                                //console.warn("Invalid Asset Type For: " + attrib.name);
                                            }
                                            break;
                                    }
                                }
                            });
                        }
                    }
                }
            }
            else {
                console.warn("Failed to add script component for entity: " + entity.getName());
            }
        }
    };
    CanvasTools.ParseCameraNode = function (app, entity, data, resources, component) {
        var cameraOptions = {};
        cameraOptions.type = (component.projection === 1) ? pc.PROJECTION_ORTHOGRAPHIC : pc.PROJECTION_PERSPECTIVE;
        cameraOptions.aspectRatioMode = 0; // ASPECT_AUTO
        cameraOptions.clearColor = CanvasTools.ParseColorProperty(component.backgroundcolor);
        cameraOptions.nearClip = component.nearclipplane;
        cameraOptions.farClip = component.farclipplane;
        cameraOptions.rect = new pc.Vec4(component.normalizedviewportrect.x, component.normalizedviewportrect.y, component.normalizedviewportrect.width, component.normalizedviewportrect.height);
        cameraOptions.scissorRect = new pc.Vec4(component.normalizedviewportrect.x, component.normalizedviewportrect.y, component.normalizedviewportrect.width, component.normalizedviewportrect.height);
        cameraOptions.frustumCulling = component.occlusionculling;
        cameraOptions.orthoHeight = component.orthographicsize;
        cameraOptions.fov = component.fieldofview;
        cameraOptions.clearColorBuffer = true;
        cameraOptions.clearDepthBuffer = true;
        var clearFlags = component.clearflags.Key;
        if (clearFlags === 3) { // DONT_CLEAR
            cameraOptions.clearColorBuffer = false;
            cameraOptions.clearDepthBuffer = false;
        }
        else if (clearFlags === 2) { // DEPTH_ONLY
            cameraOptions.clearColorBuffer = false;
        }
        entity.addComponent("camera", cameraOptions);
        if (entity.camera == null) {
            console.warn("Failed to add camera component for entity: " + entity.getName());
        }
    };
    CanvasTools.ParseLightNode = function (app, entity, data, resources, component) {
        var lightOptions = {};
        var lightOffset = 0;
        var lightScale = 0;
        var lightOuter = component.coneouter;
        var lightAngle = component.spotangle * component.conescale;
        var lightType = component.type.Key;
        if (lightType === 0) { // SPOT_LIGHT
            lightOptions.type = "spot";
            lightScale = component.spotscale;
            lightOffset = component.angleoffset;
        }
        else if (lightType === 2) { // POINT_LIGHT
            lightOptions.type = "point";
            lightScale = component.pointscale;
            lightOffset = 0;
        }
        else if (lightType === 3) { // AREA_LIGHT
            lightOptions.type = "point";
            lightScale = component.pointscale;
            lightOffset = 0;
        }
        else { // DIRECTIONAL_LIGHT
            lightOptions.type = "directional";
            lightScale = component.directionalscale;
            lightOffset = component.angleoffset;
        }
        // ..
        // TODO: Setup light cookie texture options
        // ..
        lightOptions.color = CanvasTools.ParseColorProperty(component.color);
        lightOptions.range = component.range;
        lightOptions.intensity = component.intensity * lightScale * component.scaling;
        lightOptions.falloffMode = component.lightfalloff;
        lightOptions.innerConeAngle = lightAngle;
        lightOptions.outerConeAngle = lightAngle + lightOuter;
        // ..
        // Setup shadaw map generation options
        // ..
        lightOptions.castShadows = component.castshadows;
        lightOptions.shadowBias = component.shadows_bias;
        lightOptions.normalOffsetBias = component.shadows_normalbias;
        lightOptions.shadowUpdateMode = component.shadowupdate;
        lightOptions.shadowResolution = component.resolution;
        lightOptions.shadowDistance = component.shadowdistance;
        lightOptions.shadowType = component.shadowtype;
        lightOptions.vsmBlurSize = component.vsmblursize;
        lightOptions.vsmBlurMode = component.vsmblurmode;
        lightOptions.vsmBias = component.vsmbias;
        // .. 
        // TODO: Prepare light map baking options
        // ..
        // lightOptions.isStatic = component.isstatic;
        // lightOptions.bake = component.lightmapbake;
        // lightOptions.bakeDir = component.lightmapdir;
        // lightOptions.affectDynamic = component.affectnonbaked;
        // lightOptions.affectLightmapped = component.affectbaked;
        // ..
        // Note: PlayCanvas Lights Require A Child Pivot Entity For Angle Offsets
        // ..
        var pivot = new pc.Entity(entity.getName() + ".Pivot");
        entity.addChild(pivot);
        if (lightOffset !== 0) {
            pivot.rotateLocal(lightOffset, 0, 0);
            pivot.rotateLocal(0, lightOffset, 0);
        }
        pivot.addComponent("light", lightOptions);
        if (pivot.light == null) {
            console.warn("Failed to add light component for entity: " + pivot.getName());
        }
        ////////////////////////////////////////////////
        // Mackey - DEBUG: Save Actual Light
        ////////////////////////////////////////////////
        var wnd = window;
        if (wnd.hasOwnProperty('chunks') && wnd.chunks != null) {
            if (!wnd.hasOwnProperty('lights') || wnd.lights == null)
                wnd.lights = [];
            wnd.lights.push(pivot);
        }
        ////////////////////////////////////////////////
    };
    // ..
    // Parse Node Helper Functions
    // ..
    CanvasTools.IsBase64DataURI = function (uri) {
        return /^data:.*,.*$/i.test(uri);
    };
    CanvasTools.ParseDataBufferUrl = function (data, resources) {
        var result = null;
        if (data.hasOwnProperty("uri")) {
            if (CanvasTools.IsBase64DataURI(data.uri)) {
                result = data.uri;
            }
            else if (resources.processUri) {
                resources.processUri(data.uri, function (uri) {
                    result = uri;
                });
            }
            else {
                result = resources.basePath + data.uri;
            }
        }
        else if (data.hasOwnProperty("bufferView")) {
            var gltf = resources.gltf;
            var buffers = resources.buffers;
            var bufferView = gltf.bufferViews[data.bufferView];
            var arrayBuffer = buffers[bufferView.buffer];
            var byteOffset = bufferView.hasOwnProperty("byteOffset") ? bufferView.byteOffset : 0;
            var imageBuffer = arrayBuffer.slice(byteOffset, byteOffset + bufferView.byteLength);
            var mimeType = data.hasOwnProperty("mimeType") ? data.mimeType : "application/octet-stream";
            var blob = new Blob([imageBuffer], { type: mimeType });
            result = URL.createObjectURL(blob);
        }
        return result;
    };
    CanvasTools.ParseColorFloats = function (floats) {
        var result = new pc.Color(0, 0, 0, 1);
        if (floats != null) {
            if (floats.length >= 4) {
                result.r = floats[0];
                result.g = floats[1];
                result.b = floats[2];
                result.a = floats[3];
            }
            else if (floats.length == 3) {
                result.r = floats[0];
                result.g = floats[1];
                result.b = floats[2];
            }
        }
        return result;
    };
    CanvasTools.ParseColorProperty = function (color) {
        var result = new pc.Color(0.0, 0.0, 0.0, 1.0);
        if (color != null) {
            if (color.r)
                result.r = color.r;
            if (color.g)
                result.g = color.g;
            if (color.b)
                result.b = color.b;
            if (color.a)
                result.a = color.a;
        }
        return result;
    };
    CanvasTools.ParseVector2Property = function (vector) {
        var result = new pc.Vec2(0.0, 0.0);
        if (vector != null) {
            if (vector.x)
                result.x = vector.x;
            if (vector.y)
                result.y = vector.y;
        }
        return result;
    };
    CanvasTools.ParseVector3Property = function (vector) {
        var result = new pc.Vec3(0.0, 0.0, 0.0);
        if (vector != null) {
            if (vector.x)
                result.x = vector.x;
            if (vector.y)
                result.y = vector.y;
            if (vector.z)
                result.z = vector.z;
        }
        return result;
    };
    CanvasTools.ParseVector4Property = function (vector) {
        var result = new pc.Vec4(0.0, 0.0, 0.0, 0.0);
        if (vector != null) {
            if (vector.x)
                result.x = vector.x;
            if (vector.y)
                result.y = vector.y;
            if (vector.z)
                result.z = vector.z;
            if (vector.w)
                result.w = vector.w;
        }
        return result;
    };
    return CanvasTools;
}());
