from django.contrib import admin
from .models import FieldUpdate, ActivityLog


@admin.register(FieldUpdate)
class FieldUpdateAdmin(admin.ModelAdmin):
    list_display = ('field', 'updated_by', 'stage', 'created_at')
    list_filter = ('stage', 'created_at')
    search_fields = ('field__name', 'updated_by__email', 'notes')


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('field', 'activity_type', 'activity_date', 'logged_by', 'cost')
    list_filter = ('activity_type', 'activity_date')
    search_fields = ('field__name', 'description', 'logged_by__email')
    readonly_fields = ('logged_at',)

