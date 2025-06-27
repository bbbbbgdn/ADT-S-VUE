"use strict";

var CABLES=CABLES||{};
CABLES.OPS=CABLES.OPS||{};

var Ops=Ops || {};
Ops.Gl=Ops.Gl || {};
Ops.Ui=Ops.Ui || {};
Ops.Anim=Ops.Anim || {};
Ops.Html=Ops.Html || {};
Ops.Math=Ops.Math || {};
Ops.User=Ops.User || {};
Ops.Vars=Ops.Vars || {};
Ops.Cables=Ops.Cables || {};
Ops.Number=Ops.Number || {};
Ops.String=Ops.String || {};
Ops.Devices=Ops.Devices || {};
Ops.Trigger=Ops.Trigger || {};
Ops.Html.CSS=Ops.Html.CSS || {};
Ops.TimeLine=Ops.TimeLine || {};
Ops.Gl.Meshes=Ops.Gl.Meshes || {};
Ops.Gl.Shader=Ops.Gl.Shader || {};
Ops.Html.Utils=Ops.Html.Utils || {};
Ops.Ui.Routing=Ops.Ui.Routing || {};
Ops.Gl.Textures=Ops.Gl.Textures || {};
Ops.Math.Compare=Ops.Math.Compare || {};
Ops.Devices.Mouse=Ops.Devices.Mouse || {};
Ops.User.bbbbbgdn=Ops.User.bbbbbgdn || {};
Ops.Gl.ImageCompose=Ops.Gl.ImageCompose || {};



// **************************************************************
// 
// Ops.User.bbbbbgdn.CSS_Sidebar_v1
// 
// **************************************************************

Ops.User.bbbbbgdn.CSS_Sidebar_v1= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"inc_gen_ports_js":"op.initInnerPorts=function(addedOps)\n{\n  for(let i=0;i<addedOps.length;i++)\n  {\n    if(addedOps[i].innerInput)\n    {\n    }\nif(addedOps[i].innerOutput)\n{\n}\n}\n};\n","subpatch_json":"{\"ops\":[{\"id\":\"kvgaeow77\",\"uiAttribs\":{\"subPatch\":\"557eba43w\"},\"storage\":{},\"portsIn\":[{\"name\":\"Nesting Parent\",\"value\":\".cablesContainer\"},{\"name\":\"Active\",\"value\":1}],\"objName\":\"Ops.Html.CSS.CSS_v3\"},{\"id\":\"u8r6xh6oq\",\"uiAttribs\":{\"subPatch\":\"557eba43w\"},\"storage\":{},\"portsIn\":[{\"name\":\"value\",\"value\":\"/* General Sidebar Styling */\\n.sidebar-cables {\\n    transform-origin: top left;\\n    font-size: 12px !important;\\n    overflow: scroll;\\n    scrollbar-color: rgba(255,255,255,0) rgba(255,165,0,0);\\n    scrollbar-width: 0;\\n    max-height: 90%;\\n    border-radius: 2em;\\n}\\n\\n.sidebar--closed{\\n    background: none !important;\\n    backdrop-filter: none !important;\\n}\\n\\n.sidebar__items{\\n    border: none;\\n    background: rgba(50,50,50,0.6) !important;\\n\\n}\\n\\n.sidebar__items > .sidebar__item .minus,\\n.sidebar__items > .sidebar__item .plus {\\n    width: 0;\\n    padding-left: 0.65em;\\n    line-height: 0;\\n    margin: 0 auto;\\n    height: 24px;\\n    width: 24px;\\n    transform: scale(1.1);\\n}\\n\\n\\n\\n/* Sidebar Close Button */\\n.sidebar__close-button {\\n    background: rgba(50,50,50,0.6) !important;\\n\\n    margin: 0 !important;\\n    border: none !important;\\n    background-image: none !important;\\n    min-height:20px;\\n    transition: opacity 0.3s ease;\\n    cursor: pointer;\\n}\\n\\n.sidebar__close-button:hover {\\n     opacity: 90% !important;\\n}\\n\\n/* Sidebar Icons */\\n.iconsidebar-chevron-up,\\n.sidebar__group-header-icon {\\n}\\n\\n/* Sidebar Tabs */\\n.sidebar_tabs {\\n    background: none;\\n    width: 95%;\\n    margin: 0 auto;\\n    border-bottom: 1px solid rgba(255,255,255,0.2) !important;\\n    \\n}\\n\\n.sidebar_tab {\\n    font-family: monospace;\\n    color: rgb(255,255,255) !important;\\n    background: none;\\n    border: none !important;\\n    height:1.5em;\\n    padding: 6px 10px 0px 10px;\\n}\\n\\n.sidebar_tab_active {\\n    font-style: italic;\\n    background: rgb(35,35,35) !important;\\n    color: rgb(255,255,255) !important;\\n    border: none;\\n    pointer-events: none;\\n    padding: 6px 10px 0px 10px;\\n    margin-bottom: -5px; \\n}\\n\\n.sidebar_tab_active:hover {\\n    background-color: white !important;\\n    color: black;\\n}\\n\\n/* Sidebar Header */\\n.iconsidebar-minimizebutton {\\nheight: 10px;\\n\\n}\\n\\n.iconsidebar-minimizebutton:hover{\\n    \\n}\\n\\n/* GUI Items Colors */\\n\\n.sidebar__item-label {\\n    color: white !important;\\n    font-family: monospace;\\n}\\n\\n.sidebar__slider .sidebar__text-input-input{\\n    background: transparent !important;\\n}\\n\\n.sidebar__slider-input {\\n    border: 1px solid rgba(255,255,255,0.2) !important;\\n    \\n    height: 18px;\\n    background: transparent;\\n    transition: all 0.3s ease;\\n    border-radius: 1em;\\n}\\n\\n.sidebar__slider-input:hover {\\n     background: black;\\n    opacity: 0.8;\\n}\\n\\n\\n.sidebar__color-picker-input{\\n    border: 1px solid rgba(255,255,255,0.2) !important;\\n    font-size: inherit;\\n    background: transparent !important;\\n}\\n\\n.sidebar__color-picker-input:hover, .sidebar__text-input-input:hover{\\n    opacity: 0.8;\\n    background: black !important;\\n\\n}\\n\\n.sidebar__text-input-input {\\n    margin: 1.3em;\\n    position: relative;\\n    background: transparent !important;\\n    border: 1px solid rgba(255,255,255,0.2) !important;\\n    color: white !important;\\n    font-family: monospace;\\n    font-size: 1em;\\n    margin-bottom: 10px;\\n    margin-left: 0px;\\n    min-width: 95px;\\n}\\n\\n\\n\\n.sidebar__slider-input-active-track {\\n    background: black !important;\\n    margin-top: .15em;\\n    height: 1em;\\n    filter: blur(2px);\\n    opacity: 0;\\n}\\n\\n.sidebar__button-input {\\n    font-family: monospace;\\n    color: white !important;\\n    background-color: rgba(255,255,255,0.1);\\n    line-height: 100%;\\n    height: 3em;\\n    border: none;\\n    border-radius: .4em;\\n    padding: 1em 1.2em;\\n    transition: all .3s ease;\\n    mix-blend-mode: difference;\\n}\\n\\n.sidebar__button-input:hover {\\n    font-style: italic;\\n    opacity: 1;\\n    color: black;\\n    border: none;\\n}\\n.sidebar__button-input:active {\\n    font-style: italic;\\n}\\n\\n.sidebar__color-picker-input {\\n    color: white !important;\\n    font-family: monospace;\\n    margin-left: -1em !important;\\n    transition: all 0.2s ease;\\n}\\n\\n.sidebar__select-select {\\n    color: white;\\n    background-color: transparent;\\n    border: 1px solid rgba(255,255,255,0.2) !important;\\n    width: 50%;\\n    border-radius: 10px;\\n    min-height: 19px;\\n    position: relative;\\n    right: 15px;\\n}\\n\\n#file{\\n    padding-top: 1em;\\n}\\n\\n.sidebar__select-select:hover {\\n    background-color: black;\\n    color: black;\\n   opacity: 0.8;\\n    transition: all 0.2s ease;\\n}\\n\\n.sidebar__color-picker-color-input {\\n    transform: scale(2);\\n    margin-left: 1em;\\n}\\n\\n/* Single Items */\\n.sidebar__items {\\n    background-color: black;\\n    padding-top: 1em;\\n    padding-bottom: 1em;\\n}\\n\\n/* Grouped Items */\\n\\n.sidebar__group {\\nmin-height: 40px;\\ntransition: all .4s ease;\\nbackground: none !important;\\n}\\n\\n.sidebar__group-header  {\\n    background: none;\\n    background: rgba(50,50,50,0.6) !important;\\n    height: 40px !important;\\n    font-family: serif;\\n    color: white;\\n    padding-top:1em;\\n    transition: background .5s ease;\\n     padding: 7px;\\n    border: 1px solid transparent;\\n}\\n\\n\\n.sidebar__group-header.cablesEle{\\n     background: transparent !important;\\n}\\n\\n.sidebar__group--closed .sidebar__group-header {\\n   \\n}\\n\\n.sidebar__group-header:hover {\\n    opacity: 90%;\\n}\\n\\n.sidebar__group-header-title{\\n}\\n\\n\\n.sidebar__group-header-title-text {\\n    color: white !important;\\n    font-family: monospace;\\n    font-size: 1em;\\n    opacity: 0.5;   \\n}\\n\\n.sidebar__group-header-title-text::before{\\n  content: '.';\\n}\\n\\n.sidebar__group-header-title-text::after{\\n  content: '.';\\n}\\n\\n.sidebar__group--closed{\\n    margin-top: 4px ;\\n    margin-left:15px;\\n    margin-right:15px;\\n\\n    border: 1px solid white;\\n}\\n\\n.sidebar__group--closed  .sidebar__group-header-title-text{\\n    color: rgb(255,255,255) !important;\\n    opacity: 1;\\n    border:none !important;\\n}\\n\\n.sidebar__group-header-title-text::after{\\n}\\n\\n\\n.sidebar__group-header-icon{\\n    opacity: 0 !important;\\n}\\n\\n.sidebar__greyout {\\n    background-color: rgba(50, 50, 50, 0.5);\\n    filter: contrast(40%);\\n    \\n    /*mix-blend-mode: exclude;*/\\n    opacity: 100%;\\n    width: 95%;\\n    margin: 0 2.5%;\\n\\n}\\n\\n.sidebar__greyout:hover{\\n\\n}\\n\\n/* Canvas Element */\\n.cablesEle canvas {\\n/*     filter: invert(100%); */\\n    cursor: crosshair;\\n    margin: 0 auto;\\n}\\n\\n.cablesEle{\\n    margin-bottom: .6em;\\n}\\n\"},{\"name\":\"Syntax index\",\"value\":2},{\"name\":\"Syntax\",\"value\":\"css\"}],\"portsOut\":[{\"name\":\"Result\",\"links\":[{\"portIn\":\"css code\",\"portOut\":\"Result\",\"objIn\":\"kvgaeow77\",\"objOut\":\"u8r6xh6oq\"}]}],\"objName\":\"Ops.String.StringEditor\"},{\"id\":\"xd6o11fhy\",\"uiAttribs\":{\"subPatch\":\"557eba43w\"},\"storage\":{},\"objName\":\"Ops.Ui.SubPatchInput\"},{\"id\":\"lgxx7r4od\",\"uiAttribs\":{\"subPatch\":\"557eba43w\"},\"storage\":{},\"objName\":\"Ops.Ui.SubPatchOutput\"},{\"id\":\"049hedq4x\",\"uiAttribs\":{\"subPatch\":\"557eba43w\"},\"storage\":{},\"portsIn\":[{\"name\":\"css code\",\"value\":\"#cablescanvas>div, .sidebar--closed{\\nbackground: rgba(30,30,30,.5);\\n   backdrop-filter: blur(15px);\\n   margin: 0 !important;\\n}\\n\\n#cablescanvas>div.sidebar--closed{\\n    border-radius: 100% !important;\\n}\\n\\n\\n#cablescanvas>div{\\n    /*background: none;*/\\n}\\n\\n.feather-volume-2{\\n    transform: scale(.8);\\n}\\n\\n.sidebar__close-button {\\n    \\n}\"},{\"name\":\"Nesting Parent\",\"value\":\"\"},{\"name\":\"Active\",\"value\":1}],\"objName\":\"Ops.Html.CSS.CSS_v3\"},{\"id\":\"urbc44kq4\",\"uiAttribs\":{\"subPatch\":\"557eba43w\"},\"storage\":{},\"portsIn\":[{\"name\":\"css code\",\"value\":\".progressUI{\\nposition: absolute;\\nleft: 50%;\\n}\"},{\"name\":\"Nesting Parent\",\"value\":\"\"},{\"name\":\"Active\",\"value\":1}],\"objName\":\"Ops.Html.CSS.CSS_v3\"},{\"id\":\"cjw7ca0pl\",\"uiAttribs\":{\"subPatch\":\"557eba43w\"},\"storage\":{},\"portsIn\":[{\"name\":\"css code\",\"value\":\"#glcanvas{\\n    image-rendering: pixelated;\\n}\"},{\"name\":\"Nesting Parent\",\"value\":\"\"},{\"name\":\"Active\",\"value\":1}],\"objName\":\"Ops.Html.CSS.CSS_v3\"}]}",};
op.initInnerPorts=function(addedOps)
{
  for(let i=0;i<addedOps.length;i++)
  {
    if(addedOps[i].innerInput)
    {
    }
if(addedOps[i].innerOutput)
{
}
}
};

const patchId = "bp2sub_" + op.id;

new CABLES.SubPatchOp(op, { "subId": patchId });

initializeSubpatch();

function initializeSubpatch()
{
    const p = JSON.parse(attachments.subpatch_json);

    CABLES.Patch.replaceOpIds(p,
        {
            "parentSubPatchId": patchId,
            "prefixHash": patchId,
            "oldIdAsRef": true,
            "doNotUnlinkLostLinks": true
        });

    for (let i = 0; i < p.ops.length; i++)
    {
        p.ops[i].uiAttribs.blueprintSubpatch2 = true;
    }

    op.loadDependencies(p, () =>
    {
        op.patch.deSerialize(p, { "opsCreated": op.initInnerPorts });
        if (CABLES.UI)gui.savedState.setSaved("blueprintloaded", patchId);
        op.patch.emitEvent("subpatchExpose", patchId);
        op.setStorage({ "blueprintVer": 2 });
        op.patch.emitEvent("subpatchExpose", patchId);
    });
}

}
};

CABLES.OPS["5b5ea90c-48d6-4e63-9d20-c74f1b453766"]={f:Ops.User.bbbbbgdn.CSS_Sidebar_v1,objName:"Ops.User.bbbbbgdn.CSS_Sidebar_v1"};




// **************************************************************
// 
// Ops.Html.CSS.CSS_v3
// 
// **************************************************************

Ops.Html.CSS.CSS_v3= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    code = op.inStringEditor("css code"),
    nest = op.inString("Nesting Parent", ""),
    inActive = op.inBool("Active", true);

code.setUiAttribs(
    {
        "editorSyntax": "css",
        "ignoreBigPort": true
    });

let styleEle = null;
const eleId = "css_" + CABLES.uuid();

nest.onChange =
code.onChange = update;
update();

inActive.onChange = () =>
{
    if (!inActive.get())styleEle.remove();
    else addElement();
};

function getCssContent()
{
    let css = code.get();

    if (nest.get())
    {
        css = nest.get() + "\n{\n" + css + "\n}\n";
    }

    if (css)
        css = css.replace(new RegExp("{{ASSETPATH}}", "g"), op.patch.getAssetPath());

    return css;
}

function update()
{
    styleEle = op.patch.getDocument().getElementById(eleId);

    if (styleEle)
    {
        styleEle.textContent = getCssContent();
    }
    else
    {
        styleEle = op.patch.getDocument().createElement("style");
        styleEle.type = "text/css";
        styleEle.id = eleId;
        styleEle.textContent = attachments.css_spinner;
        styleEle.classList.add("cablesEle");
        addElement();
    }
}

function addElement()
{
    const head = op.patch.getDocument().getElementsByTagName("body")[0];
    head.appendChild(styleEle);
}

op.onDelete = function ()
{
    styleEle = op.patch.getDocument().getElementById(eleId);
    if (styleEle)styleEle.remove();
};

}
};

CABLES.OPS["aa44a0e9-b9fe-4eed-93a3-38e41a91b623"]={f:Ops.Html.CSS.CSS_v3,objName:"Ops.Html.CSS.CSS_v3"};




// **************************************************************
// 
// Ops.String.StringEditor
// 
// **************************************************************

Ops.String.StringEditor= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    v = op.inStringEditor("value", ""),
    syntax = op.inValueSelect("Syntax", ["text", "glsl", "css", "html", "xml", "json", "javascript", "inline-css", "sql"], "text"),
    result = op.outString("Result");

syntax.onChange = updateSyntax;

function updateSyntax()
{
    let s = syntax.get();
    if (s == "javascript")s = "js";
    v.setUiAttribs({ "editorSyntax": s });
}

v.onChange = function ()
{
    result.set(v.get());
};

}
};

CABLES.OPS["6468b7c1-f63e-4db4-b809-4b203d27ead3"]={f:Ops.String.StringEditor,objName:"Ops.String.StringEditor"};




// **************************************************************
// 
// Ops.Ui.SubPatchInput
// 
// **************************************************************

Ops.Ui.SubPatchInput= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
op.innerInput = true;

const goto = op.inTriggerButton("Goto SubPatchOp");
goto.setUiAttribs({ "hidePort": true });
goto.onTriggered = () =>
{
    const parent = op.patch.getSubPatchOuterOp(op.uiAttribs.subPatch);
    gui.patchView.centerSelectOp(parent.id);
};

}
};

CABLES.OPS["c4e4e933-136e-479e-8de8-0b35b75d9217"]={f:Ops.Ui.SubPatchInput,objName:"Ops.Ui.SubPatchInput"};




// **************************************************************
// 
// Ops.Ui.SubPatchOutput
// 
// **************************************************************

Ops.Ui.SubPatchOutput= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
op.innerOutput = true;

}
};

CABLES.OPS["02d45073-7936-4830-81ad-59a162febf1f"]={f:Ops.Ui.SubPatchOutput,objName:"Ops.Ui.SubPatchOutput"};




// **************************************************************
// 
// Ops.Gl.Textures.VideoTexture_v3
// 
// **************************************************************

Ops.Gl.Textures.VideoTexture_v3= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    inExec = op.inTrigger("Update"),
    filename = op.inUrl("file", "video"),
    play = op.inValueBool("play"),
    loop = op.inValueBool("loop", true),

    volume = op.inValueSlider("Volume", 1),
    muted = op.inValueBool("mute", true),

    fps = op.inValueFloat("Update FPS", 30),
    tfilter = op.inSwitch("Filter", ["nearest", "linear"], "linear"),
    wrap = op.inValueSelect("Wrap", ["repeat", "mirrored repeat", "clamp to edge"], "clamp to edge"),
    flip = op.inValueBool("flip", true),

    speed = op.inValueFloat("speed", 1),
    time = op.inValueFloat("set time"),
    rewind = op.inTriggerButton("Rewind"),

    inPreload = op.inValueBool("Preload", true),
    inShowSusp = op.inBool("Show Interaction needed Button", true),

    outNext = op.outTrigger("Next"),
    textureOut = op.outTexture("texture", null, "texture"),
    outDuration = op.outNumber("duration"),
    outProgress = op.outNumber("progress"),
    outInteractionNeeded = op.outBoolNum("Interaction Needed"),
    outTime = op.outNumber("CurrentTime"),
    loading = op.outBoolNum("Loading"),
    outPlaying = op.outBoolNum("Playing"),
    canPlayThrough = op.outBoolNum("Can Play Through", false),

    outWidth = op.outNumber("Width"),
    outHeight = op.outNumber("Height"),
    outAspect = op.outNumber("Aspect Ratio"),
    outHasError = op.outBoolNum("Has Error"),
    outAutoFPS = op.outBoolNum("Auto FPS", false),
    outError = op.outString("Error Message");

op.setPortGroup("Texture", [tfilter, wrap, flip, fps]);
op.setPortGroup("Audio", [muted, volume]);
op.setPortGroup("Timing", [time, rewind, speed]);

let videoElementPlaying = false;
let embedded = false;
let interActionNeededButton = false;
let addedListeners = false;
let cgl_filter = 0;
let cgl_wrap = 0;
let tex = null;
let timeout = null;
let firstTime = true;
let needsUpdate = true;
let lastTime = 0;

const cgl = op.patch.cgl;
const videoElement = document.createElement("video");
videoElement.setAttribute("playsinline", "");
videoElement.setAttribute("webkit-playsinline", "");
videoElement.setAttribute("autoplay", "autoplay");

outAutoFPS.set(!!videoElement.requestVideoFrameCallback);

const emptyTexture = CGL.Texture.getEmptyTexture(cgl);
op.toWorkPortsNeedToBeLinked(textureOut);

textureOut.setRef(CGL.Texture.getEmptyTexture(cgl));
play.onChange = updatePlayState;
filename.onChange = reload;

volume.onChange =
    op.onMasterVolumeChanged = updateVolume;

tfilter.onChange = wrap.onChange = () =>
{
    if (tex)tex.delete();
    tex = null;
};

op.onDelete = () =>
{
    if (tex)tex.delete();
    videoElement.remove();
};

inExec.onTriggered = () =>
{
    if (performance.now() - lastTime > 1000 / fps.get())needsUpdate = true;

    if (needsUpdate)
    {
        updateTexture();
    }

    outPlaying.set(!videoElement.paused);

    if (interActionNeededButton && !videoElement.paused && play.get())
    {
        // remove button after player says no but plays anyhow after some time...
        interActionNeededButton = false;
        CABLES.interActionNeededButton.remove("videoplayer");
    }
    outInteractionNeeded.set(interActionNeededButton);

    outNext.trigger();
};

