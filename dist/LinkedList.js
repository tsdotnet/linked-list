"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET-Core/blob/master/LICENSE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const InvalidOperationException_1 = tslib_1.__importDefault(require("@tsdotnet/exceptions/dist/InvalidOperationException"));
const ArgumentNullException_1 = tslib_1.__importDefault(require("@tsdotnet/exceptions/dist/ArgumentNullException"));
const CollectionBase_1 = tslib_1.__importDefault(require("@tsdotnet/collection-base/dist/CollectionBase"));
const linked_node_list_1 = tslib_1.__importDefault(require("@tsdotnet/linked-node-list"));
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
            throw new InvalidOperationException_1.default('Adding a node that is already placed.');
        return true;
    }
}
function ensureExternal(node, list) {
    if (!node)
        return undefined;
    if (!list)
        throw new ArgumentNullException_1.default('list');
    let external = node.external;
    if (!external)
        node.external = external = new InternalLinkedListNode(list, node);
    return external;
}
function getInternal(node, list) {
    if (!node)
        throw new ArgumentNullException_1.default('node');
    if (!list)
        throw new ArgumentNullException_1.default('list');
    if (node.list != list)
        throw new InvalidOperationException_1.default('Provided node does not belong to this list.');
    const n = node._nodeInternal;
    if (!n)
        throw new InvalidOperationException_1.default('Provided node is not valid.');
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
class LinkedList extends CollectionBase_1.default {
    constructor() {
        super(...arguments);
        this._listInternal = new linked_node_list_1.default();
    }
    get first() {
        return ensureExternal(this._listInternal.first, this);
    }
    get firstValue() {
        var _a;
        return (_a = this._listInternal.first) === null || _a === void 0 ? void 0 : _a.value;
    }
    get last() {
        return ensureExternal(this._listInternal.last, this);
    }
    get lastValue() {
        var _a;
        return (_a = this._listInternal.last) === null || _a === void 0 ? void 0 : _a.value;
    }
    _getIterator() {
        return linked_node_list_1.default.valueIterableFrom(this._listInternal)[Symbol.iterator]();
    }
    removeOnce(entry) {
        return this.remove(entry, 1) !== 0;
    }
    // #endregion
    getValueAt(index) {
        const node = this._listInternal.getNodeAt(index);
        return node ? node.value : undefined;
    }
    // #endregion
    getNodeAt(index) {
        return ensureExternal(this._listInternal.getNodeAt(index), this);
    }
    find(entry) {
        const li = this._listInternal;
        return li && ensureExternal(this._findFirst(entry), this);
    }
    findLast(entry) {
        const li = this._listInternal;
        return li && ensureExternal(this._findLast(entry), this);
    }
    addFirst(entry) {
        this._listInternal.addNodeBefore(new InternalNode(entry));
        return this;
    }
    addLast(entry) {
        return this.add(entry);
    }
    takeFirstValue() {
        const n = this._listInternal.first;
        return this._removeNodeInternal(n) ? n === null || n === void 0 ? void 0 : n.value : undefined;
    }
    removeFirst() {
        return this._removeNodeInternal(this._listInternal.first);
    }
    // get methods are available for convenience but is an n*index operation.
    takeLastValue() {
        const n = this._listInternal.last;
        return this._removeNodeInternal(n) ? n === null || n === void 0 ? void 0 : n.value : undefined;
    }
    removeLast() {
        return this._removeNodeInternal(this._listInternal.last);
    }
    removeAt(index) {
        return this._removeNodeInternal(this._listInternal.getNodeAt(index));
    }
    // Returns true if successful and false if not found (already removed).
    removeNode(node) {
        return this._removeNodeInternal(getInternal(node, this));
    }
    addBefore(before, entry) {
        this._listInternal.addNodeBefore(new InternalNode(entry), getInternal(before, this));
        return this;
    }
    addAfter(after, entry) {
        this._listInternal.addNodeAfter(new InternalNode(entry), getInternal(after, this));
        return this;
    }
    get version() {
        return this._listInternal.version;
    }
    assertVersion(version) {
        return this._listInternal.assertVersion(version);
    }
    getCount() {
        return this._listInternal.unsafeCount;
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
exports.LinkedList = LinkedList;
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
exports.default = LinkedList;
//# sourceMappingURL=LinkedList.js.map