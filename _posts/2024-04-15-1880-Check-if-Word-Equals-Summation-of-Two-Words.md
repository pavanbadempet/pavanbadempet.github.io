---
layout: post
title: "1880. Check if Word Equals Summation of Two Words"
date: 2024-04-15
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [1880. Check if Word Equals Summation of Two Words](https://leetcode.com/problems/check-if-word-equals-summation-of-two-words/description/)

### Intuition
Calculate the numerical values of three given words by converting each character to its ASCII value and summing them up. Then, check if the sum of the first two words equals the numerical value of the third word.

### Approach
1. Initialize variables fw, sw, and tw to represent the numerical values of firstWord, secondWord, and targetWord, respectively.
2. Iterate through the maximum length of the three words using a loop index i.
    - If i is within the length of firstWord, convert the character at index i to its numerical value using ASCII conversion and update fw.
    - If i is within the length of secondWord, convert the character at index i to its numerical value using ASCII conversion and update sw.
    - If i is within the length of targetWord, convert the character at index i to its numerical value using ASCII conversion and update tw.
3. Check if the sum of fw and sw is equal to tw.
4. Return True if the sum is equal, otherwise return False.

### Complexity
- Time complexity:
O(n), where n is the maximum length among the lengths of firstWord, secondWord, and targetWord. The function iterates through each character of the longest word once.

- Space complexity:
O(1), as the function uses only a constant amount of extra space.

### Code
```python
class Solution:
    def isSumEqual(self, firstWord: str, secondWord: str, targetWord: str) -> bool:
        fw = 0
        sw = 0
        tw = 0
        for i in range(max(len(firstWord),len(secondWord),len(targetWord))):
            if i<=len(firstWord)-1:
                fw = fw*10 + ord(firstWord[i]) - ord('a')
            if i<=len(secondWord)-1:
                sw = sw*10 + ord(secondWord[i]) - ord('a')
            if i<=len(targetWord)-1:
                tw = tw*10 + ord(targetWord[i]) - ord('a')
        if fw + sw == tw:
            return True
        return False
```