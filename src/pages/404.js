import React, { useEffect } from "react";

const NotFoundPage = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default NotFoundPage;