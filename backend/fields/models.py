from django.db import models
from django.utils import timezone
from django.conf import settings


class Field(models.Model):
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

    # Basic info
    name = models.CharField(max_length=200)
    crop_type = models.CharField(max_length=120)
    planting_date = models.DateField()
    expected_harvest_date = models.DateField(null=True, blank=True)
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default=STAGE_PLANTED)
    assigned_agent = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='assigned_fields', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Field metrics
    area_hectares = models.DecimalField(max_digits=8, decimal_places=2, default=1.0, help_text="Field size in hectares")
    location = models.CharField(max_length=255, blank=True, help_text="Field location/coordinates")
    
    # Soil data
    soil_pH = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    soil_nitrogen_ppm = models.IntegerField(null=True, blank=True)
    soil_phosphorus_ppm = models.IntegerField(null=True, blank=True)
    soil_potassium_ppm = models.IntegerField(null=True, blank=True)
    
    # Weather & environment
    avg_rainfall_mm = models.IntegerField(null=True, blank=True, help_text="Average monthly rainfall in mm")
    avg_temperature_celsius = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    
    # Input costs
    total_input_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Total cost of inputs/fertilizers")
    
    # Yield data
    expected_yield_kg = models.IntegerField(null=True, blank=True, help_text="Expected yield in kg")
    actual_yield_kg = models.IntegerField(null=True, blank=True, help_text="Actual harvested yield in kg")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def status(self):
        if self.current_stage == self.STAGE_HARVESTED:
            return 'Completed'

        last_update = self.updates.order_by('-created_at').first()
        if last_update is None:
            return 'At Risk' if (timezone.now().date() - self.planting_date).days > 7 else 'Active'

        age = timezone.now() - last_update.created_at
        if age.days > 7:
            return 'At Risk'
        return 'Active'
    
    @property
    def days_since_planting(self):
        return (timezone.now().date() - self.planting_date).days
    
    @property
    def yield_efficiency(self):
        """Expected vs actual yield percentage"""
        if not self.expected_yield_kg or not self.actual_yield_kg:
            return None
        return round((self.actual_yield_kg / self.expected_yield_kg) * 100, 1)
    
    @property
    def cost_per_hectare(self):
        """Input cost per hectare"""
        if self.area_hectares == 0:
            return 0
        return round(float(self.total_input_cost) / float(self.area_hectares), 2)
