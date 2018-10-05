PL Scrollfire
==============
Notify when an element is fully or partially inview also if has a marker over it or is in a range defined by the user.

### Usage
```javascript
let element = document.querySelector('.block');
let settings = {
    method: 'markerOver',
    markerPercentage: 55,
    rangeMin: 10,
    rangeMax: 90
};

let scrollFire = new pl.ScrollFire(element, settings);
```

Use `settings` to personalize the scrollFire instance.

<table>
    <tr>
        <th>Value</th>
        <th>Type</th>
        <th>Default Value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>method</td>
        <td><code>string</code></td>
        <td><code>"markerOver"</code></td>
        <td>Method that will notify when the element meets the conditions. The method could be <code>fullyVisible</code> <code>inRange</code> <code>markerOver</code> or <code>partiallyVisible</code></td>
    </tr>
    <tr>
        <td>closeWithOverlay</td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Allows close the modal by clicking the overlay.</td>
    </tr>
    <tr>
        <td>effectName</td>
        <td><code>string</code></td>
        <td>(empty)</td>
        <td>Allows the user select a predeterminated effect to open the modal.</td>
    </tr>
</table>

To notify when an element meets with some method, ScrollFire has an event called inview and you could attach handlers as many as you wish.

```javascript
// Notify when element meets with some method.
scrollFire.inview.add((element) => { /* ... */ });
```

### Events
<table>
    <tr>
        <th>Name</th>
        <th>Return value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>inview</code></td>
        <td><code>pl.Event</code></td>
        <td>Get inview event.</td>
    </tr>
</table>

### Methods
<table>
    <tr>
        <th>Name</th>
        <th>Return value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>isFullyVisible(element: HTMLElement|Node)</code></td>
        <td><code>boolean</code></td>
        <td>Validate if element is fully visible.</td>
    </tr>
    <tr>
        <td><code>isInRange(element: HTMLElement|Node)</code></td>
        <td><code>boolean</code></td>
        <td>Validate if element is in range.</td>
    </tr>
    <tr>
        <td><code>isMarkerOver(element: HTMLElement|Node)</code></td>
        <td><code>boolean</code></td>
        <td>Validate maker is over element.</td>
    </tr>
    <tr>
        <td><code>isPartiallyVisible(element: HTMLElement|Node)</code></td>
        <td><code>boolean</code></td>
        <td>Validate if element is partiallyVisible.</td>
    </tr>
</table>

### Getters
You can access to the elements with the scrollfire instance was created and the requestAnimationFrame with the follow getters:

<table>
    <tr>
        <th>Name</th>
        <th>Return value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>elements</code></td>
        <td><code>HTMLElement|HTMLCollection|Node|NodeList</code></td>
        <td>Gets the elements.</td>
    </tr>
    <tr>
        <td><code>reqAnimFrame</code></td>
        <td><code>any</code></td>
        <td>Gets requestAnimationFrame or a function.</td>
    </tr>
</table>

### Browser Support
