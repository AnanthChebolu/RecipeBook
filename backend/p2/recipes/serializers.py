from typing import Union, List, Type, Dict
from django.core.validators import MinValueValidator, MaxValueValidator
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from accounts.models import CustomUser
from recipes.models import Recipe, Diet, Cuisine, Ingredient, Comment, Interaction, CookingUnits, ShoppingList, \
    Instruction, RecipeImage, RecipeVideo, InstructionVideo, InstructionImage


def _create_and_get_diets_or_cuisines(query_set: Union[Type[Diet], Type[Cuisine]], names: List[Dict[str, str]]) -> List[
    Union[Diet, Cuisine]]:
    """
    Given a query set of either Diet or Cuisine, will traverse through the names list and check if an object
    of that query set already exists. If it doesn't, then it will be created. In either case, the resulting object
    will be added to a list and then returned.

    :param query_set: Either Diet or Cuisine
    :param names: A list of strings representing a name for either a Diet or Cuisine
    :return: A list of Diet or Cuisine objects corresponding to the given names list
    """
    name_strings = [name_dict.get('name') for name_dict in names]
    query_objects = []

    for name in name_strings:
        cap_name = name.capitalize()
        if query_set.objects.filter(name=cap_name).exists():
            query_obj = query_set.objects.get(name=cap_name)
            query_objects.append(query_obj)
        else:
            query_obj = query_set.objects.create(name=cap_name)
            query_objects.append(query_obj)

    return query_objects


def _create_ingredients(ingredient_dicts: List[Dict[str, str]]) -> List[Ingredient]:
    """
    Traverses ingredient_dicts and uses the key-value pairings to create Ingredient objects in the database.
    :param ingredient_dicts: Must contain "name", "quantity", and "unit" keys
    :return: A list of Ingredient objects that have been saved to the database
    """
    ingredients = []

    for ingredient_dict in ingredient_dicts:
        name = ingredient_dict.get("name")
        unit = ingredient_dict.get("units")
        quantity = ingredient_dict.get("quantity")
        print(name, unit, quantity)

        errors = {}
        if not name:
            errors['ingredient name'] = ["Ingredient must have a name"]

        if unit:
            valid_units = Ingredient.get_units()
            if unit not in valid_units:
                errors['ingredient units'] = [f"Invalid unit given. Must be one of: {valid_units}"]
        # else:
        #     errors['ingredient units'] = ["Measuring units are required"]

        if quantity:
            try:
                quantity = float(quantity)
            except ValueError:
                errors['ingredient quantity'] = ["Quantity is not a valid number"]
        else:
            errors['ingredient quantity'] = ["Quantity is not provided or is invalid"]

        if errors:
            raise serializers.ValidationError(errors)

        ingredient = Ingredient.objects.create(name=name.capitalize(), quantity=quantity, units=unit)
        ingredients.append(ingredient)

    return ingredients


