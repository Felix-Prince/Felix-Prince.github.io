# TypeScript--基础类型

作者：Felix

日期：2019-09-12

## 基础类型

### 布尔值（boolean）

```js
let isDone:boolean = false  // let  变量名:类型 = 值
```

### 数字（number）

> typescirpt 里的所有数字都是浮点数，ts 支持 二进制、八进制、十进制、十六进制字面量

```js
let binaryLiteral: number = 0b1010;  // 二进制
let octalLiteral: number = 0o744;  // 八进制
let decLiteral: number = 6;   // 十进制
let hexLiteral: number = 0xf00d;  // 十六进制
```

### 字符串（string）

> 可以使用 双引号 (") 或 单引号 (')，还可以使用模板字符串，用反引号 ( ` )

```js
let  name:string = 'bob'
name = "smith"

// 使用 `` 来包裹字符串，这就是模板字符串，如果再模板字符串中使用变量 可以使用 ${变量名}
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;

// 等价于使用模板字符串
let sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

### 数组

第一种表示方式，在元素类型后面接上 []

```js
let list:number[] = [1,2,3]
```

第二种表示方式，使用数组泛型，Array<元素类型>

```js
let list:Array<number> = [1,2,3]
```

当你知道一部分数据的类型时，`any`类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据

```js
let list: any[] = [1, true, "free"];

list[1] = 100;
```

接口数组（这部分不理解可以跳过，后面讲了接口再回头看就懂了）

```js
interface NumberArray {
    [index: number]: string
}
let arr: NumberArray = ['zs', 'ls']
```

NumberArray 表示：只要index的类型时number，那么值的类型必须时string

二维数组

```js
// 可以直接这么赋值
let arr:number[][] = [[1,2,3,4],[2,4,6,8]]
// 也可以先定义一个一维的，然后一个个赋值
let arr:number [][]=[]
arr[0] = [1,2,3,4]
arr.push([2,4,6,8])
// 修改某个索引的值
arr[0][0] = 9
```

map数组

```js
let mapArray = new Map<string,string>()
mapArray.set('a1', "1")
mapArray.set('a2', "2")
```

注：直接用tsc编译的时候可能会报错，可以使用如下的指令

```bash
# Error Cannot find name 'Map'. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.

tsc ./array.ts --lib es2015
```

### 元组（Tuple）

> 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```js
// 声明一个tuple ，这个tuple 元素数量是 3 ，分别对应的类型是 string ， number， boolean
let x: [string, number, boolean]
// 赋值的时候需要与上面的声明对应起来，对应索引下的类型要一致
x = ['zs', 19, true]
// x = [18, 'zs', true] 
// 如果这样赋值，ts会直接给我们报错，但是依旧可以正常编译出来，
// 只是如果我们不按自己的定义去赋值，那还用ts干嘛哟，这样就没必要用tuple这东西了，连ts都没必要用了
```

```js
x[3] = 'ls' 
// error Tuple type '[string, number, boolean]' of length '3' has no element at index '3'
```

注意：官网上的说法是 `当访问一个越界的元素，会使用联合类型替代` 即：只要是我声明的类型中一种，那就是可以的。这部分文档可能官方还没有更新，在 [typescript 2.7](https://www.tslang.cn/docs/release-notes/typescript-2.7.html) 版本中已经做出了修改。元组的长度是固定的。

### 枚举（enum）

> 默认情况下，从`0`开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从 `3`开始编号,那他之后的就在3的基础上 开始 +1

```js
enum Color {red, green=3, blue}
let g:Color = Color.green // 3
let b:Color = Color.blue // 4
```

我们来看一下，编译成的 js  代码

```js
var Color;
(function (Color) {
    Color[Color["red"] = 0] = "red";
    Color[Color["green"] = 3] = "green";
    Color[Color["blue"] = 4] = "blue";
    console.log(Color) // { '0': 'red', '3': 'green', '4': 'blue', red: 0, green: 3, blue: 4 }
})(Color || (Color = {}));
var c = Color.green;
console.log(c);  // 3
console.log(Color[3]) // 'green'
```

我们不仅可以通过Color.green 获取对应的值，也可以反向映射

### Any

> 给编程阶段还不清楚类型的变量指定一个类型，比如来自用户输入或第三方代码库

```js
let  notSure: any = 4
notSure = "maybe a string instead"
notSure = false
```

对比Object 与 any，Object类型允许的变量只是允许你给它赋任意值，但是却不能够在它上面调用任意的方法，即便它真的有这些方法

```js
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

### Void

> 某种程度上来说，`void`类型像是与`any`类型相反，它表示没有任何类型。

如果一个函数没有返回值，可以写成如下

```js
function warnUser(): void {
    console.log("This is my warning message");
}
```

声明一个`void`类型的变量没有什么大用，因为你只能为它赋予`undefined`和`null`：

```js
let unusable: void = undefined;
```

### Null 和 Undefined

> `undefined`和`null`两者各自有自己的类型分别叫做`undefined`和`null`。

```js
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

默认情况下`null`和`undefined`是所有类型的子类型。 就是说你可以把 `null`和`undefined`赋值给`number`类型的变量.

```js
let str: string = 'hello world'
console.log(str) // hello world
str = null
console.log(str) // null
```

上面的代码默认情况下是可以编译成功的使用 `tsc filename.ts`，但是当我们指定 `--strictNullChecks`后就会报错

```bash
# error Type 'null' is not assignable to type 'string'.
tsc filename.ts --strictNullChecks
```

如果要这个限制下也能赋值null 或者 undefined，你可以使用联合类型`string | null | undefined`

```js
let str: string | null | undefined = 'hello world'
```

`strictNullChecks` 默认情况下是不开启的，使用的时候可以再配置`tsconfig.json`中配置，如果再demo中，直接命令中加上 `--strictNullChecks` 就行。鼓励再配置中开启 strictNullChecks

### Never

`never`类型表示的是那些永不存在的值的类型。 例如， `never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 `never`类型，当它们被永不为真的类型保护所约束时。

`never`类型是任何类型的子类型，也可以赋值给任何类型；然而，*没有*类型是`never`的子类型或可以赋值给`never`类型（除了`never`本身之外）。 即使 `any`也不可以赋值给`never`。

下面是一些返回`never`类型的函数：

```js
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

### Object

> object 表示非原始类型，也就是除nunmber、string、boolean、symbol、null或undefined之外的类型

```js
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

### 类型断言

> 类型断言好比其它语言里的`类型转换`，但是不进行特殊的数据检查和解构.TypeScript会假设你，程序员，已经进行了必须的检查。直白的说就是，自己能够确定我需要的是这个类型

`尖括号`语法

```js
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
```

`as`语法

```js
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

注：在TypeScript里使用JSX时，只有 `as`语法断言是被允许的。



