---
layout: post
title: "551. Student Attendance Record I"
date: 2024-04-13
category:
  - DSA
image: assets/img/blog/LeetCode.jpg
author: Pavan Badempet
tags: LeetCode
---

Problem Link: [551. Student Attendance Record I](https://leetcode.com/problems/student-attendance-record-i/description/)

## Intuition
Iterate through the attendance record string, tallying counts for absences and consecutive late days. Track the maximum consecutive late days encountered. At each step, check for conditions violating the attendance criteria, like multiple absences or more than two consecutive late days.

## Approach
1. Initialize two variables Absent and Late to keep track of the number of absent days and consecutive late days, respectively.
2. Iterate through each character i in the string s.
    - If i is not 'L', reset the Late counter to 0. If i is 'A', increment the Absent counter and check if Absent is greater than or equal to 2. If so, return False.
    - If i is 'L', increment the Late counter and check if Late is greater than or equal to 3. If so, return False.
3. If the loop completes without returning False, return True.

## Complexity
- Time complexity:
O(n), where n is the length of the string s. The function iterates through each character of the string once.

- Space complexity:
O(1), as the function uses only a constant amount of extra space.

## Code
```python
class Solution:
    def checkRecord(self, s: str) -> bool:
        Absent, Late = 0, 0
        for i in s:
            if i != 'L':
                Late=0
                if i=='A':
                    Absent+=1
                    if Absent>=2:
                        return False
            else:
                Late+=1
                if Late>=3:
                    return False
        return True
```