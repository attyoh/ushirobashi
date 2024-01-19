<?php
// 設定
require_once 'config.php';
Config::setConfigDirectory(__DIR__ . "/config");
$userId = Config::get('lineUserId');                      // 通知を受け取るLineユーザーのID
$channelAccessToken = Config::get('channelAccessToken');  // Line Messaging APIのアクセストークン
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
            $accessDateTime = isset($matches[2]) ? $matches[2] : '日時不明';

            // whois情報を取得
            $whoisInfo = shell_exec('whois ' . $detectedIP);

            // ログファイルに通知を追加
            $logEntry = '[' . date('Y-m-d H:i:s') . '] 検出された単語: ' . $keywordToDetect . PHP_EOL;
            $logEntry = '[' . date('Y-m-d H:i:s') . '] 検出された単語: ' . $keywordToDetect . ', IPアドレス: ' . $detectedIP . ', アクセスされた日時: ' . $accessDateTime . PHP_EOL;
            $logEntry .= 'Whois情報:' . PHP_EOL . $whoisInfo . PHP_EOL;
            file_put_contents($logOutputFile, $logEntry, FILE_APPEND);

            $message = $keywordToDetect . 'が検出されました!' . PHP_EOL . PHP_EOL . '現在' . $sleeptime . '秒間隔で監視しています。' . PHP_EOL . PHP_EOL . '以下にwhois情報を表示します。' . PHP_EOL . $whoisInfo;
            
            // Lineに通知を送信
            sendLineNotification($channelAccessToken, $userId, $message);
        }

        // 最後に読み取った位置を更新
        $lastPosition += strlen($logContent);
    }

    // 一定の間隔で確認するために待機
    sleep($sleeptime);
}

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
?>