function reInitTexture()
{
    if (tex)tex.delete();

    cgl_filter = CGL.Texture.FILTER_NEAREST;
    if (tfilter.get() == "linear") cgl_filter = CGL.Texture.FILTER_LINEAR;

    if (wrap.get() == "repeat") cgl_wrap = CGL.Texture.WRAP_REPEAT;
    if (wrap.get() == "mirrored repeat") cgl_wrap = CGL.Texture.WRAP_MIRRORED_REPEAT;
    if (wrap.get() == "clamp to edge") cgl_wrap = CGL.Texture.WRAP_CLAMP_TO_EDGE;

    tex = new CGL.Texture(cgl,
        {
            "wrap": cgl_wrap,
            "filter": cgl_filter
        });
}

rewind.onTriggered = function ()
{
    videoElement.currentTime = 0;
    textureOut.setRef(emptyTexture);
    needsUpdate = true;
};

time.onChange = function ()
{
    videoElement.currentTime = time.get() || 0;
    needsUpdate = true;
};

fps.onChange = function ()
{
    needsUpdate = true;
};

function doPlay()
{
    videoElement.playbackRate = speed.get();
}

function updatePlayState()
{
    op.setUiError("playvideo", null);
    embedVideo(true);

    if (play.get())
    {
        videoElement.currentTime = time.get() || 0;

        const promise = videoElement.play();

        if (promise)
            promise.then(function ()
            {
                doPlay();
            }).catch(function (error)
            {
                op.setUiError("playvideo", error.message);
                op.logWarn("exc", error);
                op.log(error);
                op.log(videoElement);

                if (videoElement.paused && inShowSusp.get())
                {
                    op.setUiError("playvideo", null);
                    interActionNeededButton = true;
                    CABLES.interActionNeededButton.add(op.patch, "videoplayer", () =>
                    {
                        interActionNeededButton = false;
                        videoElement.play().then(() =>
                        {
                            doPlay();
                            CABLES.interActionNeededButton.remove("videoplayer");
                        }).catch((e) =>
                        {
                            op.setUiError("playvideo", e.message);
                            op.logWarn("playvideo", e);
                        });
                    });
                }
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
            });
    }
    else videoElement.pause();
}

speed.onChange = function ()
{
    try
    {
        op.setUiError("playbackRate", null);
        videoElement.playbackRate = speed.get();
    }
    catch (e)
    {
        op.setUiError("playbackRate", "value for 'speed' not supported by browser", 1);
    }
};

loop.onChange = function ()
{
    videoElement.loop = loop.get();
};

muted.onChange = function ()
{
    videoElement.muted = muted.get();
};

function updateTexture()
{
    const force = needsUpdate;
    lastTime = performance.now();

    if (!filename.get())
    {
        tex = null;
        textureOut.set(emptyTexture);
        return;
    }

    if (!videoElementPlaying) return;

    if (!tex)reInitTexture();
    if (tex.width != videoElement.videoWidth || tex.height != videoElement.videoHeight)
    {
        // op.log("video size", videoElement.videoWidth, videoElement.videoHeight);
        tex.setSize(videoElement.videoWidth, videoElement.videoHeight);
    }

    outWidth.set(tex.width);
    outHeight.set(tex.height);
    outAspect.set(tex.width / tex.height);

    if (!canPlayThrough.get()) return;
    if (!videoElementPlaying) return;
    if (!videoElement) return;
    if (videoElement.videoHeight <= 0)
    {
        op.setUiError("videosize", "video width is 0!");
        // op.log(videoElement);
        return;
    }
    if (videoElement.videoWidth <= 0)
    {
        op.setUiError("videosize", "video height is 0!");
        // op.log(videoElement);
        return;
    }

    const perc = (videoElement.currentTime) / videoElement.duration;
    if (!isNaN(perc)) outProgress.set(perc);

    outTime.set(videoElement.currentTime);

    cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, tex.tex);

    // if (firstTime)
    // {
    cgl.gl.pixelStorei(cgl.gl.UNPACK_FLIP_Y_WEBGL, flip.get());
    cgl.gl.texImage2D(cgl.gl.TEXTURE_2D, 0, cgl.gl.RGBA, cgl.gl.RGBA, cgl.gl.UNSIGNED_BYTE, videoElement);
    tex._setFilter();
    // }
    // else
    // {
    // cgl.gl.pixelStorei(cgl.gl.UNPACK_FLIP_Y_WEBGL, flip.get());
    // cgl.gl.texSubImage2D(cgl.gl.TEXTURE_2D, 0, 0, 0, cgl.gl.RGBA, cgl.gl.UNSIGNED_BYTE, videoElement);
    // }

    if (flip.get()) cgl.gl.pixelStorei(cgl.gl.UNPACK_FLIP_Y_WEBGL, false);

    firstTime = false;

    textureOut.setRef(tex);
    needsUpdate = false;

    op.patch.cgl.profileData.profileVideosPlaying++;

    if (videoElement.readyState == 4) loading.set(false);
    else loading.set(false);

    if (videoElement.requestVideoFrameCallback)
        videoElement.requestVideoFrameCallback(
            () =>
            {
                needsUpdate = true;
            }
        );
}

function initVideo()
{
    videoElement.controls = false;
    videoElement.muted = muted.get();
    videoElement.loop = loop.get();

    needsUpdate = true;
    canPlayThrough.set(true);
}

function updateVolume()
{
    videoElement.volume = Math.min(1, Math.max(0, (volume.get() || 0) * op.patch.config.masterVolume));
}

function loadedMetaData()
{
    outDuration.set(videoElement.duration);
    updatePlayState();
}

function embedVideo(force)
{
    if (embedded) return;

    outHasError.set(false);
    outError.set("");
    canPlayThrough.set(false);
    if (filename.get() && String(filename.get()).length > 1) firstTime = true;

    if (!filename.get())
    {
        outError.set(true);
    }

    if (inPreload.get() || force)
    {
        clearTimeout(timeout);
        loading.set(true);
        videoElement.preload = "true";

        let url = op.patch.getFilePath(filename.get());
        if (String(filename.get()).indexOf("data:") == 0) url = filename.get();
        if (!url) return;

        op.setUiError("onerror", null);
        videoElement.style.display = "none";
        videoElement.setAttribute("src", url);
        videoElement.setAttribute("crossOrigin", "anonymous");
        try
        {
            op.setUiError("playbackRate", null);
            videoElement.playbackRate = speed.get();
        }
        catch (e)
        {
            op.setUiError("playbackRate", "value for 'speed' not supported by browser", 1);
        }
        if (!addedListeners)
        {
            addedListeners = true;
            videoElement.addEventListener("canplaythrough", initVideo, true);
            videoElement.addEventListener("loadedmetadata", loadedMetaData);
            videoElement.addEventListener("playing", function () { videoElementPlaying = true; }, true);
            videoElement.onerror = function ()
            {
                outHasError.set(true);
                if (videoElement)
                {
                    outError.set("Error " + videoElement.error.code + "/" + videoElement.error.message);
                    op.setUiError("onerror", "Could not load video / " + videoElement.error.message, 2);
                }
            };
        }
        embedded = true;
    }
}

function loadVideo()
{
    setTimeout(embedVideo, 100);
}

function reload()
{
    if (!filename.get()) return;
    embedded = false;
    loadVideo();
}

}
};

CABLES.OPS["9d66516f-d234-4114-b1d3-67b8e60f5dc6"]={f:Ops.Gl.Textures.VideoTexture_v3,objName:"Ops.Gl.Textures.VideoTexture_v3"};




// **************************************************************
// 
// Ops.Gl.Meshes.FullscreenRectangle_v2
// 
// **************************************************************

Ops.Gl.Meshes.FullscreenRectangle_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"shader_frag":"UNI sampler2D tex;\nIN vec2 texCoord;\n\nvoid main()\n{\n    outColor= texture(tex,texCoord);\n}\n\n","shader_vert":"{{MODULES_HEAD}}\n\nIN vec3 vPosition;\nUNI mat4 projMatrix;\nUNI mat4 mvMatrix;\n\nOUT vec2 texCoord;\nIN vec2 attrTexCoord;\n\nvoid main()\n{\n   vec4 pos=vec4(vPosition,  1.0);\n\n   texCoord=vec2(attrTexCoord.x,(1.0-attrTexCoord.y));\n\n   gl_Position = projMatrix * mvMatrix * pos;\n}\n",};
const
    render = op.inTrigger("render"),
    inScale = op.inSwitch("Scale", ["Stretch", "Fit"], "Fit"),
    flipY = op.inValueBool("Flip Y"),
    flipX = op.inValueBool("Flip X"),
    inTexture = op.inTexture("Texture"),
    trigger = op.outTrigger("trigger");

const cgl = op.patch.cgl;
let mesh = null;
let geom = new CGL.Geometry("fullscreen rectangle");
let x = 0, y = 0, w = 0, h = 0;

op.toWorkShouldNotBeChild("Ops.Gl.TextureEffects.ImageCompose", CABLES.OP_PORT_TYPE_FUNCTION);
op.toWorkPortsNeedToBeLinked(render);

flipX.onChange = rebuildFlip;
flipY.onChange = rebuildFlip;
render.onTriggered = doRender;
inTexture.onLinkChanged = updateUi;
inScale.onChange = updateScale;

const shader = new CGL.Shader(cgl, "fullscreenrectangle", this);
shader.setModules(["MODULE_VERTEX_POSITION", "MODULE_COLOR", "MODULE_BEGIN_FRAG"]);

shader.setSource(attachments.shader_vert, attachments.shader_frag);
shader.fullscreenRectUniform = new CGL.Uniform(shader, "t", "tex", 0);
shader.aspectUni = new CGL.Uniform(shader, "f", "aspectTex", 0);

let useShader = false;
let updateShaderLater = true;
let fitImageAspect = false;

updateUi();
updateScale();

inTexture.onChange = function ()
{
    updateShaderLater = true;
};

function updateUi()
{
    if (!CABLES.UI) return;
    flipY.setUiAttribs({ "greyout": !inTexture.isLinked() });
    flipX.setUiAttribs({ "greyout": !inTexture.isLinked() });
    inScale.setUiAttribs({ "greyout": !inTexture.isLinked() });
}

function updateShader()
{
    let tex = inTexture.get();
    if (tex) useShader = true;
    else useShader = false;
}

op.preRender = function ()
{
    updateShader();
    shader.bind();
    if (mesh)mesh.render(shader);
    doRender();
};

function updateScale()
{
    fitImageAspect = inScale.get() == "Fit";
}

function doRender()
{
    if (cgl.viewPort[2] != w || cgl.viewPort[3] != h || !mesh) rebuild();

    if (updateShaderLater) updateShader();

    cgl.pushPMatrix();
    mat4.identity(cgl.pMatrix);
    mat4.ortho(cgl.pMatrix, 0, w, h, 0, -10.0, 1000);

    cgl.pushModelMatrix();
    mat4.identity(cgl.mMatrix);

    cgl.pushViewMatrix();
    mat4.identity(cgl.vMatrix);

    if (fitImageAspect && inTexture.get())
    {
        const rat = inTexture.get().width / inTexture.get().height;

        let _h = h;
        let _w = h * rat;

        if (_w > w)
        {
            _h = w * 1 / rat;
            _w = w;
        }

        cgl.pushViewPort((w - _w) / 2, (h - _h) / 2, _w, _h);
    }

    if (useShader)
    {
        if (inTexture.get()) cgl.setTexture(0, inTexture.get().tex);
        mesh.render(shader);
    }
    else
    {
        mesh.render(cgl.getShader());
    }

    cgl.gl.clear(cgl.gl.DEPTH_BUFFER_BIT);

    cgl.popPMatrix();
    cgl.popModelMatrix();
    cgl.popViewMatrix();

    if (fitImageAspect && inTexture.get()) cgl.popViewPort();

    trigger.trigger();
}

function rebuildFlip()
{
    mesh = null;
}

function rebuild()
{
    if (cgl.viewPort[2] == w && cgl.viewPort[3] == h && mesh) return;

    let xx = 0, xy = 0;

    w = cgl.viewPort[2];
    h = cgl.viewPort[3];

    geom.vertices = new Float32Array([
        xx + w, xy + h, 0.0,
        xx, xy + h, 0.0,
        xx + w, xy, 0.0,
        xx, xy, 0.0
    ]);

    let tc = null;

    if (flipY.get())
        tc = new Float32Array([
            1.0, 0.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ]);
    else
        tc = new Float32Array([
            1.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            0.0, 0.0
        ]);

    if (flipX.get())
    {
        tc[0] = 0.0;
        tc[2] = 1.0;
        tc[4] = 0.0;
        tc[6] = 1.0;
    }

    geom.setTexCoords(tc);

    geom.verticesIndices = new Uint16Array([
        2, 1, 0,
        3, 1, 2
    ]);

    geom.vertexNormals = new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ]);
    geom.tangents = new Float32Array([
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0]);
    geom.biTangents == new Float32Array([
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0]);

    if (!mesh) mesh = new CGL.Mesh(cgl, geom);
    else mesh.setGeom(geom);
}

}
};

CABLES.OPS["fb70721a-eac2-4ff5-a5a2-5c59e2393972"]={f:Ops.Gl.Meshes.FullscreenRectangle_v2,objName:"Ops.Gl.Meshes.FullscreenRectangle_v2"};




// **************************************************************
// 
// Ops.Trigger.SequenceMultiPort
// 
// **************************************************************

Ops.Trigger.SequenceMultiPort= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    inTrigs = op.inMultiPort("Input", CABLES.OP_PORT_TYPE_FUNCTION),
    outTrigs = op.outMultiPort("Output", CABLES.OP_PORT_TYPE_FUNCTION);

// op.setUiAttrib({ "resizable": true, "resizableY": false, "stretchPorts": true });

inTrigs.onTriggered = (index) =>
{
    const ports = outTrigs.get();

    for (let i = 0; i < ports.length; i++)
    {
        ports[i].trigger();
    }
};

}
};

CABLES.OPS["be066ff6-85e2-408a-9570-59fb7abff7b2"]={f:Ops.Trigger.SequenceMultiPort,objName:"Ops.Trigger.SequenceMultiPort"};




// **************************************************************
// 
// Ops.Gl.Shader.BasicMaterial_v3
// 
// **************************************************************

Ops.Gl.Shader.BasicMaterial_v3= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"basicmaterial_frag":"{{MODULES_HEAD}}\n\nIN vec2 texCoord;\n\n#ifdef VERTEX_COLORS\nIN vec4 vertCol;\n#endif\n\n#ifdef HAS_TEXTURES\n    IN vec2 texCoordOrig;\n    #ifdef HAS_TEXTURE_DIFFUSE\n        UNI sampler2D tex;\n    #endif\n    #ifdef HAS_TEXTURE_OPACITY\n        UNI sampler2D texOpacity;\n   #endif\n#endif\n\n\n\nvoid main()\n{\n    {{MODULE_BEGIN_FRAG}}\n    vec4 col=color;\n\n\n    #ifdef HAS_TEXTURES\n        vec2 uv=texCoord;\n\n        #ifdef CROP_TEXCOORDS\n            if(uv.x<0.0 || uv.x>1.0 || uv.y<0.0 || uv.y>1.0) discard;\n        #endif\n\n        #ifdef HAS_TEXTURE_DIFFUSE\n            col=texture(tex,uv);\n\n            #ifdef COLORIZE_TEXTURE\n                col.r*=color.r;\n                col.g*=color.g;\n                col.b*=color.b;\n            #endif\n        #endif\n        col.a*=color.a;\n        #ifdef HAS_TEXTURE_OPACITY\n            #ifdef TRANSFORMALPHATEXCOORDS\n                uv=texCoordOrig;\n            #endif\n            #ifdef ALPHA_MASK_IR\n                col.a*=1.0-texture(texOpacity,uv).r;\n            #endif\n            #ifdef ALPHA_MASK_IALPHA\n                col.a*=1.0-texture(texOpacity,uv).a;\n            #endif\n            #ifdef ALPHA_MASK_ALPHA\n                col.a*=texture(texOpacity,uv).a;\n            #endif\n            #ifdef ALPHA_MASK_LUMI\n                col.a*=dot(vec3(0.2126,0.7152,0.0722), texture(texOpacity,uv).rgb);\n            #endif\n            #ifdef ALPHA_MASK_R\n                col.a*=texture(texOpacity,uv).r;\n            #endif\n            #ifdef ALPHA_MASK_G\n                col.a*=texture(texOpacity,uv).g;\n            #endif\n            #ifdef ALPHA_MASK_B\n                col.a*=texture(texOpacity,uv).b;\n            #endif\n            // #endif\n        #endif\n    #endif\n\n    {{MODULE_COLOR}}\n\n    #ifdef DISCARDTRANS\n        if(col.a<0.2) discard;\n    #endif\n\n    #ifdef VERTEX_COLORS\n        col*=vertCol;\n    #endif\n\n    outColor = col;\n}\n","basicmaterial_vert":"\n{{MODULES_HEAD}}\n\nOUT vec2 texCoord;\nOUT vec2 texCoordOrig;\n\nUNI mat4 projMatrix;\nUNI mat4 modelMatrix;\nUNI mat4 viewMatrix;\n\n#ifdef HAS_TEXTURES\n    UNI float diffuseRepeatX;\n    UNI float diffuseRepeatY;\n    UNI float texOffsetX;\n    UNI float texOffsetY;\n#endif\n\n#ifdef VERTEX_COLORS\n    in vec4 attrVertColor;\n    out vec4 vertCol;\n\n#endif\n\n\nvoid main()\n{\n    mat4 mMatrix=modelMatrix;\n    mat4 modelViewMatrix;\n\n    norm=attrVertNormal;\n    texCoordOrig=attrTexCoord;\n    texCoord=attrTexCoord;\n    #ifdef HAS_TEXTURES\n        texCoord.x=texCoord.x*diffuseRepeatX+texOffsetX;\n        texCoord.y=(1.0-texCoord.y)*diffuseRepeatY+texOffsetY;\n    #endif\n\n    #ifdef VERTEX_COLORS\n        vertCol=attrVertColor;\n    #endif\n\n    vec4 pos = vec4(vPosition, 1.0);\n\n    #ifdef BILLBOARD\n       vec3 position=vPosition;\n       modelViewMatrix=viewMatrix*modelMatrix;\n\n       gl_Position = projMatrix * modelViewMatrix * vec4((\n           position.x * vec3(\n               modelViewMatrix[0][0],\n               modelViewMatrix[1][0],\n               modelViewMatrix[2][0] ) +\n           position.y * vec3(\n               modelViewMatrix[0][1],\n               modelViewMatrix[1][1],\n               modelViewMatrix[2][1]) ), 1.0);\n    #endif\n\n    {{MODULE_VERTEX_POSITION}}\n\n    #ifndef BILLBOARD\n        modelViewMatrix=viewMatrix * mMatrix;\n\n        {{MODULE_VERTEX_MODELVIEW}}\n\n    #endif\n\n    // mat4 modelViewMatrix=viewMatrix*mMatrix;\n\n    #ifndef BILLBOARD\n        // gl_Position = projMatrix * viewMatrix * modelMatrix * pos;\n        gl_Position = projMatrix * modelViewMatrix * pos;\n    #endif\n}\n",};
const render = op.inTrigger("render");
const trigger = op.outTrigger("trigger");
const shaderOut = op.outObject("shader", null, "shader");

shaderOut.ignoreValueSerialize = true;

op.toWorkPortsNeedToBeLinked(render);
op.toWorkShouldNotBeChild("Ops.Gl.TextureEffects.ImageCompose", CABLES.OP_PORT_TYPE_FUNCTION);

const cgl = op.patch.cgl;

const shader = new CGL.Shader(cgl, "basicmaterial", this);
shader.addAttribute({ "type": "vec3", "name": "vPosition" });
shader.addAttribute({ "type": "vec2", "name": "attrTexCoord" });
shader.addAttribute({ "type": "vec3", "name": "attrVertNormal", "nameFrag": "norm" });
shader.addAttribute({ "type": "float", "name": "attrVertIndex" });

shader.setModules(["MODULE_VERTEX_POSITION", "MODULE_COLOR", "MODULE_BEGIN_FRAG", "MODULE_VERTEX_MODELVIEW"]);

shader.setSource(attachments.basicmaterial_vert, attachments.basicmaterial_frag);

shaderOut.setRef(shader);

render.onTriggered = doRender;

// rgba colors
const r = op.inValueSlider("r", Math.random());
const g = op.inValueSlider("g", Math.random());
const b = op.inValueSlider("b", Math.random());
const a = op.inValueSlider("a", 1);
r.setUiAttribs({ "colorPick": true });

// const uniColor=new CGL.Uniform(shader,'4f','color',r,g,b,a);
const colUni = shader.addUniformFrag("4f", "color", r, g, b, a);

shader.uniformColorDiffuse = colUni;

// diffuse outTexture

const diffuseTexture = op.inTexture("texture");
let diffuseTextureUniform = null;
diffuseTexture.onChange = updateDiffuseTexture;

const colorizeTexture = op.inValueBool("colorizeTexture", false);
const vertexColors = op.inValueBool("Vertex Colors", false);

// opacity texture
const textureOpacity = op.inTexture("textureOpacity");
let textureOpacityUniform = null;

const alphaMaskSource = op.inSwitch("Alpha Mask Source", ["Luminance", "R", "G", "B", "A", "1-A", "1-R"], "Luminance");
alphaMaskSource.setUiAttribs({ "greyout": true });
textureOpacity.onChange = updateOpacity;

const texCoordAlpha = op.inValueBool("Opacity TexCoords Transform", false);
const discardTransPxl = op.inValueBool("Discard Transparent Pixels");

// texture coords
const
    diffuseRepeatX = op.inValue("diffuseRepeatX", 1),
    diffuseRepeatY = op.inValue("diffuseRepeatY", 1),
    diffuseOffsetX = op.inValue("Tex Offset X", 0),
    diffuseOffsetY = op.inValue("Tex Offset Y", 0),
    cropRepeat = op.inBool("Crop TexCoords", false);

shader.addUniformFrag("f", "diffuseRepeatX", diffuseRepeatX);
shader.addUniformFrag("f", "diffuseRepeatY", diffuseRepeatY);
shader.addUniformFrag("f", "texOffsetX", diffuseOffsetX);
shader.addUniformFrag("f", "texOffsetY", diffuseOffsetY);

