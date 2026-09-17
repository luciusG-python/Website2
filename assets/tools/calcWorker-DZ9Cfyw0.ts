// Runs the (potentially expensive, exponential) optimal-merge search off the main thread so the
// UI never freezes, no matter how many enchantments are selected. The page posts a request with a
// monotonic id; we post back the result (or error) tagged with the same id so the caller can
// ignore stale responses.
import { calculateOptimalMerge, type CostMode, type DataSet, type EnchantWithLevel } from "./optimalOrderCalc";

interface CalcRequest {
    id: number;
    itemName: string;
    enchants: EnchantWithLevel[];
    dataSet: DataSet;
    mode?: CostMode;
}

self.onmessage = (e: MessageEvent<CalcRequest>) => {
    const { id, itemName, enchants, dataSet, mode } = e.data;
    try {
        const result = calculateOptimalMerge(itemName, enchants, dataSet, mode);
        (self as unknown as Worker).postMessage({ id, result });
    } catch (err) {
        (self as unknown as Worker).postMessage({ id, error: (err as Error).message });
    }
};
