/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT
 */
import { LinkedNodeWithValue } from '@tsdotnet/linked-node-list';
import CollectionBase from '@tsdotnet/collection-base/dist/CollectionBase';
import { EqualityComparison } from '@tsdotnet/compare/dist/Comparable';
/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/simulating-a-queue
 *
 * Adding to an array is very fast, but modifying is slow.
 * LinkedList wins when modifying contents.
 * http://stackoverflow.com/questions/166884/array-versus-linked-list
 *****************************/
export interface LinkedListNode<T> extends LinkedNodeWithValue<T> {
    /**
     * The node before this one.  Undefined if this is the first node.
     * Throws if this node no longer belongs to a list (removed).
     */
    previous: LinkedListNode<T> | undefined;
    /**
     * The node before this one.  Undefined if this is the first node.
     * Throws if this node no longer belongs to a list (removed).
     */
    next: LinkedListNode<T> | undefined;
    /**
     * The list this node belongs to.
     */
    list: LinkedList<T>;
    /**
     * Adds a item before this node.
     * @param item The item to insert before this one.
     * @return {this}
     */
    addBefore(item: T): this;
    /**
     * Adds a item after this node.
     * @param item The item to insert after this one.
     * @return {this}
     */
    addAfter(item: T): this;
    /**
     * Removes (detaches) this node from its list.
     */
    remove(): void;
}
/**
 * A doubly (bidirectional) linked list.  Acts as a safe, value focused wrapper for a [linked-node-list](https://github.com/tsdotnet/linked-node-list).
 */
export default class LinkedList<T> extends CollectionBase<T> {
    private readonly _listInternal;
    constructor(initialValues?: Iterable<T> | null, equalityComparer?: EqualityComparison<T>);
    /**
     * Returns the first node or undefined if the list is empty.
     */
    get first(): LinkedListNode<T> | undefined;
    /**
     * Returns the first value or undefined if the list is empty.
     */
    get firstValue(): T | undefined;
    /**
     * Returns the last node or undefined if the list is empty.
     */
    get last(): LinkedListNode<T> | undefined;
    /**
     * Returns the last value or undefined if the list is empty.
     */
    get lastValue(): T | undefined;
    /**
     * The version number used to track changes.
     * @returns {number}
     */
    get version(): number;
    /**
     * Iterates the list and finds the first node that matches the provided value and removes it.
     * @param item The value to remove.
     * @return {boolean} True if found and removes, otherwise false.
     */
    removeOnce(item: T): boolean;
    /**
     * Iterates the list returns the value of the node at the index requested.
     * Returns undefined if the index is out of range.
     * @param index
     * @returns The value at the index requested or undefined.
     */
    getValueAt(index: number): T | undefined;
    /**
     * Iterates the list returns the the node at the index requested.
     * Returns undefined if the index is out of range.
     * @param index
     * @returns The node at the index requested or undefined.
     */
    getNodeAt(index: number): LinkedListNode<T> | undefined;
    /**
     * Iterates the list returns the the first node that matches the value specified.
     * Returns undefined if not found.
     * @param item
     * @returns The node matching the item or undefined if not found
     */
    find(item: T): LinkedListNode<T> | undefined;
    /**
     * Iterates the list in reverse returns the the first node that matches the value specified.
     * Returns undefined if not found.
     * @param item
     * @returns The node matching the item or undefined if not found
     */
    findLast(item: T): LinkedListNode<T> | undefined;
    /**
     * Adds to specified item to the beginning of the list.
     * @param item
     * @return {this}
     */
    addFirst(item: T): this;
    /**
     * Adds to specified item to the end of the list.
     * @param item
     * @return {this}
     */
    addLast(item: T): this;
    /**
     * Removes the first node and returns its value.
     * @return The value of the first node or undefined if the list is empty.
     */
    takeFirstValue(): T | undefined;
    /**
     * Removes the first node.
     * @return True if the node was removed.  False if the list is empty.
     */
    removeFirst(): boolean;
    /**
     * Removes the last node and returns its value.
     * @return The value of the last node or undefined if the list is empty.
     */
    takeLastValue(): T | undefined;
    /**
     * Removes the last node.
     * @return True if the node was removed.  False if the list is empty.
     */
    removeLast(): boolean;
    /**
     * Removes the node at the specified index.
     * @param {number} index
     * @return {boolean} True if the node was removed.  False if the index was out of range.
     */
    removeAt(index: number): boolean;
    /**
     * Removes the node specified.
     * @param {number} node
     * @return {boolean} True if the node was removed.  False if not found (already removed).
     */
    removeNode(node: LinkedListNode<T>): boolean;
    /**
     * Adds a item before the specified node.
     * @param {LinkedListNode} before The node to follow the item.
     * @param item The value to insert before the node.
     * @return {this}
     */
    addBefore(before: LinkedListNode<T>, item: T): this;
    /**
     * Adds a item after the specified node.
     * @param {LinkedListNode} after The node to precede the item.
     * @param item The value to insert after the node.
     * @return {this}
     */
    addAfter(after: LinkedListNode<T>, item: T): this;
    /**
     * Increments the collection version.
     * Useful for tracking changes.
     * @return {number} The new version.
     */
    incrementVersion(): number;
    /**
     * Throws if the provided version does not match the current one.
     * @param {number} version
     * @returns {boolean}
     */
    assertVersion(version: number): true | never;
    /**
     * Gets the number of nodes in the list.
     * @return {number}
     */
    getCount(): number;
    protected _getIterator(): Iterator<T>;
    protected _addInternal(item: T): boolean;
    protected _removeInternal(item: T, max?: number): number;
    protected _clearInternal(): number;
    private _findFirst;
    private _findLast;
    private _removeNodeInternal;
}