const doBillboard = op.inValueBool("billboard", false);

alphaMaskSource.onChange =
    doBillboard.onChange =
    discardTransPxl.onChange =
    texCoordAlpha.onChange =
    cropRepeat.onChange =
    vertexColors.onChange =
    colorizeTexture.onChange = updateDefines;

op.setPortGroup("Color", [r, g, b, a]);
op.setPortGroup("Color Texture", [diffuseTexture, vertexColors, colorizeTexture]);
op.setPortGroup("Opacity", [textureOpacity, alphaMaskSource, discardTransPxl, texCoordAlpha]);
op.setPortGroup("Texture Transform", [diffuseRepeatX, diffuseRepeatY, diffuseOffsetX, diffuseOffsetY, cropRepeat]);

updateOpacity();
updateDiffuseTexture();

op.preRender = function ()
{
    shader.bind();
    doRender();
    if (!shader) return;
};

function doRender()
{
    op.checkGraphicsApi();
    cgl.pushShader(shader);
    shader.popTextures();

    if (diffuseTextureUniform && diffuseTexture.get()) shader.pushTexture(diffuseTextureUniform, diffuseTexture.get());
    if (textureOpacityUniform && textureOpacity.get()) shader.pushTexture(textureOpacityUniform, textureOpacity.get());

    trigger.trigger();

    cgl.popShader();
}

function updateOpacity()
{
    if (textureOpacity.get())
    {
        if (textureOpacityUniform !== null) return;
        shader.removeUniform("texOpacity");
        shader.define("HAS_TEXTURE_OPACITY");
        if (!textureOpacityUniform)textureOpacityUniform = new CGL.Uniform(shader, "t", "texOpacity");
    }
    else
    {
        shader.removeUniform("texOpacity");
        shader.removeDefine("HAS_TEXTURE_OPACITY");
        textureOpacityUniform = null;
    }

    updateDefines();
}

function updateDiffuseTexture()
{
    if (diffuseTexture.get())
    {
        if (!shader.hasDefine("HAS_TEXTURE_DIFFUSE"))shader.define("HAS_TEXTURE_DIFFUSE");
        if (!diffuseTextureUniform)diffuseTextureUniform = new CGL.Uniform(shader, "t", "texDiffuse");
    }
    else
    {
        shader.removeUniform("texDiffuse");
        shader.removeDefine("HAS_TEXTURE_DIFFUSE");
        diffuseTextureUniform = null;
    }
    updateUi();
}

function updateUi()
{
    const hasTexture = diffuseTexture.isLinked() || textureOpacity.isLinked();
    diffuseRepeatX.setUiAttribs({ "greyout": !hasTexture });
    diffuseRepeatY.setUiAttribs({ "greyout": !hasTexture });
    diffuseOffsetX.setUiAttribs({ "greyout": !hasTexture });
    diffuseOffsetY.setUiAttribs({ "greyout": !hasTexture });
    colorizeTexture.setUiAttribs({ "greyout": !hasTexture });

    alphaMaskSource.setUiAttribs({ "greyout": !textureOpacity.get() });
    texCoordAlpha.setUiAttribs({ "greyout": !textureOpacity.get() });

    let notUsingColor = true;
    notUsingColor = diffuseTexture.get() && !colorizeTexture.get();
    r.setUiAttribs({ "greyout": notUsingColor });
    g.setUiAttribs({ "greyout": notUsingColor });
    b.setUiAttribs({ "greyout": notUsingColor });
}

function updateDefines()
{
    shader.toggleDefine("VERTEX_COLORS", vertexColors.get());
    shader.toggleDefine("CROP_TEXCOORDS", cropRepeat.get());
    shader.toggleDefine("COLORIZE_TEXTURE", colorizeTexture.get());
    shader.toggleDefine("TRANSFORMALPHATEXCOORDS", texCoordAlpha.get());
    shader.toggleDefine("DISCARDTRANS", discardTransPxl.get());
    shader.toggleDefine("BILLBOARD", doBillboard.get());

    shader.toggleDefine("ALPHA_MASK_ALPHA", alphaMaskSource.get() == "A");
    shader.toggleDefine("ALPHA_MASK_IALPHA", alphaMaskSource.get() == "1-A");
    shader.toggleDefine("ALPHA_MASK_IR", alphaMaskSource.get() == "1-R");
    shader.toggleDefine("ALPHA_MASK_LUMI", alphaMaskSource.get() == "Luminance");
    shader.toggleDefine("ALPHA_MASK_R", alphaMaskSource.get() == "R");
    shader.toggleDefine("ALPHA_MASK_G", alphaMaskSource.get() == "G");
    shader.toggleDefine("ALPHA_MASK_B", alphaMaskSource.get() == "B");
    updateUi();
}

}
};

CABLES.OPS["ec55d252-3843-41b1-b731-0482dbd9e72b"]={f:Ops.Gl.Shader.BasicMaterial_v3,objName:"Ops.Gl.Shader.BasicMaterial_v3"};




// **************************************************************
// 
// Ops.Gl.ImageCompose.ImageCompose_v4
// 
// **************************************************************

Ops.Gl.ImageCompose.ImageCompose_v4= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"imgcomp_frag":"IN vec2 texCoord;\nUNI vec4 bgColor;\nUNI sampler2D tex;\n#ifdef USE_UVTEX\nUNI sampler2D UVTex;\n#endif\n\nvoid main()\n{\n\n    #ifndef USE_TEX\n        outColor=bgColor;\n    #endif\n    #ifdef USE_TEX\n        #ifndef USE_UVTEX\n        outColor=texture(tex,texCoord);\n        #else\n        outColor=texture(tex,texture(UVTex,texCoord).xy);\n        #endif\n    #endif\n\n\n\n}\n",};
const
    cgl = op.patch.cgl,
    render = op.inTrigger("Render"),
    inTex = op.inTexture("Base Texture"),
    inUVTex = op.inTexture("UV Texture"),
    inSize = op.inSwitch("Size", ["Auto", "Canvas", "Manual"], "Auto"),
    width = op.inValueInt("Width", 640),
    height = op.inValueInt("Height", 480),
    inFilter = op.inSwitch("Filter", ["nearest", "linear", "mipmap"], "linear"),
    inWrap = op.inValueSelect("Wrap", ["clamp to edge", "repeat", "mirrored repeat"], "repeat"),
    aniso = op.inSwitch("Anisotropic", ["0", "1", "2", "4", "8", "16"], "0"),

    inPixelFormat = op.inDropDown("Pixel Format", CGL.Texture.PIXELFORMATS, CGL.Texture.PFORMATSTR_RGBA8UB),

    inClear = op.inBool("Clear", true),
    r = op.inValueSlider("R", 0),
    g = op.inValueSlider("G", 0),
    b = op.inValueSlider("B", 0),
    a = op.inValueSlider("A", 0),

    trigger = op.outTrigger("Next"),
    texOut = op.outTexture("texture_out", CGL.Texture.getEmptyTexture(cgl)),
    outRatio = op.outNumber("Aspect Ratio"),
    outWidth = op.outNumber("Texture Width"),
    outHeight = op.outNumber("Texture Height");

op.setPortGroup("Texture Size", [inSize, width, height]);
op.setPortGroup("Texture Parameters", [inWrap, aniso, inFilter, inPixelFormat]);

r.setUiAttribs({ "colorPick": true });
op.setPortGroup("Color", [r, g, b, a, inClear]);

op.toWorkPortsNeedToBeLinked(render);

const prevViewPort = [0, 0, 0, 0];
let effect = null;
let tex = null;
let reInitEffect = true;
let isFloatTex = false;
let copyShader = null;
let copyShaderTexUni = null;
let copyShaderUVTexUni = null;
let copyShaderRGBAUni = null;

inWrap.onChange =
inFilter.onChange =
aniso.onChange =
inPixelFormat.onChange = reInitLater;

inTex.onLinkChanged =
inClear.onChange =
    inSize.onChange =
    inUVTex.onChange = updateUi;

render.onTriggered =
    op.preRender = doRender;

updateUi();

function initEffect()
{
    if (effect)effect.delete();
    if (tex)tex.delete();
    tex = null;
    effect = new CGL.TextureEffect(cgl, { "isFloatingPointTexture": CGL.Texture.isPixelFormatFloat(inPixelFormat.get()), "name": op.name });

    const cgl_aniso = Math.min(cgl.maxAnisotropic, parseFloat(aniso.get()));

    tex = new CGL.Texture(cgl,
        {
            "anisotropic": cgl_aniso,
            "name": "image_compose_v2_" + op.id,
            "pixelFormat": inPixelFormat.get(),
            "filter": getFilter(),
            "wrap": getWrap(),
            "width": getWidth(),
            "height": getHeight()
        });

    effect.setSourceTexture(tex);

    outWidth.set(getWidth());
    outHeight.set(getHeight());
    outRatio.set(getWidth() / getHeight());

    texOut.setRef(CGL.Texture.getEmptyTexture(cgl));

    reInitEffect = false;
    updateUi();
}

function getFilter()
{
    if (inFilter.get() == "nearest") return CGL.Texture.FILTER_NEAREST;
    else if (inFilter.get() == "linear") return CGL.Texture.FILTER_LINEAR;
    else if (inFilter.get() == "mipmap") return CGL.Texture.FILTER_MIPMAP;
}

function getWrap()
{
    if (inWrap.get() == "repeat") return CGL.Texture.WRAP_REPEAT;
    else if (inWrap.get() == "mirrored repeat") return CGL.Texture.WRAP_MIRRORED_REPEAT;
    else if (inWrap.get() == "clamp to edge") return CGL.Texture.WRAP_CLAMP_TO_EDGE;
}

function getWidth()
{
    let x = 0;
    if (inTex.get() && inSize.get() == "Auto") x = inTex.get().width;
    else if (inSize.get() == "Auto" || inSize.get() == "Canvas") x = cgl.canvasWidth;
    else if (inSize.get() == "ViewPort") x = cgl.getViewPort()[2];
    else x = Math.ceil(width.get());
    return op.patch.cgl.checkTextureSize(x);
}

function getHeight()
{
    let x = 0;

    if (inTex.get() && inSize.get() == "Auto") x = inTex.get().height;
    else if (inSize.get() == "Auto" || inSize.get() == "Canvas") x = cgl.canvasHeight;
    else if (inSize.get() == "ViewPort") x = cgl.getViewPort()[3];
    else x = Math.ceil(height.get());
    return op.patch.cgl.checkTextureSize(x);
}

function reInitLater()
{
    reInitEffect = true;
}

function updateResolution()
{
    if ((
        getWidth() != tex.width ||
        getHeight() != tex.height ||
        // tex.anisotropic != parseFloat(aniso.get()) ||
        // tex.isFloatingPoint() != CGL.Texture.isPixelFormatFloat(inPixelFormat.get()) ||
        tex.pixelFormat != inPixelFormat.get() ||
        tex.filter != getFilter() ||
        tex.wrap != getWrap()
    ) && (getWidth() !== 0 && getHeight() !== 0))
    {
        initEffect();
        effect.setSourceTexture(tex);
        // texOut.set(CGL.Texture.getEmptyTexture(cgl));
        texOut.setRef(tex);
        updateResolutionInfo();
        checkTypes();
    }
}

function updateResolutionInfo()
{
    let info = null;

    if (inSize.get() == "Manual")
    {
        info = null;
    }
    else if (inSize.get() == "Auto")
    {
        if (inTex.get()) info = "Input Texture";
        else info = "Canvas Size";

        info += ": " + getWidth() + " x " + getHeight();
    }

    let changed = false;
    changed = inSize.uiAttribs.info != info;
    inSize.setUiAttribs({ "info": info });
    if (changed)op.refreshParams();
}

function updateDefines()
{
    if (copyShader)copyShader.toggleDefine("USE_TEX", inTex.isLinked() || !inClear.get());
    if (copyShader)copyShader.toggleDefine("USE_UVTEX", inUVTex.isLinked());
}

function updateUi()
{
    aniso.setUiAttribs({ "greyout": getFilter() != CGL.Texture.FILTER_MIPMAP });

    r.setUiAttribs({ "greyout": inTex.isLinked() });
    b.setUiAttribs({ "greyout": inTex.isLinked() });
    g.setUiAttribs({ "greyout": inTex.isLinked() });
    a.setUiAttribs({ "greyout": inTex.isLinked() });

    inClear.setUiAttribs({ "greyout": inTex.isLinked() });
    width.setUiAttribs({ "greyout": inSize.get() != "Manual" });
    height.setUiAttribs({ "greyout": inSize.get() != "Manual" });

    // width.setUiAttribs({ "hideParam": inSize.get() != "Manual" });
    // height.setUiAttribs({ "hideParam": inSize.get() != "Manual" });

    if (tex)
        if (CGL.Texture.isPixelFormatFloat(inPixelFormat.get()) && getFilter() == CGL.Texture.FILTER_MIPMAP) op.setUiError("fpmipmap", "Don't use mipmap and 32bit at the same time, many systems do not support this.");
        else op.setUiError("fpmipmap", null);

    updateResolutionInfo();
    updateDefines();
    checkTypes();
}

function checkTypes()
{
    if (tex)
        if (inTex.isLinked() && inTex.get() && (tex.isFloatingPoint() < inTex.get().isFloatingPoint()))
            op.setUiError("textypediff", "Warning: Mixing floating point and non floating point texture can result in data/precision loss", 1);
        else
            op.setUiError("textypediff", null);
}

op.preRender = () =>
{
    doRender();
};

function copyTexture()
{
    if (!copyShader)
    {
        copyShader = new CGL.Shader(cgl, "copytextureshader");
        copyShader.setSource(copyShader.getDefaultVertexShader(), attachments.imgcomp_frag);
        copyShaderTexUni = new CGL.Uniform(copyShader, "t", "tex", 0);
        copyShaderUVTexUni = new CGL.Uniform(copyShader, "t", "UVTex", 1);
        copyShaderRGBAUni = new CGL.Uniform(copyShader, "4f", "bgColor", r, g, b, a);
        updateDefines();
    }

    cgl.pushShader(copyShader);
    cgl.currentTextureEffect.bind();

    if (inTex.get()) cgl.setTexture(0, inTex.get().tex);
    else if (!inClear.get() && texOut.get()) cgl.setTexture(0, texOut.get().tex);
    if (inUVTex.get()) cgl.setTexture(1, inUVTex.get().tex);

    cgl.currentTextureEffect.finish();
    cgl.popShader();
}

function doRender()
{
    if (!effect || reInitEffect) initEffect();

    cgl.pushBlend(false);

    updateResolution();

    const oldEffect = cgl.currentTextureEffect;
    cgl.currentTextureEffect = effect;
    cgl.currentTextureEffect.imgCompVer = 3;
    cgl.currentTextureEffect.width = width.get();
    cgl.currentTextureEffect.height = height.get();
    effect.setSourceTexture(tex);

    effect.startEffect(inTex.get() || CGL.Texture.getEmptyTexture(cgl, isFloatTex), true);
    copyTexture();

    trigger.trigger();

    cgl.pushViewPort(0, 0, width.get(), height.get());

    effect.endEffect();
    texOut.setRef(effect.getCurrentSourceTexture());

    cgl.popViewPort();

    cgl.popBlend();
    cgl.currentTextureEffect = oldEffect;
}

}
};

CABLES.OPS["17212e2b-d692-464c-8f8d-2d511dd3410a"]={f:Ops.Gl.ImageCompose.ImageCompose_v4,objName:"Ops.Gl.ImageCompose.ImageCompose_v4"};




// **************************************************************
// 
// Ops.Gl.ImageCompose.DrawImage_v3
// 
// **************************************************************

Ops.Gl.ImageCompose.DrawImage_v3= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"drawimage_frag":"#ifdef HAS_TEXTURES\n    IN vec2 texCoord;\n    UNI sampler2D tex;\n    UNI sampler2D image;\n#endif\n\n#ifdef TEX_TRANSFORM\n    IN mat3 transform;\n#endif\n// UNI float rotate;\n\n{{CGL.BLENDMODES}}\n\n#ifdef HAS_TEXTUREALPHA\n   UNI sampler2D imageAlpha;\n#endif\n\nUNI float amount;\n\n#ifdef ASPECT_RATIO\n    UNI float aspectTex;\n    UNI float aspectPos;\n#endif\n\nvoid main()\n{\n    vec4 blendRGBA=vec4(0.0,0.0,0.0,1.0);\n\n    #ifdef HAS_TEXTURES\n        vec2 tc=texCoord;\n\n        #ifdef TEX_FLIP_X\n            tc.x=1.0-tc.x;\n        #endif\n        #ifdef TEX_FLIP_Y\n            tc.y=1.0-tc.y;\n        #endif\n\n        #ifdef ASPECT_RATIO\n            #ifdef ASPECT_AXIS_X\n                tc.y=(1.0-aspectPos)-(((1.0-aspectPos)-tc.y)*aspectTex);\n            #endif\n            #ifdef ASPECT_AXIS_Y\n                tc.x=(1.0-aspectPos)-(((1.0-aspectPos)-tc.x)/aspectTex);\n            #endif\n        #endif\n\n        #ifdef TEX_TRANSFORM\n            vec3 coordinates=vec3(tc.x, tc.y,1.0);\n            tc=(transform * coordinates ).xy;\n        #endif\n\n        blendRGBA=texture(image,tc);\n\n        vec3 blend=blendRGBA.rgb;\n        vec4 baseRGBA=texture(tex,texCoord);\n        vec3 base=baseRGBA.rgb;\n\n\n        #ifdef PREMUL\n            blend.rgb = (blend.rgb) + (base.rgb * (1.0 - blendRGBA.a));\n        #endif\n\n        vec3 colNew=_blend(base,blend);\n\n\n\n\n        #ifdef REMOVE_ALPHA_SRC\n            blendRGBA.a=1.0;\n        #endif\n\n        #ifdef HAS_TEXTUREALPHA\n            vec4 colImgAlpha=texture(imageAlpha,tc);\n            float colImgAlphaAlpha=colImgAlpha.a;\n\n            #ifdef ALPHA_FROM_LUMINANCE\n                vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), colImgAlpha.rgb ));\n                colImgAlphaAlpha=(gray.r+gray.g+gray.b)/3.0;\n            #endif\n\n            #ifdef ALPHA_FROM_INV_UMINANCE\n                vec3 gray = vec3(dot(vec3(0.2126,0.7152,0.0722), colImgAlpha.rgb ));\n                colImgAlphaAlpha=1.0-(gray.r+gray.g+gray.b)/3.0;\n            #endif\n\n            #ifdef INVERT_ALPHA\n                colImgAlphaAlpha=clamp(colImgAlphaAlpha,0.0,1.0);\n                colImgAlphaAlpha=1.0-colImgAlphaAlpha;\n            #endif\n\n            blendRGBA.a=colImgAlphaAlpha*blendRGBA.a;\n        #endif\n    #endif\n\n    float am=amount;\n\n    #ifdef CLIP_REPEAT\n        if(tc.y>1.0 || tc.y<0.0 || tc.x>1.0 || tc.x<0.0)\n        {\n            // colNew.rgb=vec3(0.0);\n            am=0.0;\n        }\n    #endif\n\n    #ifdef ASPECT_RATIO\n        #ifdef ASPECT_CROP\n            if(tc.y>1.0 || tc.y<0.0 || tc.x>1.0 || tc.x<0.0)\n            {\n                colNew.rgb=base.rgb;\n                am=0.0;\n            }\n\n        #endif\n    #endif\n\n\n\n    #ifndef PREMUL\n        blendRGBA.rgb=mix(colNew,base,1.0-(am*blendRGBA.a));\n        blendRGBA.a=clamp(baseRGBA.a+(blendRGBA.a*am),0.,1.);\n    #endif\n\n    #ifdef PREMUL\n        // premultiply\n        // blendRGBA.rgb = (blendRGBA.rgb) + (baseRGBA.rgb * (1.0 - blendRGBA.a));\n        blendRGBA=vec4(\n            mix(colNew.rgb,base,1.0-(am*blendRGBA.a)),\n            blendRGBA.a*am+baseRGBA.a\n            );\n    #endif\n\n    #ifdef ALPHA_MASK\n    blendRGBA.a=baseRGBA.a;\n    #endif\n\n    outColor=blendRGBA;\n}\n\n\n\n\n\n\n\n","drawimage_vert":"IN vec3 vPosition;\nIN vec2 attrTexCoord;\nIN vec3 attrVertNormal;\n\nUNI mat4 projMatrix;\nUNI mat4 mvMatrix;\n\nOUT vec2 texCoord;\n// OUT vec3 norm;\n\n#ifdef TEX_TRANSFORM\n    UNI float posX;\n    UNI float posY;\n    UNI float scaleX;\n    UNI float scaleY;\n    UNI float rotate;\n    OUT mat3 transform;\n#endif\n\nvoid main()\n{\n   texCoord=attrTexCoord;\n//   norm=attrVertNormal;\n\n   #ifdef TEX_TRANSFORM\n        vec3 coordinates=vec3(attrTexCoord.x, attrTexCoord.y,1.0);\n        float angle = radians( rotate );\n        vec2 scale= vec2(scaleX,scaleY);\n        vec2 translate= vec2(posX,posY);\n\n        transform = mat3(   scale.x * cos( angle ), scale.x * sin( angle ), 0.0,\n            - scale.y * sin( angle ), scale.y * cos( angle ), 0.0,\n            - 0.5 * scale.x * cos( angle ) + 0.5 * scale.y * sin( angle ) - 0.5 * translate.x*2.0 + 0.5,  - 0.5 * scale.x * sin( angle ) - 0.5 * scale.y * cos( angle ) - 0.5 * translate.y*2.0 + 0.5, 1.0);\n   #endif\n\n   gl_Position = projMatrix * mvMatrix * vec4(vPosition,  1.0);\n}\n",};
const
    render = op.inTrigger("render"),
    blendMode = CGL.TextureEffect.AddBlendSelect(op, "blendMode"),
    amount = op.inValueSlider("amount", 1),

    image = op.inTexture("Image"),
    inAlphaPremul = op.inValueBool("Premultiplied", false),
    inAlphaMask = op.inValueBool("Alpha Mask", false),
    removeAlphaSrc = op.inValueBool("removeAlphaSrc", false),

    imageAlpha = op.inTexture("Mask"),
    alphaSrc = op.inValueSelect("Mask Src", ["alpha channel", "luminance", "luminance inv"], "luminance"),
    invAlphaChannel = op.inBool("Invert alpha channel"),

    inAspect = op.inValueBool("Aspect Ratio", false),
    inAspectAxis = op.inValueSelect("Stretch Axis", ["X", "Y"], "X"),
    inAspectPos = op.inValueSlider("Position", 0.0),
    inAspectCrop = op.inValueBool("Crop", false),

    trigger = op.outTrigger("trigger");

