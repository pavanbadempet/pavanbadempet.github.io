---
layout: post
title: "1859. Sorting the Sentence"
date: 2024-04-19
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [1859. Sorting the Sentence](https://leetcode.com/problems/sorting-the-sentence/description/)

# Intuition
Splitting the input sentence into individual words and initializing an empty list with the same length as the number of words. Iterating through each word, the last character, representing its position in the sorted sentence, is extracted. By converting this character to an integer and adjusting for zero-based indexing, each word is placed in its corresponding position in the output list. Finally, the words in the output list are joined with spaces to form the sorted sentence, which is then returned.

# Approach
1. Split the input sentence s into individual words using the space character as the delimiter.
2. Initialize a list ans with empty strings, where the length of the list is equal to the number of words in the sentence.
3. Iterate through each word w in the list of words:
    - Extract the last character of the word, which represents its position in the sorted sentence.
    - Convert the position character to an integer and subtract 1 (since Python indexing starts from 0).
    - Assign the word (excluding its last character) to the corresponding position in the ans list.
4. Join the words in the ans list with spaces to form the sorted sentence and return it.

# Complexity
- Time complexity:
O(n), where n is the number of words in the sentence s. The function iterates through each word once.

- Space complexity:
O(n), where n is the number of words in the sentence s. This is because we create a list ans to store the sorted words.

# Code
```python
class Solution:
    def sortSentence(self, s: str) -> str:
        words = s.split(" ")
        ans = [""]*len(words)
        for w in words:
            ans[int(w[-1])-1] = w[:-1]
        return " ".join(ans)
            
```