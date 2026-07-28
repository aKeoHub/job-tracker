# job-tracker

## Backend tests

Create a virtual environment and install the development dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements-dev.txt
```

Run the tests from the project root:

```bash
pytest backend/tests
```

## Frontend tests

Install dependencies and run the tests from the frontend directory:

```bash
cd frontend
npm install
npm test
```

Use `npm run test:watch` to rerun tests automatically while editing.

## Angular + .NET interview stack

This repo now includes an interview-focused ASP.NET Core backend and Angular frontend:

- `backend-dotnet`: minimal ASP.NET Core API for job tracking
- `frontend-angular`: Angular app that calls the .NET API

Run the .NET API:

```bash
cd backend-dotnet
dotnet run --urls http://localhost:5050
```

Run the Angular app in another terminal:

```bash
cd frontend-angular
npm start
```

Open `http://localhost:4200`.
