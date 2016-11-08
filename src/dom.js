import { toArray } from "./util";

export function $(selector, el = document) {
    return el.querySelector(selector);
}

export function $$(selector, el = document) {
    return toArray(el.querySelectorAll(selector));
}

export function id(name, el = document) {
    return el.getElementById(name);
}

export function replace(el_old, el_new) {
    el_old.parentNode.replaceChild(el_new, el_old);
    return el_new;
}

export function index(el) {
    let idx = 0;
    while(el = el.previousElementSibling) idx++;
    return idx;
}

export function remove(el) {
    el.parentNode && el.parentNode.removeChild(el);
    return el;
}

export function addClass(el, clazz) {
    el.classList.add(clazz);
    return el;
}

export function toggleClass(el, clazz, force = false) {
    el.classList.toggle(clazz, force);
    return el;
}

export function removeClass(el, clazz) {
    el.classList.remove(clazz);
    return el;
}

export function getAttr(el, name, _default = undefined) {
    return el && el.hasAttribute(name) ? el.getAttribute(name) : _default;
}

export function setAttr(el, name, value, append = false) {
    const attrValue = append ? getAttr(el, name, "") + " " + value : value;
    el.setAttribute(name, attrValue);
    return el;
}

export function hasAttr(el, name) {
    return el && el.hasAttribute(name);
}

export function component(name, init, opts = {}) {
    function parseConfig(el) {
        const confMatcher = new RegExp(`data-(?:component|${name})-([^-]+)`, "i");
        const defaultConf = {};

        toArray(el.attributes).forEach(attr => {
            const match = confMatcher.exec(attr.name);

            if(confMatcher.test(attr.name)) {
                defaultConf[match[1]] = attr.value;
            }
        });

        try {
            const conf = JSON.parse(el.getAttribute("data-component-conf"));
            return Object.assign(defaultConf, conf);
        } catch(e) {
            return defaultConf;
        }
    }

    opts = opts instanceof HTMLElement ? { root: opts } : opts;

    return $$(`[data-component~="${name}"]`, opts.root || document)
        .filter(el => !el.hasAttribute("data-component-ready"))
        .map((el, index) => {
            const def = el.getAttribute("data-component").split(" ");
            const conf = Object.assign({}, init.DEFAULTS || {}, opts.conf || {}, parseConfig(el));

            const options = {
                index, conf,
                is_type(type) {
                    return def.indexOf(`${name}-${type}`) !== -1;
                }
            };

            const component = init(el, options);
            setAttr(el, "data-component-ready", name, true);
            return component;
        });
}

export default {
    replace, index, remove,
    $, $$, id, component,
    addClass, toggleClass, removeClass,
    getAttr, setAttr, hasAttr
}