blendMode.set("normal");
const cgl = op.patch.cgl;
const shader = new CGL.Shader(cgl, "drawimage");

imageAlpha.onLinkChanged = updateAlphaPorts;

op.setPortGroup("Aspect Ratio", [inAspect, inAspectPos, inAspectCrop, inAspectAxis]);
op.setPortGroup("Mask", [imageAlpha, alphaSrc, invAlphaChannel]);

function updateAlphaPorts()
{
    if (imageAlpha.isLinked())
    {
        removeAlphaSrc.setUiAttribs({ "greyout": true });
        alphaSrc.setUiAttribs({ "greyout": false });
        invAlphaChannel.setUiAttribs({ "greyout": false });
    }
    else
    {
        removeAlphaSrc.setUiAttribs({ "greyout": false });
        alphaSrc.setUiAttribs({ "greyout": true });
        invAlphaChannel.setUiAttribs({ "greyout": true });
    }
}

op.toWorkPortsNeedToBeLinked(image);

shader.setSource(attachments.drawimage_vert, attachments.drawimage_frag);

const
    textureUniform = new CGL.Uniform(shader, "t", "tex", 0),
    textureImaghe = new CGL.Uniform(shader, "t", "image", 1),
    textureAlpha = new CGL.Uniform(shader, "t", "imageAlpha", 2),
    uniTexAspect = new CGL.Uniform(shader, "f", "aspectTex", 1),
    uniAspectPos = new CGL.Uniform(shader, "f", "aspectPos", inAspectPos);

inAspect.onChange =
    inAspectCrop.onChange =
    inAspectAxis.onChange = updateAspectRatio;

function updateAspectRatio()
{
    shader.removeDefine("ASPECT_AXIS_X");
    shader.removeDefine("ASPECT_AXIS_Y");
    shader.removeDefine("ASPECT_CROP");

    inAspectPos.setUiAttribs({ "greyout": !inAspect.get() });
    inAspectCrop.setUiAttribs({ "greyout": !inAspect.get() });
    inAspectAxis.setUiAttribs({ "greyout": !inAspect.get() });

    if (inAspect.get())
    {
        shader.define("ASPECT_RATIO");

        if (inAspectCrop.get()) shader.define("ASPECT_CROP");

        if (inAspectAxis.get() == "X") shader.define("ASPECT_AXIS_X");
        if (inAspectAxis.get() == "Y") shader.define("ASPECT_AXIS_Y");
    }
    else
    {
        shader.removeDefine("ASPECT_RATIO");
        if (inAspectCrop.get()) shader.define("ASPECT_CROP");

        if (inAspectAxis.get() == "X") shader.define("ASPECT_AXIS_X");
        if (inAspectAxis.get() == "Y") shader.define("ASPECT_AXIS_Y");
    }
}

//
// texture flip
//
const flipX = op.inValueBool("flip x");
const flipY = op.inValueBool("flip y");

//
// texture transform
//

let doTransform = op.inValueBool("Transform");

let scaleX = op.inValueSlider("Scale X", 1);
let scaleY = op.inValueSlider("Scale Y", 1);

let posX = op.inValue("Position X", 0);
let posY = op.inValue("Position Y", 0);

let rotate = op.inValue("Rotation", 0);

const inClipRepeat = op.inValueBool("Clip Repeat", false);

const uniScaleX = new CGL.Uniform(shader, "f", "scaleX", scaleX);
const uniScaleY = new CGL.Uniform(shader, "f", "scaleY", scaleY);
const uniPosX = new CGL.Uniform(shader, "f", "posX", posX);
const uniPosY = new CGL.Uniform(shader, "f", "posY", posY);
const uniRotate = new CGL.Uniform(shader, "f", "rotate", rotate);

doTransform.onChange = updateTransformPorts;

function updateTransformPorts()
{
    shader.toggleDefine("TEX_TRANSFORM", doTransform.get());

    scaleX.setUiAttribs({ "greyout": !doTransform.get() });
    scaleY.setUiAttribs({ "greyout": !doTransform.get() });
    posX.setUiAttribs({ "greyout": !doTransform.get() });
    posY.setUiAttribs({ "greyout": !doTransform.get() });
    rotate.setUiAttribs({ "greyout": !doTransform.get() });
}

CGL.TextureEffect.setupBlending(op, shader, blendMode, amount);

const amountUniform = new CGL.Uniform(shader, "f", "amount", amount);

render.onTriggered = doRender;

inClipRepeat.onChange =
    imageAlpha.onChange =
    inAlphaPremul.onChange =
    inAlphaMask.onChange =
    invAlphaChannel.onChange =
    flipY.onChange =
    flipX.onChange =
    removeAlphaSrc.onChange =
    alphaSrc.onChange = updateDefines;

updateTransformPorts();
updateAlphaPorts();
updateAspectRatio();
updateDefines();

function updateDefines()
{
    shader.toggleDefine("REMOVE_ALPHA_SRC", removeAlphaSrc.get());
    shader.toggleDefine("ALPHA_MASK", inAlphaMask.get());

    shader.toggleDefine("CLIP_REPEAT", inClipRepeat.get());

    shader.toggleDefine("HAS_TEXTUREALPHA", imageAlpha.get() && imageAlpha.get().tex);

    shader.toggleDefine("TEX_FLIP_X", flipX.get());
    shader.toggleDefine("TEX_FLIP_Y", flipY.get());

    shader.toggleDefine("INVERT_ALPHA", invAlphaChannel.get());

    shader.toggleDefine("ALPHA_FROM_LUMINANCE", alphaSrc.get() == "luminance");
    shader.toggleDefine("ALPHA_FROM_INV_UMINANCE", alphaSrc.get() == "luminance_inv");
    shader.toggleDefine("PREMUL", inAlphaPremul.get());
}

function doRender()
{
    if (!CGL.TextureEffect.checkOpInEffect(op)) return;

    const tex = image.get();
    if (tex && tex.tex && amount.get() > 0.0)
    {
        cgl.pushShader(shader);
        cgl.currentTextureEffect.bind();

        const imgTex = cgl.currentTextureEffect.getCurrentSourceTexture();
        cgl.setTexture(0, imgTex.tex);

        // if (imgTex && tex)
        // {
        //     if (tex.textureType != imgTex.textureType && (tex.textureType == CGL.Texture.TYPE_FLOAT))
        //         op.setUiError("textypediff", "Drawing 32bit texture into an 8 bit can result in data/precision loss", 1);
        //     else
        //         op.setUiError("textypediff", null);
        // }

        const asp = 1 / (cgl.currentTextureEffect.getWidth() / cgl.currentTextureEffect.getHeight()) * (tex.width / tex.height);
        // uniTexAspect.setValue(1 / (tex.height / tex.width * imgTex.width / imgTex.height));

        uniTexAspect.setValue(asp);

        cgl.setTexture(1, tex.tex);
        // cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, image.get().tex );

        if (imageAlpha.get() && imageAlpha.get().tex)
        {
            cgl.setTexture(2, imageAlpha.get().tex);
            // cgl.gl.bindTexture(cgl.gl.TEXTURE_2D, imageAlpha.get().tex );
        }

        // cgl.pushBlend(false);

        cgl.pushBlendMode(CGL.BLEND_NONE, true);

        cgl.currentTextureEffect.finish();
        cgl.popBlendMode();

        // cgl.popBlend();

        cgl.popShader();
    }

    trigger.trigger();
}

}
};

CABLES.OPS["8f6b2f15-fcb0-4597-90c0-e5173f2969fe"]={f:Ops.Gl.ImageCompose.DrawImage_v3,objName:"Ops.Gl.ImageCompose.DrawImage_v3"};




// **************************************************************
// 
// Ops.Gl.ImageCompose.Levels_v2
// 
// **************************************************************

Ops.Gl.ImageCompose.Levels_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"levels_frag":"IN vec2 texCoord;\nUNI sampler2D tex;\nUNI float inMin;\nUNI float inMax;\nUNI float midPoint;\nUNI float outMax;\nUNI float outMin;\n\nvoid main()\n{\n    vec4 baseRGBA=texture(tex,texCoord);\n    vec3 base=baseRGBA.rgb;\n    vec3 inputRange = min(max(base - vec3(inMin), vec3(0.0)) / (vec3(inMax) - vec3(inMin)), vec3(outMax));\n\n    inputRange = pow(inputRange, vec3(1.0 / (1.5 - midPoint)));\n\n    outColor= vec4(mix(vec3(outMin), vec3(1.0), inputRange) ,baseRGBA.a);\n}",};
const
    render = op.inTrigger("Render"),

    inMin = op.inValueSlider("In Min", 0),
    inMid = op.inValueSlider("Midpoint", 0.5),
    inMax = op.inValueSlider("In Max", 1),

    outMin = op.inValueSlider("Out Min", 0),
    outMax = op.inValueSlider("Out Max", 1),

    trigger = op.outTrigger("Next");

const cgl = op.patch.cgl;
const shader = new CGL.Shader(cgl, op.name, op);

const
    uniInMin = new CGL.Uniform(shader, "f", "inMin", inMin),
    uniInMid = new CGL.Uniform(shader, "f", "midPoint", inMid),
    uniInMax = new CGL.Uniform(shader, "f", "inMax", inMax),
    uniOutMin = new CGL.Uniform(shader, "f", "outMin", outMin),
    uniOutMax = new CGL.Uniform(shader, "f", "outMax", outMax),
    textureUniform = new CGL.Uniform(shader, "t", "tex", 0);

shader.setSource(shader.getDefaultVertexShader(), attachments.levels_frag);

render.onTriggered = function ()
{
    if (!CGL.TextureEffect.checkOpInEffect(op, 3)) return;

    cgl.pushShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex);

    cgl.currentTextureEffect.finish();
    cgl.popShader();

    trigger.trigger();
};

}
};

CABLES.OPS["cf49063c-a010-4e2b-add6-f8dea50392b5"]={f:Ops.Gl.ImageCompose.Levels_v2,objName:"Ops.Gl.ImageCompose.Levels_v2"};




// **************************************************************
// 
// Ops.Math.Sum
// 
// **************************************************************

Ops.Math.Sum= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    number1 = op.inValueFloat("number1", 0),
    number2 = op.inValueFloat("number2", 0),
    result = op.outNumber("result");

op.setUiAttribs({ "mathTitle": true });

number1.onChange =
number2.onChange = exec;
exec();

function exec()
{
    const v = number1.get() + number2.get();
    if (!isNaN(v))
        result.set(v);
}

}
};

CABLES.OPS["c8fb181e-0b03-4b41-9e55-06b6267bc634"]={f:Ops.Math.Sum,objName:"Ops.Math.Sum"};




// **************************************************************
// 
// Ops.Gl.ImageCompose.FastBlur_v2
// 
// **************************************************************

Ops.Gl.ImageCompose.FastBlur_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"blur_frag":"\nUNI sampler2D tex;\n#ifdef USE_MASK\n    UNI sampler2D texMask;\n#endif\nUNI float amount;\nUNI float pass;\n\nIN vec2 texCoord;\n\nUNI float dirX;\nUNI float dirY;\nUNI float width;\nUNI float height;\n\nIN vec2 coord0;\nIN vec2 coord1;\nIN vec2 coord2;\nIN vec2 coord3;\nIN vec2 coord4;\nIN vec2 coord5;\nIN vec2 coord6;\n\n#ifdef HAS_MASK\n    UNI sampler2D imageMask;\n#endif\n\nvoid main()\n{\n    vec4 color = vec4(0.0);\n\n    #ifdef USE_MASK\n        #ifdef MASK_INVERT\n            if(texture(texMask,texCoord).r<0.5)\n            {\n                outColor= texture(tex, texCoord);\n                return;\n            }\n        #endif\n\n        #ifndef MASK_INVERT\n            if(texture(texMask,texCoord).r>0.5)\n            {\n                outColor= texture(tex, texCoord);\n                return;\n            }\n        #endif\n    #endif\n\n    color += texture(tex, coord0) * 0.06927096443792478;\n    color += texture(tex, coord1) * 0.1383328848652136;\n    color += texture(tex, coord2) * 0.21920904690397863;\n    color += texture(tex, coord3) * 0.14637421;\n    color += texture(tex, coord4) * 0.21920904690397863;\n    color += texture(tex, coord5) * 0.1383328848652136;\n    color += texture(tex, coord6) * 0.06927096443795711;\n\n    outColor= color;\n}","blur_vert":"\nIN vec3 vPosition;\nIN vec2 attrTexCoord;\nIN vec3 attrVertNormal;\nOUT vec2 texCoord;\nOUT vec3 norm;\nUNI mat4 projMatrix;\nUNI mat4 mvMatrix;\nUNI mat4 modelMatrix;\n\nUNI float pass;\nUNI float dirX;\nUNI float dirY;\nUNI float width;\nUNI float height;\n\nOUT vec2 coord0;\nOUT vec2 coord1;\nOUT vec2 coord2;\nOUT vec2 coord3;\nOUT vec2 coord4;\nOUT vec2 coord5;\nOUT vec2 coord6;\n\nvoid main()\n{\n    texCoord=attrTexCoord;\n    norm=attrVertNormal;\n    vec4 pos=vec4(vPosition,  1.0);\n    {{MODULE_VERTEX_POSITION}}\n\n    vec2 dir=vec2(dirX,dirY);\n    vec2 res=vec2( (1.) / width , (1.) / height )*dir;\n\n    coord3= attrTexCoord;\n\n    coord0= attrTexCoord + (-3.0368997744118595 * res);\n    coord1= attrTexCoord + (-2.089778445362373 * res);\n    coord2= attrTexCoord + (-1.2004366090034069 * res);\n    coord4= attrTexCoord + (1.2004366090034069 * res);\n    coord5= attrTexCoord + (2.089778445362373* res);\n    coord6= attrTexCoord + (3.0368997744118595 * res);\n\n    #ifdef CLAMP\n        coord0=clamp(coord0,0.0,1.0);\n        coord1=clamp(coord1,0.0,1.0);\n        coord2=clamp(coord2,0.0,1.0);\n        coord3=clamp(coord3,0.0,1.0);\n        coord4=clamp(coord4,0.0,1.0);\n        coord5=clamp(coord5,0.0,1.0);\n        coord6=clamp(coord6,0.0,1.0);\n    #endif\n\n    gl_Position = projMatrix * mvMatrix * pos;\n}\n",};
// http://dev.theomader.com/gaussian-kernel-calculator/
// http://rastergrid.com/blog/2010/09/efficient-gaussian-blur-with-linear-sampling/

const
    render = op.inTrigger("render"),
    trigger = op.outTrigger("trigger"),
    inPasses = op.inInt("Passes", 3),
    clamp = op.inBool("Clamp", false),
    direction = op.inDropDown("direction", ["both", "vertical", "horizontal"], "both"),
    mask = op.inTexture("Mask"),
    maskInvert = op.inBool("Mask Invert", false);

const cgl = op.patch.cgl;
const shader = new CGL.Shader(cgl, "fastblur");

op.setPortGroup("Mask", [mask, maskInvert]);

shader.setSource(attachments.blur_vert, attachments.blur_frag);
const
    textureUniform = new CGL.Uniform(shader, "t", "tex", 0),
    uniDirX = new CGL.Uniform(shader, "f", "dirX", 0),
    uniDirY = new CGL.Uniform(shader, "f", "dirY", 0),
    uniWidth = new CGL.Uniform(shader, "f", "width", 0),
    uniHeight = new CGL.Uniform(shader, "f", "height", 0),
    uniPass = new CGL.Uniform(shader, "f", "pass", 0),
    uniAmount = new CGL.Uniform(shader, "f", "amount", inPasses.get()),
    textureAlpha = new CGL.Uniform(shader, "t", "texMask", 1);

inPasses.onChange = () => { uniAmount.setValue(inPasses.get()); };

let dir = 0;
direction.onChange = () =>
{
    if (direction.get() == "both") dir = 0;
    if (direction.get() == "horizontal") dir = 1;
    if (direction.get() == "vertical") dir = 2;
};

clamp.onChange = () => { shader.toggleDefine("CLAMP", clamp.get()); };

maskInvert.onChange =
    mask.onChange = updateDefines;
updateDefines();

function updateDefines()
{
    shader.toggleDefine("USE_MASK", mask.isLinked());
    shader.toggleDefine("MASK_INVERT", maskInvert.get());

    maskInvert.setUiAttribs({ "greyout": !mask.isLinked() });
}

render.onTriggered = function ()
{
    if (!CGL.TextureEffect.checkOpInEffect(op, 3)) return;

    uniWidth.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().width);
    uniHeight.setValue(cgl.currentTextureEffect.getCurrentSourceTexture().height);
    const numPasses = inPasses.get();

    if (mask.get())cgl.setTexture(1, mask.get().tex);

    for (let i = 0; i < numPasses; i++)
    {
        cgl.pushShader(shader);

        uniPass.setValue(i / numPasses);

        // first pass
        if (dir === 0 || dir == 2)
        {
            cgl.currentTextureEffect.bind();
            cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex);

            uniDirX.setValue(0.0);
            uniDirY.setValue(1.0 + (i * i));

            cgl.currentTextureEffect.finish();
        }

        // second pass
        if (dir === 0 || dir == 1)
        {
            cgl.currentTextureEffect.bind();
            cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex);

            uniDirX.setValue(1.0 + (i * i));
            uniDirY.setValue(0.0);

            cgl.currentTextureEffect.finish();
        }

        cgl.popShader();
    }

    trigger.trigger();
};

}
};

CABLES.OPS["61ed277f-d096-43b2-9de8-dc87fb3a9169"]={f:Ops.Gl.ImageCompose.FastBlur_v2,objName:"Ops.Gl.ImageCompose.FastBlur_v2"};




// **************************************************************
// 
// Ops.TimeLine.TimeLinePlayer
// 
// **************************************************************

Ops.TimeLine.TimeLinePlayer= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    play = op.inTriggerButton("Play"),
    pause = op.inTriggerButton("Pause"),
    rewind = op.inTriggerButton("rewind"),
    setTime = op.inFloat("Set current time", 0),

    outPlayTrigger = op.outTrigger("play trigger"),
    outPauseTrigger = op.outTrigger("pause trigger"),
    outrewindTrigger = op.outTrigger("rewind trigger"),
    isPlaying = op.outBool("is Playing"),
    outSetTimeTrigger = op.outNumber("set time (seconds)"),
    currentTime = op.outNumber("current time"),
    currentFrame = op.outNumber("current frame");

play.onTriggered = function ()
{
    op.patch.timer.play();

    op.patch.timer.setTime(setTime.get());
    outSetTimeTrigger.set(setTime.get());
    outPlayTrigger.trigger();
};

pause.onTriggered = function ()
{
    op.patch.timer.pause();
    outPauseTrigger.trigger();
};

op.onAnimFrame = function (time)
{
    currentFrame.set(Math.round(time * 30.0));
    currentTime.set(time);
    isPlaying.set(op.patch.timer.isPlaying());
};

rewind.onTriggered = function ()
{
    op.patch.timer.setTime(0);
    outrewindTrigger.trigger();
};

}
};

CABLES.OPS["97e57613-6a51-41cf-9de5-fe3dbc2c69b2"]={f:Ops.TimeLine.TimeLinePlayer,objName:"Ops.TimeLine.TimeLinePlayer"};




// **************************************************************
// 
// Ops.String.OrString
// 
// **************************************************************

Ops.String.OrString= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    str0=op.inString("String 1"),
    str1=op.inString("String 2"),
    str2=op.inString("String 3"),
    str3=op.inString("String 4"),
    str4=op.inString("String 5"),
    str5=op.inString("String 6"),
    str6=op.inString("String 7"),
    str7=op.inString("String 8"),
    result=op.outString("Result");

str0.onChange=
    str1.onChange=
    str2.onChange=
    str3.onChange=
    str4.onChange=
    str5.onChange=
    str6.onChange=
    str7.onChange=exec;

function exec()
{
    result.set( str0.get() || str1.get()  || str2.get() || str3.get() || str4.get() || str5.get() || str6.get() || str7.get() );
}


}
};

CABLES.OPS["6b7f9561-6faf-4df7-ac3b-64235dded700"]={f:Ops.String.OrString,objName:"Ops.String.OrString"};




// **************************************************************
// 
// Ops.Vars.VarSetString_v2
// 
// **************************************************************

Ops.Vars.VarSetString_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const val=op.inString("Value","New String");
op.varName=op.inDropDown("Variable",[],"",true);

new CABLES.VarSetOpWrapper(op,"string",val,op.varName);



}
};

CABLES.OPS["0b4d9229-8024-4a30-9cc0-f6653942c2e4"]={f:Ops.Vars.VarSetString_v2,objName:"Ops.Vars.VarSetString_v2"};




// **************************************************************
// 
// Ops.Vars.VarGetString
// 
// **************************************************************

Ops.Vars.VarGetString= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
var val=op.outString("Value");
op.varName=op.inValueSelect("Variable",[],"",true);

new CABLES.VarGetOpWrapper(op,"string",op.varName,val);

}
};

CABLES.OPS["3ad08cfc-bce6-4175-9746-fef2817a3b12"]={f:Ops.Vars.VarGetString,objName:"Ops.Vars.VarGetString"};




// **************************************************************
// 
// Ops.String.String_v2
// 
// **************************************************************

Ops.String.String_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    v = op.inString("value", ""),
    result = op.outString("String");

v.onChange = function ()
{
    if (!v.isLinked())
        op.setUiAttrib({ "extendTitle": v.get() });

    result.set(v.get());
};

}
};

