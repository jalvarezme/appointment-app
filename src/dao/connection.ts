import { BigQuery } from "@google-cloud/bigquery";
import { BIG_QUERY_CRED } from "../const.ts";

export const connection = new BigQuery({
  projectId: "",
  credentials: BIG_QUERY_CRED,
});
