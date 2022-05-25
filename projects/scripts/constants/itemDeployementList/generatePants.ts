import { SlotCategory, SoldierDeployement } from "../types";

export const generatePants = ():SoldierDeployement[]=>{

    function randomPants(){
        const pants=[{
            slotCategory: "Legs" as SlotCategory,
            fileName: "BasicBlackTrousers",
            traitName: "Basic Trousers",
            zIndex: 11,
            traitDescription:
              "A pair of basic black trousers.\nPOWER: 30",
          },
        {
            slotCategory: "Legs" as SlotCategory,
            fileName: "BasicBrownTrousers",
            traitName: "Basic Trousers",
            zIndex: 11,
            traitDescription:
              "A pair of basic brown trousers.\nPOWER: 30",
          }]
          const randomIndex = Math.floor(2 * Math.random());
          return pants[randomIndex]
    }

    const indexList=[ 41, 5, 15, 43]
    return indexList.map((index)=>{
        return {
            kusamarauderNumber:index,
            items: [
                randomPants()
            ]
         }
    })
}