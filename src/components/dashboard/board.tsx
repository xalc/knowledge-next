"use client";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { syncWRDataToDB } from "@/actions/wr";

export default function DashboardPage() {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(null);
  const onSyncDataClick = () => {
    startTransition(async () => {
      const result = await syncWRDataToDB();
      setValue(result);
    });
  };

  return (
    <>
      <Button onClick={onSyncDataClick}> {isPending ? "SYNCing Data" : "SYNC now"} </Button>

      <div>{value}</div>
    </>
  );
}
