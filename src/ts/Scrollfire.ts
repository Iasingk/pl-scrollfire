/**
 * Created by cesarmejia on 26/10/2017.
 */
module pl {

    export class ScrollFire {

        // region Fields

        /**
         * @type {boolean}
         */
        private isScrolling: boolean = false;

        /**
         * @type {function}
         */
        private method: () => {};

        /**
         * @type {Object}
         */
        private settings: object;

        // endregion

        /**
         * Create a Scroll Fire instance.
         * @param {HTMLElement|HTMLCollection|Node|NodeList} elements
         * @param {Object} settings
         */
        constructor(elements: any, settings: Object) {
            this.settings = Util.extendsDefaults({
                method: 'markerOver',
                markerPercentage: 55,
                rangeMin: 10,
                rangeMax: 90
            }, settings);

            this.method = this[`is${ Util.capitalizeText(this.settings['method']) }`];

            // Avoid create the instance if elements does not match with the allowed types.
            if (!this.isAllowedType(elements)) { throw 'Make sure that elements you\'re passing HTMLElement, HTMLCollection, Node or NodeList'; }

            // Avoid create the instance if the method does not exists.
            if ("function" !== typeof this.method) { throw `Method ${this.settings.method} does not exist`; }

            this._elements = elements;
            this.initEvents();
        }

        // region Private Methods

        /**
         * Initialize scroll fire elements.
         */
        private initEvents() {
            this.scrolling      = this.scrolling.bind(this);
            this.throttleScroll = this.throttleScroll.bind(this);

            // document.addEventListener("DOMContentLoaded", this.scrolling, false);
            window.addEventListener('load', this.scrolling, false);
            window.addEventListener("scroll", this.throttleScroll, false);
            window.addEventListener("resize", this.throttleScroll, false);
        }

        /**
         * Handle on inview event.
         * @param {HTMLElement} element
         */
        private onInview(element: HTMLElement) {
            if (this.inview) {
                this.inview.fire(element);
            }
        }

        /**
         * Validate if an element is inview.
         * @param {Event} ev
         */
        private scrolling(ev) {
            let elements: any = "length" in this.elements ? this.elements : [this.elements];
            let i = 0, length = elements.length;

            for (; i < length; i++) {
                if (this.method.call(this, elements[i])) {
                    Classie.addClass(elements[i], 'inview');
                    this.onInview(elements[i]);

                } else {
                    Classie.removeClass(elements[i], 'inview');

                }
            }

        }

        /**
         * Enhance scroll.
         * @param {Event} ev
         */
        private throttleScroll(ev?) {
            let reqAnimFrame = this.reqAnimFrame;

            if (this.isScrolling === false) {
                reqAnimFrame(() => {
                    this.scrolling(ev);
                    this.isScrolling = false;
                });
            }

            this.isScrolling = true;
        }

        /**
         * Validate the type of instance of the element.
         * @param {HTMLElement, HTMLCollection, Node, Node} element
         * @returns {boolean}
         */
        private isAllowedType(element: any) {
            let allowedTypes = [HTMLElement, HTMLCollection, Node, NodeList];
            let i = 0;

            for (; i < allowedTypes.length; i++) {
                if (element instanceof allowedTypes[i]) {
                    return true;
                }
            }

            return false;
        }

        // endregion

        // region Events

        /**
         * @type {pl.PLEvent}
         */
        private _inview: PLEvent = null;

        /**
         * Gets inview event.
         * @returns {pl.PLEvent}
         */
        get inview(): PLEvent {
            if (!this._inview) {
                this._inview = new PLEvent();
            }

            return this._inview;
        }

        // endregion

        // region Methods

        /**
         * Determine if element is fully visible.
         * @param {HTMLElement|Node} element
         * @returns {boolean}
         */
        isFullyVisible(element: HTMLElement): boolean {
            let rect = element.getBoundingClientRect();
            let top = rect.top,
                bottom = rect.bottom;

            return ((top >= 0) && (bottom <= window.innerHeight));
        }

        /**
         * Determine if element is in range.
         * @param {HTMLElement|Node} element
         * @returns {boolean}
         */
        isInRange(element: HTMLElement): boolean {
            let rangeMin: number = window.innerHeight * (this.settings['rangeMin'] / 100);
            let rangeMax: number = window.innerHeight * (this.settings['rangeMax'] / 100);
            let rect = element.getBoundingClientRect();

            return rect.top <= rangeMax && rect.bottom >= rangeMin;
        }

        /**
         * Determine if element is under the marker.
         * @param {HTMLElement|Node} element
         * @returns {boolean}
         */
        isMarkerOver(element: HTMLElement): boolean {
            let percent: number = (this.settings['markerPercentage'] / 100);
            let rect = element.getBoundingClientRect();
            let top = rect.top,
                height = rect.height,
                marker = window.innerHeight * percent;

            return marker > top && (top + height) > marker;
        }

        /**
         * Determine if element is partially visible.
         * @param {HTMLElement|Node} element
         * @returns boolean
         */
        isPartiallyVisible(element: HTMLElement): boolean {
            let rect = element.getBoundingClientRect();
            let top    = rect.top,
                bottom = rect.bottom,
                height = rect.height;

            return ((top + height >= 0) && (height + window.innerHeight >= bottom));
        }

        // endregion

        // region Fields

        /**
         * Elements field.
         * @type {HTMLElement|HTMLCollection|Node|NodeList}
         */
        private _elements: any = null;

        /**
         * Get elements field.
         * @returns {HTMLElement|HTMLCollection|Node|NodeList}
         */
        get elements(): any {
            return this._elements;
        }

        /**
         * requestAnimationFrame field.
         * @type {any}
         */
        private _reqAnimFrame: any;

        /**
         * Get requestAnimationFrame field.
         * @returns {any}
         */
        get reqAnimFrame(): any {
            if (!this._reqAnimFrame) {
                this._reqAnimFrame = window['requestAnimationFrame']
                    || window['webkitRequestAnimationFrame']
                    || window['mozRequestAnimationFrame']
                    || function( callback ){ setTimeout(callback, 1000 / 60); };
            }

            return this._reqAnimFrame;
        }

        // endregion

    }

}