import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';

// Mapping from English category names to Albanian translations
const categoryTranslationMap = {
  "Dairy": "Bulmetore",
  "Ice Cream": "Akullore",
  "Pastry": "Pastiçeri",
  "Bakery": "Furra",
  "Packaging": "Paketime",
  "Nuts": "Fruta të thata",
  "Equipment": "Pajisje",
  "All Products": "Të gjitha produktet"
};

const PostItem = ({ postID, category, title = '', description = '', authorID, thumbnail, createdAt }) => {
  const shortDescription = description.length > 145 ? description.substr(0, 145) + '...' : description;
  const postTitle = title.length > 30 ? title.substr(0, 30) + '...' : title;

  const defaultThumbnail = `${process.env.PUBLIC_URL}/assets/Blog-default.webp`;

  return (
    <article className="post">
      <div className="post-thumbnail">
        <img src={thumbnail || defaultThumbnail} alt={title} />
      </div>
      <div className="post-content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p className="blog-text" dangerouslySetInnerHTML={{ __html: shortDescription }} />
        <div className="post-footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/posts/categories/${category}`} className="btn btn-secondary btn-postitem">
            {categoryTranslationMap[category] || category} {/* Use translated category name */}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
