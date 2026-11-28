import React from 'react';
import { CircleUserRound, ImageOff } from 'lucide-react';

const apiOrigin = (import.meta.env.VITE_API_URL || '/api/hf').replace(
  /\/api\/hf\/?$/,
  '',
);

interface IProps {
  imageUrl: string;
  alt: string;
  className: string;
  type?: string;
  // Load right away instead of when the image nears the screen.
  eager?: boolean;
}

// Small avatars keep their placeholder icon until the picture has loaded.
const AvatarImage = ({ imageUrl, alt, className }: IProps) => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.src = `${apiOrigin}/${imageUrl}`;
    img.onload = () => {
      setIsImageLoaded(true);
    };
    img.onerror = () => {
      setIsImageLoaded(false);
    };
  }, [imageUrl]);

  if (imageUrl === '' || !isImageLoaded) {
    return <CircleUserRound className={className} strokeWidth={1.5} />;
  }

  return (
    <img src={`${apiOrigin}/${imageUrl}`} alt={alt} className={className} />
  );
};

// Post images load only when they get close to the screen. The placeholder keeps
// their place in the page, so the feed does not jump and far-away images stay unloaded.
const PostImage = ({ imageUrl, alt, className, eager }: IProps) => {
  const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );

  if (status === 'error') {
    return (
      <div className="flex min-h-48 w-full items-center justify-center rounded-2xl bg-gray-200 text-gray-500">
        <ImageOff className="size-12" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div
      className={
        status === 'loaded'
          ? 'w-full'
          : 'min-h-48 w-full animate-pulse rounded-2xl bg-gray-200'
      }
    >
      <img
        src={`${apiOrigin}/${imageUrl}`}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`${className} ${status === 'loaded' ? '' : 'opacity-0'}`}
      />
    </div>
  );
};

const ImageRenderer = (props: IProps) =>
  props.type === 'userAvatar' ? (
    <AvatarImage {...props} />
  ) : (
    <PostImage key={props.imageUrl} {...props} />
  );

export default ImageRenderer;
