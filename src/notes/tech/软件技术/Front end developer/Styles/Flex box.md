# Flex box

### For flex container

**`display**:` flex | inline-flex

**`flex-direction:` row | row-reverse | column | column-reverse;**

**`flex-wrap**:` nowrap | wrap | wrap-reverse;

**`flex-flow`**(combine `flex-direction` and `flex-wrap`) 

**`justify-content:`** flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left | right ... + safe | unsafe;

**`align-items:`**

**`align-content:`(use for multiple line  )**

**`gap`**

**`row-gap`** 

**`column-gap`**

### Flex items

order:

flex:

`align-self` one element for `align-itme`

`flex-grow` how much of the flex container's remaining space should be assigned to the flex item's [main size](https://www.w3.org/TR/css-flexbox/#main-size) 

`flex-shrink`  `flex-basic`

### inline-flex vs flex

> `display: inline-flex` does not make *flex items* display inline.
 It makes the *flex container* display inline.
> 

### Summary

假设 `flex-direction: row` `flex-warp: wrap`

`justify-content`用于行内元素之间对齐方式

`align-items` 用于元素本身对应行内（垂直）位置

`aligin-content` 用于多行情况下每行的对其方式

### flex item

`flex-grow` 用于确定item额外空间的分配方式

`flex-shrink` 用于container空间不够时 对各item如何压缩

`flex-basic` 基础item大小(不含额外空间)

- `flex-grow: 1`：该子项会占据剩余的可用空间。
- `flex-shrink: 1`：如果容器宽度不足，该子项可以缩小。
- `flex-basis: 0`：初始宽度为 0，完全根据可用空间进行扩展。