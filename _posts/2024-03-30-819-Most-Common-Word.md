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

Problem Link: [2176. Count Equal and Divisible Pairs in an Array](https://leetcode.com/problems/most-common-word/)

## Intuition
Count the occurrences of each word into a dictionary, disregard banned words, keep track of most common word.

## Approach
1. Initialize an empty dictionary counts to store the counts of each word.
2. Convert the banned list into a set for faster lookup.
3. Initialize maxi as a list containing an empty string and 0. This will store the most common word and its count encountered so far.
4. Replace punctuations in the paragraph with spaces to ensure proper word separation.
5. Convert the paragraph to lowercase and split it into words.
6. Iterate through each word k in the paragraph.
    - If k is not in the banned set, increment its count in the counts dictionary.
    - Update maxi if the count of the current word is greater than the count of the word stored in maxi.
7. Return the most common word stored in maxi.

## Complexity
- Time complexity: 
O(n * m + k), the operation of replacing punctuations with spaces involves iterating over the paragraph string once and replacing each punctuation character with a space. Let's denote the length of the paragraph as n and the length of the set of punctuations as m. So, the time complexity for this operation is O(n * m). The operation of converting the paragraph to lowercase involves iterating over the paragraph string once and converting each character to lowercase. This also has a time complexity of O(n). Splitting the paragraph into words is done using the split() function, which has a time complexity of O(n) where n is the length of the paragraph. Counting the occurrences of each word involves iterating over the list of words once. Let's denote the number of words after splitting as k. In the worst case, all words are unique, so we have to insert all k words into the counts dictionary. Each insertion operation into a dictionary typically takes O(1) time, so the overall complexity of this step is O(k).

- Space complexity:
O(k), the space complexity mainly depends on the size of the counts dictionary and the maxi list. The size of the counts dictionary can grow up to the number of unique words in the paragraph. In the worst case, where all words are unique and not banned, the size of the counts dictionary would be equal to the number of words in the paragraph. The maxi list contains two elements. Hence, its space complexity is O(1). Apart from these, there are some auxiliary variables which occupy constant space. Thus, the space complexity is primarily determined by the size of the counts dictionary, which is O(k) in the worst case.

## Code
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
