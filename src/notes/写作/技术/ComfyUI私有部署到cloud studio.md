# ComfyUI私有部署到cloud studio

steps

1. 检查cloud studio 查看基础环境是否满足
2. 升级python到推荐的3.12
3. 安装

# 背景

最近入手了Macbook，就想着看能折腾点儿什么好玩的东西出来。起因是想找找能够文生图的API用于在网站上生成头像，无意间发现了开源的ComfyUI。最开始想着在本地macbook上部署下偶尔玩玩。结果踩到坑里去了，由于macbook的MPS计算框架对pytorch的支持受限，导致model跑不出来。

想起之前在腾讯的cloud studio上部署deepseek时候，提供的硬件资源满足条件。网络的问题似乎也有办法克服

这里要好评下腾讯提供的平台，能让普通的科技爱好者免费使用到较为高级的计算资源，并且免费的额度还挺大。 也许就有一些有创意的想法在腾讯的平台上脱颖而出，给普罗大众带来不同的技术升级。

# 开始

首先注册到腾讯的cloud studio

然后在高性能空间中选择下图基础免费的款，提供了大约150G的空间（2025/2/18日），足够尝试些不同的模型了。

![image.png](ComfyUI%E7%A7%81%E6%9C%89%E9%83%A8%E7%BD%B2%E5%88%B0cloud%20studio/image.png)

我最初选择的是之前用过的pytorch模版，里面含操作系统有50G左右的空间，空间有限，没法尝试更多的模型。 不过也正因为如此，才想着记录下来，自己重新在部署一套，边部署边记录步骤。

登录进去后开机成功，先执行些基础命令检查下硬件设备

```bash
df -f #产看硬盘空间
free -h #查看内存信息
nvidia-smi # 查看显卡信息
```

确认后 在查看python的版本

```bash
python --version
```

目前（2025/2/18）默认安装的3.10，按照ComfyUI推荐的版本得先升级。

由于CloudStudio 使用的conda作为包管理的工具，可以通过下面命令直接升级到3.12

```bash
conda install python=3.12
```

如果下载慢的话要么去干点别的事情 或者可以查查目前可用的conda的国内镜像，从镜像下载。

安装pytorch。照着githut的指南，在cloud studio中使用下面的命令

```bash

pip install --pre torch torchvision torchaudio --index-url [https://download.pytorch.org/whl/nightly/cu126](https://download.pytorch.org/whl/nightly/cu126)
```

这儿腾讯默认配置了python的国内镜像，所以速度很快，但包挺大的 仍需要等很久。可以干点别的事情去。

git clone 下载 `ComfyUI` 

```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
```

如果下不下来的话 可以从浏览器下载到本地在通过cloud studio上传到workspace

进入ComfyUI的folder后安装 依赖

```bash
pip install -r requirements.txt
```

执行

```bash
python main.py
```

如果在console中看见如下信息， 万里长征第一步就走完了

![image.png](ComfyUI%E7%A7%81%E6%9C%89%E9%83%A8%E7%BD%B2%E5%88%B0cloud%20studio/image%201.png)

接下来就可以配置内网穿透了 不然是无法访问到127.0.0.1:8188的。

这点腾讯倒是大气 直接在 `/workspace/`README.md  中给了具体的指导 

并连接到了对应的文档选一个适合的方式就好：

[https://mp.weixin.qq.com/s/NnrzuabNQROTI75wAIjkOA](https://mp.weixin.qq.com/s/NnrzuabNQROTI75wAIjkOA)

我这边由于有公网IP和云主机 所以使用 `autossh`创建了一个内网隧道 把cloud studio上的端口映射到云主机的对应端口上就可以从我云主机的ip和端口进行访问了。

细节不多说了。

剩下的就是下载模型，理解不同的模型有什么用

根据官方给的例子 选择FLUX的模型下载：
[https://comfyanonymous.github.io/ComfyUI_examples/flux/](https://comfyanonymous.github.io/ComfyUI_examples/flux/)

其中这些模型的作用如下： 都是GPT给的答案：

> `clip模型`   ---CLIP 模型首先将你输入的文本提示（Prompt）进行编码，将其转换为一个向量表示。这个向量包含了文本的语义信息，例如描述了什么物体、什么场景、什么风格等。
`VAE模型`     --- VAE（Variational Autoencoder）模型用于将图像压缩成潜在空间中的向量，然后再将向量解码成图像。使用 VAE 模型可以提高生成图像的质量和细节。
`FLUX模型`   ---用于生成高质量的图像。FLUX 是由 Black Forest Labs 开发的一款先进的文本到图像生成模型，它在图像质量、文本理解和生成速度方面都表现出色。
> 

我们需要将对应的模型放到对应的文件夹下面：

ComfyUI/models/clip/ ：

ComfyUI/models/vae/

ComfyUI/models/checkpoints/

使用huggeringface-hub进行模型的下载

使用GPT生成一段下载模型的代码

在 `models_and_files` 里面填入你要下载模型名称和文件名 可以在huggeringface上面找到

这儿使用的国内的huggeringface代理：
`os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"`

```bash
# concurrent-download.py
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from huggingface_hub import hf_hub_download

os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"
# 定义要下载的模型和文件列表
models_and_files = [
    {"model_name": "Kijai/flux-fp8", "file_name": "flux1-dev-fp8.safetensors"},
    {"model_name": "comfyanonymous/flux_text_encoders", "file_name": "t5xxl_fp8_e4m3fn.safetensors"},
    {"model_name": "comfyanonymous/flux_text_encoders", "file_name": "clip_l.safetensors"},
    {"model_name": "black-forest-labs/FLUX.1-schnell", "file_name": "ae.safetensors"},
]

# 定义下载函数
def download_file(model_name, file_name):
    try:
        # 下载文件
        downloaded_file_path = hf_hub_download(repo_id=model_name, filename=file_name)
        return f"成功下载: {model_name}/{file_name} -> {downloaded_file_path}"
    except Exception as e:
        return f"下载失败: {model_name}/{file_name}, 错误: {str(e)}"

# 并发下载多个文件
def download_models_concurrently(models_and_files, max_workers=5):
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # 提交下载任务
        future_to_task = {
            executor.submit(download_file, task["model_name"], task["file_name"]): task
            for task in models_and_files
        }
        # 等待任务完成并收集结果
        for future in as_completed(future_to_task):
            task = future_to_task[future]
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                results.append(f"任务出错: {task}, 错误: {str(e)}")
    return results

# 主函数
if __name__ == "__main__":
    # 后台运行（将输出保存到日志文件）
    log_file = "download_log.txt"
    with open(log_file, "w") as f:
        f.write("开始下载模型文件...\n")

    # 执行并发下载
    results = download_models_concurrently(models_and_files)

    # 将结果写入日志文件
    with open(log_file, "a") as f:
        for result in results:
            f.write(result + "\n")
        f.write("所有任务已完成。\n")

    print(f"下载完成！详细信息请查看日志文件: {os.path.abspath(log_file)}")
```

支持并发下载，如果需要后台下载的话 执行如下命令

```bash
nohup python concurrent-download.py > output.log 2>&1 &

```

这样就可以等待模型下载了 也许几十分钟也许会失败。可以在 `download_log.txt` 中查看结果

下载失败后，换个时间重新试下吧

随后将模型移动到对应的文件夹下，