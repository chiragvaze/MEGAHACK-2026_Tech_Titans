# Clinical Trial Eligibility & Matching Engine

An AI-powered platform that analyzes anonymized patient health records and matches patients to relevant clinical trials.

## System Purpose

The system helps research teams and clinicians:
- Parse patient records into standardized eligibility signals.
- Compare trial criteria against patient characteristics.
- Generate explainable eligibility and ranking results.
- Reduce manual screening time while improving trial fit.

## Tech Stack

### Frontend
- React
- TailwindCSS
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### AI Layer
- OpenAI API
- Cohere Embeddings API

## Project Structure

```text
clinical-trial-matcher
├── client
├── server
└── ai-services
```

## Quick Start

### 1) Frontend
```bash
cd client
npm install
npm run dev
```

### 2) Backend
```bash
cd server
npm install
npm run dev
```

### 3) Environment Variables (server)
Copy `.env.example` to `.env` in `server` and provide keys:
- `PORT`
- `MONGODB_URI`
- `OPENAI_API_KEY`
- `COHERE_API_KEY`

## Notes

This scaffold includes base models, routes, controllers, and service placeholders for extending patient-to-trial matching logic and explainable AI outputs.

## Patient Data Module

### APIs
- `POST /api/patient/create`
- `POST /api/patient/upload`
- `GET /api/patient/:id`

### Patient Schema
- `patientId`
- `age`
- `gender`
- `conditions` (array)
- `medications` (array)
- `location`
- `createdAt`

### Upload Support
- CSV upload via multipart form field: `file`
- JSON upload via multipart form field: `file`

### Anonymization Guardrails
- Requests are rejected if identifiable keys are detected (for example: `name`, `phone`, `email`, `address`, `ssn`).
- Requests are rejected if value patterns look like phone numbers or email addresses.

## Clinical Trial Database Module

### APIs
- `POST /api/trial/create`
- `GET /api/trial/all`
- `GET /api/trial/:id`
- `POST /api/trial/import` (JSON dataset upload, multipart field: `file`)

### Trial Schema
- `trialId`
- `title`
- `condition`
- `location`
- `minAge`
- `maxAge`
- `inclusionCriteria` (text)
- `exclusionCriteria` (text)
- `phase`
- `sponsor`

### Frontend Features
- Trial table view
- Filters by condition, location, and phase
- Expandable full-text inclusion and exclusion criteria

## AI Criteria Parsing Module

### AI Service
- `ai-services/criteria-parser/parser.js`
- Function: `parseEligibilityText(criteriaText)`

### API
- `POST /api/ai/parse-criteria`

### Request Body
```json
{
	"trialId": "TRIAL-001",
	"criteriaText": "Inclusion: Patients aged 40-65 with Type 2 Diabetes. Exclusion: kidney disease."
}
```

### Response Shape
```json
{
	"trialId": "TRIAL-001",
	"parsedRules": {
		"ageRange": [40, 65],
		"requiredConditions": ["Type 2 Diabetes"],
		"excludedConditions": ["Kidney Disease"]
	}
}
```

### Validation
- AI JSON response is validated to ensure required keys and types:
	- `ageRange`: `[minAge, maxAge]`
	- `requiredConditions`: `string[]`
	- `excludedConditions`: `string[]`
- Parsed rules are stored in the corresponding trial document under `parsedEligibility`.

## Rule-Based Eligibility Matching

### Service
- `server/services/ruleEngine.js`
- Function: `evaluateEligibility(patient, trial)`

### API
- `POST /api/match/rule-check`

### Rules
1. Check age range
2. Check required conditions
3. Check excluded conditions

### Request Example
```json
{
	"patient": {
		"age": 50,
		"conditions": ["Type 2 Diabetes"]
	},
	"trial": {
		"minAge": 40,
		"maxAge": 65,
		"parsedEligibility": {
			"requiredConditions": ["Type 2 Diabetes"],
			"excludedConditions": ["Kidney Disease"]
		}
	}
}
```

