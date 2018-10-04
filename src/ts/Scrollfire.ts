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
         * @type {Object}
         */
        private settings: object;

        // endregion

        /**
         * Create a Scroll Fire instance.
         * @param {HTMLElement|HTMLCollection|Node|NodeList} items
         * @param {Object} settings
         */
        constructor(items: any, settings: Object) {
            this._items = [];

            if (items instanceof HTMLElement || items instanceof Node) {
                this._items = [items];
            } else if (items instanceof HTMLCollection || items instanceof NodeList) {
                this._items = items;
            } else {
                throw 'The type of the items are invalid. Make sure that you\'re passing HTMLElement, HTMLCollection, Node or NodeList';
            }

            this.settings = Util.extendsDefaults({
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
         * @param {HTMLElement} item
         */
        private onInview(item: HTMLElement) {
            if (this.inview) {
                this.inview.fire(item);
            }
        }

        /**
         * Validate if an item is inview.
         * @param {Event} ev
         */
        private scrolling(ev) {
            let i, item;
            let length: number = this.items.length;
            let methodName: string = `is${ Util.capitalizeText(this.settings['method']) }`;
            let method = this[methodName];

            if ("undefined" === typeof method) {
                throw `${methodName} does not exist`;
            } else {
                for (i = 0; item = this.items[i], i < length; i++) {
                    if (method.call(this, item)) {
                        Classie.addClass(item, 'inview');
                        this.onInview(item);

                    } else {
                        Classie.removeClass(item, 'inview');

                    }
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
         * Determine if item is partially visible.
         * @param {HTMLElement} item
         * @returns boolean
         */
        isPartiallyVisible(item: HTMLElement): boolean {
            let rect = item.getBoundingClientRect();
            let top    = rect.top,
                bottom = rect.bottom,
                height = rect.height;

            return ((top + height >= 0) && (height + window.innerHeight >= bottom));
        }

        /**
         * Determine if item is fully visible.
         * @param {HTMLElement} item
         * @returns {boolean}
         */
        isFullyVisible(item: HTMLElement): boolean {
            let rect = item.getBoundingClientRect();
            let top = rect.top,
                bottom = rect.bottom;

            return ((top >= 0) && (bottom <= window.innerHeight));
        }

        /**
         * Determine if item is under the marker.
         * @param {HTMLElement} item
         * @returns {boolean}
         */
        isMarkerOver(item: HTMLElement): boolean {
            let percent: number = (this.settings['markerPercentage'] / 100);
            let rect = item.getBoundingClientRect();
            let top = rect.top,
                height = rect.height,
                marker = window.innerHeight * percent;

            return marker > top && (top + height) > marker;
        }

        /**
         * Determine if item is in range.
         * @param {HTMLElement} item
         * @returns {boolean}
         */
        isInRange(item: HTMLElement): boolean {
            let rangeMin: number = window.innerHeight * (this.settings['rangeMin'] / 100);
            let rangeMax: number = window.innerHeight * (this.settings['rangeMax'] / 100);
            let rect = item.getBoundingClientRect();

            return rect.top <= rangeMax && rect.bottom >= rangeMin;
        }

        // endregion

        // region Fields

        /**
         * Items field.
         * @type {HTMLElement|NodeList}
         */
        private _items: any = null;

        /**
         * Get items field.
         * @returns {HTMLElement|NodeList}
         */
        get items(): any {
            return this._items;
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