import React from 'react';
import defaultImg from '../../public/default-news.jpg';

type NewsCardProps = {
  article: {
    article_id: string;
    title: string;
    description: string;
    image_url: string | null;
    formattedDate: string;
    source_name: string;
    source_icon: string;
    link: string;
  };
};

const Newscard: React.FC<{ article: NewsCardProps['article'] }> = ({ article }) => {
  const {
    title,
    description,
    image_url,
    formattedDate,
    source_name,
    source_icon,
    link,
  } = article;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full max-w-3xl bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 min-h-[180px]"
    >
      {/* Left - Image */}
      <div
        className="w-2/5 relative min-h-[180px]"
        style={{ width: '40%', minHeight: 180 }}
      >
        <img
          src={image_url || defaultImg.src}
          alt={title || 'News image'}
          className="object-cover w-full h-full"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Right - Content */}
      <div className="w-3/5 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-semibold mb-1 line-clamp-2">{title}</h2>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 max-w-[60%]">
            <img
              src={source_icon}
              alt={source_name || 'Source icon'}
              width={16}
              height={16}
              className="object-contain"
              loading="lazy"
              decoding="async"
            />
            <span
              className="text-xs text-gray-500 max-w-[100px] truncate block"
              title={source_name}
            >
              {source_name}
            </span>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{formattedDate}</span>
        </div>
      </div>
    </a>
  );
};

export default Newscard;
