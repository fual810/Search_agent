<?php
// public_html/server_status.php
ini_set('display_errors', '1');
error_reporting(E_ALL);

echo "<h1>Server File Diagnostic (Step 2)</h1>";

$files = [
    // Gateways
    './api/questions.php',
    './api/submit.php',
    './api/contact.php',
    
    // Backend Logic
    '../match_agent_backend/config.php',
    '../match_agent_backend/api/questions.php',
    '../match_agent_backend/api/submit.php',
    '../match_agent_backend/api/contact.php'
];

echo "<table border='1' cellpadding='5'>";
echo "<tr><th>File Path</th><th>Status</th><th>Size</th><th>First Line (Snippet)</th></tr>";

foreach ($files as $f) {
    echo "<tr>";
    echo "<td>" . htmlspecialchars($f) . "</td>";
    if (file_exists($f)) {
        echo "<td style='color:green'>Found</td>";
        echo "<td>" . filesize($f) . " bytes</td>";
        
        $content = file_get_contents($f);
        $snippet = htmlspecialchars(substr($content, 0, 100));
        echo "<td>Check: " . $snippet . "...</td>";
    } else {
        echo "<td style='color:red; font-weight:bold;'>MISSING</td>";
        echo "<td>-</td>";
        echo "<td>-</td>";
    }
    echo "</tr>";
}
echo "</table>";

echo "<h2>Analysis</h2>";

// Check Gateway Content
if (file_exists('./api/questions.php')) {
    $c = file_get_contents('./api/questions.php');
    if (strpos($c, 'match_agent_backend') !== false) {
        echo "<p style='color:green'>OK: 'api/questions.php' gateway seems correct.</p>";
    } else {
        echo "<p style='color:red; font-weight:bold;'>WARNING: 'api/questions.php' looks like it might be the LOGIC file (wrong file).</p>";
    }
}

// Check Logic Content
if (file_exists('../match_agent_backend/api/questions.php')) {
    $c = file_get_contents('../match_agent_backend/api/questions.php');
    if (strpos($c, 'require_once') !== false && strpos($c, 'config.php') !== false) {
        echo "<p style='color:green'>OK: 'match_agent_backend/api/questions.php' looks like logic file.</p>";
    } else {
        echo "<p style='color:red; font-weight:bold;'>WARNING: 'match_agent_backend/api/questions.php' content looks suspicious.</p>";
    }
}
