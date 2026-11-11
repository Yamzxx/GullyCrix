const fs = require('fs');
const js = fs.readFileSync('extracted_index.js', 'utf8');

// Find function By, xC, oa
const posBy = js.indexOf('function By(');
const posGi = js.indexOf('function Gi(');
const posOa = js.indexOf('function oa(');
const posSc = js.indexOf('function SC(');

const subCode = js.substring(posGi, posSc);

// Let's create an evaluation harness
const sandbox = `
let ks = (n) => \`\${Math.floor(n / 6)}.\${n % 6}\`;
${subCode}
module.exports = { oa };
`;

fs.writeFileSync('temp_oa.cjs', sandbox);

const { oa } = require('./temp_oa.cjs');

const sample_match = {
  id: "match-sample-1",
  createdAt: "2026-11-01T12:00:00.000Z",
  cursor: 8,
  config: {
    teams: [
      { name: "Team A", color: "#E52525" },
      { name: "Team B", color: "#4CAF50" }
    ],
    battingFirst: 1,
    tossWinner: 1,
    tossDecision: "bat",
    rules: {
      overs: 5,
      maxWickets: 10,
      wideRuns: 1,
      noBallRuns: 1,
      wideLegal: false,
      noBallLegal: false,
      freeHit: true,
      localRules: ""
    }
  },
  events: [
    { type: "ball", kind: "runs", runs: 6 },
    { type: "ball", kind: "runs", runs: 4 },
    { type: "ball", kind: "runs", runs: 4 },
    { type: "ball", kind: "runs", runs: 2 },
    { type: "ball", kind: "runs", runs: 2 },
    { type: "ball", kind: "runs", runs: 2 },
    { type: "endInnings" },
    { type: "endInnings" }
  ]
};

const res = oa(sample_match);
console.log("Status:", res.status);
console.log("Summary:", res.summary);
console.log("Winner:", res.winner);
console.log("Innings 0 (Team " + sample_match.config.teams[res.innings[0].teamIndex].name + "): runs=" + res.innings[0].runs + ", wkts=" + res.innings[0].wickets + ", balls=" + res.innings[0].balls + ", 4s=" + res.innings[0].fours + ", 6s=" + res.innings[0].sixes);
console.log("Innings 1 (Team " + sample_match.config.teams[res.innings[1].teamIndex].name + "): runs=" + res.innings[1].runs + ", wkts=" + res.innings[1].wickets + ", balls=" + res.innings[1].balls);
