# Install
Just load the plugin.min.js file into your website. Then you mark up the elements you want to drift when a specific point is reached via some easy to understand data- attributes.


## Requirements
- funkyJS2 (../../builds/), the example uses the browser bundle which includes all modules of funkyJS2
- funkyJS2.Ext (../../builds/), the example uses the browser bundle which includes all extensions for funkyJS2
- [Waypoints](http://imakewebthings.com/waypoints/), example uses the noframework variant

If you do not want to use the whole funkyJS2 bundle, you can also use just the needed files from the /builds/amd-cjs/ folder. In this case you either have to
include multiple JS files into your webpage or find yourself a way to combine
them together. Anyway, here are the files in correct order:

- /builds/amd-cjs/birds.js
- /builds/amd-cjs/type.js
- /builds/amd-cjs/arity.js
- /builds/amd-cjs/

You also have to provide the funkyJS namespace yourself before you load any of the files. Don't panic, this can be done quite simple:

`
<script>
    window.funkyJS = {};
</script>
`

In either way you will have now access to some or all of the utilities funkyJS2 offers. Make sure to give them a try!


## Collection of data- attributes

#### data-drift="ltr|rtl|ttb|btt"
Marks a element as driftable element, which drifts as soon as the top of the window touches the top edge of the element. A driftable element can drift in either of four directions:
- Left to right (ltr)
- Right to left (rtl)
- Top to bottom (ttb)
- Bottom to top (btt)

#### data-drift-speed="0|0.1|0.2|..."
Defines the speed at which a driftable moves in seconds. A speed of zero makes the element jump instant to it's end position. The default is 400 Milliseconds.

#### data-drift-offset="NUMBER_OF_PIXELS"
The offset parameter virtually moves the top edge of the element up, so it's drift is triggered the given amount of pixels before it's top edge touches the top edge of the window.

#### data-drift-fxafter="FX_NAME"

