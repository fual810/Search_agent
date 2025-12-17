<?php
// backend/setup_db.php

$host = 'localhost';
$user = 'root';
$pass = ''; // Default XAMPP password
$dbName = 'jobmatch';

echo "Connecting to MySQL...\n";

try {
    // 1. Connect to MySQL server (no DB selected yet)
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to MySQL server successfully.\n";

    // 2. Create Database if not exists
    echo "Creating database '$dbName' if not exists...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database created or already exists.\n";

    // 3. Connect to the specific database
    $pdo->exec("USE `$dbName`");

    // 4. Create Tables
    echo "Creating tables...\n";

    // Table: leads
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
    )";
    $pdo->exec($sqlLeads);
    echo "Table 'leads' created or already exists.\n";

    // Table: lead_answers
    $sqlAnswers = "
    CREATE TABLE IF NOT EXISTS lead_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lead_id INT NOT NULL,
        question_id VARCHAR(50) NOT NULL,
        answer_value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    )";
    $pdo->exec($sqlAnswers);
    echo "Table 'lead_answers' created or already exists.\n";

    echo "Setup complete!\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
