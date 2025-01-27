# React context

```jsx
import { createContext } from 'react';
const SomeContext = createContext({
	mode: 'light',
	setMode: () => {}
});

export default SomeContext;
```

## Provider

```jsx

const initValue = {
	...
}
<SomeContext.Provider value={initValuie}>
	
</SomeContext.Provider>
```

## Consumer

```jsx
import { useContext } from 'react'
import { SomeContext }  from './SomeContext';
const 
```