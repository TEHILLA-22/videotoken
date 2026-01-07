'use client';

import { useState } from 'react';
import { Input } from '@components/ui/input';
import { User, Send } from 'lucide-react';
import { Button } from '@components/ui/button';

export default function Comments() {
  const [commentText, setCommentText] = useState('');

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Devtoken_001',
      text: 'This coin is the best I have bought so far',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: 'You',
      text: commentText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText('');
  };

  return (
    <section className="p-4 bg-[#F5F5F5]/10 border border-gray-600 rounded-lg mt-4 w-full">
      {/* Comment List */}
      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <div key={c.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[#FF0000] font-medium md:font-semibold">{c.author}</h1>
              <span className="text-gray-400 text-xs">{c.time}</span>
            </div>
            <blockquote className="text-white text-sm ml-10">{c.text}</blockquote>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="mt-5">
        <div className="relative">
          <Input
            placeholder="Comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex w-full rounded-full border-[#F5F5F5]/10 p-3 h-12 pl-14 placeholder:text-white ring-0 outline-0"
          />

          {/* User Icon */}
          <Button
            size="icon"
            className="bg-[#FFFFFF]/10 h-10 w-10 text-white rounded-full absolute top-1 left-2 pointer-events-none"
          >
            <User size={60} className="h-9 w-9" />
          </Button>

          {/* Send Button */}
          <Button
            size="icon"
            onClick={handleSend}
            className="bg-[#7619BC] h-10 w-10 text-white cursor-pointer rounded-full absolute top-1 right-2"
          >
            <Send size={60} className="h-9 w-9" />
          </Button>
        </div>
      </div>
    </section>
  );
}
