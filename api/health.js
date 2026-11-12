import { handleHealth } from "../server/index.js";

export default function handler(req, res) {
  return handleHealth(req, res);
}

