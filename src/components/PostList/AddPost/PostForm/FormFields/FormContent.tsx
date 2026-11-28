import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Smile,
  Strikethrough,
  Underline,
  Undo2,
  type LucideIcon,
} from 'lucide-react';

import { getPlainTextLength } from 'utils/postText';

const MAX_LENGTH = 1000;

const EMOJIS = [
  '😀',
  '😂',
  '🤣',
  '😊',
  '😍',
  '🥰',
  '😎',
  '🤔',
  '😢',
  '😭',
  '😡',
  '😴',
  '🤯',
  '🥳',
  '😇',
  '🤩',
  '👍',
  '👎',
  '👏',
  '🙌',
  '🙏',
  '💪',
  '👀',
  '🔥',
  '❤️',
  '💔',
  '🎉',
  '✨',
  '💯',
  '⭐',
  '🌞',
  '🌙',
  '🍕',
  '☕',
  '🎶',
  '📸',
  '✈️',
  '🏆',
  '😉',
  '😅',
];

interface Props {
  content: string;
  setContent: (content: string) => void;
}

const FormContent = ({ content, setContent }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        link: { openOnClick: false, defaultProtocol: 'https' },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'min-h-40 max-h-[40vh] w-full overflow-y-auto rounded-xl border ' +
          'border-gray-200 bg-white px-4 py-3 text-lg text-gray-900 ' +
          'outline-hidden transition hover:border-gray-300 ' +
          'focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ' +
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 ' +
          '[&_blockquote]:pl-3 [&_blockquote]:text-gray-600 ' +
          '[&_a]:text-blue-600 [&_a]:underline',
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const textLength = getPlainTextLength(content);
  const isEmpty = useEditorState({
    editor,
    selector: (ctx) => ctx.editor?.isEmpty ?? true,
  });

  return (
    <div className="flex flex-col gap-2">
      <MenuBar editor={editor} />
      <div className="relative">
        <EditorContent editor={editor} className="w-full" />
        {isEmpty && (
          <span className="pointer-events-none absolute top-3 left-4 text-lg text-gray-400">
            What would you like to share?
          </span>
        )}
      </div>
      <span
        className={`self-end text-sm ${
          textLength > MAX_LENGTH ? 'font-bold text-red-500' : 'text-gray-400'
        }`}
      >
        {textLength}/{MAX_LENGTH}
      </span>
    </div>
  );
};

interface ToolButton {
  label: string;
  Icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ToolbarButton = ({
  label,
  Icon,
  active,
  disabled,
  onClick,
}: ToolButton) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    aria-pressed={active}
    onClick={onClick}
    disabled={disabled}
    className={`flex size-9 cursor-pointer items-center justify-center rounded-lg transition disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent ${
      active
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className="size-5" />
  </button>
);

const Divider = () => <span className="mx-1 h-5 w-px bg-gray-200" />;

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkInvalid, setIsLinkInvalid] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: !!editor?.isActive('bold'),
      italic: !!editor?.isActive('italic'),
      underline: !!editor?.isActive('underline'),
      strike: !!editor?.isActive('strike'),
      bulletList: !!editor?.isActive('bulletList'),
      orderedList: !!editor?.isActive('orderedList'),
      blockquote: !!editor?.isActive('blockquote'),
      link: !!editor?.isActive('link'),
      canUndo: !!editor?.can().undo(),
      canRedo: !!editor?.can().redo(),
    }),
  });

  useEffect(() => {
    if (!isEmojiOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!emojiRef.current?.contains(e.target as Node)) setIsEmojiOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isEmojiOpen]);

  if (!editor || !state) return null;

  const openLinkPanel = () => {
    setLinkUrl(editor.getAttributes('link').href ?? '');
    setIsLinkInvalid(false);
    setIsEmojiOpen(false);
    setIsLinkOpen((open) => !open);
  };

  const applyLink = () => {
    const raw = linkUrl.trim();

    if (raw === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setIsLinkOpen(false);
      return;
    }

    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    if (!/^https?:\/\/[^\s/.]+\.[^\s]+$/i.test(href)) {
      setIsLinkInvalid(true);
      return;
    }

    if (editor.state.selection.empty && !editor.isActive('link')) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: raw,
          marks: [{ type: 'link', attrs: { href } }],
        })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    setIsLinkOpen(false);
  };

  const handleLinkKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyLink();
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      setIsLinkOpen(false);
      editor.commands.focus();
    }
  };

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
    setIsEmojiOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarButton
          label="Bold"
          Icon={Bold}
          active={state.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          Icon={Italic}
          active={state.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Underline"
          Icon={Underline}
          active={state.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          label="Strikethrough"
          Icon={Strikethrough}
          active={state.strike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <Divider />
        <ToolbarButton
          label="Bulleted list"
          Icon={List}
          active={state.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered list"
          Icon={ListOrdered}
          active={state.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          Icon={Quote}
          active={state.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <Divider />
        <ToolbarButton
          label="Link"
          Icon={LinkIcon}
          active={state.link || isLinkOpen}
          onClick={openLinkPanel}
        />
        <div ref={emojiRef} className="relative">
          <ToolbarButton
            label="Emoji"
            Icon={Smile}
            active={isEmojiOpen}
            onClick={() => {
              setIsLinkOpen(false);
              setIsEmojiOpen((open) => !open);
            }}
          />
          {isEmojiOpen && (
            <div className="absolute top-full left-0 z-10 mt-1 grid w-72 grid-cols-8 gap-1 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-200">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  aria-label={`Insert ${emoji}`}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-xl transition hover:bg-gray-100"
                  onClick={() => insertEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <Divider />
        <ToolbarButton
          label="Undo"
          Icon={Undo2}
          disabled={!state.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          Icon={Redo2}
          disabled={!state.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>

      {isLinkOpen && (
        <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              aria-label="Link address"
              placeholder="Paste a link, e.g. example.com"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value);
                setIsLinkInvalid(false);
              }}
              onKeyDown={handleLinkKeyDown}
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-base outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white transition hover:bg-blue-500"
              onClick={applyLink}
            >
              {state.link ? 'Update' : 'Add'}
            </button>
            {state.link && (
              <button
                type="button"
                className="cursor-pointer rounded-lg px-3 py-1.5 font-medium text-gray-600 transition hover:bg-gray-200"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .unsetLink()
                    .run();
                  setIsLinkOpen(false);
                }}
              >
                Remove
              </button>
            )}
          </div>
          {isLinkInvalid && (
            <span className="px-1 text-sm text-red-500">
              Please enter a valid web address.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FormContent;
