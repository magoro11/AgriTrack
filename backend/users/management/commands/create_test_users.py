from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Create test users for AgriTrack'

    def handle(self, *args, **options):
        if not User.objects.filter(email='admin@agritrack.com').exists():
            User.objects.create_user(
                email='admin@agritrack.com',
                password='admin123',
                full_name='Admin User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        if not User.objects.filter(email='agent@agritrack.com').exists():
            User.objects.create_user(
                email='agent@agritrack.com',
                password='agent123',
                full_name='Field Agent',
                role='agent'
            )
            self.stdout.write(self.style.SUCCESS('Created agent user'))