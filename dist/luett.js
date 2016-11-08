(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.luett = factory());
}(this, (function () { 'use strict';

function toArray(iterable) {
    return [].slice.call(iterable);
}

function mapCall(list, action) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    return list.map(function (item) {
        return action.apply(undefined, [item].concat(args));
    });
}

var util = { toArray: toArray, mapCall: mapCall };

function $(selector) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    return el.querySelector(selector);
}

function $$(selector) {
    var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

    return toArray(el.querySelectorAll(selector));
}

function replace(el_old, el_new) {
    el_old.parentNode.replaceChild(el_new, el_old);
    return el_new;
}

function index(el) {
    var idx = 0;
    while (el = el.previousElementSibling) {
        idx++;
    }return idx;
}

function remove(el) {
    el.parentNode && el.parentNode.removeChild(el);
    return el;
}

function addClass(el, clazz) {
    el.classList.add(clazz);
    return el;
}

function toggleClass(el, clazz) {
    var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    el.classList.toggle(clazz, force);
    return el;
}

function removeClass(el, clazz) {
    el.classList.remove(clazz);
    return el;
}

function getAttr(el, name) {
    var _default = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

    return el && el.hasAttribute(name) ? el.getAttribute(name) : _default;
}

function setAttr(el, name, value) {
    var append = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var attrValue = append ? getAttr(el, name, "") + " " + value : value;
    el.setAttribute(name, attrValue);
    return el;
}

function hasAttr(el, name) {
    return el && el.hasAttribute(name);
}

function component(name, init) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    function parseConfig(el) {
        var confMatcher = new RegExp("data-(?:component|" + name + ")-([^-]+)", "i");
        var defaultConf = {};

        toArray(el.attributes).forEach(function (attr) {
            var match = confMatcher.exec(attr.name);

            if (confMatcher.test(attr.name)) {
                defaultConf[match[1]] = attr.value;
            }
        });

        try {
            var conf = JSON.parse(el.getAttribute("data-component-conf"));
            return Object.assign(defaultConf, conf);
        } catch (e) {
            return defaultConf;
        }
    }

    opts = opts instanceof HTMLElement ? { root: opts } : opts;

    return $$("[data-component~=\"" + name + "\"]", opts.root || document).filter(function (el) {
        return !el.hasAttribute("data-component-ready");
    }).map(function (el, index) {
        var def = el.getAttribute("data-component").split(" ");
        var conf = Object.assign({}, init.DEFAULTS || {}, opts.conf || {}, parseConfig(el));

        var options = {
            index: index, conf: conf,
            is_type: function is_type(type) {
                return def.indexOf(name + "-" + type) !== -1;
            }
        };

        var component = init(el, options);
        setAttr(el, "data-component-ready", name, true);
        return component;
    });
}

var dom = {
    $: $, $$: $$, component: component,
    replace: replace, index: index, remove: remove,
    addClass: addClass, toggleClass: toggleClass, removeClass: removeClass,
    getAttr: getAttr, setAttr: setAttr, hasAttr: hasAttr
};

function delay(time, value) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            return resolve(value);
        }, time);
    });
}

delay.pass = function (time) {
    return function (value) {
        return delay(time, value);
    };
};

var promise = { delay: delay };

var main = Object.assign(dom, promise, util);

return main;

})));
