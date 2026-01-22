import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to AccountInfo page
    navigate('/account-info', { replace: true });
  }, [navigate]);

  return null;
};

export default Profile;
