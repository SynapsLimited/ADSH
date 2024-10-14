import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the user context and navigate to login
    setCurrentUser(null);
    navigate('/login');
  }, [setCurrentUser, navigate]); // Ensure these dependencies are present

  return null; // No need for any JSX since the user is being logged out
}

export default Logout;
