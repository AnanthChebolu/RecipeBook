from django.contrib import admin
from recipes.models import Recipe, Ingredient, Diet, Cuisine

# Register your models here.

admin.site.register(Recipe)
admin.site.register(Ingredient)
admin.site.register(Diet)
admin.site.register(Cuisine)
