import { initNextPhase } from "./calc-results.ts";
import { PhaseIsOverMessage } from "../types/PhaseIsOverMessage.ts";

const kv = await Deno.openKv();

kv.listenQueue(async (msg: PhaseIsOverMessage) => {
  /* Handles phase over timer event */
  console.log(`message arrived!! ${msg}`);
  const nonce = await kv.get(["nonces", msg.nonce]);
  if (nonce.value === null) {
    // This messaged was already processed
    return;
  }
  const currentPhaseId = await kv.get(["currentPhaseIds", msg.gameId]);
  if (currentPhaseId.value !== msg.phaseId) {
    // This phase is already over
    return;
  }
  const success = await kv.atomic()
    // Ensure this message was not yet processed
    .check({ key: nonce.key, versionstamp: nonce.versionstamp })
    .delete(nonce.key)
    .commit();

  await initNextPhase(msg);
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
