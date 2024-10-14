import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './../css/FixedMenu.css';
import { UserContext } from '../context/userContext';

const FixedMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser } = useContext(UserContext);
    const menuRef = useRef(null);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!currentUser) {
        return null; // If there is no logged-in user, do not render the menu
    }

    return (
        <div className="fixed-menu" ref={menuRef}>
            <div
                className={`menu-toggle ${isMenuOpen ? 'is-active' : ''}`}
                onClick={handleMenuToggle}
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
            <ul className={`menu-content ${isMenuOpen ? 'show' : ''}`}>
                <li className="welcome-user"><b>{currentUser?.name}</b></li>
                <li><Link to="/posts">All Posts</Link></li>
                <li><Link to={`/profile/${currentUser.id}`}>Profile</Link></li>
                <li><Link to="/create">Create</Link></li>
                <li><Link to="/authors">Authors</Link></li>
                <li><Link to="/logout">Log out</Link></li>
            </ul>
        </div>
    );
};

export default FixedMenu;
