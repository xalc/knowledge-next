# Echart react组件

`echarts-for-react` : 下载量最高的echarts封装 周下载量约260 000。 但是近三年没有更新了。简单使用了下，发现在该库在响应事件处理时，会重新绘制和渲染，导致的行为就是在处理事件的时候，画布会闪烁一下， 详见参考文档（截个视频）
[https://git.hust.cc/echarts-for-react/examples/event](https://git.hust.cc/echarts-for-react/examples/event)

而在该库的内部实现中是为了解绑事件，先dispose然后重新初始化了整个画布。

解决办法为把echart的instance直接暴露出来直接绑定事件。

### Ref

React的class component 可以直接传递ref
但是function component不可以传递ref 只能forward ref

感觉是和this机制有关系， 要不要深入调查？？？

在npm中能够搜索的echart封装常用的有两个：

[https://www.npmjs.com/package/@kbox-labs/react-echarts](https://www.npmjs.com/package/@kbox-labs/react-echarts) 数据量约为周下载2000多次