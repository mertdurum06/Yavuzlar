<?php
include "connectdb.php";

$id = $_POST['id']; 
$title = $_POST['T'];
$question = $_POST['Q'];
$optionA = $_POST['A'];
$optionB = $_POST['B'];
$optionC = $_POST['C'];
$optionD = $_POST['D'];
$correctOption = $_POST['correctAnswer'];
$difficulty = $_POST['difficulty'];


$sql = "UPDATE questions 
        SET title = :title, question = :question, option_a = :option_a, 
            option_b = :option_b, option_c = :option_c, option_d = :option_d, 
            correct_option = :correct_option, difficulty = :difficulty 
        WHERE id = :id";

$stmt = $db->prepare($sql);


$stmt->bindParam(':title', $title);
$stmt->bindParam(':question', $question);
$stmt->bindParam(':option_a', $optionA);
$stmt->bindParam(':option_b', $optionB);
$stmt->bindParam(':option_c', $optionC);
$stmt->bindParam(':option_d', $optionD);
$stmt->bindParam(':correct_option', $correctOption);
$stmt->bindParam(':difficulty', $difficulty);
$stmt->bindParam(':id', $id, PDO::PARAM_INT); 


try {
    $stmt->execute();
    ?>
    <script>
        alert("Soru başarıyla güncellendi.");
        location.href = "../admin-panel.php"; 
    </script>
    <?php
} catch (PDOException $e) {
    echo 'Veritabanı hatası: ' . $e->getMessage();
}
?>
