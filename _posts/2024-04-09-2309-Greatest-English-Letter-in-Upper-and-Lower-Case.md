---
layout: post
title: "2309. Greatest English Letter in Upper and Lower Case"
date: 2024-04-09
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [2309. Greatest English Letter in Upper and Lower Case](https://leetcode.com/problems/greatest-english-letter-in-upper-and-lower-case/description/)

### Intuition
Using a dictionary to keep track of whether an uppercase and lowercase version of a character has been encountered or not. The maximum uppercase character that satisfies this condition is returned.

### Approach
1. Initialize an empty dictionary dic to keep track of whether an uppercase and lowercase version of a character has been encountered or not.
2. Initialize maxi to an empty string to keep track of the maximum uppercase character encountered so far.
3. Iterate through each character i in the string s.
    - For each i, update the dictionary entry for its uppercase version in such a way that it tracks if both uppercase and lowercase counterparts have been seen.
    - If both uppercase and lowercase counterparts of i have been seen and its uppercase version is greater than maxi, update maxi to be the uppercase version of i.
4. Return maxi.

### Complexity
- Time complexity:
O(n), where n is the length of the s. This is because we iterate through each element in the s once. Within the loop, the code performs dictionary operations like get() and assignments. Dictionary operations generally have an average time complexity of O(1). The overall time complexity of the loop is O(n) because the dominant factor is the loop iterating through each character in the s.

- Space complexity:
O(n), where n is the number of unique characters encountered in the string s. This is because we use a dictionary dic to keep track of whether both uppercase and lowercase counterparts of each character have been seen.

### Code
```
class Solution:
    def greatestLetter(self, s: str) -> str:
        dic = {}
        maxi = ""
        for i in s:
            dic[i.upper()] = dic.get(i.upper(),{'Upper':False,'Lower':False})
            if i == i.upper():
                dic[i.upper()]['Upper'] = True
            else:
                dic[i.upper()]['Lower'] = True
            if dic[i.upper()]['Upper'] == True and dic[i.upper()]['Lower'] == True and i.upper()>maxi:
                maxi = i.upper()
        return maxi

```

## Similar Problem:
[2441. Largest Positive Integer That Exists With Its Negative](https://leetcode.com/problems/largest-positive-integer-that-exists-with-its-negative/description/)