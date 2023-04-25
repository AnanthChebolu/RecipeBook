from django.urls import path

from recipes.views.views import *


urlpatterns = [
    path('liked/', LikedRecipes.as_view()),
    path('rated/', RatedRecipes.as_view()),
    path('ingredients/units/', IngredientUnitsView.as_view()),
    path('favorited/', FavoritedRecipes.as_view()),
    path('add/', CreateRecipeView.as_view()),
    path('', RecipeSearchView.as_view()),
    path('my-recipes/', MyRecipesView.as_view()),
    path('<int:recipe_id>/comments/', RecipeCommentsView.as_view()),
    path('<int:recipe_id>/like/', LikeRecipeView.as_view()),
    path('<int:recipe_id>/rate/', RateRecipeView.as_view()),
    path('<int:recipe_id>/view/', RecipeDetailsView.as_view()),
    path('<int:recipe_id>/edit/', RecipeEditView.as_view()),
    path('<int:recipe_id>/delete/', RecipeDeleteView.as_view()),
    path('<int:recipe_id>/favorite/', FavoriteRecipeView.as_view()),
    path('<int:recipe_id>/comments/add/', CreateCommentView.as_view()),
    path('<int:recipe_id>/bookmark/', BookmarkRecipeView.as_view()),
    path('ingredients/', IngredientAutocompleteView.as_view()),
    path('<int:recipe_id>/add-to-shopping-list/', ShoppingListCreateUpdateView.as_view()),
    path('shopping-list/', ShoppingListRetrieveView.as_view()),
    path('upload/image/', UploadRecipeImage.as_view()),
    path('upload/video/', UploadRecipeVideo.as_view()),
    path('instructions/upload/video/', UploadInstructionVideo.as_view()),
    path('instructions/upload/image/', UploadInstructionImage.as_view()),
    path('images/<int:id>/', DeleteRecipeImage.as_view()),
    path('videos/<int:id>/', DeleteRecipeVideo.as_view()),
    path('instructions/videos/<int:id>/', DeleteInstructionVideo.as_view()),
    path('instructions/images/<int:id>/', DeleteInstructionImage.as_view()),
    path('popular/', PopularRecipesRetrieveView.as_view()),
    path('latest/', LatestRecipesRetrieveView.as_view()),
    path('cuisines/', CuisineListView.as_view()),
    path('diets/', DietListView.as_view())
]