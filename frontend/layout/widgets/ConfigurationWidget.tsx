"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useScrapingConfig } from "@/hooks/useScrapingConfig";

export function ConfigurationWidget() {
  const { teamId, setTeamId, userId, setUserId } = useScrapingConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="team-id">Team ID</Label>
          <Input
            id="team-id"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            placeholder="aline123"
          />
        </div>
        <div>
          <Label htmlFor="user-id">User ID</Label>
          <Input
            id="user-id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="user123"
          />
        </div>
      </CardContent>
    </Card>
  );
}
