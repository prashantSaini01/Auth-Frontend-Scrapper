import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Client, Account } from 'appwrite';

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("6718e0ec0026a7ad41cb");

const account = new Account(client);

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null initially to indicate "checking"
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const checkSession = async () => {
      const localToken = localStorage.getItem('token');

      if (localToken) {
        setIsAuthenticated(true); // Local token found, authentication confirmed
        setLoading(false); // Stop loading
      } else {
        try {
          await account.get(); // Attempt to fetch Appwrite session
          setIsAuthenticated(true); // Appwrite session confirmed
        } catch (error) {
          console.error("No active session found:", error);
          setIsAuthenticated(false); // No session, prompt for login
        } finally {
          setLoading(false); // Stop loading in both success and error cases
        }
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    // Only navigate if explicitly unauthenticated
    if (isAuthenticated === false) {
      toast.info("Please log in to access this page.");
      navigate('/login'); // Redirect to login only if not authenticated
    }
  }, [isAuthenticated, navigate]);

  // Render loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a more sophisticated loading spinner if desired
  }

  // Render children if authenticated
  return isAuthenticated ? children : null;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
