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

Problem Link: [3131. Find the Integer Added to Array I](https://leetcode.com/problems/find-the-integer-added-to-array-ii/solutions/)

# Intuition
Solving by sorting the arrays and iterating through all possibilities for minimum difference. 
# Approach
1. Sort both nums1 and nums2 to simplify comparison.
2. Iterate through all pairs of indices (i, j) in nums1 (with i < j).
    - Create a new array new_nums1 by removing elements at indices i and j from nums1.
    - Calculate the difference (diff) between the first elements of nums2 and new_nums1.
    - Check if adding diff to each element of new_nums1 results in nums2.
    - If yes, update the minimum difference (min_diff) with the current diff.
3. Finally, return min_diff as the minimum possible integer x.

# Complexity
- Time complexity:
O(n^2), where n is the length of nums1. We iterate through all pairs of indices (i, j) in nums1.

- Space complexity:
O(n), where n is the length of nums1. We create a new array new_nums1 for each pair of indices.

# Code
```python
import sys
class Solution:
    def minimumAddedInteger(self, nums1: List[int], nums2: List[int]) -> int:
        nums1.sort()
        nums2.sort()

        min_diff = sys.maxsize

        for i in range(len(nums1)):
            for j in range(i+1, len(nums1)):
                new_nums1 = nums1[:i] + nums1[i+1:j] + nums1[j+1:]
                diff = nums2[0] - new_nums1[0]
                if all(new_nums1[k] + diff == nums2[k] for k in range(len(nums2))):
                    min_diff = min(min_diff, diff)

        return min_diff
```