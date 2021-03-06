/*
 * @name:pop.js
 * @description:pop
 * @author:wondger@gmail.com
 * @date:2012-02-23
 * @param:
 * @todo:
 *      [O].优化重复mask问题 [2012-03-19 finished]
 * @changelog:
 */
(function(doc,rt,win,undefined){
    var ua = navigator.userAgent.toLowerCase(),
        ts = Object.prototype.toString,
        ie = (function(){
                var ret = !/opera/i.test(ua) && ua.match(/msie\s(\d+)\.\d+;/i) || null;
                return ret && parseInt(ret[1]) || 0;
        })();

    //util
    var U = {
        isU:function(o){
            return o === void 0;
        },
        isS:function(o){
            return ts.call(o) === '[object String]';
        },
        isN:function(o){
            return ts.call(o) === '[object Number]';
        },
        isO:function(o){
            return !!o && ts.call(o) === '[object Object]';
        },
        isF:function(o){
            return ts.call(o) === '[object Function]';
        },
        isA:function(o){
            return ts.call(o) === '[object Array]';
        },
        isE:function(o){
            return !!(o && o.nodeType && o.nodeType == 1);
        },
        /*
         * window,document,document.documentElement,element
         */
        isDOM:function(o){
            return o === win || o === doc || o === rt || U.isE();
        },
        isStrict:doc.compatMode === 'CSS1Compat',
        each:function(o,fn,scope){
            if((!U.isO(o) && !U.isA(o)) || !U.isF(fn)) return;

            for(var k in o){
                fn.call(scope||null,o[k],k);
            }
        },
        trim:function(s){
            return s.replace(/^\s+/,'').replace(/\s+$/,'');
        },
        //substitute
        ss:function(s,o){
            return s.replace(/{{([^}{2}]+)}}/g,function(a,b){
                return b && o[b] || '';
            });
        },
        ua:{
            ie:ie,
            ie6:ie === 6
        }
    },

    //DOM
    D = {
        //create
        c:function(tag,attr){
            if(!U.isS(tag)) return;

            var el = doc.createElement(tag);

            if(U.isO(attr)){
                for(var k in attr){
                    switch(k.toLowerCase()){
                        case 'class':
                            el.className = attr[k];
                            break;
                        default:
                            el.setAttribute(k,attr[k]);
                            break;
                    }
                }
            }

            return el;
        },
        //addStyle
        as:function(css){
            var ele = D.c('style',{'type':'text/css'});

            (doc.head || doc.getElementsByTagName('head')[0]).appendChild(ele);

            if(ele.styleSheet){
                ele.styleSheet.cssText = css;
            }else{
                ele.appendChild(doc.createTextNode(css));
            }

            return ele;
        },
        //addClass
        ac:function(e,cls){
            var r = new RegExp('\\b'+cls+'\\b','g');
            if(r.test(e.className)) return;

            e.className = U.trim(e.className) + (!!U.trim(e.className) ? ' ' + cls : cls);
        },
        //removeClass
        rc:function(e,cls){
            var r = new RegExp('\\b'+cls+'\\b','g');
            e.className = e.className.replace(r,'');
        },
        //viewportSize
        vs:function(){
            return U.ua.ie
                ? (U.isStrict
                        ? {width:rt.clientWidth,height:rt.clientHeight}
                        : {width:doc.body.clientWidth,height:doc.body.clientHeight})
                : {width:rt.clientWidth,height:rt.clientHeight};
        },
        //windowSize
        ws:function(){
            return {
                width:Math.max(doc.body.clientWidth,doc.body.scrollWidth,rt.scrollWidth),
                height:Math.max(doc.body.clientHeight,doc.body.scrollHeight,rt.scrollHeight)
            }
        },
        //scrollTop
        st:function(){
            return win.pageYOffset || rt.scrollTop || doc.body.scrollTop;
        }
    },

    //Event
    E = {
        on:function(el,type,handle){
            if(!U.isS(type) || !U.isF(handle)) return this;
            if(el.addEventListener){
                el.addEventListener(type,handle,false);
            }else if(el.attachEvent){
                el.attachEvent('on'+type,handle);
            }else{
                var _handle = el['on'+type];
                el['on'+type] = function(){
                    if(_handle) _handle.call(el,win.event);
                    handle.call(el,win.event);
                }
            }

            return this;
        },
        fire:function(evt,_){
            U.each(evt,function(fn){
                fn.call(_);
            });
        }
    },

    _cache = {
        mask:null,
        style:null
    },

    Pop = function(cfg){
        var _ = this;

        if(!(_ instanceof Pop)) return new Pop(cfg);

        //set configuration
        _._cfg(cfg);

        //private property
        _._pop,_._close,_._iframe,_._mask,_._style,_._rendered,_._styleChanged;

        _.evt = {close:[],show:[]};
    };

    Pop.prototype = {
        //css
        _css:[
            '.alone_pop{',
            'display:none;',
            'position:{{position}};width:{{width}}px;height:{{height}}px;',
            'z-index:100000',
            '}',
            '.alone_pop_x{',
            'position:absolute;top:1px;right:1px;z-index:2;',
            'display:block;',
            'width:20px;height:20px;',
            '}',
            '.alone_mask{',
            'display:none;',
            'position:absolute;left:0;top:0;',
            'width:100%;height:100%;background:#000;',
            'opacity:0.5;filter:alpha(opacity=50);',
            'z-index:99999',
            '}',
            '.alone_pop_hd{',
            'width:{{width_hd}}px;height:24px;line-height:24px;padding:0 5px;',
            'position:absolute;left:0;top:0;z-index:1;',
            'background:#CCC',
            '}'
        ],
        //also can pass cfg
        render:function(cfg){
            var _ = this;

            !!cfg && _._cfg(cfg);

            //invoke destroy when every render
            _._styleChanged ? _.destroy() : _.destroy(true);

            var f = doc.createDocumentFragment();

            _cache.style = _._style = _cache.style
                || (D.as(U.ss(_._css.join('').replace(/\.(alone_)/g,'.'+_.prefixCls+'$1'),{
                        width:_.width,
                        width_hd:_.width - 10,
                        height:_.type==='dialog' ? _.height - 24 : _.height,
                        position:U.ua.ie6?'absolute':'fixed'
                    })));

            (doc.head || document.getElementsByTagName('head')[0]).appendChild(_._style);

            _._pop = _.srcNode && _.srcNode || D.c('div',{'class':_.prefixCls+'alone_pop'});
            _.srcNode && (D.ac(_.srcNode,_.prefixCls+'alone_pop'));

            _.url && !_.srcNode && (_._iframe = D.c('iframe',{
                'src':_.url,
                'width':'100%',
                'height':'100%',
                'scrolling':_.scroll,
                'frameBorder':'0',
                'allowtransparency':false
            }));

            _.type==='dialog' && (_._hd = D.c('div',{
                'class':_.prefixCls+'alone_pop_hd'
            }));
            _._hd && (_._hd.innerHTML = _.title);

            _.closable && (_._close = D.c('a',{
                'href':'javascript:void(0)',
                'class':_.prefixCls+'alone_pop_x'
            }));
            _cache.mask = _.maskable && (_cache.mask
                || D.c('div',{'class':_.prefixCls+'alone_mask'}))
                || null;
            _._mask = _.maskable && _cache.mask || null;

            //ie6 select window module bugfix
            //can not display mask's backgroundColor
            var maskIframe = null;
            if(U.ua.ie6) maskIframe = D.c('iframe',{
                src:'about:blank',
                width:'100%',
                height:'100%',
                frameBorder:'0',
                scrolling:'no'
            });

            maskIframe && _._mask && _._mask.appendChild(maskIframe);
            _._mask && f.appendChild(_._mask);
            _._iframe && _._pop && _._pop.appendChild(_._iframe);
            _._hd && _._pop && _._pop.appendChild(_._hd);
            _._close && _._pop && _._pop.appendChild(_._close);
            _._pop && !_.srcNode && f.appendChild(_._pop);

            doc.body.appendChild(f);

            _._bind();

            _._rendered = true;

            return _;
        },
        _cfg:function(cfg){
            var _ = this;
            _.cfg = cfg = cfg && cfg || {};

            _._styleChanged = _._checkStyleChanged(cfg);

            //pop type:dialog,overlay(default)
            _.type = cfg.type && U.isS(cfg.type) && cfg.type.toLowerCase() || _.type || '';

            _.srcNode = cfg.srcNode && U.isE(cfg.srcNode) && cfg.srcNode || _.srcNode || null;
            _.title = cfg.title && U.isS(cfg.title) && cfg.title || _.title || '';

            //iframe url
            _.url = !_.srcNode && cfg.url && U.isS(cfg.url) && cfg.url || _.url || '';
            _.width = Number(cfg.width) || _.width || 0;
            _.height = Number(cfg.height) || _.height || 0;
            _.scroll = cfg.scroll && 'yes' || _.scroll || 'no';

            _.trigger = U.isE(cfg.trigger) && cfg.trigger || _.trigger || null;
            _.triggerEvent = U.isS(cfg.triggerEvent) && cfg.triggerEvent || _.triggerEvent || '';

            _.maskable = U.isU(cfg.maskable) ? (U.isU(_.maskable) ? true : _.maskable) : !!cfg.maskable;
            _.closable = U.isU(cfg.closable) ? (U.isU(_.closable) ? true : _.closable) : !!cfg.closable;
            _.prefixCls = cfg.prefixCls && U.isS(cfg.prefixCls)
                && cfg.prefixCls || _.prefixCls || '';
        },
        _bind:function(){
            var _ = this;
            E.on(win,'resize',function(){
                _.fixed();
            });

            E.on(win,'scroll',function(){
                _.fixed();
            });

            _.closable && _._close && (E.on(_._close,'click',function(){
                _.hide();

                /*
                 * maybe sometimes you should use setTimeout to invoke handler
                 * in fuck ie6
                 */
                E.fire(_.evt.close,_);
            }));

            _.trigger && _.triggerEvent && E.on(_.trigger,_.triggerEvent,function(){
                !_._rendered && _.render().show() || _.show();
            });

            return _;
        },
        //根据cfg中width、height、type判断是否需要更新样式
        _checkStyleChanged:function(cfg){
            var _ = this,cfg = cfg || {};
            return (U.isU(cfg.width) && cfg.width !== _.width)
                    || (U.isU(cfg.height) && cfg.height!== _.height)
                    || (U.isU(cfg.type) && cfg.type!== _.type);
        },
        fixed:function(){
            var _ = this;
            var vs = D.vs(),
                ws = D.ws();

            if(_._pop){
                var offsetTop = (vs.height - _.height)/2;
                _._pop.style.left = (vs.width - _.width)/2 + 'px';
                _._pop.style.top = offsetTop + 'px';

                U.ua.ie6 && (_._pop.style.top = D.st() + offsetTop + 'px');
            }

            if(_._mask){
                _._mask.style.width = ws.width + 'px';
                _._mask.style.height = ws.height + 'px';
            }

            return _;
        },
        show:function(url){
            var _ = this;

            //show()前必须渲染，不自动调用render()
            //!_._rendered && _.render();

            if(U.isS(url) && !_.srcNode){
                _._iframe && (_._iframe.src = url) || (_._iframe = D.c('iframe',{
                    'src':url,
                    'width':'100%',
                    'height':'100%',
                    'scrolling':_.scroll,
                    'frameBorder':'0',
                    'allowtransparency':false
                })) && _._pop && _._pop.appendChild(_._iframe);
            }

            _.fixed();
            _._pop && (_._pop.style.display = 'block');
            _._mask && (_._mask.style.display = 'block');

            E.fire(_.evt.show,_);

            return _;
        },
        hide:function(){
            var _ = this;
            _._pop && (_._pop.style.display = 'none');
            _._mask && (_._mask.style.display = 'none');

            return _;
        },
        destroy:function(soft){
            var _ = this;
            _.srcNode ? D.rc(_.srcNode,_.prefixCls+'alone_pop')
                : (_._pop && _._pop.parentNode.removeChild(_._pop));
            _._close && _._close.parentNode.removeChild(_._close);

            if(!soft){
                _._mask && _._mask.parentNode.removeChild(_._mask);
                _._style && _._style.parentNode.removeChild(_._style);
                _cache.mask = _cache.style = _._mask = _._style = null;
            }

            _._rendered = false;

            return _;
        },
        on:function(evt,fn){
            if(!U.isS(evt) || !U.isF(fn)) return this;

            var _ = this,
                evt = evt.toLowerCase();
            _.evt[evt] && _.evt[evt].push(fn);

            return _;
        }
    };

    U.isO(win.Alone) ? win.Alone.Pop = Pop: win.Alone = {'Pop':Pop};
})(document,document.documentElement,window);
