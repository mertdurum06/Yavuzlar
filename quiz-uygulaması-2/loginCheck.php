<?php

$username = $_POST["username"];
$password = $_POST["password"];

if ($username == "" || $password == "") {
    return;
}

session_start();

include "../quest-app-task-2/connectdb.php";


$sql = "SELECT * FROM users WHERE username = :username AND password = :password";
$stmt = $db->prepare($sql);
$stmt->execute(
    array(
        'username' => $username,
        'password' => $password
    )
);

$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!empty($result)) {
    $sql_role = "SELECT name FROM roles WHERE id = :role_id";
    $stmt_role = $db->prepare($sql_role);
    $stmt_role->execute([
       'role_id' => $result["role_id"]
    ]);

    $result_role = $stmt_role->fetch(PDO::FETCH_ASSOC);

    $_SESSION["role"] = $result_role["name"];
    $_SESSION["id"] = $result["id"];

    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Giriş Başarılı</title>
    </head>
    <body>
        <script>
            alert("Giriş Başarılı!");
            location.href = "index.php";
        </script>
    </body>
    </html>

    <?php

} else {
?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kullanıcı Bulunamadı</title>
    </head>

    <body>

        <script>
            alert("Kullanıcı Bulunamadı");
            location.href = "login.php";
        </script>
    </body>

    </html>

<?php
}