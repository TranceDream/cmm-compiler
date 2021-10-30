# C--编译器词法分析和语法分析Typescript实现

这是一个使用Typescript实现的简易C语言编译器，仅包含少量C语言要素，目前完成了词法分析

## 使用说明

运行前请确保安装了较新版本的Node.js

使用npm或yarn安装typescript和ts-node

```shell
# Using npm
npm install -g typescript
npm install -g ts-node

# Using yarn
yarn global add typescript
yarn global add ts-node
```

安装依赖

```shell
# Using npm
npm install

# Using yarn
yarn
# Or
yarn install
```

用ts-node运行项目

```shell
ts-node app.ts <path-to-your-c-source-file>
```

可以得到词素序列和TOKEN序列

## 词法分析部分(待补全)

使用的有限状态机如下图

![fsm](https://cdn.jsdelivr.net/gh/KAQSICE/ImgHost/img/202110302320824.png)

通过XState库构造有限状态机并进行状态转换
