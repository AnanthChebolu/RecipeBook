from typing import List
from django.db import models
from django.utils.translation import gettext_lazy
from django.core.validators import MinValueValidator, MaxValueValidator
from accounts.models import CustomUser


# Create your models here.

class CookingUnits(models.TextChoices):
    TEA_SPOON = 'tsp', gettext_lazy('Teaspoon')
    TABLE_SPOON = 'tbs', gettext_lazy('Tablespoon')
    CUP = 'cup', gettext_lazy('Cup')
    OUNCE = 'oz', gettext_lazy('Ounce')
    MILLIGRAM = 'mg', gettext_lazy('Milligram')
    GRAM = 'g', gettext_lazy('Gram')
    KILOGRAM = 'kg', gettext_lazy('Kilogram')
    POUND = 'lbs', gettext_lazy('Pounds')
    MILLILITRE = 'mL', gettext_lazy('Millilitre')
    LITRE = 'L', gettext_lazy('Litre')
    EMPTY = '', gettext_lazy('')


class Ingredient(models.Model):

    name = models.CharField(null=False, max_length=200)
    units = models.CharField(choices=CookingUnits.choices, max_length=10)
    quantity = models.FloatField(validators=[MinValueValidator(0.0)])

    @staticmethod
    def get_units() -> List[str]:
        units = []

        for unit, unit_name in CookingUnits.choices:
            units.append(unit)

        return units

    def __str__(self):
        return f"{self.name} - {self.quantity} {self.units}"


class Instruction(models.Model):
    prep_time = models.FloatField(validators=[MinValueValidator(0.0)], null=True, blank=True)
    cooking_time = models.FloatField(validators=[MinValueValidator(0.0)], null=True, blank=True)
    instruction = models.TextField(default='')
    instruction_number = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"Prep Time: {self.prep_time}\n Cooking time: {self.cooking_time}\n Instruction: {self.instruction}"


class Diet(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"


class Cuisine(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"


class Recipe(models.Model):
    owner = models.ForeignKey(to=CustomUser, on_delete=models.SET_NULL, null=True, related_name='recipes')
    base_recipe_id = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='base_recipes')
    num_servings = models.PositiveIntegerField(default=1)
    cuisines = models.ManyToManyField(to=Cuisine, related_name='cuisines', blank=True)
    diets = models.ManyToManyField(to=Diet, related_name='diets', blank=True)
    ingredients = models.ManyToManyField(to=Ingredient, related_name='ingredients')
    instructions = models.ManyToManyField(to=Instruction, related_name='instructions')
    overall_prep_time = models.FloatField(validators=[MinValueValidator(0.0)])
    overall_cooking_time = models.FloatField(validators=[MinValueValidator(0.0)])
    name = models.CharField(max_length=200)
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"'{self.name}' by {self.owner}"


class RecipeImage(models.Model):
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='recipe/images/')


class RecipeVideo(models.Model):
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)
    video = models.FileField(upload_to='recipes/videos/')


class InstructionImage(models.Model):
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)
    image = models.FileField(upload_to='recipes/instructions/images/')
    instruction = models.ForeignKey(to=Instruction, on_delete=models.CASCADE)


class InstructionVideo(models.Model):
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)
    video = models.FileField(upload_to='recipes/instructions/videos/')
    instruction = models.ForeignKey(to=Instruction, on_delete=models.CASCADE)


class ShoppingList(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)
    num_servings = models.PositiveIntegerField(default=1)


class Interaction(models.Model):
    class InteractionTypes(models.TextChoices):
        like = 'Like', gettext_lazy('Like')
        favorite = 'Favorite', gettext_lazy('Favorite')
        rate = 'Rate', gettext_lazy('Rate')
        bookmark = 'Bookmark', gettext_lazy('Bookmark')

    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)
    type = models.CharField(max_length=100, choices=InteractionTypes.choices)
    rating = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)], null=True)

    def __str__(self):
        return f"{self.user} --[{self.type}]-> {self.recipe}"


class Comment(models.Model):
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE)
    recipe = models.ForeignKey(to=Recipe, on_delete=models.CASCADE)
    text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.user} on {self.date_created}\n{self.text}"
