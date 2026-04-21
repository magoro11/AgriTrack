from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from fields.models import Field
from updates.models import FieldUpdate, ActivityLog
from users.models import User

class Command(BaseCommand):
    help = 'Create demo data for AgriTrack'

    def handle(self, *args, **options):
        # Get users
        admin = User.objects.get(email='admin@agritrack.com')
        agent = User.objects.get(email='agent@agritrack.com')

        # Create demo fields
        fields_data = [
            {
                'name': 'North Field Wheat',
                'crop_type': 'Wheat',
                'location': 'North Section, Farm A',
                'assigned_agent': agent,
                'planting_date': timezone.now().date() - timedelta(days=45),
                'expected_harvest_date': timezone.now().date() + timedelta(days=30),
                'current_stage': 'Growing',
                'area_hectares': 25.5,
                'soil_pH': 6.8,
                'soil_nitrogen_ppm': 45,
                'soil_phosphorus_ppm': 28,
                'soil_potassium_ppm': 180,
                'avg_rainfall_mm': 120,
                'avg_temperature_celsius': 22,
                'expected_yield_kg': 8500,
                'actual_yield_kg': 0,
            },
            {
                'name': 'South Field Corn',
                'crop_type': 'Corn',
                'location': 'South Section, Farm A',
                'assigned_agent': agent,
                'planting_date': timezone.now().date() - timedelta(days=30),
                'expected_harvest_date': timezone.now().date() + timedelta(days=60),
                'current_stage': 'Growing',
                'area_hectares': 18.2,
                'soil_pH': 7.2,
                'soil_nitrogen_ppm': 52,
                'soil_phosphorus_ppm': 35,
                'soil_potassium_ppm': 195,
                'avg_rainfall_mm': 95,
                'avg_temperature_celsius': 25,
                'expected_yield_kg': 6200,
                'actual_yield_kg': 0,
            },
            {
                'name': 'East Field Rice',
                'crop_type': 'Rice',
                'location': 'East Section, Farm B',
                'assigned_agent': agent,
                'planting_date': timezone.now().date() - timedelta(days=20),
                'expected_harvest_date': timezone.now().date() + timedelta(days=80),
                'current_stage': 'Planted',
                'area_hectares': 32.0,
                'soil_pH': 6.5,
                'soil_nitrogen_ppm': 38,
                'soil_phosphorus_ppm': 22,
                'soil_potassium_ppm': 165,
                'avg_rainfall_mm': 150,
                'avg_temperature_celsius': 28,
                'expected_yield_kg': 12000,
                'actual_yield_kg': 0,
            },
        ]

        fields = []
        for field_data in fields_data:
            field, created = Field.objects.get_or_create(
                name=field_data['name'],
                defaults=field_data
            )
            fields.append(field)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created field: {field.name}'))

        # Create some field updates and activities
        for field in fields:
            # Create initial planting update
            FieldUpdate.objects.get_or_create(
                field=field,
                stage='Planted',
                notes='Initial planting completed',
                updated_by=agent,
                defaults={'created_at': timezone.datetime.combine(field.planting_date, timezone.datetime.min.time(), tzinfo=timezone.get_current_timezone())}
            )

            # Create some activities
            activities = [
                {
                    'activity_type': 'Fertilizer Application',
                    'description': 'Applied nitrogen fertilizer',
                    'quantity': '500kg',
                    'cost': 250.00,
                    'date': field.planting_date + timedelta(days=5),
                },
                {
                    'activity_type': 'Irrigation',
                    'description': 'Initial irrigation setup',
                    'quantity': '',
                    'cost': 150.00,
                    'date': field.planting_date + timedelta(days=2),
                },
                {
                    'activity_type': 'Pesticide/Herbicide',
                    'description': 'Applied preventive pesticide',
                    'quantity': '20L',
                    'cost': 180.00,
                    'date': field.planting_date + timedelta(days=10),
                },
            ]

            for activity in activities:
                ActivityLog.objects.get_or_create(
                    field=field,
                    activity_type=activity['activity_type'],
                    description=activity['description'],
                    quantity=activity['quantity'],
                    cost=activity['cost'],
                    logged_by=agent,
                    defaults={'activity_date': activity['date']}
                )

        self.stdout.write(self.style.SUCCESS('Demo data created successfully'))