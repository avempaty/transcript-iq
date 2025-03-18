/// <reference lib="dom" />

import BaseError from "../base-error";

class StatusCodeError extends BaseError<{ status: number; url: string }> {}
class NetworkError extends BaseError<{ url: string }> {}
class JSONParseError extends BaseError<{ bodyText?: string }> {}

class APIClient {
    host: string;
    defaultHeaders: Headers;
    apiKey: string | undefined;

    constructor(host: string, apiKey?: string) {
        this.host = host;
        if (apiKey) {
            this.apiKey = apiKey;
        }
        this.defaultHeaders = {
            // @ts-expect-error Header refers to wrong Header class
            "Content-Type": "application/json",
        };
    }

    getDefaultHeaders(): Headers {
        if (this.apiKey) {
            return {
                ...this.defaultHeaders,
                // @ts-expect-error Header refers to wrong Header class
                Authorization: `Bearer ${this.apiKey}`,
            };
        }
        return this.defaultHeaders;
    }

    async jsonFetch(url: string, init: RequestInit = { method: "GET" }) {
        let response;
        try {
            response = await fetch(`${this.host}${url}`, {
                ...init,
                headers: this.getDefaultHeaders(),
            });
        } catch (err) {
            // network error
            throw NetworkError.wrap(err as Error, "network error", { url });
        }

        if (!response.ok) {
            // failure, check status code
            throw new StatusCodeError(
                response.statusText ?? "status code error",
                { status: response.status, url }
            );
        }

        // success
        let bodyText;
        try {
            bodyText = await response.text();
        } catch (err) {
            throw NetworkError.wrap(
                err as Error,
                "network error: receiving body",
                { url }
            );
        }
        try {
            const bodyJSON = JSON.parse(bodyText);
            return bodyJSON;
        } catch (err) {
            throw JSONParseError.wrap(err as Error, "json parse error", {
                bodyText,
            });
        }
    }

    async jsonPost(
        url: string,
        body: unknown,
        init: Omit<RequestInit, "body" | "method"> = {}
    ) {
        return this.jsonFetch(url, {
            ...init,
            method: "POST",
            body: JSON.stringify(body),
        });
    }
}

// export singleton
export default APIClient;
