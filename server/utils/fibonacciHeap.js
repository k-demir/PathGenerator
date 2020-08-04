
class HeapNode {
  value
  key
  parent = null
  childList = null
  left = null
  right = null
  degree = 0
  lostChild = false

  constructor(value, key = null) {
    this.value = value
    this.key = key
  }
}

class FibonacciHeap {
  #minNode = null
  #rootLinkedList = null;
  #nNodes = 0

  get minNode() { return this.#minNode }
  get rootList() { return this.#rootLinkedList }
  get nNodes() { return this.#nNodes }

  push(value, key = null) {
    const node = new HeapNode(value, key)
    if (this.#rootLinkedList === null) {
      node.left = node
      node.right = node
      this.#rootLinkedList = node
    } else {
      this._mergeToList(node)
    }
    if (this.#minNode === null || this.#minNode.value > value) {
      this.#minNode = node
    }
    this.#nNodes += 1
    return node
  }

  popMinimum() {
    if (this.#minNode === null)
      return null

    const minNode = this.#minNode
    if (minNode.childList !== null) {
      for (let child of Array.from(this._iterateLinkedList(minNode.childList))) {
        child.parent = null
        this._mergeToList(child)
      }
    }
    this._removeFromList(minNode)
    if (minNode.left === minNode) {
      this.#minNode = null
    } else {
      this.#minNode = minNode.right
      this._cleanUp()
    }
    this.#nNodes -= 1
    return minNode
  }

  decreaseValue(node, val) {
    if (val >= node.value)
      return
    node.value = val
    let parentNode = node.parent
    if (parentNode !== null && node.value < parentNode.value) {
      this._moveChildToRootList(node, parentNode)
      let newParent = parentNode
      while (parentNode.lostChild == true) {
        newParent = parentNode.parent
        this._moveChildToRootList(parentNode, newParent)
        parentNode = newParent
      }
      if (newParent.parent !== null) {
        newParent.lostChild = true
      }
    }
    if (node.value < this.#minNode.value)
      this.#minNode = node
  }

  _moveChildToRootList(node, parent) {
    this._removeFromList(node, parent)
    this._mergeToList(node)
    parent.degree -= 1
    node.parent = null
    node.lostChild = false
  }

  _cleanUp() {
    const arr = new Array(this.#nNodes).fill(null)
    const rootNodes = Array.from(this._iterateLinkedList(this.#rootLinkedList))
    for (const rootNode of rootNodes) {
      let node = rootNode
      let deg = node.degree
      while (arr[deg] !== null) {
        let node2 = arr[deg]
        if (node.value > node2.value) {
          let tmp = node
          node = node2
          node2 = tmp
        }
        this._combine(node, node2)
        arr[deg] = null
        deg += 1
      }
      arr[deg] = node
      if (this.#minNode === null || this.#minNode.value > node.value) {
        this.#minNode = node
      }
    }
  }

  isEmpty() {
    if (this.#rootLinkedList === null)
      return true
    return false
  }

  _combine(min, max) {
    this._removeFromList(max)
    this._mergeToList(max, min)
    max.parent = min
    min.degree += 1
    max.lostChild = false
    return min
  }

  _mergeToList(node, parent = null) {
    if (parent === null) {
      node.left = this.#rootLinkedList.left
      node.right = this.#rootLinkedList
      this.#rootLinkedList.left.right = node
      this.#rootLinkedList.left = node
    } else if (parent.childList === null) {
      node.left = node
      node.right = node
      parent.childList = node
    } else {
      node.left = parent.childList.left
      node.right = parent.childList
      parent.childList.left.right = node
      parent.childList.left = node
    }
  }

  _removeFromList(node, parent = null) {
    if (parent === null && this.#rootLinkedList === node) {
      this.#rootLinkedList = node.right === node ? null : node.right
    } else if (parent !== null && parent.childList === parent.childList.right) {
      parent.childList = null
    } else if (parent !== null && parent.childList === node) {
      parent.childList = node.right
      node.right.parent = parent
    }
    node.left.right = node.right
    node.right.left = node.left
  }

  *_iterateLinkedList(startNode) {
    let node = startNode
    do {
      yield node
      node = node.right
    } while (node !== startNode)
  }
}

module.exports = FibonacciHeap