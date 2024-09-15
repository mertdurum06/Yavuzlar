<?php

session_start();

if (empty($_SESSION["role"])) {
    header('Location: login.php');
    return;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Quest App</title>
</head>

<body>
    <div class="container">
        <div class="user-type-panel">
            <h3>
                Lütfen Seçiniz..
            </h3>
            <div class="buttons">
<?php
if ($_SESSION["role"] == 'admin') {
?>
    <a href="./admin-panel.php">Sorular</a>
    <?php
}
else{
    ?>
    <a href="player.html">Yarışmacı Girişi</a>
    <?php
}
?>
<a href="./scoreboard.php">Skor Tablosu</a>
<a href="./logout.php">Çıkış Yap</a>
                
    
            </div>
        </div>

    </div>
</body>

</html>