<?php
// 設定
require_once 'config.php';
Config::setConfigDirectory(__DIR__ . "/config");
$userId = Config::get('lineUserId');                      // 通知を受け取るLineユーザーのID
$channelAccessToken = Config::get('channelAccessToken');  // Line Messaging APIのアクセストークン
$slackWebhookUrl = Config::get('slackWebhookUrl');        // Slack Incoming WebhooksのWebhook URL
$logFilePath = '/var/log/httpd/access_log';       // アクセスログのパスを指定
$logOutputFile = '/var/www/html/log/output.log';  // ログを保存するファイルのパス
$keywordToDetect = 'Hydra';                       // 検出したい単語を指定

// 監視
$lastPosition = 0;
$sleeptime = 60;

while (true) {
    // アクセスログの末尾を取得
    $logContent = shell_exec('tail -c +' . $lastPosition . ' ' . $logFilePath);

    // 新しいログがあるか確認
    if (!empty($logContent)) {
        // 検出したい単語がログに含まれているか確認
        if (strpos($logContent, $keywordToDetect) !== false) {
            // 検出されたIPアドレスと日時を取得
            preg_match('/^(\S+) \S+ \S+ \[([^\]]+)\] "(?:GET|POST|PUT|DELETE) .*" \d+ \d+ "(?:.*)" "(?:.*)"$/m', $logContent, $matches);
            // $detectedIP = isset($matches[1]) ? $matches[1] : 'IPアドレス不明';
            $detectedIP = '203.181.237.86';
            $accessDateTime = isset($matches[2]) ? formatDate($matches[2]) : '日時不明';

            // whois情報を取得
            $whoisInfo = shell_exec('whois ' . $detectedIP);

            // ログファイルに通知を追加
            $logEntry = '[' . date('Y-m-d H:i:s') . "]\n検出された単語: " . $keywordToDetect . "\nIPアドレス: " . $detectedIP . "\nアクセスされた日時: " . $accessDateTime . "\n\n";
            $logEntry .= 'Whois情報:' . "\n" . $whoisInfo . "\n";
            file_put_contents($logOutputFile, $logEntry, FILE_APPEND);
            
            $message = $keywordToDetect . "が検出されました!\n" . "アクセスされた日時: " . $accessDateTime . "\n現在" . $sleeptime . "秒間隔で監視しています。\n\n" . 'whois情報を表示します。' . "\n" . $whoisInfo;
            // file_put_contents($logOutputFile, $message, FILE_APPEND);
            
            // Lineに通知を送信
            // sendLineNotification($channelAccessToken, $userId, $message);

            // Slackに通知を送信
            sendSlackNotification($slackWebhookUrl, $message);
        }

        // 最後に読み取った位置を更新
        $lastPosition += strlen($logContent);
    }

    // 一定の間隔で確認するために待機
    sleep($sleeptime);
}


//Lineに通知を送信する関数
function sendLineNotification($channelAccessToken, $userId, $message) {
    $url = 'https://api.line.me/v2/bot/message/multicast';

    $data = [
        "to" => array($userId),
        "messages" => [
            [
                'type' => 'text',
                'text' => $message
            ]
        ]
    ];

    $headers = array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $channelAccessToken
    );

    $ch = curl_init();
    $options = [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
    ];
    curl_setopt_array($ch, $options);
    $result = curl_exec($ch);
    curl_close($ch);
}


// Slackに通知を送信する関数
function sendSlackNotification($webhookUrl, $message) {
    $data = array('text' => $message);

    $options = [
        'http' => [
            'header'  => "Content-type: application/json",
            'method'  => 'POST',
            'content' => json_encode($data)
        ]
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($webhookUrl, false, $context);
}

// 日付を成形
function formatDate($rawDateTime) {
    $timestamp = strtotime($rawDateTime);
    return date('Y年m月d日 H時i分s秒', $timestamp);
}
?>
