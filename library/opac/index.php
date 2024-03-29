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
            // $_SESSION['login_error'] = "incorrect";
            $message = "login false";
        }
    } else {
        // ログイン失敗時の処理
        // $_SESSION['login_error'] = "incorrect";
        $message = "login false";
    }
    
    // データベース接続を閉じる
    $conn->close();
}

$message = htmlspecialchars($message);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- saved from url=(0013)about:internet -->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="Content-Language" content="ja">
    <meta name="google" content="notranslate">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="template" content="Login.htmt">
    <title>OPAC</title>
    <style type="text/css">
        @import url("./library/css/login.css");
    </style>

    <script src="./library/script/jquery.js" type="text/javascript"></script>
    <script LANGUAGE="JavaScript">
        <!--
        // accountにフォーカスをあわせる-
        function start() {
        document.FORM.account.focus();
        }
        window.onload = start;
        //-->
    </script>
</head>

<body>
	<a name="pagetop" id="pagetop"></a>

	<!-- START:Header -->
	<div id="topheader">
		<div class="wrapper">

			<!-- START:Header Menu -->
			<ul>
				<li id="navi01"><a href="./library?func=function.management.keysearch&view=view.login.index" target="_blank">システム設定(管理者用)</a></li>
				<li id="navi02"><a href="#">ヘルプ</a></li>
			</ul>
			<!-- END:Header Menu -->

			
			<h1><a href="/"><img src="./library/images/header_logo.gif" alt="図書館システム・インターネットサービス｜OPAC|QuantumTechnology" /></a></h1>
			

		</div>
	</div>
	<!-- END:Header -->

	<!-- START:MainContents -->
	<div id="maincontIndex" class="clearfix">

		<!-- START:MainContents Wrapper -->
		<div class="wrapper">

			<FORM name="FORM" method="POST" action="index.php">
				<!-- <INPUT type="hidden" name="view" value="view.login"><INPUT type="hidden" name="func" value="function.userinfo.portaldsp">

				<input type="hidden" name="count" value=""> -->
				
				<dl>
					<dt>認証画面</dt>
					<dd>
						<p>ユーザーIDとパスワードを入力してください。</p>

						<ul>
							<div class="text-danger mt-5" style="font-size: 14px"><?= $message; ?></div>
							<li><p>ユーザーＩＤ：</p><input name="username" type="text" align="absmiddle" size="20" maxlength="20" /></li>
							<li><p>　パスワード：</p><input name="password" type="password" align="absmiddle" size="20" maxlength="20" /></li>
							<div style="text-align:center;"><input name="autologincheck" id="autologincheck" type="checkbox" value="True">&nbsp;ログイン状態を維持</input></div>
						</ul>

						<p style="margin-left: 200px;">
							
							<input type="image" src="./library/images/btn_login.gif" alt="ログイン" />&nbsp;&nbsp;
							
							<!--
							<br /><br /><a href="./library?func=function.userinfo.portaldsp&view=view.login.index"><img src="./library/images/btn_back.gif" alt="戻る" /></a>
							-->
						</p>

					</dd>
				</dl>
			</form>

		</div>
		<!-- END:MainContents Wrapper -->

	</div>
	<!-- END:MainContents -->

	<!-- START:Footer -->
	<div id="footer" class="clearfix">
		<div class="wrapper">
			<h3><I> Copyright(C) 2001, <B><FONT COLOR="#6060c0">LVZ</FONT></B>, All Rights Reserved </I></h3>
		</div>
	</div>
	<!-- END:Footer -->
</body>
</html>
