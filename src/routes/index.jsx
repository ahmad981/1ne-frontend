// Library Imports
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
  // Check if Redux is rehydrated before accessing state
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated) ?? false;
  const user = useSelector((state) => state?.auth?.user);

  // Show loading state while Redux is rehydrating
  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
    <Routes>
      <Route element={<PrivateRoutes />}>
        {dynamicDashboardRoute?.flatMap((route, index) => {
          // Routes with children: return parent route + all child routes as array
          if (route.child) {
            return [
              <Route 
                key={`parent-${index}`}
                path={route.path} 
                element={route.element} 
              />,
              ...route.child.map((childRoute, childIndex) => (
                <Route 
                  key={`child-${index}-${childIndex}`}
                  path={childRoute.path} 
                  element={childRoute.element} 
                />
              ))
            ];
          }
          // Routes without children: return single route
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
  );
};
