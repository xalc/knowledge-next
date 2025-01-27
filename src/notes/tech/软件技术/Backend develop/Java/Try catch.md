# Try catch

1. try catch finally 语句执行
2. try中有return
    
    try —> finally  —> try(return)
    
    `return中引用变量和直接变量的区别` 
    
3. catch中有return  类似
    
    try —→ catch —→ finally —→ catch (return)
    
4. finally中有return
    
    try —→ catch —→ finally (return)
    
    ### 结论
    
    try 和catch中的return 最后执行, 如果在finally中也有return 则try catch中的return被中断不执行
    
    受限检测  非受限检测
    
    RuntimeException及其子类非受限检测(编译器可以通过)
    
    受限异常(checked)必须在源代码中显示的进行捕获处理
    
    异常(EXCEPTION)一般是指程序本身抛出的
    
    错误(ERROR)一般是只JVM抛出的  `OutOfMemoryError`
    
    Exception和Error都继承了Throwable类
    
    classNotFoundException  (路径未找到)
    
    NoClassDefFoundError (编译通过后 运行时找不到 ,打包漏掉或者jar出现损坏)