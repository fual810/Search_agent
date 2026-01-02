<?php
declare(strict_types=1);

date_default_timezone_set('Asia/Tokyo');

/**
 * XSERVER CONFIGURATION
 * Upload this file to: match_agent_backend/config.php
 */
function get_db_connection(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    // XSERVER CREDENTIALS
    $dbHost = '127.0.0.1'; // 'localhost' is sometimes tricky, IP is safer if provided
    $dbPort = '3306';
    $dbName = 'xs413160_agentmatching';
    $dbUser = 'xs413160_ryo';
    $dbPass = 'Myohojiyamato29';
    $charset = 'utf8mb4';

    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset={$charset}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    try {
        $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
    } catch (PDOException $e) {
        // Show detailed error for debugging
        echo "DB Connection Failed: " . htmlspecialchars($e->getMessage());
        exit;
    }

    return $pdo;
}

function json_response(array $data, int $status = 200): void
{
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function apply_cors(): void
{
    $allowedOrigin = getenv('CORS_ALLOW_ORIGIN');
    if ($allowedOrigin) {
        header('Access-Control-Allow-Origin: ' . $allowedOrigin);
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }
}

function handle_options_if_needed(): void
{
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

function get_client_ip(): ?string
{
    foreach (['HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $parts = explode(',', $_SERVER[$key]);
            return trim($parts[0]);
        }
    }
    return null;
}

function get_user_agent(): ?string
{
    return $_SERVER['HTTP_USER_AGENT'] ?? null;
}

function consent_text(): string
{
    return '提携する就活エージェントへ回答内容と連絡先を提供し、エージェントから連絡を受け取ることに同意します';
}
