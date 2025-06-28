# API Testing and CI/CD Pipeline with Swagger & Keploy

This project demonstrates how to set up an end-to-end Express.js-based User Management System, enhanced with AI-based API testing using **Keploy**, automated using **GitHub Actions**, and documented using **Swagger (OpenAPI)**.

---

## 🖊️ API Documentation with Swagger (OpenAPI)

We documented our Express APIs using the **OpenAPI Specification** via Swagger. This helps:

* Define routes, methods, and models in a standardized format
* Allow auto-generation of API test cases
* Integrate better with testing tools like Keploy

### How Swagger/OpenAPI Was Set Up:

1. Created an OpenAPI YAML/JSON schema for all Express routes
2. Defined methods, request body schemas, and responses
3. Uploaded schema to the [Keploy Dashboard](https://app.keploy.io) for test generation

> Example of a documented route:

```yaml
paths:
  /user/create:
    post:
      summary: Create a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        '200':
          description: User created successfully
```

---

## 🧪 AI-Powered API Testing with Keploy

Once the OpenAPI schema and `curl` commands were prepared, we used **Keploy** to test the APIs locally.

### Keploy Setup:

1. Downloaded and extracted the Keploy Agent:

```bash
tar -xvf keploy-agent-windows-amd64.zip
```

2. Ran the agent:

```bash
./keploy-agent.exe
```

### Test Generation:

* The agent began recording API calls & responses (visible in terminal logs)
* Uploaded test suite to the Keploy dashboard
* Generated test cases automatically based on captured inputs and responses

> **Screenshot: Running Keploy Agent**

![Keploy Agent CLI Screenshot](./Screenshot%202025-06-27%20235250.png)

---

## 📈 CI/CD Pipeline Integration using GitHub Actions

### Goal: Automate API Testing on Every Push

We integrated Keploy API Testing into our CI/CD pipeline using GitHub Actions.

### Steps Followed:

1. Created `.github/workflows/ci.yml`
2. Installed dependencies, launched the app, and started Keploy tests
3. Workflow was triggered on `push` events

> Sample GitHub Action config (ci.yml):

```yaml
name: CI with Keploy API Testing

on:
  push:
    branches: [ "main" ]

jobs:
  keploy-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'

      - name: Install dependencies
        run: npm install

      - name: Start MongoDB
        uses: supercharge/mongodb-github-action@1.8.0

      - name: Run Keploy Tests
        run: |
          curl -sL https://get.keploy.io/install.sh | sh
          nohup node app.js &
          sleep 5
          keploy test -c "curl http://localhost:3000/users" -r
```

### GitHub Actions Dashboard View:

![GitHub CI Status Screenshot](./Screenshot%202025-06-28%20002347.png)

> All jobs passed successfully, showing the test suite integration with Keploy.

---

## 📄 Summary

| Feature           | Tool Used                    |
| ----------------- | ---------------------------- |
| API Documentation | Swagger / OpenAPI            |
| API Testing       | Keploy CLI & Dashboard       |
| CI/CD Pipeline    | GitHub Actions               |
| Test Generation   | Automated via curl + OpenAPI |

---

## 👀 GitHub Repo

View the project and workflow config here:
**[Authentication-Authorization-API GitHub Repository](https://github.com/Arun7677/Autentication-Authorization-API)**

---

> ✅ All test cases passed, pipeline was successful, and the Keploy integration worked as expected.
