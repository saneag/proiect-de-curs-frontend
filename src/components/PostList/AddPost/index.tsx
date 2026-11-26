import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from 'redux/store';

import PostForm from './PostForm';
import { AnimatePresence } from 'framer-motion';
import { Components } from '../../index';

const addPostPhrases = [
    'What is new for today?',
    'How are you today?',
    'Tell us about your day',
    'What is your mood today?',
    'Share your thoughts',
    'What is new?',
    'What is on your mind?',
];

const getRandomPhrase = () =>
    addPostPhrases[Math.floor(Math.random() * addPostPhrases.length)];

const AddPost = () => {
    const user = useSelector((state: RootState) => state.userReducer.user);

    const [isAddPostFormOpen, setIsAddPostFormOpen] =
        React.useState<boolean>(false);

    const [addPostPhrase, setAddPostPhrase] =
        React.useState<string>(getRandomPhrase);

    const handleAddPostFormOpen = () => {
        setIsAddPostFormOpen(true);
        setTimeout(() => {
            setAddPostPhrase(getRandomPhrase());
        }, 200);
    };

    return (
        <>
            <div className="flex w-full items-center gap-3 rounded-2xl bg-gray-500 p-2 max-[420px]:flex-col md:w-100 2xl:w-150">
                <div className="flex w-2/12 justify-center">
                    <div className="flex flex-wrap items-center justify-center rounded-full">
                        <Components.ImageRenderer
                            imageUrl={user.avatarUrl}
                            type={'userAvatar'}
                            alt={'No avatar'}
                            className={
                                'flex size-14 items-center justify-center rounded-full object-cover text-5xl'
                            }
                        />
                    </div>
                </div>
                <div className="flex w-10/12">
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center rounded-2xl bg-gray-600 p-3 text-left hover:bg-gray-700"
                        onClick={handleAddPostFormOpen}
                    >
                        <span className="text-2xl text-white">
                            {addPostPhrase}
                        </span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isAddPostFormOpen && (
                    <PostForm setIsAddPostFormOpen={setIsAddPostFormOpen} />
                )}
            </AnimatePresence>
        </>
    );
};

export default AddPost;
