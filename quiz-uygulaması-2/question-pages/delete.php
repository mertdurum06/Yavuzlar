<?php
include "connectdb.php";

$id = $_GET["id"];

$sql = "DELETE FROM questions WHERE id = :id";
$stmt = $db->prepare($sql);

$stmt->bindParam(':id', $id, PDO::PARAM_INT);

try {

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        ?>
        <script>alert("Soru Başarıyla Silindi"); location.href = "../admin-panel.php";</script>
        <?php
    } else {
        ?>
        <script>alert("Soru Başarıyla Silindi"); location.href = "../admin-panel.php";</script>
        <?php
        
    }
} catch (PDOException $e) {
    echo "Veritabanı hatası: " . $e->getMessage();
}
?>
