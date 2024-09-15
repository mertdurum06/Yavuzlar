<?php

session_start();

include "connectdb.php";

$data = json_decode(file_get_contents('php://input'), true);

$logs = $data['logs'];
$score = $data['score'];

$sql = "INSERT INTO logs (user_id, question_id, player_answer) VALUES (:user_id, :question_id, :player_answer)";
$stmt = $db->prepare($sql);

foreach ($logs as $log) {
    $stmt->bindParam(':user_id', $_SESSION["id"]);
    $stmt->bindParam(':question_id', $log['question_id']);
    $stmt->bindParam(':player_answer', $log['player_answer']);
    $stmt->execute();
}

$sql_score = "INSERT INTO scoreboard(user_id, score) VALUES (:user_id, :score)";
$stmt_score = $db->prepare($sql_score);

$stmt_score->bindParam(':user_id', $_SESSION['id']);
$stmt_score->bindParam(':score', $score);
$stmt_score->execute();

header('Location: index.php');
