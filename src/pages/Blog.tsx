import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollReveal } from '@/hooks/useScrollReveal';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  tags: string[];
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: catData } = await supabase
          .from('blog_categories')
          .select('id, name, slug')
          .order('name');
        
        setCategories(catData || []);

        // Fetch published posts
        const { data: postsData, error } = await supabase
          .from('blog_posts')
          .select(`
            id, title, slug, excerpt, featured_image, published_at, tags,
            blog_categories (name, slug)
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(postsData || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.blog_categories?.slug === selectedCategory)
    : posts;

  return (
    <>
      <Helmet>
        <title>Blog - Pruthvirajsinh Makwana | Tech, Design & Marketing Insights</title>
        <meta name="description" content="Read articles about Web Development, Digital Marketing, Graphic Design, and Technology by Pruthvirajsinh Makwana." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            {/* Header */}
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <span className="text-primary font-medium text-sm tracking-wider uppercase">Blog</span>
                <h1 className="font-heading text-4xl md:text-5xl font-bold mt-3 mb-4">
                  Latest <span className="gradient-text">Articles</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Insights, tutorials, and thoughts on web development, design, and digital marketing.
                </p>
              </div>
            </ScrollReveal>

            {/* Categories Filter */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    !selectedCategory
                      ? 'bg-primary text-primary-foreground neon-glow'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === cat.slug
                        ? 'bg-primary text-primary-foreground neon-glow'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <ScrollReveal key={post.id} animation="fade-up" delay={index * 100}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group glass-card rounded-2xl overflow-hidden hover:neon-glow transition-all duration-500 block h-full"
                    >
                      {/* Image */}
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="font-heading text-4xl text-primary/30">{post.title[0]}</span>
                          </div>
                        )}
                        {post.blog_categories && (
                          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                            {post.blog_categories.name}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(post.published_at), 'MMM d, yyyy')}
                        </div>
                        
                        <h2 className="font-heading text-xl font-bold mb-3 group-hover:gradient-text transition-all line-clamp-2">
                          {post.title}
                        </h2>
                        
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                        )}

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Check back later for new content!</p>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Blog;
