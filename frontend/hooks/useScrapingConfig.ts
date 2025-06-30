"use client";

import { useState } from "react";

export function useScrapingConfig() {
  const [teamId, setTeamId] = useState("aline123");
  const [userId, setUserId] = useState("user123");

  return {
    teamId,
    setTeamId,
    userId,
    setUserId,
  };
}
