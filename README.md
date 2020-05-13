# ![alt text](https://avatars1.githubusercontent.com/u/64487547?s=30 "tsdotnet") tsdotnet / linked-list

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/linked-list/blob/master/LICENSE)
![100% code coverage](https://img.shields.io/badge/coverage-100%25-green)
![npm-publish](https://github.com/tsdotnet/linked-list/workflows/npm-publish/badge.svg)
[![npm version](https://img.shields.io/npm/v/@tsdotnet/linked-list.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/linked-list)

A doubly (bidirectional) linked list.  Acts as a safe, value focused wrapper for a [linked-node-list](https://github.com/tsdotnet/linked-node-list).

## Docs

[tsdotnet.github.io/linked-list](https://tsdotnet.github.io/linked-list/classes/_linkedlist_.linkedlist.html)

This value focused linked list offers a safe to use node interface that only generates externally accessible nodes on demand.

```typescript
interface LinkedListNode<T>
{
  list: LinkedList<T>;
  previous: LinkedListNode<T> | undefined;
  next: LinkedListNode<T> | undefined;

  value: T;

  addBefore (entry: T): void;
  addAfter (entry: T): void;
  remove (): void;
}
```
