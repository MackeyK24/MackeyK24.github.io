var __extends=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])};return function(t,n){function i(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}}(),__decorate=this&&this.__decorate||function(e,t,n,i){var r,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,n,i);else for(var u=e.length-1;u>=0;u--)(r=e[u])&&(a=(o<3?r(a):o>3?r(t,n,a):r(t,n))||a);return o>3&&a&&Object.defineProperty(t,n,a),a};String.prototype.startsWith||(String.prototype.startsWith=function(e,t){return this.substr(!t||t<0?0:+t,e.length)===e}),String.prototype.endsWith||(String.prototype.endsWith=function(e,t){return(void 0===t||t>this.length)&&(t=this.length),this.substring(t-e.length,t)===e}),Array.prototype.find||Object.defineProperty(Array.prototype,"find",{value:function(e){if(null==this)throw new TypeError('"this" is null or not defined');var t=Object(this),n=t.length>>>0;if("function"!=typeof e)throw new TypeError("predicate must be a function");for(var i=arguments[1],r=0;r<n;){var o=t[r];if(e.call(i,o,r,t))return o;r++}},configurable:!0,writable:!0}),Array.prototype.includes||Object.defineProperty(Array.prototype,"includes",{value:function(e,t){function n(e,t){return e===t||"number"==typeof e&&"number"==typeof t&&isNaN(e)&&isNaN(t)}if(null==this)throw new TypeError('"this" is null or not defined');var i=Object(this),r=i.length>>>0;if(0===r)return!1;for(var o=0|t,a=Math.max(o>=0?o:r-Math.abs(o),0);a<r;){if(n(i[a],e))return!0;a++}return!1}}),function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.PointerEventsPolyfill=t()}(this,function(){"use strict";function e(e,t){t=t||Object.create(null);var n=document.createEvent("Event");n.initEvent(e,t.bubbles||!1,t.cancelable||!1);for(var i,r=2;r<p.length;r++)i=p[r],n[i]=t[i]||d[r];n.buttons=t.buttons||0;var o=0;return o=t.pressure&&n.buttons?t.pressure:n.buttons?.5:0,n.x=n.clientX,n.y=n.clientY,n.pointerId=t.pointerId||0,n.width=t.width||0,n.height=t.height||0,n.pressure=o,n.tiltX=t.tiltX||0,n.tiltY=t.tiltY||0,n.twist=t.twist||0,n.tangentialPressure=t.tangentialPressure||0,n.pointerType=t.pointerType||"",n.hwTimestamp=t.hwTimestamp||0,n.isPrimary=t.isPrimary||!1,n}function t(){this.array=[],this.size=0}function n(e,t,n,i){this.addCallback=e.bind(i),this.removeCallback=t.bind(i),this.changedCallback=n.bind(i),O&&(this.observer=new O(this.mutationWatcher.bind(this)))}function i(e){return"body /shadow-deep/ "+r(e)}function r(e){return'[touch-action="'+e+'"]'}function o(e){return"{ -ms-touch-action: "+e+"; touch-action: "+e+"; }"}function a(){if(R){C.forEach(function(e){String(e)===e?(M+=r(e)+o(e)+"\n",F&&(M+=i(e)+o(e)+"\n")):(M+=e.selectors.map(r)+o(e.rule)+"\n",F&&(M+=e.selectors.map(i)+o(e.rule)+"\n"))});var e=document.createElement("style");e.textContent=M,document.head.appendChild(e)}}function u(){if(!window.PointerEvent){if(window.PointerEvent=e,window.navigator.msPointerEnabled){var t=window.navigator.msMaxTouchPoints;Object.defineProperty(window.navigator,"maxTouchPoints",{value:t,enumerable:!0}),w.registerSource("ms",Z)}else Object.defineProperty(window.navigator,"maxTouchPoints",{value:0,enumerable:!0}),w.registerSource("mouse",Y),void 0!==window.ontouchstart&&w.registerSource("touch",V);w.register(document)}}function s(e){if(!w.pointermap.has(e)){var t=new Error("InvalidPointerId");throw t.name="InvalidPointerId",t}}function l(e){for(var t=e.parentNode;t&&t!==e.ownerDocument;)t=t.parentNode;if(!t){var n=new Error("InvalidStateError");throw n.name="InvalidStateError",n}}function c(e){var t=w.pointermap.get(e);return 0!==t.buttons}function h(){window.Element&&!Element.prototype.setPointerCapture&&Object.defineProperties(Element.prototype,{setPointerCapture:{value:G},releasePointerCapture:{value:H},hasPointerCapture:{value:$}})}var p=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","pageX","pageY"],d=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0],m=window.Map&&window.Map.prototype.forEach,f=m?Map:t;t.prototype={set:function(e,t){return void 0===t?this["delete"](e):(this.has(e)||this.size++,void(this.array[e]=t))},has:function(e){return void 0!==this.array[e]},"delete":function(e){this.has(e)&&(delete this.array[e],this.size--)},get:function(e){return this.array[e]},clear:function(){this.array.length=0,this.size=0},forEach:function(e,t){return this.array.forEach(function(n,i){e.call(t,n,i,this)},this)}};var v=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","buttons","pointerId","width","height","pressure","tiltX","tiltY","pointerType","hwTimestamp","isPrimary","type","target","currentTarget","which","pageX","pageY","timeStamp"],g=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0,0,0,0,0,0,"",0,!1,"",null,null,0,0,0,0],y={pointerover:1,pointerout:1,pointerenter:1,pointerleave:1},b="undefined"!=typeof SVGElementInstance,w={pointermap:new f,eventMap:Object.create(null),captureInfo:Object.create(null),eventSources:Object.create(null),eventSourceList:[],registerSource:function(e,t){var n=t,i=n.events;i&&(i.forEach(function(e){n[e]&&(this.eventMap[e]=n[e].bind(n))},this),this.eventSources[e]=n,this.eventSourceList.push(n))},register:function(e){for(var t,n=this.eventSourceList.length,i=0;i<n&&(t=this.eventSourceList[i]);i++)t.register.call(t,e)},unregister:function(e){for(var t,n=this.eventSourceList.length,i=0;i<n&&(t=this.eventSourceList[i]);i++)t.unregister.call(t,e)},contains:function(e,t){try{return e.contains(t)}catch(n){return!1}},down:function(e){e.bubbles=!0,this.fireEvent("pointerdown",e)},move:function(e){e.bubbles=!0,this.fireEvent("pointermove",e)},up:function(e){e.bubbles=!0,this.fireEvent("pointerup",e)},enter:function(e){e.bubbles=!1,this.fireEvent("pointerenter",e)},leave:function(e){e.bubbles=!1,this.fireEvent("pointerleave",e)},over:function(e){e.bubbles=!0,this.fireEvent("pointerover",e)},out:function(e){e.bubbles=!0,this.fireEvent("pointerout",e)},cancel:function(e){e.bubbles=!0,this.fireEvent("pointercancel",e)},leaveOut:function(e){this.out(e),this.propagate(e,this.leave,!1)},enterOver:function(e){this.over(e),this.propagate(e,this.enter,!0)},eventHandler:function(e){if(!e._handledByPE){var t=e.type,n=this.eventMap&&this.eventMap[t];n&&n(e),e._handledByPE=!0}},listen:function(e,t){t.forEach(function(t){this.addEvent(e,t)},this)},unlisten:function(e,t){t.forEach(function(t){this.removeEvent(e,t)},this)},addEvent:function(e,t){e.addEventListener(t,this.boundHandler)},removeEvent:function(e,t){e.removeEventListener(t,this.boundHandler)},makeEvent:function(t,n){this.captureInfo[n.pointerId]&&(n.relatedTarget=null);var i=new e(t,n);return n.preventDefault&&(i.preventDefault=n.preventDefault),i._target=i._target||n.target,i},fireEvent:function(e,t){var n=this.makeEvent(e,t);return this.dispatchEvent(n)},cloneEvent:function(e){for(var t,n=Object.create(null),i=0;i<v.length;i++)t=v[i],n[t]=e[t]||g[i],!b||"target"!==t&&"relatedTarget"!==t||n[t]instanceof SVGElementInstance&&(n[t]=n[t].correspondingUseElement);return e.preventDefault&&(n.preventDefault=function(){e.preventDefault()}),n},getTarget:function(e){var t=this.captureInfo[e.pointerId];return t?e._target!==t&&e.type in y?void 0:t:e._target},propagate:function(e,t,n){for(var i=e.target,r=[];i!==document&&!i.contains(e.relatedTarget);)if(r.push(i),i=i.parentNode,!i)return;n&&r.reverse(),r.forEach(function(n){e.target=n,t.call(this,e)},this)},setCapture:function(t,n,i){this.captureInfo[t]&&this.releaseCapture(t,i),this.captureInfo[t]=n,this.implicitRelease=this.releaseCapture.bind(this,t,i),document.addEventListener("pointerup",this.implicitRelease),document.addEventListener("pointercancel",this.implicitRelease);var r=new e("gotpointercapture");r.pointerId=t,r._target=n,i||this.asyncDispatchEvent(r)},releaseCapture:function(t,n){var i=this.captureInfo[t];if(i){this.captureInfo[t]=void 0,document.removeEventListener("pointerup",this.implicitRelease),document.removeEventListener("pointercancel",this.implicitRelease);var r=new e("lostpointercapture");r.pointerId=t,r._target=i,n||this.asyncDispatchEvent(r)}},dispatchEvent:function(e){var t=this.getTarget(e);if(t)return t.dispatchEvent(e)},asyncDispatchEvent:function(e){requestAnimationFrame(this.dispatchEvent.bind(this,e))}};w.boundHandler=w.eventHandler.bind(w);var T={shadow:function(e){if(e)return e.shadowRoot||e.webkitShadowRoot},canTarget:function(e){return e&&Boolean(e.elementFromPoint)},targetingShadow:function(e){var t=this.shadow(e);if(this.canTarget(t))return t},olderShadow:function(e){var t=e.olderShadowRoot;if(!t){var n=e.querySelector("shadow");n&&(t=n.olderShadowRoot)}return t},allShadows:function(e){for(var t=[],n=this.shadow(e);n;)t.push(n),n=this.olderShadow(n);return t},searchRoot:function(e,t,n){if(e){var i,r,o=e.elementFromPoint(t,n);for(r=this.targetingShadow(o);r;){if(i=r.elementFromPoint(t,n)){var a=this.targetingShadow(i);return this.searchRoot(a,t,n)||i}r=this.olderShadow(r)}return o}},owner:function(e){for(var t=e;t.parentNode;)t=t.parentNode;return t.nodeType!==Node.DOCUMENT_NODE&&t.nodeType!==Node.DOCUMENT_FRAGMENT_NODE&&(t=document),t},findTarget:function(e){var t=e.clientX,n=e.clientY,i=this.owner(e.target);return i.elementFromPoint(t,n)||(i=document),this.searchRoot(i,t,n)}},P=Array.prototype.forEach.call.bind(Array.prototype.forEach),E=Array.prototype.map.call.bind(Array.prototype.map),S=Array.prototype.slice.call.bind(Array.prototype.slice),A=Array.prototype.filter.call.bind(Array.prototype.filter),O=window.MutationObserver||window.WebKitMutationObserver,I="[touch-action]",x={subtree:!0,childList:!0,attributes:!0,attributeOldValue:!0,attributeFilter:["touch-action"]};n.prototype={watchSubtree:function(e){this.observer&&T.canTarget(e)&&this.observer.observe(e,x)},enableOnSubtree:function(e){this.watchSubtree(e),e===document&&"complete"!==document.readyState?this.installOnLoad():this.installNewSubtree(e)},installNewSubtree:function(e){P(this.findElements(e),this.addElement,this)},findElements:function(e){return e.querySelectorAll?e.querySelectorAll(I):[]},removeElement:function(e){this.removeCallback(e)},addElement:function(e){this.addCallback(e)},elementChanged:function(e,t){this.changedCallback(e,t)},concatLists:function(e,t){return e.concat(S(t))},installOnLoad:function(){document.addEventListener("readystatechange",function(){"complete"===document.readyState&&this.installNewSubtree(document)}.bind(this))},isElement:function(e){return e.nodeType===Node.ELEMENT_NODE},flattenMutationTree:function(e){var t=E(e,this.findElements,this);return t.push(A(e,this.isElement)),t.reduce(this.concatLists,[])},mutationWatcher:function(e){e.forEach(this.mutationHandler,this)},mutationHandler:function(e){if("childList"===e.type){var t=this.flattenMutationTree(e.addedNodes);t.forEach(this.addElement,this);var n=this.flattenMutationTree(e.removedNodes);n.forEach(this.removeElement,this)}else"attributes"===e.type&&this.elementChanged(e.target,e.oldValue)}};var C=["none","auto","pan-x","pan-y",{rule:"pan-x pan-y",selectors:["pan-x pan-y","pan-y pan-x"]}],M="",R=window.PointerEvent||window.MSPointerEvent,F=!window.ShadowDOMPolyfill&&document.head.createShadowRoot,k=w.pointermap,q=25,_=[1,4,2,8,16],D=!1;try{D=1===new MouseEvent("test",{buttons:1}).buttons}catch(N){}var L,Y={POINTER_ID:1,POINTER_TYPE:"mouse",events:["mousedown","mousemove","mouseup","mouseover","mouseout"],register:function(e){w.listen(e,this.events)},unregister:function(e){w.unlisten(e,this.events)},lastTouches:[],isEventSimulatedFromTouch:function(e){for(var t,n=this.lastTouches,i=e.clientX,r=e.clientY,o=0,a=n.length;o<a&&(t=n[o]);o++){var u=Math.abs(i-t.x),s=Math.abs(r-t.y);if(u<=q&&s<=q)return!0}},prepareEvent:function(e){var t=w.cloneEvent(e),n=t.preventDefault;return t.preventDefault=function(){e.preventDefault(),n()},t.pointerId=this.POINTER_ID,t.isPrimary=!0,t.pointerType=this.POINTER_TYPE,t},prepareButtonsForMove:function(e,t){var n=k.get(this.POINTER_ID);0!==t.which&&n?e.buttons=n.buttons:e.buttons=0,t.buttons=e.buttons},mousedown:function(e){if(!this.isEventSimulatedFromTouch(e)){var t=k.get(this.POINTER_ID),n=this.prepareEvent(e);D||(n.buttons=_[n.button],t&&(n.buttons|=t.buttons),e.buttons=n.buttons),k.set(this.POINTER_ID,e),t&&0!==t.buttons?w.move(n):w.down(n)}},mousemove:function(e){if(!this.isEventSimulatedFromTouch(e)){var t=this.prepareEvent(e);D||this.prepareButtonsForMove(t,e),t.button=-1,k.set(this.POINTER_ID,e),w.move(t)}},mouseup:function(e){if(!this.isEventSimulatedFromTouch(e)){var t=k.get(this.POINTER_ID),n=this.prepareEvent(e);if(!D){var i=_[n.button];n.buttons=t?t.buttons&~i:0,e.buttons=n.buttons}k.set(this.POINTER_ID,e),n.buttons&=~_[n.button],0===n.buttons?w.up(n):w.move(n)}},mouseover:function(e){if(!this.isEventSimulatedFromTouch(e)){var t=this.prepareEvent(e);D||this.prepareButtonsForMove(t,e),t.button=-1,k.set(this.POINTER_ID,e),w.enterOver(t)}},mouseout:function(e){if(!this.isEventSimulatedFromTouch(e)){var t=this.prepareEvent(e);D||this.prepareButtonsForMove(t,e),t.button=-1,w.leaveOut(t)}},cancel:function(e){var t=this.prepareEvent(e);w.cancel(t),this.deactivateMouse()},deactivateMouse:function(){k["delete"](this.POINTER_ID)}},X=w.captureInfo,W=T.findTarget.bind(T),z=T.allShadows.bind(T),j=w.pointermap,B=2500,K=200,U="touch-action",V={events:["touchstart","touchmove","touchend","touchcancel"],register:function(e){L.enableOnSubtree(e)},unregister:function(){},elementAdded:function(e){var t=e.getAttribute(U),n=this.touchActionToScrollType(t);n&&(e._scrollType=n,w.listen(e,this.events),z(e).forEach(function(e){e._scrollType=n,w.listen(e,this.events)},this))},elementRemoved:function(e){e._scrollType=void 0,w.unlisten(e,this.events),z(e).forEach(function(e){e._scrollType=void 0,w.unlisten(e,this.events)},this)},elementChanged:function(e,t){var n=e.getAttribute(U),i=this.touchActionToScrollType(n),r=this.touchActionToScrollType(t);i&&r?(e._scrollType=i,z(e).forEach(function(e){e._scrollType=i},this)):r?this.elementRemoved(e):i&&this.elementAdded(e)},scrollTypes:{EMITTER:"none",XSCROLLER:"pan-x",YSCROLLER:"pan-y",SCROLLER:/^(?:pan-x pan-y)|(?:pan-y pan-x)|auto$/},touchActionToScrollType:function(e){var t=e,n=this.scrollTypes;return"none"===t?"none":t===n.XSCROLLER?"X":t===n.YSCROLLER?"Y":n.SCROLLER.exec(t)?"XY":void 0},POINTER_TYPE:"touch",firstTouch:null,isPrimaryTouch:function(e){return this.firstTouch===e.identifier},setPrimaryTouch:function(e){(0===j.size||1===j.size&&j.has(1))&&(this.firstTouch=e.identifier,this.firstXY={X:e.clientX,Y:e.clientY},this.scrolling=!1,this.cancelResetClickCount())},removePrimaryPointer:function(e){e.isPrimary&&(this.firstTouch=null,this.firstXY=null,this.resetClickCount())},clickCount:0,resetId:null,resetClickCount:function(){var e=function(){this.clickCount=0,this.resetId=null}.bind(this);this.resetId=setTimeout(e,K)},cancelResetClickCount:function(){this.resetId&&clearTimeout(this.resetId)},typeToButtons:function(e){var t=0;return"touchstart"!==e&&"touchmove"!==e||(t=1),t},touchToPointer:function(e){var t=this.currentTouchEvent,n=w.cloneEvent(e),i=n.pointerId=e.identifier+2;n.target=X[i]||W(n),n.bubbles=!0,n.cancelable=!0,n.detail=this.clickCount,n.button=0,n.buttons=this.typeToButtons(t.type),n.width=2*(e.radiusX||e.webkitRadiusX||0),n.height=2*(e.radiusY||e.webkitRadiusY||0),n.pressure=e.force||e.webkitForce||.5,n.isPrimary=this.isPrimaryTouch(e),n.pointerType=this.POINTER_TYPE,n.altKey=t.altKey,n.ctrlKey=t.ctrlKey,n.metaKey=t.metaKey,n.shiftKey=t.shiftKey;var r=this;return n.preventDefault=function(){r.scrolling=!1,r.firstXY=null,t.preventDefault()},n},processTouches:function(e,t){var n=e.changedTouches;this.currentTouchEvent=e;for(var i,r=0;r<n.length;r++)i=n[r],t.call(this,this.touchToPointer(i))},shouldScroll:function(e){if(this.firstXY){var t,n=e.currentTarget._scrollType;if("none"===n)t=!1;else if("XY"===n)t=!0;else{var i=e.changedTouches[0],r=n,o="Y"===n?"X":"Y",a=Math.abs(i["client"+r]-this.firstXY[r]),u=Math.abs(i["client"+o]-this.firstXY[o]);t=a>=u}return this.firstXY=null,t}},findTouch:function(e,t){for(var n,i=0,r=e.length;i<r&&(n=e[i]);i++)if(n.identifier===t)return!0},vacuumTouches:function(e){var t=e.touches;if(j.size>=t.length){var n=[];j.forEach(function(e,i){if(1!==i&&!this.findTouch(t,i-2)){var r=e.out;n.push(r)}},this),n.forEach(this.cancelOut,this)}},touchstart:function(e){this.vacuumTouches(e),this.setPrimaryTouch(e.changedTouches[0]),this.dedupSynthMouse(e),this.scrolling||(this.clickCount++,this.processTouches(e,this.overDown))},overDown:function(e){j.set(e.pointerId,{target:e.target,out:e,outTarget:e.target}),w.enterOver(e),w.down(e)},touchmove:function(e){this.scrolling||(this.shouldScroll(e)?(this.scrolling=!0,this.touchcancel(e)):(e.preventDefault(),this.processTouches(e,this.moveOverOut)))},moveOverOut:function(e){var t=e,n=j.get(t.pointerId);if(n){var i=n.out,r=n.outTarget;w.move(t),i&&r!==t.target&&(i.relatedTarget=t.target,t.relatedTarget=r,i.target=r,t.target?(w.leaveOut(i),w.enterOver(t)):(t.target=r,t.relatedTarget=null,this.cancelOut(t))),n.out=t,n.outTarget=t.target}},touchend:function(e){this.dedupSynthMouse(e),this.processTouches(e,this.upOut)},upOut:function(e){this.scrolling||(w.up(e),w.leaveOut(e)),this.cleanUpPointer(e)},touchcancel:function(e){this.processTouches(e,this.cancelOut)},cancelOut:function(e){w.cancel(e),w.leaveOut(e),this.cleanUpPointer(e)},cleanUpPointer:function(e){j["delete"](e.pointerId),this.removePrimaryPointer(e)},dedupSynthMouse:function(e){var t=Y.lastTouches,n=e.changedTouches[0];if(this.isPrimaryTouch(n)){var i={x:n.clientX,y:n.clientY};t.push(i);var r=function(e,t){var n=e.indexOf(t);n>-1&&e.splice(n,1)}.bind(null,t,i);setTimeout(r,B)}}};L=new n(V.elementAdded,V.elementRemoved,V.elementChanged,V);var G,H,$,Q=w.pointermap,J=window.MSPointerEvent&&"number"==typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE,Z={events:["MSPointerDown","MSPointerMove","MSPointerUp","MSPointerOut","MSPointerOver","MSPointerCancel","MSGotPointerCapture","MSLostPointerCapture"],register:function(e){w.listen(e,this.events)},unregister:function(e){w.unlisten(e,this.events)},POINTER_TYPES:["","unavailable","touch","pen","mouse"],prepareEvent:function(e){var t=e;return J&&(t=w.cloneEvent(e),t.pointerType=this.POINTER_TYPES[e.pointerType]),t},cleanup:function(e){Q["delete"](e)},MSPointerDown:function(e){Q.set(e.pointerId,e);var t=this.prepareEvent(e);w.down(t)},MSPointerMove:function(e){var t=this.prepareEvent(e);w.move(t)},MSPointerUp:function(e){var t=this.prepareEvent(e);w.up(t),this.cleanup(e.pointerId)},MSPointerOut:function(e){var t=this.prepareEvent(e);w.leaveOut(t)},MSPointerOver:function(e){var t=this.prepareEvent(e);w.enterOver(t)},MSPointerCancel:function(e){var t=this.prepareEvent(e);w.cancel(t),this.cleanup(e.pointerId)},MSLostPointerCapture:function(e){var t=w.makeEvent("lostpointercapture",e);w.dispatchEvent(t)},MSGotPointerCapture:function(e){var t=w.makeEvent("gotpointercapture",e);w.dispatchEvent(t)}},ee=window.navigator;ee.msPointerEnabled?(G=function(e){s(e),l(this),c(e)&&(w.setCapture(e,this,!0),this.msSetPointerCapture(e))},H=function(e){s(e),w.releaseCapture(e,!0),this.msReleasePointerCapture(e)}):(G=function(e){s(e),l(this),c(e)&&w.setCapture(e,this)},H=function(e){s(e),w.releaseCapture(e)}),$=function(e){return!!w.captureInfo[e]},a(),u(),h();var te={dispatcher:w,Installer:n,PointerEvent:e,PointerMap:f,targetFinding:T};return te}),pc.Scene.prototype.metadata=null,pc.Entity.prototype.metadata=null,pc.Entity.prototype.animations=null,function(e,t){function n(e,t){for(var n in t)try{e.style[n]=t[n]}catch(i){}return e}function i(e){return null==e?String(e):"object"==typeof e||"function"==typeof e?Object.prototype.toString.call(e).match(/\s([a-z]+)/i)[1].toLowerCase()||"object":typeof e}function r(e,t){if("array"!==i(t))return-1;if(t.indexOf)return t.indexOf(e);for(var n=0,r=t.length;n<r;n++)if(t[n]===e)return n;return-1}function o(){var e,t=arguments;for(e in t[1])if(t[1].hasOwnProperty(e))switch(i(t[1][e])){case"object":t[0][e]=o({},t[0][e],t[1][e]);break;case"array":t[0][e]=t[1][e].slice(0);break;default:t[0][e]=t[1][e]}return 2<t.length?o.apply(null,[t[0]].concat(Array.prototype.slice.call(t,2))):t[0]}function a(e){return e=Math.round(255*e).toString(16),1===e.length?"0"+e:e}function u(e,t,n,i){e.addEventListener?e[i?"removeEventListener":"addEventListener"](t,n,!1):e.attachEvent&&e[i?"detachEvent":"attachEvent"]("on"+t,n)}function s(e,c){function d(e,t,n,i){return S[0|e][Math.round(Math.min((t-n)/(i-n)*D,D))]}function m(){q.legend.fps!==B&&(q.legend.fps=B,q.legend[v]=B?"FPS":"ms"),C=B?F.fps:F.duration,q.count[v]=999<C?"999+":C.toFixed(99<C?0:k.decimals)}function f(){for(A=l(),W<A-k.threshold&&(F.fps-=F.fps/Math.max(1,60*k.smoothing/k.interval),F.duration=1e3/F.fps),M=k.history;M--;)z[M]=0===M?F.fps:z[M-1],j[M]=0===M?F.duration:j[M-1];if(m(),k.heat){if(N.length)for(M=N.length;M--;)N[M].el.style[E[N[M].name].heatOn]=B?d(E[N[M].name].heatmap,F.fps,0,k.maxFps):d(E[N[M].name].heatmap,F.duration,k.threshold,0);if(q.graph&&E.column.heatOn)for(M=_.length;M--;)_[M].style[E.column.heatOn]=B?d(E.column.heatmap,z[M],0,k.maxFps):d(E.column.heatmap,j[M],k.threshold,0)}if(q.graph)for(R=0;R<k.history;R++)_[R].style.height=(B?z[R]?Math.round(x/k.maxFps*Math.min(z[R],k.maxFps)):0:j[R]?Math.round(x/k.threshold*Math.min(j[R],k.threshold)):0)+"px"}function b(){20>k.interval?(O=p(b),f()):(O=setTimeout(b,k.interval),I=p(f))}function w(e){e=e||window.event,e.preventDefault?(e.preventDefault(),e.stopPropagation()):(e.returnValue=!1,e.cancelBubble=!0),F.toggle()}function T(){k.toggleOn&&u(q.container,k.toggleOn,w,1),e.removeChild(q.container)}function P(){if(q.container&&T(),E=s.theme[k.theme],S=E.compiledHeatmaps||[],!S.length&&E.heatmaps.length){for(R=0;R<E.heatmaps.length;R++)for(S[R]=[],M=0;M<=D;M++){var t,i=S[R],r=M;t=.33/D*M;var o=E.heatmaps[R].saturation,l=E.heatmaps[R].lightness,c=void 0,h=void 0,p=void 0,d=p=void 0,f=c=h=void 0,f=void 0,p=.5>=l?l*(1+o):l+o-l*o;0===p?t="#000":(d=2*l-p,h=(p-d)/p,t*=6,c=Math.floor(t),f=t-c,f*=p*h,0===c||6===c?(c=p,h=d+f,p=d):1===c?(c=p-f,h=p,p=d):2===c?(c=d,h=p,p=d+f):3===c?(c=d,h=p-f):4===c?(c=d+f,h=d):(c=p,h=d,p-=f),t="#"+a(c)+a(h)+a(p)),i[r]=t}E.compiledHeatmaps=S}q.container=n(document.createElement("div"),E.container),q.count=q.container.appendChild(n(document.createElement("div"),E.count)),q.legend=q.container.appendChild(n(document.createElement("div"),E.legend)),q.graph=k.graph?q.container.appendChild(n(document.createElement("div"),E.graph)):0,N.length=0;for(var v in q)q[v]&&E[v].heatOn&&N.push({name:v,el:q[v]});if(_.length=0,q.graph)for(q.graph.style.width=k.history*E.column.width+(k.history-1)*E.column.spacing+"px",M=0;M<k.history;M++)_[M]=q.graph.appendChild(n(document.createElement("div"),E.column)),_[M].style.position="absolute",_[M].style.bottom=0,_[M].style.right=M*E.column.width+M*E.column.spacing+"px",_[M].style.width=E.column.width+"px",_[M].style.height="0px";n(q.container,k),m(),e.appendChild(q.container),q.graph&&(x=q.graph.clientHeight),k.toggleOn&&("click"===k.toggleOn&&(q.container.style.cursor="pointer"),u(q.container,k.toggleOn,w))}"object"===i(e)&&e.nodeType===t&&(c=e,e=document.body),e||(e=document.body);var E,S,A,O,I,x,C,M,R,F=this,k=o({},s.defaults,c||{}),q={},_=[],D=100,N=[],L=0,Y=k.threshold,X=0,W=l()-Y,z=[],j=[],B="fps"===k.show;F.options=k,F.fps=0,F.duration=0,F.isPaused=0,F.tickStart=function(){X=l()},F.tick=function(){A=l(),L=A-W,Y+=(L-Y)/k.smoothing,F.fps=1e3/Y,F.duration=X<W?Y:A-X,W=A},F.pause=function(){return O&&(F.isPaused=1,clearTimeout(O),h(O),h(I),O=I=0),F},F.resume=function(){return O||(F.isPaused=0,b()),F},F.set=function(e,t){return k[e]=t,B="fps"===k.show,-1!==r(e,g)&&P(),-1!==r(e,y)&&n(q.container,k),F},F.showDuration=function(){return F.set("show","ms"),F},F.showFps=function(){return F.set("show","fps"),F},F.toggle=function(){return F.set("show",B?"ms":"fps"),F},F.hide=function(){return F.pause(),q.container.style.display="none",F},F.show=function(){return F.resume(),q.container.style.display="block",F},F.destroy=function(){F.pause(),T(),F.tick=F.tickStart=function(){}},P(),b()}var l,c=e.performance;l=c&&(c.now||c.webkitNow)?c[c.now?"now":"webkitNow"].bind(c):function(){return+new Date};for(var h=e.cancelAnimationFrame||e.cancelRequestAnimationFrame,p=e.requestAnimationFrame,c=["moz","webkit","o"],d=0,m=0,f=c.length;m<f&&!h;++m)p=(h=e[c[m]+"CancelAnimationFrame"]||e[c[m]+"CancelRequestAnimationFrame"])&&e[c[m]+"RequestAnimationFrame"];h||(p=function(t){var n=l(),i=Math.max(0,16-(n-d));return d=n+i,e.setTimeout(function(){t(n+i)},i)},h=function(e){clearTimeout(e)});var v="string"===i(document.createElement("div").textContent)?"textContent":"innerText";s.extend=o,window.FPSMeter=s,s.defaults={interval:100,smoothing:10,show:"fps",toggleOn:"click",decimals:1,maxFps:60,threshold:100,position:"absolute",zIndex:10,left:"5px",top:"5px",right:"auto",bottom:"auto",margin:"0 0 0 0",theme:"dark",heat:0,graph:0,history:20};var g=["toggleOn","theme","heat","graph","history"],y="position zIndex left top right bottom margin".split(" ")}(window),function(e,t){t.theme={};var n=t.theme.base={heatmaps:[],container:{heatOn:null,heatmap:null,padding:"5px",minWidth:"95px",height:"30px",lineHeight:"30px",textAlign:"right",textShadow:"none"},count:{heatOn:null,heatmap:null,position:"absolute",top:0,right:0,padding:"5px 10px",height:"30px",fontSize:"24px",fontFamily:"Consolas, Andale Mono, monospace",zIndex:2},legend:{heatOn:null,heatmap:null,position:"absolute",top:0,left:0,padding:"5px 10px",height:"30px",fontSize:"12px",lineHeight:"32px",fontFamily:"sans-serif",textAlign:"left",zIndex:2},graph:{heatOn:null,heatmap:null,position:"relative",boxSizing:"padding-box",MozBoxSizing:"padding-box",height:"100%",zIndex:1},column:{width:4,spacing:1,heatOn:null,heatmap:null}};t.theme.dark=t.extend({},n,{heatmaps:[{saturation:.8,lightness:.8}],container:{background:"#222",color:"#fff",border:"1px solid #1a1a1a",textShadow:"1px 1px 0 #222"},count:{heatOn:"color"},column:{background:"#3f3f3f"}}),t.theme.light=t.extend({},n,{heatmaps:[{saturation:.5,lightness:.5}],container:{color:"#666",background:"#fff",textShadow:"1px 1px 0 rgba(255,255,255,.5), -1px -1px 0 rgba(255,255,255,.5)",boxShadow:"0 0 0 1px rgba(0,0,0,.1)"},count:{heatOn:"color"},column:{background:"#eaeaea"}}),t.theme.colorful=t.extend({},n,{heatmaps:[{saturation:.5,lightness:.6}],container:{heatOn:"backgroundColor",background:"#888",color:"#fff",textShadow:"1px 1px 0 rgba(0,0,0,.2)",boxShadow:"0 0 0 1px rgba(0,0,0,.1)"},column:{background:"#777",backgroundColor:"rgba(0,0,0,.2)"}}),t.theme.transparent=t.extend({},n,{heatmaps:[{saturation:.8,lightness:.5}],container:{padding:0,color:"#fff",textShadow:"1px 1px 0 rgba(0,0,0,.5)"},count:{padding:"0 5px",height:"40px",lineHeight:"40px"},legend:{padding:"0 5px",height:"40px",lineHeight:"42px"},graph:{height:"40px"},column:{width:5,background:"#999",heatOn:"backgroundColor",opacity:.5}})}(window,FPSMeter);var createScript=function(e){return function(t){var n=new t;if(n&&n.constructor&&n.constructor.name){var i=n.constructor.name,r=pc.createScript(i,e),o=[];if(n.attributes)for(var a in n.attributes)o.push(a),r.attributes.add(a,n.attributes[a]);for(var u in n)"attributes"===u||"name"===u||o.includes(u)||(r.prototype[u]=n[u]);for(var u in t)r[u]=t[u]}else console.warn("Failed instantiate a PlayCanvas script class constructor.")}},CanvasScript=function(){function e(){this._properties=null}return e.prototype.setProperty=function(e,t){null!=this._properties&&(this._properties[e]=t)},e.prototype.getProperty=function(e,t){void 0===t&&(t=null);var n=null;return null!=this._properties&&(n=this._properties[e]),null==n&&(n=t),null!=n?n:null},e.prototype.getMetadata=function(){return this.entity.metadata},e}(),SceneManager=function(){function e(){}return e.GetVersion=function(){return"1.0.0"},e.IsWindows=function(){return"undefined"!=typeof Windows&&"undefined"!=typeof Windows.UI&&"undefined"!=typeof Windows.System&&"undefined"!=typeof Windows.Foundation},e.IsCordova=function(){return null!=window.cordova},e.IsOculusBrowser=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/OculusBrowser/i)&&(e=!0),e},e.IsSamsungBrowser=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/SamsungBrowser/i)&&(e=!0),e},e.IsWindowsPhone=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/Windows Phone/i)&&(e=!0),e},e.IsBlackBerry=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/BlackBerry/i)&&(e=!0),e},e.IsOperaMini=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/Opera Mini/i)&&(e=!0),e},e.IsAndroid=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/Android/i)&&(e=!0),e},e.IsWebOS=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/webOS/i)&&(e=!0),e},e.IsIOS=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/iPhone|iPad|iPod/i)&&(e=!0),e},e.IsIPHONE=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/iPhone/i)&&(e=!0),e},e.IsIPAD=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/iPad/i)&&(e=!0),e},e.IsIPOD=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/iPod/i)&&(e=!0),e},e.IsIE11=function(){return void 0!==navigator.msMaxTouchPoints},e.IsMobile=function(){var e=!1;if(null!=navigator&&null!=navigator.userAgent){var t=navigator.userAgent;(t.match(/Android/i)||t.match(/webOS/i)||t.match(/iPhone|iPad|iPod/i)||t.match(/BlackBerry/i)||t.match(/Opera Mini/i)||t.match(/Windows Phone/i))&&(e=!0)}return e},e.IsPlaystation=function(){var e=!1;return null!=navigator&&null!=navigator.userAgent&&navigator.userAgent.match(/Playstation/i)&&(e=!0),e},e.IsXboxOne=function(){var t=!1;if(e.IsWindows()&&"undefined"!=typeof Windows.System.Profile&&"undefined"!=typeof Windows.System.Profile.AnalyticsInfo&&"undefined"!=typeof Windows.System.Profile.AnalyticsInfo.versionInfo&&"undefined"!=typeof Windows.System.Profile.AnalyticsInfo.versionInfo.deviceFamily){var n=Windows.System.Profile.AnalyticsInfo.versionInfo.deviceFamily;n.match(/Xbox/i)&&(t=!0)}return t},e.IsXboxLive=function(){return e.IsWindows()&&"undefined"!=typeof Microsoft&&"undefined"!=typeof Microsoft.Xbox&&"undefined"!=typeof Microsoft.Xbox.Services},e.CreateGenericPromise=function(e){return window.createGenericPromise?window.createGenericPromise(e):null},e.ResolveGenericPromise=function(e){return window.resolveGenericPromise?window.resolveGenericPromise(e):null},e.GetQueryStringParam=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)"),i=n.exec(t);return i?i[2]?decodeURIComponent(i[2].replace(/\+/g," ")):"":null},e.AlertMessage=function(t,n){void 0===n&&(n="PlayCanvas");var i=null;return e.IsWindows()?i=new Windows.UI.Popups.MessageDialog(t,n).showAsync():window.alert(t),i},e.LoadAssets=function(e,t,n){var i=0,r=0,o=(t.length,function(){return r++,console.log("*** GOT PROGRESS: "+r.toString()+" of "+t.length.toString()),r>=t.length&&(console.log("*** LOAD COMPLETE ***"),null!=n&&n()),null});for(i=0;i<t.length;i++){var a=t[i];a.once("load",o,null),e.assets.add(a),e.assets.load(a)}},e.OnExecuteReady=function(e){null!=e&&(window.ontoolkitready=e)},e.prototype.delay=function(e,t){
var n=this,i=null;return i=TimerPlugin.requestTimeout(function(){null!=i&&n.cancelDelay(i),null!=e&&e()},t)},e.prototype.cancelDelay=function(e){TimerPlugin.clearRequestTimeout(e)},e.prototype.repeat=function(e,t){return TimerPlugin.requestInterval(e,t)},e.prototype.cancelRepeat=function(e){TimerPlugin.clearRequestInterval(e)},e}(),TimerPlugin=window;TimerPlugin.requestAnimFrame=function(){return TimerPlugin.requestAnimationFrame||TimerPlugin.webkitRequestAnimationFrame||TimerPlugin.mozRequestAnimationFrame||TimerPlugin.oRequestAnimationFrame||TimerPlugin.msRequestAnimationFrame||function(e,t){TimerPlugin.setTimeout(e,1e3/60)}}(),TimerPlugin.requestInterval=function(e,t){function n(){var o=TimerPlugin.getTimeMilliseconds(),a=o-i;a>=t&&(e.call(),i=TimerPlugin.getTimeMilliseconds()),r.value=TimerPlugin.requestAnimFrame(n)}if(!(TimerPlugin.requestAnimationFrame||TimerPlugin.webkitRequestAnimationFrame||TimerPlugin.mozRequestAnimationFrame&&TimerPlugin.mozCancelRequestAnimationFrame||TimerPlugin.oRequestAnimationFrame||TimerPlugin.msRequestAnimationFrame))return TimerPlugin.setInterval(e,t);var i=TimerPlugin.getTimeMilliseconds(),r=new Object;return r.value=TimerPlugin.requestAnimFrame(n),r},TimerPlugin.clearRequestInterval=function(e){TimerPlugin.cancelAnimationFrame?TimerPlugin.cancelAnimationFrame(e.value):TimerPlugin.webkitCancelAnimationFrame?TimerPlugin.webkitCancelAnimationFrame(e.value):TimerPlugin.webkitCancelRequestAnimationFrame?TimerPlugin.webkitCancelRequestAnimationFrame(e.value):TimerPlugin.mozCancelRequestAnimationFrame?TimerPlugin.mozCancelRequestAnimationFrame(e.value):TimerPlugin.oCancelRequestAnimationFrame?TimerPlugin.oCancelRequestAnimationFrame(e.value):TimerPlugin.msCancelRequestAnimationFrame?TimerPlugin.msCancelRequestAnimationFrame(e.value):clearInterval(e),e=null},TimerPlugin.requestTimeout=function(e,t){function n(){var o=TimerPlugin.getTimeMilliseconds(),a=o-i;a>=t?e.call():r.value=TimerPlugin.requestAnimFrame(n)}if(!(TimerPlugin.requestAnimationFrame||TimerPlugin.webkitRequestAnimationFrame||TimerPlugin.mozRequestAnimationFrame&&TimerPlugin.mozCancelRequestAnimationFrame||TimerPlugin.oRequestAnimationFrame||TimerPlugin.msRequestAnimationFrame))return TimerPlugin.setTimeout(e,t);var i=TimerPlugin.getTimeMilliseconds(),r=new Object;return r.value=TimerPlugin.requestAnimFrame(n),r},TimerPlugin.clearRequestTimeout=function(e){TimerPlugin.cancelAnimationFrame?TimerPlugin.cancelAnimationFrame(e.value):TimerPlugin.webkitCancelAnimationFrame?TimerPlugin.webkitCancelAnimationFrame(e.value):TimerPlugin.webkitCancelRequestAnimationFrame?TimerPlugin.webkitCancelRequestAnimationFrame(e.value):TimerPlugin.mozCancelRequestAnimationFrame?TimerPlugin.mozCancelRequestAnimationFrame(e.value):TimerPlugin.oCancelRequestAnimationFrame?TimerPlugin.oCancelRequestAnimationFrame(e.value):TimerPlugin.msCancelRequestAnimationFrame?TimerPlugin.msCancelRequestAnimationFrame(e.value):clearTimeout(e),e=null},TimerPlugin.getTimeMilliseconds=function(){return(performance||Date).now()},SceneManager.IsWindows()&&"undefined"!=typeof Windows.UI.ViewManagement&&"undefined"!=typeof Windows.UI.ViewManagement.ApplicationViewBoundsMode&&"undefined"!=typeof Windows.UI.ViewManagement.ApplicationViewBoundsMode.useCoreWindow&&Windows.UI.ViewManagement.ApplicationView.getForCurrentView().setDesiredBoundsMode(Windows.UI.ViewManagement.ApplicationViewBoundsMode.useCoreWindow),SceneManager.IsXboxOne()&&navigator.gamepadInputEmulation&&(navigator.gamepadInputEmulation="gamepad");var Constants;!function(e){e[e.Deg2Rad=.0174532924]="Deg2Rad",e[e.Rad2Deg=57.29578]="Rad2Deg",e[e.MinimumTimeout=.5]="MinimumTimeout"}(Constants||(Constants={})),pc.Application.prototype.manager=new SceneManager,pc.Application.prototype.inline=function(e,t){if(null!=e){var n=document.head||document.getElementsByTagName("head")[0],i=document.createTextNode(e),r=document.createElement("script");null!=t&&(r.id=t),r.setAttribute("type","text/javascript"),r.appendChild(i),n.appendChild(r)}else console.warn("Null required script libraries specfied for the pc.Application.inline prototype.")},pc.Application.prototype.require=function(e,t){var n=function(e,t,i){var r=document.head||document.getElementsByTagName("head")[0];if(e[t]){var o=e[t],a=document.createElement("script");a.id=o.indexOf("/")>=0?o.substring(o.lastIndexOf("/")+1):o,a.setAttribute("type","text/javascript"),a.setAttribute("src",o),a.onerror=function(r){console.warn("Failed to load PlayCanvas script tag for "+o+". "+r.message),t+=1,n(e,t,i)},a.onload=function(){t+=1,n(e,t,i)},r.appendChild(a)}else null!=i&&i()};null!=e?e instanceof Array?n(e,0,t):n([e],0,t):console.warn("Null required script libraries specfied for the pc.Application.require prototype.")};