<?php
session_start();
$db = sqlite_open("library.sqlite");
$account = $_POST["account"];
$query = sqlite_query($db, "SELECT * FROM users WHERE user_name = 'account'");
$record = sqlite_fetch_array($query, SQLITE_ASSOC);

if ($_POST["mode"] == "login" && sqlite_num_rows($query) > 0 && $_POST["password"] == $record["user__password"]) {
    $_SESSION["userid"] = $record["user_id"];
    header("Location:/library/opac/library/index.php");
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン処理</title>
</head>
<body>
    <?php
        // ログイン処理状態
        if ($_POST["mode"] == "login") {
            if (splite_num_rows($query) == 0) {
                echo '新規ユーザー登録<br>';
                echo '<form action="login.php" method="POST">';
                echo 'ユーザー名 <input type="text" name="account" value="'.$_POST["account"].'"><br>';
                echo 'パスワード <input type="password" name="password"><br>';
                echo 'パスワード（確認）<input type="password" name="confirm"><br>';
                echo '<input type="hidden" name="mode" value="register">';
                echo '<input type="submit" value="登録">';
                echo '</from>';
                echo '<br>';
                echo '<a href="javascript:history.go(-1);">戻る</a>';
            } elseif ($_POST["password"] != $record["user_password"]) {
                echo 'パスワードが違います。<br>';
                echo '<a href="javascript:history.go(-1);">戻る</a>';
            }
        } 
        // パスワード再設定状態
        elseif ($_POST["mode"] == "resetpassword") {
            if ($record["user_password"] == $_POST["password"]) {
                echo 'パスワード再設定<br>';
                echo 'パスワード <input type="password" name="password"><br>';
                echo 'パスワード（確認）<input type="password" name="confirm"><br>';
                echo '<input type="hidden" name="account" value="'.$account.'">';
                echo '<input type="hidden" name="mode" value="modifypassword">';
                echo '<input type="submit" value="登録">';
                echo '</from>';
            } else {
                echo 'パスワードが違います。<br>';
                echo '<a href="javascript:history.go(-1);">戻る</a>';
            }
        }
        // 新規ユーザー登録状態
        elseif ($_POST["mode"] == "register") {
            if ($_POST["password"] == $_POST["confirm"]) {
                $sql = "INSERT INTO users (user_name, user_password) VALUES (";
                $sql .= "'".$_POST["account"]."',";
                $sql .= "'".$_POST["password"]."')";
                echo '登録しました。';
                echo '<a href="/library/opac/library/index.php"> トップページへ </a>';
            } else {
                echo 'パスワードを再確認してください。<br>';
                echo '<a href="javascript:history.go(-1);">戻る</a>';
            }
        } 
        // パスワード変更状態
        elseif ($_POST["mode"] == "modifypassword") {
            if ($_POST["password"] == $_POST["confirm"]) {
                $sql = "UPDATE users";
                $sql .= "SET user_password = ";
                sqlite_query($db, $sql);
                echo '登録しました。';
                echo '<a href="/library/opac/library/index.php"> トップページへ </a>';
            } else {
                echo 'パスワードを再確認してください。<br>';
                echo '<a href="javascript:history.go(-1);">戻る</a>';
            }
        }
    ?>
</body>
</html>
