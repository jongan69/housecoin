'use client';

import { useEffect } from 'react';

interface TikTokEmbedProps {
  account: string;
}

export default function TikTokEmbed({ account }: TikTokEmbedProps) {
  useEffect(() => {
    // Load TikTok embed script
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center my-8">
      <blockquote 
        className="tiktok-embed" 
        cite={`https://www.tiktok.com/@${account}`} 
        data-unique-id={account} 
        data-embed-type="creator" 
        style={{ maxWidth: '780px', minWidth: '288px' }}
      >
        <section>
          <a 
            target="_blank" 
            href={`https://www.tiktok.com/@${account}?refer=creator_embed`}
            rel="noopener noreferrer"
          >
            @{account}
          </a>
        </section>
      </blockquote>
    </div>
  );
} 