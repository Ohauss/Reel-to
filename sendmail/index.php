<?php
header('Content-Type: application/json');
require 'config.php';

try {
    $mail->setFrom('s.kibkalo@gmail.com', 'Лист від мене');
    $mail->addAddress('s.kibkalo@gmail.com');
    $mail->Subject = 'Нова заявка з сайту';

    $body = '<h1>Нова заявка з контактної форми</h1>';

    if (!empty($_POST['name'])) {
        $body .= '<p><strong>Name:</strong> ' . htmlspecialchars(trim($_POST['name'])) . '</p>';
    }

    if (!empty($_POST['company'])) {
        $body .= '<p><strong>Company:</strong> ' . htmlspecialchars(trim($_POST['company'])) . '</p>';
    }

    if (!empty($_POST['email'])) {
        $body .= '<p><strong>Email:</strong> ' . htmlspecialchars(trim($_POST['email'])) . '</p>';
    }

    if (!empty($_POST['phone'])) {
        $body .= '<p><strong>Phone:</strong> ' . htmlspecialchars(trim($_POST['phone'])) . '</p>';
    }

    if (!empty($_POST['message'])) {
        $body .= '<p><strong>Message:</strong> ' . nl2br(htmlspecialchars(trim($_POST['message']))) . '</p>';
    }

    $mail->Body = $body;
    $mail->IsHTML(true);

    if (!$mail->send()) {
        throw new Exception('Mail Error: ' . $mail->ErrorInfo);
    }

    echo json_encode(['message' => 'Email sent successfully!']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error: ' . $e->getMessage()]);
}
