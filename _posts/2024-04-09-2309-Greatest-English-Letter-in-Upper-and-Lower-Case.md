---
layout: post
title: "2309. Greatest English Letter in Upper and Lower Case"
date: 2024-04-09
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [2309. Greatest English Letter in Upper and Lower Case](https://leetcode.com/problems/greatest-english-letter-in-upper-and-lower-case/description/)

## Intuition
Using a stack-based approach allows us to efficiently remove digits while maintaining the order and forming the smallest possible number. By greedily selecting digits and removing them as needed, we can achieve the desired result in linear time complexity.

## Approach
1. Intialize an empty stack.
2. Iterate through every number in the num.
    - Loop until stack is not empty and k>0 and stack[-1]>i ie.top of the stack is greater than current number i, pop from the stack all those elements which are larger than the current number at the same time decrementing k.
    - Append the number i into the stack.
3. After iterating through all the numbers in num in some cases we might have k still left (this in cases of continues values or series of increasing values lets say like num = [1,3,5] k=2 in such cases the condiation of stack[-1]>i never holds true so k will remain so. So we need to handle this.) so we remove those numbers from the end of the stack by slicing those last nummber (Why the last numbers? Because the k>0 is posssible because of increasing series of numbers num = [1,3,5] k =2 then slice it until :-k.
4. We need to handle those cases where there might be a leading zero as well. So we can just convert the stack into a string ans and strip all the leading zeros.
5. if our ans is not an empty string at the end we can return the ans otherwise return '0'.

## Complexity
- Time complexity:
0(n), where n is the length of the input string num. This complexity arises from iterating through each character in num, performing stack operations, and joining the elements of the stack. Other operations within the function also contribute linearly to the overall time complexity.

- Space complexity:
0(n), the space complexity is dominated by the stack list. In the worst case, the stack can contain all elements of the num string.

## Code
```python
class Solution:
    def removeKdigits(self, num: str, k: int) -> str:
        # Example test case num = "1432219", k = 3
        stack = []
        for i in num:
            while stack and k > 0 and stack[-1] > i:
                stack.pop()
                k -= 1
            stack.append(i)
        # Example Test Case 2: num = "10", k = 2
        if k > 0:
            stack = stack[:-k] 
        # Example Test Case 3: num = "10200", k = 1
        ans = ''.join(stack).lstrip('0')
        if ans:
            return ans
        return '0'
```
