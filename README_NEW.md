# AgriTrack - Agricultural Field Management System

A comprehensive full-stack farm management platform built with Django REST Framework and React, featuring real-time field monitoring, activity logging, and advanced agricultural analytics.

## 🌾 Features

### Admin Dashboard
- **Comprehensive Analytics** with Recharts visualizations
  - Field status distribution (Active, At Risk, Completed)
  - Expected vs actual yield comparison by field
  - Input costs analysis across all fields
  - Summary metrics (total fields, active count, at-risk count, total costs, total area)
- **Field Management** - Create, edit, and monitor all fields
- **Activity Logs** - Track all field activities with cost aggregation
- **Detailed Field Analytics** - View soil metrics, weather data, yield efficiency, and activity history

### Agent Dashboard
- **Assigned Fields Only** - View only fields assigned to the agent
- **Stage Updates** - Update field stage (Planted → Growing → Ready → Harvested)
- **Activity Logging** - Log specific activities with quantities and costs:
  - Fertilizer Application
  - Irrigation
  - Pesticide Application
  - Crop Inspection
  - Harvesting
  - Other custom activities
- **Field Metrics** - Real-time access to field data and analytics

### Core Capabilities
- **Role-Based Access Control** - Admin and Field Agent roles with appropriate permissions
- **JWT Authentication** - Secure token-based authentication with refresh tokens
- **Comprehensive Metrics**
  - Soil data (pH, Nitrogen, Phosphorus, Potassium levels)
  - Weather data (average rainfall, temperature)
  - Yield tracking (expected vs actual)
  - Cost analysis (total input costs, cost per hectare)
  - Performance metrics (days since planting, yield efficiency %)
- **Activity Audit Trail** - Complete logging of all field activities with costs
- **Status Tracking** - Automatic field status based on activity (Active, At Risk, Completed)

## 🛠 Tech Stack

### Backend
- **Framework**: Django 4.2 with Django REST Framework 3.17
- **Authentication**: JWT (djangorestframework-simplejwt 5.5.1)
- **Database**: SQLite3 (development; PostgreSQL for production)
- **Python**: 3.10+

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4.5
- **HTTP Client**: Axios 1.6 with JWT interceptor
- **Charting**: Recharts
- **Routing**: react-router-dom 6.16

## 📋 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create and activate virtual environment** (recommended)
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Apply migrations**
```bash
python manage.py migrate
```

5. **Start development server**
```bash
python manage.py runserver
```
Server runs on: `http://localhost:8000/`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```
Frontend runs on: `http://localhost:4173/` (or next available port)

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for secure authentication:

