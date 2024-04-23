---
layout: post
title: "2570. Merge Two 2D Arrays by Summing Values"
date: 2024-04-17
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [2570. Merge Two 2D Arrays by Summing Values](https://leetcode.com/problems/merge-two-2d-arrays-by-summing-values/description/)

# Intuition
Merging two lists of lists into a single list of lists while summing up the values of lists with the same ID. This is achieved by iterating through each pair of ID and value in the combined list, updating a dictionary with the sums of values corresponding to each ID. Finally, the dictionary items are sorted based on the ID to obtain the merged arrays.

# Approach
1. Combine the two input lists nums1 and nums2 into a single list nums.
2. Create an empty dictionary dic to store the sums of values corresponding to each ID.
3. Iterate through each pair (id, val) in the nums list.
    - For each pair, update the dictionary entry for the ID by adding the value to the existing sum (or 0 if the ID is encountered for the first time).
4. Sort the dictionary items based on the ID.
5. Return the sorted list of tuples representing the merged arrays.

# Complexity
- Time complexity:
O(n * log(n)), where n is the total number of elements in both nums1 and nums2. This is because sorting the dictionary items takes O(n * log(n)) time.

- Space complexity:
O(n), where n is the total number of unique IDs in nums1 and nums2. This is because the dictionary dic could potentially contain an entry for each unique ID.

# Code
```python
class Solution:
    def mergeArrays(self, nums1: List[List[int]], nums2: List[List[int]]) -> List[List[int]]:
        nums = nums1 + nums2
        dic = {}
        for id, val in nums:
            dic[id] = val + dic.get(id, 0)
        result = sorted(dic.items())
        return result
```