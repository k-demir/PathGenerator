const FibonacciHeap = require('../utils/fibonacciHeap');

describe('Insertion', () => {
  let heap
  beforeEach(() => {
    heap = new FibonacciHeap()
  })

  describe('After one insertion', () => {
    beforeEach(() => {
      heap.push(1)
    })

    test('the inserted node is the head of the root list', () => {
      expect(heap.rootList.value).toBe(1)
    })
  
    test('the inserted node has no parent or children', () => {
      expect(heap.rootList.parent).toBe(null)
      expect(heap.rootList.childList).toBe(null)
    })
  
    test('the nodes to the left and right of the inserted node are the node itself', () => {
      expect(heap.rootList.left).toBe(heap.rootList)
      expect(heap.rootList.right).toBe(heap.rootList)
    })
  
    test('the inserted node is the smallest one', () => {
      expect(heap.minNode.value).toBe(1)
    })
  })
  
  describe('After multiple insertions', () => {
    beforeEach(() => {
      heap.push(2)
      heap.push(1)
      heap.push(3)
    })

    test('all nodes are contained in the root list', () => {
      expect(heap.rootList.value).toBe(2)
      expect(heap.rootList.right.value).toBe(1)
      expect(heap.rootList.right.right.value).toBe(3)
      expect(heap.rootList.right.right.right.value).toBe(2)
    })

    test('the minimum value node is stored correctly', () => {
      expect(heap.minNode.value).toBe(1)
    })

  })
})

describe('Pop minimum', () => {
  let heap
  beforeEach(() => {
    heap = new FibonacciHeap()
  })

  describe('On an empty heap', () => {
    test('null is returned', () => {
      expect(heap.popMinimum()).toBe(null)
    })
  })

  describe('On a heap with one root node', () => {
    beforeEach(() => {
      heap.push(1)
    })
    
    test('the value of the only node is returned', () => {
      expect(heap.popMinimum().value).toBe(1)
    })

    test('the heap is empty after the operation', () => {
      heap.popMinimum()
      expect(heap.rootList).toBe(null)
      expect(heap.minNode).toBe(null)
    })
  })

  describe('On a heap with multiple root nodes', () => {
    beforeEach(() => {
      [2, 1, 3, 5, 1, 3, 9, 4, 7].forEach(val => heap.push(val))
    })
    
    test('the value of the minimum node is returned', () => {
      expect(heap.popMinimum().value).toBe(1)
      expect(heap.popMinimum().value).toBe(1)
      expect(heap.popMinimum().value).toBe(2)
    })

    test('the number of nodes is decreased by one', () => {
      const originalNodes = heap.nNodes
      heap.popMinimum()
      expect(heap.nNodes).toBe(originalNodes - 1)
    })

    test('the heap is consolidated correctly', () => {
      heap.popMinimum()
      expect(heap.rootList.value).toBe(1)
      expect(heap.rootList.childList.value).toBe(5)
      expect(heap.rootList.childList.right.value).toBe(2)
      expect(heap.rootList.childList.right.childList.value).toBe(3)
      expect(heap.rootList.childList.left.value).toBe(3)
      expect(heap.rootList.childList.left.childList.value).toBe(9)
      expect(heap.rootList.childList.left.childList.right.value).toBe(4)
      expect(heap.rootList.childList.left.childList.right.childList.value).toBe(7)
    })
  })
})

describe('Decrease value', () => {
  let heap
  beforeEach(() => {
    heap = new FibonacciHeap();
    [2, 1, 3, 5, 1, 3, 9, 4, 7].forEach(val => heap.push(val))
    heap.popMinimum()
  })

  test('heap is not changed if it is still valid', () => {
    const nodeToChange = heap.rootList.childList.left.childList
    const originalParent = nodeToChange.parent
    heap.decreaseValue(nodeToChange, 4)
    expect(nodeToChange.parent).toBe(originalParent)
  })

  test('node is moved to the root list if needed', () => {
    const nodeToChange = heap.rootList.childList.left.childList
    const originalParent = nodeToChange.parent
    expect(nodeToChange.parent.value).toBe(3)
    expect(originalParent.lostChild).toBe(false)
    heap.decreaseValue(nodeToChange, 2)
    expect(nodeToChange.parent).toBe(null)
    expect(originalParent.lostChild).toBe(true)
  })

  test('parents that have lost multiple children are moved to the root list', () => {
    const nodeToChange1 = heap.rootList.childList.left.childList
    const originalParent = nodeToChange1.parent
    heap.decreaseValue(nodeToChange1, 2)
    const nodeToChange2 = heap.rootList.childList.left.childList
    expect(nodeToChange2.value).toBe(4)
    heap.decreaseValue(nodeToChange2, 2)
    expect(nodeToChange1.parent).toBe(null)
    expect(nodeToChange2.parent).toBe(null)
    expect(originalParent.parent).toBe(null)
    expect(Array.from(heap._iterateLinkedList(heap.rootList))
      .map(n => n.value)
      .sort()
    ).toEqual([1, 2, 2, 3])
  })
})