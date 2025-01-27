# MDX解析

在 Next.js 中，`remarkPlugins` 和 `rehypePlugins` 都用于处理 Markdown 或 MDX 内容，但它们作用于不同的处理阶段和抽象层级。简单来说：

- **`remarkPlugins`：处理 Markdown 的抽象语法树（AST）。** 关注的是 Markdown 的 *逻辑结构* 和 *内容*，例如标题、段落、列表、代码块等。
- **`rehypePlugins`：处理 HTML 的 AST。** 关注的是 Markdown 转换成 HTML 后的 *呈现形式*，例如 HTML 标签、属性、样式等。

**1. 处理阶段**

Markdown 的处理通常包含以下几个阶段：

1. **解析 (Parsing)：** 将 Markdown 文本解析成抽象语法树 (AST)。
2. **转换 (Transforming)：** 对 AST 进行各种操作，例如添加、删除、修改节点。
3. **序列化 (Serializing)：** 将 AST 转换成最终的输出格式，例如 HTML。
- `remarkPlugins` 作用于 **转换阶段** 的 Markdown AST。
- `rehypePlugins` 作用于 **转换阶段** 的 HTML AST（即 Markdown 转换成 HTML 之后）。