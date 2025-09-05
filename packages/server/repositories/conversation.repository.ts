// messages store
const conversations = new Map<
   string | null,
   { role: string; content: string }[]
>();

export const conversationRepository = {
   getConversationHistory(conversationId: string | null) {
      if (!conversations.has(conversationId)) {
         conversations.set(conversationId, [{ role: 'system', content: '' }]);
      }
      return conversations.get(conversationId);
   },

   setConversationHistory(
      conversationHistory: { role: string; content: string }[],
      conversationData: { role: string; content: string }
   ) {
      conversationHistory.push(conversationData);
   },
};
