import {
  FixedPartProba,
  FixedSet,
  fixedSetProba,
  FixedSetProba,
  TraitProba,
  WS_URL,
} from "./constants";
import fs from "fs";
require("dotenv").config();

export const drawSet = (fixedSetProba: FixedSetProba): FixedSet => {
  return fixedSetProba.map((fixedPartProba: FixedPartProba) => {
    //console.log("fixedPartProba.traits.length", fixedPartProba.traits.length);
    let totalProbaTrait = fixedPartProba.traits
      .map((probaTrait: TraitProba) => {
        return probaTrait.traitProba;
      })
      .reduce((partialSum, a) => partialSum + a, 0);
    //console.log("totalProbaTrait", totalProbaTrait);
    let drawnScore = totalProbaTrait * Math.random(); //Math.floor(Math.random()*fixedPartProba.traits.length)
    //console.log("drawnScore", drawnScore);
    let accScore = 0;
    let drawnIndex = 0;
    for (let i = 0; i < fixedPartProba.traits.length; i++) {
      accScore += fixedPartProba.traits[i].traitProba;
      //console.log("accScore", accScore);
      if (accScore > drawnScore) {
        drawnIndex = i;
        //console.log("drawnIndex", drawnIndex);
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

export const logStats = (drawnSetList: FixedSet[]) => {
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

export const drawSets = (
  fixedSetProba: FixedSetProba,
  numberOfSets: number
): FixedSet[] => {
  const res = [];
  for (let i = 0; i < numberOfSets; i++) {
    let set = drawSet(fixedSetProba);
    console.log("set drawn ", set);
    res.push(set);
  }
  const filteredRes=res.map((set)=>syncHairColor(set))
  logStats(filteredRes);

  let data = JSON.stringify(filteredRes);
  fs.writeFileSync("drawnSets/drawnset1.json", data);
  return filteredRes;
};

export const syncHairColor =(fixedSet:FixedSet): FixedSet => {
  // get color
  let color=""
  fixedSet.forEach((part)=>{
    if (part.traitClass==="Eyebrows"){
      if (part.trait[9]==="b"){
        color="brown"
      } else {
        color="white"
      }
    }
  })
  // replace with right color
  let newSet=[]
  fixedSet.forEach((part)=>{
    if (part.traitClass==="Beards"){
      if (part.trait[0]==="_"){
        newSet.push(part)
      } else {
        let i=part.trait[5]
        newSet.push({
          traitClass: "Beards",
          trait: `Beard${i}${color}`,
          zIndex: 0,
        })
      }
    } else  if (part.traitClass==="Hair"){
      if (part.trait[0]==="_"){
        newSet.push(part)
      } else {
        let i=part.trait[4]
        newSet.push({
          traitClass: "Hair",
          trait: `Hair${i}${color}`,
          zIndex: 0,
        })
      }
    } else {
      newSet.push(part)
    }
  })
  return newSet
};

drawSets(fixedSetProba, 1000);
