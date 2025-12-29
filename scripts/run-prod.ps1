#!/usr/bin/env pwsh
<#
Runs `node dist/main.js` in a restart loop and appends logs to `logs/server.log`.
Usage: `powershell -File .\scripts\run-prod.ps1`
#>
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$logDir = Join-Path $scriptDir "..\logs" | Resolve-Path -Relative -ErrorAction SilentlyContinue
if (-not (Test-Path (Join-Path $scriptDir "..\logs"))) {
    New-Item -ItemType Directory -Path (Join-Path $scriptDir "..\logs") | Out-Null
}
$logFile = Join-Path $scriptDir "..\logs\server.log"
while ($true) {
    Write-Output "=== Starting server: $(Get-Date) ===" | Tee-Object -FilePath $logFile -Append
    & node dist/main.js 2>&1 | Tee-Object -FilePath $logFile -Append
    $exit = $LASTEXITCODE
    Write-Output "=== Server exited with code $exit at $(Get-Date). Restarting in 2s... ===" | Tee-Object -FilePath $logFile -Append
    Start-Sleep -Seconds 2
}
