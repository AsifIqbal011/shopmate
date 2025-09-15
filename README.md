# ShopMate

Revenue & Cost Calculation Web Application

## Prerequisites
- Python 3.10+
- Node.js + npm
- PostgreSQL installed and running

## Setup Instructions

### Backend (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Update DB credentials in settings.py
python manage.py migrate
python manage.py runserver
```
### Frontend (React)
```bash
cd frontend
npm i
npm run dev
