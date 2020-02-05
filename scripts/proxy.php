<?php
/**
 * Perform a request to the specified URL, using the given headers.
 * @param string $url
 * @param array $headers
 */
function request(string $url, array $headers, bool $cache = false) {
	$cache_dir = __DIR__ . "/../cache";
	$cache_file = "last.json";
	$cache_path = $cache_dir . DIRECTORY_SEPARATOR . $cache_file;

	//Try to read from cache
	if ($cache) {
		if (is_readable($cache_path)) {
			echo file_get_contents($cache_path);
			return;
		}
	}

    $ch = curl_init($url);

    //Convert headers from key value pairs to flat strings.
    $headers = array_map(function(string $key, string $value) {
        return $key . ": " . $value;
    }, array_keys($headers), $headers);

    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,

    ]);

    $isPost = false;//strcasecmp("POST", $_SERVER["REQUEST_METHOD"]) === 0;
    if ($isPost) {
        curl_setopt_array($ch, [
            CURLOPT_POSTFIELDS => file_get_contents("php://input"),
            CURLOPT_POST => true
        ]);
    }

    $res = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);

    //Set response code
    http_response_code((int) $http_code);

    if ($err || substr((string)$http_code, 0, 1) !== '2') {
    	http_response_code(500);
    	echo $err;
    	return;
	}

    if ($cache) {
    	if (!is_dir($cache_dir)) {
    		mkdir($cache_dir);
		}
    	file_put_contents($cache_path, $res);
	}
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


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
if (strcasecmp($_SERVER["REQUEST_METHOD"], "OPTIONS") === 0) {
	die();
}
header("Content-Type: application/json");

$passthrough_headers = ["Authorization"];
$url = substr($_SERVER["REQUEST_URI"], 1);
$headers = getFilteredRequestHeaders($passthrough_headers);
request($url, $headers);