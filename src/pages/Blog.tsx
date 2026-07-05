import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, ArrowRight, Tag, Search, BookOpen, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { Input } from '@/components/ui/input';

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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPosts = posts.filter(post => {
    const matchesCategory = !selectedCategory || post.blog_categories?.slug === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  const estimateReadTime = (excerpt: string) => {
    const wordsPerMinute = 200;
    const words = excerpt?.split(' ').length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute)) + ' min read';
  };

  return (
    <>
      <Helmet>
        <title>Blog | Pruthvirajsinh Makwana — Tech & Design</title>
        <meta name="description" content="Articles on Web Development, Digital Marketing, Design, Esports and Technology by Pruthvirajsinh Makwana." />
        <link rel="canonical" href="https://pruthvirajsinh.in/blog" />
        <meta property="og:title" content="Blog — Pruthvirajsinh Makwana" />
        <meta property="og:description" content="Practical guides and insights on Web Development, Digital Marketing, Design, Esports and Technology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pruthvirajsinh.in/blog" />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="text-center max-w-3xl mx-auto">
                  <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                    📝 Blog & Articles
                  </span>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                    Latest <span className="text-primary">Insights</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Thoughts, tutorials, and stories about web development, design, gaming, and digital marketing.
                  </p>
                </div>
              </ScrollReveal>

              {/* Search Bar */}
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="max-w-md mx-auto mt-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 rounded-full bg-card border-border"
                    />
                  </div>
                </div>
              </ScrollReveal>

              {/* Categories Filter */}
              <ScrollReveal animation="fade-up" delay={150}>
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      !selectedCategory
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                    }`}
                  >
                    All Posts
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === cat.slug
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Posts Section */}
          <section className="py-20 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : filteredPosts.length > 0 ? (
                <>
                  {/* Featured Post */}
                  {featuredPost && (
                    <ScrollReveal animation="fade-up">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="group block mb-20"
                      >
                        <div className="grid lg:grid-cols-2 gap-0 bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                          {/* Image */}
                          <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative overflow-hidden">
                            {featuredPost.featured_image ? (
                              <img
                                src={featuredPost.featured_image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full min-h-[350px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <BookOpen className="w-20 h-20 text-primary/30" />
                              </div>
                            )}
                            <span className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wide uppercase">
                              Featured
                            </span>
                          </div>

                          {/* Content */}
                          <div className="p-8 lg:p-12 xl:p-14 flex flex-col justify-center">
                            {featuredPost.blog_categories && (
                              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold tracking-wide uppercase w-fit mb-5">
                                {featuredPost.blog_categories.name}
                              </span>
                            )}
                            
                            <h2 className="font-heading text-2xl lg:text-3xl xl:text-4xl font-bold mb-5 leading-tight group-hover:text-primary transition-colors duration-300">
                              {featuredPost.title}
                            </h2>
                            
                            {featuredPost.excerpt && (
                              <p className="text-muted-foreground text-base lg:text-lg mb-6 line-clamp-3 leading-relaxed">
                                {featuredPost.excerpt}
                              </p>
                            )}

                            <div className="flex items-center gap-5 text-sm text-muted-foreground mb-8">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary/60" />
                                <span>{format(new Date(featuredPost.published_at), 'MMMM d, yyyy')}</span>
                              </div>
                              <div className="w-1 h-1 rounded-full bg-border" />
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary/60" />
                                <span>{estimateReadTime(featuredPost.excerpt || '')}</span>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-3 text-primary font-semibold text-base group-hover:gap-4 transition-all duration-300">
                              Read Full Article <ArrowRight className="w-5 h-5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  )}

                  {/* Other Posts Grid */}
                  {otherPosts.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                      {otherPosts.map((post, index) => (
                        <ScrollReveal key={post.id} animation="fade-up" delay={index * 80}>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 block h-full flex flex-col"
                          >
                            {/* Image */}
                            <div className="aspect-[16/10] relative overflow-hidden">
                              {post.featured_image ? (
                                <img
                                  src={post.featured_image}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                  <BookOpen className="w-12 h-12 text-primary/20" />
                                </div>
                              )}
                              {post.blog_categories && (
                                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-card/95 backdrop-blur-sm text-foreground text-xs font-medium">
                                  {post.blog_categories.name}
                                </span>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-6 lg:p-7 flex flex-col flex-1">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{estimateReadTime(post.excerpt || '')}</span>
                                </div>
                              </div>
                              
                              <h3 className="font-heading text-lg lg:text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                {post.title}
                              </h3>
                              
                              {post.excerpt && (
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-5 leading-relaxed flex-1">
                                  {post.excerpt}
                                </p>
                              )}

                              {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-5">
                                  {post.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-md">
                                      <Tag className="w-3 h-3" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                                Read Article <ArrowRight className="w-4 h-4" />
                              </span>
                            </div>
                          </Link>
                        </ScrollReveal>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <ScrollReveal animation="fade-up">
                  <div className="text-center py-24">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold mb-4">No Articles Found</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                      {searchQuery 
                        ? `No articles matching "${searchQuery}". Try a different search term.`
                        : 'No articles have been published yet. Check back soon for new content!'
                      }
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-primary font-semibold hover:underline text-lg"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </ScrollReveal>
              )}
            </div>
          </section>
        </main>
        
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Blog;
