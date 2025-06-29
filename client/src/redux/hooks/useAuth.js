import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../slices/authSlice';

const useAuth = () => {
    const user = useSelector((state) => state.auth.user)
    const role = useSelector((state) => state.auth.role)
    const token = useSelector((state) => state.auth.token)
    const currentUserId = useSelector((state) => state.auth.id)
    const dispatch = useDispatch();

    const UpdateUserLogin = (username,role, token, id) => {
    dispatch(login({ username,role, token, id}));
    const jwtToken = { username, role, token };
localStorage.setItem('token', JSON.stringify(jwtToken));

  };

  const UpdateUserLogout = () => {
    dispatch(logout());
    // localStorage.removeItem('token');
  };

  return { user,role, token, currentUserId, UpdateUserLogin, UpdateUserLogout };
};

export default useAuth;
