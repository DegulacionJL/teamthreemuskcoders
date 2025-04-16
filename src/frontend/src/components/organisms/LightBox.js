import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Send, Share2, ThumbsUp, X } from 'lucide-react';
import { useState } from 'react';

export default function Lightbox() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative flex w-full h-full max-w-6xl max-h-[90vh] bg-background">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        {/* Image section */}
        <div className="flex-1 bg-black flex items-center justify-center h-full">
          <img
            src="/placeholder.svg?height=800&width=1000"
            alt="Lightbox image"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Comments and info section */}
        <div className="w-full md:w-96 bg-background flex flex-col h-full">
          {/* Post info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Jane Doe</p>
                <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
              </div>
            </div>
            <p className="text-sm">
              Beautiful sunset at the beach today! 🌅 #nature #photography #sunset
            </p>
          </div>

          {/* Reactions */}
          <div className="p-4 border-b">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-1">
                <div className="bg-blue-500 rounded-full p-1">
                  <ThumbsUp className="h-3 w-3 text-white" />
                </div>
                <div className="bg-red-500 rounded-full p-1">
                  <Heart className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-muted-foreground">142</span>
              </div>
              <div className="text-sm text-muted-foreground">24 comments</div>
            </div>
            <div className="flex justify-between border-t pt-2">
              <Button variant="ghost" size="sm" className="flex-1 gap-2">
                <ThumbsUp className="h-4 w-4" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-2">
                <MessageCircle className="h-4 w-4" />
                Comment
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Comments section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-3 py-2 max-w-[85%]">
                <p className="text-sm font-medium">John Smith</p>
                <p className="text-sm">Wow, what an amazing view! Where was this taken?</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-3 py-2 max-w-[85%]">
                <p className="text-sm font-medium">Jane Doe</p>
                <p className="text-sm">Thanks! It was at Malibu Beach 😊</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-3 py-2 max-w-[85%]">
                <p className="text-sm font-medium">Alex Smith</p>
                <p className="text-sm">
                  The colors are absolutely stunning! What camera did you use?
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-3 py-2 max-w-[85%]">
                <p className="text-sm font-medium">Jane Doe</p>
                <p className="text-sm">
                  Just my iPhone 14 Pro! The camera on this phone is incredible.
                </p>
              </div>
            </div>
          </div>

          {/* Comment input */}
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <div className="relative flex-1">
                <Input
                  placeholder="Write a comment..."
                  className="pr-10 rounded-full bg-muted border-none"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send comment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
