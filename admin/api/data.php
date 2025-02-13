<?php
// You can replace this with a database query
$dataPoints = [
    ["label" => "January", "value" => 100],
    ["label" => "February", "value" => 150],
    ["label" => "March", "value" => 80],
    ["label" => "April", "value" => 120]
];

// Output data as JSON
header('Content-Type: application/json');
echo json_encode($dataPoints);
?>
