import { LinkedNodeList } from '@tsdotnet/linked-node-list';
import { ArgumentNullException, InvalidOperationException } from '@tsdotnet/exceptions';
import { CollectionBase, ExtendedIterable } from '@tsdotnet/collection-base';
import { areEqual } from '@tsdotnet/compare';

/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT
 */
class InternalNode {
    value;
    external;
    previous;
    next;
    constructor(value) {
        this.value = value;
    }
}
function ensureExternal(node, list) {
    if (!node)
        return undefined;
    let external = node.external;
    if (!external)
        node.external = external = new InternalLinkedListNode(list, node);
    return external;
}
function getInternal(node, list) {
    if (!node)
        throw new ArgumentNullException('node');
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
class LinkedList extends CollectionBase {
    _listInternal = new LinkedNodeList();
    constructor(initialValues, equalityComparer = areEqual) {
        super(equalityComparer);
        if (initialValues)
            this._addEntries(initialValues);
    }
    get first() {
        return ensureExternal(this._listInternal.first, this);
    }
    get firstValue() {
        return this._listInternal.first?.value;
    }
    get last() {
        return ensureExternal(this._listInternal.last, this);
    }
    get lastValue() {
        return this._listInternal.last?.value;
    }
    get version() {
        return this._listInternal.version;
    }
    removeOnce(item) {
        return this.remove(item, 1) !== 0;
    }
    getValueAt(index) {
        return this._listInternal.getNodeAt(index)?.value;
    }
    getNodeAt(index) {
        return ensureExternal(this._listInternal.getNodeAt(index), this);
    }
    find(item) {
        return ensureExternal(this._findFirst(item), this);
    }
    findLast(item) {
        const li = this._listInternal;
        return li && ensureExternal(this._findLast(item), this);
    }
    addFirst(item) {
        this._listInternal.addNodeBefore(new InternalNode(item));
        return this;
    }
    addLast(item) {
        return this.add(item);
    }
    takeFirstValue() {
        const n = this._listInternal.first;
        return this._removeNodeInternal(n) ? n?.value : undefined;
    }
    removeFirst() {
        return this._removeNodeInternal(this._listInternal.first);
    }
    takeLastValue() {
        const n = this._listInternal.last;
        return this._removeNodeInternal(n) ? n?.value : undefined;
    }
    removeLast() {
        return this._removeNodeInternal(this._listInternal.last);
    }
    removeAt(index) {
        return this._removeNodeInternal(this._listInternal.getNodeAt(index));
    }
    removeNode(node) {
        return this._removeNodeInternal(getInternal(node, this));
    }
    addBefore(before, item) {
        const internal = getInternal(before, this);
        this._listInternal.addNodeBefore(new InternalNode(item), internal);
        return this;
    }
    addAfter(after, item) {
        const internal = getInternal(after, this);
        this._listInternal.addNodeAfter(new InternalNode(item), internal);
        return this;
    }
    incrementVersion() {
        return this._listInternal.incrementVersion();
    }
    assertVersion(version) {
        return this._listInternal.assertVersion(version);
    }
    getCount() {
        return this._listInternal.unsafeCount;
    }
    *_getIterator() {
        for (const n of this._listInternal) {
            yield n.value;
        }
    }
    _reversed;
    get reversed() {
        const _ = this;
        return (_._reversed || (_._reversed = Object.freeze(ExtendedIterable.create({
            *[Symbol.iterator]() {
                for (const n of _._listInternal.reversed) {
                    yield n.value;
                }
            }
        }))));
    }
    _addInternal(item) {
        this._listInternal.addNode(new InternalNode(item));
        return true;
    }
    _removeInternal(item, max = Infinity) {
        const equals = this._equalityComparer, list = this._listInternal;
        let removedCount = 0;
        let next = list.first;
        while (next && removedCount < max) {
            const current = next;
            next = next.next;
            if (equals(item, current.value) && this._removeNodeInternal(current))
                removedCount++;
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
    _findFirst(item) {
        const equals = this._equalityComparer;
        let next = this._listInternal.first;
        while (next) {
            if (equals(item, next.value))
                return next;
            next = next.next;
        }
        return undefined;
    }
    _findLast(item) {
        const equals = this._equalityComparer;
        let prev = this._listInternal.last;
        while (prev) {
            if (equals(item, prev.value))
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
class InternalLinkedListNode {
    _list;
    _nodeInternal;
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
    addBefore(item) {
        this.throwIfDetached();
        this._list.addBefore(this, item);
        return this;
    }
    addAfter(item) {
        this.throwIfDetached();
        this._list.addAfter(this, item);
        return this;
    }
    remove() {
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

export { LinkedList as default };
//# sourceMappingURL=LinkedList.js.map
