<?php
// public_html/api/submit.php
ini_set('display_errors', '1');
error_reporting(E_ALL);

// ユーザーが作成した `match_agent_backend` フォルダ内のロジックを読み込みます。

// ディレクトリ階層:
// public_html/api/submit.php
//   -> api (..)
//   -> public_html (../..)
//   -> match_agent_backend/api/submit.php

$paths = [
    // Server Production Paths (Prioritize these!)
    __DIR__ . '/../../match_agent_backend/api/submit.php', // Server Type A
    __DIR__ . '/../../../match_agent_backend/api/submit.php', // Server Type B
    
    // Local Dev Path (Fallback)
    __DIR__ . '/../api/submit.php', 
];

$found = false;
foreach ($paths as $path) {
    if (file_exists($path)) {
        require_once $path;
        $found = true;
        break;
    }
}

if (!$found) {
    http_response_code(500);
    echo "Error: Backend file not found. Checked:<br>";
    foreach ($paths as $path) {
        echo htmlspecialchars($path) . "<br>";
    }
}
