# antd中设置header颜色

查看源码header的background颜色被写死为‘001529’

但是在antd中 header的color可以通过headerBg这个token获取或者更改。

```jsx
import { theme } from 'antd';
  const {
        token: { colorBgContainer },
    } = theme.useToken();
	<ConfigProvider
        theme={{
               components: {
               Layout: {
               headerBg: colorBgContainer
              },
        },
        }}>
       </ConfigProvider>

```

但奇怪这种更改在dark mode下不生效，导致header显示为light mode的颜色。

这是需要定义css时候将header的background-color设置成inherit能自动继承颜色。

```

 import { createStyles, ThemeProvider } from 'antd-style';
 const useStyles = createStyles(({ token, css }) => ({
    header: css`
        background-color: inherit
   `
}));
 const { styles, cx, } = useStyles();
  <Header className={styles.header}>....</Header>

```

这样能够完美解决header的颜色问题。

### 如果单独使用颜色继承的话，在page刷新的时候会显示底色。

所以此处既需要修改token，又需要继承父组件的颜色。
基本解决目前的需求