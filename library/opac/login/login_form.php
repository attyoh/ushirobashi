<?php
session_start();

$message = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // データベース接続情報
    $servername = "localhost";
    $username = "ushiro";
    $password = "XB7eushiro";
    $dbname = "ushiro";

    // フォームから送信されたデータ
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // データベースに接続
    $conn = new mysqli($servername, $username, $password, $dbname);

    // 接続エラーの確認
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // ユーザー情報の取得
    $sql = "SELECT * FROM lib WHERE username='$user'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hashed_password = $row["password"];

        // パスワードの検証
        if (password_verify($pass, $hashed_password)) {
            // ログイン成功時の処理
            $_SESSION['username'] = $user;
            header("Location: /library/opac/library/");  // ログイン成功時に /library/opac/library/ にリダイレクト
            exit();
        } else {
            // ログイン失敗時の処理
            $_SESSION['login_error'] = "incorrect";
            $message = "login false";
        }
    } else {
        // ログイン失敗時の処理
        $_SESSION['login_error'] = "incorrect";
        $message = "login false";
    }
    
    // データベース接続を閉じる
    $conn->close();
}

$message = htmlspecialchars($message);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    
    <h2>Login</h2>
    <div class="text-danger mt-5" style="font-size: 14px"><?= $message; ?></div>
    <form action="login_form.php" method="post">
        <label for="username">Username:</label>
        <input type="text" name="username" pattern="[a-zA-Z0-9]+" title="英数字のみ使用可能" required><br>
        
        <label for="password">Password:</label>
        <input type="password" name="password" required><br>
        
        <input type="submit" value="Login" name="Login">
    </form>

    <h2>Register</h2>
    <form action="register.php" method="post">
        <label for="new_username">New Username:</label>
        <input type="text" name="new_username" pattern="[a-zA-Z0-9]+" title="英数字のみ使用可能" required><br>
        
        <label for="new_password">New Password:</label>
        <input type="password" name="new_password" required><br>
        
        <input type="submit" value="Register">
    </form>
</body>
</html>