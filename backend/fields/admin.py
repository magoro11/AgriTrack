from django.contrib import admin
from .models import Field


@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'crop_type', 'current_stage', 'assigned_agent')
    list_filter = ('current_stage', 'crop_type')
    search_fields = ('name', 'crop_type')
