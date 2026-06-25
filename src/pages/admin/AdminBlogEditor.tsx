import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye, Edit3, Sparkles, FileUp, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { sanitizeHtml } from '@/lib/sanitize';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminBlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category_id: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('blog_categories')
      .select('id, name, slug')
      .order('name');
    
    setCategories(data || []);
  };

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        featured_image: data.featured_image || '',
        category_id: data.category_id || '',
        tags: data.tags?.join(', ') || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        meta_keywords: data.meta_keywords || '',
        status: data.status || 'draft',
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load post');
      navigate('/admin/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt,
        featured_image: formData.featured_image || null,
        category_id: formData.category_id || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
        meta_keywords: formData.meta_keywords,
        status: publish ? 'published' : formData.status,
        published_at: publish ? new Date().toISOString() : null,
        author_id: user?.id,
      };

      let error;
      
      if (isEditing) {
        ({ error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id));
      } else {
        ({ error } = await supabase
          .from('blog_posts')
          .insert(postData));
      }

      if (error) throw error;
      
      toast.success(isEditing ? 'Post updated!' : 'Post created!');
      navigate('/admin/blog');
    } catch (error: any) {
      console.error('Error saving post:', error);
      if (error.code === '23505') {
        toast.error('A post with this slug already exists');
      } else {
        toast.error('Failed to save post');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleOptimizeWithAI = async () => {
    if (!formData.content?.trim()) {
      toast.error('Add some content first');
      return;
    }
    setIsOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-blog-content', {
        body: { content: formData.content, title: formData.title },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.content) throw new Error('No content returned');
      setFormData((prev) => ({ ...prev, content: data.content }));
      toast.success('Content optimized with AI');
    } catch (e: any) {
      console.error('Optimize error:', e);
      const msg = e?.message || 'Failed to optimize content';
      if (msg.includes('Rate limit')) toast.error('Rate limit reached. Try again shortly.');
      else if (msg.includes('credits')) toast.error('AI credits exhausted. Add credits in workspace settings.');
      else toast.error(msg);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateFromFile = async (file: File) => {
    const MAX = 15 * 1024 * 1024;
    if (file.size > MAX) {
      toast.error('File too large (max 15 MB)');
      return;
    }
    const allowed = ['application/pdf', 'text/plain', 'text/markdown', 'image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(md|txt)$/i)) {
      toast.error('Supported: PDF, TXT, MD, PNG, JPG, WEBP');
      return;
    }
    setIsGenerating(true);
    const toastId = toast.loading('AI is reading your file and writing the blog...');
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      const base64 = btoa(binary);
      const mimeType = file.type || (file.name.endsWith('.md') ? 'text/markdown' : 'text/plain');

      const { data, error } = await supabase.functions.invoke('generate-blog-from-file', {
        body: { fileData: base64, mimeType, fileName: file.name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.content) throw new Error('No content returned');

      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        slug: data.slug || prev.slug || generateSlug(data.title || ''),
        excerpt: data.excerpt || prev.excerpt,
        content: data.content,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || prev.tags),
        meta_title: data.meta_title || prev.meta_title,
        meta_description: data.meta_description || prev.meta_description,
        meta_keywords: data.meta_keywords || prev.meta_keywords,
      }));
      toast.success('Blog generated! Review & publish.', { id: toastId });
    } catch (e: any) {
      console.error('Generate from file error:', e);
      const msg = e?.message || 'Failed to generate blog';
      toast.error(msg, { id: toastId });
    } finally {
      setIsGenerating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-heading text-2xl font-bold">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,image/png,image/jpeg,image/webp,application/pdf,text/plain,text/markdown"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleGenerateFromFile(f);
            }}
          />
          <Button
            variant="neon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating}
            className="gap-2"
            title="Upload PDF, TXT, MD or image — AI writes a full formatted blog"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
            {isGenerating ? 'Generating...' : 'AI Blog from File'}
          </Button>
          <Button 
            variant={isPreview ? "default" : "outline"} 
            onClick={() => setIsPreview(!isPreview)}
            className="gap-2"
          >
            {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button variant="glass" onClick={() => handleSave(false)} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="hero" onClick={() => handleSave(true)} disabled={isSaving}>
            Publish
          </Button>
        </div>
      </div>

      {/* Preview Mode */}
      {isPreview ? (
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-sm text-muted-foreground">Preview Mode</div>
          
          {formData.featured_image && (
            <div className="aspect-video rounded-xl overflow-hidden">
              <img 
                src={formData.featured_image} 
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <h1 className="font-heading text-4xl font-bold">{formData.title || 'Untitled Post'}</h1>
          
          {formData.excerpt && (
            <p className="text-lg text-muted-foreground">{formData.excerpt}</p>
          )}
          
          <div 
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-heading prose-headings:font-bold prose-headings:scroll-mt-24 prose-headings:text-foreground
              prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-5
              prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/40
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2
              prose-p:leading-[1.85] prose-p:mb-5 prose-p:text-foreground/90
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-5 prose-blockquote:py-1
              prose-blockquote:italic prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:my-6
              prose-ul:my-5 prose-ul:space-y-2 prose-ol:my-5 prose-ol:space-y-2
              prose-li:leading-relaxed prose-li:marker:text-primary
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted prose-pre:border prose-pre:border-border/40 prose-pre:rounded-xl
              prose-img:rounded-lg prose-img:my-6
              prose-hr:my-10 prose-hr:border-border/60
              [&_table]:w-full [&_table]:my-6 [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-border/50
              [&_thead]:bg-primary/10
              [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground
              [&_td]:px-4 [&_td]:py-3 [&_td]:border-t [&_td]:border-border/40
              [&_tbody_tr:nth-child(even)]:bg-muted/30
              [&_mark]:bg-primary/20 [&_mark]:text-foreground [&_mark]:px-1 [&_mark]:rounded"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(formData.content || '<p class="text-muted-foreground">No content yet...</p>') }}
          />
          
          {formData.tags && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
              {formData.tags.split(',').map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-6">
          {/* Title & Slug */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-url-slug"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="glass-card rounded-2xl p-6">
            <Label>Featured Image</Label>
            <div className="mt-2">
              <ImageUploader
                value={formData.featured_image}
                onChange={(url) => setFormData({ ...formData, featured_image: url })}
              />
            </div>
          </div>

          {/* Content with Rich Text Editor */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <Label htmlFor="content">Content</Label>
              <Button
                type="button"
                variant="neon"
                size="sm"
                onClick={handleOptimizeWithAI}
                disabled={isOptimizing || !formData.content?.trim()}
                className="gap-2"
              >
                <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-pulse' : ''}`} />
                {isOptimizing ? 'Optimizing...' : 'Optimize with AI'}
              </Button>
            </div>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Excerpt */}
          <div className="glass-card rounded-2xl p-6">
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Short description for previews"
                className="mt-2 bg-muted/50 border-border/50"
                rows={3}
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="mt-2 w-full bg-muted/50 border border-border/50 rounded-md p-2 text-foreground"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="web, design, tutorial (comma separated)"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg">SEO Settings</h3>
            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="SEO title (defaults to post title)"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="SEO description (max 160 characters)"
                className="mt-2 bg-muted/50 border-border/50"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                value={formData.meta_keywords}
                onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogEditor;
