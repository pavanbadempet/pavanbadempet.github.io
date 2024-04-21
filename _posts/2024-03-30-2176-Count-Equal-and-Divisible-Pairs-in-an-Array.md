---
layout: post
title: "2176. Count Equal and Divisible Pairs in an Array"
date: 2024-03-30
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [2176. Count Equal and Divisible Pairs in an Array](https://leetcode.com/problems/count-equal-and-divisible-pairs-in-an-array/description/)

### Intuition
Using a stack-based approach allows us to efficiently remove digits while maintaining the order and forming the smallest possible number. By greedily selecting digits and removing them as needed, we can achieve the desired result in linear time complexity.

### Approach
1. Initialize a variable count to keep track of the count of such pairs.
2. Create a dictionary counts to store the indices of each number in the input array.
3. Iterate through the input array and populate the counts dictionary.
4. Iterate through the values of the counts dictionary.
    - For each value (list of indices), iterate through pairs of indices (i, j) and check if the product of the elements at those indices is divisible by k.
    - If the product is divisible by k, increment the count variable.
5. Finally, return the count.

### Complexity
- Time complexity:
Let n be the length of the input array. Constructing the counts dictionary takes O(n) time. Then, iterating through the values of the counts dictionary and finding pairs of indices takes O(n^2) time in the worst case. Therefore, the overall time complexity is O(n^2).

- Space complexity:
The space complexity is O(n) due to the counts dictionary.

### Code
```python
class Solution:
    def countPairs(self, nums: List[int], k: int) -> int:
        length = len(nums)
        count = 0
        # If all elements are unique, no pairs can be formed
        if len(set(nums)) == length:
            return count
        counts = {}
        for i in range(length):
            counts[nums[i]] = counts.get(nums[i],[]) + [i]
        for values in counts.values():
            length = len(values)
            if length>1:
                for i in range(length-1):
                    for j in range(i+1,length):
                        if (values[i] * values[j]) % k == 0:
                            count+=1
        return count
```
