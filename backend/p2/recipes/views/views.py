from typing import Union, Type

import django_filters
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import CreateAPIView, ListAPIView, get_object_or_404, RetrieveAPIView, UpdateAPIView, \
    DestroyAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import CustomUser
from recipes.models import *

from recipes.serializers import *


# Create your views here.

def _delete_image_or_video(request,
                           query_set: Union[
                               Type[InstructionImage], Type[InstructionVideo], Type[RecipeImage], Type[RecipeVideo]],
                           *args,
                           **kwargs) -> Response:
    user = request.user
    custom_user = CustomUser.objects.get(user=user)

    image_or_video_id = kwargs.get('id', '')
    image_or_video = get_object_or_404(query_set, id=image_or_video_id)

    recipe = image_or_video.recipe
    if recipe.owner != custom_user:
        raise PermissionDenied("You do not have permission to delete this video from this recipe")

    image_or_video.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class DeleteInstructionImage(DestroyAPIView):
    """
    Deletes an image tied to an instruction within a recipe if the currently authenticated user owns it
    """
    queryset = InstructionImage.objects.all()
    serializer_class = InstructionImageDeleteSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        return _delete_image_or_video(request, query_set=InstructionImage, *args, **kwargs)


class DeleteInstructionVideo(DestroyAPIView):
    """
    Deletes a video tied to an instruction within a recipe if the currently authenticated user owns it
    """
    queryset = InstructionVideo.objects.all()
    serializer_class = InstructionVideoDeleteSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        return _delete_image_or_video(request, query_set=InstructionVideo, *args, **kwargs)


class DeleteRecipeVideo(DestroyAPIView):
    """
    Deletes a video tied to a recipe if the currently authenticated user owns it
    """
    queryset = RecipeVideo.objects.all()
    serializer_class = RecipeVideoDeleteSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        return _delete_image_or_video(request, query_set=RecipeVideo, *args, **kwargs)


class DeleteRecipeImage(DestroyAPIView):
    """
    Deletes an image tied to a recipe if the currently authenticated user owns it
    """
    queryset = RecipeImage.objects.all()
    serializer_class = RecipeImageDeleteSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        return _delete_image_or_video(request, query_set=RecipeImage, *args, **kwargs)


class UploadRecipeImage(CreateAPIView):
    """
    Allows the currently authenticated user to upload an image for a recipe if they own it.
    Requires the use of multi-part formdata
    """
    queryset = RecipeImage.objects.all()
    serializer_class = RecipeImageSerializer
    permission_classes = [IsAuthenticated]


class UploadRecipeVideo(CreateAPIView):
    """
    Allows the currently authenticated user to upload a video for a recipe if they own it.
    Requires the use of multi-part formdata
    """
    queryset = RecipeVideo.objects.all()
    serializer_class = RecipeVideoSerializer
    permission_classes = [IsAuthenticated]


class UploadInstructionImage(CreateAPIView):
    """
    Allows the currently authenticated user to upload an image for an instruction within a recipe if they own it.
    Requires the use of multi-part formdata
    """
    queryset = InstructionImage.objects.all()
    serializer_class = InstructionImageSerializer
    permission_classes = [IsAuthenticated]


class UploadInstructionVideo(CreateAPIView):
    """
    Allows the currently authenticated user to upload a video for an instruction within a recipe if they own it.
    Requires the use of multi-part formdata
    """
    queryset = InstructionVideo.objects.all()
    serializer_class = InstructionVideoSerializer
    permission_classes = [IsAuthenticated]


class IngredientAutocompleteView(ListAPIView):
    """
    Search for an ingredient name. (Acts as autocomplete)
    """
    # Gets all the names of each distinct ingredient
    queryset = Ingredient.objects.all().values('name').distinct()  # source: https://stackoverflow.com/a/37594514
    serializer_class = IngredientAutocompleteSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    pagination_class = LimitOffsetPagination


class LikedRecipes(ListAPIView):
    """
    Gets a paginated list of recipes that the currently authenticated user has liked
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        user = self.request.user
        custom_user = CustomUser.objects.get(user=user)

        recipe_ids = Interaction.objects.filter(type='Like', user=custom_user).values('recipe')

        recipe_id_list = []
        for rec in recipe_ids:
            recipe_id_list.append(rec.get('recipe'))

        recipes = Recipe.objects.filter(id__in=recipe_id_list)
        return recipes


class FavoritedRecipes(ListAPIView):
    """
    Gets a paginated list of recipes that the currently authenticated user has liked
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        user = self.request.user
        custom_user = CustomUser.objects.get(user=user)

        recipe_ids = Interaction.objects.filter(type='Favorite', user=custom_user).values('recipe')

        recipe_id_list = []
        for rec in recipe_ids:
            recipe_id_list.append(rec.get('recipe'))

        recipes = Recipe.objects.filter(id__in=recipe_id_list)
        return recipes


