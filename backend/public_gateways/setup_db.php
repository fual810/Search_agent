<?php
// public_html/setup_db.php (一時的配置)

// ディレクトリ階層:
// public_html/setup_db.php
//   -> public_html (..)
//   -> match_agent_backend/setup_db.php

$paths = [
    __DIR__ . '/../setup_db.php', // Local XAMPP
    __DIR__ . '/../match_agent_backend/setup_db.php', // Server Type A
    __DIR__ . '/../../match_agent_backend/setup_db.php', // Server Type B
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
