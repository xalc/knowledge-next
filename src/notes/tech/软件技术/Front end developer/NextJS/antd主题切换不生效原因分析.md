# antd主题切换不生效原因分析

根据 `antd-style` [https://ant-design.github.io/antd-style/zh-CN/api/use-theme-mode](https://ant-design.github.io/antd-style/zh-CN/api/use-theme-mode) 提供的方式进行主题切换。

1. 要注意全局样式中只能指定 `defaultThemeMode` 如果直接指定 `themeMode`  那么 `setThemeMode` 方法不生效。
2. 如果在子组件中设置了自定义Theme，即 子组件包裹了 `ThemeProvider` ，那么子组件的Them不会随着切换。 需要手动切换。

比如说简单提供一个 `switch`  进行全局主题的切换

```jsx
	const { isDarkMode, setThemeMode } = useThemeMode();

	const onChange = (checked) => {
		if (checked) {
			setThemeMode('light')
		} else {
			setThemeMode('dark')
		}
	}

<Switch defaultChecked={!isDarkMode} onChange={onChange} checkedChildren='暗色' unCheckedChildren='亮色' />
```

在子组件中 需要判断全局组件的Theme主题，在指定到 `ThemeMode` 参数中 这样和全局主题保持一致

```jsx
const { isDarkMode } = useThemeMode();

  <ThemeProvider
      themeMode={isDarkMode ? 'dark' : 'light'}
      theme={{
        token: {
          fontSize: 16,
          lineHeight: 1.75
        },
      }}>
      <div className={styles.container}>
        {children}
      </div>
    </ThemeProvider>
```