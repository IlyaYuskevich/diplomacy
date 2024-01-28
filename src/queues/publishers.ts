import { initNextPhase } from "./calc-results.ts";
import { PhaseIsOverMessage } from "./types.ts";

const kv = await Deno.openKv();

// kv.listenQueue(async (msg: unknown) => {
//   const nonce = await kv.get(["nonces", msg.nonce]);
//   if (nonce.value === null) {
//     // This messaged was already processed
//     return;
//   }

//   const change = msg.change;
//   const bob = await kv.get(["balance", "bob"]);
//   const liz = await kv.get(["balance", "liz"]);

//   const success = await kv.atomic()
//     // Ensure this message was not yet processed
//     .check({ key: nonce.key, versionstamp: nonce.versionstamp })
//     .delete(nonce.key)
//     .sum(["processed_count"], 1n)
//     .check(bob, liz) // balances did not change
//     .set(["balance", "bob"], bob.value - change)
//     .set(["balance", "liz"], liz.value + change)
//     .commit();
// });

// // Modify keys and enqueue messages in the same KV transaction!
// const nonce = crypto.randomUUID();
// await kv
//   .atomic()
//   .check({ key: ["nonces", nonce], versionstamp: null })
//   .enqueue({ nonce: nonce, change: 10 })
//   .set(["nonces", nonce], true)
//   .sum(["enqueued_count"], 1n)
//   .commit();



kv.listenQueue(async (msg: PhaseIsOverMessage) => {
    console.log(`message arrived!! ${msg}`)
  const nonce = await kv.get(["nonces", msg.nonce]);
  console.log(`nonce ${nonce.value}`)
  if (nonce.value === null) {
    // This messaged was already processed
    return;
  }
  const currentPhaseId = await kv.get(["currentPhaseIds", msg.gameId]);
  console.log('phase', currentPhaseId.value, currentPhaseId.key, msg.phaseId)
  if (currentPhaseId.value !== msg.phaseId) {
    // This phase is already over
    return;
  }
  const success = await kv.atomic()
    // Ensure this message was not yet processed
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .commit();

    await initNextPhase(msg)
});

export async function enqueuePhaseEnd(
  gameId: string,
  phaseId: string,
  duration: number,
) {
  const nonce = crypto.randomUUID();
  await kv
    .atomic()
    .check({ key: ["nonces", nonce], versionstamp: null })
    .enqueue({ gameId, phaseId, nonce } as PhaseIsOverMessage, {
      delay: 1e3 * duration,
      backoffSchedule: [60e3, 300e3, 3600e3],
    })
    .set(["nonces", nonce], true)
    .set(["currentPhaseIds", gameId], phaseId)
    .commit();
}
