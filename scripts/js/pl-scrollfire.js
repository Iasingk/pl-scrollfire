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
 * Created by developergoplek on 23/01/18.
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
            if (elem.classList)
                elem.classList.add(className);
            else if (!Classie.hasClass(elem, className))
                elem.className += " " + className;
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
            if (elem.classList)
                elem.classList.remove(className);
            else
                elem.className = elem.className.replace(new RegExp("\\b" + className + "\\b", "g"), '');
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
         * @param {HTMLElement|NodeList} items
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
            this.items = items;
            this.settings = pl.Util.extendsDefaults({
                method: 'markerOver',
                markerPercentage: 55
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
            var method = "is" + pl.Util.capitalizeText(this.settings['method']);
            try {
                for (i = 0; item = this.items[i], i < length; i++) {
                    if (this[method].call(this, item)) {
                        pl.Classie.addClass(item, 'inview');
                        this.onInview(item);
                    }
                    else {
                        pl.Classie.removeClass(item, 'inview');
                    }
                }
            }
            catch (e) {
                throw this.settings['method'] + " method does not exist.";
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
        Object.defineProperty(ScrollFire.prototype, "items", {
            /**
             * Get items field.
             * @returns {HTMLElement|NodeList}
             */
            get: function () {
                return this._items;
            },
            /**
             * Set items field.
             * @param {HTMLElement|NodeList} items
             */
            set: function (items) {
                this._items = items;
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
