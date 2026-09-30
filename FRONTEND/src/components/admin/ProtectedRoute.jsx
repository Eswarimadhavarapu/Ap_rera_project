// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const admin = localStorage.getItem("admin");

//   return admin ? children : <Navigate to="/admin-login" replace />;
// };

// export default ProtectedRoute;






// // import { Navigate } from "react-router-dom";

// // const ProtectedRoute = ({ children }) => {
// //   const admin = localStorage.getItem("admin");

// //   return admin ? children : <Navigate to="/admin-login" replace />;
// // };

// // export default ProtectedRoute;
// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";

// const ProtectedRoute = ({ children }) => {

//   const [loading, setLoading] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {

//     axios.get(
//       "http://localhost:5000/auth/me",
//       {
//         withCredentials: true
//       }  
//     )
//     .then(() => {
//       setAuthenticated(true);
//     })
//     .catch(() => {
//       setAuthenticated(false);
//     })
//     .finally(() => {
//       setLoading(false);
//     });

//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return authenticated
//     ? children
//     : <Navigate to="/admin-login" replace />;
// };

// export default ProtectedRoute;

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/auth/me",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return authenticated ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;