<?php
// Get the 'user' parameter from the query string
$userParam = isset($_GET['user']) ? $_GET['user'] : null;

// Get the user-agent string
$userAgent = $_SERVER['HTTP_USER_AGENT'];

// Check if 'user' parameter is present and user-agent contains TiviMate
if ($userParam && stripos($userAgent, 'TiviMate') !== false) {
    // Construct the redirection URL
    $redirectTo = 'https://tvj.rediptv.live/a?user=' . urlencode($userParam);

    // Perform the redirect
    header("Location: $redirectTo", true, 302);
    exit;
} else {
    // Display a message for the original request
    echo '<h1>Original request</h1>';
}
?>