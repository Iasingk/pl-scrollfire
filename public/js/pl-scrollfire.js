/**
 * Created by cesarmejia on 20/08/2017.
 */
var pl;
(function (pl) {
    var PLEvent = /** @class */ (function () {
        // endregion
        /**
         * Create a PLEvent instance.
         * @constructor
         */
        function PLEvent() {
            this._handlers = [];
            this._scope = this || window;
        }
        // region Methods
        /**
         * Add new handler.
         * @param {function} handler
         */
        PLEvent.prototype.add = function (handler) {
            if (handler) {
                this._handlers.push(handler);
            }
        };
        /**
         * Excecute all suscribed handlers.
         */
        PLEvent.prototype.fire = function () {
            var _this = this;
            var args = arguments;
            this._handlers.forEach(function (handler) {
                handler.apply(_this._scope, args);
            });
        };
        /**
         * Remove handler from handlers.
         * @param {function} handler
         */
        PLEvent.prototype.remove = function (handler) {
            this._handlers = this._handlers.filter(function (fn) {
                if (fn != handler)
                    return fn;
            });
        };
        return PLEvent;
    }());
    pl.PLEvent = PLEvent;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 07/02/2018.
 */
(function (pl) {
    var Classie = /** @class */ (function () {
        function Classie() {
        }
        /**
         * Adds the specified class to an element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.addClass = function (elem, className) {
            var parts = className.split(" "), i = 0;
            if (elem.classList) {
                for (; i < parts.length; i++) {
                    elem.classList.add(parts[i]);
                }
            }
            else if (!Classie.hasClass(elem, className)) {
                for (; i < parts.length; i++) {
                    elem.className += " " + parts[i];
                }
            }
        };
        /**
         * Determine whether any of the matched elements are assigned the given class.
         * @param {HTMLElement} elem
         * @param {string} className
         * @returns {boolean}
         */
        Classie.hasClass = function (elem, className) {
            return elem.classList
                ? elem.classList.contains(className)
                : new RegExp("\\b" + className + "\\b").test(elem.className);
        };
        /**
         * Remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.removeClass = function (elem, className) {
            var parts = className.split(" "), i = 0;
            if (elem.classList) {
                for (; i < parts.length; i++) {
                    elem.classList.remove(parts[i]);
                }
            }
            else {
                for (; i < parts.length; i++) {
                    elem.className = elem.className.replace(new RegExp("\\b" + parts[i] + "\\b", "g"), '');
                }
            }
        };
        /**
         * Remove all classes in element.
         * @param {HTMLElement} elem
         */
        Classie.reset = function (elem) {
            elem.className = '';
        };
        /**
         * Add or remove class from element.
         * @param {HTMLElement} elem
         * @param {string} className
         */
        Classie.toggleClass = function (elem, className) {
            if (elem.classList)
                elem.classList.toggle(className);
            else
                Classie.hasClass(elem, className)
                    ? Classie.removeClass(elem, className)
                    : Classie.addClass(elem, className);
        };
        return Classie;
    }());
    pl.Classie = Classie;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 22/10/2017.
 */
(function (pl) {
    var Util = /** @class */ (function () {
        function Util() {
        }
        /**
         * Capitalize text.
         * @param {string} text
         * @returns {string}
         */
        Util.capitalizeText = function (text) {
            return text.replace(/\w/, function (l) { return l.toUpperCase(); });
        };
        /**
         * Merge objects and create a new one.
         * @param {Array<Object>} objects
         * @return {Object}
         */
        Util.extendsDefaults = function () {
            var objects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objects[_i] = arguments[_i];
            }
            var result = {}, i;
            for (i = 0; i < objects.length; i++) {
                (function (currentObj) {
                    var prop;
                    for (prop in currentObj) {
                        if (currentObj.hasOwnProperty(prop)) {
                            result[prop] = currentObj[prop];
                        }
                    }
                })(objects[i]);
            }
            return result;
        };
        return Util;
    }());
    pl.Util = Util;
})(pl || (pl = {}));
/**
 * Created by cesarmejia on 26/10/2017.
 */
(function (pl) {
    var ScrollFire = /** @class */ (function () {
        // endregion
        /**
         * Create a Scroll Fire instance.
         * @param {HTMLElement|HTMLCollection|Node|NodeList} items
         * @param {Object} settings
         */
        function ScrollFire(items, settings) {
            // region Fields
            /**
             * @type {boolean}
             */
            this.isScrolling = false;
            // endregion
            // region Events
            /**
             * @type {pl.PLEvent}
             */
            this._inview = null;
            // endregion
            // region Fields
            /**
             * Items field.
             * @type {HTMLElement|NodeList}
             */
            this._items = null;
            this._items = [];
            if (items instanceof HTMLElement || items instanceof Node) {
                this._items = [items];
            }
            else if (items instanceof HTMLCollection || items instanceof NodeList) {
                this._items = items;
            }
            else {
                throw 'The type of the items are invalid. Make sure that you\'re passing HTMLElement, HTMLCollection, Node or NodeList';
            }
            this.settings = pl.Util.extendsDefaults({
                method: 'markerOver',
                markerPercentage: 55,
                rangeMin: 10,
                rangeMax: 90
            }, settings);
            this.initEvents();
        }
        // region Private Methods
        /**
         * Initialize scroll fire elements.
         */
        ScrollFire.prototype.initEvents = function () {
            this.scrolling = this.scrolling.bind(this);
            this.throttleScroll = this.throttleScroll.bind(this);
            // document.addEventListener("DOMContentLoaded", this.scrolling, false);
            window.addEventListener('load', this.scrolling, false);
            window.addEventListener("scroll", this.throttleScroll, false);
            window.addEventListener("resize", this.throttleScroll, false);
        };
        /**
         * Handle on inview event.
         * @param {HTMLElement} item
         */
        ScrollFire.prototype.onInview = function (item) {
            if (this.inview) {
                this.inview.fire(item);
            }
        };
        /**
         * Validate if an item is inview.
         * @param {Event} ev
         */
        ScrollFire.prototype.scrolling = function (ev) {
            var i, item;
            var length = this.items.length;
            var methodName = "is" + pl.Util.capitalizeText(this.settings['method']);
            var method = this[methodName];
            if ("undefined" === typeof method) {
                throw methodName + " does not exist";
            }
            else {
                for (i = 0; item = this.items[i], i < length; i++) {
                    if (method.call(this, item)) {
                        pl.Classie.addClass(item, 'inview');
                        this.onInview(item);
                    }
                    else {
                        pl.Classie.removeClass(item, 'inview');
                    }
                }
            }
        };
        /**
         * Enhance scroll.
         * @param {Event} ev
         */
        ScrollFire.prototype.throttleScroll = function (ev) {
            var _this = this;
            var reqAnimFrame = this.reqAnimFrame;
            if (this.isScrolling === false) {
                reqAnimFrame(function () {
                    _this.scrolling(ev);
                    _this.isScrolling = false;
                });
            }
            this.isScrolling = true;
        };
        Object.defineProperty(ScrollFire.prototype, "inview", {
            /**
             * Gets inview event.
             * @returns {pl.PLEvent}
             */
            get: function () {
                if (!this._inview) {
                    this._inview = new pl.PLEvent();
                }
                return this._inview;
            },
            enumerable: true,
            configurable: true
        });
        // endregion
        // region Methods
        /**
         * Determine if item is partially visible.
         * @param {HTMLElement} item
         * @returns boolean
         */
        ScrollFire.prototype.isPartiallyVisible = function (item) {
            var rect = item.getBoundingClientRect();
            var top = rect.top, bottom = rect.bottom, height = rect.height;
            return ((top + height >= 0) && (height + window.innerHeight >= bottom));
        };
        /**
         * Determine if item is fully visible.
         * @param {HTMLElement} item
         * @returns {boolean}
         */
        ScrollFire.prototype.isFullyVisible = function (item) {
            var rect = item.getBoundingClientRect();
            var top = rect.top, bottom = rect.bottom;
            return ((top >= 0) && (bottom <= window.innerHeight));
        };
        /**
         * Determine if item is under the marker.
         * @param {HTMLElement} item
         * @returns {boolean}
         */
        ScrollFire.prototype.isMarkerOver = function (item) {
            var percent = (this.settings['markerPercentage'] / 100);
            var rect = item.getBoundingClientRect();
            var top = rect.top, height = rect.height, marker = window.innerHeight * percent;
            return marker > top && (top + height) > marker;
        };
        /**
         * Determine if item is in range.
         * @param {HTMLElement} item
         * @returns {boolean}
         */
        ScrollFire.prototype.isInRange = function (item) {
            var rangeMin = window.innerHeight * (this.settings['rangeMin'] / 100);
            var rangeMax = window.innerHeight * (this.settings['rangeMax'] / 100);
            var rect = item.getBoundingClientRect();
            return rect.top <= rangeMax && rect.bottom >= rangeMin;
        };
        Object.defineProperty(ScrollFire.prototype, "items", {
            /**
             * Get items field.
             * @returns {HTMLElement|NodeList}
             */
            get: function () {
                return this._items;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollFire.prototype, "reqAnimFrame", {
            /**
             * Get requestAnimationFrame field.
             * @returns {any}
             */
            get: function () {
                if (!this._reqAnimFrame) {
                    this._reqAnimFrame = window['requestAnimationFrame']
                        || window['webkitRequestAnimationFrame']
                        || window['mozRequestAnimationFrame']
                        || function (callback) { setTimeout(callback, 1000 / 60); };
                }
                return this._reqAnimFrame;
            },
            enumerable: true,
            configurable: true
        });
        return ScrollFire;
    }());
    pl.ScrollFire = ScrollFire;
})(pl || (pl = {}));
