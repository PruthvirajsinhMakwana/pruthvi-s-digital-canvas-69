import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploader } from '@/components/admin/ImageUploader';

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
  const [categories, setCategories] = useState<Category[]>([]);
  
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
      <div className="flex items-center justify-between gap-4">
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
        <div className="flex items-center gap-2">
          <Button variant="glass" onClick={() => handleSave(false)} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button variant="hero" onClick={() => handleSave(true)} disabled={isSaving}>
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      {/* Form */}
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
          <Label htmlFor="content">Content</Label>
          <div className="mt-2">
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
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
    </div>
  );
};

export default AdminBlogEditor;
