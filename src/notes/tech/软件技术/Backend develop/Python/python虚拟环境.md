# python虚拟环境

1. `venv` 系统内置的轻量级环境管理工具

## 创建venv 以及venv命令

```bash
python -m venv .venv

source .venv/bin/activate

which python

deactivate
```

1. Conda

`conda` 是Anaconda提供的包管理工具，不仅支持Python环境管理，还支持非Python依赖（如C库）

安装完成后 执行如下指令

```jsx
conda -V 
conda create --name myenv python=3.12
conda activate myenv

```

在激活的虚拟环境中，您可以使用 **`conda install`** 或 **`pip install`** 安装所需的包。

```jsx
pip install flask
//or
conda install numpy pandas
```

查看创建的虚拟环境

```jsx
conda env list
```

推出环境

```jsx
conda deactivate
```

删除环境

```jsx
conda remove --name myenv --all
```

[针对MAC pytorch gpu加速](python%E8%99%9A%E6%8B%9F%E7%8E%AF%E5%A2%83/%E9%92%88%E5%AF%B9MAC%20pytorch%20gpu%E5%8A%A0%E9%80%9F.md)

# 针对MAC的 加速GPU训练