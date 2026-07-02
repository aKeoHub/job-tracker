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
