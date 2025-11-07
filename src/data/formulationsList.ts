import { FormulationData } from "./types";
import { phenylFormulation } from "./formulations/phenyl";
import { dishWashFormulation } from "./formulations/dishWashLiquid";
import { brassCleaningFormulation} from "./formulations/brassCleaningLiquid";
import { floorCleaningFormulation } from "./formulations/floorCleaningLiquid";
import { toiletCleanerFormulation } from "./formulations/toiletCleaner";
import { acidFormulation } from "./formulations/acid";
import { handWashFormulation } from "./formulations/handWashLiquid";
import { roseWaterFormulation } from "./formulations/roseWater";
import { painReliefBalmFormulation} from "./formulations/zanduBalm";
import { whitePetroleumJellyFormulation } from "./formulations/vaseline";
import { detergentPowderFormulation } from "./formulations/detergentPowder";
import { liquidDetergentFormulation } from "./formulations/liquidDetergent";

export const formulationsData: FormulationData[] = [
  acidFormulation,
  brassCleaningFormulation,
  detergentPowderFormulation,
  dishWashFormulation,
  floorCleaningFormulation,
  handWashFormulation,
  liquidDetergentFormulation,
  painReliefBalmFormulation,
  phenylFormulation,
  roseWaterFormulation,
  toiletCleanerFormulation,
  whitePetroleumJellyFormulation
];
