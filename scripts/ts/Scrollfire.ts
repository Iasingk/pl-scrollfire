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
         * @param {HTMLElement|NodeList} items
         * @param {Object} settings
         */
        constructor(items: any, settings: Object) {
            this.items = items;

            this.settings = Util.extendsDefaults({
                method: 'markerOver',
                markerPercentage: 55
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
            let method: string = `is${ Util.capitalizeText(this.settings['method']) }`;

            try {
                for (i = 0; item = this.items[i], i < length; i++) {
                    if (this[method].call(this, item)) {
                        Classie.addClass(item, 'inview');
                        this.onInview(item);

                    } else {
                        Classie.removeClass(item, 'inview');

                    }
                }
            } catch (e) { throw `${ this.settings['method'] } method does not exist.`; }

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
         * Set items field.
         * @param {HTMLElement|NodeList} items
         */
        set items(items: any) {
            this._items = items;
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