CABLES.OPS["d697ff82-74fd-4f31-8f54-295bc64e713d"]={f:Ops.String.String_v2,objName:"Ops.String.String_v2"};




// **************************************************************
// 
// Ops.Cables.LoadingStatus_v2
// 
// **************************************************************

Ops.Cables.LoadingStatus_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    exe = op.inTrigger("exe"),
    startTimeLine = op.inBool("Play Timeline", true),
    next = op.outTrigger("Next"),
    outInitialFinished = op.outBoolNum("Finished Initial Loading", false),
    outLoading = op.outBoolNum("Loading"),
    outProgress = op.outNumber("Progress"),
    outList = op.outArray("Jobs"),
    loadingFinished = op.outTrigger("Trigger Loading Finished ");

const cgl = op.patch.cgl;
const patch = op.patch;

let finishedOnce = false;
const preRenderTimes = [];
let firstTime = true;
let timeout = 0;

document.body.classList.add("cables-loading");

let loadingId = cgl.patch.loading.start("loadingStatusInit", "loadingStatusInit", op);

op.patch.loading.on("finishedTask", updateStatus.bind(this));
op.patch.loading.on("startTask", updateStatus.bind(this));

function updateStatus()
{
    const jobs = op.patch.loading.getListJobs();
    outProgress.set(patch.loading.getProgress());

    let hasFinished = jobs.length === 0;
    const notFinished = !hasFinished;

    if (notFinished)
    {
        outList.set(op.patch.loading.getListJobs());
    }

    if (notFinished)
    {
        if (firstTime)
        {
            // if (preRenderOps.get()) op.patch.preRenderOps();

            op.patch.timer.setTime(0);
            if (startTimeLine.get())
            {
                op.patch.timer.play();
            }
            else
            {
                op.patch.timer.pause();
            }
        }
        firstTime = false;

        document.body.classList.remove("cables-loading");
        document.body.classList.add("cables-loaded");
    }
    else
    {
        finishedOnce = true;
        outList.set(op.patch.loading.getListJobs());
        if (patch.loading.getProgress() < 1.0)
        {
            op.patch.timer.setTime(0);
            op.patch.timer.pause();
        }
    }

    outInitialFinished.set(finishedOnce);

    if (outLoading.get() && hasFinished) loadingFinished.trigger();

    outLoading.set(notFinished);
    // clearTimeout(timeout);
    // if (notFinished) outLoading.set(notFinished);
    // else
    //     timeout = setTimeout(() =>
    //     {
    //         outLoading.set(notFinished);
    //     }, 100);

    op.setUiAttribs({ "loading": notFinished });
}

exe.onTriggered = () =>
{
    updateStatus();

    next.trigger();

    if (loadingId)
    {
        cgl.patch.loading.finished(loadingId);
        loadingId = null;
    }
};

}
};

CABLES.OPS["e62f7f4c-7436-437e-8451-6bc3c28545f7"]={f:Ops.Cables.LoadingStatus_v2,objName:"Ops.Cables.LoadingStatus_v2"};




// **************************************************************
// 
// Ops.Ui.Routing.RouteNumber
// 
// **************************************************************

Ops.Ui.Routing.RouteNumber= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    v = op.inValueFloat("value"),
    result = op.outNumber("result");

v.onChange = exec;

let wasLinked = false;

op.setUiAttribs({ "display": "reroute" });

function exec()
{
    result.set(v.get());
}

}
};

CABLES.OPS["afff634a-b581-4449-b6f7-9ec7863c5d4d"]={f:Ops.Ui.Routing.RouteNumber,objName:"Ops.Ui.Routing.RouteNumber"};




// **************************************************************
// 
// Ops.Gl.CanvasInfo_v3
// 
// **************************************************************

Ops.Gl.CanvasInfo_v3= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    width = op.outNumber("CSS Width"),
    height = op.outNumber("CSS Height"),
    pixelRatio = op.outNumber("Pixel Ratio"),
    widthPixel = op.outNumber("Pixel Width"),
    heightPixel = op.outNumber("Pixel Height"),
    aspect = op.outNumber("Aspect Ratio"),
    landscape = op.outBool("Landscape"),
    outCanvasEle = op.outObject("Canvas", "element"),
    outCanvasParentEle = op.outObject("Canvas Parent", "element"),
    outResize = op.outTrigger("Resized");

let cgl = op.patch.cgl;
outCanvasEle.set(op.patch.cgl.canvas);
outCanvasParentEle.set(op.patch.cgl.canvas.parentElement);

cgl.on("resize", () =>
{
    outResize.trigger();
    update();
});

update();

function update()
{
    let div = 1;

    if (cgl.canvasHeight == 0)setTimeout(update, 100);

    height.set(cgl.canvasHeight / op.patch.cgl.pixelDensity);
    width.set(cgl.canvasWidth / op.patch.cgl.pixelDensity);

    widthPixel.set(cgl.canvasWidth);
    heightPixel.set(cgl.canvasHeight);

    pixelRatio.set(op.patch.cgl.pixelDensity); // window.devicePixelRatio

    aspect.set(cgl.canvasWidth / cgl.canvasHeight);
    landscape.set(cgl.canvasWidth > cgl.canvasHeight ? 1 : 0);
}

}
};

CABLES.OPS["be186ff9-427e-409f-b6a4-f8d957bf7bc7"]={f:Ops.Gl.CanvasInfo_v3,objName:"Ops.Gl.CanvasInfo_v3"};




// **************************************************************
// 
// Ops.Math.Compare.GreaterThan
// 
// **************************************************************

Ops.Math.Compare.GreaterThan= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    number1 = op.inValueFloat("number1"),
    number2 = op.inValueFloat("number2"),
    result = op.outBoolNum("result");

op.setUiAttribs({ "mathTitle": true });

number1.onChange = number2.onChange = exec;

function exec()
{
    result.set(number1.get() > number2.get());
}

}
};

CABLES.OPS["b250d606-f7f8-44d3-b099-c29efff2608a"]={f:Ops.Math.Compare.GreaterThan,objName:"Ops.Math.Compare.GreaterThan"};




// **************************************************************
// 
// Ops.Devices.Mouse.Mouse_v4
// 
// **************************************************************

Ops.Devices.Mouse.Mouse_v4= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    inCoords = op.inSwitch("Coordinates", ["-1 to 1", "Pixel Display", "Pixel", "0 to 1"], "-1 to 1"),
    area = op.inValueSelect("Area", ["Canvas Area", "Canvas", "Document", "Parent Element"], "Canvas Area"),
    flipY = op.inValueBool("flip y", true),
    rightClickPrevDef = op.inBool("right click prevent default", true),
    inEventType = op.inSwitch("Events", ["Pointer", "Touch", "Mouse"]),
    inPassive = op.inValueBool("Passive Events", false),
    inEle = op.inObject("Element", "element"),
    active = op.inValueBool("Active", true),
    outMouseX = op.outNumber("x", 0),
    outMouseY = op.outNumber("y", 0),
    mouseClick = op.outTrigger("click"),
    mouseClickRight = op.outTrigger("click right"),
    mouseDown = op.outBoolNum("Button is down"),
    mouseOver = op.outBoolNum("Mouse is hovering"),
    outMovementX = op.outNumber("Movement X", 0),
    outMovementY = op.outNumber("Movement Y", 0),
    outEvent = op.outObject("Event");

const cgl = op.patch.cgl;
let normalize = 1;
let listenerElement = null;
let areaElement = null;

inPassive.onChange =
    area.onChange = addListeners;
inCoords.onChange = updateCoordNormalizing;
op.onDelete = removeListeners;

addListeners();

op.on("loadedValueSet", onStart);

function onStart()
{
    if (normalize == 0)
    {
        if (areaElement.clientWidth === 0) setTimeout(onStart, 50);

        outMouseX.set(areaElement.clientWidth / 2);
        outMouseY.set(areaElement.clientHeight / 2);
    }
    else if (normalize == 1)
    {
        outMouseX.set(0);
        outMouseY.set(0);
    }
    else if (normalize == 2)
    {
        outMouseX.set(0.5);
        outMouseY.set(0.5);
    }
    else if (normalize == 3)
    {
        if (areaElement.clientWidth === 0)
        {
            setTimeout(onStart, 50);
        }

        outMouseX.set(areaElement.clientWidth / 2 / cgl.pixelDensity);
        outMouseY.set(areaElement.clientHeight / 2 / cgl.pixelDensity);
    }
    else console.error("unknown normalize mouse", normalize);
}

function setValue(x, y)
{
    x = x || 0;
    y = y || 0;

    if (normalize == 0) // pixel
    {
        outMouseX.set(x);
        outMouseY.set(y);
    }
    else
    if (normalize == 3) // pixel css
    {
        outMouseX.set(x * cgl.pixelDensity);
        outMouseY.set(y * cgl.pixelDensity);
    }
    else
    {
        let w = areaElement.clientWidth / cgl.pixelDensity;
        let h = areaElement.clientHeight / cgl.pixelDensity;

        w = w || 1;
        h = h || 1;

        if (normalize == 1) // -1 to 1
        {
            let xx = (x / w * 2.0 - 1.0);
            let yy = (y / h * 2.0 - 1.0);
            xx = CABLES.clamp(xx, -1, 1);
            yy = CABLES.clamp(yy, -1, 1);

            outMouseX.set(xx);
            outMouseY.set(yy);
        }
        else if (normalize == 2) // 0 to 1
        {
            let xx = x / w;
            let yy = y / h;

            xx = CABLES.clamp(xx, 0, 1);
            yy = CABLES.clamp(yy, 0, 1);

            outMouseX.set(xx);
            outMouseY.set(yy);
        }
    }
}

function checkHovering(e)
{
    if (!areaElement) return;
    const r = areaElement.getBoundingClientRect();

    return (
        e.clientX > r.left &&
        e.clientX < r.left + r.width &&
        e.clientY > r.top &&
        e.clientY < r.top + r.height
    );
}

inEle.onChange =
inEventType.onChange = function ()
{
    area.setUiAttribs({ "greyout": inEle.isLinked() });
    removeListeners();
    addListeners();
};

active.onChange = function ()
{
    if (listenerElement)removeListeners();
    if (active.get())addListeners();
};

function updateCoordNormalizing()
{
    if (inCoords.get() == "Pixel") normalize = 0;
    else if (inCoords.get() == "-1 to 1") normalize = 1;
    else if (inCoords.get() == "0 to 1") normalize = 2;
    else if (inCoords.get() == "Pixel Display") normalize = 3;
}

/// ///

function onMouseEnter(e)
{
    outEvent.setRef(e);
    mouseDown.set(false);
    mouseOver.set(checkHovering(e));
}

function onMouseDown(e)
{
    if (!checkHovering(e)) return;
    outEvent.setRef(e);
    mouseDown.set(true);
}

function onMouseUp(e)
{
    outEvent.setRef(e);
    mouseDown.set(false);
}

function onClickRight(e)
{
    if (!checkHovering(e)) return;
    outEvent.setRef(e);
    mouseClickRight.trigger();
    if (rightClickPrevDef.get()) e.preventDefault();
}

function onmouseclick(e)
{
    if (!checkHovering(e)) return;
    outEvent.setRef(e);
    mouseClick.trigger();
}

function onMouseLeave(e)
{
    outEvent.setRef(e);
    mouseDown.set(false);
    mouseOver.set(checkHovering(e));
}

function onmousemove(e)
{
    mouseOver.set(checkHovering(e));
    if (area.get() === "Canvas Area")
    {
        const r = areaElement.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        if (x < 0 || x > r.width || y > r.height || y < 0) return;
    }

    outEvent.setRef(e);
    setCoords(e);

    outMovementX.set(e.movementX / cgl.pixelDensity);
    outMovementY.set(e.movementY / cgl.pixelDensity);
}

function ontouchmove(e)
{
    if (event.touches && event.touches.length > 0) setCoords(e.touches[0]);
    outEvent.setRef(e);
}

function ontouchstart(event)
{
    mouseDown.set(true);

    if (event.touches && event.touches.length > 0) onMouseDown(event.touches[0]);
    outEvent.setRef(e);
}

function ontouchend(event)
{
    mouseDown.set(false);
    onMouseUp();
    outEvent.setRef(e);
}

/// ////

function setCoords(e)
{
    let x = e.clientX;
    let y = e.clientY;

    if (inEle.isLinked())
    {
        x = e.offsetX;
        y = e.offsetY;
    }
    else
    {
        if (area.get() != "Document")
        {
            x = e.offsetX;
            y = e.offsetY;
        }
        if (area.get() === "Canvas Area")
        {
            const r = areaElement.getBoundingClientRect();
            x = e.clientX - r.left;
            y = e.clientY - r.top;

            if (x < 0 || x > r.width || y > r.height || y < 0) return;
            x = CABLES.clamp(x, 0, r.width);
            y = CABLES.clamp(y, 0, r.height);
        }
    }

    if (flipY.get()) y = areaElement.clientHeight - y;

    setValue(x / cgl.pixelDensity, y / cgl.pixelDensity);
}

function removeListeners()
{
    if (!listenerElement) return;
    listenerElement.removeEventListener("touchend", ontouchend);
    listenerElement.removeEventListener("touchstart", ontouchstart);
    listenerElement.removeEventListener("touchmove", ontouchmove);

    listenerElement.removeEventListener("mousemove", onmousemove);
    listenerElement.removeEventListener("mouseleave", onMouseLeave);
    listenerElement.removeEventListener("mousedown", onMouseDown);
    listenerElement.removeEventListener("mouseup", onMouseUp);
    listenerElement.removeEventListener("mouseenter", onMouseEnter);

    listenerElement.removeEventListener("pointermove", onmousemove);
    listenerElement.removeEventListener("pointerleave", onMouseLeave);
    listenerElement.removeEventListener("pointerdown", onMouseDown);
    listenerElement.removeEventListener("pointerup", onMouseUp);
    listenerElement.removeEventListener("pointerenter", onMouseEnter);

    listenerElement.removeEventListener("click", onmouseclick);
    listenerElement.removeEventListener("contextmenu", onClickRight);
    listenerElement = null;
}

function addListeners()
{
    if (listenerElement || !active.get())removeListeners();
    if (!active.get()) return;

    listenerElement = areaElement = cgl.canvas;

    if (inEle.isLinked())
    {
        listenerElement = areaElement = inEle.get();
    }
    else
    {
        if (area.get() == "Canvas Area")
        {
            areaElement = cgl.canvas.parentElement;
            listenerElement = document.body;
        }
        if (area.get() == "Document") areaElement = listenerElement = document.body;
        if (area.get() == "Parent Element") listenerElement = areaElement = cgl.canvas.parentElement;
    }

    if (!areaElement)
    {
        op.setUiError("noarea", "could not find area element for mouse", 2);
        return;
    }
    op.setUiError("noarea", null);

    let passive = false;
    if (inPassive.get())passive = { "passive": true };

    if (inEventType.get() == "touch")
    {
        listenerElement.addEventListener("touchend", ontouchend, passive);
        listenerElement.addEventListener("touchstart", ontouchstart, passive);
        listenerElement.addEventListener("touchmove", ontouchmove, passive);
    }

    if (inEventType.get() == "Mouse")
    {
        listenerElement.addEventListener("mousemove", onmousemove, passive);
        listenerElement.addEventListener("mouseleave", onMouseLeave, passive);
        listenerElement.addEventListener("mousedown", onMouseDown, passive);
        listenerElement.addEventListener("mouseup", onMouseUp, passive);
        listenerElement.addEventListener("mouseenter", onMouseEnter, passive);
    }

    if (inEventType.get() == "Pointer")
    {
        listenerElement.addEventListener("pointermove", onmousemove, passive);
        listenerElement.addEventListener("pointerleave", onMouseLeave, passive);
        listenerElement.addEventListener("pointerdown", onMouseDown, passive);
        listenerElement.addEventListener("pointerup", onMouseUp, passive);
        listenerElement.addEventListener("pointerenter", onMouseEnter, passive);
    }

    listenerElement.addEventListener("contextmenu", onClickRight, passive);
    listenerElement.addEventListener("click", onmouseclick, passive);
}

//

}
};

CABLES.OPS["c86eb411-a996-47cd-a149-264903dc408c"]={f:Ops.Devices.Mouse.Mouse_v4,objName:"Ops.Devices.Mouse.Mouse_v4"};




// **************************************************************
// 
// Ops.Anim.SimpleAnim
// 
// **************************************************************

Ops.Anim.SimpleAnim= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    exe = op.inTrigger("exe"),
    reset = op.inTriggerButton("reset"),
    rewind = op.inTriggerButton("rewind"),
    inStart = op.inValueFloat("start", 0),
    inEnd = op.inValueFloat("end", 1),
    duration = op.inValueFloat("duration", 0.5),
    loop = op.inValueBool("loop"),
    waitForReset = op.inValueBool("Wait for Reset", true),
    next = op.outTrigger("Next"),
    result = op.outNumber("result"),
    finished = op.outNumber("finished"),
    finishedTrigger = op.outTrigger("Finished Trigger");

const anim = new CABLES.Anim();
let resetted = false;
let currentEasing = -1;
anim.createPort(op, "easing", init);
loop.onChange = init;
init();

duration.onChange = init;

function init()
{
    if (anim.keys.length != 3)
    {
        anim.setValue(0, 0);
        anim.setValue(1, 0);
        anim.setValue(2, 0);
    }

    anim.keys[0].time = CABLES.now() / 1000.0;
    anim.keys[0].value = inStart.get();
    if (anim.defaultEasing != currentEasing) anim.keys[0].setEasing(anim.defaultEasing);

    anim.keys[1].time = duration.get() + CABLES.now() / 1000.0;
    anim.keys[1].value = inEnd.get();

    if (anim.defaultEasing != currentEasing) anim.keys[1].setEasing(anim.defaultEasing);

    anim.loop = loop.get();
    if (anim.loop)
    {
        // anim.keys[2].time = (2.0 * duration.get()) + CABLES.now() / 1000.0;
        // anim.keys[2].value = inStart.get();
        // if (anim.defaultEasing != currentEasing) anim.keys[2].setEasing(anim.defaultEasing);
    }
    else
    {
        anim.keys[2].time = anim.keys[1].time;
        anim.keys[2].value = anim.keys[1].value;
        if (anim.defaultEasing != currentEasing) anim.keys[2].setEasing(anim.defaultEasing);
    }
    finished.set(false);

    currentEasing = anim.defaultEasing;
}

reset.onTriggered = function ()
{
    resetted = true;
    init();
};

rewind.onTriggered = function ()
{
    anim.keys[0].time = CABLES.now() / 1000.0;
    anim.keys[0].value = inStart.get();

    anim.keys[1].time = CABLES.now() / 1000.0;
    anim.keys[1].value = inStart.get();

    anim.keys[2].time = CABLES.now() / 1000.0;
    anim.keys[2].value = inStart.get();

    result.set(inStart.get());
};

exe.onTriggered = function ()
{
    if (waitForReset.get() && !resetted)
    {
        result.set(inStart.get());
        next.trigger();
        return;
    }
    let t = CABLES.now() / 1000;
    let v = anim.getValue(t);
    result.set(v);
    if (anim.hasEnded(t))
    {
        if (!finished.get()) finishedTrigger.trigger();
        finished.set(true);
    }

    next.trigger();
};

}
};

CABLES.OPS["5b244b6e-c505-4743-b2cc-8119ef720028"]={f:Ops.Anim.SimpleAnim,objName:"Ops.Anim.SimpleAnim"};




// **************************************************************
// 
// Ops.Anim.Smooth
// 
// **************************************************************

Ops.Anim.Smooth= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    exec = op.inTrigger("Update"),
    inMode = op.inBool("Separate inc/dec", false),
    inVal = op.inValue("Value"),
    next = op.outTrigger("Next"),
    inDivisorUp = op.inValue("Inc factor", 4),
    inDivisorDown = op.inValue("Dec factor", 4),
    result = op.outNumber("Result", 0);

let val = 0;
let goal = 0;
let oldVal = 0;
let lastTrigger = 0;

op.toWorkPortsNeedToBeLinked(exec);

let divisorUp;
let divisorDown;
let divisor = 4;
let finished = true;

let selectIndex = 0;
const MODE_SINGLE = 0;
const MODE_UP_DOWN = 1;

onFilterChange();
getDivisors();

inMode.setUiAttribs({ "hidePort": true });

inDivisorUp.onChange = inDivisorDown.onChange = getDivisors;
inMode.onChange = onFilterChange;
update();

function onFilterChange()
{
    const selectedMode = inMode.get();
    if (!selectedMode) selectIndex = MODE_SINGLE;
    else selectIndex = MODE_UP_DOWN;

    if (selectIndex == MODE_SINGLE)
    {
        inDivisorDown.setUiAttribs({ "greyout": true });
        inDivisorUp.setUiAttribs({ "title": "Inc/Dec factor" });
    }
    else if (selectIndex == MODE_UP_DOWN)
    {
        inDivisorDown.setUiAttribs({ "greyout": false });
        inDivisorUp.setUiAttribs({ "title": "Inc factor" });
    }

    getDivisors();
    update();
}

function getDivisors()
{
    if (selectIndex == MODE_SINGLE)
    {
        divisorUp = inDivisorUp.get();
        divisorDown = inDivisorUp.get();
    }
    else if (selectIndex == MODE_UP_DOWN)
    {
        divisorUp = inDivisorUp.get();
        divisorDown = inDivisorDown.get();
    }

    if (divisorUp <= 0.2 || divisorUp != divisorUp)divisorUp = 0.2;
    if (divisorDown <= 0.2 || divisorDown != divisorDown)divisorDown = 0.2;
}

inVal.onChange = function ()
{
    finished = false;
    let oldGoal = goal;
    goal = inVal.get();
};

inDivisorUp.onChange = function ()
{
    getDivisors();
};

