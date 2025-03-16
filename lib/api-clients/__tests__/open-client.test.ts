import exampleTranscription from './fixtures/example-transcription';
import openaiClient from '../openai-client';
//import { Transcription } from '@/interfaces/transcription';

test('formatTranscription', async () => {
  const formattedTranscription = openaiClient.formatTranscription(exampleTranscription);
  expect(formattedTranscription).toMatchInlineSnapshot(`
"
[2025-03-15T10:00:00.000Z] AI: Hello, how can I assist you today?
[2025-03-15T10:00:15.000Z] Patient: Hi, I'm feeling a bit anxious lately.
[2025-03-15T10:00:30.000Z] AI: I'm sorry to hear that. Can you tell me more about what you're feeling?
[2025-03-15T10:00:45.000Z] Patient: I've been having trouble sleeping and can't seem to calm my mind.
[2025-03-15T10:01:00.000Z] AI: It sounds like you're experiencing a lot of stress. Have you tried any relaxation techniques?
[2025-03-15T10:01:15.000Z] Patient: I've tried meditation, but it doesn't seem to help much.
[2025-03-15T10:01:30.000Z] AI: Meditation can sometimes take time to show its effects. Would you like me to guide you through a short relaxation exercise?
[2025-03-15T10:01:45.000Z] Patient: Yes, that would be great."
`);
});