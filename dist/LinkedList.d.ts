/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */
import { LinkedNodeWithValue } from '@tsdotnet/linked-node-list';
import CollectionBase from '@tsdotnet/collection-base/dist/CollectionBase';
import { EqualityComparison } from '@tsdotnet/compare';
/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/simulating-a-queue
 *
 * Adding to an array is very fast, but modifying is slow.
 * LinkedList wins when modifying contents.
 * http://stackoverflow.com/questions/166884/array-versus-linked-list
 *****************************/
export interface LinkedListNode<T> extends LinkedNodeWithValue<T> {
    previous: LinkedListNode<T> | undefined;
    next: LinkedListNode<T> | undefined;
    list: LinkedList<T>;
    addBefore(entry: T): void;
    addAfter(entry: T): void;
    remove(): void;
}
export default class LinkedList<T> extends CollectionBase<T> {
    private readonly _listInternal;
    constructor(initialValues?: Iterable<T> | null, equalityComparer?: EqualityComparison<T>);
    get first(): LinkedListNode<T> | undefined;
    get firstValue(): T | undefined;
    get last(): LinkedListNode<T> | undefined;
    get lastValue(): T | undefined;
    protected _getIterator(): Iterator<T>;
    removeOnce(entry: T): boolean;
    getValueAt(index: number): T | undefined;
    getNodeAt(index: number): LinkedListNode<T> | undefined;
    find(entry: T): LinkedListNode<T> | undefined;
    findLast(entry: T): LinkedListNode<T> | undefined;
    addFirst(entry: T): this;
    addLast(entry: T): this;
    takeFirstValue(): T | undefined;
    removeFirst(): boolean;
    takeLastValue(): T | undefined;
    removeLast(): boolean;
    removeAt(index: number): boolean;
    removeNode(node: LinkedListNode<T>): boolean;
    addBefore(before: LinkedListNode<T>, entry: T): this;
    addAfter(after: LinkedListNode<T>, entry: T): this;
    get version(): number;
    incrementVersion(): number;
    assertVersion(version: number): true | never;
    getCount(): number;
    protected _addInternal(entry: T): boolean;
    protected _removeInternal(entry: T, max?: number): number;
    protected _clearInternal(): number;
    private _findFirst;
    private _findLast;
    private _removeNodeInternal;
}
