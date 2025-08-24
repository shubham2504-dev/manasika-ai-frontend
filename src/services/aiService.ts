import { ChatMessage } from '../types';

interface AIResponse {
  message: string;
  error?: string;
}

abstract class BaseAIProvider {
  protected apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  abstract generateResponse(message: string, history?: ChatMessage[]): Promise<AIResponse>;
}

class OpenAIProvider extends BaseAIProvider {
  private baseURL = 'https://api.openai.com/v1';

  async generateResponse(message: string, history: ChatMessage[] = []): Promise<AIResponse> {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are Manasika, a compassionate AI mental health companion. 
                   You provide supportive, empathetic responses to help users with their mental wellbeing.
                   You are not a replacement for professional therapy, but offer emotional support and evidence-based coping strategies.
                   Keep responses concise (under 150 words) and always encourage professional help for serious concerns.
                   Use a warm, understanding tone and validate the user's feelings.
                   Never provide medical diagnoses or crisis intervention - refer to professionals for emergencies.`
        },
        ...history.slice(-6).map(msg => ({
          role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        { role: 'user' as const, content: message }
      ];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 150,
          temperature: 0.7,
          frequency_penalty: 0.3,
          presence_penalty: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return { message: data.choices[0].message.content };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return { 
        message: this.getFallbackResponse(message),
        error: 'API temporarily unavailable' 
      };
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand you're feeling anxious. Try taking slow, deep breaths - in for 4 counts, hold for 4, out for 6. This can help calm your nervous system. What's been causing you the most worry today?";
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      return "I hear that you're going through a difficult time. Your feelings are completely valid. Sometimes it helps to name one small thing you're grateful for, even when everything feels heavy. What would that be for you?";
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed')) {
      return "Feeling overwhelmed is so common and completely understandable. Try breaking things down into smaller, manageable steps. What's one thing on your mind that feels most urgent right now?";
    }

    if (lowerMessage.includes('angry') || lowerMessage.includes('frustrated')) {
      return "Anger often signals that something important to you has been affected. It's okay to feel this way. What do you think might be underneath this frustration?";
    }

    if (lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('happy')) {
      return "That's wonderful to hear! It's so important to acknowledge and celebrate these positive moments. What made today particularly good for you?";
    }

    // Default supportive responses
    const supportiveResponses = [
      "Thank you for sharing that with me. It takes courage to open up about how you're feeling. What would be most helpful for you right now?",
      "I appreciate you trusting me with your thoughts. Your feelings are valid and you deserve support. How can I best help you today?",
      "It's really meaningful that you're taking time to check in with your emotions. Self-awareness is such an important part of mental wellness.",
      "I'm here to support you through whatever you're experiencing. Sometimes just talking about things can help lighten the load.",
      "You're taking such an important step by reaching out and expressing how you feel. What's been on your mind lately?"
    ];

    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
  }
}

class HuggingFaceProvider extends BaseAIProvider {
  private baseURL = 'https://api-inference.huggingface.co/models';
  private model = 'microsoft/DialoGPT-large';

  async generateResponse(message: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseURL}/${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: message,
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.generated_text || data[0]?.generated_text;

      if (!generatedText) {
        throw new Error('No response generated');
      }

      return { message: this.sanitizeResponse(generatedText, message) };
    } catch (error) {
      console.error('Hugging Face API error:', error);
      return { 
        message: this.getFallbackResponse(message),
        error: 'API temporarily unavailable' 
      };
    }
  }

  private sanitizeResponse(response: string, message: string): string {
    // Clean up the response and add mental health context
    const cleaned = response.replace(message, '').trim();
    const mentalHealthPrefix = "As your wellness companion, I want to say: ";
    return mentalHealthPrefix + cleaned;
  }

  private getFallbackResponse(message: string): string {
    return "I'm here to support you on your wellness journey. While I'm having some technical difficulties right now, I want you to know that your feelings matter and you deserve care and support.";
  }
}

class FallbackProvider extends BaseAIProvider {
  constructor() {
    super('');
  }

  async generateResponse(message: string): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase();

    // Pattern matching for different types of messages
    const patterns = {
      anxiety: /\b(anxious|anxiety|worried|panic|nervous)\b/i,
      depression: /\b(sad|depressed|down|hopeless|empty)\b/i,
      stress: /\b(stress|overwhelmed|pressure|busy|tired)\b/i,
      anger: /\b(angry|mad|frustrated|irritated|upset)\b/i,
      positive: /\b(good|great|happy|excellent|amazing|wonderful)\b/i,
      gratitude: /\b(thank|grateful|appreciate)\b/i,
      help: /\b(help|support|advice|guidance)\b/i,
      sleep: /\b(sleep|insomnia|tired|exhausted)\b/i,
      work: /\b(work|job|career|boss|colleague)\b/i,
      relationship: /\b(relationship|friend|family|partner|lonely)\b/i
    };

    const responses = {
      anxiety: [
        "Anxiety can feel overwhelming, but you're not alone in this. Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
        "I understand anxiety can be really challenging. Deep breathing can help - try breathing in for 4, holding for 4, and out for 6. What's making you feel most anxious right now?",
        "Anxiety is your mind trying to protect you, but sometimes it gets overactive. What's one small, calming thing you could do for yourself right now?"
      ],
      depression: [
        "I hear you're going through a really tough time. Your feelings are completely valid, and it's okay to not be okay. What's one tiny thing that brought you even a moment of peace today?",
        "Depression can make everything feel heavy. Please remember that you matter, and this feeling won't last forever. Have you been able to connect with anyone today?",
        "Thank you for sharing something so personal. Even when everything feels dark, you're showing strength by reaching out. What's one small step you could take to care for yourself?"
      ],
      stress: [
        "Stress is your body's way of responding to pressure. It sounds like you have a lot on your plate. What feels like the most urgent thing you need to address?",
        "Feeling overwhelmed is so common in today's world. Try breaking everything down into smaller, manageable pieces. What's one thing you could tackle first?",
        "Stress can be exhausting. Remember that you don't have to handle everything at once. What would help you feel more grounded right now?"
      ],
      anger: [
        "Anger often tells us that something important to us is being threatened or ignored. It's a valid emotion. What do you think might be underneath this anger?",
        "I understand you're feeling frustrated. Anger can be a signal that boundaries have been crossed. What's been bothering you most?",
        "It's completely normal to feel angry sometimes. Taking a moment to pause and breathe can help. What triggered these feelings for you?"
      ],
      positive: [
        "That's wonderful to hear! It's so important to acknowledge and celebrate these positive moments. What made this experience particularly good for you?",
        "I'm really glad you're feeling good! These positive moments are precious. What do you think contributed to feeling this way?",
        "It sounds like you're having a great time! Celebrating the good moments helps build resilience for tougher times. What's been the highlight?"
      ],
      gratitude: [
        "It's beautiful that you're expressing gratitude. Research shows that gratitude can significantly improve our wellbeing. What else are you feeling thankful for?",
        "Gratitude is such a powerful practice for mental health. I'm grateful you shared this with me. How has focusing on gratitude affected your mood?"
      ],
      help: [
        "I'm here to support you however I can. Everyone needs help sometimes, and asking for it shows strength, not weakness. What kind of support would be most helpful?",
        "Reaching out for help is one of the most courageous things you can do. What's been weighing on your mind that you'd like to talk through?",
        "I appreciate you trusting me with whatever you're going through. What feels most important for us to focus on right now?"
      ],
      sleep: [
        "Sleep issues can really affect our mental health. Good sleep hygiene includes keeping a regular schedule and avoiding screens before bed. How has your sleep been affecting your daily life?",
        "Getting quality sleep is so important for emotional regulation. What do you think might be interfering with your rest?",
        "Sleep and mental health are deeply connected. Have you noticed any patterns between your sleep and how you feel during the day?"
      ],
      work: [
        "Work stress can really impact our overall wellbeing. It's important to find ways to manage work-related pressure. What aspects of work are most challenging for you right now?",
        "Workplace challenges are really common. Remember that your worth isn't defined by your job performance. What would help you feel more balanced between work and life?",
        "Work can be a significant source of stress. Have you been able to set any boundaries between your work life and personal time?"
      ],
      relationship: [
        "Relationships can be complex and emotionally challenging. It's important to have support systems. How have your relationships been affecting your wellbeing?",
        "Human connections are vital for mental health. Whether it's conflict or loneliness, relationship struggles are really difficult. What would help you feel more supported?",
        "Relationships require a lot of emotional energy. It's okay to feel overwhelmed by interpersonal dynamics sometimes. What relationship aspect is most challenging for you?"
      ]
    };

    // Find matching patterns
    for (const [category, pattern] of Object.entries(patterns)) {
      if (pattern.test(message)) {
        const categoryResponses = responses[category as keyof typeof responses];
        return {
          message: categoryResponses[Math.floor(Math.random() * categoryResponses.length)]
        };
      }
    }

    // Default supportive responses
    const defaultResponses = [
      "Thank you for sharing that with me. Your feelings and experiences are important. What would be most helpful for you to talk about right now?",
      "I appreciate you opening up. Everyone's mental health journey is unique, and I'm here to support you through yours. What's been on your mind lately?",
      "It takes courage to reach out and express how you're feeling. I'm here to listen and support you. How can I best help you today?",
      "Your emotional wellbeing matters, and I'm glad you're taking time to check in with yourself. What would you like to explore together?",
      "I'm here to provide support and encouragement on your wellness journey. What feels most important for you to address right now?"
    ];

    return {
      message: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    };
  }
}

class AIService {
  private provider: BaseAIProvider;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    // Initialize provider based on available API keys
    if (process.env.REACT_APP_OPENAI_API_KEY) {
      this.provider = new OpenAIProvider(process.env.REACT_APP_OPENAI_API_KEY);
    } else if (process.env.REACT_APP_HUGGINGFACE_TOKEN) {
      this.provider = new HuggingFaceProvider(process.env.REACT_APP_HUGGINGFACE_TOKEN);
    } else {
      this.provider = new FallbackProvider();
    }
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    try {
      const response = await this.provider.generateResponse(message, this.conversationHistory);

      // Add user message to history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date()
      };

      // Add AI response to history
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: new Date()
      };

      // Update conversation history (keep last 10 messages)
      this.conversationHistory.push(userMessage, aiMessage);
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return aiMessage;
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        id: Date.now().toString(),
        content: "I'm having some technical difficulties right now, but I want you to know that I'm here to support you. How are you feeling today?",
        role: 'assistant',
        timestamp: new Date()
      };
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }
}

export default new AIService();
