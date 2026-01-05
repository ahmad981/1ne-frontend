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
  superAdminRoutes,
  orgAdminRoutes,
  schoolAdminRoutes,
  teacherRoutes,
  studentRoutes,
  parentRoutes,
} from './config';


export const Router = () => {
  const user = useSelector((state) => state?.auth?.user);

  const dynamicDashboardRoute =
    user?.role === 'super_admin'
      ? [...commonRoutes, ...superAdminRoutes]
      : user?.role === 'org_admin'
      ? [...commonRoutes, ...orgAdminRoutes]
      : user?.role === 'school_admin'
      ? [...commonRoutes, ...schoolAdminRoutes]
      : user?.role === 'teacher'
      ? [...commonRoutes, ...teacherRoutes]
      : user?.role === 'student'
      ? [...commonRoutes, ...studentRoutes]
      : user?.role === 'parent'
      ? [...commonRoutes, ...parentRoutes]
      : // If user is authenticated but role is null, default to teacher routes
      // This handles cases where backend returns roles: null
      user?.token
      ? [...commonRoutes, ...teacherRoutes]
      : commonRoutes;

  return (
    <Fragment>
      <Routes>
        
        <Route element={<PrivateRoutes />}>
          {dynamicDashboardRoute?.map((route, index) => {
            return route.child ? (
              route.child.map((childRoute, childIndex) => (
                <Fragment key={`${index}-${childIndex}`}>
                  <Route path={route.path} element={route.element} />
                  <Route path={childRoute.path} element={childRoute.element} />
                </Fragment>
              ))
            ) : (
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
