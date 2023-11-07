# Typescript--类

作者：Felix

日期：2019-09-18

> 在C#和Java这些面向对象语言中，有这么几个特点：封装、继承、多态

## 继承

在原生JS中我们时通过原型链的方式来实现继承的，但是在ES6后提供了一个`Class`，我们可以通过这个关键字来像别的面向对象语言中一样实现继承，`typescript`就是使用常用的面向对象模式。

```js
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

通过`extends`关键字来实现继承，在上面的例子中 `Animal` 是基类、父类（通常称为超类）、而`Snake和Horse`是一个派生类（通常称为子类），子类继承了超类的属性和方法。

同时子类中可以定义自己的方法，比如上面的例子中，两个子类分别定义了一个move方法，这个方法与父类的方法同名，这样就会覆盖父类的方法，当子类的实例调用方法的时候，调用的是子类自身的move，而不是父类的，如果子类自己没有定义move方法，那么就会去调用父类的move方法，**覆盖是实现多态的一种方式，上面这个例子用到了多态**

## 修饰符

公共``public``，私有``private``与受保护的``protected``修饰符

### public

> `public`的意思就是公共的，意味着都可以访问，因此在上面的例子中我们可以自由的访问程序里定义的成员。

在ts中成员（属性和方法）都是默认为 `public`，在别的语言，如C#中需要在成员前明确的指定。可以把上面的Animal修改为如下

```js
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

### private

> `private`的意思就是私有的，意味着不是随便哪里都能访问的，不能在声明它的类的外部访问

```js
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // 错误: 'name' 是私有的.
```

即使是继承了该类的子类中也不能访问 `private`修饰的成员

```js
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal{
    constructor(){
        super('')
    }
    move(){
        console.log(this.name) // 属性“name”为私有属性，只能在类“Animal”中访问。
    }
}
```

typescript 使用的是结构性类型系统，当我们比较两种不同的类型时，并不在乎它们从何处而来，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。直白的说就是可以直接进行互相赋值，但是如果带有用了`private`或者`protected`修饰的成员，那么就无法兼容（即互相赋值）

```js
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // 错误: Animal 与 Employee 不兼容. 如果不用 private 进行修饰，那么就不会报错
```

### protected

> `protected`的意思是受保护的，意味着也是不能随意访问的，但是它不同于`private` ,如果用`private`修饰的成员，除了声明的类中可以访问别的地方都不能访问，但是用`protected`修饰的成员是可以在其子类中进行访问的

```js
class Animal {
    protected name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal{
    constructor(){
        super('')
    }
    move(){
        console.log(this.name) // 这样是不会报错的
    }
}
let d = new Dog()
console.log(d.name) // 属性“name”受保护，只能在类“Animal”及其子类中访问。
```

### readonly

>  `readonly`关键字将属性设置为只读的，只读属性必须在声明或构造函数中被初始化

```js
class Animal {
    readonly name: string;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Animal("Tom");
dad.name = "Jerry"; // 错误! name 是只读的.
```

我们还可以使用`参数属性` ,参数这个称呼一般都是对于方法的参数的，因此参数属性是对于参数来说的。上面的例子可以修改为

```js
class Animal {
    constructor (readonly name: string) {
        this.name = name;
    }
}
let dad = new Animal("Tom");
dad.name = "Jerry"; // 错误! name 是只读的.
```

参数属性通过给构造函数参数前面添加一个访问限定符来声明。 使用 `private`限定一个参数属性会声明并初始化一个私有成员；对于 `public`和 `protected`来说也是一样。

## 存取器

> 通过getter/setter来访问对象成员，有效控制对象成员的访问

原本我们是如下这样写的，访问对象的成员很方便，但是也会存在麻烦

```js
class Animal {
    name: string;
}

let animal = new Animal();
animal.name = "Tom";
```

因为成员是默认public的，所以可以任意的访问，因此会导致一些错误的修改

```js
class Animal {
    private _name: string

    get Name(): string {
        return this._name
    }
    set Name(value: string) {
        if (value.length > 2) {
            this._name = value
        } else {
            console.log('error!')
        }
    }
}
let animal = new Animal();
animal.Name = 'aa' // 打印 error
animal.Name = 'Tom' // success
```

尽管这样看起来比较麻烦，但是在有些时候是非常方便的，比如在表单数据的验证上。

注：在使用 get/set 的时候如果报错`访问器仅在面向 ECMAScript 5 和更高版本时可用。ts(1056)` 这个可以在`tsconfig.json`中配置  [解决方式](https://github.com/angular/angular-cli/issues/5059)

```js
"compilerOptions":{
   ....
    "target":"es2017"  // <- 重点在这里 指定为最新版
 },
```

## 静态属性

之前讲到的都是实例的属性，即通过new出来的实例来访问的属性，静态属性是定义在类上的，而不是实例上的，因此访问的方式是不同的，当都想要访问这个属性的时候，就可以在该属性前加个 `static` 关键字，让这个属性作为静态属性

```js
class Animal {
    static animalName:string = 'Tom';
    static move():void {
        console.log('hello world')
    }
}
let animal = new Animal()
console.log(animal.animalName) // Property 'animalName' is a static member of type 'Animal'
console.log(Animal.animalName) 
Animal.move()
```

上面的例子是强行使用了静态属性，实际中根据需要可以来使用，访问静态属性不是通过 `实例名.属性名`来访问的，而是通过`类名.属性名` 来访问的，有静态属性自然也有静态方法，静态方法的调用方式也差不多`类名.方法名`

在使用静态属性的时候，不要声明变量名为`name` ,不然报错`静态属性“name”与构造函数“Animal”的内置属性函数“name”冲突。ts(2699)`

## 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。 `abstract`关键字是用于定义抽象类和在抽象类内部定义抽象方法。抽象方法不包含具体实现并且必须在派生类中实现。 抽象方法的语法与接口方法相似。 两者都是定义方法签名但不包含方法体。 然而，抽象方法必须包含 `abstract`关键字并且可以包含访问修饰符。

```js
abstract class Department {
    constructor(public name: string) {
    }
    // 可以在抽象类中包含成员的实现细节
    printName(): void {
        console.log('Department name: ' + this.name);
    }
	// 抽象方法必须以 abstract 关键字修饰
    abstract printMeeting(): void; // 必须在派生类中实现
}
class AccountingDepartment extends Department {
    constructor() {
        super('Accounting and Auditing'); // 在派生类的构造函数中必须调用 super()
    }
    // 在派生类中必须实现父类的抽象方法
    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }
    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

## 构造函数

在ts中声明一个类的时候，实际上同时声明了两个东西：`实例的类型 `和 `构造函数的值` 因此我们可以直接如下这样使用

```js
class Animal {
    name : string
}
let a:Animal
a = new Animal()
```

这样写的意思是 `Animal`类的实例的类型是`Animal`类型的

在C# 中我们会如下这样写，其实是一个意思

```C#
Animal a = new Animal()
```

### 把类当作接口使用

类定义会创建两个东西：类的实例类型和一个构造函数。 因为类可以创建出类型，所以你能够在允许使用接口的地方使用类

```js
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

