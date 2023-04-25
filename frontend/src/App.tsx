import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ShoppingListPage from './pages/ShoppingList/ShoppingListPage';
import MyRecipesPage from './pages/MyRecipes/MyRecipesPage';
import EditProfilePage from './pages/Profile/EditProfilePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage/RecipeDetailsPage';
import CreateRecipePage from './pages/CreateRecipe/CreateRecipePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route path="" element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="recipes/">
                        <Route path=":recipeId" element={<RecipeDetailsPage />} />
                        <Route path="create" element={<CreateRecipePage />} />
                    </Route>
                    <Route path="me/">
                        <Route path="" element={<EditProfilePage />} />
                        <Route path="shopping-list" element={<ShoppingListPage />} />
                        <Route path="recipes" element={<MyRecipesPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
