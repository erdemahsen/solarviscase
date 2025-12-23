# Solarvis Case Study 

This is a full-stack application using React at the frontend, FastAPI and SQLite at the backend.


## Table of Contents

- [Live Demo](#live-demo)
- [How to run locally?](#how-to-run-locally)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)

---

## Live Demo
Both frontend and backend are deployed in render.com. 

After a while without interaction both render servers go down. So make sure you click on both of the links below and wait for deployment if necessary.

- https://solarviscasefrontend.onrender.com/app
- https://solarviscasebackend.onrender.com/docs

Also that backend url above provides the API documentation.

---

## How to run locally?

First clone the repo, and open that directory.
```bash
git clone https://github.com/erdemahsen/solarviscase

cd solarviscase/
```

### Backend Setup

Do below from solarviscase directory.

First setup your environment variables
```bash
cat <<EOF > backend/.env
SECRET_KEY=your-secret-key
ADMIN_EMAIL=your-admin-mail
ADMIN_PASSWORD=your-admin-password
EOF
```
Then run the following commands
```bash
# Create a virtual environment and activate it
python3 -m venv myenv 
source myenv/bin/activate

# Install dependencies
pip3 install -r backend/requirements.txt

# Run the backend server (by default http://localhost:8000)
python3 -m uvicorn backend.main:app --reload
```

### Frontend Setup

Open a new terminal in solarvis directory.

Configure first environment variables. If backend is not in port 8000 change it accordingly.

```bash
echo "VITE_API_URL=http://localhost:8000" > frontend/.env
```

Then we can run the frontend

```bash
cd frontend/
# Install dependencies
npm install

# Run the frontend server (by default http://localhost:5173)
npm run dev
```

---

