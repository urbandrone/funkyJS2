<?php
require_once 'includes/utilities.php';

$modules = Utils::requestParam('modules');
$json = null;
if (is_string($modules)) {
    $files = Utils::getFiles(explode(',', $modules), Utils::getFilesMap());
    $json = Utils::transform($files);
}

header('Content-Type: application/json');
echo $json !== null ? json_encode($json) : json_encode(array());
?>