1. **Login** - Submit email and password to `/api/auth/login/`
2. **Token Response** - Receive access token (60 minutes) and refresh token (1 day)
3. **Authenticated Requests** - Include token in `Authorization: Bearer {token}` header
4. **Token Refresh** - Use refresh token to get new access token before expiration

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login/` - Login with email and password
- `POST /api/token/refresh/` - Refresh access token

### Fields
- `GET /api/fields/` - List all fields (filtered by role)
- `POST /api/fields/` - Create new field (Admin only)
- `GET /api/fields/{id}/` - Get field details
- `PATCH /api/fields/{id}/` - Update field
- `DELETE /api/fields/{id}/` - Delete field
- `POST /api/fields/{id}/update/` - Update field stage
- `POST /api/fields/{id}/activity/` - Log field activity
- `GET /api/dashboard/` - Get dashboard metrics

## 🌍 Field Model

### Basic Information
- **name** - Field identifier
- **crop_type** - Type of crop (Wheat, Corn, Rice, etc.)
- **location** - Physical location description
- **assigned_agent** - Field agent responsible for this field
- **planting_date** - When the crop was planted
- **expected_harvest_date** - Projected harvest date
- **current_stage** - Growth stage (Planted, Growing, Ready, Harvested)

### Metrics
- **area_hectares** - Field size in hectares
- **soil_pH** - Soil pH level
- **soil_nitrogen_ppm** - Nitrogen content in parts per million
- **soil_phosphorus_ppm** - Phosphorus content
- **soil_potassium_ppm** - Potassium content
- **avg_rainfall_mm** - Average rainfall in millimeters
- **avg_temperature_celsius** - Average temperature
- **expected_yield_kg** - Projected yield in kilograms
- **actual_yield_kg** - Actual harvest yield
- **total_input_cost** - Total cost of inputs (aggregated from activities)

### Computed Properties
- **status** - Determined from recent activity (Active/At Risk/Completed)
- **days_since_planting** - Calculated from planting_date
- **yield_efficiency** - (actual_yield / expected_yield) × 100
- **cost_per_hectare** - total_input_cost / area_hectares

## 📝 Activity Types

When logging field activities, select from:
- **Fertilizer** - Fertilizer application
- **Irrigation** - Watering activities
- **Pesticide** - Pest or disease control
- **Inspection** - Field inspection or monitoring
- **Harvest** - Harvesting operations
- **Other** - Custom activity type

Each activity records:
- Activity date and time
- Description of work performed
- Quantity (if applicable)
- Cost associated with the activity
- Logged by (user who recorded it)

## 🏗 Project Structure

```
backend/
├── manage.py
├── db.sqlite3
├── requirements.txt
├── agri_backend/
│   ├── settings.py        # Django configuration
│   ├── urls.py           # Project URL routing
│   └── asgi.py / wsgi.py
├── fields/
│   ├── models.py         # Field model
│   ├── views.py          # Field endpoints
│   ├── serializers.py    # Field serialization
│   ├── urls.py           # Field routes
│   └── migrations/
├── updates/
│   ├── models.py         # FieldUpdate and ActivityLog models
│   └── migrations/
└── users/
    ├── models.py         # Custom User model
    ├── views.py          # Login endpoint
    ├── serializers.py
    ├── urls.py
    └── migrations/

frontend/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx           # Root component with routing
    ├── api.js            # Axios configuration
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── AdminDashboard.jsx
    │   ├── AgentDashboard.jsx
    │   └── FieldManagement.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── FieldCard.jsx
    │   ├── StatusBadge.jsx
    │   ├── UpdateForm.jsx
    │   ├── ActivityLog.jsx
    │   └── FieldAnalytics.jsx
    └── styles/
        └── index.css
```

## 🧪 Test Users

Two test accounts are pre-created for development:

### Admin Account
- **Email**: `admin@agritrack.com`
- **Password**: `admin123`
- **Permissions**: Full system access, field creation, view all fields and activities

### Agent Account
- **Email**: `agent@agritrack.com`
- **Password**: `agent123`
- **Permissions**: View assigned fields only, update field stages, log activities

## 🔧 Development Notes

### Adding Fields via API
Admins can create fields with a POST request to `/api/fields/`:

```bash
curl -X POST http://localhost:8000/api/fields/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "North Field",
    "crop_type": "Wheat",
    "planting_date": "2024-04-01",
    "area_hectares": 5.5,
    "location": "Farm Zone A",
    "soil_pH": 7.2,
    "soil_nitrogen_ppm": 45,
    "expected_yield_kg": 2750
  }'
```

### Logging Activities via API
```bash
curl -X POST http://localhost:8000/api/fields/1/activity/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "activity_type": "Fertilizer",
    "description": "Applied nitrogen fertilizer",
    "quantity": 50,
    "cost": 150.00,
    "activity_date": "2024-04-15"
  }'
```

## 📈 Dashboard Metrics

The dashboard provides real-time insights:

- **Total Fields** - Count of all fields in the system
- **Active Fields** - Fields currently growing with recent updates
- **At Risk Fields** - Fields without recent activity
- **Total Area** - Combined hectares across all fields
- **Total Costs** - Aggregated input expenses
- **Total Yield** - Combined actual harvest yield
- **Status Distribution** - Pie chart showing field status breakdown
- **Yield Comparison** - Bar chart of expected vs actual yields
- **Cost Analysis** - Input costs by field

## 🚀 Deployment

For production deployment:

1. **Backend**: Deploy Django with a production server (Gunicorn)
2. **Database**: Switch from SQLite to PostgreSQL
3. **Frontend**: Build with `npm run build` and serve static files
4. **Environment**: Set DEBUG=False and configure allowed hosts

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions are welcome! Please create a fork and submit pull requests with your improvements.

## 📞 Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ for modern agriculture**
