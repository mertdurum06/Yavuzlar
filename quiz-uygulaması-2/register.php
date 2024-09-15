<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
</head>

<body>
    <div class="container">
        <div class="user-login-register">
            <h3>
                ÜYE OL
            </h3>
            <form action="registerDatabase.php" method="post">
                <div class="username">
                    <label for="username">Kullanıcı Adı</label>
                    <input type="text" name="username" id="username">
                </div>

                <div class="password">
                    <label for="password">Şifre</label>
                    <input type="password" name="password" id="password">
                </div>
                <div class="buttons">
                <button class="button" type="submit">Üye Ol</button>
            </div>    
            </form>
            
            
            <p>Üye misiniz ? <span><a href="login.php">Giriş Yapın.</a></span></p>
        </div>

    </div>
</body>

</html>