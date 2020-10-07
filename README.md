## 项目札记
1. React也可以使用function来定义component，不一定要用Class。不过目前看来，使用Class的方式可以更方便使用React的各种特性。
2. React组件的属性来自父亲组件，而状态则自己维护。这中**状态与属性的隔离**机制，既可以实现父子组件的通信，也可以让子组件维护自己的状态。
3. 可以为React组件**绑定**特定的接口类型，这个类型规定了组件state的内部构成，如果对state使用了错误的类型，那么编译时就会报错。这是利用TypeScript的强类型功能避免犯错。

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
