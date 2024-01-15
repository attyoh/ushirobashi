<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // データベース接続情報
    $servername = "localhost";
    $username = "ushiro";
    $password = "XB7eushiro";
    $dbname = "ushiro";

    // フォームから送信されたデータ
    $new_user = $_POST['new_username'];
    $new_pass = password_hash($_POST['new_password'], PASSWORD_DEFAULT); // パスワードのハッシュ化

    // データベースに接続
    $conn = new mysqli($servername, $username, $password, $dbname);

    // 接続エラーの確認
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // 新しいユーザーの追加
    $sql = "INSERT INTO lib (username, password) VALUES ('$new_user', '$new_pass')";
    if ($conn->query($sql) === TRUE) {
        echo "新しいユーザーが登録されました";
    } else {
        echo "エラー: " . $sql . "<br>" . $conn->error;
    }

    // データベース接続を閉じる
    $conn->close();
}
?>
