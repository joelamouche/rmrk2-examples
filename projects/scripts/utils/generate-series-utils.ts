import {
  FixedPartProba,
  FixedTraitSet,
  fixedSetProba,
  FixedSetProba,
  TraitProba,
  WS_URL,
  NUMBER_OF_SETS,
} from "../constants";
import fs from "fs";
require("dotenv").config();

export const drawSet = (fixedSetProba: FixedSetProba): FixedTraitSet => {
  return fixedSetProba.map((fixedPartProba: FixedPartProba) => {
    let totalProbaTrait = fixedPartProba.traits
      .map((probaTrait: TraitProba) => {
        return probaTrait.traitProba;
      })
      .reduce((partialSum, a) => partialSum + a, 0);
    let drawnScore = totalProbaTrait * Math.random();
    let accScore = 0;
    let drawnIndex = 0;
    for (let i = 0; i < fixedPartProba.traits.length; i++) {
      accScore += fixedPartProba.traits[i].traitProba;
      if (accScore > drawnScore) {
        drawnIndex = i;
        break;
      }
    }
    const { traitName } = fixedPartProba.traits[drawnIndex];
    return {
      traitClass: fixedPartProba.traitClass,
      trait: traitName,
      zIndex: fixedPartProba.zIndex,
    };
  });
};

export const logStats = (drawnSetList: FixedTraitSet[]) => {
  console.log("Stats for ", drawnSetList.length, "sets");
  let obj = {};
  drawnSetList.forEach((set) => {
    set.forEach((trait) => {
      if (obj[trait.traitClass] && obj[trait.traitClass][trait.trait] >= 0) {
        obj[trait.traitClass][trait.trait] += 1;
      } else if (obj[trait.traitClass]) {
        obj[trait.traitClass][trait.trait] = 1;
      } else {
        obj[trait.traitClass] = { [trait.trait]: 1 };
      }
    });
  });
  console.log("obj", obj);
};

export const syncHairColor = (fixedSet: FixedTraitSet): FixedTraitSet => {
  // get color
  let color = "";
  fixedSet.forEach((part) => {
    if (part.traitClass === "Eyebrows") {
      if (part.trait[9] === "b") {
        color = "brown";
      } else {
        color = "white";
      }
    }
  });
  // replace with right color
  let newSet = [];
  fixedSet.forEach((part) => {
    if (part.traitClass === "Beards") {
      if (part.trait[0] === "_") {
        newSet.push(part);
      } else {
        let i = part.trait[5];
        newSet.push({
          traitClass: "Beards",
          trait: `Beard${i}${color}`,
          zIndex: part.zIndex,
        });
      }
    } else if (part.traitClass === "Hair") {
      if (part.trait[0] === "_") {
        newSet.push(part);
      } else {
        let i = part.trait[4];
        newSet.push({
          traitClass: "Hair",
          trait: `Hair${i}${color}`,
          zIndex: part.zIndex,
        });
      }
    } else {
      newSet.push(part);
    }
  });
  return newSet;
};

export const removeDuplicates = (
  fixedSetList: FixedTraitSet[]
): FixedTraitSet[] => {
  let res = [];
  fixedSetList.forEach((setRef, i) => {
    let hasOneDup = false;
    fixedSetList.forEach((setLook, j) => {
      if (j > i && !hasOneDup) {
        const isDup = setRef
          .map((part, i) => {
            return part.trait === setLook[i].trait;
          })
          .reduce((prev, cur) => {
            return prev && cur;
          }, true);
        if (isDup) {
          console.log("FOUND ONE DUPLICATE ", i, j);
          console.log(setRef);
          hasOneDup = true;
        }
      }
    });
    if (!hasOneDup) {
      res.push(setRef);
    }
  });
  return res;
};

export const drawSets = (
  fixedSetProba: FixedSetProba,
  numberOfSets: number
): FixedTraitSet[] => {
  // draw random sets
  const res = [];
  for (let i = 0; i < numberOfSets; i++) {
    let set = drawSet(fixedSetProba);
    console.log("set drawn ", set);
    res.push(set);
  }
  // fix hair color
  const fixedRes = res.map((set) => syncHairColor(set));

  // fix hair color
  const filteredRes = removeDuplicates(fixedRes);

  // log set list stats
  logStats(filteredRes);

  // Save drawn sets
  let data = JSON.stringify(filteredRes);
  fs.writeFileSync(
    `deployements/drawnSets/drawnset-${numberOfSets}-${new Date(
      Date.now()
    ).getDate()}-${new Date(Date.now()).getMonth() + 1}-${new Date(
      Date.now()
    ).getUTCFullYear()}-${new Date(Date.now()).toLocaleTimeString()}.json`,
    data
  );
  return filteredRes;
};

drawSets(fixedSetProba, NUMBER_OF_SETS);
