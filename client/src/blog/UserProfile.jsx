import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck } from "react-icons/fa";
import './../css/blog.css'; // Assuming you have a corresponding CSS file for styling
import { UserContext } from '../context/userContext';
import axios from 'axios';

const UserProfile = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  const { currentUser } = useContext(UserContext);
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const token = currentUser?.token;
  const navigate = useNavigate();

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email, avatar } = response.data; // Get the correct avatar URL here
        setName(name);
        setEmail(email);
        setAvatarPreview(avatar); // Set the avatarPreview to the updated avatar URL
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
}, [currentUser.id, token]);


const changeAvatarHandler = async () => {
  try {
      if (!avatar) return;


      const formData = new FormData();
      formData.append('avatar', avatar); // Attach the file

      // Call backend to upload the avatar and update user profile
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data', // Required for file uploads
              Authorization: `Bearer ${token}`  // Pass the JWT token in the Authorization header
          }
      });


      setError('');
  } catch (error) {
      console.error('Error changing avatar:', error); // Log any errors
      setError('Failed to update avatar.');
  }
};




  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name,
        email,
        currentPassword,
        newPassword,
        confirmNewPassword,
      };
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        navigate('/logout');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file)); // Show the preview locally before uploading
        setIsAvatarTouched(true);
    }
};


  return (
    <section data-aos="fade-up"   className="profile">
      <div  className="container profile-container">
        <Link to={`/myposts/${currentUser.id}`} className="btn btn-secondary">Dashboard</Link>

        <div  className="profile-details">
          <div  className="avatar-wrapper">
            <div  className="profile-avatar">
              <img src={avatarPreview} alt="User Avatar" /> {/* Display the avatar preview */}
            </div>
            {/* Form to update avatar */}
            <form  className="avatar-form">
              <input 
                type="file" 
                name="avatar" 
                id="avatar" 
                onChange={handleAvatarChange} 
                accept="image/png, image/jpeg, image/webp" 
              />
              <label className="btn btn-primary profile-avatar-btn" htmlFor="avatar">
                <FaEdit /> 
              </label>
            </form>
            {isAvatarTouched && <button 
                  className="btn btn-primary profile-avatar-btn" 
                  onClick={changeAvatarHandler}
                  type="button" // Ensure this is a button and not submitting a form
              >
                  <FaCheck />
              </button>

                      }
          </div>

          <h1>{currentUser.name}</h1>

          {/* Form to update user details */}
          <form  className="form profile-form" onSubmit={updateUserDetails}>
            {error && <p  className="form-error-message">{error}</p>}
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            <button type="submit"  className='btn btn-primary btn-submit-profile'> Update my details </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
