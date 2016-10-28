## CHANGELOG
### 0.4.2
Use constructor in `Slider` to fix undefined props in IE10

### 0.4.1
Fix npm build

### 0.4.0
Refactored all code... again. Props are mostly the same, some new ones added. Future changes will be documented better.

### 0.3.0
**Breaking Changes**
Upgraded to React Motion 0.3.0

### 0.2.0
**Breaking Changes**
Refactored almost all code, somewhat similiar API, touch support and some other props were removed for now, will be back in soon

Slider now moves directly to new slides rather than running through everything in between

If using a custom component be sure to pass the `style` prop passed in to apply proper styles for moving slides around. Look in example folder for implementation.

### 0.1.0
**Breaking Changes**
`defaultSlide` prop is now `currentKey`, pass the slides key to navigate to it

exposed as the component `Slider` now instead of and an object
