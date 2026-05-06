# Pass A Prompt (DEU)

Country: Germany (Allemagne)

Task: Return ONLY a JSON array of sources matching this exact schema:
[id,name,url,desc,publicationDate,accessDate,confidence,citationType]

Rules:
- Deep links only (no homepages)
- id must be lowercase slug
- publicationDate/accessDate must be YYYY-MM-DD
- confidence: High|Med|Low
- citationType: Fact|Interpretation
- Cover macro, governance, trade, security, legal/treaty, recent factual events
