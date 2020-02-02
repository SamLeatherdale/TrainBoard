<?php
/*
 * Script to download the swagger codegen files for the Trip Planner API.
 */

function getZip(string $url, array $headers, array $payload) {
    $ch = curl_init($url);

    //Convert headers from key value pairs to flat strings.
    $headers = array_map(function(string $key, string $value) {
        return $key . ": " . $value;
    }, array_keys($headers), $headers);

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_BINARYTRANSFER => true
    ]);

    $isPost = true;
    if ($isPost) {
        curl_setopt_array($ch, [
            CURLOPT_POSTFIELDS => file_get_contents("php://input"),
            CURLOPT_POST => json_encode($payload)
        ]);
    }

    $res = curl_exec($ch);
    return $res;
}

$files = [
    "TripPlanner" => "https://opendata.transport.nsw.gov.au/sites/default/files/swagger/TripPlanner.json"
];
if (!is_dir("temp")) {
    mkdir("temp");
}

foreach ($files as $name => $url) {
    echo "Downloading $name zip...\n";
    $zip = getZip("https://generator3.swagger.io/api/generate", [
        "Accept" => "application/octet-stream",
        "Content-Type" => "application/json"
    ], [
        "lang" => "typescript-angular",
        "specURL" => $url,
        "type" => "CLIENT",
        "codegenVersion" => "V3"
    ]);
    echo "Writing $name zip to file...\n";
    file_put_contents("temp/swagger-api-$name.zip", $zip);
}