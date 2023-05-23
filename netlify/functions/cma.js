import { ema } from "moving-averages";

// Synthesize timeseries
const ts = Array(24)
  .fill(0)
  .map((_, i) => i + Math.random() / 5);

export async function handler(event, context) {
  const body = event.body ? JSON.parse(event.body) : {};
  const horizon = body?.horizon ?? 12;
  const model = body?.model ?? ts;

  // Train EMA on model
  let EMA = ema(model, horizon);

  // predict horizon
  console.log(EMA);

  if (!EMA) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMessage: "Could not predict" }),
    };
  }

  return {
    statusCode: 200,
    // return in bq format & ensure res is json
    // https://cloud.google.com/bigquery/docs/remote-functions
    body: JSON.stringify({
      model,
      horizon,
      pred: EMA,
      errors: [],
      replies: EMA,
    }),
  };
}
