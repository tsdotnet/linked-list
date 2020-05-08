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
     * @param entry The value to remove.
     * @return {boolean} True if found and removes, otherwise false.
     */
    removeOnce(entry: T): boolean;
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
     * @param entry
     * @returns The node matching the entry or undefined if not found
     */
    find(entry: T): LinkedListNode<T> | undefined;
    /**
     * Iterates the list in reverse returns the the first node that matches the value specified.
     * Returns undefined if not found.
     * @param entry
     * @returns The node matching the entry or undefined if not found
     */
    findLast(entry: T): LinkedListNode<T> | undefined;
    /**
     * Adds to specified entry to the beginning of the list.
     * @param entry
     * @return {this}
     */
    addFirst(entry: T): this;
    /**
     * Adds to specified entry to the end of the list.
     * @param entry
     * @return {this}
     */
    addLast(entry: T): this;
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
     * Adds a entry before the specified node.
     * @param {LinkedListNode} before The node to follow the entry.
     * @param entry The value to insert before the node.
     * @return {this}
     */
    addBefore(before: LinkedListNode<T>, entry: T): this;
    /**
     * Adds a entry after the specified node.
     * @param {LinkedListNode} after The node to precede the entry.
     * @param entry The value to insert after the node.
     * @return {this}
     */
    addAfter(after: LinkedListNode<T>, entry: T): this;
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
    protected _addInternal(entry: T): boolean;
    protected _removeInternal(entry: T, max?: number): number;
    protected _clearInternal(): number;
    private _findFirst;
    private _findLast;
    private _removeNodeInternal;
}