def _create_instructions(instruction_dicts: List[Dict[str, str]]) -> List[Instruction]:
    """
    Traverses instruction_dicts and uses the key-value pairings to create Instructions objects in the database.
    :param instruction_dicts: Must contain "prep_time", "cooking_time", "instruction", "instruction_number" keys
    :return: A list of Instruction objects that have been saved to the database
    """
    instructions = []

    instruction_numbers = []
    err = {}
    for instruction_dict in instruction_dicts:
        instruction_number = instruction_dict.get("instruction_number", '')
        if instruction_number:
            try:
                instruction_number = int(instruction_number)
            except ValueError:
                err['instruction number not valid'] = ["Instruction is not a valid number"]
        else:
            err['instruction number not provided'] = ["instruction must have a value"]

        instruction_numbers.append(instruction_number)

    if len(instruction_numbers) != len(set(instruction_numbers)):
        err['instruction number not unique'] = ["instruction number must be unique"]
    instruction_numbers.sort()
    if instruction_numbers != list(range(1, len(instruction_numbers) + 1)):
        err['instruction number not sequential'] = ["instruction number must be sequential"]
    if err:
        raise serializers.ValidationError(err)

    for instruction_dict in instruction_dicts:
        prep_time = instruction_dict.get("prep_time")
        cooking_time = instruction_dict.get("cooking_time")
        instruction_body = instruction_dict.get("instruction")
        instruction_number = int(instruction_dict.get("instruction_number"))

        errors = {}
        if prep_time:
            try:
                prep_time = float(prep_time)
            except ValueError:
                errors['instruction prep time'] = ["prep time is not a valid number"]
        else:
            prep_time = None

        if cooking_time:
            try:
                cooking_time = float(cooking_time)
            except ValueError:
                errors['instruction cooking time'] = ["cooking time is not a valid number"]
        else:
            cooking_time = None

        if not instruction_body:
            errors['instruction'] = ["instruction must have a body"]

        if errors:
            raise serializers.ValidationError(errors)

        instruction = Instruction.objects.create(prep_time=prep_time,
                                                 cooking_time=cooking_time,
                                                 instruction=instruction_body,
                                                 instruction_number=instruction_number)
        instructions.append(instruction)

    return instructions


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["name", "units", "quantity"]


