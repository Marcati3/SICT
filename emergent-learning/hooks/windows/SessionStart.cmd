@echo off
REM Wrapper for SessionStart.ps1
REM Install: Copy to %USERPROFILE%\.claude\hooks\SessionStart.cmd

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0SessionStart.ps1"
