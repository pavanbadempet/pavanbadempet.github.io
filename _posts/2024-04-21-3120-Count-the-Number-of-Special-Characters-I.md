---
layout: post
title: "3120. Count the Number of Special Characters I"
date: 2024-04-21
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [3120. Count the Number of Special Characters I](https://leetcode.com/problems/count-the-number-of-special-characters-i/description/)

# Intuition
To count the number of special characters in the given word, we first convert the word into a set to obtain unique characters. Then, we initialize an empty set to keep track of the lowercase versions of characters encountered. We iterate through each unique character in the set, converting it to lowercase. If the lowercase character is not present in the tracking set, we add it. If it's already present, indicating that both lowercase and uppercase versions exist, we remove it from the tracking set and increment the count of special characters. Finally, we return the count of special characters. This approach ensures that each special character is counted only once, regardless of its case.

# Approach
1. Convert the input word into a set w to get unique characters.
2. Initialize an empty set a to keep track of the lowercase versions of characters encountered.
3. Initialize a variable count to store the count of special characters.
4. Iterate through each character i in the set w.
    - Convert i to lowercase and store it in the variable p.
    - If p is not in set a, add it to set a.
    - If p is already in set a, remove it and increment count.
5. Return count.
# Complexity
- Time complexity:
Time complexity: O(n), where n is the length of the word. The function iterates through each character of the word once.

- Space complexity:
Space complexity: O(n), where n is the number of unique characters in the word. This is because we use sets w and a to store unique characters.

# Code
```python
class Solution:
    def numberOfSpecialChars(self, word: str) -> int:
        w = set(word)
        a = set()
        count = 0
        for i in w:
            p = i.lower()
            if p not in a:
                a.add(p)
            else:
                a.remove(p)
                count+=1
        return count
```