// Library Imports
import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Local Imports
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import {
  authRoutes,
  commonRoutes,
  teacherRoutes,
  principalRoutes,
  studentRoutes,
  parentRoutes,
} from './config';

export const Router = () => {
  const user = useSelector((state) => state?.auth?.user);
  const userRole = user?.role || 'teacher';

  // Get role-specific routes based on user role
  let roleRoutes = [];
  switch (userRole?.toLowerCase()) {
    case 'teacher':
      roleRoutes = teacherRoutes;
      break;
    case 'principal':
      roleRoutes = principalRoutes;
      break;
    case 'student':
      roleRoutes = studentRoutes;
      break;
    case 'parent':
      roleRoutes = parentRoutes;
      break;
    default:
      roleRoutes = teacherRoutes; // Default to teacher
  }

  // Combine common routes with role-specific routes
  const allPrivateRoutes = [...commonRoutes, ...roleRoutes];

  return (
    <Fragment>
      <Routes>
        <Route element={<PrivateRoutes />}>
          {allPrivateRoutes?.map((route, index) => {
            // Handle routes with child routes
            if (route.child && route.child.length > 0) {
              return (
                <Fragment key={index}>
                  <Route path={route.path} element={route.element} />
                  {route.child.map((childRoute, childIndex) => (
                    <Route
                      key={`${index}-${childIndex}`}
                      path={childRoute.path}
                      element={childRoute.element}
                    />
                  ))}
                </Fragment>
              );
            }
            // Regular route without children
            return (
              <Route path={route.path} element={route.element} key={index} />
            );
          })}
        </Route>
        <Route element={<PublicRoutes />}>
          {authRoutes?.map((route, index) => {
            return (
              <Route path={route?.path} element={route?.element} key={index} />
            );
          })}
        </Route>
      </Routes>
    </Fragment>
  );
};
