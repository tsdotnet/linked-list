/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */
import { LinkedNodeList } from '@tsdotnet/linked-node-list';
import InvalidOperationException from '@tsdotnet/exceptions/dist/InvalidOperationException';
import ArgumentNullException from '@tsdotnet/exceptions/dist/ArgumentNullException';
import CollectionBase from '@tsdotnet/collection-base/dist/CollectionBase';
import { areEqual } from '@tsdotnet/compare';
/*
 * An internal node is used to manage the order without exposing underlying link chain to the consumer.
 */
class InternalNode {
    constructor(value, previous, next) {
        this.value = value;
        this.previous = previous;
        this.next = next;
    }
    assertDetached() {
        if (this.next || this.previous)
            throw new InvalidOperationException('Adding a node that is already placed.');
        return true;
    }
}
function ensureExternal(node, list) {
    if (!node)
        return undefined;
    if (!list)
        throw new ArgumentNullException('list');
    let external = node.external;
    if (!external)
        node.external = external = new InternalLinkedListNode(list, node);
    return external;
}
function getInternal(node, list) {
    if (!node)
        throw new ArgumentNullException('node');
    if (!list)
        throw new ArgumentNullException('list');
    if (node.list != list)
        throw new InvalidOperationException('Provided node does not belong to this list.');
    const n = node._nodeInternal;
    if (!n)
        throw new InvalidOperationException('Provided node is not valid.');
    return n;
}
function detachExternal(node) {
    if (node) {
        const e = node.external;
        if (e) {
            e._list = undefined;
            e._nodeInternal = undefined;
        }
        node.external = undefined;
    }
}
export default class LinkedList extends CollectionBase {
    constructor(initialValues, equalityComparer = areEqual) {
        super(equalityComparer);
        this._listInternal = new LinkedNodeList();
        if (initialValues)
            this._addEntries(initialValues);
    }
    /**
     * Returns the first node or undefined if the list is empty.
     */
    get first() {
        return ensureExternal(this._listInternal.first, this);
    }
    /**
     * Returns the first value or undefined if the list is empty.
     */
    get firstValue() {
        var _a;
        return (_a = this._listInternal.first) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     * Returns the last node or undefined if the list is empty.
     */
    get last() {
        return ensureExternal(this._listInternal.last, this);
    }
    /**
     * Returns the last value or undefined if the list is empty.
     */
    get lastValue() {
        var _a;
        return (_a = this._listInternal.last) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     * The version number used to track changes.
     * @returns {number}
     */
    get version() {
        return this._listInternal.version;
    }
    /**
     * Iterates the list and finds the first node that matches the provided value and removes it.
     * @param entry The value to remove.
     * @return {boolean} True if found and removes, otherwise false.
     */
    removeOnce(entry) {
        return this.remove(entry, 1) !== 0;
    }
    /**
     * Iterates the list returns the value of the node at the index requested.
     * Returns undefined if the index is out of range.
     * @param index
     * @returns The value at the index requested or undefined.
     */
    getValueAt(index) {
        var _a;
        return (_a = this._listInternal.getNodeAt(index)) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     * Iterates the list returns the the node at the index requested.
     * Returns undefined if the index is out of range.
     * @param index
     * @returns The node at the index requested or undefined.
     */
    getNodeAt(index) {
        return ensureExternal(this._listInternal.getNodeAt(index), this);
    }
    /**
     * Iterates the list returns the the first node that matches the value specified.
     * Returns undefined if not found.
     * @param entry
     * @returns The node matching the entry or undefined if not found
     */
    find(entry) {
        return ensureExternal(this._findFirst(entry), this);
    }
    /**
     * Iterates the list in reverse returns the the first node that matches the value specified.
     * Returns undefined if not found.
     * @param entry
     * @returns The node matching the entry or undefined if not found
     */
    findLast(entry) {
        const li = this._listInternal;
        return li && ensureExternal(this._findLast(entry), this);
    }
    /**
     * Adds to specified entry to the beginning of the list.
     * @param entry
     * @return {this}
     */
    addFirst(entry) {
        this._listInternal.addNodeBefore(new InternalNode(entry));
        return this;
    }
    /**
     * Adds to specified entry to the end of the list.
     * @param entry
     * @return {this}
     */
    addLast(entry) {
        return this.add(entry);
    }
    /**
     * Removes the first node and returns its value.
     * @return The value of the first node or undefined if the list is empty.
     */
    takeFirstValue() {
        const n = this._listInternal.first;
        return this._removeNodeInternal(n) ? n === null || n === void 0 ? void 0 : n.value : undefined;
    }
    /**
     * Removes the first node.
     * @return True if the node was removed.  False if the list is empty.
     */
    removeFirst() {
        return this._removeNodeInternal(this._listInternal.first);
    }
    /**
     * Removes the last node and returns its value.
     * @return The value of the last node or undefined if the list is empty.
     */
    takeLastValue() {
        const n = this._listInternal.last;
        return this._removeNodeInternal(n) ? n === null || n === void 0 ? void 0 : n.value : undefined;
    }
    /**
     * Removes the last node.
     * @return True if the node was removed.  False if the list is empty.
     */
    removeLast() {
        return this._removeNodeInternal(this._listInternal.last);
    }
    /**
     * Removes the node at the specified index.
     * @param {number} index
     * @return {boolean} True if the node was removed.  False if the index was out of range.
     */
    removeAt(index) {
        return this._removeNodeInternal(this._listInternal.getNodeAt(index));
    }
    /**
     * Removes the node specified.
     * @param {number} node
     * @return {boolean} True if the node was removed.  False if not found (already removed).
     */
    removeNode(node) {
        return this._removeNodeInternal(getInternal(node, this));
    }
    /**
     * Adds a entry before the specified node.
     * @param {LinkedListNode} before The node to follow the entry.
     * @param entry The value to insert before the node.
     * @return {this}
     */
    addBefore(before, entry) {
        this._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, this));
        return this;
    }
    /**
     * Adds a entry after the specified node.
     * @param {LinkedListNode} after The node to precede the entry.
     * @param entry The value to insert after the node.
     * @return {this}
     */
    addAfter(after, entry) {
        this._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, this));
        return this;
    }
    /**
     * Increments the collection version.
     * Useful for tracking changes.
     * @return {number} The new version.
     */
    incrementVersion() {
        return this._listInternal.incrementVersion();
    }
    /**
     * Throws if the provided version does not match the current one.
     * @param {number} version
     * @returns {boolean}
     */
    assertVersion(version) {
        return this._listInternal.assertVersion(version);
    }
    /**
     * Gets the number of nodes in the list.
     * @return {number}
     */
    getCount() {
        return this._listInternal.unsafeCount;
    }
    *_getIterator() {
        for (const n of this._listInternal) {
            yield n.value;
        }
    }
    _addInternal(entry) {
        this._listInternal.addNode(new InternalNode(entry));
        return true;
    }
    _removeInternal(entry, max = Infinity) {
        const equals = this._equalityComparer, list = this._listInternal;
        let removedCount = 0;
        for (const node of list) {
            if (node && equals(entry, node.value) && this._removeNodeInternal(node))
                removedCount++;
            if (removedCount >= max)
                break;
        }
        return removedCount;
    }
    _clearInternal() {
        const list = this._listInternal;
        for (const node of list) {
            detachExternal(node);
        }
        return list.clear();
    }
    _findFirst(entry) {
        //noinspection UnnecessaryLocalVariableJS
        const equals = this._equalityComparer;
        let next = this._listInternal.first;
        while (next) {
            if (equals(entry, next.value))
                return next;
            next = next.next;
        }
        return undefined;
    }
    _findLast(entry) {
        //noinspection UnnecessaryLocalVariableJS
        const equals = this._equalityComparer;
        let prev = this._listInternal.last;
        while (prev) {
            if (equals(entry, prev.value))
                return prev;
            prev = prev.previous;
        }
        return undefined;
    }
    _removeNodeInternal(node) {
        if (node && this._listInternal.removeNode(node)) {
            detachExternal(node);
            return true;
        }
        return false;
    }
}
// Use an internal node class to prevent mucking up the LinkedList.
class InternalLinkedListNode {
    constructor(_list, _nodeInternal) {
        this._list = _list;
        this._nodeInternal = _nodeInternal;
    }
    get list() {
        return this._list;
    }
    get previous() {
        this.throwIfDetached();
        return ensureExternal(this._nodeInternal.previous, this._list);
    }
    get next() {
        this.throwIfDetached();
        return ensureExternal(this._nodeInternal.next, this._list);
    }
    get value() {
        this.throwIfDetached();
        return this._nodeInternal.value;
    }
    set value(v) {
        this.throwIfDetached();
        this._nodeInternal.value = v;
    }
    addBefore(entry) {
        this.throwIfDetached();
        this._list.addBefore(this, entry);
        return this;
    }
    addAfter(entry) {
        this.throwIfDetached();
        this._list.addAfter(this, entry);
        return this;
    }
    remove() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _ = this;
        const list = _._list;
        if (list)
            list.removeNode(this);
        _._list = undefined;
        _._nodeInternal = undefined;
    }
    dispose() {
        this.remove();
    }
    throwIfDetached() {
        if (!this._list)
            throw new Error('This node has been detached from its list and is no longer valid.');
    }
}
//# sourceMappingURL=LinkedList.js.map