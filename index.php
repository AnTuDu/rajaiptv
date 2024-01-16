<?php
$userParam = isset($_GET['user']) ? $_GET['user'] : null;

if ($userParam) {
    $redirectTo = 'https://tvj.rediptv.live/a?user=' . urlencode($userParam);
    header("Location: $redirectTo", true, 302);
    exit;
} else {
    echo '<h1>Original request</h1>';
}
?>