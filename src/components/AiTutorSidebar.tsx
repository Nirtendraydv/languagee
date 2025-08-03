"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TUTOR_FAQ, AI_TUTOR_COURSES_CONTEXT } from '@/lib/constants';

type Message = {
  id: number;
  role: 'user' | 'bot';
  content: string;
};

const FAQ_PAIRS = TUTOR_FAQ.split('\n\n').map(faq => {
    const [question, answer] = faq.split('\nA: ');
    return { q: question.replace('Q: ', '').toLowerCase(), a: answer };
});

const COURSE_KEYWORDS = AI_TUTOR_COURSES_CONTEXT.map(c => c.title.toLowerCase());

export function AiTutorSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getBotResponse = (userInput: string): string => {
      const lowerInput = userInput.toLowerCase();

      // Check for FAQ matches
      for (const faq of FAQ_PAIRS) {
          if (lowerInput.includes(faq.q.split(' ')[0]) || lowerInput.includes(faq.q.split(' ')[1])) {
              return faq.a;
          }
      }

      // Check for course related keywords
      if (lowerInput.includes('course') || lowerInput.includes('class')) {
        return `We have several courses available! You can see all of them on our courses page. Some popular ones are ${COURSE_KEYWORDS.slice(0, 2).join(', ')}. Is there a specific one you'd like to know about?`;
      }
      
      if(lowerInput.includes('tutor')) {
        return 'We have two wonderful tutors, Jane and John. You can learn more about them on our tutors page.'
      }

      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        return 'Hello! How can I help you today? You can ask me about our courses, tutors, or pricing.'
      }

      return "I'm sorry, I'm not sure how to answer that. You can try asking about our 'courses' or 'tutors', or visit the contact page to send us a message directly.";
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Simulate thinking
    await new Promise(resolve => setTimeout(resolve, 1000));

    const botResponse = getBotResponse(currentInput);
    
    const botMessage: Message = {
      id: Date.now() + 1,
      role: 'bot',
      content: botResponse,
    };
    setMessages(prev => [...prev, botMessage]);
    
    setIsLoading(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 animate-bounce"
            size="icon"
          >
            <MessageSquare className="h-8 w-8" />
            <span className="sr-only">Ask a Question</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:w-[540px] flex flex-col p-0">
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="font-headline text-2xl flex items-center gap-2">
              <Bot className="text-primary" /> Chat Assistant
            </SheetTitle>
            <SheetDescription>
              Ask a question and I'll do my best to help!
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-grow p-6">
            <div className="space-y-6">
              {messages.length === 0 && (
                 <div className="text-center text-muted-foreground p-8">
                    <p>Welcome! How can I help you today?</p>
                 </div>
              )}
              {messages.map(message => (
                <div key={message.id} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                  {message.role === 'bot' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-[75%] rounded-lg p-3", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                   <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary rounded-lg p-3 flex items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter className="p-4 border-t bg-background">
            <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
