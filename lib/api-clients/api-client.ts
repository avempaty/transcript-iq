/// <reference lib="dom" />

// import ApiClient, { InvalidResponseError, StatusCodeError } from 'simple-api-client';
import BaseError from "../base-error";
// import { verifyPassword, hashPassword } from '@/lib/hash-password'

class StatusCodeError extends BaseError<{ status: number; url: string }> {}
class NetworkError extends BaseError<{ url: string }> {}
class JSONParseError extends BaseError<{ bodyText?: string }> {}

class APIClient {
    host: string;
    defaultHeaders: Headers;
    apiKey: string | undefined;

    constructor(host: string, apiKey?: string) {
        this.host = "https://api.openai.com/v1/chat/completions";
        if (apiKey) {
            this.apiKey = apiKey;
        }
        this.defaultHeaders = {
            // @ts-ignore
            "Content-Type": "application/json",
        };
    }

    getDefaultHeaders(): Headers {
        if (this.apiKey) {
            return {
                ...this.defaultHeaders,
                // @ts-ignore
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
            // TODO: retry
            throw NetworkError.wrap(err as any, "network error", { url });
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
                err as any,
                "network error: receiving body",
                { url }
            );
        }
        try {
            const bodyJSON = JSON.parse(bodyText);
            return bodyJSON;
        } catch (err) {
            throw JSONParseError.wrap(err as any, "json parse error", {
                bodyText,
            });
        }
    }

    async jsonPost(
        url: string,
        body: {},
        init: Omit<RequestInit, "body" | "method"> = {}
    ) {
        console.log(body);
        return this.jsonFetch(url, {
            ...init,
            method: "POST",
            body: JSON.stringify(body),
        });
    }
}

// export singleton
export default APIClient;
