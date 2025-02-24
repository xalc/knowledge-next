# 针对MAC pytorch gpu加速

PyTorch 使用全新的 Metal Performance Shaders (MPS) 后端来加速 GPU 训练。这个 MPS 后端扩展了 PyTorch 框架，提供了在 Mac 上设置和运行操作的脚本与功能 5。MPS 框架通过针对每个 Metal GPU 系列的独特特性进行微调的内核来优化计算性能 6。新的 mps 设备将机器学习的计算图和原语映射到 MPS Graph 框架以及由 MPS 提供的优化内核上

1. 安装Anaconda环境
2. 安装pytorch-nightly

```jsx
conda install pytorch torchvision torchaudio -c pytorch-nightly
```

1. 验证

```jsx
import torch
if torch.backends.mps.is_available():
    mps_device = torch.device("mps")
    x = torch.ones(1, device=mps_device)
    print (x)
else:
    print ("MPS device not found.")
```