# Frontend Development Server Script
# Run this script from the frontend directory to start the Vite development server

# Import shared utilities (from project root)
$projectRoot = Split-Path $PSScriptRoot -Parent
$modulePath = Join-Path $projectRoot "scripts\common.psm1"
Import-Module $modulePath -Force

# Configuration
$frontendPath = $PSScriptRoot
$serverPort = 3000

# Main execution
Write-InfoMessage "🚀 Starting Frontend Development Server..."
Write-Host ""

# Install dependencies if needed
if (-not (Install-DependenciesIfNeeded -ProjectPath $frontendPath)) {
    exit 1
}

# Start the development server
Start-DevelopmentServer `
    -ProjectPath $frontendPath `
    -ServerName "Vite dev server" `
    -Port $serverPort `
    -AdditionalInfo @()






