# TypeScript--Symbols和模块

作者：Felix

日期：2019-10-21

>  Symbols是不可改变且唯一的。 

```js
let sym1 = Symbol();

let sym2 = Symbol("key"); // 可选的字符串key

sym1 === sym2  // false symbols 是唯一的

// 作为对象的属性
let obj = {
    [sym1]:'value'
}

obj[sym1]  // 'value'

// 再类中使用
class C {
    [sym2](){
        return 'C'
    }
}
let c = new C()
c[sym2]() // 'C'
```



## 模块

>  “内部模块”现在称做“命名空间”。 “外部模块”现在则简称为“模块”，  `module X {` 相当于现在推荐的写法 `namespace X {` 

 模块是自声明的；两个模块之间的关系是通过在文件级别上使用imports和exports建立的。 

 模块使用模块加载器去导入其它的模块。 在运行时，模块加载器的作用是在执行此模块代码前去查找并执行这个模块的所有依赖。 大家最熟知的JavaScript模块加载器是服务于Node.js的 CommonJS和服务于Web应用的[Require.js](http://requirejs.org/)。 



### 导出

>  任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加`export`关键字来导出。 

```js
export interface StringValidator {
    isAcceptable(s: string): boolean;
}

// 导出重命名
export { StringValidator as mainValidator };

// 导出原先的验证器但做了重命名
export {ZipCodeValidator as RegExpBasedZipCodeValidator} from "./ZipCodeValidator";
```

### 默认导出

>  每个模块都可以有一个`default`导出。 默认导出使用 `default`关键字标记；并且一个模块只能够有一个`default`导出。 需要使用一种特殊的导入形式来导入 `default`导出。 



### 导入

```js
// 导入一个模块中的某个导出内容
import { ZipCodeValidator } from "./ZipCodeValidator";

// 可以对导入内容重命名
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
let myValidator = new ZCV();

// 将整个模块导入到一个变量，并通过它来访问模块的导出部分
import * as validator from "./ZipCodeValidator";
let myValidator = new validator.ZipCodeValidator();


```



### export = 

>  `export =`语法定义一个模块的导出`对象`。 这里的`对象`一词指的是类，接口，命名空间，函数或枚举。  若使用`export =`导出一个模块，则必须使用TypeScript的特定语法`import module = require("module")`来导入此模块 

```js
 interface stringValidator {
    isAcceptable(s: string): boolean
}
// export default '123'

const s: stringValidator = {
    isAcceptable(s: string): boolean {
        return true
    }
}
// export default s

export = stringValidator
```

在同一个文件中如果要是用`export = `则不能有别的export语句，不然会报错的。



可以通过不同的指令来实现，根据不同的方式来编译，是根据commonJs还是requireJs等来

```js
tsc --module commonjs Test.ts  // 对于Node.js来说，使用--module commonjs； 
tsc --module amd Test.ts // 对于Require.js来说，使用--module amd.
```

