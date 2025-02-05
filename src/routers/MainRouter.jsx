import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate
} from 'react-router-dom'
import { useSelector } from 'react-redux';
import App from '../App'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import GroupForm from '../components/dashboard/GroupForm';
import EventForm from '../components/dashboard/EventForm';
import NotFound from '../components/error/NotFound';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? children : <Navigate to="/" />;
};


const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index path='/' element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      <Route path="/edit-group/:id" element={<GroupForm isEdit />} />
      <Route path="/edit-event/:id" element={<EventForm isEdit />} />

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)
const MainRouter = () => {
  return (
    <RouterProvider router={routers} />
  )
}

export default MainRouter