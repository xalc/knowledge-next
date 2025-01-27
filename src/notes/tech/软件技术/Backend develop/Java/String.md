# String

`String`   提供了构造字符串拼接,裁剪等动作,提供了字符串构造处理的基本逻辑. 但String本身时final的,因此在字符串处理过程中,会不停的产生新的字符串,对象 属于Inmutable class. 效率较低

`StringBuffer` 为了避免因String的拼接出现的中间对象,而引入觉得线程安全的字符串处理类. 因为考虑了线程安全 ,因此一定程度上的效率也会偏低

`StringBuilder` 去掉了线程安全部分的StringBuffer效率最高 适用于大多数场景.