<?php
session_start();

$message = "a";
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
            $message = "メールアドレスもしくはパスワードが異なります";
            header("Location: login_form.php");  // ログイン失敗時に login.html にリダイレクト
            exit();
        }
    } else {
        // ログイン失敗時の処理
        $_SESSION['login_error'] = "incorrect";
        $message = "メールアドレスもしくはパスワードが異なります";
        header("Location: login_form.php");  // ログイン失敗時に login.html にリダイレクト
        exit();
    }
    
    // データベース接続を閉じる
    $conn->close();
}

$message = htmlspecialchars($message);
?>