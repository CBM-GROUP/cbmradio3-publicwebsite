"use client";

import React, { useState } from 'react';
import { 
  Clock, 
  Bookmark, 
  MessageSquare, 
  Link2, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Send,
  X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook } from 'react-icons/fa';

// Data Interface
interface ArticleData {
  slug: string;
  title: string;
  category: string;
  subcategory?: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  imageCaption: string;
  content: string[];
  tags: string[];
  previousArticle?: { title: string; slug: string };
  nextArticle?: { title: string; slug: string };
}

// Sample mock fetch matching the NTV Uganda story structure
const SAMPLE_ARTICLE: ArticleData = {
  slug: 'gen-muhoozi-kainerugaba-rallies-african-support-to-sustain-somalia-peace-mission',
  title: 'Gen. Muhoozi Kainerugaba rallies African support to sustain Somalia Peace Mission',
  category: 'National News',
  subcategory: 'News',
  author: {
    name: 'Gladys Namyalo',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  publishedAt: '1 day ago',
  readTime: '4 Min Read',
  imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  imageCaption: 'Chief of Defence Forces Gen. Muhoozi Kainerugaba addressing regional delegates in Munyonyo.',
  content: [
    "Uganda's Chief of Defence Forces (CDF), General Muhoozi Kainerugaba, has called on regional military leaders to demonstrate unity, creativity, and steadfast resolve to safeguard the future of peacekeeping operations in Somalia as the mission transitions towards sustainable, African-led logistical frameworks.",
    "Speaking at the opening of the Extraordinary Meeting of Chiefs of Defence Forces (CDFs) from Troop-Contributing Countries (TCCs) to the African Union Support and Stabilization Mission in Somalia (AUSSOM) at Speke Resort Munyonyo, Gen. Kainerugaba urged military commanders to adapt to tightening financial constraints.",
    "\"These are difficult circumstances, but they also call for our unity, creativity, and resolve,\" Gen. Kainerugaba noted. \"The future of our mission, and the sacrifice and progress we have all made together in Somalia, depend on the quality of the decisions we make at moments like this.\"",
    "The call to bolster the mission comes as the United Nations Support Office in Somalia (UNSOS) prepares to wrap up operations, presenting an opportunity for troop-contributing countries to accelerate efforts towards autonomous logistical arrangements.",
    "The Ugandan CDF noted that funding reductions are already being felt on the front lines, prompting forces to reorganize their operational priorities in the field. He emphasized that the responsibility now rests squarely with African nations to ensure the continuity of the gains made in Somalia."
  ],
  tags: ['Uganda', 'AUSSOM', 'Somalia', 'KAMPALA', 'Politics', 'Electoral Commission', 'Health'],
  previousArticle: {
    title: 'Detained Ugandan opposition figure is unconscious, in intensive care, his wife says',
    slug: 'detained-ugandan-opposition-figure-unconscious-in-intensive-care',
  },
  nextArticle: {
    title: 'UN to hold informal polls for new UN chief starting this Thursday',
    slug: 'un-to-hold-informal-polls-for-new-un-chief',
  },
};

const RELATED_ARTICLES = [
  {
    id: '101',
    title: 'Leaders warn of mental health surge in West Nile region',
    timeAgo: '1 month ago',
    category: 'National News',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '102',
    title: 'Prisons fail to produce Ex-Lord mayor in court due to ill-health',
    timeAgo: '1 month ago',
    category: 'National News',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '103',
    title: 'Police arrest 3 suspects, recover 143 suspected stolen mobile phones',
    timeAgo: '1 month ago',
    category: 'Crime',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a670fc8077a?auto=format&fit=crop&w=400&q=80',
  },
];

export default function ArticlePage({ params }: { params: { slug: string } }) {
  // In Next.js, 'params.slug' receives the current URL parameter
  const article = SAMPLE_ARTICLE; 

  const [rating, setRating] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      
      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-xs text-gray-500 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-900 transition">CBM Radio</Link>
          <span>&gt;</span>
          <Link href="/news" className="hover:text-blue-900 transition">{article.subcategory}</Link>
          <span>&gt;</span>
          <a href={`/category/${article.category.toLowerCase().replace(' ', '-')}`} className="hover:text-blue-900 font-semibold text-blue-900">
            {article.category}
          </a>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Category Pill */}
        <div className="flex gap-2 mb-3">
          <span className="bg-blue-900 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">
            {article.category}
          </span>
        </div>

        {/* Article Headline */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight sm:leading-snug">
          {article.title}
        </h1>

        {/* Author & Meta Row */}
        <div className="mt-6 py-4 border-y border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image 
              src={article.author.avatarUrl} 
              alt={article.author.name} 
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">{article.author.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>Last updated: {article.publishedAt}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Share Toolbar */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink} 
              className="p-2 text-gray-600 hover:text-blue-900 hover:bg-gray-100 rounded-full transition relative"
              title="Copy Link"
            >
              <Link2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow">
                  Copied!
                </span>
              )}
            </button>
            <a href="#" className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition">
              <FaFacebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 text-sky-500 hover:bg-sky-50 rounded-full transition">
              <X  className="w-4 h-4" />
            </a>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <figure className="my-8">
          <div className="overflow-hidden rounded-xl bg-gray-200 aspect-video shadow-sm">
            <Image
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
          {article.imageCaption && (
            <figcaption className="mt-2 text-xs text-gray-500 text-center italic">
              {article.imageCaption}
            </figcaption>
          )}
        </figure>

        {/* Article Body Content */}
        <div className="prose prose-lg max-w-none text-gray-800 space-y-6 leading-relaxed font-serif">
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="text-base sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tag List */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">
            Search by Tags
          </span>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <a 
                key={tag}
                href={`/tag/${tag.toLowerCase()}`}
                className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-blue-900 hover:text-white transition font-medium"
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>

        {/* Next / Previous Article Navigation */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-gray-200 py-6">
          {article.previousArticle ? (
            <a 
              href={`/news/${article.previousArticle.slug}`}
              className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-900 transition flex items-start gap-3"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-900 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Previous Article
                </span>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-blue-900 line-clamp-2 mt-1">
                  {article.previousArticle.title}
                </h5>
              </div>
            </a>
          ) : <div />}

          {article.nextArticle && (
            <a 
              href={`/news/${article.nextArticle.slug}`}
              className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-900 transition flex items-start justify-between gap-3 text-right"
            >
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Next Article
                </span>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-blue-900 line-clamp-2 mt-1">
                  {article.nextArticle.title}
                </h5>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-900 shrink-0 mt-0.5" />
            </a>
          )}
        </div>

        {/* Interactive Comment / Review Section */}
        <section className="mt-12 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-900" />
            Leave a Review or Comment
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Your email address will not be published. Required fields are marked *
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {/* Star Rating Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Your Rating *</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star 
                      className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Leave a Comment *</label>
              <textarea 
                rows={4} 
                required
                placeholder="Share your thoughts on this story..."
                className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full text-sm p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Email *</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full text-sm p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Website</label>
                <input 
                  type="url" 
                  placeholder="https://example.com"
                  className="w-full text-sm p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="save-info" className="rounded text-blue-900 focus:ring-blue-900" />
              <label htmlFor="save-info" className="text-xs text-gray-600">
                Save my name and email in this browser for the next time I comment.
              </label>
            </div>

            <button 
              type="submit" 
              className="mt-4 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-6 py-3 rounded-lg transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Post Review
            </button>
          </form>
        </section>

        {/* You May Also Like Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
            <h3 className="text-lg font-bold text-gray-900">You May Also Like</h3>
            <Link href="/news" className="text-xs font-bold text-blue-900 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {RELATED_ARTICLES.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-md transition">
                <div className="aspect-video overflow-hidden">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-blue-900 transition line-clamp-2">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 block mt-3">
                    {item.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </article>
  );
}