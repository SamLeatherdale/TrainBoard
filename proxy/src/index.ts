const handler: ExportedHandler<{ API_KEY: string }> = {
    async fetch(request, env) {
        // The URL for the remote third party API you want to fetch from
        // but does not implement CORS
        const fetchAllowlist = ["https://api.transport.nsw.gov.au/"].map((url) => new URL(url));
        const originAllowlist = [
            /^https?:\/\/localhost(:\d+)?$/,
            /^https:\/\/.+\.samleatherdale\.com$/,
            /^https:\/\/([\w-]*-)?trainboard\.netlify\.app$/,
            /^https:\/\/[\w-]+\.ngrok\.io$/,
            /^https:\/\/[\w-]+\.ngrok-free\.app$/,
        ];

        const url = new URL(request.url);
        const origin = request.headers.get("Origin");
        const apiUrl = url.searchParams.get("url");

        if (
            !apiUrl ||
            !fetchAllowlist.some((allowed) => new URL(apiUrl).origin === allowed.origin)
        ) {
            const error = `Fetch URL ${apiUrl} not allowed`;
            console.error(error);
            return new Response(error, {
                status: 403,
                statusText: error,
            });
        }
        if (!origin || !isListed(origin, originAllowlist)) {
            const error = `Origin ${origin} not allowed`;
            console.error(error);
            return new Response(error, {
                status: 403,
                statusText: error,
            });
        }

        if (request.method === "OPTIONS") {
            // Handle CORS preflight requests
            return handleOptions(request, origin);
        } else if (
            request.method === "GET" ||
            request.method === "HEAD" ||
            request.method === "POST"
        ) {
            // Handle requests to the API server
            return handleRequest(request, apiUrl, origin);
        } else {
            return new Response(null, {
                status: 405,
                statusText: "Method Not Allowed",
            });
        }
        async function handleRequest(request: Request, apiUrl: string, origin: string) {
            // Rewrite request to point to API URL. This also makes the request mutable
            // so you can add the correct Origin header to make the API server think
            // that this request is not cross-site.
            console.log(apiUrl);
            request = new Request(apiUrl, {
                method: request.method,
                body: request.body,
            });
            request.headers.set("Authorization", `apikey ${env.API_KEY}`);
            request.headers.set("Accept", "application/json");
            let response = await fetch(request);
            // Recreate the response so you can modify the headers

            response = new Response(response.body, {
                headers: response.headers,
                status: response.status,
                statusText: response.statusText,
            });

            // Set CORS headers
            response.headers.set("Access-Control-Allow-Origin", origin);

            // Append to/Add Vary header so browser will cache response correctly
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin#cors_and_caching
            response.headers.append("Vary", "Origin");

            return response;
        }

        async function handleOptions(request: Request, origin: string) {
            if (
                request.headers.get("Origin") !== null &&
                request.headers.get("Access-Control-Request-Method") !== null &&
                request.headers.get("Access-Control-Request-Headers") !== null
            ) {
                // Handle CORS preflight requests.
                return new Response(null, {
                    headers: {
                        "Access-Control-Allow-Origin": origin,
                        "Access-Control-Allow-Headers":
                            request.headers.get("Access-Control-Request-Headers") || "",
                        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
                        "Access-Control-Max-Age": "86400",
                    },
                });
            } else {
                // Handle standard OPTIONS request.
                return new Response(null, {
                    headers: {
                        Allow: "GET, HEAD, POST, OPTIONS",
                    },
                });
            }
        }
    },
};

export default handler;

function isListed(url: string, allowlist: RegExp[]) {
    return allowlist.some((allowed) => allowed.test(url));
}