### Response Example
```json
{
	"eligible": true,
	"reasons": [
		"Age within range",
		"Required condition present",
		"No excluded conditions detected"
	]
}
```

## AI Semantic Matching (Embeddings)

### Service
- `ai-services/embedding-engine/matcher.js`

### Process
1. Convert patient medical profile into embedding
2. Convert trial condition text into embedding
3. Compute cosine similarity

### API
- `POST /api/match/semantic`

### Request Example
```json
{
	"patient": {
		"age": 50,
		"gender": "Female",
		"conditions": ["Type 2 Diabetes"],
		"medications": ["Metformin"],
		"location": "Mumbai"
	},
	"trial": {
		"trialId": "TRIAL-001",
		"condition": "Type 2 Diabetes",
		"inclusionCriteria": "Adults with diagnosed Type 2 Diabetes",
		"exclusionCriteria": "Kidney disease",
		"phase": "Phase 3",
		"location": "Mumbai",
		"minAge": 40,
		"maxAge": 65,
		"parsedEligibility": {
			"requiredConditions": ["Type 2 Diabetes"],
			"excludedConditions": ["Kidney Disease"]
		}
	}
}
```

### Response Example
```json
{
	"trialId": "TRIAL-001",
	"eligible": true,
	"reasons": [
		"Age within range",
		"Required condition present",
		"No excluded conditions detected"
	],
	"ruleScore": 1,
	"similarityScore": 0.87,
	"finalScore": 0.948
}
```

### Scoring Formula
- `finalScore = (ruleScore * 0.6) + (similarityScore * 0.4)`

## Trial Ranking Engine

### Service
- `server/services/rankingEngine.js`

### API
- `POST /api/match/recommendations`

### Input
- Patient profile
- List of trials
- Optional matching scores (`ruleScore`, `similarityScore`) per trial

### Ranking Factors
1. Eligibility rules
2. Embedding similarity
3. Geographic proximity

### Request Example
```json
{
	"patient": {
		"age": 50,
		"gender": "Female",
		"conditions": ["Type 2 Diabetes"],
		"medications": ["Metformin"],
		"location": "Mumbai, India"
	},
	"trials": [
		{
			"trialId": "TRIAL-001",
			"condition": "Type 2 Diabetes",
			"location": "Mumbai, India",
			"minAge": 40,
			"maxAge": 65,
			"parsedEligibility": {
				"requiredConditions": ["Type 2 Diabetes"],
				"excludedConditions": ["Kidney Disease"]
			}
		}
	],
	"matchingScores": [
		{
			"trialId": "TRIAL-001",
			"similarityScore": 0.87
		}
	]
}
```

### Response Example
```json
{
	"recommendations": [
		{ "trialId": "TRIAL-001", "score": 92 },
		{ "trialId": "TRIAL-002", "score": 85 }
	]
}
```

## Explainable AI Module

### Goal
- Explain why a clinical trial was recommended.

### Service
- `ai-services/explanation-engine/explain.js`

### API
- `POST /api/match/explanation`

### Input
- Patient profile
- Trial criteria
- Matching result

### Request Example
```json
{
	"patient": {
		"age": 50,
		"gender": "Female",
		"conditions": ["Type 2 Diabetes"],
		"location": "Mumbai"
	},
	"trial": {
		"trialId": "TRIAL-001",
		"title": "T2D Lifestyle Intervention",
		"condition": "Type 2 Diabetes",
		"minAge": 40,
		"maxAge": 65,
		"inclusionCriteria": "Adults aged 40-65 with Type 2 Diabetes",
		"exclusionCriteria": "Kidney disease"
	},
	"matchingResult": {
		"eligible": true,
		"ruleScore": 1,
		"similarityScore": 0.87,
		"finalScore": 0.948,
		"reasons": [
			"Age within range",
			"Required condition present",
			"No excluded conditions detected"
		]
	}
}
```

### Response Example
```json
{
	"explanation": "Trial matched because patient age is within required range and diagnosed condition aligns with Type 2 Diabetes eligibility. No exclusion conditions were detected, which supports recommendation confidence."
}
```
