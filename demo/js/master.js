/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t,e,s,i){var o,r=arguments.length,a=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,s,i);else for(var h=t.length-1;h>=0;h--)(o=t[h])&&(a=(r<3?o(a):r>3?o(e,s,a):o(e,s))||a);return r>3&&a&&Object.defineProperty(e,s,a),a
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const e=window,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;class r{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}}const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new r(s,t,i)},h=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var n;const l=window,p=l.trustedTypes,u=p?p.emptyScript:"",c=l.reactiveElementPolyfillSupport,d={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>e!==t&&(e==e||t==t),y={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:v};class $ extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,s)=>{const i=this._$Ep(s,e);void 0!==i&&(this._$Ev.set(i,s),t.push(i))})),t}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const o=this[t];this[e]=i,this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||y}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of e)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Ep(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,s;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{s?t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((s=>{const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EO(t,e,s=y){var i;const o=this.constructor._$Ep(t,s);if(void 0!==o&&!0===s.reflect){const r=(void 0!==(null===(i=s.converter)||void 0===i?void 0:i.toAttribute)?s.converter:d).toAttribute(e,s.type);this._$El=t,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$El=null}}_$AK(t,e){var s;const i=this.constructor,o=i._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=i.getPropertyOptions(o),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:d;this._$El=o,this[o]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,s){let i=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(s)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var m;$.finalized=!0,$.elementProperties=new Map,$.elementStyles=[],$.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:$}),(null!==(n=l.reactiveElementVersions)&&void 0!==n?n:l.reactiveElementVersions=[]).push("1.6.1");const f=window,g=f.trustedTypes,_=g?g.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",x=`lit$${(Math.random()+"").slice(9)}$`,b="?"+x,A=`<${b}>`,w=document,E=()=>w.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,C=Array.isArray,k="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,z=/>/g,N=RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,U=/"/g,T=/^(?:script|style|textarea|title)$/i,O=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),H=O(1),L=O(2),G=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),V=new WeakMap,D=w.createTreeWalker(w,129,null,!1),I=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":"",a=F;for(let e=0;e<s;e++){const s=t[e];let h,n,l=-1,p=0;for(;p<s.length&&(a.lastIndex=p,n=a.exec(s),null!==n);)p=a.lastIndex,a===F?"!--"===n[1]?a=M:void 0!==n[1]?a=z:void 0!==n[2]?(T.test(n[2])&&(o=RegExp("</"+n[2],"g")),a=N):void 0!==n[3]&&(a=N):a===N?">"===n[0]?(a=null!=o?o:F,l=-1):void 0===n[1]?l=-2:(l=a.lastIndex-n[2].length,h=n[1],a=void 0===n[3]?N:'"'===n[3]?U:R):a===U||a===R?a=N:a===M||a===z?a=F:(a=N,o=void 0);const u=a===N&&t[e+1].startsWith("/>")?" ":"";r+=a===F?s+A:l>=0?(i.push(h),s.slice(0,l)+S+s.slice(l)+x+u):s+x+(-2===l?(i.push(void 0),e):u)}const h=r+(t[s]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==_?_.createHTML(h):h,i]};class B{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const a=t.length-1,h=this.parts,[n,l]=I(t,e);if(this.el=B.createElement(n,s),D.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(i=D.nextNode())&&h.length<a;){if(1===i.nodeType){if(i.hasAttributes()){const t=[];for(const e of i.getAttributeNames())if(e.endsWith(S)||e.startsWith(x)){const s=l[r++];if(t.push(e),void 0!==s){const t=i.getAttribute(s.toLowerCase()+S).split(x),e=/([.?@])?(.*)/.exec(s);h.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?J:"?"===e[1]?Y:"@"===e[1]?Q:K})}else h.push({type:6,index:o})}for(const e of t)i.removeAttribute(e)}if(T.test(i.tagName)){const t=i.textContent.split(x),e=t.length-1;if(e>0){i.textContent=g?g.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],E()),D.nextNode(),h.push({type:2,index:++o});i.append(t[e],E())}}}else if(8===i.nodeType)if(i.data===b)h.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(x,t+1));)h.push({type:7,index:o}),t+=x.length-1}o++}}static createElement(t,e){const s=w.createElement("template");return s.innerHTML=t,s}}function W(t,e,s=t,i){var o,r,a,h;if(e===G)return e;let n=void 0!==i?null===(o=s._$Co)||void 0===o?void 0:o[i]:s._$Cl;const l=P(e)?void 0:e._$litDirective$;return(null==n?void 0:n.constructor)!==l&&(null===(r=null==n?void 0:n._$AO)||void 0===r||r.call(n,!1),void 0===l?n=void 0:(n=new l(t),n._$AT(t,s,i)),void 0!==i?(null!==(a=(h=s)._$Co)&&void 0!==a?a:h._$Co=[])[i]=n:s._$Cl=n),void 0!==n&&(e=W(t,n._$AS(t,e.values),n,i)),e}class q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:s},parts:i}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:w).importNode(s,!0);D.currentNode=o;let r=D.nextNode(),a=0,h=0,n=i[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new Z(r,r.nextSibling,this,t):1===n.type?e=new n.ctor(r,n.name,n.strings,this,t):6===n.type&&(e=new tt(r,this,t)),this._$AV.push(e),n=i[++h]}a!==(null==n?void 0:n.index)&&(r=D.nextNode(),a++)}return o}v(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Z{constructor(t,e,s,i){var o;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cp=null===(o=null==i?void 0:i.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=W(this,t,e),P(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>C(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==j&&P(this._$AH)?this._$AA.nextSibling.data=t:this.$(w.createTextNode(t)),this._$AH=t}g(t){var e;const{values:s,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=B.createElement(i.h,this.options)),i);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(s);else{const t=new q(o,this),e=t.u(this.options);t.v(s),this.$(e),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new B(t)),e}T(t){C(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Z(this.k(E()),this.k(E()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class K{constructor(t,e,s,i,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=W(this,t,e,0),r=!P(t)||t!==this._$AH&&t!==G,r&&(this._$AH=t);else{const i=t;let a,h;for(t=o[0],a=0;a<o.length-1;a++)h=W(this,i[s+a],e,a),h===G&&(h=this._$AH[a]),r||(r=!P(h)||h!==this._$AH[a]),h===j?t=j:t!==j&&(t+=(null!=h?h:"")+o[a+1]),this._$AH[a]=h}r&&!i&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class J extends K{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}const X=g?g.emptyScript:"";class Y extends K{constructor(){super(...arguments),this.type=4}j(t){t&&t!==j?this.element.setAttribute(this.name,X):this.element.removeAttribute(this.name)}}class Q extends K{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){var s;if((t=null!==(s=W(this,t,e,0))&&void 0!==s?s:j)===G)return;const i=this._$AH,o=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==j&&(i===j||o);o&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){W(this,t)}}const et=f.litHtmlPolyfillSupport;null==et||et(B,Z),(null!==(m=f.litHtmlVersions)&&void 0!==m?m:f.litHtmlVersions=[]).push("2.7.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var st,it;class ot extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const s=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=s.firstChild),s}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{var i,o;const r=null!==(i=null==s?void 0:s.renderBefore)&&void 0!==i?i:e;let a=r._$litPart$;if(void 0===a){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;r._$litPart$=a=new Z(e.insertBefore(E(),t),t,void 0,null!=s?s:{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return G}}ot.finalized=!0,ot._$litElement$=!0,null===(st=globalThis.litElementHydrateSupport)||void 0===st||st.call(globalThis,{LitElement:ot});const rt=globalThis.litElementPolyfillSupport;null==rt||rt({LitElement:ot}),(null!==(it=globalThis.litElementVersions)&&void 0!==it?it:globalThis.litElementVersions=[]).push("3.3.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:s,elements:i}=e;return{kind:s,elements:i,finisher(e){customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ht=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(s){s.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(s){s.createProperty(e.key,t)}};function nt(t){return(e,s)=>void 0!==s?((t,e,s)=>{e.constructor.createProperty(s,t)})(t,e,s):ht(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function lt(t){return nt({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var pt;null===(pt=window.HTMLSlotElement)||void 0===pt||pt.prototype.assignedElements;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut=1;class ct{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt="important",vt=" !"+dt,yt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ct{constructor(t){var e;if(super(t),t.type!==ut||"style"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,s)=>{const i=t[s];return null==i?e:e+`${s=s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`}),"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.ut){this.ut=new Set;for(const t in e)this.ut.add(t);return this.render(e)}this.ut.forEach((t=>{null==e[t]&&(this.ut.delete(t),t.includes("-")?s.removeProperty(t):s[t]="")}));for(const t in e){const i=e[t];if(null!=i){this.ut.add(t);const e="string"==typeof i&&i.endsWith(vt);t.includes("-")||e?s.setProperty(t,e?i.slice(0,-11):i,e?dt:""):s[t]=i}}return G}});class $t extends ot{constructor(){super(...arguments),this.values=[],this.labels=[],this.min=null,this.max=null,this.tooltipDisabled=!1,this.tooltipText="@L @V",this.valueShapeFocused=null,this.width=0,this.height=0,this.valueShapes=[]}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((t=>{t.forEach((t=>{this.width=t.contentRect.width,this.height=t.contentRect.height}))})),this.resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this)}firstUpdated(){const t=this.renderRoot.querySelector(".wrapper");this.tooltipDisabled||(t.addEventListener("mousemove",(t=>{this.valueShapeFocused=this.findValueShapeAtPosition(t.offsetX,t.offsetY)})),t.addEventListener("mouseleave",(()=>{this.valueShapeFocused=null})))}render(){var t,e;return H`<div class="wrapper">${null!==(t=this.templateChart())&&void 0!==t?t:j} ${null!==(e=this.templateTooltip())&&void 0!==e?e:j}</div>`}tooltipTextFormatted(t){return this.tooltipText.replace(/@V/g,t.value.toLocaleString()).replace(/@L/g,t.label?t.label:"").trim()}validatePropertyAsPositiveNumber(t){const e=this[t];if(!Number.isFinite(e)||e<0)throw new Error(`The property ${t} must be a positive number`)}onlyNegativeValues(){return 0===Math.max(...this.values)}}$t.styles=a`:host{--shape-color:#597BFC;--shape-opacity:1;--area-color:var(--shape-color);--area-opacity:0;--tooltip-font-color:white;--tooltip-font-size:0.875em;--tooltip-font-weight:bold;--tooltip-radius:3px;--tooltip-padding:3px 4px;--tooltip-background:black;--tooltip-shadow:none;display:inline-block}.wrapper{display:block;width:100%;height:100%;position:relative;z-index:1;box-sizing:border-box;border-radius:inherit}.wrapper *{box-sizing:border-box}.chart{display:block;position:relative;z-index:1;overflow:hidden;border-radius:inherit}.chart .area{fill:var(--area-color);opacity:var(--area-opacity);stroke:none}.tooltip{position:absolute;z-index:10;font-size:var(--tooltip-font-size);font-weight:var(--tooltip-font-weight);line-height:1;text-align:center;white-space:nowrap;color:var(--tooltip-font-color);padding:var(--tooltip-padding);pointer-events:none;border-radius:var(--tooltip-radius);background-color:var(--tooltip-background);box-shadow:var(--tooltip-shadow)}`,t([nt({type:Array,reflect:!0})],$t.prototype,"values",void 0),t([nt({type:Array,reflect:!0})],$t.prototype,"labels",void 0),t([nt({type:Number,reflect:!0})],$t.prototype,"min",void 0),t([nt({type:Number,reflect:!0})],$t.prototype,"max",void 0),t([nt({type:Boolean,reflect:!0,attribute:"tooltip-disabled"})],$t.prototype,"tooltipDisabled",void 0),t([nt({type:String,attribute:"tooltip-text"})],$t.prototype,"tooltipText",void 0),t([lt()],$t.prototype,"valueShapeFocused",void 0),t([lt()],$t.prototype,"width",void 0),t([lt()],$t.prototype,"height",void 0);let mt=class extends $t{constructor(){super(...arguments),this.shapeGap=1,this.shapeRadius=1}computeChartProperties(){this.valueShapes=[];let t=Math.min(...this.values);null!==this.min&&(t=Math.min(t,this.min));let e=Math.max(...this.values);null!==this.max&&(e=Math.max(e,this.max));const s=e-t,i=(this.height-this.shapeGap*(this.values.length-1))/this.values.length,o=e=>s?(e-t)/s*this.width:1;this.values.forEach(((r,a)=>{var h;let n=(i+this.shapeGap)*a,l=o(r<0?r:Math.max(t,0)),p=o(r<0?Math.min(e,0):r)-l;0==p&&(p=1,e<0&&s&&l--),this.valueShapes.push({index:a,value:r,label:null!==(h=this.labels[a])&&void 0!==h?h:null,origin:{x:l,y:n},width:p,height:i})}))}willUpdate(t){if(!this.width||!this.height)return;t.has("shapeGap")&&this.validatePropertyAsPositiveNumber("shapeGap"),t.has("shapeRadius")&&this.validatePropertyAsPositiveNumber("shapeRadius");const e=["width","height","values","labels","min","max","shapeGap","shapeRadius"];[...t.keys()].some((t=>e.includes(t)))&&this.computeChartProperties()}findValueShapeAtPosition(t,e){var s;return null!==(s=this.valueShapes.find((t=>{const s=t.origin.y-this.shapeGap/2,i=t.origin.y+t.height+this.shapeGap/2;return e>=s&&e<=i})))&&void 0!==s?s:null}templateChart(){if(this.valueShapes.length<1)return null;const t=Math.min(this.shapeRadius,this.valueShapes[0].height/2);return H`<svg class="chart" width="100%" height="100%">${this.valueShapes.map(((e,s)=>{var i;return L`<rect class="area" x="0" y="${e.origin.y}" width="100%" height="${e.height}" rx="${t}" ry="${t}"/><rect class="shape ${(null===(i=this.valueShapeFocused)||void 0===i?void 0:i.index)===s?"is-focused":""}" x="${e.origin.x}" y="${e.origin.y}" width="${e.width}" height="${e.height}" rx="${t}" ry="${t}"/>`}))}</svg>`}templateTooltip(){if(null===this.valueShapeFocused)return null;const t={left:(this.valueShapeFocused.value<0?this.valueShapeFocused.origin.x:this.valueShapeFocused.origin.x+this.valueShapeFocused.width)+"px",top:this.valueShapeFocused.origin.y-2+"px",transform:"translate(-50%, -100%)"};return H`<div class="tooltip" style="${yt(t)}">${this.tooltipTextFormatted(this.valueShapeFocused)}</div>`}};mt.styles=[$t.styles,a`:host{--shape-focused-opacity:0.5;width:120px;height:60px}.chart>.shape{fill:var(--shape-color);opacity:var(--shape-opacity);stroke:none}.chart>.shape.is-focused{opacity:var(--shape-focused-opacity)}`],t([nt({type:Number,reflect:!0,attribute:"shape-gap"})],mt.prototype,"shapeGap",void 0),t([nt({type:Number,reflect:!0,attribute:"shape-radius"})],mt.prototype,"shapeRadius",void 0),mt=t([at("tc-bar")],mt);let ft=class extends $t{constructor(){super(...arguments),this.shapeGap=1,this.shapeRadius=1}computeChartProperties(){this.valueShapes=[];let t=Math.min(...this.values);null!==this.min&&(t=Math.min(t,this.min));let e=Math.max(...this.values);null!==this.max&&(e=Math.max(e,this.max));const s=e-t,i=(this.width-this.shapeGap*(this.values.length-1))/this.values.length,o=e=>this.height-(s?(e-t)/s*this.height:1);this.values.forEach(((r,a)=>{var h;let n=(i+this.shapeGap)*a,l=o(r<0?Math.min(e,0):r),p=o(r<0?r:Math.max(t,0))-l;0==p&&(p=1,e>0&&s&&l--),this.valueShapes.push({index:a,value:r,label:null!==(h=this.labels[a])&&void 0!==h?h:null,origin:{x:n,y:l},width:i,height:p})}))}willUpdate(t){if(!this.width||!this.height)return;t.has("shapeGap")&&this.validatePropertyAsPositiveNumber("shapeGap"),t.has("shapeRadius")&&this.validatePropertyAsPositiveNumber("shapeRadius");const e=["width","height","values","labels","min","max","shapeGap","shapeRadius"];[...t.keys()].some((t=>e.includes(t)))&&this.computeChartProperties()}findValueShapeAtPosition(t,e){var s;return null!==(s=this.valueShapes.find((e=>{const s=e.origin.x-this.shapeGap/2,i=e.origin.x+e.width+this.shapeGap/2;return t>=s&&t<=i})))&&void 0!==s?s:null}templateChart(){if(this.valueShapes.length<1)return null;const t=Math.min(this.shapeRadius,this.valueShapes[0].width/2);return H`<svg class="chart" width="100%" height="100%">${this.valueShapes.map(((e,s)=>{var i;return L`<rect class="area" x="${e.origin.x}" y="0" width="${e.width}" height="100%" rx="${t}" ry="${t}"/><rect class="shape ${(null===(i=this.valueShapeFocused)||void 0===i?void 0:i.index)===s?"is-focused":""}" x="${e.origin.x}" y="${e.origin.y}" width="${e.width}" height="${e.height}" rx="${t}" ry="${t}"/>`}))}</svg>`}templateTooltip(){if(null===this.valueShapeFocused)return null;let t={left:this.valueShapeFocused.origin.x+this.valueShapeFocused.width/2+"px",top:this.valueShapeFocused.origin.y-2+"px",transform:"translate(-50%, -100%)"};return(this.valueShapeFocused.value<0||this.onlyNegativeValues())&&(t.top=this.valueShapeFocused.origin.y+this.valueShapeFocused.height+2+"px",t.transform="translate(-50%, 0%)"),H`<div class="tooltip" style="${yt(t)}">${this.tooltipTextFormatted(this.valueShapeFocused)}</div>`}};ft.styles=[$t.styles,a`:host{--shape-focused-opacity:0.5;width:120px;height:40px}.chart>.shape{fill:var(--shape-color);opacity:var(--shape-opacity);stroke:none}.chart>.shape.is-focused{opacity:var(--shape-focused-opacity)}`],t([nt({type:Number,reflect:!0,attribute:"shape-gap"})],ft.prototype,"shapeGap",void 0),t([nt({type:Number,reflect:!0,attribute:"shape-radius"})],ft.prototype,"shapeRadius",void 0),ft=t([at("tc-column")],ft);let gt=class extends $t{constructor(){super(...arguments),this.shapeSize=2}computeChartProperties(){this.valueShapes=[];let t=Math.min(...this.values);null!==this.min&&(t=Math.min(t,this.min));let e=Math.max(...this.values);null!==this.max&&(e=Math.max(e,this.max));const s=e-t,i=t=>t*((this.width-this.shapeSize)/(this.values.length-1))+this.shapeSize/2,o=e=>{const i=this.height-this.shapeSize;let o=i;return s&&(o-=(e-t)/s*i),o+this.shapeSize/2};this.values.forEach(((t,e)=>{var s;this.valueShapes.push({index:e,value:t,label:null!==(s=this.labels[e])&&void 0!==s?s:null,center:{x:i(e),y:o(t)},radius:Math.floor((this.shapeSize+6)/2)})})),this.linePath=this.valueShapes.map(((t,e)=>(0===e?"M":"L")+t.center.x+","+t.center.y)).join(" "),this.areaPath=this.linePath.concat("L"+this.valueShapes[this.valueShapes.length-1].center.x+","+o(Math.max(t,0))+" ").concat("L"+this.valueShapes[0].center.x+","+o(Math.max(t,0))+" ").concat("Z")}willUpdate(t){if(!this.width||!this.height)return;t.has("shapeSize")&&this.validatePropertyAsPositiveNumber("shapeSize");const e=["width","height","values","labels","min","max","shapeSize"];[...t.keys()].some((t=>e.includes(t)))&&this.computeChartProperties()}findValueShapeAtPosition(t,e){return this.valueShapes.reduce(((e,s)=>Math.abs(s.center.x-t)<Math.abs(e.center.x-t)?s:e))}templateChart(){return this.valueShapes.length<2?null:H`<svg class="chart" width="100%" height="100%"><mask id="mask"><path d="${this.areaPath}" stroke-width="${this.shapeSize}" stroke="#FFFFFF" fill="#FFFFFF" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/></mask><rect class="area" x="0" y="0" width="100%" height="100%" mask="url(#mask)"/><path class="shape" d="${this.linePath}" stroke-width="${this.shapeSize}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/></svg>`}templateTooltip(){if(null===this.valueShapeFocused)return null;const t={left:this.valueShapeFocused.center.x+"px",top:this.valueShapeFocused.center.y+"px",width:2*this.valueShapeFocused.radius+"px",height:2*this.valueShapeFocused.radius+"px"};let e={left:this.valueShapeFocused.center.x+"px",top:this.valueShapeFocused.center.y-this.valueShapeFocused.radius-2+"px",transform:"translate(-50%, -100%)"};return(this.valueShapeFocused.value<0||this.onlyNegativeValues())&&(e.top=this.valueShapeFocused.center.y+this.valueShapeFocused.radius+2+"px",e.transform="translate(-50%, 0%)"),H`<div class="point" style="${yt(t)}"></div><div class="tooltip" style="${yt(e)}">${this.tooltipTextFormatted(this.valueShapeFocused)}</div>`}};gt.styles=[$t.styles,a`:host{--point-color:var(--shape-color);--point-opacity:1;--point-shadow:none;width:120px;height:40px}.point{position:absolute;z-index:2;pointer-events:none;border-radius:100%;background-color:var(--point-color);opacity:var(--point-opacity);box-shadow:var(--point-shadow);transform:translate(-50%,-50%)}.chart>.shape{fill:none;stroke:var(--shape-color);opacity:var(--shape-opacity)}`],t([nt({type:Number,attribute:"shape-size",reflect:!0})],gt.prototype,"shapeSize",void 0),gt=t([at("tc-line")],gt);let _t=class extends $t{constructor(){super(...arguments),this.shapeSize=null,this.shapeGap=1}computeChartProperties(){var t;this.valueShapes=[],this.gapLines=[],this.areaPath="";const e={x:this.width/2,y:this.height/2},s=Math.min(e.x,e.y),i=this.values.reduce(((t,e)=>t+e),0),o=null!==this.max?Math.max(i,this.max):i;let r=0;const a=(t,s)=>{const i=t/o*Math.PI*2-Math.PI/2;return{x:s*Math.cos(i)+e.x,y:s*Math.sin(i)+e.y}},h=t=>{const i=t/o*100,h=a(r,s),n=a(r+t,s);let l="";return l+="M"+h.x+","+h.y+" ",l+=100===i?"A"+[s,s,"0","1","1",n.x-.001,n.y].join(",")+" ":"A"+[s,s,"0",i>50?"1":"0","1",n.x,n.y].join(",")+" ",l+="L"+[e.x,e.y].join(",")+" ",l+="Z",l};this.cutoutCircle={center:e,radius:s-Math.min(null!==(t=this.shapeSize)&&void 0!==t?t:1/0,s)},this.values.forEach(((t,i)=>{var o;const n=a(r+t/2,s-(s-this.cutoutCircle.radius)/2);this.valueShapes.push({index:i,value:t,label:null!==(o=this.labels[i])&&void 0!==o?o:null,center:n,path:h(t)});const l=a(r,s);this.gapLines.push({start:l,end:e}),r+=t}));const n=o-i;if(n){this.areaPath=h(n);const t=a(r,s);this.gapLines.push({start:t,end:e})}1!==this.values.length||n||(this.gapLines=[])}willUpdate(t){if(!this.width||!this.height)return;t.has("shapeGap")&&this.validatePropertyAsPositiveNumber("shapeGap"),t.has("shapeSize")&&null!==this.shapeSize&&this.validatePropertyAsPositiveNumber("shapeSize");const e=["width","height","values","labels","max","shapeGap","shapeSize"];[...t.keys()].some((t=>e.includes(t)))&&this.computeChartProperties()}findValueShapeAtPosition(t,e){const s=this.renderRoot.querySelector(".chart"),i=s.createSVGPoint();i.x=t,i.y=e;const o=Array.from(s.querySelectorAll(".shape")).findIndex((t=>t.isPointInFill(i)));return-1===o?null:this.valueShapes[o]}templateChart(){return this.valueShapes.length<1?null:H`<svg class="chart" width="100%" height="100%"><mask id="mask"><rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" stroke="none"/><circle cx="${this.cutoutCircle.center.x}" cy="${this.cutoutCircle.center.y}" r="${this.cutoutCircle.radius}" fill="#000000"/>${this.gapLines.map((t=>L`<line x1="${t.start.x}" y1="${t.start.y}" x2="${t.end.x}" y2="${t.end.y}" stroke-width="${this.shapeGap}" stroke="#000000" stroke-linecap="round"/>`))}</mask><g mask="url(#mask)"><path class="area" d="${this.areaPath}"/>${this.valueShapes.map(((t,e)=>{var s;return L`<path class="shape ${(null===(s=this.valueShapeFocused)||void 0===s?void 0:s.index)===e?"is-focused":""}" d="${t.path}" style="fill:var(--shape-color-${e+1},var(--shape-color))"/>`}))}</g></svg>`}templateTooltip(){if(null===this.valueShapeFocused)return null;const t={left:this.valueShapeFocused.center.x+"px",top:this.valueShapeFocused.center.y+"px",transform:"translate(-50%, -50%)"};return H`<div class="tooltip" style="${yt(t)}">${this.tooltipTextFormatted(this.valueShapeFocused)}</div>`}};_t.styles=[$t.styles,a`:host{--shape-focused-opacity:0.5;border-radius:100%;width:60px;height:60px}.chart .shape{fill:var(--shape-color);opacity:var(--shape-opacity);stroke:none}.chart .shape.is-focused{opacity:var(--shape-focused-opacity)}`],t([nt({type:Number,reflect:!0,attribute:"shape-size"})],_t.prototype,"shapeSize",void 0),t([nt({type:Number,reflect:!0,attribute:"shape-gap"})],_t.prototype,"shapeGap",void 0),_t=t([at("tc-pie")],_t);export{mt as TcBar,ft as TcColumn,gt as TcLine,_t as TcPie};