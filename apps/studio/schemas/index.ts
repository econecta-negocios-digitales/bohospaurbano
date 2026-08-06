import { documents } from "./documents";
import { homeObjects } from "./objects/home";
import { sharedObjects } from "./objects/shared";

export const schemaTypes = [...sharedObjects, ...homeObjects, ...documents];
