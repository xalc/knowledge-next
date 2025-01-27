# React Ref

## useRef vs createRef

> the `useRef` hook holds its value between re-renders in a function component
> 

> `createRef` is used to create a ref and a new ref is created during each render.
> 

`useRef` is using for function component can accept an initial value

`createRef` using for old class component can NOT accept the initial value

## forwardRef

control the child by forward its ref to parent

```jsx
const Parent = () => {
	const pRef = React.useRef();
  //Example
  useEffect(() => {
		pRef.current.focus()
	})
	return <Child ref={pRef} />
}
const Child = React.forwardRef((props, ref) => {
	return <input ref={ref} />
});
```

## **useImperativeHandle**

control child behavior via its ref

```jsx
const Parent = () => {
	const pRef = React.useRef();

  useEffect(() => {
		pRef.current.myFocus()
	})
	return <Child ref={pRef} />
}
const Child = React.forwardRef((props, ref) => {
  const inputRef = React.useRef();
	useImperativeHandle(ref, () => {
		return {
				myFocus: () => {
						inputRef.current.focus();
						// or sth else
			}
		}
	})

	return <input ref={inputRef} />
});
```