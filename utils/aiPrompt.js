export const buildAIPrompt = (content, language, title) => {
  const systemPrompt = `
You are a professional AI translator. Your task:
- Translate the story content into ${language} in a Smooth and Easy-to-Read style.
- Keep the names of characters and places intact, only translate dialogues and descriptions.
- Translate smoothly, naturally, like a native speaker, without word-for-word translation.
- Maintain the original emotions, rhythms, and writing styles (e.g., humorous, romantic, dark...).
- Do not say anything else besides the translated content.
- Only return the translation, without additional explanations or notes.
`;

  return `
${systemPrompt}

${title ? `title: ${title}\n` : ""}
--- BEGINNING OF CONTENT ---
${content}
--- END OF CONTENT ---
`;
};
