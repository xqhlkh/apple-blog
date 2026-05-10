'use client';

import { useState, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = '搜索文章标题或内容...' }: Props) {
  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-apple-secondary dark:text-dark-secondary">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-5 py-3.5 bg-white dark:bg-dark-card
                   border border-apple-border dark:border-dark-border rounded-full
                   text-apple-text dark:text-dark-text placeholder:text-apple-secondary dark:placeholder:text-dark-secondary
                   text-sm font-sans shadow-apple dark:shadow-dark-card
                   transition-all duration-200 ease-out
                   focus:outline-none focus:border-apple-accent focus:ring-4 focus:ring-apple-accent/10
                   focus:shadow-apple-hover dark:focus:shadow-dark-hover"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-apple-secondary dark:text-dark-secondary hover:text-apple-text dark:hover:text-dark-text transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
