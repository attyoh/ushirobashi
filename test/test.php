<?php
// $to = 'business.832@outlook.jp';
// $subject = 'Test Email';
// $message = 'This is a test email sent from observer.php';
// $headers = 'From: business.832@outlook.jp';

// mail($to, $subject, $message, $headers);

// 設定
$logOutputFile = '/var/www/html/log/output.log';  // ログを保存するファイルのパス
$detectedIP = "203.181.237.86";

// whois情報を取得
$whoisInfo = shell_exec('whois ' . $detectedIP);

// コメントアウト行から改行を除去
$whoisInfo = preg_replace('/#.*\K\R/', '', $whoisInfo);

// コメントアウト行を除去
$whoisInfo = preg_replace('/#.*$/m', '', $whoisInfo);

// ログファイルに通知を追加
$logEntry .= 'Whois情報:' . PHP_EOL . $whoisInfo . PHP_EOL;
file_put_contents($logOutputFile, $logEntry, FILE_APPEND);
?>