class RatedRecipes(ListAPIView):
    """
    Gets a paginated list of recipes that the currently authenticated user has liked
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        user = self.request.user
        custom_user = CustomUser.objects.get(user=user)

        recipe_ids = Interaction.objects.filter(type='Rate', user=custom_user).values('recipe')

        recipe_id_list = []
        for rec in recipe_ids:
            recipe_id_list.append(rec.get('recipe'))

        recipes = Recipe.objects.filter(id__in=recipe_id_list)
        return recipes


class MyRecipesView(ListAPIView):
    """
    Gets a list of recipes that the currently authenticated user has created
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        user = self.request.user
        custom_user = CustomUser.objects.get(user=user)
        return custom_user.recipes.all()


class RecipeCommentsView(ListAPIView):
    """
    Gets a list of comments made on a given recipe
    """
    serializer_class = CommentSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        recipe_id = self.kwargs.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)

        return recipe.comment_set.all()


class LikeRecipeView(APIView):
    """
    Allows the currently authenticated user to like the given recipe
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id, *args, **kwargs):
        recipe = get_object_or_404(Recipe, id=recipe_id)

        user = request.user
        custom_user = CustomUser.objects.get(user=user)

        # If the current user has already liked this recipe, liking it a second time will 'unlike' the recipe
        # Otherwise, the like interaction will be recorded in the db
        if Interaction.objects.filter(user=custom_user, recipe=recipe, type='Like').exists():
            like_interaction = Interaction.objects.get(user=custom_user, recipe=recipe, type='Like')
            like_interaction.delete()
        else:
            Interaction.objects.create(user=custom_user, recipe=recipe, type='Like')

        recipe_serializer = RecipeSerializer(recipe, context={'request': request})

        return Response(recipe_serializer.data)


class FavoriteRecipeView(APIView):
    """
    Allows the currently authenticated user to favorite the given recipe
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id, *args, **kwargs):
        recipe = get_object_or_404(Recipe, id=recipe_id)

        user = request.user
        custom_user = CustomUser.objects.get(user=user)

        # If the current user has already favorited this recipe, liking it a second time will 'unfavorite' the recipe
        # Otherwise, the favorite interaction will be recorded in the db
        if Interaction.objects.filter(user=custom_user, recipe=recipe, type='Favorite').exists():
            favorite_interaction = Interaction.objects.get(user=custom_user, recipe=recipe, type='Favorite')
            favorite_interaction.delete()
        else:
            Interaction.objects.create(user=custom_user, recipe=recipe, type='Favorite')

        recipe_serializer = RecipeSerializer(recipe, context={'request': request})

        return Response(recipe_serializer.data)


class CreateRecipeView(CreateAPIView):
    """
    Allows the currently authenticated user to create a recipe.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]


class RecipeSearchView(ListAPIView):
    """
    Search for a recipe

    You can search by username/email, the ingredient name, and the name of the actual recipe.
    You can also filter by cuisines, diets, and cooking time. The results can also be paginated.

    I set this up using the django documentation. Source: https://www.django-rest-framework.org/api-guide/filtering/
    """

    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]

    # ?search=<query> basically checks <query> against all the items in the search_fields list
    search_fields = ['name', 'owner__user__username', 'owner__user__email', 'ingredients__name']

    # These are the fields that can be filtered by. They are additional query parameters, so essentially
    # you just add them to the end of  the url. Ex: `/recipes?search=pizza&diet=keto` to get keto pizzas
    filterset_fields = ['cuisines__name', 'diets__name', 'overall_cooking_time']

    pagination_class = LimitOffsetPagination


class RateRecipeView(CreateAPIView):
    """
    Allows the currently authenticated user to rate the given recipe with a rating between 1-5
    """
    serializer_class = RateRecipeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        recipe_id = kwargs.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)

        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        rating = serializer.validated_data['rating']

        user = request.user
        custom_user = CustomUser.objects.get(user=user)

        # If the user has already rated this recipe, update their rating. Otherwise, create a new rating
        # interaction object in the database
        if Interaction.objects.filter(user=custom_user, recipe=recipe, type='Rate').exists():
            rate_interaction = Interaction.objects.get(user=custom_user, recipe=recipe, type='Rate')
            if rate_interaction.rating == rating:
                rate_interaction.delete()
            else:
                rate_interaction.rating = rating
                rate_interaction.save()
        else:
            Interaction.objects.create(user=custom_user, recipe=recipe, type='Rate', rating=rating)

        recipe_serializer = RecipeSerializer(recipe, context={'request': request})

        return Response(recipe_serializer.data)


class CreateCommentView(CreateAPIView):
    """
    Allows the currently authenticated user to comment on a given recipe
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]


