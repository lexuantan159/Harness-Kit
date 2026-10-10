# Install / update the harness into a project. See README.md.
# Usage: .\install.ps1 [install|update|uninstall|status] <target-dir> [options]
$ErrorActionPreference = 'Stop'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error 'Node.js >= 18 is required (hooks and installer run on Node).'
  exit 1
}
$kit = Join-Path $PSScriptRoot 'bin/harness.js'
$commands = @('install', 'update', 'uninstall', 'status')
if ($args.Count -gt 0 -and $commands -contains $args[0]) { node $kit @args }
else { node $kit install @args }
exit $LASTEXITCODE
