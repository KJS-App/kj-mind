#!/usr/bin/env pwsh
<#
Simple health-check script for the Nest app.
Exits 0 when the root endpoint responds, 1 otherwise.
#>
$uri = 'http://localhost:8000/'
try {
    $resp = Invoke-RestMethod -Uri $uri -TimeoutSec 5
    Write-Host "OK: $resp"
    exit 0
} catch {
    Write-Host "FAIL: $($_.Exception.Message)"
    exit 1
}
