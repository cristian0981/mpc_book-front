import { ApiProvider } from "@/api/api-provider";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { Login } from "@/pages/auth/Login";
import Author from "@/pages/authors/Author";
import Book from "@/pages/books/Book";
import { NotFound } from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FormBook from "@/pages/books/pages/FormBook";
import BookDetailPage from "@/pages/books/pages/detail";
import Genre from "@/pages/genres/Genre";
import Editorial from "@/pages/editorials/Editorial";
import { Register } from "@/pages/auth/Register";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/books" replace />} />
              <Route path="books" element={<Book />} />
              <Route path="books/new" element={<FormBook />} />
              <Route path="books/edit/:id" element={<FormBook />} />
              <Route path="books/view/:id" element={<BookDetailPage />} />
              <Route path="genres" element={<Genre />} />
              <Route path="authors" element={<Author />} />
              <Route path="editorials" element={<Editorial />} />
            </Route>
          </Route>

          {/* Rutas públicas - NO requieren autenticación */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/">
                <Login />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          
          {/* Ruta catch-all para 404 - DEBE ir al final */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}
