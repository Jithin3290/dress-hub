🛍️ DressHub

Production-Ready Full-Stack eCommerce Platform

DressHub is a full-stack eCommerce application built with Django, Django REST Framework, React, Redux Toolkit, and WebSockets.
It supports real-time notifications, Razorpay payments, JWT-based WebSocket authentication, email OTP verification, and a fully deployed production setup.

This project was designed, built, and deployed end-to-end with a strong focus on scalability, security, and real-world deployment challenges.

✨ Key Features
👤 User Features

User registration with email OTP verification

Secure login using JWT authentication

Browse products by category

Product search, filtering, and sorting

Product details with size selection

Wishlist functionality

Cart management

Secure checkout with Razorpay payment gateway

Order history tracking

Real-time order status notifications (WebSockets)

🛠️ Admin Features

Admin dashboard

Product CRUD operations

Category management

User management

Order management

Live order status updates

Instant WebSocket notifications on order status change

🔔 Real-Time Notifications (WebSockets)

Implemented using Django Channels

Redis used as the channel layer

JWT-based authentication for WebSockets

Secure, scalable, and production-safe

Users receive instant notifications when order status changes

💳 Payments

Integrated Razorpay Checkout

Secure order creation and verification

Server-side payment validation

Prevents price tampering and duplicate payments

🔐 Authentication & Security

JWT access and refresh tokens

Protected frontend routes

Role-based access control (User / Admin)

Email OTP verification during signup

Secure cookie and token handling

WebSocket authentication using JWT tokens

🧑‍💻 Tech Stack
Frontend

React (Vite)

Redux Toolkit

React Router

Axios

Tailwind CSS

Native WebSocket API

Backend

Django

Django REST Framework

Django Channels

Redis (Channel Layer)

PostgreSQL

JWT Authentication

Razorpay SDK

Deployment & Infrastructure

AWS EC2 (Backend)

Nginx (Reverse Proxy + SSL)

Gunicorn with Uvicorn Workers (ASGI)

Redis (WebSocket messaging)

Vercel (Frontend)

HTTPS with Let’s Encrypt

🧩 System Architecture
Frontend (React + Vercel)
        |
        | HTTPS / WSS
        |
Nginx (Reverse Proxy)
        |
        |
Gunicorn + Uvicorn Workers (ASGI)
        |
        |
Django + DRF + Channels
        |
        |
PostgreSQL        Redis

⚙️ Environment Variables
Frontend (Vercel / .env)
VITE_API_BASE_URL=https://dresshub.duckdns.org
VITE_WS_URL=wss://dresshub.duckdns.org

Backend (.env)
SECRET_KEY=your_secret_key
DEBUG=False
ALLOWED_HOSTS=dresshub.duckdns.org

DATABASE_URL=postgresql://...
REDIS_URL=redis://127.0.0.1:6379

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_app_password

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

🛠️ Local Setup (Development)
Backend
git clone https://github.com/yourusername/dresshub-backend.git
cd dresshub-backend

python -m venv dressvenv
source dressvenv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

Frontend
git clone https://github.com/yourusername/dresshub-frontend.git
cd dresshub-frontend

npm install
npm run dev

📡 API & WebSocket Endpoints
REST APIs

/api/v1/products/

/api/v1/cart/

/api/v1/orders/

/api/v1/auth/

/api/v1/admin/

WebSocket

/ws/order/notifications/
(JWT-authenticated WebSocket connection)

📈 What This Project Demonstrates

Full-stack system design

REST API development with Django REST Framework

Real-time communication using WebSockets

JWT authentication for HTTP and WebSockets

Payment gateway integration (Razorpay)

Email OTP verification flow

Redux Toolkit state management

Production deployment on AWS

Debugging real production issues (ASGI, Nginx, WebSockets)

🧠 Key Learnings

Difference between WSGI and ASGI

WebSocket behavior in production environments

Secure WebSocket authentication strategies

Proper Nginx configuration for WebSockets

Handling cross-origin authentication

Payment verification and backend validation

Debugging real infrastructure issues

🚧 Future Improvements

Refund handling with Razorpay

Email and SMS order notifications

Advanced admin analytics

Order tracking timeline

Rate limiting and audit logs

👤 Author

Jithin C
Full-Stack Developer

📧 Email: jithin3290@gmail.com

🔗 Portfolio: https://jithin3290.github.io/portfolio

🔗 LinkedIn: https://www.linkedin.com/in/jithin-c-9bb421313/