# forEach

遍历数组，对数组每一项执行定义的操作，

特别注意这是一个同步操作，在进行异步操作时候会出现预期外的结果。

这时需要使用for..of来代替

### 参考用例

在对磁盘文件遍历中 **无法正确执行的版本**

```jsx
import { promises as fs } from 'fs';
import path from 'path'
const absPath = process.cwd();
const docsPrefix = 'app/api/docs/nextdocs/';
const folderPath = path.resolve(absPath, docsPrefix);
async function listFiles(dir) {
    const topics = {
        path: '',
        files: [],
        folders: []
    };
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const filesArray = [];
        const foldersArray = [];
        // 关键行数
        entries.forEach(async(entry) => {
            if (entry.isFile()) {
                const pathObj = path.parse(entry.name);

                if (pathObj.ext === '.md' || pathObj.ext === '.mdx') {
                    filesArray.push({
                        name: pathObj.name,
                        extension: pathObj.ext
                    })
                }
            }
            if (entry.isDirectory()) {
                // console.log('parse subfolders: ' + path.resolve(dir, entry.name))
                const subTopic = await listFiles(path.resolve(dir, entry.name));
                foldersArray.push(subTopic)
            }
        });
        topics.files = filesArray;
        topics.folders = foldersArray;
        topics.path = path.relative(folderPath, dir);
    }
    catch (err) {
        console.log(err)
    }
    return topics;
}
;
const result = await listFiles(folderPath);
                const pathObj = path.parse(entry.name);

                if (pathObj.ext === '.md' || pathObj.ext === '.mdx') {
                    filesArray.push({
                        name: pathObj.name,
                        extension: pathObj.ext
                    })
                }
            }
            if (entry.isDirectory()) {
                // console.log('parse subfolders: ' + path.resolve(dir, entry.name))
                const subTopic = await listFiles(path.resolve(dir, entry.name));
                foldersArray.push(subTopic)
            }
        });
        topics.files = filesArray;
        topics.folders = foldersArray;
        topics.path = path.relative(folderPath, dir);
    }
    catch (err) {
        console.log(err)
    }
    return topics;
}
;
const result = await listFiles(mdxDir);
const jsonString = JSON.stringify(result, null, 2);

fs.writeFile('./test.json', jsonString, 'utf8');
```

能够预期执行的版本

```jsx
import { promises as fs } from 'fs';
import path from 'path'
const absPath = process.cwd();
const docsPrefix = 'app/api/docs/nextdocs/';
const folderPath = path.resolve(absPath, docsPrefix);
async function listFiles(dir) {
    const topics = {
        path: '',
        files: [],
        folders: []
    };
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const filesArray = [];
        const foldersArray = [];
        for (const entry of entries) {
            if (entry.isFile()) {
                const pathObj = path.parse(entry.name);

                if (pathObj.ext === '.md' || pathObj.ext === '.mdx') {
                    filesArray.push({
                        name: pathObj.name,
                        extension: pathObj.ext
                    })
                }
            }
            if (entry.isDirectory()) {
                // console.log('parse subfolders: ' + path.resolve(dir, entry.name))
                const subTopic = await listFiles(path.resolve(dir, entry.name));
                foldersArray.push(subTopic)
            }
        }
        topics.files = filesArray;
        topics.folders = foldersArray;
        topics.path = path.relative(folderPath, dir);
    }
    catch (err) {
        console.log(err)
    }
    return topics;
}
;
const result = await listFiles(folderPath);nter/
const mdxDir = path.resolve('.', 'app/api/docs/nextdocs/')

async function listFiles(dir) {
    const topics = {
        path: '',
        files: [],
        folders: []
    };
    try {

        const entries = await fs.readdir(dir, { withFileTypes: true });
        const filesArray = [];
        const foldersArray = [];
        for (const entry of entries) {
            if (entry.isFile()) {
                const pathObj = path.parse(entry.name);

                if (pathObj.ext === '.md' || pathObj.ext === '.mdx') {
                    filesArray.push({
                        name: pathObj.name,
                        extension: pathObj.ext
                    })
                }
            }
            if (entry.isDirectory()) {
                // console.log('parse subfolders: ' + path.resolve(dir, entry.name))
                const subTopic = await listFiles(path.resolve(dir, entry.name));
                foldersArray.push(subTopic)
            }
        }
        topics.files = filesArray;
        topics.folders = foldersArray;
        topics.path = path.relative(folderPath, dir);
    }
    catch (err) {
        console.log(err)
    }
    return topics;
}
;
const result = await listFiles(mdxDir);
const jsonString = JSON.stringify(result, null, 2);

fs.writeFile('./test.json', jsonString, 'utf8');
```