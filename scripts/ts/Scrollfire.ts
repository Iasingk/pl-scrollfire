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
         * @type {any}
         */
        private items: any = null;

        // endregion

        /**
         * Create a Scroll Fire instance.
         * @param {any} items
         * @param {Object} settings
         */
        constructor(items: any, settings: Object) {
            this.items = items;

            this.scrolling      = this.scrolling.bind(this);
            this.throttleScroll = this.throttleScroll.bind(this);

            // document.addEventListener("DOMContentLoaded", this.scrolling, false);
            window.addEventListener('load', this.scrolling, false);
            window.addEventListener("scroll", this.throttleScroll, false);
            window.addEventListener("resize", this.throttleScroll, false);
        }

        // region Private Methods
        /**
         * Validate if an item is inview.
         * @param {Event} ev
         */
        private scrolling(ev) {
            let i, item, length = this.items.length;

            for (i = 0; item = this.items[i], i < length; i++) {
                if (this.isPartiallyVisible(item)) {
                    this.inview.fire();
                }
            }
        }

        /**
         * Enhance scroll.
         * @param {Event} ev
         */
        private throttleScroll(ev) {
            if (this.isScrolling === false) {
                this.reqAnimFrame(() => {
                    this.scrolling(ev);
                    this.isScrolling = false;
                });
            }

            this.isScrolling = true;
        }
        // endregion

        // region Events
        /**
         * @type {pl.Event}
         */
        private _inview: Event = null;

        /**
         * Gets inview event.
         * @returns {pl.Event}
         */
        get inview(): Event {
            if (!this._inview) {
                this._inview = new Event();
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
            let rect = item.getBoundingClientRect();
            let top = rect.top,
                height = rect.height,
                marker = window.innerHeight * .55;

            return marker > top && (top + height) > marker;
        }
        // endregion

        // region Fields
        /**
         * requestAnimationFrame property.
         * @type {any}
         */
        private _reqAnimFrame: any = null;

        /**
         * Get requestAnimationFrame property.
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