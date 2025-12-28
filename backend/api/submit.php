<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

apply_cors();
handle_options_if_needed();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$raw = file_get_contents('php://input') ?: '';
$payload = json_decode($raw, true);
if (!is_array($payload)) {
    json_response(['ok' => false, 'error' => 'Invalid JSON payload'], 400);
}

$answers = $payload['answers'] ?? [];
$contact = $payload['contact'] ?? [];
$consent = $payload['consent'] ?? false;

$name = isset($contact['name']) ? trim((string)$contact['name']) : '';
$school = isset($contact['school']) ? trim((string)$contact['school']) : '';
$phone = isset($contact['phone']) ? trim((string)$contact['phone']) : '';
$email = isset($contact['email']) ? trim((string)$contact['email']) : '';

if ($name === '' || $school === '') {
    json_response(['ok' => false, 'error' => '名前と学校は必須です'], 400);
}

if ($phone === '' && $email === '') {
    json_response(['ok' => false, 'error' => '電話番号かメールアドレスのいずれかは必須です'], 400);
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'メールアドレスの形式が正しくありません'], 400);
}

if ($consent !== true) {
    json_response(['ok' => false, 'error' => '同意が必要です'], 400);
}

if (!is_array($answers)) {
    json_response(['ok' => false, 'error' => '回答形式が不正です'], 400);
}

$pdo = get_db_connection();
$now = date('Y-m-d H:i:s');
$consentText = consent_text();
$userAgent = get_user_agent();
$ipAddress = get_client_ip();

try {
    $pdo->beginTransaction();

    $leadStmt = $pdo->prepare('INSERT INTO leads (name, school, phone, email, consent, consent_text, consented_at, created_at, user_agent, ip_address) VALUES (:name, :school, :phone, :email, :consent, :consent_text, :consented_at, :created_at, :user_agent, :ip_address)');
    $leadStmt->execute([
        ':name' => $name,
        ':school' => $school,
        ':phone' => $phone !== '' ? $phone : null,
        ':email' => $email !== '' ? $email : null,
        ':consent' => 1,
        ':consent_text' => $consentText,
        ':consented_at' => $now,
        ':created_at' => $now,
        ':user_agent' => $userAgent,
        ':ip_address' => $ipAddress,
    ]);

    $leadId = (int)$pdo->lastInsertId();

    if (!empty($answers)) {
        $answerStmt = $pdo->prepare('INSERT INTO lead_answers (lead_id, question_id, answer_value, created_at) VALUES (:lead_id, :question_id, :answer_value, :created_at)');
        foreach ($answers as $questionId => $answerValue) {
            $answerStmt->execute([
                ':lead_id' => $leadId,
                ':question_id' => (string)$questionId,
                ':answer_value' => is_bool($answerValue) ? ($answerValue ? '1' : '0') : (is_scalar($answerValue) ? (string)$answerValue : json_encode($answerValue, JSON_UNESCAPED_UNICODE)),
                ':created_at' => $now,
            ]);
        }
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(['ok' => false, 'error' => '保存中にエラーが発生しました'], 500);
}

json_response(['ok' => true, 'lead_id' => $leadId]);
