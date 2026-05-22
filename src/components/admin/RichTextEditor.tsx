import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { Extension } from '@tiptap/core';
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Undo,
  Redo,
  Loader2,
  Minus,
  Highlighter,
  Palette,
  Type,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Custom FontSize extension
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return { types: ['textStyle'] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuButton = ({ 
  onClick, 
  isActive, 
  children,
  title,
  disabled
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  children: React.ReactNode;
  title: string;
  disabled?: boolean;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={cn(
      "h-9 w-9 p-0 hover:bg-primary/10",
      isActive && "bg-primary/20 text-primary hover:bg-primary/25"
    )}
  >
    {children}
  </Button>
);

const fontSizes = [
  { label: 'Small', value: '14px' },
  { label: 'Normal', value: '16px' },
  { label: 'Medium', value: '18px' },
  { label: 'Large', value: '20px' },
  { label: 'XL', value: '24px' },
  { label: '2XL', value: '30px' },
  { label: '3XL', value: '36px' },
];

const textColors = [
  { label: 'Default', value: '' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Yellow', value: '#eab308' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Gray', value: '#6b7280' },
  { label: 'White', value: '#ffffff' },
];

const highlightColors = [
  { label: 'None', value: '' },
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Purple', value: '#e9d5ff' },
  { label: 'Pink', value: '#fbcfe8' },
  { label: 'Orange', value: '#fed7aa' },
];

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-6 shadow-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary font-semibold border-b-2 border-primary/30 hover:border-primary transition-colors',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: true }),
      Typography,
      Placeholder.configure({
        placeholder: 'Start writing your blog post here...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImageUrl = useCallback(() => {
    if (!editor) return;
    
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // Auto-format: clean spacing, split paragraphs on blank lines, trim whitespace,
  // normalize empty paragraphs, and tidy up structure.
  const autoFormat = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();

    // Work in a sandbox DOM
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    // 1. Collapse multiple consecutive empty paragraphs into a single break
    const isEmpty = (el: Element) =>
      el.tagName === 'P' && !el.textContent?.trim() && !el.querySelector('img, br, iframe');

    let prevEmpty = false;
    Array.from(wrapper.children).forEach((child) => {
      if (isEmpty(child)) {
        if (prevEmpty) child.remove();
        prevEmpty = true;
      } else {
        prevEmpty = false;
      }
    });

    // 2. Split paragraphs that contain double line breaks into separate <p>
    wrapper.querySelectorAll('p').forEach((p) => {
      const inner = p.innerHTML;
      if (/<br\s*\/?>(\s*<br\s*\/?>)+/i.test(inner)) {
        const parts = inner.split(/(?:<br\s*\/?>\s*){2,}/i).filter((s) => s.trim());
        if (parts.length > 1) {
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            const np = document.createElement('p');
            np.innerHTML = part.trim();
            frag.appendChild(np);
          });
          p.replaceWith(frag);
        }
      }
    });

    // 3. Trim leading/trailing whitespace inside paragraphs and headings
    wrapper.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li').forEach((el) => {
      el.innerHTML = el.innerHTML
        .replace(/^(&nbsp;|\s)+/g, '')
        .replace(/(&nbsp;|\s)+$/g, '')
        .replace(/[ \t]{2,}/g, ' ');
    });

    // 4. Remove fully empty trailing paragraphs at the very end
    while (wrapper.lastElementChild && isEmpty(wrapper.lastElementChild)) {
      wrapper.lastElementChild.remove();
    }

    // 5. Ensure plain text nodes at root are wrapped in <p>
    Array.from(wrapper.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        node.replaceWith(p);
      }
    });

    const cleaned = wrapper.innerHTML.trim();
    editor.commands.setContent(cleaned || '<p></p>', { emitUpdate: true });
    toast.success('Content auto-formatted ✨');
  }, [editor]);

  const handleImageUpload = async (file: File) => {
    if (!file || !editor) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      editor.chain().focus().setImage({ src: publicUrl }).run();
      toast.success('Image inserted!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
      e.target.value = '';
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Enhanced Toolbar */}
      <div className="border-b border-border/50 p-3 flex flex-wrap gap-1 bg-muted/30">
        {/* History */}
        <div className="flex gap-0.5 pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)">
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Shift+Z)">
            <Redo className="w-4 h-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-9 mx-1" />

        {/* Headings */}
        <div className="flex gap-0.5 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            isActive={editor.isActive('heading', { level: 4 })}
            title="Heading 4"
          >
            <Heading4 className="w-4 h-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-9 mx-1" />

        {/* Font Size */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { setShowFontSize(!showFontSize); setShowColorPicker(false); setShowHighlightPicker(false); }}
            title="Font Size"
            className="h-9 px-2 hover:bg-primary/10 gap-1 text-xs"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Size</span>
          </Button>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-1 min-w-[120px]">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    (editor.commands as any).setFontSize(size.value);
                    setShowFontSize(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted transition-colors"
                  style={{ fontSize: size.value }}
                >
                  {size.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  (editor.commands as any).unsetFontSize();
                  setShowFontSize(false);
                }}
                className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted transition-colors text-muted-foreground"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <Separator orientation="vertical" className="h-9 mx-1" />

        {/* Text formatting */}
        <div className="flex gap-0.5 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-9 mx-1" />

        {/* Text Color */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); setShowFontSize(false); }}
            title="Text Color"
            className="h-9 w-9 p-0 hover:bg-primary/10"
          >
            <div className="flex flex-col items-center">
              <Palette className="w-4 h-4" />
              <div 
                className="w-4 h-0.5 rounded-full mt-0.5"
                style={{ backgroundColor: editor.getAttributes('textStyle').color || 'currentColor' }}
              />
            </div>
          </Button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-2">
              <p className="text-xs text-muted-foreground mb-2 px-1">Text Color</p>
              <div className="grid grid-cols-5 gap-1">
                {textColors.map((color) => (
                  <button
                    key={color.value || 'default'}
                    type="button"
                    onClick={() => {
                      if (color.value) {
                        editor.chain().focus().setColor(color.value).run();
                      } else {
                        editor.chain().focus().unsetColor().run();
                      }
                      setShowColorPicker(false);
                    }}
                    title={color.label}
                    className="w-7 h-7 rounded-md border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value || 'transparent' }}
                  >
                    {!color.value && <span className="text-xs">✕</span>}
                  </button>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-border">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  Custom:
                  <input
                    type="color"
                    className="w-6 h-6 rounded cursor-pointer border-0"
                    onChange={(e) => {
                      editor.chain().focus().setColor(e.target.value).run();
                      setShowColorPicker(false);
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Highlight Color */}
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); setShowFontSize(false); }}
            title="Highlight Color"
            className={cn(
              "h-9 w-9 p-0 hover:bg-primary/10",
              editor.isActive('highlight') && "bg-primary/20 text-primary"
            )}
          >
            <Highlighter className="w-4 h-4" />
          </Button>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-2">
              <p className="text-xs text-muted-foreground mb-2 px-1">Highlight</p>
              <div className="grid grid-cols-4 gap-1">
                {highlightColors.map((color) => (
                  <button
                    key={color.value || 'none'}
                    type="button"
                    onClick={() => {
                      if (color.value) {
                        editor.chain().focus().toggleHighlight({ color: color.value }).run();
                      } else {
                        editor.chain().focus().unsetHighlight().run();
                      }
                      setShowHighlightPicker(false);
                    }}
                    title={color.label}
                    className="w-7 h-7 rounded-md border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value || 'transparent' }}
                  >
                    {!color.value && <span className="text-xs">✕</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator orientation="vertical" className="h-9 mx-1" />

        {/* Lists */}
        <div className="flex gap-0.5 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-9 mx-1" />

        {/* Alignment */}
        <div className="flex gap-0.5 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-9 mx-1" />

        {/* Block elements */}
        <div className="flex gap-0.5 pr-2 mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <Minus className="w-4 h-4" />
          </MenuButton>
        </div>

        <Separator orientation="vertical" className="h-9 mx-1" />

        {/* Insert */}
        <div className="flex gap-0.5 items-center">
          <MenuButton
            onClick={addLink}
            isActive={editor.isActive('link')}
            title="Add Link (Ctrl+K)"
          >
            <LinkIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={addImageUrl} title="Add Image URL">
            <ImageIcon className="w-4 h-4" />
          </MenuButton>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-9 text-xs gap-1.5 ml-1"
            title="Upload Image"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            Upload Image
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose prose-base dark:prose-invert max-w-none min-h-[400px] p-6 focus:outline-none bg-background
          [&_.ProseMirror]:min-h-[380px] [&_.ProseMirror]:outline-none
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground/60
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:italic
          
          prose-headings:font-heading prose-headings:font-bold
          prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
          prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/50
          prose-h3:text-xl prose-h3:mt-5 prose-h3:mb-2
          prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
          prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-primary prose-a:font-semibold
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
          prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-[#1e1e2e] prose-pre:rounded-xl prose-pre:p-4
          prose-img:rounded-xl prose-img:shadow-lg
          prose-ul:list-disc prose-ul:pl-6
          prose-ol:list-decimal prose-ol:pl-6
          prose-li:leading-relaxed"
      />

      {/* Click outside to close dropdowns */}
      {(showColorPicker || showHighlightPicker || showFontSize) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => { setShowColorPicker(false); setShowHighlightPicker(false); setShowFontSize(false); }} 
        />
      )}
    </div>
  );
};
