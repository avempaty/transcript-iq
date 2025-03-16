import APIClient from "./api-client";

class OpenAIClient extends APIClient {
    constructor(apiKey: string) {
        super("https://api.openai.com/v1/chat/completions", apiKey)
    }


    async summarizeTranscription(text: string) {
        const body = {
            model: 'gpt-4',
            messages: []
        }
        return this.jsonPost('', body)
    }
}

export default new OpenAIClient(process.env.OPENAI_API_KEY!)