---
layout: post
title: "1935. Maximum Number of Words You Can Type"
date: 2024-04-22
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [1935. Maximum Number of Words You Can Type](https://leetcode.com/problems/maximum-number-of-words-you-can-type/description/)

# Intuition
We can solve this problem by splitting the string on space and iterating through each word. For each word, we iterate through the characters of the broken letters. If any character from the broken letters is found in the current word, we skip that word. If none of the characters from the broken letters are found in the word, we count it as a word that can be typed. Finally, we return the count of such words.

# Approach
1. Initialize a variable count to store the count of words that can be typed.
2. Split the input text into individual words using the space character as the delimiter.
3. Iterate through each word w in the list of words:
    - Iterate through each character i in the set of broken letters:
    - If i is found in the current word w, break out of the inner loop.
    - If the inner loop completes without breaking (i.e., none of the broken letters are found in the current word), increment count.
4. Return count.

# Complexity
- Time complexity:
O(n * m), where n is the number of words in the text and m is the length of the broken letters string. The function iterates through each word in the text and checks each character against the broken letters.

- Space complexity:
O(1), as the function uses only a constant amount of extra space.

# Code
```
class Solution:
    def canBeTypedWords(self, text: str, brokenLetters: str) -> int:
        count = 0
        for w in text.split(" "):
            for i in brokenLetters:
                if i in w:
                    break
            else:
                count+=1
        return count
        
```