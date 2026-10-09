<#
.SYNOPSIS
  ZAPIA 2.0 - Phase 1 installer for adelaidasofia/whatsapp-mcp on Windows.

.DESCRIPTION
  Installs a pinned release of the Go bridge (SHA-256 verified) plus the Python
  MCP server, and registers the MCP with Claude Code and Claude Desktop.
  Pairing is NOT automated: WhatsApp's QR rotates every ~20 s, so you start the
  bridge yourself and scan it (step printed at the end).

  Facts verified against the upstream repo on 2026-10-09:
    - latest release v0.5.1 (2026-10-07)
    - asset whatsapp-bridge-windows-amd64.exe + whatsapp-bridge-windows-amd64.exe.sha256
    - bridge binds 127.0.0.1:8080 only (refuses non-loopback), GET /api/status
    - MCP server runs via `uv --directory <dir> run main.py` (stdio)
    - SQLCipher key auto-provisions in Windows Credential Manager

  Compatible with Windows PowerShell 5.1 and PowerShell 7.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\setup-whatsapp-mcp.ps1
  # ...pair in a separate window, then:
  powershell -ExecutionPolicy Bypass -File .\setup-whatsapp-mcp.ps1 -VerifyOnly
#>
[CmdletBinding()]
param(
    [string]$Version = 'v0.5.1',
    [string]$InstallDir = (Join-Path $env:USERPROFILE '.claude\whatsapp-mcp'),
    [int]$BridgePort = 8080,
    [switch]$SkipClaudeCode,
    [switch]$SkipClaudeDesktop,
    [switch]$VerifyOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # Invoke-WebRequest is 10x slower with the progress bar on 5.1
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Repo       = 'adelaidasofia/whatsapp-mcp'
$Asset      = 'whatsapp-bridge-windows-amd64.exe'
$BridgeDir  = Join-Path $InstallDir 'whatsapp-bridge'
$BridgeExe  = Join-Path $BridgeDir 'bin\whatsapp-bridge.exe'
$ServerDir  = Join-Path $InstallDir 'whatsapp-mcp-server'
$StatusUrl  = "http://127.0.0.1:$BridgePort/api/status"

function Write-Step([string]$msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg)   { Write-Host "    OK  $msg" -ForegroundColor Green }
function Write-Warn2([string]$msg){ Write-Host "    !!  $msg" -ForegroundColor Yellow }

function Test-Command([string]$name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Get-BridgeStatus {
    try {
        return Invoke-RestMethod -Uri $StatusUrl -TimeoutSec 5
    } catch {
        return $null
    }
}

function Show-BridgeStatus {
    $s = Get-BridgeStatus
    if ($null -eq $s) {
        Write-Warn2 "Bridge not reachable at $StatusUrl (is it running?)"
        return $false
    }
    # Print only non-sensitive fields.
    $auth = $s.authenticated; $conn = $s.connected
    $state = $null
    if ($null -ne $s.PSObject.Properties['auth_state']) { $state = $s.auth_state }
    Write-Host ("    authenticated={0} connected={1} auth_state={2}" -f $auth, $conn, $state)
    return ($auth -eq $true -and $conn -eq $true)
}

if ($VerifyOnly) {
    Write-Step "Checking bridge status"
    if (Show-BridgeStatus) { Write-Ok 'Bridge is paired and connected.'; exit 0 }
    exit 1
}

Write-Host ''
Write-Host 'BAN RISK: this uses an unofficial WhatsApp client. Pair a SECONDARY number first.' -ForegroundColor Yellow
Write-Host ''

# --- 0. Disable the maintainer's install ping (user scope, persists) ----------
Write-Step 'Setting MYCELIUM_NO_PING=1 (user environment)'
[Environment]::SetEnvironmentVariable('MYCELIUM_NO_PING', '1', 'User')
$env:MYCELIUM_NO_PING = '1'
Write-Ok 'set'

# --- 1. Prerequisites ----------------------------------------------------------
Write-Step 'Checking prerequisites'
if (-not (Test-Command 'git')) { throw 'git not found. Install: winget install --id Git.Git -e' }
Write-Ok 'git'
if (-not (Test-Command 'uv')) {
    throw 'uv not found. Install: winget install --id astral-sh.uv -e   (then open a NEW PowerShell window and re-run)'
}
$UvPath = (Get-Command uv).Source
Write-Ok "uv ($UvPath)"
# uv provisions Python 3.11+ itself if the system one is missing or too old.

# --- 2. Clone the repo at the release tag --------------------------------------
Write-Step "Fetching $Repo at $Version into $InstallDir"
if (Test-Path (Join-Path $InstallDir '.git')) {
    & git -C $InstallDir fetch --depth 1 origin "refs/tags/${Version}:refs/tags/${Version}"
    if ($LASTEXITCODE -ne 0) { throw 'git fetch failed' }
    & git -C $InstallDir -c advice.detachedHead=false checkout --quiet $Version
    if ($LASTEXITCODE -ne 0) { throw "git checkout $Version failed (local edits in $InstallDir?)" }
} elseif (Test-Path $InstallDir) {
    throw "$InstallDir exists but is not a git checkout. Move it aside and re-run."
} else {
    & git -c advice.detachedHead=false clone --quiet --depth 1 --branch $Version "https://github.com/$Repo.git" $InstallDir
    if ($LASTEXITCODE -ne 0) { throw 'git clone failed' }
}
Write-Ok "checked out $Version"

# --- 3. Download + verify the bridge binary ------------------------------------
Write-Step "Downloading $Asset ($Version) and verifying SHA-256"
$base = "https://github.com/$Repo/releases/download/$Version"
$tmp  = Join-Path ([IO.Path]::GetTempPath()) ("wa-bridge-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force $tmp | Out-Null
try {
    $exeTmp = Join-Path $tmp $Asset
    $shaTmp = "$exeTmp.sha256"
    Invoke-WebRequest -UseBasicParsing -Uri "$base/$Asset"        -OutFile $exeTmp
    Invoke-WebRequest -UseBasicParsing -Uri "$base/$Asset.sha256" -OutFile $shaTmp

    # File format: "<64 hex> *whatsapp-bridge-windows-amd64.exe"
    $expected = ((Get-Content $shaTmp -Raw).Trim() -split '\s+')[0].ToLowerInvariant()
    if ($expected -notmatch '^[0-9a-f]{64}$') { throw "Malformed .sha256 file: '$expected'" }
    $actual = (Get-FileHash -Algorithm SHA256 $exeTmp).Hash.ToLowerInvariant()
    if ($actual -ne $expected) {
        throw "SHA-256 MISMATCH. expected $expected got $actual. Not installing."
    }
    Write-Ok "sha256 $actual"

    # Don't overwrite a running bridge.
    if (Get-Process -Name 'whatsapp-bridge' -ErrorAction SilentlyContinue) {
        throw 'whatsapp-bridge.exe is running. Stop it (Ctrl+C in its window) and re-run.'
    }
    New-Item -ItemType Directory -Force (Split-Path $BridgeExe) | Out-Null
    Move-Item -Force $exeTmp $BridgeExe
    Unblock-File $BridgeExe
    Write-Ok "installed $BridgeExe"
} finally {
    Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}

# --- 4. .env -------------------------------------------------------------------
Write-Step 'Configuring .env'
$envFile = Join-Path $InstallDir '.env'
if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $InstallDir '.env.example') $envFile
    Write-Ok 'created .env from .env.example (no edits required to boot)'
} else {
    Write-Ok '.env already exists, left untouched'
}
# The bridge reads .env from its working dir or next to the binary; we start it
# from $BridgeDir, so place a copy there too if absent.
$bridgeEnv = Join-Path $BridgeDir '.env'
if (-not (Test-Path $bridgeEnv)) { Copy-Item $envFile $bridgeEnv }

# --- 5. Python deps for the MCP server -----------------------------------------
Write-Step 'Resolving MCP server dependencies (uv sync)'
& $UvPath sync --directory $ServerDir --quiet
if ($LASTEXITCODE -ne 0) { throw 'uv sync failed' }
Write-Ok 'deps installed'

# --- 6. Register with Claude Code ----------------------------------------------
if (-not $SkipClaudeCode) {
    Write-Step 'Registering MCP with Claude Code (user scope)'
    if (Test-Command 'claude') {
        # Remove any stale entry. On 5.1, stderr from a native command under
        # ErrorAction Stop raises NativeCommandError, so relax it for this call.
        $prevEap = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
        & claude mcp remove whatsapp --scope user *> $null
        $ErrorActionPreference = $prevEap
        & claude mcp add whatsapp --scope user `
            --env "MYCELIUM_NO_PING=1" --env "WHATSAPP_BRIDGE_PORT=$BridgePort" `
            -- $UvPath --directory $ServerDir run main.py
        if ($LASTEXITCODE -ne 0) { Write-Warn2 'claude mcp add failed; run it manually (see SETUP.md step 6)' }
        else { Write-Ok 'registered as "whatsapp"' }
    } else {
        Write-Warn2 'claude CLI not on PATH; skipped'
    }
}

# --- 7. Register with Claude Desktop --------------------------------------------
if (-not $SkipClaudeDesktop) {
    Write-Step 'Registering MCP with Claude Desktop'
    $candidates = @(
        (Join-Path $env:APPDATA 'Claude\claude_desktop_config.json')
    )
    # Microsoft Store build keeps config under a virtualised AppData path.
    $storePkg = Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Packages') -Directory -Filter 'Claude_*' -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($storePkg) { $candidates += (Join-Path $storePkg.FullName 'LocalCache\Roaming\Claude\claude_desktop_config.json') }

    $cfgPath = $null
    foreach ($c in $candidates) { if (Test-Path $c) { $cfgPath = $c; break } }
    if (-not $cfgPath) { $cfgPath = $candidates[0]; New-Item -ItemType Directory -Force (Split-Path $cfgPath) | Out-Null }

    $cfg = $null
    if (Test-Path $cfgPath) {
        $raw = Get-Content $cfgPath -Raw
        Copy-Item $cfgPath "$cfgPath.bak-$(Get-Date -Format yyyyMMddHHmmss)"
        if ($raw -and $raw.Trim()) { $cfg = $raw | ConvertFrom-Json }
    }
    if ($null -eq $cfg) { $cfg = [pscustomobject]@{} }
    if ($null -eq $cfg.PSObject.Properties['mcpServers']) {
        $cfg | Add-Member -NotePropertyName mcpServers -NotePropertyValue ([pscustomobject]@{})
    }
    $entry = [pscustomobject]@{
        command = $UvPath     # absolute path: Desktop does not inherit your shell PATH
        args    = @('--directory', $ServerDir, 'run', 'main.py')
        env     = [pscustomobject]@{
            WHATSAPP_BRIDGE_HOST = '127.0.0.1'
            WHATSAPP_BRIDGE_PORT = "$BridgePort"
            MYCELIUM_NO_PING     = '1'
        }
    }
    if ($null -ne $cfg.mcpServers.PSObject.Properties['whatsapp']) {
        $cfg.mcpServers.whatsapp = $entry
    } else {
        $cfg.mcpServers | Add-Member -NotePropertyName whatsapp -NotePropertyValue $entry
    }
    $json = $cfg | ConvertTo-Json -Depth 20
    # UTF-8 without BOM (5.1's -Encoding UTF8 writes a BOM some JSON readers reject).
    [IO.File]::WriteAllText($cfgPath, $json, (New-Object Text.UTF8Encoding($false)))
    $null = Get-Content $cfgPath -Raw | ConvertFrom-Json   # re-parse check
    Write-Ok "updated $cfgPath (backup saved alongside). Restart Claude Desktop."
}

# --- 8. Next steps ---------------------------------------------------------------
Write-Host ''
Write-Step 'NEXT: pair your phone (do this yourself, the QR rotates every ~20 s)'
Write-Host "  1. Open a NEW PowerShell window and run:"
Write-Host "       cd `"$BridgeDir`""
Write-Host "       `$env:MYCELIUM_NO_PING='1'; .\bin\whatsapp-bridge.exe"
Write-Host "  2. Phone: WhatsApp > Settings > Linked Devices > Link a Device > scan."
Write-Host "     QR garbled? Ctrl+C, then: .\bin\whatsapp-bridge.exe --pair-phone +60XXXXXXXXX"
Write-Host "  3. Leave it running, then back here:"
Write-Host "       powershell -ExecutionPolicy Bypass -File `"$PSCommandPath`" -VerifyOnly"
Write-Host "  4. Optional autostart after pairing:"
Write-Host "       powershell -ExecutionPolicy Bypass -File `"$InstallDir\scripts\install-bridge-autostart.ps1`""
