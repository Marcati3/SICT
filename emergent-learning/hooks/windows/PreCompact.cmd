@echo off
REM Wrapper for PreCompact.ps1
REM Install: Copy to %USERPROFILE%\.claude\hooks\PreCompact.cmd

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0PreCompact.ps1"
