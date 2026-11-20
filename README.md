<a name="banner"><img src="https://cdn.jsdelivr.net/gh/tsdotnet/linked-list@master/assets/banner.svg" alt="@tsdotnet/linked-list: Nodes that link up. A doubly linked list, as in .NET."></a>

[![npm version](https://img.shields.io/npm/v/@tsdotnet/linked-list.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/linked-list)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/linked-list/blob/master/LICENSE)

A doubly linked list with a .NET style API: add, find and remove values, and edit around nodes.

## Install

```sh
npm install @tsdotnet/linked-list
```

## Usage

```ts
import LinkedList from '@tsdotnet/linked-list';

const list = new LinkedList([1, 2, 3]).addLast(4);

list.firstValue; // 1
list.find(3)?.addAfter(99);
[...list]; // [1, 2, 3, 99, 4]
list.takeLastValue(); // 4
```

Nodes from `first`, `last` and `find` can insert and remove around themselves. `reversed` iterates backwards.

## Use it from

ESM (`import LinkedList from '@tsdotnet/linked-list';`) or CommonJS (`const LinkedList = require('@tsdotnet/linked-list').default;`).

<details><summary>In a browser, without a bundler</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/type@1/dist/umd/type.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/compare@1/dist/umd/compare.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/exceptions@1/dist/umd/exceptions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/collection-base@2/dist/umd/collection-base.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/linked-node-list@1/dist/umd/linked-node-list.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/linked-list@1/dist/umd/linked-list.min.js"></script>
<script>
  const LinkedList = tsdotnet.linkedList.default;
</script>
```

</details>

## Docs

[tsdotnet.github.io/linked-list](https://tsdotnet.github.io/linked-list/)
