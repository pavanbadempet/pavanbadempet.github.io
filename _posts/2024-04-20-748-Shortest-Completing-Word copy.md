---
layout: post
title: "3121. Count the Number of Special Characters II"
date: 2024-04-21
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [3121. Count the Number of Special Characters II](https://leetcode.com/problems/count-the-number-of-special-characters-ii/description/)

# Intuition
To count the number of special characters in the given word, we initialize an empty dictionary to track the occurrences of each character and a counter variable to store the count of special characters. Iterating through each character in the word, we check if its lowercase version is not present in the dictionary or its corresponding value is not "NA". If the character is a lowercase letter, we mark its presence in the dictionary. If it's an uppercase letter and its lowercase version exists in the dictionary with the value "Yes", we increment the counter and mark it as encountered. Otherwise, we mark it as encountered and decrement the counter. Finally, we return the counter, which represents the count of special characters in the word. This approach ensures that each special character is counted only once, regardless of its case.

# Approach
1. Initialize an empty dictionary dic to keep track of the occurrences of each character.
2. Initialize a variable count to store the count of special characters.
3. Iterate through each character i in the word.
    - If the lowercase version of i is not in the dictionary or its value is not "NA":
    - If i is a lowercase letter, set its value in the dictionary to "Yes" if it doesn't exist.
    - If i is an uppercase letter:
        - If the lowercase version of i exists in the dictionary and its value is "Yes", increment count and set its value in the dictionary to "NA".
    - Otherwise, set its value in the dictionary to "NA" and decrement count.
4. Return count.
# Complexity
- Time complexity:
O(n), where n is the length of the input word. The function iterates through each character once.

- Space complexity:
O(n), where n is the number of unique characters in the word. This is because we use a dictionary dic to store the occurrences of each character.

# Code
```python
class Solution:
    def numberOfSpecialChars(self, word: str) -> int:
        dic = {}
        count = 0
        for i in word:
            if dic.get(i.lower(),True)!="NA":
                if 'a'<=i<='z':
                    if not dic.get(i,False):
                        dic[i] = "Yes"
                    else:
                        if dic[i] == "No":
                            dic[i] = "NA"
                            count-=1
                else:
                    p = i.lower()
                    if dic.get(p,False):
                        if dic[p]!="No":
                            count+=1
                            dic[p] = "No"
                    else:
                        dic[p] = "NA"
        return count
```