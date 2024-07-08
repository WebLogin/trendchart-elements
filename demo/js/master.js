function t(t,e,i,s){var h,a=arguments.length,o=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(h=t[r])&&(o=(a<3?h(o):a>3?h(e,i,o):h(e,i))||o);return a>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),h=new WeakMap;class a{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=h.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&h.set(e,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new a(i,t,s)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:p,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,v=globalThis,g=v.trustedTypes,y=g?g.emptyScript:"",$=v.reactiveElementPolyfillSupport,f=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},S=(t,e)=>!n(t,e),x={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:S};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;class _ extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:h}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return s?.call(this)},set(e){const a=s?.call(this);h.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...p(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of s){const s=document.createElement("style"),h=e.litNonce;void 0!==h&&s.setAttribute("nonce",h),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:m).toAttribute(e,i.type);this._$Em=t,null==h?this.removeAttribute(s):this.setAttribute(s,h),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=s,this[s]=h.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??S)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[f("elementProperties")]=new Map,_[f("finalized")]=new Map,$?.({ReactiveElement:_}),(v.reactiveElementVersions??=[]).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const b=globalThis,A=b.trustedTypes,w=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+k,C=`<${P}>`,z=document,U=()=>z.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,R="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,L=/>/g,V=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,D=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),I=D(1),W=D(2),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),Z=new WeakMap,J=z.createTreeWalker(z,129);function K(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let h,a=2===e?"<svg>":"",o=N;for(let e=0;e<i;e++){const i=t[e];let r,n,l=-1,c=0;for(;c<i.length&&(o.lastIndex=c,n=o.exec(i),null!==n);)c=o.lastIndex,o===N?"!--"===n[1]?o=O:void 0!==n[1]?o=L:void 0!==n[2]?(B.test(n[2])&&(h=RegExp("</"+n[2],"g")),o=V):void 0!==n[3]&&(o=V):o===V?">"===n[0]?(o=h??N,l=-1):void 0===n[1]?l=-2:(l=o.lastIndex-n[2].length,r=n[1],o=void 0===n[3]?V:'"'===n[3]?j:H):o===j||o===H?o=V:o===O||o===L?o=N:(o=V,h=void 0);const p=o===V&&t[e+1].startsWith("/>")?" ":"";a+=o===N?i+C:l>=0?(s.push(r),i.slice(0,l)+E+i.slice(l)+k+p):i+k+(-2===l?e:p)}return[K(t,a+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let h=0,a=0;const o=t.length-1,r=this.parts,[n,l]=X(t,e);if(this.el=Y.createElement(n,i),J.currentNode=this.el.content,2===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&r.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[a++],i=s.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);r.push({type:1,index:h,name:o[2],strings:i,ctor:"."===o[1]?it:"?"===o[1]?st:"@"===o[1]?ht:et}),s.removeAttribute(t)}else t.startsWith(k)&&(r.push({type:6,index:h}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),J.nextNode(),r.push({type:2,index:++h});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===P)r.push({type:2,index:h});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)r.push({type:7,index:h}),t+=k.length-1}h++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,s){if(e===q)return e;let h=void 0!==s?i._$Co?.[s]:i._$Cl;const a=M(e)?void 0:e._$litDirective$;return h?.constructor!==a&&(h?._$AO?.(!1),void 0===a?h=void 0:(h=new a(t),h._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=h:i._$Cl=h),void 0!==h&&(e=G(t,h._$AS(t,e.values),h,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??z).importNode(e,!0);J.currentNode=s;let h=J.nextNode(),a=0,o=0,r=i[0];for(;void 0!==r;){if(a===r.index){let e;2===r.type?e=new tt(h,h.nextSibling,this,t):1===r.type?e=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(e=new at(h,this,t)),this._$AV.push(e),r=i[++o]}a!==r?.index&&(h=J.nextNode(),a++)}return J.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),M(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==F&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Y(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const h of t)s===e.length?e.push(i=new tt(this.S(U()),this.S(U()),this,this.options)):i=e[s],i._$AI(h),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,h){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=h,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const h=this.strings;let a=!1;if(void 0===h)t=G(this,t,e,0),a=!M(t)||t!==this._$AH&&t!==q,a&&(this._$AH=t);else{const s=t;let o,r;for(t=h[0],o=0;o<h.length-1;o++)r=G(this,s[i+o],e,o),r===q&&(r=this._$AH[o]),a||=!M(r)||r!==this._$AH[o],r===F?t=F:t!==F&&(t+=(r??"")+h[o+1]),this._$AH[o]=r}a&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class ht extends et{constructor(t,e,i,s,h){super(t,e,i,s,h),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??F)===q)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,h=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=b.litHtmlPolyfillSupport;ot?.(Y,tt),(b.litHtmlVersions??=[]).push("3.1.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class rt extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let h=s._$litPart$;if(void 0===h){const t=i?.renderBefore??null;s._$litPart$=h=new tt(e.insertBefore(U(),t),t,void 0,i??{})}return h._$AI(t),h})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}rt._$litElement$=!0,rt.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:rt});const nt=globalThis.litElementPolyfillSupport;nt?.({LitElement:rt}),(globalThis.litElementVersions??=[]).push("4.0.6");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=t=>(e,i)=>{void 0!==i?i.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ct={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:S},pt=(t=ct,e,i)=>{const{kind:s,metadata:h}=i;let a=globalThis.litPropertyMetadata.get(h);if(void 0===a&&globalThis.litPropertyMetadata.set(h,a=new Map),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const h=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,h,t)},init(e){return void 0!==e&&this.P(s,void 0,t),e}}}if("setter"===s){const{name:s}=i;return function(i){const h=this[s];e.call(this,i),this.requestUpdate(s,h,t)}}throw Error("Unsupported decorator location: "+s)};function dt(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,s?{...t,wrapped:!0}:t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function ut(t){return dt({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vt=1;class gt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt="important",$t=" !"+yt,ft=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends gt{constructor(t){if(super(t),t.type!==vt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith($t);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?yt:""):i[t]=s}}return q}});class mt extends rt{constructor(){super(...arguments),this.values=[],this.labels=[],this.max=0,this.static=!1,this.tooltipFormat="@L @V",this.tooltipDisabled=!1,this.width=0,this.height=0,this.valueShapes=[]}get valueShapeActive(){if(void 0!==this.active)return this.valueShapes[this.active]}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver((t=>{t.forEach((t=>{this.width=t.contentRect.width,this.height=t.contentRect.height}))})),this.resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this)}willUpdate(t){if(!this.width||!this.height)return;t.has("labels")&&(this.labels=this.labels.map((t=>null!=t?(""+t).trim():"")));["width","height","values","labels","min","max","gap","weight","point","inside","donut","radius"].some((e=>t.has(e)))&&(this.computeChartShapes(),this.dispatchEvent(new CustomEvent("computed",{bubbles:!1,composed:!1})))}render(){return I`<div class="wrapper">${this.hasEnoughValueShapes()?this.chartTemplate():F} ${this.hasEnoughValueShapes()?this.tooltipTemplate():F}</div>`}firstUpdated(){const t=this.renderRoot.querySelector(".wrapper");let e;t.addEventListener("click",(t=>{const e=this.findValueShapeAtPosition(t.offsetX,t.offsetY);e&&this.dispatchValueShapeEvent("shape-click",e)})),t.addEventListener("mousemove",(t=>{const i=this.findValueShapeAtPosition(t.offsetX,t.offsetY);!e||i&&i.index===e.index||this.dispatchValueShapeEvent("shape-leave",e),!i||e&&i.index===e.index||this.dispatchValueShapeEvent("shape-enter",i),e=i,this.static||(this.active=null==e?void 0:e.index)})),t.addEventListener("mouseleave",(t=>{e&&this.dispatchValueShapeEvent("shape-leave",e),e=void 0,this.static||(this.active=e)})),document.addEventListener("click",(e=>{e.composedPath().includes(t)||this.static||t.dispatchEvent(new MouseEvent("mouseleave"))}))}updated(){const t=this.renderRoot.querySelector(".tooltip");if(t){const e=10,i=t.getBoundingClientRect();let s=parseFloat(t.style.left);i.left<e?s+=e-Math.floor(i.left):i.right>document.documentElement.offsetWidth-e&&(s+=document.documentElement.offsetWidth-e-Math.ceil(i.right)),t.style.left=`${s}px`}}get tooltipText(){return!this.valueShapeActive||this.static||this.tooltipDisabled?"":this.tooltipFormat.replace(/@V/g,this.valueShapeActive.value.toLocaleString()).replace(/@L/g,this.valueShapeActive.label?this.valueShapeActive.label:"").trim()}onlyNegativeValues(){return Math.max(...this.values)<=0}dispatchValueShapeEvent(t,e){this.dispatchEvent(new CustomEvent(t,{detail:{index:e.index,value:e.value,label:e.label},bubbles:!1,composed:!1}))}}mt.styles=o`:host{--shape-color:#597BFC;--shape-opacity:1;--shape-opacity-active:0.5;--residual-color:black;--residual-opacity:0;--tooltip-font-color:white;--tooltip-font-size:0.875em;--tooltip-font-weight:bold;--tooltip-radius:3px;--tooltip-padding:3px 4px;--tooltip-background:black;--tooltip-shadow:none;display:block;width:120px;height:60px}.wrapper{display:block;width:100%;height:100%;position:relative;box-sizing:border-box;border-radius:inherit}.wrapper *{box-sizing:border-box}.chart{display:block;position:relative;z-index:1;width:100%;height:100%;overflow:hidden;border-radius:inherit;transform:translateZ(0)}.chart .residual{fill:var(--residual-color);opacity:var(--residual-opacity)}.tooltip{position:absolute;z-index:10;font-size:var(--tooltip-font-size);font-weight:var(--tooltip-font-weight);line-height:1;text-align:center;white-space:nowrap;color:var(--tooltip-font-color);padding:var(--tooltip-padding);pointer-events:none;user-select:none;border-radius:var(--tooltip-radius);background-color:var(--tooltip-background);box-shadow:var(--tooltip-shadow)}`,t([dt({type:Array})],mt.prototype,"values",void 0),t([dt({type:Array})],mt.prototype,"labels",void 0),t([dt({type:Number})],mt.prototype,"max",void 0),t([dt({type:Number,attribute:!1})],mt.prototype,"active",void 0),t([dt({type:Boolean,reflect:!0})],mt.prototype,"static",void 0),t([dt({type:String,attribute:"tooltip-format"})],mt.prototype,"tooltipFormat",void 0),t([dt({type:Boolean,attribute:"tooltip-disabled",reflect:!0})],mt.prototype,"tooltipDisabled",void 0),t([ut()],mt.prototype,"width",void 0),t([ut()],mt.prototype,"height",void 0);let St=class extends mt{constructor(){super(...arguments),this.min=0,this.gap=2,this.radius=2,this.horizontal=!1}computeChartShapes(){this.valueShapes=[];const t=Math.min(...this.values,this.min),e=Math.max(...this.values,this.max),i=e-t,s=((this.horizontal?this.height:this.width)-this.gap*(this.values.length-1))/this.values.length,h=e=>{const s=this.horizontal?this.width:this.height,h=i?(e-t)/i*s:1;return this.horizontal?h:s-h};this.values.forEach(((a,o)=>{let r=(s+this.gap)*o,n=h(a<0?Math.min(e,0):a),l=h(a<0?a:Math.max(t,0));this.horizontal&&([n,l]=[l,n]);let c=l-n;0==c&&(c=1,i&&(this.horizontal?e<0:e>0)&&n--),this.valueShapes.push({index:o,value:a,label:this.labels[o],origin:{x:this.horizontal?n:r,y:this.horizontal?r:n},width:this.horizontal?c:s,height:this.horizontal?s:c})}))}chartTemplate(){const t=Math.min(this.radius,(this.horizontal?this.valueShapes[0].height:this.valueShapes[0].width)/2),e=t=>({opacity:`var(${this.active===t?"--shape-opacity-active":"--shape-opacity"})`,fill:`var(--shape-color-${(null!=t?t:0)+1}, var(--shape-color))`,willChange:"opacity"});return I`<svg class="chart"><defs><mask id="residual-mask" maskUnits="userSpaceOnUse">${this.valueShapes.map((e=>W`<rect x="${this.horizontal?0:e.origin.x}" y="${this.horizontal?e.origin.y:0}" width="${this.horizontal?this.width:e.width}" height="${this.horizontal?e.height:this.height}" rx="${t}" ry="${t}" fill="white"/><rect x="${e.origin.x}" y="${e.origin.y}" width="${e.width}" height="${e.height}" rx="${t}" ry="${t}" fill="black"/>`))}</mask></defs><rect class="residual" x="0" y="0" width="100%" height="100%" mask="url(#residual-mask)"/>${this.valueShapes.map((i=>W`<rect class="bar" x="${i.origin.x}" y="${i.origin.y}" width="${i.width}" height="${i.height}" rx="${t}" ry="${t}" style="${ft(e(i.index))}"/>`))}</svg>`}tooltipTemplate(){if(!this.valueShapeActive||!this.tooltipText)return I``;const t={left:this.valueShapeActive.origin.x+this.valueShapeActive.width/2+"px",top:this.valueShapeActive.origin.y-2+"px",transform:"translate(-50%, -100%)"};return!this.horizontal&&(this.valueShapeActive.value<0||this.onlyNegativeValues())&&(t.top=this.valueShapeActive.origin.y+this.valueShapeActive.height+2+"px",t.transform="translate(-50%, 0%)"),I`<div class="tooltip" style="${ft(t)}">${this.tooltipText}</div>`}findValueShapeAtPosition(t,e){if(!this.hasEnoughValueShapes())return;const i=this.horizontal?e:t;return this.valueShapes.find((t=>{const e=this.horizontal?t.origin.y:t.origin.x,s=this.horizontal?t.height:t.width,h=e-this.gap/2,a=e+s+this.gap/2;return i>=h&&i<=a}))}hasEnoughValueShapes(){return this.valueShapes.length>=2}};t([dt({type:Number})],St.prototype,"min",void 0),t([dt({type:Number})],St.prototype,"gap",void 0),t([dt({type:Number})],St.prototype,"radius",void 0),t([dt({type:Boolean,reflect:!0})],St.prototype,"horizontal",void 0),St=t([lt("tc-bar")],St);let xt=class extends mt{constructor(){super(...arguments),this.min=0,this.weight=2,this.inside=!1}computeChartShapes(){this.valueShapes=[],this.otherShapes={linePath:"",areaPath:""};const t=Math.min(...this.values,this.min),e=Math.max(...this.values,this.max)-t,i=this.point?this.point/2:(this.weight+6)/2,s=this.inside?i:this.weight/2,h=t=>t*((this.width-2*s)/(this.values.length-1))+s,a=i=>{const h=this.height-2*s;let a=h;return e&&(a-=(i-t)/e*h),a+s};this.valueShapes=this.values.map(((t,e)=>({index:e,value:t,label:this.labels[e],center:{x:h(e),y:a(t)},radius:i}))),this.otherShapes.linePath=this.valueShapes.map(((t,e)=>(0===e?"M":"L")+t.center.x+","+t.center.y)).join(" "),this.otherShapes.areaPath=this.otherShapes.linePath.concat("L"+(this.valueShapes[this.valueShapes.length-1].center.x+s)+","+this.valueShapes[this.valueShapes.length-1].center.y+" ").concat("L"+(this.valueShapes[this.valueShapes.length-1].center.x+s)+","+(a(Math.max(t,0))+(this.onlyNegativeValues()?-s:s))+" ").concat("L"+(this.valueShapes[0].center.x-s)+","+(a(Math.max(t,0))+(this.onlyNegativeValues()?-s:s))+" ").concat("L"+(this.valueShapes[0].center.x-s)+","+this.valueShapes[0].center.y+" ").concat("Z")}chartTemplate(){const t=t=>({opacity:`var(${this.active===t?"--point-opacity-active":"--point-opacity"})`,fill:"var(--point-inner-color)",stroke:"var(--point-border-color)",willChange:"opacity"}),e=t=>({opacity:`calc(100 * var(${this.active===t?"--point-opacity-active":"--point-opacity"}))`,willChange:"opacity"});return I`<svg class="chart"><defs><mask id="residual-mask" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="100%" height="100%" fill="white"/><path d="${this.otherShapes.areaPath}" fill="black"/><path d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round" stroke="black" fill="none"/>${this.valueShapes.map((t=>W`<circle cx="${t.center.x}" cy="${t.center.y}" r="${t.radius}" fill="black" style="${ft(e(t.index))}"/>`))}</mask><mask id="area-mask" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="100%" height="100%" fill="white"/><path d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round" stroke="black" fill="none"/>${this.valueShapes.map((t=>W`<circle cx="${t.center.x}" cy="${t.center.y}" r="${t.radius}" fill="black" style="${ft(e(t.index))}"/>`))}</mask><mask id="line-mask" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="100%" height="100%" fill="white"/>${this.valueShapes.map((t=>W`<circle cx="${t.center.x}" cy="${t.center.y}" r="${t.radius}" fill="black" style="${ft(e(t.index))}"/>`))}</mask></defs><rect class="residual" x="0" y="0" width="100%" height="100%" mask="url(#residual-mask)"/><path class="area" d="${this.otherShapes.areaPath}" mask="url(#area-mask)"/><path class="line" d="${this.otherShapes.linePath}" stroke-width="${this.weight}" stroke-linecap="round" stroke-linejoin="round" mask="url(#line-mask)" style="${ft({opacity:"var(--shape-opacity)",fill:"none",stroke:"var(--shape-color)"})}"/></svg> <svg class="points">${this.valueShapes.map((e=>W`<circle class="point" cx="${e.center.x}" cy="${e.center.y}" r="${e.radius-.4*this.weight}" stroke-width="${.8*this.weight}" style="${ft(t(e.index))}"/>`))}</svg>`}tooltipTemplate(){if(!this.valueShapeActive||!this.tooltipText)return I``;const t={left:this.valueShapeActive.center.x+"px",top:this.valueShapeActive.center.y-this.valueShapeActive.radius-2+"px",transform:"translate(-50%, -100%)"};return(this.valueShapeActive.value<0||this.onlyNegativeValues())&&(t.top=this.valueShapeActive.center.y+this.valueShapeActive.radius+2+"px",t.transform="translate(-50%, 0%)"),I`<div class="tooltip" style="${ft(t)}">${this.tooltipText}</div>`}findValueShapeAtPosition(t,e){if(this.hasEnoughValueShapes())return this.valueShapes.reduce(((e,i)=>Math.abs(i.center.x-t)<Math.abs(e.center.x-t)?i:e))}hasEnoughValueShapes(){return this.valueShapes.length>=2}};xt.styles=[mt.styles,o`:host{--point-inner-color:var(--shape-color);--point-border-color:var(--shape-color);--point-opacity:0;--point-opacity-active:1;--area-color:var(--shape-color);--area-opacity:0}.chart .area{fill:var(--area-color);opacity:var(--area-opacity)}.points{position:absolute;z-index:2;top:0;left:0;width:100%;height:100%;overflow:visible;transform:translateZ(0)}`],t([dt({type:Number})],xt.prototype,"min",void 0),t([dt({type:Number})],xt.prototype,"weight",void 0),t([dt({type:Boolean,reflect:!0})],xt.prototype,"inside",void 0),t([dt({type:Number})],xt.prototype,"point",void 0),xt=t([lt("tc-line")],xt);let _t=class extends mt{constructor(){super(...arguments),this.gap=2,this.rotate=0}computeChartShapes(){var t;this.valueShapes=[],this.otherShapes={gapLines:[],residualPath:"",cutoutCircle:{}};const e=this.values.reduce(((t,e)=>t+e),0),i=Math.max(e,this.max);let s=0;const h={x:this.width/2,y:this.height/2},a=Math.min(h.x,h.y);this.otherShapes.cutoutCircle={center:h,radius:a-Math.min(null!==(t=this.donut)&&void 0!==t?t:1/0,a)};const o=(t,e)=>{const s=t/i*Math.PI*2-Math.PI/2+this.rotate*Math.PI*2/360;return{x:e*Math.cos(s)+h.x,y:e*Math.sin(s)+h.y}},r=t=>{const e=t/i*100,r=o(s,a),n=o((s+t)*(100===e?.99999:1),a);let l="";return l+="M"+r.x+","+r.y+" ",l+="A"+[a,a,"0",e>50?"1":"0","1",n.x,n.y].join(",")+" ",l+="L"+[h.x,h.y].join(",")+" ",l+="Z",l};this.values.forEach(((t,e)=>{const i=o(s+t/2,a-(a-this.otherShapes.cutoutCircle.radius)/2);this.valueShapes.push({index:e,value:t,label:this.labels[e],center:i,path:r(t)}),s+=t,this.otherShapes.gapLines.push({start:o(s,a),end:h})}));const n=i-e;n&&(this.otherShapes.residualPath=r(n)),(n||1===this.values.length)&&this.otherShapes.gapLines.pop()}chartTemplate(){const t=t=>({opacity:`var(${this.active===t?"--shape-opacity-active":"--shape-opacity"})`,fill:`var(--shape-color-${(null!=t?t:0)+1}, var(--shape-color))`,willChange:"opacity"});return I`<svg class="chart"><defs><mask id="mask" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="100%" height="100%" fill="white"/><circle cx="${this.otherShapes.cutoutCircle.center.x}" cy="${this.otherShapes.cutoutCircle.center.y}" r="${this.otherShapes.cutoutCircle.radius}" fill="black"/>${this.otherShapes.gapLines.map((t=>W`<line x1="${t.start.x}" y1="${t.start.y}" x2="${t.end.x}" y2="${t.end.y}" stroke-width="${this.gap}" stroke-linecap="round" stroke="black"/>`))}</mask></defs><g mask="url(#mask)"><path class="residual" d="${this.otherShapes.residualPath}"/>${this.valueShapes.map((e=>W`<path class="slice" d="${e.path}" style="${ft(t(e.index))}"/>`))}</g></svg>`}tooltipTemplate(){if(!this.valueShapeActive||!this.tooltipText)return I``;const t={left:this.valueShapeActive.center.x+"px",top:this.valueShapeActive.center.y+"px",transform:"translate(-50%, -50%)"};return I`<div class="tooltip" style="${ft(t)}">${this.tooltipText}</div>`}findValueShapeAtPosition(t,e){if(!this.hasEnoughValueShapes())return;if(1===this.valueShapes.length)return this.valueShapes[0];const i=this.renderRoot.querySelector(".chart"),s=i.createSVGPoint();s.x=t,s.y=e;const h=Array.from(i.querySelectorAll(".slice")).findIndex((t=>t.isPointInFill(s)));return h<0?void 0:this.valueShapes[h]}hasEnoughValueShapes(){return this.valueShapes.length>=1}};_t.styles=[mt.styles,o`:host{width:60px;border-radius:100%}`],t([dt({type:Number})],_t.prototype,"gap",void 0),t([dt({type:Number})],_t.prototype,"rotate",void 0),t([dt({type:Number})],_t.prototype,"donut",void 0),_t=t([lt("tc-pie")],_t);let bt=class extends mt{constructor(){super(...arguments),this.gap=2,this.radius=2,this.horizontal=!1}computeChartShapes(){this.valueShapes=[],this.otherShapes={gapLines:[],valuesRectangle:{}};const t=Math.max(this.values.reduce(((t,e)=>t+e),0),this.max);let e=this.horizontal?0:this.height;this.values.forEach(((i,s)=>{const h=this.horizontal?this.height:this.width,a=i/t*(this.horizontal?this.width:this.height);this.valueShapes.push({index:s,value:i,label:this.labels[s],origin:{x:this.horizontal?e:0,y:this.horizontal?0:e-a},width:this.horizontal?a:h,height:this.horizontal?h:a}),s>0&&0!==i&&this.otherShapes.gapLines.push({start:{x:this.horizontal?e:0,y:this.horizontal?0:e},end:{x:this.horizontal?e:h,y:this.horizontal?h:e}}),e=this.horizontal?e+a:e-a})),this.otherShapes.valuesRectangle={origin:{x:0,y:0},width:this.width,height:this.height},this.horizontal?this.otherShapes.valuesRectangle.width=this.valueShapes.reduce(((t,e)=>t+e.width),0):(this.otherShapes.valuesRectangle.height=this.valueShapes.reduce(((t,e)=>t+e.height),0),this.otherShapes.valuesRectangle.origin.y=this.height-this.otherShapes.valuesRectangle.height)}chartTemplate(){const t=Math.min(this.radius,this.height/2,this.width/2),e=t=>({opacity:`var(${this.active===t?"--shape-opacity-active":"--shape-opacity"})`,fill:`var(--shape-color-${(null!=t?t:0)+1}, var(--shape-color))`,willChange:"opacity"});return I`<svg class="chart"><defs><mask id="values-mask" maskUnits="userSpaceOnUse"><rect x="${this.otherShapes.valuesRectangle.origin.x}" y="${this.otherShapes.valuesRectangle.origin.y}" width="${this.otherShapes.valuesRectangle.width}" height="${this.otherShapes.valuesRectangle.height}" rx="${t}" ry="${t}" fill="white"/>${this.otherShapes.gapLines.map((t=>W`<line x1="${t.start.x}" y1="${t.start.y}" x2="${t.end.x}" y2="${t.end.y}" stroke-width="${this.gap}" stroke-linecap="round" stroke="black"/>`))}</mask><mask id="residual-mask" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="100%" height="100%" rx="${t}" ry="${t}" fill="white"/><rect x="${this.otherShapes.valuesRectangle.origin.x}" y="${this.otherShapes.valuesRectangle.origin.y}" width="${this.otherShapes.valuesRectangle.width}" height="${this.otherShapes.valuesRectangle.height}" rx="${t}" ry="${t}" fill="black"/></mask></defs><rect class="residual" x="0" y="0" width="100%" height="100%" mask="url(#residual-mask)"/><g mask="url(#values-mask)">${this.valueShapes.map((t=>W`<rect class="bar" x="${t.origin.x}" y="${t.origin.y}" width="${t.width}" height="${t.height}" style="${ft(e(t.index))}"/>`))}</g></svg>`}tooltipTemplate(){if(!this.valueShapeActive||!this.tooltipText)return I``;const t={left:this.valueShapeActive.origin.x+this.valueShapeActive.width/2+"px",top:this.valueShapeActive.origin.y-2+"px",transform:"translate(-50%, -100%)"};return I`<div class="tooltip" style="${ft(t)}">${this.tooltipText}</div>`}findValueShapeAtPosition(t,e){if(!this.hasEnoughValueShapes())return;if(1===this.valueShapes.length)return this.valueShapes[0];const i=this.horizontal?t:e;return this.valueShapes.find((t=>{const e=this.horizontal?t.origin.x:t.origin.y,s=this.horizontal?t.width:t.height,h=e-this.gap/2,a=e+s+this.gap/2;return i>=h&&i<=a}))}hasEnoughValueShapes(){return this.valueShapes.length>=1}};bt.styles=[mt.styles,o`:host(:not([horizontal])){width:20px}:host([horizontal]){height:20px}`],t([dt({type:Number})],bt.prototype,"gap",void 0),t([dt({type:Number})],bt.prototype,"radius",void 0),t([dt({type:Boolean,reflect:!0})],bt.prototype,"horizontal",void 0),bt=t([lt("tc-stack")],bt);export{St as TcBar,xt as TcLine,_t as TcPie,bt as TcStack};