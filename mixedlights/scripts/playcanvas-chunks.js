//////////////////////////////////////
// Shader Chunks Text
//////////////////////////////////////
textarea_fit_text = function (textarea) {    
    var numNewlines = 1;
    var str = textarea.value;
    for (var i=0; i<str.length; i++)
        if (str[i] == "\n")
            numNewlines++;
    textarea.style.height = (numNewlines * 16) + "px";
}
textarea_enable_tab_indent = function (textarea) {    
    textarea.onkeydown = function(e) {
        if (e.keyCode == 9 || e.which == 9){
            e.preventDefault();
            var oldStart = this.selectionStart;
            var before   = this.value.substring(0, this.selectionStart);
            var selected = this.value.substring(this.selectionStart, this.selectionEnd);
            var after    = this.value.substring(this.selectionEnd);
            this.value = before + "    " + selected + after;
            this.selectionEnd = oldStart + 4;
        }
    }
}
//////////////////////////////////////
// Shader Chunks System
//////////////////////////////////////
ShaderChunks = function() {
    this.shaderchunks = document.getElementById("shaderchunks");
    
    this.shaderchunks_toggle = document.getElementById("shaderchunks_toggle");
    this.shaderchunks_toggle.onclick = function(e) {
        this.toggle();
    }.bind(this);    
    
    this.shaderchunks_regen = document.getElementById("shaderchunks_regen");
    this.shaderchunks_regen.onclick = function(e) {
        this.regenerateShaders();
    }.bind(this);    
    
    this.textareas = {};
    for (var name in pc.shaderChunks) {
        var shaderChunk = pc.shaderChunks[name];
        if (typeof shaderChunk !== "string") // there are a few functions
            continue;
        // add text
        var text = document.createElement("div");
        text.innerHTML = name;
        this.shaderchunks.appendChild(text);
        // add textarea
        var textarea = document.createElement("textarea");
        textarea.spellcheck = false;
        textarea.value = shaderChunk;
        textarea_fit_text(textarea);
        textarea_enable_tab_indent(textarea);
        textarea.shaderChunkName = name;
        textarea.originalShaderChunk = shaderChunk;
        textarea.oninput = function (e) {
            // immediately mirror textarea edits into pc.shaderChunks
            pc.shaderChunks[this.shaderChunkName] = this.value;
            //console.log(this.shaderChunkName, this.value);
        }
        this.textareas[name] = textarea;
        this.shaderchunks.appendChild(textarea);
    }
    this.shaderchunks.style.position = "absolute";
    this.shaderchunks.style.left = "0px";
    this.shaderchunks.style.top = "40px";
    this.shaderchunks.style.overflowY = "scroll";
    this.resize();
    this.disable();
}

ShaderChunks.prototype.enable = function() {
    this.shaderchunks.style.display = "";
    this.shaderchunks_regen.style.display = "";
    this.shaderchunks_toggle.value = "Hide ShaderChunks";
    this.enabled = true;
}

ShaderChunks.prototype.disable = function() {
    this.shaderchunks.style.display = "none";
    this.shaderchunks_regen.style.display = "none";
    this.shaderchunks_toggle.value = "Show ShaderChunks";
    this.enabled = false;
}

ShaderChunks.prototype.toggle = function() {
    if (this.enabled)
        this.disable();
    else
        this.enable();
}

ShaderChunks.prototype.resize = function() {
    this.shaderchunks.style.width = window.innerWidth + "px";
    this.shaderchunks.style.height = (window.innerHeight - 40) + "px";
}

ShaderChunks.prototype.regenerateShaders = function() {
    console.log("Regenerating shaders...");
    pc.app.graphicsDevice.programLib._cache = {};
    if (window.hasOwnProperty("lights") && window.lights != null) {
        var n = window.lights.length;
        for (var i=0; i<n; i++) {
            var lightPivot = window.lights[i];
            lightPivot.light.refreshProperties();            
        }
    }
    if (window.hasOwnProperty("meshes") && window.meshes != null) {
        var nn = window.meshes.length;
        for (var ii=0; ii<nn; ii++) {
            var meshInstance = window.meshes[ii];
            meshInstance.material.clearVariants();
        }
    }
}
