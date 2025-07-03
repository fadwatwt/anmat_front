import { useSelector } from "react-redux";
import { useRouter } from "next/router"; // Corrected import
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // Track client-side state

  useEffect(() => {
    setIsClient(true); // Component has mounted on client
  }, []);

  // Allow access in development mode without verification
  if (process.env.NODE_ENV === 'development') {
    return children;
  }

  // Client-side checks only
  if (isClient) {
    if (!token) {
      router.replace("/login"); // Use Next.js router for redirection
      return null; // Return nothing while redirecting
    }
  }

  // Return children if authenticated or during SSR
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute; // Corrected export name