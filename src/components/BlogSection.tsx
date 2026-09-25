import React, { useState } from 'react';
import { blogPostsData as defaultBlogPosts } from '../data/agencyData';
import { BlogPostItem } from '../types';
import { ArrowUpRight, BookOpen, Clock, Calendar, X, PlusCircle, Check } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>(() => {
    const saved = localStorage.getItem('zazu_blog_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultBlogPosts;
      }
    }
    return defaultBlogPosts;
  });

  const [activeArticle, setActiveArticle] = useState<BlogPostItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPostItem>>({
    category: 'Digital Marketing',
    readTime: '5 min read',
    date: 'September 2026'
  });

  const categories = [
    'All',
    'Digital Marketing',
    'SEO',
    'Social Media',
    'Paid Advertising',
    'Content Marketing',
    'Business Growth'
  ];

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.excerpt || !newPost.content) return;

    const created: BlogPostItem = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      category: (newPost.category as any) || 'Digital Marketing',
      readTime: newPost.readTime || '4 min read',
      date: newPost.date || 'September 2026',
      excerpt: newPost.excerpt,
      content: newPost.content
    };

    const updated = [created, ...posts];
    setPosts(updated);
    localStorage.setItem('zazu_blog_posts', JSON.stringify(updated));
    setIsAddingPost(false);
    setNewPost({
      category: 'Digital Marketing',
      readTime: '5 min read',
      date: 'September 2026'
    });
  };

  return (
    <section id="blog" className="py-24 bg-[#0A0A0A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-data tracking-widest uppercase text-[#FFD966] mb-2">
              <span>AGENCY PERSPECTIVES</span>
              <span aria-hidden="true">/</span>
              <span>GROWTH INTELLIGENCE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-bold tracking-tight text-white">
              INSIGHTS, STRATEGY & <span className="gold-gradient-text">TRENDS</span>
            </h2>

            <p className="mt-2.5 text-[#A0A0A0] text-xs sm:text-sm leading-relaxed">
              Actionable blueprints, algorithmic breakdowns, and strategic frameworks curated by the ZAZU Digital Media growth lab.
            </p>
          </div>

          <button
            onClick={() => setIsAddingPost(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#111111] hover:bg-[#151515] border border-white/10 hover:border-[#F5C542]/40 text-[#FFD966] transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#F5C542]" />
            <span>Create New Article</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none ${
                selectedCategory === cat
                  ? 'bg-[#F5C542] text-[#080808] shadow-[0_0_15px_rgba(245,197,66,0.3)]'
                  : 'bg-[#111111] text-[#A0A0A0] hover:text-white border border-[#222222]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 6 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="group rounded-2xl bg-[#111111] border border-[#222222] hover:border-[#F5C542]/50 p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
            >
              <div>
                {/* Meta details with zero-pill unboxed typography */}
                <div className="flex items-center gap-2 text-xs font-mono-data text-[#A0A0A0] mb-3">
                  <span className="text-[#FFD966] font-semibold">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-lg font-display font-bold text-white mb-3 group-hover:text-[#FFD966] transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A0A0A0] line-clamp-3 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#D4D4D4] group-hover:text-[#FFD966] transition-colors">
                <span className="group-hover:underline">Read Full Strategic Analysis</span>
                <ArrowUpRight className="w-4 h-4 text-[#F5C542] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#111111] border border-[#F5C542]/40 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Article"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-mono-data text-[#A0A0A0] mb-2">
                <span className="text-[#FFD966] font-bold">{activeArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.readTime}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.date}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                {activeArticle.title}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-[#FFD966] italic leading-relaxed">
              {activeArticle.excerpt}
            </div>

            <div className="text-sm text-[#D4D4D4] leading-relaxed space-y-4">
              <p>{activeArticle.content}</p>
              <p>
                At ZAZU Digital Media, our mandate is ensuring that every creative piece serves a clear conversion or retention goal. By continuously benchmarking and calibrating media performance against target benchmarks, our clients establish enduring commercial momentum.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#A0A0A0]">Published by ZAZU Research Lab</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-lg bg-[#F5C542] text-[#080808] text-xs font-bold"
              >
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {isAddingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111111] border border-[#F5C542]/40 p-6 sm:p-8 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddingPost(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-[#A0A0A0] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-display font-bold text-white">Create New Article</h3>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A0A0A0] uppercase block mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Omnichannel Attribution in 2026"
                  value={newPost.title || ''}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A0A0A0] uppercase block mb-1">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#A0A0A0] uppercase block mb-1">Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={newPost.readTime || ''}
                    onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A0A0A0] uppercase block mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary shown on the card..."
                  value={newPost.excerpt || ''}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] uppercase block mb-1">Full Article Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Full strategic breakdown..."
                  value={newPost.content || ''}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:border-[#F5C542]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold bg-[#F5C542] text-[#080808] flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Article</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingPost(false)}
                  className="py-3 px-5 rounded-xl border border-white/10 text-[#A0A0A0]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
