<?php


$username = $_POST["username"];
$password = $_POST["password"];

if ($username == "" || $password == "") {
    return;
}

include "../quest-app-task-2/connectdb.php";

$sql_user_check = "SELECT * FROM users WHERE username = :username";
$stmt_user_check = $db->prepare($sql_user_check);
$stmt_user_check->execute(
        ['username' => $username]
);

$result = $stmt_user_check->fetch(PDO::FETCH_ASSOC);

if($result){
    ?>
    <script>
    alert("Kullanıcı adı mevcut");
    location.href = "register.php";
    </script>
    <?php
    return;
}



$sql = "INSERT INTO users(username, password, role_id) VALUES (?,?,?)";
$stmt = $db->prepare($sql);
$stmt->execute([$username, $password, 2]);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div class="container">
        <h1>Üyelik Başarılı!</h1>
        <form action="login.php">
            <button type="submit" class="button"> Giriş Yap</button>
        </form>
    </div>
</body>
</html>
