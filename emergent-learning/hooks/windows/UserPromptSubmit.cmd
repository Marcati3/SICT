@echo off
REM Wrapper for UserPromptSubmit.ps1
REM Install: Copy to %USERPROFILE%\.claude\hooks\UserPromptSubmit.cmd

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0UserPromptSubmit.ps1"
