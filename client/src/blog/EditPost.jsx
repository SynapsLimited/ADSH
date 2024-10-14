import React, { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const EditPost = () => {

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const POST_CATEGORIES = ["Uncategorized", "Marketing", "Business", "Technology", "AI", "Gaming", "Product", "Entertainment"];

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        setTitle(response.data.title);
        setCategory(response.data.category); // Set the category to the existing post's category
        setDescription(response.data.description);
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [id]);

  const editPost = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);

    // Only append thumbnail if it has changed
    if (thumbnail) {
      postData.append('thumbnail', thumbnail);
    }

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        navigate('/blog');
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <section data-aos="fade-up"   className="create-post">

      <div  className="container">
        <h2>Edit Post</h2>
        {error && <p  className="form-error-message">{error}</p>}
        <form  className="form create-post-form" onSubmit={editPost}>
          <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <select name="category" value={category} onChange={e => setCategory(e.target.value)}>
            {
              POST_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)
            }
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          <div  className="custom-file-input-container">
            <input  className="custom-file-input" type="file" onChange={e => setThumbnail(e.target.files[0])} accept='png, jpg, jpeg' />
          </div>
          <button type="submit" className="btn btn-primary btn-submit">Update</button>

        </form>
      </div>

    </section>
  );
}

export default EditPost;
