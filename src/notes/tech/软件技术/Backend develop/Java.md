# Java

[JavaWeb (spring boot)](Java%20b8cd861b502e4b3c938a9bc10f593746/JavaWeb%20(spring%20boot)%20579e3417691b445fbeb15c2d2a673e5e.md)

[Try catch](Java/Try%20catch.md)

[引用](Java/%E5%BC%95%E7%94%A8.md)

page

[String](Java/String.md)

[动态代理](Java/%E5%8A%A8%E6%80%81%E4%BB%A3%E7%90%86.md)

### vector ArrayList LinkedList

vertor:  线程安全的动态数组, 适合随机存储, 不适合增删, 会自动扩容,扩容为1倍

ArrayList: 应用广泛的动态数组,不考虑线程安全,因此效率更高.容量满了的时候会扩容到150%

LinkedList: 双向链表,不考虑线程安全.适合插入和删除操作,随机存储效率低

hashMap 和 hashSet

排序二叉树

AVL 平衡二叉树

如果增加和删除比较频繁,则二叉树的平衡过程比较耗能,导致效率降低,所以比较适用于查询场景

- [ ]  红黑树
    
    
    TreeMap 基于红黑树实现的一种能够顺序访问的Map
    
    TreeSet
    

垃圾回收机制

1. 引用计数
2. 可达性分析

垃圾回收算法

1. 复制
2. 标记-清除
3. 标记-整理(结合1和2)

多线程

继承Thread 或者实现Runnable接口并调用其start方法,如果是直接调用run方法并不启动线程