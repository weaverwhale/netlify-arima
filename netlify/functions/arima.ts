import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import ARIMA from 'arima';

// Synthesize timeseries
const ts = Array(24)
  .fill(0)
  .map((_, i) => i + Math.random() / 5);

export async function handler(event: any, context: any) {
  const body = event.body ? JSON.parse(event.body) : {};
  const horizon = body?.horizon ?? 12;
  const model = body?.model ?? ts;

  // Train ARIMA on model
  let arima = new ARIMA({
    p: 2,
    d: 1,
    q: 2,
    verbose: true,
  }).train(model);

  // predict horizon
  const [pred, errors] = arima.predict(horizon);
  console.log(pred)

  // return in bq format & ensure res is json
  // https://cloud.google.com/bigquery/docs/remote-functions
  if (!pred) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errorMessage: 'Could not predict' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ model, horizon, pred, errors })
  };
};