function update()
{
    let tm = 1;
    if (performance.now() - lastTrigger > 500 || lastTrigger === 0) val = inVal.get() || 0;
    else tm = (performance.now() - lastTrigger) / (performance.now() - lastTrigger);
    lastTrigger = performance.now();

    if (val != val)val = 0;

    if (divisor <= 0)divisor = 0.0001;

    const diff = goal - val;

    if (diff >= 0) val += (diff) / (divisorDown * tm);
    else val += (diff) / (divisorUp * tm);

    if (Math.abs(diff) < 0.00001)val = goal;

    if (divisor != divisor)val = 0;
    if (val != val || val == -Infinity || val == Infinity)val = inVal.get();

    if (oldVal != val)
    {
        result.set(val);
        oldVal = val;
    }

    if (val == goal && !finished)
    {
        finished = true;
        result.set(val);
    }
}

exec.onTriggered = function ()
{
    update();
    next.trigger();
};

}
};

CABLES.OPS["5677b5b5-753a-4fbf-9e91-64c81ec68a2f"]={f:Ops.Anim.Smooth,objName:"Ops.Anim.Smooth"};




// **************************************************************
// 
// Ops.Math.PowerOfTwoSize
// 
// **************************************************************

Ops.Math.PowerOfTwoSize= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    inW = op.inValueInt("Width"),
    inH = op.inValueInt("Height"),
    inStrat = op.inValueSelect("Strategy", ["floor", "floor/2", "ceil"], "floor"),
    outW = op.outNumber("Width Result"),
    outH = op.outNumber("Height Result");
inStrat.onChange = updateStrategy;
inW.onChange = inH.onChange = update;
let getPOT = null;
updateStrategy();

function isPOT(x)
{
    return (x == 1 || x == 2 || x == 4 || x == 8 || x == 16 || x == 32 || x == 64 || x == 128 || x == 256 || x == 512 || x == 1024 || x == 2048 || x == 4096 || x == 8192 || x == 16384);
}

function updateStrategy()
{
    let s = inStrat.get();

    if (s == "floor")getPOT = getPotNextfloor;
    if (s == "floor/2")getPOT = getPotNextfloorx2;
    if (s == "ceil")getPOT = getPotNextBigger;
    if (s == "nearest")getPOT = getPotNearest;

    update();
}

function getPotNextBigger(x)
{
    // if(x>8192)return 16384;
    // if(x>4096)return 8129;
    if (x > 2048) return 4096;
    if (x > 1024) return 2048;
    if (x > 512) return 1024;
    if (x > 256) return 512;
    if (x > 128) return 256;
    if (x > 64) return 128;
    if (x > 32) return 64;
    if (x > 16) return 32;
    if (x > 8) return 16;
    if (x > 4) return 8;
    if (x > 2) return 4;
}

function getPotNextfloorx2(x)
{
    return Math.ceil(getPotNextfloor(x) / 2);
}

function getPotNextfloor(x)
{
    if (x < 2) return 1;
    if (x < 4) return 2;
    if (x < 8) return 4;
    if (x < 16) return 8;
    if (x < 32) return 16;
    if (x < 64) return 32;
    if (x < 128) return 64;
    if (x < 256) return 128;
    if (x < 512) return 256;
    if (x < 1024) return 512;
    if (x < 2048) return 1024;
    if (x < 4096) return 2048;
    if (x < 8192) return 4096;
    // if(x<16384)return 8192;
}

function getPotNearest(x)
{
    if (x > 3072) return 4096;
    if (x > 1536) return 2048;
    if (x > 768) return 1024;
    if (x > 320) return 512;
    if (x > 191) return 256;
    if (x > 95) return 128;
    if (x > 47) return 64;
    if (x > 23) return 32;
    if (x > 11) return 16;
    if (x > 5) return 8;
    if (x > 3) return 4;
    return 2;
}

function update()
{
    let w = inW.get();
    let h = inH.get();

    if (!isPOT(w)) w = getPOT(w);
    if (!isPOT(h)) h = getPOT(h);

    outW.set(w);
    outH.set(h);
}

}
};

CABLES.OPS["58e01e34-0f42-4861-ad9a-ed96e08f8565"]={f:Ops.Math.PowerOfTwoSize,objName:"Ops.Math.PowerOfTwoSize"};




// **************************************************************
// 
// Ops.Math.Divide
// 
// **************************************************************

Ops.Math.Divide= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    number1 = op.inValueFloat("number1", 1),
    number2 = op.inValueFloat("number2", 2),
    result = op.outNumber("result");

op.setUiAttribs({ "mathTitle": true });

number1.onChange = number2.onChange = exec;
exec();

function exec()
{
    result.set(number1.get() / number2.get());
}

}
};

CABLES.OPS["86fcfd8c-038d-4b91-9820-a08114f6b7eb"]={f:Ops.Math.Divide,objName:"Ops.Math.Divide"};




// **************************************************************
// 
// Ops.Trigger.GateTrigger
// 
// **************************************************************

Ops.Trigger.GateTrigger= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    exe = op.inTrigger('Execute'),
    passThrough = op.inValueBool('Pass Through',true),
    triggerOut = op.outTrigger('Trigger out');

exe.onTriggered = function()
{
    if(passThrough.get())
        triggerOut.trigger();
}

}
};

CABLES.OPS["65e8b8a2-ba13-485f-883a-2bcf377989da"]={f:Ops.Trigger.GateTrigger,objName:"Ops.Trigger.GateTrigger"};




// **************************************************************
// 
// Ops.Gl.ClearColor
// 
// **************************************************************

Ops.Gl.ClearColor= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    render = op.inTrigger("render"),
    trigger = op.outTrigger("trigger"),
    r = op.inFloatSlider("r", 0.1),
    g = op.inFloatSlider("g", 0.1),
    b = op.inFloatSlider("b", 0.1),
    a = op.inFloatSlider("a", 1);

r.setUiAttribs({ "colorPick": true });

const cgl = op.patch.cgl;

render.onTriggered = function ()
{
    cgl.gl.clearColor(r.get(), g.get(), b.get(), a.get());
    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);
    trigger.trigger();
};

}
};

CABLES.OPS["19b441eb-9f63-4f35-ba08-b87841517c4d"]={f:Ops.Gl.ClearColor,objName:"Ops.Gl.ClearColor"};




// **************************************************************
// 
// Ops.Trigger.RouteTrigger
// 
// **************************************************************

Ops.Trigger.RouteTrigger= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const NUM_PORTS = 24;
const
    exePort = op.inTriggerButton("Execute"),
    switchPort = op.inValueInt("Switch Value"),
    nextTriggerPort = op.outTrigger("Next Trigger"),
    valueOutPort = op.outNumber("Switched Value");

const triggerPorts = [];
exePort.onTriggered = update;

for (let j = 0; j < NUM_PORTS; j++)
{
    triggerPorts[j] = op.outTrigger("Trigger " + j);

    triggerPorts[j].onLinkChanged = countLinks;
}

const
    defaultTriggerPort = op.outTrigger("Default Trigger"),
    outNumConnected = op.outNumber("Highest Index");

function update()
{
    const index = Math.round(switchPort.get());

    if (index >= 0 && index < NUM_PORTS)
    {
        valueOutPort.set(index);
        triggerPorts[index].trigger();
    }
    else
    {
        valueOutPort.set(-1);
        defaultTriggerPort.trigger();
    }
    nextTriggerPort.trigger();
}

function countLinks()
{
    let count = 0;
    for (let i = 0; i < triggerPorts.length; i++)
        if (triggerPorts[i] && triggerPorts[i].isLinked())count = i;

    outNumConnected.set(count);
}

}
};

CABLES.OPS["44ceb5d8-b040-4722-b189-a6fb8172517d"]={f:Ops.Trigger.RouteTrigger,objName:"Ops.Trigger.RouteTrigger"};




// **************************************************************
// 
// Ops.Cables.UIMode
// 
// **************************************************************

Ops.Cables.UIMode= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    outUI = op.outBoolNum("UI", op.patch.isEditorMode()),
    outOverlay = op.outBoolNum("Overlay Mode", false),
    outRemoteViewer = op.outBoolNum("Remote Viewer", window.gui ? window.gui.isRemoteClient : false),
    outStandalone = op.outBoolNum("Is Standalone", (CABLES.platform && CABLES.platform.frontendOptions.isElectron)),
    outCanvasMode = op.outNumber("Canvas Mode"),
    outPatchVisible = op.outBoolNum("Patch Field Visible");

if (CABLES.UI)
{
    outOverlay.set(gui.shouldDrawOverlay);

    gui.on("overlaysChanged", (active) =>
    {
        outOverlay.set(active);
    });

    gui.on("canvasModeChange", () =>
    {
        outCanvasMode.set(gui.canvasManager.mode);
        outPatchVisible.set(gui.patchView.element.classList.contains("hidden"));
    });
}

}
};

CABLES.OPS["7c110d60-829f-4b06-b3e4-0af911550570"]={f:Ops.Cables.UIMode,objName:"Ops.Cables.UIMode"};




// **************************************************************
// 
// Ops.Number.Number
// 
// **************************************************************

Ops.Number.Number= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    v = op.inValueFloat("value"),
    result = op.outNumber("result");

v.onChange = exec;

let isLinked = false;
v.onLinkChanged = () =>
{
    if (!isLinked && v.isLinked())op.setUiAttribs({ "extendTitle": null });
    isLinked = v.isLinked();
};

function exec()
{
    if (CABLES.UI && !isLinked) op.setUiAttribs({ "extendTitle": v.get() });

    result.set(Number(v.get()));
}

}
};

CABLES.OPS["8fb2bb5d-665a-4d0a-8079-12710ae453be"]={f:Ops.Number.Number,objName:"Ops.Number.Number"};




// **************************************************************
// 
// Ops.Anim.LFO_v3
// 
// **************************************************************

Ops.Anim.LFO_v3= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    time = op.inValue("Time"),
    speed = op.inFloat("Frequency", 1),
    type = op.inValueSelect("Type", ["sine", "triangle", "ramp up", "ramp down", "square"], "sine"),
    phase = op.inValue("Phase", 0),
    rangeMin = op.inValue("Range Min", -1),
    rangeMax = op.inValue("Range Max", 1),
    result = op.outNumber("Result");

let v = 0;
type.onChange = updateType;

updateType();

const PI2 = Math.PI / 2;

function updateType()
{
    if (type.get() == "sine") time.onChange = sine;
    if (type.get() == "ramp up") time.onChange = rampUp;
    if (type.get() == "ramp down") time.onChange = rampDown;
    if (type.get() == "square") time.onChange = square;
    if (type.get() == "triangle") time.onChange = triangle;
}

function updateTime()
{
    return (time.get() * speed.get()) + phase.get();
}

function square()
{
    let t = updateTime() + 0.5;
    v = t % 2.0;
    if (v <= 1.0)v = -1;
    else v = 1;
    v = CABLES.map(v, -1, 1, rangeMin.get(), rangeMax.get());
    result.set(v);
}

function rampUp()
{
    let t = (updateTime() + 1);
    v = t % 1.0;
    v -= 0.5;
    v *= 2.0;
    v = CABLES.map(v, -1, 1, rangeMin.get(), rangeMax.get());
    result.set(v);
}

function rampDown()
{
    let t = updateTime();
    v = t % 1.0;
    v -= 0.5;
    v *= -2.0;
    v = CABLES.map(v, -1, 1, rangeMin.get(), rangeMax.get());
    result.set(v);
}

function triangle()
{
    let t = updateTime();
    v = t % 2.0;
    if (v > 1) v = 2.0 - v;
    v -= 0.5;
    v *= 2.0;
    v = CABLES.map(v, -1, 1, rangeMin.get(), rangeMax.get());
    result.set(v);
}

function sine()
{
    let t = updateTime() * Math.PI - (PI2);
    v = Math.sin((t));
    v = CABLES.map(v, -1, 1, rangeMin.get(), rangeMax.get());
    result.set(v);
}

}
};

CABLES.OPS["5bdbe26b-dea3-4266-850c-1b66ed29936e"]={f:Ops.Anim.LFO_v3,objName:"Ops.Anim.LFO_v3"};




// **************************************************************
// 
// Ops.Anim.Timer_v2
// 
// **************************************************************

Ops.Anim.Timer_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    inSpeed = op.inValue("Speed", 1),
    playPause = op.inValueBool("Play", true),
    reset = op.inTriggerButton("Reset"),
    inSyncTimeline = op.inValueBool("Sync to timeline", false),
    outTime = op.outNumber("Time");

op.setPortGroup("Controls", [playPause, reset, inSpeed]);

const timer = new CABLES.Timer();
let lastTime = null;
let time = 0;
let syncTimeline = false;

playPause.onChange = setState;
setState();

function setState()
{
    if (playPause.get())
    {
        timer.play();
        op.patch.addOnAnimFrame(op);
    }
    else
    {
        timer.pause();
        op.patch.removeOnAnimFrame(op);
    }
}

reset.onTriggered = doReset;

function doReset()
{
    time = 0;
    lastTime = null;
    timer.setTime(0);
    outTime.set(0);
}

inSyncTimeline.onChange = function ()
{
    syncTimeline = inSyncTimeline.get();
    playPause.setUiAttribs({ "greyout": syncTimeline });
    reset.setUiAttribs({ "greyout": syncTimeline });
};

op.onAnimFrame = function (tt, frameNum, deltaMs)
{
    if (timer.isPlaying())
    {
        if (CABLES.overwriteTime !== undefined)
        {
            outTime.set(CABLES.overwriteTime * inSpeed.get());
        }
        else

        if (syncTimeline)
        {
            outTime.set(tt * inSpeed.get());
        }
        else
        {
            timer.update();

            const timerVal = timer.get();

            if (lastTime === null)
            {
                lastTime = timerVal;
                return;
            }

            const t = Math.abs(timerVal - lastTime);
            lastTime = timerVal;

            time += t * inSpeed.get();
            if (time != time)time = 0;
            outTime.set(time);
        }
    }
};

}
};

CABLES.OPS["aac7f721-208f-411a-adb3-79adae2e471a"]={f:Ops.Anim.Timer_v2,objName:"Ops.Anim.Timer_v2"};




// **************************************************************
// 
// Ops.Gl.Performance
// 
// **************************************************************

Ops.Gl.Performance= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    exe = op.inTrigger("exe"),
    inActive = op.inValueBool("Active", true),
    inShow = op.inValueBool("Visible", true),
    inDoGpu = op.inValueBool("Measure GPU", true),
    next = op.outTrigger("childs"),
    position = op.inSwitch("Position", ["top", "bottom"], "top"),
    openDefault = op.inBool("Open", false),
    smoothGraph = op.inBool("Smooth Graph", true),
    inScaleGraph = op.inFloat("Scale", 3),
    inSizeGraph = op.inFloat("Size", 128),
    outCanv = op.outObject("Canvas"),
    outFPS = op.outNumber("FPS");

const cgl = op.patch.cgl;
const element = document.createElement("div");

let elementMeasures = null;
let ctx = null;
let opened = false;
let frameCount = 0;
let fps = 0;
let fpsStartTime = 0;
let childsTime = 0;
let avgMsChilds = 0;
const queue = [];
const timesMainloop = [];
const timesOnFrame = [];
const timesGPU = [];
let avgMs = 0;
let selfTime = 0;
let canvas = null;
let lastTime = 0;
let loadingCounter = 0;
const loadingChars = ["|", "/", "-", "\\"];
let initMeasures = true;

const colorRAFSlow = "#007f9c";
const colorRAFVeruSlow = "#aaaaaa";

const colorBg = "#222222";
const colorRAF = "#003f5c"; // color: https://learnui.design/tools/data-color-picker.html
const colorMainloop = "#7a5195";
const colorOnFrame = "#ef5675";
const colorGPU = "#ffa600";

let startedQuery = false;

let currentTimeGPU = 0;
let currentTimeMainloop = 0;
let currentTimeOnFrame = 0;

op.toWorkPortsNeedToBeLinked(exe, next);

const gl = op.patch.cgl.gl;
const glQueryExt = gl.getExtension("EXT_disjoint_timer_query_webgl2");

inActive.onChange =
exe.onLinkChanged =
    inShow.onChange = () =>
    {
        updateOpened();
        updateVisibility();
    };

position.onChange = updatePos;
inSizeGraph.onChange = updateSize;

element.id = "performance";
element.style.position = "absolute";
element.style.left = "0px";
element.style.opacity = "0.8";
element.style.padding = "10px";
element.style.cursor = "pointer";
element.style.background = "#222";
element.style.color = "white";
element.style["font-family"] = "monospace";
element.style["font-size"] = "12px";
element.style["z-index"] = "99999";

element.innerHTML = "&nbsp;";
element.addEventListener("click", toggleOpened);

const container = op.patch.cgl.canvas.parentElement;
container.appendChild(element);

updateSize();
updateOpened();
updatePos();
updateVisibility();

op.onDelete = function ()
{
    if (canvas)canvas.remove();
    if (element)element.remove();
};

function updatePos()
{
    canvas.style["pointer-events"] = "none";
    if (position.get() == "top")
    {
        canvas.style.top = element.style.top = "0px";
        canvas.style.bottom = element.style.bottom = "initial";
    }
    else
    {
        canvas.style.bottom = element.style.bottom = "0px";
        canvas.style.top = element.style.top = "initial";
    }
}

function updateVisibility()
{
    if (!inShow.get() || !exe.isLinked() || !inActive.get())
    {
        element.style.display = "none";
        element.style.opacity = 0;
        canvas.style.display = "none";
    }
    else
    {
        element.style.display = "block";
        element.style.opacity = 1;
        canvas.style.display = "block";
    }
}

function updateSize()
{
    if (!canvas) return;

    const num = Math.max(0, parseInt(inSizeGraph.get()));

    canvas.width = num;
    canvas.height = num;
    element.style.left = num + "px";

    queue.length = 0;
    timesMainloop.length = 0;
    timesOnFrame.length = 0;
    timesGPU.length = 0;

    for (let i = 0; i < num; i++)
    {
        queue[i] = -1;
        timesMainloop[i] = -1;
        timesOnFrame[i] = -1;
        timesGPU[i] = -1;
    }
}

openDefault.onChange = function ()
{
    opened = openDefault.get();
    updateOpened();
};

function toggleOpened()
{
    if (!inShow.get()) return;
    element.style.opacity = 1;
    opened = !opened;
    updateOpened();
}

function updateOpened()
{
    updateText();
    if (!canvas)createCanvas();
    if (opened)
    {
        canvas.style.display = "block";
        element.style.left = inSizeGraph.get() + "px";
        element.style["min-height"] = "56px";
    }
    else
    {
        canvas.style.display = "none";
        element.style.left = "0px";
        element.style["min-height"] = "auto";
    }
}

function updateCanvas()
{
    const height = canvas.height;
    const hmul = inScaleGraph.get();

    ctx.fillStyle = colorBg;
    ctx.fillRect(0, 0, canvas.width, height);

    ctx.fillStyle = colorRAF;

    let k = 0;
    const numBars = Math.max(0, parseInt(inSizeGraph.get()));

    for (k = numBars; k >= 0; k--)
    {
        if (queue[k] > 30) ctx.fillStyle = colorRAFSlow;
        if (queue[k] > 60) ctx.fillStyle = colorRAFVeruSlow;

        ctx.fillRect(numBars - k, height - queue[k] * hmul, 1, queue[k] * hmul);
        if (queue[k] > 30)ctx.fillStyle = colorRAF;
    }

    for (k = numBars; k >= 0; k--)
    {
        let sum = 0;
        ctx.fillStyle = colorMainloop;
        sum = timesMainloop[k];
        ctx.fillRect(numBars - k, height - sum * hmul, 1, timesMainloop[k] * hmul);

        ctx.fillStyle = colorOnFrame;
        sum += timesOnFrame[k];
        ctx.fillRect(numBars - k, height - sum * hmul, 1, timesOnFrame[k] * hmul);

        ctx.fillStyle = colorGPU;
        sum += timesGPU[k];
        ctx.fillRect(numBars - k, height - sum * hmul, 1, timesGPU[k] * hmul);
    }

    for (let i = 10; i < height; i += 10)
    {
        ctx.fillStyle = "#888";
        const y = height - (i * hmul);
        ctx.fillRect(canvas.width - 5, y, 5, 1);
        ctx.font = "8px arial";

        ctx.fillText(i + "ms", canvas.width - 27, y + 3);
    }

    ctx.fillStyle = "#fff";
    ctx.fillRect(canvas.width - 5, height - (1000 / fps * hmul), 5, 1);
    ctx.fillText(Math.round(1000 / fps) + "ms", canvas.width - 27, height - (1000 / fps * hmul));
}

function createCanvas()
{
    canvas = document.createElement("canvas");
    canvas.id = "performance_" + op.patch.config.glCanvasId;
    canvas.width = inSizeGraph.get();
    canvas.height = inSizeGraph.get();
    canvas.style.display = "block";
    canvas.style.opacity = 0.9;
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.cursor = "pointer";
    canvas.style.top = "-64px";
    canvas.style["z-index"] = "99998";
    container.appendChild(canvas);
    ctx = canvas.getContext("2d");

    canvas.addEventListener("click", toggleOpened);

    updateSize();
}

