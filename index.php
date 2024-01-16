<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirect Page</title>
</head>
<body>
<?php
  // Get the 'user' parameter from the URL
  $userParam = isset($_GET['user']) ? $_GET['user'] : null;

  // Check if the 'user' parameter is present
  if ($userParam) {
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
</body>
</html>