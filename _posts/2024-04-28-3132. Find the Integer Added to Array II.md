---
layout: post
title: "3132. Find the Integer Added to Array II"
date: 2024-04-28
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [3131. Find the Integer Added to Array I](https://leetcode.com/problems/find-the-integer-added-to-array-i/description/)

# Intuition
Given two arrays nums1 and nums2 of equal length, where each element in nums1 has been increased (or decreased in the case of negative) by an integer x, we aim to find the value of x such that nums1 becomes equal to nums2. Since both arrays should contain the same integers with the same frequencies after applying x, we can determine x by comparing the sum of elements in nums1 and nums2.

# Approach
1. Calculate the sum of all elements in nums1 and nums2.
2. Subtract the sum of nums1 from the sum of nums2 to find the difference, which represents the value of x.
3. Divide the difference by the length of nums1 to get the value of x.
4. Return the value of x.

# Complexity
- Time complexity:
O(n), where n is the length of nums1 (or nums2 since they have the same length). We iterate through both arrays once to calculate their sums.

- Space complexity:
O(1), as we use only a constant amount of extra space.

# Code
```python
class Solution:
    def addedInteger(self, nums1: List[int], nums2: List[int]) -> int:
        return (sum(nums2) - sum(nums1))//len(nums1)
```