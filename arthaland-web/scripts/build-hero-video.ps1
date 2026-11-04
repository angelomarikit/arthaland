# Stable hero: static holds + crossfades (no Ken Burns jitter).
$ErrorActionPreference = "Stop"
$root = Join-Path $PSScriptRoot "..\public\assets"
$shotsDir = Join-Path $root "videos\hero-shots"
$heroOut = Join-Path $root "hero\hero-desktop.mp4"
$fps = 30
$hold = 3
$xfade = 0.6

$shots = @(
  "hero/source/shot1-eluria-exterior.png",
  "hero/source/shot2-una-exterior.jpeg",
  "hero/source/shot3-lucima-facade.jpg",
  "hero/source/shot4-lucima-interior.jpg",
  "hero/source/shot5-lucima-aerial.jpg"
)

New-Item -ItemType Directory -Force -Path $shotsDir | Out-Null

for ($i = 0; $i -lt $shots.Count; $i++) {
  $input = Join-Path $root $shots[$i]
  $segment = Join-Path $shotsDir "segment-$i.mp4"
  Write-Host "Static segment $i..."
  & ffmpeg -y -hide_banner -loglevel error `
    -loop 1 -framerate $fps -i $input `
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p" `
    -t $hold `
    -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p `
    -movflags +faststart `
    $segment
}

# xfade chain: 5 clips, 4 xfades -> duration = 5*hold - 4*xfade = 12.6; pad last segment
$filter = @"
[0:v][1:v]xfade=transition=fade:duration=${xfade}:offset=$($hold - $xfade)[v01];
[v01][2:v]xfade=transition=fade:duration=${xfade}:offset=$($hold*2 - $xfade*2)[v02];
[v02][3:v]xfade=transition=fade:duration=${xfade}:offset=$($hold*3 - $xfade*3)[v03];
[v03][4:v]xfade=transition=fade:duration=${xfade}:offset=$($hold*4 - $xfade*4)[vout]
"@

$inputs = 0..4 | ForEach-Object { "-i"; (Join-Path $shotsDir "segment-$_.mp4") }

Write-Host "Crossfading..."
& ffmpeg -y -hide_banner -loglevel error `
  @inputs `
  -filter_complex $filter `
  -map "[vout]" `
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p `
  -movflags +faststart `
  $heroOut

& ffmpeg -y -hide_banner -loglevel error -ss 1 -i $heroOut -frames:v 1 (Join-Path $root "hero\hero-poster.jpg")
Copy-Item $heroOut (Join-Path $root "videos\hero-desktop-stable.mp4") -Force
Write-Host "Done: $heroOut"
