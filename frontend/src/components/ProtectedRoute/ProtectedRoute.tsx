import React, { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = (
    props: ProtectedRouteProps
) => {
    const { token } = useAuthContext();

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    return <>{props.children}</>;
};

export default ProtectedRoute;
