<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

/**
 * Perform a request to the specified URL, using the given headers.
 * @param string $url
 * @param array $headers
 */
function request(string $url, array $headers) {
    $ch = curl_init($url);

    //Convert headers from key value pairs to flat strings.
    $headers = array_map(function(string $key, string $value) {
        return $key . ": " . $value;
    }, array_keys($headers), $headers);

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,

    ]);

    $isPost = strcasecmp("POST", $_SERVER["REQUEST_METHOD"]) === 0;
    if ($isPost) {
        curl_setopt_array($ch, [
            CURLOPT_POSTFIELDS => file_get_contents("php://input"),
            CURLOPT_POST => true
        ]);
    }

    $res = curl_exec($ch);
    echo $res;
}

/**
 * Gets request headers passed in to this script.
 * @return string[]
 */
function getRequestHeaders(): array {
    $headers = array();
    foreach($_SERVER as $key => $value) {
        if(strpos($key, 'HTTP_') === 0) {
            $headers[str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))))] = $value;
        }
    }
    return $headers;
}

/**
 * Gets only the specified request headers passed in to this script.
 * @param string[] $filters
 * @return string[]
 */
function getFilteredRequestHeaders(array $filters): array {
    return array_filter(getRequestHeaders(), function(string $header) use ($filters) {
        return in_array($header, $filters);
    }, ARRAY_FILTER_USE_KEY);
}


$passthrough_headers = ["Authorization"];
$url = substr($_SERVER["REQUEST_URI"], 1);
$headers = getFilteredRequestHeaders($passthrough_headers);
request($url, $headers);