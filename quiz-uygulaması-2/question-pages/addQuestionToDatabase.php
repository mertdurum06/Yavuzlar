<?php 
include "connectdb.php";


$title = $_POST['T'] ?? null;
$question = $_POST['Q'] ?? null;
$optionA = $_POST['A'] ?? null;
$optionB = $_POST['B'] ?? null;
$optionC = $_POST['C'] ?? null;
$optionD = $_POST['D'] ?? null;
$correctOption = $_POST['correctAnswer'] ?? null;
$difficulty = $_POST['difficulty'] ?? null;


$sql = "INSERT INTO questions (title, question, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES (:title, :question, :optionA, :optionB, :optionC, :optionD, :correct_option, :difficulty)";
$stmt = $db->prepare($sql);

$stmt->bindParam(':title', $title);
$stmt->bindParam(':question', $question);
$stmt->bindParam(':optionA', $optionA);
$stmt->bindParam(':optionB', $optionB);
$stmt->bindParam(':optionC', $optionC);
$stmt->bindParam(':optionD', $optionD);
$stmt->bindParam(':correct_option', $correctOption);
$stmt->bindParam(':difficulty', $difficulty);

if ($stmt->execute()) {
    echo "Soru başarıyla eklendi!";
} else {
    echo "Veritabanı hatası: " . $stmt->errorInfo()[2];
}
?>
