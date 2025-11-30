<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$type = $_GET['type'] ?? '';
$urls = [
    'markers' => 'https://temp1234.rfgm.me/tiles/minecraft_overworld/markers.json',
    'players' => 'https://temp1234.rfgm.me/tiles/players.json'
];

if (!isset($urls[$type])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid type']);
    exit;
}

// Check cache
$cacheDir = sys_get_temp_dir() . '/proxy_cache';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}
$cacheFile = $cacheDir . '/' . md5($type) . '.json';
$cacheTime = 1; // 1 second cache

if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTime) {
    echo file_get_contents($cacheFile);
    exit;
}

$ch = curl_init($urls[$type]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Cache successful responses
if ($httpCode === 200 && $response) {
    file_put_contents($cacheFile, $response);
}

http_response_code($httpCode);
echo $response;
