
import { FormulationData } from "./types";
import { phenylFormulation } from "./formulations/phenyl";
import { dishWashFormulation } from "./formulations/dishWash";
import { brassCleaningFormulation} from "./formulations/brassCleaner";
import { floorCleaningFormulation } from "./formulations/floorCleaner";
import { toiletCleanerFormulation } from "./formulations/toiletCleaner";
import { acidFormulation } from "./formulations/acid";
import { handWashFormulation } from "./formulations/handWash";
import { roseWaterFormulation } from "./formulations/roseWater";
import { painReliefBalmFormulation} from "./formulations/painReliefBalm";
import { whitePetroleumJellyFormulation } from "./formulations/whitePetroleumJelly";
import { detergentPowderFormulation } from "./formulations/detergentPowder";
import { liquidDetergentFormulation } from "./formulations/liquidDetergent";

export const formulationsData: FormulationData[] = [
  phenylFormulation,
  dishWashFormulation,
  brassCleaningFormulation,
  toiletCleanerFormulation,
  acidFormulation,
  handWashFormulation,
  detergentPowderFormulation,
  liquidDetergentFormulation,
  floorCleaningFormulation,
  roseWaterFormulation,
  painReliefBalmFormulation,
  whitePetroleumJellyFormulation
];