class RecipeDetailsView(RetrieveAPIView):
    """
    Gets all the details for a specific recipe
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return Response(serializer.data)

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, id=self.kwargs['recipe_id'])


class RecipeEditView(UpdateAPIView):
    """
    Allows the currently authenticated user to edit a recipe, provided that they are its owner.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, id=self.kwargs['recipe_id'])


class RecipeDeleteView(DestroyAPIView):
    """
    Allows the currently authenticated user to delete a recipe, provided that they are its owner.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        custom_user = CustomUser.objects.get(user=user)
        recipe_id = kwargs.get('recipe_id', '')

        recipe = get_object_or_404(Recipe, id=recipe_id)
        if recipe.owner != custom_user:
            raise PermissionDenied("You do not have permission to delete this recipe")

        recipe.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, id=self.kwargs['recipe_id'])


class BookmarkRecipeView(APIView):
    """
    Allows the currently authenticated user to bookmark a recipe
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id, *args, **kwargs):
        recipe = get_object_or_404(Recipe, id=recipe_id)

        user = request.user

        custom_user = CustomUser.objects.get(user=user)

        # If the current user has already bookmarked this recipe, liking it a second time will 'unbookmark' the recipe
        # Otherwise, the Bookmark interaction will be recorded in the db
        if Interaction.objects.filter(user=custom_user, recipe=recipe, type='Bookmark').exists():
            bookmark_interaction = Interaction.objects.get(user=custom_user, recipe=recipe, type='Bookmark')
            bookmark_interaction.delete()
        else:
            Interaction.objects.create(user=custom_user, recipe=recipe, type='Bookmark')

        recipe_serializer = RecipeSerializer(recipe, context={'request': request})

        return Response(recipe_serializer.data)


class ShoppingListCreateUpdateView(CreateAPIView):
    """
    Allows the currently authenticated user to add a given recipe to their shopping list
    """
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        recipe_id = kwargs.get('recipe_id')
        recipe = get_object_or_404(Recipe, id=recipe_id)

        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        num_servings = serializer.validated_data['num_servings']

        user = request.user
        custom_user = CustomUser.objects.get(user=user)

        # If the user has already rated this recipe, update their rating. Otherwise, create a new rating
        # interaction object in the database
        if ShoppingList.objects.filter(user=custom_user, recipe=recipe).exists():
            shopping_list = ShoppingList.objects.get(user=custom_user, recipe=recipe)
            if num_servings == 0:
                shopping_list.delete()
                return Response({'message': 'removed from shopping list'})
            shopping_list.num_servings = num_servings
            shopping_list.save()
        else:
            shopping_list = ShoppingList.objects.create(user=custom_user, recipe=recipe, num_servings=num_servings)

        return Response(ShoppingListSerializer(shopping_list, context={'request': request}).data)


class ShoppingListRetrieveView(ListAPIView):
    """
    Retrieves all the items within the currently authenticated users shopping list along with modified amounts of each ingredent.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ShoppingListSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        user = self.request.user
        custom_user = CustomUser.objects.get(user=user)

        return custom_user.shoppinglist_set.all()


class PopularRecipesRetrieveView(ListAPIView):
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.annotate()

    def list(self, request, *args, **kwargs):
        res = super().list(self, request, *args, **kwargs)
        res.data = sorted(res.data, key=lambda r: r['likes'], reverse=True)
        res.data = res.data[:4]
        return res


class LatestRecipesRetrieveView(ListAPIView):
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.order_by('-date_created')[:4]

class IngredientListView(ListAPIView):
    queryset = Ingredient.objects.order_by('name')
    serializer_class = IngredientSerializer

class CuisineListView(ListAPIView):
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer


class DietListView(ListAPIView):
    queryset = Diet.objects.all()
    serializer_class = DietSerializer


class IngredientUnitsView(ListAPIView):
    def get(self, request, *args, **kwargs):
        return Response(Ingredient.get_units())
