---
layout: post
title: "707. Design Linked List"
date: 2024-04-27
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [707. Design Linked List](https://leetcode.com/problems/design-linked-list/description/)

# 1. Singly Linked List
## Intuition
Implementing a singly linked list. Each node contains a value (val) and a reference to the next node (next). We'll also consider methods for adding, getting, and deleting nodes from the list.

## Approach
1. Initialization: In the __init__ method of MyLinkedList, we initialize the linked list with a head, a tail, and a size.
2. Getting a Node: In the get method, we traverse the linked list until we reach the desired index and return the value of that node. If the index is invalid, we return -1.
3. Adding at the Head: In the addAtHead method, we create a new node with the given value and update the head to point to this new node. If the list is empty, we also update the tail. We increment the size.
4. Adding at the Tail: In the addAtTail method, we create a new node with the given value and update the next reference of the current tail to point to this new node. We then update the tail to be this new node and increment the size.
5. Adding at a Given Index: In the addAtIndex method, we create a new node with the given value and insert it before the node at the specified index. We handle cases where the index is at the head or tail separately. We traverse the list to find the node at the previous index, update its next reference, and increment the size.
6. Deleting at a Given Index: In the deleteAtIndex method, we remove the node at the specified index. We handle cases where the index is at the head or tail separately. We traverse the list to find the node at the previous index, update its next reference to skip the node to be deleted, and decrement the size.

## Complexity
- Time complexity:
    - get: O(n), where n is the index of the node being retrieved.
    - addAtHead: O(1).
    - addAtTail: O(1).
    - addAtIndex: O(n), since we may need to traverse the list to find the node at the previous index.
    - deleteAtIndex: O(n), since we may need to traverse the list to find the node at the previous index.

- Space complexity:
O(1), as we only store references to nodes and do not use additional data structures.

## Code
```python
class ListNode:
    def __init__(self,val):
        self.val = val
        self.next = None
class MyLinkedList:
    def __init__(self):
        self.head = self.tail = None
        self.size = 0

    def get(self, index: int) -> int:
        if index < 0 or index >= self.size:
            return -1
        curr = self.head
        for _ in range(index):
            curr = curr.next
        return curr.val

    def addAtHead(self, val: int) -> None:
        node = ListNode(val)
        if not self.head:
            self.head = self.tail = node
        else:
            node.next = self.head
            self.head = node
        self.size += 1

    def addAtTail(self, val: int) -> None:
        node = ListNode(val)
        if not self.head:
            self.head = self.tail = node
        else:
            self.tail.next = node
            self.tail = node
        self.size += 1

    def addAtIndex(self, index: int, val: int) -> None:
        if index < 0 or index > self.size:
            return
        if index == 0:
            self.addAtHead(val)
        elif index == self.size:
            self.addAtTail(val)
        else:
            node = ListNode(val)
            curr = self.head
            for _ in range(index-1):
                curr = curr.next
            node.next = curr.next
            curr.next = node
            self.size +=1

    def deleteAtIndex(self, index: int) -> None:
        if index < 0 or index >= self.size:
            return
        if index == 0:
            if self.size == 1:
                self.head = self.tail = None
            else:
                self.head = self.head.next
        else:
            curr = self.head
            for _ in range(index-1):
                curr = curr.next
            if curr.next == self.tail:
                self.tail = curr
            curr.next = curr.next.next
        self.size-=1
```


---



# 2. Doubly Linked List
## Intuition
Implementing a doubly linked list. Each node contains a value (val), a reference to the next node (next), and a reference to the previous node (prev). We'll consider methods for adding, getting, and deleting nodes from the list.

## Approach
1. Initialization: In the __init__ method of MyLinkedList, we initialize the linked list with a head, a tail, and a size.
2. Getting a Node: In the get method, we traverse the linked list until we reach the desired index and return the value of that node. If the index is invalid, we return -1.
3. Adding at the Head: In the addAtHead method, we create a new node with the given value and update the head to point to this new node. If the list is empty, we also update the tail. We increment the size.
4. Adding at the Tail: In the addAtTail method, we create a new node with the given value and update the previous reference of the current tail to point to this new node. We then update the tail to be this new node and increment the size.
5. Adding at a Given Index: In the addAtIndex method, we create a new node with the given value and insert it before the node at the specified index. We handle cases where the index is at the head or tail separately. We traverse the list to find the node at the previous index, update its next reference, and increment the size.
6. Deleting at a Given Index: In the deleteAtIndex method, we remove the node at the specified index. We handle cases where the index is at the head or tail separately. We traverse the list to find the node at the previous index, update its next reference to skip the node to be deleted, and decrement the size.

## Complexity
- Time complexity:
    - get: O(n), where n is the index of the node being retrieved.
    - addAtHead: O(1).
    - addAtTail: O(1).
    - addAtIndex: O(n), since we may need to traverse the list to find the node at the previous index.
    - deleteAtIndex: O(n), since we may need to traverse the list to find the node at the previous index.

- Space complexity:
O(1), as we only store references to nodes and do not use additional data structures.

## Code
```python
class ListNode:
    def __init__(self, val):
        self.prev = None
        self.val = val
        self.next = None
class MyLinkedList:

    def __init__(self):
        self.head = self.tail = None
        self.size = 0

    def get(self, index: int) -> int:
        if index < 0 or index >= self.size:
            return -1
        curr = self.head
        for _ in range(index):
            curr = curr.next
        return curr.val

    def addAtHead(self, val: int) -> None:
        node = ListNode(val)
        if not self.head:
            self.head = self.tail = node
        else:
            node.next = self.head
            self.head.prev = node
            self.head = node
        self.size+=1

    def addAtTail(self, val: int) -> None:
        node = ListNode(val)
        if not self.head:
            self.head = self.tail = node
        else:
            node.prev = self.tail
            self.tail.next = node
            self.tail = node
        self.size += 1

    def addAtIndex(self, index: int, val: int) -> None:
        if index < 0 or index > self.size:
            return
        if index == 0:
            self.addAtHead(val)
        elif index == self.size:
            self.addAtTail(val)
        else:
            node = ListNode(val)
            curr = self.head
            for _ in range(index-1):
                curr = curr.next
            node.prev = curr
            node.next = curr.next
            curr.next = node
            self.size += 1

    def deleteAtIndex(self, index: int) -> None:
        if index < 0 or index >= self.size:
            return
        if index == 0:
            if not self.head:
                self.head = self.tail = None
            else:
                self.head = self.head.next
        else:
            curr = self.head
            for _ in range(index-1):
                curr = curr.next
            if curr.next == self.tail:
                self.tail = curr
                self.tail.next = None
            else:
                temp = curr.next.next
                curr.next = curr.next.next
                temp.prev = curr
        self.size-=1
```