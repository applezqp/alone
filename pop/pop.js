!function(h,f,g,d){var b=navigator.userAgent.toLowerCase();var e={isU:function(k){return k===void 0},isS:function(k){return !e.isU(k)&&k.constructor==String},isN:function(k){return !e.isU(k)&&k.constructor==Number},isO:function(k){return !e.isU(k)&&k.constructor==Object},isF:function(k){return !e.isU(k)&&k.constructor==Function},isA:function(k){return !e.isU(k)&&k.constructor==Array},isE:function(k){return !e.isU(k)&&!!(k&&k.nodeType&&k.nodeType==1)},isDOM:function(k){return k===g||k===h||k===f||e.isE()},isStrict:h.compatMode==="CSS1Compat",each:function(k,o){if(!e.isA(k)||!e.isF(o)){return}var n=0,m=k.length;while(n<m,o.call(null,k[n++])){}},trim:function(k){return k.replace(/^\s+/,"").replace(/\s+$/,"")},ss:function(k,l){return k.replace(/{{([^}{2}]+)}}/g,function(n,m){return m&&l[m]||""})},ua:{ie:/msie/.test(b)&&!/opera/i.test(b),ie6:/msie 6/.test(b)}},a={c:function(m,l){if(!e.isS(m)){return}var o=h.createElement(m);if(e.isO(l)){for(var n in l){switch(n.toLowerCase()){case"class":o.setAttribute(e.ua.ie6?"className":"class",l[n]);break;default:o.setAttribute(n,l[n]);break}}}return o},as:function(k){var l=a.c("style",{type:"text/css"});(h.head||h.getElementsByTagName("head")[0]).appendChild(l);if(l.styleSheet){l.styleSheet.cssText=k}else{l.appendChild(h.createTextNode(k))}return l},ac:function(m,k){var l=new RegExp("\\b"+k+"\\b","g");if(l.test(m.className)){return}m.className=e.trim(m.className)+(!!e.trim(m.className)?" "+k:k)},rc:function(m,k){var l=new RegExp("\\b"+k+"\\b","g");m.className=m.className.replace(l,"")},vs:function(){return e.ua.ie?(e.isStrict?{width:f.clientWidth,height:f.clientHeight}:{width:h.body.clientWidth,height:h.body.clientHeight}):{width:g.innerWidth,height:g.innerHeight}},ws:function(){return{width:Math.max(h.body.clientWidth,h.body.scrollWidth),height:Math.max(h.body.clientHeight,h.body.scrollHeight)}},st:function(){return g.pageYOffset||f.scrollTop||h.body.scrollTop}},j={on:function(n,l,m){var l=/^(on)/.test(l)?l.substr(2):l;if(n.addEListener){n.addEListener(l,function(){m.call(n)},false)}else{if(n.attachE){n.attachE("on"+l,function(){m.call(n)})}else{var k=n["on"+l];n["on"+l]=function(){if(k){k.call(n)}m.call(n)}}}},fire:function(k,l){e.each(k,function(m){m.call(l)})}},i=function(k){var l=this;l._cfg(k);l._pop,l._close,l._iframe,l._mask,l._style;l.evt={close:[],show:[]}},c=function(k){return new i(k)};i.prototype={_bc:[".alone_pop{","display:none;","position:{{position}};width:{{width}}px;height:{{height}}px;","z-index:100000","}",".alone_pop_x{","position:absolute;top:1px;right:1px;z-index:2;","display:block;","width:20px;height:20px;","}",".alone_mask{","display:none;","position:absolute;left:0;top:0;","width:100%;height:100%;background:#000;","opacity:0.5;filter:alpha(opacity=50);","z-index:99999","}"],_dc:[".alone_pop_hd{","width:{{width_hd}}px;height:24px;line-height:24px;padding:0 5px;","position:absolute;left:0;top:0;z-index:1;","background:#CCC","}"],render:function(k){var l=this;l._cfg(k);l.destroy();var m=h.createDocumentFragment();l._style=a.as(e.ss(l._bc.join("").replace(/\.(alone_)/g,"."+l.prefixCls+"$1")+(l.type==="dialog"?l._dc.join("").replace(/\.(alone_)/g,"."+l.prefixCls+"$1"):""),{width:l.width,width_hd:l.width-10,height:l.height,position:e.ua.ie6?"absolute":"fixed"}));(h.head||document.getElementsByTagName("head")[0]).appendChild(l._style);l._pop=l.srcNode&&l.srcNode||a.c("div",{"class":l.prefixCls+"alone_pop"});l.srcNode&&(a.ac(l.srcNode,l.prefixCls+"alone_pop"));l.url&&!l.srcNode&&(l._iframe=a.c("iframe",{src:l.url,width:"100%",height:"100%",scrolling:l.scroll,frameBorder:"0",allowtransparency:false}));l.type==="dialog"&&(l._hd=a.c("div",{"class":l.prefixCls+"alone_pop_hd"}));l._hd&&(l._hd.innerHTML=l.title);l.closable&&(l._close=a.c("a",{href:"javascript:void(0)","class":l.prefixCls+"alone_pop_x"}));l._mask=l.maskable?a.c("div",{"class":l.prefixCls+"alone_mask"}):null;var n=null;if(e.ua.ie6){n=a.c("iframe",{src:"about:blank",width:"100%",height:"100%",frameBorder:"0",scrolling:"no"})}n&&l._mask&&l._mask.appendChild(n);l._mask&&m.appendChild(l._mask);l._iframe&&l._pop&&l._pop.appendChild(l._iframe);l._hd&&l._pop&&l._pop.appendChild(l._hd);l._close&&l._pop&&l._pop.appendChild(l._close);l._pop&&!l.srcNode&&m.appendChild(l._pop);h.body.appendChild(m);l._bind();return l},_cfg:function(k){var l=this;l.cfg=k=k&&k||{};l.type=k.type&&e.isS(k.type)&&k.type.toLowerCase()||l.type||"";l.srcNode=k.srcNode&&e.isE(k.srcNode)&&k.srcNode||l.srcNode||null;l.title=k.title&&e.isS(k.title)&&k.title||l.title||"";l.url=!l.srcNode&&k.url&&e.isS(k.url)&&k.url||l.url||"";l.width=Number(k.width)||l.width||0;l.height=Number(k.height)||l.height||0;l.scroll=k.scroll&&"yes"||l.scroll||"no";l.trigger=e.isE(k.trigger)&&k.trigger||l.trigger||null;l.maskable=e.isU(k.maskable)?(e.isU(l.maskable)?true:l.maskable):!!k.maskable;l.closable=e.isU(k.closable)?(e.isU(l.closable)?true:l.closable):!!k.closable;l.prefixCls=k.prefixCls&&e.isS(k.prefixCls)&&k.prefixCls||l.prefixCls||""},_bind:function(){var k=this;j.on(g,"resize",function(){k.fixed(true)});j.on(g,"scroll",function(){k.fixed(true)});k.closable&&k._close&&(j.on(k._close,"click",function(){k.hide();j.fire(k.evt.close,k)}));return k},fixed:function(n){var l=this;var o=a.vs(),k=a.ws();if(l._pop){var m=(o.height-l.height)/2;l._pop.style.left=(o.width-l.width)/2+"px";l._pop.style.top=m+"px";e.ua.ie6&&(l._pop.style.top=a.st()+m+"px")}if(!!n){return}if(l._mask){l._mask.style.width=k.width+"px";l._mask.style.height=k.height+"px"}return l},show:function(l){var k=this;if(e.isS(l)&&!k.srcNode){k._iframe&&(k._iframe.src=l)||(k._iframe=a.c("iframe",{src:l,width:"100%",height:"100%",scrolling:k.scroll,frameBorder:"0",allowtransparency:false}))&&k._pop&&k._pop.appendChild(k._iframe)}k.fixed();k._pop&&(k._pop.style.display="block");k._mask&&(k._mask.style.display="block");j.fire(k.evt.show,k);return k},hide:function(){var k=this;k._pop&&(k._pop.style.display="none");k._mask&&(k._mask.style.display="none");return k},destroy:function(){var k=this;k.srcNode?a.rc(k.srcNode,k.prefixCls+"alone_pop"):(k._pop&&k._pop.parentNode.removeChild(k._pop));k._mask&&k._mask.parentNode.removeChild(k._mask);k._close&&k._close.parentNode.removeChild(k._close);k._style&&k._style.parentNode.removeChild(k._style);return k},on:function(k,m){if(!e.isS(k)||!e.isF(m)){return this}var l=this,k=k.toLowerCase();l.evt[k]&&l.evt[k].push(m);return l}};g.Pop=c}(document,document.documentElement,window);