class InstructionVideoSerializer(serializers.ModelSerializer):
    recipe = serializers.CharField(source='recipe.id', allow_null=False, required=True)
    video = serializers.FileField(allow_empty_file=False, allow_null=False, required=True),
    instruction_number = serializers.IntegerField(validators=[MinValueValidator(1)], required=True, write_only=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = InstructionVideo
        fields = ['id', 'recipe', 'video', 'instruction_number']

    def create(self, validated_data):
        recipe_id = validated_data.get('recipe', {}).get('id')
        recipe = get_object_or_404(Recipe, id=recipe_id)

        user = self.context['request'].user
        custom_user = CustomUser.objects.get(user=user)

        if custom_user != recipe.owner:
            raise PermissionDenied("The current user is not the owner of this recipe")

        instruction_number = validated_data.get('instruction_number')
        instruction = get_object_or_404(recipe.instructions, instruction_number=instruction_number)

        video = validated_data.get('video')

        if not video:
            raise serializers.ValidationError({'video': ['video must be provided']})

        return InstructionVideo.objects.create(recipe=recipe, video=video, instruction=instruction)


class InstructionImageSerializer(serializers.ModelSerializer):
    recipe = serializers.CharField(source='recipe.id', allow_null=False, required=True)
    image = serializers.ImageField(allow_empty_file=False, allow_null=False, required=True)
    instruction_number = serializers.IntegerField(validators=[MinValueValidator(1)], required=True, write_only=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = InstructionImage
        fields = ['id', 'recipe', 'image', 'instruction_number']

    def create(self, validated_data):
        recipe_id = validated_data.get('recipe', {}).get('id')
        recipe = get_object_or_404(Recipe, id=recipe_id)

        user = self.context['request'].user
        custom_user = CustomUser.objects.get(user=user)

        if custom_user != recipe.owner:
            raise PermissionDenied("The current user is not the owner of this recipe")

        instruction_number = validated_data.get('instruction_number')
        instruction = get_object_or_404(recipe.instructions, instruction_number=instruction_number)

        image = validated_data.get('image')

        if not image:
            raise serializers.ValidationError({'image': ['image must be provided']})

        return InstructionImage.objects.create(recipe=recipe, image=image, instruction=instruction)


class InstructionImageDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructionImage
        fields = ['id']


class InstructionVideoDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructionVideo
        fields = ['id']


class RecipeVideoDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeVideo
        fields = ['id']


class RecipeImageDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeImage
        fields = ['id']


class InstructionSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField('_get_instruction_images', read_only=True)
    videos = serializers.SerializerMethodField('_get_instruction_videos', read_only=True)

    def _get_instruction_images(self, instruction: Instruction) -> List[Dict[str, str]]:
        urls = []
        images = InstructionImage.objects.filter(instruction=instruction)

        if not images.exists():
            return []

        for img in images:
            urls.append({'id': img.id, 'url': img.image.url})

        return urls

    def _get_instruction_videos(self, instruction: Instruction) -> List[Dict[str, str]]:
        urls = []

        videos = InstructionVideo.objects.filter(instruction=instruction)
        if not videos.exists():
            return []

        for vid in videos:
            urls.append({'id': vid.id, 'url': vid.video.url})

        return urls

    class Meta:
        model = Instruction
        fields = ["images", "videos", "prep_time", "cooking_time", "instruction", "instruction_number"]


class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diet
        fields = ['name']


class DietSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diet
        fields = ['name']


class RecipeImageSerializer(serializers.ModelSerializer):
    recipe = serializers.CharField(source='recipe.id', allow_null=False, required=True)
    image = serializers.ImageField(allow_empty_file=False, allow_null=False, required=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = RecipeImage
        fields = ['id', 'recipe', 'image']

    def create(self, validated_data):
        recipe_id = validated_data.get('recipe', {}).get('id')
        recipe = get_object_or_404(Recipe, id=recipe_id)

        user = self.context['request'].user
        custom_user = CustomUser.objects.get(user=user)

        if custom_user != recipe.owner:
            raise PermissionDenied("The current user is not the owner of this recipe")

        image = validated_data.get('image')

        if not image:
            raise serializers.ValidationError({'image': ['image must not be null']})

        return RecipeImage.objects.create(recipe=recipe, image=image)


class RecipeVideoSerializer(serializers.ModelSerializer):
    recipe = serializers.CharField(source='recipe.id', allow_null=False, required=True)
    video = serializers.FileField(allow_empty_file=False, allow_null=False, required=True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = RecipeVideo
        fields = ['id', 'recipe', 'video']

    def create(self, validated_data):
        recipe_id = validated_data.get('recipe', {}).get('id')
        recipe = get_object_or_404(Recipe, id=recipe_id)

        user = self.context['request'].user
        custom_user = CustomUser.objects.get(user=user)

        if custom_user != recipe.owner:
            raise PermissionDenied("The current user is not the owner of this recipe")

        video = validated_data.get('video')

        if not video:
            raise serializers.ValidationError({'video': ['video must not be null']})

        return RecipeVideo.objects.create(recipe=recipe, video=video)


class RecipeSerializer(serializers.ModelSerializer):
    """
    SerializerMethodField found through https://stackoverflow.com/a/24273265
    """
    base_recipe_id = serializers.PrimaryKeyRelatedField(queryset=Recipe.objects.all(), required=False, allow_null=True)
    diets = DietSerializer(many=True)
    cuisines = CuisineSerializer(many=True)
    ingredients = IngredientSerializer(many=True)
    instructions = InstructionSerializer(many=True)


    # Read only fields
    rating = serializers.SerializerMethodField('_get_rating', read_only=True)
    num_rates = serializers.SerializerMethodField('_get_num_rates', read_only=True)
    likes = serializers.SerializerMethodField('_get_num_likes', read_only=True)
    favorites = serializers.SerializerMethodField('_get_num_favorites', read_only=True)
    bookmarks = serializers.SerializerMethodField('_get_num_bookmarks', read_only=True)
    images = serializers.SerializerMethodField('_get_recipe_images', read_only=True)
    videos = serializers.SerializerMethodField('_get_recipe_videos', read_only=True)
    owner = serializers.CharField(source='owner.user.username', read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    # isLiked, isFavorited, isRated
    is_liked = serializers.SerializerMethodField('_get_is_liked', read_only=True)
    is_favourited = serializers.SerializerMethodField('_get_is_favourited', read_only=True)
    in_shoppinglist = serializers.SerializerMethodField('_get_in_shoppinglist', read_only=True)
    is_rated = serializers.SerializerMethodField('_get_is_rated', read_only=True)
    user_rating = serializers.SerializerMethodField('_get_user_rating', read_only=True)
    is_owner = serializers.SerializerMethodField('_get_is_owner', read_only=True)

    def _get_recipe_images(self, recipe: Recipe):
        urls = []
        for image in recipe.recipeimage_set.all():
            urls.append({'id': image.id, 'url': image.image.url})

        return urls

    def _get_is_liked(self, recipe: Recipe):
        user = self.context['request'].user
        if not user:
            return False
        if not user.is_authenticated:
            return False
        custom_user = CustomUser.objects.get(user=user)
        return Interaction.objects.filter(recipe=recipe, type='Like', user=custom_user).exists()

    def _get_is_favourited(self, recipe: Recipe):
        user = self.context['request'].user
        if not user:
            return False
        if not user.is_authenticated:
            return False
        custom_user = CustomUser.objects.get(user=user)
        return Interaction.objects.filter(recipe=recipe, type='Favorite', user=custom_user).exists()

    def _get_in_shoppinglist(self, recipe: Recipe):
        user = self.context['request'].user
        if not user:
            return False
        if not user.is_authenticated:
            return False
        custom_user = CustomUser.objects.get(user=user)
        return ShoppingList.objects.filter(recipe=recipe, user=custom_user).exists()

    def _get_is_rated(self, recipe: Recipe):
        user = self.context['request'].user
        if not user:
            return False
        if not user.is_authenticated:
            return False
        custom_user = CustomUser.objects.get(user=user)
        return Interaction.objects.filter(recipe=recipe, type='Rate', user=custom_user).exists()
    def _get_user_rating(self, recipe: Recipe) -> float:
        user = self.context['request'].user
        if not user:
            return 0
        if not user.is_authenticated:
            return 0
        custom_user = CustomUser.objects.get(user=user)
        if (Interaction.objects.filter(recipe=recipe, type='Rate', user=custom_user).exists()):
            return Interaction.objects.filter(recipe=recipe, type='Rate', user=custom_user).first().rating
        else:
            return 0

    def _get_is_owner(self, recipe: Recipe):
        user = self.context['request'].user
        if not user:
            return False
        if not user.is_authenticated:
            return False
        return recipe.owner == CustomUser.objects.get(user=user)





    def _get_recipe_videos(self, recipe: Recipe):
        urls = []
        for video in recipe.recipevideo_set.all():
            urls.append({'id': video.id, 'url': video.video.url})

        return urls

    def _get_num_bookmarks(self, recipe: Recipe):
        return len(Interaction.objects.filter(recipe=recipe, type='Bookmark'))

    def _get_num_favorites(self, recipe: Recipe) -> int:
        return len(Interaction.objects.filter(recipe=recipe, type='Favorite'))

    def _get_num_likes(self, recipe: Recipe) -> int:
        return len(Interaction.objects.filter(recipe=recipe, type='Like'))

    def _get_num_rates(self, recipe: Recipe) -> int:
        return len(Interaction.objects.filter(recipe=recipe, type='Rate'))

    def _get_rating(self, recipe: Recipe) -> float:
        rating_objects = Interaction.objects.filter(recipe=recipe, type='Rate')

        num_rates = len(rating_objects)

        if not num_rates:
            return 0

        rate_sum = 0

        for rate in rating_objects:
            print(rate)
            rate_sum += rate.rating

        return rate_sum / num_rates

    def _get_ingredients(self, recipe: Recipe) -> List[Dict[str, str]]:
        """
        Serializes the ingredients of the given recipe into a list of dictionaries
        :param recipe: a Recipe object in the database
        :return: a serialized version of the given recipes ingredients
        """
        ingredients = []

        for ingredient in recipe.ingredients.all():
            ingredients.append({
                'name': ingredient.name,
                'quantity': ingredient.quantity,
                'units': ingredient.units
            })

        return ingredients

    def _get_instructions(self, recipe: Recipe) -> List[Dict[str, str]]:
        """
        Serializes the instructins of the given recipe into a list of dictionaries
        :param recipe: a Recipe object in the database
        :return: a serialized version of the given recipes instructions
        """
        instructions = []

        for instruction in recipe.instructions.all():
            instructions.append({
                'prep_time': instruction.prep_time,
                'cooking_time': instruction.cooking_time,
                'instruction': instruction.instruction,
                'instruction_number': instruction.instruction_number
            })

        return instructions

    def _get_diets(self, recipe: Recipe) -> List[Dict[str, str]]:
        """
        Serializes the diets of the given recipe into a list of strings. Each string correspond to the name of a diet
        :param recipe: a Recipe object in the database
        :return: a list of names of the given recipes diets
        """
        diets = []

        for diet in recipe.diets.all():
            diets.append(diet.name)

        return diets

    def _get_cuisines(self, recipe: Recipe) -> List[Dict[str, str]]:
        """
        Serializes the cuisines of the given recipe into a list of strings. Each string correspond to the name of a
        cuisine
        :param recipe: a Recipe object in the database
        :return: a list of names of the given recipes cuisines
        """
        cuisines = []

        for cuisine in recipe.cuisines.all():
            cuisines.append(cuisine.name)

        return cuisines

    class Meta:
        model = Recipe
        fields = ["id", 'owner', 'base_recipe_id', 'cuisines', 'diets',
                  'ingredients', 'overall_prep_time', 'overall_cooking_time', 'instructions',
                  'name', 'num_servings', 'num_rates', 'rating', 'likes', 'images', 'videos', 'favorites', 'bookmarks',
                  'date_created', 'is_liked', 'is_favourited', 'is_rated', 'is_owner', 'user_rating', 'in_shoppinglist']

    def create(self, validated_data):
        user = self.context['request'].user
        custom_user = CustomUser.objects.get(user=user)

        base_recipe_id = validated_data.get('base_recipe_id')

        diets_arr = validated_data.get('diets', [])
        diet_objects = _create_and_get_diets_or_cuisines(Diet, diets_arr)

        cuisines_arr = validated_data.get('cuisines', [])
        cuisine_objects = _create_and_get_diets_or_cuisines(Cuisine, cuisines_arr)
        ingredients_arr = validated_data.get('ingredients', [])
        print(ingredients_arr)
        ingredients = _create_ingredients(ingredients_arr)

        instructions_arr = validated_data.get('instructions', [])
        instructions = _create_instructions(instructions_arr)

        overall_prep_time = validated_data.get("overall_prep_time")
        overall_cooking_time = validated_data.get("overall_cooking_time")
        recipe_name = validated_data.get("name")
        num_servings = validated_data.get("num_servings")

        new_recipe = Recipe.objects.create(owner=custom_user, name=recipe_name,
                                           base_recipe_id=base_recipe_id, overall_prep_time=overall_prep_time,
                                           overall_cooking_time=overall_cooking_time, num_servings=num_servings)

        for ing in ingredients:
            new_recipe.ingredients.add(ing)
        for cuisine_obj in cuisine_objects:
            new_recipe.cuisines.add(cuisine_obj)
        for diet_obj in diet_objects:
            new_recipe.diets.add(diet_obj)
        for instruction in instructions:
            new_recipe.instructions.add(instruction)

        new_recipe.save()
        return new_recipe

    def update(self, instance, validated_data):
        user = self.context['request'].user
        custom_user = CustomUser.objects.get(user=user)

        if self.instance.owner != custom_user:
            raise PermissionDenied("You do not have permission to edit this recipe")
        diets_arr = validated_data.get('diets', DietSerializer(self.instance.diets.all(), many=True).data)
        diet_objects = _create_and_get_diets_or_cuisines(Diet, diets_arr)

        cuisines_arr = validated_data.get('cuisines', CuisineSerializer(self.instance.cuisines.all(), many=True).data)
        cuisine_objects = _create_and_get_diets_or_cuisines(Cuisine, cuisines_arr)

        ingredients_arr = validated_data.get('ingredients', IngredientSerializer(self.instance.ingredients.all(), many=True).data)
        ingredients = _create_ingredients(ingredients_arr)

        instructions_arr = validated_data.get('instructions', InstructionSerializer(self.instance.instructions.all(), many=True).data)
        instructions = _create_instructions(instructions_arr)

        overall_prep_time = validated_data.get("overall_prep_time", self.instance.overall_prep_time)
        overall_cooking_time = validated_data.get("overall_cooking_time", self.instance.overall_cooking_time)
        recipe_name = validated_data.get("name", self.instance.name)
        num_servings = validated_data.get("num_servings", self.instance.num_servings)

        self.instance.name = recipe_name
        self.instance.num_servings = num_servings
        self.instance.overall_prep_time = overall_prep_time
        self.instance.overall_cooking_time = overall_cooking_time
        self.instance.ingredients.clear()
        self.instance.instructions.clear()
        self.instance.cuisines.clear()
        self.instance.diets.clear()

        for ing in ingredients:
            self.instance.ingredients.add(ing)
        for cuisine_obj in cuisine_objects:
            self.instance.cuisines.add(cuisine_obj)
        for diet_obj in diet_objects:
            self.instance.diets.add(diet_obj)
        for instruction in instructions:
            self.instance.instructions.add(instruction)

        self.instance.save()

        return self.instance


class RateRecipeSerializer(serializers.Serializer):
    rating = serializers.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    user = serializers.CharField(source='user.user.username', read_only=True)
    recipe = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Interaction
        fields = ["id", "user", "recipe", "type", "rating"]


class CommentSerializer(serializers.ModelSerializer):
    # Read only fields
    recipe = serializers.CharField(source='recipe.id', read_only=True)
    user = serializers.CharField(source='user.user.username', read_only=True)
    date_created = serializers.DateTimeField(read_only=True)
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    class Meta:
        model = Comment
        fields = ["id", 'user', 'recipe', 'text', 'date_created', 'avatar']

    def create(self, validated_data):
        user = self.context['request'].user
        custom_user = CustomUser.objects.get(user=user)
        recipe = self.context['view'].kwargs['recipe_id']
        recipe = get_object_or_404(Recipe, id=recipe)
        text = validated_data.get('text')
        date_created = validated_data.get('date_created')

        new_comment = Comment.objects.create(user=custom_user, text=text, recipe=recipe, date_created=date_created)
        return new_comment


class IngredientAutocompleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["name"]




class ShoppingListSerializer(serializers.Serializer):
    num_servings = serializers.FloatField(validators=[MinValueValidator(0)])
    user = serializers.CharField(source='user.user.username', read_only=True)
    # recipe = serializers.PrimaryKeyRelatedField(read_only=True)
    recipe = serializers.SerializerMethodField('_get_recipe_with_modified_amounts', read_only=True)

    def _get_recipe_with_modified_amounts(self, shopping_list_item: ShoppingList):
        recipe = shopping_list_item.recipe
        ingredients = recipe.ingredients.all()

        serialized_ingredients = []
        multiplier = shopping_list_item.num_servings / recipe.num_servings

        for ing in ingredients:
            ing.quantity = round(ing.quantity * multiplier, 2)
            ser_ing = IngredientSerializer(ing, context=self.context).data
            serialized_ingredients.append(ser_ing)
            if multiplier != 0:
                ing.quantity /= multiplier


        return {
            'modified_ingredients': serialized_ingredients,
            'original_recipe': RecipeSerializer(recipe, context=self.context).data
        }

    class Meta:
        model = ShoppingList
        fields = ["id", "user", "recipe", "num_servings"]
