$ErrorActionPreference = 'Stop'

# Paths
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $root '..')
$backendDir = Join-Path $repoRoot 'backend'
$frontendDir = Join-Path $repoRoot 'frontend'
$schemaFile = Join-Path $repoRoot 'database/schema.sql'

# Config (override with env vars)
$DB_HOST = $env:DB_HOST
if ([string]::IsNullOrEmpty($DB_HOST)) { $DB_HOST = 'localhost' }
$DB_PORT = $env:DB_PORT
if ([string]::IsNullOrEmpty($DB_PORT)) { $DB_PORT = '3306' }
$DB_NAME = $env:DB_NAME
if ([string]::IsNullOrEmpty($DB_NAME)) { $DB_NAME = 'jobmatch' }
$DB_USER = $env:DB_USER
if ([string]::IsNullOrEmpty($DB_USER)) { $DB_USER = 'root' }
$DB_PASS = $env:DB_PASS
if ([string]::IsNullOrEmpty($DB_PASS)) { $DB_PASS = '' }

$PHP_BIN = $env:PHP_BIN
if ([string]::IsNullOrEmpty($PHP_BIN)) { $PHP_BIN = 'php' }
$MYSQL_BIN = $env:MYSQL_BIN
if ([string]::IsNullOrEmpty($MYSQL_BIN)) { $MYSQL_BIN = 'mysql' }

Write-Host "== Dev setup start ==" -ForegroundColor Cyan
Write-Host "DB: $DB_USER@$DB_HOST:$DB_PORT / $DB_NAME"

# Create database
$mysqlArgs = @("-h$DB_HOST", "-P$DB_PORT", "-u$DB_USER")
if ($DB_PASS -ne '') {
  $mysqlArgs += "-p$DB_PASS"
}

Write-Host "-- Creating database if not exists..." -ForegroundColor Yellow
& $MYSQL_BIN @mysqlArgs -e "CREATE DATABASE IF NOT EXISTS `$DB_NAME` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" | Out-Null

# Apply schema
Write-Host "-- Applying schema..." -ForegroundColor Yellow
Get-Content $schemaFile | & $MYSQL_BIN @mysqlArgs $DB_NAME | Out-Null

# Install frontend deps
Write-Host "-- Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location $frontendDir
& npm install | Out-Null
Pop-Location

# Start PHP dev server
$apiUrl = 'http://localhost:8000'
Write-Host "-- Starting PHP dev server at $apiUrl" -ForegroundColor Yellow
Start-Process -FilePath $PHP_BIN -ArgumentList '-S', 'localhost:8000', '-t', $backendDir -WorkingDirectory $backendDir

# Start Vite dev server with proxy
Write-Host "-- Starting Vite dev server (proxy -> $apiUrl) on :5173" -ForegroundColor Yellow
$env:VITE_DEV_API_TARGET = $apiUrl
Start-Process -FilePath 'npm' -ArgumentList 'run', 'dev', '--', '--host', '--port', '5173' -WorkingDirectory $frontendDir

Write-Host "== Setup complete =="
Write-Host "Frontend: http://localhost:5173/"
Write-Host "API: $apiUrl/api/questions.php"
Write-Host "To stop servers, close their windows or terminate the processes." -ForegroundColor Yellow
