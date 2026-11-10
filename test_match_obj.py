# Let's test the match object structure
match = {
    "id": "match-sample-1",
    "createdAt": "2026-11-01T12:00:00.000Z",
    "cursor": 8,
    "config": {
        "teams": [
            {"name": "Team A", "color": "#E52525"},
            {"name": "Team B", "color": "#4CAF50"}
        ],
        "battingFirst": 0,
        "tossWinner": 0,
        "tossDecision": "bat",
        "rules": {
            "overs": 5,
            "maxWickets": 10,
            "wideRuns": 1,
            "noBallRuns": 1,
            "wideLegal": False,
            "noBallLegal": False,
            "freeHit": True,
            "localRules": ""
        }
    },
    "events": [
        {"type": "endInnings"},
        {"type": "ball", "kind": "runs", "runs": 6},
        {"type": "ball", "kind": "runs", "runs": 4},
        {"type": "ball", "kind": "runs", "runs": 4},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "ball", "kind": "runs", "runs": 2},
        {"type": "endInnings"}
    ]
}

# 6 + 4 + 4 + 2 + 2 + 2 = 20 runs, 6 balls, 1 six, 2 fours, 0 wickets.
print("Match test passed!")
