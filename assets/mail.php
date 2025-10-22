<?php
header('Content-Type: application/json');

// Enable CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Sanitize and validate input
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get form data
$firstName = isset($_POST['firstName']) ? sanitizeInput($_POST['firstName']) : '';
$lastName = isset($_POST['lastName']) ? sanitizeInput($_POST['lastName']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
$interest = isset($_POST['interest']) ? sanitizeInput($_POST['interest']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Validation
$errors = [];

if (empty($firstName)) {
    $errors[] = 'First name is required';
}

if (empty($lastName)) {
    $errors[] = 'Last name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!validateEmail($email)) {
    $errors[] = 'Invalid email format';
}

if (empty($phone)) {
    $errors[] = 'Phone number is required';
}

// If there are validation errors
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please fix the following errors: ' . implode(', ', $errors)
    ]);
    exit;
}

// Email configuration
$to = 'hello@vony.com'; // Change this to your actual email
$subject = 'New Contact Form Submission - Vony';

// Create email body
$emailBody = "
New contact form submission from Vony website:

Name: {$firstName} {$lastName}
Email: {$email}
Phone: {$phone}
Interest: {$interest}
Message: {$message}

Submitted at: " . date('Y-m-d H:i:s') . "
IP Address: " . $_SERVER['REMOTE_ADDR'] . "
";

// Email headers
$headers = [
    'From: ' . $email,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Try to send email
if (mail($to, $subject, $emailBody, implode("\r\n", $headers))) {
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We\'ll get back to you soon.'
    ]);
} else {
    // Error response
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again later.'
    ]);
}

// Log the submission (optional)
$logEntry = date('Y-m-d H:i:s') . " - Contact form submission from {$firstName} {$lastName} ({$email})\n";
file_put_contents('contact_log.txt', $logEntry, FILE_APPEND | LOCK_EX);
?>
