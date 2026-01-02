<?php
// public_html/check_connect.php
ini_set('display_errors', '1');
error_reporting(E_ALL);

echo "<h1>Configuration Check</h1>";

// 1. Check match_agent_backend location
$backend_config = __DIR__ . '/../match_agent_backend/config.php';
echo "Checking path: " . htmlspecialchars($backend_config) . "<br>";

if (file_exists($backend_config)) {
    echo "<span style='color:green'>Found config file in match_agent_backend.</span><br>";
    include $backend_config;
    
    echo "<h2>Loaded Settings</h2>";
    echo "DB Host: " . htmlspecialchars($dbHost ?? 'UNDEFINED') . "<br>";
    echo "DB User: " . htmlspecialchars($dbUser ?? 'UNDEFINED') . "<br>";
    echo "DB Name: " . htmlspecialchars($dbName ?? 'UNDEFINED') . "<br>";
    
    // Check if it is default
    if (($dbUser ?? '') === 'root') {
        echo "<h3 style='color:red'>WARNING: Using 'root' user. This is the default config, not the Xserver one.</h3>";
    } else {
        echo "<h3 style='color:blue'>Using custom user: " . htmlspecialchars($dbUser) . "</h3>";
    }

} else {
    echo "<span style='color:red'>ERROR: Could not find match_agent_backend/config.php</span><br>";
    echo "Please check if 'match_agent_backend' folder exists at the same level as 'public_html'.<br>";
}

echo "<h2>Connection Test</h2>";
try {
    $pdo = get_db_connection();
    echo "<span style='color:green'><strong>Database connection SUCCESS!</strong></span>";
} catch (Throwable $e) {
    echo "<span style='color:red'><strong>Database connection FAILED:</strong></span> " . htmlspecialchars($e->getMessage());
}
