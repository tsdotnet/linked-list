/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT
 */
import type { LinkedNodeWithValue } from '@tsdotnet/linked-node-list';
import { CollectionBase, ExtendedIterable } from '@tsdotnet/collection-base';
import { type EqualityComparison } from '@tsdotnet/compare';
export interface LinkedListNode<T> extends LinkedNodeWithValue<T> {
    previous: LinkedListNode<T> | undefined;
    next: LinkedListNode<T> | undefined;
    list: LinkedList<T>;
    addBefore(item: T): this;
    addAfter(item: T): this;
    remove(): void;
}
export default class LinkedList<T> extends CollectionBase<T> {
    private readonly _listInternal;
    constructor(initialValues?: Iterable<T> | null, equalityComparer?: EqualityComparison<T>);
    get first(): LinkedListNode<T> | undefined;
    get firstValue(): T | undefined;
    get last(): LinkedListNode<T> | undefined;
    get lastValue(): T | undefined;
    get version(): number;
    removeOnce(item: T): boolean;
    getValueAt(index: number): T | undefined;
    getNodeAt(index: number): LinkedListNode<T> | undefined;
    find(item: T): LinkedListNode<T> | undefined;
    findLast(item: T): LinkedListNode<T> | undefined;
    addFirst(item: T): this;
    addLast(item: T): this;
    takeFirstValue(): T | undefined;
    removeFirst(): boolean;
    takeLastValue(): T | undefined;
    removeLast(): boolean;
    removeAt(index: number): boolean;
    removeNode(node: LinkedListNode<T>): boolean;
    addBefore(before: LinkedListNode<T>, item: T): this;
    addAfter(after: LinkedListNode<T>, item: T): this;
    incrementVersion(): number;
    assertVersion(version: number): true | never;
    getCount(): number;
    protected _getIterator(): Iterator<T>;
    private _reversed?;
    get reversed(): ExtendedIterable<T>;
    protected _addInternal(item: T): boolean;
    protected _removeInternal(item: T, max?: number): number;
    protected _clearInternal(): number;
    private _findFirst;
    private _findLast;
    private _removeNodeInternal;
}
