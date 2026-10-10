$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $projectRoot
$manifest = Get-Content -Raw -LiteralPath 'manifest.json' | ConvertFrom-Json
$package = Get-Content -Raw -LiteralPath 'package.json' | ConvertFrom-Json
if ($manifest.version -ne $package.version) { throw 'manifest.json 与 package.json 版本不一致' }
if ($env:GITHUB_REF_TYPE -eq 'tag' -and $env:GITHUB_REF_NAME -ne "v$($manifest.version)") { throw 'Git 标签与 manifest.json 版本不一致' }
$distPath = Join-Path $projectRoot 'dist'
New-Item -ItemType Directory -Force -Path $distPath | Out-Null
$archive = Join-Path $distPath "resume-pulse-extension-v$($manifest.version).zip"
$files = @('manifest.json','mark.svg','options.html','options.js','popup.html','popup.js','panel.js','background.js','autofill.js','resume-parser.js','region-data.js','ui.css','README.md','vendor')
Compress-Archive -Path $files -DestinationPath $archive -CompressionLevel Optimal -Force
Write-Output "Release package: $archive"

