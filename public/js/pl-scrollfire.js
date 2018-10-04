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
         * @param {HTMLElement|HTMLCollection|Node|NodeList} elements
         * @param {Object} settings
         */
        function ScrollFire(elements, settings) {
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
             * Elements field.
             * @type {HTMLElement|HTMLCollection|Node|NodeList}
             */
            this._elements = null;
            // Avoid create the instance if elements does not match with the allowed types.
            if (!this.isAllowedType(elements)) {
                throw 'Make sure that elements you\'re passing HTMLElement, HTMLCollection, Node or NodeList';
            }
            this._elements = elements;
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
         * @param {HTMLElement} element
         */
        ScrollFire.prototype.onInview = function (element) {
            if (this.inview) {
                this.inview.fire(element);
            }
        };
        /**
         * Validate if an element is inview.
         * @param {Event} ev
         */
        ScrollFire.prototype.scrolling = function (ev) {
            var i, element;
            var length = this.elements.length;
            var methodName = "is" + pl.Util.capitalizeText(this.settings['method']);
            var method = this[methodName];
            if ("undefined" === typeof method) {
                throw methodName + " does not exist";
            }
            else {
                for (i = 0; element = this.elements[i], i < length; i++) {
                    if (method.call(this, element)) {
                        pl.Classie.addClass(element, 'inview');
                        this.onInview(element);
                    }
                    else {
                        pl.Classie.removeClass(element, 'inview');
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
        /**
         * Validate the type of instance of the element.
         * @param {HTMLElement, HTMLCollection, Node, Node} element
         * @returns {boolean}
         */
        ScrollFire.prototype.isAllowedType = function (element) {
            var allowedTypes = [HTMLElement, HTMLCollection, Node, NodeList];
            var i = 0;
            for (; i < allowedTypes.length; i++) {
                if (element instanceof allowedTypes[i]) {
                    return true;
                }
            }
            return false;
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
         * Determine if element is fully visible.
         * @param {HTMLElement|Node} element
         * @returns {boolean}
         */
        ScrollFire.prototype.isFullyVisible = function (element) {
            var rect = element.getBoundingClientRect();
            var top = rect.top, bottom = rect.bottom;
            return ((top >= 0) && (bottom <= window.innerHeight));
        };
        /**
         * Determine if element is in range.
         * @param {HTMLElement|Node} element
         * @returns {boolean}
         */
        ScrollFire.prototype.isInRange = function (element) {
            var rangeMin = window.innerHeight * (this.settings['rangeMin'] / 100);
            var rangeMax = window.innerHeight * (this.settings['rangeMax'] / 100);
            var rect = element.getBoundingClientRect();
            return rect.top <= rangeMax && rect.bottom >= rangeMin;
        };
        /**
         * Determine if element is under the marker.
         * @param {HTMLElement|Node} element
         * @returns {boolean}
         */
        ScrollFire.prototype.isMarkerOver = function (element) {
            var percent = (this.settings['markerPercentage'] / 100);
            var rect = element.getBoundingClientRect();
            var top = rect.top, height = rect.height, marker = window.innerHeight * percent;
            return marker > top && (top + height) > marker;
        };
        /**
         * Determine if element is partially visible.
         * @param {HTMLElement|Node} element
         * @returns boolean
         */
        ScrollFire.prototype.isPartiallyVisible = function (element) {
            var rect = element.getBoundingClientRect();
            var top = rect.top, bottom = rect.bottom, height = rect.height;
            return ((top + height >= 0) && (height + window.innerHeight >= bottom));
        };
        Object.defineProperty(ScrollFire.prototype, "elements", {
            /**
             * Get elements field.
             * @returns {HTMLElement|HTMLCollection|Node|NodeList}
             */
            get: function () {
                return this._elements;
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
