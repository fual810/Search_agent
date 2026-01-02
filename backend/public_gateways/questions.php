<?php
// public_html/api/questions.php
// ユーザーが作成した `match_agent_backend` フォルダ内のロジックを読み込みます。

// ディレクトリ階層:
// public_html/api/questions.php
//   -> api (..)
//   -> public_html (../..)
//   -> match_agent_backend/api/questions.php

$paths = [
    // Server Production Paths (Prioritize these!)
    __DIR__ . '/../../match_agent_backend/api/questions.php', // Server Type A
    __DIR__ . '/../../../match_agent_backend/api/questions.php', // Server Type B
    
    // Local Dev Path (Fallback)
    __DIR__ . '/../api/questions.php', 
];

$found = false;
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
