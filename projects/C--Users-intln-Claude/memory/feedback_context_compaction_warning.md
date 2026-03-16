---
name: Warn Before Context Compaction
description: User wants advance warning when conversation is approaching context limits to avoid surprise session restarts
type: feedback
---

When a conversation is getting long and approaching context window limits, warn the user BEFORE compaction happens. Say something like:

"We're getting close to the context limit. If we continue much longer, the conversation will need to compact (summarize earlier messages). Want to wrap up this thread and start a new session?"

This lets the user decide whether to checkpoint and start fresh rather than being surprised by a compacted conversation.

Recorded 2026-03-16 after user was frustrated by an unexpected context compaction mid-task.
