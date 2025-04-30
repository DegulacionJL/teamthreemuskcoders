import React, { useEffect, useState } from 'react';
import { searchAll } from '../../services/search.service';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [], hashtags: [] });

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length > 1) {
        try {
          const data = await searchAll(query);
          setResults(data);
        } catch (error) {
          console.error('Search failed:', error);
        }
      } else {
        setResults({ users: [], posts: [], hashtags: [] });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.length > 1 && (
        <div className="absolute w-full bg-white border mt-1 rounded shadow-lg z-10 max-h-64 overflow-y-auto">
          {results.users.length > 0 && (
            <div>
              <div className="font-bold px-2 pt-2">Users</div>
              {results.users.map((user) => (
                <div key={user.id} className="px-2 py-1 hover:bg-gray-100">
                  {user.name} (@{user.username})
                </div>
              ))}
            </div>
          )}
          {results.posts.length > 0 && (
            <div>
              <div className="font-bold px-2 pt-2">Posts</div>
              {results.posts.map((post) => (
                <div key={post.id} className="px-2 py-1 hover:bg-gray-100">
                  {post.caption}
                </div>
              ))}
            </div>
          )}
          {results.hashtags.length > 0 && (
            <div>
              <div className="font-bold px-2 pt-2">Hashtags</div>
              {results.hashtags.map((tag) => (
                <div key={tag.id} className="px-2 py-1 hover:bg-gray-100">
                  #{tag.name}
                </div>
              ))}
            </div>
          )}
          {results.users.length === 0 &&
            results.posts.length === 0 &&
            results.hashtags.length === 0 && (
              <div className="px-2 py-2 text-gray-500">No results found</div>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
