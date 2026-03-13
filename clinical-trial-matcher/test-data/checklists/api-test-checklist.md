# Clinical Trial Matcher QA Checklist

## 1. Health and API Reachability
- [ ] Open http://localhost:5000/health and confirm response has status ok.
- [ ] Open http://localhost:5000/api and confirm endpoint list appears.

## 2. Patient Module
- [ ] In UI Patient Upload page, upload patients-upload.csv and confirm success count.
- [ ] Upload patients-upload.json and confirm success count.
- [ ] Manual entry test with a new patientId and confirm success message.
- [ ] Call GET /api/patient/PAT-2001 and confirm patient data returns.

## 3. Trial Database Module
- [ ] Import trials-import.json in Trial Database page.
- [ ] Confirm trial rows appear in table.
- [ ] Filter by condition Type 2 Diabetes and verify results.
- [ ] Filter by location Mumbai and verify results.
- [ ] Filter by phase Phase 3 and verify results.

## 4. AI Criteria Parsing
- [ ] Call POST /api/ai/parse-criteria with trialId TRIAL-1001.
- [ ] Confirm parsedRules contains ageRange, requiredConditions, excludedConditions.

## 5. Rule and Semantic Matching
- [ ] Call POST /api/match/rule-check and verify eligible/reasons payload.
- [ ] Call POST /api/match/semantic and verify ruleScore, similarityScore, finalScore.

## 6. Recommendations and Explanation
- [ ] Open Match Results Dashboard and generate matches.
- [ ] Confirm charts render for confidence, ranking, eligibility distribution.
- [ ] Click View Explanation and confirm explanation text appears.

## 7. Pass Criteria
- [ ] No red errors in browser console.
- [ ] No failed network calls for tested flows.
- [ ] API responses are valid JSON and match expected structure.
