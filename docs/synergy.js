const e=e=>e.nodeType===e.TEXT_NODE&&""===e.nodeValue.trim(),t=(r,n)=>{if(!1!==n(r))for(r=r.firstChild;r;)e(r)||t(r,n),r=r.nextSibling},r=(e,t,n)=>{let i=e.split("."),a=i.length;for(;a--;)if("["===i[a].charAt(0)){let e=i[a].slice(1,-1).replace(/:/g,".");i[a]=s(r(e,t),n)}else"*"===i[a]&&(i[a]=t[i.slice(0,a).join(".")]);return i.join(".")},n=(e=[])=>e[e.length-1],i=e=>e.match(/({{[^{}]+}})/),a=e=>Object.prototype.toString.call(e).match(/\s(.+[^\]])/)[1],l=e=>e&&JSON.parse(JSON.stringify(e)),o=(e,t)=>{let r=e.split(".");return[r.slice(0,-1).reduce(((e,t)=>e&&e[t]),t)||t,n(r)]},s=(e,t)=>{let[r,n]=o(e,t);return r[n]},c=e=>e.forEach((e=>e.parentNode.removeChild(e))),u=e=>e.replace(/[\w]([A-Z])/g,(function(e){return e[0]+"-"+e[1].toLowerCase()})),d=e=>e.replace(/[\w]-([\w])/g,(function(e){return e[0]+e[2].toUpperCase()})),h=(e,t)=>{let r=d(e);return""===t&&(t=!0),e.startsWith("aria-")&&("true"===t&&(t=!0),"false"===t&&(t=!1)),{name:r,value:t}},p=(e,t,r)=>{t=u(t),"boolean"==typeof r&&(t.startsWith("aria-")?r=""+r:r&&(r="")),"string"==typeof r||"number"==typeof r?e.setAttribute(t,r):e.removeAttribute(t)},m=e=>null===e||"object"!=typeof e;let f=0;const b=(e,t)=>{e.$meta.bindings.unshift(...t)},y=(e,t)=>{let r="#"===(e=((e,t)=>{for(let{index:r,prop:n}of t)if(e===r)return"#"+n;return e})(e,t)).charAt(0);r&&(e=e.slice(1)),e=e.split(/(\[[^\]]+\])/).filter((e=>e)).reduce(((e,t)=>e+("["===t.charAt(0)?"."+t.replace(/\./g,":"):t)),"");let n=t.length;for(;n--;){let{valueIdentifier:r,prop:i}=t[n];e=e.split(".").map((e=>{let t="["===e.charAt(0);return t&&(e=e.slice(1,-1)),(e=e.trim())===r&&(e=i+(t?":*":".*")),t?`[${e}]`:e})).join(".")}return r?"#"+e:e},g=(e,t)=>e.trim().split(/({{[^{}]+}})/).filter((e=>e)).map((e=>{let r=e.match(/{{([^{}]+)}}/);if(r){let e=r[1].trim(),n="!"===e.charAt(0);n&&(e=e.slice(1));let i=v(e,t);return i?{type:"function",negated:n,...i}:{type:"key",value:y(e,t),negated:n}}return{type:"value",value:e}}));let A;const v=(e,t)=>{let r=e.match(/(?:(\w+) => )?([^\(]+)(?:\(([^\)]*)\))/);if(!r)return;let n=r[1],i=r[2],a=r[3]&&r[3].trim();return a=a?a.split(",").filter((e=>e)).map((e=>e.trim())).map((e=>y(e,t))):null,{event:n,method:i,args:a}},$=({name:e,value:t},r,n)=>{if(e.startsWith("on")){r.removeAttribute(e);let i=e.split("on")[1];A.add(i);let{event:a,method:l,args:o}=v(t,n);b(r,[{type:"call",eventName:i,event:a,method:l,args:o}])}else{if("name"===e&&t&&("INPUT"===r.nodeName||"SELECT"===r.nodeName||"TEXTAREA"===r.nodeName)){let e=y(t,n);A.add("input"),b(r,[{type:3,path:e},{type:"set",eventName:"input",path:e}])}i(t)&&(r.removeAttribute(e),b(r,[{name:e,parts:g(t,n),type:1,context:n.slice()}]))}};let k=0;const E=(e,r)=>{A=new Set,f=0;return(()=>{let a=[];return t(e,(function e(l){switch(l.$meta={rootNode:r,index:f++,bindings:[]},l.nodeType){case l.TEXT_NODE:((e,t,r)=>{i(e)&&b(t,[{childIndex:Array.from(t.parentNode.childNodes).findIndex((e=>e===t)),parts:g(e,r),type:2,context:r.slice()}])})(l.nodeValue,l,a);break;case l.ELEMENT_NODE:if("TEMPLATE"===l.nodeName){let r=function(e){let t=e.getAttribute("each"),r=t&&t.match(/(.+)\s+in\s+(.+)/);if(!r)return;let[n,i,a]=r,l=i.match(/\(([^\)]+)\)/),[o,s]=(l?l[1].split(","):[i]).map((e=>e.trim()));return{prop:a.trim(),valueIdentifier:o,index:s,key:e.getAttribute("key")||"id"}}(l);if(r){a.push(r),t(l.content,e);let{key:i,prop:o}=n(a),s={uid:i,path:y(o,a)};l.$meta.listId=k,b(l,[{...s,type:4}]);let c={...s,type:5};for(let e of l.content.children)e.$meta.listId=k,b(e,[c]);a.pop(),k++}}else!function(e,t){let r=e.attributes,n=r.length;for(;n--;)$(r[n],e,t)}(l,a)}})),Array.from(A)})()},N=(e,t,r)=>{if(!r)return;return r.$meta?.rootNode===e&&r.$meta.bindings.find((({eventName:e})=>e===t))||N(e,t,r.parentNode)},x=(e,t,n)=>{t.forEach((t=>{e.addEventListener(t,(i=>{let a=N(e,t,i.target);if(a){if("call"===a.type){let e=a.args?a.args.map((e=>r(e,a.ctx,n))).map((e=>e===a.event?i:s(e,n))):[],t=n[a.method](...e);t&&requestAnimationFrame(t)}"set"===a.type&&((e,t,r)=>{let[n,i]=o(e,r);n[i]=t})(a.realPath,(e=>{if(e.hasAttribute("multiple")&&"SELECT"===e.nodeName)return Array.from(e.selectedOptions).map((e=>e.value));switch(e.getAttribute("type")||"text"){case"checkbox":return e.checked;case"radio":return e.getAttribute("value");default:return e.value}})(i.target),n)}}),"blur"===t||"focus"===t)}))},C=e=>{const r=[];return t(e,(e=>{r.push(e),"TEMPLATE"===e.nodeName&&r.push(...C(e.content))})),r},T=e=>{let t=e.cloneNode(!0),r=C(e),n=C(t),i=r.length;for(;i--;)n[i].$meta=l(r[i].$meta),n[i].$meta.rootNode=r[i].$meta.rootNode;return t};const w=(e,t,n)=>{let{value:i,negated:a}=e;if("#"===i.charAt(0))return t[i.slice(1)];let l=s(r(i,t,n),n);return a?!l:l},j=e=>{let t=typeof e;return"string"===t?e.split(";").reduce(((e,t)=>{const[r,n]=t.split(":").map((e=>e.trim()));return r&&(e[r]=n),e}),{}):"object"===t?e:{}},S=(e,t,r)=>{if("style"===t)r=(e=>Object.entries(e).map((([e,t])=>`${e}: ${t};`)).join(" "))((n={...j(e.getAttribute("style")),...j(r)},Object.keys(n).reduce(((e,t)=>(e[u(t)]=n[t],e)),{})));else if("class"===t)switch(a(r)){case"Array":r=r.join(" ");break;case"Object":r=Object.keys(r).reduce(((e,t)=>(r[t]&&e.push(t),e)),[]).join(" ")}else if(!m(r))return e[d(t)]=r;var n;p(e,t,r)},I=(e,t,n,i,a)=>{if(e.eventName)return e.ctx=l(n),void(e.path&&(e.realPath=r(e.path,n)));if(5===e.type)return n[e.path]=t.$meta.blockIndex;let s=((e,t)=>1===t.type?h(t.name,e.getAttribute(t.name)).value:e.textContent)(t,e);if(e.path){const{path:r}=e,a=w({value:r},n,i);if(4===e.type){const r=((e="id",t=[],r=[])=>{let n=r.map(((r,n)=>void 0===r[e]?n in t?n:-1:t.findIndex((t=>t[e]===r[e]))));if(t.length!==r.length||!n.every(((e,t)=>e===t)))return n})(e.uid,t.$meta.blockData,a);return t.$meta.blockData=a,r&&((e,t)=>{let r=Array.from(e.content.children),n=(e=>{let t=e.nextSibling,r=[];for(;t&&t.$meta?.listId===e.$meta.listId;)r[t.$meta.blockIndex]=r[t.$meta.blockIndex]||[],r[t.$meta.blockIndex].push(t),t=t.nextSibling;return r})(e),i=document.createDocumentFragment();n.forEach(c),t.forEach(((e,t)=>{(-1===e?r.map(T):n[e]).forEach((e=>{e.$meta.blockIndex=t,i.appendChild(e)}))})),e.after(i)})(t,r)}if(s===a)return;if(3===e.type){if(t.hasAttribute("multiple")&&"SELECT"===t.nodeName)return void Array.from(t.querySelectorAll("option")).forEach((e=>{e.selected=a.includes(e.value)}));switch(t.getAttribute("type")){case"checkbox":t.checked=a,t.checked?t.setAttribute("checked",""):t.removeAttribute("checked");break;case"radio":t.checked=a===t.getAttribute("value"),t.checked?t.setAttribute("checked",""):t.removeAttribute("checked");break;default:t.setAttribute("value",t.value=a||"")}return}}const u=e.parts.reduce(((e,t)=>{let{type:r,value:l}=t,s=l;if("key"===r)s=w(t,n,i);else if("function"===r){let e=t.args.map((e=>w({value:e},n,i)));s=((e,t,r)=>{let[n,i]=o(e,t);return n[i].apply(n,r)})(t.method,a,e)}return e?e+s:s}),"");u!==s&&((e,t,r)=>{1===t.type?S(e,t.name,r):e.textContent=r})(t,e,u)};let O;const P=(e,t)=>{let r=new WeakMap;const n={get(e,t){return["Object","Array"].includes(a(e[t]))?function(e,t){let n=r.get(e);return void 0===n&&(n=new Proxy(e,t),r.set(e,n)),n}(e[t],n):Reflect.get(...arguments)},set(e,r,n){return n===e[r]||(t(),Reflect.set(...arguments))},deleteProperty(){return t(),Reflect.deleteProperty(...arguments)}};return new Proxy(e,n)},L=(e,r,n,i={})=>{let a,o,s=((e,r,n=(()=>{}))=>i=>{let a={},o=l(r);t(i,(t=>{if(t.$meta?.rootNode!==e)return;let n=t.$meta.bindings;n&&n.forEach((e=>I(e,t,a,o,r)))})),O&&n(O),O=o})(e,r,(e=>o&&r.updatedCallback(e)));if(!e.$initData){n=(e=>{if("TEMPLATE"===e.nodeName)return e;let t=document.createElement("template");return t.innerHTML=e,t})(n).cloneNode(!0).content,e.$subscribe=E(n,e),s(n),i.beforeMountCallback?.(n);for(let t of e.children)t.remove();e.appendChild(n)}return a=P(r,(e=>{let t;return function(){t||(t=requestAnimationFrame((()=>{e(),t=null})))}})((()=>s(e)))),x(e,e.$subscribe,a),o=!0,a},D=e=>{let t=document.createDocumentFragment();for(;e.firstChild;)t.appendChild(e.firstChild);return t},M=(e,t,r,n={})=>{customElements.define(e,class extends HTMLElement{async connectedCallback(){if(!this.initialised){let e=new Set,i=this;this.$initData&&Object.assign(this,this.$initData);let a=t(new Proxy({},{get(t,r){let n=u(r);return e.add(r),i.hasAttribute(n)&&i.getAttribute(n)||i[r]}}),this);this.$=a instanceof Promise?await a:a,e=Array.from(e);let l=e.map(u),o=this.setAttribute;this.setAttribute=(e,t)=>{if(l.includes(e)){let{name:r,value:n}=h(e,t);this.$[r]=n}o.apply(this,[e,t])};let s=l.reduce(((e,t)=>{let r,n=h(t).name;return r=this.hasAttribute(t)?this.getAttribute(t):this[n]||this.$[n],Object.defineProperty(this,n,{get(){return this.$[n]},set(e){this.$[n]=e,m(e)&&p(this,n,e)}}),this[n]=r,e[n]=r,e}),{}),c={};n.shadow?this.attachShadow({mode:n.shadow}):c.beforeMountCallback=e=>((e,t)=>{t.querySelectorAll("slot[name]").forEach((t=>{let r=t.attributes.name.value,n=e.querySelector(`[slot="${r}"]`);n?(n.removeAttribute("slot"),t.parentNode.replaceChild(n,t)):t.parentNode.replaceChild(D(t),t)}));let r=t.querySelector("slot:not([name])");r&&r.parentNode.replaceChild(D(e.innerHTML.trim()?e:r),r)})(this,e),((e,t,r)=>{let n=e[t];e[t]=function(){r(...arguments),n?.apply(e,arguments)}})(this.$,"updatedCallback",(()=>{e.forEach((e=>{let t=this.$[e];m(t)&&p(this,e,t)}))})),this.$=L(this.shadowRoot||this,this.$,r,c),this.initialised=!0,this.$initData=s}this.$.connectedCallback?.(this.$)}disconnectedCallback(){this.$?.disconnectedCallback?.(this.$)}})};export{M as define};
