$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
$pathParts = $env:Path -split ';' | Where-Object { $_ -notlike '*WindowsApps*' }
$env:Path = ($pathParts -join ';')
& "$PSScriptRoot\run-dashboard.ps1"
