<?php
$motdepasse = "Kerry2004";
$hash = password_hash($motdepasse, PASSWORD_DEFAULT);
echo $hash;
?>
