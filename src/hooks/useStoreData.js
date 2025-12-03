import { useSelector } from 'react-redux';

export const useStoreData = () => {
    const user = useSelector((state) => state?.auth?.user);

    const role = user?.role || '';
    const username = user?.first_name || user?.name || '';
    const email = user?.email || '';
    const token = user?.token || '';

    return {
        user,
        role,
        username,
        email,
        token,
    };
};

