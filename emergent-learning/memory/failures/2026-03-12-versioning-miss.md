# Failure: Skipped Dashboard Versioning

**Date:** 2026-03-12
**Domain:** dashboard / sic-dashboards
**Severity:** Medium

## What Happened
Edited Sales_KPI_Dashboard_FY2026_v8.html in place without creating v9 first. PROJECT.md Workflow section clearly states: "Previous HTML versions archived before overwrite." User had to catch the mistake.

## Root Cause
Did not read PROJECT.md at session start. Jumped straight into continuing the rebuild from the previous session's todo list without reviewing project instructions.

## Lesson
Always read ALL project .md files at session start — especially when resuming from a prior session. Version archiving is a workflow rule, not optional. Create the new version file BEFORE making any edits.

## Prevention
1. Read PROJECT.md before any edits in sic-dashboards
2. First action on any dashboard edit: cp vN.html archive/ && cp vN.html v(N+1).html
3. Update footer version stamp immediately after creating new file
