param (
    [int]$Port = 3000
)

Write-Host "🔍 Searching for processes listening on port $Port..." -ForegroundColor Cyan

# Find the PID using netstat
$netstatOutput = netstat -ano | Select-String ":$Port\s+.*LISTENING"
if (-not $netstatOutput) {
    Write-Host "✅ No process is currently listening on port $Port." -ForegroundColor Green
    exit 0
}

# Extract PID from the first matching line
$line = $netstatOutput.Matches[0].Value -or $netstatOutput.Line
$pidString = ($line -split '\s+')[-1]

if (-not [int]::TryParse($pidString, [ref]$null)) {
    Write-Host "❌ Failed to parse PID from netstat output. Found: $pidString" -ForegroundColor Red
    exit 1
}

$ProcessId = [int]$pidString

try {
    $process = Get-Process -Id $ProcessId -ErrorAction Stop
    Write-Host "⚠️ Found process '$($process.ProcessName)' (PID: $ProcessId) occupying port $Port." -ForegroundColor Yellow
    
    # Terminate the process
    Write-Host "🔪 Force killing process $ProcessId..." -ForegroundColor Yellow
    Stop-Process -Id $ProcessId -Force
    Write-Host "✅ Process successfully terminated. Port $Port is now free." -ForegroundColor Green
}
catch [Microsoft.PowerShell.Commands.ProcessCommandException] {
    Write-Host "✅ Process $ProcessId is already gone or could not be found." -ForegroundColor Green
}
catch {
    Write-Host "❌ Error terminating process $ProcessId : $_" -ForegroundColor Red
    Write-Host "💡 Try running this script as Administrator." -ForegroundColor Yellow
    exit 1
}
