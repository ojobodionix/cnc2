<?php
header('Content-Type: application/json');

try {
    // Validate CSRF token if implemented
    // session_start();
    // if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    //     throw new Exception('Invalid security token');
    // }

    // Validate required fields
    $required_fields = ['first_name', 'last_name', 'email', 'phone', 'cryptocurrency', 'value', 'description'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Missing required field: {$field}");
        }
    }

    // Sanitize and validate input
    $first_name = filter_var(trim($_POST['first_name']), FILTER_SANITIZE_STRING);
    $last_name = filter_var(trim($_POST['last_name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $phone = filter_var(trim($_POST['phone']), FILTER_SANITIZE_STRING);
    $cryptocurrency = filter_var(trim($_POST['cryptocurrency']), FILTER_SANITIZE_STRING);
    $value = filter_var(trim($_POST['value']), FILTER_VALIDATE_FLOAT);
    $description = filter_var(trim($_POST['description']), FILTER_SANITIZE_STRING);

    if (!$email) {
        throw new Exception('Invalid email address');
    }

    if (!$value || $value <= 0) {
        throw new Exception('Invalid currency value');
    }

    // Database configuration
    $db_config = [
        'host' => 'localhost',
        'dbname' => 'u570141899_cncintell',
        'username' => 'u570141899_cncintell',
        'password' => 'Oldtimers123$'
    ];

    // Connect to database
    $pdo = new PDO(
        "mysql:host={$db_config['host']};dbname={$db_config['dbname']};charset=utf8mb4",
        $db_config['username'],
        $db_config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false // Corrected typo here
        ]
    );

    // Insert data into database
    $stmt = $pdo->prepare('INSERT INTO user_reports (first_name, last_name, email, phone, cryptocurrency, value, description) VALUES (:first_name, :last_name, :email, :phone, :cryptocurrency, :value, :description)');
    $stmt->execute([
        ':first_name' => $first_name,
        ':last_name' => $last_name,
        ':email' => $email,
        ':phone' => $phone,
        ':cryptocurrency' => $cryptocurrency,
        ':value' => $value,
        ':description' => $description
    ]);

    // Return success response
    echo json_encode(['success' => true, 'message' => 'Report submitted successfully']);
} catch (Exception $e) {
    // Return error response
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}