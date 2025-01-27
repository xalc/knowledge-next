# Form submit

当然有足够优秀的组件库帮你处理这一切，比如说 `react-hook-form` 配合 `zod` 进行校验，错误处理， 甚至headless的 `[Form](https://ui.shadcn.com/docs/components/form)`  组件。 在熟练使用后 让这一切变得简单起来了。

但记录一个小技巧，当手动处理表单的多个 `Input` 时：

```jsx
const handleChange = (e) =>
    setUser((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  // Render UI
  return (
    <div className="App">
      <form>
        <input
          type="text"
          onChange={handleChange}
          name="firstName"
          placeholder="First Name"
        />
        <input
          type="text"
          onChange={handleChange}
          name="lastName"
          placeholder="Last Name"
        />
      </form>
    </div>
  );
```

在处理 `onChange` 事件时 可以通过 `e.target.name` 获取Input的name， 从而简化事件处理。