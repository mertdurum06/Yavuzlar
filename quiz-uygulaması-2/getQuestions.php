<?php 
include "../quest-app-task-2/connectdb.php";

$sql = "SELECT * FROM questions";
$stmt = $db->prepare($sql);
$stmt->execute();

$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($questions);
?>
