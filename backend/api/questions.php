<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

apply_cors();
handle_options_if_needed();

$pdo = get_db_connection();

try {
    // Fetch questions ordered by sort_order
    $stmt = $pdo->query("
        SELECT 
            q.id, 
            q.text, 
            q.type, 
            qo.option_text 
        FROM questions q
        LEFT JOIN question_options qo ON q.id = qo.question_id
        WHERE q.active = 1
        ORDER BY q.sort_order ASC, qo.sort_order ASC
    ");

    $rawQuestions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $questions = [];
    $tempMap = [];

    foreach ($rawQuestions as $row) {
        $qId = $row['id'];
        
        if (!isset($tempMap[$qId])) {
            $tempMap[$qId] = [
                'id' => (int)$qId,
                'text' => $row['text'],
                'type' => $row['type'],
                // 'options' field will be added only if there are options
            ];
        }

        if ($row['option_text'] !== null) {
            if (!isset($tempMap[$qId]['options'])) {
                $tempMap[$qId]['options'] = [];
            }
            $tempMap[$qId]['options'][] = $row['option_text'];
        }
    }

    // Convert map to indexed array to preserve sort order from DB query
    $questions = array_values($tempMap);

    json_response(['questions' => $questions]);

} catch (PDOException $e) {
    json_response(['ok' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
}
