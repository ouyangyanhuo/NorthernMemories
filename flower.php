<?php
// 初始化花的数量，可以从数据库或文件中获取，示例中使用静态值
$flowerCountFile = 'flower_count.json'; // 存储花的数量的文件

// 如果文件不存在，初始化花的数量为 0
if (!file_exists($flowerCountFile)) {
    file_put_contents($flowerCountFile, json_encode(['count' => 0]));
}

// 获取当前的花的数量
$flowerData = json_decode(file_get_contents($flowerCountFile), true);

// 处理请求
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 获取 POST 请求中的数据
    $data = json_decode(file_get_contents('php://input'), true);

    // 如果请求的是献花动作，则增加花的数量
    if ($data['action'] === '献花') {
        $flowerData['count'] += 1;

        // 更新花的数量到文件
        file_put_contents($flowerCountFile, json_encode($flowerData));

        // 返回花的数量
        echo json_encode($flowerData);
    } else {
        // 如果请求不合法，返回错误
        echo json_encode(['error' => '无效的操作']);
    }
} else {
    // 如果不是 POST 请求，返回错误
    echo json_encode(['error' => '无效的请求方式']);
}
?>