function updateText()
{
    if (!inShow.get()) return;
    let warn = "";

    if (op.patch.cgl.profileData.profileShaderCompiles > 0)warn += "Shader compile (" + op.patch.cgl.profileData.profileShaderCompileName + ") ";
    if (op.patch.cgl.profileData.profileShaderGetUniform > 0)warn += "Shader get uni loc! (" + op.patch.cgl.profileData.profileShaderGetUniformName + ")";
    if (op.patch.cgl.profileData.profileTextureResize > 0)warn += "Texture resize! ";
    if (op.patch.cgl.profileData.profileFrameBuffercreate > 0)warn += "Framebuffer create! ";
    if (op.patch.cgl.profileData.profileEffectBuffercreate > 0)warn += "Effectbuffer create! ";
    if (op.patch.cgl.profileData.profileTextureDelete > 0)warn += "Texture delete! ";
    if (op.patch.cgl.profileData.profileNonTypedAttrib > 0)warn += "Not-Typed Buffer Attrib! " + op.patch.cgl.profileData.profileNonTypedAttribNames;
    if (op.patch.cgl.profileData.profileTextureNew > 0)warn += "new texture created! ";
    if (op.patch.cgl.profileData.profileGenMipMap > 0)warn += "generating mip maps!";

    if (warn.length > 0)
    {
        warn = "| <span style=\"color:#f80;\">WARNING: " + warn + "<span>";
    }

    let html = "";

    if (opened)
    {
        html += "<span style=\"color:" + colorRAF + "\">■</span> " + fps + " fps ";
        html += "<span style=\"color:" + colorMainloop + "\">■</span> " + Math.round(currentTimeMainloop * 100) / 100 + "ms mainloop ";
        html += "<span style=\"color:" + colorOnFrame + "\">■</span> " + Math.round((currentTimeOnFrame) * 100) / 100 + "ms onframe ";
        if (currentTimeGPU) html += "<span style=\"color:" + colorGPU + "\">■</span> " + Math.round(currentTimeGPU * 100) / 100 + "ms GPU";
        html += warn;
        element.innerHTML = html;
    }
    else
    {
        html += fps + " fps / ";
        html += "CPU: " + Math.round((op.patch.cgl.profileData.profileOnAnimFrameOps) * 100) / 100 + "ms / ";
        if (currentTimeGPU)html += "GPU: " + Math.round(currentTimeGPU * 100) / 100 + "ms  ";
        element.innerHTML = html;
    }

    if (op.patch.loading.getProgress() != 1.0)
    {
        element.innerHTML += "<br/>loading " + Math.round(op.patch.loading.getProgress() * 100) + "% " + loadingChars[(++loadingCounter) % loadingChars.length];
    }

    if (opened)
    {
        let count = 0;
        avgMs = 0;
        avgMsChilds = 0;
        for (let i = queue.length; i > queue.length - queue.length / 3; i--)
        {
            if (queue[i] > -1)
            {
                avgMs += queue[i];
                count++;
            }

            if (timesMainloop[i] > -1) avgMsChilds += timesMainloop[i];
        }

        avgMs /= count;
        avgMsChilds /= count;

        element.innerHTML += "<br/> " + cgl.canvasWidth + " x " + cgl.canvasHeight + " (x" + cgl.pixelDensity + ") ";
        element.innerHTML += "<br/>frame avg: " + Math.round(avgMsChilds * 100) / 100 + " ms (" + Math.round(avgMsChilds / avgMs * 100) + "%) / " + Math.round(avgMs * 100) / 100 + " ms";
        element.innerHTML += " (self: " + Math.round((selfTime) * 100) / 100 + " ms) ";

        element.innerHTML += "<br/>shader binds: " + Math.ceil(op.patch.cgl.profileData.profileShaderBinds / fps) +
            " uniforms: " + Math.ceil(op.patch.cgl.profileData.profileUniformCount / fps) +
            " mvp_uni_mat4: " + Math.ceil(op.patch.cgl.profileData.profileMVPMatrixCount / fps) +
            " num glPrimitives: " + Math.ceil(op.patch.cgl.profileData.profileMeshNumElements / (fps)) +

            " fenced pixelread: " + Math.ceil(op.patch.cgl.profileData.profileFencedPixelRead) +

            " mesh.setGeom: " + op.patch.cgl.profileData.profileMeshSetGeom +
            " videos: " + op.patch.cgl.profileData.profileVideosPlaying +
            " tex preview: " + op.patch.cgl.profileData.profileTexPreviews;

        element.innerHTML +=
        " draw meshes: " + Math.ceil(op.patch.cgl.profileData.profileMeshDraw / fps) +
        " framebuffer blit: " + Math.ceil(op.patch.cgl.profileData.profileFramebuffer / fps) +
        " texeffect blit: " + Math.ceil(op.patch.cgl.profileData.profileTextureEffect / fps);

        element.innerHTML += " all shader compiletime: " + Math.round(op.patch.cgl.profileData.shaderCompileTime * 100) / 100;
    }

    op.patch.cgl.profileData.clear();
}

function styleMeasureEle(ele)
{
    ele.style.padding = "0px";
    ele.style.margin = "0px";
}

function addMeasureChild(m, parentEle, timeSum, level)
{
    const height = 20;
    m.usedAvg = (m.usedAvg || m.used);

    if (!m.ele || initMeasures)
    {
        const newEle = document.createElement("div");
        m.ele = newEle;

        if (m.childs && m.childs.length > 0) newEle.style.height = "500px";
        else newEle.style.height = height + "px";

        newEle.style.overflow = "hidden";
        newEle.style.display = "inline-block";

        if (!m.isRoot)
        {
            newEle.innerHTML = "<div style=\"min-height:" + height + "px;width:100%;overflow:hidden;color:black;position:relative\">&nbsp;" + m.name + "</div>";
            newEle.style["background-color"] = "rgb(" + m.colR + "," + m.colG + "," + m.colB + ")";
            newEle.style["border-left"] = "1px solid black";
        }

        parentEle.appendChild(newEle);
    }

    if (!m.isRoot)
    {
        if (performance.now() - m.lastTime > 200)
        {
            m.ele.style.display = "none";
            m.hidden = true;
        }
        else
        {
            if (m.hidden)
            {
                m.ele.style.display = "inline-block";
                m.hidden = false;
            }
        }

        m.ele.style.float = "left";
        m.ele.style.width = Math.floor((m.usedAvg / timeSum) * 98.0) + "%";
    }
    else
    {
        m.ele.style.width = "100%";
        m.ele.style.clear = "both";
        m.ele.style.float = "none";
    }

    if (m && m.childs && m.childs.length > 0)
    {
        let thisTimeSum = 0;
        for (var i = 0; i < m.childs.length; i++)
        {
            m.childs[i].usedAvg = (m.childs[i].usedAvg || m.childs[i].used) * 0.95 + m.childs[i].used * 0.05;
            thisTimeSum += m.childs[i].usedAvg;
        }
        for (var i = 0; i < m.childs.length; i++)
        {
            addMeasureChild(m.childs[i], m.ele, thisTimeSum, level + 1);
        }
    }
}

function clearMeasures(p)
{
    for (let i = 0; i < p.childs.length; i++) clearMeasures(p.childs[i]);
    p.childs.length = 0;
}

function measures()
{
    if (!CGL.performanceMeasures) return;

    if (!elementMeasures)
    {
        op.log("create measure ele");
        elementMeasures = document.createElement("div");
        elementMeasures.style.width = "100%";
        elementMeasures.style["background-color"] = "#444";
        elementMeasures.style.bottom = "10px";
        elementMeasures.style.height = "100px";
        elementMeasures.style.opacity = "1";
        elementMeasures.style.position = "absolute";
        elementMeasures.style["z-index"] = "99999";
        elementMeasures.innerHTML = "";
        container.appendChild(elementMeasures);
    }

    let timeSum = 0;
    const root = CGL.performanceMeasures[0];

    for (let i = 0; i < root.childs.length; i++) timeSum += root.childs[i].used;

    addMeasureChild(CGL.performanceMeasures[0], elementMeasures, timeSum, 0);

    root.childs.length = 0;

    clearMeasures(CGL.performanceMeasures[0]);

    CGL.performanceMeasures.length = 0;
    initMeasures = false;
}

exe.onTriggered = render;

function render()
{
    const selfTimeStart = performance.now();

    if (inActive.get())
    {
        frameCount++;

        if (glQueryExt && inDoGpu.get() && inShow.get())op.patch.cgl.profileData.doProfileGlQuery = true;
        else op.patch.cgl.profileData.doProfileGlQuery = false;

        if (fpsStartTime === 0)fpsStartTime = Date.now();
        if (Date.now() - fpsStartTime >= 1000)
        {
        // query=null;
            fps = frameCount;
            frameCount = 0;
            // frames = 0;
            outFPS.set(fps);
            if (inShow.get())updateText();

            fpsStartTime = Date.now();
        }

        const glQueryData = op.patch.cgl.profileData.glQueryData;
        currentTimeGPU = 0;
        if (glQueryData)
        {
            let count = 0;
            for (let i in glQueryData)
            {
                count++;
                if (glQueryData[i].time)
                    currentTimeGPU += glQueryData[i].time;
            }
        }

        if (inShow.get())
        {
            measures();

            if (opened && !op.patch.cgl.profileData.pause)
            {
            // const timeUsed = performance.now() - lastTime;
                queue.push(op.patch.cgl.profileData.profileFrameDelta);
                queue.shift();

                timesMainloop.push(childsTime);
                timesMainloop.shift();

                timesOnFrame.push(op.patch.cgl.profileData.profileOnAnimFrameOps - op.patch.cgl.profileData.profileMainloopMs);
                timesOnFrame.shift();

                timesGPU.push(currentTimeGPU);
                timesGPU.shift();

                updateCanvas();
            }
        }

        lastTime = performance.now();
        selfTime = performance.now() - selfTimeStart;

        outCanv.setRef(canvas);
    }
    const startTimeChilds = performance.now();

    next.trigger();

    if (inActive.get())
    {
        const nChildsTime = performance.now() - startTimeChilds;
        const nCurrentTimeMainloop = op.patch.cgl.profileData.profileMainloopMs;
        const nCurrentTimeOnFrame = op.patch.cgl.profileData.profileOnAnimFrameOps - op.patch.cgl.profileData.profileMainloopMs;

        if (smoothGraph.get())
        {
            childsTime = childsTime * 0.9 + nChildsTime * 0.1;
            currentTimeMainloop = currentTimeMainloop * 0.5 + nCurrentTimeMainloop * 0.5;
            currentTimeOnFrame = currentTimeOnFrame * 0.5 + nCurrentTimeOnFrame * 0.5;
        }
        else
        {
            childsTime = nChildsTime;
            currentTimeMainloop = nCurrentTimeMainloop;
            currentTimeOnFrame = nCurrentTimeOnFrame;
        }

        op.patch.cgl.profileData.clearGlQuery();
    }
}

}
};

CABLES.OPS["9cd2d9de-000f-4a14-bd13-e7d5f057583c"]={f:Ops.Gl.Performance,objName:"Ops.Gl.Performance"};




// **************************************************************
// 
// Ops.Gl.MainLoop_v2
// 
// **************************************************************

Ops.Gl.MainLoop_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    hdpi = op.inFloat("Max Pixel Density (DPR)", 2),
    fpsLimit = op.inValue("FPS Limit", 0),
    reduceFocusFPS = op.inValueBool("Reduce FPS unfocussed", false),
    clear = op.inValueBool("Transparent", false),
    active = op.inValueBool("Active", 1),
    trigger = op.outTrigger("trigger"),
    width = op.outNumber("width"),
    height = op.outNumber("height"),
    outPixel = op.outNumber("Pixel Density");

op.onAnimFrame = render;
hdpi.onChange = updateHdpi;

const cgl = op.patch.cg = op.patch.cgl;
let rframes = 0;
let rframeStart = 0;
let timeOutTest = null;
let addedListener = false;
if (!op.patch.cgl) op.uiAttr({ "error": "No webgl cgl context" });

const identTranslate = vec3.create();
vec3.set(identTranslate, 0, 0, 0);
const identTranslateView = vec3.create();
vec3.set(identTranslateView, 0, 0, -2);

let fsElement = null;
let winhasFocus = true;
let winVisible = true;

window.addEventListener("blur", () => { winhasFocus = false; });
window.addEventListener("focus", () => { winhasFocus = true; });
document.addEventListener("visibilitychange", () => { winVisible = !document.hidden; });

testMultiMainloop();

op.patch.tempData.mainloopOp = this;

function updateHdpi()
{
    setPixelDensity();

    if (CABLES.UI)
    {
        if (hdpi.get() < 1)
            op.patch.cgl.canvas.style.imageRendering = "pixelated";
    }

    op.patch.cgl.updateSize();
    if (CABLES.UI) gui.setLayout();
}

active.onChange = function ()
{
    op.patch.removeOnAnimFrame(op);

    if (active.get())
    {
        op.setUiAttrib({ "extendTitle": "" });
        op.onAnimFrame = render;
        op.patch.addOnAnimFrame(op);
        op.log("adding again!");
    }
    else
    {
        op.setUiAttrib({ "extendTitle": "Inactive" });
    }
};

function getFpsLimit()
{
    if (reduceFocusFPS.get())
    {
        if (!winVisible) return 10;
        if (!winhasFocus) return 30;
    }

    return fpsLimit.get();
}

op.onDelete = function ()
{
    cgl.gl.clearColor(0, 0, 0.0, 0);
    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);
};

function setPixelDensity()
{
    if (hdpi.get() != 0) op.patch.cgl.pixelDensity = Math.min(hdpi.get(), window.devicePixelRatio);
    else op.patch.cgl.pixelDensity = window.devicePixelRatio;
}

function render(time)
{
    if (!active.get()) return;
    if (cgl.aborted || cgl.canvas.clientWidth === 0 || cgl.canvas.clientHeight === 0) return;

    op.patch.cg = cgl;

    setPixelDensity();

    // if (hdpi.get())op.patch.cgl.pixelDensity = window.devicePixelRatio;

    const startTime = performance.now();

    op.patch.config.fpsLimit = getFpsLimit();

    if (cgl.canvasWidth == -1)
    {
        cgl.setCanvas(op.patch.config.glCanvasId);
        return;
    }

    if (cgl.canvasWidth != width.get() || cgl.canvasHeight != height.get())
    {
        width.set(cgl.canvasWidth / 1);
        height.set(cgl.canvasHeight / 1);
    }

    if (CABLES.now() - rframeStart > 1000)
    {
        CGL.fpsReport = CGL.fpsReport || [];
        if (op.patch.loading.getProgress() >= 1.0 && rframeStart !== 0)CGL.fpsReport.push(rframes);
        rframes = 0;
        rframeStart = CABLES.now();
    }
    CGL.MESH.lastShader = null;
    CGL.MESH.lastMesh = null;

    cgl.renderStart(cgl, identTranslate, identTranslateView);

    if (!clear.get()) cgl.gl.clearColor(0, 0, 0, 1);
    else cgl.gl.clearColor(0, 0, 0, 0);

    cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT | cgl.gl.DEPTH_BUFFER_BIT);

    trigger.trigger();

    if (CGL.MESH.lastMesh)CGL.MESH.lastMesh.unBind();

    if (CGL.Texture.previewTexture)
    {
        if (!CGL.Texture.texturePreviewer) CGL.Texture.texturePreviewer = new CGL.Texture.texturePreview(cgl);
        CGL.Texture.texturePreviewer.render(CGL.Texture.previewTexture);
    }
    cgl.renderEnd(cgl);

    op.patch.cg = null;

    if (!clear.get())
    {
        cgl.gl.clearColor(1, 1, 1, 1);
        cgl.gl.colorMask(false, false, false, true);
        cgl.gl.clear(cgl.gl.COLOR_BUFFER_BIT);
        cgl.gl.colorMask(true, true, true, true);
    }

    if (!cgl.tempData.phong)cgl.tempData.phong = {};
    rframes++;

    outPixel.set(op.patch.cgl.pixelDensity);
    op.patch.cgl.profileData.profileMainloopMs = performance.now() - startTime;
}

function testMultiMainloop()
{
    clearTimeout(timeOutTest);
    timeOutTest = setTimeout(
        () =>
        {
            if (op.patch.getOpsByObjName(op.name).length > 1)
            {
                op.setUiError("multimainloop", "there should only be one mainloop op!");
                if (!addedListener)addedListener = op.patch.addEventListener("onOpDelete", testMultiMainloop);
            }
            else op.setUiError("multimainloop", null, 1);
        }, 500);
}

}
};

CABLES.OPS["f1029550-d877-42da-9b1e-63a5163a0350"]={f:Ops.Gl.MainLoop_v2,objName:"Ops.Gl.MainLoop_v2"};




// **************************************************************
// 
// Ops.Gl.ImageCompose.ImageComposeSnapshot
// 
// **************************************************************

Ops.Gl.ImageCompose.ImageComposeSnapshot= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    render = op.inTrigger("Update"),
    trigger = op.outTrigger("trigger"),
    outTex = op.outTexture("Texture");

const cgl = op.patch.cgl;
let tc = new CGL.CopyTexture(cgl, "textureThief", {});
let pf = false;
let wrap = -1;
let filter = -1;

render.onTriggered = () =>
{
    if (!CGL.TextureEffect.checkOpInEffect(op)) return;

    const effect = cgl.currentTextureEffect;
    effect.endEffect();

    const shouldPf = cgl.currentTextureEffect.getCurrentSourceTexture().pixelFormat;
    const shouldWrap = cgl.currentTextureEffect.getCurrentSourceTexture().wrap;
    const shouldFilter = cgl.currentTextureEffect.getCurrentSourceTexture().filter;

    if (pf != shouldPf || wrap != shouldWrap || filter != shouldFilter)
    {
        tc = new CGL.CopyTexture(cgl, "textureThief",
            {
                "pixelFormat": cgl.currentTextureEffect.getCurrentSourceTexture().pixelFormat,
                "wrap": shouldWrap,
                "filter": shouldFilter
            });
        pf = shouldPf;
        wrap = shouldWrap;
        filter = shouldFilter;
    }

    const vp = cgl.getViewPort();
    outTex.set(CGL.Texture.getEmptyTexture(cgl));

    const tx = cgl.currentTextureEffect.getCurrentSourceTexture();
    outTex.set(tc.copy(tx));

    effect.continueEffect();

    trigger.trigger();
};

}
};

CABLES.OPS["e15c0803-02bb-4783-9d75-e75abd70d910"]={f:Ops.Gl.ImageCompose.ImageComposeSnapshot,objName:"Ops.Gl.ImageCompose.ImageComposeSnapshot"};




// **************************************************************
// 
// Ops.Gl.ImageCompose.RgbToHsvTexture
// 
// **************************************************************

Ops.Gl.ImageCompose.RgbToHsvTexture= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"tonormal_frag":"#ifdef HAS_TEXTURES\n  IN vec2 texCoord;\n  UNI sampler2D tex;\n#endif\n\nUNI float strength;\n\n\nvec3 rgb2hsv(vec3 c)\n{\n    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\n    float d = q.x - min(q.w, q.y);\n    float e = 1.0e-10;\n    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n}\n\nvec3 hsv2rgb(vec3 c)\n{\n    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n}\n\nvoid main()\n{\n    vec4 col=texture(tex, texCoord);\n\n\n\n    #ifdef OUT_HSB\n        col.rgb=rgb2hsv(col.rgb).rgb;\n    #endif\n    #ifdef OUT_H\n        col.rgb=rgb2hsv(col.rgb).rrr;\n    #endif\n    #ifdef OUT_S\n        col.rgb=rgb2hsv(col.rgb).ggg;\n    #endif\n    #ifdef OUT_B\n        col.rgb=rgb2hsv(col.rgb).bbb;\n    #endif\n    #ifdef OUT_SB\n        col.rgb=rgb2hsv(col.rgb).ggg*rgb2hsv(col.rgb).bbb;\n    #endif\n\n\n    outColor=col;\n}",};
const
    render = op.inTrigger("render"),
    inMeth = op.inSwitch("Output RGB", ["HSB", "Hue", "Sat", "Bright", "Sat*Bright"], "HSB"),
    trigger = op.outTrigger("trigger"),
    cgl = op.patch.cgl,
    shader = new CGL.Shader(cgl, op.name, op);

shader.setSource(shader.getDefaultVertexShader(), attachments.tonormal_frag);
let textureUniform = new CGL.Uniform(shader, "t", "tex", 0);

inMeth.onChange = updateDefines;
updateDefines();

function updateDefines()
{
    shader.toggleDefine("OUT_HSB", inMeth.get() == "HSB");
    shader.toggleDefine("OUT_H", inMeth.get() == "Hue");
    shader.toggleDefine("OUT_S", inMeth.get() == "Sat");
    shader.toggleDefine("OUT_B", inMeth.get() == "Bright");
    shader.toggleDefine("OUT_SB", inMeth.get() == "Sat*Bright");
}

render.onTriggered = function ()
{
    if (!CGL.TextureEffect.checkOpInEffect(op)) return;

    cgl.pushShader(shader);
    cgl.currentTextureEffect.bind();

    cgl.setTexture(0, cgl.currentTextureEffect.getCurrentSourceTexture().tex);

    cgl.currentTextureEffect.finish();
    cgl.popShader();

    trigger.trigger();
};

}
};

CABLES.OPS["147ed29e-f04e-4f7c-b9d7-133d7c6cbef9"]={f:Ops.Gl.ImageCompose.RgbToHsvTexture,objName:"Ops.Gl.ImageCompose.RgbToHsvTexture"};




// **************************************************************
// 
// Ops.Html.Utils.PlayerControlPanel_v2
// 
// **************************************************************

