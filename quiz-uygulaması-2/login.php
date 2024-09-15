<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Giriş Yap</title>
</head>

<body>

    <div class="container">
        <div class="user-login-register">
            <h3>
                ÜYE GİRİŞİ
            </h3>
            <form action="loginCheck.php" method="post">
                <div class="username">
                    <label for="username">Kullanıcı Adı</label>
                    <input type="text" name="username" id="username">
                </div>

                <div class="password">
                    <label for="password">Şifre</label>
                    <input type="password" name="password" id="password">
                </div>

                <button class="button" type="submit">Giriş Yap</button>

            </form>

            <p>Üye değil misiniz ? <span><a href="register.php">Üye olun.</a></span></p>
        </div>

    </div>
</body>

</html>