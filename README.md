# markflat.showdown
[showdown.js](https://github.com/showdownjs/showdown) extension for rendering markflat flavored markdown

## install
```sh
npm install takb/markflat.showdown
```

## use 
```javascript
const showdown = require('showdown');
require('markflat.showdown');

var converter = new showdown.Converter({ extensions: ['markflat'] });
converter.makeHtml("# Title - Artist\n1. first verse {F} lyrics\n~Chorus {a7}lyrics of {C}chorus")
/* output: 
<h1 id="titlespanclassmbartistartistspan">
  Title<span class="mb-artist"> - Artist</span>
</h1>
<ol>
  <li class="mb-has-chords">
    first verse <span class="mb-ca"><span class="mb-chord">F</span>&nbsp;&nbsp;&nbsp;</span>lyrics
  </li>
</ol>
<ul>
  <li class="mb-has-chords" list="Chorus">
    <span class="mb-ca"><span class="mb-chord">a<sup>7</sup></span>l</span>yrics of <span class="mb-ca"><span class="mb-chord">C</span>c</span>horus
  </li>
</ul>
*/
```
## options 
- **mbZoom** (default: `100`)  
Zoom factor in %. If mbEnableZoom is set to true, prepends CSS style tag with `font-size: [mbZoom]%;` to converted html.
- **mbEnableZoom** (default: `false`)
- **mbTransposeBy** (default: `0`)  
Number of transpose steps (-12 - +12). Requires mbTranspose to be a function that relies on this value.
- **mbTranspose**  
Function to transpose the key of all chords in the document. Set only if you need to custmize the transposition function.
- **mbAddMinorChordMarker** (default: `false`)  
If `true`, adds charcter 'm' to minor chords ('a7' => 'am7').
- **mbAddStyle** (default: `false`)  
If `true`, prepends CSS style tag with styling form mbStyle to converted html.
- **mbStyle**  
The CSS style string. Change to customize how converted HTML is rendered.  

Example:
```javascript
var converter = new showdown.Converter({ 
  extensions: ['markflat'],
  mbEnableZoom: true,
  mbAddStyle: true
});
```
