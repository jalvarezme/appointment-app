import { BigQuery } from "@google-cloud/bigquery";
import creadJSON from "../../key-bigquery.json" with { type: "json" };

export const connection = new BigQuery({
  projectId: "",
  credentials: creadJSON,
});