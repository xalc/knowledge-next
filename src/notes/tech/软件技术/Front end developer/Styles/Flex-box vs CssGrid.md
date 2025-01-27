# Flex-box vs CssGrid

Flexbox(one-dimensional layout system)

```scss
.container {
	display: flex;
	flex-direction: row | column;

	.item {
		justify-contnet: flex-start| flex-end | center | space-betweent | space-around;
		align-self: flex-start | flex-end | center | stretch
	}
}
```

CssGrid(a two-dimensional way)

```scss
.container {
	display: grid;
	grid-template-columns: 60px 60px;
	grid-template-rows: auto;
	.item {
		justify-self: start | end | center | stretch
	}

}
```

Shared properties for flex box and css grid

- justify-content
- align-content
- align-self
- align-items
- 

CSS Grid is for layout; Flex box is for alignment

## When to use flex-box

small design, align first,  content-first design

## When to use css grid

complex design/ has GAP between block / overlap element/ layout-first

---

> [https://blog.logrocket.com/css-flexbox-vs-css-grid/](https://blog.logrocket.com/css-flexbox-vs-css-grid/)
> 

## Conclusion

flex-box是一维的。只需要行或者列，更多应用于对内容的对齐

css grid是二维的 限定更多， 必须包含行和列， 因此也更加适用于复杂布局，比如对已有设计文档的翻译