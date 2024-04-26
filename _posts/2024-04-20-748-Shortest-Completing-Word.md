---
layout: post
title: "748. Shortest Completing Word"
date: 2024-04-20
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [748. Shortest Completing Word](https://leetcode.com/problems/shortest-completing-word/description/)

# Intuition
First creating a character count for the cleaned and lowercased characters of the license plate. Then, each word in the given list is iterated through, and for each word, another character count is created. It's checked if the word contains all the characters from the license plate. If so, and if it's shorter than the current shortest completing word found so far, it becomes the new shortest completing word. Finally, the shortest completing word found is returned as the solution.

# Approach
1. Create a Counter object valid for the cleaned and lowercased characters of the license plate, containing only alphabetic characters.
2. Initialize an empty string ans to store the shortest completing word found so far.
3. Iterate through each word i in the list words.
    - Create a Counter object j for the characters of the current word i.
    - Check if the count of each character in valid is less than or equal to the count of the same character in j.
    - If the current word i contains all the characters from the license plate, and it is shorter than the current ans, update ans to be i.
4. Return the shortest completing word found.

# Complexity
- Time complexity:
O(m * (k + n)), constructing the valid counter from the licensePlate incurs a linear runtime of O(n), where n represents the length of the licensePlate string. Subsequently, iterating through each word in the words list adds complexity proportional to the number of words, denoted as m. Within each iteration, generating a counter for the current word takes O(k) time, where k denotes the length of the word. Moreover, verifying whether the word contains sufficient occurrences of each character from the valid counter extends the time complexity to O(n) for each word. 

- Space complexity:
O(n + k), valid counter requires O(n) space, where n denotes the count of unique characters in the licensePlate string. Additionally, the space consumption includes the ans string, necessitating O(k) space, corresponding to the length of the shortest completing word. Moreover, the creation of a new counter j for each word within the iteration further contributes O(k) space per word, where k signifies the length of the respective word.

# Code
```python
from collections import Counter
class Solution:
    def shortestCompletingWord(self, licensePlate: str, words: List[str]) -> str:
        valid = Counter("".join(x.lower() for x in licensePlate if x.isalpha()))
        ans = ""
        for i in words:
            j = Counter(i)
            if all(j.get(c,0) >= valid[c] for c in valid):
                if not ans or len(i)<len(ans):
                    ans = i
        return ans
```