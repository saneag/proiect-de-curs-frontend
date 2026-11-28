import React from 'react';
import { CircleUserRound } from 'lucide-react';

const apiOrigin = (import.meta.env.VITE_API_URL || '/api/hf').replace(
  /\/api\/hf\/?$/,
  '',
);

interface IProps {
  imageUrl: string;
  alt: string;
  className: string;
  type?: string;
}

const ImageRenderer = ({ imageUrl, alt, className, type }: IProps) => {
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

  if (type === 'userAvatar' && imageUrl === '') {
    return <CircleUserRound className={className} strokeWidth={1.5} />;
  }

  return (
    <>
      {isImageLoaded ? (
        <img src={`${apiOrigin}/${imageUrl}`} alt={alt} className={className} />
      ) : (
        <>
          {type === 'userAvatar' ? (
            <CircleUserRound className={className} strokeWidth={1.5} />
          ) : (
            <div
              className={`flex size-full items-center justify-center rounded-2xl bg-gray-200`}
            >
              <span className="material-symbols-outlined text-6xl">
                no_photography
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ImageRenderer;
