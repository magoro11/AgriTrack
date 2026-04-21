from django.db import models
from django.utils import timezone


class FieldUpdate(models.Model):
    STAGE_PLANTED = 'Planted'
    STAGE_GROWING = 'Growing'
    STAGE_READY = 'Ready'
    STAGE_HARVESTED = 'Harvested'
    STAGE_CHOICES = [
        (STAGE_PLANTED, 'Planted'),
        (STAGE_GROWING, 'Growing'),
        (STAGE_READY, 'Ready'),
        (STAGE_HARVESTED, 'Harvested'),
    ]

    field = models.ForeignKey('fields.Field', related_name='updates', on_delete=models.CASCADE)
    updated_by = models.ForeignKey('users.User', related_name='field_updates', on_delete=models.CASCADE)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Update for {self.field.name} at {self.created_at:%Y-%m-%d %H:%M}"

    class Meta:
        ordering = ['-created_at']


class ActivityLog(models.Model):
    ACTIVITY_FERTILIZER = 'Fertilizer Application'
    ACTIVITY_IRRIGATION = 'Irrigation'
    ACTIVITY_PESTICIDE = 'Pesticide/Herbicide'
    ACTIVITY_INSPECTION = 'Field Inspection'
    ACTIVITY_HARVEST = 'Harvest'
    ACTIVITY_OTHER = 'Other'
    
    ACTIVITY_CHOICES = [
        (ACTIVITY_FERTILIZER, 'Fertilizer Application'),
        (ACTIVITY_IRRIGATION, 'Irrigation'),
        (ACTIVITY_PESTICIDE, 'Pesticide/Herbicide'),
        (ACTIVITY_INSPECTION, 'Field Inspection'),
        (ACTIVITY_HARVEST, 'Harvest'),
        (ACTIVITY_OTHER, 'Other'),
    ]
    
    field = models.ForeignKey('fields.Field', related_name='activity_logs', on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_CHOICES)
    description = models.TextField()
    quantity = models.CharField(max_length=100, blank=True, help_text="e.g., 50kg, 100L, etc.")
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    logged_by = models.ForeignKey('users.User', related_name='activity_logs', on_delete=models.CASCADE)
    logged_at = models.DateTimeField(default=timezone.now)
    activity_date = models.DateTimeField(help_text="When the activity occurred")
    
    def __str__(self):
        return f"{self.activity_type} on {self.field.name}"
    
    class Meta:
        ordering = ['-activity_date']
