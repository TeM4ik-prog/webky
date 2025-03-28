import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RoutesConfig } from '@/types/pagesConfig';
import { AuthService } from './services/auth.service';
import { login, logout, setLoading } from './store/user/user.slice';
import { useDispatch } from 'react-redux';
import { useUpdateUserTrigger } from './store/hooks';
import { onRequest, UserRole } from './types';
import { CategoryService } from './services/category.service';
import { setCategories } from './store/categories/categories.slice';
import { ProtectedRoute } from './components/layout/protectedRoute';
import { Loader } from './components/ui/Loader';

const EntryPage = lazy(() => import('@/pages/EntryPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const CreatePostsPage = lazy(() => import('@/pages/CreatePostsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));


import 'react-datepicker/dist/react-datepicker.css';
import MainPage from './pages/MainPage';

function App() {
  const dispatch = useDispatch()
  const trigger = useUpdateUserTrigger()

  const checkAuth = async () => {
    dispatch(setLoading(true))
    try {
      const data = await AuthService.getProfile()
      console.log(data)

      if (data) {
        dispatch(login(data))
      } else {
        dispatch(logout())
      }
    } catch (error) {
      console.error("Ошибка при получении профиля:", error)
      dispatch(logout())
    } finally {
      dispatch(setLoading(false))
    }
  }

  const getCategories = async () => {
    const data = await onRequest(CategoryService.getCategories())
    console.log(data)
    if (data) {
      dispatch(setCategories(data))
    }
  }

  const loaderBlock = () => {
    return (
      <div className="mt-32">
        <Loader />
      </div>
    )
  }

  useEffect(() => {
    checkAuth()
    getCategories()
  }, [trigger])

  return (
    <div className='min-h-screen flex flex-col bg-gray-800'>
      <Router>
        <Header />
        <Suspense fallback={loaderBlock()}>
          <main className='h-full z-[0]'>
            <Routes>
              <Route path={RoutesConfig.HOME.path} element={<MainPage />} />
              <Route path={RoutesConfig.ENTRY.path} element={<EntryPage />} />
              {/* <Route path={`${RoutesConfig.POSTS.path}/:category`} element={<PostsPage />} /> */}
              
              <Route path={RoutesConfig.PROFILE.path} element={<ProfilePage />} />
              
              {/* <Route path={RoutesConfig.CONTACTS.path} element={<ContactPage />} /> */}
              

              <Route path={RoutesConfig.CREATE_POSTS.path} element={
                <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                  <CreatePostsPage />
                </ProtectedRoute>
              } />

              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </main>
        </Suspense>
        <Footer />
      </Router>
    </div>
  );
}

export default App