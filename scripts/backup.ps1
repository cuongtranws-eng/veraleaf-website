# VeraLeaf backup (Windows): PostgreSQL dump + uploaded media.
# Usage (from the project folder):  powershell -ExecutionPolicy Bypass -File scripts\backup.ps1
# Keeps the last 14 days of backups in .\backups
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

# Read DATABASE_URL from .env
$line = Get-Content .env | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
if (-not $line) { throw 'DATABASE_URL not found in .env' }
$dbUrl = $line.Substring('DATABASE_URL='.Length)

# Find pg_dump (PostgreSQL install folder or PATH)
$pgDump = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin\pg_dump.exe' -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty FullName
if (-not $pgDump) { $pgDump = (Get-Command pg_dump -ErrorAction Stop).Source }

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
New-Item -ItemType Directory -Force backups | Out-Null

Write-Host "Dumping database..."
& $pgDump --format=custom --no-owner --no-privileges "--dbname=$dbUrl" "--file=backups\db-$stamp.dump"
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed ($LASTEXITCODE)" }

if (Test-Path media) {
  Write-Host "Archiving media..."
  Compress-Archive -Path media -DestinationPath "backups\media-$stamp.zip" -Force
}

Get-ChildItem backups -File | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-14) -and $_.Name -match '^(db|media)-' } | Remove-Item -Force
Write-Host "Backup done: backups\db-$stamp.dump"