Ops.Html.Utils.PlayerControlPanel_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={"css_progressui_css":".progressUI\n{\n    padding: 10px;\n    position: absolute;\n    border-radius: 10px;\n    background-color: rgba(0,0,0,0.45);\n    margin: 20px;\n    bottom: 10px;\n    height:30px;\n    margin-left:50%;\n    transform: translate(-50%);\n    display: flex;\n    align-items: center;\n}\n\n.progressUI .buttonContainer {\n    display: flex;\n    align-content: center;\n    height: 100%;\n}\n\n.progressUI .progress\n{\n    font-family: Monospace;\n    float:left;\n    color:white;\n    width: auto;\n    margin-left:15px;\n    margin-right: 10px;\n}\n\n.progressUI .progressContainer\n{\n    width:200px;\n    overflow: hidden;\n    background: rgba(0,0,0,0.4);\n    border-radius: 4px;\n    float:left;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    height: 100%;\n}\n\n.progressUI .button\n{\n    cursor: pointer;\n    box-sizing: border-box;\n    background: rgba(0,0,0,0.4);\n    display: flex;\n    align-content: center;\n    padding: 5px;\n    padding-left: 10px;\n    padding-right: 10px;\n    margin-right: 5px;\n    border-radius: 5px;\n    float:left;\n    display: flex;\n    align-items: center;\n}\n\n.progressUIIcon\n{\n    display: inline-block;\n    vertical-align: middle;\n    width: 15px;\n    height: 15px;\n    background-color: white;\n    -webkit-mask-repeat: no-repeat !important;\n    -webkit-mask-size: 100% !important;\n}\n\n.progressUI .progressContainer .progressbar {\n    height: 100%;\n    width: 97%;\n}\n\n.progressUI_icon-play {\n    -webkit-mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play'%3E%3Cpath d='M5 3l14 9-14 9V3z'/%3E%3C/svg%3E\");\n    mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play'%3E%3Cpath d='M5 3l14 9-14 9V3z'/%3E%3C/svg%3E\");\n}\n\n.progressUI_icon-pause {\n    -webkit-mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-pause'%3E%3Cpath d='M6 4h4v16H6zM14 4h4v16h-4z'/%3E%3C/svg%3E\");\n    mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-pause'%3E%3Cpath d='M6 4h4v16H6zM14 4h4v16h-4z'/%3E%3C/svg%3E\");\n}\n\n.progressUI_icon-rewind {\n    -webkit-mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-rewind'%3E%3Cpath d='M11 19l-9-7 9-7v14zM22 19l-9-7 9-7v14z'/%3E%3C/svg%3E\");\n    mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-rewind'%3E%3Cpath d='M11 19l-9-7 9-7v14zM22 19l-9-7 9-7v14z'/%3E%3C/svg%3E\");\n}\n\n.progressUI_icon-fast-forward {\n    -webkit-mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-fast-forward'%3E%3Cpath d='M13 19l9-7-9-7v14zM2 19l9-7-9-7v14z'/%3E%3C/svg%3E\");\n    mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-fast-forward'%3E%3Cpath d='M13 19l9-7-9-7v14zM2 19l9-7-9-7v14z'/%3E%3C/svg%3E\");\n}\n\n.progressUI_icon-skip-back {\n    -webkit-mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-skip-back'%3E%3Cpath d='M19 20L9 12l10-8v16zM5 19V5'/%3E%3C/svg%3E\");\n    mask: url(\"data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-skip-back'%3E%3Cpath d='M19 20L9 12l10-8v16zM5 19V5'/%3E%3C/svg%3E\");\n}\n",};
const
    inMax = op.inFloat("Length", 30),
    inCurrent = op.inFloat("Current", 0),
    inClamp = op.inBool("Clamp", false),
    inIsPlaying = op.inBool("Is Playing", false),
    inVisible = op.inBool("Visible", true),
    inShowValue = op.inBool("Show Time"),
    inShowSkip = op.inBool("Show Skip Buttons"),

    outPlay = op.outTrigger("Play clicked"),
    outPause = op.outTrigger("Pause clicked"),
    outRewind = op.outTrigger("Rewind clicked"),
    outBack = op.outTrigger("Skip Back clicked"),
    outForward = op.outTrigger("Skip Forward clicked"),

    outDragged = op.outTrigger("Dragged"),
    outValue = op.outNumber("Current Value"),
    outDragging = op.outBoolNum("Dragging", false),
    outElement = op.outObject("DOM Element", null, "element");

let div = op.patch.getDocument().createElement("div");
div.id = "progressUI_" + op.id;
div.classList.add("progressUI");
outElement.set(div);

const cgl = op.patch.cgl;
let canvas = op.patch.cgl.canvas.parentElement;
canvas.appendChild(div);

let progressContainer = op.patch.getDocument().createElement("div");
if (!inVisible.get())
{
    div.style.display = "none";
}
let progressbar = op.patch.getDocument().createElement("input");
let progress = op.patch.getDocument().createElement("div");
const buttonContainer = op.patch.getDocument().createElement("div");

progressContainer.classList.add("progressContainer");

progressContainer.appendChild(progressbar);

progressbar.setAttribute("type", "range");
progressbar.setAttribute("step", 0.01);
progressbar.setAttribute("min", 0);
progressbar.setAttribute("max", inMax.get());
progressbar.setAttribute("value", inCurrent.get());
progressbar.classList.add("progressbar");
progressbar.addEventListener("input", handleInput);
let wasPlaying = false;
let isDragging = false;

div.appendChild(buttonContainer);
div.appendChild(progressContainer);
div.appendChild(progress);

let eleId = "css_progressui_" + CABLES.uuid();

const styleEle = op.patch.getDocument().createElement("style");
styleEle.type = "text/css";
styleEle.id = eleId;
styleEle.classList.add("cablesEle");

let head = op.patch.getDocument().getElementsByTagName("body")[0];
head.appendChild(styleEle);

buttonContainer.classList.add("buttonContainer");

let skipbackbutton = addButton("", "progressUI_icon-skip-back");
buttonContainer.appendChild(skipbackbutton);

let rewindButton = addButton("", "progressUI_icon-rewind", "skip");
if (!inShowSkip.get())
{
    rewindButton.style.display = "none";
}
buttonContainer.appendChild(rewindButton);
rewindButton.addEventListener("pointerdown", () =>
{
    outBack.trigger();
});

let playButton = addButton("", "progressUI_icon-play");
buttonContainer.appendChild(playButton);

let forwardButton = addButton("", "progressUI_icon-fast-forward", "skip");
if (!inShowSkip.get())
{
    forwardButton.style.display = "none";
}
buttonContainer.appendChild(forwardButton);

forwardButton.addEventListener("pointerdown", () =>
{
    outForward.trigger();
});

progress.classList.add("progress");
progress.innerHTML = "00:00:000";

function addButton(title, icon, additionalClass)
{
    let button = op.patch.getDocument().createElement("div");
    button.classList.add("button");
    button.classList.add(additionalClass);
    button.innerHTML = title;

    if (icon)
    {
        let buttonicon = op.patch.getDocument().createElement("div");
        buttonicon.classList.add("progressUIIcon");
        buttonicon.classList.add(icon);
        button.appendChild(buttonicon);
    }
    return button;
}

inMax.onChange = () =>
{
    progressbar.setAttribute("max", inMax.get());
};

inVisible.onChange = () =>
{
    if (inVisible.get())
    {
        div.style.removeProperty("display");
    }
    else
    {
        div.style.display = "none";
    }
};

inShowValue.onChange = () =>
{
    if (inShowValue.get())
    {
        div.classList.add("showValue");
        progress.style.display = "block";
    }
    else
    {
        div.classList.remove("showValue");
        progress.style.display = "none";
    }
};

inShowSkip.onChange = () =>
{
    if (inShowSkip.get())
    {
        div.querySelectorAll(".button.skip").forEach((skip) =>
        {
            skip.style.display = "block";
        });
    }
    else
    {
        div.querySelectorAll(".button.skip").forEach((skip) =>
        {
            skip.style.display = "none";
        });
    }
};

if (!inShowValue.get())
{
    progress.style.display = "none";
}
progressbar.addEventListener("pointerdown", () =>
{
    isDragging = true;
    if (inIsPlaying.get())
    {
        wasPlaying = true;
        outPause.trigger();
        updatePlayButton();
    }
});
progressbar.addEventListener("pointermove", () =>
{
    const currentProgress = progressbar.value;
    if (isDragging)
    {
        outDragging.set(isDragging);
        updateProgressDisplay(currentProgress);
        outValue.set(currentProgress);
        outDragged.trigger();
    }
});

progressbar.addEventListener("pointerup", () =>
{
    const currentProgress = progressbar.value;
    updateProgressDisplay(currentProgress);
    outValue.set(currentProgress);

    if (isDragging)
    {
        outDragged.trigger();
    }

    isDragging = false;
    outDragging.set(isDragging);
    if (wasPlaying)
    {
        wasPlaying = false;
        outPlay.trigger();
        updatePlayButton();
    }
});

function updateStyle()
{
    styleEle.textContent = attachments.css_progressui_css;
}

function updatePlayButton()
{
    playButton.querySelector(".progressUIIcon").classList.remove("progressUI_icon-play");
    playButton.querySelector(".progressUIIcon").classList.remove("progressUI_icon-pause");
    if (inIsPlaying.get())
    {
        playButton.querySelector(".progressUIIcon").classList.add("progressUI_icon-pause");
    }
    else
    {
        playButton.querySelector(".progressUIIcon").classList.add("progressUI_icon-play");
    }
}

playButton.addEventListener("pointerdown", function ()
{
    if (inIsPlaying.get())
    {
        outPause.trigger();
    }
    else
    {
        outPlay.trigger();
    }
    updatePlayButton();
});

skipbackbutton.addEventListener("pointerdown", () =>
{
    outValue.set(0);
    outRewind.trigger();
});

op.onDelete = function ()
{
    if (div) div.remove();
    if (styleEle) styleEle.remove();
};

function handleInput(e)
{
    inCurrent.onChange = null;
    const newValue = e.target.value;
    outValue.set(newValue);
    inCurrent.onChange = currentValueChange;
}

function currentValueChange()
{
    let currentValue = inCurrent.get();
    if (inClamp.get() && currentValue > inMax.get())
    {
        currentValue = inMax.get();
    }
    progressbar.value = currentValue;
    outValue.set(currentValue);
    updateProgressDisplay();
}

let lasttime = 0;
function updateProgressDisplay(currentValue = null)
{
    let displayValue = currentValue || inCurrent.get();
    let t = displayValue;
    if (t != lasttime)
    {
        progress.innerHTML = formatValue(t);
        lasttime = t;
    }
}

function formatValue(t)
{
    const minutes = String(new Date(t * 1000).getUTCMinutes()).padStart(2, "0");
    const seconds = String(new Date(t * 1000).getUTCSeconds()).padStart(2, "0");
    const millis = String(new Date(t * 1000).getUTCMilliseconds()).padStart(2, "0").padEnd(3, "0");
    const html = minutes + ":" + seconds + ":" + millis;
    return html;
}

updateStyle();
updatePlayButton();

inCurrent.onChange = currentValueChange;
inIsPlaying.onChange = updatePlayButton;

}
};

CABLES.OPS["12ac1d94-f043-454d-92a8-60733d2908b2"]={f:Ops.Html.Utils.PlayerControlPanel_v2,objName:"Ops.Html.Utils.PlayerControlPanel_v2"};




// **************************************************************
// 
// Ops.Math.Subtract
// 
// **************************************************************

Ops.Math.Subtract= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    number1 = op.inValue("number1", 1),
    number2 = op.inValue("number2", 1),
    result = op.outNumber("result");

op.setUiAttribs({ "mathTitle": true });

number1.onChange =
    number2.onChange = exec;
exec();

function exec()
{
    let v = number1.get() - number2.get();
    if (!isNaN(v)) result.set(v);
}

}
};

CABLES.OPS["a4ffe852-d200-4b96-9347-68feb01122ca"]={f:Ops.Math.Subtract,objName:"Ops.Math.Subtract"};




// **************************************************************
// 
// Ops.Math.Max
// 
// **************************************************************

Ops.Math.Max= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    value = op.inValueFloat("value", 1),
    max = op.inValueFloat("Maximum", 1),
    result = op.outNumber("result");

max.onChange =
    value.onChange = exec;

exec();

function exec()
{
    let v = Math.max(value.get(), max.get());
    if (v == v) result.set(v);
}

}
};

CABLES.OPS["07f0be49-c226-4029-8039-3b620145dc2a"]={f:Ops.Math.Max,objName:"Ops.Math.Max"};




// **************************************************************
// 
// Ops.Math.Delta
// 
// **************************************************************

Ops.Math.Delta= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    val = op.inValue("Value"),
    changeAlwaysPort = op.inValueBool("Change Always", false),
    inReset = op.inTrigger("Reset"),
    result = op.outNumber("Delta");

val.changeAlways = false;

let oldVal = 0;
let firstTime = true;

changeAlwaysPort.onChange = function ()
{
    val.changeAlways = changeAlwaysPort.get();
};

inReset.onTriggered = function ()
{
    firstTime = true;
};

val.onChange = function ()
{
    let change = oldVal - val.get();
    oldVal = val.get();
    if (firstTime)
    {
        firstTime = false;
        return;
    }
    result.set(change);
};

}
};

CABLES.OPS["0f203337-e13c-47ec-a09f-b309212540b0"]={f:Ops.Math.Delta,objName:"Ops.Math.Delta"};




// **************************************************************
// 
// Ops.Math.Multiply
// 
// **************************************************************

Ops.Math.Multiply= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    number1 = op.inValueFloat("number1", 1),
    number2 = op.inValueFloat("number2", 1),
    result = op.outNumber("result");

op.setUiAttribs({ "mathTitle": true });

number1.onChange = number2.onChange = update;
update();

function update()
{
    const n1 = number1.get();
    const n2 = number2.get();

    result.set(n1 * n2);
}

}
};

CABLES.OPS["1bbdae06-fbb2-489b-9bcc-36c9d65bd441"]={f:Ops.Math.Multiply,objName:"Ops.Math.Multiply"};




// **************************************************************
// 
// Ops.Math.DeltaSum
// 
// **************************************************************

Ops.Math.DeltaSum= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    inVal = op.inValue("Delta Value"),
    defVal = op.inValue("Default Value", 0),
    inMul = op.inValue("Multiply", 1),
    inReset = op.inTriggerButton("Reset"),
    inLimit = op.inValueBool("Limit", false),
    inMin = op.inValue("Min", 0),
    inMax = op.inValue("Max", 100),
    inRubber = op.inValue("Rubberband", 0),
    outVal = op.outNumber("Absolute Value");

inVal.changeAlways = true;

op.setPortGroup("Limit", [inLimit, inMin, inMax, inRubber]);

let value = 0;
let lastEvent = CABLES.now();
let rubTimeout = null;

inLimit.onChange = updateLimit;
defVal.onChange =
    inReset.onTriggered = resetValue;

inMax.onChange =
    inMin.onChange = updateValue;

updateLimit();

function resetValue()
{
    let v = defVal.get();

    if (inLimit.get())
    {
        v = Math.max(inMin.get(), v);
        v = Math.min(inMax.get(), v);
    }

    value = v;
    outVal.set(value);
}

function updateLimit()
{
    inMin.setUiAttribs({ "greyout": !inLimit.get() });
    inMax.setUiAttribs({ "greyout": !inLimit.get() });
    inRubber.setUiAttribs({ "greyout": !inLimit.get() });

    updateValue();
}

function releaseRubberband()
{
    const min = inMin.get();
    const max = inMax.get();

    if (value < min) value = min;
    if (value > max) value = max;

    outVal.set(value);
}

function updateValue()
{
    if (inLimit.get())
    {
        const min = inMin.get();
        const max = inMax.get();
        const rubber = inRubber.get();
        const minr = inMin.get() - rubber;
        const maxr = inMax.get() + rubber;

        if (value < minr) value = minr;
        if (value > maxr) value = maxr;

        if (rubber !== 0.0)
        {
            clearTimeout(rubTimeout);
            rubTimeout = setTimeout(releaseRubberband.bind(this), 300);
        }
    }

    outVal.set(value);
}

inVal.onChange = function ()
{
    let v = inVal.get();

    const rubber = inRubber.get();

    if (rubber !== 0.0)
    {
        const min = inMin.get();
        const max = inMax.get();
        const minr = inMin.get() - rubber;
        const maxr = inMax.get() + rubber;

        if (value < min)
        {
            const aa = Math.abs(value - minr) / rubber;
            v *= (aa * aa);
        }
        if (value > max)
        {
            const aa = Math.abs(maxr - value) / rubber;
            v *= (aa * aa);
        }
    }

    lastEvent = CABLES.now();
    value += v * inMul.get();
    updateValue();
};

}
};

CABLES.OPS["d9d4b3db-c24b-48da-b798-9e6230d861f7"]={f:Ops.Math.DeltaSum,objName:"Ops.Math.DeltaSum"};




// **************************************************************
// 
// Ops.Math.Abs
// 
// **************************************************************

Ops.Math.Abs= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    number = op.inValue("number"),
    result = op.outNumber("result");

number.onChange = function ()
{
    result.set(Math.abs(number.get()));
};

}
};

CABLES.OPS["6b5af21d-065f-44d2-9442-8b7a254753f6"]={f:Ops.Math.Abs,objName:"Ops.Math.Abs"};




// **************************************************************
// 
// Ops.Number.TriggerOnChangeNumber_v2
// 
// **************************************************************

Ops.Number.TriggerOnChangeNumber_v2= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    inval = op.inFloat("Value"),
    next = op.outTrigger("Next"),
    number = op.outNumber("Number");

inval.onChange = function ()
{
    number.set(inval.get());
    next.trigger();
};

op.init = () =>
{
    if (inval.isLinked())next.trigger();
};

}
};

CABLES.OPS["63ec7ad7-a436-4f72-8b5e-257cc20049d4"]={f:Ops.Number.TriggerOnChangeNumber_v2,objName:"Ops.Number.TriggerOnChangeNumber_v2"};




// **************************************************************
// 
// Ops.Trigger.DelayedTrigger
// 
// **************************************************************

Ops.Trigger.DelayedTrigger= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    exe = op.inTriggerButton("exe"),
    delay = op.inValueFloat("delay", 1),
    cancel = op.inTriggerButton("Cancel"),
    next = op.outTrigger("next"),
    outDelaying = op.outBool("Delaying");

let lastTimeout = null;

cancel.onTriggered = function ()
{
    if (lastTimeout)clearTimeout(lastTimeout);
    lastTimeout = null;
};

exe.onTriggered = function ()
{
    outDelaying.set(true);
    if (lastTimeout)clearTimeout(lastTimeout);

    lastTimeout = setTimeout(
        function ()
        {
            outDelaying.set(false);
            lastTimeout = null;
            next.trigger();
        },
        delay.get() * 1000);
};

}
};

CABLES.OPS["f4ff66b0-8500-46f7-9117-832aea0c2750"]={f:Ops.Trigger.DelayedTrigger,objName:"Ops.Trigger.DelayedTrigger"};




// **************************************************************
// 
// Ops.Devices.TouchScreen
// 
// **************************************************************

Ops.Devices.TouchScreen= class extends CABLES.Op 
{
constructor()
{
super(...arguments);
const op=this;
const attachments=op.attachments={};
const
    disableScaleWeb = op.inValueBool("Disable Scaling", true),
    disableDefault = op.inValueBool("Disable Scroll", true),
    hdpi = op.inValueBool("HDPI Coordinates", false),
    active = op.inValueBool("Active", true),

    outTouched = op.outNumber("Touched", false),
    numFingers = op.outNumber("Fingers", 0),

    f1x = op.outNumber("Finger 1 X", 0),
    f1y = op.outNumber("Finger 1 Y", 0),
    f1f = op.outNumber("Finger 1 Force", 0),

    f2x = op.outNumber("Finger 2 X", 0),
    f2y = op.outNumber("Finger 2 Y", 0),
    f2f = op.outNumber("Finger 2 Force", 0),
    area = op.inSwitch("Area", ["Canvas", "Document"], "Canvas"),

    outEvents = op.outArray("Events"),
    normalize = op.inValueBool("Normalize Coordinates"),
    flipY = op.inValueBool("Flip Y"),
    outTouchStart = op.outTrigger("Touch Start"),
    outTouchEnd = op.outTrigger("Touch End");

area.onChange = updateArea;

function setPos(event)
{
    if (event.touches && event.touches.length > 0)
    {
        var rect = event.target.getBoundingClientRect();
        var x = event.touches[0].clientX - event.touches[0].target.offsetLeft;
        var y = event.touches[0].clientY - event.touches[0].target.offsetTop;

        if (flipY.get()) y = rect.height - y;

        if (hdpi.get())
        {
            x *= (op.patch.cgl.pixelDensity || 1);
            y *= (op.patch.cgl.pixelDensity || 1);
        }

        if (normalize.get())
        {
            x = (x / rect.width * 2.0 - 1.0);
            y = (y / rect.height * 2.0 - 1.0);
        }

        f1x.set(x);
        f1y.set(y);

        if (event.touches[0].force)f1f.set(event.touches[0].force);
    }

    if (event.touches && event.touches.length > 1)
    {
        var rect = event.target.getBoundingClientRect();
        var x = event.touches[1].clientX - event.touches[1].target.offsetLeft;
        var y = event.touches[1].clientY - event.touches[1].target.offsetTop;

        if (hdpi.get())
        {
            x *= (op.patch.cgl.pixelDensity || 1);
            y *= (op.patch.cgl.pixelDensity || 1);
        }

        if (normalize.get())
        {
            x = (x / rect.width * 2.0 - 1.0);
            y = (y / rect.height * 2.0 - 1.0);
        }

        f2x.set(x);
        f2y.set(y);

        if (event.touches[1].force)f2f.set(event.touches[1].force);
    }
    outEvents.set(event.touches);
}

const ontouchstart = function (event)
{
    outTouched.set(true);
    setPos(event);
    numFingers.set(event.touches.length);
    outTouchStart.trigger();
};

const ontouchend = function (event)
{
    outTouched.set(false);
    f1f.set(0);
    f2f.set(0);
    setPos(event);

    numFingers.set(event.touches.length);
    outTouchEnd.trigger();
};

const ontouchmove = function (event)
{
    setPos(event);
    numFingers.set(event.touches.length);
    if (disableDefault.get() || (disableScaleWeb.get() && event.scale !== 1))
    {
        event.preventDefault();
        document.body.style["touch-action"] = "none";
    }
    else
    {
        document.body.style["touch-action"] = "initial";
    }
};

const cgl = op.patch.cgl;
let listenerElement = null;
function addListeners()
{
    listenerElement.addEventListener("touchmove", ontouchmove, { "passive": false });
    listenerElement.addEventListener("touchstart", ontouchstart, { "passive": false });
    listenerElement.addEventListener("touchend", ontouchend, { "passive": false });
}

function updateArea()
{
    removeListeners();

    if (area.get() == "Document") listenerElement = document;
    else listenerElement = cgl.canvas;

    if (active.get()) addListeners();
}

function removeListeners()
{
    if (listenerElement)
    {
        listenerElement.removeEventListener("touchmove", ontouchmove);
        listenerElement.removeEventListener("touchstart", ontouchstart);
        listenerElement.removeEventListener("touchend", ontouchend);
    }
    listenerElement = null;
}

active.onChange = function ()
{
    updateArea();
};

updateArea();

}
};

CABLES.OPS["cedffacf-0f09-4342-bd21-540bd9c8037d"]={f:Ops.Devices.TouchScreen,objName:"Ops.Devices.TouchScreen"};



window.addEventListener('load', function(event) {
CABLES.jsLoaded=new Event('CABLES.jsLoaded');
document.dispatchEvent(CABLES.jsLoaded);
});
