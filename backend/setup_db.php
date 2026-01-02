<?php
// match_agent_backend/setup_db.php
// config.php の設定を読み込んでテーブルを作成します。

require_once __DIR__ . '/config.php';

// エラー表示設定
ini_set('display_errors', '1');
error_reporting(E_ALL);

echo "Connecting to database using config.php settings...<br>";

try {
    $pdo = get_db_connection();
    echo "Connected successfully.<br>";

    echo "Creating tables...<br>";

    // 1. Table: leads
    $sqlLeads = "
    CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        school VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        consent TINYINT(1) DEFAULT 0,
        consent_text TEXT,
        consented_at DATETIME,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlLeads);
    echo "Table 'leads' checked/created.<br>";

    // 2. Table: questions
    $sqlQuestions = "
    CREATE TABLE IF NOT EXISTS questions (
        id INT PRIMARY KEY,
        text TEXT NOT NULL,
        type VARCHAR(20) DEFAULT 'swipe', -- 'swipe', 'selection', etc.
        active TINYINT(1) DEFAULT 1,
        sort_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlQuestions);
    echo "Table 'questions' checked/created.<br>";

    // 3. Table: question_options (New)
    $sqlOptions = "
    CREATE TABLE IF NOT EXISTS question_options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_id INT NOT NULL,
        option_text VARCHAR(255) NOT NULL,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlOptions);
    echo "Table 'question_options' checked/created.<br>";

    // 4. Table: lead_answers
    $sqlAnswers = "
    CREATE TABLE IF NOT EXISTS lead_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_id INT NOT NULL,
        question_id INT NOT NULL,
        answer_value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlAnswers);
    echo "Table 'lead_answers' checked/created.<br>";

    // 5. Insert Initial Data
    echo "Inserting initial data...<br>";

    // Clear existing data to avoid duplicates (optional, for safety)
    $pdo->exec("TRUNCATE TABLE question_options");
    $pdo->exec("DELETE FROM questions");

    // Questions
    $sqlInsertQuestions = "INSERT INTO questions (id, text, type, sort_order) VALUES
    (1, '働くなら、やっぱり都会（東京・大阪など）に出たい？', 'swipe', 1),
    (2, '誰も知らない『隠れ優良企業』なら、名前は知らなくても興味ある？', 'swipe', 2),
    (3, '人と話すよりも、モノづくりや専門スキルを磨く方が好き？', 'swipe', 3),
    (4, 'IT・Web業界のスピード感ある環境に憧れる？', 'swipe', 4),
    (5, 'ぶっちゃけ、今の自分の就活状況に『焦り』を感じている？', 'swipe', 5),
    (6, '自己分析や企業探し、一人でやるのは正直しんどい？', 'swipe', 6),
    (7, 'できれば、1〜2ヶ月以内には内定を決めて安心したい？', 'swipe', 7),
    (8, 'プロがあなたに合った企業を提案してくれるなら、話を聞いてみたい？', 'swipe', 8),
    (9, '卒業予定年度を教えてください', 'selection', 9)";
    $pdo->exec($sqlInsertQuestions);

    // Question Options (for Q9)
    $sqlInsertOptions = "INSERT INTO question_options (question_id, option_text, sort_order) VALUES
    (9, '26卒', 1),
    (9, '27卒', 2),
    (9, '28卒', 3),
    (9, '既卒', 4)";
    $pdo->exec($sqlInsertOptions);

    echo "Initial data inserted.<br>";

    echo "<strong>Setup complete!</strong>";

} catch (PDOException $e) {
    echo "Error: " . htmlspecialchars($e->getMessage());
} catch (Exception $e) {
    echo "General Error: " . htmlspecialchars($e->getMessage());
}
