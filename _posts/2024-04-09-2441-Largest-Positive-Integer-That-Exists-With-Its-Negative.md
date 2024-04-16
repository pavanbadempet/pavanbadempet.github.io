---
layout: post
title: "2441. Largest Positive Integer That Exists With Its Negative"
date: 2024-04-09
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [2441. Largest Positive Integer That Exists With Its Negative](https://leetcode.com/problems/largest-positive-integer-that-exists-with-its-negative/description/)

## Intuition
Using dictionary to keep track of whether a positive and negative value of a number has been encountered or not. The maximum absolute value that satisfies this condition is returned.

## Approach
1. Initialize an empty dictionary dic to keep track of whether a positive and negative value of a number has been encountered or not.
2. Initialize maxi to -1 to keep track of the maximum absolute value encountered so far.
3. Iterate through each number num in the nums list.
    - For each num, update the dictionary entry for its absolute value in such a way that it tracks if both positive and negative counterparts have been seen.
    - If both positive and negative counterparts of num have been seen and its absolute value is greater than maxi, update maxi to be the absolute value of num.
4. Return maxi.

## Complexity
- Time complexity:
O(n), where n is the length of the nums list. This is because we iterate through each element in the nums list once. Within the loop, the code performs dictionary operations like get() and assignments. Dictionary operations generally have an average time complexity of O(1). The overall time complexity of the loop is O(n) because the dominant factor is the loop iterating through each element in the nums list.

- Space complexity:
O(n), where n is the number of unique absolute values encountered in the nums list. This is because we use a dictionary dic to keep track of whether both positive and negative counterparts of each number have been seen.

## Code
```python
class Solution:
    def findMaxK(self, nums: List[int]) -> int:
        dic = {}
        maxi = -1
        for num in nums:
            dic[abs(num)] = dic.get(abs(num),{'pos':False,'neg':False})
            if num>0:
                dic[abs(num)]['pos'] = True
            else:
                dic[abs(num)]['neg'] = True
            if dic[abs(num)]['pos'] == True and dic[abs(num)]['neg'] == True and abs(num)>maxi:
                maxi=abs(num)
        return maxi
```

## Similar Problem:
[2441. Largest Positive Integer That Exists With Its Negative](https://leetcode.com/problems/greatest-english-letter-in-upper-and-lower-case/description/)